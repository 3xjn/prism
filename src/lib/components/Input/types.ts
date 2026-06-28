import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

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

export interface InputStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: InputColor;
	readonly size?: InputSize;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly fullWidth?: boolean;
	readonly placeholder?: string;
	readonly maxLength?: number;
}

export interface InputProps extends InputStyleProps {
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (value: string) => void;
	readonly Event?: React.InstanceProps<TextBox>["Event"];
	readonly Change?: React.InstanceProps<TextBox>["Change"];
	readonly slotProps?: InputSlotProps;
	readonly ref?: React.Ref<TextBox>;
}
