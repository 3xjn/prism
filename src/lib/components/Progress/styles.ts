import type { Theme } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { ProgressColor, ProgressRadiusValue, ProgressSize, ProgressVariant } from "./types";

export interface ProgressSizeStyles {
	readonly trackHeight: number;
	readonly defaultWidth: number;
	readonly labelSize: number;
	readonly labelLineHeight: number;
	readonly labelGap: number;
}

export interface ProgressVisualStyles {
	readonly trackColor: Color3;
	readonly trackStrokeColor: Color3;
	readonly trackStrokeTransparency: number;
	readonly fillColor: Color3;
	readonly labelColor: Color3;
	readonly valueLabelColor: Color3;
}

export function resolveProgressSizeStyles(theme: Theme, size: ProgressSize): ProgressSizeStyles {
	switch (size) {
		case "xs":
			return {
				trackHeight: 6,
				defaultWidth: theme.spacing.xl * 7,
				labelSize: theme.fontSizes.xs,
				labelLineHeight: theme.lineHeights.xs,
				labelGap: theme.spacing.xs,
			};
		case "sm":
			return {
				trackHeight: 8,
				defaultWidth: theme.spacing.xl * 8,
				labelSize: theme.fontSizes.sm,
				labelLineHeight: theme.lineHeights.sm,
				labelGap: theme.spacing.xs,
			};
		case "lg":
			return {
				trackHeight: 14,
				defaultWidth: theme.spacing.xl * 11,
				labelSize: theme.fontSizes.lg,
				labelLineHeight: theme.lineHeights.lg,
				labelGap: theme.spacing.sm,
			};
		case "xl":
			return {
				trackHeight: 18,
				defaultWidth: theme.spacing.xl * 13,
				labelSize: theme.fontSizes.xl,
				labelLineHeight: theme.lineHeights.xl,
				labelGap: theme.spacing.sm,
			};
		case "md":
		default:
			return {
				trackHeight: 11,
				defaultWidth: theme.spacing.xl * 10,
				labelSize: theme.fontSizes.md,
				labelLineHeight: theme.lineHeights.md,
				labelGap: theme.spacing.xs,
			};
	}
}

export function resolveProgressRadius(theme: Theme, size: ProgressSize, radius: ProgressRadiusValue | undefined): UDim {
	if (radius === undefined) {
		return new UDim(0.5, 0);
	}

	if (typeIs(radius, "number")) {
		return new UDim(0, radius);
	}

	if (typeIs(radius, "UDim")) {
		return radius;
	}

	return new UDim(0, resolveThemeSizeSafe(theme, "progress", radius, "radius", resolveThemeSizeSafe(theme, "progress", size, "radius", theme.radius.sm)));
}

export function resolveProgressVisualStyles(theme: Theme, variant: ProgressVariant, color: ProgressColor): ProgressVisualStyles {
	const intentColors = theme.colors[color];
	const surfaceTrack = mixColor(theme.colors.background.default, theme.colors.border.default, 0.22);
	const recessedTrack = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.54);
	const lightTrack = mixColor(theme.colors.background.surface, intentColors.light, 0.2);
	const subtleTrack = mixColor(theme.colors.background.default, intentColors.light, 0.12);

	switch (variant) {
		case "filled":
			return {
				trackColor: recessedTrack,
				trackStrokeColor: mixColor(theme.colors.border.default, theme.colors.background.surface, 0.24),
				trackStrokeTransparency: 0.16,
				fillColor: intentColors.main,
				labelColor: theme.colors.text.primary,
				valueLabelColor: theme.colors.text.secondary,
			};
		case "light":
			return {
				trackColor: lightTrack,
				trackStrokeColor: mixColor(intentColors.light, theme.colors.background.surface, 0.34),
				trackStrokeTransparency: 0.2,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.08),
				labelColor: theme.colors.text.primary,
				valueLabelColor: intentColors.dark,
			};
		case "subtle":
			return {
				trackColor: subtleTrack,
				trackStrokeColor: mixColor(theme.colors.border.subtle, theme.colors.background.surface, 0.18),
				trackStrokeTransparency: 0.34,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.18),
				labelColor: theme.colors.text.primary,
				valueLabelColor: theme.colors.text.secondary,
			};
		case "outline":
		default:
			return {
				trackColor: surfaceTrack,
				trackStrokeColor: theme.colors.border.default,
				trackStrokeTransparency: 0.1,
				fillColor: intentColors.main,
				labelColor: theme.colors.text.primary,
				valueLabelColor: theme.colors.text.secondary,
			};
	}
}

export function resolveProgressMotionTransition() {
	return {
		percent: { duration: "normal", easing: "out" },
	} as const;
}
