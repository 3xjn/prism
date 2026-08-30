-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveDensityMarkSize = _theme.resolveDensityMarkSize
local resolveThemeSpacing = _theme.resolveThemeSpacing
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveSelectRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "select", "sm", "radius", theme.radius.sm))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "select", "lg", "radius", theme.radius.lg))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "select", "md", "radius", theme.radius.md))
	until true
end
local function resolveOptionRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "select", "sm", "radius", theme.radius.xs))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "select", "md", "radius", theme.radius.md))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "select", "sm", "radius", theme.radius.sm))
	until true
end
local function resolveSelectSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				paddingX = "sm",
				paddingY = "xs",
				optionPaddingX = "sm",
				optionPaddingY = "xs",
				listPadding = "xs",
				listGap = resolveThemeSpacing(theme, "xs"),
				optionGap = resolveThemeSpacing(theme, "xs"),
				fontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				radius = resolveSelectRadius(theme, size),
				optionRadius = resolveOptionRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.xs),
				optionHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.xs),
				defaultWidth = theme.spacing.xl * 7,
				indicatorSize = resolveDensityMarkSize(theme, 12),
				indicatorGap = resolveThemeSpacing(theme, "xs"),
			}
		end
		if size == "sm" then
			return {
				paddingX = "md",
				paddingY = "xs",
				optionPaddingX = "md",
				optionPaddingY = "xs",
				listPadding = "xs",
				listGap = resolveThemeSpacing(theme, "xs"),
				optionGap = resolveThemeSpacing(theme, "xs"),
				fontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				radius = resolveSelectRadius(theme, size),
				optionRadius = resolveOptionRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.sm),
				optionHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.sm),
				defaultWidth = theme.spacing.xl * 8,
				indicatorSize = resolveDensityMarkSize(theme, 14),
				indicatorGap = resolveThemeSpacing(theme, "xs"),
			}
		end
		if size == "lg" then
			return {
				paddingX = "lg",
				paddingY = "sm",
				optionPaddingX = "lg",
				optionPaddingY = "sm",
				listPadding = "sm",
				listGap = resolveThemeSpacing(theme, "sm"),
				optionGap = resolveThemeSpacing(theme, "xs"),
				fontSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				radius = resolveSelectRadius(theme, size),
				optionRadius = resolveOptionRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.lg),
				optionHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.md),
				defaultWidth = theme.spacing.xl * 11,
				indicatorSize = resolveDensityMarkSize(theme, 18),
				indicatorGap = resolveThemeSpacing(theme, "sm"),
			}
		end
		if size == "xl" then
			return {
				paddingX = "xl",
				paddingY = "md",
				optionPaddingX = "xl",
				optionPaddingY = "sm",
				listPadding = "sm",
				listGap = resolveThemeSpacing(theme, "sm"),
				optionGap = resolveThemeSpacing(theme, "sm"),
				fontSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				radius = resolveSelectRadius(theme, size),
				optionRadius = resolveOptionRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, theme.spacing.xl * 2),
				optionHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.lg),
				defaultWidth = theme.spacing.xl * 13,
				indicatorSize = resolveDensityMarkSize(theme, 20),
				indicatorGap = resolveThemeSpacing(theme, "sm"),
			}
		end
		if size == "md" then
		end
		return {
			paddingX = "md",
			paddingY = "sm",
			optionPaddingX = "md",
			optionPaddingY = "sm",
			listPadding = "xs",
			listGap = resolveThemeSpacing(theme, "xs"),
			optionGap = resolveThemeSpacing(theme, "xs"),
			fontSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			radius = resolveSelectRadius(theme, size),
			optionRadius = resolveOptionRadius(theme, size),
			minHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.md),
			optionHeight = resolveDensityControlSize(theme, theme.spacing.xl + theme.spacing.sm),
			defaultWidth = theme.spacing.xl * 10,
			indicatorSize = resolveDensityMarkSize(theme, 16),
			indicatorGap = resolveThemeSpacing(theme, "xs"),
		}
	until true
