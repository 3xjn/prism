-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local DEFAULT_THEME = TS.import(script, script.Parent, "defaults").DEFAULT_THEME
local ThemeContext = React.createContext(DEFAULT_THEME)
local function mergeScale(base, override)
	local _object = {}
	local _left = "xs"
	local _result = override
	if _result ~= nil then
		_result = _result.xs
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.xs
	end
	_object[_left] = _condition
	local _left_1 = "sm"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.sm
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.sm
	end
	_object[_left_1] = _condition_1
	local _left_2 = "md"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.md
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.md
	end
	_object[_left_2] = _condition_2
	local _left_3 = "lg"
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.lg
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = base.lg
	end
	_object[_left_3] = _condition_3
	local _left_4 = "xl"
	local _result_4 = override
	if _result_4 ~= nil then
		_result_4 = _result_4.xl
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = base.xl
	end
	_object[_left_4] = _condition_4
	return table.freeze(_object)
end
local function mergeColorScale(base, override)
	local _object = {}
	local _left = "0"
	local _result = override
	if _result ~= nil then
		_result = _result["0"]
	end
	local _condition = _result
	if _condition == nil then
		_condition = base["0"]
	end
	_object[_left] = _condition
	local _left_1 = "1"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1["1"]
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base["1"]
	end
	_object[_left_1] = _condition_1
	local _left_2 = "2"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2["2"]
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base["2"]
	end
	_object[_left_2] = _condition_2
	local _left_3 = "3"
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3["3"]
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = base["3"]
	end
	_object[_left_3] = _condition_3
	local _left_4 = "4"
	local _result_4 = override
	if _result_4 ~= nil then
		_result_4 = _result_4["4"]
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = base["4"]
	end
	_object[_left_4] = _condition_4
	local _left_5 = "5"
	local _result_5 = override
	if _result_5 ~= nil then
		_result_5 = _result_5["5"]
	end
	local _condition_5 = _result_5
	if _condition_5 == nil then
		_condition_5 = base["5"]
	end
	_object[_left_5] = _condition_5
	local _left_6 = "6"
	local _result_6 = override
	if _result_6 ~= nil then
		_result_6 = _result_6["6"]
	end
	local _condition_6 = _result_6
	if _condition_6 == nil then
		_condition_6 = base["6"]
	end
	_object[_left_6] = _condition_6
	local _left_7 = "7"
	local _result_7 = override
	if _result_7 ~= nil then
		_result_7 = _result_7["7"]
	end
	local _condition_7 = _result_7
	if _condition_7 == nil then
		_condition_7 = base["7"]
	end
	_object[_left_7] = _condition_7
	local _left_8 = "8"
	local _result_8 = override
	if _result_8 ~= nil then
		_result_8 = _result_8["8"]
	end
	local _condition_8 = _result_8
	if _condition_8 == nil then
		_condition_8 = base["8"]
	end
	_object[_left_8] = _condition_8
	local _left_9 = "9"
	local _result_9 = override
	if _result_9 ~= nil then
		_result_9 = _result_9["9"]
	end
	local _condition_9 = _result_9
	if _condition_9 == nil then
		_condition_9 = base["9"]
	end
	_object[_left_9] = _condition_9
	return table.freeze(_object)
end
local function mergeShadow(base, override)
	local _object = {}
	local _left = "color"
	local _result = override
	if _result ~= nil then
		_result = _result.color
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.color
	end
	_object[_left] = _condition
	local _left_1 = "thickness"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.thickness
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.thickness
	end
	_object[_left_1] = _condition_1
	local _left_2 = "transparency"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.transparency
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.transparency
	end
	_object[_left_2] = _condition_2
	return table.freeze(_object)
end
local function mergeSemanticIntentColors(base, override)
	local _object = {}
	local _left = "main"
	local _result = override
	if _result ~= nil then
		_result = _result.main
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.main
	end
	_object[_left] = _condition
	local _left_1 = "light"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.light
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.light
	end
	_object[_left_1] = _condition_1
	local _left_2 = "dark"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.dark
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.dark
	end
	_object[_left_2] = _condition_2
	local _left_3 = "contrast"
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.contrast
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = base.contrast
	end
	_object[_left_3] = _condition_3
	return table.freeze(_object)
