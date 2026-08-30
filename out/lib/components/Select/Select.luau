-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local getLucideIconAsset = TS.import(script, script.Parent.Parent.Parent, "icons", "lucide").getLucideIconAsset
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local resolveMinimumHeightConstraint = TS.import(script, script.Parent.Parent, "_shared", "frameSize").resolveMinimumHeightConstraint
local useTriggerOverlayLayout = TS.import(script, script.Parent.Parent, "_shared", "layering").useTriggerOverlayLayout
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local usePressInteraction = TS.import(script, script.Parent.Parent, "_shared", "usePressInteraction").usePressInteraction
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local SelectDropdown = TS.import(script, script.Parent, "SelectDropdown").SelectDropdown
local _styles = TS.import(script, script.Parent, "styles")
local resolveSelectSizeStyles = _styles.resolveSelectSizeStyles
local resolveSelectTriggerMotionTransition = _styles.resolveSelectTriggerMotionTransition
local resolveSelectTriggerVisualStyles = _styles.resolveSelectTriggerVisualStyles
local _utils = TS.import(script, script.Parent, "utils")
local assignRef = _utils.assignRef
local composeEventMaps = _utils.composeEventMaps
local findSelectedOption = _utils.findSelectedOption
local incrementZIndex = _utils.incrementZIndex
local resolveSelectOverlayLayout = _utils.resolveSelectOverlayLayout
local resolveTextFontFace = _utils.resolveTextFontFace
local SelectBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
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
	local placeholder = _binding.placeholder
	local options = _binding.options
	local selected = _binding.selected
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	local onChange = _binding.onChange
	local maxVisibleOptions = _binding.maxVisibleOptions
	if maxVisibleOptions == nil then
		maxVisibleOptions = 6
	end
	local styleOverrides = _binding.styleOverrides
	local Event = _binding.Event
	local Change = _binding.Change
	local open, setOpen = React.useState(false)
	local press = usePressInteraction({
		interactive = not disabled,
		onActivated = function()
			if #options == 0 then
				return nil
			end
			setOpen(function(currentOpen)
				return not currentOpen
			end)
		end,
	})
	local _condition = value
	if _condition == nil then
		_condition = selected
	end
	local controlledValue = _condition
	local _condition_1 = controlledValue
	if _condition_1 == nil then
		_condition_1 = defaultValue
	end
	local uncontrolledValue, setUncontrolledValue = React.useState(_condition_1)
	local triggerInstance, setTriggerInstance = React.useState()
	local sizeStyles = resolveSelectSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
		px = sizeStyles.paddingX,
		py = sizeStyles.paddingY,
	}, props)
	local _binding_1 = useResolvedStyleProps("select", mergedStyleProps)
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
	local _condition_2 = controlledValue
	if _condition_2 == nil then
		_condition_2 = uncontrolledValue
	end
	local currentValue = _condition_2
	local selectedOption = findSelectedOption(options, currentValue)
	local hasSelection = selectedOption ~= nil
	local _result
	if hasSelection then
		_result = selectedOption.label
	else
		local _condition_3 = placeholder
		if _condition_3 == nil then
			_condition_3 = ""
		end
		_result = _condition_3
	end
	local triggerText = _result
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _triggerSlotProps = slotProps
	if _triggerSlotProps ~= nil then
		_triggerSlotProps = _triggerSlotProps.trigger
	end
	local triggerSlotProps = _triggerSlotProps
	local _triggerTextSlotProps = slotProps
	if _triggerTextSlotProps ~= nil then
		_triggerTextSlotProps = _triggerTextSlotProps.triggerText
	end
	local triggerTextSlotProps = _triggerTextSlotProps
	local _indicatorSlotProps = slotProps
	if _indicatorSlotProps ~= nil then
		_indicatorSlotProps = _indicatorSlotProps.indicator
	end
	local indicatorSlotProps = _indicatorSlotProps
	local indicatorAsset = getLucideIconAsset("chevron-right", sizeStyles.indicatorSize)
	local triggerOverlayLayout = useTriggerOverlayLayout(triggerInstance, open)
	React.useEffect(function()
		if controlledValue ~= nil then
			setUncontrolledValue(controlledValue)
		end
	end, { controlledValue })
	React.useEffect(function()
		if not disabled then
			return nil
		end
		setOpen(false)
	end, { disabled })
	React.useEffect(function()
		if #options > 0 then
			return nil
		end
		setOpen(false)
	end, { options })
	local _result_1
	if fullWidth then
		_result_1 = resolveUDimSafe("select", "100%", "width")
	else
		local _result_2 = resolvedSize
		if _result_2 ~= nil then
			_result_2 = _result_2.X
		end
		local _condition_3 = _result_2
		if _condition_3 == nil then
			_condition_3 = resolvedWidth or UDim.new(0, sizeStyles.defaultWidth)
		end
		_result_1 = _condition_3
	end
	local computedWidth = _result_1
	local _result_2 = resolvedSize
	if _result_2 ~= nil then
		_result_2 = _result_2.Y
	end
	local _condition_3 = _result_2
	if _condition_3 == nil then
		_condition_3 = resolvedHeight or UDim.new(0, sizeStyles.minHeight)
	end
	local triggerHeight = _condition_3
	local minimumTriggerHeight = math.max(sizeStyles.minHeight, triggerHeight.Offset)
	local overlayLayout = React.useMemo(function()
		return resolveSelectOverlayLayout(triggerOverlayLayout, sizeStyles.listGap, minimumTriggerHeight)
	end, { minimumTriggerHeight, sizeStyles.listGap, triggerOverlayLayout })
	local computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, sizeStyles.minHeight)
	local triggerState = if disabled then "disabled" elseif press.pressed then "pressed" elseif open then "open" elseif press.hovered then "hovered" else "idle"
	local triggerStyleOverrideContext = {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		state = triggerState,
		hasValue = hasSelection,
	}
	local _exp = resolveSelectTriggerVisualStyles(theme, variant, color, triggerState, hasSelection)
	local _result_3 = styleOverrides
	if _result_3 ~= nil then
		_result_3 = _result_3.trigger
	end
	local triggerVisualStyles = applyStyleOverride(_exp, _result_3, triggerStyleOverrideContext)
	local triggerAnimated = useMotion({
		values = {
			backgroundColor = triggerVisualStyles.backgroundColor,
			strokeColor = triggerVisualStyles.strokeColor,
			strokeTransparency = triggerVisualStyles.strokeTransparency,
			strokeThickness = triggerVisualStyles.strokeThickness,
			textColor = triggerVisualStyles.textColor,
			placeholderColor = triggerVisualStyles.placeholderColor,
			indicatorColor = triggerVisualStyles.indicatorColor,
			indicatorRotation = triggerVisualStyles.indicatorRotation,
		},
		transition = resolveSelectTriggerMotionTransition(triggerState),
	})
	local _result_4 = triggerTextSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.Font
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = theme.fontFamily
	end
	local resolvedTriggerFont = _condition_4
	local _result_5 = triggerTextSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.Font
	end
	local _result_6 = triggerTextSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.FontFace
	end
	local resolvedTriggerFontFace = resolveTextFontFace(_result_5, _result_6, theme.fontFamily)
	local _result_7 = triggerTextSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.TextSize
	end
	local _condition_5 = _result_7
	if _condition_5 == nil then
		_condition_5 = sizeStyles.fontSize
	end
	local resolvedTriggerTextSize = _condition_5
	local _result_8 = triggerTextSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.LineHeight
	end
	local _condition_6 = _result_8
	if _condition_6 == nil then
		_condition_6 = sizeStyles.lineHeight
	end
	local resolvedTriggerLineHeight = _condition_6
	local _result_9 = rootSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.ZIndex
	end
	local _condition_7 = _result_9
	if _condition_7 == nil then
		_condition_7 = props.zIndex
	end
	local resolvedRootZIndex = _condition_7
	local _result_10 = triggerSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.ZIndex
	end
	local _condition_8 = _result_10
	if _condition_8 == nil then
		_condition_8 = resolvedRootZIndex
	end
	local resolvedTriggerZIndex = _condition_8
	local _result_11 = triggerTextSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.ZIndex
	end
	local _condition_9 = _result_11
	if _condition_9 == nil then
		_condition_9 = resolvedTriggerZIndex
	end
	local resolvedTriggerTextZIndex = _condition_9
	local _result_12 = indicatorSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.ZIndex
	end
	local _condition_10 = _result_12
	if _condition_10 == nil then
		_condition_10 = resolvedTriggerZIndex
	end
	local resolvedIndicatorZIndex = _condition_10
	local _condition_11 = resolvedTriggerZIndex
	if _condition_11 == nil then
		local _result_13 = overlayLayout
		if _result_13 ~= nil then
			_result_13 = _result_13.zIndexBase
		end
		_condition_11 = _result_13
	end
	local resolvedDropdownZIndex = incrementZIndex(_condition_11, 1)
	local _exp_1 = composeEventMaps(press.eventMap, Event)
	local _result_13 = triggerSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.Event
	end
	local triggerEvent = useRootCursorEvent(_exp_1, if _result_13 == nil then mergedStyleProps.cursor else nil, disabled)
	local handleSelect = function(nextValue)
		if disabled then
			return nil
		end
		local option = findSelectedOption(options, nextValue)
		if option == nil or option.disabled then
			return nil
		end
		if controlledValue == nil then
			setUncontrolledValue(nextValue)
		end
		if nextValue ~= currentValue then
			local _result_14 = onChange
			if _result_14 ~= nil then
				_result_14(nextValue)
			end
		end
		setOpen(false)
	end
	local triggerRef = React.useCallback(function(instance)
		setTriggerInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local rootInstanceProps = {
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		BackgroundColor3 = theme.colors.background.default,
		Size = UDim2.new(computedWidth, UDim.new(0, 0)),
		AutomaticSize = Enum.AutomaticSize.Y,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
	}
	local triggerInstanceProps = {
		AutoButtonColor = false,
		Active = not disabled,
		Selectable = not disabled,
		BackgroundColor3 = triggerAnimated.backgroundColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, triggerHeight.Scale, triggerHeight.Offset),
		LayoutOrder = 1,
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedTriggerZIndex,
		Event = triggerEvent,
		Change = Change,
	}
	local _attributes = table.clone(rootInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.rootLayout
	end
	local _attributes_1 = {
		FillDirection = Enum.FillDirection.Vertical,
		HorizontalAlignment = Enum.HorizontalAlignment.Left,
		VerticalAlignment = Enum.VerticalAlignment.Top,
		SortOrder = Enum.SortOrder.LayoutOrder,
		Padding = UDim.new(0, sizeStyles.listGap),
	}
	if _result_14 then
		for _k, _v in _result_14 do
			_attributes_1[_k] = _v
		end
	end
	local _exp_2 = React.createElement("uilistlayout", _attributes_1)
	local _object = {
		constraint = computedConstraint,
	}
	local _left = "slotProps"
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.sizeConstraint
	end
	_object[_left] = _result_15
	local _exp_3 = renderSizeConstraintDecorator(_object)
	local _attributes_2 = table.clone(triggerInstanceProps)
	setmetatable(_attributes_2, nil)
	if triggerSlotProps then
		for _k, _v in triggerSlotProps do
			_attributes_2[_k] = _v
		end
	end
	_attributes_2.ref = triggerRef
	local _object_1 = {
		radius = sizeStyles.radius,
	}
	local _left_1 = "slotProps"
	local _result_16 = slotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.triggerCorner
	end
	_object_1[_left_1] = _result_16
	local _exp_4 = renderCornerDecorator(_object_1)
	local _object_2 = {
		enabled = true,
		color = triggerAnimated.strokeColor,
		transparency = triggerAnimated.strokeTransparency,
		thickness = triggerAnimated.strokeThickness,
	}
	local _left_2 = "slotProps"
	local _result_17 = slotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.triggerStroke
	end
	_object_2[_left_2] = _result_17
	local _exp_5 = renderStrokeDecorator(_object_2)
	local _object_3 = {
		enabled = true,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_3 = "slotProps"
	local _result_18 = slotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.triggerPadding
	end
	_object_3[_left_3] = _result_18
	local _exp_6 = renderPaddingDecorator(_object_3)
	local _attributes_3 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.new(1, -(sizeStyles.indicatorSize + sizeStyles.indicatorGap), 1, 0),
	}
	local _result_19 = triggerTextSlotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.Text
	end
	local _condition_12 = _result_19
	if _condition_12 == nil then
		_condition_12 = triggerText
	end
	_attributes_3.Text = _condition_12
	local _result_20 = triggerTextSlotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.TextColor3
	end
	local _condition_13 = _result_20
	if _condition_13 == nil then
		_condition_13 = (if hasSelection then triggerAnimated.textColor else triggerAnimated.placeholderColor)
	end
	_attributes_3.TextColor3 = _condition_13
	local _result_21 = triggerTextSlotProps
	if _result_21 ~= nil then
		_result_21 = _result_21.TextTransparency
	end
	local _condition_14 = _result_21
	if _condition_14 == nil then
		_condition_14 = 0
	end
	_attributes_3.TextTransparency = _condition_14
	local _result_22 = triggerTextSlotProps
	if _result_22 ~= nil then
		_result_22 = _result_22.TextStrokeTransparency
	end
	local _condition_15 = _result_22
	if _condition_15 == nil then
		_condition_15 = 1
	end
	_attributes_3.TextStrokeTransparency = _condition_15
	_attributes_3.TextSize = resolvedTriggerTextSize
	_attributes_3.Font = resolvedTriggerFont
	_attributes_3.FontFace = resolvedTriggerFontFace
	_attributes_3.LineHeight = resolvedTriggerLineHeight
	local _result_23 = triggerTextSlotProps
	if _result_23 ~= nil then
		_result_23 = _result_23.TextWrapped
	end
	local _condition_16 = _result_23
	if _condition_16 == nil then
		_condition_16 = false
	end
	_attributes_3.TextWrapped = _condition_16
	local _result_24 = triggerTextSlotProps
	if _result_24 ~= nil then
		_result_24 = _result_24.TextTruncate
	end
	local _condition_17 = _result_24
	if _condition_17 == nil then
		_condition_17 = Enum.TextTruncate.AtEnd
	end
	_attributes_3.TextTruncate = _condition_17
	local _result_25 = triggerTextSlotProps
	if _result_25 ~= nil then
		_result_25 = _result_25.TextXAlignment
	end
	local _condition_18 = _result_25
	if _condition_18 == nil then
		_condition_18 = Enum.TextXAlignment.Left
	end
	_attributes_3.TextXAlignment = _condition_18
	local _result_26 = triggerTextSlotProps
	if _result_26 ~= nil then
		_result_26 = _result_26.TextYAlignment
	end
	local _condition_19 = _result_26
	if _condition_19 == nil then
		_condition_19 = Enum.TextYAlignment.Center
	end
	_attributes_3.TextYAlignment = _condition_19
	local _result_27 = triggerTextSlotProps
	if _result_27 ~= nil then
		_result_27 = _result_27.TextScaled
	end
	local _condition_20 = _result_27
	if _condition_20 == nil then
		_condition_20 = false
	end
	_attributes_3.TextScaled = _condition_20
	local _result_28 = triggerTextSlotProps
	if _result_28 ~= nil then
		_result_28 = _result_28.RichText
	end
	local _condition_21 = _result_28
	if _condition_21 == nil then
		_condition_21 = false
	end
	_attributes_3.RichText = _condition_21
	_attributes_3.ZIndex = resolvedTriggerTextZIndex
	if triggerTextSlotProps then
		for _k, _v in triggerTextSlotProps do
			_attributes_3[_k] = _v
		end
	end
	local _exp_7 = React.createElement("textlabel", _attributes_3)
	local _attributes_4 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(sizeStyles.indicatorSize, sizeStyles.indicatorSize),
		Position = UDim2.fromScale(1, 0.5),
		AnchorPoint = Vector2.new(1, 0.5),
	}
	local _result_29 = indicatorAsset
	if _result_29 ~= nil then
		_result_29 = _result_29.Url
	end
	_attributes_4.Image = _result_29
	local _result_30 = indicatorAsset
	if _result_30 ~= nil then
		_result_30 = _result_30.ImageRectSize
	end
	_attributes_4.ImageRectSize = _result_30
	local _result_31 = indicatorAsset
	if _result_31 ~= nil then
		_result_31 = _result_31.ImageRectOffset
	end
	_attributes_4.ImageRectOffset = _result_31
	local _result_32 = indicatorSlotProps
	if _result_32 ~= nil then
		_result_32 = _result_32.ImageColor3
	end
	local _condition_22 = _result_32
	if _condition_22 == nil then
		_condition_22 = triggerAnimated.indicatorColor
	end
	_attributes_4.ImageColor3 = _condition_22
	local _result_33 = indicatorSlotProps
	if _result_33 ~= nil then
		_result_33 = _result_33.ImageTransparency
	end
	local _condition_23 = _result_33
	if _condition_23 == nil then
		_condition_23 = 0
	end
	_attributes_4.ImageTransparency = _condition_23
	local _result_34 = indicatorSlotProps
	if _result_34 ~= nil then
		_result_34 = _result_34.Rotation
	end
	local _condition_24 = _result_34
	if _condition_24 == nil then
		_condition_24 = triggerAnimated.indicatorRotation
	end
	_attributes_4.Rotation = _condition_24
	_attributes_4.ScaleType = Enum.ScaleType.Fit
	_attributes_4.ZIndex = resolvedIndicatorZIndex
	_attributes_4.Active = false
	_attributes_4.Selectable = false
	if indicatorSlotProps then
		for _k, _v in indicatorSlotProps do
			_attributes_4[_k] = _v
		end
	end
	return React.createElement(React.Fragment, nil, React.createElement("frame", _attributes, _exp_2, _exp_3, React.createElement("textbutton", _attributes_2, _exp_4, _exp_5, React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Active = false,
		Selectable = false,
	}, _exp_6, _exp_7, React.createElement("imagelabel", _attributes_4)))), if open and #options > 0 and overlayLayout ~= nil then (React.createElement(SelectDropdown, {
		layout = overlayLayout,
		variant = variant,
		color = color,
		size = size,
		options = options,
		currentValue = currentValue,
		sizeStyles = sizeStyles,
		maxVisibleOptions = maxVisibleOptions,
		slotProps = slotProps,
		styleOverrides = styleOverrides,
		cursor = mergedStyleProps.cursor,
		zIndex = resolvedDropdownZIndex,
		onSelect = handleSelect,
	})) else nil)
end)
local Select = SelectBase
Select.displayName = "Select"
return {
	Select = Select,
}
