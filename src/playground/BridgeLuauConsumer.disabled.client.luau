local Players = game:GetService("Players")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local function destroyBridgeGui()
	local bridgeGui = playerGui:FindFirstChild("PrismBridgeLuauSmoke")

	if bridgeGui and bridgeGui:IsA("ScreenGui") then
		bridgeGui:Destroy()
	end
end

destroyBridgeGui()
task.defer(destroyBridgeGui)
task.delay(0.25, destroyBridgeGui)
task.delay(1, destroyBridgeGui)
task.delay(2, destroyBridgeGui)
