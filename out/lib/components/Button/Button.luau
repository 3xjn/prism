-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local resolveMinimumHeightConstraint = TS.import(script, script.Parent.Parent, "_shared", "frameSize").resolveMinimumHeightConstraint
local composeEventMaps = TS.import(script, script.Parent.Parent, "_shared", "interaction").composeEventMaps
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local usePressInteraction = TS.import(script, script.Parent.Parent, "_shared", "usePressInteraction").usePressInteraction
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveButtonContentGap = _styles.resolveButtonContentGap
local resolveButtonMotionTransition = _styles.resolveButtonMotionTransition
local resolveButtonSizeStyles = _styles.resolveButtonSizeStyles
local resolveButtonVisualStyles = _styles.resolveButtonVisualStyles
local TextService = game:GetService("TextService")
local BUTTON_AUTO_WIDTH_BUFFER = 2
local function isPrimitiveButtonLabel(value)
	local _value = value
	local _condition = type(_value) == "string"
	if not _condition then
		local _value_1 = value
		_condition = type(_value_1) == "number"
	end
	return _condition
end
local function resolveConcretePaddingValue(value, fallback)
	local _value = value
	if typeof(_value) == "UDim" then
		return value
	end
	return fallback or UDim.new(0, 0)
end
local function resolveConcreteNumberValue(value, fallback)
	local _value = value
	if typeof(_value) == "number" then
		return value
	end
	return fallback
end
local function resolveMeasurementFont(value, fallback)
	local _value = value
	if typeof(_value) == "EnumItem" then
		return value
	end
	return fallback
end
local function resolveAutoAxisLength(contentPixels, start, trailing, minPixels, maxPixels)
	if minPixels == nil then
		minPixels = 0
	end
	local innerScale = 1 - start.Scale - trailing.Scale
	local baseLength = if innerScale > 0 then (contentPixels + start.Offset + trailing.Offset) / innerScale else contentPixels + start.Offset + trailing.Offset
	local resolvedLength = math.max(baseLength, minPixels)
	if maxPixels ~= nil then
		resolvedLength = math.min(resolvedLength, maxPixels)
	end
	return math.max(0, math.ceil(resolvedLength))
