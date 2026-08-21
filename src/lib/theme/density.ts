import type { Theme, ThemeDensity, ThemeScale, ThemeSize } from "./types";

export const DEFAULT_DENSITY: ThemeDensity = "default";

// Compact spacing is applied at resolve time. Published theme.spacing
// stays on the default scale so existing UIs do not jump, and control
// heights can keep using those canonical values as their baseline.
const COMPACT_SPACING: ThemeScale<number> = table.freeze({
	xs: 4,
	sm: 6,
	md: 8,
	lg: 12,
	xl: 16,
});

export function isCompactDensity(density: ThemeDensity | undefined): boolean {
	return density === "compact";
}

export function resolveThemeSpacing(theme: Pick<Theme, "density" | "spacing">, size: ThemeSize): number {
	if (theme.density === "compact") {
		return COMPACT_SPACING[size];
	}

	return theme.spacing[size];
}

export function resolveDensityControlSize(theme: Pick<Theme, "density">, defaultValue: number): number {
	if (theme.density !== "compact") {
		return defaultValue;
	}

	if (defaultValue >= 36) {
		return defaultValue - 4;
	}

	if (defaultValue >= 32) {
		return defaultValue;
	}

	return math.max(16, defaultValue - 2);
}

export function resolveDensityGap(theme: Pick<Theme, "density">, defaultValue: number): number {
	if (theme.density !== "compact") {
		return defaultValue;
	}

	return math.max(2, defaultValue - 2);
}

export function resolveDensityMarkSize(theme: Pick<Theme, "density">, defaultValue: number): number {
	if (theme.density !== "compact") {
		return defaultValue;
	}

	return math.max(12, defaultValue - 2);
}
