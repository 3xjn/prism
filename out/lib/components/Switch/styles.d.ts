import type { Theme } from "../../theme/index";
import type { InteractionState } from "../_shared/usePressInteraction";
import type { SwitchColor, SwitchSize } from "./types";
export type SwitchInteractionState = InteractionState;
export interface SwitchSizeStyles {
    readonly trackWidth: number;
    readonly trackHeight: number;
    readonly thumbDiameter: number;
    readonly thumbInset: number;
    readonly iconSize: number;
    readonly labelGap: number;
    readonly labelSize: number;
    readonly lineHeight: number;
    readonly minHeight: number;
}
export interface SwitchVisualStyles {
    readonly trackColor: Color3;
    readonly trackStrokeColor: Color3;
    readonly trackStrokeTransparency: number;
    readonly thumbColor: Color3;
    readonly thumbStrokeColor: Color3;
    readonly thumbStrokeTransparency: number;
    readonly thumbOffset: number;
    readonly iconColor: Color3;
    readonly iconTransparency: number;
    readonly labelColor: Color3;
}
export declare function resolveSwitchSizeStyles(theme: Theme, size: SwitchSize): SwitchSizeStyles;
export declare function resolveSwitchVisualStyles(theme: Theme, color: SwitchColor, state: SwitchInteractionState, checked: boolean, sizeStyles: SwitchSizeStyles): SwitchVisualStyles;
export declare function resolveSwitchMotionTransition(state: SwitchInteractionState): {
    readonly trackColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly trackStrokeColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly trackStrokeTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly thumbColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly thumbStrokeColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly thumbStrokeTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly thumbOffset: {
        readonly duration: "instant";
        readonly easing: "out";
    };
    readonly iconColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly iconTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly labelColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
} | {
    readonly trackColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly trackStrokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly trackStrokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbStrokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbStrokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbOffset: {
        readonly duration: "fast";
        readonly easing: "out";
    };
    readonly iconColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly iconTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly labelColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
} | {
    readonly trackColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly trackStrokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly trackStrokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbStrokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbStrokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly thumbOffset: {
        readonly duration: "normal";
        readonly easing: "out";
    };
    readonly iconColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly iconTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly labelColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
} | {
    readonly trackColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly trackStrokeColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly trackStrokeTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly thumbColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly thumbStrokeColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly thumbStrokeTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly thumbOffset: {
        readonly duration: "normal";
        readonly easing: "out";
    };
    readonly iconColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly iconTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly labelColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
};
