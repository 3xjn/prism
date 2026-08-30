-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveSliderSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				trackHeight = 4,
				thumbDiameter = 12,
				minHeight = 20,
				defaultWidth = theme.spacing.xl * 7,
				labelSize = theme.fontSizes.xs,
				labelLineHeight = theme.lineHeights.xs,
			}
		end
		if size == "sm" then
			return {
				trackHeight = 4,
				thumbDiameter = 14,
				minHeight = 22,
				defaultWidth = theme.spacing.xl * 8,
				labelSize = theme.fontSizes.sm,
				labelLineHeight = theme.lineHeights.sm,
			}
		end
		if size == "lg" then
			return {
				trackHeight = 6,
				thumbDiameter = 18,
				minHeight = 28,
				defaultWidth = theme.spacing.xl * 11,
				labelSize = theme.fontSizes.lg,
				labelLineHeight = theme.lineHeights.lg,
			}
		end
		if size == "xl" then
			return {
				trackHeight = 8,
				thumbDiameter = 20,
				minHeight = 32,
				defaultWidth = theme.spacing.xl * 13,
				labelSize = theme.fontSizes.xl,
				labelLineHeight = theme.lineHeights.xl,
			}
		end
		if size == "md" then
		end
		return {
			trackHeight = 6,
			thumbDiameter = 16,
			minHeight = 24,
			defaultWidth = theme.spacing.xl * 10,
			labelSize = theme.fontSizes.md,
			labelLineHeight = theme.lineHeights.md,
		}
	until true
end
local function resolveSliderVisualStyles(theme, color, state)
	local intentColors = theme.colors[color]
	local idleTrack = mixColor(theme.colors.background.surface, theme.colors.border.default, 0.42)
	local hoverTrack = mixColor(idleTrack, theme.colors.action.hover, 0.7)
	local pressedTrack = mixColor(idleTrack, theme.colors.action.pressed, 0.78)
	local idleRange = intentColors.main
	local hoverRange = mixColor(intentColors.main, intentColors.dark, 0.12)
	local pressedRange = mixColor(intentColors.dark, theme.colors.action.pressed, 0.16)
	local idleThumb = intentColors.main
	local hoverThumb = mixColor(intentColors.main, intentColors.dark, 0.1)
	local pressedThumb = intentColors.dark
	local idleThumbStroke = mixColor(idleThumb, theme.colors.border.strong, 0.24)
	local hoverThumbStroke = mixColor(hoverThumb, theme.colors.border.strong, 0.28)
	local pressedThumbStroke = mixColor(pressedThumb, theme.colors.border.strong, 0.34)
	if state == "disabled" then
		local disabledAccent = mixColor(theme.colors.action.disabledBackground, intentColors.light, 0.26)
		return {
			trackColor = theme.colors.action.disabledBackground,
			trackStrokeColor = theme.colors.border.subtle,
			trackStrokeTransparency = 0.12,
			rangeColor = disabledAccent,
			thumbColor = disabledAccent,
			thumbStrokeColor = mixColor(disabledAccent, theme.colors.border.default, 0.2),
			thumbStrokeTransparency = 0.2,
			labelColor = theme.colors.text.disabled,
			valueLabelColor = theme.colors.text.disabled,
		}
	end
	return {
		trackColor = if state == "pressed" then pressedTrack elseif state == "hovered" then hoverTrack else idleTrack,
		trackStrokeColor = if state == "pressed" then theme.colors.border.strong else theme.colors.border.default,
		trackStrokeTransparency = if state == "pressed" then 0.04 elseif state == "hovered" then 0.08 else 0.12,
		rangeColor = if state == "pressed" then pressedRange elseif state == "hovered" then hoverRange else idleRange,
		thumbColor = if state == "pressed" then pressedThumb elseif state == "hovered" then hoverThumb else idleThumb,
		thumbStrokeColor = if state == "pressed" then pressedThumbStroke elseif state == "hovered" then hoverThumbStroke else idleThumbStroke,
		thumbStrokeTransparency = if state == "pressed" then 0.16 elseif state == "hovered" then 0.22 else 0.28,
		labelColor = theme.colors.text.secondary,
		valueLabelColor = theme.colors.text.primary,
	}
end
return {
	resolveSliderSizeStyles = resolveSliderSizeStyles,
	resolveSliderVisualStyles = resolveSliderVisualStyles,
}
