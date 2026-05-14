import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface ProgressSlots {
	readonly root: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly header: Frame;
	readonly label: TextLabel;
	readonly valueLabel: TextLabel;
	readonly track: Frame;
	readonly trackCorner: UICorner;
	readonly trackStroke: UIStroke;
	readonly fill: Frame;
	readonly fillCorner: UICorner;
}

export type ProgressSlotProps = RawSlotProps<ProgressSlots>;

export type ProgressSize = ThemeSize;

export type ProgressColor = SemanticIntent;

export type ProgressVariant = Variant;

export type ProgressRadiusValue = ThemeSize | number | UDim;

export interface ProgressStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: ProgressVariant;
	readonly color?: ProgressColor;
	readonly size?: ProgressSize;
	readonly radius?: ProgressRadiusValue;
	readonly fullWidth?: boolean;
	readonly label?: string | number;
	readonly showValue?: boolean;
}

export interface ProgressProps extends ProgressStyleProps {
	readonly value?: number;
	readonly min?: number;
	readonly max?: number;
	readonly formatValue?: (value: number, percent: number) => string;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: ProgressSlotProps;
	readonly ref?: React.Ref<Frame>;
}
