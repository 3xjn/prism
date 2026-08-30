import type { ThemeMotion, ThemeMotionEasing } from "../theme/index";
import type { MotionValues } from "./types";
export interface MotionTransitionSignatureValue {
    readonly duration: number;
    readonly easing: ThemeMotionEasing;
}
export declare function createMotionValuesSignature<T extends MotionValues>(values: T): string;
export declare function createMotionTransitionsSignature(transitions: Readonly<Record<string, MotionTransitionSignatureValue>>): string;
export declare function createThemeMotionSignature(themeMotion: ThemeMotion): string;
