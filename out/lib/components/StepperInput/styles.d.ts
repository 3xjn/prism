import type { Theme, ThemeSize, Variant } from "../../theme/index";
import type { StepperInputSize } from "./types";
export type StepperInputFrameState = "idle" | "hovered" | "focused" | "disabled";
export type StepperInputButtonState = "idle" | "hovered" | "pressed" | "disabled";
export interface StepperInputSizeStyles {
    readonly padding: ThemeSize;
    readonly gap: number;
    readonly buttonWidth: number;
    readonly buttonPaddingX: ThemeSize;
    readonly buttonPaddingY: ThemeSize;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly radius: UDim;
    readonly buttonRadius: UDim;
    readonly minHeight: number;
    readonly defaultWidth: number;
}
export interface StepperInputFrameVisualStyles {
    readonly backgroundColor: Color3;
    readonly inputBackgroundColor: Color3;
    readonly inputBackgroundTransparency: number;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly strokeThickness: number;
    readonly textColor: Color3;
    readonly placeholderColor: Color3;
    readonly railFillColor: Color3;
    readonly railFillTransparency: number;
}
export interface StepperInputButtonVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly textColor: Color3;
}
export declare function resolveStepperInputSizeStyles(theme: Theme, size: StepperInputSize): StepperInputSizeStyles;
export declare function resolveStepperInputFrameVisualStyles(theme: Theme, variant: Variant, state: StepperInputFrameState, readOnly: boolean): StepperInputFrameVisualStyles;
export declare function resolveStepperInputButtonVisualStyles(theme: Theme, variant: Variant, state: StepperInputButtonState): StepperInputButtonVisualStyles;
export declare function resolveStepperInputFrameMotionTransition(state: StepperInputFrameState): {
    readonly backgroundColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly inputBackgroundColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly inputBackgroundTransparency: {
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
    readonly railFillColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly railFillTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
} | {
    readonly backgroundColor: {
        readonly duration: "fast" | "normal";
        readonly easing: "standard";
    };
    readonly inputBackgroundColor: {
        readonly duration: "fast" | "normal";
        readonly easing: "standard";
    };
    readonly inputBackgroundTransparency: {
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
    readonly strokeThickness: {
        readonly duration: "fast" | "normal";
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
    readonly railFillColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly railFillTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
};
export declare function resolveStepperInputButtonMotionTransition(state: StepperInputButtonState): {
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
} | {
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
    readonly textColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
};
