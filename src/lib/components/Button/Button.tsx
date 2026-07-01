import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme, ThemeSize, Variant } from "@prism/theme";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { resolveMinimumHeightConstraint } from "../_shared/frameSize";
import { composeEventMaps } from "../_shared/interaction";
import { usePressInteraction } from "../_shared/usePressInteraction";
import type { InteractionState } from "../_shared/usePressInteraction";
import {
	mergeSharedStyleProps,
	resolveThemeSizeSafe,
	resolveUDimSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import { mixColor } from "../_shared/visual";

import type { ButtonColor, ButtonProps, ButtonSize } from "./types";

const TextService = game.GetService("TextService");
type ButtonInteractionState = InteractionState;

interface ButtonSizeStyles {
	readonly paddingX: ThemeSize;
	readonly paddingY: ThemeSize;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly radius: UDim;
	readonly minHeight: number;
}

interface ButtonVisualStyles {
	readonly backgroundColor: Color3;
	readonly textColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly scale: number;
	readonly shouldRenderStroke: boolean;
}

const BUTTON_PRESS_SCALE = 0.965;
const BUTTON_AUTO_WIDTH_BUFFER = 2;

function isPrimitiveButtonLabel(value: unknown): value is string | number {
	return typeIs(value, "string") || typeIs(value, "number");
}

function resolveButtonRadius(theme: Theme, size: ButtonSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "button", "sm", "radius", theme.radius.sm));
		case "md":
			return new UDim(0, resolveThemeSizeSafe(theme, "button", "md", "radius", theme.radius.md));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "button", "lg", "radius", theme.radius.lg));
	}
}

function resolveButtonSizeStyles(theme: Theme, size: ButtonSize): ButtonSizeStyles {
	switch (size) {
		case "xs":
			return {
				paddingX: "sm",
				paddingY: "xs",
				fontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				radius: resolveButtonRadius(theme, size),
				minHeight: theme.spacing.sm * 3,
			};
		case "sm":
			return {
				paddingX: "md",
				paddingY: "xs",
				fontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				radius: resolveButtonRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.sm,
			};
		case "lg":
			return {
				paddingX: "xl",
				paddingY: "sm",
				fontSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				radius: resolveButtonRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.lg,
			};
		case "xl":
			return {
				paddingX: "xl",
				paddingY: "md",
				fontSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				radius: resolveButtonRadius(theme, size),
				minHeight: theme.spacing.xl * 2,
			};
		case "md":
		default:
			return {
				paddingX: "lg",
				paddingY: "sm",
				fontSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				radius: resolveButtonRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.md,
			};
	}
}

function resolveButtonContentGap(theme: Theme, size: ButtonSize): number {
	switch (size) {
		case "xs":
		case "sm":
			return theme.spacing.xs;
		case "lg":
		case "xl":
			return theme.spacing.sm;
		case "md":
		default:
			return theme.spacing.sm;
	}
}

function resolveButtonVisualStyles(
	theme: Theme,
	variant: Variant,
	color: ButtonColor,
	state: ButtonInteractionState,
): ButtonVisualStyles {
	const intentColors = theme.colors[color];
	const hoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.45);
	const pressedSurface = mixColor(theme.colors.background.surface, theme.colors.action.pressed, 0.85);
	const hoverIntentLight = mixColor(intentColors.light, intentColors.main, 0.12);
	const pressedIntentLight = mixColor(intentColors.light, intentColors.dark, 0.22);
	const filledHover = mixColor(intentColors.main, intentColors.dark, 0.18);
	const filledPressed = mixColor(intentColors.dark, theme.colors.action.pressed, 0.2);

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			textColor: theme.colors.text.disabled,
			strokeColor: theme.colors.border.default,
			strokeTransparency: variant === "outline" ? 0 : 1,
			scale: 1,
			shouldRenderStroke: variant === "outline",
		};
	}

	switch (variant) {
		case "light":
			return {
				backgroundColor:
					state === "pressed" ? pressedIntentLight : state === "hovered" ? hoverIntentLight : intentColors.light,
				textColor: intentColors.dark,
				strokeColor: intentColors.light,
				strokeTransparency: 1,
				scale: state === "pressed" ? BUTTON_PRESS_SCALE : 1,
				shouldRenderStroke: false,
			};
		case "outline":
			return {
				backgroundColor:
					state === "pressed" ? pressedSurface : state === "hovered" ? hoverSurface : theme.colors.background.surface,
				textColor: intentColors.main,
				strokeColor: state === "pressed" ? intentColors.dark : intentColors.main,
				strokeTransparency: 0,
				scale: state === "pressed" ? BUTTON_PRESS_SCALE : 1,
				shouldRenderStroke: true,
			};
		case "subtle":
			return {
				backgroundColor:
					state === "pressed"
						? mixColor(intentColors.light, theme.colors.action.pressed, 0.3)
						: state === "hovered"
						? mixColor(intentColors.light, theme.colors.background.surface, 0.1)
						: mixColor(intentColors.light, theme.colors.background.default, 0.25),
				textColor: intentColors.main,
				strokeColor: intentColors.light,
				strokeTransparency: 1,
				scale: state === "pressed" ? BUTTON_PRESS_SCALE : 1,
				shouldRenderStroke: false,
			};
		case "filled":
		default:
			return {
				backgroundColor:
					state === "pressed" ? filledPressed : state === "hovered" ? filledHover : intentColors.main,
				textColor: intentColors.contrast,
				strokeColor: intentColors.dark,
				strokeTransparency: 1,
				scale: state === "pressed" ? BUTTON_PRESS_SCALE : 1,
				shouldRenderStroke: false,
			};
	}
}

