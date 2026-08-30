-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local isPressInput = _interaction.isPressInput
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveSegmentedControlFrameVisualStyles = _styles.resolveSegmentedControlFrameVisualStyles
local resolveSegmentedControlIndicatorMotionTransition = _styles.resolveSegmentedControlIndicatorMotionTransition
local resolveSegmentedControlIndicatorVisualStyles = _styles.resolveSegmentedControlIndicatorVisualStyles
local resolveSegmentedControlSegmentMotionTransition = _styles.resolveSegmentedControlSegmentMotionTransition
local resolveSegmentedControlSegmentVisualStyles = _styles.resolveSegmentedControlSegmentVisualStyles
local resolveSegmentedControlSizeStyles = _styles.resolveSegmentedControlSizeStyles
local function findOption(options, value)
	if value == nil then
		return nil
	end
	for _, option in options do
		if option.value == value then
			return option
		end
	end
	return nil
end
local function resolveInitialValue(options, value)
	local matchingOption = findOption(options, value)
	if matchingOption ~= nil then
		return matchingOption.value
	end
	for _, option in options do
		if option.disabled ~= true then
			return option.value
		end
	end
	local _result = options[1]
	if _result ~= nil then
		_result = _result.value
	end
	return _result
end
local function resolveSelectedIndex(options, selectedValue)
	if selectedValue == nil then
		return 0
	end
	for index = 0, #options - 1 do
		local option = options[index + 1]
		if option.value == selectedValue then
			return index
		end
	end
	return 0
end
local function offsetZIndex(zIndex, offset)
	local _zIndex = zIndex
	return if type(_zIndex) == "number" then zIndex + offset else nil
