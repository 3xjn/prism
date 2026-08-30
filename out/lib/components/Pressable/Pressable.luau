-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local composeEventMaps = TS.import(script, script.Parent.Parent, "_shared", "interaction").composeEventMaps
local usePressInteraction = TS.import(script, script.Parent.Parent, "_shared", "usePressInteraction").usePressInteraction
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local Pressable = React.forwardRef(function(props, ref)
	local _binding = props
	local Event = _binding.Event
	local Change = _binding.Change
	local onPress = _binding.onPress
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _condition = props.disabled
	if _condition == nil then
		_condition = false
	end
	local disabled = _condition
	local _condition_1 = props.active
	if _condition_1 == nil then
		_condition_1 = true
	end
	local active = _condition_1
	local interactive = active and not disabled
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
	}, props)
	local press = usePressInteraction({
		interactive = interactive,
		disabled = disabled,
		onActivated = onPress,
	})
	local _binding_1 = useResolvedStyleProps("pressable", mergedStyleProps)
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
	local computedSize
	local computedAutoSize
	if resolvedSize ~= nil then
		computedSize = resolvedSize
	elseif resolvedWidth ~= nil then
		computedSize = UDim2.new(resolvedWidth, UDim.new(0, 0))
		computedAutoSize = Enum.AutomaticSize.Y
	elseif resolvedHeight ~= nil then
		computedSize = UDim2.new(UDim.new(0, 0), resolvedHeight)
		computedAutoSize = Enum.AutomaticSize.X
	end
	local renderState = {
		state = press.state,
		hovered = press.hovered,
		pressed = press.pressed,
		disabled = disabled,
		active = active,
	}
	local children = if props.render ~= nil then props.render(renderState) else props.children
	local _exp = composeEventMaps(press.eventMap, Event)
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local _condition_2 = _result == nil
	if _condition_2 then
		_condition_2 = interactive
	end
	local rootEvent = useRootCursorEvent(_exp, if _condition_2 then mergedStyleProps.cursor else nil, not interactive)
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local decoratorChildren = {}
	local _object = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left = "slotProps"
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.padding
	end
	_object[_left] = _result_1
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object))
	local _object_1 = {
		constraint = resolvedConstraint,
	}
	local _left_1 = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.sizeConstraint
	end
	_object_1[_left_1] = _result_2
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_1))
	local _object_2 = {
		AutoButtonColor = false,
		Active = interactive,
		Selectable = interactive,
		BorderSizePixel = 0,
	}
	local _left_2 = "BackgroundTransparency"
	local _condition_3 = props.bgTransparency
	if _condition_3 == nil then
		_condition_3 = (if props.bg ~= nil then 0 else 1)
	end
	_object_2[_left_2] = _condition_3
	_object_2.BackgroundColor3 = resolvedBackgroundColor
	_object_2.Size = computedSize
	_object_2.AutomaticSize = computedAutoSize
	_object_2.Position = computedPosition
	_object_2.AnchorPoint = resolvedAnchor
	_object_2.ClipsDescendants = props.clip
	_object_2.Visible = props.visible
	_object_2.LayoutOrder = props.layoutOrder
	_object_2.ZIndex = props.zIndex
	_object_2.Text = ""
	_object_2.TextTransparency = 1
	_object_2.TextStrokeTransparency = 1
	_object_2.Event = rootEvent
	_object_2.Change = Change
	local textButtonInstanceProps = _object_2
	local _attributes = table.clone(textButtonInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	return React.createElement("textbutton", _attributes, decoratorChildren, children)
end)
Pressable.displayName = "Pressable"
return {
	Pressable = Pressable,
}
