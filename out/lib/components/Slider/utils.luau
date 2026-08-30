-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local exports = {}
exports.resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local function isFiniteNumber(value)
	return value ~= nil and value == value and value > -math.huge and value < math.huge
end
local function resolveFiniteNumber(value, fallback)
	return if isFiniteNumber(value) then value else fallback
end
local SAFE_SLIDER_RANGE = {
	min = 0,
	max = 1,
	span = 1,
}
local function resolveSliderRange(min, max)
	local resolvedMin = resolveFiniteNumber(min, 0)
	local requestedMax = resolveFiniteNumber(max, 100)
	if requestedMax > resolvedMin then
		local requestedSpan = requestedMax - resolvedMin
		if isFiniteNumber(requestedSpan) and requestedSpan > 0 then
			return {
				min = resolvedMin,
				max = requestedMax,
				span = requestedSpan,
			}
		end
		local fallbackMax = resolvedMin + 1
		local fallbackSpan = fallbackMax - resolvedMin
		if isFiniteNumber(fallbackSpan) and fallbackSpan > 0 then
			return {
				min = resolvedMin,
				max = fallbackMax,
				span = fallbackSpan,
			}
		end
		return SAFE_SLIDER_RANGE
	end
	if requestedMax == resolvedMin then
		local fallbackMax = resolvedMin + 1
		if not isFiniteNumber(fallbackMax) or fallbackMax <= resolvedMin then
			return SAFE_SLIDER_RANGE
		end
	end
	return {
		min = resolvedMin,
		max = resolvedMin,
		span = 0,
	}
end
local function resolveValidStep(step)
	if not isFiniteNumber(step) or step <= 0 then
		return nil
	end
	return step
end
local function resolveStepPrecision(step)
	local precision = 0
	local scaledStep = step
	while precision < 6 and math.abs(scaledStep - math.round(scaledStep)) > 1e-6 do
		precision += 1
		scaledStep *= 10
	end
	return precision
end
local function roundToPrecision(value, precision)
	if precision <= 0 then
		return math.round(value)
	end
	local scale = math.pow(10, precision)
	return math.round(value * scale) / scale
end
local function normalizeSliderValue(value, range, step)
	local baseValue = math.clamp(resolveFiniteNumber(value, range.min), range.min, range.max)
	if range.span <= 0 or step == nil then
		return baseValue
	end
	local snappedStep = math.round((baseValue - range.min) / step)
	local snappedValue = range.min + snappedStep * step
	local roundedValue = roundToPrecision(snappedValue, resolveStepPrecision(step))
	return math.clamp(roundedValue, range.min, range.max)
end
local function valueToAlpha(value, range)
	if not isFiniteNumber(range.span) or range.span <= 0 then
		return 0
	end
	return math.clamp(resolveFiniteNumber((value - range.min) / range.span, 0), 0, 1)
end
local function alphaToValue(alpha, range, step)
	if not isFiniteNumber(range.span) or range.span <= 0 then
		return range.min
	end
	return normalizeSliderValue(range.min + math.clamp(alpha, 0, 1) * range.span, range, step)
end
local function resolveDiscreteStep(range, step)
	if range.span <= 0 then
		return 0
	end
	local _condition = step
	if _condition == nil then
		_condition = range.span / 100
	end
	return _condition
end
local function stepSliderValue(input)
	local stepAmount = resolveDiscreteStep(input.range, input.step)
	if stepAmount <= 0 then
		return normalizeSliderValue(input.value, input.range, input.step)
	end
	return normalizeSliderValue(input.value + input.direction * stepAmount, input.range, input.step)
end
local function resolveAlphaFromPositionX(track, positionX)
	if track == nil then
		return 0
	end
	local trackWidth = track.AbsoluteSize.X
	if trackWidth <= 0 then
		return 0
	end
	return math.clamp((positionX - track.AbsolutePosition.X) / trackWidth, 0, 1)
end
exports.resolveSliderRange = resolveSliderRange
exports.resolveValidStep = resolveValidStep
exports.normalizeSliderValue = normalizeSliderValue
exports.valueToAlpha = valueToAlpha
exports.alphaToValue = alphaToValue
exports.stepSliderValue = stepSliderValue
exports.resolveAlphaFromPositionX = resolveAlphaFromPositionX
return exports
