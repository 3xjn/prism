import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

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

export interface SelectStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: SelectColor;
	readonly size?: SelectSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
	readonly placeholder?: string;
}

export interface SelectProps extends SelectStyleProps {
	readonly options: readonly SelectOption[];
	readonly selected?: string;
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (value: string) => void;
	readonly maxVisibleOptions?: number;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: SelectSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
