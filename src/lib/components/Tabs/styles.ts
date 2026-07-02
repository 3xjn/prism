import type { Theme, ThemeSize } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { TabsColor, TabsSize, TabsVariant } from "./types";

export type TabsTabState = "idle" | "hovered" | "focused" | "pressed" | "selected" | "disabled";

export interface TabsSizeStyles {
	readonly tabGap: number;
	readonly tabPaddingX: ThemeSize;
	readonly tabPaddingY: ThemeSize;
	readonly panelPaddingX: ThemeSize;
	readonly panelPaddingY: ThemeSize;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly listHeight: number;
	readonly panelMinHeight: number;
	readonly defaultWidth: number;
	readonly tabRadius: UDim;
	readonly panelRadius: UDim;
}

export interface TabsListVisualStyles {
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
}

export interface TabsTabVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
	readonly textTransparency: number;
	readonly indicatorColor: Color3;
	readonly indicatorTransparency: number;
}

export interface TabsPanelVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
}

function resolveTabsTabRadius(theme: Theme, size: TabsSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "tabs", "xs", "radius", theme.radius.xs));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "tabs", "md", "radius", theme.radius.md));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "tabs", "sm", "radius", theme.radius.sm));
	}
}

function resolveTabsPanelRadius(theme: Theme, size: TabsSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "tabs", "sm", "radius", theme.radius.sm));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "tabs", "lg", "radius", theme.radius.lg));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "tabs", "md", "radius", theme.radius.md));
	}
}

export function resolveTabsSizeStyles(theme: Theme, size: TabsSize): TabsSizeStyles {
	switch (size) {
		case "xs":
			return {
				tabGap: 4,
				tabPaddingX: "sm",
				tabPaddingY: "xs",
				panelPaddingX: "sm",
				panelPaddingY: "sm",
				fontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				listHeight: 30,
				panelMinHeight: 76,
				defaultWidth: 320,
				tabRadius: resolveTabsTabRadius(theme, size),
				panelRadius: resolveTabsPanelRadius(theme, size),
			};
		case "sm":
			return {
				tabGap: 5,
				tabPaddingX: "md",
				tabPaddingY: "xs",
				panelPaddingX: "md",
				panelPaddingY: "sm",
				fontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				listHeight: 34,
				panelMinHeight: 86,
				defaultWidth: 380,
				tabRadius: resolveTabsTabRadius(theme, size),
				panelRadius: resolveTabsPanelRadius(theme, size),
			};
		case "lg":
			return {
				tabGap: 8,
				tabPaddingX: "lg",
				tabPaddingY: "sm",
				panelPaddingX: "lg",
				panelPaddingY: "md",
				fontSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				listHeight: 46,
				panelMinHeight: 120,
				defaultWidth: 520,
				tabRadius: resolveTabsTabRadius(theme, size),
				panelRadius: resolveTabsPanelRadius(theme, size),
			};
		case "xl":
			return {
				tabGap: 9,
				tabPaddingX: "xl",
				tabPaddingY: "md",
				panelPaddingX: "xl",
				panelPaddingY: "lg",
				fontSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				listHeight: 54,
				panelMinHeight: 140,
				defaultWidth: 600,
				tabRadius: resolveTabsTabRadius(theme, size),
				panelRadius: resolveTabsPanelRadius(theme, size),
			};
		case "md":
		default:
			return {
				tabGap: 6,
				tabPaddingX: "md",
				tabPaddingY: "sm",
				panelPaddingX: "md",
				panelPaddingY: "md",
				fontSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				listHeight: 40,
				panelMinHeight: 104,
				defaultWidth: 460,
				tabRadius: resolveTabsTabRadius(theme, size),
				panelRadius: resolveTabsPanelRadius(theme, size),
			};
	}
}

export function resolveTabsListVisualStyles(
	theme: Theme,
	variant: TabsVariant,
	color: TabsColor,
	disabled: boolean,
): TabsListVisualStyles {
	const intentColors = theme.colors[color];

	return {
		strokeColor: disabled
			? theme.colors.border.subtle
			: variant === "contained"
				? mixColor(theme.colors.border.default, intentColors.main, 0.18)
				: theme.colors.border.default,
		strokeTransparency: disabled ? 0.34 : variant === "contained" ? 0.22 : 0.28,
	};
}

