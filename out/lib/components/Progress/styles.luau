-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveProgressSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				trackHeight = 6,
				defaultWidth = theme.spacing.xl * 7,
				labelSize = theme.fontSizes.xs,
				labelLineHeight = theme.lineHeights.xs,
				labelGap = theme.spacing.xs,
			}
		end
		if size == "sm" then
			return {
				trackHeight = 8,
				defaultWidth = theme.spacing.xl * 8,
				labelSize = theme.fontSizes.sm,
				labelLineHeight = theme.lineHeights.sm,
				labelGap = theme.spacing.xs,
			}
		end
		if size == "lg" then
			return {
				trackHeight = 14,
				defaultWidth = theme.spacing.xl * 11,
				labelSize = theme.fontSizes.lg,
				labelLineHeight = theme.lineHeights.lg,
				labelGap = theme.spacing.sm,
			}
		end
		if size == "xl" then
			return {
				trackHeight = 18,
				defaultWidth = theme.spacing.xl * 13,
				labelSize = theme.fontSizes.xl,
				labelLineHeight = theme.lineHeights.xl,
				labelGap = theme.spacing.sm,
			}
		end
		if size == "md" then
		end
		return {
			trackHeight = 11,
			defaultWidth = theme.spacing.xl * 10,
			labelSize = theme.fontSizes.md,
			labelLineHeight = theme.lineHeights.md,
			labelGap = theme.spacing.xs,
		}
	until true
end
local function resolveProgressRadius(theme, size, radius)
	if radius == nil then
		return UDim.new(0.5, 0)
	end
	local _radius = radius
	if type(_radius) == "number" then
		return UDim.new(0, radius)
	end
	local _radius_1 = radius
	if typeof(_radius_1) == "UDim" then
		return radius
	end
	return UDim.new(0, resolveThemeSizeSafe(theme, "progress", radius, "radius", resolveThemeSizeSafe(theme, "progress", size, "radius", theme.radius.sm)))
end
local function resolveProgressVisualStyles(theme, variant, color)
	local intentColors = theme.colors[color]
	local surfaceTrack = mixColor(theme.colors.background.default, theme.colors.border.default, 0.22)
	local recessedTrack = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.54)
	local lightTrack = mixColor(theme.colors.background.surface, intentColors.light, 0.2)
	local subtleTrack = mixColor(theme.colors.background.default, intentColors.light, 0.12)
	repeat
		local _fallthrough = false
		if variant == "filled" then
			return {
				trackColor = recessedTrack,
				trackStrokeColor = mixColor(theme.colors.border.default, theme.colors.background.surface, 0.24),
				trackStrokeTransparency = 0.16,
				fillColor = intentColors.main,
				labelColor = theme.colors.text.primary,
				valueLabelColor = theme.colors.text.secondary,
			}
		end
		if variant == "light" then
			return {
				trackColor = lightTrack,
				trackStrokeColor = mixColor(intentColors.light, theme.colors.background.surface, 0.34),
				trackStrokeTransparency = 0.2,
				fillColor = mixColor(intentColors.main, theme.colors.background.surface, 0.08),
				labelColor = theme.colors.text.primary,
				valueLabelColor = intentColors.dark,
			}
		end
		if variant == "subtle" then
			return {
				trackColor = subtleTrack,
				trackStrokeColor = mixColor(theme.colors.border.subtle, theme.colors.background.surface, 0.18),
				trackStrokeTransparency = 0.34,
				fillColor = mixColor(intentColors.main, theme.colors.background.surface, 0.18),
				labelColor = theme.colors.text.primary,
				valueLabelColor = theme.colors.text.secondary,
			}
		end
		if variant == "outline" then
		end
		return {
			trackColor = surfaceTrack,
			trackStrokeColor = theme.colors.border.default,
			trackStrokeTransparency = 0.1,
			fillColor = intentColors.main,
			labelColor = theme.colors.text.primary,
			valueLabelColor = theme.colors.text.secondary,
		}
	until true
end
local function resolveProgressMotionTransition()
	return {
		percent = {
			duration = "normal",
			easing = "out",
		},
	}
end
return {
	resolveProgressSizeStyles = resolveProgressSizeStyles,
	resolveProgressRadius = resolveProgressRadius,
	resolveProgressVisualStyles = resolveProgressVisualStyles,
	resolveProgressMotionTransition = resolveProgressMotionTransition,
}
