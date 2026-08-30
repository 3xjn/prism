-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local renderElevationShadow = TS.import(script, script.Parent.Parent, "_shared", "elevation").renderElevationShadow
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local isPressInput = _interaction.isPressInput
local resolveDragInputKind = _interaction.resolveDragInputKind
local shouldHandleDragEndInput = _interaction.shouldHandleDragEndInput
local shouldHandleMouseDragMoveInput = _interaction.shouldHandleMouseDragMoveInput
local shouldHandleTouchDragMoveInput = _interaction.shouldHandleTouchDragMoveInput
local DRAG_OVERLAY_Z_INDEX = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").DRAG_OVERLAY_Z_INDEX
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local DRAG_LIFT_SCALE = 0.04
local DRAG_LIFT_ROTATION = 1.5
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
			return UDim.new(0, resolveThemeSizeSafe(theme, "draggable", value, "spacing", 0))
		end
		return resolveUDimSafe("draggable", value, "gap")
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
	return if align == "stretch" then Enum.ItemLineAlignment.Stretch else nil
end
local function resolveInputPosition(input)
	return Vector2.new(input.Position.X, input.Position.Y)
end
local function resolveAxisLockedDragPosition(direction, inputPosition, grabOffset, origin)
	local _inputPosition = inputPosition
	local _grabOffset = grabOffset
	local freePosition = _inputPosition - _grabOffset
	return if direction == "horizontal" then Vector2.new(freePosition.X, origin.Y) else Vector2.new(origin.X, freePosition.Y)
end
local function clampDragPositionToListBounds(position, itemSize, listInstance)
	if itemSize == nil or listInstance == nil then
		return position
	end
	local listPosition = listInstance.AbsolutePosition
	local listSize = listInstance.AbsoluteSize
	local minX = listPosition.X
	local minY = listPosition.Y
	local maxX = math.max(minX, listPosition.X + listSize.X - itemSize.X)
	local maxY = math.max(minY, listPosition.Y + listSize.Y - itemSize.Y)
	return Vector2.new(math.clamp(position.X, minX, maxX), math.clamp(position.Y, minY, maxY))
end
local function resolveItemCenter(direction, instance)
	return if direction == "horizontal" then instance.AbsolutePosition.X + instance.AbsoluteSize.X / 2 else instance.AbsolutePosition.Y + instance.AbsoluteSize.Y / 2
end
local function resolveVisualItemCenter(direction, visualPosition, instance)
	return if direction == "horizontal" then visualPosition.X + instance.AbsoluteSize.X / 2 else visualPosition.Y + instance.AbsoluteSize.Y / 2
end
local function findOrderIndex(order, itemId)
	for index = 0, #order - 1 do
		if order[index + 1] == itemId then
			return index
		end
	end
	return -1
end
local function areOrdersEqual(left, right)
	if #left ~= #right then
		return false
	end
	for index = 0, #left - 1 do
		if left[index + 1] ~= right[index + 1] then
			return false
		end
	end
	return true
end
local function dedupeItems(items)
	local seen = {}
	local unique = {}
	for _, item in items do
		local _id = item.id
		if seen[_id] ~= nil then
			continue
		end
		local _id_1 = item.id
		seen[_id_1] = true
		table.insert(unique, item)
	end
	return unique
end
local function buildItemRecord(items)
	local record = {}
	for _, item in items do
		record[item.id] = item
	end
	return record
end
local function normalizeOrder(candidate, items)
	local itemIds = {}
	for _, item in items do
		local _id = item.id
		itemIds[_id] = true
	end
	local seen = {}
	local normalized = {}
	for _, id in candidate or {} do
		if not (itemIds[id] ~= nil) or seen[id] ~= nil then
			continue
		end
		seen[id] = true
		table.insert(normalized, id)
	end
	for _, item in items do
		local _id = item.id
		if seen[_id] ~= nil then
			continue
		end
		local _id_1 = item.id
		seen[_id_1] = true
		local _id_2 = item.id
		table.insert(normalized, _id_2)
	end
	return normalized
