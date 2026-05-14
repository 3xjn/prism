export { assignRef, composeEventMaps, isPressInput } from "../_shared/interaction";
export { incrementZIndex, type GuiZIndex } from "../_shared/overlayLayerPolicy";
export { resolveTextFontFace } from "../_shared/textFont";
import type { TriggerOverlayLayout } from "../_shared/useTriggerOverlayLayout";

import type { SelectOption } from "./types";

export interface SelectOverlayLayout {
	readonly portalTarget: LayerCollector;
	readonly position: Vector2;
	readonly size: Vector2;
	readonly zIndexBase: number;
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

export function resolveSelectOverlayLayout(
	layout: TriggerOverlayLayout | undefined,
	verticalGap: number,
	minimumTriggerHeight: number,
): SelectOverlayLayout | undefined {
	if (layout === undefined) {
		return undefined;
	}

	const {
		portalTarget,
		bounds: { position, size },
	} = layout;

	return {
		portalTarget,
		zIndexBase: layout.zIndexBase,
		position: new Vector2(position.X, position.Y + math.max(size.Y, minimumTriggerHeight) + verticalGap),
		size: size,
	};
}
