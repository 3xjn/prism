-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
--[[
	*
	 * Shared controlled/uncontrolled value plumbing. The setter updates
	 * internal state only while uncontrolled and reports the change to
	 * onChange, so controlled parents keep full ownership. Requests that
	 * match the current value are ignored. Switching from controlled back
	 * to uncontrolled resumes from the internal (initially defaultValue)
	 * state; components should not switch modes after mount.
	 
]]
local function useControllableState(options)
	local _binding = options
	local controlled = _binding.controlled
	local defaultValue = _binding.defaultValue
	local onChange = _binding.onChange
	local uncontrolled, setUncontrolled = React.useState(defaultValue)
	local _condition = controlled
	if _condition == nil then
		_condition = uncontrolled
	end
	local value = _condition
	local setValue = function(nextValue)
		if nextValue == value then
			return nil
		end
		if controlled == nil then
			setUncontrolled(nextValue)
		end
		local _result = onChange
		if _result ~= nil then
			_result(nextValue)
		end
	end
	return { value, setValue }
end
return {
	useControllableState = useControllableState,
}
