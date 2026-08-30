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
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local _styles = TS.import(script, script.Parent, "styles")
local resolveProgressMotionTransition = _styles.resolveProgressMotionTransition
local resolveProgressRadius = _styles.resolveProgressRadius
local resolveProgressSizeStyles = _styles.resolveProgressSizeStyles
local resolveProgressVisualStyles = _styles.resolveProgressVisualStyles
local _utils = TS.import(script, script.Parent, "utils")
local resolveProgressPercent = _utils.resolveProgressPercent
local resolveProgressRange = _utils.resolveProgressRange
local resolveProgressValue = _utils.resolveProgressValue
local function formatDefaultProgressValue(value, percent)
	return `{math.floor(percent * 100 + 0.5)}%`
end
local ProgressBase = React.forwardRef(function(props, ref)
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
	local radius = _binding.radius
	local fullWidth = _binding.fullWidth
	if fullWidth == nil then
		fullWidth = false
	end
	local label = _binding.label
	local showValue = _binding.showValue
	if showValue == nil then
		showValue = false
	end
	local value = _binding.value
	local min = _binding.min
	local max = _binding.max
	local formatValue = _binding.formatValue
	local styleOverrides = _binding.styleOverrides
	local Event = _binding.Event
	local Change = _binding.Change
	local sizeStyles = resolveProgressSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({}, props)
	local _binding_1 = useResolvedStyleProps("progress", mergedStyleProps)
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
	local styleOverrideContext = {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
	}
	local visualStyles = applyStyleOverride(resolveProgressVisualStyles(theme, variant, color), styleOverrides, styleOverrideContext)
	local range = resolveProgressRange(min, max)
	local resolvedValue = resolveProgressValue(value, range)
	local percent = resolveProgressPercent(resolvedValue, range)
	local animated = useMotion({
		values = {
			percent = percent,
		},
		transition = resolveProgressMotionTransition(),
	})
	local percentText = (formatValue or formatDefaultProgressValue)(resolvedValue, percent)
	local shouldRenderLabel = label ~= nil or labelSlotProps ~= nil
	local shouldRenderValueLabel = showValue or valueLabelSlotProps ~= nil
	local _condition = shouldRenderLabel or shouldRenderValueLabel
	if not _condition then
		local _result = slotProps
		if _result ~= nil then
			_result = _result.header
		end
		_condition = _result ~= nil
	end
	local shouldRenderHeader = _condition
	local headerHeight = if shouldRenderHeader then math.ceil(sizeStyles.labelSize * sizeStyles.labelLineHeight) else 0
	local headerGap = if shouldRenderHeader then sizeStyles.labelGap else 0
	local minimumHeight = sizeStyles.trackHeight + headerHeight + headerGap
	local _result
	if fullWidth then
		_result = resolveUDimSafe("progress", "100%", "width")
	else
		local _result_1 = resolvedSize
		if _result_1 ~= nil then
			_result_1 = _result_1.X
		end
		local _condition_1 = _result_1
		if _condition_1 == nil then
			_condition_1 = resolvedWidth or UDim.new(0, sizeStyles.defaultWidth)
		end
		_result = _condition_1
	end
	local computedWidth = _result
	local _result_1 = resolvedSize
	if _result_1 ~= nil then
		_result_1 = _result_1.Y
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = resolvedHeight or UDim.new(0, minimumHeight)
	end
	local computedHeight = _condition_1
	local computedSize = UDim2.new(computedWidth, computedHeight)
	local computedConstraint = if resolvedConstraint == nil then {
		min = Vector2.new(0, minimumHeight),
		max = nil,
	} else {
		min = if resolvedConstraint.min == nil then Vector2.new(0, minimumHeight) else Vector2.new(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, minimumHeight)),
		max = resolvedConstraint.max,
	}
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _result_2 = rootSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.ZIndex
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = props.zIndex
	end
	local resolvedRootZIndex = _condition_2
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.header
		if _result_3 ~= nil then
			_result_3 = _result_3.ZIndex
		end
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = resolvedRootZIndex
	end
	local resolvedHeaderZIndex = _condition_3
	local _result_4 = labelSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.ZIndex
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = resolvedHeaderZIndex
	end
	local resolvedLabelZIndex = _condition_4
	local _result_5 = valueLabelSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.ZIndex
	end
	local _condition_5 = _result_5
	if _condition_5 == nil then
		_condition_5 = resolvedHeaderZIndex
	end
	local resolvedValueLabelZIndex = _condition_5
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.track
		if _result_6 ~= nil then
			_result_6 = _result_6.ZIndex
		end
	end
	local _condition_6 = _result_6
	if _condition_6 == nil then
		_condition_6 = resolvedRootZIndex
	end
	local resolvedTrackZIndex = _condition_6
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.fill
		if _result_7 ~= nil then
			_result_7 = _result_7.ZIndex
		end
	end
	local _condition_7 = _result_7
	if _condition_7 == nil then
		_condition_7 = resolvedTrackZIndex
	end
	local resolvedFillZIndex = _condition_7
	local _result_8 = labelSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.Font
	end
	local _condition_8 = _result_8
	if _condition_8 == nil then
		_condition_8 = theme.fontFamily
	end
	local labelFont = _condition_8
	local _result_9 = labelSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.Font
	end
	local _result_10 = labelSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.FontFace
	end
	local labelFontFace = resolveTextFontFace(_result_9, _result_10, theme.fontFamily)
	local _result_11 = valueLabelSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.Font
	end
	local _condition_9 = _result_11
	if _condition_9 == nil then
		_condition_9 = theme.fontFamily
	end
	local valueLabelFont = _condition_9
	local _result_12 = valueLabelSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.Font
	end
	local _result_13 = valueLabelSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.FontFace
	end
	local valueLabelFontFace = resolveTextFontFace(_result_12, _result_13, theme.fontFamily)
	local trackRadius = resolveProgressRadius(theme, size, radius)
	local decoratorChildren = {}
	local _object = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left = "slotProps"
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.padding
	end
	_object[_left] = _result_14
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object))
	local _object_1 = {
		constraint = computedConstraint,
	}
	local _left_1 = "slotProps"
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.sizeConstraint
	end
	_object_1[_left_1] = _result_15
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_1))
	local _attributes = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		BackgroundColor3 = theme.colors.background.default,
		Size = computedSize,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
		Event = Event,
		Change = Change,
	}
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	local _exp = decoratorChildren
	local _result_16
	if shouldRenderHeader then
		local _result_17 = slotProps
		if _result_17 ~= nil then
			_result_17 = _result_17.header
		end
		local _attributes_1 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.new(1, 0, 0, headerHeight),
			Position = UDim2.fromOffset(0, 0),
			ZIndex = resolvedHeaderZIndex,
			Active = false,
			Selectable = false,
		}
		if _result_17 then
			for _k, _v in _result_17 do
				_attributes_1[_k] = _v
			end
		end
		local _result_18
		if shouldRenderLabel then
			local _attributes_2 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.new(0.5, 0, 1, 0),
				Position = UDim2.fromOffset(0, 0),
			}
			local _result_19 = labelSlotProps
			if _result_19 ~= nil then
				_result_19 = _result_19.Text
			end
			local _condition_10 = _result_19
			if _condition_10 == nil then
				_condition_10 = (if label == nil then "" else tostring(label))
			end
			_attributes_2.Text = _condition_10
			local _result_20 = labelSlotProps
			if _result_20 ~= nil then
				_result_20 = _result_20.TextColor3
			end
			local _condition_11 = _result_20
			if _condition_11 == nil then
				_condition_11 = visualStyles.labelColor
			end
			_attributes_2.TextColor3 = _condition_11
			local _result_21 = labelSlotProps
			if _result_21 ~= nil then
				_result_21 = _result_21.TextTransparency
			end
			local _condition_12 = _result_21
			if _condition_12 == nil then
				_condition_12 = 0
			end
			_attributes_2.TextTransparency = _condition_12
			local _result_22 = labelSlotProps
			if _result_22 ~= nil then
				_result_22 = _result_22.TextStrokeTransparency
			end
			local _condition_13 = _result_22
			if _condition_13 == nil then
				_condition_13 = 1
			end
			_attributes_2.TextStrokeTransparency = _condition_13
			local _result_23 = labelSlotProps
			if _result_23 ~= nil then
				_result_23 = _result_23.TextSize
			end
			local _condition_14 = _result_23
			if _condition_14 == nil then
				_condition_14 = sizeStyles.labelSize
			end
			_attributes_2.TextSize = _condition_14
			_attributes_2.Font = labelFont
			_attributes_2.FontFace = labelFontFace
			local _result_24 = labelSlotProps
			if _result_24 ~= nil then
				_result_24 = _result_24.LineHeight
			end
			local _condition_15 = _result_24
			if _condition_15 == nil then
				_condition_15 = sizeStyles.labelLineHeight
			end
			_attributes_2.LineHeight = _condition_15
			local _result_25 = labelSlotProps
			if _result_25 ~= nil then
				_result_25 = _result_25.TextWrapped
			end
			local _condition_16 = _result_25
			if _condition_16 == nil then
				_condition_16 = false
			end
			_attributes_2.TextWrapped = _condition_16
			local _result_26 = labelSlotProps
			if _result_26 ~= nil then
				_result_26 = _result_26.TextTruncate
			end
			local _condition_17 = _result_26
			if _condition_17 == nil then
				_condition_17 = Enum.TextTruncate.AtEnd
			end
			_attributes_2.TextTruncate = _condition_17
			local _result_27 = labelSlotProps
			if _result_27 ~= nil then
				_result_27 = _result_27.TextXAlignment
			end
			local _condition_18 = _result_27
			if _condition_18 == nil then
				_condition_18 = Enum.TextXAlignment.Left
			end
			_attributes_2.TextXAlignment = _condition_18
			local _result_28 = labelSlotProps
			if _result_28 ~= nil then
				_result_28 = _result_28.TextYAlignment
			end
			local _condition_19 = _result_28
			if _condition_19 == nil then
				_condition_19 = Enum.TextYAlignment.Center
			end
			_attributes_2.TextYAlignment = _condition_19
			local _result_29 = labelSlotProps
			if _result_29 ~= nil then
				_result_29 = _result_29.TextScaled
			end
			local _condition_20 = _result_29
			if _condition_20 == nil then
				_condition_20 = false
			end
			_attributes_2.TextScaled = _condition_20
			local _result_30 = labelSlotProps
			if _result_30 ~= nil then
				_result_30 = _result_30.RichText
			end
			local _condition_21 = _result_30
			if _condition_21 == nil then
				_condition_21 = false
			end
			_attributes_2.RichText = _condition_21
			_attributes_2.ZIndex = resolvedLabelZIndex
			if labelSlotProps then
				for _k, _v in labelSlotProps do
					_attributes_2[_k] = _v
				end
			end
			_result_18 = (React.createElement("textlabel", _attributes_2))
		else
			_result_18 = nil
		end
		local _result_19
		if shouldRenderValueLabel then
			local _attributes_2 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.new(0.5, 0, 1, 0),
				Position = UDim2.fromScale(0.5, 0),
			}
			local _result_20 = valueLabelSlotProps
			if _result_20 ~= nil then
				_result_20 = _result_20.Text
			end
			local _condition_10 = _result_20
			if _condition_10 == nil then
				_condition_10 = percentText
			end
			_attributes_2.Text = _condition_10
			local _result_21 = valueLabelSlotProps
			if _result_21 ~= nil then
				_result_21 = _result_21.TextColor3
			end
			local _condition_11 = _result_21
			if _condition_11 == nil then
				_condition_11 = visualStyles.valueLabelColor
			end
			_attributes_2.TextColor3 = _condition_11
			local _result_22 = valueLabelSlotProps
			if _result_22 ~= nil then
				_result_22 = _result_22.TextTransparency
			end
			local _condition_12 = _result_22
			if _condition_12 == nil then
				_condition_12 = 0
			end
			_attributes_2.TextTransparency = _condition_12
			local _result_23 = valueLabelSlotProps
			if _result_23 ~= nil then
				_result_23 = _result_23.TextStrokeTransparency
			end
			local _condition_13 = _result_23
			if _condition_13 == nil then
				_condition_13 = 1
			end
			_attributes_2.TextStrokeTransparency = _condition_13
			local _result_24 = valueLabelSlotProps
			if _result_24 ~= nil then
				_result_24 = _result_24.TextSize
			end
			local _condition_14 = _result_24
			if _condition_14 == nil then
				_condition_14 = sizeStyles.labelSize
			end
			_attributes_2.TextSize = _condition_14
			_attributes_2.Font = valueLabelFont
			_attributes_2.FontFace = valueLabelFontFace
			local _result_25 = valueLabelSlotProps
			if _result_25 ~= nil then
				_result_25 = _result_25.LineHeight
			end
			local _condition_15 = _result_25
			if _condition_15 == nil then
				_condition_15 = sizeStyles.labelLineHeight
			end
			_attributes_2.LineHeight = _condition_15
			local _result_26 = valueLabelSlotProps
			if _result_26 ~= nil then
				_result_26 = _result_26.TextWrapped
			end
			local _condition_16 = _result_26
			if _condition_16 == nil then
				_condition_16 = false
			end
			_attributes_2.TextWrapped = _condition_16
			local _result_27 = valueLabelSlotProps
			if _result_27 ~= nil then
				_result_27 = _result_27.TextTruncate
			end
			local _condition_17 = _result_27
			if _condition_17 == nil then
				_condition_17 = Enum.TextTruncate.AtEnd
			end
			_attributes_2.TextTruncate = _condition_17
			local _result_28 = valueLabelSlotProps
			if _result_28 ~= nil then
				_result_28 = _result_28.TextXAlignment
			end
			local _condition_18 = _result_28
			if _condition_18 == nil then
				_condition_18 = Enum.TextXAlignment.Right
			end
			_attributes_2.TextXAlignment = _condition_18
			local _result_29 = valueLabelSlotProps
			if _result_29 ~= nil then
				_result_29 = _result_29.TextYAlignment
			end
			local _condition_19 = _result_29
			if _condition_19 == nil then
				_condition_19 = Enum.TextYAlignment.Center
			end
			_attributes_2.TextYAlignment = _condition_19
			local _result_30 = valueLabelSlotProps
			if _result_30 ~= nil then
				_result_30 = _result_30.TextScaled
			end
			local _condition_20 = _result_30
			if _condition_20 == nil then
				_condition_20 = false
			end
			_attributes_2.TextScaled = _condition_20
			local _result_31 = valueLabelSlotProps
			if _result_31 ~= nil then
				_result_31 = _result_31.RichText
			end
			local _condition_21 = _result_31
			if _condition_21 == nil then
				_condition_21 = false
			end
			_attributes_2.RichText = _condition_21
			_attributes_2.ZIndex = resolvedValueLabelZIndex
			if valueLabelSlotProps then
				for _k, _v in valueLabelSlotProps do
					_attributes_2[_k] = _v
				end
			end
			_result_19 = (React.createElement("textlabel", _attributes_2))
		else
			_result_19 = nil
		end
		_result_16 = (React.createElement("frame", _attributes_1, _result_18, _result_19))
	else
		_result_16 = nil
	end
	local _result_17 = slotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.track
	end
	local _attributes_1 = {
		BackgroundColor3 = visualStyles.trackColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 0, sizeStyles.trackHeight),
		Position = UDim2.new(0, 0, 0, headerHeight + headerGap),
		ZIndex = resolvedTrackZIndex,
		Active = false,
		Selectable = false,
		ClipsDescendants = true,
	}
	if _result_17 then
		for _k, _v in _result_17 do
			_attributes_1[_k] = _v
		end
	end
	local _object_2 = {
		radius = trackRadius,
	}
	local _left_2 = "slotProps"
	local _result_18 = slotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.trackCorner
	end
	_object_2[_left_2] = _result_18
	local _exp_1 = renderCornerDecorator(_object_2)
	local _object_3 = {
		enabled = true,
		color = visualStyles.trackStrokeColor,
		transparency = visualStyles.trackStrokeTransparency,
		thickness = 1,
	}
	local _left_3 = "slotProps"
	local _result_19 = slotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.trackStroke
	end
	_object_3[_left_3] = _result_19
	local _exp_2 = renderStrokeDecorator(_object_3)
	local _result_20 = slotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.fill
	end
	local _attributes_2 = {
		BackgroundColor3 = visualStyles.fillColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Size = UDim2.new(animated.percent, 0, 1, 0),
		ZIndex = resolvedFillZIndex,
		Active = false,
		Selectable = false,
	}
	if _result_20 then
		for _k, _v in _result_20 do
			_attributes_2[_k] = _v
		end
	end
	local _object_4 = {
		radius = trackRadius,
	}
	local _left_4 = "slotProps"
	local _result_21 = slotProps
	if _result_21 ~= nil then
		_result_21 = _result_21.fillCorner
	end
	_object_4[_left_4] = _result_21
	return React.createElement("frame", _attributes, _exp, _result_16, React.createElement("frame", _attributes_1, _exp_1, _exp_2, React.createElement("frame", _attributes_2, renderCornerDecorator(_object_4))))
end)
local Progress = ProgressBase
Progress.displayName = "Progress"
return {
	Progress = Progress,
}
