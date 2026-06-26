import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme, ThemeSize } from "@prism/theme";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { resolveMinimumHeightConstraint } from "../_shared/frameSize";
import { composeEventMaps } from "../_shared/interaction";
import { resolveTextFontFace } from "../_shared/textFont";
import {
	mergeSharedStyleProps,
	resolveThemeSizeSafe,
	resolveUDimSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { resolveInputMotionTransition, resolveInputVisualStyles } from "./styles";
import type { InputInteractionState } from "./styles";
import type { InputColor, InputProps, InputSize } from "./types";

type TextBoxEventMap = React.InstanceProps<TextBox>["Event"];
type TextBoxChangeMap = React.InstanceProps<TextBox>["Change"];
type FrameEventMap = React.InstanceProps<Frame>["Event"];

interface InputSizeStyles {
	readonly paddingX: ThemeSize;
	readonly paddingY: ThemeSize;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly radius: UDim;
	readonly minHeight: number;
	readonly defaultWidth: number;
}

function resolveInputRadius(theme: Theme, size: InputSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "input", "sm", "radius", theme.radius.sm));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "input", "lg", "radius", theme.radius.lg));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "input", "md", "radius", theme.radius.md));
	}
}

function resolveInputSizeStyles(theme: Theme, size: InputSize): InputSizeStyles {
	switch (size) {
		case "xs":
			return {
				paddingX: "sm",
				paddingY: "xs",
				fontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				radius: resolveInputRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.xs,
				defaultWidth: theme.spacing.xl * 7,
			};
		case "sm":
			return {
				paddingX: "md",
				paddingY: "xs",
				fontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				radius: resolveInputRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.sm,
				defaultWidth: theme.spacing.xl * 8,
			};
		case "lg":
			return {
				paddingX: "lg",
				paddingY: "sm",
				fontSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				radius: resolveInputRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.lg,
				defaultWidth: theme.spacing.xl * 11,
			};
		case "xl":
			return {
				paddingX: "xl",
				paddingY: "md",
				fontSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				radius: resolveInputRadius(theme, size),
				minHeight: theme.spacing.xl * 2,
				defaultWidth: theme.spacing.xl * 13,
			};
		case "md":
		default:
			return {
				paddingX: "md",
				paddingY: "sm",
				fontSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				radius: resolveInputRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.md,
				defaultWidth: theme.spacing.xl * 10,
			};
	}
}

type InputComponent = ((props: InputProps) => React.ReactElement) & React.ForwardRefExoticComponent<InputProps>;

