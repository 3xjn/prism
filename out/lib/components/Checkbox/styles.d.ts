import type { Theme } from "../../theme/index";
import type { InteractionState } from "../_shared/usePressInteraction";
import type { CheckboxColor, CheckboxSize } from "./types";
export type CheckboxInteractionState = InteractionState;
export interface CheckboxSizeStyles {
    readonly markWidth: number;
    readonly markHeight: number;
    readonly glyphSize: number;
    readonly labelGap: number;
    readonly labelSize: number;
    readonly lineHeight: number;
    readonly minHeight: number;
}
export interface CheckboxVisualStyles {
    readonly markColor: Color3;
    readonly markStrokeColor: Color3;
    readonly markStrokeTransparency: number;
    readonly fillColor: Color3;
    readonly fillTransparency: number;
    readonly glyphColor: Color3;
    readonly glyphTransparency: number;
    readonly labelColor: Color3;
}
export declare function resolveCheckboxSizeStyles(theme: Theme, size: CheckboxSize): CheckboxSizeStyles;
export declare function resolveCheckboxVisualStyles(theme: Theme, color: CheckboxColor, state: CheckboxInteractionState, checked: boolean): CheckboxVisualStyles;
export declare function resolveCheckboxMotionTransition(state: CheckboxInteractionState): {
    readonly markColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly markStrokeColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly markStrokeTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly fillColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly fillTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly glyphColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly glyphTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly labelColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
} | {
    readonly markColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly markStrokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly markStrokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly fillColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly fillTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly glyphColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly glyphTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly labelColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
} | {
    readonly markColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly markStrokeColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly markStrokeTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly fillColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly fillTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly glyphColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly glyphTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly labelColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
};
