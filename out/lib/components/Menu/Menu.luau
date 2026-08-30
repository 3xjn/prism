-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local Icon = TS.import(script, script.Parent.Parent, "Icon").Icon
local Popover = TS.import(script, script.Parent.Parent, "Popover").Popover
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local usePressInteraction = TS.import(script, script.Parent.Parent, "_shared", "usePressInteraction").usePressInteraction
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local reportComponentFailure = _useResolvedStyleProps.reportComponentFailure
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveMenuItemMotionTransition = _styles.resolveMenuItemMotionTransition
local resolveMenuItemVisualStyles = _styles.resolveMenuItemVisualStyles
local resolveMenuPanelVisualStyles = _styles.resolveMenuPanelVisualStyles
local resolveMenuSizeStyles = _styles.resolveMenuSizeStyles
local TextService = game:GetService("TextService")
local function isMenuActionItem(item)
	return item.type == nil or item.type == "item"
end
local function resolveRowHeight(item, sizeStyles)
	if item.type == "divider" then
		return sizeStyles.dividerHeight
	end
	if item.type == "label" then
		return sizeStyles.labelHeight
	end
	return sizeStyles.itemHeight
end
local function resolveVisibleListHeight(items, maxVisibleItems, sizeStyles)
	local height = 0
	local visibleRows = 0
	for _, item in items do
		if visibleRows >= maxVisibleItems then
			break
		end
		height += resolveRowHeight(item, sizeStyles)
		visibleRows += 1
	end
	return height + math.max(0, visibleRows - 1) * sizeStyles.itemGap
end
local function resolveMenuPanelWidth(props, sizeStyles)
	return if props.panelWidth ~= nil then resolveUDimSafe("menu", props.panelWidth, "panelWidth", UDim.new(0, sizeStyles.panelWidth)) else UDim.new(0, sizeStyles.panelWidth)
end
local function resolveRightSectionWidth(panelWidth)
	return UDim.new(panelWidth.Scale * 0.34, math.floor(panelWidth.Offset * 0.34))
end
local function resolveMenuItemIcon(icon, iconSize)
	if icon == nil then
		return nil
	end
	local _icon = icon
	if type(_icon) == "string" then
		return React.createElement(Icon, {
			name = icon,
			size = iconSize,
		})
	end
	if React.isValidElement(icon) then
		return icon
	end
	-- Untyped (Luau) callers can pass anything; drop the icon with the
	-- shared failure policy instead of crashing the React reconciler.
	reportComponentFailure("menu", `Invalid item icon {tostring(icon)}. Expected an icon name or a React element.`)
	return nil
end
local function resolvePrimitiveMenuSection(value)
	local _value = value
	local _condition = type(_value) == "string"
	if not _condition then
		local _value_1 = value
		_condition = type(_value_1) == "number"
	end
	return if _condition then value else nil
end
local function resolveRichMenuSection(value)
	local _condition = value == nil
	if not _condition then
		local _value = value
		_condition = type(_value) == "string"
		if not _condition then
			local _value_1 = value
			_condition = type(_value_1) == "number"
		end
	end
	if _condition then
		return nil
	end
	return value
