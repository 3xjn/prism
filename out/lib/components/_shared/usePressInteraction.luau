-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local isPressInput = TS.import(script, script.Parent, "interaction").isPressInput
local function resolveInteractionState(disabled, hovered, pressed)
	if disabled then
		return "disabled"
	end
	if pressed then
		return "pressed"
	end
	if hovered then
		return "hovered"
	end
	return "idle"
end
--[[
	*
	 * Shared hover/press state machine for interactive roots. Owns the
	 * hovered/pressed useState pair, resets both while non-interactive, and
	 * returns the Event handlers that drive them.
	 
]]
local function usePressInteraction(options)
	local _binding = options
	local interactive = _binding.interactive
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = not interactive
	end
	local onActivated = _binding.onActivated
	local hovered, setHovered = React.useState(false)
	local pressed, setPressed = React.useState(false)
	React.useEffect(function()
		if interactive then
			return nil
		end
		setHovered(false)
		setPressed(false)
	end, { interactive })
	local eventMap = {
		MouseEnter = function()
			if not interactive then
				return nil
			end
			setHovered(true)
		end,
		MouseLeave = function()
			setHovered(false)
			setPressed(false)
		end,
		InputBegan = function(_rbx, input)
			if not interactive or not isPressInput(input) then
				return nil
			end
			setPressed(true)
		end,
		InputEnded = function(_rbx, input)
			if not isPressInput(input) then
				return nil
			end
			setPressed(false)
		end,
		Activated = function()
			if not interactive then
				return nil
			end
			local _result = onActivated
			if _result ~= nil then
				_result()
			end
		end,
	}
	local effectiveHovered = interactive and hovered
	local effectivePressed = interactive and pressed
	return {
		hovered = effectiveHovered,
		pressed = effectivePressed,
		state = resolveInteractionState(disabled, effectiveHovered, effectivePressed),
		eventMap = eventMap,
	}
end
return {
	usePressInteraction = usePressInteraction,
}