end
local function mergeTextColors(base, override)
	local _object = {}
	local _left = "primary"
	local _result = override
	if _result ~= nil then
		_result = _result.primary
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.primary
	end
	_object[_left] = _condition
	local _left_1 = "secondary"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.secondary
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.secondary
	end
	_object[_left_1] = _condition_1
	local _left_2 = "disabled"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.disabled
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.disabled
	end
	_object[_left_2] = _condition_2
	local _left_3 = "inverse"
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.inverse
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = base.inverse
	end
	_object[_left_3] = _condition_3
	return table.freeze(_object)
end
local function mergeBackgroundColors(base, override)
	local _object = {}
	local _left = "default"
	local _result = override
	if _result ~= nil then
		_result = _result.default
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.default
	end
	_object[_left] = _condition
	local _left_1 = "surface"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.surface
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.surface
	end
	_object[_left_1] = _condition_1
	local _left_2 = "raised"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.raised
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.raised
	end
	_object[_left_2] = _condition_2
	return table.freeze(_object)
end
local function mergeBorderColors(base, override)
	local _object = {}
	local _left = "subtle"
	local _result = override
	if _result ~= nil then
		_result = _result.subtle
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.subtle
	end
	_object[_left] = _condition
	local _left_1 = "default"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.default
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.default
	end
	_object[_left_1] = _condition_1
	local _left_2 = "strong"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.strong
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.strong
	end
	_object[_left_2] = _condition_2
	return table.freeze(_object)
end
local function mergeActionColors(base, override)
	local _object = {}
	local _left = "hover"
	local _result = override
	if _result ~= nil then
		_result = _result.hover
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.hover
	end
	_object[_left] = _condition
	local _left_1 = "pressed"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.pressed
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.pressed
	end
	_object[_left_1] = _condition_1
	local _left_2 = "disabled"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.disabled
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.disabled
	end
	_object[_left_2] = _condition_2
	local _left_3 = "disabledBackground"
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.disabledBackground
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = base.disabledBackground
	end
	_object[_left_3] = _condition_3
	return table.freeze(_object)
end
local function mergePaletteColors(base, override)
	local _object = {}
	local _left = "gray"
	local _exp = base.gray
	local _result = override
	if _result ~= nil then
		_result = _result.gray
	end
	_object[_left] = mergeColorScale(_exp, _result)
	local _left_1 = "primary"
	local _exp_1 = base.primary
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.primary
	end
	_object[_left_1] = mergeColorScale(_exp_1, _result_1)
	local _left_2 = "red"
	local _exp_2 = base.red
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.red
	end
	_object[_left_2] = mergeColorScale(_exp_2, _result_2)
	local _left_3 = "green"
	local _exp_3 = base.green
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.green
	end
	_object[_left_3] = mergeColorScale(_exp_3, _result_3)
	local _left_4 = "yellow"
	local _exp_4 = base.yellow
	local _result_4 = override
	if _result_4 ~= nil then
		_result_4 = _result_4.yellow
	end
	_object[_left_4] = mergeColorScale(_exp_4, _result_4)
	local _left_5 = "blue"
	local _exp_5 = base.blue
	local _result_5 = override
	if _result_5 ~= nil then
		_result_5 = _result_5.blue
	end
	_object[_left_5] = mergeColorScale(_exp_5, _result_5)
	return table.freeze(_object)
end
local function mergeMotionDurations(base, override)
	local _object = {}
	local _left = "instant"
	local _result = override
	if _result ~= nil then
		_result = _result.instant
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.instant
	end
	_object[_left] = _condition
	local _left_1 = "fast"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.fast
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.fast
	end
	_object[_left_1] = _condition_1
	local _left_2 = "normal"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.normal
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = base.normal
	end
	_object[_left_2] = _condition_2
	local _left_3 = "slow"
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.slow
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = base.slow
	end
	_object[_left_3] = _condition_3
	return table.freeze(_object)
end
local function mergeMotionEasing(base, override)
	local _object = {}
	local _left = "style"
	local _result = override
	if _result ~= nil then
		_result = _result.style
	end
	local _condition = _result
	if _condition == nil then
		_condition = base.style
	end
	_object[_left] = _condition
	local _left_1 = "direction"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.direction
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = base.direction
	end
	_object[_left_1] = _condition_1
	return table.freeze(_object)
