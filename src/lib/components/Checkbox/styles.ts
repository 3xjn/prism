import type { Theme } from "@prism/theme";

import { resolveHigherContrastColor, resolveReadableColor } from "../../theme/contrast";
import type { InteractionState } from "../_shared/usePressInteraction";
import { mixColor } from "../_shared/visual";

import type { CheckboxColor, CheckboxSize } from "./types";

export type CheckboxInteractionState = InteractionState;

export interface CheckboxSizeStyles {
	readonly markWidth: number;
	readonly markHeight: number;
	readonly glyphSize: number;
	readonly labelGap: number;
	readonly labelSize: number;
	readonly lineHeight: number;
	readonly minHeight: number;
}

export interface CheckboxVisualStyles {
	readonly markColor: Color3;
	readonly markStrokeColor: Color3;
	readonly markStrokeTransparency: number;
	readonly fillColor: Color3;
	readonly fillTransparency: number;
	readonly glyphColor: Color3;
	readonly glyphTransparency: number;
	readonly labelColor: Color3;
}

export function resolveCheckboxSizeStyles(theme: Theme, size: CheckboxSize): CheckboxSizeStyles {
	switch (size) {
		case "xs":
			return {
				markWidth: 14,
				markHeight: 14,
				glyphSize: 9,
				labelGap: theme.spacing.xs,
				labelSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				minHeight: 20,
			};
		case "sm":
			return {
				markWidth: 16,
				markHeight: 16,
				glyphSize: 10,
				labelGap: theme.spacing.xs,
				labelSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				minHeight: 22,
			};
		case "lg":
			return {
				markWidth: 20,
				markHeight: 20,
				glyphSize: 13,
				labelGap: theme.spacing.sm,
				labelSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				minHeight: 28,
			};
		case "xl":
			return {
				markWidth: 22,
				markHeight: 22,
				glyphSize: 15,
				labelGap: theme.spacing.md,
				labelSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				minHeight: 32,
			};
		case "md":
		default:
			return {
				markWidth: 18,
				markHeight: 18,
				glyphSize: 12,
				labelGap: theme.spacing.sm,
				labelSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				minHeight: 24,
			};
	}
}

export function resolveCheckboxVisualStyles(
	theme: Theme,
	color: CheckboxColor,
	state: CheckboxInteractionState,
	checked: boolean,
): CheckboxVisualStyles {
	const intentColors = theme.colors[color];
	const idleMark = mixColor(theme.colors.background.surface, theme.colors.border.default, 0.18);
	const hoverMark = mixColor(idleMark, theme.colors.action.hover, 0.65);
	const pressedMark = mixColor(idleMark, theme.colors.action.pressed, 0.85);
	const uncheckedStroke = theme.colors.border.default;
	const uncheckedInteractiveStroke = mixColor(theme.colors.border.strong, theme.colors.background.surface, 0.12);
	const checkedStroke = mixColor(intentColors.dark, theme.colors.background.surface, 0.24);
	const checkedFill = mixColor(intentColors.main, theme.colors.background.surface, 0.04);
	const checkedHoverFill = mixColor(intentColors.main, intentColors.dark, 0.14);
	const checkedPressedFill = mixColor(intentColors.dark, theme.colors.action.pressed, 0.14);
	const checkedStateFill = state === "pressed" ? checkedPressedFill : state === "hovered" ? checkedHoverFill : checkedFill;
	const alternateGlyphColor = resolveHigherContrastColor(
		checkedStateFill,
		theme.colors.text.primary,
		theme.colors.text.inverse,
	);
	const checkedGlyphColor = resolveReadableColor(checkedStateFill, intentColors.contrast, alternateGlyphColor);

	if (state === "disabled") {
		return {
			markColor: theme.colors.action.disabledBackground,
			markStrokeColor: checked ? intentColors.light : theme.colors.border.subtle,
			markStrokeTransparency: checked ? 0.26 : 0.16,
			fillColor: checked ? mixColor(theme.colors.action.disabledBackground, intentColors.light, 0.28) : theme.colors.action.disabledBackground,
			fillTransparency: checked ? 0 : 1,
			glyphColor: theme.colors.text.disabled,
			glyphTransparency: checked ? 0.08 : 1,
			labelColor: theme.colors.text.disabled,
		};
	}

	return {
		markColor: checked ? checkedFill : state === "pressed" ? pressedMark : state === "hovered" ? hoverMark : idleMark,
		markStrokeColor: checked ? checkedStroke : state === "hovered" || state === "pressed" ? uncheckedInteractiveStroke : uncheckedStroke,
		markStrokeTransparency: checked ? (state === "pressed" ? 0.08 : 0.14) : state === "hovered" ? 0.06 : 0.12,
		fillColor: checked ? checkedStateFill : intentColors.main,
		fillTransparency: checked ? 0 : 1,
		glyphColor: checked ? checkedGlyphColor : intentColors.main,
		glyphTransparency: checked ? 0 : 1,
		labelColor: theme.colors.text.primary,
	};
}

export function resolveCheckboxMotionTransition(state: CheckboxInteractionState) {
	if (state === "disabled") {
		return {
			markColor: { duration: "instant", easing: "standard" },
			markStrokeColor: { duration: "instant", easing: "standard" },
			markStrokeTransparency: { duration: "instant", easing: "standard" },
			fillColor: { duration: "instant", easing: "standard" },
			fillTransparency: { duration: "instant", easing: "standard" },
			glyphColor: { duration: "instant", easing: "standard" },
			glyphTransparency: { duration: "instant", easing: "standard" },
			labelColor: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "pressed") {
		return {
			markColor: { duration: 0.06, easing: "standard" },
			markStrokeColor: { duration: 0.06, easing: "standard" },
			markStrokeTransparency: { duration: 0.06, easing: "standard" },
			fillColor: { duration: 0.06, easing: "standard" },
			fillTransparency: { duration: 0.06, easing: "standard" },
			glyphColor: { duration: 0.06, easing: "standard" },
			glyphTransparency: { duration: 0.06, easing: "standard" },
			labelColor: { duration: 0.06, easing: "standard" },
		} as const;
	}

	return {
		markColor: { duration: 0.14, easing: "standard" },
		markStrokeColor: { duration: 0.14, easing: "standard" },
		markStrokeTransparency: { duration: 0.14, easing: "standard" },
		fillColor: { duration: 0.14, easing: "standard" },
		fillTransparency: { duration: 0.12, easing: "standard" },
		glyphColor: { duration: 0.14, easing: "standard" },
		glyphTransparency: { duration: 0.1, easing: "standard" },
		labelColor: { duration: 0.14, easing: "standard" },
	} as const;
}
