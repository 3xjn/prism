export { resolveTextFontFace } from "../_shared/textFont";

export interface SliderRange {
	readonly min: number;
	readonly max: number;
	readonly span: number;
}

export type SliderStepDirection = -1 | 1;

export interface SliderStepValueInput {
	readonly value: number;
	readonly direction: SliderStepDirection;
	readonly range: SliderRange;
	readonly step: number | undefined;
}

function isFiniteNumber(value: number | undefined): value is number {
	return value !== undefined && value === value && value > -math.huge && value < math.huge;
}

function resolveFiniteNumber(value: number | undefined, fallback: number): number {
	return isFiniteNumber(value) ? value : fallback;
}

const SAFE_SLIDER_RANGE: SliderRange = {
	min: 0,
	max: 1,
	span: 1,
};

export function resolveSliderRange(min: number | undefined, max: number | undefined): SliderRange {
	const resolvedMin = resolveFiniteNumber(min, 0);
	const requestedMax = resolveFiniteNumber(max, 100);

	if (requestedMax > resolvedMin) {
		const requestedSpan = requestedMax - resolvedMin;

		if (isFiniteNumber(requestedSpan) && requestedSpan > 0) {
			return {
				min: resolvedMin,
				max: requestedMax,
				span: requestedSpan,
			};
		}

		const fallbackMax = resolvedMin + 1;
		const fallbackSpan = fallbackMax - resolvedMin;

		if (isFiniteNumber(fallbackSpan) && fallbackSpan > 0) {
			return {
				min: resolvedMin,
				max: fallbackMax,
				span: fallbackSpan,
			};
		}

		return SAFE_SLIDER_RANGE;
	}

	if (requestedMax === resolvedMin) {
		const fallbackMax = resolvedMin + 1;

		if (!isFiniteNumber(fallbackMax) || fallbackMax <= resolvedMin) {
			return SAFE_SLIDER_RANGE;
		}
	}

	return {
		min: resolvedMin,
		max: resolvedMin,
		span: 0,
	};
}

export function resolveValidStep(step: number | undefined): number | undefined {
	if (!isFiniteNumber(step) || step <= 0) {
		return undefined;
	}

	return step;
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

export function normalizeSliderValue(value: number | undefined, range: SliderRange, step: number | undefined): number {
	const baseValue = math.clamp(resolveFiniteNumber(value, range.min), range.min, range.max);

	if (range.span <= 0 || step === undefined) {
		return baseValue;
	}

	const snappedStep = math.round((baseValue - range.min) / step);
	const snappedValue = range.min + snappedStep * step;
	const roundedValue = roundToPrecision(snappedValue, resolveStepPrecision(step));

	return math.clamp(roundedValue, range.min, range.max);
}

export function valueToAlpha(value: number, range: SliderRange): number {
	if (!isFiniteNumber(range.span) || range.span <= 0) {
		return 0;
	}

	return math.clamp(resolveFiniteNumber((value - range.min) / range.span, 0), 0, 1);
}

export function alphaToValue(alpha: number, range: SliderRange, step: number | undefined): number {
	if (!isFiniteNumber(range.span) || range.span <= 0) {
		return range.min;
	}

	return normalizeSliderValue(range.min + math.clamp(alpha, 0, 1) * range.span, range, step);
}

function resolveDiscreteStep(range: SliderRange, step: number | undefined): number {
	if (range.span <= 0) {
		return 0;
	}

	return step ?? range.span / 100;
}

export function stepSliderValue(input: SliderStepValueInput): number {
	const stepAmount = resolveDiscreteStep(input.range, input.step);
	if (stepAmount <= 0) {
		return normalizeSliderValue(input.value, input.range, input.step);
	}

	return normalizeSliderValue(input.value + input.direction * stepAmount, input.range, input.step);
}

export function resolveAlphaFromPositionX(track: GuiObject | undefined, positionX: number): number {
	if (track === undefined) {
		return 0;
	}

	const trackWidth = track.AbsoluteSize.X;
	if (trackWidth <= 0) {
		return 0;
	}

	return math.clamp((positionX - track.AbsolutePosition.X) / trackWidth, 0, 1);
}
