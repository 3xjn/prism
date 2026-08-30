-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local function usePresence(present, options)
	local shouldRender, setShouldRender = React.useState(present)
	local visualPresent, setVisualPresent = React.useState(false)
	React.useEffect(function()
		if present then
			setShouldRender(true)
			setVisualPresent(false)
			local openDelay = task.defer(function()
				setVisualPresent(true)
			end)
			return function()
				task.cancel(openDelay)
			end
		end
		setVisualPresent(false)
		local closeDelay = task.delay(options.exitDuration, function()
			setShouldRender(false)
		end)
		return function()
			task.cancel(closeDelay)
		end
	end, { options.exitDuration, present })
	return {
		shouldRender = shouldRender,
		present = visualPresent,
	}
end
return {
	usePresence = usePresence,
}
