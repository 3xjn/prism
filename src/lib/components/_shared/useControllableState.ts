import React from "@rbxts/react";

export interface ControllableStateOptions<T> {
	/** The controlled value; undefined means uncontrolled. */
	readonly controlled: T | undefined;
	/** Initial value while uncontrolled. */
	readonly defaultValue: T;
	/** Called with the next value on every requested change. */
	readonly onChange?: (value: T) => void;
}

/**
 * Shared controlled/uncontrolled value plumbing. The setter updates
 * internal state only while uncontrolled and always reports the change,
 * so controlled parents keep full ownership.
 */
export function useControllableState<T extends defined>(
	options: ControllableStateOptions<T>,
): [T, (next: T) => void] {
	const { controlled, defaultValue, onChange } = options;
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);

	React.useEffect(() => {
		if (controlled !== undefined) {
			setUncontrolled(controlled);
		}
	}, [controlled]);

	const value = controlled ?? uncontrolled;

	const setValue = (nextValue: T) => {
		if (controlled === undefined) {
			setUncontrolled(nextValue);
		}

		onChange?.(nextValue);
	};

	return [value, setValue];
}
