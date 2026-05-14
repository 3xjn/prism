import type {
	ActionColors,
	BackgroundColors,
	BorderColors,
	ColorScale,
	PaletteColors,
	SemanticIntentColors,
	TextColors,
	Theme,
	ThemeMotion,
	ThemeMotionDurations,
	ThemeMotionEasing,
	ThemeScale,
	ThemeShadow,
} from "./types";

function createColorScale(
	shade0: Color3,
	shade1: Color3,
	shade2: Color3,
	shade3: Color3,
	shade4: Color3,
	shade5: Color3,
	shade6: Color3,
	shade7: Color3,
	shade8: Color3,
	shade9: Color3,
): ColorScale {
	return table.freeze({
		"0": shade0,
		"1": shade1,
		"2": shade2,
		"3": shade3,
		"4": shade4,
		"5": shade5,
		"6": shade6,
		"7": shade7,
		"8": shade8,
		"9": shade9,
	});
}

function createThemeScale<T>(xs: T, sm: T, md: T, lg: T, xl: T): ThemeScale<T> {
	return table.freeze({
		xs,
		sm,
		md,
		lg,
		xl,
	});
}

function createShadow(color: Color3, thickness: number, transparency: number): ThemeShadow {
	return table.freeze({
		color,
		thickness,
		transparency,
	});
}

function createSemanticIntentColors(main: Color3, light: Color3, dark: Color3, contrast: Color3): SemanticIntentColors {
	return table.freeze({
		main,
		light,
		dark,
		contrast,
	});
}

function createTextColors(primary: Color3, secondary: Color3, disabled: Color3, inverse: Color3): TextColors {
	return table.freeze({
		primary,
		secondary,
		disabled,
		inverse,
	});
}

function createBackgroundColors(defaultColor: Color3, surface: Color3): BackgroundColors {
	return table.freeze({
		default: defaultColor,
		surface,
	});
}

function createBorderColors(subtle: Color3, defaultColor: Color3, strong: Color3): BorderColors {
	return table.freeze({
		subtle,
		default: defaultColor,
		strong,
	});
}

function createActionColors(hover: Color3, pressed: Color3, disabled: Color3, disabledBackground: Color3): ActionColors {
	return table.freeze({
		hover,
		pressed,
		disabled,
		disabledBackground,
	});
}

function createThemeMotionDurations(
	instant: number,
	fast: number,
	normal: number,
	slow: number,
): ThemeMotionDurations {
	return table.freeze({
		instant,
		fast,
		normal,
		slow,
	});
}

function createThemeMotionEasing(style: Enum.EasingStyle, direction: Enum.EasingDirection): ThemeMotionEasing {
	return table.freeze({
		style,
		direction,
	});
}

function createThemeMotion(duration: ThemeMotionDurations): ThemeMotion {
	return table.freeze({
		duration,
		easing: table.freeze({
			linear: createThemeMotionEasing(Enum.EasingStyle.Linear, Enum.EasingDirection.Out),
			standard: createThemeMotionEasing(Enum.EasingStyle.Cubic, Enum.EasingDirection.Out),
			out: createThemeMotionEasing(Enum.EasingStyle.Quint, Enum.EasingDirection.Out),
			in: createThemeMotionEasing(Enum.EasingStyle.Cubic, Enum.EasingDirection.In),
			inOut: createThemeMotionEasing(Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut),
		}),
	});
}

const DEFAULT_MOTION_DURATIONS = createThemeMotionDurations(0, 0.1, 0.16, 0.24);

