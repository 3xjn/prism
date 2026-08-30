-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local isPressInput = _interaction.isPressInput
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveTabsListVisualStyles = _styles.resolveTabsListVisualStyles
local resolveTabsPanelVisualStyles = _styles.resolveTabsPanelVisualStyles
local resolveTabsSizeStyles = _styles.resolveTabsSizeStyles
local resolveTabsTabMotionTransition = _styles.resolveTabsTabMotionTransition
local resolveTabsTabVisualStyles = _styles.resolveTabsTabVisualStyles
local UserInputService = game:GetService("UserInputService")
local function findTab(tabs, value)
	if value == nil then
		return nil
	end
	for _, tab in tabs do
		if tab.value == value then
			return tab
		end
	end
	return nil
end
local function isTabEnabled(tab)
	return tab.disabled ~= true
end
local function resolveInitialValue(tabs, value)
	local matchingTab = findTab(tabs, value)
	if matchingTab ~= nil and isTabEnabled(matchingTab) then
		return matchingTab.value
	end
	for _, tab in tabs do
		if isTabEnabled(tab) then
			return tab.value
		end
	end
	local _result = tabs[1]
	if _result ~= nil then
		_result = _result.value
	end
	return _result
end
local function resolveSelectedIndex(tabs, selectedValue)
	if selectedValue == nil then
		return 0
	end
	for index = 0, #tabs - 1 do
		local tab = tabs[index + 1]
		if tab.value == selectedValue then
			return index
		end
	end
	return 0
