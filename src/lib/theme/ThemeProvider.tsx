import React from "@rbxts/react";

import { DEFAULT_THEME } from "./defaults";
import type {
	ActionColors,
	BackgroundColors,
	BorderColors,
	ColorScale,
	PaletteColors,
	PartialColorScale,
	PartialActionColors,
	PartialBackgroundColors,
	PartialBorderColors,
	PartialPaletteColors,
	PartialSemanticIntentColors,
	PartialTextColors,
	PartialThemeMotion,
	PartialThemeMotionDurations,
	PartialThemeMotionEasing,
	PartialThemeMotionEasings,
	PartialThemeScale,
	PartialThemeShadow,
	SemanticIntentColors,
	TextColors,
	Theme,
	ThemeMotion,
	ThemeMotionDurations,
	ThemeMotionEasing,
	ThemeMotionEasings,
	ThemeOverride,
	ThemeScale,
	ThemeShadow,
} from "./types";

const ThemeContext = React.createContext<Theme>(DEFAULT_THEME);

export interface ThemeProviderProps {
	readonly children?: React.ReactNode;
	readonly theme?: ThemeOverride;
}

function mergeScale<T>(base: ThemeScale<T>, override?: PartialThemeScale<T>): ThemeScale<T> {
	return table.freeze({
		xs: override?.xs ?? base.xs,
		sm: override?.sm ?? base.sm,
		md: override?.md ?? base.md,
		lg: override?.lg ?? base.lg,
		xl: override?.xl ?? base.xl,
	});
}

function mergeColorScale(base: ColorScale, override?: PartialColorScale): ColorScale {
	return table.freeze({
		"0": override?.["0"] ?? base["0"],
		"1": override?.["1"] ?? base["1"],
		"2": override?.["2"] ?? base["2"],
		"3": override?.["3"] ?? base["3"],
		"4": override?.["4"] ?? base["4"],
		"5": override?.["5"] ?? base["5"],
		"6": override?.["6"] ?? base["6"],
		"7": override?.["7"] ?? base["7"],
		"8": override?.["8"] ?? base["8"],
		"9": override?.["9"] ?? base["9"],
	});
}

function mergeShadow(base: ThemeShadow, override?: PartialThemeShadow): ThemeShadow {
	return table.freeze({
		color: override?.color ?? base.color,
		thickness: override?.thickness ?? base.thickness,
		transparency: override?.transparency ?? base.transparency,
	});
}

function mergeSemanticIntentColors(base: SemanticIntentColors, override?: PartialSemanticIntentColors): SemanticIntentColors {
	return table.freeze({
		main: override?.main ?? base.main,
		light: override?.light ?? base.light,
		dark: override?.dark ?? base.dark,
		contrast: override?.contrast ?? base.contrast,
	});
}

function mergeTextColors(base: TextColors, override?: PartialTextColors): TextColors {
	return table.freeze({
		primary: override?.primary ?? base.primary,
		secondary: override?.secondary ?? base.secondary,
		disabled: override?.disabled ?? base.disabled,
		inverse: override?.inverse ?? base.inverse,
	});
}

function mergeBackgroundColors(base: BackgroundColors, override?: PartialBackgroundColors): BackgroundColors {
	return table.freeze({
		default: override?.default ?? base.default,
		surface: override?.surface ?? base.surface,
		raised: override?.raised ?? base.raised,
	});
}

function mergeBorderColors(base: BorderColors, override?: PartialBorderColors): BorderColors {
	return table.freeze({
		subtle: override?.subtle ?? base.subtle,
		default: override?.default ?? base.default,
		strong: override?.strong ?? base.strong,
	});
}

function mergeActionColors(base: ActionColors, override?: PartialActionColors): ActionColors {
	return table.freeze({
		hover: override?.hover ?? base.hover,
		pressed: override?.pressed ?? base.pressed,
		disabled: override?.disabled ?? base.disabled,
		disabledBackground: override?.disabledBackground ?? base.disabledBackground,
	});
}

