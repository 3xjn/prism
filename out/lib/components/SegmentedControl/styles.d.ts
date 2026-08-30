import type { Theme, ThemeSize, Variant } from "../../theme/index";
import type { SegmentedControlColor, SegmentedControlSize } from "./types";
export type SegmentedControlSegmentState = "idle" | "hovered" | "pressed" | "selected" | "disabled";
export interface SegmentedControlSizeStyles {
    readonly padding: ThemeSize;
    readonly gap: number;
    readonly segmentPaddingX: ThemeSize;
    readonly segmentPaddingY: ThemeSize;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly radius: UDim;
    readonly segmentRadius: UDim;
    readonly minHeight: number;
    readonly defaultWidth: number;
}
export interface SegmentedControlFrameVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
}
export interface SegmentedControlSegmentVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly textColor: Color3;
    readonly textTransparency: number;
}
export interface SegmentedControlIndicatorVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
}
export declare function resolveSegmentedControlSizeStyles(theme: Theme, size: SegmentedControlSize): SegmentedControlSizeStyles;
export declare function resolveSegmentedControlFrameVisualStyles(theme: Theme, variant: Variant, color: SegmentedControlColor, disabled: boolean): SegmentedControlFrameVisualStyles;
export declare function resolveSegmentedControlSegmentVisualStyles(theme: Theme, variant: Variant, color: SegmentedControlColor, state: SegmentedControlSegmentState): SegmentedControlSegmentVisualStyles;
export declare function resolveSegmentedControlIndicatorVisualStyles(theme: Theme, variant: Variant, color: SegmentedControlColor, disabled: boolean): SegmentedControlIndicatorVisualStyles;
export declare function resolveSegmentedControlIndicatorMotionTransition(): {
    readonly selectedIndex: {
        readonly duration: "normal";
        readonly easing: "out";
    };
    readonly backgroundColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly strokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly strokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
};
export declare function resolveSegmentedControlSegmentMotionTransition(state: SegmentedControlSegmentState): {
    readonly backgroundColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly strokeColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly strokeTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly textTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
} | {
    readonly backgroundColor: {
        readonly duration: "fast" | "normal";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "fast" | "normal";
        readonly easing: "standard";
    };
    readonly strokeColor: {
        readonly duration: "fast" | "normal";
        readonly easing: "standard";
    };
    readonly strokeTransparency: {
        readonly duration: "fast" | "normal";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly textTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
};
