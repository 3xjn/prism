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
			return UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", "sm", "radius", theme.radius.sm))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", "lg", "radius", theme.radius.lg))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", "md", "radius", theme.radius.md))
	until true
end
local function resolveButtonRadius(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			_fallthrough = true
		end
		if _fallthrough or size == "sm" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", "xs", "radius", theme.radius.xs))
		end
		if size == "lg" then
			_fallthrough = true
		end
		if _fallthrough or size == "xl" then
			return UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", "md", "radius", theme.radius.md))
		end
		if size == "md" then
		end
		return UDim.new(0, resolveThemeSizeSafe(theme, "stepperInput", "sm", "radius", theme.radius.sm))
	until true
end
local function resolveStepperInputSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				padding = "xs",
				gap = resolveDensityGap(theme, 3),
				buttonWidth = resolveDensityControlSize(theme, 28),
				buttonPaddingX = "xs",
				buttonPaddingY = "xs",
				fontSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
				radius = resolveControlRadius(theme, size),
				buttonRadius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 30),
				defaultWidth = 156,
			}
		end
		if size == "sm" then
			return {
				padding = "xs",
				gap = resolveDensityGap(theme, 4),
				buttonWidth = resolveDensityControlSize(theme, 32),
				buttonPaddingX = "xs",
				buttonPaddingY = "xs",
				fontSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
				radius = resolveControlRadius(theme, size),
				buttonRadius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 34),
				defaultWidth = 176,
			}
		end
		if size == "lg" then
			return {
				padding = "sm",
				gap = resolveDensityGap(theme, 5),
				buttonWidth = resolveDensityControlSize(theme, 44),
				buttonPaddingX = "sm",
				buttonPaddingY = "xs",
				fontSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
				radius = resolveControlRadius(theme, size),
				buttonRadius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 46),
				defaultWidth = 236,
			}
		end
		if size == "xl" then
			return {
				padding = "sm",
				gap = resolveDensityGap(theme, 6),
				buttonWidth = resolveDensityControlSize(theme, 50),
				buttonPaddingX = "sm",
				buttonPaddingY = "sm",
				fontSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
				radius = resolveControlRadius(theme, size),
				buttonRadius = resolveButtonRadius(theme, size),
				minHeight = resolveDensityControlSize(theme, 54),
				defaultWidth = 272,
			}
		end
		if size == "md" then
		end
		return {
			padding = "xs",
			gap = resolveDensityGap(theme, 4),
			buttonWidth = resolveDensityControlSize(theme, 38),
			buttonPaddingX = "sm",
			buttonPaddingY = "xs",
			fontSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
			radius = resolveControlRadius(theme, size),
			buttonRadius = resolveButtonRadius(theme, size),
			minHeight = resolveDensityControlSize(theme, 40),
			defaultWidth = 204,
		}
	until true
end
local function resolveStepperInputFrameVisualStyles(theme, variant, state, readOnly)
	local idleText = if readOnly then mixColor(theme.colors.text.primary, theme.colors.text.secondary, 0.35) else theme.colors.text.primary
	local placeholderBase = if readOnly then mixColor(theme.colors.text.secondary, theme.colors.border.default, 0.3) else theme.colors.text.secondary
	if state == "disabled" then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			inputBackgroundColor = theme.colors.action.disabledBackground,
			inputBackgroundTransparency = 0.2,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 0.1,
			strokeThickness = 1,
			textColor = theme.colors.text.disabled,
			placeholderColor = theme.colors.text.disabled,
			railFillColor = mixColor(theme.colors.action.disabledBackground, theme.colors.border.default, 0.34),
			railFillTransparency = 1,
		}
	end
	local tacticalSurface = if variant == "filled" then mixColor(theme.colors.background.surface, theme.colors.border.default, if readOnly then 0.16 else 0.26) elseif variant == "light" then mixColor(theme.colors.background.surface, theme.colors.action.hover, if readOnly then 0.22 else 0.34) elseif variant == "subtle" then mixColor(theme.colors.background.surface, theme.colors.background.default, 0.48) else mixColor(theme.colors.background.surface, theme.colors.background.default, 0.24)
	local hoverSurface = mixColor(tacticalSurface, theme.colors.action.hover, 0.48)
	local focusSurface = mixColor(tacticalSurface, theme.colors.border.default, if readOnly then 0.08 else 0.14)
	local inputSurface = if variant == "filled" then mixColor(tacticalSurface, theme.colors.background.surface, 0.2) else mixColor(theme.colors.background.default, theme.colors.border.default, 0.16)
	local railFillBase = if variant == "filled" then mixColor(theme.colors.border.strong, theme.colors.background.surface, if readOnly then 0.72 else 0.56) else mixColor(theme.colors.border.strong, theme.colors.border.default, if readOnly then 0.82 else 0.62)
	return {
		backgroundColor = if state == "focused" then focusSurface elseif state == "hovered" then hoverSurface else tacticalSurface,
		inputBackgroundColor = if state == "focused" then mixColor(inputSurface, theme.colors.action.hover, 0.18) else inputSurface,
		inputBackgroundTransparency = if readOnly then 0.18 else 0,
		strokeColor = if state == "focused" then theme.colors.border.strong elseif state == "hovered" then theme.colors.border.strong else theme.colors.border.default,
		strokeTransparency = if state == "focused" then 0.16 elseif state == "hovered" then 0.08 elseif variant == "subtle" then 0.14 else 0.08,
		strokeThickness = 1,
		textColor = idleText,
		placeholderColor = if state == "focused" then mixColor(placeholderBase, theme.colors.text.primary, 0.16) else placeholderBase,
		railFillColor = if state == "focused" then mixColor(railFillBase, theme.colors.text.primary, 0.06) else railFillBase,
		railFillTransparency = if state == "focused" then 0.62 elseif state == "hovered" then 0.5 else 1,
	}
