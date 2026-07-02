import React from "@rbxts/react";
import { EnumList } from "@rbxts/ui-labs";
import { DEFAULT_DARK_THEME, ThemeProvider } from "@prism/theme";
import type { ThemeOverride } from "@prism/theme";

type StoryThemeMode = "light" | "dark";

export const storyThemeControl = EnumList(
	{
		light: "light",
		dark: "dark",
	},
	"light",
);

function resolveStoryTheme(mode: StoryThemeMode | string): ThemeOverride | undefined {
	return mode === "dark" ? DEFAULT_DARK_THEME : undefined;
}

interface StoryThemeProviderProps {
	readonly mode: StoryThemeMode | string;
	readonly children?: React.ReactNode;
}

export function StoryThemeProvider({ mode, children }: StoryThemeProviderProps): React.ReactElement {
	return <ThemeProvider theme={resolveStoryTheme(mode)}>{children}</ThemeProvider>;
}
