-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderAspectRatioDecorator = _foundationDecorators.renderAspectRatioDecorator
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local resolveColorSafe = _useResolvedStyleProps.resolveColorSafe
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local function resolveRadius(theme, value)
	if value == nil then
		return nil
	end
	local _value = value
	if type(_value) == "number" then
		return UDim.new(0, value)
	end
	local _value_1 = value
	if typeof(_value_1) == "UDim" then
		return value
	end
	return UDim.new(0, resolveThemeSizeSafe(theme, "image", value, "radius", 0))
end
local function resolveImageSize(resolvedSize, resolvedWidth, resolvedHeight, aspectRatio)
	if resolvedSize ~= nil then
		return resolvedSize
	end
	if resolvedWidth ~= nil and resolvedHeight == nil and aspectRatio ~= nil then
		return UDim2.new(resolvedWidth, UDim.new(resolvedWidth.Scale / aspectRatio, resolvedWidth.Offset / aspectRatio))
	end
	if resolvedHeight ~= nil and resolvedWidth == nil and aspectRatio ~= nil then
		return UDim2.new(UDim.new(resolvedHeight.Scale * aspectRatio, resolvedHeight.Offset * aspectRatio), resolvedHeight)
	end
	if resolvedWidth ~= nil and resolvedHeight ~= nil then
		return UDim2.new(resolvedWidth, resolvedHeight)
	end
	if resolvedWidth ~= nil then
		return UDim2.new(resolvedWidth, resolvedWidth)
	end
	if resolvedHeight ~= nil then
		return UDim2.new(resolvedHeight, resolvedHeight)
	end
	return nil
end
local Image = React.forwardRef(function(props, ref)
	local _binding = props
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _binding_1 = useResolvedStyleProps("image", props)
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
	local resolvedRadius = resolveRadius(theme, props.radius)
	local resolvedImageColor = resolveColorSafe(theme, "image", props.color, Color3.new(1, 1, 1))
	local _result = props.stroke
	if _result ~= nil then
		_result = _result.color
	end
	local _condition = _result
	if _condition == nil then
		_condition = props.borderColor
	end
	local resolvedStrokeColor = resolveColorSafe(theme, "image", _condition, theme.colors.border.default)
	local _result_1 = props.stroke
	if _result_1 ~= nil then
		_result_1 = _result_1.thickness
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = props.border
		if _condition_1 == nil then
			_condition_1 = (if props.borderColor ~= nil then 1 else nil)
		end
	end
	local resolvedStrokeThickness = _condition_1
	local _condition_2 = props.stroke ~= nil or props.border ~= nil or props.borderColor ~= nil
	if not _condition_2 then
		local _result_2 = slotProps
		if _result_2 ~= nil then
			_result_2 = _result_2.stroke
		end
		_condition_2 = _result_2 ~= nil
	end
	local shouldRenderStroke = _condition_2
	local decoratorChildren = {}
	local _object = {
		radius = resolvedRadius,
	}
	local _left = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.corner
	end
	_object[_left] = _result_2
	pushDecorator(decoratorChildren, renderCornerDecorator(_object))
	local _object_1 = {
		enabled = shouldRenderStroke,
		color = resolvedStrokeColor or theme.colors.border.default,
	}
	local _left_1 = "thickness"
	local _condition_3 = resolvedStrokeThickness
	if _condition_3 == nil then
		_condition_3 = 1
	end
	_object_1[_left_1] = _condition_3
	local _left_2 = "transparency"
	local _result_3 = props.stroke
	if _result_3 ~= nil then
		_result_3 = _result_3.transparency
	end
	_object_1[_left_2] = _result_3
	local _left_3 = "mode"
	local _result_4 = props.stroke
	if _result_4 ~= nil then
		_result_4 = _result_4.mode
	end
	_object_1[_left_3] = _result_4
	local _left_4 = "slotProps"
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.stroke
	end
	_object_1[_left_4] = _result_5
	pushDecorator(decoratorChildren, renderStrokeDecorator(_object_1))
	local _object_2 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_5 = "slotProps"
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.padding
	end
	_object_2[_left_5] = _result_6
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object_2))
	local _object_3 = {
		aspectRatio = props.aspectRatio,
	}
	local _left_6 = "slotProps"
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.aspectRatio
	end
	_object_3[_left_6] = _result_7
	pushDecorator(decoratorChildren, renderAspectRatioDecorator(_object_3))
	local _object_4 = {
		constraint = resolvedConstraint,
	}
	local _left_7 = "slotProps"
	local _result_8 = slotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.sizeConstraint
	end
	_object_4[_left_7] = _result_8
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_4))
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local computedSize = resolveImageSize(resolvedSize, resolvedWidth, resolvedHeight, props.aspectRatio)
	local _exp = props.Event
	local _result_9 = rootSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result_9 == nil then props.cursor else nil)
	local _object_5 = {
		BorderSizePixel = 0,
	}
	local _left_8 = "BackgroundTransparency"
	local _condition_4 = props.bgTransparency
	if _condition_4 == nil then
		_condition_4 = (if props.bg ~= nil then 0 else 1)
	end
	_object_5[_left_8] = _condition_4
	_object_5.BackgroundColor3 = resolvedBackgroundColor
	_object_5.Position = computedPosition
	_object_5.AnchorPoint = resolvedAnchor
	_object_5.Size = computedSize
	_object_5.ClipsDescendants = props.clip
	_object_5.Visible = props.visible
	_object_5.LayoutOrder = props.layoutOrder
	_object_5.ZIndex = props.zIndex
	_object_5.Image = props.src
	_object_5.ImageColor3 = resolvedImageColor or Color3.new(1, 1, 1)
	_object_5.ImageTransparency = props.transparency
	_object_5.ImageRectOffset = props.imageRectOffset
	_object_5.ImageRectSize = props.imageRectSize
	_object_5.ResampleMode = props.resampleMode
	_object_5.ScaleType = props.scaleType or Enum.ScaleType.Fit
	_object_5.SliceCenter = props.sliceCenter
	_object_5.SliceScale = props.sliceScale
	_object_5.TileSize = props.tileSize
	_object_5.Event = rootEvent
	_object_5.Change = props.Change
	local rootProps = _object_5
	local _attributes = table.clone(rootProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	return React.createElement("imagelabel", _attributes, decoratorChildren, props.children)
end)
Image.displayName = "Image"
return {
	Image = Image,
}
