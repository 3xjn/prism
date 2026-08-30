-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local exports = {}
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveColor = _theme.resolveColor
local resolveSize = _theme.resolveSize
local useTheme = _theme.useTheme
local componentDiagnostics = TS.import(script, script.Parent.Parent.Parent, "utils", "diagnostics").componentDiagnostics
local _utils = TS.import(script, script.Parent.Parent.Parent, "utils")
local toUDim = _utils.toUDim
local toUDim2 = _utils.toUDim2
exports.mergeSharedStyleProps = TS.import(script, script.Parent, "mergeSharedStyleProps").mergeSharedStyleProps
local function isThemeSize(value)
	repeat
		local _fallthrough = false
		if value == "xs" then
			_fallthrough = true
		end
		if _fallthrough or value == "sm" then
			_fallthrough = true
		end
		if _fallthrough or value == "md" then
			_fallthrough = true
		end
		if _fallthrough or value == "lg" then
			_fallthrough = true
		end
		if _fallthrough or value == "xl" then
			return true
		end
		return false
	until true
end
local function formatFailure(componentName, message)
	return `[prism/{componentName}] {message}`
end
local function reportResolutionFailure(componentName, code, message)
	componentDiagnostics:violation(code, function()
		return formatFailure(componentName, message)
	end)
end
--* Report an invalid prop value through Prism's shared diagnostics policy. 
local function reportComponentFailure(componentName, message)
	reportResolutionFailure(componentName, "invalid-prop", message)
end
local function resolveColorSafe(theme, componentName, value, fallback)
	if value == nil then
		return nil
	end
	local success, result = pcall(function()
		return resolveColor(theme, value)
	end)
	if success and typeof(result) == "Color3" then
		return result
	end
	local message = if type(result) == "string" then result else `Failed to resolve color: {tostring(result)}`
	reportResolutionFailure(componentName, "invalid-color", message)
	return fallback
end
local function resolveThemeSizeSafe(theme, componentName, value, scale, fallback)
	local success, result = pcall(function()
		return resolveSize(theme, value, scale)
	end)
	if success and type(result) == "number" then
		return result
	end
	local message = if type(result) == "string" then result else `Failed to resolve {scale}: {tostring(result)}`
	reportResolutionFailure(componentName, "invalid-theme-size", message)
	return fallback
end
local function resolveUDimSafe(componentName, value, label, fallback)
	local success, result = pcall(function()
		return toUDim(value)
	end)
	if success and typeof(result) == "UDim" then
		return result
	end
	local message = if type(result) == "string" then result else `Failed to resolve {label}: {tostring(result)}`
	reportResolutionFailure(componentName, "invalid-size", message)
	return fallback or UDim.new(0, 0)
end
local function resolveUDim2Safe(componentName, value, label)
	if value == nil then
		return nil
	end
	local success, result = pcall(function()
		return toUDim2(value)
	end)
	if success and typeof(result) == "UDim2" then
		return result
	end
	local message = if type(result) == "string" then result else `Failed to resolve {label}: {tostring(result)}`
	reportResolutionFailure(componentName, "invalid-size-2d", message)
	return UDim2.fromOffset(0, 0)
end
local function resolveSpacing(theme, componentName, value)
	if value == nil then
		return nil
	end
	if isThemeSize(value) then
		return UDim.new(0, resolveThemeSizeSafe(theme, componentName, value, "spacing", 0))
	end
	return resolveUDimSafe(componentName, value, "spacing")
end
local function resolveConstraintAxis(componentName, value, label)
	if value == nil then
		return nil
	end
	local resolved = resolveUDimSafe(componentName, value, label)
	if resolved.Scale ~= 0 then
		reportResolutionFailure(componentName, "unsupported-constraint-scale", `{label} does not support scale-based values. Use sizeConstraint with raw Vector2 values instead.`)
		return nil
	end
	return resolved.Offset
