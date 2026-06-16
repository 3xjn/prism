import type React from "@rbxts/react";

import type { ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface StepperInputSlots {
	readonly root: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly frame: Frame;
	readonly frameCorner: UICorner;
	readonly frameStroke: UIStroke;
	readonly framePadding: UIPadding;
	readonly rail: TextButton;
	readonly railFill: Frame;
	readonly railValue: TextLabel;
	readonly decrement: TextButton;
	readonly decrementText: TextLabel;
	readonly increment: TextButton;
	readonly incrementText: TextLabel;
	readonly buttonCorner: UICorner;
	readonly buttonStroke: UIStroke;
	readonly buttonPadding: UIPadding;
	readonly listLayout: UIListLayout;
}

export type StepperInputSlotProps = RawSlotProps<StepperInputSlots>;

export type StepperInputSize = ThemeSize;

export interface StepperInputStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly size?: StepperInputSize;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly fullWidth?: boolean;
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
}

export interface StepperInputProps extends StepperInputStyleProps {
	readonly value?: number;
	readonly defaultValue?: number;
	readonly onChange?: (value: number) => void;
	readonly onChangeEnd?: (value: number) => void;
	readonly formatValue?: (value: number) => string;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: StepperInputSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