const InputBase = React.forwardRef<TextBox, InputProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		variant = "outline",
		color = "primary",
		size = "md",
		disabled = false,
		readOnly = false,
		fullWidth = false,
		placeholder,
		value,
		defaultValue,
		onChange,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const [focused, setFocused] = React.useState(false);
	const [uncontrolledValue, setUncontrolledValue] = React.useState(value ?? defaultValue ?? "");
	const sizeStyles = resolveInputSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps(
		{
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
	} = useResolvedStyleProps("input", mergedStyleProps);

	React.useEffect(() => {
		if (value !== undefined) {
			setUncontrolledValue(value);
		}
	}, [value]);

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHovered(false);
		setFocused(false);
	}, [disabled]);

	const computedWidth = fullWidth
		? resolveUDimSafe("input", "100%", "width")
		: (resolvedWidth ?? new UDim(0, sizeStyles.defaultWidth));
	const computedHeight = resolvedHeight ?? new UDim(0, sizeStyles.minHeight);
	const computedSize = resolvedSize ?? new UDim2(computedWidth, computedHeight);
	const computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, sizeStyles.minHeight);
	const interactionState: InputInteractionState = disabled
		? "disabled"
		: focused
			? "focused"
			: hovered
				? "hovered"
				: "idle";
	const resolvedVisualStyles = resolveInputVisualStyles(theme, variant, color, interactionState, readOnly);
	const motionTransition = resolveInputMotionTransition(interactionState);
	const animated = useMotion({
		values: {
			backgroundColor: resolvedVisualStyles.backgroundColor,
			strokeColor: resolvedVisualStyles.strokeColor,
			strokeTransparency: resolvedVisualStyles.strokeTransparency,
			strokeThickness: resolvedVisualStyles.strokeThickness,
			textColor: resolvedVisualStyles.textColor,
			placeholderColor: resolvedVisualStyles.placeholderColor,
		},
		transition: motionTransition,
	});
	const rootSlotProps = slotProps?.root;
	const textboxSlotProps = slotProps?.textbox;
	const resolvedFont = textboxSlotProps?.Font ?? theme.fontFamily;
	const resolvedFontFace = resolveTextFontFace(textboxSlotProps?.Font, textboxSlotProps?.FontFace, theme.fontFamily);
	const resolvedTextSize = textboxSlotProps?.TextSize ?? sizeStyles.fontSize;
	const resolvedLineHeight = textboxSlotProps?.LineHeight ?? sizeStyles.lineHeight;
	const resolvedTextValue = textboxSlotProps?.Text ?? value ?? uncontrolledValue;
	const resolvedTextXAlignment = textboxSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left;
	const resolvedTextYAlignment = textboxSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center;
	const resolvedTextTruncate = textboxSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd;
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedTextboxZIndex = textboxSlotProps?.ZIndex ?? resolvedRootZIndex;
	const rootEvent = useRootCursorEvent<NonNullable<FrameEventMap>>(
		undefined,
		rootSlotProps?.Event === undefined ? props.cursor : undefined,
		disabled,
	);
	const internalEvent: TextBoxEventMap = {
		MouseEnter: () => {
			if (disabled) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			setHovered(false);
		},
		Focused: () => {
			if (disabled) {
				return;
			}

			setFocused(true);
		},
		FocusLost: () => {
			setFocused(false);
		},
	};
	const internalChange: TextBoxChangeMap = {
		Text: (textbox) => {
			const nextValue = textbox.Text;
			setUncontrolledValue(nextValue);
			onChange?.(nextValue);
		},
	};
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(decoratorChildren, renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.corner }));
	pushDecorator(
		decoratorChildren,
		renderStrokeDecorator({
			enabled: true,
			color: animated.strokeColor,
			transparency: animated.strokeTransparency,
			thickness: animated.strokeThickness,
			slotProps: slotProps?.stroke,
		}),
	);
	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({
			enabled: hasPadding,
			paddingTop,
			paddingRight,
			paddingBottom,
			paddingLeft,
			slotProps: slotProps?.padding,
		}),
	);
	pushDecorator(
		decoratorChildren,
		renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint }),
	);

	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundColor3: animated.backgroundColor,
		BackgroundTransparency: 0,
		Size: computedSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: resolvedRootZIndex,
		Event: rootEvent,
	};
	const textboxInstanceProps: Partial<React.InstanceProps<TextBox>> = {
		Active: !disabled,
		Selectable: !disabled,
		BackgroundTransparency: 1,
		BorderSizePixel: 0,
		Size: UDim2.fromScale(1, 1),
		Position: UDim2.fromScale(0, 0),
		Text: resolvedTextValue,
		PlaceholderText: placeholder ?? "",
		PlaceholderColor3: animated.placeholderColor,
		TextColor3: animated.textColor,
		TextTransparency: 0,
		TextStrokeTransparency: 1,
		TextSize: resolvedTextSize,
		Font: resolvedFont,
		FontFace: resolvedFontFace,
		LineHeight: resolvedLineHeight,
		TextEditable: !disabled && !readOnly,
		ClearTextOnFocus: false,
		MultiLine: false,
		TextWrapped: false,
		TextTruncate: resolvedTextTruncate,
		TextXAlignment: resolvedTextXAlignment,
		TextYAlignment: resolvedTextYAlignment,
		RichText: false,
		ZIndex: resolvedTextboxZIndex,
		Event: composeEventMaps(internalEvent, Event),
		Change: composeEventMaps(internalChange, Change),
	};

	return (
		<frame {...rootInstanceProps} {...rootSlotProps}>
			{decoratorChildren}
			<textbox {...textboxInstanceProps} {...textboxSlotProps} ref={ref} />
		</frame>
	);
});

export const Input = InputBase as InputComponent;

Input.displayName = "Input";
