-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _layering = TS.import(script, script.Parent.Parent, "_shared", "layering")
local CaptureOverlay = _layering.CaptureOverlay
local usePortalTarget = _layering.usePortalTarget
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local isMouseDragActive = _interaction.isMouseDragActive
local isPressInput = _interaction.isPressInput
local resolveDragInputKind = _interaction.resolveDragInputKind
local shouldHandleDragEndInput = _interaction.shouldHandleDragEndInput
local shouldHandleMouseDragMoveInput = _interaction.shouldHandleMouseDragMoveInput
local shouldHandleTouchDragMoveInput = _interaction.shouldHandleTouchDragMoveInput
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveStepperInputButtonMotionTransition = _styles.resolveStepperInputButtonMotionTransition
local resolveStepperInputButtonVisualStyles = _styles.resolveStepperInputButtonVisualStyles
local resolveStepperInputFrameMotionTransition = _styles.resolveStepperInputFrameMotionTransition
local resolveStepperInputFrameVisualStyles = _styles.resolveStepperInputFrameVisualStyles
local resolveStepperInputSizeStyles = _styles.resolveStepperInputSizeStyles
local _utils = TS.import(script, script.Parent, "utils")
local formatStepperInputValue = _utils.formatStepperInputValue
local normalizeStepperInputValue = _utils.normalizeStepperInputValue
local resolveStepperInputRailAlphaFromPositionX = _utils.resolveStepperInputRailAlphaFromPositionX
local resolveStepperInputRailRange = _utils.resolveStepperInputRailRange
local resolveStepperInputRange = _utils.resolveStepperInputRange
local resolveValidStepperInputStep = _utils.resolveValidStepperInputStep
local stepStepperInputValue = _utils.stepStepperInputValue
local stepperInputRailAlphaToValue = _utils.stepperInputRailAlphaToValue
local valueToStepperInputRailAlpha = _utils.valueToStepperInputRailAlpha
local UserInputService = game:GetService("UserInputService")
local HORIZONTAL_DRAG_CURSOR = "resize-ew"
local function offsetZIndex(zIndex, offset)
	local _zIndex = zIndex
	return if type(_zIndex) == "number" then zIndex + offset else nil