end
local function MenuActionRow(_param)
	local item = _param.item
	local size = _param.size
	local sizeStyles = _param.sizeStyles
	local slotProps = _param.slotProps
	local styleOverrides = _param.styleOverrides
	local zIndex = _param.zIndex
	local cursor = _param.cursor
	local rightSectionWidth = _param.rightSectionWidth
	local onPress = _param.onPress
	local theme = useTheme()
	local _itemSlotProps = slotProps
	if _itemSlotProps ~= nil then
		_itemSlotProps = _itemSlotProps.item
	end
	local itemSlotProps = _itemSlotProps
	local _itemLabelSlotProps = slotProps
	if _itemLabelSlotProps ~= nil then
		_itemLabelSlotProps = _itemLabelSlotProps.itemLabel
	end
	local itemLabelSlotProps = _itemLabelSlotProps
	local _itemRightLabelSlotProps = slotProps
	if _itemRightLabelSlotProps ~= nil then
		_itemRightLabelSlotProps = _itemRightLabelSlotProps.itemRightLabel
	end
	local itemRightLabelSlotProps = _itemRightLabelSlotProps
	local disabled = item.disabled == true
	local press = usePressInteraction({
		interactive = not disabled,
		onActivated = function()
			onPress(item)
		end,
	})
	local state = press.state
	local _exp = resolveMenuItemVisualStyles(theme, item.color, state)
	local _result = styleOverrides
	if _result ~= nil then
		_result = _result.item
	end
	local visualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		size = size,
		item = item,
		state = state,
	})
	local animated = useMotion({
		values = {
			backgroundColor = visualStyles.backgroundColor,
			backgroundTransparency = visualStyles.backgroundTransparency,
			textColor = visualStyles.textColor,
			textTransparency = visualStyles.textTransparency,
			rightTextColor = visualStyles.rightTextColor,
			rightTextTransparency = visualStyles.rightTextTransparency,
		},
		transition = resolveMenuItemMotionTransition(state),
	})
	local _result_1 = itemLabelSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Font
	end
	local _condition = _result_1
	if _condition == nil then
		_condition = theme.fontFamily
	end
	local resolvedLabelFont = _condition
	local _result_2 = itemLabelSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.Font
	end
	local _result_3 = itemLabelSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.FontFace
	end
	local resolvedLabelFontFace = resolveTextFontFace(_result_2, _result_3, theme.fontFamily)
	local _result_4 = itemRightLabelSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.Font
	end
	local _condition_1 = _result_4
	if _condition_1 == nil then
		_condition_1 = theme.fontFamily
	end
	local resolvedRightLabelFont = _condition_1
	local _result_5 = itemRightLabelSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.Font
	end
	local _result_6 = itemRightLabelSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.FontFace
	end
	local resolvedRightLabelFontFace = resolveTextFontFace(_result_5, _result_6, theme.fontFamily)
	local _result_7 = itemSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.ZIndex
	end
	local _condition_2 = _result_7
	if _condition_2 == nil then
		_condition_2 = zIndex
	end
	local resolvedItemZIndex = _condition_2
	local resolvedContentZIndex = incrementZIndex(resolvedItemZIndex, 1)
	local _result_8 = itemLabelSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.ZIndex
	end
	local _condition_3 = _result_8
	if _condition_3 == nil then
		_condition_3 = resolvedContentZIndex
	end
	local resolvedLabelZIndex = _condition_3
	local _result_9 = slotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.itemRightSection
		if _result_9 ~= nil then
			_result_9 = _result_9.ZIndex
		end
	end
	local _condition_4 = _result_9
	if _condition_4 == nil then
		_condition_4 = resolvedContentZIndex
	end
	local resolvedRightSectionZIndex = _condition_4
	local _result_10 = itemRightLabelSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.ZIndex
	end
	local _condition_5 = _result_10
	if _condition_5 == nil then
		_condition_5 = incrementZIndex(resolvedRightSectionZIndex, 1)
	end
	local resolvedRightLabelZIndex = _condition_5
	local primitiveRightSection = resolvePrimitiveMenuSection(item.rightSection)
	local richRightSection = resolveRichMenuSection(item.rightSection)
	local hasIcon = item.icon ~= nil
	local hasRightSection = item.rightSection ~= nil
	local iconReservedWidth = if hasIcon then sizeStyles.iconSize + sizeStyles.itemGap else 0
	-- Primitive sections reserve their measured text width; only rich
	-- (element) sections fall back to the fractional panel reservation.
	local _rightSlotText = itemRightLabelSlotProps
	if _rightSlotText ~= nil then
		_rightSlotText = _rightSlotText.Text
	end
	local rightSlotText = _rightSlotText
	local _rightSlotTextSize = itemRightLabelSlotProps
	if _rightSlotTextSize ~= nil then
		_rightSlotTextSize = _rightSlotTextSize.TextSize
	end
	local rightSlotTextSize = _rightSlotTextSize
	local measuredRightSectionWidth = if primitiveRightSection ~= nil and richRightSection == nil then math.ceil(TextService:GetTextSize(if type(rightSlotText) == "string" then rightSlotText else tostring(primitiveRightSection), if type(rightSlotTextSize) == "number" then rightSlotTextSize else sizeStyles.metaFontSize, if typeof(resolvedRightLabelFont) == "EnumItem" then resolvedRightLabelFont else theme.fontFamily, Vector2.new(1000, 100)).X) + 2 else nil
	local resolvedRightSectionWidth = if measuredRightSectionWidth ~= nil then UDim.new(0, measuredRightSectionWidth) else rightSectionWidth
	local rightReservedScale = if hasRightSection then resolvedRightSectionWidth.Scale else 0
	local rightReservedWidth = if hasRightSection then resolvedRightSectionWidth.Offset + sizeStyles.itemGap else 0
	local _exp_1 = press.eventMap
	local _result_11 = itemSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.Event
	end
	local _exp_2 = composeEventMaps(_exp_1, _result_11)
	local _result_12 = itemSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.Event
	end
	local event = useRootCursorEvent(_exp_2, if _result_12 == nil then cursor or "pointer" else nil, disabled)
	local _attributes = {
		AutoButtonColor = false,
		Active = not disabled,
		Selectable = not disabled,
		BackgroundColor3 = animated.backgroundColor,
		BackgroundTransparency = animated.backgroundTransparency,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 0, sizeStyles.itemHeight),
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedItemZIndex,
		Event = event,
	}
	if itemSlotProps then
		for _k, _v in itemSlotProps do
			_attributes[_k] = _v
		end
	end
	local _object = {
		radius = sizeStyles.itemRadius,
	}
	local _left = "slotProps"
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.itemCorner
	end
	_object[_left] = _result_13
	local _exp_3 = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingY, "spacing", 0)),
		paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingX, "spacing", 0)),
		paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingY, "spacing", 0)),
		paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingX, "spacing", 0)),
	}
	local _left_1 = "slotProps"
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.itemPadding
	end
	_object_1[_left_1] = _result_14
	local _exp_4 = renderPaddingDecorator(_object_1)
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.itemLayout
	end
	local _result_16
	if _result_15 ~= nil then
		local _attributes_1 = {
			FillDirection = Enum.FillDirection.Horizontal,
			HorizontalAlignment = Enum.HorizontalAlignment.Left,
			VerticalAlignment = Enum.VerticalAlignment.Center,
			SortOrder = Enum.SortOrder.LayoutOrder,
			Padding = UDim.new(0, sizeStyles.itemGap),
		}
		for _k, _v in slotProps.itemLayout do
			_attributes_1[_k] = _v
		end
		_result_16 = (React.createElement("uilistlayout", _attributes_1))
	else
		_result_16 = nil
	end
	local _result_17
	if item.icon ~= nil then
		local _attributes_1 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromOffset(sizeStyles.iconSize, sizeStyles.iconSize),
			Position = UDim2.fromScale(0, 0.5),
			AnchorPoint = Vector2.new(0, 0.5),
		}
		local _result_18 = slotProps
		if _result_18 ~= nil then
			_result_18 = _result_18.itemIcon
			if _result_18 ~= nil then
				_result_18 = _result_18.ZIndex
			end
		end
		local _condition_6 = _result_18
		if _condition_6 == nil then
			_condition_6 = resolvedContentZIndex
		end
		_attributes_1.ZIndex = _condition_6
		local _result_19 = slotProps
		if _result_19 ~= nil then
			_result_19 = _result_19.itemIcon
		end
		if _result_19 then
			for _k, _v in _result_19 do
				_attributes_1[_k] = _v
			end
		end
		_result_17 = (React.createElement("frame", _attributes_1, resolveMenuItemIcon(item.icon, sizeStyles.iconSize)))
	else
		_result_17 = nil
	end
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromOffset(iconReservedWidth, 0),
		Size = UDim2.new(1 - rightReservedScale, -(iconReservedWidth + rightReservedWidth), 1, 0),
	}
	local _result_18 = itemLabelSlotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.Text
	end
	local _condition_6 = _result_18
	if _condition_6 == nil then
		_condition_6 = tostring(item.label)
	end
	_attributes_1.Text = _condition_6
	local _result_19 = itemLabelSlotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.TextColor3
	end
	local _condition_7 = _result_19
	if _condition_7 == nil then
		_condition_7 = animated.textColor
	end
	_attributes_1.TextColor3 = _condition_7
	local _result_20 = itemLabelSlotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.TextTransparency
	end
	local _condition_8 = _result_20
	if _condition_8 == nil then
		_condition_8 = animated.textTransparency
	end
	_attributes_1.TextTransparency = _condition_8
	local _result_21 = itemLabelSlotProps
	if _result_21 ~= nil then
		_result_21 = _result_21.TextStrokeTransparency
	end
	local _condition_9 = _result_21
	if _condition_9 == nil then
		_condition_9 = 1
	end
	_attributes_1.TextStrokeTransparency = _condition_9
	local _result_22 = itemLabelSlotProps
	if _result_22 ~= nil then
		_result_22 = _result_22.TextSize
	end
	local _condition_10 = _result_22
	if _condition_10 == nil then
		_condition_10 = sizeStyles.fontSize
	end
	_attributes_1.TextSize = _condition_10
	_attributes_1.Font = resolvedLabelFont
	_attributes_1.FontFace = resolvedLabelFontFace
	local _result_23 = itemLabelSlotProps
	if _result_23 ~= nil then
		_result_23 = _result_23.LineHeight
	end
	local _condition_11 = _result_23
	if _condition_11 == nil then
		_condition_11 = sizeStyles.lineHeight
	end
	_attributes_1.LineHeight = _condition_11
	local _result_24 = itemLabelSlotProps
	if _result_24 ~= nil then
		_result_24 = _result_24.TextWrapped
	end
	local _condition_12 = _result_24
	if _condition_12 == nil then
		_condition_12 = false
	end
	_attributes_1.TextWrapped = _condition_12
	local _result_25 = itemLabelSlotProps
	if _result_25 ~= nil then
		_result_25 = _result_25.TextTruncate
	end
	local _condition_13 = _result_25
	if _condition_13 == nil then
		_condition_13 = Enum.TextTruncate.AtEnd
	end
	_attributes_1.TextTruncate = _condition_13
	local _result_26 = itemLabelSlotProps
	if _result_26 ~= nil then
		_result_26 = _result_26.TextXAlignment
	end
	local _condition_14 = _result_26
	if _condition_14 == nil then
		_condition_14 = Enum.TextXAlignment.Left
	end
	_attributes_1.TextXAlignment = _condition_14
	local _result_27 = itemLabelSlotProps
	if _result_27 ~= nil then
		_result_27 = _result_27.TextYAlignment
	end
	local _condition_15 = _result_27
	if _condition_15 == nil then
		_condition_15 = Enum.TextYAlignment.Center
	end
	_attributes_1.TextYAlignment = _condition_15
	local _result_28 = itemLabelSlotProps
	if _result_28 ~= nil then
		_result_28 = _result_28.TextScaled
	end
	local _condition_16 = _result_28
	if _condition_16 == nil then
		_condition_16 = false
	end
	_attributes_1.TextScaled = _condition_16
	local _result_29 = itemLabelSlotProps
	if _result_29 ~= nil then
		_result_29 = _result_29.RichText
	end
	local _condition_17 = _result_29
	if _condition_17 == nil then
		_condition_17 = false
	end
	_attributes_1.RichText = _condition_17
	_attributes_1.ZIndex = resolvedLabelZIndex
	if itemLabelSlotProps then
		for _k, _v in itemLabelSlotProps do
			_attributes_1[_k] = _v
		end
	end
	local _exp_5 = React.createElement("textlabel", _attributes_1)
	local _result_30
	if item.rightSection ~= nil then
		local _result_31 = slotProps
		if _result_31 ~= nil then
			_result_31 = _result_31.itemRightSection
		end
		local _attributes_2 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.new(resolvedRightSectionWidth, UDim.new(1, 0)),
			Position = UDim2.fromScale(1, 0),
			AnchorPoint = Vector2.new(1, 0),
			ZIndex = resolvedRightSectionZIndex,
		}
		if _result_31 then
			for _k, _v in _result_31 do
				_attributes_2[_k] = _v
			end
		end
		local _condition_18 = richRightSection
		if _condition_18 == nil then
			local _attributes_3 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.fromScale(1, 1),
			}
			local _result_32 = itemRightLabelSlotProps
			if _result_32 ~= nil then
				_result_32 = _result_32.Text
			end
			local _condition_19 = _result_32
			if _condition_19 == nil then
				_condition_19 = tostring(primitiveRightSection)
			end
			_attributes_3.Text = _condition_19
			local _result_33 = itemRightLabelSlotProps
			if _result_33 ~= nil then
				_result_33 = _result_33.TextColor3
			end
			local _condition_20 = _result_33
			if _condition_20 == nil then
				_condition_20 = animated.rightTextColor
			end
			_attributes_3.TextColor3 = _condition_20
			local _result_34 = itemRightLabelSlotProps
			if _result_34 ~= nil then
				_result_34 = _result_34.TextTransparency
			end
			local _condition_21 = _result_34
			if _condition_21 == nil then
				_condition_21 = animated.rightTextTransparency
			end
			_attributes_3.TextTransparency = _condition_21
			local _result_35 = itemRightLabelSlotProps
			if _result_35 ~= nil then
				_result_35 = _result_35.TextStrokeTransparency
			end
			local _condition_22 = _result_35
			if _condition_22 == nil then
				_condition_22 = 1
			end
			_attributes_3.TextStrokeTransparency = _condition_22
			local _result_36 = itemRightLabelSlotProps
			if _result_36 ~= nil then
				_result_36 = _result_36.TextSize
			end
			local _condition_23 = _result_36
			if _condition_23 == nil then
				_condition_23 = sizeStyles.metaFontSize
			end
			_attributes_3.TextSize = _condition_23
			_attributes_3.Font = resolvedRightLabelFont
			_attributes_3.FontFace = resolvedRightLabelFontFace
			local _result_37 = itemRightLabelSlotProps
			if _result_37 ~= nil then
				_result_37 = _result_37.LineHeight
			end
			local _condition_24 = _result_37
			if _condition_24 == nil then
				_condition_24 = sizeStyles.lineHeight
			end
			_attributes_3.LineHeight = _condition_24
			local _result_38 = itemRightLabelSlotProps
			if _result_38 ~= nil then
				_result_38 = _result_38.TextWrapped
			end
			local _condition_25 = _result_38
			if _condition_25 == nil then
				_condition_25 = false
			end
			_attributes_3.TextWrapped = _condition_25
			local _result_39 = itemRightLabelSlotProps
			if _result_39 ~= nil then
				_result_39 = _result_39.TextTruncate
			end
			local _condition_26 = _result_39
			if _condition_26 == nil then
				_condition_26 = Enum.TextTruncate.AtEnd
			end
			_attributes_3.TextTruncate = _condition_26
			local _result_40 = itemRightLabelSlotProps
			if _result_40 ~= nil then
				_result_40 = _result_40.TextXAlignment
			end
			local _condition_27 = _result_40
			if _condition_27 == nil then
				_condition_27 = Enum.TextXAlignment.Right
			end
			_attributes_3.TextXAlignment = _condition_27
			local _result_41 = itemRightLabelSlotProps
			if _result_41 ~= nil then
				_result_41 = _result_41.TextYAlignment
			end
			local _condition_28 = _result_41
			if _condition_28 == nil then
				_condition_28 = Enum.TextYAlignment.Center
			end
			_attributes_3.TextYAlignment = _condition_28
			local _result_42 = itemRightLabelSlotProps
			if _result_42 ~= nil then
				_result_42 = _result_42.TextScaled
			end
			local _condition_29 = _result_42
			if _condition_29 == nil then
				_condition_29 = false
			end
			_attributes_3.TextScaled = _condition_29
			local _result_43 = itemRightLabelSlotProps
			if _result_43 ~= nil then
				_result_43 = _result_43.RichText
			end
			local _condition_30 = _result_43
			if _condition_30 == nil then
				_condition_30 = false
			end
			_attributes_3.RichText = _condition_30
			_attributes_3.ZIndex = resolvedRightLabelZIndex
			if itemRightLabelSlotProps then
				for _k, _v in itemRightLabelSlotProps do
					_attributes_3[_k] = _v
				end
			end
			_condition_18 = (React.createElement("textlabel", _attributes_3))
		end
		_result_30 = (React.createElement("frame", _attributes_2, _condition_18))
	else
		_result_30 = nil
	end
	return React.createElement("textbutton", _attributes, _exp_3, _exp_4, _result_16, _result_17, _exp_5, _result_30)