end
local ButtonBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local variant = _binding.variant
	if variant == nil then
		variant = "filled"
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
	local label = _binding.label
	local children = _binding.children
	local onPress = _binding.onPress
	local Event = _binding.Event
	local Change = _binding.Change
	local press = usePressInteraction({
		interactive = not disabled,
		onActivated = onPress,
	})
	local sizeStyles = resolveButtonSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
		px = sizeStyles.paddingX,
		py = sizeStyles.paddingY,
	}, props)
	local _binding_1 = useResolvedStyleProps("button", mergedStyleProps)
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
	local computedWidth = if fullWidth then resolveUDimSafe("button", "100%", "width") else resolvedWidth
	local visualState = press.state
	local styleOverrideContext = {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		state = visualState,
	}
	local resolvedVisualStyles = applyStyleOverride(resolveButtonVisualStyles(theme, variant, color, visualState), styleOverrides, styleOverrideContext)
	local motionTransition = resolveButtonMotionTransition(visualState)
	local animated = useMotion({
		values = {
			backgroundColor = resolvedVisualStyles.backgroundColor,
			backgroundTransparency = resolvedVisualStyles.backgroundTransparency,
			textColor = resolvedVisualStyles.textColor,
			strokeColor = resolvedVisualStyles.strokeColor,
			strokeTransparency = resolvedVisualStyles.strokeTransparency,
			scale = resolvedVisualStyles.scale,
		},
		transition = motionTransition,
	})
	local computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, sizeStyles.minHeight)
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local primitiveChildLabel = if isPrimitiveButtonLabel(children) then children else nil
	local _condition = label
	if _condition == nil then
		_condition = primitiveChildLabel
	end
	local resolvedLabelContent = _condition
	local _condition_1 = resolvedLabelContent
	if _condition_1 == nil then
		_condition_1 = ""
	end
	local resolvedLabelText = tostring(_condition_1)
	local customChildren = if children ~= nil and children ~= false and not isPrimitiveButtonLabel(children) then children else nil
	local hasCustomChildren = customChildren ~= nil
	local hasVisibleLabel = #resolvedLabelText > 0
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.Text
	end
	local _condition_2 = _result
	if _condition_2 == nil then
		_condition_2 = resolvedLabelText
	end
	local resolvedText = _condition_2
	local _result_1 = rootSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Text
	end
	local measuredText = if type(_result_1) == "string" then rootSlotProps.Text else resolvedLabelText
	local _result_2 = rootSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.Font
	end
	local _condition_3 = _result_2
	if _condition_3 == nil then
		_condition_3 = theme.fontFamily
	end
	local resolvedFont = _condition_3
	local _result_3 = rootSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.FontFace
	end
	local _condition_4 = _result_3
	if _condition_4 == nil then
		_condition_4 = Font.fromEnum(theme.fontFamily)
	end
	local resolvedFontFace = _condition_4
	local _result_4 = rootSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.TextSize
	end
	local _condition_5 = _result_4
	if _condition_5 == nil then
		_condition_5 = sizeStyles.fontSize
	end
	local resolvedTextSize = _condition_5
	local _result_5 = rootSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.TextSize
	end
	local measuredTextSize = resolveConcreteNumberValue(_result_5, sizeStyles.fontSize)
	local _result_6 = rootSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.LineHeight
	end
	local _condition_6 = _result_6
	if _condition_6 == nil then
		_condition_6 = sizeStyles.lineHeight
	end
	local resolvedLineHeight = _condition_6
	local _result_7 = rootSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.LineHeight
	end
	local measuredLineHeight = resolveConcreteNumberValue(_result_7, sizeStyles.lineHeight)
	local _result_8 = rootSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.TextWrapped
	end
	local _condition_7 = _result_8
	if _condition_7 == nil then
		_condition_7 = false
	end
	local resolvedTextWrapped = _condition_7
	local _result_9 = rootSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.TextTruncate
	end
	local _condition_8 = _result_9
	if _condition_8 == nil then
		_condition_8 = Enum.TextTruncate.AtEnd
	end
	local resolvedTextTruncate = _condition_8
	local _result_10 = rootSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.TextXAlignment
	end
	local _condition_9 = _result_10
	if _condition_9 == nil then
		_condition_9 = Enum.TextXAlignment.Center
	end
	local resolvedTextXAlignment = _condition_9
	local _result_11 = rootSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.TextYAlignment
	end
	local _condition_10 = _result_11
	if _condition_10 == nil then
		_condition_10 = Enum.TextYAlignment.Center
	end
	local resolvedTextYAlignment = _condition_10
	local _result_12 = rootSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.TextScaled
	end
	local _condition_11 = _result_12
	if _condition_11 == nil then
		_condition_11 = false
	end
	local resolvedTextScaled = _condition_11
	local _result_13 = rootSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.RichText
	end
	local _condition_12 = _result_13
	if _condition_12 == nil then
		_condition_12 = false
	end
	local resolvedRichText = _condition_12
	local _result_14 = rootSlotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.TextColor3
	end
	local _condition_13 = _result_14
	if _condition_13 == nil then
		_condition_13 = animated.textColor
	end
	local resolvedTextColor = _condition_13
	local _result_15 = rootSlotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.TextTransparency
	end
	local _condition_14 = _result_15
	if _condition_14 == nil then
		_condition_14 = 0
	end
	local resolvedTextTransparency = _condition_14
	local _resolvedTextStrokeColor = rootSlotProps
	if _resolvedTextStrokeColor ~= nil then
		_resolvedTextStrokeColor = _resolvedTextStrokeColor.TextStrokeColor3
	end
	local resolvedTextStrokeColor = _resolvedTextStrokeColor
	local _resolvedTextStrokeTransparency = rootSlotProps
	if _resolvedTextStrokeTransparency ~= nil then
		_resolvedTextStrokeTransparency = _resolvedTextStrokeTransparency.TextStrokeTransparency
	end
	local resolvedTextStrokeTransparency = _resolvedTextStrokeTransparency
	local _result_16 = rootSlotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.BackgroundColor3
	end
	local _condition_15 = _result_16
	if _condition_15 == nil then
		_condition_15 = animated.backgroundColor
	end
	local resolvedBackgroundColor = _condition_15
	local _result_17 = rootSlotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.BackgroundTransparency
	end
	local _condition_16 = _result_17
	if _condition_16 == nil then
		_condition_16 = animated.backgroundTransparency
	end
	local resolvedBackgroundTransparency = _condition_16
	local _result_18 = slotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.padding
		if _result_18 ~= nil then
			_result_18 = _result_18.PaddingTop
		end
	end
	local resolvedPaddingTop = resolveConcretePaddingValue(_result_18, paddingTop)
	local _result_19 = slotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.padding
		if _result_19 ~= nil then
			_result_19 = _result_19.PaddingRight
		end
	end
	local resolvedPaddingRight = resolveConcretePaddingValue(_result_19, paddingRight)
	local _result_20 = slotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.padding
		if _result_20 ~= nil then
			_result_20 = _result_20.PaddingBottom
		end
	end
	local resolvedPaddingBottom = resolveConcretePaddingValue(_result_20, paddingBottom)
	local _result_21 = slotProps
	if _result_21 ~= nil then
		_result_21 = _result_21.padding
		if _result_21 ~= nil then
			_result_21 = _result_21.PaddingLeft
		end
	end
	local resolvedPaddingLeft = resolveConcretePaddingValue(_result_21, paddingLeft)
	local _result_22 = rootSlotProps
	if _result_22 ~= nil then
		_result_22 = _result_22.Font
	end
	local measurementFont = resolveMeasurementFont(_result_22, theme.fontFamily)
	local measuredTextBounds = TextService:GetTextSize(measuredText, measuredTextSize, measurementFont, Vector2.new(10000, 10000))
	local measuredTextHeight = math.max(measuredTextBounds.Y, math.ceil(measuredTextSize * measuredLineHeight))
	local customChildWidthAllowance = if hasCustomChildren then math.max(measuredTextSize, theme.spacing.md) + (if hasVisibleLabel then resolveButtonContentGap(theme, size) else 0) else 0
	local measuredTextWidth = math.ceil(measuredTextBounds.X) + BUTTON_AUTO_WIDTH_BUFFER + customChildWidthAllowance
	local _result_23 = computedConstraint
	if _result_23 ~= nil then
		_result_23 = _result_23.min
		if _result_23 ~= nil then
			_result_23 = _result_23.X
		end
	end
	local _condition_17 = _result_23
	if _condition_17 == nil then
		_condition_17 = 0
	end
	local _result_24 = computedConstraint
	if _result_24 ~= nil then
		_result_24 = _result_24.max
		if _result_24 ~= nil then
			_result_24 = _result_24.X
		end
	end
	local computedAutoWidth = resolveAutoAxisLength(measuredTextWidth, resolvedPaddingLeft, resolvedPaddingRight, _condition_17, _result_24)
	local _result_25 = computedConstraint
	if _result_25 ~= nil then
		_result_25 = _result_25.min
		if _result_25 ~= nil then
			_result_25 = _result_25.Y
		end
	end
	local _condition_18 = _result_25
	if _condition_18 == nil then
		_condition_18 = 0
	end
	local _result_26 = computedConstraint
	if _result_26 ~= nil then
		_result_26 = _result_26.max
		if _result_26 ~= nil then
			_result_26 = _result_26.Y
		end
	end
	local computedAutoHeight = resolveAutoAxisLength(measuredTextHeight, resolvedPaddingTop, resolvedPaddingBottom, _condition_18, _result_26)
	local computedSize
	if resolvedSize ~= nil then
		computedSize = resolvedSize
	elseif computedWidth ~= nil and resolvedHeight ~= nil then
		computedSize = UDim2.new(computedWidth, resolvedHeight)
	elseif computedWidth ~= nil then
		computedSize = UDim2.new(computedWidth, UDim.new(0, computedAutoHeight))
	elseif resolvedHeight ~= nil then
		computedSize = UDim2.new(UDim.new(0, computedAutoWidth), resolvedHeight)
	else
		computedSize = UDim2.fromOffset(computedAutoWidth, computedAutoHeight)
	end
	local _result_27 = rootSlotProps
	if _result_27 ~= nil then
		_result_27 = _result_27.ZIndex
	end
	local _condition_19 = _result_27
	if _condition_19 == nil then
		_condition_19 = props.zIndex
	end
	local resolvedZIndex = _condition_19
	local resolvedLabelZIndex = resolvedZIndex
	local _exp = composeEventMaps(press.eventMap, Event)
	local _result_28 = rootSlotProps
	if _result_28 ~= nil then
		_result_28 = _result_28.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result_28 == nil then mergedStyleProps.cursor else nil, disabled)
	local decoratorChildren = {}
	local _object = {
		constraint = computedConstraint,
	}
	local _left = "slotProps"
	local _result_29 = slotProps
	if _result_29 ~= nil then
		_result_29 = _result_29.sizeConstraint
	end
	_object[_left] = _result_29
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object))
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local textButtonInstanceProps = {
		AutoButtonColor = false,
		Active = not disabled,
		Selectable = not disabled,
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		BackgroundColor3 = resolvedBackgroundColor,
		Size = computedSize,
		AutomaticSize = nil,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedZIndex,
		Text = resolvedText,
		TextSize = resolvedTextSize,
		TextColor3 = resolvedTextColor,
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		Font = resolvedFont,
		FontFace = resolvedFontFace,
		LineHeight = resolvedLineHeight,
		TextWrapped = resolvedTextWrapped,
		TextTruncate = resolvedTextTruncate,
		TextXAlignment = resolvedTextXAlignment,
		TextYAlignment = resolvedTextYAlignment,
		TextScaled = resolvedTextScaled,
		RichText = resolvedRichText,
		Event = rootEvent,
		Change = Change,
	}
	local _attributes = table.clone(textButtonInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	local _result_30 = slotProps
	if _result_30 ~= nil then
		_result_30 = _result_30.scale
	end
	local _attributes_1 = {
		Scale = animated.scale,
	}
	if _result_30 then
		for _k, _v in _result_30 do
			_attributes_1[_k] = _v
		end
	end
	local _exp_1 = React.createElement("uiscale", _attributes_1)
	local _object_1 = {
		radius = sizeStyles.radius,
	}
	local _left_1 = "slotProps"
	local _result_31 = slotProps
	if _result_31 ~= nil then
		_result_31 = _result_31.corner
	end
	_object_1[_left_1] = _result_31
	local _exp_2 = renderCornerDecorator(_object_1)
	local _object_2 = {
		enabled = resolvedVisualStyles.shouldRenderStroke,
		color = animated.strokeColor,
		transparency = animated.strokeTransparency,
		thickness = 1,
	}
	local _left_2 = "slotProps"
	local _result_32 = slotProps
	if _result_32 ~= nil then
		_result_32 = _result_32.stroke
	end
	_object_2[_left_2] = _result_32
	local _exp_3 = React.createElement("frame", {
		BackgroundColor3 = resolvedBackgroundColor,
		BackgroundTransparency = resolvedBackgroundTransparency,
		BorderSizePixel = 0,
		Position = UDim2.fromScale(0.5, 0.5),
		Size = UDim2.fromScale(1, 1),
		AnchorPoint = Vector2.new(0.5, 0.5),
		Active = false,
		Selectable = false,
		ZIndex = resolvedZIndex,
	}, _exp_1, _exp_2, renderStrokeDecorator(_object_2))
	local _result_33
	if hasCustomChildren then
		local _object_3 = {
			enabled = hasPadding,
			paddingTop = paddingTop,
			paddingRight = paddingRight,
			paddingBottom = paddingBottom,
			paddingLeft = paddingLeft,
		}
		local _left_3 = "slotProps"
		local _result_34 = slotProps
		if _result_34 ~= nil then
			_result_34 = _result_34.padding
		end
		_object_3[_left_3] = _result_34
		_result_33 = (React.createElement("frame", {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			Active = false,
			Selectable = false,
		}, renderPaddingDecorator(_object_3), React.createElement("uilistlayout", {
			FillDirection = Enum.FillDirection.Horizontal,
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
			VerticalAlignment = Enum.VerticalAlignment.Center,
			SortOrder = Enum.SortOrder.LayoutOrder,
			Padding = UDim.new(0, resolveButtonContentGap(theme, size)),
		}), customChildren, if hasVisibleLabel then (React.createElement("textlabel", {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			AutomaticSize = Enum.AutomaticSize.XY,
			Size = UDim2.fromOffset(0, 0),
			LayoutOrder = 100,
			Text = resolvedLabelText,
			TextColor3 = resolvedTextColor,
			TextTransparency = resolvedTextTransparency,
			TextStrokeColor3 = resolvedTextStrokeColor,
			TextStrokeTransparency = resolvedTextStrokeTransparency,
			TextSize = resolvedTextSize,
			Font = resolvedFont,
			FontFace = resolvedFontFace,
			LineHeight = resolvedLineHeight,
			TextWrapped = false,
			TextTruncate = Enum.TextTruncate.None,
			TextXAlignment = Enum.TextXAlignment.Left,
			TextYAlignment = Enum.TextYAlignment.Center,
			TextScaled = false,
			RichText = resolvedRichText,
			ZIndex = resolvedLabelZIndex,
		})) else nil))
	else
		local _object_3 = {
			enabled = hasPadding,
			paddingTop = paddingTop,
			paddingRight = paddingRight,
			paddingBottom = paddingBottom,
			paddingLeft = paddingLeft,
		}
		local _left_3 = "slotProps"
		local _result_34 = slotProps
		if _result_34 ~= nil then
			_result_34 = _result_34.padding
		end
		_object_3[_left_3] = _result_34
		_result_33 = (React.createElement(React.Fragment, nil, renderPaddingDecorator(_object_3), React.createElement("textlabel", {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			Text = resolvedText,
			TextColor3 = resolvedTextColor,
			TextTransparency = resolvedTextTransparency,
			TextStrokeColor3 = resolvedTextStrokeColor,
			TextStrokeTransparency = resolvedTextStrokeTransparency,
			TextSize = resolvedTextSize,
			Font = resolvedFont,
			FontFace = resolvedFontFace,
			LineHeight = resolvedLineHeight,
			TextWrapped = resolvedTextWrapped,
			TextTruncate = resolvedTextTruncate,
			TextXAlignment = resolvedTextXAlignment,
			TextYAlignment = resolvedTextYAlignment,
			TextScaled = resolvedTextScaled,
			RichText = resolvedRichText,
			ZIndex = resolvedLabelZIndex,
		})))
	end
	return React.createElement("textbutton", _attributes, _exp_3, React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Active = false,
		Selectable = false,
		ZIndex = resolvedLabelZIndex,
	}, _result_33), decoratorChildren)
end)
local Button = ButtonBase
Button.displayName = "Button"
return {
	Button = Button,
}
