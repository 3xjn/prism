-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local getLucideIconAsset = TS.import(script, script.Parent.Parent.Parent, "icons", "lucide").getLucideIconAsset
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local _frameSize = TS.import(script, script.Parent.Parent, "_shared", "frameSize")
local resolveFrameSizeProps = _frameSize.resolveFrameSizeProps
local resolveMinimumHeightConstraint = _frameSize.resolveMinimumHeightConstraint
local composeEventMaps = TS.import(script, script.Parent.Parent, "_shared", "interaction").composeEventMaps
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local useControllableState = TS.import(script, script.Parent.Parent, "_shared", "useControllableState").useControllableState
local usePressInteraction = TS.import(script, script.Parent.Parent, "_shared", "usePressInteraction").usePressInteraction
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveCheckboxMotionTransition = _styles.resolveCheckboxMotionTransition
local resolveCheckboxSizeStyles = _styles.resolveCheckboxSizeStyles
local resolveCheckboxVisualStyles = _styles.resolveCheckboxVisualStyles
local CheckboxBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local styleOverrides = _binding.styleOverrides
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
	local label = _binding.label
	local checked = _binding.checked
	local defaultChecked = _binding.defaultChecked
	local onChange = _binding.onChange
	local Event = _binding.Event
	local Change = _binding.Change
	local _object = {
		controlled = checked,
	}
	local _left = "defaultValue"
	local _condition = defaultChecked
	if _condition == nil then
		_condition = false
	end
	_object[_left] = _condition
	_object.onChange = onChange
	local _binding_1 = useControllableState(_object)
	local checkedState = _binding_1[1]
	local setCheckedState = _binding_1[2]
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
	}, props)
	local _binding_2 = useResolvedStyleProps("checkbox", mergedStyleProps)
	local resolvedWidth = _binding_2.resolvedWidth
	local resolvedHeight = _binding_2.resolvedHeight
	local resolvedSize = _binding_2.resolvedSize
	local resolvedPosition = _binding_2.resolvedPosition
	local resolvedAnchor = _binding_2.resolvedAnchor
	local resolvedConstraint = _binding_2.resolvedConstraint
	local paddingTop = _binding_2.paddingTop
	local paddingRight = _binding_2.paddingRight
	local paddingBottom = _binding_2.paddingBottom
	local paddingLeft = _binding_2.paddingLeft
	local hasPadding = _binding_2.hasPadding
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local sizeStyles = resolveCheckboxSizeStyles(theme, size)
	local computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, sizeStyles.minHeight)
	local _binding_3 = resolveFrameSizeProps(resolvedSize, resolvedWidth, resolvedHeight)
	local computedSize = _binding_3.size
	local computedAutoSize = _binding_3.automaticSize
	local toggle = function()
		setCheckedState(not checkedState)
	end
	local press = usePressInteraction({
		interactive = not disabled,
		onActivated = toggle,
	})
	local interactionState = press.state
	local styleOverrideContext = {
		theme = theme,
		color = color,
		size = size,
		state = interactionState,
		checked = checkedState,
	}
	local visualStyles = applyStyleOverride(resolveCheckboxVisualStyles(theme, color, interactionState, checkedState), styleOverrides, styleOverrideContext)
	local animated = useMotion({
		values = {
			markColor = visualStyles.markColor,
			markStrokeColor = visualStyles.markStrokeColor,
			markStrokeTransparency = visualStyles.markStrokeTransparency,
			fillColor = visualStyles.fillColor,
			fillTransparency = visualStyles.fillTransparency,
			glyphColor = visualStyles.glyphColor,
			glyphTransparency = visualStyles.glyphTransparency,
			labelColor = visualStyles.labelColor,
		},
		transition = resolveCheckboxMotionTransition(interactionState),
	})
	local _exp = composeEventMaps(press.eventMap, Event)
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result == nil then mergedStyleProps.cursor else nil, disabled)
	local _condition_1 = label ~= nil
	if not _condition_1 then
		local _result_1 = slotProps
		if _result_1 ~= nil then
			_result_1 = _result_1.label
		end
		_condition_1 = _result_1 ~= nil
	end
	local shouldRenderLabel = _condition_1
	local resolvedLabelText = if label == nil then "" else tostring(label)
	local _labelSlotProps = slotProps
	if _labelSlotProps ~= nil then
		_labelSlotProps = _labelSlotProps.label
	end
	local labelSlotProps = _labelSlotProps
	local _result_1 = labelSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Font
	end
	local _condition_2 = _result_1
	if _condition_2 == nil then
		_condition_2 = theme.fontFamily
	end
	local resolvedLabelFont = _condition_2
	local _result_2 = labelSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.Font
	end
	local _result_3 = labelSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.FontFace
	end
	local resolvedLabelFontFace = resolveTextFontFace(_result_2, _result_3, theme.fontFamily)
	local _result_4 = labelSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.TextSize
	end
	local _condition_3 = _result_4
	if _condition_3 == nil then
		_condition_3 = sizeStyles.labelSize
	end
	local resolvedLabelTextSize = _condition_3
	local _result_5 = labelSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.LineHeight
	end
	local _condition_4 = _result_5
	if _condition_4 == nil then
		_condition_4 = sizeStyles.lineHeight
	end
	local resolvedLabelLineHeight = _condition_4
	local _result_6 = rootSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.ZIndex
	end
	local _condition_5 = _result_6
	if _condition_5 == nil then
		_condition_5 = props.zIndex
	end
	local resolvedRootZIndex = _condition_5
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.mark
		if _result_7 ~= nil then
			_result_7 = _result_7.ZIndex
		end
	end
	local _condition_6 = _result_7
	if _condition_6 == nil then
		_condition_6 = resolvedRootZIndex
	end
	local resolvedMarkZIndex = _condition_6
	local _result_8 = slotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.fill
		if _result_8 ~= nil then
			_result_8 = _result_8.ZIndex
		end
	end
	local _condition_7 = _result_8
	if _condition_7 == nil then
		_condition_7 = resolvedMarkZIndex
	end
	local resolvedFillZIndex = _condition_7
	local _result_9 = slotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.glyph
		if _result_9 ~= nil then
			_result_9 = _result_9.ZIndex
		end
	end
	local _condition_8 = _result_9
	if _condition_8 == nil then
		_condition_8 = resolvedFillZIndex
	end
	local resolvedGlyphZIndex = _condition_8
	local _result_10 = labelSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.ZIndex
	end
	local _condition_9 = _result_10
	if _condition_9 == nil then
		_condition_9 = resolvedRootZIndex
	end
	local resolvedLabelZIndex = _condition_9
	local markRadius = UDim.new(0.28, 0)
	local glyphAsset = getLucideIconAsset("check", sizeStyles.glyphSize)
	local decoratorChildren = {}
	local _object_1 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_1 = "slotProps"
	local _result_11 = slotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.padding
	end
	_object_1[_left_1] = _result_11
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object_1))
	local _object_2 = {
		constraint = computedConstraint,
	}
	local _left_2 = "slotProps"
	local _result_12 = slotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.sizeConstraint
	end
	_object_2[_left_2] = _result_12
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_2))
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.listLayout
	end
	local _attributes = {
		key = "list-layout",
		FillDirection = Enum.FillDirection.Horizontal,
		Padding = UDim.new(0, if shouldRenderLabel then sizeStyles.labelGap else 0),
		SortOrder = Enum.SortOrder.LayoutOrder,
		VerticalAlignment = Enum.VerticalAlignment.Center,
		HorizontalAlignment = Enum.HorizontalAlignment.Left,
	}
	if _result_13 then
		for _k, _v in _result_13 do
			_attributes[_k] = _v
		end
	end
	local _arg0 = React.createElement("uilistlayout", _attributes)
	table.insert(decoratorChildren, _arg0)
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local textButtonInstanceProps = {
		AutoButtonColor = false,
		Active = not disabled,
		Selectable = not disabled,
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
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
	local _attributes_1 = table.clone(textButtonInstanceProps)
	setmetatable(_attributes_1, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes_1[_k] = _v
		end
	end
	_attributes_1.ref = ref
	local _exp_1 = decoratorChildren
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.mark
	end
	local _attributes_2 = {
		BackgroundColor3 = animated.markColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(sizeStyles.markWidth, sizeStyles.markHeight),
		LayoutOrder = 1,
		ZIndex = resolvedMarkZIndex,
		Active = false,
		Selectable = false,
		ClipsDescendants = true,
	}
	if _result_14 then
		for _k, _v in _result_14 do
			_attributes_2[_k] = _v
		end
	end
	local _object_3 = {
		radius = markRadius,
	}
	local _left_3 = "slotProps"
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.markCorner
	end
	_object_3[_left_3] = _result_15
	local _exp_2 = renderCornerDecorator(_object_3)
	local _object_4 = {
		enabled = true,
		color = animated.markStrokeColor,
		transparency = animated.markStrokeTransparency,
		thickness = 1,
	}
	local _left_4 = "slotProps"
	local _result_16 = slotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.markStroke
	end
	_object_4[_left_4] = _result_16
	local _exp_3 = renderStrokeDecorator(_object_4)
	local _result_17 = slotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.fill
	end
	local _attributes_3 = {
		BackgroundColor3 = animated.fillColor,
		BackgroundTransparency = animated.fillTransparency,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
		ZIndex = resolvedFillZIndex,
		Active = false,
		Selectable = false,
	}
	if _result_17 then
		for _k, _v in _result_17 do
			_attributes_3[_k] = _v
		end
	end
	local _object_5 = {
		radius = markRadius,
	}
	local _left_5 = "slotProps"
	local _result_18 = slotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.fillCorner
	end
	_object_5[_left_5] = _result_18
	local _exp_4 = React.createElement("frame", _attributes_3, renderCornerDecorator(_object_5))
	local _attributes_4 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(sizeStyles.glyphSize, sizeStyles.glyphSize),
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
		ZIndex = resolvedGlyphZIndex,
		Active = false,
		Selectable = false,
		BackgroundColor3 = theme.colors.background.surface,
	}
	local _result_19 = glyphAsset
	if _result_19 ~= nil then
		_result_19 = _result_19.Url
	end
	_attributes_4.Image = _result_19
	local _result_20 = glyphAsset
	if _result_20 ~= nil then
		_result_20 = _result_20.ImageRectSize
	end
	_attributes_4.ImageRectSize = _result_20
	local _result_21 = glyphAsset
	if _result_21 ~= nil then
		_result_21 = _result_21.ImageRectOffset
	end
	_attributes_4.ImageRectOffset = _result_21
	_attributes_4.ImageColor3 = animated.glyphColor
	_attributes_4.ImageTransparency = if glyphAsset ~= nil then animated.glyphTransparency else 1
	_attributes_4.ScaleType = Enum.ScaleType.Fit
	local _result_22 = slotProps
	if _result_22 ~= nil then
		_result_22 = _result_22.glyph
	end
	if _result_22 then
		for _k, _v in _result_22 do
			_attributes_4[_k] = _v
		end
	end
	local _exp_5 = React.createElement("frame", _attributes_2, _exp_2, _exp_3, _exp_4, React.createElement("imagelabel", _attributes_4))
	local _result_23
	if shouldRenderLabel then
		local _attributes_5 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			AutomaticSize = Enum.AutomaticSize.X,
			Size = UDim2.fromOffset(0, sizeStyles.markHeight),
			LayoutOrder = 2,
			Text = resolvedLabelText,
			TextColor3 = animated.labelColor,
			TextTransparency = 0,
			TextStrokeTransparency = 1,
			TextSize = resolvedLabelTextSize,
			Font = resolvedLabelFont,
			FontFace = resolvedLabelFontFace,
			LineHeight = resolvedLabelLineHeight,
		}
		local _result_24 = labelSlotProps
		if _result_24 ~= nil then
			_result_24 = _result_24.TextWrapped
		end
		local _condition_10 = _result_24
		if _condition_10 == nil then
			_condition_10 = false
		end
		_attributes_5.TextWrapped = _condition_10
		local _result_25 = labelSlotProps
		if _result_25 ~= nil then
			_result_25 = _result_25.TextTruncate
		end
		local _condition_11 = _result_25
		if _condition_11 == nil then
			_condition_11 = Enum.TextTruncate.AtEnd
		end
		_attributes_5.TextTruncate = _condition_11
		local _result_26 = labelSlotProps
		if _result_26 ~= nil then
			_result_26 = _result_26.TextXAlignment
		end
		local _condition_12 = _result_26
		if _condition_12 == nil then
			_condition_12 = Enum.TextXAlignment.Left
		end
		_attributes_5.TextXAlignment = _condition_12
		local _result_27 = labelSlotProps
		if _result_27 ~= nil then
			_result_27 = _result_27.TextYAlignment
		end
		local _condition_13 = _result_27
		if _condition_13 == nil then
			_condition_13 = Enum.TextYAlignment.Center
		end
		_attributes_5.TextYAlignment = _condition_13
		local _result_28 = labelSlotProps
		if _result_28 ~= nil then
			_result_28 = _result_28.TextScaled
		end
		local _condition_14 = _result_28
		if _condition_14 == nil then
			_condition_14 = false
		end
		_attributes_5.TextScaled = _condition_14
		local _result_29 = labelSlotProps
		if _result_29 ~= nil then
			_result_29 = _result_29.RichText
		end
		local _condition_15 = _result_29
		if _condition_15 == nil then
			_condition_15 = false
		end
		_attributes_5.RichText = _condition_15
		_attributes_5.ZIndex = resolvedLabelZIndex
		if labelSlotProps then
			for _k, _v in labelSlotProps do
				_attributes_5[_k] = _v
			end
		end
		_result_23 = (React.createElement("textlabel", _attributes_5))
	else
		_result_23 = nil
	end
	return React.createElement("textbutton", _attributes_1, _exp_1, _exp_5, _result_23)
end)
local Checkbox = CheckboxBase
Checkbox.displayName = "Checkbox"
return {
	Checkbox = Checkbox,
}