end
local function resolveSelectTriggerVisualStyles(theme, variant, color, state, hasValue)
	local intentColors = theme.colors[color]
	local idleTextColor = theme.colors.text.primary
	local placeholderBase = mixColor(theme.colors.text.secondary, theme.colors.border.default, 0.24)
	local hoverPlaceholder = mixColor(placeholderBase, intentColors.main, 0.14)
	local openPlaceholder = mixColor(placeholderBase, intentColors.main, 0.3)
	local outlineIdleSurface = theme.colors.background.surface
	local outlineHoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.5)
	local outlineOpenSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.2)
	local outlinePressedSurface = mixColor(outlineHoverSurface, theme.colors.action.pressed, 0.55)
	local subtleIdleSurface = mixColor(theme.colors.background.default, intentColors.light, 0.14)
	local subtleHoverSurface = mixColor(subtleIdleSurface, theme.colors.background.surface, 0.48)
	local subtleOpenSurface = mixColor(subtleIdleSurface, intentColors.light, 0.18)
	local subtlePressedSurface = mixColor(subtleHoverSurface, theme.colors.action.pressed, 0.35)
	local lightIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.28)
	local lightHoverSurface = mixColor(lightIdleSurface, theme.colors.background.surface, 0.12)
	local lightOpenSurface = mixColor(lightIdleSurface, intentColors.main, 0.08)
	local lightPressedSurface = mixColor(lightHoverSurface, theme.colors.action.pressed, 0.28)
	local filledIdleSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.34)
	local filledHoverSurface = mixColor(filledIdleSurface, intentColors.light, 0.08)
	local filledOpenSurface = mixColor(filledIdleSurface, intentColors.main, 0.12)
	local filledPressedSurface = mixColor(filledHoverSurface, theme.colors.action.pressed, 0.24)
	if state == "disabled" then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 0.1,
			strokeThickness = 1,
			textColor = theme.colors.text.disabled,
			placeholderColor = theme.colors.text.disabled,
			indicatorColor = theme.colors.text.disabled,
			indicatorRotation = 90,
		}
	end
	local backgroundColor = outlineIdleSurface
	local strokeColor = theme.colors.border.default
	local strokeTransparency = 0.12
	local strokeThickness = 1
	repeat
		local _fallthrough = false
		if variant == "subtle" then
			backgroundColor = if state == "pressed" then subtlePressedSurface elseif state == "open" then subtleOpenSurface elseif state == "hovered" then subtleHoverSurface else subtleIdleSurface
			strokeColor = if state == "open" then intentColors.main elseif state == "hovered" then theme.colors.border.default else theme.colors.border.subtle
			strokeTransparency = if state == "open" then 0.04 elseif state == "hovered" then 0.14 else 0.28
			strokeThickness = if state == "open" then 2 else 1
			break
		end
		if variant == "light" then
			backgroundColor = if state == "pressed" then lightPressedSurface elseif state == "open" then lightOpenSurface elseif state == "hovered" then lightHoverSurface else lightIdleSurface
			strokeColor = if state == "open" then intentColors.main elseif state == "hovered" then intentColors.dark else intentColors.light
			strokeTransparency = if state == "open" then 0.02 elseif state == "hovered" then 0.08 else 0.14
			strokeThickness = if state == "open" then 2 else 1
			break
		end
		if variant == "filled" then
			backgroundColor = if state == "pressed" then filledPressedSurface elseif state == "open" then filledOpenSurface elseif state == "hovered" then filledHoverSurface else filledIdleSurface
			strokeColor = if state == "open" then intentColors.dark elseif state == "hovered" then intentColors.main else mixColor(intentColors.main, theme.colors.border.default, 0.5)
			strokeTransparency = if state == "open" then 0.02 elseif state == "hovered" then 0.08 else 0.16
			strokeThickness = if state == "open" then 2 else 1
			break
		end
		if variant == "outline" then
		end
		backgroundColor = if state == "pressed" then outlinePressedSurface elseif state == "open" then outlineOpenSurface elseif state == "hovered" then outlineHoverSurface else outlineIdleSurface
		strokeColor = if state == "open" then intentColors.main elseif state == "hovered" then theme.colors.border.strong else theme.colors.border.default
		strokeTransparency = if state == "open" then 0 elseif state == "hovered" then 0.06 else 0.12
		strokeThickness = if state == "open" then 2 else 1
		break
	until true
	local placeholderColor = if state == "open" then openPlaceholder elseif state == "hovered" or state == "pressed" then hoverPlaceholder else placeholderBase
	local textColor = if hasValue then idleTextColor else placeholderColor
	local indicatorColor = if hasValue then mixColor(idleTextColor, intentColors.main, if state == "open" then 0.16 else 0.08) else placeholderColor
	return {
		backgroundColor = backgroundColor,
		strokeColor = strokeColor,
		strokeTransparency = strokeTransparency,
		strokeThickness = strokeThickness,
		textColor = textColor,
		placeholderColor = placeholderColor,
		indicatorColor = indicatorColor,
		indicatorRotation = if state == "open" then -90 else 90,
	}
