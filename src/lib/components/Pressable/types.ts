import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export type PressableInteractionState = "idle" | "hovered" | "pressed" | "disabled";

export interface PressableRenderState {
	readonly state: PressableInteractionState;
	readonly hovered: boolean;
	readonly pressed: boolean;
	readonly disabled: boolean;
	readonly active: boolean;
}

export interface PressableSlots {
	readonly root: TextButton;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
}

export type PressableSlotProps = RawSlotProps<PressableSlots>;

export interface PressableStyleProps extends SharedStyleProps {
	readonly disabled?: boolean;
	readonly active?: boolean;
}

export interface PressableProps extends PressableStyleProps {
	readonly children?: React.ReactNode;
	readonly render?: (state: PressableRenderState) => React.ReactNode;
	readonly onPress?: () => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: PressableSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
