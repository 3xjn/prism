-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local resolveDensityControlSize = _theme.resolveDensityControlSize
local resolveDensityGap = _theme.resolveDensityGap
local resolveDensityMarkSize = _theme.resolveDensityMarkSize
local resolveThemeSpacing = _theme.resolveThemeSpacing
local resolveThemeSizeSafe = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").resolveThemeSizeSafe
local function resolveWindowSizeStyles(theme)
	local titleBarHeight = resolveDensityControlSize(theme, 36)
	local controlSize = resolveDensityControlSize(theme, 28)
	local titleGap = resolveDensityGap(theme, resolveThemeSpacing(theme, "sm"))
	return {
		titleBarHeight = titleBarHeight,
		titlePaddingX = resolveThemeSpacing(theme, "sm"),
		titleGap = titleGap,
		titleSize = theme.fontSizes.sm,
		titleLineHeight = theme.lineHeights.sm,
		controlSize = controlSize,
		iconSize = resolveDensityMarkSize(theme, 16),
		radius = UDim.new(0, resolveThemeSizeSafe(theme, "window", "md", "radius", theme.radius.md)),
		viewportMargin = resolveThemeSpacing(theme, "md"),
		resizeHandleSize = resolveDensityMarkSize(theme, 16),
		collapseControlSize = resolveDensityControlSize(theme, 40),
		bodyPadding = resolveThemeSpacing(theme, "md"),
		railMinWidth = resolveDensityControlSize(theme, 48),
	}
end
return {
	resolveWindowSizeStyles = resolveWindowSizeStyles,
}
