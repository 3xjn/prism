import type { MotionInputValues, ResolvedMotionValues, UseMotionOptions } from "./types";
export declare function useMotion<T extends MotionInputValues>({ values, transition }: UseMotionOptions<T>): ResolvedMotionValues<T>;