end
local function mergeMotionEasings(base, override)
	local _object = {}
	local _left = "linear"
	local _exp = base.linear
	local _result = override
	if _result ~= nil then
		_result = _result.linear
	end
	_object[_left] = mergeMotionEasing(_exp, _result)
	local _left_1 = "standard"
	local _exp_1 = base.standard
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.standard
	end
	_object[_left_1] = mergeMotionEasing(_exp_1, _result_1)
	local _left_2 = "out"
	local _exp_2 = base.out
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.out
	end
	_object[_left_2] = mergeMotionEasing(_exp_2, _result_2)
	local _left_3 = "in"
	local _exp_3 = base["in"]
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3["in"]
	end
	_object[_left_3] = mergeMotionEasing(_exp_3, _result_3)
	local _left_4 = "inOut"
	local _exp_4 = base.inOut
	local _result_4 = override
	if _result_4 ~= nil then
		_result_4 = _result_4.inOut
	end
	_object[_left_4] = mergeMotionEasing(_exp_4, _result_4)
	return table.freeze(_object)
end
local function mergeMotion(base, override)
	local _object = {}
	local _left = "duration"
	local _exp = base.duration
	local _result = override
	if _result ~= nil then
		_result = _result.duration
	end
	_object[_left] = mergeMotionDurations(_exp, _result)
	local _left_1 = "easing"
	local _exp_1 = base.easing
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.easing
	end
	_object[_left_1] = mergeMotionEasings(_exp_1, _result_1)
	return table.freeze(_object)