end
local function StepperButtonView(_param)
	local label = _param.label
	local state = _param.state
	local disabled = _param.disabled
	local layoutOrder = _param.layoutOrder
	local zIndex = _param.zIndex
	local textZIndex = _param.textZIndex
	local buttonSlotProps = _param.buttonSlotProps
	local textSlotProps = _param.textSlotProps
	local slotProps = _param.slotProps
	local sizeStyles = _param.sizeStyles
	local visualStyles = _param.visualStyles
	local event = _param.event
	local theme = _param.theme
	local motionValues = {
		backgroundColor = visualStyles.backgroundColor,
		backgroundTransparency = visualStyles.backgroundTransparency,
		strokeColor = visualStyles.strokeColor,
		strokeTransparency = visualStyles.strokeTransparency,
		textColor = visualStyles.textColor,
	}
	local animated = useMotion({
		values = motionValues,
		transition = resolveStepperInputButtonMotionTransition(state),
	})
	local _result = textSlotProps
	if _result ~= nil then
		_result = _result.Font
	end
	local _condition = _result
	if _condition == nil then
		_condition = theme.fontFamily
	end
	local resolvedTextFont = _condition
	local _result_1 = textSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Font
	end
	local _result_2 = textSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.FontFace
	end
	local resolvedTextFontFace = resolveTextFontFace(_result_1, _result_2, theme.fontFamily)
	local _attributes = {
		AutoButtonColor = false,
		Active = not disabled,
		Selectable = not disabled,
		BackgroundColor3 = animated.backgroundColor,
		BackgroundTransparency = animated.backgroundTransparency,
		BorderSizePixel = 0,
		Size = UDim2.new(0, sizeStyles.buttonWidth, 1, 0),
		LayoutOrder = layoutOrder,
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = zIndex,
		Event = event,
	}
	if buttonSlotProps then
		for _k, _v in buttonSlotProps do
			_attributes[_k] = _v
		end
	end
	local _object = {
		radius = sizeStyles.buttonRadius,
	}
	local _left = "slotProps"
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.buttonCorner
	end
	_object[_left] = _result_3
	local _exp = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		color = animated.strokeColor,
		transparency = animated.strokeTransparency,
		thickness = 1,
	}
	local _left_1 = "slotProps"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.buttonStroke
	end
	_object_1[_left_1] = _result_4
	local _exp_1 = renderStrokeDecorator(_object_1)
	local _object_2 = {
		enabled = true,
		paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingY, "spacing", theme.spacing.xs)),
		paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingX, "spacing", theme.spacing.xs)),
		paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingY, "spacing", theme.spacing.xs)),
		paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingX, "spacing", theme.spacing.xs)),
	}
	local _left_2 = "slotProps"
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.buttonPadding
	end
	_object_2[_left_2] = _result_5
	local _exp_2 = renderPaddingDecorator(_object_2)
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
	}
	local _result_6 = textSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.Text
	end
	local _condition_1 = _result_6
	if _condition_1 == nil then
		_condition_1 = label
	end
	_attributes_1.Text = _condition_1
	local _result_7 = textSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.TextColor3
	end
	local _condition_2 = _result_7
	if _condition_2 == nil then
		_condition_2 = animated.textColor
	end
	_attributes_1.TextColor3 = _condition_2
	local _result_8 = textSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.TextTransparency
	end
	local _condition_3 = _result_8
	if _condition_3 == nil then
		_condition_3 = 0
	end
	_attributes_1.TextTransparency = _condition_3
	local _result_9 = textSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.TextStrokeTransparency
	end
	local _condition_4 = _result_9
	if _condition_4 == nil then
		_condition_4 = 1
	end
	_attributes_1.TextStrokeTransparency = _condition_4
	local _result_10 = textSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.TextSize
	end
	local _condition_5 = _result_10
	if _condition_5 == nil then
		_condition_5 = sizeStyles.fontSize + 2
	end
	_attributes_1.TextSize = _condition_5
	_attributes_1.Font = resolvedTextFont
	_attributes_1.FontFace = resolvedTextFontFace
	local _result_11 = textSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.LineHeight
	end
	local _condition_6 = _result_11
	if _condition_6 == nil then
		_condition_6 = sizeStyles.lineHeight
	end
	_attributes_1.LineHeight = _condition_6
	local _result_12 = textSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.TextWrapped
	end
	local _condition_7 = _result_12
	if _condition_7 == nil then
		_condition_7 = false
	end
	_attributes_1.TextWrapped = _condition_7
	local _result_13 = textSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.TextTruncate
	end
	local _condition_8 = _result_13
	if _condition_8 == nil then
		_condition_8 = Enum.TextTruncate.AtEnd
	end
	_attributes_1.TextTruncate = _condition_8
	local _result_14 = textSlotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.TextXAlignment
	end
	local _condition_9 = _result_14
	if _condition_9 == nil then
		_condition_9 = Enum.TextXAlignment.Center
	end
	_attributes_1.TextXAlignment = _condition_9
	local _result_15 = textSlotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.TextYAlignment
	end
	local _condition_10 = _result_15
	if _condition_10 == nil then
		_condition_10 = Enum.TextYAlignment.Center
	end
	_attributes_1.TextYAlignment = _condition_10
	_attributes_1.ZIndex = textZIndex
	if textSlotProps then
		for _k, _v in textSlotProps do
			_attributes_1[_k] = _v
		end
	end
	return React.createElement("textbutton", _attributes, _exp, _exp_1, _exp_2, React.createElement("textlabel", _attributes_1))
