import type { Theme } from "../../theme/index";
import type { CircularProgressColor, CircularProgressSize, CircularProgressVariant } from "./types";
export interface CircularProgressSizeStyles {
    readonly diameter: number;
    readonly thickness: number;
    readonly segmentLength: number;
    readonly labelSize: number;
    readonly valueLabelSize: number;
    readonly lineHeight: number;
}
export interface CircularProgressVisualStyles {
    readonly trackColor: Color3;
    readonly trackTransparency: number;
    readonly fillColor: Color3;
    readonly fillTailColor: Color3;
    readonly labelColor: Color3;
    readonly valueLabelColor: Color3;
}
export declare function resolveCircularProgressSizeStyles(theme: Theme, size: CircularProgressSize): CircularProgressSizeStyles;
export declare function resolveCircularProgressVisualStyles(theme: Theme, variant: CircularProgressVariant, color: CircularProgressColor): CircularProgressVisualStyles;
export declare function resolveCircularProgressMotionTransition(): {
    readonly percent: {
        readonly duration: "normal";
        readonly easing: "out";
    };
};