end
local function resolveNextEnabledTabValue(tabs, selectedValue, direction)
	if #tabs == 0 then
		return nil
	end
	local selectedIndex = resolveSelectedIndex(tabs, selectedValue)
	for step = 1, #tabs do
		local nextIndex = (selectedIndex + step * direction + #tabs) % #tabs
		local nextTab = tabs[nextIndex + 1]
		if nextTab.disabled ~= true then
			return nextTab.value
		end
	end
	return nil
end
local function isPreviousTabInput(keyCode)
	return keyCode == Enum.KeyCode.Left or keyCode == Enum.KeyCode.A or keyCode == Enum.KeyCode.DPadLeft
end
local function isNextTabInput(keyCode)
	return keyCode == Enum.KeyCode.Right or keyCode == Enum.KeyCode.D or keyCode == Enum.KeyCode.DPadRight
end
local function offsetZIndex(zIndex, offset)
	local _zIndex = zIndex
	return if type(_zIndex) == "number" then zIndex + offset else nil
end
local function TabsTabView(_param)
	local tab = _param.tab
	local index = _param.index
	local tabCount = _param.tabCount
	local tabDisabled = _param.tabDisabled
	local focused = _param.focused
	local fullWidth = _param.fullWidth
	local interactionState = _param.interactionState
	local tabVisualStyles = _param.tabVisualStyles
	local tabEvent = _param.tabEvent
	local tabSlotProps = _param.tabSlotProps
	local tabTextSlotProps = _param.tabTextSlotProps
	local slotProps = _param.slotProps
	local theme = _param.theme
	local sizeStyles = _param.sizeStyles
	local tabTextFont = _param.tabTextFont
	local tabTextFontFace = _param.tabTextFontFace
	local resolvedTabZIndex = _param.resolvedTabZIndex
	local resolvedTabTextZIndex = _param.resolvedTabTextZIndex
	local motionValues = {
		backgroundColor = tabVisualStyles.backgroundColor,
		backgroundTransparency = tabVisualStyles.backgroundTransparency,
		strokeColor = tabVisualStyles.strokeColor,
		strokeTransparency = tabVisualStyles.strokeTransparency,
		textColor = tabVisualStyles.textColor,
		textTransparency = tabVisualStyles.textTransparency,
		indicatorColor = tabVisualStyles.indicatorColor,
		indicatorTransparency = tabVisualStyles.indicatorTransparency,
	}
	local animatedTabStyles = useMotion({
		values = motionValues,
		transition = resolveTabsTabMotionTransition(interactionState),
	})
	local _attributes = {
		key = tab.value,
		AutoButtonColor = false,
		Active = not tabDisabled,
		Selectable = not tabDisabled,
		BackgroundColor3 = animatedTabStyles.backgroundColor,
		BackgroundTransparency = animatedTabStyles.backgroundTransparency,
		BorderSizePixel = 0,
		Size = if fullWidth then UDim2.new(1 / tabCount, -sizeStyles.tabGap, 1, 0) else UDim2.new(0, 0, 1, 0),
		AutomaticSize = if fullWidth then Enum.AutomaticSize.None else Enum.AutomaticSize.X,
		LayoutOrder = index,
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedTabZIndex,
		Event = tabEvent,
	}
	if tabSlotProps then
		for _k, _v in tabSlotProps do
			_attributes[_k] = _v
		end
	end
	local _object = {
		radius = sizeStyles.tabRadius,
	}
	local _left = "slotProps"
	local _result = slotProps
	if _result ~= nil then
		_result = _result.tabCorner
	end
	_object[_left] = _result
	local _exp = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		color = animatedTabStyles.strokeColor,
		transparency = animatedTabStyles.strokeTransparency,
		thickness = 1,
	}
	local _left_1 = "slotProps"
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.tabStroke
	end
	_object_1[_left_1] = _result_1
	local _exp_1 = renderStrokeDecorator(_object_1)
	local _exp_2 = renderStrokeDecorator({
		keyName = "focus-stroke",
		enabled = focused and not tabDisabled,
		color = tabVisualStyles.strokeColor,
		transparency = 0.18,
		thickness = 2,
	})
	local _exp_3 = React.createElement("frame", {
		key = "indicator",
		BackgroundColor3 = animatedTabStyles.indicatorColor,
		BackgroundTransparency = animatedTabStyles.indicatorTransparency,
		BorderSizePixel = 0,
		AnchorPoint = Vector2.new(0.5, 1),
		Position = UDim2.fromScale(0.5, 1),
		Size = UDim2.new(1, 0, 0, 2),
		Active = false,
		Selectable = false,
		ZIndex = resolvedTabZIndex,
	})
	local _object_2 = {
		enabled = true,
		paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingY, "spacing", theme.spacing.xs)),
		paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingX, "spacing", theme.spacing.sm)),
		paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingY, "spacing", theme.spacing.xs)),
		paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingX, "spacing", theme.spacing.sm)),
	}
	local _left_2 = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.tabPadding
	end
	_object_2[_left_2] = _result_2
	local _exp_4 = renderPaddingDecorator(_object_2)
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		AutomaticSize = if fullWidth then Enum.AutomaticSize.None else Enum.AutomaticSize.X,
	}
	local _result_3 = tabTextSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.Text
	end
	local _condition = _result_3
	if _condition == nil then
		_condition = tab.label
	end
	_attributes_1.Text = _condition
	local _result_4 = tabTextSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.TextColor3
	end
	local _condition_1 = _result_4
	if _condition_1 == nil then
		_condition_1 = animatedTabStyles.textColor
	end
	_attributes_1.TextColor3 = _condition_1
	local _result_5 = tabTextSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.TextTransparency
	end
	local _condition_2 = _result_5
	if _condition_2 == nil then
		_condition_2 = animatedTabStyles.textTransparency
	end
	_attributes_1.TextTransparency = _condition_2
	local _result_6 = tabTextSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.TextStrokeTransparency
	end
	local _condition_3 = _result_6
	if _condition_3 == nil then
		_condition_3 = 1
	end
	_attributes_1.TextStrokeTransparency = _condition_3
	local _result_7 = tabTextSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.TextSize
	end
	local _condition_4 = _result_7
	if _condition_4 == nil then
		_condition_4 = sizeStyles.fontSize
	end
	_attributes_1.TextSize = _condition_4
	_attributes_1.Font = tabTextFont
	_attributes_1.FontFace = tabTextFontFace
	local _result_8 = tabTextSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.LineHeight
	end
	local _condition_5 = _result_8
	if _condition_5 == nil then
		_condition_5 = sizeStyles.lineHeight
	end
	_attributes_1.LineHeight = _condition_5
	local _result_9 = tabTextSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.TextWrapped
	end
	local _condition_6 = _result_9
	if _condition_6 == nil then
		_condition_6 = false
	end
	_attributes_1.TextWrapped = _condition_6
	local _result_10 = tabTextSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.TextTruncate
	end
	local _condition_7 = _result_10
	if _condition_7 == nil then
		_condition_7 = Enum.TextTruncate.AtEnd
	end
	_attributes_1.TextTruncate = _condition_7
	local _result_11 = tabTextSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.TextXAlignment
	end
	local _condition_8 = _result_11
	if _condition_8 == nil then
		_condition_8 = Enum.TextXAlignment.Center
	end
	_attributes_1.TextXAlignment = _condition_8
	local _result_12 = tabTextSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.TextYAlignment
	end
	local _condition_9 = _result_12
	if _condition_9 == nil then
		_condition_9 = Enum.TextYAlignment.Center
	end
	_attributes_1.TextYAlignment = _condition_9
	_attributes_1.ZIndex = resolvedTabTextZIndex
	if tabTextSlotProps then
		for _k, _v in tabTextSlotProps do
			_attributes_1[_k] = _v
		end
	end
	return React.createElement("textbutton", _attributes, _exp, _exp_1, _exp_2, _exp_3, _exp_4, React.createElement("textlabel", _attributes_1))
