import type { Theme, Variant } from "../../theme/index";
import type { InputColor } from "./types";
export type InputInteractionState = "idle" | "hovered" | "focused" | "disabled";
export interface InputVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly strokeThickness: number;
    readonly textColor: Color3;
    readonly placeholderColor: Color3;
}
export declare function resolveInputVisualStyles(theme: Theme, variant: Variant, color: InputColor, state: InputInteractionState, readOnly: boolean): InputVisualStyles;
export declare function resolveInputMotionTransition(state: InputInteractionState): {
    readonly backgroundColor: {
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
    readonly strokeThickness: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly placeholderColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
} | {
    readonly backgroundColor: {
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
    readonly strokeThickness: {
        readonly duration: "fast";
        readonly easing: "out";
    };
    readonly textColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly placeholderColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
} | {
    readonly backgroundColor: {
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
    readonly strokeThickness: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly placeholderColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
} | {
    readonly backgroundColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly strokeColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly strokeTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly strokeThickness: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly placeholderColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
};
