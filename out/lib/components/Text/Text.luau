-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local themeRefs = TS.import(script, script.Parent.Parent.Parent, "theme").theme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local resolveColorSafe = _useResolvedStyleProps.resolveColorSafe
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local FONT_WEIGHT_LOOKUP = { {
	value = 100,
	weight = Enum.FontWeight.Thin,
}, {
	value = 200,
	weight = Enum.FontWeight.ExtraLight,
}, {
	value = 300,
	weight = Enum.FontWeight.Light,
}, {
	value = 400,
	weight = Enum.FontWeight.Regular,
}, {
	value = 500,
	weight = Enum.FontWeight.Medium,
}, {
	value = 600,
	weight = Enum.FontWeight.SemiBold,
}, {
	value = 700,
	weight = Enum.FontWeight.Bold,
}, {
	value = 800,
	weight = Enum.FontWeight.ExtraBold,
}, {
	value = 900,
	weight = Enum.FontWeight.Heavy,
} }
local function resolveFontWeight(weight)
	local closest = FONT_WEIGHT_LOOKUP[1]
	local smallestDistance = math.abs(weight - closest.value)
	for _, candidate in FONT_WEIGHT_LOOKUP do
		local distance = math.abs(weight - candidate.value)
		if distance < smallestDistance then
			closest = candidate
			smallestDistance = distance
		end
	end
	return closest.weight
end
local function resolveFontFace(font, weight)
	local baseFont = Font.fromEnum(font)
	if weight == nil then
		return baseFont
	end
	return Font.new(baseFont.Family, resolveFontWeight(weight), baseFont.Style)
end
local function resolveLookupValue(lookup, key)
	return if key == nil then nil else lookup[key]
end
local TEXT_X_ALIGNMENT_LOOKUP = {
	left = Enum.TextXAlignment.Left,
	center = Enum.TextXAlignment.Center,
	right = Enum.TextXAlignment.Right,
}
local TEXT_Y_ALIGNMENT_LOOKUP = {
	top = Enum.TextYAlignment.Top,
	middle = Enum.TextYAlignment.Center,
	bottom = Enum.TextYAlignment.Bottom,
}
local TEXT_TRUNCATE_LOOKUP = {
	none = Enum.TextTruncate.None,
	atend = Enum.TextTruncate.AtEnd,
	splitword = Enum.TextTruncate.SplitWord,
}
local function resolveTextXAlignment(align)
	return resolveLookupValue(TEXT_X_ALIGNMENT_LOOKUP, align)
end
local function resolveTextYAlignment(valign)
	return resolveLookupValue(TEXT_Y_ALIGNMENT_LOOKUP, valign)
end
local function resolveTextTruncate(truncate)
	return resolveLookupValue(TEXT_TRUNCATE_LOOKUP, truncate)
end
local Text = React.forwardRef(function(props, ref)
	local _binding = props
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _condition = props.text
	if _condition == nil then
		_condition = props.children
		if _condition == nil then
			_condition = ""
		end
	end
	local resolvedText = _condition
	local _binding_1 = useResolvedStyleProps("text", props)
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
	local textSize
	local textAutoSize
	if resolvedSize ~= nil then
		textSize = resolvedSize
	elseif resolvedWidth ~= nil and resolvedHeight ~= nil then
		textSize = UDim2.new(resolvedWidth, resolvedHeight)
	elseif resolvedWidth ~= nil then
		textSize = UDim2.new(resolvedWidth, UDim.new(0, 0))
		textAutoSize = Enum.AutomaticSize.Y
	elseif resolvedHeight ~= nil then
		textSize = UDim2.new(UDim.new(0, 0), resolvedHeight)
		textAutoSize = Enum.AutomaticSize.X
	else
		textSize = UDim2.fromOffset(0, 0)
		textAutoSize = Enum.AutomaticSize.XY
	end
	local _result
	if props.size == nil then
		_result = theme.fontSizes.md
	else
		local _size = props.size
		_result = if type(_size) == "number" then props.size else resolveThemeSizeSafe(theme, "text", props.size, "fontSizes", theme.fontSizes.md)
	end
	local resolvedTextSize = _result
	local resolvedTextColor = resolveColorSafe(theme, "text", props.color or themeRefs.text.primary, theme.colors.text.primary)
	local resolvedFont = props.font or theme.fontFamily
	local _condition_1 = props.lineHeight
	if _condition_1 == nil then
		local _condition_2 = props.size ~= nil
		if _condition_2 then
			local _size = props.size
			_condition_2 = not (type(_size) == "number")
		end
		_condition_1 = (if _condition_2 then theme.lineHeights[props.size] else theme.lineHeights.md)
	end
	local resolvedLineHeight = _condition_1
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
	local _condition_2 = props.maxFontSize ~= nil or props.minFontSize ~= nil
	if not _condition_2 then
		local _result_3 = slotProps
		if _result_3 ~= nil then
			_result_3 = _result_3.textSizeConstraint
		end
		_condition_2 = _result_3 ~= nil
	end
	if _condition_2 then
		local _result_3 = slotProps
		if _result_3 ~= nil then
			_result_3 = _result_3.textSizeConstraint
		end
		local _attributes = {
			key = "text-size-constraint",
			MaxTextSize = props.maxFontSize,
			MinTextSize = props.minFontSize,
		}
		if _result_3 then
			for _k, _v in _result_3 do
				_attributes[_k] = _v
			end
		end
		local _arg0 = React.createElement("uitextsizeconstraint", _attributes)
		table.insert(decoratorChildren, _arg0)
	end
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _exp = props.Event
	local _result_3 = rootSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result_3 == nil then props.cursor else nil)
	local _object_2 = {
		BorderSizePixel = 0,
	}
	local _left_2 = "BackgroundTransparency"
	local _condition_3 = props.bgTransparency
	if _condition_3 == nil then
		_condition_3 = (if props.bg ~= nil then 0 else 1)
	end
	_object_2[_left_2] = _condition_3
	_object_2.Size = textSize
	_object_2.AutomaticSize = textAutoSize
	_object_2.Position = computedPosition
	_object_2.AnchorPoint = resolvedAnchor
	_object_2.BackgroundColor3 = resolvedBackgroundColor
	_object_2.ClipsDescendants = props.clip
	_object_2.Visible = props.visible
	_object_2.LayoutOrder = props.layoutOrder
	_object_2.ZIndex = props.zIndex
	_object_2.Text = tostring(resolvedText)
	_object_2.TextSize = resolvedTextSize
	_object_2.TextColor3 = resolvedTextColor or theme.colors.text.primary
	_object_2.FontFace = resolveFontFace(resolvedFont, props.weight)
	_object_2.LineHeight = resolvedLineHeight
	local _left_3 = "TextWrapped"
	local _condition_4 = props.wrap
	if _condition_4 == nil then
		_condition_4 = false
	end
	_object_2[_left_3] = _condition_4
	_object_2.TextXAlignment = resolveTextXAlignment(props.align)
	_object_2.TextYAlignment = resolveTextYAlignment(props.valign)
	_object_2.TextTruncate = resolveTextTruncate(props.truncate)
	_object_2.Event = rootEvent
	_object_2.Change = props.Change
	local textLabelInstanceProps = _object_2
	local _attributes = table.clone(textLabelInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	return React.createElement("textlabel", _attributes, decoratorChildren)
end)
Text.displayName = "Text"
return {
	Text = Text,
}
