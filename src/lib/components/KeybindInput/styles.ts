import type { SemanticIntent, Theme, ThemeSize, Variant } from "@prism/theme";

import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { KeybindInputSize } from "./types";

export type KeybindInputInteractionState = "idle" | "hovered" | "pressed" | "capturing" | "disabled" | "readOnly";

export interface KeybindInputSizeStyles {
	readonly paddingX: ThemeSize;
	readonly paddingY: ThemeSize;
	readonly gap: number;
	readonly deviceFrameSize: number;
	readonly deviceIconSize: number;
	readonly gamepadGlyphSize: number;
	readonly keycapPaddingX: number;
	readonly fontSize: number;
	readonly hintFontSize: number;
	readonly lineHeight: number;
	readonly radius: UDim;
	readonly minHeight: number;
	readonly defaultWidth: number;
}

export interface KeybindInputVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
	readonly labelColor: Color3;
	readonly labelTransparency: number;
	readonly hintColor: Color3;
	readonly hintTransparency: number;
	readonly deviceBackgroundColor: Color3;
	readonly deviceBackgroundTransparency: number;
	readonly deviceIconColor: Color3;
	readonly keycapBackgroundColor: Color3;
	readonly keycapBackgroundTransparency: number;
	readonly keycapStrokeColor: Color3;
	readonly keycapStrokeTransparency: number;
	readonly keycapStrokeThickness: number;
}

function resolveKeybindInputRadius(theme: Theme, size: KeybindInputSize): UDim {
	switch (size) {
		case "xs":
		case "sm":
			return new UDim(0, resolveThemeSizeSafe(theme, "keybindInput", "sm", "radius", theme.radius.sm));
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "keybindInput", "md", "radius", theme.radius.md));
		case "md":
		default:
			return new UDim(0, resolveThemeSizeSafe(theme, "keybindInput", "sm", "radius", theme.radius.sm));
	}
}

export function resolveKeybindInputSizeStyles(theme: Theme, size: KeybindInputSize): KeybindInputSizeStyles {
	switch (size) {
		case "xs":
			return {
				paddingX: "sm",
				paddingY: "xs",
				gap: theme.spacing.xs,
				deviceFrameSize: 22,
				deviceIconSize: 14,
				gamepadGlyphSize: 18,
				keycapPaddingX: theme.spacing.xs,
				fontSize: theme.fontSizes.xs,
				hintFontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
				radius: resolveKeybindInputRadius(theme, size),
				minHeight: 36,
				defaultWidth: 128,
			};
		case "sm":
			return {
				paddingX: "md",
				paddingY: "xs",
				gap: theme.spacing.xs,
				deviceFrameSize: 24,
				deviceIconSize: 16,
				gamepadGlyphSize: 20,
				keycapPaddingX: theme.spacing.sm,
				fontSize: theme.fontSizes.sm,
				hintFontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.sm,
				radius: resolveKeybindInputRadius(theme, size),
				minHeight: 44,
				defaultWidth: 150,
			};
		case "lg":
			return {
				paddingX: "lg",
				paddingY: "sm",
				gap: theme.spacing.sm,
				deviceFrameSize: 28,
				deviceIconSize: 23,
				gamepadGlyphSize: 27,
				keycapPaddingX: theme.spacing.md,
				fontSize: theme.fontSizes.lg,
				hintFontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.lg,
				radius: resolveKeybindInputRadius(theme, size),
				minHeight: 56,
				defaultWidth: 182,
			};
		case "xl":
			return {
				paddingX: "xl",
				paddingY: "md",
				gap: theme.spacing.sm,
				deviceFrameSize: 30,
				deviceIconSize: 24,
				gamepadGlyphSize: 30,
				keycapPaddingX: theme.spacing.md,
				fontSize: theme.fontSizes.xl,
				hintFontSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.xl,
				radius: resolveKeybindInputRadius(theme, size),
				minHeight: 64,
				defaultWidth: 208,
			};
		case "md":
		default:
			return {
				paddingX: "md",
				paddingY: "sm",
				gap: theme.spacing.sm,
				deviceFrameSize: 26,
				deviceIconSize: 19,
				gamepadGlyphSize: 23,
				keycapPaddingX: theme.spacing.sm,
				fontSize: theme.fontSizes.md,
				hintFontSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.md,
				radius: resolveKeybindInputRadius(theme, size),
				minHeight: 50,
				defaultWidth: 168,
			};
	}
}

