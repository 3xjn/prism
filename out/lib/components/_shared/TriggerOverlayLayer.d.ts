import React from "@rbxts/react";
import type { TriggerOverlayLayout } from "./layering";
export interface TriggerOverlayLayerPlacement {
    readonly anchorPosition: Vector2;
}
export interface TriggerOverlayLayerState<TPlacement extends TriggerOverlayLayerPlacement> {
    readonly layout: TriggerOverlayLayout;
    readonly placement: TPlacement;
    readonly localAnchorPosition: Vector2;
    readonly overlayZIndex: React.InstanceProps<Frame>["ZIndex"] | undefined;
}
export interface TriggerOverlayLayerProps<TPlacement extends TriggerOverlayLayerPlacement> {
    readonly render: (state: TriggerOverlayLayerState<TPlacement>) => React.ReactNode;
    readonly trigger: GuiObject | undefined;
    readonly enabled?: boolean;
    readonly resolvePlacement: (layout: TriggerOverlayLayout) => TPlacement | undefined;
    readonly resolveZIndex?: (layout: TriggerOverlayLayout) => React.InstanceProps<Frame>["ZIndex"] | undefined;
    readonly backgroundColor?: Color3;
    readonly slotProps?: Partial<React.InstanceProps<Frame>>;
}
export declare function TriggerOverlayLayer<TPlacement extends TriggerOverlayLayerPlacement>({ render, trigger, enabled, resolvePlacement, resolveZIndex, backgroundColor, slotProps, }: TriggerOverlayLayerProps<TPlacement>): React.ReactElement | undefined;
