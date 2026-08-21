export interface WindowBounds {
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
}

export interface WindowViewport {
	readonly width: number;
	readonly height: number;
}

export interface WindowClampOptions {
	readonly minWidth: number;
	readonly minHeight: number;
	readonly maxWidth?: number;
	readonly maxHeight?: number;
	readonly viewport: WindowViewport;
	readonly margin: number;
}

export const DEFAULT_WINDOW_WIDTH = 480;
export const DEFAULT_WINDOW_HEIGHT = 360;
export const DEFAULT_WINDOW_MIN_WIDTH = 280;
export const DEFAULT_WINDOW_MIN_HEIGHT = 180;

function clampAxis(value: number, min: number, max: number): number {
	if (max < min) {
		return min;
	}

	return math.clamp(value, min, max);
}

export function areWindowBoundsEqual(left: WindowBounds, right: WindowBounds): boolean {
	return left.x === right.x && left.y === right.y && left.width === right.width && left.height === right.height;
}

export function resolveUDimPixels(value: UDim, viewport: number): number {
	return value.Scale * viewport + value.Offset;
}

export function resolveCenteredWindowPosition(
	width: number,
	height: number,
	viewport: WindowViewport,
): { readonly x: number; readonly y: number } {
	return {
		x: (viewport.width - width) / 2,
		y: (viewport.height - height) / 2,
	};
}

export function resolveMaximizedWindowBounds(viewport: WindowViewport): WindowBounds {
	return {
		x: 0,
		y: 0,
		width: math.max(0, viewport.width),
		height: math.max(0, viewport.height),
	};
}

function resolveAvailableSize(viewport: WindowViewport, margin: number): { readonly width: number; readonly height: number } {
	return {
		width: math.max(0, viewport.width - margin * 2),
		height: math.max(0, viewport.height - margin * 2),
	};
}

export function clampWindowBounds(bounds: WindowBounds, options: WindowClampOptions): WindowBounds {
	const available = resolveAvailableSize(options.viewport, options.margin);
	const minWidth = math.min(math.max(0, options.minWidth), available.width);
	const minHeight = math.min(math.max(0, options.minHeight), available.height);
	const maxWidth = math.max(minWidth, math.min(options.maxWidth ?? available.width, available.width));
	const maxHeight = math.max(minHeight, math.min(options.maxHeight ?? available.height, available.height));
	const width = clampAxis(bounds.width, minWidth, maxWidth);
	const height = clampAxis(bounds.height, minHeight, maxHeight);
	const maxX = math.max(options.margin, options.viewport.width - options.margin - width);
	const maxY = math.max(options.margin, options.viewport.height - options.margin - height);

	return {
		x: clampAxis(bounds.x, options.margin, maxX),
		y: clampAxis(bounds.y, options.margin, maxY),
		width,
		height,
	};
}

export function applyWindowMove(
	bounds: WindowBounds,
	nextX: number,
	nextY: number,
	options: WindowClampOptions,
): WindowBounds {
	return clampWindowBounds(
		{
			x: nextX,
			y: nextY,
			width: bounds.width,
			height: bounds.height,
		},
		options,
	);
}

export function applyWindowResize(
	bounds: WindowBounds,
	nextWidth: number,
	nextHeight: number,
	options: WindowClampOptions,
): WindowBounds {
	const maxWidth = math.max(0, options.viewport.width - options.margin - bounds.x);
	const maxHeight = math.max(0, options.viewport.height - options.margin - bounds.y);
	const minWidth = math.min(math.max(0, options.minWidth), maxWidth);
	const minHeight = math.min(math.max(0, options.minHeight), maxHeight);
	const resolvedMaxWidth = math.max(minWidth, math.min(options.maxWidth ?? maxWidth, maxWidth));
	const resolvedMaxHeight = math.max(minHeight, math.min(options.maxHeight ?? maxHeight, maxHeight));

	return {
		x: bounds.x,
		y: bounds.y,
		width: clampAxis(nextWidth, minWidth, resolvedMaxWidth),
		height: clampAxis(nextHeight, minHeight, resolvedMaxHeight),
	};
}