export function resolveKeybindInputVisualStyles(
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	state: KeybindInputInteractionState,
	hasValue: boolean,
): KeybindInputVisualStyles {
	const intentColors = theme.colors[color];
	const disabled = state === "disabled";
	const readOnly = state === "readOnly";
	const active = state === "capturing";
	const hovered = state === "hovered";
	const pressed = state === "pressed";
	const placeholderColor = mixColor(theme.colors.text.secondary, theme.colors.background.surface, 0.16);
	const labelColor = disabled
		? theme.colors.text.disabled
		: active
			? intentColors.main
			: hasValue
				? theme.colors.text.primary
				: placeholderColor;
	const hintColor = disabled ? theme.colors.text.disabled : active ? intentColors.main : theme.colors.text.secondary;
	const outlineIdleSurface = readOnly
		? mixColor(theme.colors.background.surface, theme.colors.background.default, 0.45)
		: mixColor(theme.colors.background.surface, theme.colors.background.default, 0.18);
	const outlineHoverSurface = mixColor(outlineIdleSurface, theme.colors.action.hover, 0.42);
	const outlinePressedSurface = mixColor(outlineHoverSurface, theme.colors.action.pressed, 0.45);
	const outlineActiveSurface = mixColor(outlineIdleSurface, intentColors.light, 0.14);
	const subtleIdleSurface = mixColor(theme.colors.background.default, intentColors.light, readOnly ? 0.08 : 0.16);
	const subtleHoverSurface = mixColor(subtleIdleSurface, theme.colors.background.surface, 0.45);
	const subtleActiveSurface = mixColor(subtleIdleSurface, intentColors.light, 0.22);
	const lightIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, readOnly ? 0.18 : 0.3);
	const lightHoverSurface = mixColor(lightIdleSurface, theme.colors.background.surface, 0.12);
	const lightActiveSurface = mixColor(lightIdleSurface, intentColors.main, 0.1);
	const filledIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, readOnly ? 0.22 : 0.34);
	const filledHoverSurface = mixColor(filledIdleSurface, intentColors.light, 0.1);
	const filledActiveSurface = mixColor(filledIdleSurface, intentColors.main, 0.14);

	if (disabled) {
		return {
			backgroundColor: theme.colors.action.disabledBackground,
			strokeColor: theme.colors.border.subtle,
			strokeTransparency: 0.1,
			strokeThickness: 1,
			labelColor,
			labelTransparency: 0,
			hintColor,
			hintTransparency: 0,
			deviceBackgroundColor: theme.colors.action.disabledBackground,
			deviceBackgroundTransparency: 1,
			deviceIconColor: theme.colors.text.disabled,
			keycapBackgroundColor: theme.colors.action.disabledBackground,
			keycapBackgroundTransparency: 0,
			keycapStrokeColor: theme.colors.border.subtle,
			keycapStrokeTransparency: 0.16,
			keycapStrokeThickness: 1,
		};
	}

	let backgroundColor = outlineIdleSurface;
	let strokeColor = theme.colors.border.default;
	let strokeTransparency = 0.12;
	let strokeThickness = 1;

	switch (variant) {
		case "subtle":
			backgroundColor = active ? subtleActiveSurface : hovered || pressed ? subtleHoverSurface : subtleIdleSurface;
			strokeColor = active ? intentColors.main : hovered ? theme.colors.border.default : theme.colors.border.subtle;
			strokeTransparency = active ? 0.04 : hovered ? 0.14 : 0.28;
			strokeThickness = active ? 1.5 : 1;
			break;
		case "light":
			backgroundColor = active ? lightActiveSurface : hovered || pressed ? lightHoverSurface : lightIdleSurface;
			strokeColor = active ? intentColors.main : hovered ? intentColors.dark : intentColors.light;
			strokeTransparency = active ? 0.02 : hovered ? 0.08 : 0.14;
			strokeThickness = active ? 1.5 : 1;
			break;
		case "filled":
			backgroundColor = active ? filledActiveSurface : hovered || pressed ? filledHoverSurface : filledIdleSurface;
			strokeColor = active
				? intentColors.dark
				: hovered
					? intentColors.main
					: mixColor(intentColors.main, theme.colors.border.default, 0.5);
			strokeTransparency = active ? 0.02 : hovered ? 0.08 : 0.16;
			strokeThickness = active ? 1.5 : 1;
			break;
		case "outline":
		default:
			backgroundColor = active
				? outlineActiveSurface
				: pressed
					? outlinePressedSurface
					: hovered
						? outlineHoverSurface
						: outlineIdleSurface;
			strokeColor = active
				? intentColors.main
				: hovered
					? mixColor(theme.colors.border.strong, intentColors.main, 0.1)
					: mixColor(theme.colors.border.default, theme.colors.background.surface, 0.08);
			strokeTransparency = active ? 0 : hovered ? 0.08 : 0.18;
			strokeThickness = active ? 2 : 1;
			break;
	}

	const keycapBackgroundColor = active
		? outlineActiveSurface
		: pressed
			? mixColor(backgroundColor, theme.colors.action.pressed, 0.28)
			: hovered
				? outlineHoverSurface
				: backgroundColor;
	const keycapStrokeColor = active
		? intentColors.main
		: hovered
			? strokeColor
			: mixColor(strokeColor, theme.colors.background.surface, 0.16);
	const deviceBackgroundColor = backgroundColor;
	const deviceIconColor = active
		? intentColors.main
		: hasValue
			? mixColor(theme.colors.text.secondary, theme.colors.text.primary, 0.24)
			: placeholderColor;

	return {
		backgroundColor,
		strokeColor,
		strokeTransparency,
		strokeThickness,
		labelColor,
		labelTransparency: 0,
		hintColor,
		hintTransparency: active ? 0 : 0.12,
		deviceBackgroundColor,
		deviceBackgroundTransparency: 1,
		deviceIconColor,
		keycapBackgroundColor,
		keycapBackgroundTransparency: 0,
		keycapStrokeColor,
		keycapStrokeTransparency: active ? 0 : hovered ? 0.08 : 0.18,
		keycapStrokeThickness: active ? 2 : 1,
	};
}

