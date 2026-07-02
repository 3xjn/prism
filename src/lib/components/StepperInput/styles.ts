import type { Theme, ThemeSize, Variant } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { StepperInputSize } from "./types";

export type StepperInputFrameState = "idle" | "hovered" | "focused" | "disabled";
export type StepperInputButtonState = "idle" | "hovered" | "pressed" | "disabled";

export interface StepperInputSizeStyles {
	readonly padding: ThemeSize;
	readonly gap: number;
	readonly buttonWidth: number;
	readonly buttonPaddingX: ThemeSize;
	readonly buttonPaddingY: ThemeSize;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly radius: UDim;
	readonly buttonRadius: UDim;
	readonly minHeight: number;
	readonly defaultWidth: number;
}

export interface StepperInputFrameVisualStyles {
	readonly backgroundColor: Color3;
	readonly inputBackgroundColor: Color3;
	readonly inputBackgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
	readonly textColor: Color3;
	readonly placeholderColor: Color3;
	readonly railFillColor: Color3;
	readonly railFillTransparency: number;
}

export interface StepperInputButtonVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
}

function resolveControlRadius(theme: Theme, size: StepperInputSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", "sm", "radius", theme.radius.sm));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", "lg", "radius", theme.radius.lg));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", "md", "radius", theme.radius.md));
	}
}

function resolveButtonRadius(theme: Theme, size: StepperInputSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", "xs", "radius", theme.radius.xs));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", "md", "radius", theme.radius.md));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", "sm", "radius", theme.radius.sm));
	}
}

export function resolveStepperInputSizeStyles(theme: Theme, size: StepperInputSize): StepperInputSizeStyles {
	switch (size) {
		case "xs":
			return {
				padding: "xs",
				gap: 3,
				buttonWidth: 28,
				buttonPaddingX: "xs",
				buttonPaddingY: "xs",
				fontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				radius: resolveControlRadius(theme, size),
				buttonRadius: resolveButtonRadius(theme, size),
				minHeight: 30,
				defaultWidth: 156,
			};
		case "sm":
			return {
				padding: "xs",
				gap: 4,
				buttonWidth: 32,
				buttonPaddingX: "xs",
				buttonPaddingY: "xs",
				fontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				radius: resolveControlRadius(theme, size),
				buttonRadius: resolveButtonRadius(theme, size),
				minHeight: 34,
				defaultWidth: 176,
			};
		case "lg":
			return {
				padding: "sm",
				gap: 5,
				buttonWidth: 44,
				buttonPaddingX: "sm",
				buttonPaddingY: "xs",
				fontSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				radius: resolveControlRadius(theme, size),
				buttonRadius: resolveButtonRadius(theme, size),
				minHeight: 46,
				defaultWidth: 236,
			};
		case "xl":
			return {
				padding: "sm",
				gap: 6,
				buttonWidth: 50,
				buttonPaddingX: "sm",
				buttonPaddingY: "sm",
				fontSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				radius: resolveControlRadius(theme, size),
				buttonRadius: resolveButtonRadius(theme, size),
				minHeight: 54,
				defaultWidth: 272,
			};
		case "md":
		default:
			return {
				padding: "xs",
				gap: 4,
				buttonWidth: 38,
				buttonPaddingX: "sm",
				buttonPaddingY: "xs",
				fontSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				radius: resolveControlRadius(theme, size),
				buttonRadius: resolveButtonRadius(theme, size),
				minHeight: 40,
				defaultWidth: 204,
			};
	}
}

export function resolveStepperInputFrameVisualStyles(
	theme: Theme,
	variant: Variant,
	state: StepperInputFrameState,
	readOnly: boolean,
): StepperInputFrameVisualStyles {
	const idleText = readOnly ? mixColor(theme.colors.text.primary, theme.colors.text.secondary, 0.35) : theme.colors.text.primary;
	const placeholderBase = readOnly ? mixColor(theme.colors.text.secondary, theme.colors.border.default, 0.3) : theme.colors.text.secondary;

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			inputBackgroundColor: theme.colors.action.disabledBackground,
			inputBackgroundTransparency: 0.2,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.1,
			strokeThickness: 1,
			textColor: theme.colors.text.disabled,
			placeholderColor: theme.colors.text.disabled,
			railFillColor: mixColor(theme.colors.action.disabledBackground, theme.colors.border.default, 0.34),
			railFillTransparency: 0.78,
		};
	}

	const tacticalSurface = variant === "filled"
		? mixColor(theme.colors.background.surface, theme.colors.border.default, readOnly ? 0.16 : 0.26)
		: variant === "light"
		? mixColor(theme.colors.background.surface, theme.colors.action.hover, readOnly ? 0.22 : 0.34)
		: variant === "subtle"
		? mixColor(theme.colors.background.surface, theme.colors.background.default, 0.48)
		: mixColor(theme.colors.background.surface, theme.colors.background.default, 0.24);
	const hoverSurface = mixColor(tacticalSurface, theme.colors.action.hover, 0.48);
	const focusSurface = mixColor(tacticalSurface, theme.colors.border.default, readOnly ? 0.08 : 0.14);
	const inputSurface = variant === "filled"
		? mixColor(tacticalSurface, theme.colors.background.surface, 0.2)
		: mixColor(theme.colors.background.default, theme.colors.border.default, 0.16);
	// The value fill carries the primary tint so it reads as "value" (like
	// Slider and Progress) instead of inert gray chrome.
	const railFillBase = mixColor(theme.colors.primary.light, theme.colors.background.surface, readOnly ? 0.55 : 0.3);

	return {
		backgroundColor: state === "focused" ? focusSurface : state === "hovered" ? hoverSurface : tacticalSurface,
		inputBackgroundColor: state === "focused" ? mixColor(inputSurface, theme.colors.action.hover, 0.18) : inputSurface,
		inputBackgroundTransparency: readOnly ? 0.18 : 0,
		strokeColor: state === "focused" ? theme.colors.border.strong : state === "hovered" ? theme.colors.border.strong : theme.colors.border.default,
		strokeTransparency: state === "focused" ? 0.16 : state === "hovered" ? 0.08 : variant === "subtle" ? 0.14 : 0.08,
		strokeThickness: 1,
		textColor: idleText,
		placeholderColor: state === "focused" ? mixColor(placeholderBase, theme.colors.text.primary, 0.16) : placeholderBase,
		railFillColor: state === "focused" ? mixColor(railFillBase, theme.colors.primary.main, 0.14) : railFillBase,
		// The full-height value fill stays visible at rest so the fraction
		// always reads; hover and dragging strengthen it slightly.
		railFillTransparency: state === "focused" ? 0.3 : state === "hovered" ? 0.42 : 0.5,
	};
}

