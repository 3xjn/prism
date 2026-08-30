import type { TriggerOverlayBounds } from "../_shared/layering";
import type { PopoverAlign, PopoverPlacement } from "./types";
export interface PopoverPanelPlacement {
    readonly anchorPoint: Vector2;
    readonly anchorPosition: Vector2;
}
export declare function resolvePopoverPanelPlacement(bounds: TriggerOverlayBounds, placement: PopoverPlacement, align: PopoverAlign, gap: number, offset: Vector2 | undefined): PopoverPanelPlacement;
