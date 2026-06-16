import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

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

export interface PopoverStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly content?: PopoverContent;
	readonly placement?: PopoverPlacement;
	readonly align?: PopoverAlign;
	readonly triggerMode?: PopoverTriggerMode;
	readonly disabled?: boolean;
	readonly opened?: boolean;
	readonly defaultOpened?: boolean;
	readonly closeOnOutsidePress?: boolean;
	readonly gap?: number;
	readonly offset?: Vector2;
}

export interface PopoverProps extends PopoverStyleProps {
	readonly children?: React.ReactNode;
	readonly onOpenedChange?: (opened: boolean) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: PopoverSlotProps;
	readonly ref?: React.Ref<Frame>;
}
