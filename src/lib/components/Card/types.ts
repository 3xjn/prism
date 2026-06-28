import type React from "@rbxts/react";

import type { ConcreteColorValue, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedSizeConstraint, SharedSpacingValue, SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface CardSlots {
	readonly root: Frame;
	readonly content: Frame;
	readonly shadow: Frame;
	readonly shadowCorner: UICorner;
	readonly shadowStroke: UIStroke;
	readonly corner: UICorner;
	readonly stroke: UIStroke;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
}

export type CardSlotProps = RawSlotProps<CardSlots>;

export type CardVariant = "surface" | "outline" | "subtle" | "elevated";

export type CardSpacingValue = SharedSpacingValue;

export type CardRadiusValue = ThemeSize | number | UDim;

export type CardShadowValue = ThemeSize | false;

export interface CardStrokeProps {
	readonly color?: ConcreteColorValue;
	readonly thickness?: number;
	readonly transparency?: number;
	readonly mode?: Enum.ApplyStrokeMode;
}

export interface CardSizeConstraint extends SharedSizeConstraint {}

export interface CardStyleProps extends SharedStyleProps {
	readonly variant?: CardVariant;
	readonly border?: number;
	readonly borderColor?: ConcreteColorValue;
	readonly radius?: CardRadiusValue;
	readonly shadow?: CardShadowValue;
	readonly stroke?: CardStrokeProps;
}

export interface CardProps extends CardStyleProps {
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: CardSlotProps;
	readonly ref?: React.Ref<Frame>;
}
