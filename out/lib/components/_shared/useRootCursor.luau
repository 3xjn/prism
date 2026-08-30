-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local composeEventMaps = TS.import(script, script.Parent, "interaction").composeEventMaps
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
-- MouseIcon writes warn and no-op in Edit mode (plugin security), where
-- ui-labs stories render; only drive the cursor inside a running game.
local function canApplyMouseCursor()
	return RunService:IsRunning() and UserInputService.MouseEnabled
end
local activeCursorClaims = {}
local nextCursorClaimId = 0
local previousMouseCursor
local function resolveMouseCursor(cursor)
	if cursor == nil or cursor == "default" then
		return nil
	end
	repeat
		if cursor == "pointer" then
			return "rbxasset://SystemCursors/PointingHand"
		end
		if cursor == "grab" then
			return "rbxasset://SystemCursors/OpenHand"
		end
		if cursor == "grabbing" then
			return "rbxasset://SystemCursors/ClosedHand"
		end
		if cursor == "resize-ew" then
			return "rbxasset://SystemCursors/SizeEW"
		end
		if cursor == "resize-ns" then
			return "rbxasset://SystemCursors/SizeNS"
		end
		if cursor == "resize-nesw" then
			return "rbxasset://SystemCursors/SizeNESW"
		end
		if cursor == "resize-nwse" then
			return "rbxasset://SystemCursors/SizeNWSE"
		end
		if cursor == "resize-all" then
			return "rbxasset://SystemCursors/SizeAll"
		end
		if cursor == "split-ew" then
			return "rbxasset://SystemCursors/SplitEW"
		end
		if cursor == "split-ns" then
			return "rbxasset://SystemCursors/SplitNS"
		end
		if cursor == "forbidden" then
			return "rbxasset://SystemCursors/Forbidden"
		end
		if cursor == "wait" then
			return "rbxasset://SystemCursors/Wait"
		end
		if cursor == "busy" then
			return "rbxasset://SystemCursors/Busy"
		end
		if cursor == "crosshair" then
			return "rbxasset://SystemCursors/Cross"
		end
		return cursor
	until true
end
local function applyActiveMouseCursor()
	local activeClaim = activeCursorClaims[#activeCursorClaims]
	if canApplyMouseCursor() then
		local _result = activeClaim
		if _result ~= nil then
			_result = _result.cursor
		end
		local _condition = _result
		if _condition == nil then
			_condition = previousMouseCursor
			if _condition == nil then
				_condition = ""
			end
		end
		UserInputService.MouseIcon = _condition
	end
	if activeClaim == nil then
		previousMouseCursor = nil
	end
end
local function acquireMouseCursor(cursor)
	if not canApplyMouseCursor() then
		return nil
	end
	if #activeCursorClaims == 0 then
		previousMouseCursor = UserInputService.MouseIcon
	end
	local claimId = nextCursorClaimId
	nextCursorClaimId += 1
	local _activeCursorClaims = activeCursorClaims
	local _arg0 = {
		id = claimId,
		cursor = cursor,
	}
	table.insert(_activeCursorClaims, _arg0)
	applyActiveMouseCursor()
	return claimId
end
local function updateMouseCursor(claimId, cursor)
	local updated = false
	for _, claim in activeCursorClaims do
		if claim.id ~= claimId then
			continue
		end
		claim.cursor = cursor
		updated = true
		break
	end
	if updated then
		applyActiveMouseCursor()
	end
end
local function releaseMouseCursor(claimId)
	if claimId == nil then
		return nil
	end
	local remainingClaims = {}
	for _, claim in activeCursorClaims do
		if claim.id ~= claimId then
			table.insert(remainingClaims, claim)
		end
	end
	if #remainingClaims == #activeCursorClaims then
		return nil
	end
	activeCursorClaims = remainingClaims
	applyActiveMouseCursor()
end
local function useRootCursorEvent(eventMap, cursor, disabled)
	if disabled == nil then
		disabled = false
	end
	local claimIdRef = React.useRef(nil)
	local resolvedCursor = resolveMouseCursor(cursor)
	React.useEffect(function()
		if disabled or resolvedCursor == nil then
			releaseMouseCursor(claimIdRef.current)
			claimIdRef.current = nil
			return nil
		end
		if claimIdRef.current ~= nil then
			updateMouseCursor(claimIdRef.current, resolvedCursor)
		end
		return function()
			releaseMouseCursor(claimIdRef.current)
			claimIdRef.current = nil
		end
	end, { disabled, resolvedCursor })
	local cursorEvents = React.useMemo(function()
		if disabled or resolvedCursor == nil then
			return nil
		end
		local internalEvents = {
			MouseEnter = function()
				if claimIdRef.current == nil then
					claimIdRef.current = acquireMouseCursor(resolvedCursor)
					return nil
				end
				updateMouseCursor(claimIdRef.current, resolvedCursor)
			end,
			MouseLeave = function()
				releaseMouseCursor(claimIdRef.current)
				claimIdRef.current = nil
			end,
		}
		return internalEvents
	end, { disabled, resolvedCursor })
	return React.useMemo(function()
		return composeEventMaps(cursorEvents, eventMap)
	end, { cursorEvents, eventMap })
end
return {
	useRootCursorEvent = useRootCursorEvent,
}
