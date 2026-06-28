import React from "@rbxts/react";

import { resolveColor, useTheme } from "@prism/theme";
import type { Theme, ThemeMotionEasing } from "@prism/theme";

import {
	createMotionTransitionsSignature,
	createMotionValuesSignature,
	createThemeMotionSignature,
} from "./signatures";
import {
	areResolvedMotionTransitionMapsEqual,
	resolveMotionTransitions,
} from "./transitions";
import type { ResolvedMotionTransition, ResolvedMotionTransitionMap } from "./transitions";

import type {
	MotionInputValue,
	MotionInputValues,
	MotionValue,
	MotionValues,
	ResolvedMotionValues,
	UseMotionOptions,
} from "./types";

const RunService = game.GetService("RunService");
const TweenService = game.GetService("TweenService");

type MotionKey<T extends MotionInputValues> = Extract<keyof T, string>;
type MutableMotionValues = Record<string, MotionValue>;

interface ActiveMotion<Key extends string> {
	readonly key: Key;
	readonly from: MotionValue;
	readonly to: MotionValue;
	readonly duration: number;
	readonly easing: ThemeMotionEasing;
}

function resolveMotionValue(theme: Theme, value: MotionInputValue): MotionValue {
	if (typeIs(value, "number")) {
		return value;
	}

	return resolveColor(theme, value);
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

function isCompatibleMotionValue(left: MotionValue | undefined, right: MotionValue): left is MotionValue {
	if (left === undefined) {
		return false;
	}

	return (typeIs(left, "number") && typeIs(right, "number")) || (typeIs(left, "Color3") && typeIs(right, "Color3"));
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
	const transitionsSignature = createMotionTransitionsSignature(resolvedTransitions);
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
