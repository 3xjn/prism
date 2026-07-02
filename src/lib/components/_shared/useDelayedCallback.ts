import React from "@rbxts/react";

export interface DelayedCallbackHandle {
	/** Schedule callback after delaySeconds, replacing any pending schedule. Runs immediately when the delay is zero or negative. */
	readonly schedule: (delaySeconds: number, callback: () => void) => void;
	/** Cancel the pending schedule, if any. */
	readonly cancel: () => void;
}

/**
 * Shared delayed-invoke plumbing for hover-intent style interactions
 * (tooltip open delays and similar). The pending thread is cancelled on
 * re-schedule, on cancel, and on unmount.
 */
export function useDelayedCallback(): DelayedCallbackHandle {
	const pendingThreadRef = React.useRef<thread | undefined>(undefined);

	const cancel = React.useCallback(() => {
		const pending = pendingThreadRef.current;
		pendingThreadRef.current = undefined;
		if (pending !== undefined) {
			task.cancel(pending);
		}
	}, []);

	const schedule = React.useCallback(
		(delaySeconds: number, callback: () => void) => {
			cancel();

			if (delaySeconds <= 0) {
				callback();
				return;
			}

			pendingThreadRef.current = task.delay(delaySeconds, () => {
				pendingThreadRef.current = undefined;
				callback();
			});
		},
		[cancel],
	);

	React.useEffect(() => {
		return cancel;
	}, [cancel]);

	return { schedule, cancel };
}
