-- Compiled with roblox-ts v3.0.0
local function isFiniteNumber(value)
	return value ~= nil and value == value and value > -math.huge and value < math.huge
end
local function resolveFiniteNumber(value, fallback)
	return if isFiniteNumber(value) then value else fallback
end
local SAFE_PROGRESS_RANGE = {
	min = 0,
	max = 1,
}
local function resolveProgressRange(min, max)
	local resolvedMin = resolveFiniteNumber(min, 0)
	local requestedMax = resolveFiniteNumber(max, 100)
	if requestedMax > resolvedMin then
		return {
			min = resolvedMin,
			max = requestedMax,
		}
	end
	local fallbackMax = resolvedMin + 1
	if isFiniteNumber(fallbackMax) and fallbackMax > resolvedMin then
		return {
			min = resolvedMin,
			max = fallbackMax,
		}
	end
	return SAFE_PROGRESS_RANGE
end
local function resolveProgressValue(value, range)
	return math.clamp(resolveFiniteNumber(value, range.min), range.min, range.max)
end
local function resolveProgressPercent(value, range)
	return (value - range.min) / (range.max - range.min)
end
return {
	resolveProgressRange = resolveProgressRange,
	resolveProgressValue = resolveProgressValue,
	resolveProgressPercent = resolveProgressPercent,
}
