import type React from "@rbxts/react";

import type { Theme, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type {
	StepperInputButtonState,
	StepperInputButtonVisualStyles,
	StepperInputFrameState,
	StepperInputFrameVisualStyles,
} from "./styles";

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

export interface StepperInputFrameStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly size: StepperInputSize;
	readonly state: StepperInputFrameState;
	readonly readOnly: boolean;
}

export interface StepperInputButtonStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly size: StepperInputSize;
	readonly state: StepperInputButtonState;
	readonly control: "decrement" | "increment";
}

export interface StepperInputStyleOverrides {
	readonly frame?: StyleOverride<StepperInputFrameVisualStyles, StepperInputFrameStyleOverrideContext>;
	readonly button?: StyleOverride<StepperInputButtonVisualStyles, StepperInputButtonStyleOverrideContext>;
}

export interface StepperInputStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly size?: StepperInputSize;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly fullWidth?: boolean;
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 * Callbacks must be pure and inexpensive because they run on every render; the button callback runs once per stepper button (decrement and increment).
	 */
	readonly styleOverrides?: StepperInputStyleOverrides;
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
