import type { Theme } from "../../theme/index";
export interface WindowSizeStyles {
    readonly titleBarHeight: number;
    readonly titlePaddingX: number;
    readonly titleGap: number;
    readonly titleSize: number;
    readonly titleLineHeight: number;
    readonly controlSize: number;
    readonly iconSize: number;
    readonly radius: UDim;
    readonly viewportMargin: number;
    readonly resizeHandleSize: number;
    readonly collapseControlSize: number;
    readonly bodyPadding: number;
    readonly railMinWidth: number;
}
export declare function resolveWindowSizeStyles(theme: Theme): WindowSizeStyles;
