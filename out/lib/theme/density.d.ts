import type { Theme, ThemeDensity, ThemeSize } from "./types";
export declare const DEFAULT_DENSITY: ThemeDensity;
export declare function isCompactDensity(density: ThemeDensity | undefined): boolean;
export declare function resolveThemeSpacing(theme: Pick<Theme, "density" | "spacing">, size: ThemeSize): number;
export declare function resolveDensityControlSize(theme: Pick<Theme, "density">, defaultValue: number): number;
export declare function resolveDensityGap(theme: Pick<Theme, "density">, defaultValue: number): number;
export declare function resolveDensityMarkSize(theme: Pick<Theme, "density">, defaultValue: number): number;
