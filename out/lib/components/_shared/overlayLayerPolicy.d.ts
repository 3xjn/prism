import type React from "@rbxts/react";
export type GuiZIndex = React.InstanceProps<Frame>["ZIndex"];
export declare const DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX = 10;
/** Component-local drag overlays (e.g. Draggable's floating item) — above sibling content, below capture overlays. */
export declare const DRAG_OVERLAY_Z_INDEX = 1000;
export declare const CAPTURE_OVERLAY_Z_INDEX = 10000;
export declare function incrementZIndex(zIndex: GuiZIndex | undefined, amount?: number): GuiZIndex | undefined;
