import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { Slider } from "./Slider";
import type { SliderProps, SliderStyleOverride, SliderStyleOverrideContext, SliderVisualStyles } from "./types";

const sliderRef = React.createRef<TextButton>();
type ExportedSliderProps = React.ComponentProps<typeof Slider>;

const sliderStyleOverride: SliderStyleOverride = (_visualStyles, ctx) => {
	if (ctx.state === "hovered") {
		return { thumbStrokeTransparency: 0 };
	}

	if (ctx.state === "pressed") {
		return { rangeColor: ctx.theme.colors[ctx.color].dark, thumbColor: ctx.theme.colors[ctx.color].dark };
	}

	if (ctx.state === "disabled") {
		return { trackColor: ctx.theme.colors.background.surface };
	}

	return {};
};

const validSliderProps: SliderProps[] = [
	{ defaultValue: 42 },
	{ value: 18, onChange: () => undefined },
	{ value: 24, onChange: () => undefined, onChangeEnd: () => undefined },
	{ defaultValue: 72, min: 20, max: 60 },
	{ defaultValue: 37, min: 0, max: 50, step: 5 },
	{ defaultValue: 24, min: 30, max: 10 },
	{ disabled: true, defaultValue: 18 },
	{ fullWidth: true, defaultValue: 55 },
	{ color: "secondary", size: "sm", defaultValue: 12 },
	{
		defaultValue: 42,
		selectable: true,
		selectionOrder: 10,
		nextSelectionUp: sliderRef.current,
		nextSelectionDown: sliderRef.current,
	},
	{ defaultValue: 42, disabled: true, selectable: true, slotProps: { hitbox: { Selectable: true } } },
	{ defaultValue: 33, tooltip: true },
	{ defaultValue: 38, tooltip: "Volume locked" },
	{ defaultValue: 44, tooltip: (currentValue) => `Value ${tostring(currentValue)}` },
	{ cursor: "pointer", defaultValue: 28 },
	{ width: 240, minWidth: 180, maxWidth: 320, p: "xs", layoutOrder: 2, defaultValue: 64 },
	{ slotProps: { root: { BackgroundTransparency: 0.05 } }, defaultValue: 16 },
	{ slotProps: { track: { BackgroundTransparency: 0.02 }, range: { BackgroundTransparency: 0.1 } }, defaultValue: 30 },
	{ slotProps: { trackCorner: { CornerRadius: new UDim(0, 12) }, trackStroke: { Thickness: 2 } }, defaultValue: 44 },
	{ slotProps: { thumb: { Rotation: 0 }, thumbCorner: { CornerRadius: new UDim(0, 14) }, thumbStroke: { Thickness: 2 } }, defaultValue: 48 },
	{
		tooltip: true,
		slotProps: {
			tooltipTrigger: { ZIndex: 7 },
			tooltipOverlay: { ZIndex: 9 },
			tooltip: { BackgroundTransparency: 0.03 },
			tooltipStroke: { Thickness: 2 },
			tooltipLabel: { TextColor3: Color3.fromRGB(37, 44, 58) },
			tooltipTail: { Image: "rbxassetid://105854070513330" },
		},
		defaultValue: 52,
	},
	{ slotProps: { label: { Text: "Volume" }, valueLabel: { Text: "48" } }, defaultValue: 48 },
	{ slotProps: { hitbox: { AutoButtonColor: true }, sizeConstraint: { MinSize: new Vector2(200, 24) } }, defaultValue: 22 },
	{ slotProps: { hitbox: { SelectionOrder: 20, NextSelectionRight: sliderRef.current } }, defaultValue: 40 },
	{ styleOverrides: sliderStyleOverride, defaultValue: 26 },
	{ ref: sliderRef, defaultValue: 58 },
];