end
local function MenuPanel(_param)
	local props = _param.props
	local opened = _param.opened
	local setOpened = _param.setOpened
	local theme = useTheme()
	local _binding = props
	local items = _binding.items
	local slotProps = _binding.slotProps
	local closeOnItemPress = _binding.closeOnItemPress
	if closeOnItemPress == nil then
		closeOnItemPress = true
	end
	local maxVisibleItems = _binding.maxVisibleItems
	if maxVisibleItems == nil then
		maxVisibleItems = 6
	end
	local size = _binding.size
	if size == nil then
		size = "md"
	end
	local sizeStyles = resolveMenuSizeStyles(theme, size)
	local _exp = resolveMenuPanelVisualStyles(theme)
	local _result = props.styleOverrides
	if _result ~= nil then
		_result = _result.panel
	end
	local panelVisualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		size = size,
	})
	local listPadding = resolveThemeSizeSafe(theme, "menu", sizeStyles.listPadding, "spacing", 0)
	local labelPaddingX = resolveThemeSizeSafe(theme, "menu", sizeStyles.labelPaddingX, "spacing", 0)
	local clampedMaxVisibleItems = math.max(1, maxVisibleItems)
	local visibleHeight = resolveVisibleListHeight(items, clampedMaxVisibleItems, sizeStyles)
	local totalHeight = resolveVisibleListHeight(items, math.max(#items, 1), sizeStyles)
	local scrollable = totalHeight > visibleHeight + 1
	local panelWidth = resolveMenuPanelWidth(props, sizeStyles)
	local rightSectionWidth = resolveRightSectionWidth(panelWidth)
	local _listZIndex = slotProps
	if _listZIndex ~= nil then
		_listZIndex = _listZIndex.list
		if _listZIndex ~= nil then
			_listZIndex = _listZIndex.ZIndex
		end
	end
	local listZIndex = _listZIndex
	local contentZIndex = incrementZIndex(listZIndex, 1)
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.divider
		if _result_1 ~= nil then
			_result_1 = _result_1.ZIndex
		end
	end
	local _condition = _result_1
	if _condition == nil then
		_condition = contentZIndex
	end
	local dividerZIndex = _condition
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.groupLabel
		if _result_2 ~= nil then
			_result_2 = _result_2.ZIndex
		end
	end
	local _condition_1 = _result_2
	if _condition_1 == nil then
		_condition_1 = contentZIndex
	end
	local groupLabelZIndex = _condition_1
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.groupLabel
		if _result_3 ~= nil then
			_result_3 = _result_3.Font
		end
	end
	local _condition_2 = _result_3
	if _condition_2 == nil then
		_condition_2 = theme.fontFamily
	end
	local resolvedGroupLabelFont = _condition_2
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.groupLabel
		if _result_4 ~= nil then
			_result_4 = _result_4.Font
		end
	end
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.groupLabel
		if _result_5 ~= nil then
			_result_5 = _result_5.FontFace
		end
	end
	local resolvedGroupLabelFontFace = resolveTextFontFace(_result_4, _result_5, theme.fontFamily)
	local onItemPress = React.useCallback(function(item)
		local _result_6 = item.onPress
		if _result_6 ~= nil then
			_result_6(item.value)
		end
		local _result_7 = props.onItemPress
		if _result_7 ~= nil then
			_result_7(item.value)
		end
		if closeOnItemPress and item.closeMenuOnPress ~= false then
			setOpened(false)
		end
	end, { closeOnItemPress, props, setOpened })
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.list
	end
	local _attributes = {
		Active = scrollable,
		AutomaticCanvasSize = Enum.AutomaticSize.Y,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		CanvasSize = UDim2.fromOffset(0, 0),
		ScrollBarImageColor3 = theme.colors.text.disabled,
		ScrollBarImageTransparency = 0.2,
		ScrollBarThickness = if scrollable then sizeStyles.scrollBarThickness else 0,
		ScrollingDirection = Enum.ScrollingDirection.Y,
		ScrollingEnabled = scrollable,
		Selectable = false,
		Size = UDim2.new(panelWidth, UDim.new(0, visibleHeight + listPadding * 2)),
		ZIndex = listZIndex,
	}
	if _result_6 then
		for _k, _v in _result_6 do
			_attributes[_k] = _v
		end
	end
	local _object = {
		enabled = true,
		paddingTop = UDim.new(0, listPadding),
		paddingRight = UDim.new(0, listPadding),
		paddingBottom = UDim.new(0, listPadding),
		paddingLeft = UDim.new(0, listPadding),
	}
	local _left = "slotProps"
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.listPadding
	end
	_object[_left] = _result_7
	local _exp_1 = renderPaddingDecorator(_object)
	local _result_8 = slotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.listLayout
	end
	local _attributes_1 = {
		FillDirection = Enum.FillDirection.Vertical,
		HorizontalAlignment = Enum.HorizontalAlignment.Left,
		VerticalAlignment = Enum.VerticalAlignment.Top,
		SortOrder = Enum.SortOrder.LayoutOrder,
		Padding = UDim.new(0, sizeStyles.itemGap),
	}
	if _result_8 then
		for _k, _v in _result_8 do
			_attributes_1[_k] = _v
		end
	end
	local _exp_2 = React.createElement("uilistlayout", _attributes_1)
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#items)
	local _callback = function(item, index)
		if item.type == "divider" then
			local _result_9 = slotProps
			if _result_9 ~= nil then
				_result_9 = _result_9.divider
			end
			local _attributes_2 = {
				key = `divider-{index}`,
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.new(1, 0, 0, sizeStyles.dividerHeight),
				ZIndex = dividerZIndex,
			}
			if _result_9 then
				for _k, _v in _result_9 do
					_attributes_2[_k] = _v
				end
			end
			return React.createElement("frame", _attributes_2, React.createElement("frame", {
				BackgroundColor3 = panelVisualStyles.dividerColor,
				BackgroundTransparency = panelVisualStyles.dividerTransparency,
				BorderSizePixel = 0,
				Position = UDim2.fromOffset(sizeStyles.dividerInset, math.floor(sizeStyles.dividerHeight / 2)),
				Size = UDim2.new(1, -(sizeStyles.dividerInset * 2), 0, 1),
				ZIndex = incrementZIndex(dividerZIndex, 1),
			}))
		end
		if item.type == "label" then
			local _attributes_2 = {
				key = `label-{index}`,
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.new(1, -labelPaddingX, 0, sizeStyles.labelHeight),
				Position = UDim2.fromOffset(labelPaddingX, 0),
			}
			local _result_9 = slotProps
			if _result_9 ~= nil then
				_result_9 = _result_9.groupLabel
				if _result_9 ~= nil then
					_result_9 = _result_9.Text
				end
			end
			local _condition_3 = _result_9
			if _condition_3 == nil then
				_condition_3 = tostring(item.label)
			end
			_attributes_2.Text = _condition_3
			local _result_10 = slotProps
			if _result_10 ~= nil then
				_result_10 = _result_10.groupLabel
				if _result_10 ~= nil then
					_result_10 = _result_10.TextColor3
				end
			end
			local _condition_4 = _result_10
			if _condition_4 == nil then
				_condition_4 = panelVisualStyles.labelColor
			end
			_attributes_2.TextColor3 = _condition_4
			local _result_11 = slotProps
			if _result_11 ~= nil then
				_result_11 = _result_11.groupLabel
				if _result_11 ~= nil then
					_result_11 = _result_11.TextTransparency
				end
			end
			local _condition_5 = _result_11
			if _condition_5 == nil then
				_condition_5 = panelVisualStyles.labelTransparency
			end
			_attributes_2.TextTransparency = _condition_5
			local _result_12 = slotProps
			if _result_12 ~= nil then
				_result_12 = _result_12.groupLabel
				if _result_12 ~= nil then
					_result_12 = _result_12.TextStrokeTransparency
				end
			end
			local _condition_6 = _result_12
			if _condition_6 == nil then
				_condition_6 = 1
			end
			_attributes_2.TextStrokeTransparency = _condition_6
			local _result_13 = slotProps
			if _result_13 ~= nil then
				_result_13 = _result_13.groupLabel
				if _result_13 ~= nil then
					_result_13 = _result_13.TextSize
				end
			end
			local _condition_7 = _result_13
			if _condition_7 == nil then
				_condition_7 = sizeStyles.metaFontSize
			end
			_attributes_2.TextSize = _condition_7
			_attributes_2.Font = resolvedGroupLabelFont
			_attributes_2.FontFace = resolvedGroupLabelFontFace
			local _result_14 = slotProps
			if _result_14 ~= nil then
				_result_14 = _result_14.groupLabel
				if _result_14 ~= nil then
					_result_14 = _result_14.LineHeight
				end
			end
			local _condition_8 = _result_14
			if _condition_8 == nil then
				_condition_8 = sizeStyles.lineHeight
			end
			_attributes_2.LineHeight = _condition_8
			local _result_15 = slotProps
			if _result_15 ~= nil then
				_result_15 = _result_15.groupLabel
				if _result_15 ~= nil then
					_result_15 = _result_15.TextWrapped
				end
			end
			local _condition_9 = _result_15
			if _condition_9 == nil then
				_condition_9 = false
			end
			_attributes_2.TextWrapped = _condition_9
			local _result_16 = slotProps
			if _result_16 ~= nil then
				_result_16 = _result_16.groupLabel
				if _result_16 ~= nil then
					_result_16 = _result_16.TextTruncate
				end
			end
			local _condition_10 = _result_16
			if _condition_10 == nil then
				_condition_10 = Enum.TextTruncate.AtEnd
			end
			_attributes_2.TextTruncate = _condition_10
			local _result_17 = slotProps
			if _result_17 ~= nil then
				_result_17 = _result_17.groupLabel
				if _result_17 ~= nil then
					_result_17 = _result_17.TextXAlignment
				end
			end
			local _condition_11 = _result_17
			if _condition_11 == nil then
				_condition_11 = Enum.TextXAlignment.Left
			end
			_attributes_2.TextXAlignment = _condition_11
			local _result_18 = slotProps
			if _result_18 ~= nil then
				_result_18 = _result_18.groupLabel
				if _result_18 ~= nil then
					_result_18 = _result_18.TextYAlignment
				end
			end
			local _condition_12 = _result_18
			if _condition_12 == nil then
				_condition_12 = Enum.TextYAlignment.Center
			end
			_attributes_2.TextYAlignment = _condition_12
			local _result_19 = slotProps
			if _result_19 ~= nil then
				_result_19 = _result_19.groupLabel
				if _result_19 ~= nil then
					_result_19 = _result_19.TextScaled
				end
			end
			local _condition_13 = _result_19
			if _condition_13 == nil then
				_condition_13 = false
			end
			_attributes_2.TextScaled = _condition_13
			local _result_20 = slotProps
			if _result_20 ~= nil then
				_result_20 = _result_20.groupLabel
				if _result_20 ~= nil then
					_result_20 = _result_20.RichText
				end
			end
			local _condition_14 = _result_20
			if _condition_14 == nil then
				_condition_14 = false
			end
			_attributes_2.RichText = _condition_14
			_attributes_2.ZIndex = groupLabelZIndex
			local _result_21 = slotProps
			if _result_21 ~= nil then
				_result_21 = _result_21.groupLabel
			end
			if _result_21 then
				for _k, _v in _result_21 do
					_attributes_2[_k] = _v
				end
			end
			return React.createElement("textlabel", _attributes_2)
		end
		if isMenuActionItem(item) then
			return React.createElement(MenuActionRow, {
				key = item.value,
				item = item,
				size = size,
				sizeStyles = sizeStyles,
				slotProps = slotProps,
				styleOverrides = props.styleOverrides,
				zIndex = contentZIndex,
				cursor = props.cursor,
				rightSectionWidth = rightSectionWidth,
				onPress = onItemPress,
			})
		end
		return nil
	end
	for _k, _v in items do
		_newValue[_k] = _callback(_v, _k - 1, items)
	end
	-- ▲ ReadonlyArray.map ▲
	return React.createElement("scrollingframe", _attributes, _exp_1, _exp_2, _newValue, if #items == 0 then (React.createElement("textlabel", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 0, sizeStyles.itemHeight),
		Text = "No actions",
		TextColor3 = theme.colors.text.disabled,
		TextSize = sizeStyles.fontSize,
		Font = theme.fontFamily,
		FontFace = Font.fromEnum(theme.fontFamily),
		TextXAlignment = Enum.TextXAlignment.Left,
		TextYAlignment = Enum.TextYAlignment.Center,
		ZIndex = contentZIndex,
	})) else nil)
