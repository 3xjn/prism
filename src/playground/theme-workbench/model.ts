import type {
	ActionColors,
	BackgroundColors,
	BorderColors,
	MotionEasingToken,
	PartialThemeMotionEasing,
	PartialThemeShadow,
	SemanticIntent,
	SemanticIntentColors,
	SemanticIntentRole,
	TextColors,
	Theme,
	ThemeBreakpoints,
	ThemeMotion,
	ThemeMotionDurations,
	ThemeMotionEasing,
	ThemeMotionEasings,
	ThemeScale,
	ThemeShadow,
	ThemeSize,
} from "@prism/theme";

export const THEME_SIZES: readonly ThemeSize[] = table.freeze(["xs", "sm", "md", "lg", "xl"]);
export const SEMANTIC_INTENTS: readonly SemanticIntent[] = table.freeze([
	"primary",
	"secondary",
	"error",
	"warning",
	"info",
	"success",
]);

export type SurfaceColorGroup = "text" | "background" | "border" | "action";
export type FoundationScaleName = "spacing" | "radius" | "fontSizes" | "lineHeights";
export type WorkbenchPresetName = "Default" | "Dark" | "Custom";

export interface WorkbenchThemeColors {
	readonly primary: SemanticIntentColors;
	readonly secondary: SemanticIntentColors;
	readonly error: SemanticIntentColors;
	readonly warning: SemanticIntentColors;
	readonly info: SemanticIntentColors;
	readonly success: SemanticIntentColors;
	readonly text: TextColors;
	readonly background: BackgroundColors;
	readonly border: BorderColors;
	readonly action: ActionColors;
}

export interface WorkbenchThemeOverride {
	readonly colors: WorkbenchThemeColors;
	readonly breakpoints: ThemeBreakpoints;
	readonly spacing: ThemeScale<number>;
	readonly radius: ThemeScale<number>;
	readonly fontSizes: ThemeScale<number>;
	readonly lineHeights: ThemeScale<number>;
	readonly fontFamily: Enum.Font;
	readonly shadows: ThemeScale<ThemeShadow>;
	readonly motion: ThemeMotion;
}

function cloneSemanticIntentColors(colors: SemanticIntentColors): SemanticIntentColors {
	return table.freeze({
		main: colors.main,
		light: colors.light,
		dark: colors.dark,
		contrast: colors.contrast,
	});
}

function cloneTextColors(colors: TextColors): TextColors {
	return table.freeze({
		primary: colors.primary,
		secondary: colors.secondary,
		disabled: colors.disabled,
		inverse: colors.inverse,
	});
}

function cloneBackgroundColors(colors: BackgroundColors): BackgroundColors {
	return table.freeze({ default: colors.default, surface: colors.surface });
}

function cloneBorderColors(colors: BorderColors): BorderColors {
	return table.freeze({ subtle: colors.subtle, default: colors.default, strong: colors.strong });
}

function cloneActionColors(colors: ActionColors): ActionColors {
	return table.freeze({
		hover: colors.hover,
		pressed: colors.pressed,
		disabled: colors.disabled,
		disabledBackground: colors.disabledBackground,
	});
}

function cloneScale<T>(scale: ThemeScale<T>): ThemeScale<T> {
	return table.freeze({ xs: scale.xs, sm: scale.sm, md: scale.md, lg: scale.lg, xl: scale.xl });
}

function cloneShadow(shadow: ThemeShadow): ThemeShadow {
	return table.freeze({
		color: shadow.color,
		thickness: shadow.thickness,
		transparency: shadow.transparency,
	});
}

function cloneShadows(shadows: ThemeScale<ThemeShadow>): ThemeScale<ThemeShadow> {
	return table.freeze({
		xs: cloneShadow(shadows.xs),
		sm: cloneShadow(shadows.sm),
		md: cloneShadow(shadows.md),
		lg: cloneShadow(shadows.lg),
		xl: cloneShadow(shadows.xl),
	});
}

function cloneMotionEasing(easing: ThemeMotionEasing): ThemeMotionEasing {
	return table.freeze({ style: easing.style, direction: easing.direction });
}

function cloneMotionEasings(easings: ThemeMotionEasings): ThemeMotionEasings {
	return table.freeze({
		linear: cloneMotionEasing(easings.linear),
		standard: cloneMotionEasing(easings.standard),
		out: cloneMotionEasing(easings.out),
		in: cloneMotionEasing(easings.in),
		inOut: cloneMotionEasing(easings.inOut),
	});
}

function cloneMotionDurations(durations: ThemeMotionDurations): ThemeMotionDurations {
	return table.freeze({
		instant: durations.instant,
		fast: durations.fast,
		normal: durations.normal,
		slow: durations.slow,
	});
}

export function createWorkbenchThemeOverride(theme: Theme): WorkbenchThemeOverride {
	return table.freeze({
		colors: table.freeze({
			primary: cloneSemanticIntentColors(theme.colors.primary),
			secondary: cloneSemanticIntentColors(theme.colors.secondary),
			error: cloneSemanticIntentColors(theme.colors.error),
			warning: cloneSemanticIntentColors(theme.colors.warning),
			info: cloneSemanticIntentColors(theme.colors.info),
			success: cloneSemanticIntentColors(theme.colors.success),
			text: cloneTextColors(theme.colors.text),
			background: cloneBackgroundColors(theme.colors.background),
			border: cloneBorderColors(theme.colors.border),
			action: cloneActionColors(theme.colors.action),
		}),
		breakpoints: cloneScale(theme.breakpoints),
		spacing: cloneScale(theme.spacing),
		radius: cloneScale(theme.radius),
		fontSizes: cloneScale(theme.fontSizes),
		lineHeights: cloneScale(theme.lineHeights),
		fontFamily: theme.fontFamily,
		shadows: cloneShadows(theme.shadows),
		motion: table.freeze({
			duration: cloneMotionDurations(theme.motion.duration),
			easing: cloneMotionEasings(theme.motion.easing),
		}),
	});
}

