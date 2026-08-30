-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderInsetPaddingDecorator = _foundationDecorators.renderInsetPaddingDecorator
local renderOverlayTextLabel = _foundationDecorators.renderOverlayTextLabel
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local renderElevationShadow = TS.import(script, script.Parent.Parent, "_shared", "elevation").renderElevationShadow
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local function TooltipOverlayBubble(_param)
	local localAnchorPosition = _param.localAnchorPosition
	local overlayZIndex = _param.overlayZIndex
	local primitiveContent = _param.primitiveContent
	local richContent = _param.richContent
	local sizeStyles = _param.sizeStyles
	local visualStyles = _param.visualStyles
	local slotProps = _param.slotProps
	local themeFontFamily = _param.themeFontFamily
	local tailImage = _param.tailImage
	local tailBorderImage = _param.tailBorderImage
	local tailRotation = _param.tailRotation
	local tailAttachmentOffsetY = _param.tailAttachmentOffsetY
	local _bubbleSlotProps = slotProps
	if _bubbleSlotProps ~= nil then
		_bubbleSlotProps = _bubbleSlotProps.bubble
	end
	local bubbleSlotProps = _bubbleSlotProps
	local _labelSlotProps = slotProps
	if _labelSlotProps ~= nil then
		_labelSlotProps = _labelSlotProps.label
	end
	local labelSlotProps = _labelSlotProps
	local _tailSlotProps = slotProps
	if _tailSlotProps ~= nil then
		_tailSlotProps = _tailSlotProps.tail
	end
	local tailSlotProps = _tailSlotProps
	local _tailBorderSlotProps = slotProps
	if _tailBorderSlotProps ~= nil then
		_tailBorderSlotProps = _tailBorderSlotProps.tailBorder
	end
	local tailBorderSlotProps = _tailBorderSlotProps
	local _result = bubbleSlotProps
	if _result ~= nil then
		_result = _result.ZIndex
	end
	local _condition = _result
	if _condition == nil then
		_condition = incrementZIndex(overlayZIndex, 1)
	end
	local resolvedBubbleZIndex = _condition
	local _result_1 = tailBorderSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.ZIndex
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = incrementZIndex(resolvedBubbleZIndex, 1)
	end
	local resolvedTailBorderZIndex = _condition_1
	local _result_2 = tailSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.ZIndex
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = incrementZIndex(resolvedTailBorderZIndex, 1)
	end
	local resolvedTailZIndex = _condition_2
	local _result_3 = labelSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = incrementZIndex(resolvedTailZIndex, 1)
	end
	local resolvedLabelZIndex = _condition_3
	local resolvedShadowZIndex = if type(resolvedBubbleZIndex) == "number" then math.max(resolvedBubbleZIndex - 1, 0) else 0
	local _result_4 = labelSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.Font
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = themeFontFamily
	end
	local resolvedLabelFont = _condition_4
	local _result_5 = labelSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.Font
	end
	local _result_6 = labelSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.FontFace
	end
	local resolvedLabelFontFace = resolveTextFontFace(_result_5, _result_6, themeFontFamily)
	local _attributes = {}
	local _result_7 = bubbleSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.BackgroundColor3
	end
	local _condition_5 = _result_7
	if _condition_5 == nil then
		_condition_5 = visualStyles.backgroundColor
	end
	_attributes.BackgroundColor3 = _condition_5
	local _result_8 = bubbleSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.BackgroundTransparency
	end
	local _condition_6 = _result_8
	if _condition_6 == nil then
		_condition_6 = 0
	end
	_attributes.BackgroundTransparency = _condition_6
	_attributes.BorderSizePixel = 0
	local _result_9 = bubbleSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.Position
	end
	local _condition_7 = _result_9
	if _condition_7 == nil then
		_condition_7 = UDim2.fromOffset(0, 0)
	end
	_attributes.Position = _condition_7
	local _result_10 = bubbleSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.AnchorPoint
	end
	local _condition_8 = _result_10
	if _condition_8 == nil then
		_condition_8 = Vector2.new(0.5, 1)
	end
	_attributes.AnchorPoint = _condition_8
	_attributes.AutomaticSize = Enum.AutomaticSize.XY
	_attributes.ClipsDescendants = false
	_attributes.ZIndex = resolvedBubbleZIndex
	_attributes.Active = false
	_attributes.Selectable = false
	if bubbleSlotProps then
		for _k, _v in bubbleSlotProps do
			_attributes[_k] = _v
		end
	end
	local _exp = renderElevationShadow({
		shadow = visualStyles.shadow,
		radius = sizeStyles.radius,
		zIndex = resolvedShadowZIndex,
	})
	local _object = {
		radius = sizeStyles.radius,
	}
	local _left = "slotProps"
	local _result_11 = slotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.bubbleCorner
	end
	_object[_left] = _result_11
	local _exp_1 = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		color = visualStyles.strokeColor,
		transparency = visualStyles.strokeTransparency,
		thickness = 1,
	}
	local _left_1 = "slotProps"
	local _result_12 = slotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.bubbleStroke
	end
	_object_1[_left_1] = _result_12
	local _exp_2 = renderStrokeDecorator(_object_1)
	local _object_2 = {
		enabled = true,
		paddingX = sizeStyles.paddingX,
		paddingY = sizeStyles.paddingY,
	}
	local _left_2 = "slotProps"
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.bubblePadding
	end
	_object_2[_left_2] = _result_13
	local _exp_3 = React.createElement("frame", _attributes, _exp, _exp_1, _exp_2, renderInsetPaddingDecorator(_object_2), richContent or renderOverlayTextLabel({
		text = primitiveContent,
		textColor = visualStyles.textColor,
		textSize = sizeStyles.fontSize,
		font = resolvedLabelFont,
		fontFace = resolvedLabelFontFace,
		lineHeight = sizeStyles.lineHeight,
		textXAlignment = Enum.TextXAlignment.Center,
		zIndex = resolvedLabelZIndex,
		slotProps = labelSlotProps,
	}))
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(sizeStyles.tailWidth, sizeStyles.tailHeight),
	}
	local _result_14 = tailBorderSlotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.Position
	end
	local _condition_9 = _result_14
	if _condition_9 == nil then
		_condition_9 = UDim2.fromOffset(0, tailAttachmentOffsetY)
	end
	_attributes_1.Position = _condition_9
	local _result_15 = tailBorderSlotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.AnchorPoint
	end
	local _condition_10 = _result_15
	if _condition_10 == nil then
		_condition_10 = Vector2.new(0.5, 0)
	end
	_attributes_1.AnchorPoint = _condition_10
	local _result_16 = tailBorderSlotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.Image
	end
	local _condition_11 = _result_16
	if _condition_11 == nil then
		_condition_11 = tailBorderImage
	end
	_attributes_1.Image = _condition_11
	local _result_17 = tailBorderSlotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.ImageColor3
	end
	local _condition_12 = _result_17
	if _condition_12 == nil then
		_condition_12 = visualStyles.tailBorderColor
	end
	_attributes_1.ImageColor3 = _condition_12
	local _result_18 = tailBorderSlotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.ImageTransparency
	end
	local _condition_13 = _result_18
	if _condition_13 == nil then
		_condition_13 = visualStyles.tailBorderTransparency
	end
	_attributes_1.ImageTransparency = _condition_13
	local _result_19 = tailBorderSlotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.Rotation
	end
	local _condition_14 = _result_19
	if _condition_14 == nil then
		_condition_14 = tailRotation
	end
	_attributes_1.Rotation = _condition_14
	local _result_20 = tailBorderSlotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.ScaleType
	end
	local _condition_15 = _result_20
	if _condition_15 == nil then
		_condition_15 = Enum.ScaleType.Fit
	end
	_attributes_1.ScaleType = _condition_15
	_attributes_1.ZIndex = resolvedTailBorderZIndex
	_attributes_1.Active = false
	_attributes_1.Selectable = false
	if tailBorderSlotProps then
		for _k, _v in tailBorderSlotProps do
			_attributes_1[_k] = _v
		end
	end
	local _exp_4 = React.createElement("imagelabel", _attributes_1)
	local _attributes_2 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(sizeStyles.tailWidth, sizeStyles.tailHeight),
	}
	local _result_21 = tailSlotProps
	if _result_21 ~= nil then
		_result_21 = _result_21.Position
	end
	local _condition_16 = _result_21
	if _condition_16 == nil then
		_condition_16 = UDim2.fromOffset(0, tailAttachmentOffsetY)
	end
	_attributes_2.Position = _condition_16
	local _result_22 = tailSlotProps
	if _result_22 ~= nil then
		_result_22 = _result_22.AnchorPoint
	end
	local _condition_17 = _result_22
	if _condition_17 == nil then
		_condition_17 = Vector2.new(0.5, 0)
	end
	_attributes_2.AnchorPoint = _condition_17
	local _result_23 = tailSlotProps
	if _result_23 ~= nil then
		_result_23 = _result_23.Image
	end
	local _condition_18 = _result_23
	if _condition_18 == nil then
		_condition_18 = tailImage
	end
	_attributes_2.Image = _condition_18
	local _result_24 = tailSlotProps
	if _result_24 ~= nil then
		_result_24 = _result_24.ImageColor3
	end
	local _condition_19 = _result_24
	if _condition_19 == nil then
		_condition_19 = visualStyles.tailFillColor
	end
	_attributes_2.ImageColor3 = _condition_19
	local _result_25 = tailSlotProps
	if _result_25 ~= nil then
		_result_25 = _result_25.ImageTransparency
	end
	local _condition_20 = _result_25
	if _condition_20 == nil then
		_condition_20 = 0
	end
	_attributes_2.ImageTransparency = _condition_20
	local _result_26 = tailSlotProps
	if _result_26 ~= nil then
		_result_26 = _result_26.Rotation
	end
	local _condition_21 = _result_26
	if _condition_21 == nil then
		_condition_21 = tailRotation
	end
	_attributes_2.Rotation = _condition_21
	local _result_27 = tailSlotProps
	if _result_27 ~= nil then
		_result_27 = _result_27.ScaleType
	end
	local _condition_22 = _result_27
	if _condition_22 == nil then
		_condition_22 = Enum.ScaleType.Fit
	end
	_attributes_2.ScaleType = _condition_22
	_attributes_2.ZIndex = resolvedTailZIndex
	_attributes_2.Active = false
	_attributes_2.Selectable = false
	if tailSlotProps then
		for _k, _v in tailSlotProps do
			_attributes_2[_k] = _v
		end
	end
	return React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.new(0, localAnchorPosition.X, 0, localAnchorPosition.Y),
		AnchorPoint = Vector2.new(0.5, 1),
		Size = UDim2.fromOffset(0, 0),
		ClipsDescendants = false,
		Active = false,
		Selectable = false,
	}, _exp_3, _exp_4, React.createElement("imagelabel", _attributes_2))
end
return {
	TooltipOverlayBubble = TooltipOverlayBubble,
}
