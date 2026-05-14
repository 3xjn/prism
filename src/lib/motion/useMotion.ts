import React from "@rbxts/react";

import { resolveColor, useTheme } from "@prism/theme";
import type { Theme, ThemeMotion, ThemeMotionEasing } from "@prism/theme";

import type {
	MotionDuration,
	MotionEasing,
	MotionInputValue,
	MotionInputValues,
	MotionTransition,
	MotionTransitionMap,
	MotionValue,
	MotionValues,
	ResolvedMotionValues,
	UseMotionOptions,
} from "./types";

const RunService = game.GetService("RunService");
const TweenService = game.GetService("TweenService");

type MotionKey<T extends MotionInputValues> = Extract<keyof T, string>;
type MutableMotionValues = Record<string, MotionValue>;

interface ResolvedMotionTransition {
	readonly duration: number;
	readonly easing: ThemeMotionEasing;
}

type ResolvedMotionTransitionMap<T extends MotionInputValues> = Readonly<Record<MotionKey<T>, ResolvedMotionTransition>>;

interface ActiveMotion<Key extends string> {
	readonly key: Key;
	readonly from: MotionValue;
	readonly to: MotionValue;
	readonly duration: number;
	readonly easing: ThemeMotionEasing;
}

function getSortedRecordKeys(values: Readonly<Record<string, unknown>>): string[] {
	const keys = new Array<string>();

	for (const [key] of pairs(values)) {
		keys.push(key);
	}

	table.sort(keys);
	return keys;
}

function stringifyMotionValue(value: MotionValue): string {
	if (typeIs(value, "number")) {
		return `number:${tostring(value)}`;
	}

	return `color:${tostring(value.R)},${tostring(value.G)},${tostring(value.B)}`;
}

function stringifyMotionEasing(easing: ThemeMotionEasing): string {
	return `${tostring(easing.style)}:${tostring(easing.direction)}`;
}

function createMotionValuesSignature<T extends MotionValues>(values: T): string {
	const parts = new Array<string>();

	for (const key of getSortedRecordKeys(values as MotionValues)) {
		parts.push(`${key}=${stringifyMotionValue((values as MotionValues)[key])}`);
	}

	return parts.join("|");
}

function createResolvedTransitionsSignature<T extends MotionInputValues>(transitions: ResolvedMotionTransitionMap<T>): string {
	const parts = new Array<string>();

	for (const key of getSortedRecordKeys(transitions as Record<string, ResolvedMotionTransition>)) {
		const transition = (transitions as Record<string, ResolvedMotionTransition>)[key];
		parts.push(`${key}=${tostring(transition.duration)}@${stringifyMotionEasing(transition.easing)}`);
	}

	return parts.join("|");
}

function createThemeMotionSignature(themeMotion: ThemeMotion): string {
	return [
		`duration:${tostring(themeMotion.duration.instant)},${tostring(themeMotion.duration.fast)},${tostring(themeMotion.duration.normal)},${tostring(themeMotion.duration.slow)}`,
		`easing:${stringifyMotionEasing(themeMotion.easing.linear)},${stringifyMotionEasing(themeMotion.easing.standard)},${stringifyMotionEasing(themeMotion.easing.out)},${stringifyMotionEasing(themeMotion.easing.in)},${stringifyMotionEasing(themeMotion.easing.inOut)}`,
	].join("|");
}

function resolveMotionValue(theme: Theme, value: MotionInputValue): MotionValue {
	if (typeIs(value, "string")) {
		return resolveColor(theme, value);
	}

	return value;
}

function resolveMotionValues<T extends MotionInputValues>(theme: Theme, values: T): ResolvedMotionValues<T> {
	const nextValues = {} as ResolvedMotionValues<T>;

	for (const [key, value] of pairs(values as MotionInputValues)) {
		(nextValues as unknown as MutableMotionValues)[key] = resolveMotionValue(theme, value);
	}

	return nextValues;
}

function copyMotionValues<T extends MotionValues>(values: T): T {
	const nextValues = {} as T;

	for (const [key, value] of pairs(values as MotionValues)) {
		(nextValues as unknown as MutableMotionValues)[key] = value;
	}

	return nextValues;
}

function areColorValuesEqual(left: Color3, right: Color3): boolean {
	return left.R === right.R && left.G === right.G && left.B === right.B;
}

function areMotionValuesEqual(left: MotionValue, right: MotionValue): boolean {
	if (typeIs(left, "number") && typeIs(right, "number")) {
		return left === right;
	}

	if (typeIs(left, "Color3") && typeIs(right, "Color3")) {
		return areColorValuesEqual(left, right);
	}

	return false;
}

function areMotionValueSetsEqual<T extends MotionValues>(left: T, right: T): boolean {
	for (const [key, value] of pairs(left as MotionValues)) {
		const rightValue = (right as MotionValues)[key];

		if (rightValue === undefined || !areMotionValuesEqual(value, rightValue)) {
			return false;
		}
	}

	for (const [key] of pairs(right as MotionValues)) {
		if ((left as MotionValues)[key] === undefined) {
			return false;
		}
	}

	return true;
}

function areMotionEasingsEqual(left: ThemeMotionEasing, right: ThemeMotionEasing): boolean {
	return left.style === right.style && left.direction === right.direction;
}

