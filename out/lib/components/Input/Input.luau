-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local useTheme = _theme.useTheme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local resolveMinimumHeightConstraint = TS.import(script, script.Parent.Parent, "_shared", "frameSize").resolveMinimumHeightConstraint
local composeEventMaps = TS.import(script, script.Parent.Parent, "_shared", "interaction").composeEventMaps
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveInputMotionTransition = _styles.resolveInputMotionTransition
local resolveInputVisualStyles = _styles.resolveInputVisualStyles
local function resolveInputRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "input", "sm", "radius", theme.radius.sm))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "input", "lg", "radius", theme.radius.lg))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "input", "md", "radius", theme.radius.md))
	until true
end
local function resolveInputSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				paddingX = "sm",
				paddingY = "xs",
				fontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				radius = resolveInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.xs),
				defaultWidth = theme.spacing.xl * 7,
			}
		end
		if size == "sm" then
			return {
				paddingX = "md",
				paddingY = "xs",
				fontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				radius = resolveInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.sm),
				defaultWidth = theme.spacing.xl * 8,
			}
		end
		if size == "lg" then
			return {
				paddingX = "lg",
				paddingY = "sm",
				fontSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				radius = resolveInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.lg),
				defaultWidth = theme.spacing.xl * 11,
			}
		end
		if size == "xl" then
			return {
				paddingX = "xl",
				paddingY = "md",
				fontSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				radius = resolveInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl * 2),
				defaultWidth = theme.spacing.xl * 13,
			}
		end
		if size == "md" then
		end
		return {
			paddingX = "md",
			paddingY = "sm",
			fontSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			radius = resolveInputRadius(theme, size),
			minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.md),
			defaultWidth = theme.spacing.xl * 10,
		}
	until true
end
local function resolveInputMaxLength(maxLength)
	return if maxLength ~= nil and maxLength == maxLength and maxLength > -math.huge and maxLength < math.huge then math.max(0, math.floor(maxLength)) else nil
end
local function clampInputText(value, maxLength)
	return if maxLength ~= nil and #value > maxLength then string.sub(value, 1, maxLength) else value
