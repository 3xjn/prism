-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _layering = TS.import(script, script.Parent.Parent, "_shared", "layering")
local CaptureOverlay = _layering.CaptureOverlay
local usePortalTarget = _layering.usePortalTarget
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local Tooltip = TS.import(script, script.Parent.Parent, "Tooltip").Tooltip
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local isMouseDragActive = _interaction.isMouseDragActive
local isPressInput = _interaction.isPressInput
local resolveDragInputKind = _interaction.resolveDragInputKind
local shouldHandleDragEndInput = _interaction.shouldHandleDragEndInput
local shouldHandleMouseDragMoveInput = _interaction.shouldHandleMouseDragMoveInput
local shouldHandleTouchDragMoveInput = _interaction.shouldHandleTouchDragMoveInput
local useSliderControllerInput = TS.import(script, script.Parent, "controllerInput").useSliderControllerInput
local _utils = TS.import(script, script.Parent, "utils")
local alphaToValue = _utils.alphaToValue
local normalizeSliderValue = _utils.normalizeSliderValue
local resolveAlphaFromPositionX = _utils.resolveAlphaFromPositionX
local resolveSliderRange = _utils.resolveSliderRange
local resolveTextFontFace = _utils.resolveTextFontFace
local resolveValidStep = _utils.resolveValidStep
local stepSliderValue = _utils.stepSliderValue
local valueToAlpha = _utils.valueToAlpha
local _styles = TS.import(script, script.Parent, "styles")
local resolveSliderSizeStyles = _styles.resolveSliderSizeStyles
local resolveSliderVisualStyles = _styles.resolveSliderVisualStyles
local UserInputService = game:GetService("UserInputService")
local function resolveSliderTooltipContent(tooltip, value)
	if tooltip == nil or tooltip == false then
		return nil
	end
	if tooltip == true then
		return tostring(value)
	end
	local _tooltip = tooltip
	if type(_tooltip) == "string" then
		return tooltip
	end
	return tooltip(value)
