import type React from "@rbxts/react";

import type { Theme } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { PopoverVisualStyles } from "./styles";

export type { PopoverVisualStyles } from "./styles";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export type PopoverAlign = "start" | "center" | "end";

export type PopoverTriggerMode = "click" | "hover" | "manual";

export type PopoverContent = string | number | React.ReactElement;

export interface PopoverSlots {
	readonly root: Frame;
	readonly sizeConstraint: UISizeConstraint;
	readonly trigger: TextButton;
	readonly overlay: Frame;
	readonly outsideCapture: TextButton;
	readonly panel: TextButton;
	readonly panelCorner: UICorner;
	readonly panelStroke: UIStroke;
	readonly panelPadding: UIPadding;
	readonly content: Frame;
	readonly label: TextLabel;
}

export type PopoverSlotProps = RawSlotProps<PopoverSlots>;

export interface PopoverStyleOverrideContext {
	readonly theme: Theme;
}

export type PopoverStyleOverride = StyleOverride<PopoverVisualStyles, PopoverStyleOverrideContext>;

export interface PopoverStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly content?: PopoverContent;
	readonly placement?: PopoverPlacement;
	readonly align?: PopoverAlign;
	readonly triggerMode?: PopoverTriggerMode;
	/** Seconds to wait before hover-mode opens; leaving before the delay cancels the open. Defaults to 0. */
	readonly openDelay?: number;
	readonly disabled?: boolean;
	readonly opened?: boolean;
	readonly defaultOpened?: boolean;
	readonly closeOnOutsidePress?: boolean;
	readonly gap?: number;
	readonly offset?: Vector2;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 */
	readonly styleOverrides?: PopoverStyleOverride;
}

export interface PopoverProps extends PopoverStyleProps {
	readonly children?: React.ReactNode;
	readonly onOpenedChange?: (opened: boolean) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: PopoverSlotProps;
	readonly ref?: React.Ref<Frame>;
}
