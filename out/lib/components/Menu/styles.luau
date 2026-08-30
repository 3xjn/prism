-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveThemeSpacing = _theme.resolveThemeSpacing
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveMenuRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "menu", "sm", "radius", theme.radius.sm))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "menu", "lg", "radius", theme.radius.lg))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "menu", "md", "radius", theme.radius.md))
	until true
end
local function resolveMenuItemRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "menu", "sm", "radius", theme.radius.xs))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "menu", "md", "radius", theme.radius.md))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "menu", "sm", "radius", theme.radius.sm))
	until true
end
local function resolveMenuSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				panelWidth = theme.spacing.xl * 6,
				listPadding = "xs",
				itemPaddingX = "sm",
				itemPaddingY = "xs",
				itemGap = resolveThemeSpacing(theme, "xs"),
				itemHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.xs),
				labelHeight = theme.spacing.lg,
				dividerHeight = theme.spacing.sm,
				dividerInset = theme.spacing.sm,
				labelPaddingX = "sm",
				labelLetterSpacing = 0.04,
				radius = resolveMenuRadius(theme, size),
				itemRadius = resolveMenuItemRadius(theme, size),
				fontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				metaFontSize = theme.fontSizes.xs,
				iconSize = 14,
				scrollBarThickness = theme.spacing.xs,
			}
		end
		if size == "sm" then
			return {
				panelWidth = theme.spacing.xl * 7,
				listPadding = "xs",
				itemPaddingX = "md",
				itemPaddingY = "xs",
				itemGap = resolveThemeSpacing(theme, "xs"),
				itemHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.sm),
				labelHeight = theme.spacing.xl,
				dividerHeight = theme.spacing.sm,
				dividerInset = theme.spacing.md,
				labelPaddingX = "md",
				labelLetterSpacing = 0.04,
				radius = resolveMenuRadius(theme, size),
				itemRadius = resolveMenuItemRadius(theme, size),
				fontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				metaFontSize = theme.fontSizes.xs,
				iconSize = 16,
				scrollBarThickness = theme.spacing.xs,
			}
		end
		if size == "lg" then
			return {
				panelWidth = theme.spacing.xl * 10,
				listPadding = "sm",
				itemPaddingX = "lg",
				itemPaddingY = "sm",
				itemGap = resolveThemeSpacing(theme, "sm"),
				itemHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.lg),
				labelHeight = theme.spacing.xl + theme.spacing.xs,
				dividerHeight = theme.spacing.md,
				dividerInset = theme.spacing.lg,
				labelPaddingX = "lg",
				labelLetterSpacing = 0.035,
				radius = resolveMenuRadius(theme, size),
				itemRadius = resolveMenuItemRadius(theme, size),
				fontSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				metaFontSize = theme.fontSizes.sm,
				iconSize = 20,
				scrollBarThickness = theme.spacing.xs,
			}
		end
		if size == "xl" then
			return {
				panelWidth = theme.spacing.xl * 12,
				listPadding = "sm",
				itemPaddingX = "xl",
				itemPaddingY = "sm",
				itemGap = resolveThemeSpacing(theme, "sm"),
				itemHeight = resolveDensityControlSize(theme, theme.spacing.xl * 2),
				labelHeight = theme.spacing.xl + theme.spacing.sm,
				dividerHeight = theme.spacing.md,
				dividerInset = theme.spacing.lg,
				labelPaddingX = "xl",
				labelLetterSpacing = 0.035,
				radius = resolveMenuRadius(theme, size),
				itemRadius = resolveMenuItemRadius(theme, size),
				fontSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				metaFontSize = theme.fontSizes.sm,
				iconSize = 22,
				scrollBarThickness = theme.spacing.xs,
			}
		end
		if size == "md" then
		end
		return {
			panelWidth = theme.spacing.xl * 8,
			listPadding = "xs",
			itemPaddingX = "md",
			itemPaddingY = "sm",
			itemGap = resolveThemeSpacing(theme, "xs"),
			itemHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.md),
			labelHeight = theme.spacing.xl,
			dividerHeight = theme.spacing.md,
			dividerInset = theme.spacing.md,
			labelPaddingX = "md",
			labelLetterSpacing = 0.04,
			radius = resolveMenuRadius(theme, size),
			itemRadius = resolveMenuItemRadius(theme, size),
			fontSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			metaFontSize = theme.fontSizes.xs,
			iconSize = 18,
			scrollBarThickness = theme.spacing.xs,
		}
	until true
