import { resolveProgressPercent, resolveProgressRange, resolveProgressValue } from "./utils";

const MAX_FINITE = 1.7976931348623157e308;

function expectFinite(value: number): void {
	expect(value === value).toBe(true);
	expect(value > -math.huge).toBe(true);
	expect(value < math.huge).toBe(true);
}

describe("progress range", () => {
	it("falls back to a strict finite range at extreme max values", () => {
		const extremeProgressRange = resolveProgressRange(MAX_FINITE, MAX_FINITE);
		expectFinite(extremeProgressRange.min);
		expectFinite(extremeProgressRange.max);
		expectFinite(extremeProgressRange.max - extremeProgressRange.min);
		expect(extremeProgressRange.max > extremeProgressRange.min).toBe(true);

		const extremeProgressValue = resolveProgressValue(MAX_FINITE, extremeProgressRange);
		const extremeProgressPercent = resolveProgressPercent(extremeProgressValue, extremeProgressRange);
		expectFinite(extremeProgressPercent);
		expect(extremeProgressPercent >= 0 && extremeProgressPercent <= 1).toBe(true);
	});
});
