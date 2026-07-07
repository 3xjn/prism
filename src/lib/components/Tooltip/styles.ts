import type { Theme, ThemeShadow } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";

export interface TooltipSizeStyles {
	readonly paddingX: number;
	readonly paddingY: number;
	readonly radius: UDim;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly tailWidth: number;
	readonly tailHeight: number;
	readonly triggerMinimumSize: number;
	readonly gap: number;
}

export interface TooltipVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
	readonly tailFillColor: Color3;
	readonly tailBorderColor: Color3;
	readonly tailBorderTransparency: number;
	readonly shadow: ThemeShadow;
}

export function resolveTooltipSizeStyles(theme: Theme, gap: number | undefined): TooltipSizeStyles {
	return {
		paddingX: theme.spacing.sm,
		paddingY: theme.spacing.xs,
		radius: new UDim(0, resolveThemeSizeSafe(theme, "tooltip", "sm", "radius", theme.radius.sm)),
		fontSize: theme.fontSizes.sm,
		lineHeight: theme.lineHeights.sm,
		tailWidth: 18,
		tailHeight: 8,
		triggerMinimumSize: 1,
		gap: gap ?? theme.spacing.xs,
	};
}

export function resolveTooltipVisualStyles(theme: Theme): TooltipVisualStyles {
	// Tooltips render inverse (dark on light themes) so they separate from
	// the content they float over instead of blending into light surfaces.
	const inverseSurface = theme.colors.palette.gray["9"];

	return {
		backgroundColor: inverseSurface,
		strokeColor: inverseSurface,
		strokeTransparency: 1,
		textColor: theme.colors.text.inverse,
		tailFillColor: inverseSurface,
		tailBorderColor: inverseSurface,
		tailBorderTransparency: 1,
		shadow: theme.shadows.sm,
	};
}
