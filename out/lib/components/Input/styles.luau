-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveInputPlaceholderColor(base, focus, hover, state)
	if state == "focused" then
		return focus
	end
	if state == "hovered" then
		return hover
	end
	return base
end
local function resolveInputStrokeThickness(state)
	return if state == "focused" then 1.5 else 1
end
local function resolveInputDisabledVisualStyles(theme)
	return {
		backgroundColor = theme.colors.action.disabledBackground,
		strokeColor = theme.colors.border.subtle,
		strokeTransparency = 0.1,
		strokeThickness = 1,
		textColor = theme.colors.text.disabled,
		placeholderColor = theme.colors.text.disabled,
	}
end
local function resolveInputVisualStyles(theme, variant, color, state, readOnly)
	if state == "disabled" then
		return resolveInputDisabledVisualStyles(theme)
	end
	local intentColors = theme.colors[color]
	local idleTextColor = if readOnly then mixColor(theme.colors.text.primary, theme.colors.text.secondary, 0.35) else theme.colors.text.primary
	local placeholderBase = if readOnly then mixColor(theme.colors.text.secondary, theme.colors.border.default, 0.3) else theme.colors.text.secondary
	local hoverPlaceholder = mixColor(placeholderBase, intentColors.main, 0.12)
	local focusPlaceholder = mixColor(placeholderBase, intentColors.main, 0.34)
	local placeholderColor = resolveInputPlaceholderColor(placeholderBase, focusPlaceholder, hoverPlaceholder, state)
	local strokeThickness = resolveInputStrokeThickness(state)
	repeat
		local _fallthrough = false
		if variant == "subtle" then
			local idleSurface = mixColor(theme.colors.background.default, intentColors.light, if readOnly then 0.08 else 0.16)
			local hoverSurface = mixColor(idleSurface, theme.colors.background.surface, 0.45)
			local focusSurface = mixColor(idleSurface, intentColors.light, 0.2)
			return {
				backgroundColor = if state == "focused" then focusSurface elseif state == "hovered" then hoverSurface else idleSurface,
				strokeColor = if state == "focused" then intentColors.main elseif state == "hovered" then theme.colors.border.default else theme.colors.border.subtle,
				strokeTransparency = if state == "focused" then 0.04 elseif state == "hovered" then 0.14 else 0.28,
				strokeThickness = strokeThickness,
				textColor = idleTextColor,
				placeholderColor = placeholderColor,
			}
		end
		if variant == "light" then
			local idleSurface = mixColor(theme.colors.background.surface, intentColors.light, if readOnly then 0.18 else 0.3)
			local hoverSurface = mixColor(idleSurface, theme.colors.background.surface, 0.12)
			local focusSurface = mixColor(idleSurface, intentColors.main, 0.1)
			return {
				backgroundColor = if state == "focused" then focusSurface elseif state == "hovered" then hoverSurface else idleSurface,
				strokeColor = if state == "focused" then intentColors.main elseif state == "hovered" then intentColors.dark else intentColors.light,
				strokeTransparency = if state == "focused" then 0.02 elseif state == "hovered" then 0.08 else 0.14,
				strokeThickness = strokeThickness,
				textColor = idleTextColor,
				placeholderColor = placeholderColor,
			}
		end
		if variant == "filled" then
			local idleSurface = mixColor(theme.colors.background.surface, intentColors.light, if readOnly then 0.22 else 0.34)
			local hoverSurface = mixColor(idleSurface, intentColors.light, 0.1)
			local focusSurface = mixColor(idleSurface, intentColors.main, 0.14)
			return {
				backgroundColor = if state == "focused" then focusSurface elseif state == "hovered" then hoverSurface else idleSurface,
				strokeColor = if state == "focused" then intentColors.dark elseif state == "hovered" then intentColors.main else mixColor(intentColors.main, theme.colors.border.default, 0.5),
				strokeTransparency = if state == "focused" then 0.02 elseif state == "hovered" then 0.08 else 0.16,
				strokeThickness = strokeThickness,
				textColor = idleTextColor,
				placeholderColor = placeholderColor,
			}
		end
		if variant == "outline" then
		end
		do
			local idleSurface = if readOnly then mixColor(theme.colors.background.surface, theme.colors.background.default, 0.45) else theme.colors.background.surface
			local hoverSurface = if readOnly then mixColor(idleSurface, theme.colors.action.hover, 0.35) else mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.55)
			local focusSurface = mixColor(theme.colors.background.surface, intentColors.light, if readOnly then 0.14 else 0.22)
			return {
				backgroundColor = if state == "focused" then focusSurface elseif state == "hovered" then hoverSurface else idleSurface,
				strokeColor = if state == "focused" then intentColors.main elseif state == "hovered" then theme.colors.border.strong else theme.colors.border.default,
				strokeTransparency = if state == "focused" then 0 elseif state == "hovered" then 0.06 else 0.12,
				strokeThickness = strokeThickness,
				textColor = idleTextColor,
				placeholderColor = placeholderColor,
			}
		end
	until true
end
local function resolveInputMotionTransition(state)
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
		}
	end
	if state == "focused" then
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
	}
end
return {
	resolveInputVisualStyles = resolveInputVisualStyles,
	resolveInputMotionTransition = resolveInputMotionTransition,
}
