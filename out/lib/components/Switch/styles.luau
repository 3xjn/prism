-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveDensityMarkSize = _theme.resolveDensityMarkSize
local resolveThemeSpacing = _theme.resolveThemeSpacing
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveSwitchSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				trackWidth = resolveDensityMarkSize(theme, 28),
				trackHeight = resolveDensityMarkSize(theme, 16),
				thumbDiameter = resolveDensityMarkSize(theme, 10),
				thumbInset = 3,
				iconSize = resolveDensityMarkSize(theme, 6),
				labelGap = resolveThemeSpacing(theme, "xs"),
				labelSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				minHeight = resolveDensityControlSize(theme, 20),
			}
		end
		if size == "sm" then
			return {
				trackWidth = resolveDensityMarkSize(theme, 32),
				trackHeight = resolveDensityMarkSize(theme, 18),
				thumbDiameter = resolveDensityMarkSize(theme, 12),
				thumbInset = 3,
				iconSize = resolveDensityMarkSize(theme, 7),
				labelGap = resolveThemeSpacing(theme, "xs"),
				labelSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				minHeight = resolveDensityControlSize(theme, 22),
			}
		end
		if size == "lg" then
			return {
				trackWidth = resolveDensityMarkSize(theme, 44),
				trackHeight = resolveDensityMarkSize(theme, 24),
				thumbDiameter = resolveDensityMarkSize(theme, 18),
				thumbInset = 3,
				iconSize = resolveDensityMarkSize(theme, 10),
				labelGap = resolveThemeSpacing(theme, "sm"),
				labelSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				minHeight = resolveDensityControlSize(theme, 28),
			}
		end
		if size == "xl" then
			return {
				trackWidth = resolveDensityMarkSize(theme, 50),
				trackHeight = resolveDensityMarkSize(theme, 28),
				thumbDiameter = resolveDensityMarkSize(theme, 20),
				thumbInset = 4,
				iconSize = resolveDensityMarkSize(theme, 12),
				labelGap = resolveThemeSpacing(theme, "md"),
				labelSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				minHeight = resolveDensityControlSize(theme, 32),
			}
		end
		if size == "md" then
		end
		return {
			trackWidth = resolveDensityMarkSize(theme, 38),
			trackHeight = resolveDensityMarkSize(theme, 20),
			thumbDiameter = resolveDensityMarkSize(theme, 14),
			thumbInset = 3,
			iconSize = resolveDensityMarkSize(theme, 8),
			labelGap = resolveThemeSpacing(theme, "sm"),
			labelSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			minHeight = resolveDensityControlSize(theme, 24),
		}
	until true
end
local function resolveThumbOffset(sizeStyles, checked)
	return if checked then sizeStyles.trackWidth - sizeStyles.thumbDiameter - sizeStyles.thumbInset else sizeStyles.thumbInset
end
local function resolveSwitchVisualStyles(theme, color, state, checked, sizeStyles)
	local intentColors = theme.colors[color]
	local uncheckedTrack = mixColor(theme.colors.background.surface, theme.colors.border.default, 0.35)
	local uncheckedHoverTrack = mixColor(uncheckedTrack, theme.colors.action.hover, 0.65)
	local uncheckedPressedTrack = mixColor(uncheckedTrack, theme.colors.action.pressed, 0.8)
	local checkedTrack = mixColor(intentColors.main, theme.colors.background.surface, 0.04)
	local checkedHoverTrack = mixColor(intentColors.main, intentColors.dark, 0.18)
	local checkedPressedTrack = mixColor(intentColors.dark, theme.colors.action.pressed, 0.16)
	local thumbSurface = theme.colors.background.surface
	local thumbPressed = mixColor(thumbSurface, theme.colors.action.pressed, 0.22)
	local thumbDisabled = mixColor(thumbSurface, theme.colors.action.disabledBackground, 0.38)
	local uncheckedIconColor = theme.colors.text.secondary
	local uncheckedInteractiveIconColor = theme.colors.text.primary
	local checkedIconColor = intentColors.main
	local checkedInteractiveIconColor = intentColors.dark
	if state == "disabled" then
		return {
			trackColor = if checked then mixColor(theme.colors.action.disabledBackground, intentColors.light, 0.24) else theme.colors.action.disabledBackground,
			trackStrokeColor = if checked then intentColors.light else theme.colors.border.subtle,
			trackStrokeTransparency = if checked then 0.2 else 0.12,
			thumbColor = thumbDisabled,
			thumbStrokeColor = theme.colors.border.subtle,
			thumbStrokeTransparency = if checked then 1 else 0.5,
			thumbOffset = resolveThumbOffset(sizeStyles, checked),
			iconColor = theme.colors.text.disabled,
			iconTransparency = 0,
			labelColor = theme.colors.text.disabled,
		}
	end
	return {
		trackColor = if checked then if state == "pressed" then checkedPressedTrack elseif state == "hovered" then checkedHoverTrack else checkedTrack elseif state == "pressed" then uncheckedPressedTrack elseif state == "hovered" then uncheckedHoverTrack else uncheckedTrack,
		trackStrokeColor = if checked then intentColors.dark else theme.colors.border.default,
		trackStrokeTransparency = if checked then (if state == "pressed" then 0.06 else 0.1) elseif state == "hovered" then 0.04 else 0.08,
		thumbColor = if state == "pressed" then thumbPressed else thumbSurface,
		thumbStrokeColor = if checked then intentColors.dark else theme.colors.border.default,
		thumbStrokeTransparency = if checked then 0.8 else 0.4,
		thumbOffset = resolveThumbOffset(sizeStyles, checked),
		iconColor = if checked then if state == "hovered" or state == "pressed" then checkedInteractiveIconColor else checkedIconColor elseif state == "hovered" or state == "pressed" then uncheckedInteractiveIconColor else uncheckedIconColor,
		iconTransparency = 0,
		labelColor = theme.colors.text.primary,
	}