end
local function resolveSelectListVisualStyles(theme, color, variant)
	local intentColors = theme.colors[color]
	repeat
		local _fallthrough = false
		if variant == "subtle" then
			return {
				backgroundColor = mixColor(theme.colors.background.surface, intentColors.light, 0.12),
				strokeColor = theme.colors.border.default,
				strokeTransparency = 0.16,
			}
		end
		if variant == "light" then
			return {
				backgroundColor = mixColor(theme.colors.background.surface, intentColors.light, 0.18),
				strokeColor = intentColors.light,
				strokeTransparency = 0.08,
			}
		end
		if variant == "filled" then
			return {
				backgroundColor = mixColor(theme.colors.background.surface, intentColors.light, 0.2),
				strokeColor = mixColor(intentColors.main, theme.colors.border.default, 0.52),
				strokeTransparency = 0.08,
			}
		end
		if variant == "outline" then
		end
		return {
			backgroundColor = theme.colors.background.surface,
			strokeColor = theme.colors.border.default,
			strokeTransparency = 0.08,
		}
	until true
end
local function resolveSelectOptionVisualStyles(theme, color, state)
	local intentColors = theme.colors[color]
	local selectedSurface = mixColor(theme.colors.background.default, intentColors.light, 0.36)
	local selectedHoverSurface = mixColor(selectedSurface, intentColors.light, 0.16)
	local hoverSurface = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.9)
	if state == "disabled" then
		return {
			backgroundColor = theme.colors.background.surface,
			backgroundTransparency = 1,
			textColor = theme.colors.text.disabled,
			textTransparency = 0,
		}
	end
	if state == "selected" then
		return {
			backgroundColor = selectedHoverSurface,
			backgroundTransparency = 0,
			textColor = intentColors.dark,
			textTransparency = 0,
		}
	end
	if state == "hovered" then
		return {
			backgroundColor = hoverSurface,
			backgroundTransparency = 0,
			textColor = theme.colors.text.primary,
			textTransparency = 0,
		}
	end
	return {
		backgroundColor = theme.colors.background.surface,
		backgroundTransparency = 1,
		textColor = theme.colors.text.primary,
		textTransparency = 0,
	}
end
local function resolveSelectTriggerMotionTransition(state)
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
			textColor = {
				duration = "instant",
				easing = "standard",
			},
			placeholderColor = {
				duration = "instant",
				easing = "standard",
			},
			indicatorColor = {
				duration = "instant",
				easing = "standard",
			},
			indicatorRotation = {
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
				easing = "standard",
			},
			textColor = {
				duration = "fast",
				easing = "standard",
			},
			placeholderColor = {
				duration = "fast",
				easing = "standard",
			},
			indicatorColor = {
				duration = "fast",
				easing = "standard",
			},
			indicatorRotation = {
				duration = "fast",
				easing = "out",
			},
		}
	end
	if state == "open" then
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
			textColor = {
				duration = "fast",
				easing = "standard",
			},
			placeholderColor = {
				duration = "fast",
				easing = "standard",
			},
			indicatorColor = {
				duration = "fast",
				easing = "standard",
			},
			indicatorRotation = {
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
				easing = "standard",
			},
			textColor = {
				duration = "fast",
				easing = "standard",
			},
			placeholderColor = {
				duration = "fast",
				easing = "standard",
			},
			indicatorColor = {
				duration = "fast",
				easing = "standard",
			},
			indicatorRotation = {
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
		strokeColor = {
			duration = "normal",
			easing = "standard",
		},
		strokeTransparency = {
			duration = "normal",
			easing = "standard",
		},
		strokeThickness = {
			duration = "normal",
			easing = "standard",
		},
		textColor = {
			duration = "normal",
			easing = "standard",
		},
		placeholderColor = {
			duration = "normal",
			easing = "standard",
		},
		indicatorColor = {
			duration = "normal",
			easing = "standard",
		},
		indicatorRotation = {
			duration = "normal",
			easing = "out",
		},
	}
end
local function resolveSelectOptionMotionTransition(state)
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
		}
	end
	if state == "selected" then
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
	}
end
return {
	resolveSelectSizeStyles = resolveSelectSizeStyles,
	resolveSelectTriggerVisualStyles = resolveSelectTriggerVisualStyles,
	resolveSelectListVisualStyles = resolveSelectListVisualStyles,
	resolveSelectOptionVisualStyles = resolveSelectOptionVisualStyles,
	resolveSelectTriggerMotionTransition = resolveSelectTriggerMotionTransition,
	resolveSelectOptionMotionTransition = resolveSelectOptionMotionTransition,
}
