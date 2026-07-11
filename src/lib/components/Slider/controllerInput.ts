import React from "@rbxts/react";

import { resolveSliderControllerStep, type SliderStepDirection } from "./utils";

const ContextActionService = game.GetService("ContextActionService");
const GuiService = game.GetService("GuiService");

const CONTROLLER_INPUTS: readonly Enum.KeyCode[] = [
	Enum.KeyCode.Left,
	Enum.KeyCode.Right,
	Enum.KeyCode.DPadLeft,
	Enum.KeyCode.DPadRight,
	Enum.KeyCode.ButtonL1,
	Enum.KeyCode.ButtonR1,
];

let nextControllerActionId = 0;

function createControllerActionName(): string {
	nextControllerActionId += 1;
	return `PrismSliderController${nextControllerActionId}`;
}

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];

interface SliderControllerInputConfig {
	readonly disabled: boolean;
	readonly hitboxInstance: TextButton | undefined;
	readonly commitStep: (direction: SliderStepDirection) => void;
}

interface SliderControllerInputResult {
	readonly selected: boolean;
	readonly event: TextButtonEventMap;
}

export function useSliderControllerInput(config: SliderControllerInputConfig): SliderControllerInputResult {
	const { disabled, hitboxInstance, commitStep } = config;
	const [selected, setSelected] = React.useState(false);
	const actionNameRef = React.useRef<string | undefined>(undefined);
	if (actionNameRef.current === undefined) {
		actionNameRef.current = createControllerActionName();
	}
	const actionName = actionNameRef.current;

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setSelected(false);
	}, [disabled]);

	React.useEffect(() => {
		if (disabled || !selected || hitboxInstance === undefined) {
			return;
		}

		const handleAction = (_boundAction: string, inputState: Enum.UserInputState, input: InputObject) => {
			if (GuiService.SelectedObject !== hitboxInstance) {
				return Enum.ContextActionResult.Pass;
			}

			const direction = resolveSliderControllerStep(input.KeyCode.Name);
			if (direction === undefined) {
				return Enum.ContextActionResult.Pass;
			}

			if (inputState === Enum.UserInputState.Begin) {
				commitStep(direction);
			}
			return Enum.ContextActionResult.Sink;
		};
		ContextActionService.BindActionAtPriority(
			actionName,
			handleAction,
			false,
			Enum.ContextActionPriority.High.Value,
			...CONTROLLER_INPUTS,
		);

		return () => {
			ContextActionService.UnbindAction(actionName);
		};
	}, [actionName, commitStep, disabled, hitboxInstance, selected]);

	const event: TextButtonEventMap = React.useMemo(
		() => ({
			SelectionGained: () => {
				if (disabled) {
					return;
				}

				setSelected(true);
			},
			SelectionLost: () => {
				setSelected(false);
			},
		}),
		[disabled],
	);

	return {
		selected,
		event,
	};
}
