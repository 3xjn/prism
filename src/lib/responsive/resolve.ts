import type { Breakpoint, ThemeBreakpoints } from "@prism/theme";

import type { ResponsiveValue } from "./types";

const BREAKPOINT_ORDER = ["xs", "sm", "md", "lg", "xl"] as const;

function isFiniteWidth(width: number): boolean {
	return width === width && width !== math.huge && width !== -math.huge;
}

export function resolveBreakpoint(width: number, breakpoints: ThemeBreakpoints): Breakpoint {
	const resolvedWidth = isFiniteWidth(width) ? math.max(width, breakpoints.xs) : breakpoints.xs;

	for (let index = 4; index >= 0; index -= 1) {
		const breakpoint = BREAKPOINT_ORDER[index] as Breakpoint;
		if (resolvedWidth >= breakpoints[breakpoint]) {
			return breakpoint;
		}
	}

	return "xs";
}

export function resolveResponsiveValue<T>(values: ResponsiveValue<T>, breakpoint: Breakpoint): T {
	const activeIndex = BREAKPOINT_ORDER.indexOf(breakpoint);
	for (let index = activeIndex; index >= 0; index -= 1) {
		const candidate = BREAKPOINT_ORDER[index];
		const value = candidate === undefined ? undefined : values[candidate];
		if (value !== undefined) {
			return value;
		}
	}

	return values.xs;
}