function resolveButtonMotionTransition(state: ButtonInteractionState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			scale: { duration: "instant", easing: "out" },
		} as const;
	}

	if (state === "pressed") {
		return {
			backgroundColor: { duration: 0.045, easing: "standard" },
			textColor: { duration: 0.045, easing: "standard" },
			strokeColor: { duration: 0.045, easing: "standard" },
			strokeTransparency: { duration: 0.045, easing: "standard" },
			scale: { duration: 0.05, easing: "out" },
		} as const;
	}

	if (state === "hovered") {
		return {
			backgroundColor: { duration: 0.1, easing: "standard" },
			textColor: { duration: 0.1, easing: "standard" },
			strokeColor: { duration: 0.1, easing: "standard" },
			strokeTransparency: { duration: 0.1, easing: "standard" },
			scale: { duration: 0.1, easing: "out" },
		} as const;
	}

	return {
		backgroundColor: { duration: 0.11, easing: "standard" },
		textColor: { duration: 0.11, easing: "standard" },
		strokeColor: { duration: 0.11, easing: "standard" },
		strokeTransparency: { duration: 0.11, easing: "standard" },
		scale: { duration: 0.11, easing: "out" },
	} as const;
}

function resolveConcretePaddingValue(value: UDim | React.Binding<UDim> | undefined, fallback?: UDim): UDim {
	if (typeIs(value, "UDim")) {
		return value;
	}

	return fallback ?? new UDim(0, 0);
}

function resolveConcreteNumberValue(value: number | React.Binding<number> | undefined, fallback: number): number {
	if (typeOf(value) === "number") {
		return value as number;
	}

	return fallback;
}

function resolveMeasurementFont(value: React.InstanceProps<TextButton>["Font"], fallback: Enum.Font): Enum.Font {
	if (typeOf(value) === "EnumItem") {
		return value as Enum.Font;
	}

	return fallback;
}

function resolveAutoAxisLength(contentPixels: number, start: UDim, trailing: UDim, minPixels = 0, maxPixels?: number): number {
	const innerScale = 1 - start.Scale - trailing.Scale;
	const baseLength = innerScale > 0 ? (contentPixels + start.Offset + trailing.Offset) / innerScale : contentPixels + start.Offset + trailing.Offset;
	let resolvedLength = math.max(baseLength, minPixels);

	if (maxPixels !== undefined) {
		resolvedLength = math.min(resolvedLength, maxPixels);
	}

	return math.max(0, math.ceil(resolvedLength));
}

type ButtonComponent = ((props: ButtonProps) => React.ReactElement) & React.ForwardRefExoticComponent<ButtonProps>;

