import type {
	ColorToken,
	MotionDurationToken,
	MotionEasingToken,
	ThemeMotion,
	ThemeMotionEasing,
} from "@prism/theme";

export type MotionDuration = number | MotionDurationToken;

export type MotionEasing = MotionEasingToken | ThemeMotionEasing;

export type MotionInputValue = number | Color3 | ColorToken;

export type MotionValue = number | Color3;

export type MotionInputValues = Readonly<Record<string, MotionInputValue>>;

export type MotionValues = Readonly<Record<string, MotionValue>>;

export type ResolvedMotionValues<T extends MotionInputValues> = Readonly<{
	[K in keyof T]: T[K] extends number ? number : Color3;
}>;

export interface MotionTransition {
	readonly duration?: MotionDuration;
	readonly easing?: MotionEasing;
}

export type MotionTransitionMap<T extends MotionInputValues> = Readonly<Partial<Record<keyof T, MotionTransition>>>;

export interface UseMotionOptions<T extends MotionInputValues> {
	readonly values: T;
	readonly transition?: MotionTransition | MotionTransitionMap<T>;
}

export type { ColorToken, MotionDurationToken, MotionEasingToken, ThemeMotion, ThemeMotionEasing };
