import { resolveResponsiveValue } from "./resolve";
import type { ResponsiveTargetOptions, ResponsiveValue } from "./types";
import { useBreakpoint } from "./useBreakpoint";

export function useResponsiveValue<T>(values: ResponsiveValue<T>, options?: ResponsiveTargetOptions): T {
	return resolveResponsiveValue(values, useBreakpoint(options));
}
