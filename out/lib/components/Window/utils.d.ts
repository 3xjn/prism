export interface WindowBounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
export interface WindowViewport {
    readonly width: number;
    readonly height: number;
}
export interface WindowClampOptions {
    readonly minWidth: number;
    readonly minHeight: number;
    readonly maxWidth?: number;
    readonly maxHeight?: number;
    readonly viewport: WindowViewport;
    readonly margin: number;
}
export declare const DEFAULT_WINDOW_WIDTH = 480;
export declare const DEFAULT_WINDOW_HEIGHT = 360;
export declare const DEFAULT_WINDOW_MIN_WIDTH = 280;
export declare const DEFAULT_WINDOW_MIN_HEIGHT = 180;
export declare function areWindowBoundsEqual(left: WindowBounds, right: WindowBounds): boolean;
export declare function resolveUDimPixels(value: UDim, viewport: number): number;
export declare function resolveCenteredWindowPosition(width: number, height: number, viewport: WindowViewport): {
    readonly x: number;
    readonly y: number;
};
export declare function resolveMaximizedWindowBounds(viewport: WindowViewport): WindowBounds;
export declare function resolveCollapsedWindowBounds(origin: WindowBounds, collapseControlSize: number, viewport: WindowViewport, margin: number): WindowBounds;
export declare function interpolateWindowBounds(from: WindowBounds, to: WindowBounds, alpha: number): WindowBounds;
export declare function clampWindowBounds(bounds: WindowBounds, options: WindowClampOptions): WindowBounds;
export declare function applyWindowMove(bounds: WindowBounds, nextX: number, nextY: number, options: WindowClampOptions): WindowBounds;
export declare function applyWindowResize(bounds: WindowBounds, nextWidth: number, nextHeight: number, options: WindowClampOptions): WindowBounds;
