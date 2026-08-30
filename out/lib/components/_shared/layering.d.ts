import React from "@rbxts/react";
export interface TriggerOverlayBounds {
    readonly position: Vector2;
    readonly size: Vector2;
}
export interface TriggerOverlayLayout {
    readonly portalTarget: LayerCollector;
    readonly bounds: TriggerOverlayBounds;
    readonly zIndexBase: number;
}
export interface ScreenOverlayLayerProps {
    readonly children?: React.ReactNode;
    readonly hostSlotProps?: Partial<React.InstanceProps<Frame>>;
    readonly slotProps?: Partial<React.InstanceProps<Frame>>;
    readonly zIndex?: React.InstanceProps<Frame>["ZIndex"];
}
export interface LayerPortalProps {
    readonly children?: React.ReactNode;
    readonly target: LayerCollector | undefined;
}
export interface CaptureOverlayProps {
    readonly active: boolean;
    readonly target: LayerCollector | undefined;
    readonly Event: React.InstanceProps<TextButton>["Event"] | undefined;
    readonly zIndex?: React.InstanceProps<TextButton>["ZIndex"];
    readonly slotProps?: Partial<React.InstanceProps<TextButton>>;
}
export declare function usePortalTarget(instance: Instance | undefined): LayerCollector | undefined;
export declare function useTriggerOverlayLayout(trigger: GuiObject | undefined, enabled?: boolean): TriggerOverlayLayout | undefined;
export declare function useOverlayLocalPosition(overlayFrame: GuiObject | undefined, absolutePosition: Vector2 | undefined): Vector2 | undefined;
export declare function LayerPortal({ children, target }: LayerPortalProps): React.ReactElement | undefined;
export declare function ScreenOverlayLayer({ children, hostSlotProps, slotProps, zIndex, }: ScreenOverlayLayerProps): React.ReactElement;
export declare function CaptureOverlay({ active, target, Event, zIndex, slotProps, }: CaptureOverlayProps): React.ReactElement | undefined;
