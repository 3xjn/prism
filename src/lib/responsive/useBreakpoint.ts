import { useTheme } from "@prism/theme";
import type { Breakpoint } from "@prism/theme";

import { resolveBreakpoint } from "./resolve";
import type { ResponsiveTargetOptions } from "./types";
import { useViewportWidth } from "./useViewportWidth";

export function useBreakpoint(options?: ResponsiveTargetOptions): Breakpoint {
	const theme = useTheme();
	const width = useViewportWidth(options?.target);

	return resolveBreakpoint(width, theme.breakpoints);
}
