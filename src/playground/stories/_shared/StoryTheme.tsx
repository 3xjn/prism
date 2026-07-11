import React from "@rbxts/react";
import { EnumList } from "@rbxts/ui-labs";
import { DARK_THEME, DEFAULT_THEME, ThemeProvider } from "@prism/theme";

type StoryThemeMode = "light" | "dark";

export const storyThemeControl = EnumList(
	{
		light: "light",
		dark: "dark",
	},
	"light",
);

interface StoryThemeProviderProps {
	readonly mode: StoryThemeMode | string;
	readonly children?: React.ReactNode;
}

export function StoryThemeProvider({ mode, children }: StoryThemeProviderProps): React.ReactElement {
	return <ThemeProvider theme={mode === "dark" ? DARK_THEME : DEFAULT_THEME}>{children}</ThemeProvider>;
}
