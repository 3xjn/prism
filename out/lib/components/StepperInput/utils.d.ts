export interface StepperInputRange {
    readonly min?: number;
    readonly max?: number;
    readonly span?: number;
}
export declare function resolveStepperInputRange(min: number | undefined, max: number | undefined): StepperInputRange;
export declare function resolveValidStepperInputStep(step: number | undefined): number;
export declare function normalizeStepperInputValue(value: number | undefined, range: StepperInputRange, step: number, fallback?: number): number;
export declare function stepStepperInputValue(value: number, direction: -1 | 1, range: StepperInputRange, step: number): number;
export declare function formatStepperInputValue(value: number, formatValue: ((value: number) => string) | undefined): string;
export interface StepperInputRailRange {
    readonly min: number;
    readonly max: number;
    readonly span: number;
}
export declare function resolveStepperInputRailRange(range: StepperInputRange): StepperInputRailRange;
export declare function valueToStepperInputRailAlpha(value: number, range: StepperInputRailRange): number;
export declare function stepperInputRailAlphaToValue(alpha: number, range: StepperInputRailRange, step: number): number;
export declare function resolveStepperInputRailAlphaFromPositionX(rail: GuiObject | undefined, positionX: number): number;
