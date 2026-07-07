import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { CircularProgressVisualStyles } from "./styles";

export type { CircularProgressVisualStyles } from "./styles";

export type CircularProgressMode = "determinate" | "indeterminate";

export type CircularProgressCap = "round" | "butt";

export type CircularProgressSize = ThemeSize;

export type CircularProgressColor = SemanticIntent;

export type CircularProgressVariant = Variant;

export interface CircularProgressSlots {
	readonly root: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly aspectRatio: UIAspectRatioConstraint;
	readonly trackGroup: Frame;
	readonly trackSegment: Frame;
	readonly fillGroup: Frame;
	readonly fillSegment: Frame;
	readonly center: Frame;
	readonly label: TextLabel;
	readonly valueLabel: TextLabel;
}

export type CircularProgressSlotProps = RawSlotProps<CircularProgressSlots>;

export interface CircularProgressStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: CircularProgressVariant;
	readonly color: CircularProgressColor;
	readonly size: CircularProgressSize;
}

export type CircularProgressStyleOverride = StyleOverride<CircularProgressVisualStyles, CircularProgressStyleOverrideContext>;

export interface CircularProgressStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly mode?: CircularProgressMode;
	readonly variant?: CircularProgressVariant;
	readonly color?: CircularProgressColor;
	readonly size?: CircularProgressSize;
	readonly cap?: CircularProgressCap;
	readonly label?: string | number;
	readonly showValue?: boolean;
	readonly startAngle?: number;
	readonly disableAnimation?: boolean;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 */
	readonly styleOverrides?: CircularProgressStyleOverride;
}

export interface CircularProgressProps extends CircularProgressStyleProps {
	readonly value?: number;
	readonly min?: number;
	readonly max?: number;
	readonly formatValue?: (value: number, percent: number) => string;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: CircularProgressSlotProps;
	readonly ref?: React.Ref<Frame>;
}
