-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
--[[
	*
	 * Shared delayed-invoke plumbing for hover-intent style interactions
	 * (tooltip open delays and similar). The pending thread is cancelled on
	 * re-schedule, on cancel, and on unmount.
	 
]]
local function useDelayedCallback()
	local pendingThreadRef = React.useRef(nil)
	local cancel = React.useCallback(function()
		local pending = pendingThreadRef.current
		pendingThreadRef.current = nil
		if pending ~= nil then
			task.cancel(pending)
		end
	end, {})
	local schedule = React.useCallback(function(delaySeconds, callback)
		cancel()
		if delaySeconds <= 0 then
			callback()
			return nil
		end
		pendingThreadRef.current = task.delay(delaySeconds, function()
			pendingThreadRef.current = nil
			callback()
		end)
	end, { cancel })
	React.useEffect(function()
		return cancel
	end, { cancel })
	return {
		schedule = schedule,
		cancel = cancel,
	}
end
return {
	useDelayedCallback = useDelayedCallback,
}