end
local function resolveConstraintVector(componentName, minWidth, minHeight, explicitMin, maxWidth, maxHeight, explicitMax)
	local minX = resolveConstraintAxis(componentName, minWidth, "minWidth")
	local minY = resolveConstraintAxis(componentName, minHeight, "minHeight")
	local maxX = resolveConstraintAxis(componentName, maxWidth, "maxWidth")
	local maxY = resolveConstraintAxis(componentName, maxHeight, "maxHeight")
	local _condition = explicitMin
	if _condition == nil then
		local _result
		if minX ~= nil or minY ~= nil then
			local _condition_1 = minX
			if _condition_1 == nil then
				_condition_1 = 0
			end
			local _condition_2 = minY
			if _condition_2 == nil then
				_condition_2 = 0
			end
			_result = Vector2.new(_condition_1, _condition_2)
		else
			_result = nil
		end
		_condition = _result
	end
	local min = _condition
	local _condition_1 = explicitMax
	if _condition_1 == nil then
		local _result
		if maxX ~= nil or maxY ~= nil then
			local _condition_2 = maxX
			if _condition_2 == nil then
				_condition_2 = math.huge
			end
			local _condition_3 = maxY
			if _condition_3 == nil then
				_condition_3 = math.huge
			end
			_result = Vector2.new(_condition_2, _condition_3)
		else
			_result = nil
		end
		_condition_1 = _result
	end
	local max = _condition_1
	if min == nil and max == nil then
		return nil
	end
	return {
		min = min,
		max = max,
	}
end
local function useResolvedStyleProps(componentName, styleProps)
	local theme = useTheme()
	local resolvedWidth = if styleProps.width ~= nil then resolveUDimSafe(componentName, styleProps.width, "width") else nil
	local resolvedHeight = if styleProps.height ~= nil then resolveUDimSafe(componentName, styleProps.height, "height") else nil
	local resolvedSize = if resolvedWidth ~= nil and resolvedHeight ~= nil then UDim2.new(resolvedWidth, resolvedHeight) else nil
	local resolvedPosition = resolveUDim2Safe(componentName, styleProps.position, "position")
	local resolvedAnchor = styleProps.anchor or (if styleProps.center then Vector2.new(0.5, 0.5) else nil)
	local resolvedBackgroundColor = resolveColorSafe(theme, componentName, styleProps.bg, theme.colors.background.default)
	local _exp = componentName
	local _condition = styleProps.pt
	if _condition == nil then
		_condition = styleProps.py
		if _condition == nil then
			_condition = styleProps.p
		end
	end
	local paddingTop = resolveSpacing(theme, _exp, _condition)
	local _exp_1 = componentName
	local _condition_1 = styleProps.pr
	if _condition_1 == nil then
		_condition_1 = styleProps.px
		if _condition_1 == nil then
			_condition_1 = styleProps.p
		end
	end
	local paddingRight = resolveSpacing(theme, _exp_1, _condition_1)
	local _exp_2 = componentName
	local _condition_2 = styleProps.pb
	if _condition_2 == nil then
		_condition_2 = styleProps.py
		if _condition_2 == nil then
			_condition_2 = styleProps.p
		end
	end
	local paddingBottom = resolveSpacing(theme, _exp_2, _condition_2)
	local _exp_3 = componentName
	local _condition_3 = styleProps.pl
	if _condition_3 == nil then
		_condition_3 = styleProps.px
		if _condition_3 == nil then
			_condition_3 = styleProps.p
		end
	end
	local paddingLeft = resolveSpacing(theme, _exp_3, _condition_3)
	local hasPadding = paddingTop ~= nil or paddingRight ~= nil or paddingBottom ~= nil or paddingLeft ~= nil
	local _exp_4 = componentName
	local _exp_5 = styleProps.minWidth
	local _exp_6 = styleProps.minHeight
	local _result = styleProps.sizeConstraint
	if _result ~= nil then
		_result = _result.min
	end
	local _exp_7 = styleProps.maxWidth
	local _exp_8 = styleProps.maxHeight
	local _result_1 = styleProps.sizeConstraint
	if _result_1 ~= nil then
		_result_1 = _result_1.max
	end
	local resolvedConstraint = resolveConstraintVector(_exp_4, _exp_5, _exp_6, _result, _exp_7, _exp_8, _result_1)
	return {
		theme = theme,
		resolvedWidth = resolvedWidth,
		resolvedHeight = resolvedHeight,
		resolvedSize = resolvedSize,
		resolvedPosition = resolvedPosition,
		resolvedAnchor = resolvedAnchor,
		resolvedBackgroundColor = resolvedBackgroundColor,
		resolvedConstraint = resolvedConstraint,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
		hasPadding = hasPadding,
	}
end
exports.reportComponentFailure = reportComponentFailure
exports.resolveColorSafe = resolveColorSafe
exports.resolveThemeSizeSafe = resolveThemeSizeSafe
exports.resolveUDimSafe = resolveUDimSafe
exports.useResolvedStyleProps = useResolvedStyleProps
return exports
