-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local mixColor = TS.import(script, script.Parent.Parent, "_shared", "visual").mixColor
local function resolveCircularProgressSizeStyles(theme, size)
	repeat
		local _fallthrough = false
		if size == "xs" then
			return {
				diameter = 28,
				thickness = 3,
				segmentLength = 4,
				labelSize = theme.fontSizes.xs,
				valueLabelSize = theme.fontSizes.xs,
				lineHeight = theme.lineHeights.xs,
			}
		end
		if size == "sm" then
			return {
				diameter = 36,
				thickness = 4,
				segmentLength = 5,
				labelSize = theme.fontSizes.xs,
				valueLabelSize = theme.fontSizes.sm,
				lineHeight = theme.lineHeights.sm,
			}
		end
		if size == "lg" then
			return {
				diameter = 64,
				thickness = 6,
				segmentLength = 8,
				labelSize = theme.fontSizes.sm,
				valueLabelSize = theme.fontSizes.lg,
				lineHeight = theme.lineHeights.lg,
			}
		end
		if size == "xl" then
			return {
				diameter = 80,
				thickness = 7,
				segmentLength = 10,
				labelSize = theme.fontSizes.md,
				valueLabelSize = theme.fontSizes.xl,
				lineHeight = theme.lineHeights.xl,
			}
		end
		if size == "md" then
		end
		return {
			diameter = 48,
			thickness = 5,
			segmentLength = 6,
			labelSize = theme.fontSizes.xs,
			valueLabelSize = theme.fontSizes.md,
			lineHeight = theme.lineHeights.md,
		}
	until true
end
local function resolveCircularProgressVisualStyles(theme, variant, color)
	local intentColors = theme.colors[color]
	local neutralTrack = mixColor(theme.colors.background.default, theme.colors.border.default, 0.22)
	local softTrack = mixColor(theme.colors.background.surface, intentColors.light, 0.16)
	repeat
		local _fallthrough = false
		if variant == "filled" then
			return {
				trackColor = neutralTrack,
				trackTransparency = 0.04,
				fillColor = intentColors.main,
				fillTailColor = intentColors.light,
				labelColor = theme.colors.text.secondary,
				valueLabelColor = theme.colors.text.primary,
			}
		end
		if variant == "light" then
			return {
				trackColor = softTrack,
				trackTransparency = 0.1,
				fillColor = mixColor(intentColors.main, theme.colors.background.surface, 0.06),
				fillTailColor = intentColors.light,
				labelColor = theme.colors.text.secondary,
				valueLabelColor = intentColors.dark,
			}
		end
		if variant == "subtle" then
			return {
				trackColor = mixColor(theme.colors.background.default, intentColors.light, 0.08),
				trackTransparency = 0.18,
				fillColor = mixColor(intentColors.main, theme.colors.background.surface, 0.16),
				fillTailColor = mixColor(intentColors.light, theme.colors.background.surface, 0.08),
				labelColor = theme.colors.text.secondary,
				valueLabelColor = theme.colors.text.primary,
			}
		end
		if variant == "outline" then
		end
		return {
			trackColor = neutralTrack,
			trackTransparency = 0.08,
			fillColor = intentColors.main,
			fillTailColor = mixColor(intentColors.light, intentColors.main, 0.18),
			labelColor = theme.colors.text.secondary,
			valueLabelColor = theme.colors.text.primary,
		}
	until true
end
local function resolveCircularProgressMotionTransition()
	return {
		percent = {
			duration = "normal",
			easing = "out",
		},
	}
end
return {
	resolveCircularProgressSizeStyles = resolveCircularProgressSizeStyles,
	resolveCircularProgressVisualStyles = resolveCircularProgressVisualStyles,
	resolveCircularProgressMotionTransition = resolveCircularProgressMotionTransition,
}
