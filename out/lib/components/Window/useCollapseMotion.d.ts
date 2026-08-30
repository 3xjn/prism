import type { ThemeMotionEasing } from "../../theme/index";
import { type WindowBounds } from "./utils";
export interface UseWindowCollapseMotionOptions {
    readonly collapsed: boolean;
    readonly targetBounds: WindowBounds;
    readonly duration: number;
    readonly easing: ThemeMotionEasing;
}
export interface UseWindowCollapseMotionResult {
    readonly displayBounds: WindowBounds;
    readonly showCollapseControl: boolean;
    readonly tweening: boolean;
    readonly cancelTween: () => void;
}
export declare function useWindowCollapseMotion(options: UseWindowCollapseMotionOptions): UseWindowCollapseMotionResult;
