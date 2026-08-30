-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderAspectRatioDecorator = _foundationDecorators.renderAspectRatioDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local _styles = TS.import(script, script.Parent, "styles")
local resolveCircularProgressMotionTransition = _styles.resolveCircularProgressMotionTransition
local resolveCircularProgressSizeStyles = _styles.resolveCircularProgressSizeStyles
local resolveCircularProgressVisualStyles = _styles.resolveCircularProgressVisualStyles
local RunService = game:GetService("RunService")
local SEGMENT_COUNT = 36
local INDETERMINATE_ROTATION_SECONDS = 0.9
local INDETERMINATE_VISIBLE_SEGMENTS = 9
local function createSegmentIndices()
	local indices = {}
	for index = 0, SEGMENT_COUNT - 1 do
		local _index = index
		table.insert(indices, _index)
	end
	return indices
end
local SEGMENT_INDICES = createSegmentIndices()
local function resolveCircularProgressRange(min, max)
	local _condition = min
	if _condition == nil then
		_condition = 0
	end
	local resolvedMin = _condition
	local _condition_1 = max
	if _condition_1 == nil then
		_condition_1 = 100
	end
	local requestedMax = _condition_1
	local resolvedMax = if requestedMax > resolvedMin then requestedMax else resolvedMin + 1
	return {
		min = resolvedMin,
		max = resolvedMax,
	}
end
local function resolveCircularProgressValue(value, range)
	local _condition = value
	if _condition == nil then
		_condition = range.min
	end
	return math.clamp(_condition, range.min, range.max)
end
local function resolveCircularProgressPercent(value, range)
	return (value - range.min) / (range.max - range.min)
end
local function formatDefaultCircularProgressValue(value, percent)
	return `{math.floor(percent * 100 + 0.5)}%`
end
local function resolveVisibleSegmentCount(percent)
	if percent <= 0 then
		return 0
	end
	return math.clamp(math.ceil(percent * SEGMENT_COUNT), 1, SEGMENT_COUNT)
end
local function resolveMode(mode, value)
	return mode or (if value == nil then "indeterminate" else "determinate")
end
local function useIndeterminateRotation(enabled)
	local rotation, setRotation = React.useState(0)
	React.useEffect(function()
		if not enabled then
			setRotation(0)
			return nil
		end
		local angle = 0
		local connection = RunService.Heartbeat:Connect(function(deltaTime)
			angle += (deltaTime * 360) / INDETERMINATE_ROTATION_SECONDS
			setRotation(angle)
		end)
		return function()
			connection:Disconnect()
		end
	end, { enabled })
	return rotation
end
local function isSegmentVisible(index, visibleCount)
	return index < visibleCount