const validExportedSliderProps: ExportedSliderProps[] = [
	{ defaultValue: 42 },
	{ value: 24, onChange: () => undefined, color: "primary" },
	{ defaultValue: 12, step: 2, size: "lg" },
	{ defaultValue: 20, tooltip: true },
	{ defaultValue: 40, selectionOrder: 20, nextSelectionLeft: sliderRef.current },
	{ defaultValue: 55, fullWidth: true, min: 0, max: 100 },
];

const validSliderExamples = [
	<Slider key="uncontrolled" defaultValue={42} />,
	<Slider key="controlled" value={18} onChange={() => undefined} onChangeEnd={() => undefined} />,
	<Slider key="clamped" defaultValue={90} min={10} max={40} />,
	<Slider key="stepped" defaultValue={30} min={0} max={60} step={5} />,
	<Slider key="disabled" disabled defaultValue={22} />,
	<Slider key="full-width" fullWidth defaultValue={54} />,
	<Slider key="tooltip" defaultValue={46} tooltip />,
	<Slider key="tooltip-renderer" defaultValue={62} tooltip={(currentValue) => `Value ${tostring(currentValue)}`} />,
	<Slider
		key="slots"
		defaultValue={36}
		slotProps={{
			root: { ZIndex: 3 },
			track: { BackgroundTransparency: 0.04 },
			range: { BackgroundColor3: Color3.fromRGB(89, 109, 255) },
			thumbStroke: { Thickness: 2 },
			tooltip: { BackgroundTransparency: 0.05 },
			tooltipTailBorder: { ImageTransparency: 0.12 },
			hitbox: { AutoButtonColor: true },
		}}
	/>,
	<Slider key="ref" ref={sliderRef} defaultValue={64} />,
];

const acceptsSliderChildren: React.ReactNode = validSliderExamples;
const acceptsSliderProps: SliderProps[] = validSliderProps;
const acceptsExportedSliderProps: ExportedSliderProps[] = validExportedSliderProps;

type SliderHasChildrenProp = "children" extends keyof SliderProps ? true : false;
type InvalidSliderColorAllowed = "palette.primary.5" extends NonNullable<SliderProps["color"]> ? true : false;
type InvalidSliderValueAllowed = string extends NonNullable<SliderProps["value"]> ? true : false;
type InvalidSliderDefaultValueAllowed = string extends NonNullable<SliderProps["defaultValue"]> ? true : false;
type InvalidSliderStepAllowed = string extends NonNullable<SliderProps["step"]> ? true : false;
type InvalidSliderTooltipAllowed = number extends NonNullable<SliderProps["tooltip"]> ? true : false;
type SliderTooltipFunctionAllowed = ((value: number) => string) extends NonNullable<SliderProps["tooltip"]> ? true : false;
type ExportedSliderValueAllowed = 42 extends NonNullable<ExportedSliderProps["value"]> ? true : false;
type SliderStyleOverrideAssignableToProp = AssertTrue<IsAssignable<SliderStyleOverride, SliderProps["styleOverrides"]>>;
type SliderStyleOverrideAssignableToExportedProp = AssertTrue<IsAssignable<SliderStyleOverride, ExportedSliderProps["styleOverrides"]>>;
type SliderStyleOverrideContextHasFields = AssertTrue<
	IsAssignable<"theme" | "color" | "size" | "state", keyof SliderStyleOverrideContext>
>;
type SliderStyleOverrideContextHasTheme = AssertTrue<HasProp<SliderStyleOverrideContext, "theme">>;
type SliderStyleOverrideContextHasNoDisabled = AssertFalse<HasProp<SliderStyleOverrideContext, "disabled">>;
type SliderVisualStyleOverrideFieldsAllowed = AssertTrue<
	IsAssignable<
		{
			readonly trackColor: Color3;
			readonly rangeColor: Color3;
			readonly thumbColor: Color3;
			readonly thumbStrokeTransparency: number;
			readonly labelColor: Color3;
		},
		Partial<SliderVisualStyles>
	>
