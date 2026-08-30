-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local getLucideIconAsset = TS.import(script, script.Parent.Parent.Parent, "icons", "lucide").getLucideIconAsset
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
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
local resolveUDimSafe = _useResolvedStyleProps.resolveUDimSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local _styles = TS.import(script, script.Parent, "styles")
local resolveKeybindInputMotionTransition = _styles.resolveKeybindInputMotionTransition
local resolveKeybindInputSizeStyles = _styles.resolveKeybindInputSizeStyles
local resolveKeybindInputVisualStyles = _styles.resolveKeybindInputVisualStyles
local UserInputService = game:GetService("UserInputService")
local GAMEPAD_KEYCODE_MIN = Enum.KeyCode.ButtonX.Value
local GAMEPAD_KEYCODE_MAX = Enum.KeyCode.Thumbstick2Right.Value
local DEFAULT_CANCEL_KEY_CODES = { Enum.KeyCode.Escape, Enum.KeyCode.ButtonSelect }
local SPECIAL_KEY_LABELS = {
	[Enum.KeyCode.LeftShift] = "Left Shift",
	[Enum.KeyCode.RightShift] = "Right Shift",
	[Enum.KeyCode.LeftControl] = "Left Ctrl",
	[Enum.KeyCode.RightControl] = "Right Ctrl",
	[Enum.KeyCode.LeftAlt] = "Left Alt",
	[Enum.KeyCode.RightAlt] = "Right Alt",
	[Enum.KeyCode.Return] = "Enter",
	[Enum.KeyCode.Escape] = "Esc",
	[Enum.KeyCode.Backspace] = "Backspace",
	[Enum.KeyCode.Delete] = "Delete",
	[Enum.KeyCode.Space] = "Space",
}
local GAMEPAD_KEY_LABELS = {
	[Enum.KeyCode.ButtonA] = "A",
	[Enum.KeyCode.ButtonB] = "B",
	[Enum.KeyCode.ButtonX] = "X",
	[Enum.KeyCode.ButtonY] = "Y",
	[Enum.KeyCode.ButtonL1] = "LB",
	[Enum.KeyCode.ButtonR1] = "RB",
	[Enum.KeyCode.ButtonL2] = "LT",
	[Enum.KeyCode.ButtonR2] = "RT",
}
local DISPLAY_DEVICE_ICON_NAMES = table.freeze({
	keyboard = "keyboard",
	mouse = "mouse",
	gamepad = "gamepad-2",
})
local GAMEPAD_FACE_BUTTON_BADGES = {
	ButtonA = {
		label = "A",
		backgroundColor = Color3.fromRGB(67, 190, 70),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	ButtonB = {
		label = "B",
		backgroundColor = Color3.fromRGB(255, 40, 62),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	ButtonX = {
		label = "X",
		backgroundColor = Color3.fromRGB(16, 137, 224),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	ButtonY = {
		label = "Y",
		backgroundColor = Color3.fromRGB(255, 197, 22),
		textColor = Color3.fromRGB(18, 24, 33),
	},
	ButtonCross = {
		label = "✕",
		backgroundColor = Color3.fromRGB(30, 112, 229),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	ButtonCircle = {
		label = "○",
		backgroundColor = Color3.fromRGB(232, 38, 68),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	ButtonSquare = {
		label = "□",
		backgroundColor = Color3.fromRGB(218, 65, 151),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	ButtonTriangle = {
		label = "△",
		backgroundColor = Color3.fromRGB(39, 176, 104),
		textColor = Color3.fromRGB(245, 249, 255),
	},
}
local PLAYSTATION_FACE_BUTTON_GLYPH_COLORS = {
	ButtonCross = Color3.fromRGB(30, 112, 229),
	ButtonCircle = Color3.fromRGB(232, 38, 68),
	ButtonSquare = Color3.fromRGB(218, 65, 151),
	ButtonTriangle = Color3.fromRGB(39, 176, 104),
}
local GAMEPAD_FACE_BUTTON_FALLBACK_BADGES = {
	[Enum.KeyCode.ButtonA] = {
		label = "A",
		backgroundColor = Color3.fromRGB(67, 190, 70),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	[Enum.KeyCode.ButtonB] = {
		label = "B",
		backgroundColor = Color3.fromRGB(255, 40, 62),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	[Enum.KeyCode.ButtonX] = {
		label = "X",
		backgroundColor = Color3.fromRGB(16, 137, 224),
		textColor = Color3.fromRGB(245, 249, 255),
	},
	[Enum.KeyCode.ButtonY] = {
		label = "Y",
		backgroundColor = Color3.fromRGB(255, 197, 22),
		textColor = Color3.fromRGB(18, 24, 33),
	},
}
local GAMEPAD_SHOULDER_BUTTON_LABELS = {
	ButtonL1 = "L1",
	ButtonR1 = "R1",
	ButtonL2 = "L2",
	ButtonR2 = "R2",
	ButtonLB = "LB",
	ButtonRB = "RB",
	ButtonLT = "LT",
	ButtonRT = "RT",
}
local GAMEPAD_SHOULDER_BUTTON_FALLBACK_LABELS = {
	[Enum.KeyCode.ButtonL1] = "L1",
	[Enum.KeyCode.ButtonR1] = "R1",
	[Enum.KeyCode.ButtonL2] = "L2",
	[Enum.KeyCode.ButtonR2] = "R2",
}
local function isGamepadKeyCode(keyCode)
	return keyCode.Value >= GAMEPAD_KEYCODE_MIN and keyCode.Value <= GAMEPAD_KEYCODE_MAX
end
local function isGamepadInput(input)
	return input.UserInputType == Enum.UserInputType.Gamepad1 or input.UserInputType == Enum.UserInputType.Gamepad2 or input.UserInputType == Enum.UserInputType.Gamepad3 or input.UserInputType == Enum.UserInputType.Gamepad4 or input.UserInputType == Enum.UserInputType.Gamepad5 or input.UserInputType == Enum.UserInputType.Gamepad6 or input.UserInputType == Enum.UserInputType.Gamepad7 or input.UserInputType == Enum.UserInputType.Gamepad8
end
local function isDeviceAllowed(input, captureDevice)
	if captureDevice == "keyboard" then
		return input.UserInputType == Enum.UserInputType.Keyboard
	end
	if captureDevice == "gamepad" then
		return isGamepadInput(input)
	end
	return input.UserInputType == Enum.UserInputType.Keyboard or isGamepadInput(input)
end
local function containsKeyCode(values, keyCode)
	if values == nil then
		return false
	end
	for _, value in values do
		if value == keyCode then
			return true
		end
	end
	return false
end
local function isAllowedKeyCode(keyCode, allowed, blocked)
	if keyCode == Enum.KeyCode.Unknown then
		return false
	end
	if containsKeyCode(blocked, keyCode) then
		return false
	end
	return allowed == nil or containsKeyCode(allowed, keyCode)
end
local function resolveKeyCodeLabel(keyCode)
	if keyCode == Enum.KeyCode.Unknown then
		return ""
	end
	local _keyCode = keyCode
	local specialLabel = SPECIAL_KEY_LABELS[_keyCode]
	if specialLabel ~= nil then
		return specialLabel
	end
	if not isGamepadKeyCode(keyCode) then
		local layoutLabel = UserInputService:GetStringForKeyCode(keyCode)
		if layoutLabel ~= "" then
			return layoutLabel
		end
	end
	local _keyCode_1 = keyCode
	local _condition = GAMEPAD_KEY_LABELS[_keyCode_1]
	if _condition == nil then
		_condition = keyCode.Name
	end
	return _condition
end
local function resolveKeybindInteractionState(disabled, readOnly, capturing, pressed, hovered)
	if disabled then
		return "disabled"
	end
	if readOnly then
		return "readOnly"
	end
	if capturing then
		return "capturing"
	end
	if pressed then
		return "pressed"
	end
	return if hovered then "hovered" else "idle"
end
local function resolveKeybindComputedLayout(fullWidth, resolvedWidth, resolvedHeight, resolvedSize, resolvedConstraint, sizeStyles)
	local width = if fullWidth then resolveUDimSafe("keybindInput", "100%", "width") else (resolvedWidth or UDim.new(0, sizeStyles.defaultWidth))
	local height = resolvedHeight or UDim.new(0, sizeStyles.minHeight)
	local _minConstraint = resolvedConstraint
	if _minConstraint ~= nil then
		_minConstraint = _minConstraint.min
	end
	local minConstraint = _minConstraint
	local _object = {
		size = resolvedSize or UDim2.new(width, height),
	}
	local _left = "constraint"
	local _object_1 = {
		min = if minConstraint == nil then Vector2.new(0, sizeStyles.minHeight) else Vector2.new(minConstraint.X, math.max(minConstraint.Y, sizeStyles.minHeight)),
	}
	local _left_1 = "max"
	local _result = resolvedConstraint
	if _result ~= nil then
		_result = _result.max
	end
	_object_1[_left_1] = _result
	_object[_left] = _object_1
	return _object
end
local function resolveKeybindTileZIndexes(slotProps, rootZIndex)
	local _result = slotProps
	if _result ~= nil then
		_result = _result.trigger
		if _result ~= nil then
			_result = _result.ZIndex
		end
	end
	local _condition = _result
	if _condition == nil then
		_condition = rootZIndex
	end
	local trigger = _condition
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.content
		if _result_1 ~= nil then
			_result_1 = _result_1.ZIndex
		end
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = trigger
	end
	local content = _condition_1
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.keycap
		if _result_2 ~= nil then
			_result_2 = _result_2.ZIndex
		end
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = content
	end
	local keycap = _condition_2
	local _object = {
		root = rootZIndex,
		trigger = trigger,
		content = content,
	}
	local _left = "deviceFrame"
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.deviceFrame
		if _result_3 ~= nil then
			_result_3 = _result_3.ZIndex
		end
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = content
	end
	_object[_left] = _condition_3
	local _left_1 = "deviceIcon"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.deviceIcon
		if _result_4 ~= nil then
			_result_4 = _result_4.ZIndex
		end
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		local _result_5 = slotProps
		if _result_5 ~= nil then
			_result_5 = _result_5.deviceFrame
			if _result_5 ~= nil then
				_result_5 = _result_5.ZIndex
			end
		end
		_condition_4 = _result_5
		if _condition_4 == nil then
			_condition_4 = content
		end
	end
	_object[_left_1] = _condition_4
	_object.keycap = keycap
	local _left_2 = "gamepadGlyph"
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.gamepadGlyph
		if _result_5 ~= nil then
			_result_5 = _result_5.ZIndex
		end
	end
	local _condition_5 = _result_5
	if _condition_5 == nil then
		_condition_5 = keycap
	end
	_object[_left_2] = _condition_5
	local _left_3 = "label"
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.label
		if _result_6 ~= nil then
			_result_6 = _result_6.ZIndex
		end
	end
	local _condition_6 = _result_6
	if _condition_6 == nil then
		_condition_6 = keycap
	end
	_object[_left_3] = _condition_6
	local _left_4 = "hint"
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.hint
		if _result_7 ~= nil then
			_result_7 = _result_7.ZIndex
		end
	end
	local _condition_7 = _result_7
	if _condition_7 == nil then
		local _result_8 = slotProps
		if _result_8 ~= nil then
			_result_8 = _result_8.label
			if _result_8 ~= nil then
				_result_8 = _result_8.ZIndex
			end
		end
		_condition_7 = _result_8
		if _condition_7 == nil then
			_condition_7 = keycap
		end
	end
	_object[_left_4] = _condition_7
	return _object
end
local function resolveGamepadGlyphImage(keyCode)
	if not isGamepadKeyCode(keyCode) then
		return nil
	end
	local image = UserInputService:GetImageForKeyCode(keyCode)
	return if image == "" then nil else image
end
local function resolveGamepadPlatformName(keyCode)
	local platformName = UserInputService:GetStringForKeyCode(keyCode)
	return if platformName == "" then keyCode.Name else platformName
end
local function shouldPreferNativeGamepadGlyph(platformName)
	local _platformName = platformName
	local _condition = PLAYSTATION_FACE_BUTTON_GLYPH_COLORS[_platformName] ~= nil
	if not _condition then
		local _platformName_1 = platformName
		_condition = GAMEPAD_SHOULDER_BUTTON_LABELS[_platformName_1] ~= nil
	end
	return _condition
end
local function resolveDeviceIconName(captureDevice, displayDevice, value, capturing)
	if displayDevice ~= nil then
		return DISPLAY_DEVICE_ICON_NAMES[displayDevice]
	end
	local shouldShowGamepadIcon = captureDevice == "gamepad" or (not capturing and isGamepadKeyCode(value))
	return if shouldShowGamepadIcon then "gamepad-2" else "keyboard"
end
local function resolveGamepadFaceBadgeStyle(keyCode, platformName, sizeStyles)
	local _platformName = platformName
	local _condition = GAMEPAD_FACE_BUTTON_BADGES[_platformName]
	if _condition == nil then
		local _keyCode = keyCode
		_condition = GAMEPAD_FACE_BUTTON_FALLBACK_BADGES[_keyCode]
	end
	local faceButtonBadge = _condition
	if faceButtonBadge == nil then
		return nil
	end
	local badgeSize = math.max(16, sizeStyles.gamepadGlyphSize - 3)
	return {
		label = faceButtonBadge.label,
		backgroundColor = faceButtonBadge.backgroundColor,
		textColor = faceButtonBadge.textColor,
		strokeColor = faceButtonBadge.backgroundColor,
		strokeTransparency = 1,
		strokeThickness = 0,
		size = UDim2.fromOffset(badgeSize, badgeSize),
		radius = UDim.new(1, 0),
		fontSize = math.max(11, sizeStyles.fontSize - 3),
	}
end
local function resolveGamepadShoulderBadgeStyle(keyCode, platformName, sizeStyles)
	local _platformName = platformName
	local _condition = GAMEPAD_SHOULDER_BUTTON_LABELS[_platformName]
	if _condition == nil then
		local _keyCode = keyCode
		_condition = GAMEPAD_SHOULDER_BUTTON_FALLBACK_LABELS[_keyCode]
	end
	local shoulderButtonLabel = _condition
	if shoulderButtonLabel == nil then
		return nil
	end
	local badgeHeight = math.max(16, sizeStyles.gamepadGlyphSize - 7)
	local badgeWidth = badgeHeight + 10
	return {
		label = shoulderButtonLabel,
		backgroundColor = Color3.fromRGB(24, 28, 34),
		textColor = Color3.fromRGB(245, 249, 255),
		strokeColor = Color3.fromRGB(217, 224, 234),
		strokeTransparency = 0,
		strokeThickness = 1,
		size = UDim2.fromOffset(badgeWidth, badgeHeight),
		radius = UDim.new(0, 3),
		fontSize = math.max(10, sizeStyles.fontSize - 6),
	}
end
local function resolveGamepadBadgeStyle(keyCode, platformName, sizeStyles)
	return resolveGamepadFaceBadgeStyle(keyCode, platformName, sizeStyles) or resolveGamepadShoulderBadgeStyle(keyCode, platformName, sizeStyles)
end
local function GamepadBadge(_param)
	local state = _param.state
	local _binding = state
	local badge = _binding.badge
	local font = _binding.font
	local fontFace = _binding.fontFace
	local positionOffset = _binding.positionOffset
	local zIndex = _binding.zIndex
	return React.createElement("frame", {
		BackgroundColor3 = badge.backgroundColor,
		BackgroundTransparency = 0,
		BorderSizePixel = 0,
		Position = UDim2.new(0.5, positionOffset, 0.5, 0),
		AnchorPoint = Vector2.new(0.5, 0.5),
		Size = badge.size,
		ZIndex = zIndex,
	}, renderCornerDecorator({
		radius = badge.radius,
	}), renderStrokeDecorator({
		enabled = badge.strokeThickness > 0,
		color = badge.strokeColor,
		transparency = badge.strokeTransparency,
		thickness = badge.strokeThickness,
	}), React.createElement("textlabel", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromScale(0, 0),
		Size = UDim2.fromScale(1, 1),
		Text = badge.label,
		TextColor3 = badge.textColor,
		TextTransparency = 0,
		TextStrokeTransparency = 1,
		TextSize = badge.fontSize,
		Font = font,
		FontFace = fontFace,
		LineHeight = 1,
		TextWrapped = false,
		TextTruncate = Enum.TextTruncate.None,
		TextXAlignment = Enum.TextXAlignment.Center,
		TextYAlignment = Enum.TextYAlignment.Center,
		ZIndex = incrementZIndex(zIndex, 1),
	}))
end
local function KeybindValueContent(_param)
	local contentState = _param.contentState
	local layout = _param.layout
	local sizeStyles = _param.sizeStyles
	local slotProps = _param.slotProps
	local colors = _param.colors
	local zIndexes = _param.zIndexes
	local theme = useTheme()
	local _gamepadGlyphSlotProps = slotProps
	if _gamepadGlyphSlotProps ~= nil then
		_gamepadGlyphSlotProps = _gamepadGlyphSlotProps.gamepadGlyph
	end
	local gamepadGlyphSlotProps = _gamepadGlyphSlotProps
	local _labelSlotProps = slotProps
	if _labelSlotProps ~= nil then
		_labelSlotProps = _labelSlotProps.label
	end
	local labelSlotProps = _labelSlotProps
	local _hintSlotProps = slotProps
	if _hintSlotProps ~= nil then
		_hintSlotProps = _hintSlotProps.hint
	end
	local hintSlotProps = _hintSlotProps
	local _result = labelSlotProps
	if _result ~= nil then
		_result = _result.Font
	end
	local _condition = _result
	if _condition == nil then
		_condition = theme.fontFamily
	end
	local resolvedLabelFont = _condition
	local _result_1 = labelSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Font
	end
	local _result_2 = labelSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.FontFace
	end
	local resolvedLabelFontFace = resolveTextFontFace(_result_1, _result_2, theme.fontFamily)
	local _result_3 = hintSlotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.Font
	end
	local _condition_1 = _result_3
	if _condition_1 == nil then
		_condition_1 = theme.fontFamily
	end
	local resolvedHintFont = _condition_1
	local _result_4 = hintSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.Font
	end
	local _result_5 = hintSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.FontFace
	end
	local resolvedHintFontFace = resolveTextFontFace(_result_4, _result_5, theme.fontFamily)
	local gamepadPlatformName = if contentState.hasValue then resolveGamepadPlatformName(contentState.value) else nil
	local playStationGlyphColor = if gamepadPlatformName == nil then nil else PLAYSTATION_FACE_BUTTON_GLYPH_COLORS[gamepadPlatformName]
	local shouldUseNativeGamepadGlyph = gamepadPlatformName ~= nil and shouldPreferNativeGamepadGlyph(gamepadPlatformName)
	local _condition_2 = shouldUseNativeGamepadGlyph and not contentState.capturing
	if _condition_2 then
		local _result_6 = labelSlotProps
		if _result_6 ~= nil then
			_result_6 = _result_6.Text
		end
		_condition_2 = _result_6 == nil
	end
	local preferredGamepadGlyphImage = if _condition_2 then resolveGamepadGlyphImage(contentState.value) else nil
	local _condition_3 = preferredGamepadGlyphImage == nil and gamepadPlatformName ~= nil and not contentState.capturing
	if _condition_3 then
		local _result_6 = labelSlotProps
		if _result_6 ~= nil then
			_result_6 = _result_6.Text
		end
		_condition_3 = _result_6 == nil
	end
	local gamepadBadge = if _condition_3 then resolveGamepadBadgeStyle(contentState.value, gamepadPlatformName, sizeStyles) else nil
	local _condition_4 = preferredGamepadGlyphImage
	if _condition_4 == nil then
		_condition_4 = (if gamepadBadge == nil and not contentState.capturing and contentState.hasValue then resolveGamepadGlyphImage(contentState.value) else nil)
	end
	local gamepadGlyphImage = _condition_4
	local _condition_5 = gamepadGlyphImage ~= nil
	if _condition_5 then
		local _result_6 = labelSlotProps
		if _result_6 ~= nil then
			_result_6 = _result_6.Text
		end
		_condition_5 = _result_6 == nil
	end
	local shouldRenderGamepadGlyph = _condition_5
	local gamepadGlyphSize = math.max(14, sizeStyles.gamepadGlyphSize - 4)
	local gamepadGlyphColor = if preferredGamepadGlyphImage == nil then colors.labelColor else (playStationGlyphColor or colors.labelColor)
	local _condition_6 = contentState.hintText ~= ""
	if not _condition_6 then
		local _result_6 = hintSlotProps
		if _result_6 ~= nil then
			_result_6 = _result_6.Text
		end
		_condition_6 = _result_6 ~= nil
	end
	local shouldRenderHint = _condition_6
	local labelHeight = if shouldRenderHint then 0.62 else 1
	local valueWidthOffset = -(layout.leftTextReserve + layout.rightTextReserve)
	local _exp = if gamepadBadge ~= nil then (React.createElement(GamepadBadge, {
		state = {
			badge = gamepadBadge,
			font = resolvedLabelFont,
			fontFace = resolvedLabelFontFace,
			positionOffset = layout.centeredContentOffset,
			zIndex = zIndexes.gamepadGlyph,
		},
	})) else nil
	local _result_6
	if shouldRenderGamepadGlyph then
		local _attributes = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Position = UDim2.new(0.5, layout.centeredContentOffset, 0.5, 0),
			AnchorPoint = Vector2.new(0.5, 0.5),
			Size = UDim2.fromOffset(gamepadGlyphSize, gamepadGlyphSize),
			Image = gamepadGlyphImage,
		}
		local _result_7 = gamepadGlyphSlotProps
		if _result_7 ~= nil then
			_result_7 = _result_7.ImageColor3
		end
		local _condition_7 = _result_7
		if _condition_7 == nil then
			_condition_7 = gamepadGlyphColor
		end
		_attributes.ImageColor3 = _condition_7
		_attributes.ScaleType = Enum.ScaleType.Fit
		_attributes.ZIndex = zIndexes.gamepadGlyph
		if gamepadGlyphSlotProps then
			for _k, _v in gamepadGlyphSlotProps do
				_attributes[_k] = _v
			end
		end
		_result_6 = (React.createElement("imagelabel", _attributes))
	else
		_result_6 = nil
	end
	local _attributes = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.new(0, layout.leftTextReserve, 0, 0),
		Size = UDim2.new(1, valueWidthOffset, labelHeight, 0),
	}
	local _result_7 = labelSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.Visible
	end
	local _condition_7 = _result_7
	if _condition_7 == nil then
		_condition_7 = (gamepadBadge == nil and not shouldRenderGamepadGlyph)
	end
	_attributes.Visible = _condition_7
	local _result_8 = labelSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.Text
	end
	local _condition_8 = _result_8
	if _condition_8 == nil then
		_condition_8 = contentState.displayText
	end
	_attributes.Text = _condition_8
	local _result_9 = labelSlotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.TextColor3
	end
	local _condition_9 = _result_9
	if _condition_9 == nil then
		_condition_9 = colors.labelColor
	end
	_attributes.TextColor3 = _condition_9
	local _result_10 = labelSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.TextTransparency
	end
	local _condition_10 = _result_10
	if _condition_10 == nil then
		_condition_10 = colors.labelTransparency
	end
	_attributes.TextTransparency = _condition_10
	local _result_11 = labelSlotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.TextStrokeTransparency
	end
	local _condition_11 = _result_11
	if _condition_11 == nil then
		_condition_11 = 1
	end
	_attributes.TextStrokeTransparency = _condition_11
	local _result_12 = labelSlotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.TextSize
	end
	local _condition_12 = _result_12
	if _condition_12 == nil then
		_condition_12 = sizeStyles.fontSize
	end
	_attributes.TextSize = _condition_12
	_attributes.Font = resolvedLabelFont
	_attributes.FontFace = resolvedLabelFontFace
	local _result_13 = labelSlotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.LineHeight
	end
	local _condition_13 = _result_13
	if _condition_13 == nil then
		_condition_13 = sizeStyles.lineHeight
	end
	_attributes.LineHeight = _condition_13
	local _result_14 = labelSlotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.TextWrapped
	end
	local _condition_14 = _result_14
	if _condition_14 == nil then
		_condition_14 = false
	end
	_attributes.TextWrapped = _condition_14
	local _result_15 = labelSlotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.TextTruncate
	end
	local _condition_15 = _result_15
	if _condition_15 == nil then
		_condition_15 = Enum.TextTruncate.AtEnd
	end
	_attributes.TextTruncate = _condition_15
	local _result_16 = labelSlotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.TextXAlignment
	end
	local _condition_16 = _result_16
	if _condition_16 == nil then
		_condition_16 = Enum.TextXAlignment.Center
	end
	_attributes.TextXAlignment = _condition_16
	local _result_17 = labelSlotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.TextYAlignment
	end
	local _condition_17 = _result_17
	if _condition_17 == nil then
		_condition_17 = (if shouldRenderHint then Enum.TextYAlignment.Bottom else Enum.TextYAlignment.Center)
	end
	_attributes.TextYAlignment = _condition_17
	local _result_18 = labelSlotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.TextScaled
	end
	local _condition_18 = _result_18
	if _condition_18 == nil then
		_condition_18 = false
	end
	_attributes.TextScaled = _condition_18
	local _result_19 = labelSlotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.RichText
	end
	local _condition_19 = _result_19
	if _condition_19 == nil then
		_condition_19 = false
	end
	_attributes.RichText = _condition_19
	_attributes.ZIndex = zIndexes.label
	if labelSlotProps then
		for _k, _v in labelSlotProps do
			_attributes[_k] = _v
		end
	end
	local _exp_1 = React.createElement("textlabel", _attributes)
	local _result_20
	if shouldRenderHint then
		local _attributes_1 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Position = UDim2.new(0, layout.leftTextReserve, 0.62, 0),
			Size = UDim2.new(1, valueWidthOffset, 0.38, 0),
		}
		local _result_21 = hintSlotProps
		if _result_21 ~= nil then
			_result_21 = _result_21.Text
		end
		local _condition_20 = _result_21
		if _condition_20 == nil then
			_condition_20 = contentState.hintText
		end
		_attributes_1.Text = _condition_20
		local _result_22 = hintSlotProps
		if _result_22 ~= nil then
			_result_22 = _result_22.TextColor3
		end
		local _condition_21 = _result_22
		if _condition_21 == nil then
			_condition_21 = colors.hintColor
		end
		_attributes_1.TextColor3 = _condition_21
		local _result_23 = hintSlotProps
		if _result_23 ~= nil then
			_result_23 = _result_23.TextTransparency
		end
		local _condition_22 = _result_23
		if _condition_22 == nil then
			_condition_22 = colors.hintTransparency
		end
		_attributes_1.TextTransparency = _condition_22
		local _result_24 = hintSlotProps
		if _result_24 ~= nil then
			_result_24 = _result_24.TextStrokeTransparency
		end
		local _condition_23 = _result_24
		if _condition_23 == nil then
			_condition_23 = 1
		end
		_attributes_1.TextStrokeTransparency = _condition_23
		local _result_25 = hintSlotProps
		if _result_25 ~= nil then
			_result_25 = _result_25.TextSize
		end
		local _condition_24 = _result_25
		if _condition_24 == nil then
			_condition_24 = sizeStyles.hintFontSize
		end
		_attributes_1.TextSize = _condition_24
		_attributes_1.Font = resolvedHintFont
		_attributes_1.FontFace = resolvedHintFontFace
		local _result_26 = hintSlotProps
		if _result_26 ~= nil then
			_result_26 = _result_26.LineHeight
		end
		local _condition_25 = _result_26
		if _condition_25 == nil then
			_condition_25 = sizeStyles.lineHeight
		end
		_attributes_1.LineHeight = _condition_25
		local _result_27 = hintSlotProps
		if _result_27 ~= nil then
			_result_27 = _result_27.TextWrapped
		end
		local _condition_26 = _result_27
		if _condition_26 == nil then
			_condition_26 = false
		end
		_attributes_1.TextWrapped = _condition_26
		local _result_28 = hintSlotProps
		if _result_28 ~= nil then
			_result_28 = _result_28.TextTruncate
		end
		local _condition_27 = _result_28
		if _condition_27 == nil then
			_condition_27 = Enum.TextTruncate.AtEnd
		end
		_attributes_1.TextTruncate = _condition_27
		local _result_29 = hintSlotProps
		if _result_29 ~= nil then
			_result_29 = _result_29.TextXAlignment
		end
		local _condition_28 = _result_29
		if _condition_28 == nil then
			_condition_28 = Enum.TextXAlignment.Center
		end
		_attributes_1.TextXAlignment = _condition_28
		local _result_30 = hintSlotProps
		if _result_30 ~= nil then
			_result_30 = _result_30.TextYAlignment
		end
		local _condition_29 = _result_30
		if _condition_29 == nil then
			_condition_29 = Enum.TextYAlignment.Top
		end
		_attributes_1.TextYAlignment = _condition_29
		local _result_31 = hintSlotProps
		if _result_31 ~= nil then
			_result_31 = _result_31.TextScaled
		end
		local _condition_30 = _result_31
		if _condition_30 == nil then
			_condition_30 = false
		end
		_attributes_1.TextScaled = _condition_30
		local _result_32 = hintSlotProps
		if _result_32 ~= nil then
			_result_32 = _result_32.RichText
		end
		local _condition_31 = _result_32
		if _condition_31 == nil then
			_condition_31 = false
		end
		_attributes_1.RichText = _condition_31
		_attributes_1.ZIndex = zIndexes.hint
		if hintSlotProps then
			for _k, _v in hintSlotProps do
				_attributes_1[_k] = _v
			end
		end
		_result_20 = (React.createElement("textlabel", _attributes_1))
	else
		_result_20 = nil
	end
	return React.createElement(React.Fragment, nil, _exp, _result_6, _exp_1, _result_20)
end
local function KeybindInputTileContent(_param)
	local contentState = _param.contentState
	local sizeStyles = _param.sizeStyles
	local visualStyles = _param.visualStyles
	local slotProps = _param.slotProps
	local colors = _param.colors
	local zIndexes = _param.zIndexes
	local _contentSlotProps = slotProps
	if _contentSlotProps ~= nil then
		_contentSlotProps = _contentSlotProps.content
	end
	local contentSlotProps = _contentSlotProps
	local _deviceFrameSlotProps = slotProps
	if _deviceFrameSlotProps ~= nil then
		_deviceFrameSlotProps = _deviceFrameSlotProps.deviceFrame
	end
	local deviceFrameSlotProps = _deviceFrameSlotProps
	local _deviceIconSlotProps = slotProps
	if _deviceIconSlotProps ~= nil then
		_deviceIconSlotProps = _deviceIconSlotProps.deviceIcon
	end
	local deviceIconSlotProps = _deviceIconSlotProps
	local _keycapSlotProps = slotProps
	if _keycapSlotProps ~= nil then
		_keycapSlotProps = _keycapSlotProps.keycap
	end
	local keycapSlotProps = _keycapSlotProps
	local deviceIconName = resolveDeviceIconName(contentState.captureDevice, contentState.displayDevice, contentState.value, contentState.capturing)
	local deviceIconAsset = getLucideIconAsset(deviceIconName, sizeStyles.deviceIconSize)
	local leftTextReserve = sizeStyles.keycapPaddingX + sizeStyles.deviceFrameSize + sizeStyles.gap
	local rightTextReserve = math.max(leftTextReserve, contentState.clearReserveWidth + sizeStyles.keycapPaddingX)
	local valueLayout = {
		leftTextReserve = leftTextReserve,
		rightTextReserve = rightTextReserve,
		centeredContentOffset = (leftTextReserve - rightTextReserve) / 2,
	}
	local _attributes = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromScale(0, 0),
		Size = UDim2.fromScale(1, 1),
		ZIndex = zIndexes.content,
	}
	if contentSlotProps then
		for _k, _v in contentSlotProps do
			_attributes[_k] = _v
		end
	end
	local _attributes_1 = {}
	local _result = keycapSlotProps
	if _result ~= nil then
		_result = _result.BackgroundColor3
	end
	local _condition = _result
	if _condition == nil then
		_condition = colors.keycapBackgroundColor
	end
	_attributes_1.BackgroundColor3 = _condition
	local _result_1 = keycapSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.BackgroundTransparency
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = visualStyles.keycapBackgroundTransparency
	end
	_attributes_1.BackgroundTransparency = _condition_1
	_attributes_1.BorderSizePixel = 0
	_attributes_1.Position = UDim2.fromScale(0, 0)
	_attributes_1.Size = UDim2.fromScale(1, 1)
	_attributes_1.ZIndex = zIndexes.keycap
	if keycapSlotProps then
		for _k, _v in keycapSlotProps do
			_attributes_1[_k] = _v
		end
	end
	local _object = {
		radius = sizeStyles.radius,
	}
	local _left = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.keycapCorner
	end
	_object[_left] = _result_2
	local _exp = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		color = colors.keycapStrokeColor,
		transparency = colors.keycapStrokeTransparency,
		thickness = colors.keycapStrokeThickness,
	}
	local _left_1 = "slotProps"
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.keycapStroke
	end
	_object_1[_left_1] = _result_3
	local _exp_1 = renderStrokeDecorator(_object_1)
	local _attributes_2 = {}
	local _result_4 = deviceFrameSlotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.BackgroundColor3
	end
	local _condition_2 = _result_4
	if _condition_2 == nil then
		_condition_2 = colors.deviceBackgroundColor
	end
	_attributes_2.BackgroundColor3 = _condition_2
	local _result_5 = deviceFrameSlotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.BackgroundTransparency
	end
	local _condition_3 = _result_5
	if _condition_3 == nil then
		_condition_3 = visualStyles.deviceBackgroundTransparency
	end
	_attributes_2.BackgroundTransparency = _condition_3
	_attributes_2.BorderSizePixel = 0
	_attributes_2.Position = UDim2.new(0, sizeStyles.keycapPaddingX, 0.5, 0)
	_attributes_2.AnchorPoint = Vector2.new(0, 0.5)
	_attributes_2.Size = UDim2.fromOffset(sizeStyles.deviceFrameSize, sizeStyles.deviceFrameSize)
	_attributes_2.ZIndex = zIndexes.deviceFrame
	if deviceFrameSlotProps then
		for _k, _v in deviceFrameSlotProps do
			_attributes_2[_k] = _v
		end
	end
	local _object_2 = {
		radius = sizeStyles.radius,
	}
	local _left_2 = "slotProps"
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.deviceFrameCorner
	end
	_object_2[_left_2] = _result_6
	local _exp_2 = renderCornerDecorator(_object_2)
	local _attributes_3 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
		Size = UDim2.fromOffset(sizeStyles.deviceIconSize, sizeStyles.deviceIconSize),
	}
	local _result_7 = deviceIconAsset
	if _result_7 ~= nil then
		_result_7 = _result_7.Url
	end
	_attributes_3.Image = _result_7
	local _result_8 = deviceIconAsset
	if _result_8 ~= nil then
		_result_8 = _result_8.ImageRectSize
	end
	_attributes_3.ImageRectSize = _result_8
	local _result_9 = deviceIconAsset
	if _result_9 ~= nil then
		_result_9 = _result_9.ImageRectOffset
	end
	_attributes_3.ImageRectOffset = _result_9
	local _result_10 = deviceIconSlotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.ImageColor3
	end
	local _condition_4 = _result_10
	if _condition_4 == nil then
		_condition_4 = colors.deviceIconColor
	end
	_attributes_3.ImageColor3 = _condition_4
	_attributes_3.ScaleType = Enum.ScaleType.Fit
	_attributes_3.ZIndex = zIndexes.deviceIcon
	if deviceIconSlotProps then
		for _k, _v in deviceIconSlotProps do
			_attributes_3[_k] = _v
		end
	end
	return React.createElement("frame", _attributes, React.createElement("frame", _attributes_1, _exp, _exp_1, React.createElement("frame", _attributes_2, _exp_2, React.createElement("imagelabel", _attributes_3)), React.createElement(KeybindValueContent, {
		contentState = contentState,
		layout = valueLayout,
		sizeStyles = sizeStyles,
		slotProps = slotProps,
		colors = colors,
		zIndexes = zIndexes,
	})))
end
local KeybindInputBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local variant = _binding.variant
	if variant == nil then
		variant = "outline"
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
	local readOnly = _binding.readOnly
	if readOnly == nil then
		readOnly = false
	end
	local fullWidth = _binding.fullWidth
	if fullWidth == nil then
		fullWidth = false
	end
	local styleOverrides = _binding.styleOverrides
	local placeholder = _binding.placeholder
	if placeholder == nil then
		placeholder = "—"
	end
	local captureLabel = _binding.captureLabel
	if captureLabel == nil then
		captureLabel = "Press a key..."
	end
	local clearable = _binding.clearable
	if clearable == nil then
		clearable = true
	end
	local displayDevice = _binding.displayDevice
	local value = _binding.value
	local defaultValue = _binding.defaultValue
	if defaultValue == nil then
		defaultValue = Enum.KeyCode.Unknown
	end
	local onChange = _binding.onChange
	local captureDevice = _binding.captureDevice
	if captureDevice == nil then
		captureDevice = "both"
	end
	local cancelKeyCodes = _binding.cancelKeyCodes
	if cancelKeyCodes == nil then
		cancelKeyCodes = DEFAULT_CANCEL_KEY_CODES
	end
	local allowedKeyCodes = _binding.allowedKeyCodes
	local blockedKeyCodes = _binding.blockedKeyCodes
	local onCaptureStart = _binding.onCaptureStart
	local onCaptureCancel = _binding.onCaptureCancel
	local onCaptureEnd = _binding.onCaptureEnd
	local onCapturingChange = _binding.onCapturingChange
	local Event = _binding.Event
	local Change = _binding.Change
	local hovered, setHovered = React.useState(false)
	local pressed, setPressed = React.useState(false)
	local capturing, setCapturing = React.useState(false)
	local uncontrolledValue, setUncontrolledValue = React.useState(value or defaultValue)
	local valueRef = React.useRef(value or defaultValue)
	local capturingRef = React.useRef(false)
	local disabledRef = React.useRef(disabled)
	local readOnlyRef = React.useRef(readOnly)
	local clearableRef = React.useRef(clearable)
	local captureDeviceRef = React.useRef(captureDevice)
	local cancelKeyCodesRef = React.useRef(cancelKeyCodes)
	local allowedKeyCodesRef = React.useRef(allowedKeyCodes)
	local blockedKeyCodesRef = React.useRef(blockedKeyCodes)
	local onChangeRef = React.useRef(onChange)
	local onCaptureStartRef = React.useRef(onCaptureStart)
	local onCaptureCancelRef = React.useRef(onCaptureCancel)
	local onCaptureEndRef = React.useRef(onCaptureEnd)
	local onCapturingChangeRef = React.useRef(onCapturingChange)
	local sizeStyles = resolveKeybindInputSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		cursor = "pointer",
	}, props)
	local _binding_1 = useResolvedStyleProps("keybindInput", mergedStyleProps)
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
			setUncontrolledValue(value)
		end
	end, { value })
	React.useEffect(function()
		valueRef.current = value or uncontrolledValue
	end, { uncontrolledValue, value })
	React.useEffect(function()
		disabledRef.current = disabled
		readOnlyRef.current = readOnly
		clearableRef.current = clearable
		captureDeviceRef.current = captureDevice
		cancelKeyCodesRef.current = cancelKeyCodes
		allowedKeyCodesRef.current = allowedKeyCodes
		blockedKeyCodesRef.current = blockedKeyCodes
		onChangeRef.current = onChange
		onCaptureStartRef.current = onCaptureStart
		onCaptureCancelRef.current = onCaptureCancel
		onCaptureEndRef.current = onCaptureEnd
		onCapturingChangeRef.current = onCapturingChange
	end, { allowedKeyCodes, blockedKeyCodes, cancelKeyCodes, captureDevice, clearable, disabled, onCaptureCancel, onCaptureEnd, onCaptureStart, onCapturingChange, onChange, readOnly })
	local setCapturingState = React.useCallback(function(nextCapturing)
		capturingRef.current = nextCapturing
		setCapturing(nextCapturing)
		local _result = onCapturingChangeRef.current
		if _result ~= nil then
			_result(nextCapturing)
		end
	end, {})
	local commitValue = React.useCallback(function(nextValue)
		if value == nil then
			setUncontrolledValue(nextValue)
		end
		valueRef.current = nextValue
		local _result = onChangeRef.current
		if _result ~= nil then
			_result(nextValue)
		end
	end, { value })
	local cancelCapture = React.useCallback(function()
		if not capturingRef.current then
			return nil
		end
		setCapturingState(false)
		local _result = onCaptureCancelRef.current
		if _result ~= nil then
			_result()
		end
	end, { setCapturingState })
	local finishCaptureWithCurrentValue = React.useCallback(function()
		if not capturingRef.current then
			return nil
		end
		local currentValue = valueRef.current
		setCapturingState(false)
		local _result = onCaptureEndRef.current
		if _result ~= nil then
			_result(currentValue)
		end
	end, { setCapturingState })
	local startCapture = React.useCallback(function()
		if disabledRef.current or readOnlyRef.current then
			return nil
		end
		if capturingRef.current then
			finishCaptureWithCurrentValue()
			return nil
		end
		setCapturingState(true)
		local _result = onCaptureStartRef.current
		if _result ~= nil then
			_result()
		end
	end, { finishCaptureWithCurrentValue, setCapturingState })
	local clearValue = React.useCallback(function()
		if disabledRef.current or readOnlyRef.current then
			return nil
		end
		commitValue(Enum.KeyCode.Unknown)
		local _result = onCaptureEndRef.current
		if _result ~= nil then
			_result(Enum.KeyCode.Unknown)
		end
		setCapturingState(false)
	end, { commitValue, setCapturingState })
	React.useEffect(function()
		if not disabled and not readOnly then
			return nil
		end
		setHovered(false)
		setPressed(false)
		if capturingRef.current then
			setCapturingState(false)
			local _result = onCaptureCancelRef.current
			if _result ~= nil then
				_result()
			end
		end
	end, { disabled, readOnly, setCapturingState })
	React.useEffect(function()
		if not capturing then
			return nil
		end
		local connection = UserInputService.InputBegan:Connect(function(input)
			if not capturingRef.current or disabledRef.current or readOnlyRef.current then
				return nil
			end
			local keyCode = input.KeyCode
			if containsKeyCode(cancelKeyCodesRef.current, keyCode) then
				cancelCapture()
				return nil
			end
			if keyCode == Enum.KeyCode.Backspace or keyCode == Enum.KeyCode.Delete then
				if clearableRef.current then
					clearValue()
				else
					cancelCapture()
				end
				return nil
			end
			if not isDeviceAllowed(input, captureDeviceRef.current) then
				return nil
			end
			if not isAllowedKeyCode(keyCode, allowedKeyCodesRef.current, blockedKeyCodesRef.current) then
				return nil
			end
			commitValue(keyCode)
			setCapturingState(false)
			local _result = onCaptureEndRef.current
			if _result ~= nil then
				_result(keyCode)
			end
		end)
		return function()
			connection:Disconnect()
		end
	end, { cancelCapture, capturing, clearValue, commitValue, setCapturingState })
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _triggerSlotProps = slotProps
	if _triggerSlotProps ~= nil then
		_triggerSlotProps = _triggerSlotProps.trigger
	end
	local triggerSlotProps = _triggerSlotProps
	local _contentSlotProps = slotProps
	if _contentSlotProps ~= nil then
		_contentSlotProps = _contentSlotProps.content
	end
	local contentSlotProps = _contentSlotProps
	local _deviceFrameSlotProps = slotProps
	if _deviceFrameSlotProps ~= nil then
		_deviceFrameSlotProps = _deviceFrameSlotProps.deviceFrame
	end
	local deviceFrameSlotProps = _deviceFrameSlotProps
	local _deviceIconSlotProps = slotProps
	if _deviceIconSlotProps ~= nil then
		_deviceIconSlotProps = _deviceIconSlotProps.deviceIcon
	end
	local deviceIconSlotProps = _deviceIconSlotProps
	local _keycapSlotProps = slotProps
	if _keycapSlotProps ~= nil then
		_keycapSlotProps = _keycapSlotProps.keycap
	end
	local keycapSlotProps = _keycapSlotProps
	local _gamepadGlyphSlotProps = slotProps
	if _gamepadGlyphSlotProps ~= nil then
		_gamepadGlyphSlotProps = _gamepadGlyphSlotProps.gamepadGlyph
	end
	local gamepadGlyphSlotProps = _gamepadGlyphSlotProps
	local currentValue = value or uncontrolledValue
	local hasValue = currentValue ~= Enum.KeyCode.Unknown
	local displayText = if capturing then captureLabel elseif hasValue then resolveKeyCodeLabel(currentValue) else placeholder
	local hintText = ""
	local interactionState = resolveKeybindInteractionState(disabled, readOnly, capturing, pressed, hovered)
	local styleOverrideContext = {
		theme = theme,
		variant = variant,
		color = color,
		size = size,
		state = interactionState,
		hasValue = hasValue,
	}
	local visualStyles = applyStyleOverride(resolveKeybindInputVisualStyles(theme, variant, color, interactionState, hasValue), styleOverrides, styleOverrideContext)
	local animated = useMotion({
		values = {
			backgroundColor = visualStyles.backgroundColor,
			strokeColor = visualStyles.strokeColor,
			strokeTransparency = visualStyles.strokeTransparency,
			strokeThickness = visualStyles.strokeThickness,
			labelColor = visualStyles.labelColor,
			hintColor = visualStyles.hintColor,
			deviceBackgroundColor = visualStyles.deviceBackgroundColor,
			deviceIconColor = visualStyles.deviceIconColor,
			keycapBackgroundColor = visualStyles.keycapBackgroundColor,
			keycapStrokeColor = visualStyles.keycapStrokeColor,
			keycapStrokeTransparency = visualStyles.keycapStrokeTransparency,
			keycapStrokeThickness = visualStyles.keycapStrokeThickness,
		},
		transition = resolveKeybindInputMotionTransition(interactionState),
	})
	local computedLayout = resolveKeybindComputedLayout(fullWidth, resolvedWidth, resolvedHeight, resolvedSize, resolvedConstraint, sizeStyles)
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.ZIndex
	end
	local _condition = _result
	if _condition == nil then
		_condition = props.zIndex
	end
	local resolvedRootZIndex = _condition
	local resolvedZIndexes = resolveKeybindTileZIndexes(slotProps, resolvedRootZIndex)
	local clearReserveWidth = 0
	local decoratorChildren = {}
	local _object = {
		radius = sizeStyles.radius,
	}
	local _left = "slotProps"
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.triggerCorner
	end
	_object[_left] = _result_1
	pushDecorator(decoratorChildren, renderCornerDecorator(_object))
	local _object_1 = {}
	local _left_1 = "enabled"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.triggerStroke
	end
	_object_1[_left_1] = _result_2 ~= nil
	_object_1.color = animated.strokeColor
	_object_1.transparency = animated.strokeTransparency
	_object_1.thickness = animated.strokeThickness
	local _left_2 = "slotProps"
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.triggerStroke
	end
	_object_1[_left_2] = _result_3
	pushDecorator(decoratorChildren, renderStrokeDecorator(_object_1))
	local _object_2 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_3 = "slotProps"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.triggerPadding
	end
	_object_2[_left_3] = _result_4
	pushDecorator(decoratorChildren, renderPaddingDecorator(_object_2))
	local _object_3 = {
		constraint = computedLayout.constraint,
	}
	local _left_4 = "slotProps"
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.sizeConstraint
	end
	_object_3[_left_4] = _result_5
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_3))
	local _result_6 = rootSlotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.Event
	end
	local rootEvent = useRootCursorEvent(nil, if _result_6 == nil then props.cursor else nil, disabled)
	local internalTriggerEvent = {
		MouseEnter = function()
			if not disabled and not readOnly then
				setHovered(true)
			end
		end,
		MouseLeave = function()
			setHovered(false)
			setPressed(false)
		end,
		InputBegan = function(_button, input)
			if not disabled and not readOnly and isPressInput(input) then
				setPressed(true)
			end
		end,
		InputEnded = function(_button, input)
			if isPressInput(input) then
				setPressed(false)
			end
		end,
		Activated = function()
			startCapture()
		end,
	}
	local _exp = composeEventMaps(internalTriggerEvent, Event)
	local _result_7 = triggerSlotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.Event
	end
	local triggerEvent = useRootCursorEvent(_exp, if _result_7 == nil then (props.cursor or "pointer") else nil, disabled or readOnly)
	local rootInstanceProps = {
		BorderSizePixel = 0,
		BackgroundTransparency = 1,
		Size = computedLayout.size,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
		Event = rootEvent,
	}
	local triggerInstanceProps = {
		AutoButtonColor = false,
		Active = not disabled and not readOnly,
		Selectable = not disabled,
		BackgroundColor3 = animated.backgroundColor,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedZIndexes.trigger,
		Event = triggerEvent,
		Change = Change,
	}
	local _attributes = table.clone(rootInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	local _attributes_1 = table.clone(triggerInstanceProps)
	setmetatable(_attributes_1, nil)
	if triggerSlotProps then
		for _k, _v in triggerSlotProps do
			_attributes_1[_k] = _v
		end
	end
	_attributes_1.ref = function(instance)
		assignRef(ref, instance)
	end
	return React.createElement("frame", _attributes, React.createElement("textbutton", _attributes_1, decoratorChildren, React.createElement(KeybindInputTileContent, {
		contentState = {
			displayText = displayText,
			hintText = hintText,
			value = currentValue,
			captureDevice = captureDevice,
			displayDevice = displayDevice,
			capturing = capturing,
			hasValue = hasValue,
			clearReserveWidth = clearReserveWidth,
		},
		sizeStyles = sizeStyles,
		visualStyles = visualStyles,
		slotProps = slotProps,
		colors = {
			labelColor = animated.labelColor,
			labelTransparency = visualStyles.labelTransparency,
			hintColor = animated.hintColor,
			hintTransparency = visualStyles.hintTransparency,
			deviceBackgroundColor = animated.deviceBackgroundColor,
			deviceIconColor = animated.deviceIconColor,
			keycapBackgroundColor = animated.keycapBackgroundColor,
			keycapStrokeColor = animated.keycapStrokeColor,
			keycapStrokeTransparency = animated.keycapStrokeTransparency,
			keycapStrokeThickness = animated.keycapStrokeThickness,
		},
		zIndexes = resolvedZIndexes,
	})))
end)
local KeybindInput = KeybindInputBase
KeybindInput.displayName = "KeybindInput"
return {
	KeybindInput = KeybindInput,
}
