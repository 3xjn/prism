export type StyleOverride<TStyles, TCtx> = (styles: TStyles, ctx: TCtx) => Partial<TStyles>;

export function applyStyleOverride<TStyles, TCtx>(styles: TStyles, override: StyleOverride<TStyles, TCtx> | undefined, ctx: TCtx): TStyles {
	return override ? { ...styles, ...override(styles, ctx) } : styles;
}
