import React from "@rbxts/react";
import type { AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, theme as themeRefs, ThemeProvider } from "@prism/theme";
import type { Theme, ThemeOverride } from "@prism/theme";

const lightTheme: Theme = DEFAULT_THEME;
const darkTheme: Theme = DEFAULT_DARK_THEME;
const darkThemeAsOverride: ThemeOverride = DEFAULT_DARK_THEME;

const acceptsDarkThemeProvider = <ThemeProvider theme={DEFAULT_DARK_THEME} />;
const acceptsLightThemeProvider = <ThemeProvider theme={DEFAULT_THEME} />;
const acceptsCompactDensity = <ThemeProvider density="compact" />;
const acceptsDarkCompactThemeProvider = <ThemeProvider theme={DEFAULT_DARK_THEME} density="compact" />;
const acceptsRaisedRef = themeRefs.background.raised;

type DarkThemeIsTheme = AssertTrue<IsAssignable<typeof DEFAULT_DARK_THEME, Theme>>;
type DarkThemeIsOverride = AssertTrue<IsAssignable<typeof DEFAULT_DARK_THEME, ThemeOverride>>;
type BackgroundHasRaised = AssertTrue<HasProp<Theme["colors"]["background"], "raised">>;
type ThemeHasDensity = AssertTrue<HasProp<Theme, "density">>;

const darkThemeIsTheme: DarkThemeIsTheme = true;
const darkThemeIsOverride: DarkThemeIsOverride = true;
const backgroundHasRaised: BackgroundHasRaised = true;
const themeHasDensity: ThemeHasDensity = true;

export {
	acceptsCompactDensity,
	acceptsDarkCompactThemeProvider,
	acceptsDarkThemeProvider,
	acceptsLightThemeProvider,
	acceptsRaisedRef,
	backgroundHasRaised,
	darkTheme,
	darkThemeAsOverride,
	darkThemeIsOverride,
	darkThemeIsTheme,
	lightTheme,
	themeHasDensity,
};
