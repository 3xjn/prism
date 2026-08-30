-- Compiled with roblox-ts v3.0.0
local DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX = 10
--* Component-local drag overlays (e.g. Draggable's floating item) — above sibling content, below capture overlays. 
local DRAG_OVERLAY_Z_INDEX = 1_000
local CAPTURE_OVERLAY_Z_INDEX = 10_000
local function incrementZIndex(zIndex, amount)
	if amount == nil then
		amount = 1
	end
	local _zIndex = zIndex
	return if typeof(_zIndex) == "number" then (zIndex + amount) else zIndex
end
return {
	incrementZIndex = incrementZIndex,
	DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX = DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX,
	DRAG_OVERLAY_Z_INDEX = DRAG_OVERLAY_Z_INDEX,
	CAPTURE_OVERLAY_Z_INDEX = CAPTURE_OVERLAY_Z_INDEX,
}
