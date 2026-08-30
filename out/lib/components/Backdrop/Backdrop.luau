-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local isPressInput = TS.import(script, script.Parent.Parent, "_shared", "interaction").isPressInput
local resolveColorSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveColorSafe
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local function resolveBackdropColor(theme, color)
	if color == nil then
		return theme.colors.text.primary
	end
	local _color = color
	if typeof(_color) == "Color3" then
		return color
	end
	return resolveColorSafe(theme, "backdrop", color, theme.colors.text.primary) or theme.colors.text.primary
end
local function resolveBackdropTransparency(opacity)
	local _condition = opacity
	if _condition == nil then
		_condition = 0.28
	end
	return 1 - math.clamp(_condition, 0, 1)
end
local function resolveUDim2Rect(root, rect)
	local rootSize = root.AbsoluteSize
	local absoluteSize = Vector2.new(rootSize.X * rect.size.X.Scale + rect.size.X.Offset, rootSize.Y * rect.size.Y.Scale + rect.size.Y.Offset)
	local absolutePosition = Vector2.new(rootSize.X * rect.position.X.Scale + rect.position.X.Offset, rootSize.Y * rect.position.Y.Scale + rect.position.Y.Offset)
	local anchor = rect.anchor or Vector2.new(0, 0)
	local _exp = root.AbsolutePosition + absolutePosition
	local _vector2 = Vector2.new(absoluteSize.X * anchor.X, absoluteSize.Y * anchor.Y)
	local min = _exp - _vector2
	return {
		min = min,
		max = min + absoluteSize,
	}
end
local function resolveInstanceRect(instance)
	local min = instance.AbsolutePosition
	local _object = {
		min = min,
	}
	local _left = "max"
	local _absoluteSize = instance.AbsoluteSize
	_object[_left] = min + _absoluteSize
	return _object
end
local function findInputObject(args)
	for _, value in args do
		if typeof(value) == "Instance" and value:IsA("InputObject") then
			return value
		end
	end
	return nil
end
local function findTextButton(args)
	for _, value in args do
		if typeof(value) == "Instance" and value:IsA("TextButton") then
			return value
		end
	end
	return nil
end
local function isInsideRect(point, rect)
	return point.X >= rect.min.X and point.X <= rect.max.X and point.Y >= rect.min.Y and point.Y <= rect.max.Y
end
local function shouldIgnoreBackdropPoint(root, input, excludeRect, excludeInstance)
	if not isPressInput(input) then
		return false
	end
	local point = Vector2.new(input.Position.X, input.Position.Y)
	if excludeInstance ~= nil and isInsideRect(point, resolveInstanceRect(excludeInstance)) then
		return true
	end
	return excludeRect ~= nil and isInsideRect(point, resolveUDim2Rect(root, excludeRect))
end
local function shouldIgnoreBackdropPress(args, excludeRect, excludeInstance)
	local root = findTextButton(args)
	local input = findInputObject(args)
	return root ~= nil and input ~= nil and shouldIgnoreBackdropPoint(root, input, excludeRect, excludeInstance)
end
local Backdrop = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local ignoreNextActivatedRef = React.useRef(false)
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _condition = props.active
	if _condition == nil then
		_condition = (props.onPress ~= nil or props.Event ~= nil)
	end
	local active = _condition
	local _rootInputBegan = props.Event
	if _rootInputBegan ~= nil then
		_rootInputBegan = _rootInputBegan.InputBegan
	end
	local rootInputBegan = _rootInputBegan
	local _rootActivated = props.Event
	if _rootActivated ~= nil then
		_rootActivated = _rootActivated.Activated
	end
	local rootActivated = _rootActivated
	local rootInputBeganEvent = function(...)
		local args = { ... }
		local _result = rootInputBegan
		if _result ~= nil then
			_result(unpack(args))
		end
		local root = findTextButton(args)
		local input = findInputObject(args)
		ignoreNextActivatedRef.current = root ~= nil and input ~= nil and shouldIgnoreBackdropPoint(root, input, props.excludeRect, props.excludeInstance)
	end
	local rootActivatedEvent = if props.onPress == nil and rootActivated == nil then nil else function(...)
		local args = { ... }
		if ignoreNextActivatedRef.current or shouldIgnoreBackdropPress(args, props.excludeRect, props.excludeInstance) then
			ignoreNextActivatedRef.current = false
			return nil
		end
		local _result = rootActivated
		if _result ~= nil then
			_result(unpack(args))
		end
		local _result_1 = props.onPress
		if _result_1 ~= nil then
			_result_1()
		end
	end
	local _result
	if rootActivatedEvent == nil and props.excludeRect == nil and props.excludeInstance == nil then
		_result = props.Event
	else
		local _object = {}
		local _spread = props.Event
		if _spread then
			for _k, _v in _spread do
				_object[_k] = _v
			end
		end
		_object.InputBegan = rootInputBeganEvent
		_object.Activated = rootActivatedEvent
		_result = _object
	end
	local rootEvents = _result
	local _result_1 = rootSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Event
	end
	local _condition_1 = _result_1 == nil
	if _condition_1 then
		_condition_1 = active
	end
	local rootEvent = useRootCursorEvent(rootEvents, if _condition_1 then props.cursor or "pointer" else nil, not active)
	local rootInstanceProps = {
		AutoButtonColor = false,
		Active = active,
		Selectable = active,
		BackgroundColor3 = resolveBackdropColor(theme, props.color),
		BackgroundTransparency = resolveBackdropTransparency(props.opacity),
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		Visible = props.visible,
		ZIndex = props.zIndex,
		Event = rootEvent,
		Change = props.Change,
	}
	local _attributes = table.clone(rootInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	return React.createElement("textbutton", _attributes)
end)
Backdrop.displayName = "Backdrop"
return {
	Backdrop = Backdrop,
}
