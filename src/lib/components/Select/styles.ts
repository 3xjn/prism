import type { Theme, ThemeSize, Variant } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { SelectColor, SelectSize } from "./types";

export type SelectTriggerState = "idle" | "hovered" | "pressed" | "open" | "disabled";
export type SelectOptionState = "idle" | "hovered" | "selected" | "disabled";

export interface SelectSizeStyles {
	readonly paddingX: ThemeSize;
	readonly paddingY: ThemeSize;
	readonly optionPaddingX: ThemeSize;
	readonly optionPaddingY: ThemeSize;
	readonly listPadding: ThemeSize;
	readonly listGap: number;
	readonly optionGap: number;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly radius: UDim;
	readonly optionRadius: UDim;
	readonly minHeight: number;
	readonly optionHeight: number;
	readonly defaultWidth: number;
	readonly indicatorSize: number;
	readonly indicatorGap: number;
}

export interface SelectTriggerVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
	readonly textColor: Color3;
	readonly placeholderColor: Color3;
	readonly indicatorColor: Color3;
	readonly indicatorRotation: number;
}

export interface SelectListVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
}

export interface SelectOptionVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly textColor: Color3;
	readonly textTransparency: number;
}

function resolveSelectRadius(theme: Theme, size: SelectSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "select", "sm", "radius", theme.radius.sm));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "select", "lg", "radius", theme.radius.lg));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "select", "md", "radius", theme.radius.md));
	}
}

function resolveOptionRadius(theme: Theme, size: SelectSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "select", "sm", "radius", theme.radius.xs));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "select", "md", "radius", theme.radius.md));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "select", "sm", "radius", theme.radius.sm));
	}
}

export function resolveSelectSizeStyles(theme: Theme, size: SelectSize): SelectSizeStyles {
	switch (size) {
		case "xs":
			return {
				paddingX: "sm",
				paddingY: "xs",
				optionPaddingX: "sm",
				optionPaddingY: "xs",
				listPadding: "xs",
				listGap: theme.spacing.xs,
				optionGap: theme.spacing.xs,
				fontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				radius: resolveSelectRadius(theme, size),
				optionRadius: resolveOptionRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.xs,
				optionHeight: theme.spacing.xl + theme.spacing.xs,
				defaultWidth: theme.spacing.xl * 7,
				indicatorSize: 12,
				indicatorGap: theme.spacing.xs,
			};
		case "sm":
			return {
				paddingX: "md",
				paddingY: "xs",
				optionPaddingX: "md",
				optionPaddingY: "xs",
				listPadding: "xs",
				listGap: theme.spacing.xs,
				optionGap: theme.spacing.xs,
				fontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				radius: resolveSelectRadius(theme, size),
				optionRadius: resolveOptionRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.sm,
				optionHeight: theme.spacing.xl + theme.spacing.sm,
				defaultWidth: theme.spacing.xl * 8,
				indicatorSize: 14,
				indicatorGap: theme.spacing.xs,
			};
		case "lg":
			return {
				paddingX: "lg",
				paddingY: "sm",
				optionPaddingX: "lg",
				optionPaddingY: "sm",
				listPadding: "sm",
				listGap: theme.spacing.sm,
				optionGap: theme.spacing.xs,
				fontSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				radius: resolveSelectRadius(theme, size),
				optionRadius: resolveOptionRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.lg,
				optionHeight: theme.spacing.xl + theme.spacing.md,
				defaultWidth: theme.spacing.xl * 11,
				indicatorSize: 18,
				indicatorGap: theme.spacing.sm,
			};
		case "xl":
			return {
				paddingX: "xl",
				paddingY: "md",
				optionPaddingX: "xl",
				optionPaddingY: "sm",
				listPadding: "sm",
				listGap: theme.spacing.sm,
				optionGap: theme.spacing.sm,
				fontSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				radius: resolveSelectRadius(theme, size),
				optionRadius: resolveOptionRadius(theme, size),
				minHeight: theme.spacing.xl * 2,
				optionHeight: theme.spacing.xl + theme.spacing.lg,
				defaultWidth: theme.spacing.xl * 13,
				indicatorSize: 20,
				indicatorGap: theme.spacing.sm,
			};
		case "md":
		default:
			return {
				paddingX: "md",
				paddingY: "sm",
				optionPaddingX: "md",
				optionPaddingY: "sm",
				listPadding: "xs",
				listGap: theme.spacing.xs,
				optionGap: theme.spacing.xs,
				fontSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				radius: resolveSelectRadius(theme, size),
				optionRadius: resolveOptionRadius(theme, size),
				minHeight: theme.spacing.xl + theme.spacing.md,
				optionHeight: theme.spacing.xl + theme.spacing.sm,
				defaultWidth: theme.spacing.xl * 10,
				indicatorSize: 16,
				indicatorGap: theme.spacing.xs,
			};
	}
}

