import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type {
	SelectListVisualStyles,
	SelectOptionState,
	SelectOptionVisualStyles,
	SelectTriggerState,
	SelectTriggerVisualStyles,
} from "./styles";

export interface SelectOption {
	readonly value: string;
	readonly label: string;
	readonly disabled?: boolean;
}

export interface SelectSlots {
	readonly root: Frame;
	readonly rootLayout: UIListLayout;
	readonly sizeConstraint: UISizeConstraint;
	readonly trigger: TextButton;
	readonly triggerCorner: UICorner;
	readonly triggerStroke: UIStroke;
	readonly triggerPadding: UIPadding;
	readonly triggerText: TextLabel;
	readonly indicator: ImageLabel;
	readonly overlay: Frame;
	readonly outsideCapture: TextButton;
	readonly list: Frame;
	readonly listCorner: UICorner;
	readonly listStroke: UIStroke;
	readonly listViewport: ScrollingFrame;
	readonly listPadding: UIPadding;
	readonly optionsLayout: UIListLayout;
	readonly option: TextButton;
	readonly optionCorner: UICorner;
	readonly optionPadding: UIPadding;
	readonly optionText: TextLabel;
}

export type SelectSlotProps = RawSlotProps<SelectSlots>;

export type SelectSize = ThemeSize;

export type SelectColor = SemanticIntent;

export interface SelectTriggerStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: SelectColor;
	readonly size: SelectSize;
	readonly state: SelectTriggerState;
	readonly hasValue: boolean;
}

export interface SelectListStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: SelectColor;
	readonly size: SelectSize;
}

export interface SelectOptionStyleOverrideContext {
	readonly theme: Theme;
	readonly color: SelectColor;
	readonly size: SelectSize;
	readonly option: SelectOption;
	readonly state: SelectOptionState;
}

export interface SelectStyleOverrides {
	readonly trigger?: StyleOverride<SelectTriggerVisualStyles, SelectTriggerStyleOverrideContext>;
	readonly list?: StyleOverride<SelectListVisualStyles, SelectListStyleOverrideContext>;
	readonly option?: StyleOverride<SelectOptionVisualStyles, SelectOptionStyleOverrideContext>;
}

export interface SelectStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: SelectColor;
	readonly size?: SelectSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
	readonly placeholder?: string;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 * Callbacks must be pure and inexpensive because they run on every render; the option callback runs once per rendered option row.
	 */
	readonly styleOverrides?: SelectStyleOverrides;
}

export interface SelectProps extends SelectStyleProps {
	readonly options: readonly SelectOption[];
	readonly selected?: string;
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (value: string) => void;
	readonly maxVisibleOptions?: number;
	/** Close the dropdown when a mouse or touch press lands outside the list. Defaults to true. */
	readonly closeOnOutsidePress?: boolean;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: SelectSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
