import type { Breakpoint } from "@prism/theme";

export type ResponsiveValue<T> = Readonly<{ readonly xs: T } & Partial<Readonly<Record<Exclude<Breakpoint, "xs">, T>>>>;

export interface ResponsiveTargetOptions {
	readonly target?: GuiBase2d;
}