export function resolveSelectTriggerVisualStyles(
	theme: Theme,
	variant: Variant,
	color: SelectColor,
	state: SelectTriggerState,
	hasValue: boolean,
): SelectTriggerVisualStyles {
	const intentColors = theme.colors[color];
	const idleTextColor = theme.colors.text.primary;
	const placeholderBase = mixColor(theme.colors.text.secondary, theme.colors.border.default, 0.24);
	const hoverPlaceholder = mixColor(placeholderBase, intentColors.main, 0.14);
	const openPlaceholder = mixColor(placeholderBase, intentColors.main, 0.3);
	const outlineIdleSurface = theme.colors.background.surface;
	const outlineHoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.5);
	const outlineOpenSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.2);
	const outlinePressedSurface = mixColor(outlineHoverSurface, theme.colors.action.pressed, 0.55);
	const subtleIdleSurface = mixColor(theme.colors.background.default, intentColors.light, 0.14);
	const subtleHoverSurface = mixColor(subtleIdleSurface, theme.colors.background.surface, 0.48);
	const subtleOpenSurface = mixColor(subtleIdleSurface, intentColors.light, 0.18);
	const subtlePressedSurface = mixColor(subtleHoverSurface, theme.colors.action.pressed, 0.35);
	const lightIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.28);
	const lightHoverSurface = mixColor(lightIdleSurface, theme.colors.background.surface, 0.12);
	const lightOpenSurface = mixColor(lightIdleSurface, intentColors.main, 0.08);
	const lightPressedSurface = mixColor(lightHoverSurface, theme.colors.action.pressed, 0.28);
	const filledIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.34);
	const filledHoverSurface = mixColor(filledIdleSurface, intentColors.light, 0.08);
	const filledOpenSurface = mixColor(filledIdleSurface, intentColors.main, 0.12);
	const filledPressedSurface = mixColor(filledHoverSurface, theme.colors.action.pressed, 0.24);

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.1,
			strokeThickness: 1,
			textColor: theme.colors.text.disabled,
			placeholderColor: theme.colors.text.disabled,
			indicatorColor: theme.colors.text.disabled,
			indicatorRotation: 90,
		};
	}

	let backgroundColor = outlineIdleSurface;
	let strokeColor = theme.colors.border.default;
	let strokeTransparency = 0.12;
	let strokeThickness = 1;

	switch (variant) {
		case "subtle":
			backgroundColor =
				state === "pressed"
					? subtlePressedSurface
					: state === "open"
					? subtleOpenSurface
					: state === "hovered"
					? subtleHoverSurface
					: subtleIdleSurface;
			strokeColor = state === "open" ? intentColors.main : state === "hovered" ? theme.colors.border.default : theme.colors.border.subtle;
			strokeTransparency = state === "open" ? 0.04 : state === "hovered" ? 0.14 : 0.28;
			strokeThickness = state === "open" ? 2 : 1;
			break;
		case "light":
			backgroundColor =
				state === "pressed"
					? lightPressedSurface
					: state === "open"
					? lightOpenSurface
					: state === "hovered"
					? lightHoverSurface
					: lightIdleSurface;
			strokeColor = state === "open" ? intentColors.main : state === "hovered" ? intentColors.dark : intentColors.light;
			strokeTransparency = state === "open" ? 0.02 : state === "hovered" ? 0.08 : 0.14;
			strokeThickness = state === "open" ? 2 : 1;
			break;
		case "filled":
			backgroundColor =
				state === "pressed"
					? filledPressedSurface
					: state === "open"
					? filledOpenSurface
					: state === "hovered"
					? filledHoverSurface
					: filledIdleSurface;
			strokeColor =
				state === "open"
					? intentColors.dark
					: state === "hovered"
					? intentColors.main
					: mixColor(intentColors.main, theme.colors.border.default, 0.5);
			strokeTransparency = state === "open" ? 0.02 : state === "hovered" ? 0.08 : 0.16;
			strokeThickness = state === "open" ? 2 : 1;
			break;
		case "outline":
		default:
			backgroundColor =
				state === "pressed"
					? outlinePressedSurface
					: state === "open"
					? outlineOpenSurface
					: state === "hovered"
					? outlineHoverSurface
					: outlineIdleSurface;
			strokeColor = state === "open" ? intentColors.main : state === "hovered" ? theme.colors.border.strong : theme.colors.border.default;
			strokeTransparency = state === "open" ? 0 : state === "hovered" ? 0.06 : 0.12;
			strokeThickness = state === "open" ? 2 : 1;
			break;
	}

	const placeholderColor = state === "open" ? openPlaceholder : state === "hovered" || state === "pressed" ? hoverPlaceholder : placeholderBase;
	const textColor = hasValue ? idleTextColor : placeholderColor;
	const indicatorColor = hasValue ? mixColor(idleTextColor, intentColors.main, state === "open" ? 0.16 : 0.08) : placeholderColor;

	return {
		backgroundColor,
		strokeColor,
		strokeTransparency,
		strokeThickness,
		textColor,
		placeholderColor,
		indicatorColor,
		indicatorRotation: state === "open" ? -90 : 90,
	};
}

