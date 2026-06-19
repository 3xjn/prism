import type { SemanticIntent, Theme, ThemeSize } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { MenuSize } from "./types";

export type MenuItemState = "idle" | "hovered" | "pressed" | "disabled";

export interface MenuSizeStyles {
	readonly panelWidth: number;
	readonly listPadding: ThemeSize;
	readonly itemPaddingX: ThemeSize;
	readonly itemPaddingY: ThemeSize;
	readonly itemGap: number;
	readonly itemHeight: number;
	readonly labelHeight: number;
	readonly dividerHeight: number;
	readonly dividerInset: number;
	readonly labelPaddingX: ThemeSize;
	readonly labelLetterSpacing: number;
	readonly radius: UDim;
	readonly itemRadius: UDim;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly metaFontSize: number;
	readonly iconSize: number;
	readonly scrollBarThickness: number;
}

export interface MenuPanelVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly dividerColor: Color3;
	readonly dividerTransparency: number;
	readonly labelColor: Color3;
	readonly labelTransparency: number;
}

export interface MenuItemVisualStyles {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly textColor: Color3;
	readonly textTransparency: number;
	readonly rightTextColor: Color3;
	readonly rightTextTransparency: number;
}

function resolveMenuRadius(theme: Theme, size: MenuSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "menu", "sm", "radius", theme.radius.sm));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "menu", "lg", "radius", theme.radius.lg));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "menu", "md", "radius", theme.radius.md));
	}
}

function resolveMenuItemRadius(theme: Theme, size: MenuSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "menu", "sm", "radius", theme.radius.xs));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "menu", "md", "radius", theme.radius.md));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "menu", "sm", "radius", theme.radius.sm));
	}
}

export function resolveMenuSizeStyles(theme: Theme, size: MenuSize): MenuSizeStyles {
	switch (size) {
		case "xs":
			return {
				panelWidth: theme.spacing.xl * 6,
				listPadding: "xs",
				itemPaddingX: "sm",
				itemPaddingY: "xs",
				itemGap: theme.spacing.xs,
				itemHeight: theme.spacing.xl + theme.spacing.xs,
				labelHeight: theme.spacing.lg,
				dividerHeight: theme.spacing.sm,
				dividerInset: theme.spacing.sm,
				labelPaddingX: "sm",
				labelLetterSpacing: 0.04,
				radius: resolveMenuRadius(theme, size),
				itemRadius: resolveMenuItemRadius(theme, size),
				fontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				metaFontSize: theme.fontSizes.xs,
				iconSize: 14,
				scrollBarThickness: theme.spacing.xs,
			};
		case "sm":
			return {
				panelWidth: theme.spacing.xl * 7,
				listPadding: "xs",
				itemPaddingX: "md",
				itemPaddingY: "xs",
				itemGap: theme.spacing.xs,
				itemHeight: theme.spacing.xl + theme.spacing.sm,
				labelHeight: theme.spacing.xl,
				dividerHeight: theme.spacing.sm,
				dividerInset: theme.spacing.md,
				labelPaddingX: "md",
				labelLetterSpacing: 0.04,
				radius: resolveMenuRadius(theme, size),
				itemRadius: resolveMenuItemRadius(theme, size),
				fontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				metaFontSize: theme.fontSizes.xs,
				iconSize: 16,
				scrollBarThickness: theme.spacing.xs,
			};
		case "lg":
			return {
				panelWidth: theme.spacing.xl * 10,
				listPadding: "sm",
				itemPaddingX: "lg",
				itemPaddingY: "sm",
				itemGap: theme.spacing.sm,
				itemHeight: theme.spacing.xl + theme.spacing.lg,
				labelHeight: theme.spacing.xl + theme.spacing.xs,
				dividerHeight: theme.spacing.md,
				dividerInset: theme.spacing.lg,
				labelPaddingX: "lg",
				labelLetterSpacing: 0.035,
				radius: resolveMenuRadius(theme, size),
				itemRadius: resolveMenuItemRadius(theme, size),
				fontSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				metaFontSize: theme.fontSizes.sm,
				iconSize: 20,
				scrollBarThickness: theme.spacing.xs,
			};
		case "xl":
			return {
				panelWidth: theme.spacing.xl * 12,
				listPadding: "sm",
				itemPaddingX: "xl",
				itemPaddingY: "sm",
				itemGap: theme.spacing.sm,
				itemHeight: theme.spacing.xl * 2,
				labelHeight: theme.spacing.xl + theme.spacing.sm,
				dividerHeight: theme.spacing.md,
				dividerInset: theme.spacing.lg,
				labelPaddingX: "xl",
				labelLetterSpacing: 0.035,
				radius: resolveMenuRadius(theme, size),
				itemRadius: resolveMenuItemRadius(theme, size),
				fontSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				metaFontSize: theme.fontSizes.sm,
				iconSize: 22,
				scrollBarThickness: theme.spacing.xs,
			};
		case "md":
		default:
			return {
				panelWidth: theme.spacing.xl * 8,
				listPadding: "xs",
				itemPaddingX: "md",
				itemPaddingY: "sm",
				itemGap: theme.spacing.xs,
				itemHeight: theme.spacing.xl + theme.spacing.md,
				labelHeight: theme.spacing.xl,
				dividerHeight: theme.spacing.md,
				dividerInset: theme.spacing.md,
				labelPaddingX: "md",
				labelLetterSpacing: 0.04,
				radius: resolveMenuRadius(theme, size),
				itemRadius: resolveMenuItemRadius(theme, size),
				fontSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				metaFontSize: theme.fontSizes.xs,
				iconSize: 18,
				scrollBarThickness: theme.spacing.xs,
			};
	}
}

