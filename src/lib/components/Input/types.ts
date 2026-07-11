import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SelectionProps } from "../_shared/selection";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { InputInteractionState, InputVisualStyles } from "./styles";

export type { InputVisualStyles } from "./styles";

export interface InputSlots {
	readonly root: Frame;
	readonly textbox: TextBox;
	readonly corner: UICorner;
	readonly stroke: UIStroke;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
}

export type InputSlotProps = RawSlotProps<InputSlots>;

export type InputSize = ThemeSize;

export type InputColor = SemanticIntent;

export interface InputStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: InputColor;
	readonly size: InputSize;
	readonly readOnly: boolean;
	readonly state: InputInteractionState;
}

export type InputStyleOverride = StyleOverride<InputVisualStyles, InputStyleOverrideContext>;

export interface InputStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: InputColor;
	readonly size?: InputSize;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly fullWidth?: boolean;
	readonly placeholder?: string;
	readonly maxLength?: number;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 */
	readonly styleOverrides?: InputStyleOverride;
}

export interface InputProps extends InputStyleProps, SelectionProps {
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (value: string) => void;
	readonly Event?: React.InstanceProps<TextBox>["Event"];
	readonly Change?: React.InstanceProps<TextBox>["Change"];
	readonly slotProps?: InputSlotProps;
	readonly ref?: React.Ref<TextBox>;
}
