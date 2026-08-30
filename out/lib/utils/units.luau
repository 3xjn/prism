-- Compiled with roblox-ts v3.0.0
local isSignedIntegerString, isSignedDecimalString
local function parsePercentString(value)
	if string.sub(value, -1) ~= "%" then
		return nil
	end
	local numeric = string.sub(value, 1, -2)
	if not isSignedIntegerString(numeric) and not isSignedDecimalString(numeric) then
		return nil
	end
	return tonumber(numeric) / 100
end
local function isDigit(character)
	local code = string.byte(character)
	local zero = string.byte("0")
	local nine = string.byte("9")
	return code ~= nil and code >= zero and code <= nine
end
local function isUnsignedIntegerString(value)
	if string.sub(value, 1, 1) == "" then
		return false
	end
	do
		local index = 1
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				index += 1
			else
				_shouldIncrement = true
			end
			local character = string.sub(value, index, index)
			if character == "" then
				break
			end
			if not isDigit(character) then
				return false
			end
		end
	end
	return true
end
local function stripLeadingMinus(value)
	if string.sub(value, 1, 1) == "-" then
		return string.sub(value, 2)
	end
	return value
end
function isSignedIntegerString(value)
	return isUnsignedIntegerString(stripLeadingMinus(value))
end
function isSignedDecimalString(value)
	local normalized = stripLeadingMinus(value)
	local dotIndex = string.find(normalized, ".", 1, true)
	if dotIndex == nil then
		return false
	end
	local nextDotIndex = string.find(normalized, ".", dotIndex + 1, true)
	if nextDotIndex ~= nil then
		return false
	end
	local whole = string.sub(normalized, 1, dotIndex - 1)
	local fraction = string.sub(normalized, dotIndex + 1)
	return isUnsignedIntegerString(whole) and isUnsignedIntegerString(fraction)
end
local function isSizeValue2DObject(value)
	local _value = value
	local _condition = type(_value) == "table"
	if _condition then
		_condition = rawget(value, "x") ~= nil and rawget(value, "y") ~= nil
	end
	return _condition
end
--[[
	*
	 * Converts a 1D size input into a `UDim`.
	 *
	 * @example
	 * ```ts
	 * toUDim(200); // new UDim(0, 200)
	 * toUDim("50%"); // new UDim(0.5, 0)
	 * toUDim(new UDim(0.25, 8)); // passthrough
	 * ```
	 *
	 * Edge cases:
	 * - Negative numbers and strings are allowed, such as `-8` or `"-25%"`.
	 * - Percentages may exceed 100%, such as `"150%"`.
	 * - `0` resolves to `new UDim(0, 0)`.
	 * - Mixed scale and offset are not inferred; pass a raw `UDim` when both are needed.
	 
]]
local function toUDim(value)
	local _value = value
	if type(_value) == "number" then
		return UDim.new(0, value)
	end
	local _value_1 = value
	if type(_value_1) == "string" then
		local percent = parsePercentString(value)
		if percent ~= nil then
			return UDim.new(percent, 0)
		end
		error(`Invalid SizeValue: {value}`)
	end
	local _value_2 = value
	if typeof(_value_2) == "UDim" then
		return value
	end
	error(`Invalid SizeValue: {tostring(value)}`)
end
--[[
	*
	 * Converts a 2D size input into a `UDim2`.
	 *
	 * @example
	 * ```ts
	 * toUDim2(100); // UDim2.fromOffset(100, 100)
	 * toUDim2("50%"); // UDim2.fromScale(0.5, 0.5)
	 * toUDim2({ x: 100, y: "50%" }); // new UDim2(new UDim(0, 100), new UDim(0.5, 0))
	 * toUDim2(new UDim2(0.25, 8, 0, 16)); // passthrough
	 * ```
	 *
	 * Edge cases:
	 * - Negative numbers and strings are allowed.
	 * - Percentages may exceed 100%.
	 * - `0` resolves to `UDim2.fromOffset(0, 0)`.
	 * - Mixed scale and offset are not inferred; pass a raw `UDim2` when both axes need both values.
	 
]]
local toUDimAxis
local function toUDim2(value)
	local _value = value
	if type(_value) == "number" then
		return UDim2.fromOffset(value, value)
	end
	local _value_1 = value
	if type(_value_1) == "string" then
		local percent = parsePercentString(value)
		if percent ~= nil then
			return UDim2.fromScale(percent, percent)
		end
		error(`Invalid SizeValue2D: {value}`)
	end
	local _value_2 = value
	if typeof(_value_2) == "UDim2" then
		return value
	end
	if isSizeValue2DObject(value) then
		return UDim2.new(toUDimAxis(value.x, "x"), toUDimAxis(value.y, "y"))
	end
	error(`Invalid SizeValue2D: {tostring(value)}`)
end
function toUDimAxis(value, _axis)
	return toUDim(value)
end
return {
	toUDim = toUDim,
	toUDim2 = toUDim2,
	toUDimAxis = toUDimAxis,
}
