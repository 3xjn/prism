import type React from "@rbxts/react";

import type { ConcreteColorValue, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedSizeConstraint, SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface ImageSlots {
	readonly root: ImageLabel;
	readonly corner: UICorner;
	readonly stroke: UIStroke;
	readonly padding: UIPadding;
	readonly aspectRatio: UIAspectRatioConstraint;
	readonly sizeConstraint: UISizeConstraint;
}

export type ImageSlotProps = RawSlotProps<ImageSlots>;

export type ImageColorValue = ConcreteColorValue;

export type ImageRadiusValue = ThemeSize | number | UDim;

export interface ImageStrokeProps {
	readonly color?: ConcreteColorValue;
	readonly thickness?: number;
	readonly transparency?: number;
	readonly mode?: Enum.ApplyStrokeMode;
}

export interface ImageSizeConstraint extends SharedSizeConstraint {}

export interface ImageStyleProps extends SharedStyleProps {
	readonly color?: ImageColorValue;
	readonly transparency?: number;
	readonly scaleType?: Enum.ScaleType;
	readonly imageRectOffset?: Vector2;
	readonly imageRectSize?: Vector2;
	readonly resampleMode?: Enum.ResamplerMode;
	readonly sliceCenter?: Rect;
	readonly sliceScale?: number;
	readonly tileSize?: UDim2;
	readonly border?: number;
	readonly borderColor?: ConcreteColorValue;
	readonly radius?: ImageRadiusValue;
	readonly stroke?: ImageStrokeProps;
	readonly aspectRatio?: number;
	readonly sizeConstraint?: ImageSizeConstraint;
}

export interface ImageProps extends ImageStyleProps {
	readonly src: string;
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<ImageLabel>["Event"];
	readonly Change?: React.InstanceProps<ImageLabel>["Change"];
	readonly slotProps?: ImageSlotProps;
	readonly ref?: React.Ref<ImageLabel>;
}
