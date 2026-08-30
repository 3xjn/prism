import type { Theme } from "../../theme/index";
import type { ProgressColor, ProgressRadiusValue, ProgressSize, ProgressVariant } from "./types";
export interface ProgressSizeStyles {
    readonly trackHeight: number;
    readonly defaultWidth: number;
    readonly labelSize: number;
    readonly labelLineHeight: number;
    readonly labelGap: number;
}
export interface ProgressVisualStyles {
    readonly trackColor: Color3;
    readonly trackStrokeColor: Color3;
    readonly trackStrokeTransparency: number;
    readonly fillColor: Color3;
    readonly labelColor: Color3;
    readonly valueLabelColor: Color3;
}
export declare function resolveProgressSizeStyles(theme: Theme, size: ProgressSize): ProgressSizeStyles;
export declare function resolveProgressRadius(theme: Theme, size: ProgressSize, radius: ProgressRadiusValue | undefined): UDim;
export declare function resolveProgressVisualStyles(theme: Theme, variant: ProgressVariant, color: ProgressColor): ProgressVisualStyles;
export declare function resolveProgressMotionTransition(): {
    readonly percent: {
        readonly duration: "normal";
        readonly easing: "out";
    };
};
