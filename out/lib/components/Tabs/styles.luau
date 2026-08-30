-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveDensityGap = _theme.resolveDensityGap
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveTabsTabRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "tabs", "xs", "radius", theme.radius.xs))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "tabs", "md", "radius", theme.radius.md))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "tabs", "sm", "radius", theme.radius.sm))
	until true
end
local function resolveTabsPanelRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "tabs", "sm", "radius", theme.radius.sm))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "tabs", "lg", "radius", theme.radius.lg))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "tabs", "md", "radius", theme.radius.md))
	until true
end
local function resolveTabsSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				tabGap = resolveDensityGap(theme, 4),
				tabPaddingX = "sm",
				tabPaddingY = "xs",
				panelPaddingX = "sm",
				panelPaddingY = "sm",
				fontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				listHeight = resolveDensityControlSize(theme, 30),
				panelMinHeight = 76,
				defaultWidth = 320,
				tabRadius = resolveTabsTabRadius(theme, size),
				panelRadius = resolveTabsPanelRadius(theme, size),
			}
		end
		if size == "sm" then
			return {
				tabGap = resolveDensityGap(theme, 5),
				tabPaddingX = "md",
				tabPaddingY = "xs",
				panelPaddingX = "md",
				panelPaddingY = "sm",
				fontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				listHeight = resolveDensityControlSize(theme, 34),
				panelMinHeight = 86,
				defaultWidth = 380,
				tabRadius = resolveTabsTabRadius(theme, size),
				panelRadius = resolveTabsPanelRadius(theme, size),
			}
		end
		if size == "lg" then
			return {
				tabGap = resolveDensityGap(theme, 8),
				tabPaddingX = "lg",
				tabPaddingY = "sm",
				panelPaddingX = "lg",
				panelPaddingY = "md",
				fontSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				listHeight = resolveDensityControlSize(theme, 46),
				panelMinHeight = 120,
				defaultWidth = 520,
				tabRadius = resolveTabsTabRadius(theme, size),
				panelRadius = resolveTabsPanelRadius(theme, size),
			}
		end
		if size == "xl" then
			return {
				tabGap = resolveDensityGap(theme, 9),
				tabPaddingX = "xl",
				tabPaddingY = "md",
				panelPaddingX = "xl",
				panelPaddingY = "lg",
				fontSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				listHeight = resolveDensityControlSize(theme, 54),
				panelMinHeight = 140,
				defaultWidth = 600,
				tabRadius = resolveTabsTabRadius(theme, size),
				panelRadius = resolveTabsPanelRadius(theme, size),
			}
		end
		if size == "md" then
		end
		return {
			tabGap = resolveDensityGap(theme, 6),
			tabPaddingX = "md",
			tabPaddingY = "sm",
			panelPaddingX = "md",
			panelPaddingY = "md",
			fontSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			listHeight = resolveDensityControlSize(theme, 40),
			panelMinHeight = 104,
			defaultWidth = 460,
			tabRadius = resolveTabsTabRadius(theme, size),
			panelRadius = resolveTabsPanelRadius(theme, size),
		}
	until true
end
local function resolveTabsListVisualStyles(theme, variant, color, disabled)
	local intentColors = theme.colors[color]
	return {
		strokeColor = if disabled then theme.colors.border.subtle elseif variant == "contained" then mixColor(theme.colors.border.default, intentColors.main, 0.18) else theme.colors.border.default,
		strokeTransparency = if disabled then 0.34 elseif variant == "contained" then 0.22 else 0.28,
	}
end
local function resolveTabsTabVisualStyles(theme, variant, color, state)
	local intentColors = theme.colors[color]
	local containedSelectedSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.28)
	local containedHoverSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.16)
	local lineSelectedSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.24)
	local lineHoverSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.1)
	if state == "disabled" then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			backgroundTransparency = if variant == "contained" then 0.4 else 0.84,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 0.64,
			textColor = theme.colors.text.disabled,
			textTransparency = 0,
			indicatorColor = theme.colors.text.disabled,
			indicatorTransparency = 1,
		}
	end
	if state == "selected" then
		return {
			backgroundColor = if variant == "contained" then containedSelectedSurface else lineSelectedSurface,
			backgroundTransparency = if variant == "contained" then 0 else 1,
			strokeColor = if variant == "contained" then mixColor(intentColors.main, theme.colors.border.default, 0.28) else intentColors.main,
			strokeTransparency = if variant == "contained" then 0.14 else 1,
			textColor = mixColor(theme.colors.text.primary, intentColors.main, if variant == "contained" then 0.42 else 0.55),
			textTransparency = 0,
			indicatorColor = intentColors.main,
			indicatorTransparency = if variant == "contained" then 1 else 0,
		}
	end
	local pressedSurface = mixColor(theme.colors.background.surface, theme.colors.action.pressed, 0.45)
	local hoveredSurface = if variant == "contained" then containedHoverSurface else lineHoverSurface
	return {
		backgroundColor = if state == "pressed" then pressedSurface elseif state == "hovered" or state == "focused" then hoveredSurface else theme.colors.background.surface,
		backgroundTransparency = if state == "idle" then 1 elseif variant == "line" and state ~= "pressed" then 0.18 else 0,
		strokeColor = if state == "pressed" or state == "focused" then intentColors.main else theme.colors.border.subtle,
		strokeTransparency = if state == "idle" then 1 elseif variant == "line" and state ~= "pressed" then 0.76 elseif state == "pressed" then 0.18 else 0.36,
		textColor = if state == "idle" then theme.colors.text.secondary else theme.colors.text.primary,
		textTransparency = 0,
		indicatorColor = intentColors.main,
		indicatorTransparency = 1,
	}
end
local function resolveTabsPanelVisualStyles(theme, variant, color, disabled)
	local intentColors = theme.colors[color]
	return {
		backgroundColor = if disabled then theme.colors.action.disabledBackground elseif variant == "contained" then mixColor(theme.colors.background.surface, intentColors.light, 0.08) else theme.colors.background.surface,
		backgroundTransparency = if disabled then 0.42 elseif variant == "contained" then 0 else 1,
		strokeColor = if disabled then theme.colors.border.subtle else mixColor(theme.colors.border.default, intentColors.main, 0.1),
		strokeTransparency = if disabled then 0.34 elseif variant == "contained" then 0.18 else 1,
	}
end
local function resolveTabsTabMotionTransition(state)
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
			strokeColor = {
				duration = "fast",
				easing = "standard",
			},
			strokeTransparency = {
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
			indicatorColor = {
				duration = "fast",
				easing = "standard",
			},
			indicatorTransparency = {
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
		strokeColor = {
			duration = "normal",
			easing = "standard",
		},
		strokeTransparency = {
			duration = "normal",
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
		indicatorColor = {
			duration = "fast",
			easing = "standard",
		},
		indicatorTransparency = {
			duration = "fast",
			easing = "standard",
		},
	}
end
return {
	resolveTabsSizeStyles = resolveTabsSizeStyles,
	resolveTabsListVisualStyles = resolveTabsListVisualStyles,
	resolveTabsTabVisualStyles = resolveTabsTabVisualStyles,
	resolveTabsPanelVisualStyles = resolveTabsPanelVisualStyles,
	resolveTabsTabMotionTransition = resolveTabsTabMotionTransition,
}