function replaceColors(draft: WorkbenchThemeOverride, colors: WorkbenchThemeColors): WorkbenchThemeOverride {
	return table.freeze({ ...draft, colors });
}

export function updateSemanticIntentColor(
	draft: WorkbenchThemeOverride,
	intent: SemanticIntent,
	role: SemanticIntentRole,
	color: Color3,
): WorkbenchThemeOverride {
	const intentColors = table.freeze({ ...draft.colors[intent], [role]: color }) as SemanticIntentColors;
	const colors = table.freeze({ ...draft.colors, [intent]: intentColors }) as WorkbenchThemeColors;
	return replaceColors(draft, colors);
}

export function getSurfaceColor(draft: WorkbenchThemeOverride, group: SurfaceColorGroup, role: string): Color3 {
	switch (group) {
		case "text":
			return draft.colors.text[role as keyof TextColors];
		case "background":
			return draft.colors.background[role as keyof BackgroundColors];
		case "border":
			return draft.colors.border[role as keyof BorderColors];
		case "action":
			return draft.colors.action[role as keyof ActionColors];
	}
}

export function updateSurfaceColor(
	draft: WorkbenchThemeOverride,
	group: SurfaceColorGroup,
	role: string,
	color: Color3,
): WorkbenchThemeOverride {
	switch (group) {
		case "text":
			return replaceColors(
				draft,
				table.freeze({
					...draft.colors,
					text: table.freeze({ ...draft.colors.text, [role]: color }) as TextColors,
				}),
			);
		case "background":
			return replaceColors(
				draft,
				table.freeze({
					...draft.colors,
					background: table.freeze({ ...draft.colors.background, [role]: color }) as BackgroundColors,
				}),
			);
		case "border":
			return replaceColors(
				draft,
				table.freeze({
					...draft.colors,
					border: table.freeze({ ...draft.colors.border, [role]: color }) as BorderColors,
				}),
			);
		case "action":
			return replaceColors(
				draft,
				table.freeze({
					...draft.colors,
					action: table.freeze({ ...draft.colors.action, [role]: color }) as ActionColors,
				}),
			);
	}
}

export function updateFoundationScale(
	draft: WorkbenchThemeOverride,
	scaleName: FoundationScaleName,
	size: ThemeSize,
	value: number,
): WorkbenchThemeOverride {
	const scale = table.freeze({ ...draft[scaleName], [size]: math.max(0, value) }) as ThemeScale<number>;
	return table.freeze({ ...draft, [scaleName]: scale });
}

export function updateFontFamily(draft: WorkbenchThemeOverride, fontFamily: Enum.Font): WorkbenchThemeOverride {
	return table.freeze({ ...draft, fontFamily });
}

export function updateBreakpoint(
	draft: WorkbenchThemeOverride,
	breakpoint: ThemeSize,
	value: number,
): WorkbenchThemeOverride {
	const current = draft.breakpoints;
	const nextValue = math.clamp(math.floor(value), 0, 4_000);
	const breakpoints: ThemeBreakpoints = table.freeze({
		xs: breakpoint === "xs" ? math.min(nextValue, current.sm) : current.xs,
		sm: breakpoint === "sm" ? math.clamp(nextValue, current.xs, current.md) : current.sm,
		md: breakpoint === "md" ? math.clamp(nextValue, current.sm, current.lg) : current.md,
		lg: breakpoint === "lg" ? math.clamp(nextValue, current.md, current.xl) : current.lg,
		xl: breakpoint === "xl" ? math.max(nextValue, current.lg) : current.xl,
	});
	return table.freeze({ ...draft, breakpoints });
}

export function updateMotionDuration(
	draft: WorkbenchThemeOverride,
	token: keyof ThemeMotionDurations,
	value: number,
): WorkbenchThemeOverride {
	const duration = table.freeze({ ...draft.motion.duration, [token]: math.clamp(value, 0, 5) }) as ThemeMotionDurations;
	const motion = table.freeze({ ...draft.motion, duration });
	return table.freeze({ ...draft, motion });
}

export function updateMotionEasing(
	draft: WorkbenchThemeOverride,
	token: MotionEasingToken,
	patch: PartialThemeMotionEasing,
): WorkbenchThemeOverride {
	const current = draft.motion.easing[token];
	const nextEasing = table.freeze({
		style: patch.style ?? current.style,
		direction: patch.direction ?? current.direction,
	});
	const easing = table.freeze({ ...draft.motion.easing, [token]: nextEasing });
	const motion = table.freeze({ ...draft.motion, easing });
	return table.freeze({ ...draft, motion });
}

export function updateShadow(
	draft: WorkbenchThemeOverride,
	size: ThemeSize,
	patch: PartialThemeShadow,
): WorkbenchThemeOverride {
	const current = draft.shadows[size];
	const shadow = table.freeze({
		color: patch.color ?? current.color,
		thickness: math.clamp(patch.thickness ?? current.thickness, 0, 24),
		transparency: math.clamp(patch.transparency ?? current.transparency, 0, 1),
	});
	const shadows = table.freeze({ ...draft.shadows, [size]: shadow }) as ThemeScale<ThemeShadow>;
	return table.freeze({ ...draft, shadows });
}
