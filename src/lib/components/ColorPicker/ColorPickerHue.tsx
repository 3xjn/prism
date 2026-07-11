import React from "@rbxts/react";

import type { Theme } from "@prism/theme";

import { renderCornerDecorator, renderStrokeDecorator } from "../_shared/foundationDecorators";

import type { ColorPickerSizeStyles, ColorPickerVisualStyles } from "./styles";
import type { ColorPickerSlotProps } from "./types";

const HUE_SEQUENCE = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromHSV(0, 1, 1)),
	new ColorSequenceKeypoint(1 / 6, Color3.fromHSV(1 / 6, 1, 1)),
	new ColorSequenceKeypoint(2 / 6, Color3.fromHSV(2 / 6, 1, 1)),
	new ColorSequenceKeypoint(3 / 6, Color3.fromHSV(3 / 6, 1, 1)),
	new ColorSequenceKeypoint(4 / 6, Color3.fromHSV(4 / 6, 1, 1)),
	new ColorSequenceKeypoint(5 / 6, Color3.fromHSV(5 / 6, 1, 1)),
	new ColorSequenceKeypoint(1, Color3.fromHSV(1, 1, 1)),
]);

interface ColorPickerHueProps {
	readonly hue: number;
	readonly selected: boolean;
	readonly disabled: boolean;
	readonly selectable: boolean;
	readonly selectionOrder: number | undefined;
	readonly theme: Theme;
	readonly sizeStyles: ColorPickerSizeStyles;
	readonly visualStyles: ColorPickerVisualStyles;
	readonly slotProps: ColorPickerSlotProps | undefined;
	readonly hueZIndex: React.InstanceProps<Frame>["ZIndex"];
	readonly markerZIndex: React.InstanceProps<Frame>["ZIndex"];
	readonly hitboxZIndex: React.InstanceProps<TextButton>["ZIndex"];
	readonly frameRef: React.Ref<Frame>;
	readonly hitboxRef: React.Ref<TextButton>;
	readonly event: React.InstanceProps<TextButton>["Event"];
}

/** @internal Keeps hue-rail rendering in its own Luau register scope. */
export function ColorPickerHue({
	hue,
	selected,
	disabled,
	selectable,
	selectionOrder,
	theme,
	sizeStyles,
	visualStyles,
	slotProps,
	hueZIndex,
	markerZIndex,
	hitboxZIndex,
	frameRef,
	hitboxRef,
	event,
}: ColorPickerHueProps): React.ReactElement {
	return (
		<frame
			ref={frameRef}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, sizeStyles.hueHeight)}
			LayoutOrder={3}
			ZIndex={hueZIndex}
			{...slotProps?.hue}
		>
			{renderCornerDecorator({ radius: new UDim(0.5, 0), slotProps: slotProps?.hueCorner })}
			<uigradient Color={HUE_SEQUENCE} Rotation={0} {...slotProps?.hueGradient} />
			<frame
				BackgroundColor3={selected ? theme.colors.primary.main : visualStyles.hueMarkerColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={new UDim2(0, sizeStyles.hueMarkerWidth + (selected ? 4 : 0), 1, 6 + (selected ? 4 : 0))}
				Position={new UDim2(hue, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={markerZIndex}
				{...slotProps?.hueMarker}
			>
				{renderCornerDecorator({ radius: new UDim(0.5, 0), slotProps: slotProps?.hueMarkerCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: visualStyles.hueMarkerStrokeColor,
					transparency: 0,
					thickness: 1,
					slotProps: slotProps?.hueMarkerStroke,
				})}
			</frame>
			<textbutton
				AutoButtonColor={false}
				Active={!disabled}
				Selectable={!disabled && selectable}
				SelectionOrder={selectionOrder}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Text=""
				TextTransparency={1}
				TextStrokeTransparency={1}
				ZIndex={hitboxZIndex}
				Event={event}
				{...slotProps?.hueHitbox}
				ref={hitboxRef}
			/>
		</frame>
	);
}
