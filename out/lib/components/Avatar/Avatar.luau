-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local resolveColorSafe = _useResolvedStyleProps.resolveColorSafe
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveAvatarSize(theme, size)
	if size == nil then
		return 40
	end
	local _size = size
	if type(_size) == "number" then
		return math.max(1, math.abs(size))
	end
	repeat
		local _fallthrough = false
		if size == "xs" then
			return 24
		end
		if size == "sm" then
			return 32
		end
		if size == "lg" then
			return 52
		end
		if size == "xl" then
			return 64
		end
		if size == "md" then
		end
		return 40
	until true
end
local function resolveAvatarRadius(theme, size, radius)
	if radius == nil then
		return UDim.new(0.5, 0)
	end
	local _radius = radius
	if type(_radius) == "number" then
		return UDim.new(0, radius)
	end
	local _radius_1 = radius
	if typeof(_radius_1) == "UDim" then
		return radius
	end
	return UDim.new(0, resolveThemeSizeSafe(theme, "avatar", radius, "radius", size / 2))
end
local function resolveFallbackText(fallback)
	if fallback == nil then
		return "?"
	end
	local text = tostring(fallback)
	return if #text <= 2 then string.upper(text) else string.upper(string.sub(text, 1, 2))
end
local Avatar = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local src = _binding.src
	local color = _binding.color
	if color == nil then
		color = "primary"
	end
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _binding_1 = useResolvedStyleProps("avatar", props)
	local resolvedPosition = _binding_1.resolvedPosition
	local resolvedAnchor = _binding_1.resolvedAnchor
	local resolvedBackgroundColor = _binding_1.resolvedBackgroundColor
	local resolvedWidth = _binding_1.resolvedWidth
	local resolvedHeight = _binding_1.resolvedHeight
	local resolvedSize = _binding_1.resolvedSize
	local resolvedConstraint = _binding_1.resolvedConstraint
	local paddingTop = _binding_1.paddingTop
	local paddingRight = _binding_1.paddingRight
	local paddingBottom = _binding_1.paddingBottom
	local paddingLeft = _binding_1.paddingLeft
	local hasPadding = _binding_1.hasPadding
	local size = resolveAvatarSize(theme, props.size)
	local computedSize = resolvedSize or UDim2.new(resolvedWidth or UDim.new(0, size), resolvedHeight or UDim.new(0, size))
	local intentColors = theme.colors[color]
	local fallbackBackground = resolvedBackgroundColor or mixColor(theme.colors.background.surface, intentColors.light, 0.42)
	local fallbackColor = resolveColorSafe(theme, "avatar", props.fallbackColor or intentColors.dark, intentColors.dark) or intentColors.dark
	local strokeColor = resolveColorSafe(theme, "avatar", props.borderColor or mixColor(intentColors.light, theme.colors.background.surface, 0.3), theme.colors.border.default)
	local _condition = props.border
	if _condition == nil then
		_condition = 1
	end
	local borderThickness = _condition
	local cornerRadius = resolveAvatarRadius(theme, size, props.radius)
	local hasImage = src ~= nil and #src > 0
	local _condition_1 = props.zIndex
	if _condition_1 == nil then
		_condition_1 = 1
	end
	local contentZIndex = _condition_1 + 1
	local _exp = props.Event
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result == nil then props.cursor else nil)
	local decoratorChildren = {}
	local _object = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left = "slotProps"
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.padding
	end
	_object[_left] = _result_1
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object))
	local _object_1 = {
		constraint = resolvedConstraint,
	}
	local _left_1 = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.sizeConstraint
	end
	_object_1[_left_1] = _result_2
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_1))
	local _attributes = {
		BackgroundColor3 = fallbackBackground,
	}
	local _condition_2 = props.bgTransparency
	if _condition_2 == nil then
		_condition_2 = 0
	end
	_attributes.BackgroundTransparency = _condition_2
	_attributes.BorderSizePixel = 0
	_attributes.Size = computedSize
	_attributes.Position = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	_attributes.AnchorPoint = resolvedAnchor
	local _condition_3 = props.clip
	if _condition_3 == nil then
		_condition_3 = true
	end
	_attributes.ClipsDescendants = _condition_3
	_attributes.Visible = props.visible
	_attributes.LayoutOrder = props.layoutOrder
	_attributes.ZIndex = props.zIndex
	_attributes.Event = rootEvent
	_attributes.Change = props.Change
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	local _exp_1 = decoratorChildren
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.corner
	end
	local _attributes_1 = {
		CornerRadius = cornerRadius,
	}
	if _result_3 then
		for _k, _v in _result_3 do
			_attributes_1[_k] = _v
		end
	end
	local _exp_2 = React.createElement("uicorner", _attributes_1)
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.stroke
	end
	local _attributes_2 = {
		Color = strokeColor,
		Transparency = 0.18,
		Thickness = borderThickness,
	}
	if _result_4 then
		for _k, _v in _result_4 do
			_attributes_2[_k] = _v
		end
	end
	local _exp_3 = React.createElement("uistroke", _attributes_2)
	local _result_5
	if hasImage then
		local _attributes_3 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			Image = src,
		}
		local _condition_4 = props.imageTransparency
		if _condition_4 == nil then
			_condition_4 = 0
		end
		_attributes_3.ImageTransparency = _condition_4
		_attributes_3.ScaleType = Enum.ScaleType.Crop
		_attributes_3.ZIndex = contentZIndex
		local _result_6 = slotProps
		if _result_6 ~= nil then
			_result_6 = _result_6.image
		end
		if _result_6 then
			for _k, _v in _result_6 do
				_attributes_3[_k] = _v
			end
		end
		_result_5 = (React.createElement("imagelabel", _attributes_3))
	else
		local _result_6 = slotProps
		if _result_6 ~= nil then
			_result_6 = _result_6.fallback
		end
		local _attributes_3 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			Text = resolveFallbackText(props.fallback),
			TextColor3 = fallbackColor,
			TextTransparency = 0,
			TextStrokeTransparency = 1,
			TextSize = math.max(11, math.floor(size * 0.42)),
			Font = theme.fontFamily,
			FontFace = resolveTextFontFace(nil, nil, theme.fontFamily),
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			ZIndex = contentZIndex,
		}
		if _result_6 then
			for _k, _v in _result_6 do
				_attributes_3[_k] = _v
			end
		end
		_result_5 = (React.createElement("textlabel", _attributes_3))
	end
	return React.createElement("frame", _attributes, _exp_1, _exp_2, _exp_3, _result_5)
end)
Avatar.displayName = "Avatar"
return {
	Avatar = Avatar,
}
