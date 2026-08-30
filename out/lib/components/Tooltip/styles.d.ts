import type { Theme, ThemeShadow } from "../../theme/index";
export interface TooltipSizeStyles {
    readonly paddingX: number;
    readonly paddingY: number;
    readonly radius: UDim;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly tailWidth: number;
    readonly tailHeight: number;
    readonly triggerMinimumSize: number;
    readonly gap: number;
}
export interface TooltipVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly textColor: Color3;
    readonly tailFillColor: Color3;
    readonly tailBorderColor: Color3;
    readonly tailBorderTransparency: number;
    readonly shadow: ThemeShadow;
}
export declare function resolveTooltipSizeStyles(theme: Theme, gap: number | undefined): TooltipSizeStyles;
export declare function resolveTooltipVisualStyles(theme: Theme): TooltipVisualStyles;
