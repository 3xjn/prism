import React from "@rbxts/react";
import type { Theme, ThemeDensity, ThemeOverride } from "./types";
export interface ThemeProviderProps {
    readonly children?: React.ReactNode;
    readonly theme?: ThemeOverride;
    readonly density?: ThemeDensity;
}
export declare function ThemeProvider({ children, theme, density }: ThemeProviderProps): React.ReactElement;
export declare function useTheme(): Theme;
