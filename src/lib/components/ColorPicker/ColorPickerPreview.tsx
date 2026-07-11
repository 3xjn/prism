import React from "@rbxts/react";

import type { Theme } from "@prism/theme";

import { renderCornerDecorator, renderStrokeDecorator } from "../_shared/foundationDecorators";
import { resolveTextFontFace } from "../_shared/textFont";

import type { ColorPickerSizeStyles, ColorPickerVisualStyles } from "./styles";
import type { ColorPickerSlotProps } from "./types";
import { formatHexColor } from "./utils";

interface ColorPickerPreviewProps {
	readonly color: Color3;
	readonly theme: Theme;
	readonly sizeStyles: ColorPickerSizeStyles;
	readonly visualStyles: ColorPickerVisualStyles;
	readonly slotProps: ColorPickerSlotProps | undefined;
	readonly zIndex: React.InstanceProps<Frame>["ZIndex"];
}

/** @internal Keeps preview rendering in its own Luau register scope. */
export function ColorPickerPreview({
	color,
	theme,
	sizeStyles,
	visualStyles,
	slotProps,
	zIndex,
}: ColorPickerPreviewProps): React.ReactElement {
	const labelSlotProps = slotProps?.previewLabel;
	const labelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const labelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, sizeStyles.previewHeight)}
			LayoutOrder={1}
			ZIndex={zIndex}
			{...slotProps?.preview}
		>
			<frame
				BackgroundColor3={color}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(sizeStyles.previewSwatchSize, sizeStyles.previewSwatchSize)}
				Position={UDim2.fromScale(0, 0.5)}
				AnchorPoint={new Vector2(0, 0.5)}
				ZIndex={zIndex}
				{...slotProps?.previewSwatch}
			>
				{renderCornerDecorator({ radius: sizeStyles.fieldRadius, slotProps: slotProps?.previewSwatchCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: theme.colors.border.default,
					transparency: 0.1,
					thickness: 1,
					slotProps: slotProps?.previewSwatchStroke,
				})}
			</frame>
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromOffset(sizeStyles.previewSwatchSize + sizeStyles.gap, 0)}
				Size={new UDim2(1, -(sizeStyles.previewSwatchSize + sizeStyles.gap), 1, 0)}
				Text={labelSlotProps?.Text ?? formatHexColor(color)}
				TextColor3={labelSlotProps?.TextColor3 ?? visualStyles.labelColor}
				TextSize={labelSlotProps?.TextSize ?? sizeStyles.fontSize}
				Font={labelFont}
				FontFace={labelFontFace}
				TextXAlignment={labelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left}
				TextYAlignment={labelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
				TextTruncate={labelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextStrokeTransparency={1}
				ZIndex={zIndex}
				{...labelSlotProps}
			/>
		</frame>
	);
}
