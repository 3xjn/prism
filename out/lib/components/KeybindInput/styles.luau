-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveThemeSpacing = _theme.resolveThemeSpacing
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveKeybindInputRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "keybindInput", "sm", "radius", theme.radius.sm))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "keybindInput", "md", "radius", theme.radius.md))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "keybindInput", "sm", "radius", theme.radius.sm))
	until true
end
local function resolveKeybindInputSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				paddingX = "sm",
				paddingY = "xs",
				gap = resolveThemeSpacing(theme, "xs"),
				deviceFrameSize = 22,
				deviceIconSize = 14,
				gamepadGlyphSize = 18,
				keycapPaddingX = resolveThemeSpacing(theme, "xs"),
				fontSize = theme.fontSizes.xs,
				hintFontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				radius = resolveKeybindInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 36),
				defaultWidth = 128,
			}
		end
		if size == "sm" then
			return {
				paddingX = "md",
				paddingY = "xs",
				gap = resolveThemeSpacing(theme, "xs"),
				deviceFrameSize = 24,
				deviceIconSize = 16,
				gamepadGlyphSize = 20,
				keycapPaddingX = resolveThemeSpacing(theme, "sm"),
				fontSize = theme.fontSizes.sm,
				hintFontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.sm,
				radius = resolveKeybindInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 44),
				defaultWidth = 150,
			}
		end
		if size == "lg" then
			return {
				paddingX = "lg",
				paddingY = "sm",
				gap = resolveThemeSpacing(theme, "sm"),
				deviceFrameSize = 28,
				deviceIconSize = 23,
				gamepadGlyphSize = 27,
				keycapPaddingX = resolveThemeSpacing(theme, "md"),
				fontSize = theme.fontSizes.lg,
				hintFontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.lg,
				radius = resolveKeybindInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 56),
				defaultWidth = 182,
			}
		end
		if size == "xl" then
			return {
				paddingX = "xl",
				paddingY = "md",
				gap = resolveThemeSpacing(theme, "sm"),
				deviceFrameSize = 30,
				deviceIconSize = 24,
				gamepadGlyphSize = 30,
				keycapPaddingX = resolveThemeSpacing(theme, "md"),
				fontSize = theme.fontSizes.xl,
				hintFontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.xl,
				radius = resolveKeybindInputRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 64),
				defaultWidth = 208,
			}
		end
		if size == "md" then
		end
		return {
			paddingX = "md",
			paddingY = "sm",
			gap = resolveThemeSpacing(theme, "sm"),
			deviceFrameSize = 26,
			deviceIconSize = 19,
			gamepadGlyphSize = 23,
			keycapPaddingX = resolveThemeSpacing(theme, "sm"),
			fontSize = theme.fontSizes.md,
			hintFontSize = theme.fontSizes.xs,
			lineHeight = theme.lineHeights.md,
			radius = resolveKeybindInputRadius(theme, size),
			minHeight = resolveDensityControlSize(theme, 50),
			defaultWidth = 168,
		}
	until true
