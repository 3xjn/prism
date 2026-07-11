export type VirtualScrollAlignment = "nearest" | "start" | "center" | "end";

export interface FixedVirtualGeometryInput {
	readonly itemCount: number;
	readonly itemExtent: number;
	readonly lineGap?: number;
	readonly laneCount?: number;
}

export interface FixedVirtualGeometry {
	readonly itemCount: number;
	readonly itemExtent: number;
	readonly lineGap: number;
	readonly lineStride: number;
	readonly laneCount: number;
	readonly lineCount: number;
	readonly canvasExtent: number;
}

/** Half-open line range: [startLine, endLine). */
export interface VirtualLineRange {
	readonly startLine: number;
	readonly endLine: number;
}

/** Half-open item range: [startIndex, endIndex). */
export interface VirtualItemRange {
	readonly startIndex: number;
	readonly endIndex: number;
}

export interface FixedVirtualRangeInput {
	readonly scrollOffset: number;
	readonly viewportExtent: number;
	readonly overscanLines?: number;
}

export interface FixedVirtualRange {
	readonly scrollOffset: number;
	readonly maxScrollOffset: number;
	readonly visibleLineRange: VirtualLineRange;
	readonly renderedLineRange: VirtualLineRange;
	readonly visibleItemRange: VirtualItemRange;
	readonly renderedItemRange: VirtualItemRange;
}

export interface FixedVirtualScrollInput {
	readonly index: number;
	readonly viewportExtent: number;
	readonly currentScrollOffset: number;
	readonly alignment?: VirtualScrollAlignment;
}

export interface FixedGridLaneInput {
	readonly viewportWidth: number;
	readonly minimumCellWidth: number;
	readonly columnGap?: number;
	readonly maximumLaneCount?: number;
}

function isFiniteNumber(value: number): boolean {
	return value === value && value !== math.huge && value !== -math.huge;
}

function normalizeNonNegative(value: number | undefined, fallback = 0): number {
	return value !== undefined && isFiniteNumber(value) ? math.max(0, value) : fallback;
}

function normalizeInteger(value: number | undefined, minimum: number): number {
	return value !== undefined && isFiniteNumber(value) ? math.max(minimum, math.floor(value)) : minimum;
}

function resolveMaxScrollOffset(geometry: FixedVirtualGeometry, viewportExtent: number): number {
	return math.max(0, geometry.canvasExtent - viewportExtent);
}

function clampScrollOffset(scrollOffset: number, maxScrollOffset: number): number {
	if (scrollOffset !== scrollOffset || scrollOffset === -math.huge) {
		return 0;
	}
	if (scrollOffset === math.huge) {
		return maxScrollOffset;
	}

	return math.clamp(scrollOffset, 0, maxScrollOffset);
}

function lineRangeToItemRange(geometry: FixedVirtualGeometry, lineRange: VirtualLineRange): VirtualItemRange {
	return {
		startIndex: math.min(geometry.itemCount, lineRange.startLine * geometry.laneCount),
		endIndex: math.min(geometry.itemCount, lineRange.endLine * geometry.laneCount),
	};
}

function createEmptyRange(
	geometry: FixedVirtualGeometry,
	insertionLine = 0,
	scrollOffset = 0,
	maxScrollOffset = 0,
): FixedVirtualRange {
	const clampedLine = math.clamp(insertionLine, 0, geometry.lineCount);
	const lineRange = { startLine: clampedLine, endLine: clampedLine };
	const itemRange = lineRangeToItemRange(geometry, lineRange);

	return {
		scrollOffset,
		maxScrollOffset,
		visibleLineRange: lineRange,
		renderedLineRange: lineRange,
		visibleItemRange: itemRange,
		renderedItemRange: itemRange,
	};
}

export function resolveFixedVirtualGeometry(input: FixedVirtualGeometryInput): FixedVirtualGeometry {
	const itemCount = normalizeInteger(input.itemCount, 0);
	const itemExtent = normalizeNonNegative(input.itemExtent);
	const lineGap = normalizeNonNegative(input.lineGap);
	const laneCount = normalizeInteger(input.laneCount, 1);
	const lineCount = itemCount === 0 ? 0 : math.floor((itemCount + laneCount - 1) / laneCount);
	const lineStride = itemExtent + lineGap;
	const canvasExtent = lineCount === 0 ? 0 : lineCount * itemExtent + math.max(0, lineCount - 1) * lineGap;

	return {
		itemCount,
		itemExtent,
		lineGap,
		lineStride,
		laneCount,
		lineCount,
		canvasExtent,
	};
}

