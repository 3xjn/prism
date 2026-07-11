import React from "@rbxts/react";

import type { Theme } from "@prism/theme";

import { Input } from "../Input";

import type { ColorPickerSizeStyles, ColorPickerVisualStyles } from "./styles";
import type { ColorPickerSize, ColorPickerSlotProps } from "./types";

type PrecisionKind = "HEX" | "RGB";

interface PrecisionFieldProps {
	readonly kind: PrecisionKind;
	readonly value: string;
	readonly invalid: boolean;
	readonly maxLength: number;
	readonly onChange: (value: string) => void;
	readonly onCommit: () => void;
	readonly size: ColorPickerSize;
	readonly disabled: boolean;
	readonly selectable: boolean;
	readonly selectionOrder: number | undefined;
	readonly theme: Theme;
	readonly sizeStyles: ColorPickerSizeStyles;
	readonly visualStyles: ColorPickerVisualStyles;
	readonly slotProps: ColorPickerSlotProps | undefined;
	readonly labelHeight: number;
	readonly zIndex: React.InstanceProps<Frame>["ZIndex"];
	readonly managedInputZIndex: number | undefined;
	readonly layoutOrder: number;
}

function PrecisionField({
	kind,
	value,
	invalid,
	maxLength,
	onChange,
	onCommit,
	size,
	disabled,
	selectable,
	selectionOrder,
	theme,
	sizeStyles,
	visualStyles,
	slotProps,
	labelHeight,
	zIndex,
	managedInputZIndex,
	layoutOrder,
}: PrecisionFieldProps): React.ReactElement {
	const fieldSlotProps = kind === "HEX" ? slotProps?.hexField : slotProps?.rgbField;
	const labelSlotProps = kind === "HEX" ? slotProps?.hexLabel : slotProps?.rgbLabel;
	const inputRootSlotProps = kind === "HEX" ? slotProps?.hexInputRoot : slotProps?.rgbInputRoot;
	const inputSlotProps = kind === "HEX" ? slotProps?.hexInput : slotProps?.rgbInput;
	const inputCornerSlotProps = kind === "HEX" ? slotProps?.hexInputCorner : slotProps?.rgbInputCorner;
	const inputStrokeSlotProps = kind === "HEX" ? slotProps?.hexInputStroke : slotProps?.rgbInputStroke;
	const inputPaddingSlotProps = kind === "HEX" ? slotProps?.hexInputPadding : slotProps?.rgbInputPadding;

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={new UDim2(0.5, -sizeStyles.gap / 2, 1, 0)}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
			{...fieldSlotProps}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
				Padding={new UDim(0, theme.spacing.xs)}
			/>
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 0, labelHeight)}
				LayoutOrder={1}
				Text={kind}
				TextColor3={visualStyles.labelColor}
				TextSize={theme.fontSizes.xs}
				Font={theme.fontFamily}
				FontFace={Font.fromEnum(theme.fontFamily)}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Center}
				TextStrokeTransparency={1}
				ZIndex={zIndex}
				{...labelSlotProps}
			/>
			<Input
				value={value}
				onChange={onChange}
				size={size}
				color={invalid ? "error" : "primary"}
				disabled={disabled}
				fullWidth
				maxLength={maxLength}
				selectable={!disabled && selectable}
				selectionOrder={selectionOrder}
				layoutOrder={2}
				zIndex={managedInputZIndex}
				Event={{ FocusLost: onCommit }}
				slotProps={{
					root: inputRootSlotProps,
					textbox: inputSlotProps,
					corner: inputCornerSlotProps,
					stroke: inputStrokeSlotProps,
					padding: inputPaddingSlotProps,
				}}
			/>
		</frame>
	);
}

interface ColorPickerInputsProps {
	readonly hexText: string;
	readonly rgbText: string;
	readonly hexInvalid: boolean;
	readonly rgbInvalid: boolean;
	readonly onHexChange: (value: string) => void;
	readonly onRgbChange: (value: string) => void;
	readonly onHexCommit: () => void;
	readonly onRgbCommit: () => void;
	readonly size: ColorPickerSize;
	readonly disabled: boolean;
	readonly selectable: boolean;
	readonly selectionOrder: number | undefined;
	readonly theme: Theme;
	readonly sizeStyles: ColorPickerSizeStyles;
	readonly visualStyles: ColorPickerVisualStyles;
	readonly slotProps: ColorPickerSlotProps | undefined;
	readonly height: number;
	readonly labelHeight: number;
	readonly zIndex: React.InstanceProps<Frame>["ZIndex"];
	readonly managedInputZIndex: number | undefined;
}

/** @internal Keeps precision-input rendering in bounded Luau register scopes. */
export function ColorPickerInputs({
	hexText,
	rgbText,
	hexInvalid,
	rgbInvalid,
	onHexChange,
	onRgbChange,
	onHexCommit,
	onRgbCommit,
	size,
	disabled,
	selectable,
	selectionOrder,
	theme,
	sizeStyles,
	visualStyles,
	slotProps,
	height,
	labelHeight,
	zIndex,
	managedInputZIndex,
}: ColorPickerInputsProps): React.ReactElement {
	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, height)}
			LayoutOrder={4}
			ZIndex={zIndex}
			{...slotProps?.inputs}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				VerticalAlignment={Enum.VerticalAlignment.Top}
				SortOrder={Enum.SortOrder.LayoutOrder}
				Padding={new UDim(0, sizeStyles.gap)}
				{...slotProps?.inputsLayout}
			/>
			<PrecisionField
				kind="HEX"
				value={hexText}
				invalid={hexInvalid}
				maxLength={7}
				onChange={onHexChange}
				onCommit={onHexCommit}
				size={size}
				disabled={disabled}
				selectable={selectable}
				selectionOrder={selectionOrder !== undefined ? selectionOrder + 2 : undefined}
				theme={theme}
				sizeStyles={sizeStyles}
				visualStyles={visualStyles}
				slotProps={slotProps}
				labelHeight={labelHeight}
				zIndex={zIndex}
				managedInputZIndex={managedInputZIndex}
				layoutOrder={1}
			/>
			<PrecisionField
				kind="RGB"
				value={rgbText}
				invalid={rgbInvalid}
				maxLength={18}
				onChange={onRgbChange}
				onCommit={onRgbCommit}
				size={size}
				disabled={disabled}
				selectable={selectable}
				selectionOrder={selectionOrder !== undefined ? selectionOrder + 3 : undefined}
				theme={theme}
				sizeStyles={sizeStyles}
				visualStyles={visualStyles}
				slotProps={slotProps}
				labelHeight={labelHeight}
				zIndex={zIndex}
				managedInputZIndex={managedInputZIndex}
				layoutOrder={2}
			/>
		</frame>
	);
}
