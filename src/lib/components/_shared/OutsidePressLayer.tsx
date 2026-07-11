import React from "@rbxts/react";

import { isPressInput } from "./interaction";
import {
	isPointInsideOutsidePressExclusions,
	type OutsidePressExcludeRect,
} from "./outsidePress";
import type { GuiZIndex } from "./overlayLayerPolicy";

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type TextButtonInputBeganEvent = NonNullable<TextButtonEventMap>["InputBegan"];
type TextButtonInputBeganArgs = Parameters<NonNullable<TextButtonInputBeganEvent>>;
type TextButtonActivatedEvent = NonNullable<TextButtonEventMap>["Activated"];
type TextButtonActivatedArgs = Parameters<NonNullable<TextButtonActivatedEvent>>;

export interface OutsidePressLayerProps {
	readonly active?: boolean;
	readonly excludeRect?: OutsidePressExcludeRect;
	readonly excludeInstances?: readonly GuiObject[];
	readonly zIndex?: GuiZIndex;
	readonly onOutsidePress: () => void;
	readonly slotProps?: Partial<React.InstanceProps<TextButton>>;
}

function findInputObject(args: readonly unknown[]): InputObject | undefined {
	for (const value of args) {
		if (typeIs(value, "Instance") && value.IsA("InputObject")) {
			return value;
		}
	}

	return undefined;
}

function findTextButton(args: readonly unknown[]): TextButton | undefined {
	for (const value of args) {
		if (typeIs(value, "Instance") && value.IsA("TextButton")) {
			return value;
		}
	}

	return undefined;
}

export function OutsidePressLayer({
	active = true,
	excludeRect,
	excludeInstances,
	zIndex,
	onOutsidePress,
	slotProps,
}: OutsidePressLayerProps): React.ReactElement | undefined {
	const ignoreNextActivatedRef = React.useRef(false);
	const externalEvent = slotProps?.Event;
	const externalInputBegan = externalEvent?.InputBegan;
	const externalActivated = externalEvent?.Activated;

	if (!active) {
		return undefined;
	}

	const handleInputBegan = (...args: TextButtonInputBeganArgs) => {
		externalInputBegan?.(...args);

		const root = findTextButton(args);
		const input = findInputObject(args);
		if (root === undefined || input === undefined || !isPressInput(input)) {
			ignoreNextActivatedRef.current = false;
			return;
		}

		const point = new Vector2(input.Position.X, input.Position.Y);
		ignoreNextActivatedRef.current = isPointInsideOutsidePressExclusions(
			root,
			point,
			excludeRect,
			excludeInstances,
		);
	};
	const handleActivated = (...args: TextButtonActivatedArgs) => {
		if (ignoreNextActivatedRef.current) {
			ignoreNextActivatedRef.current = false;
			return;
		}

		externalActivated?.(...args);
		onOutsidePress();
	};
	const event: TextButtonEventMap = {
		...externalEvent,
		InputBegan: handleInputBegan,
		Activated: handleActivated,
	};

	return (
		<textbutton
			{...slotProps}
			AutoButtonColor={false}
			Active={true}
			Selectable={false}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={UDim2.fromScale(1, 1)}
			Text=""
			TextTransparency={1}
			TextStrokeTransparency={1}
			ZIndex={zIndex}
			Event={event}
		/>
	);
}
