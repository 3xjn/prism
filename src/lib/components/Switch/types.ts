import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize } from "@prism/theme";

import type { IconName } from "../Icon/types";
import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

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

export interface SwitchStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly color?: SwitchColor;
	readonly size?: SwitchSize;
	readonly disabled?: boolean;
	readonly label?: string | number;
	readonly icons?: SwitchIcons;
}

export interface SwitchProps extends SwitchStyleProps {
	readonly checked?: boolean;
	readonly defaultChecked?: boolean;
	readonly onChange?: (checked: boolean) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: SwitchSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
