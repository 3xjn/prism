import type React from "@rbxts/react";

import type { Theme } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { TooltipVisualStyles } from "./styles";

export type { TooltipVisualStyles } from "./styles";

export interface TooltipSlots {
	readonly root: Frame;
	readonly sizeConstraint: UISizeConstraint;
	readonly overlay: Frame;
	readonly bubble: Frame;
	readonly bubbleCorner: UICorner;
	readonly bubbleStroke: UIStroke;
	readonly bubblePadding: UIPadding;
	readonly label: TextLabel;
	readonly tail: ImageLabel;
	readonly tailBorder: ImageLabel;
}

export type TooltipSlotProps = RawSlotProps<TooltipSlots>;

export type TooltipPlacement = "top";

export type TooltipContent = string | number | React.ReactElement;

export interface TooltipStyleOverrideContext {
	readonly theme: Theme;
}

export type TooltipStyleOverride = StyleOverride<TooltipVisualStyles, TooltipStyleOverrideContext>;

export interface TooltipStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly label?: string | number;
	readonly content?: TooltipContent;
	readonly placement?: TooltipPlacement;
	readonly disabled?: boolean;
	readonly opened?: boolean;
	/** Seconds to wait before the hover tooltip opens; leaving before the delay cancels the open. Defaults to 0.35. */
	readonly openDelay?: number;
	readonly gap?: number;
	readonly tailImage?: string;
	readonly tailBorderImage?: string;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 */
	readonly styleOverrides?: TooltipStyleOverride;
}

export interface TooltipProps extends TooltipStyleProps {
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: TooltipSlotProps;
	readonly ref?: React.Ref<Frame>;
}
