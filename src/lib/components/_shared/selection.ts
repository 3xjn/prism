import type React from "@rbxts/react";

/** Roblox-native directional selection properties for a single interactive control. */
export interface SelectionProps {
	readonly selectable?: boolean;
	readonly selectionOrder?: number;
	readonly nextSelectionUp?: GuiObject;
	readonly nextSelectionDown?: GuiObject;
	readonly nextSelectionLeft?: GuiObject;
	readonly nextSelectionRight?: GuiObject;
}

/** Roblox-native selection-group properties for a layout container. */
export interface SelectionGroupProps {
	readonly selectionGroup?: boolean;
	readonly selectionBehaviorUp?: Enum.SelectionBehavior;
	readonly selectionBehaviorDown?: Enum.SelectionBehavior;
	readonly selectionBehaviorLeft?: Enum.SelectionBehavior;
	readonly selectionBehaviorRight?: Enum.SelectionBehavior;
}

type NativeSelectionProperties = Pick<
	React.InstanceProps<GuiObject>,
	"Selectable" | "SelectionOrder" | "NextSelectionUp" | "NextSelectionDown" | "NextSelectionLeft" | "NextSelectionRight"
>;

type NativeSelectionGroupProperties = Pick<
	React.InstanceProps<GuiObject>,
	"SelectionGroup" | "SelectionBehaviorUp" | "SelectionBehaviorDown" | "SelectionBehaviorLeft" | "SelectionBehaviorRight"
>;

/** @internal Maps Prism control props to the real native interactive instance. */
export function resolveSelectionProps(props: SelectionProps, managedSelectable = true): NativeSelectionProperties {
	return {
		Selectable: managedSelectable && (props.selectable ?? true),
		SelectionOrder: props.selectionOrder,
		NextSelectionUp: props.nextSelectionUp,
		NextSelectionDown: props.nextSelectionDown,
		NextSelectionLeft: props.nextSelectionLeft,
		NextSelectionRight: props.nextSelectionRight,
	};
}

/** @internal Maps Prism layout props to the real native container instance. */
export function resolveSelectionGroupProps(props: SelectionGroupProps): NativeSelectionGroupProperties {
	return {
		SelectionGroup: props.selectionGroup,
		SelectionBehaviorUp: props.selectionBehaviorUp,
		SelectionBehaviorDown: props.selectionBehaviorDown,
		SelectionBehaviorLeft: props.selectionBehaviorLeft,
		SelectionBehaviorRight: props.selectionBehaviorRight,
	};
}
