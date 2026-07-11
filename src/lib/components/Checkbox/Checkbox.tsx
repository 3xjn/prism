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

import type { CheckboxInteractionState } from "./styles";
import {
	resolveCheckboxMotionTransition,
	resolveCheckboxSizeStyles,
	resolveCheckboxVisualStyles,
} from "./styles";
import type { CheckboxProps } from "./types";

type CheckboxComponent = ((props: CheckboxProps) => React.ReactElement) & React.ForwardRefExoticComponent<CheckboxProps>;

const CheckboxBase = React.forwardRef<TextButton, CheckboxProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		styleOverrides,
		color = "primary",
		size = "md",
		disabled = false,
		label,
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
	} = useResolvedStyleProps("checkbox", mergedStyleProps);
	const rootSlotProps = slotProps?.root;
	const sizeStyles = resolveCheckboxSizeStyles(theme, size);

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
	const interactionState: CheckboxInteractionState = press.state;
	const styleOverrideContext = { theme, color, size, state: interactionState, checked: checkedState };
	const visualStyles = applyStyleOverride(
		resolveCheckboxVisualStyles(theme, color, interactionState, checkedState),
		styleOverrides,
		styleOverrideContext,
	);
	const animated = useMotion({
		values: {
			markColor: visualStyles.markColor,
			markStrokeColor: visualStyles.markStrokeColor,
			markStrokeTransparency: visualStyles.markStrokeTransparency,
			fillColor: visualStyles.fillColor,
			fillTransparency: visualStyles.fillTransparency,
			glyphColor: visualStyles.glyphColor,
			glyphTransparency: visualStyles.glyphTransparency,
			labelColor: visualStyles.labelColor,
		},
		transition: resolveCheckboxMotionTransition(interactionState),
	});

	const rootEvent = useRootCursorEvent(
		composeEventMaps(press.eventMap, Event),
		rootSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);

	const shouldRenderLabel = label !== undefined || slotProps?.label !== undefined;
	const resolvedLabelText = label === undefined ? "" : tostring(label);
	const labelSlotProps = slotProps?.label;
	const resolvedLabelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const resolvedLabelTextSize = labelSlotProps?.TextSize ?? sizeStyles.labelSize;
	const resolvedLabelLineHeight = labelSlotProps?.LineHeight ?? sizeStyles.lineHeight;
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedMarkZIndex = slotProps?.mark?.ZIndex ?? resolvedRootZIndex;
	const resolvedFillZIndex = slotProps?.fill?.ZIndex ?? resolvedMarkZIndex;
	const resolvedGlyphZIndex = slotProps?.glyph?.ZIndex ?? resolvedFillZIndex;
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? resolvedRootZIndex;
	const markRadius = new UDim(0.28, 0);
	const glyphAsset = getLucideIconAsset("check", sizeStyles.glyphSize);
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
				BackgroundColor3={animated.markColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(sizeStyles.markWidth, sizeStyles.markHeight)}
				LayoutOrder={1}
				ZIndex={resolvedMarkZIndex}
				Active={false}
				Selectable={false}
				ClipsDescendants={true}
				{...slotProps?.mark}
			>
				{renderCornerDecorator({ radius: markRadius, slotProps: slotProps?.markCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: animated.markStrokeColor,
					transparency: animated.markStrokeTransparency,
					thickness: 1,
					slotProps: slotProps?.markStroke,
				})}
				<frame
					BackgroundColor3={animated.fillColor}
					BackgroundTransparency={animated.fillTransparency}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={resolvedFillZIndex}
					Active={false}
					Selectable={false}
					{...slotProps?.fill}
				>
					{renderCornerDecorator({ radius: markRadius, slotProps: slotProps?.fillCorner })}
				</frame>
				<imagelabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromOffset(sizeStyles.glyphSize, sizeStyles.glyphSize)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={resolvedGlyphZIndex}
					Active={false}
					Selectable={false}
					BackgroundColor3={theme.colors.background.surface}
					Image={glyphAsset?.Url}
					ImageRectSize={glyphAsset?.ImageRectSize}
					ImageRectOffset={glyphAsset?.ImageRectOffset}
					ImageColor3={animated.glyphColor}
					ImageTransparency={glyphAsset !== undefined ? animated.glyphTransparency : 1}
					ScaleType={Enum.ScaleType.Fit}
					{...slotProps?.glyph}
				/>
			</frame>
			{shouldRenderLabel ? (
				<textlabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					AutomaticSize={Enum.AutomaticSize.X}
					Size={UDim2.fromOffset(0, sizeStyles.markHeight)}
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

export const Checkbox = CheckboxBase as CheckboxComponent;

Checkbox.displayName = "Checkbox";
