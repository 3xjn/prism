export type ThemeSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ColorShade = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type PaletteColorName = "gray" | "primary" | "red" | "green" | "yellow" | "blue";

export type SemanticIntent = "primary" | "secondary" | "error" | "warning" | "info" | "success";

export type SemanticIntentRole = "main" | "light" | "dark" | "contrast";

export type TextColorRole = "primary" | "secondary" | "disabled" | "inverse";

export type BackgroundColorRole = "default" | "surface" | "raised";

export type BorderColorRole = "subtle" | "default" | "strong";

export type ActionColorRole = "hover" | "pressed" | "disabled" | "disabledBackground";

export type Variant = "filled" | "light" | "outline" | "subtle";

export type ThemeScale<T> = Readonly<Record<ThemeSize, T>>;

export type ColorScale = Readonly<Record<ColorShade, Color3>>;

export type SemanticIntentColors = Readonly<Record<SemanticIntentRole, Color3>>;

export type TextColors = Readonly<Record<TextColorRole, Color3>>;

export type BackgroundColors = Readonly<Record<BackgroundColorRole, Color3>>;

export type BorderColors = Readonly<Record<BorderColorRole, Color3>>;

export type ActionColors = Readonly<Record<ActionColorRole, Color3>>;

export type PaletteColors = Readonly<Record<PaletteColorName, ColorScale>>;

export type ColorName = PaletteColorName;

export interface ThemeColors {
	readonly palette: PaletteColors;
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

export type LegacyColorToken = `${PaletteColorName}.${ColorShade}`;

export type PaletteColorToken = `palette.${PaletteColorName}.${ColorShade}`;

export type IntentColorToken = `${SemanticIntent}.${SemanticIntentRole}`;

export type TextColorToken = `text.${TextColorRole}`;

export type BackgroundColorToken = `background.${BackgroundColorRole}`;

export type BorderColorToken = `border.${BorderColorRole}`;

export type ActionColorToken = `action.${ActionColorRole}`;

export type ColorToken =
	| IntentColorToken
	| TextColorToken
	| BackgroundColorToken
	| BorderColorToken
	| ActionColorToken
	| PaletteColorToken
	| LegacyColorToken;

export interface ThemeColorRef<Token extends ColorToken = ColorToken> {
	readonly kind: "themeColor";
	readonly token: Token;
}

export type ConcreteColorValue = Color3 | ThemeColorRef;

export interface ThemeShadow {
	readonly color: Color3;
	readonly thickness: number;
	readonly transparency: number;
}

export type MotionDurationToken = "instant" | "fast" | "normal" | "slow";

export type MotionEasingToken = "linear" | "standard" | "out" | "in" | "inOut";

export type ThemeMotionDurations = Readonly<Record<MotionDurationToken, number>>;

export interface ThemeMotionEasing {
	readonly style: Enum.EasingStyle;
	readonly direction: Enum.EasingDirection;
}

export type ThemeMotionEasings = Readonly<Record<MotionEasingToken, ThemeMotionEasing>>;

export interface ThemeMotion {
	readonly duration: ThemeMotionDurations;
	readonly easing: ThemeMotionEasings;
}

export interface Theme {
	readonly colors: ThemeColors;
	readonly spacing: ThemeScale<number>;
	readonly radius: ThemeScale<number>;
	readonly fontSizes: ThemeScale<number>;
	readonly lineHeights: ThemeScale<number>;
	readonly fontFamily: Enum.Font;
	readonly shadows: ThemeScale<ThemeShadow>;
	readonly motion: ThemeMotion;
}

export type PartialThemeScale<T> = Readonly<Partial<Record<ThemeSize, T>>>;

export type PartialColorScale = Readonly<Partial<Record<ColorShade, Color3>>>;

export type PartialSemanticIntentColors = Readonly<Partial<Record<SemanticIntentRole, Color3>>>;

export type PartialTextColors = Readonly<Partial<Record<TextColorRole, Color3>>>;

export type PartialBackgroundColors = Readonly<Partial<Record<BackgroundColorRole, Color3>>>;

export type PartialBorderColors = Readonly<Partial<Record<BorderColorRole, Color3>>>;

export type PartialActionColors = Readonly<Partial<Record<ActionColorRole, Color3>>>;

export type PartialPaletteColors = Readonly<Partial<Record<PaletteColorName, PartialColorScale>>>;

export interface PartialThemeColors {
	readonly palette?: PartialPaletteColors;
	readonly primary?: PartialSemanticIntentColors;
	readonly secondary?: PartialSemanticIntentColors;
	readonly error?: PartialSemanticIntentColors;
	readonly warning?: PartialSemanticIntentColors;
	readonly info?: PartialSemanticIntentColors;
	readonly success?: PartialSemanticIntentColors;
	readonly text?: PartialTextColors;
	readonly background?: PartialBackgroundColors;
	readonly border?: PartialBorderColors;
	readonly action?: PartialActionColors;
}

export type PartialThemeShadow = Readonly<Partial<ThemeShadow>>;

export type PartialThemeMotionDurations = Readonly<Partial<Record<MotionDurationToken, number>>>;

export type PartialThemeMotionEasing = Readonly<Partial<ThemeMotionEasing>>;

export type PartialThemeMotionEasings = Readonly<Partial<Record<MotionEasingToken, PartialThemeMotionEasing>>>;

export interface PartialThemeMotion {
	readonly duration?: PartialThemeMotionDurations;
	readonly easing?: PartialThemeMotionEasings;
}

export interface ThemeOverride {
	readonly colors?: PartialThemeColors;
	readonly spacing?: PartialThemeScale<number>;
	readonly radius?: PartialThemeScale<number>;
	readonly fontSizes?: PartialThemeScale<number>;
	readonly lineHeights?: PartialThemeScale<number>;
	readonly fontFamily?: Enum.Font;
	readonly shadows?: Readonly<Partial<Record<ThemeSize, PartialThemeShadow>>>;
	readonly motion?: PartialThemeMotion;
}