end
local function SegmentedControlSegmentView(_param)
	local option = _param.option
	local index = _param.index
	local optionDisabled = _param.optionDisabled
	local interactionState = _param.interactionState
	local segmentCount = _param.segmentCount
	local segmentVisualStyles = _param.segmentVisualStyles
	local segmentEvent = _param.segmentEvent
	local segmentSlotProps = _param.segmentSlotProps
	local segmentTextSlotProps = _param.segmentTextSlotProps
	local slotProps = _param.slotProps
	local theme = _param.theme
	local sizeStyles = _param.sizeStyles
	local segmentTextFont = _param.segmentTextFont
	local segmentTextFontFace = _param.segmentTextFontFace
	local segmentTextSize = _param.segmentTextSize
	local segmentLineHeight = _param.segmentLineHeight
	local resolvedSegmentZIndex = _param.resolvedSegmentZIndex
	local resolvedSegmentTextZIndex = _param.resolvedSegmentTextZIndex
	local motionValues = {
		backgroundColor = segmentVisualStyles.backgroundColor,
		backgroundTransparency = segmentVisualStyles.backgroundTransparency,
		strokeColor = segmentVisualStyles.strokeColor,
		strokeTransparency = segmentVisualStyles.strokeTransparency,
		textColor = segmentVisualStyles.textColor,
		textTransparency = segmentVisualStyles.textTransparency,
	}
	local animatedSegmentStyles = useMotion({
		values = motionValues,
		transition = resolveSegmentedControlSegmentMotionTransition(interactionState),
	})
	local _attributes = {
		key = option.value,
		AutoButtonColor = false,
		Active = not optionDisabled,
		Selectable = not optionDisabled,
		BackgroundColor3 = animatedSegmentStyles.backgroundColor,
		BackgroundTransparency = animatedSegmentStyles.backgroundTransparency,
		BorderSizePixel = 0,
		Size = UDim2.new(1 / segmentCount, -sizeStyles.gap, 1, 0),
		LayoutOrder = index,
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedSegmentZIndex,
		Event = segmentEvent,
	}
	if segmentSlotProps then
		for _k, _v in segmentSlotProps do
			_attributes[_k] = _v
		end
	end
	local _object = {
		radius = sizeStyles.segmentRadius,
	}
	local _left = "slotProps"
	local _result = slotProps
	if _result ~= nil then
		_result = _result.segmentCorner
	end
	_object[_left] = _result
	local _exp = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		color = animatedSegmentStyles.strokeColor,
		transparency = animatedSegmentStyles.strokeTransparency,
		thickness = 1,
	}
	local _left_1 = "slotProps"
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.segmentStroke
	end
	_object_1[_left_1] = _result_1
	local _exp_1 = renderStrokeDecorator(_object_1)
	local _object_2 = {
		enabled = true,
		paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingY, "spacing", theme.spacing.xs)),
		paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingX, "spacing", theme.spacing.sm)),
		paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingY, "spacing", theme.spacing.xs)),
		paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingX, "spacing", theme.spacing.sm)),
	}
	local _left_2 = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.segmentPadding
	end
	_object_2[_left_2] = _result_2
	local _exp_2 = renderPaddingDecorator(_object_2)
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
	}
	local _result_3 = segmentTextSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.Text
	end
	local _condition = _result_3
	if _condition == nil then
		_condition = option.label
	end
	_attributes_1.Text = _condition
	local _result_4 = segmentTextSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.TextColor3
	end
	local _condition_1 = _result_4
	if _condition_1 == nil then
		_condition_1 = animatedSegmentStyles.textColor
	end
	_attributes_1.TextColor3 = _condition_1
	local _result_5 = segmentTextSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.TextTransparency
	end
	local _condition_2 = _result_5
	if _condition_2 == nil then
		_condition_2 = animatedSegmentStyles.textTransparency
	end
	_attributes_1.TextTransparency = _condition_2
	local _result_6 = segmentTextSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.TextStrokeTransparency
	end
	local _condition_3 = _result_6
	if _condition_3 == nil then
		_condition_3 = 1
	end
	_attributes_1.TextStrokeTransparency = _condition_3
	_attributes_1.TextSize = segmentTextSize
	_attributes_1.Font = segmentTextFont
	_attributes_1.FontFace = segmentTextFontFace
	_attributes_1.LineHeight = segmentLineHeight
	local _result_7 = segmentTextSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.TextWrapped
	end
	local _condition_4 = _result_7
	if _condition_4 == nil then
		_condition_4 = false
	end
	_attributes_1.TextWrapped = _condition_4
	local _result_8 = segmentTextSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.TextTruncate
	end
	local _condition_5 = _result_8
	if _condition_5 == nil then
		_condition_5 = Enum.TextTruncate.AtEnd
	end
	_attributes_1.TextTruncate = _condition_5
	local _result_9 = segmentTextSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.TextXAlignment
	end
	local _condition_6 = _result_9
	if _condition_6 == nil then
		_condition_6 = Enum.TextXAlignment.Center
	end
	_attributes_1.TextXAlignment = _condition_6
	local _result_10 = segmentTextSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.TextYAlignment
	end
	local _condition_7 = _result_10
	if _condition_7 == nil then
		_condition_7 = Enum.TextYAlignment.Center
	end
	_attributes_1.TextYAlignment = _condition_7
	_attributes_1.ZIndex = resolvedSegmentTextZIndex
	if segmentTextSlotProps then
		for _k, _v in segmentTextSlotProps do
			_attributes_1[_k] = _v
		end
	end
	return React.createElement("textbutton", _attributes, _exp, _exp_1, _exp_2, React.createElement("textlabel", _attributes_1))
