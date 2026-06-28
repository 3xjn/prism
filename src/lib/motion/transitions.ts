import type { ThemeMotion, ThemeMotionEasing } from "@prism/theme";

import type {
	MotionDuration,
	MotionEasing,
	MotionInputValues,
	MotionTransition,
	MotionTransitionMap,
	MotionValues,
	ResolvedMotionValues,
	UseMotionOptions,
} from "./types";

type MotionKey<T extends MotionInputValues> = Extract<keyof T, string>;

export interface ResolvedMotionTransition {
	readonly duration: number;
	readonly easing: ThemeMotionEasing;
}

export type ResolvedMotionTransitionMap<T extends MotionInputValues> = Readonly<Record<MotionKey<T>, ResolvedMotionTransition>>;

function areMotionEasingsEqual(left: ThemeMotionEasing, right: ThemeMotionEasing): boolean {
	return left.style === right.style && left.direction === right.direction;
}

function areResolvedMotionTransitionsEqual(
	left: ResolvedMotionTransition,
	right: ResolvedMotionTransition,
): boolean {
	return left.duration === right.duration && areMotionEasingsEqual(left.easing, right.easing);
}

export function areResolvedMotionTransitionMapsEqual<T extends MotionInputValues>(
	left: ResolvedMotionTransitionMap<T> | undefined,
	right: ResolvedMotionTransitionMap<T>,
): boolean {
	if (left === undefined) {
		return false;
	}

	for (const [key, transition] of pairs(left as Record<string, ResolvedMotionTransition>)) {
		const rightTransition = (right as Record<string, ResolvedMotionTransition>)[key];

		if (rightTransition === undefined || !areResolvedMotionTransitionsEqual(transition, rightTransition)) {
			return false;
		}
	}

	for (const [key] of pairs(right as Record<string, ResolvedMotionTransition>)) {
		if ((left as Record<string, ResolvedMotionTransition>)[key] === undefined) {
			return false;
		}
	}

	return true;
}

function isMotionTransition(value: unknown): value is MotionTransition {
	if (!typeIs(value, "table")) {
		return false;
	}

	const transition = value as { readonly duration?: unknown; readonly easing?: unknown };

	if (transition.duration !== undefined && (typeIs(transition.duration, "number") || typeIs(transition.duration, "string"))) {
		return true;
	}

	if (transition.easing === undefined) {
		return false;
	}

	if (typeIs(transition.easing, "string")) {
		return true;
	}

	if (!typeIs(transition.easing, "table")) {
		return false;
	}

	const easing = transition.easing as { readonly style?: unknown; readonly direction?: unknown };
	return easing.style !== undefined || easing.direction !== undefined;
}

function resolveMotionDuration(themeMotion: ThemeMotion, duration: MotionDuration | undefined): number {
	if (duration === undefined) {
		return themeMotion.duration.normal;
	}

	return math.max(typeIs(duration, "number") ? duration : themeMotion.duration[duration], 0);
}

function resolveMotionEasing(themeMotion: ThemeMotion, easing: MotionEasing | undefined): ThemeMotionEasing {
	if (easing === undefined) {
		return themeMotion.easing.standard;
	}

	return typeIs(easing, "string") ? themeMotion.easing[easing] : easing;
}

export function resolveMotionTransitions<T extends MotionInputValues>(
	values: ResolvedMotionValues<T>,
	transition: UseMotionOptions<T>["transition"],
	themeMotion: ThemeMotion,
): ResolvedMotionTransitionMap<T> {
	const sharedTransition = isMotionTransition(transition) ? transition : undefined;
	const transitionMap = sharedTransition === undefined ? (transition as MotionTransitionMap<T> | undefined) : undefined;
	const resolvedTransitions = {} as Record<MotionKey<T>, ResolvedMotionTransition>;

	for (const [key] of pairs(values as MotionValues)) {
		const keyTransition = transitionMap?.[key as MotionKey<T>] ?? sharedTransition;
		resolvedTransitions[key as MotionKey<T>] = {
			duration: resolveMotionDuration(themeMotion, keyTransition?.duration),
			easing: resolveMotionEasing(themeMotion, keyTransition?.easing),
		};
	}

	return resolvedTransitions;
}
