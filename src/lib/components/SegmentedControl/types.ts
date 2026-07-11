import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type {
	SegmentedControlFrameVisualStyles,
	SegmentedControlIndicatorVisualStyles,
	SegmentedControlSegmentState,
	SegmentedControlSegmentVisualStyles,
} from "./styles";

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

export interface SegmentedControlFrameStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: SegmentedControlColor;
	readonly size: SegmentedControlSize;
	readonly disabled: boolean;
}

export interface SegmentedControlSegmentStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: SegmentedControlColor;
	readonly size: SegmentedControlSize;
	readonly option: SegmentedControlOption;
	readonly state: SegmentedControlSegmentState;
}

export interface SegmentedControlIndicatorStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: SegmentedControlColor;
	readonly size: SegmentedControlSize;
	readonly disabled: boolean;
}

export interface SegmentedControlStyleOverrides {
	readonly frame?: StyleOverride<SegmentedControlFrameVisualStyles, SegmentedControlFrameStyleOverrideContext>;
	readonly segment?: StyleOverride<SegmentedControlSegmentVisualStyles, SegmentedControlSegmentStyleOverrideContext>;
	readonly indicator?: StyleOverride<
		SegmentedControlIndicatorVisualStyles,
		SegmentedControlIndicatorStyleOverrideContext
	>;
}

export interface SegmentedControlStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: SegmentedControlColor;
	readonly size?: SegmentedControlSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 * Callbacks must be pure and inexpensive because they run on every render; the segment callback runs once per rendered segment.
	 */
	readonly styleOverrides?: SegmentedControlStyleOverrides;
}

export interface SegmentedControlProps extends SegmentedControlStyleProps {
	/**
	 * Every enabled segment is a native selection target. Left/Right wraps across enabled
	 * options; ButtonA/Activated commits the focused option while Up/Down can leave the control.
	 */
	readonly options: readonly SegmentedControlOption[];
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (value: string) => void;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: SegmentedControlSlotProps;
	/** Ref ownership stays on the non-interactive root Frame; segment targets remain internal. */
	readonly ref?: React.Ref<Frame>;
}