end
local SegmentedControlBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local options = _binding.options
	local variant = _binding.variant
	if variant == nil then
		variant = "outline"
	end
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
	local styleOverrides = _binding.styleOverrides
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	local onChange = _binding.onChange
	local Event = _binding.Event
	local Change = _binding.Change
	local hoveredValue, setHoveredValue = React.useState()
	local pressedValue, setPressedValue = React.useState()
	local uncontrolledValue, setUncontrolledValue = React.useState(function()
		local _condition = value
		if _condition == nil then
			_condition = defaultValue
		end
		return resolveInitialValue(options, _condition)
	end)
	local _condition = value
	if _condition == nil then
		_condition = uncontrolledValue
	end
	local selectedValue = _condition
	local sizeStyles = resolveSegmentedControlSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
	}, props)
	local _binding_1 = useResolvedStyleProps("segmentedControl", mergedStyleProps)
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
	React.useEffect(function()
		if value ~= nil then
			setUncontrolledValue(value)
		end
	end, { value })
	React.useEffect(function()
		setUncontrolledValue(function(currentValue)
			return resolveInitialValue(options, currentValue)
		end)
	end, { options })
	React.useEffect(function()
		if not disabled then
			return nil
		end
		setHoveredValue(nil)
		setPressedValue(nil)
	end, { disabled })
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
	local _segmentSlotProps = slotProps
	if _segmentSlotProps ~= nil then
		_segmentSlotProps = _segmentSlotProps.segment
	end
	local segmentSlotProps = _segmentSlotProps
	local _segmentTextSlotProps = slotProps
	if _segmentTextSlotProps ~= nil then
		_segmentTextSlotProps = _segmentTextSlotProps.segmentText
	end
	local segmentTextSlotProps = _segmentTextSlotProps
	local segmentCount = math.max(#options, 1)
	local _exp = resolveSegmentedControlFrameVisualStyles(theme, variant, color, disabled)
	local _result = styleOverrides
	if _result ~= nil then
		_result = _result.frame
	end
	local frameVisualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		disabled = disabled,
	})
	local _result_1 = rootSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.ZIndex
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = props.zIndex
	end
	local resolvedRootZIndex = _condition_1
	local _result_2 = frameSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.ZIndex
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = resolvedRootZIndex
	end
	local resolvedFrameZIndex = _condition_2
	local _result_3 = segmentSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = resolvedFrameZIndex
	end
	local resolvedSegmentZIndex = _condition_3
	local _result_4 = segmentTextSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.ZIndex
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = resolvedSegmentZIndex
	end
	local resolvedSegmentTextZIndex = _condition_4
	local _result_5 = segmentTextSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.Font
	end
	local _condition_5 = _result_5
	if _condition_5 == nil then
		_condition_5 = theme.fontFamily
	end
	local segmentTextFont = _condition_5
	local _result_6 = segmentTextSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.Font
	end
	local _result_7 = segmentTextSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.FontFace
	end
	local segmentTextFontFace = resolveTextFontFace(_result_6, _result_7, theme.fontFamily)
	local _result_8 = segmentTextSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.TextSize
	end
	local _condition_6 = _result_8
	if _condition_6 == nil then
		_condition_6 = sizeStyles.fontSize
	end
	local segmentTextSize = _condition_6
	local _result_9 = segmentTextSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.LineHeight
	end
	local _condition_7 = _result_9
	if _condition_7 == nil then
		_condition_7 = sizeStyles.lineHeight
	end
	local segmentLineHeight = _condition_7
	local selectedIndex = resolveSelectedIndex(options, selectedValue)
	local _exp_1 = resolveSegmentedControlIndicatorVisualStyles(theme, variant, color, disabled)
	local _result_10 = styleOverrides
	if _result_10 ~= nil then
		_result_10 = _result_10.indicator
	end
	local indicatorVisualStyles = applyStyleOverride(_exp_1, _result_10, {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		disabled = disabled,
	})
	local indicatorMotionValues = {
		selectedIndex = selectedIndex,
		backgroundColor = indicatorVisualStyles.backgroundColor,
		backgroundTransparency = indicatorVisualStyles.backgroundTransparency,
		strokeColor = indicatorVisualStyles.strokeColor,
		strokeTransparency = indicatorVisualStyles.strokeTransparency,
	}
	local animatedIndicatorStyles = useMotion({
		values = indicatorMotionValues,
		transition = resolveSegmentedControlIndicatorMotionTransition(),
	})
	local indicatorSegmentWidthScale = 1 / segmentCount
	local indicatorXScale = animatedIndicatorStyles.selectedIndex / segmentCount
	local resolvedIndicatorZIndex = offsetZIndex(resolvedFrameZIndex, 1)
	local _condition_8 = resolvedIndicatorZIndex
	if _condition_8 == nil then
		_condition_8 = resolvedFrameZIndex
	end
	local resolvedSegmentLayerZIndex = offsetZIndex(_condition_8, 2)
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
		computedSize = UDim2.new(UDim.new(0, if fullWidth then 0 else sizeStyles.defaultWidth), resolvedHeight)
		computedAutoSize = if fullWidth then nil else Enum.AutomaticSize.X
	else
		computedSize = if fullWidth then UDim2.fromScale(1, 0) else UDim2.new(0, sizeStyles.defaultWidth, 0, 0)
		computedAutoSize = Enum.AutomaticSize.Y
	end
	local computedConstraint = if resolvedConstraint == nil then {
		min = Vector2.new(0, sizeStyles.minHeight),
		max = nil,
	} else {
		min = if resolvedConstraint.min == nil then Vector2.new(0, sizeStyles.minHeight) else Vector2.new(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, sizeStyles.minHeight)),
		max = resolvedConstraint.max,
	}
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local rootRef = React.useCallback(function(instance)
		assignRef(ref, instance)
	end, { ref })
	local _exp_2 = composeEventMaps(Event)
	local _result_11 = rootSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.Event
	end
	local rootEvent = useRootCursorEvent(_exp_2, if _result_11 == nil then mergedStyleProps.cursor else nil, disabled)
	local commitValue = function(nextValue)
		if disabled then
			return nil
		end
		local nextOption = findOption(options, nextValue)
		if nextOption == nil or nextOption.disabled == true or nextValue == selectedValue then
			return nil
		end
		if value == nil then
			setUncontrolledValue(nextValue)
		end
		local _result_12 = onChange
		if _result_12 ~= nil then
			_result_12(nextValue)
		end
	end
	local renderSegment = function(option, index)
		local optionDisabled = disabled or option.disabled == true
		local selected = option.value == selectedValue
		local interactionState = if optionDisabled then "disabled" elseif selected then "selected" elseif pressedValue == option.value then "pressed" elseif hoveredValue == option.value then "hovered" else "idle"
		local _exp_3 = resolveSegmentedControlSegmentVisualStyles(theme, variant, color, interactionState)
		local _result_12 = styleOverrides
		if _result_12 ~= nil then
			_result_12 = _result_12.segment
		end
		local segmentVisualStyles = applyStyleOverride(_exp_3, _result_12, {
			theme = theme,
			variant = variant,
			color = color,
			size = size,
			option = option,
			state = interactionState,
		})
		local segmentEvent = {
			MouseEnter = function()
				if not optionDisabled then
					setHoveredValue(option.value)
				end
			end,
			MouseLeave = function()
				if hoveredValue == option.value then
					setHoveredValue(nil)
				end
				if pressedValue == option.value then
					setPressedValue(nil)
				end
			end,
			InputBegan = function(_button, input)
				if not optionDisabled and isPressInput(input) then
					setPressedValue(option.value)
				end
			end,
			InputEnded = function(_button, input)
				if isPressInput(input) and pressedValue == option.value then
					setPressedValue(nil)
				end
			end,
			Activated = function()
				commitValue(option.value)
			end,
		}
		local _result_13 = segmentSlotProps
		if _result_13 ~= nil then
			_result_13 = _result_13.Event
		end
		local mergedSegmentEvent = composeEventMaps(segmentEvent, _result_13)
		return React.createElement(SegmentedControlSegmentView, {
			key = option.value,
			option = option,
			index = index,
			optionDisabled = optionDisabled,
			interactionState = interactionState,
			segmentCount = segmentCount,
			segmentVisualStyles = segmentVisualStyles,
			segmentEvent = mergedSegmentEvent,
			segmentSlotProps = segmentSlotProps,
			segmentTextSlotProps = segmentTextSlotProps,
			slotProps = slotProps,
			theme = theme,
			sizeStyles = sizeStyles,
			segmentTextFont = segmentTextFont,
			segmentTextFontFace = segmentTextFontFace,
			segmentTextSize = segmentTextSize,
			segmentLineHeight = segmentLineHeight,
			resolvedSegmentZIndex = resolvedSegmentZIndex,
			resolvedSegmentTextZIndex = resolvedSegmentTextZIndex,
		})
	end
	local _attributes = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = computedSize,
		AutomaticSize = computedAutoSize,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
		Event = rootEvent,
		Change = Change,
	}
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = rootRef
	local _object = {
		constraint = computedConstraint,
	}
	local _left = "slotProps"
	local _result_12 = slotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.sizeConstraint
	end
	_object[_left] = _result_12
	local _exp_3 = renderSizeConstraintDecorator(_object)
	local _object_1 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_1 = "slotProps"
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.padding
	end
	_object_1[_left_1] = _result_13
	local _exp_4 = renderPaddingDecorator(_object_1)
	local _attributes_1 = {
		BackgroundColor3 = frameVisualStyles.backgroundColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 0, sizeStyles.minHeight),
		AutomaticSize = Enum.AutomaticSize.None,
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
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.frameCorner
	end
	_object_2[_left_2] = _result_14
	local _exp_5 = renderCornerDecorator(_object_2)
	local _object_3 = {
		enabled = true,
		color = frameVisualStyles.strokeColor,
		transparency = frameVisualStyles.strokeTransparency,
		thickness = 1,
	}
	local _left_3 = "slotProps"
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.frameStroke
	end
	_object_3[_left_3] = _result_15
	local _exp_6 = renderStrokeDecorator(_object_3)
	local _object_4 = {
		enabled = true,
		paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs)),
		paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs)),
		paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs)),
		paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs)),
	}
	local _left_4 = "slotProps"
	local _result_16 = slotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.framePadding
	end
	_object_4[_left_4] = _result_16
	local _exp_7 = renderPaddingDecorator(_object_4)
	local _exp_8 = React.createElement("frame", {
		BackgroundColor3 = animatedIndicatorStyles.backgroundColor,
		BackgroundTransparency = animatedIndicatorStyles.backgroundTransparency,
		BorderSizePixel = 0,
		Position = UDim2.new(indicatorXScale, 0, 0, 0),
		Size = UDim2.new(indicatorSegmentWidthScale, -sizeStyles.gap, 1, 0),
		ZIndex = resolvedIndicatorZIndex,
		Active = false,
		Selectable = false,
	}, renderCornerDecorator({
		radius = sizeStyles.segmentRadius,
	}), renderStrokeDecorator({
		enabled = true,
		color = animatedIndicatorStyles.strokeColor,
		transparency = animatedIndicatorStyles.strokeTransparency,
		thickness = 1,
	}))
	local _result_17 = slotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.listLayout
	end
	local _attributes_2 = {
		FillDirection = Enum.FillDirection.Horizontal,
		Padding = UDim.new(0, sizeStyles.gap),
		SortOrder = Enum.SortOrder.LayoutOrder,
		VerticalAlignment = Enum.VerticalAlignment.Center,
		HorizontalAlignment = Enum.HorizontalAlignment.Center,
	}
	if _result_17 then
		for _k, _v in _result_17 do
			_attributes_2[_k] = _v
		end
	end
	local _exp_9 = React.createElement("uilistlayout", _attributes_2)
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#options)
	for _k, _v in options do
		_newValue[_k] = renderSegment(_v, _k - 1, options)
	end
	-- ▲ ReadonlyArray.map ▲
	return React.createElement("frame", _attributes, _exp_3, _exp_4, React.createElement("frame", _attributes_1, _exp_5, _exp_6, _exp_7, _exp_8, React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		ZIndex = resolvedSegmentLayerZIndex,
		Active = false,
		Selectable = false,
	}, _exp_9, _newValue)))
end)
local SegmentedControl = SegmentedControlBase
SegmentedControl.displayName = "SegmentedControl"
return {
	SegmentedControl = SegmentedControl,
}
