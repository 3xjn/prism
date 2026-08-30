import React from "@rbxts/react";
import type { SharedSizeConstraint } from "./useResolvedStyleProps";
type PaddingSlotProps = Partial<React.InstanceProps<UIPadding>>;
type SizeConstraintSlotProps = Partial<React.InstanceProps<UISizeConstraint>>;
type CornerSlotProps = Partial<React.InstanceProps<UICorner>>;
type StrokeSlotProps = Partial<React.InstanceProps<UIStroke>>;
type AspectRatioSlotProps = Partial<React.InstanceProps<UIAspectRatioConstraint>>;
export interface PaddingDecoratorOptions {
    readonly keyName?: string;
    readonly enabled: boolean;
    readonly paddingTop?: React.InstanceProps<UIPadding>["PaddingTop"];
    readonly paddingRight?: React.InstanceProps<UIPadding>["PaddingRight"];
    readonly paddingBottom?: React.InstanceProps<UIPadding>["PaddingBottom"];
    readonly paddingLeft?: React.InstanceProps<UIPadding>["PaddingLeft"];
    readonly slotProps?: PaddingSlotProps;
}
export interface InsetPaddingDecoratorOptions {
    readonly keyName?: string;
    readonly enabled: boolean;
    readonly paddingX: number;
    readonly paddingY: number;
    readonly slotProps?: PaddingSlotProps;
}
export interface OverlayTextLabelOptions {
    readonly text: string | number | undefined;
    readonly textColor: Color3;
    readonly textSize: number;
    readonly font: React.InstanceProps<TextLabel>["Font"];
    readonly fontFace: React.InstanceProps<TextLabel>["FontFace"];
    readonly lineHeight: number;
    readonly textXAlignment: React.InstanceProps<TextLabel>["TextXAlignment"];
    readonly zIndex?: React.InstanceProps<TextLabel>["ZIndex"];
    readonly slotProps?: Partial<React.InstanceProps<TextLabel>>;
}
export interface SizeConstraintDecoratorOptions {
    readonly keyName?: string;
    readonly constraint?: SharedSizeConstraint;
    readonly slotProps?: SizeConstraintSlotProps;
}
export interface CornerDecoratorOptions {
    readonly keyName?: string;
    readonly radius?: React.InstanceProps<UICorner>["CornerRadius"];
    readonly slotProps?: CornerSlotProps;
}
export interface StrokeDecoratorOptions {
    readonly keyName?: string;
    readonly enabled: boolean;
    readonly color?: React.InstanceProps<UIStroke>["Color"];
    readonly thickness?: React.InstanceProps<UIStroke>["Thickness"];
    readonly transparency?: React.InstanceProps<UIStroke>["Transparency"];
    readonly mode?: React.InstanceProps<UIStroke>["ApplyStrokeMode"];
    readonly slotProps?: StrokeSlotProps;
}
export interface AspectRatioDecoratorOptions {
    readonly keyName?: string;
    readonly aspectRatio?: React.InstanceProps<UIAspectRatioConstraint>["AspectRatio"];
    readonly slotProps?: AspectRatioSlotProps;
}
export declare function renderPaddingDecorator(options: PaddingDecoratorOptions): React.ReactElement | undefined;
export declare function renderInsetPaddingDecorator(options: InsetPaddingDecoratorOptions): React.ReactElement | undefined;
export declare function renderOverlayTextLabel(options: OverlayTextLabelOptions): React.ReactElement;
export declare function renderSizeConstraintDecorator(options: SizeConstraintDecoratorOptions): React.ReactElement | undefined;
export declare function renderCornerDecorator(options: CornerDecoratorOptions): React.ReactElement | undefined;
export declare function renderStrokeDecorator(options: StrokeDecoratorOptions): React.ReactElement | undefined;
export declare function renderAspectRatioDecorator(options: AspectRatioDecoratorOptions): React.ReactElement | undefined;
export declare function pushDecorator(decoratorChildren: React.ReactElement[], decorator: React.ReactElement | undefined): void;
export {};
