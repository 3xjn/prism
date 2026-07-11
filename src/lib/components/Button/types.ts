import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SelectionProps } from "../_shared/selection";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { ButtonInteractionState, ButtonVisualStyles } from "./styles";

export type { ButtonVisualStyles } from "./styles";

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

export interface ButtonStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: ButtonColor;
	readonly size: ButtonSize;
	readonly state: ButtonInteractionState;
}

export type ButtonStyleOverride = StyleOverride<ButtonVisualStyles, ButtonStyleOverrideContext>;

export interface ButtonStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: ButtonColor;
	readonly size?: ButtonSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 */
	readonly styleOverrides?: ButtonStyleOverride;
}

export interface ButtonProps extends ButtonStyleProps, SelectionProps {
	readonly label?: string | number;
	readonly children?: React.ReactNode | string | number;
	readonly onPress?: () => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: ButtonSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