>;
type SliderVisualStylesHasNoRadius = AssertFalse<IsAssignable<"radius", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoCornerRadius = AssertFalse<IsAssignable<"cornerRadius", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoPadding = AssertFalse<IsAssignable<"padding", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoFontSize = AssertFalse<IsAssignable<"fontSize", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoLabelSize = AssertFalse<IsAssignable<"labelSize", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoTrackHeight = AssertFalse<IsAssignable<"trackHeight", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoThumbDiameter = AssertFalse<IsAssignable<"thumbDiameter", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoLayout = AssertFalse<IsAssignable<"layout", keyof SliderVisualStyles>>;
type SliderVisualStylesHasNoSlotProps = AssertFalse<IsAssignable<"slotProps", keyof SliderVisualStyles>>;

const sliderHasChildrenProp: SliderHasChildrenProp = false;
const invalidSliderColor: InvalidSliderColorAllowed = false;
const invalidSliderValue: InvalidSliderValueAllowed = false;
const invalidSliderDefaultValue: InvalidSliderDefaultValueAllowed = false;
const invalidSliderStep: InvalidSliderStepAllowed = false;
const invalidSliderTooltip: InvalidSliderTooltipAllowed = false;
const sliderTooltipFunction: SliderTooltipFunctionAllowed = true;
const exportedSliderValue: ExportedSliderValueAllowed = true;
const sliderStyleOverrideAssignableToProp: SliderStyleOverrideAssignableToProp = true;
const sliderStyleOverrideAssignableToExportedProp: SliderStyleOverrideAssignableToExportedProp = true;
const sliderStyleOverrideContextHasFields: SliderStyleOverrideContextHasFields = true;
const sliderStyleOverrideContextHasTheme: SliderStyleOverrideContextHasTheme = true;
const sliderStyleOverrideContextHasNoDisabled: SliderStyleOverrideContextHasNoDisabled = false;
const sliderVisualStyleOverrideFieldsAllowed: SliderVisualStyleOverrideFieldsAllowed = true;
const sliderVisualStylesHasNoRadius: SliderVisualStylesHasNoRadius = false;
const sliderVisualStylesHasNoCornerRadius: SliderVisualStylesHasNoCornerRadius = false;
const sliderVisualStylesHasNoPadding: SliderVisualStylesHasNoPadding = false;
const sliderVisualStylesHasNoFontSize: SliderVisualStylesHasNoFontSize = false;
const sliderVisualStylesHasNoLabelSize: SliderVisualStylesHasNoLabelSize = false;
const sliderVisualStylesHasNoTrackHeight: SliderVisualStylesHasNoTrackHeight = false;
const sliderVisualStylesHasNoThumbDiameter: SliderVisualStylesHasNoThumbDiameter = false;
const sliderVisualStylesHasNoLayout: SliderVisualStylesHasNoLayout = false;
const sliderVisualStylesHasNoSlotProps: SliderVisualStylesHasNoSlotProps = false;

export {
	acceptsExportedSliderProps,
	acceptsSliderChildren,
	acceptsSliderProps,
	exportedSliderValue,
	invalidSliderColor,
	invalidSliderDefaultValue,
	invalidSliderStep,
	invalidSliderTooltip,
	invalidSliderValue,
	sliderHasChildrenProp,
	sliderStyleOverride,
	sliderStyleOverrideAssignableToExportedProp,
	sliderStyleOverrideAssignableToProp,
	sliderStyleOverrideContextHasFields,
	sliderStyleOverrideContextHasNoDisabled,
	sliderStyleOverrideContextHasTheme,
	sliderTooltipFunction,
	sliderVisualStyleOverrideFieldsAllowed,
	sliderVisualStylesHasNoCornerRadius,
	sliderVisualStylesHasNoFontSize,
	sliderVisualStylesHasNoLabelSize,
	sliderVisualStylesHasNoLayout,
	sliderVisualStylesHasNoPadding,
	sliderVisualStylesHasNoRadius,
	sliderVisualStylesHasNoSlotProps,
	sliderVisualStylesHasNoThumbDiameter,
	sliderVisualStylesHasNoTrackHeight,
};
