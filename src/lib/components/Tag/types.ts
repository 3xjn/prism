import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface TagSlots {
	readonly root: Frame;
	readonly corner: UICorner;
	readonly stroke: UIStroke;
	readonly padding: UIPadding;
	readonly listLayout: UIListLayout;
	readonly leftSection: Frame;
	readonly label: TextLabel;
	readonly rightSection: Frame;
	readonly sizeConstraint: UISizeConstraint;
}

export type TagSlotProps = RawSlotProps<TagSlots>;

export type TagSize = ThemeSize;

export type TagColor = "neutral" | SemanticIntent;

export type TagVariant = Variant;

export type TagRadiusValue = ThemeSize | number | UDim;

export interface TagStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: TagVariant;
	readonly color?: TagColor;
	readonly size?: TagSize;
	readonly radius?: TagRadiusValue;
	readonly fullWidth?: boolean;
}

export interface TagProps extends TagStyleProps {
	readonly label?: string | number;
	readonly children?: string | number;
	readonly leftSection?: React.ReactNode;
	readonly rightSection?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: TagSlotProps;
	readonly ref?: React.Ref<Frame>;
}
