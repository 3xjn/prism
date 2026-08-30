import React from "@rbxts/react";
import type { GuiZIndex } from "../_shared/overlayLayerPolicy";
import type { PopoverSizeStyles, PopoverVisualStyles } from "./styles";
import type { PopoverSlotProps } from "./types";
import type { PopoverPanelPlacement } from "./utils";
export interface PopoverOverlayPanelProps {
    readonly localAnchorPosition: Vector2;
    readonly panelPlacement: PopoverPanelPlacement;
    readonly overlayZIndex: GuiZIndex | undefined;
    readonly panelInstance: TextButton | undefined;
    readonly primitiveContent: string | number | undefined;
    readonly richContent: React.ReactElement | undefined;
    readonly shouldRenderOutsideCapture: boolean;
    readonly sizeStyles: PopoverSizeStyles;
    readonly visualStyles: PopoverVisualStyles;
    readonly slotProps: PopoverSlotProps | undefined;
    readonly themeFontFamily: Enum.Font;
    readonly onOutsidePress: () => void;
    readonly setPanelInstance: (instance: TextButton | undefined) => void;
}
export declare function PopoverOverlayPanel({ localAnchorPosition, panelPlacement, overlayZIndex, panelInstance, primitiveContent, richContent, shouldRenderOutsideCapture, sizeStyles, visualStyles, slotProps, themeFontFamily, onOutsidePress, setPanelInstance, }: PopoverOverlayPanelProps): React.ReactElement;
