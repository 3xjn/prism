import type { ThemeMotion, ThemeMotionEasing } from "@prism/theme";

import type { MotionValue, MotionValues } from "./types";

export interface MotionTransitionSignatureValue {
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

export function createMotionValuesSignature<T extends MotionValues>(values: T): string {
	const parts = new Array<string>();

	for (const key of getSortedRecordKeys(values as MotionValues)) {
		parts.push(`${key}=${stringifyMotionValue((values as MotionValues)[key])}`);
	}

	return parts.join("|");
}

export function createMotionTransitionsSignature(transitions: Readonly<Record<string, MotionTransitionSignatureValue>>): string {
	const parts = new Array<string>();

	for (const key of getSortedRecordKeys(transitions)) {
		const transition = transitions[key];

		if (transition !== undefined) {
			parts.push(`${key}=${tostring(transition.duration)}@${stringifyMotionEasing(transition.easing)}`);
		}
	}

	return parts.join("|");
}

export function createThemeMotionSignature(themeMotion: ThemeMotion): string {
	return [
		`duration:${tostring(themeMotion.duration.instant)},${tostring(themeMotion.duration.fast)},${tostring(themeMotion.duration.normal)},${tostring(themeMotion.duration.slow)}`,
		`easing:${stringifyMotionEasing(themeMotion.easing.linear)},${stringifyMotionEasing(themeMotion.easing.standard)},${stringifyMotionEasing(themeMotion.easing.out)},${stringifyMotionEasing(themeMotion.easing.in)},${stringifyMotionEasing(themeMotion.easing.inOut)}`,
	].join("|");
}
