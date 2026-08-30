import React from "@rbxts/react";
import type { ThemeShadow } from "../../theme/index";
import type { GuiZIndex } from "../_shared/overlayLayerPolicy";
import type { TooltipSlotProps } from "./types";
export interface TooltipOverlaySizeStyles {
    readonly paddingX: number;
    readonly paddingY: number;
    readonly radius: UDim;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly tailWidth: number;
    readonly tailHeight: number;
}
export interface TooltipOverlayVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly textColor: Color3;
    readonly tailFillColor: Color3;
    readonly tailBorderColor: Color3;
    readonly tailBorderTransparency: number;
    readonly shadow: ThemeShadow;
}
export interface TooltipOverlayBubbleProps {
    readonly localAnchorPosition: Vector2;
    readonly overlayZIndex: GuiZIndex | undefined;
    readonly primitiveContent: string | number | undefined;
    readonly richContent: React.ReactElement | undefined;
    readonly sizeStyles: TooltipOverlaySizeStyles;
    readonly visualStyles: TooltipOverlayVisualStyles;
    readonly slotProps: TooltipSlotProps | undefined;
    readonly themeFontFamily: Enum.Font;
    readonly tailImage: string;
    readonly tailBorderImage: string;
    readonly tailRotation: number;
    readonly tailAttachmentOffsetY: number;
}
export declare function TooltipOverlayBubble({ localAnchorPosition, overlayZIndex, primitiveContent, richContent, sizeStyles, visualStyles, slotProps, themeFontFamily, tailImage, tailBorderImage, tailRotation, tailAttachmentOffsetY, }: TooltipOverlayBubbleProps): React.ReactElement;
