-- Compiled with roblox-ts v3.0.0
local function isFiniteNumber(value)
	return value ~= nil and value == value and value > -math.huge and value < math.huge
end
local function resolveStepperInputRange(min, max)
	local resolvedMin = if isFiniteNumber(min) then min else nil
	local resolvedMax = if isFiniteNumber(max) then max else nil
	if resolvedMin ~= nil and resolvedMax ~= nil then
		local normalizedMax = if resolvedMax < resolvedMin then resolvedMin else resolvedMax
		return {
			min = resolvedMin,
			max = normalizedMax,
			span = normalizedMax - resolvedMin,
		}
	end
	return {
		min = resolvedMin,
		max = resolvedMax,
		span = nil,
	}
end
local function resolveValidStepperInputStep(step)
	return if isFiniteNumber(step) and step > 0 then step else 1
end
local function clampToRange(value, range)
	local clampedValue = value
	if range.min ~= nil then
		clampedValue = math.max(clampedValue, range.min)
	end
	if range.max ~= nil then
		clampedValue = math.min(clampedValue, range.max)
	end
	return clampedValue
end
local function resolveStepBase(range)
	local _condition = range.min
	if _condition == nil then
		_condition = 0
	end
	return _condition
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
local function normalizeStepperInputValue(value, range, step, fallback)
	if fallback == nil then
		fallback = 0
	end
	local baseValue = clampToRange(if isFiniteNumber(value) then value else fallback, range)
	local stepBase = resolveStepBase(range)
	local snappedStep = math.round((baseValue - stepBase) / step)
	local snappedValue = stepBase + snappedStep * step
	local roundedValue = roundToPrecision(snappedValue, resolveStepPrecision(step))
	return clampToRange(roundedValue, range)
end
local function stepStepperInputValue(value, direction, range, step)
	return normalizeStepperInputValue(value + direction * step, range, step, value)
end
local function formatStepperInputValue(value, formatValue)
	local _result = formatValue
	if _result ~= nil then
		_result = _result(value)
	end
	local _condition = _result
	if _condition == nil then
		_condition = tostring(value)
	end
	return _condition
end
local function resolveStepperInputRailRange(range)
	local _condition = range.min
	if _condition == nil then
		_condition = 0
	end
	local resolvedMin = _condition
	local _condition_1 = range.max
	if _condition_1 == nil then
		_condition_1 = 100
	end
	local resolvedMax = _condition_1
	local normalizedMax = if resolvedMax < resolvedMin then resolvedMin else resolvedMax
	return {
		min = resolvedMin,
		max = normalizedMax,
		span = normalizedMax - resolvedMin,
	}
end
local function normalizeStepperInputRailValue(value, range, step)
	return normalizeStepperInputValue(value, range, step, range.min)
end
local function valueToStepperInputRailAlpha(value, range)
	if range.span <= 0 then
		return 0
	end
	return math.clamp((value - range.min) / range.span, 0, 1)
end
local function stepperInputRailAlphaToValue(alpha, range, step)
	if range.span <= 0 then
		return range.min
	end
	return normalizeStepperInputRailValue(range.min + math.clamp(alpha, 0, 1) * range.span, range, step)
end
local function resolveStepperInputRailAlphaFromPositionX(rail, positionX)
	if rail == nil then
		return 0
	end
	local railWidth = rail.AbsoluteSize.X
	if railWidth <= 0 then
		return 0
	end
	return math.clamp((positionX - rail.AbsolutePosition.X) / railWidth, 0, 1)
end
return {
	resolveStepperInputRange = resolveStepperInputRange,
	resolveValidStepperInputStep = resolveValidStepperInputStep,
	normalizeStepperInputValue = normalizeStepperInputValue,
	stepStepperInputValue = stepStepperInputValue,
	formatStepperInputValue = formatStepperInputValue,
	resolveStepperInputRailRange = resolveStepperInputRailRange,
	valueToStepperInputRailAlpha = valueToStepperInputRailAlpha,
	stepperInputRailAlphaToValue = stepperInputRailAlphaToValue,
	resolveStepperInputRailAlphaFromPositionX = resolveStepperInputRailAlphaFromPositionX,
}