export function resolveTabsTabVisualStyles(
	theme: Theme,
	variant: TabsVariant,
	color: TabsColor,
	state: TabsTabState,
): TabsTabVisualStyles {
	const intentColors = theme.colors[color];
	const containedSelectedSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.28);
	const containedHoverSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.16);
	const lineSelectedSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.24);
	const lineHoverSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.1);

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			backgroundTransparency: variant === "contained" ? 0.4 : 0.84,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.64,
			textColor: theme.colors.text.disabled,
			textTransparency: 0,
			indicatorColor: theme.colors.text.disabled,
			indicatorTransparency: 1,
		};
	}

	if (state === "selected") {
		return {
			backgroundColor: variant === "contained" ? containedSelectedSurface : lineSelectedSurface,
			backgroundTransparency: variant === "contained" ? 0 : 1,
			strokeColor:
				variant === "contained" ? mixColor(intentColors.main, theme.colors.border.default, 0.28) : intentColors.main,
			strokeTransparency: variant === "contained" ? 0.14 : 1,
			textColor: mixColor(theme.colors.text.primary, intentColors.main, variant === "contained" ? 0.42 : 0.55),
			textTransparency: 0,
			indicatorColor: intentColors.main,
			indicatorTransparency: variant === "contained" ? 1 : 0,
		};
	}

	const pressedSurface = mixColor(theme.colors.background.surface, theme.colors.action.pressed, 0.45);
	const hoveredSurface = variant === "contained" ? containedHoverSurface : lineHoverSurface;

	return {
		backgroundColor:
			state === "pressed"
				? pressedSurface
				: state === "hovered" || state === "focused"
					? hoveredSurface
					: theme.colors.background.surface,
		backgroundTransparency: state === "idle" ? 1 : variant === "line" && state !== "pressed" ? 0.18 : 0,
		strokeColor: state === "pressed" || state === "focused" ? intentColors.main : theme.colors.border.subtle,
		strokeTransparency:
			state === "idle" ? 1 : variant === "line" && state !== "pressed" ? 0.76 : state === "pressed" ? 0.18 : 0.36,
		textColor: state === "idle" ? theme.colors.text.secondary : theme.colors.text.primary,
		textTransparency: 0,
		indicatorColor: intentColors.main,
		indicatorTransparency: 1,
	};
}

export function resolveTabsPanelVisualStyles(
	theme: Theme,
	variant: TabsVariant,
	color: TabsColor,
	disabled: boolean,
): TabsPanelVisualStyles {
	const intentColors = theme.colors[color];

	return {
		backgroundColor: disabled
			? theme.colors.action.disabledBackground
			: variant === "contained"
				? mixColor(theme.colors.background.surface, intentColors.light, 0.08)
				: theme.colors.background.surface,
		backgroundTransparency: disabled ? 0.42 : variant === "contained" ? 0 : 1,
		strokeColor: disabled ? theme.colors.border.subtle : mixColor(theme.colors.border.default, intentColors.main, 0.1),
		strokeTransparency: disabled ? 0.34 : variant === "contained" ? 0.18 : 1,
	};
}

export function resolveTabsTabMotionTransition(state: TabsTabState) {
	if (state === "pressed") {
		return {
			backgroundColor: { duration: 0.06, easing: "standard" },
			backgroundTransparency: { duration: 0.06, easing: "standard" },
			strokeColor: { duration: 0.06, easing: "standard" },
			strokeTransparency: { duration: 0.06, easing: "standard" },
			textColor: { duration: 0.06, easing: "standard" },
			textTransparency: { duration: 0.06, easing: "standard" },
			indicatorColor: { duration: 0.06, easing: "standard" },
			indicatorTransparency: { duration: 0.06, easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: 0.14, easing: "standard" },
		backgroundTransparency: { duration: 0.14, easing: "standard" },
		strokeColor: { duration: 0.14, easing: "standard" },
		strokeTransparency: { duration: 0.14, easing: "standard" },
		textColor: { duration: 0.12, easing: "standard" },
		textTransparency: { duration: 0.12, easing: "standard" },
		indicatorColor: { duration: 0.12, easing: "standard" },
		indicatorTransparency: { duration: 0.12, easing: "standard" },
	} as const;
}
