import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { resolveMinimumHeightConstraint } from "../_shared/frameSize";
import { composeEventMaps } from "../_shared/interaction";
import { resolveSelectionProps } from "../_shared/selection";
import { applyStyleOverride } from "../_shared/styleOverride";
import { usePressInteraction } from "../_shared/usePressInteraction";
import { mergeSharedStyleProps, resolveUDimSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import {
	resolveButtonContentGap,
	resolveButtonMotionTransition,
	resolveButtonSizeStyles,
	resolveButtonVisualStyles,
	type ButtonInteractionState,
} from "./styles";
import type { ButtonProps } from "./types";

const TextService = game.GetService("TextService");

const BUTTON_AUTO_WIDTH_BUFFER = 2;

function isPrimitiveButtonLabel(value: unknown): value is string | number {
	return typeIs(value, "string") || typeIs(value, "number");
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
		styleOverrides,
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
	const styleOverrideContext = { theme, variant, color, size, state: visualState };
	const resolvedVisualStyles = applyStyleOverride(
		resolveButtonVisualStyles(theme, variant, color, visualState),
		styleOverrides,
		styleOverrideContext,
	);
	const motionTransition = resolveButtonMotionTransition(visualState);
	const animated = useMotion({
		values: {
			backgroundColor: resolvedVisualStyles.backgroundColor,
			backgroundTransparency: resolvedVisualStyles.backgroundTransparency,
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
	const resolvedBackgroundTransparency = rootSlotProps?.BackgroundTransparency ?? animated.backgroundTransparency;
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
		...resolveSelectionProps(props, !disabled),
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