export function resolveFixedVirtualRange(
	geometry: FixedVirtualGeometry,
	input: FixedVirtualRangeInput,
): FixedVirtualRange {
	const viewportExtent = normalizeNonNegative(input.viewportExtent);
	const maxScrollOffset = resolveMaxScrollOffset(geometry, viewportExtent);
	const scrollOffset = clampScrollOffset(input.scrollOffset, maxScrollOffset);

	if (geometry.itemCount === 0 || geometry.lineCount === 0 || geometry.itemExtent <= 0 || geometry.lineStride <= 0) {
		return createEmptyRange(geometry, 0, scrollOffset, maxScrollOffset);
	}

	if (viewportExtent <= 0) {
		const insertionLine = math.clamp(
			math.floor((scrollOffset + geometry.lineGap) / geometry.lineStride),
			0,
			geometry.lineCount,
		);
		return createEmptyRange(geometry, insertionLine, scrollOffset, maxScrollOffset);
	}

	const viewportEnd = scrollOffset + viewportExtent;
	const startLine = math.clamp(
		math.floor((scrollOffset + geometry.lineGap) / geometry.lineStride),
		0,
		geometry.lineCount,
	);
	const endLine = math.clamp(math.ceil(viewportEnd / geometry.lineStride), startLine, geometry.lineCount);
	const visibleLineRange = { startLine, endLine };
	const overscanLines = normalizeInteger(input.overscanLines, 0);
	const renderedLineRange = {
		startLine: math.max(0, startLine - overscanLines),
		endLine: math.min(geometry.lineCount, endLine + overscanLines),
	};

	return {
		scrollOffset,
		maxScrollOffset,
		visibleLineRange,
		renderedLineRange,
		visibleItemRange: lineRangeToItemRange(geometry, visibleLineRange),
		renderedItemRange: lineRangeToItemRange(geometry, renderedLineRange),
	};
}

export function resolveFixedVirtualScrollOffset(
	geometry: FixedVirtualGeometry,
	input: FixedVirtualScrollInput,
): number | undefined {
	if (
		!isFiniteNumber(input.index) ||
		input.index < 0 ||
		input.index >= geometry.itemCount ||
		math.floor(input.index) !== input.index
	) {
		return undefined;
	}

	const viewportExtent = normalizeNonNegative(input.viewportExtent);
	const maxScrollOffset = resolveMaxScrollOffset(geometry, viewportExtent);
	const currentScrollOffset = clampScrollOffset(input.currentScrollOffset, maxScrollOffset);
	const line = math.floor(input.index / geometry.laneCount);
	const lineStart = line * geometry.lineStride;
	const startOffset = lineStart;
	const centerOffset = lineStart - (viewportExtent - geometry.itemExtent) * 0.5;
	const endOffset = lineStart + geometry.itemExtent - viewportExtent;
	let targetOffset: number;

	switch (input.alignment ?? "nearest") {
		case "start":
			targetOffset = startOffset;
			break;
		case "center":
			targetOffset = centerOffset;
			break;
		case "end":
			targetOffset = endOffset;
			break;
		case "nearest":
		default: {
			const nearestMinimum = math.min(startOffset, endOffset);
			const nearestMaximum = math.max(startOffset, endOffset);
			targetOffset = math.clamp(currentScrollOffset, nearestMinimum, nearestMaximum);
			break;
		}
	}

	return math.clamp(targetOffset, 0, maxScrollOffset);
}

export function resolveFixedGridLaneCount(input: FixedGridLaneInput): number {
	const viewportWidth = normalizeNonNegative(input.viewportWidth);
	const minimumCellWidth = normalizeNonNegative(input.minimumCellWidth);
	const columnGap = normalizeNonNegative(input.columnGap);

	if (minimumCellWidth <= 0) {
		return 1;
	}

	const laneCount = math.max(1, math.floor((viewportWidth + columnGap) / (minimumCellWidth + columnGap)));
	const maximumLaneCount =
		input.maximumLaneCount === undefined ? undefined : normalizeInteger(input.maximumLaneCount, 1);

	return maximumLaneCount === undefined ? laneCount : math.min(laneCount, maximumLaneCount);
}
