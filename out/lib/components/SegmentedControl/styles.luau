-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveDensityGap = _theme.resolveDensityGap
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveControlRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", "sm", "radius", theme.radius.sm))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", "lg", "radius", theme.radius.lg))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", "md", "radius", theme.radius.md))
	until true
end
local function resolveSegmentRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", "xs", "radius", theme.radius.xs))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", "md", "radius", theme.radius.md))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "segmentedControl", "sm", "radius", theme.radius.sm))
	until true
end
local function resolveSegmentedControlSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				padding = "xs",
				gap = resolveDensityGap(theme, 2),
				segmentPaddingX = "sm",
				segmentPaddingY = "xs",
				fontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				radius = resolveControlRadius(theme, size),
				segmentRadius = resolveSegmentRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 28),
				defaultWidth = 220,
			}
		end
		if size == "sm" then
			return {
				padding = "xs",
				gap = resolveDensityGap(theme, 3),
				segmentPaddingX = "md",
				segmentPaddingY = "xs",
				fontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				radius = resolveControlRadius(theme, size),
				segmentRadius = resolveSegmentRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 32),
				defaultWidth = 260,
			}
		end
		if size == "lg" then
			return {
				padding = "sm",
				gap = resolveDensityGap(theme, 4),
				segmentPaddingX = "lg",
				segmentPaddingY = "sm",
				fontSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				radius = resolveControlRadius(theme, size),
				segmentRadius = resolveSegmentRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 44),
				defaultWidth = 360,
			}
		end
		if size == "xl" then
			return {
				padding = "sm",
				gap = resolveDensityGap(theme, 5),
				segmentPaddingX = "xl",
				segmentPaddingY = "md",
				fontSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				radius = resolveControlRadius(theme, size),
				segmentRadius = resolveSegmentRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 52),
				defaultWidth = 420,
			}
		end
		if size == "md" then
		end
		return {
			padding = "xs",
			gap = resolveDensityGap(theme, 3),
			segmentPaddingX = "md",
			segmentPaddingY = "sm",
			fontSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			radius = resolveControlRadius(theme, size),
			segmentRadius = resolveSegmentRadius(theme, size),
			minHeight = resolveDensityControlSize(theme, 38),
			defaultWidth = 320,
		}
	until true
end
local function resolveSegmentedControlFrameVisualStyles(theme, variant, color, disabled)
	local intentColors = theme.colors[color]
	if disabled then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 0.12,
		}
	end
	local baseSurface = if variant == "filled" then mixColor(theme.colors.background.surface, intentColors.light, 0.32) elseif variant == "light" then mixColor(theme.colors.background.surface, intentColors.light, 0.18) elseif variant == "subtle" then mixColor(theme.colors.background.default, intentColors.light, 0.1) else mixColor(theme.colors.background.default, theme.colors.action.hover, 0.75)
	return {
		backgroundColor = baseSurface,
		strokeColor = if variant == "subtle" then theme.colors.border.subtle else theme.colors.border.default,
		strokeTransparency = if variant == "subtle" then 0.18 else 0.4,
	}
end
local function resolveSegmentedControlSegmentVisualStyles(theme, variant, color, state)
	local intentColors = theme.colors[color]
	local idleText = theme.colors.text.secondary
	local selectedText = if variant == "filled" then theme.colors.text.inverse else theme.colors.text.primary
	local selectedSurface = if variant == "filled" then intentColors.main elseif variant == "light" then mixColor(theme.colors.background.surface, intentColors.light, 0.28) elseif variant == "subtle" then mixColor(theme.colors.background.surface, theme.colors.border.default, 0.12) else mixColor(theme.colors.background.default, theme.colors.border.default, 0.28)
	if state == "disabled" then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			backgroundTransparency = 1,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 1,
			textColor = theme.colors.text.disabled,
			textTransparency = 0,
		}
	end
	if state == "selected" then
		return {
			backgroundColor = selectedSurface,
			backgroundTransparency = 1,
			strokeColor = if variant == "filled" then intentColors.dark else mixColor(intentColors.main, theme.colors.border.default, 0.35),
			strokeTransparency = 1,
			textColor = selectedText,
			textTransparency = 0,
		}
	end
	local hoverSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.16)
	local pressedSurface = mixColor(theme.colors.background.surface, theme.colors.action.pressed, 0.45)
	return {
		backgroundColor = if state == "pressed" then pressedSurface elseif state == "hovered" then hoverSurface else theme.colors.background.surface,
		backgroundTransparency = if state == "idle" then 1 else 0,
		strokeColor = if state == "pressed" then intentColors.main else theme.colors.border.subtle,
		strokeTransparency = if state == "idle" then 1 elseif state == "pressed" then 0.2 else 0.36,
		textColor = if state == "idle" then idleText else theme.colors.text.primary,
		textTransparency = 0,
	}
end
local function resolveSegmentedControlIndicatorVisualStyles(theme, variant, color, disabled)
	local intentColors = theme.colors[color]
	local selectedSurface = if variant == "filled" then intentColors.main elseif variant == "light" then mixColor(theme.colors.background.surface, intentColors.light, 0.28) elseif variant == "subtle" then mixColor(theme.colors.background.surface, theme.colors.border.default, 0.12) else theme.colors.background.raised
	if disabled then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			backgroundTransparency = 0,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 0.28,
		}
	end
	return {
		backgroundColor = selectedSurface,
		backgroundTransparency = 0,
		strokeColor = if variant == "filled" or variant == "light" then mixColor(intentColors.main, theme.colors.border.default, 0.45) else theme.colors.border.default,
		strokeTransparency = if variant == "filled" then 0.1 elseif variant == "light" then 0.22 else 0.25,
	}
end
local function resolveSegmentedControlIndicatorMotionTransition()
	return {
		selectedIndex = {
			duration = "normal",
			easing = "out",
		},
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
	}
end
local function resolveSegmentedControlSegmentMotionTransition(state)
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
			strokeColor = {
				duration = "instant",
				easing = "standard",
			},
			strokeTransparency = {
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
		}
	end
	return {
		backgroundColor = {
			duration = if state == "selected" then "normal" else "fast",
			easing = "standard",
		},
		backgroundTransparency = {
			duration = if state == "selected" then "normal" else "fast",
			easing = "standard",
		},
		strokeColor = {
			duration = if state == "selected" then "normal" else "fast",
			easing = "standard",
		},
		strokeTransparency = {
			duration = if state == "selected" then "normal" else "fast",
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
	}
end
return {
	resolveSegmentedControlSizeStyles = resolveSegmentedControlSizeStyles,
	resolveSegmentedControlFrameVisualStyles = resolveSegmentedControlFrameVisualStyles,
	resolveSegmentedControlSegmentVisualStyles = resolveSegmentedControlSegmentVisualStyles,
	resolveSegmentedControlIndicatorVisualStyles = resolveSegmentedControlIndicatorVisualStyles,
	resolveSegmentedControlIndicatorMotionTransition = resolveSegmentedControlIndicatorMotionTransition,
	resolveSegmentedControlSegmentMotionTransition = resolveSegmentedControlSegmentMotionTransition,
}
