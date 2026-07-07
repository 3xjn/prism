import type { Theme } from "@prism/theme";

import { mixColor } from "../_shared/visual";

import type { CircularProgressColor, CircularProgressSize, CircularProgressVariant } from "./types";

export interface CircularProgressSizeStyles {
	readonly diameter: number;
	readonly thickness: number;
	readonly segmentLength: number;
	readonly labelSize: number;
	readonly valueLabelSize: number;
	readonly lineHeight: number;
}

export interface CircularProgressVisualStyles {
	readonly trackColor: Color3;
	readonly trackTransparency: number;
	readonly fillColor: Color3;
	readonly fillTailColor: Color3;
	readonly labelColor: Color3;
	readonly valueLabelColor: Color3;
}

export function resolveCircularProgressSizeStyles(theme: Theme, size: CircularProgressSize): CircularProgressSizeStyles {
	switch (size) {
		case "xs":
			return {
				diameter: 28,
				thickness: 3,
				segmentLength: 4,
				labelSize: theme.fontSizes.xs,
				valueLabelSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
			};
		case "sm":
			return {
				diameter: 36,
				thickness: 4,
				segmentLength: 5,
				labelSize: theme.fontSizes.xs,
				valueLabelSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
			};
		case "lg":
			return {
				diameter: 64,
				thickness: 6,
				segmentLength: 8,
				labelSize: theme.fontSizes.sm,
				valueLabelSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
			};
		case "xl":
			return {
				diameter: 80,
				thickness: 7,
				segmentLength: 10,
				labelSize: theme.fontSizes.md,
				valueLabelSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
			};
		case "md":
		default:
			return {
				diameter: 48,
				thickness: 5,
				segmentLength: 6,
				labelSize: theme.fontSizes.xs,
				valueLabelSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
			};
	}
}

export function resolveCircularProgressVisualStyles(
	theme: Theme,
	variant: CircularProgressVariant,
	color: CircularProgressColor,
): CircularProgressVisualStyles {
	const intentColors = theme.colors[color];
	const neutralTrack = mixColor(theme.colors.background.default, theme.colors.border.default, 0.22);
	const softTrack = mixColor(theme.colors.background.surface, intentColors.light, 0.16);

	switch (variant) {
		case "filled":
			return {
				trackColor: neutralTrack,
				trackTransparency: 0.04,
				fillColor: intentColors.main,
				fillTailColor: intentColors.light,
				labelColor: theme.colors.text.secondary,
				valueLabelColor: theme.colors.text.primary,
			};
		case "light":
			return {
				trackColor: softTrack,
				trackTransparency: 0.1,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.06),
				fillTailColor: intentColors.light,
				labelColor: theme.colors.text.secondary,
				valueLabelColor: intentColors.dark,
			};
		case "subtle":
			return {
				trackColor: mixColor(theme.colors.background.default, intentColors.light, 0.08),
				trackTransparency: 0.18,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.16),
				fillTailColor: mixColor(intentColors.light, theme.colors.background.surface, 0.08),
				labelColor: theme.colors.text.secondary,
				valueLabelColor: theme.colors.text.primary,
			};
		case "outline":
		default:
			return {
				trackColor: neutralTrack,
				trackTransparency: 0.08,
				fillColor: intentColors.main,
				fillTailColor: mixColor(intentColors.light, intentColors.main, 0.18),
				labelColor: theme.colors.text.secondary,
				valueLabelColor: theme.colors.text.primary,
			};
	}
}

export function resolveCircularProgressMotionTransition() {
	return {
		percent: { duration: "normal", easing: "out" },
	} as const;
}
