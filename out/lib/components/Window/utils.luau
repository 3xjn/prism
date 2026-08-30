-- Compiled with roblox-ts v3.0.0
local DEFAULT_WINDOW_WIDTH = 480
local DEFAULT_WINDOW_HEIGHT = 360
local DEFAULT_WINDOW_MIN_WIDTH = 280
local DEFAULT_WINDOW_MIN_HEIGHT = 180
local function clampAxis(value, min, max)
	if max < min then
		return min
	end
	return math.clamp(value, min, max)
end
local function areWindowBoundsEqual(left, right)
	return left.x == right.x and left.y == right.y and left.width == right.width and left.height == right.height
end
local function resolveUDimPixels(value, viewport)
	return value.Scale * viewport + value.Offset
end
local function resolveCenteredWindowPosition(width, height, viewport)
	return {
		x = (viewport.width - width) / 2,
		y = (viewport.height - height) / 2,
	}
end
local function resolveMaximizedWindowBounds(viewport)
	return {
		x = 0,
		y = 0,
		width = math.max(0, viewport.width),
		height = math.max(0, viewport.height),
	}
end
local clampWindowBounds
local function resolveCollapsedWindowBounds(origin, collapseControlSize, viewport, margin)
	return clampWindowBounds({
		x = origin.x,
		y = origin.y,
		width = collapseControlSize,
		height = collapseControlSize,
	}, {
		minWidth = collapseControlSize,
		minHeight = collapseControlSize,
		maxWidth = collapseControlSize,
		maxHeight = collapseControlSize,
		viewport = viewport,
		margin = margin,
	})
end
local function interpolateWindowBounds(from, to, alpha)
	return {
		x = from.x + (to.x - from.x) * alpha,
		y = from.y + (to.y - from.y) * alpha,
		width = from.width + (to.width - from.width) * alpha,
		height = from.height + (to.height - from.height) * alpha,
	}
end
local function resolveAvailableSize(viewport, margin)
	return {
		width = math.max(0, viewport.width - margin * 2),
		height = math.max(0, viewport.height - margin * 2),
	}
end
function clampWindowBounds(bounds, options)
	local available = resolveAvailableSize(options.viewport, options.margin)
	local minWidth = math.min(math.max(0, options.minWidth), available.width)
	local minHeight = math.min(math.max(0, options.minHeight), available.height)
	local _condition = options.maxWidth
	if _condition == nil then
		_condition = available.width
	end
	local maxWidth = math.max(minWidth, math.min(_condition, available.width))
	local _condition_1 = options.maxHeight
	if _condition_1 == nil then
		_condition_1 = available.height
	end
	local maxHeight = math.max(minHeight, math.min(_condition_1, available.height))
	local width = clampAxis(bounds.width, minWidth, maxWidth)
	local height = clampAxis(bounds.height, minHeight, maxHeight)
	local maxX = math.max(options.margin, options.viewport.width - options.margin - width)
	local maxY = math.max(options.margin, options.viewport.height - options.margin - height)
	return {
		x = clampAxis(bounds.x, options.margin, maxX),
		y = clampAxis(bounds.y, options.margin, maxY),
		width = width,
		height = height,
	}
end
local function applyWindowMove(bounds, nextX, nextY, options)
	return clampWindowBounds({
		x = nextX,
		y = nextY,
		width = bounds.width,
		height = bounds.height,
	}, options)
end
local function applyWindowResize(bounds, nextWidth, nextHeight, options)
	local maxWidth = math.max(0, options.viewport.width - options.margin - bounds.x)
	local maxHeight = math.max(0, options.viewport.height - options.margin - bounds.y)
	local minWidth = math.min(math.max(0, options.minWidth), maxWidth)
	local minHeight = math.min(math.max(0, options.minHeight), maxHeight)
	local _condition = options.maxWidth
	if _condition == nil then
		_condition = maxWidth
	end
	local resolvedMaxWidth = math.max(minWidth, math.min(_condition, maxWidth))
	local _condition_1 = options.maxHeight
	if _condition_1 == nil then
		_condition_1 = maxHeight
	end
	local resolvedMaxHeight = math.max(minHeight, math.min(_condition_1, maxHeight))
	return {
		x = bounds.x,
		y = bounds.y,
		width = clampAxis(nextWidth, minWidth, resolvedMaxWidth),
		height = clampAxis(nextHeight, minHeight, resolvedMaxHeight),
	}
end
return {
	areWindowBoundsEqual = areWindowBoundsEqual,
	resolveUDimPixels = resolveUDimPixels,
	resolveCenteredWindowPosition = resolveCenteredWindowPosition,
	resolveMaximizedWindowBounds = resolveMaximizedWindowBounds,
	resolveCollapsedWindowBounds = resolveCollapsedWindowBounds,
	interpolateWindowBounds = interpolateWindowBounds,
	clampWindowBounds = clampWindowBounds,
	applyWindowMove = applyWindowMove,
	applyWindowResize = applyWindowResize,
	DEFAULT_WINDOW_WIDTH = DEFAULT_WINDOW_WIDTH,
	DEFAULT_WINDOW_HEIGHT = DEFAULT_WINDOW_HEIGHT,
	DEFAULT_WINDOW_MIN_WIDTH = DEFAULT_WINDOW_MIN_WIDTH,
	DEFAULT_WINDOW_MIN_HEIGHT = DEFAULT_WINDOW_MIN_HEIGHT,
}
