import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";

import { getLucideIconAsset } from "../../icons/lucide";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { resolveFrameSizeProps, resolveMinimumHeightConstraint } from "../_shared/frameSize";
import { composeEventMaps } from "../_shared/interaction";
import { resolveSelectionProps } from "../_shared/selection";
import { applyStyleOverride } from "../_shared/styleOverride";
import { resolveTextFontFace } from "../_shared/textFont";
import { useControllableState } from "../_shared/useControllableState";
import { usePressInteraction } from "../_shared/usePressInteraction";
import {
	mergeSharedStyleProps,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { SwitchInteractionState } from "./styles";
import { resolveSwitchMotionTransition, resolveSwitchSizeStyles, resolveSwitchVisualStyles } from "./styles";
import type { SwitchIcons, SwitchProps } from "./types";

function resolveSwitchIconName(icons: SwitchIcons | undefined, checked: boolean, hovered: boolean): string | undefined {
	if (icons === undefined) {
		return undefined;
	}

	if (checked) {
		return hovered ? icons.hover?.checked ?? icons.checked : icons.checked;
	}

	return hovered ? icons.hover?.unchecked ?? icons.unchecked : icons.unchecked;
}

type SwitchComponent = ((props: SwitchProps) => React.ReactElement) & React.ForwardRefExoticComponent<SwitchProps>;

const SwitchBase = React.forwardRef<TextButton, SwitchProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		color = "primary",
		size = "md",
		disabled = false,
		label,
		icons,
		styleOverrides,
		checked,
		defaultChecked,
		onChange,
		Event,
		Change,
	} = props;
	const [checkedState, setCheckedState] = useControllableState({
		controlled: checked,
		defaultValue: defaultChecked ?? false,
		onChange,
	});
	const mergedStyleProps = mergeSharedStyleProps({ cursor: "pointer" }, props);
	const {
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hasPadding,
	} = useResolvedStyleProps("switch", mergedStyleProps);
	const rootSlotProps = slotProps?.root;
	const sizeStyles = resolveSwitchSizeStyles(theme, size);

	const computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, sizeStyles.minHeight);
	const { size: computedSize, automaticSize: computedAutoSize } = resolveFrameSizeProps(
		resolvedSize,
		resolvedWidth,
		resolvedHeight,
	);

	const toggle = () => {
		setCheckedState(!checkedState);
	};

	const press = usePressInteraction({ interactive: !disabled, onActivated: toggle });
	const interactionState: SwitchInteractionState = press.state;
	const hoverActive = press.hovered;
	const resolvedIconName = resolveSwitchIconName(icons, checkedState, hoverActive);
	const resolvedIconAsset = resolvedIconName === undefined ? undefined : getLucideIconAsset(resolvedIconName, sizeStyles.iconSize);
	const styleOverrideContext = { theme, color, size, state: interactionState, checked: checkedState };
	const resolvedVisualStyles = applyStyleOverride(
		resolveSwitchVisualStyles(theme, color, interactionState, checkedState, sizeStyles),
		styleOverrides,
		styleOverrideContext,
	);
	const motionTransition = resolveSwitchMotionTransition(interactionState);
	const animated = useMotion({
		values: {
			trackColor: resolvedVisualStyles.trackColor,
			trackStrokeColor: resolvedVisualStyles.trackStrokeColor,
			trackStrokeTransparency: resolvedVisualStyles.trackStrokeTransparency,
			thumbColor: resolvedVisualStyles.thumbColor,
			thumbStrokeColor: resolvedVisualStyles.thumbStrokeColor,
			thumbStrokeTransparency: resolvedVisualStyles.thumbStrokeTransparency,
			thumbOffset: resolvedVisualStyles.thumbOffset,
			iconColor: resolvedVisualStyles.iconColor,
			iconTransparency: resolvedVisualStyles.iconTransparency,
			labelColor: resolvedVisualStyles.labelColor,
		},
		transition: motionTransition,
	});

	const rootEvent = useRootCursorEvent(
		composeEventMaps(press.eventMap, Event),
		rootSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);

	const shouldRenderLabel = label !== undefined || slotProps?.label !== undefined;
	const resolvedLabelText = label === undefined ? "" : tostring(label);
	const iconSlotProps = slotProps?.icon;
	const shouldRenderIcon = resolvedIconAsset !== undefined || iconSlotProps !== undefined;
	const iconHasImageOverride = iconSlotProps?.Image !== undefined;
	const labelSlotProps = slotProps?.label;
	const resolvedLabelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const resolvedLabelTextSize = labelSlotProps?.TextSize ?? sizeStyles.labelSize;
	const resolvedLabelLineHeight = labelSlotProps?.LineHeight ?? sizeStyles.lineHeight;
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedTrackZIndex = slotProps?.track?.ZIndex ?? resolvedRootZIndex;
	const resolvedThumbZIndex = slotProps?.thumb?.ZIndex ?? resolvedTrackZIndex;
	const resolvedIconZIndex = iconSlotProps?.ZIndex ?? resolvedThumbZIndex;
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? resolvedRootZIndex;
	const trackRadius = new UDim(0.5, 0);
	const thumbRadius = new UDim(0.5, 0);
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding }),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint }));

	decoratorChildren.push(
		<uilistlayout
			key="list-layout"
			FillDirection={Enum.FillDirection.Horizontal}
			Padding={new UDim(0, shouldRenderLabel ? sizeStyles.labelGap : 0)}
			SortOrder={Enum.SortOrder.LayoutOrder}
			VerticalAlignment={Enum.VerticalAlignment.Center}
			HorizontalAlignment={Enum.HorizontalAlignment.Left}
			{...slotProps?.listLayout}
		/>,
	);

	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const textButtonInstanceProps: Partial<React.InstanceProps<TextButton>> = {
		AutoButtonColor: false,
		Active: !disabled,
		...resolveSelectionProps(props, !disabled),
		BorderSizePixel: 0,
		BackgroundTransparency: 1,
		Text: "",
		TextTransparency: 1,
		TextStrokeTransparency: 1,
		Size: computedSize,
		AutomaticSize: computedAutoSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: resolvedRootZIndex,
		Event: rootEvent,
		Change,
	};

	return (
		<textbutton {...textButtonInstanceProps} {...rootSlotProps} ref={ref}>
			{decoratorChildren}
			<frame
				BackgroundColor3={animated.trackColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				AutomaticSize={Enum.AutomaticSize.None}
				Size={UDim2.fromOffset(sizeStyles.trackWidth, sizeStyles.trackHeight)}
				LayoutOrder={1}
				ZIndex={resolvedTrackZIndex}
				Active={false}
				Selectable={false}
				{...slotProps?.track}
			>
				{renderCornerDecorator({ radius: trackRadius, slotProps: slotProps?.trackCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: animated.trackStrokeColor,
					transparency: animated.trackStrokeTransparency,
					thickness: 1,
					slotProps: slotProps?.trackStroke,
				})}
				<frame
					BackgroundColor3={animated.thumbColor}
					BackgroundTransparency={0}
					BorderSizePixel={0}
					Size={UDim2.fromOffset(sizeStyles.thumbDiameter, sizeStyles.thumbDiameter)}
					Position={new UDim2(0, animated.thumbOffset, 0.5, 0)}
					AnchorPoint={new Vector2(0, 0.5)}
					ZIndex={resolvedThumbZIndex}
					Active={false}
					Selectable={false}
					{...slotProps?.thumb}
				>
					{renderCornerDecorator({ radius: thumbRadius, slotProps: slotProps?.thumbCorner })}
					{renderStrokeDecorator({
						enabled: true,
						color: animated.thumbStrokeColor,
						transparency: animated.thumbStrokeTransparency,
						thickness: 1,
					})}
					{shouldRenderIcon ? (
						<imagelabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={UDim2.fromOffset(sizeStyles.iconSize, sizeStyles.iconSize)}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							ZIndex={resolvedIconZIndex}
							Active={false}
							Selectable={false}
							BackgroundColor3={theme.colors.background.surface}
							Image={resolvedIconAsset?.Url}
							ImageRectSize={resolvedIconAsset?.ImageRectSize}
							ImageRectOffset={resolvedIconAsset?.ImageRectOffset}
							ImageColor3={animated.iconColor}
							ImageTransparency={resolvedIconAsset !== undefined || iconHasImageOverride ? animated.iconTransparency : 1}
							ScaleType={Enum.ScaleType.Fit}
							{...iconSlotProps}
						/>
					) : undefined}
				</frame>
			</frame>
			{shouldRenderLabel ? (
				<textlabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					AutomaticSize={Enum.AutomaticSize.XY}
					Size={UDim2.fromOffset(0, 0)}
					LayoutOrder={2}
					Text={resolvedLabelText}
					TextColor3={animated.labelColor}
					TextTransparency={0}
					TextStrokeTransparency={1}
					TextSize={resolvedLabelTextSize}
					Font={resolvedLabelFont}
					FontFace={resolvedLabelFontFace}
					LineHeight={resolvedLabelLineHeight}
					TextWrapped={labelSlotProps?.TextWrapped ?? false}
					TextTruncate={labelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
					TextXAlignment={labelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left}
					TextYAlignment={labelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
					TextScaled={labelSlotProps?.TextScaled ?? false}
					RichText={labelSlotProps?.RichText ?? false}
					ZIndex={resolvedLabelZIndex}
					{...labelSlotProps}
				/>
			) : undefined}
		</textbutton>
	);
});

export const Switch = SwitchBase as SwitchComponent;

Switch.displayName = "Switch";