function mergePaletteColors(base: PaletteColors, override?: PartialPaletteColors): PaletteColors {
	return table.freeze({
		gray: mergeColorScale(base.gray, override?.gray),
		primary: mergeColorScale(base.primary, override?.primary),
		red: mergeColorScale(base.red, override?.red),
		green: mergeColorScale(base.green, override?.green),
		yellow: mergeColorScale(base.yellow, override?.yellow),
		blue: mergeColorScale(base.blue, override?.blue),
	});
}

function mergeMotionDurations(base: ThemeMotionDurations, override?: PartialThemeMotionDurations): ThemeMotionDurations {
	return table.freeze({
		instant: override?.instant ?? base.instant,
		fast: override?.fast ?? base.fast,
		normal: override?.normal ?? base.normal,
		slow: override?.slow ?? base.slow,
	});
}

function mergeMotionEasing(base: ThemeMotionEasing, override?: PartialThemeMotionEasing): ThemeMotionEasing {
	return table.freeze({
		style: override?.style ?? base.style,
		direction: override?.direction ?? base.direction,
	});
}

function mergeMotionEasings(base: ThemeMotionEasings, override?: PartialThemeMotionEasings): ThemeMotionEasings {
	return table.freeze({
		linear: mergeMotionEasing(base.linear, override?.linear),
		standard: mergeMotionEasing(base.standard, override?.standard),
		out: mergeMotionEasing(base.out, override?.out),
		in: mergeMotionEasing(base.in, override?.in),
		inOut: mergeMotionEasing(base.inOut, override?.inOut),
	});
}

function mergeMotion(base: ThemeMotion, override?: PartialThemeMotion): ThemeMotion {
	return table.freeze({
		duration: mergeMotionDurations(base.duration, override?.duration),
		easing: mergeMotionEasings(base.easing, override?.easing),
	});
}

function mergeTheme(base: Theme, override?: ThemeOverride): Theme {
	const mergedPalette = mergePaletteColors(base.colors.palette, override?.colors?.palette);

	return table.freeze({
		colors: table.freeze({
			palette: mergedPalette,
			primary: mergeSemanticIntentColors(base.colors.primary, override?.colors?.primary),
			secondary: mergeSemanticIntentColors(base.colors.secondary, override?.colors?.secondary),
			error: mergeSemanticIntentColors(base.colors.error, override?.colors?.error),
			warning: mergeSemanticIntentColors(base.colors.warning, override?.colors?.warning),
			info: mergeSemanticIntentColors(base.colors.info, override?.colors?.info),
			success: mergeSemanticIntentColors(base.colors.success, override?.colors?.success),
			text: mergeTextColors(base.colors.text, override?.colors?.text),
			background: mergeBackgroundColors(base.colors.background, override?.colors?.background),
			border: mergeBorderColors(base.colors.border, override?.colors?.border),
			action: mergeActionColors(base.colors.action, override?.colors?.action),
		}),
		spacing: mergeScale(base.spacing, override?.spacing),
		radius: mergeScale(base.radius, override?.radius),
		fontSizes: mergeScale(base.fontSizes, override?.fontSizes),
		lineHeights: mergeScale(base.lineHeights, override?.lineHeights),
		fontFamily: override?.fontFamily ?? base.fontFamily,
		shadows: table.freeze({
			xs: mergeShadow(base.shadows.xs, override?.shadows?.xs),
			sm: mergeShadow(base.shadows.sm, override?.shadows?.sm),
			md: mergeShadow(base.shadows.md, override?.shadows?.md),
			lg: mergeShadow(base.shadows.lg, override?.shadows?.lg),
			xl: mergeShadow(base.shadows.xl, override?.shadows?.xl),
		}),
		motion: mergeMotion(base.motion, override?.motion),
	});
}

export function ThemeProvider({ children, theme }: ThemeProviderProps): React.ReactElement {
	const mergedTheme = React.useMemo(() => mergeTheme(DEFAULT_THEME, theme), [theme]);

	return <ThemeContext.Provider value={mergedTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
	return React.useContext(ThemeContext);
}
