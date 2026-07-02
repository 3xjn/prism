import type { Theme, ThemeShadow } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";

export interface PopoverSizeStyles {
	readonly radius: UDim;
	readonly paddingX: number;
	readonly paddingY: number;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly gap: number;
}

export interface PopoverVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
	readonly textColor: Color3;
	readonly shadow: ThemeShadow;
}

export function resolvePopoverSizeStyles(theme: Theme, gap: number | undefined): PopoverSizeStyles {
	return {
		radius: new UDim(0, resolveThemeSizeSafe(theme, "popover", "md", "radius", theme.radius.md)),
		paddingX: theme.spacing.md,
		paddingY: theme.spacing.sm,
		fontSize: theme.fontSizes.sm,
		lineHeight: theme.lineHeights.sm,
		gap: gap ?? theme.spacing.xs,
	};
}

export function resolvePopoverVisualStyles(theme: Theme): PopoverVisualStyles {
	return {
		backgroundColor: theme.colors.background.surface,
		strokeColor: theme.colors.border.default,
		strokeTransparency: 0.12,
		strokeThickness: 1,
		textColor: theme.colors.text.primary,
		shadow: theme.shadows.md,
	};
}
