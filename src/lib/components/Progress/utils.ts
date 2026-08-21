export interface ProgressRange {
	readonly min: number;
	readonly max: number;
}

function isFiniteNumber(value: number | undefined): value is number {
	return value !== undefined && value === value && value > -math.huge && value < math.huge;
}

function resolveFiniteNumber(value: number | undefined, fallback: number): number {
	return isFiniteNumber(value) ? value : fallback;
}

const SAFE_PROGRESS_RANGE: ProgressRange = {
	min: 0,
	max: 1,
};

export function resolveProgressRange(min: number | undefined, max: number | undefined): ProgressRange {
	const resolvedMin = resolveFiniteNumber(min, 0);
	const requestedMax = resolveFiniteNumber(max, 100);

	if (requestedMax > resolvedMin) {
		return {
			min: resolvedMin,
			max: requestedMax,
		};
	}

	const fallbackMax = resolvedMin + 1;

	if (isFiniteNumber(fallbackMax) && fallbackMax > resolvedMin) {
		return {
			min: resolvedMin,
			max: fallbackMax,
		};
	}

	return SAFE_PROGRESS_RANGE;
}

export function resolveProgressValue(value: number | undefined, range: ProgressRange): number {
	return math.clamp(resolveFiniteNumber(value, range.min), range.min, range.max);
}

export function resolveProgressPercent(value: number, range: ProgressRange): number {
	return (value - range.min) / (range.max - range.min);
}
