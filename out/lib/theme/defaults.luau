-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local DEFAULT_DENSITY = TS.import(script, script.Parent, "density").DEFAULT_DENSITY
local function createColorScale(shade0, shade1, shade2, shade3, shade4, shade5, shade6, shade7, shade8, shade9)
	return table.freeze({
		["0"] = shade0,
		["1"] = shade1,
		["2"] = shade2,
		["3"] = shade3,
		["4"] = shade4,
		["5"] = shade5,
		["6"] = shade6,
		["7"] = shade7,
		["8"] = shade8,
		["9"] = shade9,
	})
end
local function createThemeScale(xs, sm, md, lg, xl)
	return table.freeze({
		xs = xs,
		sm = sm,
		md = md,
		lg = lg,
		xl = xl,
	})
end
local function createShadow(color, thickness, transparency)
	return table.freeze({
		color = color,
		thickness = thickness,
		transparency = transparency,
	})
end
local function createSemanticIntentColors(main, light, dark, contrast)
	return table.freeze({
		main = main,
		light = light,
		dark = dark,
		contrast = contrast,
	})
end
local function createTextColors(primary, secondary, disabled, inverse)
	return table.freeze({
		primary = primary,
		secondary = secondary,
		disabled = disabled,
		inverse = inverse,
	})
end
local function createBackgroundColors(defaultColor, surface, raised)
	return table.freeze({
		default = defaultColor,
		surface = surface,
		raised = raised,
	})
end
local function createBorderColors(subtle, defaultColor, strong)
	return table.freeze({
		subtle = subtle,
		default = defaultColor,
		strong = strong,
	})
end
local function createActionColors(hover, pressed, disabled, disabledBackground)
	return table.freeze({
		hover = hover,
		pressed = pressed,
		disabled = disabled,
		disabledBackground = disabledBackground,
	})
end
local function createThemeMotionDurations(instant, fast, normal, slow)
	return table.freeze({
		instant = instant,
		fast = fast,
		normal = normal,
		slow = slow,
	})
end
local function createThemeMotionEasing(style, direction)
	return table.freeze({
		style = style,
		direction = direction,
	})
end
local function createThemeMotion(duration)
	return table.freeze({
		duration = duration,
		easing = table.freeze({
			linear = createThemeMotionEasing(Enum.EasingStyle.Linear, Enum.EasingDirection.Out),
			standard = createThemeMotionEasing(Enum.EasingStyle.Cubic, Enum.EasingDirection.Out),
			out = createThemeMotionEasing(Enum.EasingStyle.Quint, Enum.EasingDirection.Out),
			["in"] = createThemeMotionEasing(Enum.EasingStyle.Cubic, Enum.EasingDirection.In),
			inOut = createThemeMotionEasing(Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut),
		}),
	})
