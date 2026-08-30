-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local themeRefs = TS.import(script, script.Parent.Parent.Parent, "theme").theme
local getLucideIconAsset = TS.import(script, script.Parent.Parent.Parent, "icons", "lucide").getLucideIconAsset
local renderSizeConstraintDecorator = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators").renderSizeConstraintDecorator
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local reportComponentFailure = _useResolvedStyleProps.reportComponentFailure
local resolveColorSafe = _useResolvedStyleProps.resolveColorSafe
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local FALLBACK_ICON_NAME = "alert-circle"
local function resolveIconDisplaySize(theme, size)
	if size == nil then
		return theme.fontSizes.md
	end
	local _size = size
	if type(_size) == "number" then
		if size >= 0 then
			return size
		end
		reportComponentFailure("icon", `Icon size must be a non-negative number, got {size}.`)
		return theme.fontSizes.md
	end
	return resolveThemeSizeSafe(theme, "icon", size, "fontSizes", theme.fontSizes.md)
end
local function resolveIconSize(resolvedSize, resolvedWidth, resolvedHeight, fallbackOffset)
	if resolvedSize ~= nil then
		return resolvedSize
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
	return UDim2.fromOffset(fallbackOffset, fallbackOffset)
end
local Icon = React.forwardRef(function(props, ref)
	local _binding = props
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _binding_1 = useResolvedStyleProps("icon", props)
	local theme = _binding_1.theme
	local resolvedWidth = _binding_1.resolvedWidth
	local resolvedHeight = _binding_1.resolvedHeight
	local resolvedSize = _binding_1.resolvedSize
	local resolvedPosition = _binding_1.resolvedPosition
	local resolvedAnchor = _binding_1.resolvedAnchor
	local resolvedBackgroundColor = _binding_1.resolvedBackgroundColor
	local resolvedConstraint = _binding_1.resolvedConstraint
	local resolvedDisplaySize = resolveIconDisplaySize(theme, props.size)
	local resolvedColor = resolveColorSafe(theme, "icon", props.color or themeRefs.text.primary, theme.colors.text.primary)
	local asset = getLucideIconAsset(props.name, resolvedDisplaySize)
	local fallbackAsset = asset or getLucideIconAsset(FALLBACK_ICON_NAME, resolvedDisplaySize)
	if asset == nil then
		reportComponentFailure("icon", `Unsupported icon name "{tostring(props.name)}". Falling back to "{FALLBACK_ICON_NAME}".`)
	end
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local computedSize = resolveIconSize(resolvedSize, resolvedWidth, resolvedHeight, resolvedDisplaySize)
	local _exp = props.Event
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result == nil then props.cursor else nil)
	local _object = {
		BorderSizePixel = 0,
	}
	local _left = "BackgroundTransparency"
	local _condition = props.bgTransparency
	if _condition == nil then
		_condition = (if props.bg ~= nil then 0 else 1)
	end
	_object[_left] = _condition
	_object.BackgroundColor3 = resolvedBackgroundColor
	_object.Position = computedPosition
	_object.AnchorPoint = resolvedAnchor
	_object.Size = computedSize
	_object.ClipsDescendants = props.clip
	_object.Visible = props.visible
	_object.LayoutOrder = props.layoutOrder
	_object.ZIndex = props.zIndex
	local _left_1 = "Image"
	local _result_1 = fallbackAsset
	if _result_1 ~= nil then
		_result_1 = _result_1.Url
	end
	_object[_left_1] = _result_1
	local _left_2 = "ImageRectSize"
	local _result_2 = fallbackAsset
	if _result_2 ~= nil then
		_result_2 = _result_2.ImageRectSize
	end
	_object[_left_2] = _result_2
	local _left_3 = "ImageRectOffset"
	local _result_3 = fallbackAsset
	if _result_3 ~= nil then
		_result_3 = _result_3.ImageRectOffset
	end
	_object[_left_3] = _result_3
	_object.ImageColor3 = resolvedColor or theme.colors.text.primary
	_object.ScaleType = Enum.ScaleType.Fit
	_object.Event = rootEvent
	_object.Change = props.Change
	local rootProps = _object
	local _attributes = table.clone(rootProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	local _object_1 = {
		constraint = resolvedConstraint,
	}
	local _left_4 = "slotProps"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.sizeConstraint
	end
	_object_1[_left_4] = _result_4
	return React.createElement("imagelabel", _attributes, renderSizeConstraintDecorator(_object_1))
end)
Icon.displayName = "Icon"
return {
	Icon = Icon,
}