end
local SliderBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local color = _binding.color
	if color == nil then
		color = "primary"
	end
	local size = _binding.size
	if size == nil then
		size = "md"
	end
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = false
	end
	local fullWidth = _binding.fullWidth
	if fullWidth == nil then
		fullWidth = false
	end
	local min = _binding.min
	local max = _binding.max
	local step = _binding.step
	local styleOverrides = _binding.styleOverrides
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	local tooltip = _binding.tooltip
	local onChange = _binding.onChange
	local onChangeEnd = _binding.onChangeEnd
	local Event = _binding.Event
	local Change = _binding.Change
	local hovered, setHovered = React.useState(false)
	local dragging, setDragging = React.useState(false)
	local dragValueOverride, setDragValueOverride = React.useState(nil)
	local hitboxInstance, setHitboxInstance = React.useState()
	local portalTarget = usePortalTarget(hitboxInstance)
	local uncontrolledValue, setUncontrolledValue = React.useState(function()
		local initialRange = resolveSliderRange(min, max)
		local _condition = value
		if _condition == nil then
			_condition = defaultValue
			if _condition == nil then
				_condition = initialRange.min
			end
		end
		return normalizeSliderValue(_condition, initialRange, resolveValidStep(step))
	end)
	local sizeStyles = resolveSliderSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
	}, props)
	local _binding_1 = useResolvedStyleProps("slider", mergedStyleProps)
	local resolvedWidth = _binding_1.resolvedWidth
	local resolvedHeight = _binding_1.resolvedHeight
	local resolvedSize = _binding_1.resolvedSize
	local resolvedPosition = _binding_1.resolvedPosition
	local resolvedAnchor = _binding_1.resolvedAnchor
	local resolvedConstraint = _binding_1.resolvedConstraint
	local paddingTop = _binding_1.paddingTop
	local paddingRight = _binding_1.paddingRight
	local paddingBottom = _binding_1.paddingBottom
	local paddingLeft = _binding_1.paddingLeft
	local hasPadding = _binding_1.hasPadding
	local sliderRange = React.useMemo(function()
		return resolveSliderRange(min, max)
	end, { min, max })
	local resolvedStep = React.useMemo(function()
		return resolveValidStep(step)
	end, { step })
	local _condition = value
	if _condition == nil then
		_condition = uncontrolledValue
	end
	local resolvedValue = normalizeSliderValue(_condition, sliderRange, resolvedStep)
	local _condition_1 = dragValueOverride
	if _condition_1 == nil then
		_condition_1 = resolvedValue
	end
	local displayValue = _condition_1
	local displayAlpha = valueToAlpha(displayValue, sliderRange)
	local onChangeRef = React.useRef(onChange)
	local onChangeEndRef = React.useRef(onChangeEnd)
	local configRef = React.useRef({
		range = sliderRange,
		step = resolvedStep,
		controlled = value ~= nil,
	})
	local trackRef = React.useRef()
	local dragKindRef = React.useRef(nil)
	local activeTouchRef = React.useRef(nil)
	local moveConnectionRef = React.useRef(nil)
	local endConnectionRef = React.useRef(nil)
	local draggingRef = React.useRef(false)
	local dragValueRef = React.useRef(displayValue)
	onChangeRef.current = onChange
	onChangeEndRef.current = onChangeEnd
	configRef.current = {
		range = sliderRange,
		step = resolvedStep,
		controlled = value ~= nil,
	}
	dragValueRef.current = displayValue
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _labelSlotProps = slotProps
	if _labelSlotProps ~= nil then
		_labelSlotProps = _labelSlotProps.label
	end
	local labelSlotProps = _labelSlotProps
	local _valueLabelSlotProps = slotProps
	if _valueLabelSlotProps ~= nil then
		_valueLabelSlotProps = _valueLabelSlotProps.valueLabel
	end
	local valueLabelSlotProps = _valueLabelSlotProps
	local _trackSlotProps = slotProps
	if _trackSlotProps ~= nil then
		_trackSlotProps = _trackSlotProps.track
	end
	local trackSlotProps = _trackSlotProps
	local _hitboxSlotProps = slotProps
	if _hitboxSlotProps ~= nil then
		_hitboxSlotProps = _hitboxSlotProps.hitbox
	end
	local hitboxSlotProps = _hitboxSlotProps
	local tooltipContent = resolveSliderTooltipContent(tooltip, displayValue)
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
	end, {})
	local endDrag = React.useCallback(function(emitChangeEnd)
		if not draggingRef.current then
			disconnectDragTracking()
			return nil
		end
		draggingRef.current = false
		local finalValue = dragValueRef.current
		disconnectDragTracking()
		setDragging(false)
		setDragValueOverride(nil)
		if emitChangeEnd then
			local _result = onChangeEndRef.current
			if _result ~= nil then
				_result(finalValue)
			end
		end
	end, { disconnectDragTracking })
	local commitValue = React.useCallback(function(nextValue)
		local _binding_2 = configRef.current
		local range = _binding_2.range
		local currentStep = _binding_2.step
		local controlled = _binding_2.controlled
		local normalizedValue = normalizeSliderValue(nextValue, range, currentStep)
		if normalizedValue == dragValueRef.current then
			return normalizedValue
		end
		dragValueRef.current = normalizedValue
		setDragValueOverride(normalizedValue)
		if not controlled then
			setUncontrolledValue(normalizedValue)
		end
		local _result = onChangeRef.current
		if _result ~= nil then
			_result(normalizedValue)
		end
		return normalizedValue
	end, {})
	local commitControllerStep = React.useCallback(function(direction)
		if disabled then
			return nil
		end
		local finalValue = commitValue(stepSliderValue({
			value = dragValueRef.current,
			direction = direction,
			range = configRef.current.range,
			step = configRef.current.step,
		}))
		local _result = onChangeEndRef.current
		if _result ~= nil then
			_result(finalValue)
		end
	end, { commitValue, disabled })
	local controllerInput = useSliderControllerInput({
		disabled = disabled,
		hitboxInstance = hitboxInstance,
		commitStep = commitControllerStep,
	})
	local tooltipOpen = tooltipContent ~= nil and not disabled and (hovered or dragging or controllerInput.selected)
	local updateValueFromPositionX = React.useCallback(function(positionX)
		local _binding_2 = configRef.current
		local range = _binding_2.range
		local currentStep = _binding_2.step
		local nextAlpha = resolveAlphaFromPositionX(trackRef.current, positionX)
		return commitValue(alphaToValue(nextAlpha, range, currentStep))
	end, { commitValue })
	local updateValueFromInput = React.useCallback(function(input)
		return updateValueFromPositionX(input.Position.X)
	end, { updateValueFromPositionX })
	local handleDragMoveInput = React.useCallback(function(input)
		if shouldHandleMouseDragMoveInput(dragKindRef.current, input) then
			updateValueFromInput(input)
			return nil
		end
		if shouldHandleTouchDragMoveInput(dragKindRef.current, activeTouchRef.current, input) then
			updateValueFromInput(input)
			return nil
		end
	end, { updateValueFromInput })
	local handleDragEndInput = React.useCallback(function(input)
		if not shouldHandleDragEndInput(dragKindRef.current, activeTouchRef.current, input) then
			return nil
		end
		endDrag(true)
	end, { endDrag })
	local beginDrag = React.useCallback(function(input)
		if disabled or not isPressInput(input) then
			return nil
		end
		local dragKind = resolveDragInputKind(input)
		if dragKind == nil then
			return nil
		end
		disconnectDragTracking()
		dragKindRef.current = dragKind
		activeTouchRef.current = if dragKind == "touch" then input else nil
		draggingRef.current = true
		setDragging(true)
		updateValueFromInput(input)
		if not isMouseDragActive(dragKind) or portalTarget == nil then
			moveConnectionRef.current = UserInputService.InputChanged:Connect(function(changedInput)
				handleDragMoveInput(changedInput)
			end)
		end
		endConnectionRef.current = UserInputService.InputEnded:Connect(function(endedInput)
			handleDragEndInput(endedInput)
		end)
	end, { disabled, disconnectDragTracking, handleDragEndInput, handleDragMoveInput, portalTarget, updateValueFromInput })
	React.useEffect(function()
		if value ~= nil then
			setUncontrolledValue(normalizeSliderValue(value, sliderRange, resolvedStep))
			return nil
		end
		setUncontrolledValue(function(currentValue)
			return normalizeSliderValue(currentValue, sliderRange, resolvedStep)
		end)
	end, { resolvedStep, sliderRange, value })
	React.useEffect(function()
		if not disabled then
			return nil
		end
		setHovered(false)
		endDrag(false)
	end, { disabled, endDrag })
	React.useEffect(function()
		return function()
			draggingRef.current = false
			disconnectDragTracking()
		end
	end, { disconnectDragTracking })
	local shouldRenderLabels = labelSlotProps ~= nil or valueLabelSlotProps ~= nil
	local labelRowHeight = if shouldRenderLabels then math.ceil(sizeStyles.labelSize * sizeStyles.labelLineHeight) else 0
	local labelGap = if shouldRenderLabels then theme.spacing.xs else 0
	local minimumHeight = sizeStyles.minHeight + labelRowHeight + labelGap
	local _result
	if fullWidth then
		_result = resolveUDimSafe("slider", "100%", "width")
	else
		local _result_1 = resolvedSize
		if _result_1 ~= nil then
			_result_1 = _result_1.X
		end
		local _condition_2 = _result_1
		if _condition_2 == nil then
			_condition_2 = resolvedWidth or UDim.new(0, sizeStyles.defaultWidth)
		end
		_result = _condition_2
	end
	local computedWidth = _result
	local _result_1 = resolvedSize
	if _result_1 ~= nil then
		_result_1 = _result_1.Y
	end
	local _condition_2 = _result_1
	if _condition_2 == nil then
		_condition_2 = resolvedHeight or UDim.new(0, minimumHeight)
	end
	local computedHeight = _condition_2
	local computedSize = UDim2.new(computedWidth, computedHeight)
	local computedConstraint = if resolvedConstraint == nil then {
		min = Vector2.new(0, minimumHeight),
		max = nil,
	} else {
		min = if resolvedConstraint.min == nil then Vector2.new(0, minimumHeight) else Vector2.new(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, minimumHeight)),
		max = resolvedConstraint.max,
	}
	local interactionState = if disabled then "disabled" elseif dragging then "pressed" elseif hovered then "hovered" else "idle"
	local styleOverrideContext = {
		theme = theme,
		color = color,
		size = size,
		state = interactionState,
	}
	local visualStyles = applyStyleOverride(resolveSliderVisualStyles(theme, color, interactionState), styleOverrides, styleOverrideContext)
	local _result_2 = rootSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.ZIndex
	end
	local _condition_3 = _result_2
	if _condition_3 == nil then
		_condition_3 = props.zIndex
	end
	local resolvedRootZIndex = _condition_3
	local _result_3 = labelSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_4 = _result_3
	if _condition_4 == nil then
		_condition_4 = incrementZIndex(resolvedRootZIndex, 1)
	end
	local resolvedLabelZIndex = _condition_4
	local _result_4 = valueLabelSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.ZIndex
	end
	local _condition_5 = _result_4
	if _condition_5 == nil then
		_condition_5 = incrementZIndex(resolvedRootZIndex, 1)
	end
	local resolvedValueLabelZIndex = _condition_5
	local _result_5 = trackSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.ZIndex
	end
	local _condition_6 = _result_5
	if _condition_6 == nil then
		_condition_6 = incrementZIndex(resolvedRootZIndex, 1)
	end
	local resolvedTrackZIndex = _condition_6
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.range
		if _result_6 ~= nil then
			_result_6 = _result_6.ZIndex
		end
	end
	local _condition_7 = _result_6
	if _condition_7 == nil then
		_condition_7 = resolvedTrackZIndex
	end
	local resolvedRangeZIndex = _condition_7
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.thumb
		if _result_7 ~= nil then
			_result_7 = _result_7.ZIndex
		end
	end
	local _condition_8 = _result_7
	if _condition_8 == nil then
		_condition_8 = incrementZIndex(resolvedTrackZIndex, 1)
	end
	local resolvedThumbZIndex = _condition_8
	local _result_8 = hitboxSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.ZIndex
	end
	local _condition_9 = _result_8
	if _condition_9 == nil then
		_condition_9 = incrementZIndex(resolvedThumbZIndex, 1)
	end
	local resolvedHitboxZIndex = _condition_9
	local _result_9
	if tooltipContent == nil then
		_result_9 = nil
	else
		local _object = {}
		local _left = "root"
		local _object_1 = {
			ZIndex = resolvedThumbZIndex,
		}
		local _result_10 = slotProps
		if _result_10 ~= nil then
			_result_10 = _result_10.tooltipTrigger
		end
		if _result_10 then
			for _k, _v in _result_10 do
				_object_1[_k] = _v
			end
		end
		_object[_left] = _object_1
		local _left_1 = "overlay"
		local _result_11 = slotProps
		if _result_11 ~= nil then
			_result_11 = _result_11.tooltipOverlay
		end
		_object[_left_1] = _result_11
		local _left_2 = "bubble"
		local _result_12 = slotProps
		if _result_12 ~= nil then
			_result_12 = _result_12.tooltip
		end
		_object[_left_2] = _result_12
		local _left_3 = "bubbleCorner"
		local _result_13 = slotProps
		if _result_13 ~= nil then
			_result_13 = _result_13.tooltipCorner
		end
		_object[_left_3] = _result_13
		local _left_4 = "bubbleStroke"
		local _result_14 = slotProps
		if _result_14 ~= nil then
			_result_14 = _result_14.tooltipStroke
		end
		_object[_left_4] = _result_14
		local _left_5 = "bubblePadding"
		local _result_15 = slotProps
		if _result_15 ~= nil then
			_result_15 = _result_15.tooltipPadding
		end
		_object[_left_5] = _result_15
		local _left_6 = "label"
		local _result_16 = slotProps
		if _result_16 ~= nil then
			_result_16 = _result_16.tooltipLabel
		end
		_object[_left_6] = _result_16
		local _left_7 = "tail"
		local _result_17 = slotProps
		if _result_17 ~= nil then
			_result_17 = _result_17.tooltipTail
		end
		_object[_left_7] = _result_17
		local _left_8 = "tailBorder"
		local _result_18 = slotProps
		if _result_18 ~= nil then
			_result_18 = _result_18.tooltipTailBorder
		end
		_object[_left_8] = _result_18
		_result_9 = _object
	end
	local tooltipSlotProps = _result_9
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _result_10 = labelSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.Font
	end
	local _condition_10 = _result_10
	if _condition_10 == nil then
		_condition_10 = theme.fontFamily
	end
	local labelFont = _condition_10
	local _result_11 = labelSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.Font
	end
	local _result_12 = labelSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.FontFace
	end
	local labelFontFace = resolveTextFontFace(_result_11, _result_12, theme.fontFamily)
	local _result_13 = valueLabelSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.Font
	end
	local _condition_11 = _result_13
	if _condition_11 == nil then
		_condition_11 = theme.fontFamily
	end
	local valueLabelFont = _condition_11
	local _result_14 = valueLabelSlotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.Font
	end
	local _result_15 = valueLabelSlotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.FontFace
	end
	local valueLabelFontFace = resolveTextFontFace(_result_14, _result_15, theme.fontFamily)
	local trackCornerRadius = UDim.new(0.5, 0)
	local thumbCornerRadius = UDim.new(0.5, 0)
	local mouseDragCaptureActive = dragging and isMouseDragActive(dragKindRef.current) and portalTarget ~= nil
	local _object = {
		MouseEnter = function()
			if disabled then
				return nil
			end
			setHovered(true)
		end,
		MouseLeave = function()
			setHovered(false)
		end,
	}
	local _spread = controllerInput.event
	if _spread then
		for _k, _v in _spread do
			_object[_k] = _v
		end
	end
	_object.InputBegan = function(_button, input)
		beginDrag(input)
	end
	_object.InputChanged = function(_button, input)
		handleDragMoveInput(input)
	end
	_object.InputEnded = function(_button, input)
		handleDragEndInput(input)
	end
	local internalEvent = _object
	local _exp = composeEventMaps(internalEvent, Event)
	local _result_16 = hitboxSlotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.Event
	end
	local hitboxEvent = useRootCursorEvent(_exp, if _result_16 == nil then mergedStyleProps.cursor else nil, disabled)
	local dragCaptureOverlayEvent = if mouseDragCaptureActive then {
		InputChanged = function(_button, input)
			handleDragMoveInput(input)
		end,
		InputEnded = function(_button, input)
			handleDragEndInput(input)
		end,
	} else nil
	local hitboxRef = React.useCallback(function(instance)
		setHitboxInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local rootInstanceProps = {
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		BackgroundColor3 = theme.colors.background.default,
		Size = computedSize,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
	}
	local decoratorChildren = {}
	local _object_1 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left = "slotProps"
	local _result_17 = slotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.padding
	end
	_object_1[_left] = _result_17
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object_1))
	local _object_2 = {
		constraint = computedConstraint,
	}
	local _left_1 = "slotProps"
	local _result_18 = slotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.sizeConstraint
	end
	_object_2[_left_1] = _result_18
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_2))
	local _attributes = table.clone(rootInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	local _exp_1 = decoratorChildren
	local _result_19
	if shouldRenderLabels then
		local _result_20
		if labelSlotProps ~= nil then
			local _attributes_1 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.new(0.5, 0, 1, 0),
				Position = UDim2.fromOffset(0, 0),
			}
			local _condition_12 = labelSlotProps.Text
			if _condition_12 == nil then
				_condition_12 = ""
			end
			_attributes_1.Text = _condition_12
			_attributes_1.TextColor3 = labelSlotProps.TextColor3 or visualStyles.labelColor
			local _condition_13 = labelSlotProps.TextTransparency
			if _condition_13 == nil then
				_condition_13 = 0
			end
			_attributes_1.TextTransparency = _condition_13
			local _condition_14 = labelSlotProps.TextStrokeTransparency
			if _condition_14 == nil then
				_condition_14 = 1
			end
			_attributes_1.TextStrokeTransparency = _condition_14
			local _condition_15 = labelSlotProps.TextSize
			if _condition_15 == nil then
				_condition_15 = sizeStyles.labelSize
			end
			_attributes_1.TextSize = _condition_15
			_attributes_1.Font = labelFont
			_attributes_1.FontFace = labelFontFace
			local _condition_16 = labelSlotProps.LineHeight
			if _condition_16 == nil then
				_condition_16 = sizeStyles.labelLineHeight
			end
			_attributes_1.LineHeight = _condition_16
			local _condition_17 = labelSlotProps.TextWrapped
			if _condition_17 == nil then
				_condition_17 = false
			end
			_attributes_1.TextWrapped = _condition_17
			_attributes_1.TextTruncate = labelSlotProps.TextTruncate or Enum.TextTruncate.AtEnd
			_attributes_1.TextXAlignment = labelSlotProps.TextXAlignment or Enum.TextXAlignment.Left
			_attributes_1.TextYAlignment = labelSlotProps.TextYAlignment or Enum.TextYAlignment.Center
			local _condition_18 = labelSlotProps.TextScaled
			if _condition_18 == nil then
				_condition_18 = false
			end
			_attributes_1.TextScaled = _condition_18
			local _condition_19 = labelSlotProps.RichText
			if _condition_19 == nil then
				_condition_19 = false
			end
			_attributes_1.RichText = _condition_19
			_attributes_1.ZIndex = resolvedLabelZIndex
			for _k, _v in labelSlotProps do
				_attributes_1[_k] = _v
			end
			_result_20 = (React.createElement("textlabel", _attributes_1))
		else
			_result_20 = nil
		end
		local _result_21
		if valueLabelSlotProps ~= nil then
			local _attributes_1 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.new(0.5, 0, 1, 0),
				Position = UDim2.fromScale(0.5, 0),
			}
			local _condition_12 = valueLabelSlotProps.Text
			if _condition_12 == nil then
				_condition_12 = tostring(displayValue)
			end
			_attributes_1.Text = _condition_12
			_attributes_1.TextColor3 = valueLabelSlotProps.TextColor3 or visualStyles.valueLabelColor
			local _condition_13 = valueLabelSlotProps.TextTransparency
			if _condition_13 == nil then
				_condition_13 = 0
			end
			_attributes_1.TextTransparency = _condition_13
			local _condition_14 = valueLabelSlotProps.TextStrokeTransparency
			if _condition_14 == nil then
				_condition_14 = 1
			end
			_attributes_1.TextStrokeTransparency = _condition_14
			local _condition_15 = valueLabelSlotProps.TextSize
			if _condition_15 == nil then
				_condition_15 = sizeStyles.labelSize
			end
			_attributes_1.TextSize = _condition_15
			_attributes_1.Font = valueLabelFont
			_attributes_1.FontFace = valueLabelFontFace
			local _condition_16 = valueLabelSlotProps.LineHeight
			if _condition_16 == nil then
				_condition_16 = sizeStyles.labelLineHeight
			end
			_attributes_1.LineHeight = _condition_16
			local _condition_17 = valueLabelSlotProps.TextWrapped
			if _condition_17 == nil then
				_condition_17 = false
			end
			_attributes_1.TextWrapped = _condition_17
			_attributes_1.TextTruncate = valueLabelSlotProps.TextTruncate or Enum.TextTruncate.AtEnd
			_attributes_1.TextXAlignment = valueLabelSlotProps.TextXAlignment or Enum.TextXAlignment.Right
			_attributes_1.TextYAlignment = valueLabelSlotProps.TextYAlignment or Enum.TextYAlignment.Center
			local _condition_18 = valueLabelSlotProps.TextScaled
			if _condition_18 == nil then
				_condition_18 = false
			end
			_attributes_1.TextScaled = _condition_18
			local _condition_19 = valueLabelSlotProps.RichText
			if _condition_19 == nil then
				_condition_19 = false
			end
			_attributes_1.RichText = _condition_19
			_attributes_1.ZIndex = resolvedValueLabelZIndex
			for _k, _v in valueLabelSlotProps do
				_attributes_1[_k] = _v
			end
			_result_21 = (React.createElement("textlabel", _attributes_1))
		else
			_result_21 = nil
		end
		_result_19 = (React.createElement("frame", {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.new(1, 0, 0, labelRowHeight),
			Position = UDim2.fromOffset(0, 0),
			Active = false,
			Selectable = false,
		}, _result_20, _result_21))
	else
		_result_19 = nil
	end
	local _attributes_1 = {
		BackgroundColor3 = visualStyles.trackColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 0, sizeStyles.trackHeight),
		Position = UDim2.fromScale(0, 0.5),
		AnchorPoint = Vector2.new(0, 0.5),
		ZIndex = resolvedTrackZIndex,
		Active = false,
		Selectable = false,
		ref = trackRef,
	}
	if trackSlotProps then
		for _k, _v in trackSlotProps do
			_attributes_1[_k] = _v
		end
	end
	local _object_3 = {
		radius = trackCornerRadius,
	}
	local _left_2 = "slotProps"
	local _result_20 = slotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.trackCorner
	end
	_object_3[_left_2] = _result_20
	local _exp_2 = renderCornerDecorator(_object_3)
	local _object_4 = {
		enabled = true,
		color = visualStyles.trackStrokeColor,
		transparency = visualStyles.trackStrokeTransparency,
		thickness = 1,
	}
	local _left_3 = "slotProps"
	local _result_21 = slotProps
	if _result_21 ~= nil then
		_result_21 = _result_21.trackStroke
	end
	_object_4[_left_3] = _result_21
	local _exp_3 = renderStrokeDecorator(_object_4)
	local _result_22 = slotProps
	if _result_22 ~= nil then
		_result_22 = _result_22.range
	end
	local _attributes_2 = {
		BackgroundColor3 = visualStyles.rangeColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.new(displayAlpha, 0, 1, 0),
		ZIndex = resolvedRangeZIndex,
		Active = false,
		Selectable = false,
	}
	if _result_22 then
		for _k, _v in _result_22 do
			_attributes_2[_k] = _v
		end
	end
	local _object_5 = {
		radius = trackCornerRadius,
	}
	local _left_4 = "slotProps"
	local _result_23 = slotProps
	if _result_23 ~= nil then
		_result_23 = _result_23.rangeCorner
	end
	_object_5[_left_4] = _result_23
	local _exp_4 = React.createElement("frame", _attributes_1, _exp_2, _exp_3, React.createElement("frame", _attributes_2, renderCornerDecorator(_object_5)))
	local _attributes_3 = {
		BackgroundColor3 = visualStyles.thumbColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
	}
	local _result_24 = slotProps
	if _result_24 ~= nil then
		_result_24 = _result_24.thumb
		if _result_24 ~= nil then
			_result_24 = _result_24.ZIndex
		end
	end
	local _condition_12 = _result_24
	if _condition_12 == nil then
		_condition_12 = resolvedThumbZIndex
	end
	_attributes_3.ZIndex = _condition_12
	_attributes_3.Active = false
	_attributes_3.Selectable = false
	local _result_25 = slotProps
	if _result_25 ~= nil then
		_result_25 = _result_25.thumb
	end
	if _result_25 then
		for _k, _v in _result_25 do
			_attributes_3[_k] = _v
		end
	end
	local _object_6 = {
		radius = thumbCornerRadius,
	}
	local _left_5 = "slotProps"
	local _result_26 = slotProps
	if _result_26 ~= nil then
		_result_26 = _result_26.thumbCorner
	end
	_object_6[_left_5] = _result_26
	local _exp_5 = renderCornerDecorator(_object_6)
	local _object_7 = {
		enabled = true,
		color = visualStyles.thumbStrokeColor,
		transparency = visualStyles.thumbStrokeTransparency,
		thickness = 1,
	}
	local _left_6 = "slotProps"
	local _result_27 = slotProps
	if _result_27 ~= nil then
		_result_27 = _result_27.thumbStroke
	end
	_object_7[_left_6] = _result_27
	local _exp_6 = React.createElement(Tooltip, {
		content = tooltipContent,
		opened = tooltipOpen,
		disabled = tooltipContent == nil or disabled,
		width = sizeStyles.thumbDiameter,
		height = sizeStyles.thumbDiameter,
		position = UDim2.new(displayAlpha, 0, 0.5, 0),
		anchor = Vector2.new(0.5, 0.5),
		slotProps = tooltipSlotProps,
	}, React.createElement("frame", _attributes_3, _exp_5, renderStrokeDecorator(_object_7)))
	local _attributes_4 = {
		AutoButtonColor = false,
		Active = not disabled,
		Selectable = not disabled,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedHitboxZIndex,
		Event = hitboxEvent,
		Change = Change,
		ref = hitboxRef,
	}
	if hitboxSlotProps then
		for _k, _v in hitboxSlotProps do
			_attributes_4[_k] = _v
		end
	end
	return React.createElement(React.Fragment, nil, React.createElement("frame", _attributes, _exp_1, _result_19, React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 1, -(labelRowHeight + labelGap)),
		Position = UDim2.fromOffset(0, labelRowHeight + labelGap),
		Active = false,
		Selectable = false,
	}, _exp_4, _exp_6, React.createElement("textbutton", _attributes_4))), React.createElement(CaptureOverlay, {
		active = mouseDragCaptureActive,
		target = portalTarget,
		Event = dragCaptureOverlayEvent,
	}))
end)
local Slider = SliderBase
Slider.displayName = "Slider"
return {
	Slider = Slider,
}