end
local InputBase = React.forwardRef(function(props, ref)
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
	local readOnly = _binding.readOnly
	if readOnly == nil then
		readOnly = false
	end
	local fullWidth = _binding.fullWidth
	if fullWidth == nil then
		fullWidth = false
	end
	local styleOverrides = _binding.styleOverrides
	local placeholder = _binding.placeholder
	local maxLength = _binding.maxLength
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	local onChange = _binding.onChange
	local Event = _binding.Event
	local Change = _binding.Change
	local resolvedMaxLength = resolveInputMaxLength(maxLength)
	local _condition = value
	if _condition == nil then
		_condition = defaultValue
		if _condition == nil then
			_condition = ""
		end
	end
	local initialUncontrolledValue = clampInputText(_condition, resolvedMaxLength)
	local hovered, setHovered = React.useState(false)
	local focused, setFocused = React.useState(false)
	local uncontrolledValue, setUncontrolledValue = React.useState(initialUncontrolledValue)
	local sizeStyles = resolveInputSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		px = sizeStyles.paddingX,
		py = sizeStyles.paddingY,
	}, props)
	local _binding_1 = useResolvedStyleProps("input", mergedStyleProps)
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
			setUncontrolledValue(clampInputText(value, resolvedMaxLength))
		end
	end, { value, resolvedMaxLength })
	React.useEffect(function()
		if not disabled then
			return nil
		end
		setHovered(false)
		setFocused(false)
	end, { disabled })
	local computedWidth = if fullWidth then resolveUDimSafe("input", "100%", "width") else (resolvedWidth or UDim.new(0, sizeStyles.defaultWidth))
	local computedHeight = resolvedHeight or UDim.new(0, sizeStyles.minHeight)
	local computedSize = resolvedSize or UDim2.new(computedWidth, computedHeight)
	local computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, sizeStyles.minHeight)
	local interactionState = if disabled then "disabled" elseif focused then "focused" elseif hovered then "hovered" else "idle"
	local styleOverrideContext = {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		readOnly = readOnly,
		state = interactionState,
	}
	local resolvedVisualStyles = applyStyleOverride(resolveInputVisualStyles(theme, variant, color, interactionState, readOnly), styleOverrides, styleOverrideContext)
	local motionTransition = resolveInputMotionTransition(interactionState)
	local animated = useMotion({
		values = {
			backgroundColor = resolvedVisualStyles.backgroundColor,
			strokeColor = resolvedVisualStyles.strokeColor,
			strokeTransparency = resolvedVisualStyles.strokeTransparency,
			strokeThickness = resolvedVisualStyles.strokeThickness,
			textColor = resolvedVisualStyles.textColor,
			placeholderColor = resolvedVisualStyles.placeholderColor,
		},
		transition = motionTransition,
	})
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _textboxSlotProps = slotProps
	if _textboxSlotProps ~= nil then
		_textboxSlotProps = _textboxSlotProps.textbox
	end
	local textboxSlotProps = _textboxSlotProps
	local _result = textboxSlotProps
	if _result ~= nil then
		_result = _result.Font
	end
	local _condition_1 = _result
	if _condition_1 == nil then
		_condition_1 = theme.fontFamily
	end
	local resolvedFont = _condition_1
	local _result_1 = textboxSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Font
	end
	local _result_2 = textboxSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.FontFace
	end
	local resolvedFontFace = resolveTextFontFace(_result_1, _result_2, theme.fontFamily)
	local _result_3 = textboxSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.TextSize
	end
	local _condition_2 = _result_3
	if _condition_2 == nil then
		_condition_2 = sizeStyles.fontSize
	end
	local resolvedTextSize = _condition_2
	local _result_4 = textboxSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.LineHeight
	end
	local _condition_3 = _result_4
	if _condition_3 == nil then
		_condition_3 = sizeStyles.lineHeight
	end
	local resolvedLineHeight = _condition_3
	local _result_5 = textboxSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.Text
	end
	local _condition_4 = _result_5
	if _condition_4 == nil then
		local _condition_5 = value
		if _condition_5 == nil then
			_condition_5 = uncontrolledValue
		end
		_condition_4 = clampInputText(_condition_5, resolvedMaxLength)
	end
	local resolvedTextValue = _condition_4
	local reportedValueRef = React.useRef(resolvedTextValue)
	React.useEffect(function()
		reportedValueRef.current = resolvedTextValue
	end, { resolvedTextValue })
	local _result_6 = textboxSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.TextXAlignment
	end
	local _condition_5 = _result_6
	if _condition_5 == nil then
		_condition_5 = Enum.TextXAlignment.Left
	end
	local resolvedTextXAlignment = _condition_5
	local _result_7 = textboxSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.TextYAlignment
	end
	local _condition_6 = _result_7
	if _condition_6 == nil then
		_condition_6 = Enum.TextYAlignment.Center
	end
	local resolvedTextYAlignment = _condition_6
	local _result_8 = textboxSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.TextTruncate
	end
	local _condition_7 = _result_8
	if _condition_7 == nil then
		_condition_7 = Enum.TextTruncate.AtEnd
	end
	local resolvedTextTruncate = _condition_7
	local _result_9 = rootSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.ZIndex
	end
	local _condition_8 = _result_9
	if _condition_8 == nil then
		_condition_8 = props.zIndex
	end
	local resolvedRootZIndex = _condition_8
	local _result_10 = textboxSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.ZIndex
	end
	local _condition_9 = _result_10
	if _condition_9 == nil then
		_condition_9 = resolvedRootZIndex
	end
	local resolvedTextboxZIndex = _condition_9
	local _result_11 = rootSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.Event
	end
	local rootEvent = useRootCursorEvent(nil, if _result_11 == nil then props.cursor else nil, disabled)
	local internalEvent = {
		MouseEnter = function()
			if disabled then
				return nil
			end
			setHovered(true)
		end,
		MouseLeave = function()
			setHovered(false)
		end,
		Focused = function()
			if disabled then
				return nil
			end
			setFocused(true)
		end,
		FocusLost = function()
			setFocused(false)
		end,
	}
	local internalChange = {
		Text = function(textbox)
			local nextValue = clampInputText(textbox.Text, resolvedMaxLength)
			if textbox.Text ~= nextValue then
				textbox.Text = nextValue
			end
			if reportedValueRef.current == nextValue then
				return nil
			end
			reportedValueRef.current = nextValue
			setUncontrolledValue(nextValue)
			local _result_12 = onChange
			if _result_12 ~= nil then
				_result_12(nextValue)
			end
		end,
	}
	local decoratorChildren = {}
	local _object = {
		radius = sizeStyles.radius,
	}
	local _left = "slotProps"
	local _result_12 = slotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.corner
	end
	_object[_left] = _result_12
	pushDecorator(decoratorChildren, renderCornerDecorator(_object))
	local _object_1 = {
		enabled = true,
		color = animated.strokeColor,
		transparency = animated.strokeTransparency,
		thickness = animated.strokeThickness,
	}
	local _left_1 = "slotProps"
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.stroke
	end
	_object_1[_left_1] = _result_13
	pushDecorator(decoratorChildren, renderStrokeDecorator(_object_1))
	local _object_2 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_2 = "slotProps"
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.padding
	end
	_object_2[_left_2] = _result_14
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object_2))
	local _object_3 = {
		constraint = computedConstraint,
	}
	local _left_3 = "slotProps"
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.sizeConstraint
	end
	_object_3[_left_3] = _result_15
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_3))
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local rootInstanceProps = {
		BorderSizePixel = 0,
		BackgroundColor3 = animated.backgroundColor,
		BackgroundTransparency = 0,
		Size = computedSize,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
		Event = rootEvent,
	}
	local _object_4 = {
		Active = not disabled,
		Selectable = not disabled,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Position = UDim2.fromScale(0, 0),
		Text = resolvedTextValue,
	}
	local _left_4 = "PlaceholderText"
	local _condition_10 = placeholder
	if _condition_10 == nil then
		_condition_10 = ""
	end
	_object_4[_left_4] = _condition_10
	_object_4.PlaceholderColor3 = animated.placeholderColor
	_object_4.TextColor3 = animated.textColor
	_object_4.TextTransparency = 0
	_object_4.TextStrokeTransparency = 1
	_object_4.TextSize = resolvedTextSize
	_object_4.Font = resolvedFont
	_object_4.FontFace = resolvedFontFace
	_object_4.LineHeight = resolvedLineHeight
	_object_4.TextEditable = not disabled and not readOnly
	_object_4.ClearTextOnFocus = false
	_object_4.MultiLine = false
	_object_4.TextWrapped = false
	_object_4.TextTruncate = resolvedTextTruncate
	_object_4.TextXAlignment = resolvedTextXAlignment
	_object_4.TextYAlignment = resolvedTextYAlignment
	_object_4.RichText = false
	_object_4.ZIndex = resolvedTextboxZIndex
	_object_4.Event = composeEventMaps(internalEvent, Event)
	_object_4.Change = composeEventMaps(internalChange, Change)
	local textboxInstanceProps = _object_4
	local _attributes = table.clone(rootInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	local _exp = decoratorChildren
	local _attributes_1 = table.clone(textboxInstanceProps)
	setmetatable(_attributes_1, nil)
	if textboxSlotProps then
		for _k, _v in textboxSlotProps do
			_attributes_1[_k] = _v
		end
	end
	_attributes_1.ref = ref
	return React.createElement("frame", _attributes, _exp, React.createElement("textbox", _attributes_1))
end)
local Input = InputBase
Input.displayName = "Input"
return {
	Input = Input,
}
