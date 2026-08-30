-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local GuiService = game:GetService("GuiService")
local UserInputService = game:GetService("UserInputService")
local function useSliderControllerInput(config)
	local _binding = config
	local disabled = _binding.disabled
	local hitboxInstance = _binding.hitboxInstance
	local commitStep = _binding.commitStep
	local selected, setSelected = React.useState(false)
	React.useEffect(function()
		if not disabled then
			return nil
		end
		setSelected(false)
	end, { disabled })
	React.useEffect(function()
		if disabled or hitboxInstance == nil then
			return nil
		end
		local connection = UserInputService.InputBegan:Connect(function(input)
			if GuiService.SelectedObject ~= hitboxInstance then
				return nil
			end
			if input.KeyCode == Enum.KeyCode.Left or input.KeyCode == Enum.KeyCode.DPadLeft or input.KeyCode == Enum.KeyCode.ButtonL1 then
				commitStep(-1)
				return nil
			end
			if input.KeyCode == Enum.KeyCode.Right or input.KeyCode == Enum.KeyCode.DPadRight or input.KeyCode == Enum.KeyCode.ButtonR1 then
				commitStep(1)
			end
		end)
		return function()
			connection:Disconnect()
		end
	end, { commitStep, disabled, hitboxInstance })
	local event = React.useMemo(function()
		return {
			SelectionGained = function()
				if disabled then
					return nil
				end
				setSelected(true)
			end,
			SelectionLost = function()
				setSelected(false)
			end,
		}
	end, { disabled })
	return {
		selected = selected,
		event = event,
	}
end
return {
	useSliderControllerInput = useSliderControllerInput,
}