end
local function StepperRailView(_param)
	local railProps = _param.railProps
	local railSlotProps = _param.railSlotProps
	local railFillSlotProps = _param.railFillSlotProps
	local railValueSlotProps = _param.railValueSlotProps
	local slotProps = _param.slotProps
	local sizeStyles = _param.sizeStyles
	local displayAlpha = _param.displayAlpha
	local displayText = _param.displayText
	local dragging = _param.dragging
	local fillColor = _param.fillColor
	local fillTransparency = _param.fillTransparency
	local valueColor = _param.valueColor
	local valueFont = _param.valueFont
	local valueFontFace = _param.valueFontFace
	local fillZIndex = _param.fillZIndex
	local valueZIndex = _param.valueZIndex
	local railRef = _param.railRef
	local _attributes = table.clone(railProps)
	setmetatable(_attributes, nil)
	if railSlotProps then
		for _k, _v in railSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = railRef
	local _object = {
		radius = sizeStyles.buttonRadius,
	}
	local _left = "slotProps"
	local _result = slotProps
	if _result ~= nil then
		_result = _result.buttonCorner
	end
	_object[_left] = _result
	local _exp = renderCornerDecorator(_object)
	local _attributes_1 = {
		BackgroundColor3 = fillColor,
	}
	local _result_1 = railFillSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.BackgroundTransparency
	end
	local _condition = _result_1
	if _condition == nil then
		_condition = fillTransparency
	end
	_attributes_1.BackgroundTransparency = _condition
	_attributes_1.BorderSizePixel = 0
	_attributes_1.Size = if dragging then UDim2.new(displayAlpha, 0, 1, 0) else UDim2.new(displayAlpha, 0, 0, 2)
	_attributes_1.Position = if dragging then UDim2.new(0, 0, 0, 0) else UDim2.new(0, 0, 1, 0)
	_attributes_1.AnchorPoint = if dragging then Vector2.new(0, 0) else Vector2.new(0, 1)
	_attributes_1.ZIndex = fillZIndex
	_attributes_1.Active = false
	_attributes_1.Selectable = false
	if railFillSlotProps then
		for _k, _v in railFillSlotProps do
			_attributes_1[_k] = _v
		end
	end
	local _object_1 = {
		radius = sizeStyles.buttonRadius,
	}
	local _left_1 = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.buttonCorner
	end
	_object_1[_left_1] = _result_2
	local _exp_1 = React.createElement("frame", _attributes_1, renderCornerDecorator(_object_1))
	local _attributes_2 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
	}
	local _result_3 = railValueSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.Text
	end
	local _condition_1 = _result_3
	if _condition_1 == nil then
		_condition_1 = displayText
	end
	_attributes_2.Text = _condition_1
	local _result_4 = railValueSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.TextColor3
	end
	local _condition_2 = _result_4
	if _condition_2 == nil then
		_condition_2 = valueColor
	end
	_attributes_2.TextColor3 = _condition_2
	local _result_5 = railValueSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.TextTransparency
	end
	local _condition_3 = _result_5
	if _condition_3 == nil then
		_condition_3 = 0
	end
	_attributes_2.TextTransparency = _condition_3
	local _result_6 = railValueSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.TextStrokeTransparency
	end
	local _condition_4 = _result_6
	if _condition_4 == nil then
		_condition_4 = 1
	end
	_attributes_2.TextStrokeTransparency = _condition_4
	local _result_7 = railValueSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.TextSize
	end
	local _condition_5 = _result_7
	if _condition_5 == nil then
		_condition_5 = sizeStyles.fontSize
	end
	_attributes_2.TextSize = _condition_5
	_attributes_2.Font = valueFont
	_attributes_2.FontFace = valueFontFace
	local _result_8 = railValueSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.LineHeight
	end
	local _condition_6 = _result_8
	if _condition_6 == nil then
		_condition_6 = sizeStyles.lineHeight
	end
	_attributes_2.LineHeight = _condition_6
	local _result_9 = railValueSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.TextWrapped
	end
	local _condition_7 = _result_9
	if _condition_7 == nil then
		_condition_7 = false
	end
	_attributes_2.TextWrapped = _condition_7
	local _result_10 = railValueSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.TextTruncate
	end
	local _condition_8 = _result_10
	if _condition_8 == nil then
		_condition_8 = Enum.TextTruncate.AtEnd
	end
	_attributes_2.TextTruncate = _condition_8
	local _result_11 = railValueSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.TextXAlignment
	end
	local _condition_9 = _result_11
	if _condition_9 == nil then
		_condition_9 = Enum.TextXAlignment.Center
	end
	_attributes_2.TextXAlignment = _condition_9
	local _result_12 = railValueSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.TextYAlignment
	end
	local _condition_10 = _result_12
	if _condition_10 == nil then
		_condition_10 = Enum.TextYAlignment.Center
	end
	_attributes_2.TextYAlignment = _condition_10
	local _result_13 = railValueSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.RichText
	end
	local _condition_11 = _result_13
	if _condition_11 == nil then
		_condition_11 = false
	end
	_attributes_2.RichText = _condition_11
	_attributes_2.ZIndex = valueZIndex
	if railValueSlotProps then
		for _k, _v in railValueSlotProps do
			_attributes_2[_k] = _v
		end
	end
	return React.createElement("textbutton", _attributes, _exp, _exp_1, React.createElement("textlabel", _attributes_2))
