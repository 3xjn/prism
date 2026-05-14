import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface ButtonSlots {
	readonly root: TextButton;
	readonly corner: UICorner;
	readonly stroke: UIStroke;
	readonly padding: UIPadding;
	readonly scale: UIScale;
	readonly sizeConstraint: UISizeConstraint;
}

export type ButtonSlotProps = RawSlotProps<ButtonSlots>;

export type ButtonSize = ThemeSize;

export type ButtonColor = SemanticIntent;

export interface ButtonStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: ButtonColor;
	readonly size?: ButtonSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
}

export interface ButtonProps extends ButtonStyleProps {
	readonly label?: string | number;
	readonly children?: React.ReactNode | string | number;
	readonly onPress?: () => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: ButtonSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
