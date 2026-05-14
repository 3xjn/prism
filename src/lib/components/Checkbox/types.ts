import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface CheckboxSlots {
	readonly root: TextButton;
	readonly padding: UIPadding;
	readonly listLayout: UIListLayout;
	readonly sizeConstraint: UISizeConstraint;
	readonly mark: Frame;
	readonly markCorner: UICorner;
	readonly markStroke: UIStroke;
	readonly fill: Frame;
	readonly fillCorner: UICorner;
	readonly glyph: ImageLabel;
	readonly label: TextLabel;
}

export type CheckboxSlotProps = RawSlotProps<CheckboxSlots>;

export type CheckboxSize = ThemeSize;

export type CheckboxColor = SemanticIntent;

export interface CheckboxStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly color?: CheckboxColor;
	readonly size?: CheckboxSize;
	readonly disabled?: boolean;
	readonly label?: string | number;
}

export interface CheckboxProps extends CheckboxStyleProps {
	readonly checked?: boolean;
	readonly defaultChecked?: boolean;
	readonly onChange?: (checked: boolean) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: CheckboxSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