end
local function resolveStepperInputButtonVisualStyles(theme, variant, state)
	local idleSurface = if variant == "filled" then mixColor(theme.colors.border.strong, theme.colors.background.surface, 0.5) elseif variant == "light" then mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.28) else mixColor(theme.colors.background.default, theme.colors.border.default, 0.26)
	local hoverSurface = if variant == "filled" then mixColor(idleSurface, theme.colors.text.primary, 0.08) else mixColor(idleSurface, theme.colors.action.hover, 0.44)
	local pressedSurface = if variant == "filled" then mixColor(idleSurface, theme.colors.action.pressed, 0.28) else mixColor(idleSurface, theme.colors.action.pressed, 0.72)
	local idleText = if variant == "filled" then theme.colors.text.inverse else theme.colors.text.primary
	if state == "disabled" then
		return {
			backgroundColor = theme.colors.action.disabledBackground,
			backgroundTransparency = 0,
			strokeColor = theme.colors.border.subtle,
			strokeTransparency = 0.24,
			textColor = theme.colors.text.disabled,
		}
	end
	return {
		backgroundColor = if state == "pressed" then pressedSurface elseif state == "hovered" then hoverSurface else idleSurface,
		backgroundTransparency = 0,
		strokeColor = if state == "pressed" then theme.colors.border.strong elseif state == "hovered" then theme.colors.border.strong else theme.colors.border.default,
		strokeTransparency = if state == "pressed" then 0.1 elseif state == "hovered" then 0.16 else 0.1,
		textColor = if state == "pressed" then theme.colors.text.primary else idleText,
	}
end
local function resolveStepperInputFrameMotionTransition(state)
	if state == "disabled" then
		return {
			backgroundColor = {
				duration = "instant",
				easing = "standard",
			},
			inputBackgroundColor = {
				duration = "instant",
				easing = "standard",
			},
			inputBackgroundTransparency = {
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
			railFillColor = {
				duration = "instant",
				easing = "standard",
			},
			railFillTransparency = {
				duration = "instant",
				easing = "standard",
			},
		}
	end
	return {
		backgroundColor = {
			duration = if state == "focused" then "fast" else "normal",
			easing = "standard",
		},
		inputBackgroundColor = {
			duration = if state == "focused" then "fast" else "normal",
			easing = "standard",
		},
		inputBackgroundTransparency = {
			duration = if state == "focused" then "fast" else "normal",
			easing = "standard",
		},
		strokeColor = {
			duration = if state == "focused" then "fast" else "normal",
			easing = "standard",
		},
		strokeTransparency = {
			duration = if state == "focused" then "fast" else "normal",
			easing = "standard",
		},
		strokeThickness = {
			duration = if state == "focused" then "fast" else "normal",
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
		railFillColor = {
			duration = "fast",
			easing = "standard",
		},
		railFillTransparency = {
			duration = "fast",
			easing = "standard",
		},
	}
end
local function resolveStepperInputButtonMotionTransition(state)
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
		}
	end
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
	}
end
return {
	resolveStepperInputSizeStyles = resolveStepperInputSizeStyles,
	resolveStepperInputFrameVisualStyles = resolveStepperInputFrameVisualStyles,
	resolveStepperInputButtonVisualStyles = resolveStepperInputButtonVisualStyles,
	resolveStepperInputFrameMotionTransition = resolveStepperInputFrameMotionTransition,
	resolveStepperInputButtonMotionTransition = resolveStepperInputButtonMotionTransition,
}
