import React from "@rbxts/react";

import { renderCornerDecorator, renderStrokeDecorator } from "../_shared/foundationDecorators";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { resolveSelectionProps, type SelectionProps } from "../_shared/selection";

import type { ColorPickerSizeStyles, ColorPickerVisualStyles } from "./styles";
import type { ColorPickerSlotProps } from "./types";
import type { HsvColor } from "./utils";

const SATURATION_TRANSPARENCY = new NumberSequence([
	new NumberSequenceKeypoint(0, 0),
	new NumberSequenceKeypoint(1, 1),
]);
const VALUE_TRANSPARENCY = new NumberSequence([new NumberSequenceKeypoint(0, 1), new NumberSequenceKeypoint(1, 0)]);

interface ColorPickerFieldProps {
	readonly color: Color3;
	readonly hsv: HsvColor;
	readonly hue: number;
	readonly disabled: boolean;
	readonly selectionProps: SelectionProps;
	readonly sizeStyles: ColorPickerSizeStyles;
	readonly visualStyles: ColorPickerVisualStyles;
	readonly slotProps: ColorPickerSlotProps | undefined;
	readonly fieldZIndex: React.InstanceProps<Frame>["ZIndex"];
	readonly markerZIndex: React.InstanceProps<Frame>["ZIndex"];
	readonly hitboxZIndex: React.InstanceProps<TextButton>["ZIndex"];
	readonly frameRef: React.Ref<Frame>;
	readonly hitboxRef: React.Ref<TextButton>;
	readonly event: React.InstanceProps<TextButton>["Event"];
	readonly change: React.InstanceProps<TextButton>["Change"];
}

/** @internal Keeps saturation/value rendering in its own Luau register scope. */
export function ColorPickerField({
	color,
	hsv,
	hue,
	disabled,
	selectionProps,
	sizeStyles,
	visualStyles,
	slotProps,
	fieldZIndex,
	markerZIndex,
	hitboxZIndex,
	frameRef,
	hitboxRef,
	event,
	change,
}: ColorPickerFieldProps): React.ReactElement {
	return (
		<frame
			ref={frameRef}
			BackgroundColor3={Color3.fromHSV(hue, 1, 1)}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			ClipsDescendants={false}
			Size={new UDim2(1, 0, 0, sizeStyles.fieldHeight)}
			LayoutOrder={2}
			ZIndex={fieldZIndex}
			{...slotProps?.field}
		>
			{renderCornerDecorator({ radius: sizeStyles.fieldRadius, slotProps: slotProps?.fieldCorner })}
			{renderStrokeDecorator({
				enabled: true,
				color: visualStyles.fieldStrokeColor,
				transparency: visualStyles.fieldStrokeTransparency,
				thickness: visualStyles.fieldStrokeThickness,
				slotProps: slotProps?.fieldStroke,
			})}
			<frame
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={fieldZIndex}
				{...slotProps?.saturationOverlay}
			>
				<uicorner CornerRadius={sizeStyles.fieldRadius} />
				<uigradient Transparency={SATURATION_TRANSPARENCY} Rotation={0} {...slotProps?.saturationGradient} />
			</frame>
			<frame
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={incrementZIndex(fieldZIndex, 1)}
				{...slotProps?.valueOverlay}
			>
				<uicorner CornerRadius={sizeStyles.fieldRadius} />
				<uigradient Transparency={VALUE_TRANSPARENCY} Rotation={90} {...slotProps?.valueGradient} />
			</frame>
			<frame
				BackgroundColor3={visualStyles.markerRingColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(sizeStyles.markerDiameter, sizeStyles.markerDiameter)}
				Position={new UDim2(hsv.saturation, 0, 1 - hsv.value, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={markerZIndex}
				{...slotProps?.fieldMarker}
			>
				{renderCornerDecorator({ radius: new UDim(0.5, 0), slotProps: slotProps?.fieldMarkerCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: visualStyles.markerStrokeColor,
					transparency: 0.04,
					thickness: 1,
					slotProps: slotProps?.fieldMarkerStroke,
				})}
				<frame
					BackgroundColor3={color}
					BackgroundTransparency={0}
					BorderSizePixel={0}
					Size={UDim2.fromScale(0.55, 0.55)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={markerZIndex}
					{...slotProps?.fieldMarkerInner}
				>
					<uicorner CornerRadius={new UDim(0.5, 0)} {...slotProps?.fieldMarkerInnerCorner} />
				</frame>
			</frame>
			<textbutton
				AutoButtonColor={false}
				Active={!disabled}
				{...resolveSelectionProps(selectionProps, !disabled)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Text=""
				TextTransparency={1}
				TextStrokeTransparency={1}
				ZIndex={hitboxZIndex}
				Event={event}
				Change={change}
				{...slotProps?.fieldHitbox}
				ref={hitboxRef}
			/>
		</frame>
	);
}
