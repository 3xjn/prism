export { resolveTextFontFace } from "../_shared/textFont";
export interface SliderRange {
    readonly min: number;
    readonly max: number;
    readonly span: number;
}
export type SliderStepDirection = -1 | 1;
export interface SliderStepValueInput {
    readonly value: number;
    readonly direction: SliderStepDirection;
    readonly range: SliderRange;
    readonly step: number | undefined;
}
export declare function resolveSliderRange(min: number | undefined, max: number | undefined): SliderRange;
export declare function resolveValidStep(step: number | undefined): number | undefined;
export declare function normalizeSliderValue(value: number | undefined, range: SliderRange, step: number | undefined): number;
export declare function valueToAlpha(value: number, range: SliderRange): number;
export declare function alphaToValue(alpha: number, range: SliderRange, step: number | undefined): number;
export declare function stepSliderValue(input: SliderStepValueInput): number;
export declare function resolveAlphaFromPositionX(track: GuiObject | undefined, positionX: number): number;
