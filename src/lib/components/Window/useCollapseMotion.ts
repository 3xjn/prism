import React from "@rbxts/react";

import type { ThemeMotionEasing } from "@prism/theme";

import { areWindowBoundsEqual, interpolateWindowBounds, type WindowBounds } from "./utils";

const RunService = game.GetService("RunService");
const TweenService = game.GetService("TweenService");

export interface UseWindowCollapseMotionOptions {
	readonly collapsed: boolean;
	readonly targetBounds: WindowBounds;
	readonly duration: number;
	readonly easing: ThemeMotionEasing;
}

export interface UseWindowCollapseMotionResult {
	readonly displayBounds: WindowBounds;
	readonly showCollapseControl: boolean;
	readonly tweening: boolean;
	readonly cancelTween: () => void;
}

export function useWindowCollapseMotion(options: UseWindowCollapseMotionOptions): UseWindowCollapseMotionResult {
	const { collapsed, targetBounds, duration, easing } = options;
	const [displayBounds, setDisplayBounds] = React.useState(targetBounds);
	const [showCollapseControl, setShowCollapseControl] = React.useState(collapsed);
	const [tweening, setTweening] = React.useState(false);
	const displayBoundsRef = React.useRef(targetBounds);
	const targetBoundsRef = React.useRef(targetBounds);
	const collapsedRef = React.useRef(collapsed);
	const appliedCollapsedRef = React.useRef(collapsed);
	const tweeningRef = React.useRef(false);
	const versionRef = React.useRef(0);
	const connectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const durationRef = React.useRef(duration);
	const easingRef = React.useRef(easing);

	targetBoundsRef.current = targetBounds;
	collapsedRef.current = collapsed;
	durationRef.current = duration;
	easingRef.current = easing;

	const stopTweenConnection = React.useCallback(() => {
		versionRef.current += 1;
		connectionRef.current?.Disconnect();
		connectionRef.current = undefined;
		tweeningRef.current = false;
		setTweening(false);
	}, []);

	const cancelTween = React.useCallback(() => {
		stopTweenConnection();
		const target = targetBoundsRef.current;
		displayBoundsRef.current = target;
		setDisplayBounds((current) => (areWindowBoundsEqual(current, target) ? current : target));
		setShowCollapseControl(collapsedRef.current);
	}, [stopTweenConnection]);

	const startTween = React.useCallback(
		(from: WindowBounds, to: WindowBounds, collapsing: boolean) => {
			stopTweenConnection();
			setShowCollapseControl(false);

			const motionDuration = durationRef.current;
			const motionEasing = easingRef.current;

			if (motionDuration <= 0 || areWindowBoundsEqual(from, to)) {
				displayBoundsRef.current = to;
				setDisplayBounds((current) => (areWindowBoundsEqual(current, to) ? current : to));
				setShowCollapseControl(collapsing);
				return;
			}

			const version = versionRef.current;
			const startedAt = os.clock();
			tweeningRef.current = true;
			setTweening(true);
			displayBoundsRef.current = from;
			setDisplayBounds((current) => (areWindowBoundsEqual(current, from) ? current : from));

			connectionRef.current = RunService.Heartbeat.Connect(() => {
				if (versionRef.current !== version) {
					connectionRef.current?.Disconnect();
					connectionRef.current = undefined;
					return;
				}

				const alpha = math.clamp((os.clock() - startedAt) / motionDuration, 0, 1);
				const easedAlpha = TweenService.GetValue(alpha, motionEasing.style, motionEasing.direction);
				const nextBounds = interpolateWindowBounds(from, to, easedAlpha);
				displayBoundsRef.current = nextBounds;
				setDisplayBounds((current) => (areWindowBoundsEqual(current, nextBounds) ? current : nextBounds));

				if (alpha >= 1) {
					connectionRef.current?.Disconnect();
					connectionRef.current = undefined;
					tweeningRef.current = false;
					setTweening(false);
					setShowCollapseControl(collapsing);
				}
			});
		},
		[stopTweenConnection],
	);

	React.useEffect(() => {
		const nextTarget = targetBoundsRef.current;
		const collapsedChanged = appliedCollapsedRef.current !== collapsed;
		appliedCollapsedRef.current = collapsed;

		if (collapsedChanged) {
			startTween(displayBoundsRef.current, nextTarget, collapsed);
			return;
		}

		if (!tweeningRef.current && !areWindowBoundsEqual(displayBoundsRef.current, nextTarget)) {
			displayBoundsRef.current = nextTarget;
			setDisplayBounds((current) => (areWindowBoundsEqual(current, nextTarget) ? current : nextTarget));
		}
	}, [collapsed, startTween, targetBounds.height, targetBounds.width, targetBounds.x, targetBounds.y]);

	React.useEffect(() => {
		return () => {
			versionRef.current += 1;
			connectionRef.current?.Disconnect();
			connectionRef.current = undefined;
		};
	}, []);

	return {
		displayBounds,
		showCollapseControl,
		tweening,
		cancelTween,
	};
}
