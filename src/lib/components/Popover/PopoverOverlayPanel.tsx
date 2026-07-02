import React from "@rbxts/react";

import {
	renderCornerDecorator,
	renderInsetPaddingDecorator,
	renderOverlayTextLabel,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { renderElevationShadow } from "../_shared/elevation";
import { Backdrop } from "../Backdrop";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import type { GuiZIndex } from "../_shared/overlayLayerPolicy";
import { resolveTextFontFace } from "../_shared/textFont";

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

export function PopoverOverlayPanel({
	localAnchorPosition,
	panelPlacement,
	overlayZIndex,
	panelInstance,
	primitiveContent,
	richContent,
	shouldRenderOutsideCapture,
	sizeStyles,
	visualStyles,
	slotProps,
	themeFontFamily,
	onOutsidePress,
	setPanelInstance,
}: PopoverOverlayPanelProps): React.ReactElement {
	const outsideCaptureSlotProps = slotProps?.outsideCapture;
	const panelSlotProps = slotProps?.panel;
	const contentSlotProps = slotProps?.content;
	const labelSlotProps = slotProps?.label;
	const resolvedOutsideCaptureZIndex = outsideCaptureSlotProps?.ZIndex ?? overlayZIndex;
	const resolvedPanelZIndex = panelSlotProps?.ZIndex ?? incrementZIndex(resolvedOutsideCaptureZIndex, 1);
	const resolvedContentZIndex = contentSlotProps?.ZIndex ?? incrementZIndex(resolvedPanelZIndex, 1);
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? incrementZIndex(resolvedContentZIndex, 1);
	const resolvedShadowZIndex = typeIs(resolvedPanelZIndex, "number") ? math.max(resolvedPanelZIndex - 1, 0) : 0;
	const resolvedLabelFont = labelSlotProps?.Font ?? themeFontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, themeFontFamily);

	return (
		<>
			{shouldRenderOutsideCapture ? (
				<Backdrop
					visible
					opacity={0}
					active
					zIndex={resolvedOutsideCaptureZIndex}
					excludeInstance={panelInstance}
					onPress={onOutsidePress}
					slotProps={{ root: outsideCaptureSlotProps }}
				/>
			) : undefined}
			<textbutton
				AutoButtonColor={false}
				Active={panelSlotProps?.Active ?? true}
				Selectable={false}
				BackgroundColor3={panelSlotProps?.BackgroundColor3 ?? visualStyles.backgroundColor}
				BackgroundTransparency={panelSlotProps?.BackgroundTransparency ?? 0}
				BorderSizePixel={0}
				Text=""
				TextTransparency={1}
				TextStrokeTransparency={1}
				Position={new UDim2(0, localAnchorPosition.X, 0, localAnchorPosition.Y)}
				AnchorPoint={panelSlotProps?.AnchorPoint ?? panelPlacement.anchorPoint}
				Size={panelSlotProps?.Size ?? UDim2.fromOffset(0, 0)}
				AutomaticSize={panelSlotProps?.AutomaticSize ?? Enum.AutomaticSize.XY}
				ClipsDescendants={panelSlotProps?.ClipsDescendants ?? false}
				ZIndex={resolvedPanelZIndex}
				{...panelSlotProps}
				ref={setPanelInstance}
			>
				{renderElevationShadow({
					shadow: visualStyles.shadow,
					radius: sizeStyles.radius,
					zIndex: resolvedShadowZIndex,
				})}
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.panelCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: visualStyles.strokeColor,
					transparency: visualStyles.strokeTransparency,
					thickness: visualStyles.strokeThickness,
					slotProps: slotProps?.panelStroke,
				})}
				{renderInsetPaddingDecorator({
					enabled: true,
					paddingX: sizeStyles.paddingX,
					paddingY: sizeStyles.paddingY,
					slotProps: slotProps?.panelPadding,
				})}
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromOffset(0, 0)}
					AutomaticSize={Enum.AutomaticSize.XY}
					Active={false}
					Selectable={false}
					ZIndex={resolvedContentZIndex}
					{...contentSlotProps}
				>
					{richContent ??
						renderOverlayTextLabel({
							text: primitiveContent,
							textColor: visualStyles.textColor,
							textSize: sizeStyles.fontSize,
							font: resolvedLabelFont,
							fontFace: resolvedLabelFontFace,
							lineHeight: sizeStyles.lineHeight,
							textXAlignment: Enum.TextXAlignment.Left,
							zIndex: resolvedLabelZIndex,
							slotProps: labelSlotProps,
						})}
				</frame>
			</textbutton>
		</>
	);
}
