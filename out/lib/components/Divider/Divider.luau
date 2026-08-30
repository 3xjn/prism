-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local resolveColorSafe = _useResolvedStyleProps.resolveColorSafe
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local DEFAULT_DIVIDER_THICKNESS = 1
local function resolveDividerThickness(theme, value)
	if value == nil then
		return DEFAULT_DIVIDER_THICKNESS
	end
	local _value = value
	if type(_value) == "number" then
		return value
	end
	return resolveThemeSizeSafe(theme, "divider", value, "spacing", DEFAULT_DIVIDER_THICKNESS)
end
local function resolveDividerColor(theme, value)
	if value == nil then
		return theme.colors.border.default
	end
	local _value = value
	if typeof(_value) == "Color3" then
		return value
	end
	return resolveColorSafe(theme, "divider", value, theme.colors.border.default) or theme.colors.border.default
end
local Divider = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local orientation = props.orientation or "horizontal"
	local thickness = resolveDividerThickness(theme, props.size)
	local backgroundColor = resolveDividerColor(theme, props.color)
	local computedSize = if orientation == "horizontal" then UDim2.new(1, 0, 0, thickness) else UDim2.new(0, thickness, 1, 0)
	local _exp = props.Event
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result == nil then props.cursor else nil)
	local frameInstanceProps = {
		BorderSizePixel = 0,
		BackgroundColor3 = backgroundColor,
		Size = computedSize,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		Event = rootEvent,
		Change = props.Change,
	}
	local _attributes = table.clone(frameInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	return React.createElement("frame", _attributes)
end)
Divider.displayName = "Divider"
return {
	Divider = Divider,
}