end
local TabsBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local styleOverrides = _binding.styleOverrides
	local tabs = _binding.tabs
	local variant = _binding.variant
	if variant == nil then
		variant = "line"
	end
	local color = _binding.color
	if color == nil then
		color = "primary"
	end
	local size = _binding.size
	if size == nil then
		size = "md"
	end
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = false
	end
	local fullWidth = _binding.fullWidth
	if fullWidth == nil then
		fullWidth = false
	end
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	local onChange = _binding.onChange
	local renderPanelProp = _binding.renderPanel
	local keepMounted = _binding.keepMounted
	if keepMounted == nil then
		keepMounted = false
	end
	local Event = _binding.Event
	local Change = _binding.Change
	local hoveredValue, setHoveredValue = React.useState()
	local pressedValue, setPressedValue = React.useState()
	local focusedValue, setFocusedValue = React.useState()
	local uncontrolledValue, setUncontrolledValue = React.useState(function()
		local _condition = value
		if _condition == nil then
			_condition = defaultValue
		end
		return resolveInitialValue(tabs, _condition)
	end)
	local _condition = value
	if _condition == nil then
		_condition = uncontrolledValue
	end
	local selectedValue = resolveInitialValue(tabs, _condition)
	local selectedTab = findTab(tabs, selectedValue)
	local sizeStyles = resolveTabsSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
	}, props)
	local _binding_1 = useResolvedStyleProps("tabs", mergedStyleProps)
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
	React.useEffect(function()
		if value ~= nil then
			setUncontrolledValue(resolveInitialValue(tabs, value))
		end
	end, { tabs, value })
	React.useEffect(function()
		setUncontrolledValue(function(currentValue)
			return resolveInitialValue(tabs, currentValue)
		end)
	end, { tabs })
	React.useEffect(function()
		if not disabled then
			return nil
		end
		setHoveredValue(nil)
		setPressedValue(nil)
		setFocusedValue(nil)
	end, { disabled })
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _listSlotProps = slotProps
	if _listSlotProps ~= nil then
		_listSlotProps = _listSlotProps.list
	end
	local listSlotProps = _listSlotProps
	local _tabSlotProps = slotProps
	if _tabSlotProps ~= nil then
		_tabSlotProps = _tabSlotProps.tab
	end
	local tabSlotProps = _tabSlotProps
	local _tabTextSlotProps = slotProps
	if _tabTextSlotProps ~= nil then
		_tabTextSlotProps = _tabTextSlotProps.tabText
	end
	local tabTextSlotProps = _tabTextSlotProps
	local _panelSlotProps = slotProps
	if _panelSlotProps ~= nil then
		_panelSlotProps = _panelSlotProps.panel
	end
	local panelSlotProps = _panelSlotProps
	local tabCount = math.max(#tabs, 1)
	local _exp = resolveTabsListVisualStyles(theme, variant, color, disabled)
	local _result = styleOverrides
	if _result ~= nil then
		_result = _result.list
	end
	local listVisualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		disabled = disabled,
	})
	local _exp_1 = resolveTabsPanelVisualStyles(theme, variant, color, disabled)
	local _result_1 = styleOverrides
	if _result_1 ~= nil then
		_result_1 = _result_1.panel
	end
	local panelVisualStyles = applyStyleOverride(_exp_1, _result_1, {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		disabled = disabled,
	})
	local _result_2 = rootSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.ZIndex
	end
	local _condition_1 = _result_2
	if _condition_1 == nil then
		_condition_1 = props.zIndex
	end
	local resolvedRootZIndex = _condition_1
	local _result_3 = listSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.ZIndex
	end
	local _condition_2 = _result_3
	if _condition_2 == nil then
		_condition_2 = resolvedRootZIndex
	end
	local resolvedListZIndex = _condition_2
	local _result_4 = tabSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.ZIndex
	end
	local _condition_3 = _result_4
	if _condition_3 == nil then
		_condition_3 = offsetZIndex(resolvedListZIndex, 2)
	end
	local resolvedTabZIndex = _condition_3
	local _result_5 = tabTextSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.ZIndex
	end
	local _condition_4 = _result_5
	if _condition_4 == nil then
		_condition_4 = resolvedTabZIndex
	end
	local resolvedTabTextZIndex = _condition_4
	local _result_6 = panelSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.ZIndex
	end
	local _condition_5 = _result_6
	if _condition_5 == nil then
		_condition_5 = resolvedRootZIndex
	end
	local resolvedPanelZIndex = _condition_5
	local _result_7 = tabTextSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.Font
	end
	local _condition_6 = _result_7
	if _condition_6 == nil then
		_condition_6 = theme.fontFamily
	end
	local tabTextFont = _condition_6
	local _result_8 = tabTextSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.Font
	end
	local _result_9 = tabTextSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.FontFace
	end
	local tabTextFontFace = resolveTextFontFace(_result_8, _result_9, theme.fontFamily)
	local computedSize
	local computedAutoSize
	if resolvedSize ~= nil then
		computedSize = resolvedSize
	elseif resolvedWidth ~= nil and resolvedHeight ~= nil then
		computedSize = UDim2.new(resolvedWidth, resolvedHeight)
	elseif resolvedWidth ~= nil then
		computedSize = UDim2.new(resolvedWidth, UDim.new(0, 0))
		computedAutoSize = Enum.AutomaticSize.Y
	elseif resolvedHeight ~= nil then
		computedSize = UDim2.new(UDim.new(0, if fullWidth then 0 else sizeStyles.defaultWidth), resolvedHeight)
		computedAutoSize = if fullWidth then nil else Enum.AutomaticSize.X
	else
		computedSize = if fullWidth then UDim2.fromScale(1, 0) else UDim2.new(0, sizeStyles.defaultWidth, 0, 0)
		computedAutoSize = Enum.AutomaticSize.Y
	end
	local computedConstraint = if resolvedConstraint == nil then {
		min = Vector2.new(0, sizeStyles.listHeight + sizeStyles.panelMinHeight),
		max = nil,
	} else {
		min = if resolvedConstraint.min == nil then Vector2.new(0, sizeStyles.listHeight + sizeStyles.panelMinHeight) else Vector2.new(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, sizeStyles.listHeight + sizeStyles.panelMinHeight)),
		max = resolvedConstraint.max,
	}
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local rootRef = React.useCallback(function(instance)
		assignRef(ref, instance)
	end, { ref })
	local _exp_2 = composeEventMaps(Event)
	local _result_10 = rootSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.Event
	end
	local rootEvent = useRootCursorEvent(_exp_2, if _result_10 == nil then mergedStyleProps.cursor else nil, disabled)
	local commitValue = function(nextValue)
		if disabled then
			return nil
		end
		local nextTab = findTab(tabs, nextValue)
		if nextTab == nil or nextTab.disabled == true or nextValue == selectedValue then
			return nil
		end
		if value == nil then
			setUncontrolledValue(nextValue)
		end
		local _result_11 = onChange
		if _result_11 ~= nil then
			_result_11(nextValue)
		end
	end
	local commitRelativeValue = function(direction)
		local nextValue = resolveNextEnabledTabValue(tabs, selectedValue, direction)
		if nextValue ~= nil then
			commitValue(nextValue)
		end
	end
	React.useEffect(function()
		if focusedValue == nil or disabled then
			return nil
		end
		local connection = UserInputService.InputEnded:Connect(function(input)
			if isPreviousTabInput(input.KeyCode) then
				commitRelativeValue(-1)
			elseif isNextTabInput(input.KeyCode) then
				commitRelativeValue(1)
			end
		end)
		return function()
			connection:Disconnect()
		end
	end, { disabled, focusedValue, selectedValue, tabs, value })
	local renderTab = function(tab, index)
		local tabDisabled = disabled or tab.disabled == true
		local selected = tab.value == selectedValue
		local focused = focusedValue == tab.value
		local interactionState = if tabDisabled then "disabled" elseif selected then "selected" elseif pressedValue == tab.value then "pressed" elseif focused then "focused" elseif hoveredValue == tab.value then "hovered" else "idle"
		local _exp_3 = resolveTabsTabVisualStyles(theme, variant, color, interactionState)
		local _result_11 = styleOverrides
		if _result_11 ~= nil then
			_result_11 = _result_11.tab
		end
		local rawTabVisualStyles = applyStyleOverride(_exp_3, _result_11, {
			theme = theme,
			variant = variant,
			color = color,
			size = size,
			tab = tab,
			state = interactionState,
		})
		local tabEvent = {
			MouseEnter = function()
				if not tabDisabled then
					setHoveredValue(tab.value)
				end
			end,
			MouseLeave = function()
				if hoveredValue == tab.value then
					setHoveredValue(nil)
				end
				if pressedValue == tab.value then
					setPressedValue(nil)
				end
			end,
			InputBegan = function(_button, input)
				if not tabDisabled and isPressInput(input) then
					setPressedValue(tab.value)
				end
			end,
			InputEnded = function(_button, input)
				if isPressInput(input) and pressedValue == tab.value then
					setPressedValue(nil)
				end
			end,
			SelectionGained = function()
				if not tabDisabled then
					setFocusedValue(tab.value)
				end
			end,
			SelectionLost = function()
				if focusedValue == tab.value then
					setFocusedValue(nil)
				end
			end,
			Activated = function()
				commitValue(tab.value)
			end,
		}
		local _result_12 = tabSlotProps
		if _result_12 ~= nil then
			_result_12 = _result_12.Event
		end
		local mergedTabEvent = composeEventMaps(tabEvent, _result_12)
		return React.createElement(TabsTabView, {
			key = tab.value,
			tab = tab,
			index = index,
			tabCount = tabCount,
			tabDisabled = tabDisabled,
			focused = focused,
			fullWidth = fullWidth,
			interactionState = interactionState,
			tabVisualStyles = rawTabVisualStyles,
			tabEvent = mergedTabEvent,
			tabSlotProps = tabSlotProps,
			tabTextSlotProps = tabTextSlotProps,
			slotProps = slotProps,
			theme = theme,
			sizeStyles = sizeStyles,
			tabTextFont = tabTextFont,
			tabTextFontFace = tabTextFontFace,
			resolvedTabZIndex = resolvedTabZIndex,
			resolvedTabTextZIndex = resolvedTabTextZIndex,
		})
	end
	local renderPanelContent = function(tab, index, active)
		local renderState = {
			index = index,
			active = active,
		}
		local _result_11 = renderPanelProp
		if _result_11 ~= nil then
			_result_11 = _result_11(tab, renderState)
		end
		local _condition_7 = _result_11
		if _condition_7 == nil then
			_condition_7 = tab.panel
		end
		return _condition_7
	end
	local renderPanel = function(tab, index)
		local active = tab.value == selectedValue
		if not keepMounted and not active then
			return nil
		end
		local _attributes = {
			key = tab.value,
		}
		local _result_11 = panelSlotProps
		if _result_11 ~= nil then
			_result_11 = _result_11.BackgroundColor3
		end
		local _condition_7 = _result_11
		if _condition_7 == nil then
			_condition_7 = panelVisualStyles.backgroundColor
		end
		_attributes.BackgroundColor3 = _condition_7
		local _result_12 = panelSlotProps
		if _result_12 ~= nil then
			_result_12 = _result_12.BackgroundTransparency
		end
		local _condition_8 = _result_12
		if _condition_8 == nil then
			_condition_8 = panelVisualStyles.backgroundTransparency
		end
		_attributes.BackgroundTransparency = _condition_8
		_attributes.BorderSizePixel = 0
		_attributes.Size = UDim2.fromScale(1, 0)
		_attributes.AutomaticSize = Enum.AutomaticSize.Y
		_attributes.Visible = active
		_attributes.Active = false
		_attributes.Selectable = false
		_attributes.ZIndex = resolvedPanelZIndex
		_attributes.LayoutOrder = index
		if panelSlotProps then
			for _k, _v in panelSlotProps do
				_attributes[_k] = _v
			end
		end
		local _object = {
			radius = sizeStyles.panelRadius,
		}
		local _left = "slotProps"
		local _result_13 = slotProps
		if _result_13 ~= nil then
			_result_13 = _result_13.panelCorner
		end
		_object[_left] = _result_13
		local _exp_3 = renderCornerDecorator(_object)
		local _object_1 = {
			enabled = true,
			color = panelVisualStyles.strokeColor,
			transparency = panelVisualStyles.strokeTransparency,
			thickness = 1,
		}
		local _left_1 = "slotProps"
		local _result_14 = slotProps
		if _result_14 ~= nil then
			_result_14 = _result_14.panelStroke
		end
		_object_1[_left_1] = _result_14
		local _exp_4 = renderStrokeDecorator(_object_1)
		local _object_2 = {
			enabled = true,
			paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingY, "spacing", theme.spacing.sm)),
			paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingX, "spacing", theme.spacing.md)),
			paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingY, "spacing", theme.spacing.sm)),
			paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingX, "spacing", theme.spacing.md)),
		}
		local _left_2 = "slotProps"
		local _result_15 = slotProps
		if _result_15 ~= nil then
			_result_15 = _result_15.panelPadding
		end
		_object_2[_left_2] = _result_15
		return React.createElement("frame", _attributes, _exp_3, _exp_4, renderPaddingDecorator(_object_2), renderPanelContent(tab, index, active))
	end
	local _attributes = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = computedSize,
		AutomaticSize = computedAutoSize,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
		Event = rootEvent,
		Change = Change,
	}
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = rootRef
	local _object = {
		constraint = computedConstraint,
	}
	local _left = "slotProps"
	local _result_11 = slotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.sizeConstraint
	end
	_object[_left] = _result_11
	local _exp_3 = renderSizeConstraintDecorator(_object)
	local _object_1 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_1 = "slotProps"
	local _result_12 = slotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.padding
	end
	_object_1[_left_1] = _result_12
	local _exp_4 = renderPaddingDecorator(_object_1)
	local _exp_5 = React.createElement("uilistlayout", {
		FillDirection = Enum.FillDirection.Vertical,
		Padding = UDim.new(0, sizeStyles.tabGap),
		SortOrder = Enum.SortOrder.LayoutOrder,
	})
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 0, sizeStyles.listHeight),
		LayoutOrder = 0,
		Active = false,
		Selectable = false,
		ZIndex = resolvedListZIndex,
	}
	if listSlotProps then
		for _k, _v in listSlotProps do
			_attributes_1[_k] = _v
		end
	end
	local _object_2 = {
		enabled = variant == "contained",
		color = listVisualStyles.strokeColor,
		transparency = listVisualStyles.strokeTransparency,
		thickness = 1,
	}
	local _left_2 = "slotProps"
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.listStroke
	end
	_object_2[_left_2] = _result_13
	local _exp_6 = renderStrokeDecorator(_object_2)
	local _exp_7 = if variant == "line" then (React.createElement("frame", {
		key = "baseline",
		BackgroundColor3 = listVisualStyles.strokeColor,
		BackgroundTransparency = listVisualStyles.strokeTransparency,
		BorderSizePixel = 0,
		AnchorPoint = Vector2.new(0, 1),
		Position = UDim2.fromScale(0, 1),
		Size = UDim2.new(1, 0, 0, 1),
		Active = false,
		Selectable = false,
		ZIndex = resolvedListZIndex,
	})) else nil
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.listLayout
	end
	local _attributes_2 = {
		FillDirection = Enum.FillDirection.Horizontal,
		Padding = UDim.new(0, sizeStyles.tabGap),
		SortOrder = Enum.SortOrder.LayoutOrder,
		VerticalAlignment = Enum.VerticalAlignment.Center,
		HorizontalAlignment = if fullWidth then Enum.HorizontalAlignment.Center else Enum.HorizontalAlignment.Left,
	}
	if _result_14 then
		for _k, _v in _result_14 do
			_attributes_2[_k] = _v
		end
	end
	local _exp_8 = React.createElement("uilistlayout", _attributes_2)
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#tabs)
	for _k, _v in tabs do
		_newValue[_k] = renderTab(_v, _k - 1, tabs)
	end
	-- ▲ ReadonlyArray.map ▲
	local _exp_9 = React.createElement("frame", _attributes_1, _exp_6, _exp_7, React.createElement("frame", {
		key = "tab-row",
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Active = false,
		Selectable = false,
		ZIndex = resolvedListZIndex,
	}, _exp_8, _newValue))
	local _result_15
	if selectedTab ~= nil or keepMounted then
		-- ▼ ReadonlyArray.map ▼
		local _newValue_1 = table.create(#tabs)
		for _k, _v in tabs do
			_newValue_1[_k] = renderPanel(_v, _k - 1, tabs)
		end
		-- ▲ ReadonlyArray.map ▲
		_result_15 = _newValue_1
	else
		_result_15 = nil
	end
	return React.createElement("frame", _attributes, _exp_3, _exp_4, _exp_5, _exp_9, _result_15)
end)
local Tabs = TabsBase
Tabs.displayName = "Tabs"
return {
	Tabs = Tabs,
}
