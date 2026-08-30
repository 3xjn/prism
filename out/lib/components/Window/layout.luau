-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _utils = TS.import(script, script.Parent, "utils")
local clampWindowBounds = _utils.clampWindowBounds
local resolveCenteredWindowPosition = _utils.resolveCenteredWindowPosition
local resolveUDimPixels = _utils.resolveUDimPixels
local function useAbsoluteSize(instance)
	local absoluteSize, setAbsoluteSize = React.useState()
	React.useEffect(function()
		if instance == nil then
			setAbsoluteSize(nil)
			return nil
		end
		local updateAbsoluteSize = function()
			local nextSize = instance.AbsoluteSize
			setAbsoluteSize(function(currentSize)
				return if currentSize ~= nil and currentSize.X == nextSize.X and currentSize.Y == nextSize.Y then currentSize else nextSize
			end)
		end
		updateAbsoluteSize()
		local absoluteSizeConnection = instance:GetPropertyChangedSignal("AbsoluteSize"):Connect(updateAbsoluteSize)
		return function()
			absoluteSizeConnection:Disconnect()
		end
	end, { instance })
	return absoluteSize
end
local function resolveViewport(size)
	if size == nil then
		return {
			width = 0,
			height = 0,
		}
	end
	return {
		width = size.X,
		height = size.Y,
	}
end
local function resolveLocalInputPosition(input, overlay)
	local _vector2 = Vector2.new(input.Position.X, input.Position.Y)
	local _absolutePosition = overlay.AbsolutePosition
	return _vector2 - _absolutePosition
end
local function resolveInitialWindowBounds(viewport, width, height, position, center, options)
	local centered = resolveCenteredWindowPosition(width, height, viewport)
	local usesCenteredPlacement = position == nil and center ~= false
	local x = if usesCenteredPlacement or position == nil then centered.x else resolveUDimPixels(position.X, viewport.width)
	local y = if usesCenteredPlacement or position == nil then centered.y else resolveUDimPixels(position.Y, viewport.height)
	return clampWindowBounds({
		x = x,
		y = y,
		width = width,
		height = height,
	}, options)
end
local function toClampOptions(viewport, minWidth, minHeight, maxWidth, maxHeight, margin)
	return {
		minWidth = minWidth,
		minHeight = minHeight,
		maxWidth = maxWidth,
		maxHeight = maxHeight,
		viewport = viewport,
		margin = margin,
	}
end
return {
	useAbsoluteSize = useAbsoluteSize,
	resolveViewport = resolveViewport,
	resolveLocalInputPosition = resolveLocalInputPosition,
	resolveInitialWindowBounds = resolveInitialWindowBounds,
	toClampOptions = toClampOptions,
}