function areResolvedMotionTransitionsEqual(
	left: ResolvedMotionTransition,
	right: ResolvedMotionTransition,
): boolean {
	return left.duration === right.duration && areMotionEasingsEqual(left.easing, right.easing);
}

function areResolvedMotionTransitionMapsEqual<T extends MotionInputValues>(
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

function isCompatibleMotionValue(left: MotionValue | undefined, right: MotionValue): left is MotionValue {
	if (left === undefined) {
		return false;
	}

	return (typeIs(left, "number") && typeIs(right, "number")) || (typeIs(left, "Color3") && typeIs(right, "Color3"));
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

function resolveMotionTransitions<T extends MotionInputValues>(
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

function interpolateMotionValue(from: MotionValue, to: MotionValue, alpha: number): MotionValue {
	if (typeIs(from, "number") && typeIs(to, "number")) {
		return from + (to - from) * alpha;
	}

	if (typeIs(from, "Color3") && typeIs(to, "Color3")) {
		return new Color3(from.R + (to.R - from.R) * alpha, from.G + (to.G - from.G) * alpha, from.B + (to.B - from.B) * alpha);
	}

	return to;
}

export function useMotion<T extends MotionInputValues>({ values, transition }: UseMotionOptions<T>): ResolvedMotionValues<T> {
	const theme = useTheme();
	const targetValues = resolveMotionValues(theme, values);
	const resolvedTransitions = resolveMotionTransitions(targetValues, transition, theme.motion);
	const valuesSignature = createMotionValuesSignature(targetValues);
	const transitionsSignature = createResolvedTransitionsSignature(resolvedTransitions);
	const themeMotionSignature = createThemeMotionSignature(theme.motion);
	const [animatedValues, setAnimatedValues] = React.useState<ResolvedMotionValues<T>>(() => copyMotionValues(targetValues));
	const animatedValuesRef = React.useRef<ResolvedMotionValues<T>>(copyMotionValues(targetValues));
	const appliedValuesRef = React.useRef<ResolvedMotionValues<T>>(copyMotionValues(targetValues));
	const appliedTransitionsRef = React.useRef<ResolvedMotionTransitionMap<T>>();
	const animationVersionRef = React.useRef(0);

	React.useEffect(() => {
		if (
			areMotionValueSetsEqual(appliedValuesRef.current, targetValues) &&
			areResolvedMotionTransitionMapsEqual(appliedTransitionsRef.current, resolvedTransitions)
		) {
			return;
		}

		appliedValuesRef.current = copyMotionValues(targetValues);
		appliedTransitionsRef.current = resolvedTransitions;

		const currentValues = animatedValuesRef.current;
		const startingValues = copyMotionValues(targetValues);
		const activeMotions = new Array<ActiveMotion<MotionKey<T>>>();

		for (const [key, targetValue] of pairs(targetValues as MotionValues)) {
			const currentValue = currentValues[key as MotionKey<T>];
			const fromValue = isCompatibleMotionValue(currentValue, targetValue) ? currentValue : targetValue;
			const keyTransition = resolvedTransitions[key as MotionKey<T>];

			if (areMotionValuesEqual(fromValue, targetValue) || keyTransition.duration <= 0) {
				(startingValues as unknown as MutableMotionValues)[key] = targetValue;
				continue;
			}

			(startingValues as unknown as MutableMotionValues)[key] = fromValue;
			activeMotions.push({
				key: key as MotionKey<T>,
				from: fromValue,
				to: targetValue,
				duration: keyTransition.duration,
				easing: keyTransition.easing,
			});
		}

		animatedValuesRef.current = startingValues;
		setAnimatedValues((previous) => (areMotionValueSetsEqual(previous, startingValues) ? previous : startingValues));

		if (activeMotions.size() === 0) {
			const settledValues = copyMotionValues(targetValues);
			animatedValuesRef.current = settledValues;
			setAnimatedValues((previous) => (areMotionValueSetsEqual(previous, settledValues) ? previous : settledValues));
			return;
		}

		const version = animationVersionRef.current + 1;
		animationVersionRef.current = version;
		const startedAt = os.clock();
		const heartbeat = RunService.Heartbeat.Connect(() => {
			if (animationVersionRef.current !== version) {
				heartbeat.Disconnect();
				return;
			}

			const elapsed = os.clock() - startedAt;
			const nextValues = copyMotionValues(targetValues);
			let isComplete = true;

			for (const motion of activeMotions) {
				const alpha = math.clamp(elapsed / motion.duration, 0, 1);
				const easedAlpha = TweenService.GetValue(alpha, motion.easing.style, motion.easing.direction);
				(nextValues as unknown as MutableMotionValues)[motion.key] = interpolateMotionValue(
					motion.from,
					motion.to,
					easedAlpha,
				);

				if (alpha < 1) {
					isComplete = false;
				}
			}

			animatedValuesRef.current = nextValues;
			setAnimatedValues((previous) => (areMotionValueSetsEqual(previous, nextValues) ? previous : nextValues));

			if (isComplete) {
				heartbeat.Disconnect();
			}
		});

		return () => {
			if (animationVersionRef.current === version) {
				animationVersionRef.current = version + 1;
			}

			heartbeat.Disconnect();
		};
	}, [themeMotionSignature, transitionsSignature, valuesSignature]);

	return animatedValues;
}