end
local DEFAULT_MOTION_DURATIONS = createThemeMotionDurations(0, 0.1, 0.16, 0.24)
local PALETTE = table.freeze({
	gray = createColorScale(Color3.fromRGB(248, 249, 250), Color3.fromRGB(241, 243, 245), Color3.fromRGB(233, 236, 239), Color3.fromRGB(222, 226, 230), Color3.fromRGB(206, 212, 218), Color3.fromRGB(173, 181, 189), Color3.fromRGB(134, 142, 150), Color3.fromRGB(73, 80, 87), Color3.fromRGB(52, 58, 64), Color3.fromRGB(33, 37, 41)),
	primary = createColorScale(Color3.fromRGB(239, 246, 255), Color3.fromRGB(219, 234, 254), Color3.fromRGB(191, 219, 254), Color3.fromRGB(147, 197, 253), Color3.fromRGB(96, 165, 250), Color3.fromRGB(59, 130, 246), Color3.fromRGB(37, 99, 235), Color3.fromRGB(29, 78, 216), Color3.fromRGB(30, 64, 175), Color3.fromRGB(30, 58, 138)),
	red = createColorScale(Color3.fromRGB(255, 245, 245), Color3.fromRGB(255, 227, 227), Color3.fromRGB(255, 201, 201), Color3.fromRGB(255, 168, 168), Color3.fromRGB(255, 135, 135), Color3.fromRGB(250, 82, 82), Color3.fromRGB(240, 62, 62), Color3.fromRGB(224, 49, 49), Color3.fromRGB(201, 42, 42), Color3.fromRGB(186, 28, 28)),
	green = createColorScale(Color3.fromRGB(235, 251, 238), Color3.fromRGB(211, 249, 216), Color3.fromRGB(178, 242, 187), Color3.fromRGB(140, 233, 154), Color3.fromRGB(105, 219, 124), Color3.fromRGB(64, 192, 87), Color3.fromRGB(55, 178, 77), Color3.fromRGB(47, 158, 68), Color3.fromRGB(43, 138, 62), Color3.fromRGB(37, 117, 50)),
	yellow = createColorScale(Color3.fromRGB(255, 249, 219), Color3.fromRGB(255, 243, 191), Color3.fromRGB(255, 236, 153), Color3.fromRGB(255, 224, 102), Color3.fromRGB(255, 212, 59), Color3.fromRGB(252, 196, 25), Color3.fromRGB(250, 176, 5), Color3.fromRGB(245, 159, 0), Color3.fromRGB(240, 140, 0), Color3.fromRGB(230, 119, 0)),
	blue = createColorScale(Color3.fromRGB(231, 245, 255), Color3.fromRGB(208, 235, 255), Color3.fromRGB(165, 216, 255), Color3.fromRGB(116, 192, 252), Color3.fromRGB(77, 171, 247), Color3.fromRGB(51, 154, 240), Color3.fromRGB(34, 139, 230), Color3.fromRGB(28, 126, 214), Color3.fromRGB(25, 113, 194), Color3.fromRGB(24, 100, 171)),
})
local DEFAULT_THEME = table.freeze({
	colors = table.freeze({
		palette = PALETTE,
		primary = createSemanticIntentColors(PALETTE.primary["5"], PALETTE.primary["3"], PALETTE.primary["7"], PALETTE.gray["0"]),
		secondary = createSemanticIntentColors(PALETTE.gray["7"], PALETTE.gray["2"], PALETTE.gray["9"], PALETTE.gray["0"]),
		error = createSemanticIntentColors(PALETTE.red["5"], PALETTE.red["3"], PALETTE.red["7"], PALETTE.gray["0"]),
		warning = createSemanticIntentColors(PALETTE.yellow["5"], PALETTE.yellow["3"], PALETTE.yellow["7"], PALETTE.gray["9"]),
		info = createSemanticIntentColors(PALETTE.blue["5"], PALETTE.blue["3"], PALETTE.blue["7"], PALETTE.gray["0"]),
		success = createSemanticIntentColors(PALETTE.green["5"], PALETTE.green["3"], PALETTE.green["7"], PALETTE.gray["0"]),
		text = createTextColors(PALETTE.gray["9"], PALETTE.gray["7"], PALETTE.gray["5"], PALETTE.gray["0"]),
		background = createBackgroundColors(PALETTE.gray["0"], Color3.fromRGB(255, 255, 255), Color3.fromRGB(255, 255, 255)),
		border = createBorderColors(PALETTE.gray["2"], PALETTE.gray["4"], PALETTE.gray["6"]),
		action = createActionColors(PALETTE.gray["2"], PALETTE.gray["3"], PALETTE.gray["5"], PALETTE.gray["2"]),
	}),
	density = DEFAULT_DENSITY,
	spacing = createThemeScale(4, 8, 12, 16, 24),
	radius = createThemeScale(2, 4, 8, 16, 24),
	fontSizes = createThemeScale(12, 14, 16, 18, 24),
	lineHeights = createThemeScale(1.2, 1.4, 1.5, 1.5, 1.5),
	fontFamily = Enum.Font.BuilderSans,
	shadows = createThemeScale(createShadow(Color3.fromRGB(15, 23, 42), 1, 0.92), createShadow(Color3.fromRGB(15, 23, 42), 1, 0.86), createShadow(Color3.fromRGB(15, 23, 42), 2, 0.82), createShadow(Color3.fromRGB(15, 23, 42), 3, 0.78), createShadow(Color3.fromRGB(15, 23, 42), 4, 0.74)),
	motion = createThemeMotion(DEFAULT_MOTION_DURATIONS),
})
-- Dark counterpart to DEFAULT_THEME. Intent "light" shades map to dark
-- tinted fills (they are used as subtle backgrounds) and "dark" shades
-- map to brighter accents, mirroring how the roles read on dark
-- surfaces. Shadows are near-black and considerably more opaque -- soft
-- gray shadows disappear against dark backgrounds.
local DEFAULT_DARK_THEME = table.freeze({
	colors = table.freeze({
		palette = PALETTE,
		primary = createSemanticIntentColors(Color3.fromRGB(88, 166, 255), Color3.fromRGB(20, 61, 103), Color3.fromRGB(121, 192, 255), Color3.fromRGB(13, 17, 23)),
		secondary = createSemanticIntentColors(Color3.fromRGB(139, 148, 158), Color3.fromRGB(33, 40, 48), Color3.fromRGB(201, 209, 217), Color3.fromRGB(13, 17, 23)),
		error = createSemanticIntentColors(Color3.fromRGB(248, 81, 73), Color3.fromRGB(90, 30, 27), Color3.fromRGB(255, 161, 152), Color3.fromRGB(13, 17, 23)),
		warning = createSemanticIntentColors(Color3.fromRGB(210, 153, 34), Color3.fromRGB(77, 53, 8), Color3.fromRGB(227, 179, 65), Color3.fromRGB(13, 17, 23)),
		info = createSemanticIntentColors(Color3.fromRGB(121, 192, 255), Color3.fromRGB(18, 58, 90), Color3.fromRGB(165, 214, 255), Color3.fromRGB(13, 17, 23)),
		success = createSemanticIntentColors(Color3.fromRGB(63, 185, 80), Color3.fromRGB(20, 61, 32), Color3.fromRGB(86, 211, 100), Color3.fromRGB(13, 17, 23)),
		text = createTextColors(Color3.fromRGB(240, 246, 252), Color3.fromRGB(183, 189, 200), Color3.fromRGB(125, 133, 144), Color3.fromRGB(13, 17, 23)),
		background = createBackgroundColors(Color3.fromRGB(13, 17, 23), Color3.fromRGB(21, 27, 35), Color3.fromRGB(52, 60, 72)),
		border = createBorderColors(Color3.fromRGB(47, 55, 66), Color3.fromRGB(61, 68, 77), Color3.fromRGB(125, 133, 144)),
		action = createActionColors(Color3.fromRGB(42, 49, 60), Color3.fromRGB(47, 55, 66), Color3.fromRGB(125, 133, 144), Color3.fromRGB(33, 40, 48)),
	}),
	density = DEFAULT_DENSITY,
	spacing = createThemeScale(4, 8, 12, 16, 24),
	radius = createThemeScale(2, 4, 8, 16, 24),
	fontSizes = createThemeScale(12, 14, 16, 18, 24),
	lineHeights = createThemeScale(1.2, 1.4, 1.5, 1.5, 1.5),
	fontFamily = Enum.Font.BuilderSans,
	shadows = createThemeScale(createShadow(Color3.fromRGB(0, 0, 0), 1, 0.72), createShadow(Color3.fromRGB(0, 0, 0), 1, 0.64), createShadow(Color3.fromRGB(0, 0, 0), 2, 0.58), createShadow(Color3.fromRGB(0, 0, 0), 3, 0.52), createShadow(Color3.fromRGB(0, 0, 0), 4, 0.46)),
	motion = createThemeMotion(DEFAULT_MOTION_DURATIONS),
})
return {
	DEFAULT_THEME = DEFAULT_THEME,
	DEFAULT_DARK_THEME = DEFAULT_DARK_THEME,
}
