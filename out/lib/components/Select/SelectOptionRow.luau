-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveSelectOptionMotionTransition = _styles.resolveSelectOptionMotionTransition
local resolveSelectOptionVisualStyles = _styles.resolveSelectOptionVisualStyles
local _utils = TS.import(script, script.Parent, "utils")
local composeEventMaps = _utils.composeEventMaps
local resolveTextFontFace = _utils.resolveTextFontFace
local function SelectOptionRow(props)
	local theme = useTheme()
	local _binding = props
	local option = _binding.option
	local selected = _binding.selected
	local color = _binding.color
	local size = _binding.size
	local sizeStyles = _binding.sizeStyles
	local slotProps = _binding.slotProps
	local styleOverrides = _binding.styleOverrides
	local zIndex = _binding.zIndex
	local cursor = _binding.cursor
	local onSelect = _binding.onSelect
	local _optionSlotProps = slotProps
	if _optionSlotProps ~= nil then
		_optionSlotProps = _optionSlotProps.option
	end
	local optionSlotProps = _optionSlotProps
	local _optionTextSlotProps = slotProps
	if _optionTextSlotProps ~= nil then
		_optionTextSlotProps = _optionTextSlotProps.optionText
	end
	local optionTextSlotProps = _optionTextSlotProps
	local optionDisabled = option.disabled == true
	local hovered, setHovered = React.useState(false)
	React.useEffect(function()
		if not optionDisabled then
			return nil
		end
		setHovered(false)
	end, { optionDisabled })
	local visualState = if optionDisabled then "disabled" elseif selected then "selected" elseif hovered then "hovered" else "idle"
	local _exp = resolveSelectOptionVisualStyles(theme, color, visualState)
	local _result = styleOverrides
	if _result ~= nil then
		_result = _result.option
	end
	local visualStyles = applyStyleOverride(_exp, _result, {
		theme = theme,
		color = color,
		size = size,
		option = option,
		state = visualState,
	})
	local animated = useMotion({
		values = {
			backgroundColor = visualStyles.backgroundColor,
			backgroundTransparency = visualStyles.backgroundTransparency,
			textColor = visualStyles.textColor,
			textTransparency = visualStyles.textTransparency,
		},
		transition = resolveSelectOptionMotionTransition(visualState),
	})
	local _result_1 = optionTextSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Font
	end
	local _condition = _result_1
	if _condition == nil then
		_condition = theme.fontFamily
	end
	local resolvedTextFont = _condition
	local _result_2 = optionTextSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.Font
	end
	local _result_3 = optionTextSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.FontFace
	end
	local resolvedTextFontFace = resolveTextFontFace(_result_2, _result_3, theme.fontFamily)
	local _result_4 = optionTextSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.TextSize
	end
	local _condition_1 = _result_4
	if _condition_1 == nil then
		_condition_1 = sizeStyles.fontSize
	end
	local resolvedTextSize = _condition_1
	local _result_5 = optionTextSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.LineHeight
	end
	local _condition_2 = _result_5
	if _condition_2 == nil then
		_condition_2 = sizeStyles.lineHeight
	end
	local resolvedLineHeight = _condition_2
	local _result_6 = optionSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.ZIndex
	end
	local _condition_3 = _result_6
	if _condition_3 == nil then
		_condition_3 = zIndex
	end
	local resolvedButtonZIndex = _condition_3
	local _result_7 = optionTextSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.ZIndex
	end
	local _condition_4 = _result_7
	if _condition_4 == nil then
		_condition_4 = resolvedButtonZIndex
	end
	local resolvedTextZIndex = _condition_4
	local internalEvent = {
		MouseEnter = function()
			if optionDisabled then
				return nil
			end
			setHovered(true)
		end,
		MouseLeave = function()
			setHovered(false)
		end,
		Activated = function()
			if optionDisabled then
				return nil
			end
			onSelect(option.value)
		end,
	}
	local _result_8 = optionSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.Event
	end
	local _exp_1 = composeEventMaps(internalEvent, _result_8)
	local _result_9 = optionSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.Event
	end
	local rootEvent = useRootCursorEvent(_exp_1, if _result_9 == nil then cursor else nil, optionDisabled)
	local _attributes = {
		AutoButtonColor = false,
		Active = not optionDisabled,
		Selectable = not optionDisabled,
		BackgroundColor3 = animated.backgroundColor,
		BackgroundTransparency = animated.backgroundTransparency,
		BorderSizePixel = 0,
		Size = UDim2.new(1, 0, 0, sizeStyles.optionHeight),
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedButtonZIndex,
		Event = rootEvent,
	}
	if optionSlotProps then
		for _k, _v in optionSlotProps do
			_attributes[_k] = _v
		end
	end
	local _object = {
		radius = sizeStyles.optionRadius,
	}
	local _left = "slotProps"
	local _result_10 = slotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.optionCorner
	end
	_object[_left] = _result_10
	local _exp_2 = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		paddingTop = UDim.new(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingY, "spacing", 0)),
		paddingRight = UDim.new(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingX, "spacing", 0)),
		paddingBottom = UDim.new(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingY, "spacing", 0)),
		paddingLeft = UDim.new(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingX, "spacing", 0)),
	}
	local _left_1 = "slotProps"
	local _result_11 = slotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.optionPadding
	end
	_object_1[_left_1] = _result_11
	local _exp_3 = renderPaddingDecorator(_object_1)
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
	}
	local _result_12 = optionTextSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.Text
	end
	local _condition_5 = _result_12
	if _condition_5 == nil then
		_condition_5 = option.label
	end
	_attributes_1.Text = _condition_5
	local _result_13 = optionTextSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.TextColor3
	end
	local _condition_6 = _result_13
	if _condition_6 == nil then
		_condition_6 = animated.textColor
	end
	_attributes_1.TextColor3 = _condition_6
	local _result_14 = optionTextSlotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.TextTransparency
	end
	local _condition_7 = _result_14
	if _condition_7 == nil then
		_condition_7 = animated.textTransparency
	end
	_attributes_1.TextTransparency = _condition_7
	local _result_15 = optionTextSlotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.TextStrokeTransparency
	end
	local _condition_8 = _result_15
	if _condition_8 == nil then
		_condition_8 = 1
	end
	_attributes_1.TextStrokeTransparency = _condition_8
	_attributes_1.TextSize = resolvedTextSize
	_attributes_1.Font = resolvedTextFont
	_attributes_1.FontFace = resolvedTextFontFace
	_attributes_1.LineHeight = resolvedLineHeight
	local _result_16 = optionTextSlotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.TextWrapped
	end
	local _condition_9 = _result_16
	if _condition_9 == nil then
		_condition_9 = false
	end
	_attributes_1.TextWrapped = _condition_9
	local _result_17 = optionTextSlotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.TextTruncate
	end
	local _condition_10 = _result_17
	if _condition_10 == nil then
		_condition_10 = Enum.TextTruncate.AtEnd
	end
	_attributes_1.TextTruncate = _condition_10
	local _result_18 = optionTextSlotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.TextXAlignment
	end
	local _condition_11 = _result_18
	if _condition_11 == nil then
		_condition_11 = Enum.TextXAlignment.Left
	end
	_attributes_1.TextXAlignment = _condition_11
	local _result_19 = optionTextSlotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.TextYAlignment
	end
	local _condition_12 = _result_19
	if _condition_12 == nil then
		_condition_12 = Enum.TextYAlignment.Center
	end
	_attributes_1.TextYAlignment = _condition_12
	local _result_20 = optionTextSlotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.TextScaled
	end
	local _condition_13 = _result_20
	if _condition_13 == nil then
		_condition_13 = false
	end
	_attributes_1.TextScaled = _condition_13
	local _result_21 = optionTextSlotProps
	if _result_21 ~= nil then
		_result_21 = _result_21.RichText
	end
	local _condition_14 = _result_21
	if _condition_14 == nil then
		_condition_14 = false
	end
	_attributes_1.RichText = _condition_14
	_attributes_1.ZIndex = resolvedTextZIndex
	if optionTextSlotProps then
		for _k, _v in optionTextSlotProps do
			_attributes_1[_k] = _v
		end
	end
	return React.createElement("textbutton", _attributes, _exp_2, _exp_3, React.createElement("textlabel", _attributes_1))
end
return {
	SelectOptionRow = SelectOptionRow,
}
