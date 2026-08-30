import type { Theme, ThemeSize, Variant } from "../../theme/index";
import type { SelectColor, SelectSize } from "./types";
export type SelectTriggerState = "idle" | "hovered" | "pressed" | "open" | "disabled";
export type SelectOptionState = "idle" | "hovered" | "selected" | "disabled";
export interface SelectSizeStyles {
    readonly paddingX: ThemeSize;
    readonly paddingY: ThemeSize;
    readonly optionPaddingX: ThemeSize;
    readonly optionPaddingY: ThemeSize;
    readonly listPadding: ThemeSize;
    readonly listGap: number;
    readonly optionGap: number;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly radius: UDim;
    readonly optionRadius: UDim;
    readonly minHeight: number;
    readonly optionHeight: number;
    readonly defaultWidth: number;
    readonly indicatorSize: number;
    readonly indicatorGap: number;
}
export interface SelectTriggerVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly strokeThickness: number;
    readonly textColor: Color3;
    readonly placeholderColor: Color3;
    readonly indicatorColor: Color3;
    readonly indicatorRotation: number;
}
export interface SelectListVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
}
export interface SelectOptionVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly textColor: Color3;
    readonly textTransparency: number;
}
export declare function resolveSelectSizeStyles(theme: Theme, size: SelectSize): SelectSizeStyles;
export declare function resolveSelectTriggerVisualStyles(theme: Theme, variant: Variant, color: SelectColor, state: SelectTriggerState, hasValue: boolean): SelectTriggerVisualStyles;
export declare function resolveSelectListVisualStyles(theme: Theme, color: SelectColor, variant: Variant): SelectListVisualStyles;
export declare function resolveSelectOptionVisualStyles(theme: Theme, color: SelectColor, state: SelectOptionState): SelectOptionVisualStyles;
export declare function resolveSelectTriggerMotionTransition(state: SelectTriggerState): {
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
    readonly indicatorColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly indicatorRotation: {
        readonly duration: "instant";
        readonly easing: "out";
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
    readonly indicatorColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly indicatorRotation: {
        readonly duration: "fast";
        readonly easing: "out";
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
    readonly indicatorColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly indicatorRotation: {
        readonly duration: "fast";
        readonly easing: "out";
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
    readonly indicatorColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly indicatorRotation: {
        readonly duration: "normal";
        readonly easing: "out";
    };
};
export declare function resolveSelectOptionMotionTransition(state: SelectOptionState): {
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
    readonly textTransparency: {
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
    readonly textColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly textTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
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
    readonly textTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
};
