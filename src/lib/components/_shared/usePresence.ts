import React from "@rbxts/react";

export interface PresenceState {
	readonly shouldRender: boolean;
	readonly present: boolean;
}

export interface UsePresenceOptions {
	readonly exitDuration: number;
}

export function usePresence(present: boolean, options: UsePresenceOptions): PresenceState {
	const [shouldRender, setShouldRender] = React.useState(present);
	const [visualPresent, setVisualPresent] = React.useState(false);

	React.useEffect(() => {
		if (present) {
			setShouldRender(true);
			setVisualPresent(false);

			const openDelay = task.defer(() => {
				setVisualPresent(true);
			});

			return () => {
				task.cancel(openDelay);
			};
		}

		setVisualPresent(false);

		const closeDelay = task.delay(options.exitDuration, () => {
			setShouldRender(false);
		});

		return () => {
			task.cancel(closeDelay);
		};
	}, [options.exitDuration, present]);

	return {
		shouldRender,
		present: visualPresent,
	};
}
