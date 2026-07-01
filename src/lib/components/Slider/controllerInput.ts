import React from "@rbxts/react";

import type { SliderStepDirection } from "./utils";

const GuiService = game.GetService("GuiService");
const UserInputService = game.GetService("UserInputService");

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

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setSelected(false);
	}, [disabled]);

	React.useEffect(() => {
		if (disabled || hitboxInstance === undefined) {
			return;
		}

		const connection = UserInputService.InputBegan.Connect((input) => {
			if (GuiService.SelectedObject !== hitboxInstance) {
				return;
			}

			if (
				input.KeyCode === Enum.KeyCode.Left ||
				input.KeyCode === Enum.KeyCode.DPadLeft ||
				input.KeyCode === Enum.KeyCode.ButtonL1
			) {
				commitStep(-1);
				return;
			}

			if (
				input.KeyCode === Enum.KeyCode.Right ||
				input.KeyCode === Enum.KeyCode.DPadRight ||
				input.KeyCode === Enum.KeyCode.ButtonR1
			) {
				commitStep(1);
			}
		});

		return () => {
			connection.Disconnect();
		};
	}, [commitStep, disabled, hitboxInstance]);

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
