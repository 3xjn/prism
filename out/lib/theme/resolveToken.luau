-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local resolveThemeSpacing = TS.import(script, script.Parent, "density").resolveThemeSpacing
local function isColorName(value)
	repeat
		local _fallthrough = false
		if value == "gray" then
			_fallthrough = true
		end
		if _fallthrough or value == "primary" then
			_fallthrough = true
		end
		if _fallthrough or value == "red" then
			_fallthrough = true
		end
		if _fallthrough or value == "green" then
			_fallthrough = true
		end
		if _fallthrough or value == "yellow" then
			_fallthrough = true
		end
		if _fallthrough or value == "blue" then
			return true
		end
		return false
	until true
end
local function isColorShade(value)
	repeat
		local _fallthrough = false
		if value == "0" then
			_fallthrough = true
		end
		if _fallthrough or value == "1" then
			_fallthrough = true
		end
		if _fallthrough or value == "2" then
			_fallthrough = true
		end
		if _fallthrough or value == "3" then
			_fallthrough = true
		end
		if _fallthrough or value == "4" then
			_fallthrough = true
		end
		if _fallthrough or value == "5" then
			_fallthrough = true
		end
		if _fallthrough or value == "6" then
			_fallthrough = true
		end
		if _fallthrough or value == "7" then
			_fallthrough = true
		end
		if _fallthrough or value == "8" then
			_fallthrough = true
		end
		if _fallthrough or value == "9" then
			return true
		end
		return false
	until true
end
local function isSemanticIntent(value)
	repeat
		local _fallthrough = false
		if value == "primary" then
			_fallthrough = true
		end
		if _fallthrough or value == "secondary" then
			_fallthrough = true
		end
		if _fallthrough or value == "error" then
			_fallthrough = true
		end
		if _fallthrough or value == "warning" then
			_fallthrough = true
		end
		if _fallthrough or value == "info" then
			_fallthrough = true
		end
		if _fallthrough or value == "success" then
			return true
		end
		return false
	until true
end
local function isSemanticIntentRole(value)
	repeat
		local _fallthrough = false
		if value == "main" then
			_fallthrough = true
		end
		if _fallthrough or value == "light" then
			_fallthrough = true
		end
		if _fallthrough or value == "dark" then
			_fallthrough = true
		end
		if _fallthrough or value == "contrast" then
			return true
		end
		return false
	until true
end
local function isTextColorRole(value)
	repeat
		local _fallthrough = false
		if value == "primary" then
			_fallthrough = true
		end
		if _fallthrough or value == "secondary" then
			_fallthrough = true
		end
		if _fallthrough or value == "disabled" then
			_fallthrough = true
		end
		if _fallthrough or value == "inverse" then
			return true
		end
		return false
	until true
end
local function isBackgroundColorRole(value)
	repeat
		local _fallthrough = false
		if value == "default" then
			_fallthrough = true
		end
		if _fallthrough or value == "surface" then
			_fallthrough = true
		end
		if _fallthrough or value == "raised" then
			return true
		end
		return false
	until true
end
local function isBorderColorRole(value)
	repeat
		local _fallthrough = false
		if value == "subtle" then
			_fallthrough = true
		end
		if _fallthrough or value == "default" then
			_fallthrough = true
		end
		if _fallthrough or value == "strong" then
			return true
		end
		return false
	until true
end
local function isActionColorRole(value)
	repeat
		local _fallthrough = false
		if value == "hover" then
			_fallthrough = true
		end
		if _fallthrough or value == "pressed" then
			_fallthrough = true
		end
		if _fallthrough or value == "disabled" then
			_fallthrough = true
		end
		if _fallthrough or value == "disabledBackground" then
			return true
		end
		return false
	until true
end
local function resolvePaletteColor(theme, colorName, shade, token)
	if not isColorName(colorName) then
		error(`[prism/theme] Unknown palette color family "{colorName}" in token "{token}".`)
	end
	if not isColorShade(shade) then
		error(`[prism/theme] Unknown color shade "{shade}" in token "{token}".`)
	end
	return theme.colors.palette[colorName][shade]
end
local function resolveColorToken(theme, value)
	if isSemanticIntent(value) then
		return theme.colors[value].main
	end
	local parts = string.split(value, ".")
	local first = parts[1]
	local second = parts[2]
	local third = parts[3]
	if #parts == 3 then
		if first ~= "palette" or second == nil or third == nil then
			error(`[prism/theme] Invalid color token \"{value}\". Expected semantic tokens like \"primary.main\" or palette tokens like \"palette.primary.5\".`)
		end
		return resolvePaletteColor(theme, second, third, value)
	end
	if #parts ~= 2 or first == nil or second == nil then
		error(`[prism/theme] Invalid color token \"{value}\". Expected semantic tokens like \"primary.main\" or palette tokens like \"palette.primary.5\".`)
	end
	if isSemanticIntent(first) then
		if not isSemanticIntentRole(second) then
			error(`[prism/theme] Unknown semantic role "{second}" in token "{value}".`)
		end
		return theme.colors[first][second]
	end
	if first == "text" then
		if not isTextColorRole(second) then
			error(`[prism/theme] Unknown text color role "{second}" in token "{value}".`)
		end
		return theme.colors.text[second]
	end
	if first == "background" then
		if not isBackgroundColorRole(second) then
			error(`[prism/theme] Unknown background color role "{second}" in token "{value}".`)
		end
		return theme.colors.background[second]
	end
	if first == "border" then
		if not isBorderColorRole(second) then
			error(`[prism/theme] Unknown border color role "{second}" in token "{value}".`)
		end
		return theme.colors.border[second]
	end
	if first == "action" then
		if not isActionColorRole(second) then
			error(`[prism/theme] Unknown action color role "{second}" in token "{value}".`)
		end
		return theme.colors.action[second]
	end
	return resolvePaletteColor(theme, first, second, value)
end
local function resolveColor(theme, value)
	-- Untyped (Luau) callers can pass anything; validate at runtime and
	-- reject bad shapes with the designed invalid-token message instead
	-- of an internal string.split error.
	local runtimeValue = value
	if typeof(runtimeValue) == "Color3" then
		return runtimeValue
	end
	if type(runtimeValue) == "table" then
		local token = runtimeValue.token
		if type(token) == "string" then
			return resolveColorToken(theme, token)
		end
	end
	if type(runtimeValue) == "string" then
		return resolveColorToken(theme, runtimeValue)
	end
	error(`[prism/theme] Invalid color value {tostring(runtimeValue)}. Expected a Color3, an exported theme ref like theme.text.primary, or a color token string.`)
end
local function resolveSize(theme, key, scale)
	repeat
		if scale == "spacing" then
			return resolveThemeSpacing(theme, key)
		end
		if scale == "radius" then
			return theme.radius[key]
		end
		if scale == "fontSizes" then
			return theme.fontSizes[key]
		end
	until true
end
return {
	resolveColor = resolveColor,
	resolveSize = resolveSize,
}
