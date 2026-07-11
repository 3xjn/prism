import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize } from "@prism/theme";

import type { IconName } from "../Icon/types";
import type { RawSlotProps } from "../_shared/slotProps";
import type { SelectionProps } from "../_shared/selection";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { SwitchInteractionState, SwitchVisualStyles } from "./styles";

export type { SwitchVisualStyles } from "./styles";

export interface SwitchSlots {
	readonly root: TextButton;
	readonly padding: UIPadding;
	readonly listLayout: UIListLayout;
	readonly sizeConstraint: UISizeConstraint;
	readonly track: Frame;
	readonly trackCorner: UICorner;
	readonly trackStroke: UIStroke;
	readonly thumb: Frame;
	readonly thumbCorner: UICorner;
	readonly icon: ImageLabel;
	readonly label: TextLabel;
}

export type SwitchSlotProps = RawSlotProps<SwitchSlots>;

export type SwitchSize = ThemeSize;

export type SwitchColor = SemanticIntent;

export interface SwitchIcons {
	readonly unchecked?: IconName;
	readonly checked?: IconName;
	readonly hover?: {
		readonly unchecked?: IconName;
		readonly checked?: IconName;
	};
}

export interface SwitchStyleOverrideContext {
	readonly theme: Theme;
	readonly color: SwitchColor;
	readonly size: SwitchSize;
	readonly state: SwitchInteractionState;
	readonly checked: boolean;
}

export type SwitchStyleOverride = StyleOverride<SwitchVisualStyles, SwitchStyleOverrideContext>;

export interface SwitchStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly color?: SwitchColor;
	readonly size?: SwitchSize;
	readonly disabled?: boolean;
	readonly label?: string | number;
	readonly icons?: SwitchIcons;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 */
	readonly styleOverrides?: SwitchStyleOverride;
}

export interface SwitchProps extends SwitchStyleProps, SelectionProps {
	readonly checked?: boolean;
	readonly defaultChecked?: boolean;
	readonly onChange?: (checked: boolean) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: SwitchSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
