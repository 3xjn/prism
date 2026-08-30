-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local function resolvePopoverSizeStyles(theme, gap)
	local _object = {
		radius = UDim.new(0, resolveThemeSizeSafe(theme, "popover", "md", "radius", theme.radius.md)),
		paddingX = theme.spacing.md,
		paddingY = theme.spacing.sm,
		fontSize = theme.fontSizes.sm,
		lineHeight = theme.lineHeights.sm,
	}
	local _left = "gap"
	local _condition = gap
	if _condition == nil then
		_condition = theme.spacing.xs
	end
	_object[_left] = _condition
	return _object
end
local function resolvePopoverVisualStyles(theme)
	return {
		backgroundColor = theme.colors.background.surface,
		strokeColor = theme.colors.border.default,
		strokeTransparency = 0.12,
		strokeThickness = 1,
		textColor = theme.colors.text.primary,
		shadow = theme.shadows.md,
	}
end
return {
	resolvePopoverSizeStyles = resolvePopoverSizeStyles,
	resolvePopoverVisualStyles = resolvePopoverVisualStyles,
}
