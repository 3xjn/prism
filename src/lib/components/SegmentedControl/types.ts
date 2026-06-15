import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface SegmentedControlOption {
	readonly value: string;
	readonly label: string;
	readonly disabled?: boolean;
}

export interface SegmentedControlSlots {
	readonly root: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly frame: Frame;
	readonly frameCorner: UICorner;
	readonly frameStroke: UIStroke;
	readonly framePadding: UIPadding;
	readonly listLayout: UIListLayout;
	readonly segment: TextButton;
	readonly segmentCorner: UICorner;
	readonly segmentStroke: UIStroke;
	readonly segmentPadding: UIPadding;
	readonly segmentText: TextLabel;
}

export type SegmentedControlSlotProps = RawSlotProps<SegmentedControlSlots>;

export type SegmentedControlSize = ThemeSize;

export type SegmentedControlColor = SemanticIntent;

export interface SegmentedControlStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: SegmentedControlColor;
	readonly size?: SegmentedControlSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
}

export interface SegmentedControlProps extends SegmentedControlStyleProps {
	readonly options: readonly SegmentedControlOption[];
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (value: string) => void;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: SegmentedControlSlotProps;
	readonly ref?: React.Ref<Frame>;
}
