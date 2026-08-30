-- Compiled with roblox-ts v3.0.0
local function resolveMinimumHeightConstraint(resolvedConstraint, minimumHeight)
	if resolvedConstraint == nil then
		return {
			min = Vector2.new(0, minimumHeight),
			max = nil,
		}
	end
	return {
		min = if resolvedConstraint.min == nil then Vector2.new(0, minimumHeight) else Vector2.new(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, minimumHeight)),
		max = resolvedConstraint.max,
	}
end
local function resolveFrameSizeProps(resolvedSize, resolvedWidth, resolvedHeight)
	if resolvedSize ~= nil then
		return {
			size = resolvedSize,
		}
	end
	if resolvedWidth ~= nil and resolvedHeight ~= nil then
		return {
			size = UDim2.new(resolvedWidth, resolvedHeight),
		}
	end
	if resolvedWidth ~= nil then
		return {
			size = UDim2.new(resolvedWidth, UDim.new(0, 0)),
			automaticSize = Enum.AutomaticSize.Y,
		}
	end
	if resolvedHeight ~= nil then
		return {
			size = UDim2.new(UDim.new(0, 0), resolvedHeight),
			automaticSize = Enum.AutomaticSize.X,
		}
	end
	return {
		size = UDim2.fromOffset(0, 0),
		automaticSize = Enum.AutomaticSize.XY,
	}
end
return {
	resolveMinimumHeightConstraint = resolveMinimumHeightConstraint,
	resolveFrameSizeProps = resolveFrameSizeProps,
}
