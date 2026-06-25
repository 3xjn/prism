import type { Theme, Variant } from "@prism/theme";

import { mixColor } from "../_shared/visual";

import type { InputColor } from "./types";

export type InputInteractionState = "idle" | "hovered" | "focused" | "disabled";

export interface InputVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
	readonly textColor: Color3;
	readonly placeholderColor: Color3;
}

function resolveInputPlaceholderColor(
	base: Color3,
	focus: Color3,
	hover: Color3,
	state: InputInteractionState,
): Color3 {
	if (state === "focused") {
		return focus;
	}

	if (state === "hovered") {
		return hover;
	}

	return base;
}

function resolveInputStrokeThickness(state: InputInteractionState): number {
	return state === "focused" ? 1.5 : 1;
}

function resolveInputDisabledVisualStyles(theme: Theme): InputVisualStyles {
	return {
		backgroundColor: theme.colors.action.disabledBackground,
		strokeColor: theme.colors.border.subtle,
		strokeTransparency: 0.1,
		strokeThickness: 1,
		textColor: theme.colors.text.disabled,
		placeholderColor: theme.colors.text.disabled,
	};
}

export function resolveInputVisualStyles(
	theme: Theme,
	variant: Variant,
	color: InputColor,
	state: InputInteractionState,
	readOnly: boolean,
): InputVisualStyles {
	if (state === "disabled") {
		return resolveInputDisabledVisualStyles(theme);
	}

	const intentColors = theme.colors[color];
	const idleTextColor = readOnly
		? mixColor(theme.colors.text.primary, theme.colors.text.secondary, 0.35)
		: theme.colors.text.primary;
	const placeholderBase = readOnly
		? mixColor(theme.colors.text.secondary, theme.colors.border.default, 0.3)
		: theme.colors.text.secondary;
	const hoverPlaceholder = mixColor(placeholderBase, intentColors.main, 0.12);
	const focusPlaceholder = mixColor(placeholderBase, intentColors.main, 0.34);
	const placeholderColor = resolveInputPlaceholderColor(placeholderBase, focusPlaceholder, hoverPlaceholder, state);
	const strokeThickness = resolveInputStrokeThickness(state);

	switch (variant) {
		case "subtle": {
			const idleSurface = mixColor(theme.colors.background.default, intentColors.light, readOnly ? 0.08 : 0.16);
			const hoverSurface = mixColor(idleSurface, theme.colors.background.surface, 0.45);
			const focusSurface = mixColor(idleSurface, intentColors.light, 0.2);

			return {
				backgroundColor: state === "focused" ? focusSurface : state === "hovered" ? hoverSurface : idleSurface,
				strokeColor:
					state === "focused"
						? intentColors.main
						: state === "hovered"
							? theme.colors.border.default
							: theme.colors.border.subtle,
				strokeTransparency: state === "focused" ? 0.04 : state === "hovered" ? 0.14 : 0.28,
				strokeThickness,
				textColor: idleTextColor,
				placeholderColor,
			};
		}
		case "light": {
			const idleSurface = mixColor(theme.colors.background.surface, intentColors.light, readOnly ? 0.18 : 0.3);
			const hoverSurface = mixColor(idleSurface, theme.colors.background.surface, 0.12);
			const focusSurface = mixColor(idleSurface, intentColors.main, 0.1);

			return {
				backgroundColor: state === "focused" ? focusSurface : state === "hovered" ? hoverSurface : idleSurface,
				strokeColor:
					state === "focused" ? intentColors.main : state === "hovered" ? intentColors.dark : intentColors.light,
				strokeTransparency: state === "focused" ? 0.02 : state === "hovered" ? 0.08 : 0.14,
				strokeThickness,
				textColor: idleTextColor,
				placeholderColor,
			};
		}
		case "filled": {
			const idleSurface = mixColor(theme.colors.background.surface, intentColors.light, readOnly ? 0.22 : 0.34);
			const hoverSurface = mixColor(idleSurface, intentColors.light, 0.1);
			const focusSurface = mixColor(idleSurface, intentColors.main, 0.14);

			return {
				backgroundColor: state === "focused" ? focusSurface : state === "hovered" ? hoverSurface : idleSurface,
				strokeColor:
					state === "focused"
						? intentColors.dark
						: state === "hovered"
							? intentColors.main
							: mixColor(intentColors.main, theme.colors.border.default, 0.5),
				strokeTransparency: state === "focused" ? 0.02 : state === "hovered" ? 0.08 : 0.16,
				strokeThickness,
				textColor: idleTextColor,
				placeholderColor,
			};
		}
		case "outline":
		default: {
			const idleSurface = readOnly
				? mixColor(theme.colors.background.surface, theme.colors.background.default, 0.45)
				: theme.colors.background.surface;
			const hoverSurface = readOnly
				? mixColor(idleSurface, theme.colors.action.hover, 0.35)
				: mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.55);
			const focusSurface = mixColor(theme.colors.background.surface, intentColors.light, readOnly ? 0.14 : 0.22);

			return {
				backgroundColor: state === "focused" ? focusSurface : state === "hovered" ? hoverSurface : idleSurface,
				strokeColor:
					state === "focused"
						? intentColors.main
						: state === "hovered"
							? theme.colors.border.strong
							: theme.colors.border.default,
				strokeTransparency: state === "focused" ? 0 : state === "hovered" ? 0.06 : 0.12,
				strokeThickness,
				textColor: idleTextColor,
				placeholderColor,
			};
		}
	}
}

export function resolveInputMotionTransition(state: InputInteractionState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			strokeThickness: { duration: "instant", easing: "standard" },
			textColor: { duration: "instant", easing: "standard" },
			placeholderColor: { duration: "instant", easing: "standard" },
		} as const;
	}

	if (state === "focused") {
		return {
			backgroundColor: { duration: 0.12, easing: "standard" },
			strokeColor: { duration: 0.12, easing: "standard" },
			strokeTransparency: { duration: 0.12, easing: "standard" },
			strokeThickness: { duration: 0.12, easing: "out" },
			textColor: { duration: 0.12, easing: "standard" },
			placeholderColor: { duration: 0.12, easing: "standard" },
		} as const;
	}

	if (state === "hovered") {
		return {
			backgroundColor: { duration: 0.14, easing: "standard" },
			strokeColor: { duration: 0.14, easing: "standard" },
			strokeTransparency: { duration: 0.14, easing: "standard" },
			strokeThickness: { duration: 0.14, easing: "standard" },
			textColor: { duration: 0.14, easing: "standard" },
			placeholderColor: { duration: 0.14, easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: 0.16, easing: "standard" },
		strokeColor: { duration: 0.16, easing: "standard" },
		strokeTransparency: { duration: 0.16, easing: "standard" },
		strokeThickness: { duration: 0.16, easing: "standard" },
		textColor: { duration: 0.16, easing: "standard" },
		placeholderColor: { duration: 0.16, easing: "standard" },
	} as const;
}
