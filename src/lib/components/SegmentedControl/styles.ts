import type { Theme, ThemeSize, Variant } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { SegmentedControlColor, SegmentedControlSize } from "./types";

export type SegmentedControlSegmentState = "idle" | "hovered" | "pressed" | "selected" | "disabled";

export interface SegmentedControlSizeStyles {
	readonly padding: ThemeSize;
	readonly gap: number;
	readonly segmentPaddingX: ThemeSize;
	readonly segmentPaddingY: ThemeSize;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly radius: UDim;
	readonly segmentRadius: UDim;
	readonly minHeight: number;
	readonly defaultWidth: number;
}

export interface SegmentedControlFrameVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
}

export interface SegmentedControlSegmentVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
	readonly textTransparency: number;
}

export interface SegmentedControlIndicatorVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
}

function resolveControlRadius(theme: Theme, size: SegmentedControlSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "segmentedControl", "sm", "radius", theme.radius.sm));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "segmentedControl", "lg", "radius", theme.radius.lg));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "segmentedControl", "md", "radius", theme.radius.md));
	}
}

function resolveSegmentRadius(theme: Theme, size: SegmentedControlSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "segmentedControl", "xs", "radius", theme.radius.xs));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "segmentedControl", "md", "radius", theme.radius.md));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "segmentedControl", "sm", "radius", theme.radius.sm));
	}
}

export function resolveSegmentedControlSizeStyles(theme: Theme, size: SegmentedControlSize): SegmentedControlSizeStyles {
	switch (size) {
		case "xs":
			return {
				padding: "xs",
				gap: 2,
				segmentPaddingX: "sm",
				segmentPaddingY: "xs",
				fontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				radius: resolveControlRadius(theme, size),
				segmentRadius: resolveSegmentRadius(theme, size),
				minHeight: 28,
				defaultWidth: 220,
			};
		case "sm":
			return {
				padding: "xs",
				gap: 3,
				segmentPaddingX: "md",
				segmentPaddingY: "xs",
				fontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				radius: resolveControlRadius(theme, size),
				segmentRadius: resolveSegmentRadius(theme, size),
				minHeight: 32,
				defaultWidth: 260,
			};
		case "lg":
			return {
				padding: "sm",
				gap: 4,
				segmentPaddingX: "lg",
				segmentPaddingY: "sm",
				fontSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				radius: resolveControlRadius(theme, size),
				segmentRadius: resolveSegmentRadius(theme, size),
				minHeight: 44,
				defaultWidth: 360,
			};
		case "xl":
			return {
				padding: "sm",
				gap: 5,
				segmentPaddingX: "xl",
				segmentPaddingY: "md",
				fontSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				radius: resolveControlRadius(theme, size),
				segmentRadius: resolveSegmentRadius(theme, size),
				minHeight: 52,
				defaultWidth: 420,
			};
		case "md":
		default:
			return {
				padding: "xs",
				gap: 3,
				segmentPaddingX: "md",
				segmentPaddingY: "sm",
				fontSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				radius: resolveControlRadius(theme, size),
				segmentRadius: resolveSegmentRadius(theme, size),
				minHeight: 38,
				defaultWidth: 320,
			};
	}
}

export function resolveSegmentedControlFrameVisualStyles(
	theme: Theme,
	variant: Variant,
	color: SegmentedControlColor,
	disabled: boolean,
): SegmentedControlFrameVisualStyles {
	const intentColors = theme.colors[color];
	if (disabled) {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.12,
		};
	}

	const baseSurface = variant === "filled"
		? mixColor(theme.colors.background.surface, intentColors.light, 0.32)
		: variant === "light"
		? mixColor(theme.colors.background.surface, intentColors.light, 0.18)
		: variant === "subtle"
		? mixColor(theme.colors.background.default, intentColors.light, 0.1)
		: theme.colors.background.surface;

	return {
		backgroundColor: baseSurface,
		strokeColor: variant === "subtle" ? theme.colors.border.subtle : theme.colors.border.default,
		strokeTransparency: variant === "subtle" ? 0.18 : 0.08,
	};
}

