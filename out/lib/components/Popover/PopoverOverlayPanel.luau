-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderInsetPaddingDecorator = _foundationDecorators.renderInsetPaddingDecorator
local renderOverlayTextLabel = _foundationDecorators.renderOverlayTextLabel
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local renderElevationShadow = TS.import(script, script.Parent.Parent, "_shared", "elevation").renderElevationShadow
local Backdrop = TS.import(script, script.Parent.Parent, "Backdrop").Backdrop
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local function PopoverOverlayPanel(_param)
	local localAnchorPosition = _param.localAnchorPosition
	local panelPlacement = _param.panelPlacement
	local overlayZIndex = _param.overlayZIndex
	local panelInstance = _param.panelInstance
	local primitiveContent = _param.primitiveContent
	local richContent = _param.richContent
	local shouldRenderOutsideCapture = _param.shouldRenderOutsideCapture
	local sizeStyles = _param.sizeStyles
	local visualStyles = _param.visualStyles
	local slotProps = _param.slotProps
	local themeFontFamily = _param.themeFontFamily
	local onOutsidePress = _param.onOutsidePress
	local setPanelInstance = _param.setPanelInstance
	local _outsideCaptureSlotProps = slotProps
	if _outsideCaptureSlotProps ~= nil then
		_outsideCaptureSlotProps = _outsideCaptureSlotProps.outsideCapture
	end
	local outsideCaptureSlotProps = _outsideCaptureSlotProps
	local _panelSlotProps = slotProps
	if _panelSlotProps ~= nil then
		_panelSlotProps = _panelSlotProps.panel
	end
	local panelSlotProps = _panelSlotProps
	local _contentSlotProps = slotProps
	if _contentSlotProps ~= nil then
		_contentSlotProps = _contentSlotProps.content
	end
	local contentSlotProps = _contentSlotProps
	local _labelSlotProps = slotProps
	if _labelSlotProps ~= nil then
		_labelSlotProps = _labelSlotProps.label
	end
	local labelSlotProps = _labelSlotProps
	local _result = outsideCaptureSlotProps
	if _result ~= nil then
		_result = _result.ZIndex
	end
	local _condition = _result
	if _condition == nil then
		_condition = overlayZIndex
	end
	local resolvedOutsideCaptureZIndex = _condition
	local _result_1 = panelSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.ZIndex
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = incrementZIndex(resolvedOutsideCaptureZIndex, 1)
	end
	local resolvedPanelZIndex = _condition_1
	local _result_2 = contentSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.ZIndex
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = incrementZIndex(resolvedPanelZIndex, 1)
	end
	local resolvedContentZIndex = _condition_2
	local _result_3 = labelSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = incrementZIndex(resolvedContentZIndex, 1)
	end
	local resolvedLabelZIndex = _condition_3
	local resolvedShadowZIndex = if type(resolvedPanelZIndex) == "number" then math.max(resolvedPanelZIndex - 1, 0) else 0
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
	local _exp = if shouldRenderOutsideCapture then (React.createElement(Backdrop, {
		visible = true,
		opacity = 0,
		active = true,
		zIndex = resolvedOutsideCaptureZIndex,
		excludeInstance = panelInstance,
		onPress = onOutsidePress,
		slotProps = {
			root = outsideCaptureSlotProps,
		},
	})) else nil
	local _attributes = {
		AutoButtonColor = false,
	}
	local _result_7 = panelSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.Active
	end
	local _condition_5 = _result_7
	if _condition_5 == nil then
		_condition_5 = true
	end
	_attributes.Active = _condition_5
	_attributes.Selectable = false
	local _result_8 = panelSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.BackgroundColor3
	end
	local _condition_6 = _result_8
	if _condition_6 == nil then
		_condition_6 = visualStyles.backgroundColor
	end
	_attributes.BackgroundColor3 = _condition_6
	local _result_9 = panelSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.BackgroundTransparency
	end
	local _condition_7 = _result_9
	if _condition_7 == nil then
		_condition_7 = 0
	end
	_attributes.BackgroundTransparency = _condition_7
	_attributes.BorderSizePixel = 0
	_attributes.Text = ""
	_attributes.TextTransparency = 1
	_attributes.TextStrokeTransparency = 1
	_attributes.Position = UDim2.new(0, localAnchorPosition.X, 0, localAnchorPosition.Y)
	local _result_10 = panelSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.AnchorPoint
	end
	local _condition_8 = _result_10
	if _condition_8 == nil then
		_condition_8 = panelPlacement.anchorPoint
	end
	_attributes.AnchorPoint = _condition_8
	local _result_11 = panelSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.Size
	end
	local _condition_9 = _result_11
	if _condition_9 == nil then
		_condition_9 = UDim2.fromOffset(0, 0)
	end
	_attributes.Size = _condition_9
	local _result_12 = panelSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.AutomaticSize
	end
	local _condition_10 = _result_12
	if _condition_10 == nil then
		_condition_10 = Enum.AutomaticSize.XY
	end
	_attributes.AutomaticSize = _condition_10
	local _result_13 = panelSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.ClipsDescendants
	end
	local _condition_11 = _result_13
	if _condition_11 == nil then
		_condition_11 = false
	end
	_attributes.ClipsDescendants = _condition_11
	_attributes.ZIndex = resolvedPanelZIndex
	if panelSlotProps then
		for _k, _v in panelSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = setPanelInstance
	local _exp_1 = renderElevationShadow({
		shadow = visualStyles.shadow,
		radius = sizeStyles.radius,
		zIndex = resolvedShadowZIndex,
	})
	local _object = {
		radius = sizeStyles.radius,
	}
	local _left = "slotProps"
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.panelCorner
	end
	_object[_left] = _result_14
	local _exp_2 = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		color = visualStyles.strokeColor,
		transparency = visualStyles.strokeTransparency,
		thickness = visualStyles.strokeThickness,
	}
	local _left_1 = "slotProps"
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.panelStroke
	end
	_object_1[_left_1] = _result_15
	local _exp_3 = renderStrokeDecorator(_object_1)
	local _object_2 = {
		enabled = true,
		paddingX = sizeStyles.paddingX,
		paddingY = sizeStyles.paddingY,
	}
	local _left_2 = "slotProps"
	local _result_16 = slotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.panelPadding
	end
	_object_2[_left_2] = _result_16
	local _exp_4 = renderInsetPaddingDecorator(_object_2)
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(0, 0),
		AutomaticSize = Enum.AutomaticSize.XY,
		Active = false,
		Selectable = false,
		ZIndex = resolvedContentZIndex,
	}
	if contentSlotProps then
		for _k, _v in contentSlotProps do
			_attributes_1[_k] = _v
		end
	end
	return React.createElement(React.Fragment, nil, _exp, React.createElement("textbutton", _attributes, _exp_1, _exp_2, _exp_3, _exp_4, React.createElement("frame", _attributes_1, richContent or renderOverlayTextLabel({
		text = primitiveContent,
		textColor = visualStyles.textColor,
		textSize = sizeStyles.fontSize,
		font = resolvedLabelFont,
		fontFace = resolvedLabelFontFace,
		lineHeight = sizeStyles.lineHeight,
		textXAlignment = Enum.TextXAlignment.Left,
		zIndex = resolvedLabelZIndex,
		slotProps = labelSlotProps,
	}))))
end
return {
	PopoverOverlayPanel = PopoverOverlayPanel,
}
