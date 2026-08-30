import type { SemanticIntent, Theme, ThemeSize, Variant } from "../../theme/index";
import type { KeybindInputSize } from "./types";
export type KeybindInputInteractionState = "idle" | "hovered" | "pressed" | "capturing" | "disabled" | "readOnly";
export interface KeybindInputSizeStyles {
    readonly paddingX: ThemeSize;
    readonly paddingY: ThemeSize;
    readonly gap: number;
    readonly deviceFrameSize: number;
    readonly deviceIconSize: number;
    readonly gamepadGlyphSize: number;
    readonly keycapPaddingX: number;
    readonly fontSize: number;
    readonly hintFontSize: number;
    readonly lineHeight: number;
    readonly radius: UDim;
    readonly minHeight: number;
    readonly defaultWidth: number;
}
export interface KeybindInputVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly strokeThickness: number;
    readonly labelColor: Color3;
    readonly labelTransparency: number;
    readonly hintColor: Color3;
    readonly hintTransparency: number;
    readonly deviceBackgroundColor: Color3;
    readonly deviceBackgroundTransparency: number;
    readonly deviceIconColor: Color3;
    readonly keycapBackgroundColor: Color3;
    readonly keycapBackgroundTransparency: number;
    readonly keycapStrokeColor: Color3;
    readonly keycapStrokeTransparency: number;
    readonly keycapStrokeThickness: number;
}
export declare function resolveKeybindInputSizeStyles(theme: Theme, size: KeybindInputSize): KeybindInputSizeStyles;
export declare function resolveKeybindInputVisualStyles(theme: Theme, variant: Variant, color: SemanticIntent, state: KeybindInputInteractionState, hasValue: boolean): KeybindInputVisualStyles;
export declare function resolveKeybindInputMotionTransition(state: KeybindInputInteractionState): {
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
    readonly labelColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly hintColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly deviceBackgroundColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly deviceIconColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly keycapBackgroundColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly keycapStrokeColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly keycapStrokeTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly keycapStrokeThickness: {
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
    readonly labelColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly hintColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly deviceBackgroundColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly deviceIconColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly keycapBackgroundColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly keycapStrokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly keycapStrokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly keycapStrokeThickness: {
        readonly duration: "fast";
        readonly easing: "out";
    };
};
