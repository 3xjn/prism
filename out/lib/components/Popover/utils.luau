-- Compiled with roblox-ts v3.0.0
local function resolveAlignedX(bounds, align)
	repeat
		local _fallthrough = false
		if align == "start" then
			return bounds.position.X
		end
		if align == "end" then
			return bounds.position.X + bounds.size.X
		end
		if align == "center" then
		end
		return bounds.position.X + bounds.size.X * 0.5
	until true
end
local function resolveAlignedY(bounds, align)
	repeat
		local _fallthrough = false
		if align == "start" then
			return bounds.position.Y
		end
		if align == "end" then
			return bounds.position.Y + bounds.size.Y
		end
		if align == "center" then
		end
		return bounds.position.Y + bounds.size.Y * 0.5
	until true
end
local function resolveVerticalAnchorPoint(placement, align)
	local y = if placement == "top" then 1 else 0
	repeat
		local _fallthrough = false
		if align == "start" then
			return Vector2.new(0, y)
		end
		if align == "end" then
			return Vector2.new(1, y)
		end
		if align == "center" then
		end
		return Vector2.new(0.5, y)
	until true
end
local function resolveHorizontalAnchorPoint(placement, align)
	local x = if placement == "left" then 1 else 0
	repeat
		local _fallthrough = false
		if align == "start" then
			return Vector2.new(x, 0)
		end
		if align == "end" then
			return Vector2.new(x, 1)
		end
		if align == "center" then
		end
		return Vector2.new(x, 0.5)
	until true
end
local function resolvePopoverPanelPlacement(bounds, placement, align, gap, offset)
	local resolvedOffset = offset or Vector2.zero
	repeat
		local _fallthrough = false
		if placement == "top" then
			return {
				anchorPoint = resolveVerticalAnchorPoint(placement, align),
				anchorPosition = Vector2.new(resolveAlignedX(bounds, align), bounds.position.Y - gap) + resolvedOffset,
			}
		end
		if placement == "left" then
			return {
				anchorPoint = resolveHorizontalAnchorPoint(placement, align),
				anchorPosition = Vector2.new(bounds.position.X - gap, resolveAlignedY(bounds, align)) + resolvedOffset,
			}
		end
		if placement == "right" then
			return {
				anchorPoint = resolveHorizontalAnchorPoint(placement, align),
				anchorPosition = Vector2.new(bounds.position.X + bounds.size.X + gap, resolveAlignedY(bounds, align)) + resolvedOffset,
			}
		end
		if placement == "bottom" then
		end
		return {
			anchorPoint = resolveVerticalAnchorPoint(placement, align),
			anchorPosition = Vector2.new(resolveAlignedX(bounds, align), bounds.position.Y + bounds.size.Y + gap) + resolvedOffset,
		}
	until true
end
return {
	resolvePopoverPanelPlacement = resolvePopoverPanelPlacement,
}
