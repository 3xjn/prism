import type { Theme } from "@prism/theme";
import { resolveDensityControlSize, resolveDensityGap, resolveDensityMarkSize, resolveThemeSpacing } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";

export interface WindowSizeStyles {
	readonly titleBarHeight: number;
	readonly titlePaddingX: number;
	readonly titleGap: number;
	readonly titleSize: number;
	readonly titleLineHeight: number;
	readonly controlSize: number;
	readonly iconSize: number;
	readonly radius: UDim;
	readonly viewportMargin: number;
	readonly resizeHandleSize: number;
	readonly collapseControlSize: number;
	readonly bodyPadding: number;
	readonly railMinWidth: number;
}

export function resolveWindowSizeStyles(theme: Theme): WindowSizeStyles {
	const titleBarHeight = resolveDensityControlSize(theme, 36);
	const controlSize = resolveDensityControlSize(theme, 28);
	const titleGap = resolveDensityGap(theme, resolveThemeSpacing(theme, "sm"));

	return {
		titleBarHeight,
		titlePaddingX: resolveThemeSpacing(theme, "sm"),
		titleGap,
		titleSize: theme.fontSizes.sm,
		titleLineHeight: theme.lineHeights.sm,
		controlSize,
		iconSize: resolveDensityMarkSize(theme, 16),
		radius: new UDim(0, resolveThemeSizeSafe(theme, "window", "md", "radius", theme.radius.md)),
		viewportMargin: resolveThemeSpacing(theme, "md"),
		resizeHandleSize: resolveDensityMarkSize(theme, 16),
		collapseControlSize: resolveDensityControlSize(theme, 40),
		bodyPadding: resolveThemeSpacing(theme, "md"),
		railMinWidth: resolveDensityControlSize(theme, 48),
	};
}