end
local function resolveReorderedOrder(order, activeItemId, pointerCoordinate, itemRefs, direction)
	local _order = order
	local _activeItemId = activeItemId
	if not (table.find(_order, _activeItemId) ~= nil) then
		return order
	end
	-- ▼ ReadonlyArray.filter ▼
	local _newValue = {}
	local _callback = function(id)
		return id ~= activeItemId
	end
	local _length = 0
	for _k, _v in order do
		if _callback(_v, _k - 1, order) == true then
			_length += 1
			_newValue[_length] = _v
		end
	end
	-- ▲ ReadonlyArray.filter ▲
	local remaining = _newValue
	local insertionIndex = #remaining
	for index = 0, #remaining - 1 do
		local instance = itemRefs[remaining[index + 1]]
		if instance == nil then
			continue
		end
		if pointerCoordinate <= resolveItemCenter(direction, instance) then
			insertionIndex = index
			break
		end
	end
	local nextOrder = {}
	do
		local index = 0
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				index += 1
			else
				_shouldIncrement = true
			end
			if not (index < insertionIndex) then
				break
			end
			local _arg0 = remaining[index + 1]
			table.insert(nextOrder, _arg0)
		end
	end
	local _activeItemId_1 = activeItemId
	table.insert(nextOrder, _activeItemId_1)
	do
		local index = insertionIndex
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				index += 1
			else
				_shouldIncrement = true
			end
			if not (index < #remaining) then
				break
			end
			local _arg0 = remaining[index + 1]
			table.insert(nextOrder, _arg0)
		end
	end
	return nextOrder
end
local function resolveItemSize(direction, align)
	if direction == "horizontal" then
		if align == "stretch" then
			return {
				size = UDim2.fromScale(0, 1),
				automaticSize = Enum.AutomaticSize.X,
			}
		end
		return {
			automaticSize = Enum.AutomaticSize.XY,
		}
	end
	if align == "stretch" then
		return {
			size = UDim2.fromScale(1, 0),
			automaticSize = Enum.AutomaticSize.Y,
		}
	end
	return {
		automaticSize = Enum.AutomaticSize.XY,
	}
end
local function resolveMeasuredItemLayout(measuredSize)
	if measuredSize == nil or measuredSize.X <= 0 or measuredSize.Y <= 0 then
		return {}
	end
	return {
		size = UDim2.fromOffset(measuredSize.X, measuredSize.Y),
		automaticSize = Enum.AutomaticSize.None,
	}
end
local function DraggableItemButton(props)
	local theme = useTheme()
	local itemInstance, setItemInstance = React.useState()
	local animatedOffset, setAnimatedOffset = React.useState(Vector2.new(0, 0))
	local measuredSize, setMeasuredSize = React.useState()
	local lastAbsolutePositionRef = React.useRef()
	local draggingRef = React.useRef(props.itemHidden)
	local transitionConnectionRef = React.useRef(nil)
	local transitionVersionRef = React.useRef(0)
	local shiftMotionRef = React.useRef(theme.motion)
	local itemSize = React.useMemo(function()
		return resolveItemSize(props.direction, props.align)
	end, { props.align, props.direction })
	draggingRef.current = props.itemHidden
	shiftMotionRef.current = theme.motion
	local stopTransition = React.useCallback(function()
		local _result = transitionConnectionRef.current
		if _result ~= nil then
			_result:Disconnect()
		end
		transitionConnectionRef.current = nil
		transitionVersionRef.current += 1
	end, {})
	local animateOffsetToZero = React.useCallback(function(offset)
		stopTransition()
		setAnimatedOffset(offset)
		local version = transitionVersionRef.current
		local startedAt = os.clock()
		transitionConnectionRef.current = RunService.Heartbeat:Connect(function()
			if transitionVersionRef.current ~= version then
				local _result = transitionConnectionRef.current
				if _result ~= nil then
					_result:Disconnect()
				end
				transitionConnectionRef.current = nil
				return nil
			end
			local motion = shiftMotionRef.current
			local alpha = math.clamp((os.clock() - startedAt) / math.max(motion.duration.normal, 0.01), 0, 1)
			local easedAlpha = TweenService:GetValue(alpha, motion.easing.out.style, motion.easing.out.direction)
			local remainingAlpha = 1 - easedAlpha
			setAnimatedOffset(Vector2.new(offset.X * remainingAlpha, offset.Y * remainingAlpha))
			if alpha >= 1 then
				local _result = transitionConnectionRef.current
				if _result ~= nil then
					_result:Disconnect()
				end
				transitionConnectionRef.current = nil
				setAnimatedOffset(Vector2.new(0, 0))
			end
		end)
	end, { stopTransition })
	React.useEffect(function()
		if itemInstance == nil then
			return nil
		end
		local updateMeasuredSize = function()
			local nextSize = itemInstance.AbsoluteSize
			if nextSize.X <= 0 or nextSize.Y <= 0 then
				return nil
			end
			setMeasuredSize(function(currentSize)
				return if currentSize ~= nil and currentSize.X == nextSize.X and currentSize.Y == nextSize.Y then currentSize else nextSize
			end)
		end
		updateMeasuredSize()
		local absoluteSizeConnection = itemInstance:GetPropertyChangedSignal("AbsoluteSize"):Connect(updateMeasuredSize)
		return function()
			absoluteSizeConnection:Disconnect()
		end
	end, { itemInstance })
	React.useEffect(function()
		if itemInstance == nil then
			return nil
		end
		lastAbsolutePositionRef.current = itemInstance.AbsolutePosition
		local updateLayoutOffset = function()
			local previousPosition = lastAbsolutePositionRef.current
			local nextPosition = itemInstance.AbsolutePosition
			lastAbsolutePositionRef.current = nextPosition
			if previousPosition == nil or draggingRef.current then
				return nil
			end
			local offset = previousPosition - nextPosition
			if offset.X == 0 and offset.Y == 0 then
				return nil
			end
			animateOffsetToZero(offset)
		end
		local absolutePositionConnection = itemInstance:GetPropertyChangedSignal("AbsolutePosition"):Connect(updateLayoutOffset)
		return function()
			absolutePositionConnection:Disconnect()
		end
	end, { animateOffsetToZero, itemInstance })
	React.useEffect(function()
		if props.itemHidden then
			stopTransition()
			setAnimatedOffset(Vector2.new(0, 0))
		end
	end, { props.itemHidden, stopTransition })
	React.useEffect(function()
		return function()
			stopTransition()
		end
	end, { stopTransition })
	local internalEvent = {
		InputBegan = function(_button, input)
			props.onBeginDrag(props.item.id, props.item.disabled, input)
		end,
		InputChanged = function(_button, input)
			props.onDragMove(input)
		end,
		InputEnded = function(_button, input)
			props.onDragEnd(input)
		end,
	}
	local _result = props.slotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local _exp = composeEventMaps(internalEvent, _result)
	local _result_1 = props.slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Event
	end
	local _condition = _result_1 == nil
	if _condition then
		_condition = props.interactive and not props.itemDisabled
	end
	local itemEvent = useRootCursorEvent(_exp, if _condition then props.cursor else nil, not props.interactive or props.itemDisabled)
	local renderState = {
		item = props.item,
		index = props.index,
		dragging = props.itemDragging,
		active = props.itemActive,
		disabled = props.itemDisabled,
	}
	local renderedOffset = if props.itemHidden then Vector2.new(0, 0) else animatedOffset
	local hasVisualOffset = renderedOffset.X ~= 0 or renderedOffset.Y ~= 0
	local measuredLayout = if props.itemHidden or hasVisualOffset then resolveMeasuredItemLayout(measuredSize) else nil
	local _result_2 = measuredLayout
	if _result_2 ~= nil then
		_result_2 = _result_2.size
	end
	local _condition_1 = _result_2
	if _condition_1 == nil then
		_condition_1 = itemSize.size
	end
	local layoutSize = _condition_1
	local _result_3 = measuredLayout
	if _result_3 ~= nil then
		_result_3 = _result_3.automaticSize
	end
	local _condition_2 = _result_3
	if _condition_2 == nil then
		_condition_2 = itemSize.automaticSize
	end
	local layoutAutomaticSize = _condition_2
	local _result_4 = measuredLayout
	if _result_4 ~= nil then
		_result_4 = _result_4.size
	end
	local _condition_3 = _result_4
	if _condition_3 == nil then
		_condition_3 = itemSize.size or UDim2.fromScale(1, 1)
	end
	local visualSize = _condition_3
	local _result_5 = measuredLayout
	if _result_5 ~= nil then
		_result_5 = _result_5.automaticSize
	end
	local _condition_4 = _result_5
	if _condition_4 == nil then
		_condition_4 = (if itemSize.size == nil then itemSize.automaticSize else Enum.AutomaticSize.None)
	end
	local visualAutomaticSize = _condition_4
	local _attributes = {
		AutoButtonColor = false,
		Active = props.interactive and not props.itemDisabled,
		Selectable = props.interactive and not props.itemDisabled,
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		BackgroundColor3 = props.resolvedBackgroundColor,
		Size = layoutSize,
		AutomaticSize = layoutAutomaticSize,
		LayoutOrder = props.index,
		Event = itemEvent,
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ref = function(instance)
			setItemInstance(function(currentInstance)
				return if currentInstance == instance then currentInstance else instance
			end)
			props.setItemRef(props.item.id, instance)
		end,
	}
	local _attribute = props.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	return React.createElement("textbutton", _attributes, React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromOffset(renderedOffset.X, renderedOffset.Y),
		Size = visualSize,
		AutomaticSize = visualAutomaticSize,
		Active = false,
		Selectable = false,
		Visible = not props.itemHidden,
	}, props.renderItem(renderState)))
