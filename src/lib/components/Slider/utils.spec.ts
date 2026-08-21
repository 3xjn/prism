import { alphaToValue, normalizeSliderValue, resolveSliderRange, valueToAlpha } from "./utils";

const MAX_FINITE = 1.7976931348623157e308;

function expectFinite(value: number): void {
	expect(value === value).toBe(true);
	expect(value > -math.huge).toBe(true);
	expect(value < math.huge).toBe(true);
}

describe("slider range", () => {
	it("falls back to a strict finite range at extreme max values", () => {
		const extremeSliderRange = resolveSliderRange(-MAX_FINITE, MAX_FINITE);
		expectFinite(extremeSliderRange.min);
		expectFinite(extremeSliderRange.max);
		expectFinite(extremeSliderRange.span);
		expect(extremeSliderRange.max > extremeSliderRange.min).toBe(true);

		const extremeSliderValue = normalizeSliderValue(MAX_FINITE, extremeSliderRange, undefined);
		expectFinite(extremeSliderValue);
		expect(extremeSliderValue >= extremeSliderRange.min && extremeSliderValue <= extremeSliderRange.max).toBe(true);

		const extremeSliderAlpha = valueToAlpha(extremeSliderValue, extremeSliderRange);
		expectFinite(extremeSliderAlpha);
		expect(extremeSliderAlpha >= 0 && extremeSliderAlpha <= 1).toBe(true);

		const extremeSliderAlphaValue = alphaToValue(0.5, extremeSliderRange, undefined);
		expectFinite(extremeSliderAlphaValue);
		expect(
			extremeSliderAlphaValue >= extremeSliderRange.min && extremeSliderAlphaValue <= extremeSliderRange.max,
		).toBe(true);
	});

	it("keeps a strict finite range when min and max are both max finite", () => {
		const equalExtremeSliderRange = resolveSliderRange(MAX_FINITE, MAX_FINITE);
		expectFinite(equalExtremeSliderRange.span);
		expect(equalExtremeSliderRange.max > equalExtremeSliderRange.min).toBe(true);
	});

	it("treats inverted finite ranges as non-interactive", () => {
		const invertedFiniteSliderRange = resolveSliderRange(10, 0);
		expect(invertedFiniteSliderRange.min).toBe(10);
		expect(invertedFiniteSliderRange.max).toBe(10);
		expect(invertedFiniteSliderRange.span).toBe(0);
		expect(alphaToValue(1, invertedFiniteSliderRange, undefined)).toBe(10);
	});

	it("treats equal finite ranges as non-interactive", () => {
		const equalFiniteSliderRange = resolveSliderRange(10, 10);
		expect(equalFiniteSliderRange.min).toBe(10);
		expect(equalFiniteSliderRange.max).toBe(10);
		expect(equalFiniteSliderRange.span).toBe(0);
		expect(alphaToValue(1, equalFiniteSliderRange, undefined)).toBe(10);
	});

	it("returns finite fallbacks for an unusable infinite span", () => {
		const unusableRange = { min: 0, max: MAX_FINITE, span: math.huge };
		expectFinite(valueToAlpha(0, unusableRange));
		expectFinite(alphaToValue(0.5, unusableRange, undefined));
	});
});
