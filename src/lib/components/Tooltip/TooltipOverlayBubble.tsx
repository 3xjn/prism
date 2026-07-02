import React from "@rbxts/react";

import type { ThemeShadow } from "@prism/theme";

import {
	renderCornerDecorator,
	renderInsetPaddingDecorator,
	renderOverlayTextLabel,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { renderElevationShadow } from "../_shared/elevation";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import type { GuiZIndex } from "../_shared/overlayLayerPolicy";
import { resolveTextFontFace } from "../_shared/textFont";

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

export function TooltipOverlayBubble({
	localAnchorPosition,
	overlayZIndex,
	primitiveContent,
	richContent,
	sizeStyles,
	visualStyles,
	slotProps,
	themeFontFamily,
	tailImage,
	tailBorderImage,
	tailRotation,
	tailAttachmentOffsetY,
}: TooltipOverlayBubbleProps): React.ReactElement {
	const bubbleSlotProps = slotProps?.bubble;
	const labelSlotProps = slotProps?.label;
	const tailSlotProps = slotProps?.tail;
	const tailBorderSlotProps = slotProps?.tailBorder;
	const resolvedBubbleZIndex = bubbleSlotProps?.ZIndex ?? incrementZIndex(overlayZIndex, 1);
	const resolvedTailBorderZIndex = tailBorderSlotProps?.ZIndex ?? incrementZIndex(resolvedBubbleZIndex, 1);
	const resolvedTailZIndex = tailSlotProps?.ZIndex ?? incrementZIndex(resolvedTailBorderZIndex, 1);
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? incrementZIndex(resolvedTailZIndex, 1);
	const resolvedShadowZIndex = typeIs(resolvedBubbleZIndex, "number") ? math.max(resolvedBubbleZIndex - 1, 0) : 0;
	const resolvedLabelFont = labelSlotProps?.Font ?? themeFontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, themeFontFamily);

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Position={new UDim2(0, localAnchorPosition.X, 0, localAnchorPosition.Y)}
			AnchorPoint={new Vector2(0.5, 1)}
			Size={UDim2.fromOffset(0, 0)}
			ClipsDescendants={false}
			Active={false}
			Selectable={false}
		>
			<frame
				BackgroundColor3={bubbleSlotProps?.BackgroundColor3 ?? visualStyles.backgroundColor}
				BackgroundTransparency={bubbleSlotProps?.BackgroundTransparency ?? 0}
				BorderSizePixel={0}
				Position={bubbleSlotProps?.Position ?? UDim2.fromOffset(0, 0)}
				AnchorPoint={bubbleSlotProps?.AnchorPoint ?? new Vector2(0.5, 1)}
				AutomaticSize={Enum.AutomaticSize.XY}
				ClipsDescendants={false}
				ZIndex={resolvedBubbleZIndex}
				Active={false}
				Selectable={false}
				{...bubbleSlotProps}
			>
				{renderElevationShadow({
					shadow: visualStyles.shadow,
					radius: sizeStyles.radius,
					zIndex: resolvedShadowZIndex,
				})}
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.bubbleCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: visualStyles.strokeColor,
					transparency: visualStyles.strokeTransparency,
					thickness: 1,
					slotProps: slotProps?.bubbleStroke,
				})}
				{renderInsetPaddingDecorator({
					enabled: true,
					paddingX: sizeStyles.paddingX,
					paddingY: sizeStyles.paddingY,
					slotProps: slotProps?.bubblePadding,
				})}
				{richContent ??
					renderOverlayTextLabel({
						text: primitiveContent,
						textColor: visualStyles.textColor,
						textSize: sizeStyles.fontSize,
						font: resolvedLabelFont,
						fontFace: resolvedLabelFontFace,
						lineHeight: sizeStyles.lineHeight,
						textXAlignment: Enum.TextXAlignment.Center,
						zIndex: resolvedLabelZIndex,
						slotProps: labelSlotProps,
					})}
			</frame>
			<imagelabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(sizeStyles.tailWidth, sizeStyles.tailHeight)}
				Position={tailBorderSlotProps?.Position ?? UDim2.fromOffset(0, tailAttachmentOffsetY)}
				AnchorPoint={tailBorderSlotProps?.AnchorPoint ?? new Vector2(0.5, 0)}
				Image={tailBorderSlotProps?.Image ?? tailBorderImage}
				ImageColor3={tailBorderSlotProps?.ImageColor3 ?? visualStyles.tailBorderColor}
				ImageTransparency={tailBorderSlotProps?.ImageTransparency ?? visualStyles.tailBorderTransparency}
				Rotation={tailBorderSlotProps?.Rotation ?? tailRotation}
				ScaleType={tailBorderSlotProps?.ScaleType ?? Enum.ScaleType.Fit}
				ZIndex={resolvedTailBorderZIndex}
				Active={false}
				Selectable={false}
				{...tailBorderSlotProps}
			/>
			<imagelabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(sizeStyles.tailWidth, sizeStyles.tailHeight)}
				Position={tailSlotProps?.Position ?? UDim2.fromOffset(0, tailAttachmentOffsetY)}
				AnchorPoint={tailSlotProps?.AnchorPoint ?? new Vector2(0.5, 0)}
				Image={tailSlotProps?.Image ?? tailImage}
				ImageColor3={tailSlotProps?.ImageColor3 ?? visualStyles.tailFillColor}
				ImageTransparency={tailSlotProps?.ImageTransparency ?? 0}
				Rotation={tailSlotProps?.Rotation ?? tailRotation}
				ScaleType={tailSlotProps?.ScaleType ?? Enum.ScaleType.Fit}
				ZIndex={resolvedTailZIndex}
				Active={false}
				Selectable={false}
				{...tailSlotProps}
			/>
		</frame>
	);
}
