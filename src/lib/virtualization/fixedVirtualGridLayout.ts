import { resolveFixedGridLaneCount, type FixedVirtualGeometry } from "./_internal/fixedVirtualGeometry";

export interface FixedVirtualGridLayoutInput {
	readonly availableWidth: number;
	readonly columnGap?: number;
	readonly columns?: number;
	readonly minimumCellWidth?: number;
	readonly maxColumns?: number;
}

export interface FixedVirtualGridLayout {
	readonly availableWidth: number;
	readonly laneCount: number;
	readonly cellWidth: number;
	readonly columnGap: number;
}

export interface FixedVirtualGridCellLayout {
	readonly row: number;
	readonly column: number;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
}

function isFiniteNumber(value: number): boolean {
	return value === value && value !== math.huge && value !== -math.huge;
}

function normalizeNonNegative(value: number | undefined): number {
	return value !== undefined && isFiniteNumber(value) ? math.max(0, value) : 0;
}

function normalizePositiveInteger(value: number | undefined): number | undefined {
	return value !== undefined && isFiniteNumber(value) ? math.max(1, math.floor(value)) : undefined;
}

export function resolveFixedVirtualGridLayout(input: FixedVirtualGridLayoutInput): FixedVirtualGridLayout {
	const availableWidth = normalizeNonNegative(input.availableWidth);
	const columnGap = normalizeNonNegative(input.columnGap);
	const explicitColumns = normalizePositiveInteger(input.columns);
	const laneCount =
		explicitColumns ??
		resolveFixedGridLaneCount({
			viewportWidth: availableWidth,
			minimumCellWidth: normalizeNonNegative(input.minimumCellWidth),
			columnGap,
			maximumLaneCount: normalizePositiveInteger(input.maxColumns),
		});
	const totalGapWidth = math.max(0, laneCount - 1) * columnGap;
	const cellWidth = math.max(0, (availableWidth - totalGapWidth) / laneCount);

	return { availableWidth, laneCount, cellWidth, columnGap };
}

export function resolveFixedVirtualGridCellLayout(
	index: number,
	geometry: FixedVirtualGeometry,
	layout: FixedVirtualGridLayout,
): FixedVirtualGridCellLayout | undefined {
	if (!isFiniteNumber(index) || index < 0 || index >= geometry.itemCount || math.floor(index) !== index) {
		return undefined;
	}

	const row = math.floor(index / layout.laneCount);
	const column = index % layout.laneCount;
	return {
		row,
		column,
		x: column * (layout.cellWidth + layout.columnGap),
		y: row * geometry.lineStride,
		width: layout.cellWidth,
		height: geometry.itemExtent,
	};
}