export function resolveSegmentedControlSegmentVisualStyles(
	theme: Theme,
	variant: Variant,
	color: SegmentedControlColor,
	state: SegmentedControlSegmentState,
): SegmentedControlSegmentVisualStyles {
	const intentColors = theme.colors[color];
	const idleText = theme.colors.text.secondary;
	const selectedText = variant === "filled" ? theme.colors.text.inverse : theme.colors.text.primary;
	const selectedSurface = variant === "filled"
		? intentColors.main
		: variant === "light"
		? mixColor(theme.colors.background.surface, intentColors.light, 0.28)
		: variant === "subtle"
		? mixColor(theme.colors.background.surface, theme.colors.border.default, 0.12)
		: mixColor(theme.colors.background.default, theme.colors.border.default, 0.28);

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			backgroundTransparency: 1,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 1,
			textColor: theme.colors.text.disabled,
			textTransparency: 0,
		};
	}

	if (state === "selected") {
		return {
			backgroundColor: selectedSurface,
			backgroundTransparency: 1,
			strokeColor: variant === "filled" ? intentColors.dark : mixColor(intentColors.main, theme.colors.border.default, 0.35),
			strokeTransparency: 1,
			textColor: selectedText,
			textTransparency: 0,
		};
	}

	const hoverSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.16);
	const pressedSurface = mixColor(theme.colors.background.surface, theme.colors.action.pressed, 0.45);

	return {
		backgroundColor: state === "pressed" ? pressedSurface : state === "hovered" ? hoverSurface : theme.colors.background.surface,
		backgroundTransparency: state === "idle" ? 1 : 0,
		strokeColor: state === "pressed" ? intentColors.main : theme.colors.border.subtle,
		strokeTransparency: state === "idle" ? 1 : state === "pressed" ? 0.2 : 0.36,
		textColor: state === "idle" ? idleText : theme.colors.text.primary,
		textTransparency: 0,
	};
}

export function resolveSegmentedControlIndicatorVisualStyles(
	theme: Theme,
	variant: Variant,
	color: SegmentedControlColor,
	disabled: boolean,
): SegmentedControlIndicatorVisualStyles {
	const intentColors = theme.colors[color];
	const selectedSurface = variant === "filled"
		? intentColors.main
		: variant === "light"
		? mixColor(theme.colors.background.surface, intentColors.light, 0.28)
		: variant === "subtle"
		? mixColor(theme.colors.background.surface, theme.colors.border.default, 0.12)
		: mixColor(theme.colors.background.default, theme.colors.border.default, 0.28);

	if (disabled) {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			backgroundTransparency: 0,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.28,
		};
	}

	return {
		backgroundColor: selectedSurface,
		backgroundTransparency: 0,
		strokeColor: variant === "filled" || variant === "light" ? mixColor(intentColors.main, theme.colors.border.default, 0.45) : theme.colors.border.default,
		strokeTransparency: variant === "filled" ? 0.1 : variant === "light" ? 0.22 : 0.32,
	};
}

export function resolveSegmentedControlIndicatorMotionTransition() {
	return {
		selectedIndex: { duration: 0.18, easing: "out" },
		backgroundColor: { duration: 0.12, easing: "standard" },
		backgroundTransparency: { duration: 0.12, easing: "standard" },
		strokeColor: { duration: 0.12, easing: "standard" },
		strokeTransparency: { duration: 0.12, easing: "standard" },
	} as const;
}

export function resolveSegmentedControlSegmentMotionTransition(state: SegmentedControlSegmentState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			backgroundTransparency: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			textTransparency: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "pressed") {
		return {
			backgroundColor: { duration: 0.06, easing: "standard" },
			backgroundTransparency: { duration: 0.06, easing: "standard" },
			strokeColor: { duration: 0.06, easing: "standard" },
			strokeTransparency: { duration: 0.06, easing: "standard" },
			textColor: { duration: 0.06, easing: "standard" },
			textTransparency: { duration: 0.06, easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: state === "selected" ? 0.16 : 0.12, easing: "standard" },
		backgroundTransparency: { duration: state === "selected" ? 0.16 : 0.12, easing: "standard" },
		strokeColor: { duration: state === "selected" ? 0.16 : 0.12, easing: "standard" },
		strokeTransparency: { duration: state === "selected" ? 0.16 : 0.12, easing: "standard" },
		textColor: { duration: 0.12, easing: "standard" },
		textTransparency: { duration: 0.12, easing: "standard" },
	} as const;
}
