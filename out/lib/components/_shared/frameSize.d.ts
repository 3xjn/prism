import type { SharedSizeConstraint } from "./useResolvedStyleProps";
export interface ResolvedFrameSizeProps {
    readonly size: UDim2;
    readonly automaticSize?: Enum.AutomaticSize;
}
export declare function resolveMinimumHeightConstraint(resolvedConstraint: SharedSizeConstraint | undefined, minimumHeight: number): SharedSizeConstraint;
export declare function resolveFrameSizeProps(resolvedSize: UDim2 | undefined, resolvedWidth: UDim | undefined, resolvedHeight: UDim | undefined): ResolvedFrameSizeProps;
