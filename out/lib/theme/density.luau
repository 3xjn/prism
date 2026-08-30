-- Compiled with roblox-ts v3.0.0
local DEFAULT_DENSITY = "default"
-- Compact spacing is applied at resolve time. Published theme.spacing
-- stays on the default scale so existing UIs do not jump, and control
-- heights can keep using those canonical values as their baseline.
local COMPACT_SPACING = table.freeze({
	xs = 4,
	sm = 6,
	md = 8,
	lg = 12,
	xl = 16,
})
local function isCompactDensity(density)
	return density == "compact"
end
local function resolveThemeSpacing(theme, size)
	if theme.density == "compact" then
		return COMPACT_SPACING[size]
	end
	return theme.spacing[size]
end
local function resolveDensityControlSize(theme, defaultValue)
	if theme.density ~= "compact" then
		return defaultValue
	end
	if defaultValue >= 36 then
		return defaultValue - 4
	end
	if defaultValue >= 32 then
		return defaultValue
	end
	return math.max(16, defaultValue - 2)
end
local function resolveDensityGap(theme, defaultValue)
	if theme.density ~= "compact" then
		return defaultValue
	end
	return math.max(2, defaultValue - 2)
end
local function resolveDensityMarkSize(theme, defaultValue)
	if theme.density ~= "compact" then
		return defaultValue
	end
	return math.max(12, defaultValue - 2)
end
return {
	isCompactDensity = isCompactDensity,
	resolveThemeSpacing = resolveThemeSpacing,
	resolveDensityControlSize = resolveDensityControlSize,
	resolveDensityGap = resolveDensityGap,
	resolveDensityMarkSize = resolveDensityMarkSize,
	DEFAULT_DENSITY = DEFAULT_DENSITY,
}
