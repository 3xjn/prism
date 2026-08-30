-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveThemeSpacing = _theme.resolveThemeSpacing
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local BUTTON_PRESS_SCALE = 0.965
local function resolveButtonRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "button", "sm", "radius", theme.radius.sm))
		end
		if size == "md" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "button", "md", "radius", theme.radius.md))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "button", "lg", "radius", theme.radius.lg))
		end
	until true
end
local function resolveButtonSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				paddingX = "md",
				paddingY = "xs",
				fontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				radius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.sm * 3),
			}
		end
		if size == "sm" then
			return {
				paddingX = "md",
				paddingY = "xs",
				fontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				radius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.sm),
			}
		end
		if size == "lg" then
			return {
				paddingX = "xl",
				paddingY = "sm",
				fontSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				radius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.lg),
			}
		end
		if size == "xl" then
			return {
				paddingX = "xl",
				paddingY = "md",
				fontSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				radius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl * 2),
			}
		end
		if size == "md" then
		end
		return {
			paddingX = "lg",
			paddingY = "sm",
			fontSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			radius = resolveButtonRadius(theme, size),
			minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.md),
		}
	until true
end
local function resolveButtonContentGap(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return resolveThemeSpacing(theme, "xs")
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return resolveThemeSpacing(theme, "sm")
		end
		if size == "md" then
		end
		return resolveThemeSpacing(theme, "sm")
	until true
end
local function resolveButtonVisualStyles(theme, variant, color, state)
	local intentColors = theme.colors[color]
	local hoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.45)
	local pressedSurface = mixColor(theme.colors.background.surface, theme.colors.action.pressed, 0.85)
	local hoverIntentLight = mixColor(intentColors.light, intentColors.main, 0.12)
	local pressedIntentLight = mixColor(intentColors.light, intentColors.dark, 0.22)
	local filledHover = mixColor(intentColors.main, intentColors.dark, 0.18)
	local filledPressed = mixColor(intentColors.dark, theme.colors.action.pressed, 0.2)
	if state == "disabled" then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			backgroundTransparency = 0,
			textColor = theme.colors.text.disabled,
			strokeColor = theme.colors.border.default,
			strokeTransparency = if variant == "outline" then 0 else 1,
			scale = 1,
			shouldRenderStroke = variant == "outline",
		}
	end
	repeat
		local _fallthrough = false
		if variant == "light" then
			return {
				backgroundColor = if state == "pressed" then pressedIntentLight elseif state == "hovered" then hoverIntentLight else intentColors.light,
				backgroundTransparency = 0,
				textColor = intentColors.dark,
				strokeColor = intentColors.light,
				strokeTransparency = 1,
				scale = if state == "pressed" then BUTTON_PRESS_SCALE else 1,
				shouldRenderStroke = false,
			}
		end
		if variant == "outline" then
			return {
				backgroundColor = if state == "pressed" then pressedSurface elseif state == "hovered" then hoverSurface else theme.colors.background.surface,
				backgroundTransparency = 0,
				textColor = intentColors.main,
				strokeColor = if state == "pressed" then intentColors.dark else intentColors.main,
				strokeTransparency = 0,
				scale = if state == "pressed" then BUTTON_PRESS_SCALE else 1,
				shouldRenderStroke = true,
			}
		end
		if variant == "subtle" then
			return {
				backgroundColor = if state == "pressed" then mixColor(intentColors.light, theme.colors.action.pressed, 0.3) else intentColors.light,
				backgroundTransparency = if state == "pressed" or state == "hovered" then 0 else 1,
				textColor = intentColors.dark,
				strokeColor = intentColors.light,
				strokeTransparency = 1,
				scale = if state == "pressed" then BUTTON_PRESS_SCALE else 1,
				shouldRenderStroke = false,
			}
		end
		if variant == "filled" then
		end
		return {
			backgroundColor = if state == "pressed" then filledPressed elseif state == "hovered" then filledHover else intentColors.main,
			backgroundTransparency = 0,
			textColor = intentColors.contrast,
			strokeColor = intentColors.dark,
			strokeTransparency = 1,
			scale = if state == "pressed" then BUTTON_PRESS_SCALE else 1,
			shouldRenderStroke = false,
		}
	until true
end
local function resolveButtonMotionTransition(state)
	if state == "disabled" then
		return {
			backgroundColor = {
				duration = "instant",
				easing = "standard",
			},
			backgroundTransparency = {
				duration = "instant",
				easing = "standard",
			},
			textColor = {
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
			scale = {
				duration = "instant",
				easing = "out",
			},
		}
	end
	if state == "pressed" then
		return {
			backgroundColor = {
				duration = "fast",
				easing = "standard",
			},
			backgroundTransparency = {
				duration = "fast",
				easing = "standard",
			},
			textColor = {
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
			scale = {
				duration = "fast",
				easing = "out",
			},
		}
	end
	if state == "hovered" then
		return {
			backgroundColor = {
				duration = "fast",
				easing = "standard",
			},
			backgroundTransparency = {
				duration = "fast",
				easing = "standard",
			},
			textColor = {
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
			scale = {
				duration = "fast",
				easing = "out",
			},
		}
	end
	return {
		backgroundColor = {
			duration = "normal",
			easing = "standard",
		},
		backgroundTransparency = {
			duration = "normal",
			easing = "standard",
		},
		textColor = {
			duration = "normal",
			easing = "standard",
		},
		strokeColor = {
			duration = "normal",
			easing = "standard",
		},
		strokeTransparency = {
			duration = "normal",
			easing = "standard",
		},
		scale = {
			duration = "normal",
			easing = "out",
		},
	}
end
return {
	resolveButtonSizeStyles = resolveButtonSizeStyles,
	resolveButtonContentGap = resolveButtonContentGap,
	resolveButtonVisualStyles = resolveButtonVisualStyles,
	resolveButtonMotionTransition = resolveButtonMotionTransition,
}
