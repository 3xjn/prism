import type React from "@rbxts/react";

import type { BoxStyleProps } from "../Box";
import type { ColorToken, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";

export interface TextSlots {
	readonly root: TextLabel;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly textSizeConstraint: UITextSizeConstraint;
}

export type TextSlotProps = RawSlotProps<TextSlots>;

export type TextAlign = "left" | "center" | "right";

export type TextVerticalAlign = "top" | "middle" | "bottom";

export type TextTruncate = "none" | "atend" | "splitword";

export interface TextStyleProps extends Omit<BoxStyleProps, "border" | "borderColor" | "radius" | "stroke" | "gradient" | "aspectRatio"> {
	readonly size?: ThemeSize | number;
	readonly weight?: number;
	readonly color?: ColorToken | Color3;
	readonly font?: Enum.Font;
	readonly align?: TextAlign;
	readonly valign?: TextVerticalAlign;
	readonly wrap?: boolean;
	readonly truncate?: TextTruncate;
	readonly maxFontSize?: number;
	readonly minFontSize?: number;
}

export interface TextProps extends TextStyleProps {
	readonly text?: string | number;
	readonly children?: string | number;
	readonly Event?: React.InstanceProps<TextLabel>["Event"];
	readonly Change?: React.InstanceProps<TextLabel>["Change"];
	readonly slotProps?: TextSlotProps;
	readonly ref?: React.Ref<TextLabel>;
}
