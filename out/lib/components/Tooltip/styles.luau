-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local function resolveTooltipSizeStyles(theme, gap)
	local _object = {
		paddingX = theme.spacing.sm,
		paddingY = theme.spacing.xs,
		radius = UDim.new(0, resolveThemeSizeSafe(theme, "tooltip", "sm", "radius", theme.radius.sm)),
		fontSize = theme.fontSizes.sm,
		lineHeight = theme.lineHeights.sm,
		tailWidth = 18,
		tailHeight = 8,
		triggerMinimumSize = 1,
	}
	local _left = "gap"
	local _condition = gap
	if _condition == nil then
		_condition = theme.spacing.xs
	end
	_object[_left] = _condition
	return _object
end
local function resolveTooltipVisualStyles(theme)
	-- Tooltips render inverse so they separate from the content they
	-- float over: the bubble takes the theme's primary text color and the
	-- label takes the page background, which flips correctly between
	-- light and dark themes.
	local inverseSurface = theme.colors.text.primary
	return {
		backgroundColor = inverseSurface,
		strokeColor = inverseSurface,
		strokeTransparency = 1,
		textColor = theme.colors.background.default,
		tailFillColor = inverseSurface,
		tailBorderColor = inverseSurface,
		tailBorderTransparency = 1,
		shadow = theme.shadows.sm,
	}
end
return {
	resolveTooltipSizeStyles = resolveTooltipSizeStyles,
	resolveTooltipVisualStyles = resolveTooltipVisualStyles,
}