end
local function resolveKeybindInputVisualStyles(theme, variant, color, state, hasValue)
	local intentColors = theme.colors[color]
	local disabled = state == "disabled"
	local readOnly = state == "readOnly"
	local active = state == "capturing"
	local hovered = state == "hovered"
	local pressed = state == "pressed"
	local placeholderColor = mixColor(theme.colors.text.secondary, theme.colors.background.surface, 0.16)
	local labelColor = if disabled then theme.colors.text.disabled elseif active then intentColors.main elseif hasValue then theme.colors.text.primary else placeholderColor
	local hintColor = if disabled then theme.colors.text.disabled elseif active then intentColors.main else theme.colors.text.secondary
	local outlineIdleSurface = if readOnly then mixColor(theme.colors.background.surface, theme.colors.background.default, 0.45) else mixColor(theme.colors.background.surface, theme.colors.background.default, 0.18)
	local outlineHoverSurface = mixColor(outlineIdleSurface, theme.colors.action.hover, 0.42)
	local outlinePressedSurface = mixColor(outlineHoverSurface, theme.colors.action.pressed, 0.45)
	local outlineActiveSurface = mixColor(outlineIdleSurface, intentColors.light, 0.14)
	local subtleIdleSurface = mixColor(theme.colors.background.default, intentColors.light, if readOnly then 0.08 else 0.16)
	local subtleHoverSurface = mixColor(subtleIdleSurface, theme.colors.background.surface, 0.45)
	local subtleActiveSurface = mixColor(subtleIdleSurface, intentColors.light, 0.22)
	local lightIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, if readOnly then 0.18 else 0.3)
	local lightHoverSurface = mixColor(lightIdleSurface, theme.colors.background.surface, 0.12)
	local lightActiveSurface = mixColor(lightIdleSurface, intentColors.main, 0.1)
	local filledIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, if readOnly then 0.22 else 0.34)
	local filledHoverSurface = mixColor(filledIdleSurface, intentColors.light, 0.1)
	local filledActiveSurface = mixColor(filledIdleSurface, intentColors.main, 0.14)
	if disabled then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 0.1,
			strokeThickness = 1,
			labelColor = labelColor,
			labelTransparency = 0,
			hintColor = hintColor,
			hintTransparency = 0,
			deviceBackgroundColor = theme.colors.action.disabledBackground,
			deviceBackgroundTransparency = 1,
			deviceIconColor = theme.colors.text.disabled,
			keycapBackgroundColor = theme.colors.action.disabledBackground,
			keycapBackgroundTransparency = 0,
			keycapStrokeColor = theme.colors.border.subtle,
			keycapStrokeTransparency = 0.16,
			keycapStrokeThickness = 1,
		}
	end
	local backgroundColor = outlineIdleSurface
	local strokeColor = theme.colors.border.default
	local strokeTransparency = 0.12
	local strokeThickness = 1
	repeat
		local _fallthrough = false
		if variant == "subtle" then
			backgroundColor = if active then subtleActiveSurface elseif hovered or pressed then subtleHoverSurface else subtleIdleSurface
			strokeColor = if active then intentColors.main elseif hovered then theme.colors.border.default else theme.colors.border.subtle
			strokeTransparency = if active then 0.04 elseif hovered then 0.14 else 0.28
			strokeThickness = if active then 1.5 else 1
			break
		end
		if variant == "light" then
			backgroundColor = if active then lightActiveSurface elseif hovered or pressed then lightHoverSurface else lightIdleSurface
			strokeColor = if active then intentColors.main elseif hovered then intentColors.dark else intentColors.light
			strokeTransparency = if active then 0.02 elseif hovered then 0.08 else 0.14
			strokeThickness = if active then 1.5 else 1
			break
		end
		if variant == "filled" then
			backgroundColor = if active then filledActiveSurface elseif hovered or pressed then filledHoverSurface else filledIdleSurface
			strokeColor = if active then intentColors.dark elseif hovered then intentColors.main else mixColor(intentColors.main, theme.colors.border.default, 0.5)
			strokeTransparency = if active then 0.02 elseif hovered then 0.08 else 0.16
			strokeThickness = if active then 1.5 else 1
			break
		end
		if variant == "outline" then
		end
		backgroundColor = if active then outlineActiveSurface elseif pressed then outlinePressedSurface elseif hovered then outlineHoverSurface else outlineIdleSurface
		strokeColor = if active then intentColors.main elseif hovered then mixColor(theme.colors.border.strong, intentColors.main, 0.1) else mixColor(theme.colors.border.default, theme.colors.background.surface, 0.08)
		strokeTransparency = if active then 0 elseif hovered then 0.08 else 0.18
		strokeThickness = if active then 2 else 1
		break
	until true
	local keycapBackgroundColor = if active then outlineActiveSurface elseif pressed then mixColor(backgroundColor, theme.colors.action.pressed, 0.28) elseif hovered then outlineHoverSurface else backgroundColor
	local keycapStrokeColor = if active then intentColors.main elseif hovered then strokeColor else mixColor(strokeColor, theme.colors.background.surface, 0.16)
	local deviceBackgroundColor = backgroundColor
	local deviceIconColor = if active then intentColors.main elseif hasValue then mixColor(theme.colors.text.secondary, theme.colors.text.primary, 0.24) else placeholderColor
	return {
		backgroundColor = backgroundColor,
		strokeColor = strokeColor,
		strokeTransparency = strokeTransparency,
		strokeThickness = strokeThickness,
		labelColor = labelColor,
		labelTransparency = 0,
		hintColor = hintColor,
		hintTransparency = if active then 0 else 0.12,
		deviceBackgroundColor = deviceBackgroundColor,
		deviceBackgroundTransparency = 1,
		deviceIconColor = deviceIconColor,
		keycapBackgroundColor = keycapBackgroundColor,
		keycapBackgroundTransparency = 0,
		keycapStrokeColor = keycapStrokeColor,
		keycapStrokeTransparency = if active then 0 elseif hovered then 0.08 else 0.18,
		keycapStrokeThickness = if active then 2 else 1,
	}
end
local function resolveKeybindInputMotionTransition(state)
	if state == "disabled" then
		return {
			backgroundColor = {
				duration = "instant",
				easing = "standard",
			},
			strokeColor = {
				duration = "instant",
				easing = "standard",
			},
			strokeTransparency = {
				duration = "instant",
				easing = "standard",
			},
			strokeThickness = {
				duration = "instant",
				easing = "standard",
			},
			labelColor = {
				duration = "instant",
				easing = "standard",
			},
			hintColor = {
				duration = "instant",
				easing = "standard",
			},
			deviceBackgroundColor = {
				duration = "instant",
				easing = "standard",
			},
			deviceIconColor = {
				duration = "instant",
				easing = "standard",
			},
			keycapBackgroundColor = {
				duration = "instant",
				easing = "standard",
			},
			keycapStrokeColor = {
				duration = "instant",
				easing = "standard",
			},
			keycapStrokeTransparency = {
				duration = "instant",
				easing = "standard",
			},
			keycapStrokeThickness = {
				duration = "instant",
				easing = "standard",
			},
		}
	end
	return {
		backgroundColor = {
			duration = "fast",
			easing = "standard",
		},
		strokeColor = {
			duration = "fast",
			easing = "standard",
		},
		strokeTransparency = {
			duration = "fast",
			easing = "standard",
		},
		strokeThickness = {
			duration = "fast",
			easing = "out",
		},
		labelColor = {
			duration = "fast",
			easing = "standard",
		},
		hintColor = {
			duration = "fast",
			easing = "standard",
		},
		deviceBackgroundColor = {
			duration = "fast",
			easing = "standard",
		},
		deviceIconColor = {
			duration = "fast",
			easing = "standard",
		},
		keycapBackgroundColor = {
			duration = "fast",
			easing = "standard",
		},
		keycapStrokeColor = {
			duration = "fast",
			easing = "standard",
		},
		keycapStrokeTransparency = {
			duration = "fast",
			easing = "standard",
		},
		keycapStrokeThickness = {
			duration = "fast",
			easing = "out",
		},
	}
end
return {
	resolveKeybindInputSizeStyles = resolveKeybindInputSizeStyles,
	resolveKeybindInputVisualStyles = resolveKeybindInputVisualStyles,
	resolveKeybindInputMotionTransition = resolveKeybindInputMotionTransition,
}
