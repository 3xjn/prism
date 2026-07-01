import React from "@rbxts/react";

import { isPressInput } from "./interaction";

export type InteractionState = "idle" | "hovered" | "pressed" | "disabled";

export type PressInteractionEventMap = React.InstanceProps<GuiButton>["Event"];

export interface PressInteractionOptions {
	/** When false, hover/press state resets and input is ignored. */
	readonly interactive: boolean;
	/** Called on Activated while interactive. */
	readonly onActivated?: () => void;
}

export interface PressInteraction {
	readonly hovered: boolean;
	readonly pressed: boolean;
	readonly state: InteractionState;
	/** Compose into the root's Event map via composeEventMaps. */
	readonly eventMap: PressInteractionEventMap;
}

export function resolveInteractionState(disabled: boolean, hovered: boolean, pressed: boolean): InteractionState {
	if (disabled) {
		return "disabled";
	}

	if (pressed) {
		return "pressed";
	}

	if (hovered) {
		return "hovered";
	}

	return "idle";
}

/**
 * Shared hover/press state machine for interactive roots. Owns the
 * hovered/pressed useState pair, resets both while non-interactive, and
 * returns the Event handlers that drive them.
 */
export function usePressInteraction(options: PressInteractionOptions): PressInteraction {
	const { interactive, onActivated } = options;
	const [hovered, setHovered] = React.useState(false);
	const [pressed, setPressed] = React.useState(false);

	React.useEffect(() => {
		if (interactive) {
			return;
		}

		setHovered(false);
		setPressed(false);
	}, [interactive]);

	const eventMap: PressInteractionEventMap = {
		MouseEnter: () => {
			if (!interactive) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			setHovered(false);
			setPressed(false);
		},
		InputBegan: (_rbx, input) => {
			if (!interactive || !isPressInput(input)) {
				return;
			}

			setPressed(true);
		},
		InputEnded: (_rbx, input) => {
			if (!isPressInput(input)) {
				return;
			}

			setPressed(false);
		},
		Activated: () => {
			if (!interactive) {
				return;
			}

			onActivated?.();
		},
	};

	const effectiveHovered = interactive && hovered;
	const effectivePressed = interactive && pressed;

	return {
		hovered: effectiveHovered,
		pressed: effectivePressed,
		state: resolveInteractionState(!interactive, effectiveHovered, effectivePressed),
		eventMap,
	};
}