export function resolveSelectListVisualStyles(theme: Theme, color: SelectColor, variant: Variant): SelectListVisualStyles {
	const intentColors = theme.colors[color];

	switch (variant) {
		case "subtle":
			return {
				backgroundColor: mixColor(theme.colors.background.surface, intentColors.light, 0.12),
				strokeColor: theme.colors.border.default,
				strokeTransparency: 0.16,
			};
		case "light":
			return {
				backgroundColor: mixColor(theme.colors.background.surface, intentColors.light, 0.18),
				strokeColor: intentColors.light,
				strokeTransparency: 0.08,
			};
		case "filled":
			return {
				backgroundColor: mixColor(theme.colors.background.surface, intentColors.light, 0.2),
				strokeColor: mixColor(intentColors.main, theme.colors.border.default, 0.52),
				strokeTransparency: 0.08,
			};
		case "outline":
		default:
			return {
				backgroundColor: theme.colors.background.surface,
				strokeColor: theme.colors.border.default,
				strokeTransparency: 0.08,
			};
	}
}

export function resolveSelectOptionVisualStyles(
	theme: Theme,
	color: SelectColor,
	state: SelectOptionState,
): SelectOptionVisualStyles {
	const intentColors = theme.colors[color];
	const selectedSurface = mixColor(theme.colors.background.default, intentColors.light, 0.36);
	const selectedHoverSurface = mixColor(selectedSurface, intentColors.light, 0.16);
	const hoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.9);

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.background.surface,
			backgroundTransparency: 1,
			textColor: theme.colors.text.disabled,
			textTransparency: 0,
		};
	}

	if (state === "selected") {
		return {
			backgroundColor: selectedHoverSurface,
			backgroundTransparency: 0,
			textColor: intentColors.dark,
			textTransparency: 0,
		};
	}

	if (state === "hovered") {
		return {
			backgroundColor: hoverSurface,
			backgroundTransparency: 0,
			textColor: theme.colors.text.primary,
			textTransparency: 0,
		};
	}

	return {
		backgroundColor: theme.colors.background.surface,
		backgroundTransparency: 1,
		textColor: theme.colors.text.primary,
		textTransparency: 0,
	};
}

