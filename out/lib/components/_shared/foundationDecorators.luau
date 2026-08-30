-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local function renderPaddingDecorator(options)
	if not options.enabled and options.slotProps == nil then
		return nil
	end
	local _attributes = {}
	local _condition = options.keyName
	if _condition == nil then
		_condition = "padding"
	end
	_attributes.key = _condition
	_attributes.PaddingTop = options.paddingTop
	_attributes.PaddingRight = options.paddingRight
	_attributes.PaddingBottom = options.paddingBottom
	_attributes.PaddingLeft = options.paddingLeft
	local _attribute = options.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	return React.createElement("uipadding", _attributes)
end
local function renderInsetPaddingDecorator(options)
	return renderPaddingDecorator({
		keyName = options.keyName,
		enabled = options.enabled,
		paddingTop = UDim.new(0, options.paddingY),
		paddingRight = UDim.new(0, options.paddingX),
		paddingBottom = UDim.new(0, options.paddingY),
		paddingLeft = UDim.new(0, options.paddingX),
		slotProps = options.slotProps,
	})
end
local function renderOverlayTextLabel(options)
	local _attributes = {
		AutomaticSize = Enum.AutomaticSize.XY,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(0, 0),
	}
	local _result = options.slotProps
	if _result ~= nil then
		_result = _result.Text
	end
	local _condition = _result
	if _condition == nil then
		_condition = tostring(options.text)
	end
	_attributes.Text = _condition
	local _result_1 = options.slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.TextColor3
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = options.textColor
	end
	_attributes.TextColor3 = _condition_1
	local _result_2 = options.slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.TextTransparency
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = 0
	end
	_attributes.TextTransparency = _condition_2
	local _result_3 = options.slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.TextStrokeTransparency
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = 1
	end
	_attributes.TextStrokeTransparency = _condition_3
	local _result_4 = options.slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.TextSize
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = options.textSize
	end
	_attributes.TextSize = _condition_4
	_attributes.Font = options.font
	_attributes.FontFace = options.fontFace
	local _result_5 = options.slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.LineHeight
	end
	local _condition_5 = _result_5
	if _condition_5 == nil then
		_condition_5 = options.lineHeight
	end
	_attributes.LineHeight = _condition_5
	local _result_6 = options.slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.TextWrapped
	end
	local _condition_6 = _result_6
	if _condition_6 == nil then
		_condition_6 = false
	end
	_attributes.TextWrapped = _condition_6
	local _result_7 = options.slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.TextTruncate
	end
	local _condition_7 = _result_7
	if _condition_7 == nil then
		_condition_7 = Enum.TextTruncate.None
	end
	_attributes.TextTruncate = _condition_7
	local _result_8 = options.slotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.TextXAlignment
	end
	local _condition_8 = _result_8
	if _condition_8 == nil then
		_condition_8 = options.textXAlignment
	end
	_attributes.TextXAlignment = _condition_8
	local _result_9 = options.slotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.TextYAlignment
	end
	local _condition_9 = _result_9
	if _condition_9 == nil then
		_condition_9 = Enum.TextYAlignment.Center
	end
	_attributes.TextYAlignment = _condition_9
	local _result_10 = options.slotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.TextScaled
	end
	local _condition_10 = _result_10
	if _condition_10 == nil then
		_condition_10 = false
	end
	_attributes.TextScaled = _condition_10
	local _result_11 = options.slotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.RichText
	end
	local _condition_11 = _result_11
	if _condition_11 == nil then
		_condition_11 = false
	end
	_attributes.RichText = _condition_11
	_attributes.ZIndex = options.zIndex
	local _attribute = options.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	return React.createElement("textlabel", _attributes)
end
local function renderSizeConstraintDecorator(options)
	if options.constraint == nil and options.slotProps == nil then
		return nil
	end
	local _attributes = {}
	local _condition = options.keyName
	if _condition == nil then
		_condition = "size-constraint"
	end
	_attributes.key = _condition
	local _result = options.constraint
	if _result ~= nil then
		_result = _result.min
	end
	_attributes.MinSize = _result
	local _result_1 = options.constraint
	if _result_1 ~= nil then
		_result_1 = _result_1.max
	end
	_attributes.MaxSize = _result_1
	local _attribute = options.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	return React.createElement("uisizeconstraint", _attributes)
end
local function renderCornerDecorator(options)
	if options.radius == nil and options.slotProps == nil then
		return nil
	end
	local _attributes = {}
	local _condition = options.keyName
	if _condition == nil then
		_condition = "corner"
	end
	_attributes.key = _condition
	_attributes.CornerRadius = options.radius
	local _attribute = options.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	return React.createElement("uicorner", _attributes)
end
local function renderStrokeDecorator(options)
	if not options.enabled and options.slotProps == nil then
		return nil
	end
	local _attributes = {}
	local _condition = options.keyName
	if _condition == nil then
		_condition = "stroke"
	end
	_attributes.key = _condition
	_attributes.Color = options.color
	_attributes.Thickness = options.thickness
	_attributes.Transparency = options.transparency
	_attributes.ApplyStrokeMode = options.mode
	local _attribute = options.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	return React.createElement("uistroke", _attributes)
end
local function renderAspectRatioDecorator(options)
	if options.aspectRatio == nil and options.slotProps == nil then
		return nil
	end
	local _attributes = {}
	local _condition = options.keyName
	if _condition == nil then
		_condition = "aspect-ratio"
	end
	_attributes.key = _condition
	_attributes.AspectRatio = options.aspectRatio
	local _attribute = options.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	return React.createElement("uiaspectratioconstraint", _attributes)
end
local function pushDecorator(decoratorChildren, decorator)
	if decorator ~= nil then
		local _decoratorChildren = decoratorChildren
		local _decorator = decorator
		table.insert(_decoratorChildren, _decorator)
	end
end
return {
	renderPaddingDecorator = renderPaddingDecorator,
	renderInsetPaddingDecorator = renderInsetPaddingDecorator,
	renderOverlayTextLabel = renderOverlayTextLabel,
	renderSizeConstraintDecorator = renderSizeConstraintDecorator,
	renderCornerDecorator = renderCornerDecorator,
	renderStrokeDecorator = renderStrokeDecorator,
	renderAspectRatioDecorator = renderAspectRatioDecorator,
	pushDecorator = pushDecorator,
}
