-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local function resolveGap(theme, value)
	if value == nil then
		return nil
	end
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
			return UDim.new(0, resolveThemeSizeSafe(theme, "stack", value, "spacing", 0))
		end
		return resolveUDimSafe("stack", value, "gap")
	until true
end
local function resolveFillDirection(direction)
	return if direction == "horizontal" then Enum.FillDirection.Horizontal else Enum.FillDirection.Vertical
end
local function resolveHorizontalAlignment(direction, align, justify)
	local isVertical = direction ~= "horizontal"
	if isVertical then
		repeat
			if align == "start" then
				return Enum.HorizontalAlignment.Left
			end
			if align == "center" then
				return Enum.HorizontalAlignment.Center
			end
			if align == "end" then
				return Enum.HorizontalAlignment.Right
			end
			if align == "stretch" then
				return Enum.HorizontalAlignment.Center
			end
			return nil
		until true
	end
	repeat
		if justify == "start" then
			return Enum.HorizontalAlignment.Left
		end
		if justify == "center" then
			return Enum.HorizontalAlignment.Center
		end
		if justify == "end" then
			return Enum.HorizontalAlignment.Right
		end
		return nil
	until true
end
local function resolveVerticalAlignment(direction, align, justify)
	local isVertical = direction ~= "horizontal"
	if isVertical then
		repeat
			if justify == "start" then
				return Enum.VerticalAlignment.Top
			end
			if justify == "center" then
				return Enum.VerticalAlignment.Center
			end
			if justify == "end" then
				return Enum.VerticalAlignment.Bottom
			end
			return nil
		until true
	end
	repeat
		if align == "start" then
			return Enum.VerticalAlignment.Top
		end
		if align == "center" then
			return Enum.VerticalAlignment.Center
		end
		if align == "end" then
			return Enum.VerticalAlignment.Bottom
		end
		if align == "stretch" then
			return Enum.VerticalAlignment.Center
		end
		return nil
	until true
end
local function resolveHorizontalFlex(direction, justify)
	if direction ~= "horizontal" then
		return nil
	end
	repeat
		if justify == "fill" then
			return Enum.UIFlexAlignment.Fill
		end
		if justify == "spaceAround" then
			return Enum.UIFlexAlignment.SpaceAround
		end
		if justify == "spaceBetween" then
			return Enum.UIFlexAlignment.SpaceBetween
		end
		if justify == "spaceEvenly" then
			return Enum.UIFlexAlignment.SpaceEvenly
		end
		return nil
	until true
end
local function resolveVerticalFlex(direction, justify)
	if direction == "horizontal" then
		return nil
	end
	repeat
		if justify == "fill" then
			return Enum.UIFlexAlignment.Fill
		end
		if justify == "spaceAround" then
			return Enum.UIFlexAlignment.SpaceAround
		end
		if justify == "spaceBetween" then
			return Enum.UIFlexAlignment.SpaceBetween
		end
		if justify == "spaceEvenly" then
			return Enum.UIFlexAlignment.SpaceEvenly
		end
		return nil
	until true
end
local function resolveItemLineAlignment(align)
	if align == "stretch" then
		return Enum.ItemLineAlignment.Stretch
	end
	return nil
end
local Stack = React.forwardRef(function(props, ref)
	local _binding = props
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _binding_1 = useResolvedStyleProps("stack", props)
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
	local direction = props.direction or "vertical"
	local resolvedGap = resolveGap(theme, props.gap)
	local computedSize
	local computedAutoSize
	if resolvedSize ~= nil then
		computedSize = resolvedSize
	elseif resolvedWidth ~= nil and resolvedHeight ~= nil then
		computedSize = UDim2.new(resolvedWidth, resolvedHeight)
	elseif resolvedWidth ~= nil then
		computedSize = UDim2.new(resolvedWidth, UDim.new(0, 0))
		computedAutoSize = Enum.AutomaticSize.Y
	elseif resolvedHeight ~= nil then
		computedSize = UDim2.new(UDim.new(0, 0), resolvedHeight)
		computedAutoSize = Enum.AutomaticSize.X
	else
		computedAutoSize = Enum.AutomaticSize.XY
	end
	local horizontalAlignment = resolveHorizontalAlignment(direction, props.align, props.justify)
	local verticalAlignment = resolveVerticalAlignment(direction, props.align, props.justify)
	local horizontalFlex = resolveHorizontalFlex(direction, props.justify)
	local verticalFlex = resolveVerticalFlex(direction, props.justify)
	local itemLineAlignment = resolveItemLineAlignment(props.align)
	local decoratorChildren = {}
	local _object = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left = "slotProps"
	local _result = slotProps
	if _result ~= nil then
		_result = _result.padding
	end
	_object[_left] = _result
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object))
	local _object_1 = {
		constraint = resolvedConstraint,
	}
	local _left_1 = "slotProps"
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.sizeConstraint
	end
	_object_1[_left_1] = _result_1
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_1))
	local _attributes = {
		key = "list-layout",
		FillDirection = resolveFillDirection(direction),
		Padding = resolvedGap or UDim.new(0, 0),
		SortOrder = Enum.SortOrder.LayoutOrder,
		HorizontalAlignment = horizontalAlignment,
		VerticalAlignment = verticalAlignment,
		HorizontalFlex = horizontalFlex,
		VerticalFlex = verticalFlex,
		ItemLineAlignment = itemLineAlignment,
	}
	local _condition = props.wrap
	if _condition == nil then
		_condition = false
	end
	_attributes.Wraps = _condition
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.listLayout
	end
	if _result_2 then
		for _k, _v in _result_2 do
			_attributes[_k] = _v
		end
	end
	local _arg0 = React.createElement("uilistlayout", _attributes)
	table.insert(decoratorChildren, _arg0)
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _exp = props.Event
	local _result_3 = rootSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result_3 == nil then props.cursor else nil)
	local _object_2 = {
		BorderSizePixel = 0,
	}
	local _left_2 = "BackgroundTransparency"
	local _condition_1 = props.bgTransparency
	if _condition_1 == nil then
		_condition_1 = (if props.bg ~= nil then 0 else 1)
	end
	_object_2[_left_2] = _condition_1
	_object_2.Size = computedSize
	_object_2.AutomaticSize = computedAutoSize
	_object_2.Position = computedPosition
	_object_2.AnchorPoint = resolvedAnchor
	_object_2.BackgroundColor3 = resolvedBackgroundColor
	_object_2.ClipsDescendants = props.clip
	_object_2.Visible = props.visible
	_object_2.LayoutOrder = props.layoutOrder
	_object_2.ZIndex = props.zIndex
	_object_2.Event = rootEvent
	_object_2.Change = props.Change
	local frameInstanceProps = _object_2
	local _attributes_1 = table.clone(frameInstanceProps)
	setmetatable(_attributes_1, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes_1[_k] = _v
		end
	end
	_attributes_1.ref = ref
	return React.createElement("frame", _attributes_1, decoratorChildren, props.children)
end)
Stack.displayName = "Stack"
return {
	Stack = Stack,
}