const PALETTE: PaletteColors = table.freeze({
	gray: createColorScale(
		Color3.fromRGB(248, 249, 250),
		Color3.fromRGB(241, 243, 245),
		Color3.fromRGB(233, 236, 239),
		Color3.fromRGB(222, 226, 230),
		Color3.fromRGB(206, 212, 218),
		Color3.fromRGB(173, 181, 189),
		Color3.fromRGB(134, 142, 150),
		Color3.fromRGB(73, 80, 87),
		Color3.fromRGB(52, 58, 64),
		Color3.fromRGB(33, 37, 41),
	),
	primary: createColorScale(
		Color3.fromRGB(239, 246, 255),
		Color3.fromRGB(219, 234, 254),
		Color3.fromRGB(191, 219, 254),
		Color3.fromRGB(147, 197, 253),
		Color3.fromRGB(96, 165, 250),
		Color3.fromRGB(59, 130, 246),
		Color3.fromRGB(37, 99, 235),
		Color3.fromRGB(29, 78, 216),
		Color3.fromRGB(30, 64, 175),
		Color3.fromRGB(30, 58, 138),
	),
	red: createColorScale(
		Color3.fromRGB(255, 245, 245),
		Color3.fromRGB(255, 227, 227),
		Color3.fromRGB(255, 201, 201),
		Color3.fromRGB(255, 168, 168),
		Color3.fromRGB(255, 135, 135),
		Color3.fromRGB(250, 82, 82),
		Color3.fromRGB(240, 62, 62),
		Color3.fromRGB(224, 49, 49),
		Color3.fromRGB(201, 42, 42),
		Color3.fromRGB(186, 28, 28),
	),
	green: createColorScale(
		Color3.fromRGB(235, 251, 238),
		Color3.fromRGB(211, 249, 216),
		Color3.fromRGB(178, 242, 187),
		Color3.fromRGB(140, 233, 154),
		Color3.fromRGB(105, 219, 124),
		Color3.fromRGB(64, 192, 87),
		Color3.fromRGB(55, 178, 77),
		Color3.fromRGB(47, 158, 68),
		Color3.fromRGB(43, 138, 62),
		Color3.fromRGB(37, 117, 50),
	),
	yellow: createColorScale(
		Color3.fromRGB(255, 249, 219),
		Color3.fromRGB(255, 243, 191),
		Color3.fromRGB(255, 236, 153),
		Color3.fromRGB(255, 224, 102),
		Color3.fromRGB(255, 212, 59),
		Color3.fromRGB(252, 196, 25),
		Color3.fromRGB(250, 176, 5),
		Color3.fromRGB(245, 159, 0),
		Color3.fromRGB(240, 140, 0),
		Color3.fromRGB(230, 119, 0),
	),
	blue: createColorScale(
		Color3.fromRGB(231, 245, 255),
		Color3.fromRGB(208, 235, 255),
		Color3.fromRGB(165, 216, 255),
		Color3.fromRGB(116, 192, 252),
		Color3.fromRGB(77, 171, 247),
		Color3.fromRGB(51, 154, 240),
		Color3.fromRGB(34, 139, 230),
		Color3.fromRGB(28, 126, 214),
		Color3.fromRGB(25, 113, 194),
		Color3.fromRGB(24, 100, 171),
	),
});

export const DEFAULT_THEME: Theme = table.freeze({
	colors: table.freeze({
		palette: PALETTE,
		primary: createSemanticIntentColors(PALETTE.primary["5"], PALETTE.primary["3"], PALETTE.primary["7"], PALETTE.gray["0"]),
		secondary: createSemanticIntentColors(PALETTE.blue["5"], PALETTE.blue["3"], PALETTE.blue["7"], PALETTE.gray["0"]),
		error: createSemanticIntentColors(PALETTE.red["5"], PALETTE.red["3"], PALETTE.red["7"], PALETTE.gray["0"]),
		warning: createSemanticIntentColors(PALETTE.yellow["5"], PALETTE.yellow["3"], PALETTE.yellow["7"], PALETTE.gray["9"]),
		info: createSemanticIntentColors(PALETTE.blue["5"], PALETTE.blue["3"], PALETTE.blue["7"], PALETTE.gray["0"]),
		success: createSemanticIntentColors(PALETTE.green["5"], PALETTE.green["3"], PALETTE.green["7"], PALETTE.gray["0"]),
		text: createTextColors(PALETTE.gray["9"], PALETTE.gray["7"], PALETTE.gray["5"], PALETTE.gray["0"]),
		background: createBackgroundColors(PALETTE.gray["0"], Color3.fromRGB(255, 255, 255)),
		border: createBorderColors(PALETTE.gray["2"], PALETTE.gray["4"], PALETTE.gray["6"]),
		action: createActionColors(PALETTE.gray["1"], PALETTE.gray["2"], PALETTE.gray["5"], PALETTE.gray["2"]),
	}),
	spacing: createThemeScale(4, 8, 12, 16, 24),
	radius: createThemeScale(2, 4, 8, 16, 24),
	fontSizes: createThemeScale(12, 14, 16, 18, 24),
	lineHeights: createThemeScale(1.2, 1.4, 1.5, 1.5, 1.5),
	fontFamily: Enum.Font.BuilderSans,
	shadows: createThemeScale(
		createShadow(Color3.fromRGB(15, 23, 42), 1, 0.92),
		createShadow(Color3.fromRGB(15, 23, 42), 1, 0.86),
		createShadow(Color3.fromRGB(15, 23, 42), 2, 0.82),
		createShadow(Color3.fromRGB(15, 23, 42), 3, 0.78),
		createShadow(Color3.fromRGB(15, 23, 42), 4, 0.74),
	),
	motion: createThemeMotion(DEFAULT_MOTION_DURATIONS),
});