end
local function DraggableComponent(props, ref)
	local _binding = props
	local items = _binding.items
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	local onReorder = _binding.onReorder
	local renderItem = _binding.renderItem
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = false
	end
	local active = _binding.active
	if active == nil then
		active = true
	end
	local Event = _binding.Event
	local Change = _binding.Change
	local slotProps = _binding.slotProps
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
	}, props)
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _itemSlotProps = slotProps
	if _itemSlotProps ~= nil then
		_itemSlotProps = _itemSlotProps.item
	end
	local itemSlotProps = _itemSlotProps
	local direction = props.direction or "vertical"
	local interactive = active and not disabled
	local controlled = value ~= nil
	local uniqueItems = React.useMemo(function()
		return dedupeItems(items)
	end, { items })
	local itemRecord = React.useMemo(function()
		return buildItemRecord(uniqueItems)
	end, { uniqueItems })
	local uncontrolledOrder, setUncontrolledOrder = React.useState(function()
		return normalizeOrder(defaultValue, uniqueItems)
	end)
	local resolvedOrder = React.useMemo(function()
		return normalizeOrder(if controlled then value else uncontrolledOrder, uniqueItems)
	end, { controlled, uniqueItems, uncontrolledOrder, value })
	local activeItemId, setActiveItemId = React.useState(nil)
	local draggingItemId, setDraggingItemId = React.useState(nil)
	local settlingItemId, setSettlingItemId = React.useState(nil)
	local dragVisualPosition, setDragVisualPosition = React.useState(nil)
	local dragVisualSize, setDragVisualSize = React.useState(nil)
	local rootInstance, setRootInstance = React.useState()
	local listInstance, setListInstance = React.useState()
	local measuredListSize, setMeasuredListSize = React.useState()
	local itemRefs = React.useRef({})
	local currentOrderRef = React.useRef(resolvedOrder)
	local dragKindRef = React.useRef(nil)
	local activeTouchRef = React.useRef(nil)
	local dragGrabOffsetRef = React.useRef(nil)
	local dragOriginRef = React.useRef(nil)
	local dragVisualSizeRef = React.useRef(nil)
	local moveConnectionRef = React.useRef(nil)
	local endConnectionRef = React.useRef(nil)
	local settleConnectionRef = React.useRef(nil)
	local dragVisualPositionRef = React.useRef(nil)
	local draggingItemIdRef = React.useRef(nil)
	local configRef = React.useRef({
		controlled = controlled,
		direction = direction,
	})
	local onReorderRef = React.useRef(onReorder)
	onReorderRef.current = onReorder
	currentOrderRef.current = resolvedOrder
	configRef.current = {
		controlled = controlled,
		direction = direction,
	}
	local _binding_1 = useResolvedStyleProps("draggable", mergedStyleProps)
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
	local themeRef = React.useRef(theme)
	themeRef.current = theme
	local disconnectDragTracking = React.useCallback(function()
		local _result = moveConnectionRef.current
		if _result ~= nil then
			_result:Disconnect()
		end
		moveConnectionRef.current = nil
		local _result_1 = endConnectionRef.current
		if _result_1 ~= nil then
			_result_1:Disconnect()
		end
		endConnectionRef.current = nil
		dragKindRef.current = nil
		activeTouchRef.current = nil
		dragGrabOffsetRef.current = nil
		dragOriginRef.current = nil
		dragVisualSizeRef.current = nil
	end, {})
	local stopSettle = React.useCallback(function()
		local _result = settleConnectionRef.current
		if _result ~= nil then
			_result:Disconnect()
		end
		settleConnectionRef.current = nil
		setSettlingItemId(nil)
	end, {})
	local clearDragVisual = React.useCallback(function()
		dragVisualPositionRef.current = nil
		setDragVisualPosition(nil)
		setDragVisualSize(nil)
	end, {})
	local endDrag = React.useCallback(function(clearActiveItem)
		local itemId = draggingItemIdRef.current
		local startPosition = dragVisualPositionRef.current
		disconnectDragTracking()
		draggingItemIdRef.current = nil
		setDraggingItemId(nil)
		if clearActiveItem then
			setActiveItemId(nil)
		end
		-- Settle: fly the overlay back to its slot before releasing it,
		-- tracking the slot live in case layout shifts mid-flight.
		local targetInstance = if itemId ~= nil then itemRefs.current[itemId] else nil
		if itemId == nil or startPosition == nil or targetInstance == nil then
			clearDragVisual()
			return nil
		end
		stopSettle()
		setSettlingItemId(itemId)
		local motion = themeRef.current.motion
		local duration = math.max(motion.duration.slow, 0.01)
		local startedAt = os.clock()
		settleConnectionRef.current = RunService.Heartbeat:Connect(function()
			local instance = itemRefs.current[itemId]
			local alpha = math.clamp((os.clock() - startedAt) / duration, 0, 1)
			if instance == nil or alpha >= 1 then
				local _result = settleConnectionRef.current
				if _result ~= nil then
					_result:Disconnect()
				end
				settleConnectionRef.current = nil
				setSettlingItemId(nil)
				clearDragVisual()
				return nil
			end
			local easedAlpha = TweenService:GetValue(alpha, motion.easing.out.style, motion.easing.out.direction)
			setDragVisualPosition(startPosition:Lerp(instance.AbsolutePosition, easedAlpha))
		end)
	end, { clearDragVisual, disconnectDragTracking, stopSettle })
	local commitOrder = React.useCallback(function(nextOrder)
		local previousOrder = currentOrderRef.current
		if areOrdersEqual(nextOrder, previousOrder) then
			return previousOrder
		end
		currentOrderRef.current = nextOrder
		if not configRef.current.controlled then
			setUncontrolledOrder(nextOrder)
		end
		local _result = onReorderRef.current
		if _result ~= nil then
			_result(nextOrder)
		end
		return nextOrder
	end, {})
	local updateDragVisualPosition = React.useCallback(function(input)
		local grabOffset = dragGrabOffsetRef.current
		local origin = dragOriginRef.current
		if grabOffset == nil or origin == nil then
			return nil
		end
		local pointerPosition = resolveAxisLockedDragPosition(configRef.current.direction, resolveInputPosition(input), grabOffset, origin)
		local visualPosition = clampDragPositionToListBounds(pointerPosition, dragVisualSizeRef.current, listInstance)
		dragVisualPositionRef.current = visualPosition
		setDragVisualPosition(visualPosition)
		-- Reordering follows the unclamped pointer: the clamp caps the visual's center at the
		-- boundary slots' centers, which would make the trailing slot unreachable.
		return pointerPosition
	end, { listInstance })
	local updateOrderFromInput = React.useCallback(function(pointerPosition)
		local activeId = draggingItemIdRef.current
		if activeId == nil or pointerPosition == nil then
			return nil
		end
		local activeInstance = itemRefs.current[activeId]
		if activeInstance == nil then
			return nil
		end
		commitOrder(resolveReorderedOrder(currentOrderRef.current, activeId, resolveVisualItemCenter(configRef.current.direction, pointerPosition, activeInstance), itemRefs.current, configRef.current.direction))
	end, { commitOrder })
	local handleDragMoveInput = React.useCallback(function(input)
		if shouldHandleMouseDragMoveInput(dragKindRef.current, input) then
			local pointerPosition = updateDragVisualPosition(input)
			updateOrderFromInput(pointerPosition)
			return nil
		end
		if shouldHandleTouchDragMoveInput(dragKindRef.current, activeTouchRef.current, input) then
			local pointerPosition = updateDragVisualPosition(input)
			updateOrderFromInput(pointerPosition)
		end
	end, { updateDragVisualPosition, updateOrderFromInput })
	local handleDragEndInput = React.useCallback(function(input)
		if not shouldHandleDragEndInput(dragKindRef.current, activeTouchRef.current, input) then
			return nil
		end
		endDrag(true)
	end, { endDrag })
	local beginDrag = React.useCallback(function(itemId, itemDisabled, input)
		if not interactive or itemDisabled or not isPressInput(input) then
			return nil
		end
		local dragKind = resolveDragInputKind(input)
		if dragKind == nil then
			return nil
		end
		disconnectDragTracking()
		stopSettle()
		local itemInstance = itemRefs.current[itemId]
		if itemInstance ~= nil then
			local inputPosition = resolveInputPosition(input)
			local _absolutePosition = itemInstance.AbsolutePosition
			local grabOffset = inputPosition - _absolutePosition
			dragGrabOffsetRef.current = grabOffset
			dragOriginRef.current = itemInstance.AbsolutePosition
			dragVisualSizeRef.current = itemInstance.AbsoluteSize
			dragVisualPositionRef.current = itemInstance.AbsolutePosition
			setDragVisualPosition(itemInstance.AbsolutePosition)
			setDragVisualSize(itemInstance.AbsoluteSize)
		else
			dragOriginRef.current = nil
			dragVisualSizeRef.current = nil
			dragVisualPositionRef.current = nil
			setDragVisualPosition(nil)
			setDragVisualSize(nil)
		end
		dragKindRef.current = dragKind
		activeTouchRef.current = if dragKind == "touch" then input else nil
		draggingItemIdRef.current = itemId
		setActiveItemId(itemId)
		setDraggingItemId(itemId)
		moveConnectionRef.current = UserInputService.InputChanged:Connect(function(changedInput)
			handleDragMoveInput(changedInput)
		end)
		endConnectionRef.current = UserInputService.InputEnded:Connect(function(endedInput)
			handleDragEndInput(endedInput)
		end)
	end, { disconnectDragTracking, handleDragEndInput, handleDragMoveInput, interactive, stopSettle, updateDragVisualPosition, updateOrderFromInput })
	React.useEffect(function()
		if controlled then
			return nil
		end
		setUncontrolledOrder(function(current)
			local normalizedOrder = normalizeOrder(current, uniqueItems)
			return if areOrdersEqual(normalizedOrder, current) then current else normalizedOrder
		end)
	end, { controlled, uniqueItems })
	React.useEffect(function()
		if interactive then
			return nil
		end
		endDrag(true)
	end, { endDrag, interactive })
	React.useEffect(function()
		local activeId = draggingItemIdRef.current
		if activeId == nil then
			return nil
		end
		if not (table.find(resolvedOrder, activeId) ~= nil) then
			endDrag(true)
			return nil
		end
		local activeItem = itemRecord[activeId]
		if activeItem == nil or activeItem.disabled then
			endDrag(true)
		end
	end, { endDrag, itemRecord, resolvedOrder })
	React.useEffect(function()
		return function()
			disconnectDragTracking()
			local _result = settleConnectionRef.current
			if _result ~= nil then
				_result:Disconnect()
			end
			settleConnectionRef.current = nil
		end
	end, { disconnectDragTracking })
	React.useEffect(function()
		if listInstance == nil then
			return nil
		end
		local updateMeasuredListSize = function()
			local nextSize = listInstance.AbsoluteSize
			if nextSize.X <= 0 or nextSize.Y <= 0 then
				return nil
			end
			setMeasuredListSize(function(currentSize)
				return if currentSize ~= nil and currentSize.X == nextSize.X and currentSize.Y == nextSize.Y then currentSize else nextSize
			end)
		end
		updateMeasuredListSize()
		local absoluteSizeConnection = listInstance:GetPropertyChangedSignal("AbsoluteSize"):Connect(updateMeasuredListSize)
		return function()
			absoluteSizeConnection:Disconnect()
		end
	end, { listInstance })
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
	local resolvedGap = resolveGap(theme, props.gap)
	local horizontalAlignment = resolveHorizontalAlignment(direction, props.align, props.justify)
	local verticalAlignment = resolveVerticalAlignment(direction, props.align, props.justify)
	local horizontalFlex = resolveHorizontalFlex(direction, props.justify)
	local verticalFlex = resolveVerticalFlex(direction, props.justify)
	local itemLineAlignment = resolveItemLineAlignment(props.align)
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local rootEvent = useRootCursorEvent(Event, nil, false)
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
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.listLayout
	end
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
		Wraps = false,
	}
	if _result_2 then
		for _k, _v in _result_2 do
			_attributes[_k] = _v
		end
	end
	local _arg0 = React.createElement("uilistlayout", _attributes)
	table.insert(decoratorChildren, _arg0)
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#resolvedOrder)
	local _callback = function(itemId, index)
		local item = itemRecord[itemId]
		if item == nil then
			return nil
		end
		local itemDisabled = disabled or item.disabled == true
		return React.createElement(DraggableItemButton, {
			key = item.id,
			item = item,
			index = index,
			interactive = interactive,
			itemDisabled = itemDisabled,
			itemActive = activeItemId == item.id,
			itemDragging = draggingItemId == item.id,
			itemHidden = draggingItemId == item.id or settlingItemId == item.id,
			direction = direction,
			align = props.align,
			cursor = mergedStyleProps.cursor,
			slotProps = itemSlotProps,
			resolvedBackgroundColor = resolvedBackgroundColor,
			renderItem = renderItem,
			onBeginDrag = beginDrag,
			onDragMove = handleDragMoveInput,
			onDragEnd = handleDragEndInput,
			setItemRef = function(resolvedItemId, instance)
				itemRefs.current[resolvedItemId] = instance
			end,
		})
	end
	for _k, _v in resolvedOrder do
		_newValue[_k] = _callback(_v, _k - 1, resolvedOrder)
	end
	-- ▲ ReadonlyArray.map ▲
	local itemElements = _newValue
	local shouldFreezeRootSize = draggingItemId ~= nil and computedAutoSize ~= nil and measuredListSize ~= nil
	local effectiveRootSize = if shouldFreezeRootSize then UDim2.fromOffset(measuredListSize.X, measuredListSize.Y) else computedSize
	local effectiveRootAutoSize = if shouldFreezeRootSize then Enum.AutomaticSize.None else computedAutoSize
	local _object_2 = {
		BorderSizePixel = 0,
	}
	local _left_2 = "BackgroundTransparency"
	local _condition = props.bgTransparency
	if _condition == nil then
		_condition = (if props.bg ~= nil then 0 else 1)
	end
	_object_2[_left_2] = _condition
	_object_2.Size = effectiveRootSize
	_object_2.AutomaticSize = effectiveRootAutoSize
	_object_2.Position = computedPosition
	_object_2.AnchorPoint = resolvedAnchor
	_object_2.BackgroundColor3 = resolvedBackgroundColor
	_object_2.ClipsDescendants = props.clip
	_object_2.Visible = props.visible
	_object_2.LayoutOrder = props.layoutOrder
	_object_2.ZIndex = props.zIndex
	_object_2.Event = rootEvent
	_object_2.Change = Change
	local frameInstanceProps = _object_2
	local rootRef = React.useCallback(function(instance)
		setRootInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local listRef = React.useCallback(function(instance)
		setListInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
	end, {})
	local _condition_1 = draggingItemId
	if _condition_1 == nil then
		_condition_1 = settlingItemId
	end
	local overlayItemId = _condition_1
	local overlayItem = if overlayItemId ~= nil then itemRecord[overlayItemId] else nil
	local overlayIndex = if overlayItemId ~= nil then findOrderIndex(resolvedOrder, overlayItemId) else -1
	local _result_3
	if dragVisualPosition ~= nil and rootInstance ~= nil then
		local _absolutePosition = rootInstance.AbsolutePosition
		_result_3 = dragVisualPosition - _absolutePosition
	else
		_result_3 = nil
	end
	local overlayPosition = _result_3
	local overlaySize = dragVisualSize or dragVisualSizeRef.current
	local animatedLift = useMotion({
		values = {
			lift = if draggingItemId ~= nil then 1 else 0,
		},
		transition = {
			lift = {
				duration = "fast",
				easing = "out",
			},
		},
	})
	local overlayElement = if overlayItem ~= nil and overlayPosition ~= nil and overlaySize ~= nil then (React.createElement("frame", {
		key = "drag-overlay",
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromOffset(overlayPosition.X, overlayPosition.Y),
		Size = UDim2.fromOffset(overlaySize.X, overlaySize.Y),
		Rotation = DRAG_LIFT_ROTATION * animatedLift.lift,
		ZIndex = DRAG_OVERLAY_Z_INDEX,
		Active = false,
		Selectable = false,
	}, renderElevationShadow({
		shadow = theme.shadows.md,
		radius = UDim.new(0, theme.radius.md),
		size = UDim2.fromOffset(overlaySize.X, overlaySize.Y),
		visible = animatedLift.lift > 0.05,
	}), React.createElement("uiscale", {
		Scale = 1 + DRAG_LIFT_SCALE * animatedLift.lift,
	}), renderItem({
		item = overlayItem,
		index = if overlayIndex >= 0 then overlayIndex else 0,
		dragging = true,
		active = true,
		disabled = disabled or overlayItem.disabled == true,
	}))) else nil
	local _attributes_1 = table.clone(frameInstanceProps)
	setmetatable(_attributes_1, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes_1[_k] = _v
		end
	end
	_attributes_1.ref = rootRef
	return React.createElement("frame", _attributes_1, React.createElement("frame", {
		key = "list",
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = computedSize or UDim2.fromScale(1, 0),
		AutomaticSize = computedAutoSize,
		ref = listRef,
	}, decoratorChildren, itemElements), React.createElement("frame", {
		key = "overlay-layer",
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromOffset(0, 0),
		Size = UDim2.fromOffset(0, 0),
		ZIndex = DRAG_OVERLAY_Z_INDEX,
	}, overlayElement))
end
local DraggableBase = React.forwardRef(DraggableComponent)
DraggableBase.displayName = "Draggable"
local Draggable = DraggableBase
return {
	Draggable = Draggable,
}
