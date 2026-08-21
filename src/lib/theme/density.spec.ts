import { describe, expect, it } from "@rbxts/jest-globals";

import {
	resolveDensityControlSize,
	resolveDensityGap,
	resolveDensityMarkSize,
	resolveThemeSpacing,
} from "./density";
import type { ThemeDensity, ThemeScale } from "./types";

const defaultSpacing: ThemeScale<number> = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
};

function themeWithDensity(density: ThemeDensity) {
	return {
		density,
		spacing: defaultSpacing,
	};
}

describe("density", () => {
	const defaultTheme = themeWithDensity("default");
	const compactTheme = themeWithDensity("compact");

	it("keeps default spacing tokens", () => {
		expect(resolveThemeSpacing(defaultTheme, "md")).toBe(12);
		expect(resolveThemeSpacing(defaultTheme, "xl")).toBe(24);
	});

	it("tightens compact spacing except xs", () => {
		expect(resolveThemeSpacing(compactTheme, "xs")).toBe(4);
		expect(resolveThemeSpacing(compactTheme, "sm")).toBe(6);
		expect(resolveThemeSpacing(compactTheme, "md")).toBe(8);
		expect(resolveThemeSpacing(compactTheme, "lg")).toBe(12);
		expect(resolveThemeSpacing(compactTheme, "xl")).toBe(16);
	});

	it("resolves compact control heights", () => {
		expect(resolveDensityControlSize(defaultTheme, 36)).toBe(36);
		expect(resolveDensityControlSize(compactTheme, 36)).toBe(32);
		expect(resolveDensityControlSize(compactTheme, 32)).toBe(32);
		expect(resolveDensityControlSize(compactTheme, 40)).toBe(36);
		expect(resolveDensityControlSize(compactTheme, 24)).toBe(22);
	});

	it("tightens compact gaps and marks without dropping below the floor", () => {
		expect(resolveDensityGap(defaultTheme, 6)).toBe(6);
		expect(resolveDensityGap(compactTheme, 6)).toBe(4);
		expect(resolveDensityMarkSize(compactTheme, 18)).toBe(16);
		expect(resolveDensityMarkSize(compactTheme, 12)).toBe(12);
	});
});