end
local CircularProgressBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local mode = _binding.mode
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
	local cap = _binding.cap
	if cap == nil then
		cap = "round"
	end
	local label = _binding.label
	local showValue = _binding.showValue
	if showValue == nil then
		showValue = false
	end
	local startAngle = _binding.startAngle
	if startAngle == nil then
		startAngle = -90
	end
	local disableAnimation = _binding.disableAnimation
	if disableAnimation == nil then
		disableAnimation = false
	end
	local styleOverrides = _binding.styleOverrides
	local value = _binding.value
	local min = _binding.min
	local max = _binding.max
	local formatValue = _binding.formatValue
	local Event = _binding.Event
	local Change = _binding.Change
	local resolvedMode = resolveMode(mode, value)
	local indeterminateRotation = useIndeterminateRotation(resolvedMode == "indeterminate" and not disableAnimation)
	local sizeStyles = resolveCircularProgressSizeStyles(theme, size)
	local styleOverrideContext = {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
	}
	local visualStyles = applyStyleOverride(resolveCircularProgressVisualStyles(theme, variant, color), styleOverrides, styleOverrideContext)
	local mergedStyleProps = mergeSharedStyleProps({}, props)
	local _binding_1 = useResolvedStyleProps("circular-progress", mergedStyleProps)
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
	local range = resolveCircularProgressRange(min, max)
	local resolvedValue = resolveCircularProgressValue(value, range)
	local percent = resolveCircularProgressPercent(resolvedValue, range)
	local animated = useMotion({
		values = {
			percent = percent,
		},
		transition = resolveCircularProgressMotionTransition(),
	})
	local determinatePercent = if disableAnimation then percent else animated.percent
	local visibleSegmentCount = if resolvedMode == "determinate" then resolveVisibleSegmentCount(determinatePercent) else INDETERMINATE_VISIBLE_SEGMENTS
	local fillRotation = startAngle + indeterminateRotation
	local percentText = (formatValue or formatDefaultCircularProgressValue)(resolvedValue, percent)
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
	local shouldRenderLabel = label ~= nil or labelSlotProps ~= nil
	local shouldRenderValueLabel = (showValue and resolvedMode == "determinate") or valueLabelSlotProps ~= nil
	local _condition = shouldRenderLabel or shouldRenderValueLabel
	if not _condition then
		local _result = slotProps
		if _result ~= nil then
			_result = _result.center
		end
		_condition = _result ~= nil
	end
	local shouldRenderCenter = _condition
	local computedSize = resolvedSize or (if resolvedWidth ~= nil and resolvedHeight ~= nil then UDim2.new(resolvedWidth, resolvedHeight) elseif resolvedWidth ~= nil then UDim2.new(resolvedWidth, resolvedWidth) elseif resolvedHeight ~= nil then UDim2.new(resolvedHeight, resolvedHeight) else UDim2.fromOffset(sizeStyles.diameter, sizeStyles.diameter))
	local computedConstraint = if resolvedConstraint == nil then {
		min = Vector2.new(sizeStyles.diameter, sizeStyles.diameter),
		max = nil,
	} else {
		min = if resolvedConstraint.min == nil then Vector2.new(sizeStyles.diameter, sizeStyles.diameter) else Vector2.new(math.max(resolvedConstraint.min.X, sizeStyles.diameter), math.max(resolvedConstraint.min.Y, sizeStyles.diameter)),
		max = resolvedConstraint.max,
	}
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.ZIndex
	end
	local _condition_1 = _result
	if _condition_1 == nil then
		_condition_1 = props.zIndex
	end
	local resolvedRootZIndex = _condition_1
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.trackGroup
		if _result_1 ~= nil then
			_result_1 = _result_1.ZIndex
		end
	end
	local _condition_2 = _result_1
	if _condition_2 == nil then
		_condition_2 = resolvedRootZIndex
	end
	local resolvedTrackZIndex = _condition_2
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.fillGroup
		if _result_2 ~= nil then
			_result_2 = _result_2.ZIndex
		end
	end
	local _condition_3 = _result_2
	if _condition_3 == nil then
		_condition_3 = resolvedTrackZIndex
	end
	local resolvedFillZIndex = _condition_3
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.center
		if _result_3 ~= nil then
			_result_3 = _result_3.ZIndex
		end
	end
	local _condition_4 = _result_3
	if _condition_4 == nil then
		_condition_4 = resolvedFillZIndex
	end
	local resolvedCenterZIndex = _condition_4
	local _result_4 = labelSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.ZIndex
	end
	local _condition_5 = _result_4
	if _condition_5 == nil then
		_condition_5 = resolvedCenterZIndex
	end
	local resolvedLabelZIndex = _condition_5
	local _result_5 = valueLabelSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.ZIndex
	end
	local _condition_6 = _result_5
	if _condition_6 == nil then
		_condition_6 = resolvedCenterZIndex
	end
	local resolvedValueLabelZIndex = _condition_6
	local _result_6 = labelSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.Font
	end
	local _condition_7 = _result_6
	if _condition_7 == nil then
		_condition_7 = theme.fontFamily
	end
	local labelFont = _condition_7
	local _result_7 = labelSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.Font
	end
	local _result_8 = labelSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.FontFace
	end
	local labelFontFace = resolveTextFontFace(_result_7, _result_8, theme.fontFamily)
	local _result_9 = valueLabelSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.Font
	end
	local _condition_8 = _result_9
	if _condition_8 == nil then
		_condition_8 = theme.fontFamily
	end
	local valueLabelFont = _condition_8
	local _result_10 = valueLabelSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.Font
	end
	local _result_11 = valueLabelSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.FontFace
	end
	local valueLabelFontFace = resolveTextFontFace(_result_10, _result_11, theme.fontFamily)
	local segmentRadius = if cap == "round" then UDim.new(0.5, 0) else UDim.new(0, 0)
	local decoratorChildren = {}
	local _object = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left = "slotProps"
	local _result_12 = slotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.padding
	end
	_object[_left] = _result_12
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object))
	local _object_1 = {
		constraint = computedConstraint,
	}
	local _left_1 = "slotProps"
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.sizeConstraint
	end
	_object_1[_left_1] = _result_13
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_1))
	local _object_2 = {
		aspectRatio = 1,
	}
	local _left_2 = "slotProps"
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.aspectRatio
	end
	_object_2[_left_2] = _result_14
	pushDecorator(decoratorChildren, renderAspectRatioDecorator(_object_2))
	local renderTrackSegments = function()
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#SEGMENT_INDICES)
		local _callback = function(index)
			local segmentAngle = (index / SEGMENT_COUNT) * 360
			local _attributes = {
				BackgroundColor3 = visualStyles.trackColor,
				BackgroundTransparency = visualStyles.trackTransparency,
				BorderSizePixel = 0,
				Size = UDim2.fromOffset(sizeStyles.segmentLength, sizeStyles.thickness),
				Position = UDim2.fromScale(0.5, 0),
				AnchorPoint = Vector2.new(0.5, 0.5),
			}
			local _result_15 = slotProps
			if _result_15 ~= nil then
				_result_15 = _result_15.trackSegment
				if _result_15 ~= nil then
					_result_15 = _result_15.ZIndex
				end
			end
			local _condition_9 = _result_15
			if _condition_9 == nil then
				_condition_9 = resolvedTrackZIndex
			end
			_attributes.ZIndex = _condition_9
			_attributes.Active = false
			_attributes.Selectable = false
			local _result_16 = slotProps
			if _result_16 ~= nil then
				_result_16 = _result_16.trackSegment
			end
			if _result_16 then
				for _k, _v in _result_16 do
					_attributes[_k] = _v
				end
			end
			return React.createElement("frame", {
				key = `track-{index}`,
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.fromScale(1, 1),
				Rotation = segmentAngle,
				Active = false,
				Selectable = false,
			}, React.createElement("frame", _attributes, React.createElement("uicorner", {
				CornerRadius = segmentRadius,
			})))
		end
		for _k, _v in SEGMENT_INDICES do
			_newValue[_k] = _callback(_v, _k - 1, SEGMENT_INDICES)
		end
		-- ▲ ReadonlyArray.map ▲
		return _newValue
	end
	local renderFillSegments = function()
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#SEGMENT_INDICES)
		local _callback = function(index)
			local segmentVisible = isSegmentVisible(index, visibleSegmentCount)
			local segmentAngle = (index / SEGMENT_COUNT) * (if resolvedMode == "indeterminate" then -360 else 360)
			local tailAlpha = if visibleSegmentCount <= 1 then 1 else index / (visibleSegmentCount - 1)
			local segmentColor = if resolvedMode == "indeterminate" then mixColor(visualStyles.fillColor, visualStyles.fillTailColor, tailAlpha * 0.36) else visualStyles.fillColor
			local _attributes = {
				BackgroundColor3 = segmentColor,
				BackgroundTransparency = 0,
				BorderSizePixel = 0,
				Size = UDim2.fromOffset(sizeStyles.segmentLength, sizeStyles.thickness),
				Position = UDim2.fromScale(0.5, 0),
				AnchorPoint = Vector2.new(0.5, 0.5),
			}
			local _result_15 = slotProps
			if _result_15 ~= nil then
				_result_15 = _result_15.fillSegment
				if _result_15 ~= nil then
					_result_15 = _result_15.ZIndex
				end
			end
			local _condition_9 = _result_15
			if _condition_9 == nil then
				_condition_9 = resolvedFillZIndex
			end
			_attributes.ZIndex = _condition_9
			_attributes.Active = false
			_attributes.Selectable = false
			local _result_16 = slotProps
			if _result_16 ~= nil then
				_result_16 = _result_16.fillSegment
			end
			if _result_16 then
				for _k, _v in _result_16 do
					_attributes[_k] = _v
				end
			end
			return React.createElement("frame", {
				key = `fill-{index}`,
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.fromScale(1, 1),
				Rotation = segmentAngle,
				Visible = segmentVisible,
				Active = false,
				Selectable = false,
			}, React.createElement("frame", _attributes, React.createElement("uicorner", {
				CornerRadius = segmentRadius,
			})))
		end
		for _k, _v in SEGMENT_INDICES do
			_newValue[_k] = _callback(_v, _k - 1, SEGMENT_INDICES)
		end
		-- ▲ ReadonlyArray.map ▲
		return _newValue
	end
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
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.trackGroup
	end
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		ZIndex = resolvedTrackZIndex,
		Active = false,
		Selectable = false,
	}
	if _result_15 then
		for _k, _v in _result_15 do
			_attributes_1[_k] = _v
		end
	end
	local _exp_1 = React.createElement("frame", _attributes_1, renderTrackSegments())
	local _result_16 = slotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.fillGroup
	end
	local _attributes_2 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Rotation = fillRotation,
		ZIndex = resolvedFillZIndex,
		Active = false,
		Selectable = false,
	}
	if _result_16 then
		for _k, _v in _result_16 do
			_attributes_2[_k] = _v
		end
	end
	local _exp_2 = React.createElement("frame", _attributes_2, renderFillSegments())
	local _result_17
	if shouldRenderCenter then
		local _result_18 = slotProps
		if _result_18 ~= nil then
			_result_18 = _result_18.center
		end
		local _attributes_3 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			ZIndex = resolvedCenterZIndex,
			Active = false,
			Selectable = false,
		}
		if _result_18 then
			for _k, _v in _result_18 do
				_attributes_3[_k] = _v
			end
		end
		local _result_19
		if shouldRenderValueLabel then
			local _attributes_4 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.fromScale(1, if shouldRenderLabel then 0.52 else 1),
				Position = UDim2.fromScale(0, if shouldRenderLabel then 0.08 else 0),
			}
			local _result_20 = valueLabelSlotProps
			if _result_20 ~= nil then
				_result_20 = _result_20.Text
			end
			local _condition_9 = _result_20
			if _condition_9 == nil then
				_condition_9 = percentText
			end
			_attributes_4.Text = _condition_9
			local _result_21 = valueLabelSlotProps
			if _result_21 ~= nil then
				_result_21 = _result_21.TextColor3
			end
			local _condition_10 = _result_21
			if _condition_10 == nil then
				_condition_10 = visualStyles.valueLabelColor
			end
			_attributes_4.TextColor3 = _condition_10
			local _result_22 = valueLabelSlotProps
			if _result_22 ~= nil then
				_result_22 = _result_22.TextTransparency
			end
			local _condition_11 = _result_22
			if _condition_11 == nil then
				_condition_11 = 0
			end
			_attributes_4.TextTransparency = _condition_11
			local _result_23 = valueLabelSlotProps
			if _result_23 ~= nil then
				_result_23 = _result_23.TextStrokeTransparency
			end
			local _condition_12 = _result_23
			if _condition_12 == nil then
				_condition_12 = 1
			end
			_attributes_4.TextStrokeTransparency = _condition_12
			local _result_24 = valueLabelSlotProps
			if _result_24 ~= nil then
				_result_24 = _result_24.TextSize
			end
			local _condition_13 = _result_24
			if _condition_13 == nil then
				_condition_13 = sizeStyles.valueLabelSize
			end
			_attributes_4.TextSize = _condition_13
			_attributes_4.Font = valueLabelFont
			_attributes_4.FontFace = valueLabelFontFace
			local _result_25 = valueLabelSlotProps
			if _result_25 ~= nil then
				_result_25 = _result_25.LineHeight
			end
			local _condition_14 = _result_25
			if _condition_14 == nil then
				_condition_14 = sizeStyles.lineHeight
			end
			_attributes_4.LineHeight = _condition_14
			local _result_26 = valueLabelSlotProps
			if _result_26 ~= nil then
				_result_26 = _result_26.TextWrapped
			end
			local _condition_15 = _result_26
			if _condition_15 == nil then
				_condition_15 = false
			end
			_attributes_4.TextWrapped = _condition_15
			local _result_27 = valueLabelSlotProps
			if _result_27 ~= nil then
				_result_27 = _result_27.TextTruncate
			end
			local _condition_16 = _result_27
			if _condition_16 == nil then
				_condition_16 = Enum.TextTruncate.AtEnd
			end
			_attributes_4.TextTruncate = _condition_16
			local _result_28 = valueLabelSlotProps
			if _result_28 ~= nil then
				_result_28 = _result_28.TextXAlignment
			end
			local _condition_17 = _result_28
			if _condition_17 == nil then
				_condition_17 = Enum.TextXAlignment.Center
			end
			_attributes_4.TextXAlignment = _condition_17
			local _result_29 = valueLabelSlotProps
			if _result_29 ~= nil then
				_result_29 = _result_29.TextYAlignment
			end
			local _condition_18 = _result_29
			if _condition_18 == nil then
				_condition_18 = Enum.TextYAlignment.Center
			end
			_attributes_4.TextYAlignment = _condition_18
			local _result_30 = valueLabelSlotProps
			if _result_30 ~= nil then
				_result_30 = _result_30.TextScaled
			end
			local _condition_19 = _result_30
			if _condition_19 == nil then
				_condition_19 = false
			end
			_attributes_4.TextScaled = _condition_19
			local _result_31 = valueLabelSlotProps
			if _result_31 ~= nil then
				_result_31 = _result_31.RichText
			end
			local _condition_20 = _result_31
			if _condition_20 == nil then
				_condition_20 = false
			end
			_attributes_4.RichText = _condition_20
			_attributes_4.ZIndex = resolvedValueLabelZIndex
			if valueLabelSlotProps then
				for _k, _v in valueLabelSlotProps do
					_attributes_4[_k] = _v
				end
			end
			_result_19 = (React.createElement("textlabel", _attributes_4))
		else
			_result_19 = nil
		end
		local _result_20
		if shouldRenderLabel then
			local _attributes_4 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.fromScale(1, if shouldRenderValueLabel then 0.42 else 1),
				Position = UDim2.fromScale(0, if shouldRenderValueLabel then 0.56 else 0),
			}
			local _result_21 = labelSlotProps
			if _result_21 ~= nil then
				_result_21 = _result_21.Text
			end
			local _condition_9 = _result_21
			if _condition_9 == nil then
				_condition_9 = (if label == nil then "" else tostring(label))
			end
			_attributes_4.Text = _condition_9
			local _result_22 = labelSlotProps
			if _result_22 ~= nil then
				_result_22 = _result_22.TextColor3
			end
			local _condition_10 = _result_22
			if _condition_10 == nil then
				_condition_10 = visualStyles.labelColor
			end
			_attributes_4.TextColor3 = _condition_10
			local _result_23 = labelSlotProps
			if _result_23 ~= nil then
				_result_23 = _result_23.TextTransparency
			end
			local _condition_11 = _result_23
			if _condition_11 == nil then
				_condition_11 = 0
			end
			_attributes_4.TextTransparency = _condition_11
			local _result_24 = labelSlotProps
			if _result_24 ~= nil then
				_result_24 = _result_24.TextStrokeTransparency
			end
			local _condition_12 = _result_24
			if _condition_12 == nil then
				_condition_12 = 1
			end
			_attributes_4.TextStrokeTransparency = _condition_12
			local _result_25 = labelSlotProps
			if _result_25 ~= nil then
				_result_25 = _result_25.TextSize
			end
			local _condition_13 = _result_25
			if _condition_13 == nil then
				_condition_13 = sizeStyles.labelSize
			end
			_attributes_4.TextSize = _condition_13
			_attributes_4.Font = labelFont
			_attributes_4.FontFace = labelFontFace
			local _result_26 = labelSlotProps
			if _result_26 ~= nil then
				_result_26 = _result_26.LineHeight
			end
			local _condition_14 = _result_26
			if _condition_14 == nil then
				_condition_14 = sizeStyles.lineHeight
			end
			_attributes_4.LineHeight = _condition_14
			local _result_27 = labelSlotProps
			if _result_27 ~= nil then
				_result_27 = _result_27.TextWrapped
			end
			local _condition_15 = _result_27
			if _condition_15 == nil then
				_condition_15 = false
			end
			_attributes_4.TextWrapped = _condition_15
			local _result_28 = labelSlotProps
			if _result_28 ~= nil then
				_result_28 = _result_28.TextTruncate
			end
			local _condition_16 = _result_28
			if _condition_16 == nil then
				_condition_16 = Enum.TextTruncate.AtEnd
			end
			_attributes_4.TextTruncate = _condition_16
			local _result_29 = labelSlotProps
			if _result_29 ~= nil then
				_result_29 = _result_29.TextXAlignment
			end
			local _condition_17 = _result_29
			if _condition_17 == nil then
				_condition_17 = Enum.TextXAlignment.Center
			end
			_attributes_4.TextXAlignment = _condition_17
			local _result_30 = labelSlotProps
			if _result_30 ~= nil then
				_result_30 = _result_30.TextYAlignment
			end
			local _condition_18 = _result_30
			if _condition_18 == nil then
				_condition_18 = Enum.TextYAlignment.Center
			end
			_attributes_4.TextYAlignment = _condition_18
			local _result_31 = labelSlotProps
			if _result_31 ~= nil then
				_result_31 = _result_31.TextScaled
			end
			local _condition_19 = _result_31
			if _condition_19 == nil then
				_condition_19 = false
			end
			_attributes_4.TextScaled = _condition_19
			local _result_32 = labelSlotProps
			if _result_32 ~= nil then
				_result_32 = _result_32.RichText
			end
			local _condition_20 = _result_32
			if _condition_20 == nil then
				_condition_20 = false
			end
			_attributes_4.RichText = _condition_20
			_attributes_4.ZIndex = resolvedLabelZIndex
			if labelSlotProps then
				for _k, _v in labelSlotProps do
					_attributes_4[_k] = _v
				end
			end
			_result_20 = (React.createElement("textlabel", _attributes_4))
		else
			_result_20 = nil
		end
		_result_17 = (React.createElement("frame", _attributes_3, _result_19, _result_20))
	else
		_result_17 = nil
	end
	return React.createElement("frame", _attributes, _exp, _exp_1, _exp_2, _result_17)
end)
local CircularProgress = CircularProgressBase
CircularProgress.displayName = "CircularProgress"
return {
	CircularProgress = CircularProgress,
}
