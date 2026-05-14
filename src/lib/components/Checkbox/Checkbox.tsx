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
import { composeEventMaps, isPressInput } from "../_shared/interaction";
import { resolveTextFontFace } from "../_shared/textFont";
import {
	mergeSharedStyleProps,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import { mixColor } from "../_shared/visual";

import type { CheckboxColor, CheckboxProps, CheckboxSize } from "./types";

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type CheckboxInteractionState = "idle" | "hovered" | "pressed" | "disabled";

interface CheckboxSizeStyles {
	readonly markWidth: number;
	readonly markHeight: number;
	readonly glyphSize: number;
	readonly labelGap: number;
	readonly labelSize: number;
	readonly lineHeight: number;
	readonly minHeight: number;
}

interface CheckboxVisualStyles {
	readonly markColor: Color3;
	readonly markStrokeColor: Color3;
	readonly markStrokeTransparency: number;
	readonly fillColor: Color3;
	readonly fillTransparency: number;
	readonly glyphColor: Color3;
	readonly glyphTransparency: number;
	readonly labelColor: Color3;
}

function resolveCheckboxSizeStyles(theme: Theme, size: CheckboxSize): CheckboxSizeStyles {
	switch (size) {
		case "xs":
			return {
				markWidth: 14,
				markHeight: 14,
				glyphSize: 9,
				labelGap: theme.spacing.xs,
				labelSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				minHeight: 20,
			};
		case "sm":
			return {
				markWidth: 16,
				markHeight: 16,
				glyphSize: 10,
				labelGap: theme.spacing.xs,
				labelSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				minHeight: 22,
			};
		case "lg":
			return {
				markWidth: 20,
				markHeight: 20,
				glyphSize: 13,
				labelGap: theme.spacing.sm,
				labelSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				minHeight: 28,
			};
		case "xl":
			return {
				markWidth: 22,
				markHeight: 22,
				glyphSize: 15,
				labelGap: theme.spacing.md,
				labelSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				minHeight: 32,
			};
		case "md":
		default:
			return {
				markWidth: 18,
				markHeight: 18,
				glyphSize: 12,
				labelGap: theme.spacing.sm,
				labelSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				minHeight: 24,
			};
	}
}

function resolveCheckboxVisualStyles(
	theme: Theme,
	color: CheckboxColor,
	state: CheckboxInteractionState,
	checked: boolean,
): CheckboxVisualStyles {
	const intentColors = theme.colors[color];
	const idleMark = mixColor(theme.colors.background.surface, theme.colors.border.default, 0.18);
	const hoverMark = mixColor(idleMark, theme.colors.action.hover, 0.65);
	const pressedMark = mixColor(idleMark, theme.colors.action.pressed, 0.85);
	const uncheckedStroke = theme.colors.border.default;
	const uncheckedInteractiveStroke = mixColor(theme.colors.border.strong, theme.colors.background.surface, 0.12);
	const checkedStroke = mixColor(intentColors.dark, theme.colors.background.surface, 0.24);
	const checkedFill = mixColor(intentColors.main, theme.colors.background.surface, 0.04);
	const checkedHoverFill = mixColor(intentColors.main, intentColors.dark, 0.14);
	const checkedPressedFill = mixColor(intentColors.dark, theme.colors.action.pressed, 0.14);

	if (state === "disabled") {
		return {
			markColor: theme.colors.action.disabledBackground,
			markStrokeColor: checked ? intentColors.light : theme.colors.border.subtle,
			markStrokeTransparency: checked ? 0.26 : 0.16,
			fillColor: checked ? mixColor(theme.colors.action.disabledBackground, intentColors.light, 0.28) : theme.colors.action.disabledBackground,
			fillTransparency: checked ? 0 : 1,
			glyphColor: theme.colors.text.disabled,
			glyphTransparency: checked ? 0.08 : 1,
			labelColor: theme.colors.text.disabled,
		};
	}

	return {
		markColor: checked ? checkedFill : state === "pressed" ? pressedMark : state === "hovered" ? hoverMark : idleMark,
		markStrokeColor: checked ? checkedStroke : state === "hovered" || state === "pressed" ? uncheckedInteractiveStroke : uncheckedStroke,
		markStrokeTransparency: checked ? (state === "pressed" ? 0.08 : 0.14) : state === "hovered" ? 0.06 : 0.12,
		fillColor: checked
			? state === "pressed"
				? checkedPressedFill
				: state === "hovered"
				? checkedHoverFill
				: checkedFill
			: intentColors.main,
		fillTransparency: checked ? 0 : 1,
		glyphColor: checked ? theme.colors.text.inverse : intentColors.main,
		glyphTransparency: checked ? 0 : 1,
		labelColor: theme.colors.text.primary,
	};
}

function resolveCheckboxMotionTransition(state: CheckboxInteractionState) {
	if (state === "disabled") {
		return {
			markColor: { duration: "instant", easing: "standard" },
			markStrokeColor: { duration: "instant", easing: "standard" },
			markStrokeTransparency: { duration: "instant", easing: "standard" },
			fillColor: { duration: "instant", easing: "standard" },
			fillTransparency: { duration: "instant", easing: "standard" },
			glyphColor: { duration: "instant", easing: "standard" },
			glyphTransparency: { duration: "instant", easing: "standard" },
			labelColor: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "pressed") {
		return {
			markColor: { duration: 0.06, easing: "standard" },
			markStrokeColor: { duration: 0.06, easing: "standard" },
			markStrokeTransparency: { duration: 0.06, easing: "standard" },
			fillColor: { duration: 0.06, easing: "standard" },
			fillTransparency: { duration: 0.06, easing: "standard" },
			glyphColor: { duration: 0.06, easing: "standard" },
			glyphTransparency: { duration: 0.06, easing: "standard" },
			labelColor: { duration: 0.06, easing: "standard" },
		} as const;
	}

	return {
		markColor: { duration: 0.14, easing: "standard" },
		markStrokeColor: { duration: 0.14, easing: "standard" },
		markStrokeTransparency: { duration: 0.14, easing: "standard" },
		fillColor: { duration: 0.14, easing: "standard" },
		fillTransparency: { duration: 0.12, easing: "standard" },
		glyphColor: { duration: 0.14, easing: "standard" },
		glyphTransparency: { duration: 0.1, easing: "standard" },
		labelColor: { duration: 0.14, easing: "standard" },
	} as const;
}

type CheckboxComponent = ((props: CheckboxProps) => React.ReactElement) & React.ForwardRefExoticComponent<CheckboxProps>;

const CheckboxBase = React.forwardRef<TextButton, CheckboxProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
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
	} = useResolvedStyleProps("checkbox", mergedStyleProps);
	const rootSlotProps = slotProps?.root;
	const checkedState = checked ?? uncontrolledChecked;
	const sizeStyles = resolveCheckboxSizeStyles(theme, size);

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

	const interactionState: CheckboxInteractionState = disabled ? "disabled" : pressed ? "pressed" : hovered ? "hovered" : "idle";
	const visualStyles = resolveCheckboxVisualStyles(theme, color, interactionState, checkedState);
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
			if (disabled || !isPressInput(input)) {
				return;
			}

			setPressed(true);
		},
		InputEnded: (_button, input) => {
			if (!isPressInput(input)) {
				return;
			}

			setPressed(false);
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

export const Checkbox = CheckboxBase as CheckboxComponent;

Checkbox.displayName = "Checkbox";
