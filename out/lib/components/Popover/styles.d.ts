import type { Theme, ThemeShadow } from "../../theme/index";
export interface PopoverSizeStyles {
    readonly radius: UDim;
    readonly paddingX: number;
    readonly paddingY: number;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly gap: number;
}
export interface PopoverVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly strokeThickness: number;
    readonly textColor: Color3;
    readonly shadow: ThemeShadow;
}
export declare function resolvePopoverSizeStyles(theme: Theme, gap: number | undefined): PopoverSizeStyles;
export declare function resolvePopoverVisualStyles(theme: Theme): PopoverVisualStyles;
