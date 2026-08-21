import React from "@rbxts/react";
import { EnumList } from "@rbxts/ui-labs";
import { DEFAULT_DARK_THEME, ThemeProvider } from "@prism/theme";
import type { ThemeDensity, ThemeOverride } from "@prism/theme";

type StoryThemeMode = "light" | "dark";

export const storyThemeControl = EnumList(
	{
		light: "light",
		dark: "dark",
	},
	"light",
);

export const storyDensityControl = EnumList(
	{
		default: "default",
		compact: "compact",
	},
	"default",
);

function resolveStoryTheme(mode: StoryThemeMode | string): ThemeOverride | undefined {
	return mode === "dark" ? DEFAULT_DARK_THEME : undefined;
}

function resolveStoryDensity(density: ThemeDensity | string | undefined): ThemeDensity {
	return density === "compact" ? "compact" : "default";
}

interface StoryThemeProviderProps {
	readonly mode: StoryThemeMode | string;
	readonly density?: ThemeDensity | string;
	readonly children?: React.ReactNode;
}

export function StoryThemeProvider({ mode, density, children }: StoryThemeProviderProps): React.ReactElement {
	return (
		<ThemeProvider theme={resolveStoryTheme(mode)} density={resolveStoryDensity(density)}>
			{children}
		</ThemeProvider>
	);
}
