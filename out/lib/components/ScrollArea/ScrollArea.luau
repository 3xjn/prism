-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local resolveColorSafe = _useResolvedStyleProps.resolveColorSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local function resolveScrollingDirection(direction)
	repeat
		local _fallthrough = false
		if direction == "horizontal" then
			return Enum.ScrollingDirection.X
		end
		if direction == "both" then
			return Enum.ScrollingDirection.XY
		end
		if direction == "vertical" then
		end
		return Enum.ScrollingDirection.Y
	until true
end
local function resolveAutomaticCanvasSize(direction, value)
	if value ~= nil then
		return value
	end
	repeat
		local _fallthrough = false
		if direction == "horizontal" then
			return Enum.AutomaticSize.X
		end
		if direction == "both" then
			return Enum.AutomaticSize.XY
		end
		if direction == "vertical" then
		end
		return Enum.AutomaticSize.Y
	until true
end
local function resolveContentSize(direction, scrollbarSize)
	repeat
		local _fallthrough = false
		if direction == "horizontal" then
			return UDim2.new(0, 0, 1, 0)
		end
		if direction == "both" then
			return UDim2.fromOffset(0, 0)
		end
		if direction == "vertical" then
		end
		return UDim2.new(1, -scrollbarSize, 0, 0)
	until true
end
local function resolveContentAutomaticSize(direction)
	repeat
		local _fallthrough = false
		if direction == "horizontal" then
			return Enum.AutomaticSize.X
		end
		if direction == "both" then
			return Enum.AutomaticSize.XY
		end
		if direction == "vertical" then
		end
		return Enum.AutomaticSize.Y
	until true
end
local function resolveScrollbarColor(theme, color)
	if color == nil then
		return theme.colors.text.disabled
	end
	local _color = color
	if typeof(_color) == "Color3" then
		return color
	end
	return resolveColorSafe(theme, "scrollArea", color, theme.colors.text.disabled) or theme.colors.text.disabled
end
local ScrollArea = React.forwardRef(function(props, ref)
	local _binding = props
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _contentSlotProps = slotProps
	if _contentSlotProps ~= nil then
		_contentSlotProps = _contentSlotProps.content
	end
	local contentSlotProps = _contentSlotProps
	local _binding_1 = useResolvedStyleProps("scrollArea", props)
	local theme = _binding_1.theme
	local resolvedWidth = _binding_1.resolvedWidth
	local resolvedHeight = _binding_1.resolvedHeight
	local resolvedSize = _binding_1.resolvedSize
	local resolvedPosition = _binding_1.resolvedPosition
	local resolvedAnchor = _binding_1.resolvedAnchor
	local resolvedBackgroundColor = _binding_1.resolvedBackgroundColor
	local resolvedConstraint = _binding_1.resolvedConstraint
	local paddingTop = _binding_1.paddingTop
	local paddingRight = _binding_1.paddingRight
	local paddingBottom = _binding_1.paddingBottom
	local paddingLeft = _binding_1.paddingLeft
	local hasPadding = _binding_1.hasPadding
	local _condition = props.scrollbarSize
	if _condition == nil then
		_condition = theme.spacing.xs
	end
	local scrollbarSize = _condition
	local computedSize
	if resolvedSize ~= nil then
		computedSize = resolvedSize
	elseif resolvedWidth ~= nil and resolvedHeight ~= nil then
		computedSize = UDim2.new(resolvedWidth, resolvedHeight)
	elseif resolvedWidth ~= nil then
		computedSize = UDim2.new(resolvedWidth, UDim.new(0, 0))
	elseif resolvedHeight ~= nil then
		computedSize = UDim2.new(UDim.new(0, 0), resolvedHeight)
	end
	local _exp = props.Event
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result == nil then props.cursor else nil)
	local _result_1
	if props.onCanvasPositionChange == nil then
		_result_1 = props.Change
	else
		local _object = {}
		local _spread = props.Change
		if _spread then
			for _k, _v in _spread do
				_object[_k] = _v
			end
		end
		_object.CanvasPosition = function(instance)
			local _result_2 = props.Change
			if _result_2 ~= nil then
				_result_2 = _result_2.CanvasPosition
				if _result_2 ~= nil then
					_result_2(instance)
				end
			end
			local _result_3 = props.onCanvasPositionChange
			if _result_3 ~= nil then
				_result_3(instance.CanvasPosition)
			end
		end
		_result_1 = _object
	end
	local rootChange = _result_1
	local _object = {}
	local _left = "Active"
	local _condition_1 = props.scrollingEnabled
	if _condition_1 == nil then
		_condition_1 = true
	end
	_object[_left] = _condition_1
	_object.AutomaticCanvasSize = resolveAutomaticCanvasSize(props.direction, props.automaticCanvasSize)
	_object.BackgroundColor3 = resolvedBackgroundColor
	local _left_1 = "BackgroundTransparency"
	local _condition_2 = props.bgTransparency
	if _condition_2 == nil then
		_condition_2 = (if props.bg ~= nil then 0 else 1)
	end
	_object[_left_1] = _condition_2
	_object.BorderSizePixel = 0
	_object.CanvasPosition = props.canvasPosition
	_object.CanvasSize = props.canvasSize or UDim2.fromOffset(0, 0)
	_object.ClipsDescendants = true
	_object.Position = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	_object.AnchorPoint = resolvedAnchor
	_object.ScrollBarImageColor3 = resolveScrollbarColor(theme, props.scrollbarColor)
	local _left_2 = "ScrollBarImageTransparency"
	local _condition_3 = props.scrollbarTransparency
	if _condition_3 == nil then
		_condition_3 = 0.2
	end
	_object[_left_2] = _condition_3
	_object.ScrollBarThickness = scrollbarSize
	_object.ScrollingDirection = resolveScrollingDirection(props.direction)
	local _left_3 = "ScrollingEnabled"
	local _condition_4 = props.scrollingEnabled
	if _condition_4 == nil then
		_condition_4 = true
	end
	_object[_left_3] = _condition_4
	_object.Selectable = false
	_object.Size = computedSize
	_object.Visible = props.visible
	_object.LayoutOrder = props.layoutOrder
	_object.ZIndex = props.zIndex
	_object.Event = rootEvent
	_object.Change = rootChange
	local rootInstanceProps = _object
	local _attributes = table.clone(rootInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	local _object_1 = {
		constraint = resolvedConstraint,
	}
	local _left_4 = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.sizeConstraint
	end
	_object_1[_left_4] = _result_2
	local _exp_1 = renderSizeConstraintDecorator(_object_1)
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = resolveContentSize(props.direction, scrollbarSize),
		AutomaticSize = resolveContentAutomaticSize(props.direction),
	}
	local _result_3 = rootSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_5 = _result_3
	if _condition_5 == nil then
		_condition_5 = props.zIndex
	end
	_attributes_1.ZIndex = _condition_5
	if contentSlotProps then
		for _k, _v in contentSlotProps do
			_attributes_1[_k] = _v
		end
	end
	local _object_2 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_5 = "slotProps"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.padding
	end
	_object_2[_left_5] = _result_4
	return React.createElement("scrollingframe", _attributes, _exp_1, React.createElement("frame", _attributes_1, renderPaddingDecorator(_object_2), props.children))
end)
ScrollArea.displayName = "ScrollArea"
return {
	ScrollArea = ScrollArea,
}