export function resolveSelectTriggerMotionTransition(state: SelectTriggerState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			strokeThickness: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			placeholderColor: { duration: "instant", easing: "standard" },
			indicatorColor: { duration: "instant", easing: "standard" },
			indicatorRotation: { duration: "instant", easing: "out" },
		} as const;
	}

	if (state === "pressed") {
		return {
			backgroundColor: { duration: 0.06, easing: "standard" },
			strokeColor: { duration: 0.06, easing: "standard" },
			strokeTransparency: { duration: 0.06, easing: "standard" },
			strokeThickness: { duration: 0.06, easing: "standard" },
			textColor: { duration: 0.06, easing: "standard" },
			placeholderColor: { duration: 0.06, easing: "standard" },
			indicatorColor: { duration: 0.06, easing: "standard" },
			indicatorRotation: { duration: 0.08, easing: "out" },
		} as const;
	}

	if (state === "open") {
		return {
			backgroundColor: { duration: 0.12, easing: "standard" },
			strokeColor: { duration: 0.12, easing: "standard" },
			strokeTransparency: { duration: 0.12, easing: "standard" },
			strokeThickness: { duration: 0.12, easing: "out" },
			textColor: { duration: 0.12, easing: "standard" },
			placeholderColor: { duration: 0.12, easing: "standard" },
			indicatorColor: { duration: 0.12, easing: "standard" },
			indicatorRotation: { duration: 0.12, easing: "out" },
		} as const;
	}

	if (state === "hovered") {
		return {
			backgroundColor: { duration: 0.14, easing: "standard" },
			strokeColor: { duration: 0.14, easing: "standard" },
			strokeTransparency: { duration: 0.14, easing: "standard" },
			strokeThickness: { duration: 0.14, easing: "standard" },
			textColor: { duration: 0.14, easing: "standard" },
			placeholderColor: { duration: 0.14, easing: "standard" },
			indicatorColor: { duration: 0.14, easing: "standard" },
			indicatorRotation: { duration: 0.14, easing: "out" },
		} as const;
	}

	return {
		backgroundColor: { duration: 0.16, easing: "standard" },
		strokeColor: { duration: 0.16, easing: "standard" },
		strokeTransparency: { duration: 0.16, easing: "standard" },
		strokeThickness: { duration: 0.16, easing: "standard" },
		textColor: { duration: 0.16, easing: "standard" },
		placeholderColor: { duration: 0.16, easing: "standard" },
		indicatorColor: { duration: 0.16, easing: "standard" },
		indicatorRotation: { duration: 0.16, easing: "out" },
	} as const;
}

export function resolveSelectOptionMotionTransition(state: SelectOptionState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			backgroundTransparency: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			textTransparency: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "selected") {
		return {
			backgroundColor: { duration: 0.12, easing: "standard" },
			backgroundTransparency: { duration: 0.12, easing: "standard" },
			textColor: { duration: 0.12, easing: "standard" },
			textTransparency: { duration: 0.12, easing: "standard" },
		} as const;
	}

	if (state === "hovered") {
		return {
			backgroundColor: { duration: 0.12, easing: "standard" },
			backgroundTransparency: { duration: 0.12, easing: "standard" },
			textColor: { duration: 0.12, easing: "standard" },
			textTransparency: { duration: 0.12, easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: 0.14, easing: "standard" },
		backgroundTransparency: { duration: 0.14, easing: "standard" },
		textColor: { duration: 0.14, easing: "standard" },
		textTransparency: { duration: 0.14, easing: "standard" },
	} as const;
}
