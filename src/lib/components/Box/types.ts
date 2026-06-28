import type React from "@rbxts/react";

import type { ConcreteColorValue, ThemeSize } from "@prism/theme";
import type { SizeValue, SizeValue2D } from "@prism/utils";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedSizeConstraint, SharedSpacingValue, SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface BoxSlots {
	readonly root: Frame;
	readonly corner: UICorner;
	readonly stroke: UIStroke;
	readonly padding: UIPadding;
	readonly gradient: UIGradient;
	readonly aspectRatio: UIAspectRatioConstraint;
	readonly sizeConstraint: UISizeConstraint;
}

export type BoxSlotProps = RawSlotProps<BoxSlots>;

export type BoxSpacingValue = SharedSpacingValue;

export type BoxRadiusValue = ThemeSize | number | UDim;

export interface BoxStrokeProps {
	readonly color?: ConcreteColorValue;
	readonly thickness?: number;
	readonly transparency?: number;
	readonly mode?: Enum.ApplyStrokeMode;
}

export interface BoxGradientProps {
	readonly colors: ColorSequence;
	readonly rotation?: number;
	readonly transparency?: NumberSequence;
	readonly offset?: Vector2;
	readonly enabled?: boolean;
}

export interface BoxSizeConstraint extends SharedSizeConstraint {}

export interface BoxStyleProps extends SharedStyleProps {
	readonly border?: number;
	readonly borderColor?: ConcreteColorValue;
	readonly radius?: BoxRadiusValue;
	readonly stroke?: BoxStrokeProps;
	readonly gradient?: BoxGradientProps;
	readonly aspectRatio?: number;
	readonly sizeConstraint?: BoxSizeConstraint;
}

export interface BoxProps extends BoxStyleProps {
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: BoxSlotProps;
	readonly ref?: React.Ref<Frame>;
}