end
local function mergeTheme(base, override, density)
	local _exp = base.colors.palette
	local _result = override
	if _result ~= nil then
		_result = _result.colors
		if _result ~= nil then
			_result = _result.palette
		end
	end
	local mergedPalette = mergePaletteColors(_exp, _result)
	local _object = {}
	local _left = "colors"
	local _object_1 = {
		palette = mergedPalette,
	}
	local _left_1 = "primary"
	local _exp_1 = base.colors.primary
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.colors
		if _result_1 ~= nil then
			_result_1 = _result_1.primary
		end
	end
	_object_1[_left_1] = mergeSemanticIntentColors(_exp_1, _result_1)
	local _left_2 = "secondary"
	local _exp_2 = base.colors.secondary
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.colors
		if _result_2 ~= nil then
			_result_2 = _result_2.secondary
		end
	end
	_object_1[_left_2] = mergeSemanticIntentColors(_exp_2, _result_2)
	local _left_3 = "error"
	local _exp_3 = base.colors.error
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.colors
		if _result_3 ~= nil then
			_result_3 = _result_3.error
		end
	end
	_object_1[_left_3] = mergeSemanticIntentColors(_exp_3, _result_3)
	local _left_4 = "warning"
	local _exp_4 = base.colors.warning
	local _result_4 = override
	if _result_4 ~= nil then
		_result_4 = _result_4.colors
		if _result_4 ~= nil then
			_result_4 = _result_4.warning
		end
	end
	_object_1[_left_4] = mergeSemanticIntentColors(_exp_4, _result_4)
	local _left_5 = "info"
	local _exp_5 = base.colors.info
	local _result_5 = override
	if _result_5 ~= nil then
		_result_5 = _result_5.colors
		if _result_5 ~= nil then
			_result_5 = _result_5.info
		end
	end
	_object_1[_left_5] = mergeSemanticIntentColors(_exp_5, _result_5)
	local _left_6 = "success"
	local _exp_6 = base.colors.success
	local _result_6 = override
	if _result_6 ~= nil then
		_result_6 = _result_6.colors
		if _result_6 ~= nil then
			_result_6 = _result_6.success
		end
	end
	_object_1[_left_6] = mergeSemanticIntentColors(_exp_6, _result_6)
	local _left_7 = "text"
	local _exp_7 = base.colors.text
	local _result_7 = override
	if _result_7 ~= nil then
		_result_7 = _result_7.colors
		if _result_7 ~= nil then
			_result_7 = _result_7.text
		end
	end
	_object_1[_left_7] = mergeTextColors(_exp_7, _result_7)
	local _left_8 = "background"
	local _exp_8 = base.colors.background
	local _result_8 = override
	if _result_8 ~= nil then
		_result_8 = _result_8.colors
		if _result_8 ~= nil then
			_result_8 = _result_8.background
		end
	end
	_object_1[_left_8] = mergeBackgroundColors(_exp_8, _result_8)
	local _left_9 = "border"
	local _exp_9 = base.colors.border
	local _result_9 = override
	if _result_9 ~= nil then
		_result_9 = _result_9.colors
		if _result_9 ~= nil then
			_result_9 = _result_9.border
		end
	end
	_object_1[_left_9] = mergeBorderColors(_exp_9, _result_9)
	local _left_10 = "action"
	local _exp_10 = base.colors.action
	local _result_10 = override
	if _result_10 ~= nil then
		_result_10 = _result_10.colors
		if _result_10 ~= nil then
			_result_10 = _result_10.action
		end
	end
	_object_1[_left_10] = mergeActionColors(_exp_10, _result_10)
	_object[_left] = table.freeze(_object_1)
	local _left_11 = "density"
	local _condition = density
	if _condition == nil then
		local _result_11 = override
		if _result_11 ~= nil then
			_result_11 = _result_11.density
		end
		_condition = _result_11
		if _condition == nil then
			_condition = base.density
		end
	end
	_object[_left_11] = _condition
	local _left_12 = "spacing"
	local _exp_11 = base.spacing
	local _result_11 = override
	if _result_11 ~= nil then
		_result_11 = _result_11.spacing
	end
	_object[_left_12] = mergeScale(_exp_11, _result_11)
	local _left_13 = "radius"
	local _exp_12 = base.radius
	local _result_12 = override
	if _result_12 ~= nil then
		_result_12 = _result_12.radius
	end
	_object[_left_13] = mergeScale(_exp_12, _result_12)
	local _left_14 = "fontSizes"
	local _exp_13 = base.fontSizes
	local _result_13 = override
	if _result_13 ~= nil then
		_result_13 = _result_13.fontSizes
	end
	_object[_left_14] = mergeScale(_exp_13, _result_13)
	local _left_15 = "lineHeights"
	local _exp_14 = base.lineHeights
	local _result_14 = override
	if _result_14 ~= nil then
		_result_14 = _result_14.lineHeights
	end
	_object[_left_15] = mergeScale(_exp_14, _result_14)
	local _left_16 = "fontFamily"
	local _result_15 = override
	if _result_15 ~= nil then
		_result_15 = _result_15.fontFamily
	end
	local _condition_1 = _result_15
	if _condition_1 == nil then
		_condition_1 = base.fontFamily
	end
	_object[_left_16] = _condition_1
	local _left_17 = "shadows"
	local _object_2 = {}
	local _left_18 = "xs"
	local _exp_15 = base.shadows.xs
	local _result_16 = override
	if _result_16 ~= nil then
		_result_16 = _result_16.shadows
		if _result_16 ~= nil then
			_result_16 = _result_16.xs
		end
	end
	_object_2[_left_18] = mergeShadow(_exp_15, _result_16)
	local _left_19 = "sm"
	local _exp_16 = base.shadows.sm
	local _result_17 = override
	if _result_17 ~= nil then
		_result_17 = _result_17.shadows
		if _result_17 ~= nil then
			_result_17 = _result_17.sm
		end
	end
	_object_2[_left_19] = mergeShadow(_exp_16, _result_17)
	local _left_20 = "md"
	local _exp_17 = base.shadows.md
	local _result_18 = override
	if _result_18 ~= nil then
		_result_18 = _result_18.shadows
		if _result_18 ~= nil then
			_result_18 = _result_18.md
		end
	end
	_object_2[_left_20] = mergeShadow(_exp_17, _result_18)
	local _left_21 = "lg"
	local _exp_18 = base.shadows.lg
	local _result_19 = override
	if _result_19 ~= nil then
		_result_19 = _result_19.shadows
		if _result_19 ~= nil then
			_result_19 = _result_19.lg
		end
	end
	_object_2[_left_21] = mergeShadow(_exp_18, _result_19)
	local _left_22 = "xl"
	local _exp_19 = base.shadows.xl
	local _result_20 = override
	if _result_20 ~= nil then
		_result_20 = _result_20.shadows
		if _result_20 ~= nil then
			_result_20 = _result_20.xl
		end
	end
	_object_2[_left_22] = mergeShadow(_exp_19, _result_20)
	_object[_left_17] = table.freeze(_object_2)
	local _left_23 = "motion"
	local _exp_20 = base.motion
	local _result_21 = override
	if _result_21 ~= nil then
		_result_21 = _result_21.motion
	end
	_object[_left_23] = mergeMotion(_exp_20, _result_21)
	return table.freeze(_object)
end
local function ThemeProvider(_param)
	local children = _param.children
	local theme = _param.theme
	local density = _param.density
	local mergedTheme = React.useMemo(function()
		return mergeTheme(DEFAULT_THEME, theme, density)
	end, { density, theme })
	return React.createElement(ThemeContext.Provider, {
		value = mergedTheme,
	}, children)
end
local function useTheme()
	return React.useContext(ThemeContext)
end
return {
	ThemeProvider = ThemeProvider,
	useTheme = useTheme,
}
