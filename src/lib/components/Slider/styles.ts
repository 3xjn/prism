import type { Theme } from "@prism/theme";

import { mixColor } from "../_shared/visual";

import type { SliderColor, SliderSize } from "./types";

export type SliderInteractionState = "idle" | "hovered" | "pressed" | "disabled";

export interface SliderSizeStyles {
	readonly trackHeight: number;
	readonly thumbDiameter: number;
	readonly minHeight: number;
	readonly defaultWidth: number;
	readonly labelSize: number;
	readonly labelLineHeight: number;
}

export interface SliderVisualStyles {
	readonly trackColor: Color3;
	readonly trackStrokeColor: Color3;
	readonly trackStrokeTransparency: number;
	readonly rangeColor: Color3;
	readonly thumbColor: Color3;
	readonly thumbStrokeColor: Color3;
	readonly thumbStrokeTransparency: number;
	readonly labelColor: Color3;
	readonly valueLabelColor: Color3;
}

export function resolveSliderSizeStyles(theme: Theme, size: SliderSize): SliderSizeStyles {
	switch (size) {
		case "xs":
			return {
				trackHeight: 4,
				thumbDiameter: 12,
				minHeight: 20,
				defaultWidth: theme.spacing.xl * 7,
				labelSize: theme.fontSizes.xs,
				labelLineHeight: theme.lineHeights.xs,
			};
		case "sm":
			return {
				trackHeight: 4,
				thumbDiameter: 14,
				minHeight: 22,
				defaultWidth: theme.spacing.xl * 8,
				labelSize: theme.fontSizes.sm,
				labelLineHeight: theme.lineHeights.sm,
			};
		case "lg":
			return {
				trackHeight: 6,
				thumbDiameter: 18,
				minHeight: 28,
				defaultWidth: theme.spacing.xl * 11,
				labelSize: theme.fontSizes.lg,
				labelLineHeight: theme.lineHeights.lg,
			};
		case "xl":
			return {
				trackHeight: 8,
				thumbDiameter: 20,
				minHeight: 32,
				defaultWidth: theme.spacing.xl * 13,
				labelSize: theme.fontSizes.xl,
				labelLineHeight: theme.lineHeights.xl,
			};
		case "md":
		default:
			return {
				trackHeight: 6,
				thumbDiameter: 16,
				minHeight: 24,
				defaultWidth: theme.spacing.xl * 10,
				labelSize: theme.fontSizes.md,
				labelLineHeight: theme.lineHeights.md,
			};
	}
}

export function resolveSliderVisualStyles(
	theme: Theme,
	color: SliderColor,
	state: SliderInteractionState,
): SliderVisualStyles {
	const intentColors = theme.colors[color];
	const idleTrack = mixColor(theme.colors.background.surface, theme.colors.border.default, 0.42);
	const hoverTrack = mixColor(idleTrack, theme.colors.action.hover, 0.7);
	const pressedTrack = mixColor(idleTrack, theme.colors.action.pressed, 0.78);
	const idleRange = intentColors.main;
	const hoverRange = mixColor(intentColors.main, intentColors.dark, 0.12);
	const pressedRange = mixColor(intentColors.dark, theme.colors.action.pressed, 0.16);
	const idleThumb = intentColors.main;
	const hoverThumb = mixColor(intentColors.main, intentColors.dark, 0.1);
	const pressedThumb = intentColors.dark;
	const idleThumbStroke = mixColor(idleThumb, theme.colors.border.strong, 0.24);
	const hoverThumbStroke = mixColor(hoverThumb, theme.colors.border.strong, 0.28);
	const pressedThumbStroke = mixColor(pressedThumb, theme.colors.border.strong, 0.34);

	if (state === "disabled") {
		const disabledAccent = mixColor(theme.colors.action.disabledBackground, intentColors.light, 0.26);
		return {
			trackColor: theme.colors.action.disabledBackground,
			trackStrokeColor: theme.colors.border.subtle,
			trackStrokeTransparency: 0.12,
			rangeColor: disabledAccent,
			thumbColor: disabledAccent,
			thumbStrokeColor: mixColor(disabledAccent, theme.colors.border.default, 0.2),
			thumbStrokeTransparency: 0.2,
			labelColor: theme.colors.text.disabled,
			valueLabelColor: theme.colors.text.disabled,
		};
	}

	return {
		trackColor: state === "pressed" ? pressedTrack : state === "hovered" ? hoverTrack : idleTrack,
		trackStrokeColor: state === "pressed" ? theme.colors.border.strong : theme.colors.border.default,
		trackStrokeTransparency: state === "pressed" ? 0.04 : state === "hovered" ? 0.08 : 0.12,
		rangeColor: state === "pressed" ? pressedRange : state === "hovered" ? hoverRange : idleRange,
		thumbColor: state === "pressed" ? pressedThumb : state === "hovered" ? hoverThumb : idleThumb,
		thumbStrokeColor: state === "pressed" ? pressedThumbStroke : state === "hovered" ? hoverThumbStroke : idleThumbStroke,
		thumbStrokeTransparency: state === "pressed" ? 0.16 : state === "hovered" ? 0.22 : 0.28,
		labelColor: theme.colors.text.secondary,
		valueLabelColor: theme.colors.text.primary,
	};
}
