-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local exports = {}
local _defaults = TS.import(script, script, "defaults")
exports.DEFAULT_THEME = _defaults.DEFAULT_THEME
exports.DEFAULT_DARK_THEME = _defaults.DEFAULT_DARK_THEME
exports.theme = TS.import(script, script, "refs").theme
local _ThemeProvider = TS.import(script, script, "ThemeProvider")
exports.ThemeProvider = _ThemeProvider.ThemeProvider
exports.useTheme = _ThemeProvider.useTheme
local _resolveToken = TS.import(script, script, "resolveToken")
exports.resolveColor = _resolveToken.resolveColor
exports.resolveSize = _resolveToken.resolveSize
local _density = TS.import(script, script, "density")
exports.DEFAULT_DENSITY = _density.DEFAULT_DENSITY
exports.isCompactDensity = _density.isCompactDensity
exports.resolveDensityControlSize = _density.resolveDensityControlSize
exports.resolveDensityGap = _density.resolveDensityGap
exports.resolveDensityMarkSize = _density.resolveDensityMarkSize
exports.resolveThemeSpacing = _density.resolveThemeSpacing
return exports
