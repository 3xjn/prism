import { type WindowBounds, type WindowClampOptions, type WindowViewport } from "./utils";
export declare function useAbsoluteSize(instance: GuiObject | undefined): Vector2 | undefined;
export declare function resolveViewport(size: Vector2 | undefined): WindowViewport;
export declare function resolveLocalInputPosition(input: InputObject, overlay: GuiObject): Vector2;
export declare function resolveInitialWindowBounds(viewport: WindowViewport, width: number, height: number, position: UDim2 | undefined, center: boolean | undefined, options: WindowClampOptions): WindowBounds;
export declare function toClampOptions(viewport: WindowViewport, minWidth: number, minHeight: number, maxWidth: number | undefined, maxHeight: number | undefined, margin: number): WindowClampOptions;