end
local function resolveMenuPanelVisualStyles(theme)
	local tintedSurface = mixColor(theme.colors.background.surface, theme.colors.primary.light, 0.08)
	return {
		backgroundColor = tintedSurface,
		strokeColor = mixColor(theme.colors.border.default, theme.colors.primary.main, 0.12),
		strokeTransparency = 0.06,
		dividerColor = mixColor(theme.colors.border.subtle, theme.colors.primary.light, 0.24),
		dividerTransparency = 0.18,
		labelColor = mixColor(theme.colors.text.secondary, theme.colors.primary.main, 0.18),
		labelTransparency = 0.08,
	}
end
local function resolveMenuItemVisualStyles(theme, color, state)
	local intentColors = if color ~= nil then theme.colors[color] else nil
	local baseSurface = mixColor(theme.colors.background.surface, theme.colors.primary.light, 0.06)
	local hoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.82)
	local pressedSurface = mixColor(hoverSurface, theme.colors.action.pressed, 0.5)
	local _result = intentColors
	if _result ~= nil then
		_result = _result.main
	end
	local _condition = _result
	if _condition == nil then
		_condition = theme.colors.text.primary
	end
	local idleTextColor = _condition
	local _result_1 = intentColors
	if _result_1 ~= nil then
		_result_1 = _result_1.dark
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = theme.colors.text.primary
	end
	local hoveredTextColor = _condition_1
	local rightTextColor = theme.colors.text.secondary
	if state == "disabled" then
		return {
			backgroundColor = baseSurface,
			backgroundTransparency = 1,
			textColor = theme.colors.text.disabled,
			textTransparency = 0,
			rightTextColor = theme.colors.text.disabled,
			rightTextTransparency = 0,
		}
	end
	if state == "pressed" then
		return {
			backgroundColor = pressedSurface,
			backgroundTransparency = 0,
			textColor = hoveredTextColor,
			textTransparency = 0,
			rightTextColor = rightTextColor,
			rightTextTransparency = 0,
		}
	end
	if state == "hovered" then
		return {
			backgroundColor = hoverSurface,
			backgroundTransparency = 0,
			textColor = hoveredTextColor,
			textTransparency = 0,
			rightTextColor = rightTextColor,
			rightTextTransparency = 0,
		}
	end
	return {
		backgroundColor = baseSurface,
		backgroundTransparency = 1,
		textColor = idleTextColor,
		textTransparency = 0,
		rightTextColor = rightTextColor,
		rightTextTransparency = 0,
	}
end
local function resolveMenuItemMotionTransition(state)
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
			textTransparency = {
				duration = "instant",
				easing = "standard",
			},
			rightTextColor = {
				duration = "instant",
				easing = "standard",
			},
			rightTextTransparency = {
				duration = "instant",
				easing = "standard",
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
			textTransparency = {
				duration = "fast",
				easing = "standard",
			},
			rightTextColor = {
				duration = "fast",
				easing = "standard",
			},
			rightTextTransparency = {
				duration = "fast",
				easing = "standard",
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
			textTransparency = {
				duration = "fast",
				easing = "standard",
			},
			rightTextColor = {
				duration = "fast",
				easing = "standard",
			},
			rightTextTransparency = {
				duration = "fast",
				easing = "standard",
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
		textTransparency = {
			duration = "normal",
			easing = "standard",
		},
		rightTextColor = {
			duration = "normal",
			easing = "standard",
		},
		rightTextTransparency = {
			duration = "normal",
			easing = "standard",
		},
	}
end
return {
	resolveMenuSizeStyles = resolveMenuSizeStyles,
	resolveMenuPanelVisualStyles = resolveMenuPanelVisualStyles,
	resolveMenuItemVisualStyles = resolveMenuItemVisualStyles,
	resolveMenuItemMotionTransition = resolveMenuItemMotionTransition,
}
