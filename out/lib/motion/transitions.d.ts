import type { ThemeMotion, ThemeMotionEasing } from "../theme/index";
import type { MotionInputValues, ResolvedMotionValues, UseMotionOptions } from "./types";
type MotionKey<T extends MotionInputValues> = Extract<keyof T, string>;
export interface ResolvedMotionTransition {
    readonly duration: number;
    readonly easing: ThemeMotionEasing;
}
export type ResolvedMotionTransitionMap<T extends MotionInputValues> = Readonly<Record<MotionKey<T>, ResolvedMotionTransition>>;
export declare function areResolvedMotionTransitionMapsEqual<T extends MotionInputValues>(left: ResolvedMotionTransitionMap<T> | undefined, right: ResolvedMotionTransitionMap<T>): boolean;
export declare function resolveMotionTransitions<T extends MotionInputValues>(values: ResolvedMotionValues<T>, transition: UseMotionOptions<T>["transition"], themeMotion: ThemeMotion): ResolvedMotionTransitionMap<T>;
export {};
