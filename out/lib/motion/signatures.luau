-- Compiled with roblox-ts v3.0.0
local function getSortedRecordKeys(values)
	local keys = {}
	for key in pairs(values) do
		table.insert(keys, key)
	end
	table.sort(keys)
	return keys
end
local function stringifyMotionValue(value)
	local _value = value
	if type(_value) == "number" then
		return `number:{tostring(value)}`
	end
	return `color:{tostring(value.R)},{tostring(value.G)},{tostring(value.B)}`
end
local function stringifyMotionEasing(easing)
	return `{tostring(easing.style)}:{tostring(easing.direction)}`
end
local function createMotionValuesSignature(values)
	local parts = {}
	for _, key in getSortedRecordKeys(values) do
		local _arg0 = `{key}={stringifyMotionValue(values[key])}`
		table.insert(parts, _arg0)
	end
	return table.concat(parts, "|")
end
local function createMotionTransitionsSignature(transitions)
	local parts = {}
	for _, key in getSortedRecordKeys(transitions) do
		local transition = transitions[key]
		if transition ~= nil then
			local _arg0 = `{key}={tostring(transition.duration)}@{stringifyMotionEasing(transition.easing)}`
			table.insert(parts, _arg0)
		end
	end
	return table.concat(parts, "|")
end
local function createThemeMotionSignature(themeMotion)
	return table.concat({ `duration:{tostring(themeMotion.duration.instant)},{tostring(themeMotion.duration.fast)},{tostring(themeMotion.duration.normal)},{tostring(themeMotion.duration.slow)}`, `easing:{stringifyMotionEasing(themeMotion.easing.linear)},{stringifyMotionEasing(themeMotion.easing.standard)},{stringifyMotionEasing(themeMotion.easing.out)},{stringifyMotionEasing(themeMotion.easing["in"])},{stringifyMotionEasing(themeMotion.easing.inOut)}` }, "|")
end
return {
	createMotionValuesSignature = createMotionValuesSignature,
	createMotionTransitionsSignature = createMotionTransitionsSignature,
	createThemeMotionSignature = createThemeMotionSignature,
}
