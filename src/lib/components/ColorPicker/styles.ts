import type { Theme } from "@prism/theme";

import { mixColor } from "../_shared/visual";

import type { ColorPickerSize } from "./types";

export type ColorPickerInteractionState = "idle" | "hovered" | "pressed" | "selected" | "disabled";

export interface ColorPickerSizeStyles {
	readonly defaultWidth: number;
	readonly padding: number;
	readonly gap: number;
	readonly previewHeight: number;
	readonly previewSwatchSize: number;
	readonly fieldHeight: number;
	readonly hueHeight: number;
	readonly markerDiameter: number;
	readonly hueMarkerWidth: number;
	readonly radius: UDim;
	readonly fieldRadius: UDim;
	readonly fontSize: number;
}

export interface ColorPickerVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
	readonly fieldStrokeColor: Color3;
	readonly fieldStrokeTransparency: number;
	readonly fieldStrokeThickness: number;
	readonly markerRingColor: Color3;
	readonly markerStrokeColor: Color3;
	readonly hueMarkerColor: Color3;
	readonly hueMarkerStrokeColor: Color3;
	readonly labelColor: Color3;
	readonly disabledOverlayColor: Color3;
	readonly disabledOverlayTransparency: number;
}

export function resolveColorPickerSizeStyles(theme: Theme, size: ColorPickerSize): ColorPickerSizeStyles {
	switch (size) {
		case "xs":
			return {
				defaultWidth: 216,
				padding: theme.spacing.sm,
				gap: theme.spacing.sm,
				previewHeight: 30,
				previewSwatchSize: 28,
				fieldHeight: 108,
				hueHeight: 14,
				markerDiameter: 14,
				hueMarkerWidth: 4,
				radius: new UDim(0, theme.radius.sm),
				fieldRadius: new UDim(0, theme.radius.sm),
				fontSize: theme.fontSizes.xs,
			};
		case "sm":
			return {
				defaultWidth: 240,
				padding: theme.spacing.md,
				gap: theme.spacing.sm,
				previewHeight: 34,
				previewSwatchSize: 30,
				fieldHeight: 124,
				hueHeight: 16,
				markerDiameter: 16,
				hueMarkerWidth: 4,
				radius: new UDim(0, theme.radius.md),
				fieldRadius: new UDim(0, theme.radius.sm),
				fontSize: theme.fontSizes.sm,
			};
		case "lg":
			return {
				defaultWidth: 320,
				padding: theme.spacing.lg,
				gap: theme.spacing.md,
				previewHeight: 42,
				previewSwatchSize: 38,
				fieldHeight: 168,
				hueHeight: 22,
				markerDiameter: 22,
				hueMarkerWidth: 6,
				radius: new UDim(0, theme.radius.lg),
				fieldRadius: new UDim(0, theme.radius.md),
				fontSize: theme.fontSizes.lg,
			};
		case "xl":
			return {
				defaultWidth: 360,
				padding: theme.spacing.xl,
				gap: theme.spacing.md,
				previewHeight: 48,
				previewSwatchSize: 42,
				fieldHeight: 192,
				hueHeight: 24,
				markerDiameter: 24,
				hueMarkerWidth: 6,
				radius: new UDim(0, theme.radius.lg),
				fieldRadius: new UDim(0, theme.radius.md),
				fontSize: theme.fontSizes.xl,
			};
		case "md":
		default:
			return {
				defaultWidth: 272,
				padding: theme.spacing.md,
				gap: theme.spacing.md,
				previewHeight: 38,
				previewSwatchSize: 34,
				fieldHeight: 144,
				hueHeight: 18,
				markerDiameter: 18,
				hueMarkerWidth: 5,
				radius: new UDim(0, theme.radius.md),
				fieldRadius: new UDim(0, theme.radius.md),
				fontSize: theme.fontSizes.md,
			};
	}
}

export function resolveColorPickerVisualStyles(
	theme: Theme,
	state: ColorPickerInteractionState,
): ColorPickerVisualStyles {
	const activeStroke = state === "pressed" ? theme.colors.primary.dark : theme.colors.primary.main;
	const idleBackground = mixColor(theme.colors.background.surface, theme.colors.primary.light, 0.02);

	if (state === "disabled") {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.34,
			strokeThickness: 1,
			fieldStrokeColor: theme.colors.border.subtle,
			fieldStrokeTransparency: 0.28,
			fieldStrokeThickness: 1,
			markerRingColor: theme.colors.action.disabledBackground,
			markerStrokeColor: theme.colors.text.disabled,
			hueMarkerColor: theme.colors.text.disabled,
			hueMarkerStrokeColor: theme.colors.action.disabledBackground,
			labelColor: theme.colors.text.disabled,
			disabledOverlayColor: theme.colors.action.disabledBackground,
			disabledOverlayTransparency: 0.48,
		};
	}

	const active = state === "pressed" || state === "selected";
	return {
		backgroundColor: state === "hovered" ? mixColor(idleBackground, theme.colors.action.hover, 0.24) : idleBackground,
		strokeColor: active ? activeStroke : state === "hovered" ? theme.colors.border.strong : theme.colors.border.default,
		strokeTransparency: active ? 0 : state === "hovered" ? 0.08 : 0.18,
		strokeThickness: active ? 2 : 1,
		fieldStrokeColor: active
			? activeStroke
			: state === "hovered"
				? theme.colors.border.strong
				: theme.colors.border.default,
		fieldStrokeTransparency: active ? 0 : state === "hovered" ? 0.06 : 0.14,
		fieldStrokeThickness: active ? 2 : 1,
		markerRingColor: theme.colors.background.surface,
		markerStrokeColor: theme.colors.text.primary,
		hueMarkerColor: theme.colors.text.primary,
		hueMarkerStrokeColor: theme.colors.background.surface,
		labelColor: theme.colors.text.secondary,
		disabledOverlayColor: theme.colors.background.surface,
		disabledOverlayTransparency: 1,
	};
}
