import type { Theme, ThemeSize, Variant } from "../../theme/index";
import type { InteractionState } from "../_shared/usePressInteraction";
import type { ButtonColor, ButtonSize } from "./types";
export type ButtonInteractionState = InteractionState;
export interface ButtonSizeStyles {
    readonly paddingX: ThemeSize;
    readonly paddingY: ThemeSize;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly radius: UDim;
    readonly minHeight: number;
}
export interface ButtonVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly textColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly scale: number;
    readonly shouldRenderStroke: boolean;
}
export declare function resolveButtonSizeStyles(theme: Theme, size: ButtonSize): ButtonSizeStyles;
export declare function resolveButtonContentGap(theme: Theme, size: ButtonSize): number;
export declare function resolveButtonVisualStyles(theme: Theme, variant: Variant, color: ButtonColor, state: ButtonInteractionState): ButtonVisualStyles;
export declare function resolveButtonMotionTransition(state: ButtonInteractionState): {
    readonly backgroundColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly textColor: {
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
    readonly scale: {
        readonly duration: "instant";
        readonly easing: "out";
    };
} | {
    readonly backgroundColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly textColor: {
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
    readonly scale: {
        readonly duration: "fast";
        readonly easing: "out";
    };
} | {
    readonly backgroundColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly textColor: {
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
    readonly scale: {
        readonly duration: "normal";
        readonly easing: "out";
    };
};
