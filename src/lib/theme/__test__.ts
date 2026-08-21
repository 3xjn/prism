import {
	resolveDensityControlSize,
	resolveDensityGap,
	resolveDensityMarkSize,
	resolveThemeSpacing,
} from "./density";
import type { ThemeDensity, ThemeScale } from "./types";

function assertCondition(condition: boolean, message: string): void {
	if (!condition) {
		error(message);
	}
}

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

function runDensityAssertions(): void {
	const defaultTheme = themeWithDensity("default");
	const compactTheme = themeWithDensity("compact");

	assertCondition(resolveThemeSpacing(defaultTheme, "md") === 12, "default spacing.md stays 12");
	assertCondition(resolveThemeSpacing(defaultTheme, "xl") === 24, "default spacing.xl stays 24");
	assertCondition(resolveThemeSpacing(compactTheme, "xs") === 4, "compact spacing.xs stays 4");
	assertCondition(resolveThemeSpacing(compactTheme, "sm") === 6, "compact spacing.sm tightens to 6");
	assertCondition(resolveThemeSpacing(compactTheme, "md") === 8, "compact spacing.md tightens to 8");
	assertCondition(resolveThemeSpacing(compactTheme, "lg") === 12, "compact spacing.lg tightens to 12");
	assertCondition(resolveThemeSpacing(compactTheme, "xl") === 16, "compact spacing.xl tightens to 16");

	assertCondition(resolveDensityControlSize(defaultTheme, 36) === 36, "default md control height stays 36");
	assertCondition(resolveDensityControlSize(compactTheme, 36) === 32, "compact md control height is 32");
	assertCondition(resolveDensityControlSize(compactTheme, 32) === 32, "compact sm control height stays 32");
	assertCondition(resolveDensityControlSize(compactTheme, 40) === 36, "compact lg control height is 36");
	assertCondition(resolveDensityControlSize(compactTheme, 24) === 22, "compact already-small heights tighten slightly");

	assertCondition(resolveDensityGap(defaultTheme, 6) === 6, "default gaps stay put");
	assertCondition(resolveDensityGap(compactTheme, 6) === 4, "compact gaps tighten by 2");
	assertCondition(resolveDensityMarkSize(compactTheme, 18) === 16, "compact checkbox marks shrink by 2");
	assertCondition(resolveDensityMarkSize(compactTheme, 12) === 12, "compact marks do not drop below 12");

	print("density: PASS");
}

runDensityAssertions();