export function resolveKeybindInputMotionTransition(state: KeybindInputInteractionState) {
	if (state === "disabled") {
		return {
			backgroundColor: { duration: "instant", easing: "standard" },
			strokeColor: { duration: "instant", easing: "standard" },
			strokeTransparency: { duration: "instant", easing: "standard" },
			strokeThickness: { duration: "instant", easing: "standard" },
			labelColor: { duration: "instant", easing: "standard" },
			hintColor: { duration: "instant", easing: "standard" },
			deviceBackgroundColor: { duration: "instant", easing: "standard" },
			deviceIconColor: { duration: "instant", easing: "standard" },
			keycapBackgroundColor: { duration: "instant", easing: "standard" },
			keycapStrokeColor: { duration: "instant", easing: "standard" },
			keycapStrokeTransparency: { duration: "instant", easing: "standard" },
			keycapStrokeThickness: { duration: "instant", easing: "standard" },
		} as const;
	}

	return {
		backgroundColor: { duration: state === "pressed" ? 0.06 : 0.12, easing: "standard" },
		strokeColor: { duration: 0.12, easing: "standard" },
		strokeTransparency: { duration: 0.12, easing: "standard" },
		strokeThickness: { duration: 0.12, easing: "out" },
		labelColor: { duration: 0.12, easing: "standard" },
		hintColor: { duration: 0.12, easing: "standard" },
		deviceBackgroundColor: { duration: 0.12, easing: "standard" },
		deviceIconColor: { duration: 0.12, easing: "standard" },
		keycapBackgroundColor: { duration: state === "pressed" ? 0.06 : 0.12, easing: "standard" },
		keycapStrokeColor: { duration: 0.12, easing: "standard" },
		keycapStrokeTransparency: { duration: 0.12, easing: "standard" },
		keycapStrokeThickness: { duration: 0.12, easing: "out" },
	} as const;
}
