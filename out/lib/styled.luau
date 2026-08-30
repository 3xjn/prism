-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
--[[
	*
	 * Creates a preset component with a shallow prop merge where caller props win.
	 *
	 * A caller-passed `styleOverrides` prop replaces the preset's `styleOverrides`; callbacks are not chained or merged.
	 * `ref` flows through only because Prism components declare `ref` in their props.
	 
]]
local function styled(Component)
	return function(preset)
		return function(props)
			local _attributes = table.clone(preset)
			setmetatable(_attributes, nil)
			if props then
				for _k, _v in props do
					_attributes[_k] = _v
				end
			end
			return React.createElement(Component, _attributes)
		end
	end
end
return {
	styled = styled,
}
