import type { Theme, ThemeSize, Variant } from "@prism/theme";

import type { InteractionState } from "../_shared/usePressInteraction";
import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { ButtonColor, ButtonSize } from "./types";

const BUTTON_PRESS_SCALE = 0.965;

export type ButtonInteractionState = InteractionState;

export interface ButtonSizeStyles {
	readonly paddingX: ThemeSize;
	readonly paddingY: ThemeSize;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly radius: UDim;
	readonly minHeight: number;
}

export interface ButtonVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly textColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly scale: number;
	readonly shouldRenderStroke: boolean;
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

export function resolveButtonSizeStyles(theme: Theme, size: ButtonSize): ButtonSizeStyles {
	switch (size) {
		case "xs":
			return {
				paddingX: "md",
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

export function resolveButtonContentGap(theme: Theme, size: ButtonSize): number {
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

export function resolveButtonVisualStyles(
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
			backgroundTransparency: 0,
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
				backgroundColor: state === "pressed" ? pressedIntentLight : state === "hovered" ? hoverIntentLight : intentColors.light,
				backgroundTransparency: 0,
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
				backgroundTransparency: 0,
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
						: intentColors.light,
				backgroundTransparency: state === "pressed" || state === "hovered" ? 0 : 1,
				textColor: intentColors.dark,
				strokeColor: intentColors.light,
				strokeTransparency: 1,
				scale: state === "pressed" ? BUTTON_PRESS_SCALE : 1,
				shouldRenderStroke: false,
			};
		case "filled":
		default:
			return {
				backgroundColor: state === "pressed" ? filledPressed : state === "hovered" ? filledHover : intentColors.main,
				backgroundTransparency: 0,
				textColor: intentColors.contrast,
				strokeColor: intentColors.dark,
				strokeTransparency: 1,
				scale: state === "pressed" ? BUTTON_PRESS_SCALE : 1,
				shouldRenderStroke: false,
			};
	}
}

export function resolveButtonMotionTransition(state: ButtonInteractionState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			backgroundTransparency: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			scale: { duration: "instant", easing: "out" },
		} as const;
	}

	if (state === "pressed") {
		return {
			backgroundColor: { duration: 0.045, easing: "standard" },
			backgroundTransparency: { duration: 0.045, easing: "standard" },
			textColor: { duration: 0.045, easing: "standard" },
			strokeColor: { duration: 0.045, easing: "standard" },
			strokeTransparency: { duration: 0.045, easing: "standard" },
			scale: { duration: 0.05, easing: "out" },
		} as const;
	}

	if (state === "hovered") {
		return {
			backgroundColor: { duration: 0.1, easing: "standard" },
			backgroundTransparency: { duration: 0.1, easing: "standard" },
			textColor: { duration: 0.1, easing: "standard" },
			strokeColor: { duration: 0.1, easing: "standard" },
			strokeTransparency: { duration: 0.1, easing: "standard" },
			scale: { duration: 0.1, easing: "out" },
		} as const;
	}

	return {
		backgroundColor: { duration: 0.11, easing: "standard" },
		backgroundTransparency: { duration: 0.11, easing: "standard" },
		textColor: { duration: 0.11, easing: "standard" },
		strokeColor: { duration: 0.11, easing: "standard" },
		strokeTransparency: { duration: 0.11, easing: "standard" },
		scale: { duration: 0.11, easing: "out" },
	} as const;
}
