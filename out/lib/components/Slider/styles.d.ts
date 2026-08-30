import type { Theme } from "../../theme/index";
import type { SliderColor, SliderSize } from "./types";
export type SliderInteractionState = "idle" | "hovered" | "pressed" | "disabled";
export interface SliderSizeStyles {
    readonly trackHeight: number;
    readonly thumbDiameter: number;
    readonly minHeight: number;
    readonly defaultWidth: number;
    readonly labelSize: number;
    readonly labelLineHeight: number;
}
export interface SliderVisualStyles {
    readonly trackColor: Color3;
    readonly trackStrokeColor: Color3;
    readonly trackStrokeTransparency: number;
    readonly rangeColor: Color3;
    readonly thumbColor: Color3;
    readonly thumbStrokeColor: Color3;
    readonly thumbStrokeTransparency: number;
    readonly labelColor: Color3;
    readonly valueLabelColor: Color3;
}
export declare function resolveSliderSizeStyles(theme: Theme, size: SliderSize): SliderSizeStyles;
export declare function resolveSliderVisualStyles(theme: Theme, color: SliderColor, state: SliderInteractionState): SliderVisualStyles;
