import type { Theme } from "@prism/theme";
import { resolveDensityControlSize, resolveDensityMarkSize, resolveThemeSpacing } from "@prism/theme";

import type { InteractionState } from "../_shared/usePressInteraction";
import { mixColor } from "../_shared/visual";

import type { SwitchColor, SwitchSize } from "./types";

export type SwitchInteractionState = InteractionState;

export interface SwitchSizeStyles {
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

export interface SwitchVisualStyles {
	readonly trackColor: Color3;
	readonly trackStrokeColor: Color3;
	readonly trackStrokeTransparency: number;
	readonly thumbColor: Color3;
	readonly thumbStrokeColor: Color3;
	readonly thumbStrokeTransparency: number;
	readonly thumbOffset: number;
	readonly iconColor: Color3;
	readonly iconTransparency: number;
	readonly labelColor: Color3;
}

export function resolveSwitchSizeStyles(theme: Theme, size: SwitchSize): SwitchSizeStyles {
	switch (size) {
		case "xs":
			return {
				trackWidth: resolveDensityMarkSize(theme, 28),
				trackHeight: resolveDensityMarkSize(theme, 16),
				thumbDiameter: resolveDensityMarkSize(theme, 10),
				thumbInset: 3,
				iconSize: resolveDensityMarkSize(theme, 6),
				labelGap: resolveThemeSpacing(theme, "xs"),
				labelSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				minHeight: resolveDensityControlSize(theme, 20),
			};
		case "sm":
			return {
				trackWidth: resolveDensityMarkSize(theme, 32),
				trackHeight: resolveDensityMarkSize(theme, 18),
				thumbDiameter: resolveDensityMarkSize(theme, 12),
				thumbInset: 3,
				iconSize: resolveDensityMarkSize(theme, 7),
				labelGap: resolveThemeSpacing(theme, "xs"),
				labelSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				minHeight: resolveDensityControlSize(theme, 22),
			};
		case "lg":
			return {
				trackWidth: resolveDensityMarkSize(theme, 44),
				trackHeight: resolveDensityMarkSize(theme, 24),
				thumbDiameter: resolveDensityMarkSize(theme, 18),
				thumbInset: 3,
				iconSize: resolveDensityMarkSize(theme, 10),
				labelGap: resolveThemeSpacing(theme, "sm"),
				labelSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				minHeight: resolveDensityControlSize(theme, 28),
			};
		case "xl":
			return {
				trackWidth: resolveDensityMarkSize(theme, 50),
				trackHeight: resolveDensityMarkSize(theme, 28),
				thumbDiameter: resolveDensityMarkSize(theme, 20),
				thumbInset: 4,
				iconSize: resolveDensityMarkSize(theme, 12),
				labelGap: resolveThemeSpacing(theme, "md"),
				labelSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				minHeight: resolveDensityControlSize(theme, 32),
			};
		case "md":
		default:
			return {
				trackWidth: resolveDensityMarkSize(theme, 38),
				trackHeight: resolveDensityMarkSize(theme, 20),
				thumbDiameter: resolveDensityMarkSize(theme, 14),
				thumbInset: 3,
				iconSize: resolveDensityMarkSize(theme, 8),
				labelGap: resolveThemeSpacing(theme, "sm"),
				labelSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				minHeight: resolveDensityControlSize(theme, 24),
			};
	}
}

function resolveThumbOffset(sizeStyles: SwitchSizeStyles, checked: boolean): number {
	return checked
		? sizeStyles.trackWidth - sizeStyles.thumbDiameter - sizeStyles.thumbInset
		: sizeStyles.thumbInset;
}

export function resolveSwitchVisualStyles(
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
			thumbStrokeColor: theme.colors.border.subtle,
			thumbStrokeTransparency: checked ? 1 : 0.5,
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
		thumbStrokeColor: checked ? intentColors.dark : theme.colors.border.default,
		thumbStrokeTransparency: checked ? 0.8 : 0.4,
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

export function resolveSwitchMotionTransition(state: SwitchInteractionState) {
	if (state === "disabled") {
		return {
			trackColor: { duration: "instant", easing: "standard" },
			trackStrokeColor: { duration: "instant", easing: "standard" },
			trackStrokeTransparency: { duration: "instant", easing: "standard" },
			thumbColor: { duration: "instant", easing: "standard" },
			thumbStrokeColor: { duration: "instant", easing: "standard" },
			thumbStrokeTransparency: { duration: "instant", easing: "standard" },
			thumbOffset: { duration: "instant", easing: "out" },
			iconColor: { duration: "instant", easing: "standard" },
			iconTransparency: { duration: "instant", easing: "standard" },
			labelColor: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "pressed") {
		return {
			trackColor: { duration: "fast", easing: "standard" },
			trackStrokeColor: { duration: "fast", easing: "standard" },
			trackStrokeTransparency: { duration: "fast", easing: "standard" },
			thumbColor: { duration: "fast", easing: "standard" },
			thumbStrokeColor: { duration: "fast", easing: "standard" },
			thumbStrokeTransparency: { duration: "fast", easing: "standard" },
			thumbOffset: { duration: "fast", easing: "out" },
			iconColor: { duration: "fast", easing: "standard" },
			iconTransparency: { duration: "fast", easing: "standard" },
			labelColor: { duration: "fast", easing: "standard" },
		} as const;
	}

	if (state === "hovered") {
		return {
			trackColor: { duration: "fast", easing: "standard" },
			trackStrokeColor: { duration: "fast", easing: "standard" },
			trackStrokeTransparency: { duration: "fast", easing: "standard" },
			thumbColor: { duration: "fast", easing: "standard" },
			thumbStrokeColor: { duration: "fast", easing: "standard" },
			thumbStrokeTransparency: { duration: "fast", easing: "standard" },
			thumbOffset: { duration: "normal", easing: "out" },
			iconColor: { duration: "fast", easing: "standard" },
			iconTransparency: { duration: "fast", easing: "standard" },
			labelColor: { duration: "fast", easing: "standard" },
		} as const;
	}

	return {
		trackColor: { duration: "normal", easing: "standard" },
		trackStrokeColor: { duration: "normal", easing: "standard" },
		trackStrokeTransparency: { duration: "normal", easing: "standard" },
		thumbColor: { duration: "normal", easing: "standard" },
		thumbStrokeColor: { duration: "normal", easing: "standard" },
		thumbStrokeTransparency: { duration: "normal", easing: "standard" },
		thumbOffset: { duration: "normal", easing: "out" },
		iconColor: { duration: "normal", easing: "standard" },
		iconTransparency: { duration: "normal", easing: "standard" },
		labelColor: { duration: "normal", easing: "standard" },
	} as const;
}
