import React from "@rbxts/react";

export interface ControllableStateOptions<T> {
	/** The controlled value; undefined means uncontrolled. */
	readonly controlled: T | undefined;
	/** Initial value while uncontrolled. */
	readonly defaultValue: T;
	/** Called with the next value when a change is requested and the value differs. */
	readonly onChange?: (value: T) => void;
}

/**
 * Shared controlled/uncontrolled value plumbing. The setter updates
 * internal state only while uncontrolled and reports the change to
 * onChange, so controlled parents keep full ownership. Requests that
 * match the current value are ignored. Switching from controlled back
 * to uncontrolled resumes from the internal (initially defaultValue)
 * state; components should not switch modes after mount.
 */
export function useControllableState<T extends defined>(
	options: ControllableStateOptions<T>,
): [T, (nextValue: T) => void] {
	const { controlled, defaultValue, onChange } = options;
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);

	const value = controlled ?? uncontrolled;

	const setValue = (nextValue: T) => {
		if (nextValue === value) {
			return;
		}

		if (controlled === undefined) {
			setUncontrolled(nextValue);
		}

		onChange?.(nextValue);
	};

	return [value, setValue];
}
