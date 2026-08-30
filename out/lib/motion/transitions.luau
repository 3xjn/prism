-- Compiled with roblox-ts v3.0.0
local function areMotionEasingsEqual(left, right)
	return left.style == right.style and left.direction == right.direction
end
local function areResolvedMotionTransitionsEqual(left, right)
	return left.duration == right.duration and areMotionEasingsEqual(left.easing, right.easing)
end
local function areResolvedMotionTransitionMapsEqual(left, right)
	if left == nil then
		return false
	end
	for key, transition in pairs(left) do
		local rightTransition = right[key]
		if rightTransition == nil or not areResolvedMotionTransitionsEqual(transition, rightTransition) then
			return false
		end
	end
	for key in pairs(right) do
		if left[key] == nil then
			return false
		end
	end
	return true
end
local function isMotionTransition(value)
	local _value = value
	if not (type(_value) == "table") then
		return false
	end
	local transition = value
	local _condition = transition.duration ~= nil
	if _condition then
		local _duration = transition.duration
		local _condition_1 = type(_duration) == "number"
		if not _condition_1 then
			local _duration_1 = transition.duration
			_condition_1 = type(_duration_1) == "string"
		end
		_condition = _condition_1
	end
	if _condition then
		return true
	end
	if transition.easing == nil then
		return false
	end
	local _easing = transition.easing
	if type(_easing) == "string" then
		return true
	end
	local _easing_1 = transition.easing
	if not (type(_easing_1) == "table") then
		return false
	end
	local easing = transition.easing
	return easing.style ~= nil or easing.direction ~= nil
end
local function resolveMotionDuration(themeMotion, duration)
	if duration == nil then
		return themeMotion.duration.normal
	end
	local _duration = duration
	return math.max(if type(_duration) == "number" then duration else themeMotion.duration[duration], 0)
end
local function resolveMotionEasing(themeMotion, easing)
	if easing == nil then
		return themeMotion.easing.standard
	end
	local _easing = easing
	return if type(_easing) == "string" then themeMotion.easing[easing] else easing
end
local function resolveMotionTransitions(values, transition, themeMotion)
	local sharedTransition = if isMotionTransition(transition) then transition else nil
	local transitionMap = if sharedTransition == nil then transition else nil
	local resolvedTransitions = {}
	for key in pairs(values) do
		local _result = transitionMap
		if _result ~= nil then
			_result = _result[key]
		end
		local _condition = _result
		if _condition == nil then
			_condition = sharedTransition
		end
		local keyTransition = _condition
		local _object = {}
		local _left = "duration"
		local _exp = themeMotion
		local _result_1 = keyTransition
		if _result_1 ~= nil then
			_result_1 = _result_1.duration
		end
		_object[_left] = resolveMotionDuration(_exp, _result_1)
		local _left_1 = "easing"
		local _exp_1 = themeMotion
		local _result_2 = keyTransition
		if _result_2 ~= nil then
			_result_2 = _result_2.easing
		end
		_object[_left_1] = resolveMotionEasing(_exp_1, _result_2)
		resolvedTransitions[key] = _object
	end
	return resolvedTransitions
end
return {
	areResolvedMotionTransitionMapsEqual = areResolvedMotionTransitionMapsEqual,
	resolveMotionTransitions = resolveMotionTransitions,
}
