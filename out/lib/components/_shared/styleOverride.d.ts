export type StyleOverride<TStyles, TCtx> = (styles: TStyles, ctx: TCtx) => Partial<TStyles>;
export declare function applyStyleOverride<TStyles, TCtx>(styles: TStyles, override: StyleOverride<TStyles, TCtx> | undefined, ctx: TCtx): TStyles;