end
local StepperInputBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local variant = _binding.variant
	if variant == nil then
		variant = "outline"
	end
	local size = _binding.size
	if size == nil then
		size = "md"
	end
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = false
	end
	local readOnly = _binding.readOnly
	if readOnly == nil then
		readOnly = false
	end
	local fullWidth = _binding.fullWidth
	if fullWidth == nil then
		fullWidth = false
	end
	local min = _binding.min
	local max = _binding.max
	local step = _binding.step
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	local onChange = _binding.onChange
	local onChangeEnd = _binding.onChangeEnd
	local formatValue = _binding.formatValue
	local styleOverrides = _binding.styleOverrides
	local Event = _binding.Event
	local Change = _binding.Change
	local hovered, setHovered = React.useState(false)
	local dragging, setDragging = React.useState(false)
	local dragValueOverride, setDragValueOverride = React.useState(nil)
	local railInstance, setRailInstance = React.useState()
	local decrementHovered, setDecrementHovered = React.useState(false)
	local decrementPressed, setDecrementPressed = React.useState(false)
	local incrementHovered, setIncrementHovered = React.useState(false)
	local incrementPressed, setIncrementPressed = React.useState(false)
	local portalTarget = usePortalTarget(railInstance)
	local sizeStyles = resolveStepperInputSizeStyles(theme, size)
	local range = React.useMemo(function()
		return resolveStepperInputRange(min, max)
	end, { min, max })
	local railRange = React.useMemo(function()
		return resolveStepperInputRailRange(range)
	end, { range })
	local resolvedStep = React.useMemo(function()
		return resolveValidStepperInputStep(step)
	end, { step })
	local uncontrolledValue, setUncontrolledValue = React.useState(function()
		local _condition = value
		if _condition == nil then
			_condition = defaultValue
		end
		return normalizeStepperInputValue(_condition, range, resolvedStep)
	end)
	local _condition = value
	if _condition == nil then
		_condition = uncontrolledValue
	end
	local resolvedValue = normalizeStepperInputValue(_condition, range, resolvedStep)
	local _condition_1 = dragValueOverride
	if _condition_1 == nil then
		_condition_1 = resolvedValue
	end
	local displayValue = _condition_1
	local displayAlpha = valueToStepperInputRailAlpha(displayValue, railRange)
	local valueRef = React.useRef(resolvedValue)
	local dragValueRef = React.useRef(displayValue)
	local onChangeRef = React.useRef(onChange)
	local onChangeEndRef = React.useRef(onChangeEnd)
	local configRef = React.useRef({
		range = range,
		railRange = railRange,
		step = resolvedStep,
		controlled = value ~= nil,
	})
	local railRef = React.useRef()
	local dragKindRef = React.useRef(nil)
	local activeTouchRef = React.useRef(nil)
	local moveConnectionRef = React.useRef(nil)
	local endConnectionRef = React.useRef(nil)
	local draggingRef = React.useRef(false)
	valueRef.current = resolvedValue
	dragValueRef.current = displayValue
	onChangeRef.current = onChange
	onChangeEndRef.current = onChangeEnd
	configRef.current = {
		range = range,
		railRange = railRange,
		step = resolvedStep,
		controlled = value ~= nil,
	}
	React.useEffect(function()
		if value ~= nil then
			setUncontrolledValue(normalizeStepperInputValue(value, range, resolvedStep))
			return nil
		end
		setUncontrolledValue(function(currentValue)
			return normalizeStepperInputValue(currentValue, range, resolvedStep)
		end)
	end, { range, resolvedStep, value })
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
	React.useEffect(function()
		if not disabled then
			return nil
		end
		setHovered(false)
		setDecrementHovered(false)
		setDecrementPressed(false)
		setIncrementHovered(false)
		setIncrementPressed(false)
		endDrag(false)
	end, { disabled, endDrag })
	React.useEffect(function()
		return function()
			draggingRef.current = false
			disconnectDragTracking()
		end
	end, { disconnectDragTracking })
	local commitValue = React.useCallback(function(nextValue, emitChangeEnd, useDragOverride)
		if useDragOverride == nil then
			useDragOverride = false
		end
		local _binding_1 = configRef.current
		local currentRange = _binding_1.range
		local currentStep = _binding_1.step
		local controlled = _binding_1.controlled
		local normalizedValue = normalizeStepperInputValue(nextValue, currentRange, currentStep, valueRef.current)
		dragValueRef.current = normalizedValue
		if useDragOverride == true then
			setDragValueOverride(normalizedValue)
		end
		if normalizedValue ~= valueRef.current then
			valueRef.current = normalizedValue
			if not controlled then
				setUncontrolledValue(normalizedValue)
			end
			local _result = onChangeRef.current
			if _result ~= nil then
				_result(normalizedValue)
			end
		end
		if emitChangeEnd then
			local _result = onChangeEndRef.current
			if _result ~= nil then
				_result(normalizedValue)
			end
		end
		return normalizedValue
	end, {})
	local updateValueFromPositionX = React.useCallback(function(positionX)
		local _binding_1 = configRef.current
		local currentRailRange = _binding_1.railRange
		local currentStep = _binding_1.step
		local nextAlpha = resolveStepperInputRailAlphaFromPositionX(railRef.current, positionX)
		return commitValue(stepperInputRailAlphaToValue(nextAlpha, currentRailRange, currentStep), false, true)
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
		end
	end, { updateValueFromInput })
	local handleDragEndInput = React.useCallback(function(input)
		if not shouldHandleDragEndInput(dragKindRef.current, activeTouchRef.current, input) then
			return nil
		end
		endDrag(true)
	end, { endDrag })
	local beginDrag = React.useCallback(function(input)
		if disabled or readOnly or not isPressInput(input) then
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
	end, { disabled, disconnectDragTracking, handleDragEndInput, handleDragMoveInput, portalTarget, readOnly, updateValueFromInput })
	local commitStep = React.useCallback(function(direction)
		if disabled or readOnly then
			return nil
		end
		local _binding_1 = configRef.current
		local currentRange = _binding_1.range
		local currentStep = _binding_1.step
		commitValue(stepStepperInputValue(valueRef.current, direction, currentRange, currentStep), true)
	end, { commitValue, disabled, readOnly })
	local canEdit = not disabled and not readOnly
	local decrementDisabled = not canEdit or stepStepperInputValue(resolvedValue, -1, range, resolvedStep) == resolvedValue
	local incrementDisabled = not canEdit or stepStepperInputValue(resolvedValue, 1, range, resolvedStep) == resolvedValue
	local frameState = if disabled then "disabled" elseif dragging then "focused" elseif hovered then "hovered" else "idle"
	local _exp = resolveStepperInputFrameVisualStyles(theme, variant, frameState, readOnly)
	local _result = styleOverrides
	if _result ~= nil then
		_result = _result.frame
	end
	local frameVisualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		variant = variant,
		size = size,
		state = frameState,
		readOnly = readOnly,
	})
	local animatedFrame = useMotion({
		values = {
			backgroundColor = frameVisualStyles.backgroundColor,
			inputBackgroundColor = frameVisualStyles.inputBackgroundColor,
			inputBackgroundTransparency = frameVisualStyles.inputBackgroundTransparency,
			strokeColor = frameVisualStyles.strokeColor,
			strokeTransparency = frameVisualStyles.strokeTransparency,
			strokeThickness = frameVisualStyles.strokeThickness,
			textColor = frameVisualStyles.textColor,
			placeholderColor = frameVisualStyles.placeholderColor,
			railFillColor = frameVisualStyles.railFillColor,
			railFillTransparency = frameVisualStyles.railFillTransparency,
		},
		transition = resolveStepperInputFrameMotionTransition(frameState),
	})
	local decrementState = if decrementDisabled then "disabled" elseif decrementPressed then "pressed" elseif decrementHovered then "hovered" else "idle"
	local incrementState = if incrementDisabled then "disabled" elseif incrementPressed then "pressed" elseif incrementHovered then "hovered" else "idle"
	local decrementStyleOverrideContext = {
		theme = theme,
		variant = variant,
		size = size,
		state = decrementState,
		control = "decrement",
	}
	local incrementStyleOverrideContext = {
		theme = theme,
		variant = variant,
		size = size,
		state = incrementState,
		control = "increment",
	}
	local _exp_1 = resolveStepperInputButtonVisualStyles(theme, variant, decrementState)
	local _result_1 = styleOverrides
	if _result_1 ~= nil then
		_result_1 = _result_1.button
	end
	local decrementVisualStyles = applyStyleOverride(_exp_1, _result_1, decrementStyleOverrideContext)
	local _exp_2 = resolveStepperInputButtonVisualStyles(theme, variant, incrementState)
	local _result_2 = styleOverrides
	if _result_2 ~= nil then
		_result_2 = _result_2.button
	end
	local incrementVisualStyles = applyStyleOverride(_exp_2, _result_2, incrementStyleOverrideContext)
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = if canEdit then "pointer" else "default",
	}, props)
	local _binding_1 = useResolvedStyleProps("stepperInput", mergedStyleProps)
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
	local computedWidth = if fullWidth then resolveUDimSafe("stepperInput", "100%", "width") else resolvedWidth or UDim.new(0, sizeStyles.defaultWidth)
	local computedHeight = resolvedHeight or UDim.new(0, sizeStyles.minHeight)
	local computedSize = resolvedSize or UDim2.new(computedWidth, computedHeight)
	local computedConstraint = if resolvedConstraint == nil then {
		min = Vector2.new(0, sizeStyles.minHeight),
		max = nil,
	} else {
		min = if resolvedConstraint.min == nil then Vector2.new(0, sizeStyles.minHeight) else Vector2.new(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, sizeStyles.minHeight)),
		max = resolvedConstraint.max,
	}
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _frameSlotProps = slotProps
	if _frameSlotProps ~= nil then
		_frameSlotProps = _frameSlotProps.frame
	end
	local frameSlotProps = _frameSlotProps
	local _railSlotProps = slotProps
	if _railSlotProps ~= nil then
		_railSlotProps = _railSlotProps.rail
	end
	local railSlotProps = _railSlotProps
	local _railFillSlotProps = slotProps
	if _railFillSlotProps ~= nil then
		_railFillSlotProps = _railFillSlotProps.railFill
	end
	local railFillSlotProps = _railFillSlotProps
	local _railValueSlotProps = slotProps
	if _railValueSlotProps ~= nil then
		_railValueSlotProps = _railValueSlotProps.railValue
	end
	local railValueSlotProps = _railValueSlotProps
	local _decrementSlotProps = slotProps
	if _decrementSlotProps ~= nil then
		_decrementSlotProps = _decrementSlotProps.decrement
	end
	local decrementSlotProps = _decrementSlotProps
	local _incrementSlotProps = slotProps
	if _incrementSlotProps ~= nil then
		_incrementSlotProps = _incrementSlotProps.increment
	end
	local incrementSlotProps = _incrementSlotProps
	local _decrementTextSlotProps = slotProps
	if _decrementTextSlotProps ~= nil then
		_decrementTextSlotProps = _decrementTextSlotProps.decrementText
	end
	local decrementTextSlotProps = _decrementTextSlotProps
	local _incrementTextSlotProps = slotProps
	if _incrementTextSlotProps ~= nil then
		_incrementTextSlotProps = _incrementTextSlotProps.incrementText
	end
	local incrementTextSlotProps = _incrementTextSlotProps
	local _result_3 = rootSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_2 = _result_3
	if _condition_2 == nil then
		_condition_2 = props.zIndex
	end
	local resolvedRootZIndex = _condition_2
	local _result_4 = frameSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.ZIndex
	end
	local _condition_3 = _result_4
	if _condition_3 == nil then
		_condition_3 = resolvedRootZIndex
	end
	local resolvedFrameZIndex = _condition_3
	local _result_5 = railSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.ZIndex
	end
	local _condition_4 = _result_5
	if _condition_4 == nil then
		_condition_4 = offsetZIndex(resolvedFrameZIndex, 1)
	end
	local resolvedRailZIndex = _condition_4
	local _result_6 = railFillSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.ZIndex
	end
	local _condition_5 = _result_6
	if _condition_5 == nil then
		_condition_5 = resolvedRailZIndex
	end
	local resolvedRailFillZIndex = _condition_5
	local _result_7 = railValueSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.ZIndex
	end
	local _condition_6 = _result_7
	if _condition_6 == nil then
		_condition_6 = offsetZIndex(resolvedRailZIndex, 1)
	end
	local resolvedRailValueZIndex = _condition_6
	local _result_8 = decrementSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.ZIndex
	end
	local _condition_7 = _result_8
	if _condition_7 == nil then
		_condition_7 = offsetZIndex(resolvedFrameZIndex, 1)
	end
	local resolvedDecrementZIndex = _condition_7
	local _result_9 = incrementSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.ZIndex
	end
	local _condition_8 = _result_9
	if _condition_8 == nil then
		_condition_8 = offsetZIndex(resolvedFrameZIndex, 1)
	end
	local resolvedIncrementZIndex = _condition_8
	local _result_10 = decrementTextSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.ZIndex
	end
	local _condition_9 = _result_10
	if _condition_9 == nil then
		_condition_9 = resolvedDecrementZIndex
	end
	local resolvedDecrementTextZIndex = _condition_9
	local _result_11 = incrementTextSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.ZIndex
	end
	local _condition_10 = _result_11
	if _condition_10 == nil then
		_condition_10 = resolvedIncrementZIndex
	end
	local resolvedIncrementTextZIndex = _condition_10
	local _result_12 = railValueSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.Font
	end
	local _condition_11 = _result_12
	if _condition_11 == nil then
		_condition_11 = theme.fontFamily
	end
	local resolvedRailValueFont = _condition_11
	local _result_13 = railValueSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.Font
	end
	local _result_14 = railValueSlotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.FontFace
	end
	local resolvedRailValueFontFace = resolveTextFontFace(_result_13, _result_14, theme.fontFamily)
	local displayText = formatStepperInputValue(displayValue, formatValue)
	local railWidthOffset = -(sizeStyles.buttonWidth * 2 + sizeStyles.gap * 2)
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _result_15 = rootSlotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.Event
	end
	local rootEvent = useRootCursorEvent(nil, if _result_15 == nil then mergedStyleProps.cursor else nil, disabled)
	local railEvent = {
		MouseEnter = function()
			if not disabled then
				setHovered(true)
			end
		end,
		MouseLeave = function()
			setHovered(false)
		end,
		InputBegan = function(_button, input)
			beginDrag(input)
		end,
		InputChanged = function(_button, input)
			handleDragMoveInput(input)
		end,
		InputEnded = function(_button, input)
			handleDragEndInput(input)
		end,
	}
	local railCursor = props.cursor or (if canEdit then HORIZONTAL_DRAG_CURSOR else "default")
	local _exp_3 = composeEventMaps(railEvent, Event)
	local _result_16 = railSlotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.Event
	end
	local railRootEvent = useRootCursorEvent(_exp_3, if _result_16 == nil then railCursor else nil, disabled or readOnly)
	local mouseDragCaptureActive = dragging and isMouseDragActive(dragKindRef.current) and portalTarget ~= nil
	local dragCaptureOverlayEvent = if mouseDragCaptureActive then {
		InputChanged = function(_button, input)
			handleDragMoveInput(input)
		end,
		InputEnded = function(_button, input)
			handleDragEndInput(input)
		end,
	} else nil
	local railRefCallback = React.useCallback(function(instance)
		railRef.current = instance
		setRailInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local decrementEvent = {
		MouseEnter = function()
			if not decrementDisabled then
				setDecrementHovered(true)
			end
		end,
		MouseLeave = function()
			setDecrementHovered(false)
			setDecrementPressed(false)
		end,
		InputBegan = function(_button, input)
			if not decrementDisabled and isPressInput(input) then
				setDecrementPressed(true)
			end
		end,
		InputEnded = function(_button, input)
			if isPressInput(input) then
				setDecrementPressed(false)
			end
		end,
		Activated = function()
			commitStep(-1)
		end,
	}
	local incrementEvent = {
		MouseEnter = function()
			if not incrementDisabled then
				setIncrementHovered(true)
			end
		end,
		MouseLeave = function()
			setIncrementHovered(false)
			setIncrementPressed(false)
		end,
		InputBegan = function(_button, input)
			if not incrementDisabled and isPressInput(input) then
				setIncrementPressed(true)
			end
		end,
		InputEnded = function(_button, input)
			if isPressInput(input) then
				setIncrementPressed(false)
			end
		end,
		Activated = function()
			commitStep(1)
		end,
	}
	local railInstanceProps = {
		Active = not disabled,
		Selectable = not disabled,
		BackgroundColor3 = animatedFrame.inputBackgroundColor,
		BackgroundTransparency = animatedFrame.inputBackgroundTransparency,
		BorderSizePixel = 0,
		Size = UDim2.new(1, railWidthOffset, 1, 0),
		LayoutOrder = 2,
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		AutoButtonColor = false,
		ZIndex = resolvedRailZIndex,
		Event = railRootEvent,
		Change = Change,
	}
	-- luau: rbxtsc never reuses temp locals, so the JSX tree must compile in its own
	-- function scope — inlined in StepperInputBase it exceeds Luau's 200-register limit.
	local renderTree = function()
		local _attributes = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = computedSize,
			Position = computedPosition,
			AnchorPoint = resolvedAnchor,
			ClipsDescendants = props.clip,
			Visible = props.visible,
			LayoutOrder = props.layoutOrder,
			ZIndex = resolvedRootZIndex,
			Event = rootEvent,
		}
		if rootSlotProps then
			for _k, _v in rootSlotProps do
				_attributes[_k] = _v
			end
		end
		local _object = {
			constraint = computedConstraint,
		}
		local _left = "slotProps"
		local _result_17 = slotProps
		if _result_17 ~= nil then
			_result_17 = _result_17.sizeConstraint
		end
		_object[_left] = _result_17
		local _exp_4 = renderSizeConstraintDecorator(_object)
		local _object_1 = {
			enabled = hasPadding,
			paddingTop = paddingTop,
			paddingRight = paddingRight,
			paddingBottom = paddingBottom,
			paddingLeft = paddingLeft,
		}
		local _left_1 = "slotProps"
		local _result_18 = slotProps
		if _result_18 ~= nil then
			_result_18 = _result_18.padding
		end
		_object_1[_left_1] = _result_18
		local _exp_5 = renderPaddingDecorator(_object_1)
		local _attributes_1 = {
			BackgroundColor3 = animatedFrame.backgroundColor,
			BackgroundTransparency = 0,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			ZIndex = resolvedFrameZIndex,
			Active = false,
			Selectable = false,
		}
		if frameSlotProps then
			for _k, _v in frameSlotProps do
				_attributes_1[_k] = _v
			end
		end
		local _object_2 = {
			radius = sizeStyles.radius,
		}
		local _left_2 = "slotProps"
		local _result_19 = slotProps
		if _result_19 ~= nil then
			_result_19 = _result_19.frameCorner
		end
		_object_2[_left_2] = _result_19
		local _exp_6 = renderCornerDecorator(_object_2)
		local _object_3 = {
			enabled = true,
			color = animatedFrame.strokeColor,
			transparency = animatedFrame.strokeTransparency,
			thickness = animatedFrame.strokeThickness,
		}
		local _left_3 = "slotProps"
		local _result_20 = slotProps
		if _result_20 ~= nil then
			_result_20 = _result_20.frameStroke
		end
		_object_3[_left_3] = _result_20
		local _exp_7 = renderStrokeDecorator(_object_3)
		local _object_4 = {
			enabled = true,
			paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
			paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
			paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
			paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
		}
		local _left_4 = "slotProps"
		local _result_21 = slotProps
		if _result_21 ~= nil then
			_result_21 = _result_21.framePadding
		end
		_object_4[_left_4] = _result_21
		local _exp_8 = renderPaddingDecorator(_object_4)
		local _result_22 = slotProps
		if _result_22 ~= nil then
			_result_22 = _result_22.listLayout
		end
		local _attributes_2 = {
			FillDirection = Enum.FillDirection.Horizontal,
			Padding = UDim.new(0, sizeStyles.gap),
			SortOrder = Enum.SortOrder.LayoutOrder,
			VerticalAlignment = Enum.VerticalAlignment.Center,
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
		}
		if _result_22 then
			for _k, _v in _result_22 do
				_attributes_2[_k] = _v
			end
		end
		local _exp_9 = React.createElement("uilistlayout", _attributes_2)
		local _attributes_3 = {
			label = "-",
			state = decrementState,
			disabled = decrementDisabled,
			layoutOrder = 1,
			zIndex = resolvedDecrementZIndex,
			textZIndex = resolvedDecrementTextZIndex,
			buttonSlotProps = decrementSlotProps,
			textSlotProps = decrementTextSlotProps,
			slotProps = slotProps,
			sizeStyles = sizeStyles,
			visualStyles = decrementVisualStyles,
		}
		local _result_23 = decrementSlotProps
		if _result_23 ~= nil then
			_result_23 = _result_23.Event
		end
		_attributes_3.event = composeEventMaps(decrementEvent, _result_23)
		_attributes_3.theme = theme
		local _exp_10 = React.createElement(StepperButtonView, _attributes_3)
		local _exp_11 = React.createElement(StepperRailView, {
			railProps = railInstanceProps,
			railSlotProps = railSlotProps,
			railFillSlotProps = railFillSlotProps,
			railValueSlotProps = railValueSlotProps,
			slotProps = slotProps,
			sizeStyles = sizeStyles,
			displayAlpha = displayAlpha,
			displayText = displayText,
			dragging = dragging,
			fillColor = animatedFrame.railFillColor,
			fillTransparency = animatedFrame.railFillTransparency,
			valueColor = animatedFrame.textColor,
			valueFont = resolvedRailValueFont,
			valueFontFace = resolvedRailValueFontFace,
			fillZIndex = resolvedRailFillZIndex,
			valueZIndex = resolvedRailValueZIndex,
			railRef = railRefCallback,
		})
		local _attributes_4 = {
			label = "+",
			state = incrementState,
			disabled = incrementDisabled,
			layoutOrder = 3,
			zIndex = resolvedIncrementZIndex,
			textZIndex = resolvedIncrementTextZIndex,
			buttonSlotProps = incrementSlotProps,
			textSlotProps = incrementTextSlotProps,
			slotProps = slotProps,
			sizeStyles = sizeStyles,
			visualStyles = incrementVisualStyles,
		}
		local _result_24 = incrementSlotProps
		if _result_24 ~= nil then
			_result_24 = _result_24.Event
		end
		_attributes_4.event = composeEventMaps(incrementEvent, _result_24)
		_attributes_4.theme = theme
		return React.createElement(React.Fragment, nil, React.createElement("frame", _attributes, _exp_4, _exp_5, React.createElement("frame", _attributes_1, _exp_6, _exp_7, _exp_8, _exp_9, _exp_10, _exp_11, React.createElement(StepperButtonView, _attributes_4))), React.createElement(CaptureOverlay, {
			active = mouseDragCaptureActive,
			target = portalTarget,
			Event = dragCaptureOverlayEvent,
		}))
	end
	return renderTree()
end)
local StepperInput = StepperInputBase
StepperInput.displayName = "StepperInput"
return {
	StepperInput = StepperInput,
}
