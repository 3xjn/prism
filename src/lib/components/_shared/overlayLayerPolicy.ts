import type React from "@rbxts/react";

export type GuiZIndex = React.InstanceProps<Frame>["ZIndex"];

export const DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX = 10;
/** Passive status surfaces above ordinary screen overlays while remaining below drag and capture layers. */
export const DEFAULT_NOTIFICATION_OVERLAY_Z_INDEX = 100;
/** Component-local drag overlays (e.g. Draggable's floating item) — above sibling content, below capture overlays. */
export const DRAG_OVERLAY_Z_INDEX = 1_000;
export const CAPTURE_OVERLAY_Z_INDEX = 10_000;

export function incrementZIndex(zIndex: GuiZIndex | undefined, amount = 1): GuiZIndex | undefined {
	return typeOf(zIndex) === "number" ? ((zIndex as number) + amount) : zIndex;
}