export function resolveMenuPanelVisualStyles(theme: Theme): MenuPanelVisualStyles {
	const tintedSurface = mixColor(theme.colors.background.surface, theme.colors.primary.light, 0.08);

	return {
		backgroundColor: tintedSurface,
		strokeColor: mixColor(theme.colors.border.default, theme.colors.primary.main, 0.12),
		strokeTransparency: 0.06,
		dividerColor: mixColor(theme.colors.border.subtle, theme.colors.primary.light, 0.24),
		dividerTransparency: 0.18,
		labelColor: mixColor(theme.colors.text.secondary, theme.colors.primary.main, 0.18),
		labelTransparency: 0.08,
	};
}

export function resolveMenuItemVisualStyles(
	theme: Theme,
	color: SemanticIntent | undefined,
	state: MenuItemState,
): MenuItemVisualStyles {
	const intentColors = color !== undefined ? theme.colors[color] : undefined;
	const baseSurface = mixColor(theme.colors.background.surface, theme.colors.primary.light, 0.06);
	const hoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.82);
	const pressedSurface = mixColor(hoverSurface, theme.colors.action.pressed, 0.5);
	const idleTextColor = intentColors?.main ?? theme.colors.text.primary;
	const hoveredTextColor = intentColors?.dark ?? theme.colors.text.primary;
	const rightTextColor = theme.colors.text.secondary;

	if (state === "disabled") {
		return {
			backgroundColor: baseSurface,
			backgroundTransparency: 1,
			textColor: theme.colors.text.disabled,
			textTransparency: 0,
			rightTextColor: theme.colors.text.disabled,
			rightTextTransparency: 0,
		};
	}

	if (state === "pressed") {
		return {
			backgroundColor: pressedSurface,
			backgroundTransparency: 0,
			textColor: hoveredTextColor,
			textTransparency: 0,
			rightTextColor,
			rightTextTransparency: 0,
		};
	}

	if (state === "hovered") {
		return {
			backgroundColor: hoverSurface,
			backgroundTransparency: 0,
			textColor: hoveredTextColor,
			textTransparency: 0,
			rightTextColor,
			rightTextTransparency: 0,
		};
	}

	return {
		backgroundColor: baseSurface,
		backgroundTransparency: 1,
		textColor: idleTextColor,
		textTransparency: 0,
		rightTextColor,
		rightTextTransparency: 0,
	};
}

export function resolveMenuItemMotionTransition(state: MenuItemState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			backgroundTransparency: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			textTransparency: { duration: "instant", easing: "standard" },
			rightTextColor: { duration: "instant", easing: "standard" },
			rightTextTransparency: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "pressed") {
		return {
			backgroundColor: { duration: 0.06, easing: "standard" },
			backgroundTransparency: { duration: 0.06, easing: "standard" },
			textColor: { duration: 0.06, easing: "standard" },
			textTransparency: { duration: 0.06, easing: "standard" },
			rightTextColor: { duration: 0.06, easing: "standard" },
			rightTextTransparency: { duration: 0.06, easing: "standard" },
		} as const;
	}

	if (state === "hovered") {
		return {
			backgroundColor: { duration: 0.12, easing: "standard" },
			backgroundTransparency: { duration: 0.12, easing: "standard" },
			textColor: { duration: 0.12, easing: "standard" },
			textTransparency: { duration: 0.12, easing: "standard" },
			rightTextColor: { duration: 0.12, easing: "standard" },
			rightTextTransparency: { duration: 0.12, easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: 0.14, easing: "standard" },
		backgroundTransparency: { duration: 0.14, easing: "standard" },
		textColor: { duration: 0.14, easing: "standard" },
		textTransparency: { duration: 0.14, easing: "standard" },
		rightTextColor: { duration: 0.14, easing: "standard" },
		rightTextTransparency: { duration: 0.14, easing: "standard" },
	} as const;
}