export function resolveStepperInputButtonVisualStyles(
	theme: Theme,
	variant: Variant,
	state: StepperInputButtonState,
): StepperInputButtonVisualStyles {
	const idleSurface = variant === "filled"
		? mixColor(theme.colors.border.strong, theme.colors.background.surface, 0.5)
		: variant === "light"
		? mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.28)
		: mixColor(theme.colors.background.default, theme.colors.border.default, 0.26);
	const hoverSurface = variant === "filled"
		? mixColor(idleSurface, theme.colors.text.primary, 0.08)
		: mixColor(idleSurface, theme.colors.primary.light, 0.4);
	const pressedSurface = variant === "filled"
		? mixColor(idleSurface, theme.colors.action.pressed, 0.28)
		: mixColor(idleSurface, theme.colors.primary.light, 0.65);
	const idleText = variant === "filled" ? theme.colors.text.inverse : theme.colors.text.primary;
	const accentText = variant === "filled" ? theme.colors.text.inverse : theme.colors.primary.dark;

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			backgroundTransparency: 0,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.24,
			textColor: theme.colors.text.disabled,
		};
	}

	return {
		backgroundColor: state === "pressed" ? pressedSurface : state === "hovered" ? hoverSurface : idleSurface,
		backgroundTransparency: 0,
		strokeColor:
			state === "pressed" || state === "hovered"
				? mixColor(theme.colors.primary.main, theme.colors.border.strong, 0.4)
				: theme.colors.border.default,
		strokeTransparency: state === "pressed" ? 0.1 : state === "hovered" ? 0.16 : 0.1,
		textColor: state === "pressed" || state === "hovered" ? accentText : idleText,
	};
}

export function resolveStepperInputFrameMotionTransition(state: StepperInputFrameState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			inputBackgroundColor: { duration: "instant", easing: "standard" },
			inputBackgroundTransparency: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			strokeThickness: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			placeholderColor: { duration: "instant", easing: "standard" },
			railFillColor: { duration: "instant", easing: "standard" },
			railFillTransparency: { duration: "instant", easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: state === "focused" ? 0.12 : 0.14, easing: "standard" },
		inputBackgroundColor: { duration: state === "focused" ? 0.12 : 0.14, easing: "standard" },
		inputBackgroundTransparency: { duration: state === "focused" ? 0.12 : 0.14, easing: "standard" },
		strokeColor: { duration: state === "focused" ? 0.12 : 0.14, easing: "standard" },
		strokeTransparency: { duration: state === "focused" ? 0.12 : 0.14, easing: "standard" },
		strokeThickness: { duration: state === "focused" ? 0.12 : 0.14, easing: "out" },
		textColor: { duration: 0.12, easing: "standard" },
		placeholderColor: { duration: 0.12, easing: "standard" },
		railFillColor: { duration: 0.12, easing: "standard" },
		railFillTransparency: { duration: 0.12, easing: "standard" },
	} as const;
}

export function resolveStepperInputButtonMotionTransition(state: StepperInputButtonState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			backgroundTransparency: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: state === "pressed" ? 0.05 : 0.1, easing: "standard" },
		backgroundTransparency: { duration: state === "pressed" ? 0.05 : 0.1, easing: "standard" },
		strokeColor: { duration: state === "pressed" ? 0.05 : 0.1, easing: "standard" },
		strokeTransparency: { duration: state === "pressed" ? 0.05 : 0.1, easing: "standard" },
		textColor: { duration: state === "pressed" ? 0.05 : 0.1, easing: "standard" },
	} as const;
}