end
local function resolveSwitchMotionTransition(state)
	if state == "disabled" then
		return {
			trackColor = {
				duration = "instant",
				easing = "standard",
			},
			trackStrokeColor = {
				duration = "instant",
				easing = "standard",
			},
			trackStrokeTransparency = {
				duration = "instant",
				easing = "standard",
			},
			thumbColor = {
				duration = "instant",
				easing = "standard",
			},
			thumbStrokeColor = {
				duration = "instant",
				easing = "standard",
			},
			thumbStrokeTransparency = {
				duration = "instant",
				easing = "standard",
			},
			thumbOffset = {
				duration = "instant",
				easing = "out",
			},
			iconColor = {
				duration = "instant",
				easing = "standard",
			},
			iconTransparency = {
				duration = "instant",
				easing = "standard",
			},
			labelColor = {
				duration = "instant",
				easing = "standard",
			},
		}
	end
	if state == "pressed" then
		return {
			trackColor = {
				duration = "fast",
				easing = "standard",
			},
			trackStrokeColor = {
				duration = "fast",
				easing = "standard",
			},
			trackStrokeTransparency = {
				duration = "fast",
				easing = "standard",
			},
			thumbColor = {
				duration = "fast",
				easing = "standard",
			},
			thumbStrokeColor = {
				duration = "fast",
				easing = "standard",
			},
			thumbStrokeTransparency = {
				duration = "fast",
				easing = "standard",
			},
			thumbOffset = {
				duration = "fast",
				easing = "out",
			},
			iconColor = {
				duration = "fast",
				easing = "standard",
			},
			iconTransparency = {
				duration = "fast",
				easing = "standard",
			},
			labelColor = {
				duration = "fast",
				easing = "standard",
			},
		}
	end
	if state == "hovered" then
		return {
			trackColor = {
				duration = "fast",
				easing = "standard",
			},
			trackStrokeColor = {
				duration = "fast",
				easing = "standard",
			},
			trackStrokeTransparency = {
				duration = "fast",
				easing = "standard",
			},
			thumbColor = {
				duration = "fast",
				easing = "standard",
			},
			thumbStrokeColor = {
				duration = "fast",
				easing = "standard",
			},
			thumbStrokeTransparency = {
				duration = "fast",
				easing = "standard",
			},
			thumbOffset = {
				duration = "normal",
				easing = "out",
			},
			iconColor = {
				duration = "fast",
				easing = "standard",
			},
			iconTransparency = {
				duration = "fast",
				easing = "standard",
			},
			labelColor = {
				duration = "fast",
				easing = "standard",
			},
		}
	end
	return {
		trackColor = {
			duration = "normal",
			easing = "standard",
		},
		trackStrokeColor = {
			duration = "normal",
			easing = "standard",
		},
		trackStrokeTransparency = {
			duration = "normal",
			easing = "standard",
		},
		thumbColor = {
			duration = "normal",
			easing = "standard",
		},
		thumbStrokeColor = {
			duration = "normal",
			easing = "standard",
		},
		thumbStrokeTransparency = {
			duration = "normal",
			easing = "standard",
		},
		thumbOffset = {
			duration = "normal",
			easing = "out",
		},
		iconColor = {
			duration = "normal",
			easing = "standard",
		},
		iconTransparency = {
			duration = "normal",
			easing = "standard",
		},
		labelColor = {
			duration = "normal",
			easing = "standard",
		},
	}
end
return {
	resolveSwitchSizeStyles = resolveSwitchSizeStyles,
	resolveSwitchVisualStyles = resolveSwitchVisualStyles,
	resolveSwitchMotionTransition = resolveSwitchMotionTransition,
}
