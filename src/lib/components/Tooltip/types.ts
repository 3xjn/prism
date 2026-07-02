import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

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
}

export interface TooltipProps extends TooltipStyleProps {
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: TooltipSlotProps;
	readonly ref?: React.Ref<Frame>;
}
