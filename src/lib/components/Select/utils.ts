export { assignRef, composeEventMaps } from "../_shared/interaction";
export { incrementZIndex, type GuiZIndex } from "../_shared/overlayLayerPolicy";
export { resolveTextFontFace } from "../_shared/textFont";
import type { TriggerOverlayLayout } from "../_shared/layering";

import type { SelectOption } from "./types";

export interface SelectOverlayPlacement {
	readonly anchorPosition: Vector2;
	readonly dropdownSize: Vector2;
}

export function findSelectedOption(options: readonly SelectOption[], value: string | undefined): SelectOption | undefined {
	if (value === undefined) {
		return undefined;
	}

	for (const option of options) {
		if (option.value === value) {
			return option;
		}
	}

	return undefined;
}

export function resolveVisibleOptionCount(maxVisibleOptions: number): number {
	return math.max(1, math.floor(maxVisibleOptions));
}

export function resolveSelectOverlayPlacement(
	layout: TriggerOverlayLayout,
	verticalGap: number,
	minimumTriggerHeight: number,
): SelectOverlayPlacement {
	const { position, size } = layout.bounds;

	return {
		anchorPosition: new Vector2(position.X, position.Y + math.max(size.Y, minimumTriggerHeight) + verticalGap),
		dropdownSize: size,
	};
}
