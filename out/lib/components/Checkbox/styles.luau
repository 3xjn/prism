-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveDensityMarkSize = _theme.resolveDensityMarkSize
local resolveThemeSpacing = _theme.resolveThemeSpacing
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveCheckboxSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				markWidth = resolveDensityMarkSize(theme, 14),
				markHeight = resolveDensityMarkSize(theme, 14),
				glyphSize = resolveDensityMarkSize(theme, 9),
				labelGap = resolveThemeSpacing(theme, "xs"),
				labelSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				minHeight = resolveDensityControlSize(theme, 20),
			}
		end
		if size == "sm" then
			return {
				markWidth = resolveDensityMarkSize(theme, 16),
				markHeight = resolveDensityMarkSize(theme, 16),
				glyphSize = resolveDensityMarkSize(theme, 10),
				labelGap = resolveThemeSpacing(theme, "xs"),
				labelSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				minHeight = resolveDensityControlSize(theme, 22),
			}
		end
		if size == "lg" then
			return {
				markWidth = resolveDensityMarkSize(theme, 20),
				markHeight = resolveDensityMarkSize(theme, 20),
				glyphSize = resolveDensityMarkSize(theme, 13),
				labelGap = resolveThemeSpacing(theme, "sm"),
				labelSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				minHeight = resolveDensityControlSize(theme, 28),
			}
		end
		if size == "xl" then
			return {
				markWidth = resolveDensityMarkSize(theme, 22),
				markHeight = resolveDensityMarkSize(theme, 22),
				glyphSize = resolveDensityMarkSize(theme, 15),
				labelGap = resolveThemeSpacing(theme, "md"),
				labelSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				minHeight = resolveDensityControlSize(theme, 32),
			}
		end
		if size == "md" then
		end
		return {
			markWidth = resolveDensityMarkSize(theme, 18),
			markHeight = resolveDensityMarkSize(theme, 18),
			glyphSize = resolveDensityMarkSize(theme, 12),
			labelGap = resolveThemeSpacing(theme, "sm"),
			labelSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			minHeight = resolveDensityControlSize(theme, 24),
		}
	until true
end
local function resolveCheckboxVisualStyles(theme, color, state, checked)
	local intentColors = theme.colors[color]
	local idleMark = mixColor(theme.colors.background.surface, theme.colors.border.default, 0.18)
	local hoverMark = mixColor(idleMark, theme.colors.action.hover, 0.65)
	local pressedMark = mixColor(idleMark, theme.colors.action.pressed, 0.85)
	local uncheckedStroke = theme.colors.border.default
	local uncheckedInteractiveStroke = mixColor(theme.colors.border.strong, theme.colors.background.surface, 0.12)
	local checkedStroke = mixColor(intentColors.dark, theme.colors.background.surface, 0.24)
	local checkedFill = mixColor(intentColors.main, theme.colors.background.surface, 0.04)
	local checkedHoverFill = mixColor(intentColors.main, intentColors.dark, 0.14)
	local checkedPressedFill = mixColor(intentColors.dark, theme.colors.action.pressed, 0.14)
	if state == "disabled" then
		return {
			markColor = theme.colors.action.disabledBackground,
			markStrokeColor = if checked then intentColors.light else theme.colors.border.subtle,
			markStrokeTransparency = if checked then 0.26 else 0.16,
			fillColor = if checked then mixColor(theme.colors.action.disabledBackground, intentColors.light, 0.28) else theme.colors.action.disabledBackground,
			fillTransparency = if checked then 0 else 1,
			glyphColor = theme.colors.text.disabled,
			glyphTransparency = if checked then 0.08 else 1,
			labelColor = theme.colors.text.disabled,
		}
	end
	return {
		markColor = if checked then checkedFill elseif state == "pressed" then pressedMark elseif state == "hovered" then hoverMark else idleMark,
		markStrokeColor = if checked then checkedStroke elseif state == "hovered" or state == "pressed" then uncheckedInteractiveStroke else uncheckedStroke,
		markStrokeTransparency = if checked then (if state == "pressed" then 0.08 else 0.14) elseif state == "hovered" then 0.06 else 0.12,
		fillColor = if checked then if state == "pressed" then checkedPressedFill elseif state == "hovered" then checkedHoverFill else checkedFill else intentColors.main,
		fillTransparency = if checked then 0 else 1,
		glyphColor = if checked then theme.colors.text.inverse else intentColors.main,
		glyphTransparency = if checked then 0 else 1,
		labelColor = theme.colors.text.primary,
	}
end
local function resolveCheckboxMotionTransition(state)
	if state == "disabled" then
		return {
			markColor = {
				duration = "instant",
				easing = "standard",
			},
			markStrokeColor = {
				duration = "instant",
				easing = "standard",
			},
			markStrokeTransparency = {
				duration = "instant",
				easing = "standard",
			},
			fillColor = {
				duration = "instant",
				easing = "standard",
			},
			fillTransparency = {
				duration = "instant",
				easing = "standard",
			},
			glyphColor = {
				duration = "instant",
				easing = "standard",
			},
			glyphTransparency = {
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
			markColor = {
				duration = "fast",
				easing = "standard",
			},
			markStrokeColor = {
				duration = "fast",
				easing = "standard",
			},
			markStrokeTransparency = {
				duration = "fast",
				easing = "standard",
			},
			fillColor = {
				duration = "fast",
				easing = "standard",
			},
			fillTransparency = {
				duration = "fast",
				easing = "standard",
			},
			glyphColor = {
				duration = "fast",
				easing = "standard",
			},
			glyphTransparency = {
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
		markColor = {
			duration = "normal",
			easing = "standard",
		},
		markStrokeColor = {
			duration = "normal",
			easing = "standard",
		},
		markStrokeTransparency = {
			duration = "normal",
			easing = "standard",
		},
		fillColor = {
			duration = "normal",
			easing = "standard",
		},
		fillTransparency = {
			duration = "fast",
			easing = "standard",
		},
		glyphColor = {
			duration = "normal",
			easing = "standard",
		},
		glyphTransparency = {
			duration = "fast",
			easing = "standard",
		},
		labelColor = {
			duration = "normal",
			easing = "standard",
		},
	}
end
return {
	resolveCheckboxSizeStyles = resolveCheckboxSizeStyles,
	resolveCheckboxVisualStyles = resolveCheckboxVisualStyles,
	resolveCheckboxMotionTransition = resolveCheckboxMotionTransition,
}