end
local MenuBase = React.forwardRef(function(props, ref)
	local _binding = props
	local children = _binding.children
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = false
	end
	local opened = _binding.opened
	local defaultOpened = _binding.defaultOpened
	if defaultOpened == nil then
		defaultOpened = false
	end
	local onOpenedChange = _binding.onOpenedChange
	local placement = _binding.placement
	if placement == nil then
		placement = "bottom"
	end
	local align = _binding.align
	if align == nil then
		align = "start"
	end
	local triggerMode = _binding.triggerMode
	if triggerMode == nil then
		triggerMode = "click"
	end
	local closeOnOutsidePress = _binding.closeOnOutsidePress
	if closeOnOutsidePress == nil then
		closeOnOutsidePress = true
	end
	local gap = _binding.gap
	local offset = _binding.offset
	local Event = _binding.Event
	local Change = _binding.Change
	local slotProps = _binding.slotProps
	local uncontrolledOpened, setUncontrolledOpened = React.useState(defaultOpened)
	local _condition = opened
	if _condition == nil then
		_condition = uncontrolledOpened
	end
	local isOpen = _condition
	local setOpened = React.useCallback(function(nextOpened)
		if opened == nil then
			setUncontrolledOpened(nextOpened)
		end
		if nextOpened ~= isOpen then
			local _result = onOpenedChange
			if _result ~= nil then
				_result(nextOpened)
			end
		end
	end, { isOpen, onOpenedChange, opened })
	local rootRef = React.useCallback(function(instance)
		assignRef(ref, instance)
	end, { ref })
	local theme = useTheme()
	local _exp = resolveMenuPanelVisualStyles(theme)
	local _result = props.styleOverrides
	if _result ~= nil then
		_result = _result.panel
	end
	local panelVisualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		size = props.size or "md",
	})
	local _object = {
		PaddingTop = UDim.new(0, 0),
		PaddingRight = UDim.new(0, 0),
		PaddingBottom = UDim.new(0, 0),
		PaddingLeft = UDim.new(0, 0),
	}
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.panelPadding
	end
	if _result_1 then
		for _k, _v in _result_1 do
			_object[_k] = _v
		end
	end
	local popoverPanelPaddingSlotProps = _object
	local _object_1 = {}
	local _left = "root"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.root
	end
	_object_1[_left] = _result_2
	local _left_1 = "sizeConstraint"
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.sizeConstraint
	end
	_object_1[_left_1] = _result_3
	local _left_2 = "trigger"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.trigger
	end
	_object_1[_left_2] = _result_4
	local _left_3 = "overlay"
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.overlay
	end
	_object_1[_left_3] = _result_5
	local _left_4 = "outsideCapture"
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.outsideCapture
	end
	_object_1[_left_4] = _result_6
	local _left_5 = "panel"
	local _object_2 = {
		BackgroundColor3 = panelVisualStyles.backgroundColor,
	}
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.panel
	end
	if _result_7 then
		for _k, _v in _result_7 do
			_object_2[_k] = _v
		end
	end
	_object_1[_left_5] = _object_2
	local _left_6 = "panelCorner"
	local _result_8 = slotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.panelCorner
	end
	_object_1[_left_6] = _result_8
	local _left_7 = "panelStroke"
	local _object_3 = {
		Color = panelVisualStyles.strokeColor,
		Transparency = panelVisualStyles.strokeTransparency,
	}
	local _result_9 = slotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.panelStroke
	end
	if _result_9 then
		for _k, _v in _result_9 do
			_object_3[_k] = _v
		end
	end
	_object_1[_left_7] = _object_3
	_object_1.panelPadding = popoverPanelPaddingSlotProps
	local _left_8 = "content"
	local _result_10 = slotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.content
	end
	_object_1[_left_8] = _result_10
	local popoverSlotProps = _object_1
	return React.createElement(Popover, {
		content = React.createElement(MenuPanel, {
			props = props,
			opened = isOpen,
			setOpened = setOpened,
		}),
		placement = placement,
		align = align,
		triggerMode = triggerMode,
		disabled = disabled,
		opened = isOpen,
		defaultOpened = defaultOpened,
		onOpenedChange = setOpened,
		closeOnOutsidePress = closeOnOutsidePress,
		gap = gap,
		offset = offset,
		width = props.width,
		height = props.height,
		minWidth = props.minWidth,
		maxWidth = props.maxWidth,
		minHeight = props.minHeight,
		maxHeight = props.maxHeight,
		position = props.position,
		anchor = props.anchor,
		center = props.center,
		clip = props.clip,
		visible = props.visible,
		layoutOrder = props.layoutOrder,
		zIndex = props.zIndex,
		cursor = props.cursor,
		Event = Event,
		Change = Change,
		slotProps = popoverSlotProps,
		ref = rootRef,
	}, children)
end)
local Menu = MenuBase
Menu.displayName = "Menu"
return {
	Menu = Menu,
}
