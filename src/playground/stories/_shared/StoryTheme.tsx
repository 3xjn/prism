import React from "@rbxts/react";
import { EnumList } from "@rbxts/ui-labs";
import { ThemeProvider } from "@prism/theme";
import type { ThemeOverride } from "@prism/theme";

type StoryThemeMode = "light" | "dark";

export const storyThemeControl = EnumList(
	{
		light: "light",
		dark: "dark",
	},
	"light",
);

const DARK_THEME: ThemeOverride = table.freeze({
	colors: table.freeze({
		primary: table.freeze({
			main: Color3.fromRGB(88, 166, 255),
			light: Color3.fromRGB(20, 61, 103),
			dark: Color3.fromRGB(121, 192, 255),
			contrast: Color3.fromRGB(13, 17, 23),
		}),
		secondary: table.freeze({
			main: Color3.fromRGB(188, 140, 255),
			light: Color3.fromRGB(56, 37, 95),
			dark: Color3.fromRGB(210, 168, 255),
			contrast: Color3.fromRGB(13, 17, 23),
		}),
		error: table.freeze({
			main: Color3.fromRGB(248, 81, 73),
			light: Color3.fromRGB(90, 30, 27),
			dark: Color3.fromRGB(255, 161, 152),
			contrast: Color3.fromRGB(13, 17, 23),
		}),
		warning: table.freeze({
			main: Color3.fromRGB(210, 153, 34),
			light: Color3.fromRGB(77, 53, 8),
			dark: Color3.fromRGB(227, 179, 65),
			contrast: Color3.fromRGB(13, 17, 23),
		}),
		info: table.freeze({
			main: Color3.fromRGB(121, 192, 255),
			light: Color3.fromRGB(18, 58, 90),
			dark: Color3.fromRGB(165, 214, 255),
			contrast: Color3.fromRGB(13, 17, 23),
		}),
		success: table.freeze({
			main: Color3.fromRGB(63, 185, 80),
			light: Color3.fromRGB(20, 61, 32),
			dark: Color3.fromRGB(86, 211, 100),
			contrast: Color3.fromRGB(13, 17, 23),
		}),
		text: table.freeze({
			primary: Color3.fromRGB(240, 246, 252),
			secondary: Color3.fromRGB(183, 189, 200),
			disabled: Color3.fromRGB(125, 133, 144),
			inverse: Color3.fromRGB(13, 17, 23),
		}),
		background: table.freeze({
			default: Color3.fromRGB(13, 17, 23),
			surface: Color3.fromRGB(21, 27, 35),
		}),
		border: table.freeze({
			subtle: Color3.fromRGB(47, 55, 66),
			default: Color3.fromRGB(61, 68, 77),
			strong: Color3.fromRGB(125, 133, 144),
		}),
		action: table.freeze({
			hover: Color3.fromRGB(42, 49, 60),
			pressed: Color3.fromRGB(47, 55, 66),
			disabled: Color3.fromRGB(125, 133, 144),
			disabledBackground: Color3.fromRGB(33, 40, 48),
		}),
	}),
	shadows: table.freeze({
		xs: table.freeze({ color: Color3.fromRGB(0, 0, 0), thickness: 1, transparency: 0.72 }),
		sm: table.freeze({ color: Color3.fromRGB(0, 0, 0), thickness: 1, transparency: 0.64 }),
		md: table.freeze({ color: Color3.fromRGB(0, 0, 0), thickness: 2, transparency: 0.58 }),
		lg: table.freeze({ color: Color3.fromRGB(0, 0, 0), thickness: 3, transparency: 0.52 }),
		xl: table.freeze({ color: Color3.fromRGB(0, 0, 0), thickness: 4, transparency: 0.46 }),
	}),
});

function resolveStoryTheme(mode: StoryThemeMode | string): ThemeOverride | undefined {
	return mode === "dark" ? DARK_THEME : undefined;
}

interface StoryThemeProviderProps {
	readonly mode: StoryThemeMode | string;
	readonly children?: React.ReactNode;
}

export function StoryThemeProvider({ mode, children }: StoryThemeProviderProps): React.ReactElement {
	return <ThemeProvider theme={resolveStoryTheme(mode)}>{children}</ThemeProvider>;
}
