export { assignRef, composeEventMaps } from "../_shared/interaction";
export { incrementZIndex, type GuiZIndex } from "../_shared/overlayLayerPolicy";
export { resolveTextFontFace } from "../_shared/textFont";
import type { TriggerOverlayLayout } from "../_shared/layering";
import type { SelectOption } from "./types";
export interface SelectOverlayLayout {
    readonly portalTarget: LayerCollector;
    readonly position: Vector2;
    readonly size: Vector2;
    readonly zIndexBase: number;
}
export declare function findSelectedOption(options: readonly SelectOption[], value: string | undefined): SelectOption | undefined;
export declare function resolveVisibleOptionCount(maxVisibleOptions: number): number;
export declare function resolveSelectOverlayLayout(layout: TriggerOverlayLayout | undefined, verticalGap: number, minimumTriggerHeight: number): SelectOverlayLayout | undefined;
