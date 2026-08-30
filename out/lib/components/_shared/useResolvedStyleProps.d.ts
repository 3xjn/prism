import type { ConcreteColorValue, Theme, ThemeSize } from "../../theme/index";
import type { SizeValue, SizeValue2D } from "../../utils/index";
export { mergeSharedStyleProps } from "./mergeSharedStyleProps";
export type SharedSpacingValue = ThemeSize | SizeValue;
export type SharedCursorValue = "default" | "pointer" | "grab" | "grabbing" | "resize-ew" | "resize-ns" | "resize-nesw" | "resize-nwse" | "resize-all" | "split-ew" | "split-ns" | "forbidden" | "wait" | "busy" | "crosshair" | `rbxasset://${string}`;
export interface SharedSizeConstraint {
    readonly min?: Vector2;
    readonly max?: Vector2;
}
export interface SharedStyleProps {
    readonly cursor?: SharedCursorValue;
    readonly width?: SizeValue;
    readonly height?: SizeValue;
    readonly minWidth?: SizeValue;
    readonly maxWidth?: SizeValue;
    readonly minHeight?: SizeValue;
    readonly maxHeight?: SizeValue;
    readonly position?: SizeValue2D;
    readonly anchor?: Vector2;
    readonly center?: boolean;
    readonly p?: SharedSpacingValue;
    readonly px?: SharedSpacingValue;
    readonly py?: SharedSpacingValue;
    readonly pt?: SharedSpacingValue;
    readonly pr?: SharedSpacingValue;
    readonly pb?: SharedSpacingValue;
    readonly pl?: SharedSpacingValue;
    readonly bg?: ConcreteColorValue;
    readonly bgTransparency?: number;
    readonly sizeConstraint?: SharedSizeConstraint;
    readonly clip?: boolean;
    readonly visible?: boolean;
    readonly layoutOrder?: number;
    readonly zIndex?: number;
}
export interface ResolvedStyleProps {
    readonly theme: Theme;
    readonly resolvedWidth?: UDim;
    readonly resolvedHeight?: UDim;
    readonly resolvedSize?: UDim2;
    readonly resolvedPosition?: UDim2;
    readonly resolvedAnchor?: Vector2;
    readonly resolvedBackgroundColor?: Color3;
    readonly resolvedConstraint?: SharedSizeConstraint;
    readonly paddingTop?: UDim;
    readonly paddingRight?: UDim;
    readonly paddingBottom?: UDim;
    readonly paddingLeft?: UDim;
    readonly hasPadding: boolean;
}
/** Report an invalid prop value through Prism's shared diagnostics policy. */
export declare function reportComponentFailure(componentName: string, message: string): void;
export declare function resolveColorSafe(theme: Theme, componentName: string, value: ConcreteColorValue | undefined, fallback: Color3): Color3 | undefined;
export declare function resolveThemeSizeSafe(theme: Theme, componentName: string, value: ThemeSize, scale: "spacing" | "radius" | "fontSizes", fallback: number): number;
export declare function resolveUDimSafe(componentName: string, value: SizeValue, label: string, fallback?: UDim): UDim;
export declare function useResolvedStyleProps(componentName: string, styleProps: SharedStyleProps): ResolvedStyleProps;
