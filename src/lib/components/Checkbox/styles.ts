import type { Theme } from "@prism/theme";
import { resolveDensityControlSize, resolveDensityMarkSize, resolveThemeSpacing } from "@prism/theme";

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
				markWidth: resolveDensityMarkSize(theme, 14),
				markHeight: resolveDensityMarkSize(theme, 14),
				glyphSize: resolveDensityMarkSize(theme, 9),
				labelGap: resolveThemeSpacing(theme, "xs"),
				labelSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				minHeight: resolveDensityControlSize(theme, 20),
			};
		case "sm":
			return {
				markWidth: resolveDensityMarkSize(theme, 16),
				markHeight: resolveDensityMarkSize(theme, 16),
				glyphSize: resolveDensityMarkSize(theme, 10),
				labelGap: resolveThemeSpacing(theme, "xs"),
				labelSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
				minHeight: resolveDensityControlSize(theme, 22),
			};
		case "lg":
			return {
				markWidth: resolveDensityMarkSize(theme, 20),
				markHeight: resolveDensityMarkSize(theme, 20),
				glyphSize: resolveDensityMarkSize(theme, 13),
				labelGap: resolveThemeSpacing(theme, "sm"),
				labelSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
				minHeight: resolveDensityControlSize(theme, 28),
			};
		case "xl":
			return {
				markWidth: resolveDensityMarkSize(theme, 22),
				markHeight: resolveDensityMarkSize(theme, 22),
				glyphSize: resolveDensityMarkSize(theme, 15),
				labelGap: resolveThemeSpacing(theme, "md"),
				labelSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
				minHeight: resolveDensityControlSize(theme, 32),
			};
		case "md":
		default:
			return {
				markWidth: resolveDensityMarkSize(theme, 18),
				markHeight: resolveDensityMarkSize(theme, 18),
				glyphSize: resolveDensityMarkSize(theme, 12),
				labelGap: resolveThemeSpacing(theme, "sm"),
				labelSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
				minHeight: resolveDensityControlSize(theme, 24),
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
		fillColor: checked
			? state === "pressed"
				? checkedPressedFill
				: state === "hovered"
				? checkedHoverFill
				: checkedFill
			: intentColors.main,
		fillTransparency: checked ? 0 : 1,
		glyphColor: checked ? theme.colors.text.inverse : intentColors.main,
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
			markColor: { duration: "fast", easing: "standard" },
			markStrokeColor: { duration: "fast", easing: "standard" },
			markStrokeTransparency: { duration: "fast", easing: "standard" },
			fillColor: { duration: "fast", easing: "standard" },
			fillTransparency: { duration: "fast", easing: "standard" },
			glyphColor: { duration: "fast", easing: "standard" },
			glyphTransparency: { duration: "fast", easing: "standard" },
			labelColor: { duration: "fast", easing: "standard" },
		} as const;
	}

	return {
		markColor: { duration: "normal", easing: "standard" },
		markStrokeColor: { duration: "normal", easing: "standard" },
		markStrokeTransparency: { duration: "normal", easing: "standard" },
		fillColor: { duration: "normal", easing: "standard" },
		fillTransparency: { duration: "fast", easing: "standard" },
		glyphColor: { duration: "normal", easing: "standard" },
		glyphTransparency: { duration: "fast", easing: "standard" },
		labelColor: { duration: "normal", easing: "standard" },
	} as const;
}
