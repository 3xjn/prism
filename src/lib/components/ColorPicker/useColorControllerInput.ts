import React from "@rbxts/react";

import {
	resolveColorFieldControllerStep,
	resolveColorHueControllerStep,
	type ColorControllerDirection,
	type ColorFieldControllerChannel,
} from "./utils";

const ContextActionService = game.GetService("ContextActionService");
const GuiService = game.GetService("GuiService");

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];

const HORIZONTAL_INPUTS: readonly Enum.KeyCode[] = [
	Enum.KeyCode.Left,
	Enum.KeyCode.Right,
	Enum.KeyCode.DPadLeft,
	Enum.KeyCode.DPadRight,
];
const FIELD_INPUTS: readonly Enum.KeyCode[] = [...HORIZONTAL_INPUTS, Enum.KeyCode.ButtonL1, Enum.KeyCode.ButtonR1];

let nextControllerActionId = 0;

function createControllerActionName(): string {
	nextControllerActionId += 1;
	return `PrismColorPickerController${nextControllerActionId}`;
}

interface UseColorControllerInputOptions {
	readonly disabled: boolean;
	readonly fieldHitboxInstance: TextButton | undefined;
	readonly hueHitboxInstance: TextButton | undefined;
	readonly commitFieldStep: (channel: ColorFieldControllerChannel, direction: ColorControllerDirection) => void;
	readonly commitHueStep: (direction: ColorControllerDirection) => void;
}

interface ColorControllerInputResult {
	readonly fieldSelected: boolean;
	readonly hueSelected: boolean;
	readonly fieldEvent: TextButtonEventMap;
	readonly hueEvent: TextButtonEventMap;
}

export function useColorControllerInput({
	disabled,
	fieldHitboxInstance,
	hueHitboxInstance,
	commitFieldStep,
	commitHueStep,
}: UseColorControllerInputOptions): ColorControllerInputResult {
	const [fieldSelected, setFieldSelected] = React.useState(false);
	const [hueSelected, setHueSelected] = React.useState(false);
	const actionNameRef = React.useRef<string | undefined>(undefined);
	if (actionNameRef.current === undefined) {
		actionNameRef.current = createControllerActionName();
	}
	const actionName = actionNameRef.current;

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setFieldSelected(false);
		setHueSelected(false);
	}, [disabled]);

	React.useEffect(() => {
		const selectedInstance = fieldSelected ? fieldHitboxInstance : hueSelected ? hueHitboxInstance : undefined;
		if (disabled || selectedInstance === undefined) {
			return;
		}

		const handleAction = (_boundAction: string, inputState: Enum.UserInputState, input: InputObject) => {
			if (GuiService.SelectedObject !== selectedInstance) {
				return Enum.ContextActionResult.Pass;
			}

			if (fieldSelected) {
				const step = resolveColorFieldControllerStep(input.KeyCode.Name);
				if (step === undefined) {
					return Enum.ContextActionResult.Pass;
				}

				if (inputState === Enum.UserInputState.Begin) {
					commitFieldStep(step.channel, step.direction);
				}
				return Enum.ContextActionResult.Sink;
			}

			const direction = resolveColorHueControllerStep(input.KeyCode.Name);
			if (direction === undefined) {
				return Enum.ContextActionResult.Pass;
			}

			if (inputState === Enum.UserInputState.Begin) {
				commitHueStep(direction);
			}
			return Enum.ContextActionResult.Sink;
		};
		const inputTypes = fieldSelected ? FIELD_INPUTS : HORIZONTAL_INPUTS;
		ContextActionService.BindActionAtPriority(
			actionName,
			handleAction,
			false,
			Enum.ContextActionPriority.High.Value,
			...inputTypes,
		);

		return () => {
			ContextActionService.UnbindAction(actionName);
		};
	}, [
		actionName,
		commitFieldStep,
		commitHueStep,
		disabled,
		fieldHitboxInstance,
		fieldSelected,
		hueHitboxInstance,
		hueSelected,
	]);

	const fieldEvent: TextButtonEventMap = React.useMemo(
		() => ({
			SelectionGained: () => {
				if (!disabled) {
					setFieldSelected(true);
					setHueSelected(false);
				}
			},
			SelectionLost: () => {
				setFieldSelected(false);
			},
		}),
		[disabled],
	);
	const hueEvent: TextButtonEventMap = React.useMemo(
		() => ({
			SelectionGained: () => {
				if (!disabled) {
					setHueSelected(true);
					setFieldSelected(false);
				}
			},
			SelectionLost: () => {
				setHueSelected(false);
			},
		}),
		[disabled],
	);

	return { fieldSelected, hueSelected, fieldEvent, hueEvent };
}