const ButtonBase = React.forwardRef<TextButton, ButtonProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		variant = "filled",
		color = "primary",
		size = "md",
		disabled = false,
		fullWidth = false,
		label,
		children,
		onPress,
		Event,
		Change,
	} = props;
	const press = usePressInteraction({ interactive: !disabled, onActivated: onPress });
	const sizeStyles = resolveButtonSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps(
		{
			cursor: "pointer",
			px: sizeStyles.paddingX,
			py: sizeStyles.paddingY,
		},
		props,
	);
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
	} = useResolvedStyleProps("button", mergedStyleProps);
	const computedWidth = fullWidth ? resolveUDimSafe("button", "100%", "width") : resolvedWidth;
	const visualState: ButtonInteractionState = press.state;
	const resolvedVisualStyles = resolveButtonVisualStyles(theme, variant, color, visualState);
	const motionTransition = resolveButtonMotionTransition(visualState);
	const animated = useMotion({
		values: {
			backgroundColor: resolvedVisualStyles.backgroundColor,
			textColor: resolvedVisualStyles.textColor,
			strokeColor: resolvedVisualStyles.strokeColor,
			strokeTransparency: resolvedVisualStyles.strokeTransparency,
			scale: resolvedVisualStyles.scale,
		},
		transition: motionTransition,
	});

	const computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, sizeStyles.minHeight);
	const rootSlotProps = slotProps?.root;
	const primitiveChildLabel = isPrimitiveButtonLabel(children) ? children : undefined;
	const resolvedLabelContent = label ?? primitiveChildLabel;
	const resolvedLabelText = tostring(resolvedLabelContent ?? "");
	const customChildren =
		children !== undefined && children !== false && !isPrimitiveButtonLabel(children)
			? (children as React.ReactNode)
			: undefined;
	const hasCustomChildren = customChildren !== undefined;
	const hasVisibleLabel = resolvedLabelText.size() > 0;
	const resolvedText = rootSlotProps?.Text ?? resolvedLabelText;
	const measuredText = typeIs(rootSlotProps?.Text, "string") ? rootSlotProps.Text : resolvedLabelText;
	const resolvedFont = rootSlotProps?.Font ?? theme.fontFamily;
	const resolvedFontFace = rootSlotProps?.FontFace ?? Font.fromEnum(theme.fontFamily);
	const resolvedTextSize = rootSlotProps?.TextSize ?? sizeStyles.fontSize;
	const measuredTextSize = resolveConcreteNumberValue(rootSlotProps?.TextSize, sizeStyles.fontSize);
	const resolvedLineHeight = rootSlotProps?.LineHeight ?? sizeStyles.lineHeight;
	const measuredLineHeight = resolveConcreteNumberValue(rootSlotProps?.LineHeight, sizeStyles.lineHeight);
	const resolvedTextWrapped = rootSlotProps?.TextWrapped ?? false;
	const resolvedTextTruncate = rootSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd;
	const resolvedTextXAlignment = rootSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center;
	const resolvedTextYAlignment = rootSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center;
	const resolvedTextScaled = rootSlotProps?.TextScaled ?? false;
	const resolvedRichText = rootSlotProps?.RichText ?? false;
	const resolvedTextColor = rootSlotProps?.TextColor3 ?? animated.textColor;
	const resolvedTextTransparency = rootSlotProps?.TextTransparency ?? 0;
	const resolvedTextStrokeColor = rootSlotProps?.TextStrokeColor3;
	const resolvedTextStrokeTransparency = rootSlotProps?.TextStrokeTransparency;
	const resolvedBackgroundColor = rootSlotProps?.BackgroundColor3 ?? animated.backgroundColor;
	const resolvedBackgroundTransparency = rootSlotProps?.BackgroundTransparency ?? 0;
	const resolvedPaddingTop = resolveConcretePaddingValue(slotProps?.padding?.PaddingTop, paddingTop);
	const resolvedPaddingRight = resolveConcretePaddingValue(slotProps?.padding?.PaddingRight, paddingRight);
	const resolvedPaddingBottom = resolveConcretePaddingValue(slotProps?.padding?.PaddingBottom, paddingBottom);
	const resolvedPaddingLeft = resolveConcretePaddingValue(slotProps?.padding?.PaddingLeft, paddingLeft);
	const measurementFont = resolveMeasurementFont(rootSlotProps?.Font, theme.fontFamily);
	const measuredTextBounds = TextService.GetTextSize(measuredText, measuredTextSize, measurementFont, new Vector2(10000, 10000));
	const measuredTextHeight = math.max(measuredTextBounds.Y, math.ceil(measuredTextSize * measuredLineHeight));
	const customChildWidthAllowance =
		hasCustomChildren
			? math.max(measuredTextSize, theme.spacing.md) + (hasVisibleLabel ? resolveButtonContentGap(theme, size) : 0)
			: 0;
	const measuredTextWidth = math.ceil(measuredTextBounds.X) + BUTTON_AUTO_WIDTH_BUFFER + customChildWidthAllowance;
	const computedAutoWidth = resolveAutoAxisLength(
		measuredTextWidth,
		resolvedPaddingLeft,
		resolvedPaddingRight,
		computedConstraint?.min?.X ?? 0,
		computedConstraint?.max?.X,
	);
	const computedAutoHeight = resolveAutoAxisLength(
		measuredTextHeight,
		resolvedPaddingTop,
		resolvedPaddingBottom,
		computedConstraint?.min?.Y ?? 0,
		computedConstraint?.max?.Y,
	);

	let computedSize: UDim2 | undefined;
	if (resolvedSize !== undefined) {
		computedSize = resolvedSize;
	} else if (computedWidth !== undefined && resolvedHeight !== undefined) {
		computedSize = new UDim2(computedWidth, resolvedHeight);
	} else if (computedWidth !== undefined) {
		computedSize = new UDim2(computedWidth, new UDim(0, computedAutoHeight));
	} else if (resolvedHeight !== undefined) {
		computedSize = new UDim2(new UDim(0, computedAutoWidth), resolvedHeight);
	} else {
		computedSize = UDim2.fromOffset(computedAutoWidth, computedAutoHeight);
	}
	const resolvedZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedLabelZIndex = resolvedZIndex;
	const rootEvent = useRootCursorEvent(
		composeEventMaps(press.eventMap, Event),
		rootSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);

	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint }));

	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const textButtonInstanceProps: Partial<React.InstanceProps<TextButton>> = {
		AutoButtonColor: false,
		Active: !disabled,
		Selectable: !disabled,
		BorderSizePixel: 0,
		BackgroundTransparency: 1,
		BackgroundColor3: resolvedBackgroundColor,
		Size: computedSize,
		AutomaticSize: undefined,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: resolvedZIndex,
		Text: resolvedText,
		TextSize: resolvedTextSize,
		TextColor3: resolvedTextColor,
		TextTransparency: 1,
		TextStrokeTransparency: 1,
		Font: resolvedFont,
		FontFace: resolvedFontFace,
		LineHeight: resolvedLineHeight,
		TextWrapped: resolvedTextWrapped,
		TextTruncate: resolvedTextTruncate,
		TextXAlignment: resolvedTextXAlignment,
		TextYAlignment: resolvedTextYAlignment,
		TextScaled: resolvedTextScaled,
		RichText: resolvedRichText,
		Event: rootEvent,
		Change,
	};

	return (
		<textbutton {...textButtonInstanceProps} {...rootSlotProps} ref={ref}>
			<frame
				BackgroundColor3={resolvedBackgroundColor}
				BackgroundTransparency={resolvedBackgroundTransparency}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Active={false}
				Selectable={false}
				ZIndex={resolvedZIndex}
			>
				<uiscale Scale={animated.scale} {...slotProps?.scale} />
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.corner })}
				{renderStrokeDecorator({
					enabled: resolvedVisualStyles.shouldRenderStroke,
					color: animated.strokeColor,
					transparency: animated.strokeTransparency,
					thickness: 1,
					slotProps: slotProps?.stroke,
				})}
			</frame>
			<frame BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)} Active={false} Selectable={false} ZIndex={resolvedLabelZIndex}>
				{hasCustomChildren ? (
					<frame BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)} Active={false} Selectable={false}>
						{renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding })}
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
							Padding={new UDim(0, resolveButtonContentGap(theme, size))}
						/>
						{customChildren}
						{hasVisibleLabel ? (
							<textlabel
								BackgroundTransparency={1}
								BorderSizePixel={0}
								AutomaticSize={Enum.AutomaticSize.XY}
								Size={UDim2.fromOffset(0, 0)}
								LayoutOrder={100}
								Text={resolvedLabelText}
								TextColor3={resolvedTextColor}
								TextTransparency={resolvedTextTransparency}
								TextStrokeColor3={resolvedTextStrokeColor}
								TextStrokeTransparency={resolvedTextStrokeTransparency}
								TextSize={resolvedTextSize}
								Font={resolvedFont}
								FontFace={resolvedFontFace}
								LineHeight={resolvedLineHeight}
								TextWrapped={false}
								TextTruncate={Enum.TextTruncate.None}
								TextXAlignment={Enum.TextXAlignment.Left}
								TextYAlignment={Enum.TextYAlignment.Center}
								TextScaled={false}
								RichText={resolvedRichText}
								ZIndex={resolvedLabelZIndex}
							/>
						) : undefined}
					</frame>
				) : (
					<React.Fragment>
						{renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding })}
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={UDim2.fromScale(1, 1)}
							Text={resolvedText}
							TextColor3={resolvedTextColor}
							TextTransparency={resolvedTextTransparency}
							TextStrokeColor3={resolvedTextStrokeColor}
							TextStrokeTransparency={resolvedTextStrokeTransparency}
							TextSize={resolvedTextSize}
							Font={resolvedFont}
							FontFace={resolvedFontFace}
							LineHeight={resolvedLineHeight}
							TextWrapped={resolvedTextWrapped}
							TextTruncate={resolvedTextTruncate}
							TextXAlignment={resolvedTextXAlignment}
							TextYAlignment={resolvedTextYAlignment}
							TextScaled={resolvedTextScaled}
							RichText={resolvedRichText}
							ZIndex={resolvedLabelZIndex}
						/>
					</React.Fragment>
				)}
			</frame>
			{decoratorChildren}
		</textbutton>
	);
});

export const Button = ButtonBase as ButtonComponent;

Button.displayName = "Button";
