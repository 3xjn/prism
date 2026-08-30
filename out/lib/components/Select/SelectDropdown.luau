-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local renderElevationShadow = TS.import(script, script.Parent.Parent, "_shared", "elevation").renderElevationShadow
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local _layering = TS.import(script, script.Parent.Parent, "_shared", "layering")
local LayerPortal = _layering.LayerPortal
local useOverlayLocalPosition = _layering.useOverlayLocalPosition
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local SelectOptionRow = TS.import(script, script.Parent, "SelectOptionRow").SelectOptionRow
local resolveSelectListVisualStyles = TS.import(script, script.Parent, "styles").resolveSelectListVisualStyles
local _utils = TS.import(script, script.Parent, "utils")
local incrementZIndex = _utils.incrementZIndex
local resolveVisibleOptionCount = _utils.resolveVisibleOptionCount
local function SelectDropdown(props)
	local theme = useTheme()
	local _binding = props
	local layout = _binding.layout
	local variant = _binding.variant
	local color = _binding.color
	local size = _binding.size
	local options = _binding.options
	local currentValue = _binding.currentValue
	local sizeStyles = _binding.sizeStyles
	local maxVisibleOptions = _binding.maxVisibleOptions
	local slotProps = _binding.slotProps
	local styleOverrides = _binding.styleOverrides
	local cursor = _binding.cursor
	local zIndex = _binding.zIndex
	local onSelect = _binding.onSelect
	local overlayFrame, setOverlayFrame = React.useState()
	local _overlaySlotProps = slotProps
	if _overlaySlotProps ~= nil then
		_overlaySlotProps = _overlaySlotProps.overlay
	end
	local overlaySlotProps = _overlaySlotProps
	local _listSlotProps = slotProps
	if _listSlotProps ~= nil then
		_listSlotProps = _listSlotProps.list
	end
	local listSlotProps = _listSlotProps
	local _listViewportSlotProps = slotProps
	if _listViewportSlotProps ~= nil then
		_listViewportSlotProps = _listViewportSlotProps.listViewport
	end
	local listViewportSlotProps = _listViewportSlotProps
	local _exp = resolveSelectListVisualStyles(theme, color, variant)
	local _result = styleOverrides
	if _result ~= nil then
		_result = _result.list
	end
	local listVisualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
	})
	local listPadding = resolveThemeSizeSafe(theme, "select", sizeStyles.listPadding, "spacing", 0)
	local visibleOptionCount = math.min(#options, resolveVisibleOptionCount(maxVisibleOptions))
	local visibleListHeight = listPadding * 2 + sizeStyles.optionHeight * visibleOptionCount + sizeStyles.optionGap * math.max(visibleOptionCount - 1, 0)
	local scrollingEnabled = #options > visibleOptionCount
	local _result_1 = overlaySlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.ZIndex
	end
	local _condition = _result_1
	if _condition == nil then
		_condition = zIndex
	end
	local resolvedOverlayZIndex = _condition
	local _result_2 = listSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.ZIndex
	end
	local _condition_1 = _result_2
	if _condition_1 == nil then
		_condition_1 = incrementZIndex(resolvedOverlayZIndex, 1)
	end
	local resolvedListZIndex = _condition_1
	local _result_3 = listViewportSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_2 = _result_3
	if _condition_2 == nil then
		_condition_2 = resolvedListZIndex
	end
	local resolvedViewportZIndex = _condition_2
	local localListPosition = useOverlayLocalPosition(overlayFrame, layout.position)
	local _attributes = {
		ref = setOverlayFrame,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		AnchorPoint = Vector2.new(0, 0),
		Position = UDim2.fromOffset(0, 0),
		Size = UDim2.fromScale(1, 1),
		Active = false,
		Selectable = false,
		ZIndex = resolvedOverlayZIndex,
	}
	if overlaySlotProps then
		for _k, _v in overlaySlotProps do
			_attributes[_k] = _v
		end
	end
	local _exp_1 = if localListPosition ~= nil then (React.createElement("frame", {
		key = "list-shadow",
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		AnchorPoint = Vector2.new(0, 0),
		Position = UDim2.new(0, localListPosition.X, 0, localListPosition.Y),
		Size = UDim2.new(0, layout.size.X, 0, visibleListHeight),
		Active = false,
		Selectable = false,
		ZIndex = resolvedOverlayZIndex,
	}, renderElevationShadow({
		shadow = theme.shadows.md,
		radius = sizeStyles.radius,
	}))) else nil
	local _result_4
	if localListPosition ~= nil then
		local _attributes_1 = {
			BackgroundColor3 = listVisualStyles.backgroundColor,
			BackgroundTransparency = 0,
			BorderSizePixel = 0,
			AnchorPoint = Vector2.new(0, 0),
			ClipsDescendants = true,
			Position = UDim2.new(0, localListPosition.X, 0, localListPosition.Y),
			Size = UDim2.new(0, layout.size.X, 0, visibleListHeight),
			ZIndex = resolvedListZIndex,
		}
		if listSlotProps then
			for _k, _v in listSlotProps do
				_attributes_1[_k] = _v
			end
		end
		local _object = {
			radius = sizeStyles.radius,
		}
		local _left = "slotProps"
		local _result_5 = slotProps
		if _result_5 ~= nil then
			_result_5 = _result_5.listCorner
		end
		_object[_left] = _result_5
		local _exp_2 = renderCornerDecorator(_object)
		local _object_1 = {
			enabled = true,
			color = listVisualStyles.strokeColor,
			transparency = listVisualStyles.strokeTransparency,
			thickness = 1,
		}
		local _left_1 = "slotProps"
		local _result_6 = slotProps
		if _result_6 ~= nil then
			_result_6 = _result_6.listStroke
		end
		_object_1[_left_1] = _result_6
		local _exp_3 = renderStrokeDecorator(_object_1)
		local _attributes_2 = {
			Active = scrollingEnabled,
			AutomaticCanvasSize = Enum.AutomaticSize.Y,
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			CanvasSize = UDim2.fromOffset(0, 0),
			Position = UDim2.fromOffset(0, 0),
			ScrollBarImageColor3 = theme.colors.text.disabled,
			ScrollBarImageTransparency = 0.2,
			ScrollBarThickness = if scrollingEnabled then theme.spacing.xs else 0,
			ScrollingDirection = Enum.ScrollingDirection.Y,
			ScrollingEnabled = scrollingEnabled,
			Selectable = false,
			Size = UDim2.fromScale(1, 1),
			ZIndex = resolvedViewportZIndex,
		}
		if listViewportSlotProps then
			for _k, _v in listViewportSlotProps do
				_attributes_2[_k] = _v
			end
		end
		local _object_2 = {
			enabled = true,
			paddingTop = UDim.new(0, listPadding),
			paddingRight = UDim.new(0, listPadding),
			paddingBottom = UDim.new(0, listPadding),
			paddingLeft = UDim.new(0, listPadding),
		}
		local _left_2 = "slotProps"
		local _result_7 = slotProps
		if _result_7 ~= nil then
			_result_7 = _result_7.listPadding
		end
		_object_2[_left_2] = _result_7
		local _exp_4 = renderPaddingDecorator(_object_2)
		local _result_8 = slotProps
		if _result_8 ~= nil then
			_result_8 = _result_8.optionsLayout
		end
		local _attributes_3 = {
			FillDirection = Enum.FillDirection.Vertical,
			HorizontalAlignment = Enum.HorizontalAlignment.Left,
			VerticalAlignment = Enum.VerticalAlignment.Top,
			SortOrder = Enum.SortOrder.LayoutOrder,
			Padding = UDim.new(0, sizeStyles.optionGap),
		}
		if _result_8 then
			for _k, _v in _result_8 do
				_attributes_3[_k] = _v
			end
		end
		local _exp_5 = React.createElement("uilistlayout", _attributes_3)
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#options)
		local _callback = function(option)
			return React.createElement(SelectOptionRow, {
				key = option.value,
				option = option,
				selected = currentValue == option.value,
				color = color,
				size = size,
				sizeStyles = sizeStyles,
				slotProps = slotProps,
				styleOverrides = styleOverrides,
				zIndex = resolvedViewportZIndex,
				cursor = cursor,
				onSelect = onSelect,
			})
		end
		for _k, _v in options do
			_newValue[_k] = _callback(_v, _k - 1, options)
		end
		-- ▲ ReadonlyArray.map ▲
		_result_4 = (React.createElement("frame", _attributes_1, _exp_2, _exp_3, React.createElement("scrollingframe", _attributes_2, _exp_4, _exp_5, _newValue)))
	else
		_result_4 = nil
	end
	return React.createElement(LayerPortal, {
		target = layout.portalTarget,
	}, React.createElement("frame", _attributes, _exp_1, _result_4))
end
return {
	SelectDropdown = SelectDropdown,
}
