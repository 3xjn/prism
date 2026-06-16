import type { TriggerOverlayBounds } from "../_shared/layering";

import type { PopoverAlign, PopoverPlacement } from "./types";

export interface PopoverPanelPlacement {
	readonly anchorPoint: Vector2;
	readonly anchorPosition: Vector2;
}

function resolveAlignedX(bounds: TriggerOverlayBounds, align: PopoverAlign): number {
	switch (align) {
		case "start":
			return bounds.position.X;
		case "end":
			return bounds.position.X + bounds.size.X;
		case "center":
		default:
			return bounds.position.X + bounds.size.X * 0.5;
	}
}

function resolveAlignedY(bounds: TriggerOverlayBounds, align: PopoverAlign): number {
	switch (align) {
		case "start":
			return bounds.position.Y;
		case "end":
			return bounds.position.Y + bounds.size.Y;
		case "center":
		default:
			return bounds.position.Y + bounds.size.Y * 0.5;
	}
}

function resolveVerticalAnchorPoint(placement: PopoverPlacement, align: PopoverAlign): Vector2 {
	const y = placement === "top" ? 1 : 0;

	switch (align) {
		case "start":
			return new Vector2(0, y);
		case "end":
			return new Vector2(1, y);
		case "center":
		default:
			return new Vector2(0.5, y);
	}
}

function resolveHorizontalAnchorPoint(placement: PopoverPlacement, align: PopoverAlign): Vector2 {
	const x = placement === "left" ? 1 : 0;

	switch (align) {
		case "start":
			return new Vector2(x, 0);
		case "end":
			return new Vector2(x, 1);
		case "center":
		default:
			return new Vector2(x, 0.5);
	}
}

export function resolvePopoverPanelPlacement(
	bounds: TriggerOverlayBounds,
	placement: PopoverPlacement,
	align: PopoverAlign,
	gap: number,
	offset: Vector2 | undefined,
): PopoverPanelPlacement {
	const resolvedOffset = offset ?? Vector2.zero;

	switch (placement) {
		case "top":
			return {
				anchorPoint: resolveVerticalAnchorPoint(placement, align),
				anchorPosition: new Vector2(resolveAlignedX(bounds, align), bounds.position.Y - gap).add(resolvedOffset),
			};
		case "left":
			return {
				anchorPoint: resolveHorizontalAnchorPoint(placement, align),
				anchorPosition: new Vector2(bounds.position.X - gap, resolveAlignedY(bounds, align)).add(resolvedOffset),
			};
		case "right":
			return {
				anchorPoint: resolveHorizontalAnchorPoint(placement, align),
				anchorPosition: new Vector2(bounds.position.X + bounds.size.X + gap, resolveAlignedY(bounds, align)).add(resolvedOffset),
			};
		case "bottom":
		default:
			return {
				anchorPoint: resolveVerticalAnchorPoint(placement, align),
				anchorPosition: new Vector2(resolveAlignedX(bounds, align), bounds.position.Y + bounds.size.Y + gap).add(resolvedOffset),
			};
	}
}
