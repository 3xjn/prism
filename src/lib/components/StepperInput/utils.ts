export interface StepperInputRange {
	readonly min?: number;
	readonly max?: number;
	readonly span?: number;
}

export function isFiniteNumber(value: number | undefined): value is number {
	return value !== undefined && value === value && value > -math.huge && value < math.huge;
}

export function resolveStepperInputRange(min: number | undefined, max: number | undefined): StepperInputRange {
	const resolvedMin = isFiniteNumber(min) ? min : undefined;
	const resolvedMax = isFiniteNumber(max) ? max : undefined;

	if (resolvedMin !== undefined && resolvedMax !== undefined) {
		const normalizedMax = resolvedMax < resolvedMin ? resolvedMin : resolvedMax;
		return {
			min: resolvedMin,
			max: normalizedMax,
			span: normalizedMax - resolvedMin,
		};
	}

	return {
		min: resolvedMin,
		max: resolvedMax,
		span: undefined,
	};
}

export function resolveValidStepperInputStep(step: number | undefined): number {
	return isFiniteNumber(step) && step > 0 ? step : 1;
}

function clampToRange(value: number, range: StepperInputRange): number {
	let clampedValue = value;

	if (range.min !== undefined) {
		clampedValue = math.max(clampedValue, range.min);
	}

	if (range.max !== undefined) {
		clampedValue = math.min(clampedValue, range.max);
	}

	return clampedValue;
}

function resolveStepBase(range: StepperInputRange): number {
	return range.min ?? 0;
}

function resolveStepPrecision(step: number): number {
	let precision = 0;
	let scaledStep = step;

	while (precision < 6 && math.abs(scaledStep - math.round(scaledStep)) > 1e-6) {
		precision += 1;
		scaledStep *= 10;
	}

	return precision;
}

function roundToPrecision(value: number, precision: number): number {
	if (precision <= 0) {
		return math.round(value);
	}

	const scale = math.pow(10, precision);
	return math.round(value * scale) / scale;
}

export function normalizeStepperInputValue(value: number | undefined, range: StepperInputRange, step: number, fallback = 0): number {
	const baseValue = clampToRange(isFiniteNumber(value) ? value : fallback, range);
	const stepBase = resolveStepBase(range);
	const snappedStep = math.round((baseValue - stepBase) / step);
	const snappedValue = stepBase + snappedStep * step;
	const roundedValue = roundToPrecision(snappedValue, resolveStepPrecision(step));

	return clampToRange(roundedValue, range);
}

export function stepStepperInputValue(value: number, direction: -1 | 1, range: StepperInputRange, step: number): number {
	return normalizeStepperInputValue(value + direction * step, range, step, value);
}

export function formatStepperInputValue(value: number, formatValue: ((value: number) => string) | undefined): string {
	return formatValue?.(value) ?? tostring(value);
}

export interface StepperInputRailRange {
	readonly min: number;
	readonly max: number;
	readonly span: number;
}

export function resolveStepperInputRailRange(range: StepperInputRange): StepperInputRailRange {
	const resolvedMin = range.min ?? 0;
	const resolvedMax = range.max ?? 100;
	const normalizedMax = resolvedMax < resolvedMin ? resolvedMin : resolvedMax;

	return {
		min: resolvedMin,
		max: normalizedMax,
		span: normalizedMax - resolvedMin,
	};
}

export function normalizeStepperInputRailValue(value: number | undefined, range: StepperInputRailRange, step: number): number {
	return normalizeStepperInputValue(value, range, step, range.min);
}

export function valueToStepperInputRailAlpha(value: number, range: StepperInputRailRange): number {
	if (range.span <= 0) {
		return 0;
	}

	return math.clamp((value - range.min) / range.span, 0, 1);
}

export function stepperInputRailAlphaToValue(alpha: number, range: StepperInputRailRange, step: number): number {
	if (range.span <= 0) {
		return range.min;
	}

	return normalizeStepperInputRailValue(range.min + math.clamp(alpha, 0, 1) * range.span, range, step);
}

export function resolveStepperInputRailAlphaFromPositionX(rail: GuiObject | undefined, positionX: number): number {
	if (rail === undefined) {
		return 0;
	}

	const railWidth = rail.AbsoluteSize.X;
	if (railWidth <= 0) {
		return 0;
	}

	return math.clamp((positionX - rail.AbsolutePosition.X) / railWidth, 0, 1);
}
