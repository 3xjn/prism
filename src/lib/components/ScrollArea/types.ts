import type React from "@rbxts/react";

import type { ConcreteColorValue } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export type ScrollAreaDirection = "vertical" | "horizontal" | "both";

export type ScrollAreaScrollbarColorValue = ConcreteColorValue;

export interface ScrollAreaSlots {
	readonly root: ScrollingFrame;
	readonly content: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
}

export type ScrollAreaSlotProps = RawSlotProps<ScrollAreaSlots>;

export interface ScrollAreaStyleProps extends Omit<SharedStyleProps, "clip"> {
	readonly direction?: ScrollAreaDirection;
	readonly scrollbarSize?: number;
	readonly scrollbarColor?: ScrollAreaScrollbarColorValue;
	readonly scrollbarTransparency?: number;
	readonly canvasSize?: UDim2;
	readonly canvasPosition?: Vector2;
	readonly automaticCanvasSize?: Enum.AutomaticSize;
	readonly scrollingEnabled?: boolean;
}

export interface ScrollAreaProps extends ScrollAreaStyleProps {
	readonly children?: React.ReactNode;
	readonly onCanvasPositionChange?: (position: Vector2) => void;
	readonly Event?: React.InstanceProps<ScrollingFrame>["Event"];
	readonly Change?: React.InstanceProps<ScrollingFrame>["Change"];
	readonly slotProps?: ScrollAreaSlotProps;
	readonly ref?: React.Ref<ScrollingFrame>;
}
