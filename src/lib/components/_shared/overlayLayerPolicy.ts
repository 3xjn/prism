import type React from "@rbxts/react";

export type GuiZIndex = React.InstanceProps<Frame>["ZIndex"];

export const DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX = 10;
export const CAPTURE_OVERLAY_Z_INDEX = 10_000;

export function incrementZIndex(zIndex: GuiZIndex | undefined, amount = 1): GuiZIndex | undefined {
	return typeOf(zIndex) === "number" ? ((zIndex as number) + amount) : zIndex;
}
