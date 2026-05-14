import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import { getLucideIconAsset } from "../../icons/lucide";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { composeEventMaps } from "../_shared/interaction";
import { resolveTextFontFace } from "../_shared/textFont";
import {
	mergeSharedStyleProps,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import { mixColor } from "../_shared/visual";

import type { SwitchColor, SwitchIcons, SwitchProps, SwitchSize } from "./types";

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type SwitchInteractionState = "idle" | "hovered" | "pressed" | "disabled";

interface SwitchSizeStyles {
	readonly trackWidth: number;
	readonly trackHeight: number;
	readonly thumbDiameter: number;
	readonly thumbInset: number;
	readonly iconSize: number;
	readonly labelGap: number;
	readonly labelSize: number;
	readonly lineHeight: number;
	readonly minHeight: number;
}

interface SwitchVisualStyles {
	readonly trackColor: Color3;
	readonly trackStrokeColor: Color3;
	readonly trackStrokeTransparency: number;
	readonly thumbColor: Color3;
	readonly thumbOffset: number;
	readonly iconColor: Color3;
	readonly iconTransparency: number;
	readonly labelColor: Color3;
}

function resolveSwitchSizeStyles(theme: Theme, size: SwitchSize): SwitchSizeStyles {
	switch (size) {
		case "xs":
			return {
				trackWidth: 28,
				trackHeight: 16,
				thumbDiameter: 10,
				thumbInset: 3,
				iconSize: 6,
				labelGap: theme.spacing.xs,
				labelSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				minHeight: 20,
			};
		case "sm":
			return {
				trackWidth: 32,
				trackHeight: 18,
				thumbDiameter: 12,
				thumbInset: 3,
				iconSize: 7,
				labelGap: theme.spacing.xs,
				labelSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				minHeight: 22,
			};
		case "lg":
			return {
				trackWidth: 44,
				trackHeight: 24,
				thumbDiameter: 18,
				thumbInset: 3,
				iconSize: 10,
				labelGap: theme.spacing.sm,
				labelSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				minHeight: 28,
			};
		case "xl":
			return {
				trackWidth: 50,
				trackHeight: 28,
				thumbDiameter: 20,
				thumbInset: 4,
				iconSize: 12,
				labelGap: theme.spacing.md,
				labelSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				minHeight: 32,
			};
		case "md":
		default:
			return {
				trackWidth: 38,
				trackHeight: 20,
				thumbDiameter: 14,
				thumbInset: 3,
				iconSize: 8,
				labelGap: theme.spacing.sm,
				labelSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				minHeight: 24,
			};
	}
}

function resolveThumbOffset(sizeStyles: SwitchSizeStyles, checked: boolean): number {
	return checked
		? sizeStyles.trackWidth - sizeStyles.thumbDiameter - sizeStyles.thumbInset
		: sizeStyles.thumbInset;
}

function resolveSwitchIconName(icons: SwitchIcons | undefined, checked: boolean, hovered: boolean): string | undefined {
	if (icons === undefined) {
		return undefined;
	}

	if (checked) {
		return hovered ? icons.hover?.checked ?? icons.checked : icons.checked;
	}

	return hovered ? icons.hover?.unchecked ?? icons.unchecked : icons.unchecked;
}

function resolveSwitchVisualStyles(
	theme: Theme,
	color: SwitchColor,
	state: SwitchInteractionState,
	checked: boolean,
	sizeStyles: SwitchSizeStyles,
): SwitchVisualStyles {
	const intentColors = theme.colors[color];
	const uncheckedTrack = mixColor(theme.colors.background.surface, theme.colors.border.default, 0.35);
	const uncheckedHoverTrack = mixColor(uncheckedTrack, theme.colors.action.hover, 0.65);
	const uncheckedPressedTrack = mixColor(uncheckedTrack, theme.colors.action.pressed, 0.8);
	const checkedTrack = mixColor(intentColors.main, theme.colors.background.surface, 0.04);
	const checkedHoverTrack = mixColor(intentColors.main, intentColors.dark, 0.18);
	const checkedPressedTrack = mixColor(intentColors.dark, theme.colors.action.pressed, 0.16);
	const thumbSurface = theme.colors.background.surface;
	const thumbPressed = mixColor(thumbSurface, theme.colors.action.pressed, 0.22);
	const thumbDisabled = mixColor(thumbSurface, theme.colors.action.disabledBackground, 0.38);
	const uncheckedIconColor = theme.colors.text.secondary;
	const uncheckedInteractiveIconColor = theme.colors.text.primary;
	const checkedIconColor = intentColors.main;
	const checkedInteractiveIconColor = intentColors.dark;

	if (state === "disabled") {
		return {
			trackColor: checked
				? mixColor(theme.colors.action.disabledBackground, intentColors.light, 0.24)
				: theme.colors.action.disabledBackground,
			trackStrokeColor: checked ? intentColors.light : theme.colors.border.subtle,
			trackStrokeTransparency: checked ? 0.2 : 0.12,
			thumbColor: thumbDisabled,
			thumbOffset: resolveThumbOffset(sizeStyles, checked),
			iconColor: theme.colors.text.disabled,
			iconTransparency: 0,
			labelColor: theme.colors.text.disabled,
		};
	}

	return {
		trackColor: checked
			? state === "pressed"
				? checkedPressedTrack
				: state === "hovered"
				? checkedHoverTrack
				: checkedTrack
			: state === "pressed"
			? uncheckedPressedTrack
			: state === "hovered"
			? uncheckedHoverTrack
			: uncheckedTrack,
		trackStrokeColor: checked ? intentColors.dark : theme.colors.border.default,
		trackStrokeTransparency: checked ? (state === "pressed" ? 0.06 : 0.1) : state === "hovered" ? 0.04 : 0.08,
		thumbColor: state === "pressed" ? thumbPressed : thumbSurface,
		thumbOffset: resolveThumbOffset(sizeStyles, checked),
		iconColor: checked
			? state === "hovered" || state === "pressed"
				? checkedInteractiveIconColor
				: checkedIconColor
			: state === "hovered" || state === "pressed"
			? uncheckedInteractiveIconColor
			: uncheckedIconColor,
		iconTransparency: 0,
		labelColor: theme.colors.text.primary,
	};
}

function resolveSwitchMotionTransition(state: SwitchInteractionState) {
	if (state === "disabled") {
		return {
			trackColor: { duration: "instant", easing: "standard" },
			trackStrokeColor: { duration: "instant", easing: "standard" },
			trackStrokeTransparency: { duration: "instant", easing: "standard" },
			thumbColor: { duration: "instant", easing: "standard" },
			thumbOffset: { duration: "instant", easing: "out" },
			iconColor: { duration: "instant", easing: "standard" },
			iconTransparency: { duration: "instant", easing: "standard" },
			labelColor: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "pressed") {
		return {
			trackColor: { duration: 0.06, easing: "standard" },
			trackStrokeColor: { duration: 0.06, easing: "standard" },
			trackStrokeTransparency: { duration: 0.06, easing: "standard" },
			thumbColor: { duration: 0.06, easing: "standard" },
			thumbOffset: { duration: 0.08, easing: "out" },
			iconColor: { duration: 0.06, easing: "standard" },
			iconTransparency: { duration: 0.06, easing: "standard" },
			labelColor: { duration: 0.06, easing: "standard" },
		} as const;
	}

	if (state === "hovered") {
		return {
			trackColor: { duration: 0.12, easing: "standard" },
			trackStrokeColor: { duration: 0.12, easing: "standard" },
			trackStrokeTransparency: { duration: 0.12, easing: "standard" },
			thumbColor: { duration: 0.12, easing: "standard" },
			thumbOffset: { duration: 0.14, easing: "out" },
			iconColor: { duration: 0.12, easing: "standard" },
			iconTransparency: { duration: 0.12, easing: "standard" },
			labelColor: { duration: 0.12, easing: "standard" },
		} as const;
	}

	return {
		trackColor: { duration: 0.14, easing: "standard" },
		trackStrokeColor: { duration: 0.14, easing: "standard" },
		trackStrokeTransparency: { duration: 0.14, easing: "standard" },
		thumbColor: { duration: 0.14, easing: "standard" },
		thumbOffset: { duration: 0.14, easing: "out" },
		iconColor: { duration: 0.14, easing: "standard" },
		iconTransparency: { duration: 0.14, easing: "standard" },
		labelColor: { duration: 0.14, easing: "standard" },
	} as const;
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
		checked,
		defaultChecked,
		onChange,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const [pressed, setPressed] = React.useState(false);
	const [uncontrolledChecked, setUncontrolledChecked] = React.useState(checked ?? defaultChecked ?? false);
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
	const checkedState = checked ?? uncontrolledChecked;
	const sizeStyles = resolveSwitchSizeStyles(theme, size);

	React.useEffect(() => {
		if (checked !== undefined) {
			setUncontrolledChecked(checked);
		}
	}, [checked]);

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHovered(false);
		setPressed(false);
	}, [disabled]);

	const computedConstraint =
		resolvedConstraint === undefined
			? {
				min: new Vector2(0, sizeStyles.minHeight),
				max: undefined,
			  }
			: {
				min:
					resolvedConstraint.min === undefined
						? new Vector2(0, sizeStyles.minHeight)
						: new Vector2(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, sizeStyles.minHeight)),
				max: resolvedConstraint.max,
			  };

		let computedSize: UDim2 | undefined;
		let computedAutoSize: Enum.AutomaticSize | undefined;
		if (resolvedSize !== undefined) {
			computedSize = resolvedSize;
		} else if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
			computedSize = new UDim2(resolvedWidth, resolvedHeight);
		} else if (resolvedWidth !== undefined) {
			computedSize = new UDim2(resolvedWidth, new UDim(0, 0));
			computedAutoSize = Enum.AutomaticSize.Y;
		} else if (resolvedHeight !== undefined) {
			computedSize = new UDim2(new UDim(0, 0), resolvedHeight);
			computedAutoSize = Enum.AutomaticSize.X;
		} else {
			computedAutoSize = Enum.AutomaticSize.XY;
		}

	const interactionState: SwitchInteractionState = disabled ? "disabled" : pressed ? "pressed" : hovered ? "hovered" : "idle";
	const hoverActive = hovered && !disabled;
	const resolvedIconName = resolveSwitchIconName(icons, checkedState, hoverActive);
	const resolvedIconAsset = resolvedIconName === undefined ? undefined : getLucideIconAsset(resolvedIconName, sizeStyles.iconSize);
	const resolvedVisualStyles = resolveSwitchVisualStyles(theme, color, interactionState, checkedState, sizeStyles);
	const motionTransition = resolveSwitchMotionTransition(interactionState);
	const animated = useMotion({
		values: {
			trackColor: resolvedVisualStyles.trackColor,
			trackStrokeColor: resolvedVisualStyles.trackStrokeColor,
			trackStrokeTransparency: resolvedVisualStyles.trackStrokeTransparency,
			thumbColor: resolvedVisualStyles.thumbColor,
			thumbOffset: resolvedVisualStyles.thumbOffset,
			iconColor: resolvedVisualStyles.iconColor,
			iconTransparency: resolvedVisualStyles.iconTransparency,
			labelColor: resolvedVisualStyles.labelColor,
		},
		transition: motionTransition,
	});

	const toggle = () => {
		if (disabled) {
			return;
		}

		const nextChecked = !checkedState;
		if (checked === undefined) {
			setUncontrolledChecked(nextChecked);
		}

		onChange?.(nextChecked);
	};

	const internalEvent: TextButtonEventMap = {
		MouseEnter: () => {
			if (disabled) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			setHovered(false);
			setPressed(false);
		},
		InputBegan: (_button, input) => {
			if (disabled) {
				return;
			}

			if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) {
				setPressed(true);
			}
		},
		InputEnded: (_button, input) => {
			if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) {
				setPressed(false);
			}
		},
		Activated: () => {
			toggle();
		},
	};
	const rootEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, Event),
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
		Selectable: !disabled,
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
