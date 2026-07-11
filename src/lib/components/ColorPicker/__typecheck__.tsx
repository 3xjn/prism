import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { ColorPicker } from "./ColorPicker";
import type { ColorPickerProps, ColorPickerStyleOverride, ColorPickerVisualStyles } from "./types";

const pickerRef = React.createRef<TextButton>();
const leftNeighbor = React.createRef<TextButton>();
type ExportedColorPickerProps = React.ComponentProps<typeof ColorPicker>;

const styleOverride: ColorPickerStyleOverride = (styles, ctx) =>
	ctx.state === "selected"
		? { strokeColor: ctx.theme.colors.primary.dark, strokeThickness: styles.strokeThickness + 1 }
		: {};

const validProps: ColorPickerProps[] = [
	{},
	{ defaultValue: Color3.fromRGB(59, 130, 246) },
	{ value: Color3.fromRGB(37, 99, 235), onChange: () => undefined, onChangeEnd: () => undefined },
	{ disabled: true, size: "xs" },
	{ size: "xl", fullWidth: true },
	{ width: 320, minWidth: 220, maxWidth: 440, layoutOrder: 2 },
	{ selectable: true, selectionOrder: 4, nextSelectionLeft: leftNeighbor.current },
	{ styleOverrides: styleOverride },
	{ slotProps: { root: { BackgroundTransparency: 0.04 }, field: { Rotation: 0 } } },
	{ slotProps: { hexInput: { PlaceholderText: "#RRGGBB" }, rgbInput: { PlaceholderText: "R, G, B" } } },
	{ slotProps: { fieldMarker: { Size: UDim2.fromOffset(20, 20) }, hueMarker: { BackgroundTransparency: 0.1 } } },
	{ ref: pickerRef },
];

const validExamples = [
	<ColorPicker key="default" />,
	<ColorPicker key="uncontrolled" defaultValue={Color3.fromRGB(248, 81, 73)} />,
	<ColorPicker
		key="controlled"
		value={Color3.fromRGB(63, 185, 80)}
		onChange={() => undefined}
		onChangeEnd={() => undefined}
	/>,
	<ColorPicker key="disabled" disabled size="sm" />,
	<ColorPicker key="full" fullWidth size="lg" />,
	<ColorPicker
		key="selection"
		selectionOrder={2}
		nextSelectionLeft={leftNeighbor.current}
		selectable
		ref={pickerRef}
	/>,
];

const acceptsExamples: React.ReactNode = validExamples;
const acceptsProps: ColorPickerProps[] = validProps;

type ColorPickerHasNoChildren = AssertFalse<HasProp<ColorPickerProps, "children">>;
type ColorPickerValueRejectsString = AssertFalse<IsAssignable<string, NonNullable<ColorPickerProps["value"]>>>;
type ColorPickerSupportsStyleOverride = AssertTrue<
	IsAssignable<ColorPickerStyleOverride, ColorPickerProps["styleOverrides"]>
>;
type ExportedPropsAcceptColor = AssertTrue<IsAssignable<Color3, NonNullable<ExportedColorPickerProps["value"]>>>;
type VisualStylesHaveNoRadius = AssertFalse<IsAssignable<"radius", keyof ColorPickerVisualStyles>>;

const colorPickerHasNoChildren: ColorPickerHasNoChildren = false;
const colorPickerValueRejectsString: ColorPickerValueRejectsString = false;
const colorPickerSupportsStyleOverride: ColorPickerSupportsStyleOverride = true;
const exportedPropsAcceptColor: ExportedPropsAcceptColor = true;
const visualStylesHaveNoRadius: VisualStylesHaveNoRadius = false;

export {
	acceptsExamples,
	acceptsProps,
	colorPickerHasNoChildren,
	colorPickerSupportsStyleOverride,
	colorPickerValueRejectsString,
	exportedPropsAcceptColor,
	styleOverride,
	visualStylesHaveNoRadius,
};
