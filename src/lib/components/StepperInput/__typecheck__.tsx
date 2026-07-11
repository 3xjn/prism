import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { StepperInput } from "./StepperInput";
import type { StepperInputButtonVisualStyles, StepperInputFrameVisualStyles } from "./styles";
import type { StepperInputProps, StepperInputStyleOverrides } from "./types";

const stepperInputRef = React.createRef<TextButton>();
type ExportedStepperInputProps = React.ComponentProps<typeof StepperInput>;

const stepperInputStyleOverrides: StepperInputStyleOverrides = {
	frame: (_visualStyles, ctx) => {
		if (ctx.state === "focused") {
			return { strokeTransparency: 0, railFillTransparency: 0.4 };
		}

		return ctx.readOnly && ctx.variant === "outline" && ctx.size === "md"
			? { textColor: ctx.theme.colors.text.secondary }
			: {};
	},
	button: (visualStyles, ctx) =>
		ctx.state === "pressed" && ctx.control === "increment"
			? { backgroundColor: ctx.theme.colors.action.pressed, strokeTransparency: visualStyles.strokeTransparency * 0.5 }
			: {},
};

const validStepperInputProps: StepperInputProps[] = [
	{ defaultValue: 4 },
	{ defaultValue: 5, styleOverrides: stepperInputStyleOverrides },
	{
		defaultValue: 2,
		styleOverrides: { button: (_visualStyles, ctx) => (ctx.state === "hovered" ? { strokeTransparency: 0 } : {}) },
	},
	{ value: 12, onChange: () => undefined },
	{ value: 24, onChange: () => undefined, onChangeEnd: () => undefined },
	{ defaultValue: 3, min: 0, max: 10, step: 1 },
	{ defaultValue: 1.5, min: 0, max: 5, step: 0.25 },
	{ defaultValue: 8, min: 10, max: 2 },
	{ disabled: true, defaultValue: 2 },
	{ readOnly: true, defaultValue: 6 },
	{ fullWidth: true, defaultValue: 9 },
	{ variant: "filled", size: "lg", defaultValue: 18 },
	{ width: 220, minWidth: 160, maxWidth: 280, p: "xs", layoutOrder: 2, defaultValue: 5 },
	{ defaultValue: 65, formatValue: (currentValue) => `${tostring(currentValue)}%` },
	{ slotProps: { root: { BackgroundTransparency: 0.05 } }, defaultValue: 2 },
	{
		slotProps: { frame: { BackgroundTransparency: 0.02 }, railValue: { TextXAlignment: Enum.TextXAlignment.Right } },
		defaultValue: 4,
	},
	{
		slotProps: {
			decrement: { AutoButtonColor: true, NextSelectionRight: stepperInputRef.current },
			increment: { AutoButtonColor: true, NextSelectionLeft: stepperInputRef.current },
		},
		defaultValue: 3,
	},
	{ slotProps: { decrementText: { Text: "<" }, incrementText: { Text: ">" } }, defaultValue: 7 },
	{
		slotProps: { frameCorner: { CornerRadius: new UDim(0, 12) }, buttonCorner: { CornerRadius: new UDim(0, 8) } },
		defaultValue: 8,
	},
	{ slotProps: { frameStroke: { Thickness: 2 }, buttonStroke: { Thickness: 2 } }, defaultValue: 9 },
	{
		slotProps: { framePadding: { PaddingLeft: new UDim(0, 4) }, buttonPadding: { PaddingRight: new UDim(0, 10) } },
		defaultValue: 1,
	},
	{
		slotProps: { listLayout: { Padding: new UDim(0, 4) }, sizeConstraint: { MinSize: new Vector2(180, 36) } },
		defaultValue: 1,
	},
	{ ref: stepperInputRef, defaultValue: 3 },
];

const validExportedStepperInputProps: ExportedStepperInputProps[] = [
	{ defaultValue: 4 },
	{ defaultValue: 6, styleOverrides: stepperInputStyleOverrides },
	{ value: 8, onChange: () => undefined, cursor: "resize-ew" },
	{ defaultValue: 2, min: 0, max: 10, step: 2, size: "sm" },
	{ defaultValue: 75, formatValue: (currentValue) => `${tostring(currentValue)} HP`, readOnly: true },
];

const validStepperInputExamples = [
	<StepperInput key="uncontrolled" defaultValue={4} />,
	<StepperInput key="controlled" value={8} onChange={() => undefined} onChangeEnd={() => undefined} />,
	<StepperInput key="ranged" defaultValue={6} min={0} max={10} step={1} />,
	<StepperInput key="precision" defaultValue={1.5} min={0} max={4} step={0.25} />,
	<StepperInput key="disabled" disabled defaultValue={2} />,
	<StepperInput
		key="readonly"
		readOnly
		defaultValue={10}
		formatValue={(currentValue) => `${tostring(currentValue)} locked`}
	/>,
	<StepperInput key="full-width" fullWidth defaultValue={54} />,
	<StepperInput
		key="slots"
		defaultValue={3}
		slotProps={{
			root: { ZIndex: 3 },
			frame: { BackgroundTransparency: 0.04 },
			rail: { ZIndex: 4 },
			railFill: { BackgroundTransparency: 0.45 },
			railValue: { Text: "Value" },
			decrementText: { Text: "DOWN" },
			incrementText: { Text: "UP" },
			buttonStroke: { Thickness: 2 },
		}}
	/>,
	<StepperInput key="ref" ref={stepperInputRef} defaultValue={4} />,
];

const acceptsStepperInputChildren: React.ReactNode = validStepperInputExamples;
const acceptsStepperInputProps: StepperInputProps[] = validStepperInputProps;
const acceptsExportedStepperInputProps: ExportedStepperInputProps[] = validExportedStepperInputProps;

type StepperInputHasChildrenProp = "children" extends keyof StepperInputProps ? true : false;
type StepperInputHasNoAmbiguousSelectionNeighbor = AssertFalse<HasProp<StepperInputProps, "nextSelectionLeft">>;
type InvalidStepperInputVariantAllowed = "ghost" extends NonNullable<StepperInputProps["variant"]> ? true : false;
type InvalidStepperInputValueAllowed = string extends NonNullable<StepperInputProps["value"]> ? true : false;
type InvalidStepperInputDefaultValueAllowed =
	string extends NonNullable<StepperInputProps["defaultValue"]> ? true : false;
type InvalidStepperInputStepAllowed = string extends NonNullable<StepperInputProps["step"]> ? true : false;
type InvalidStepperInputFormatAllowed = string extends NonNullable<StepperInputProps["formatValue"]> ? true : false;
type ExportedStepperInputValueAllowed = 42 extends NonNullable<ExportedStepperInputProps["value"]> ? true : false;
type StepperInputVisualStyleKey = keyof StepperInputFrameVisualStyles | keyof StepperInputButtonVisualStyles;
type StepperInputStyleOverridesAssignableToProp = AssertTrue<
	IsAssignable<StepperInputStyleOverrides, StepperInputProps["styleOverrides"]>
>;
type StepperInputStyleOverridesAssignableToExportedProp = AssertTrue<
	IsAssignable<StepperInputStyleOverrides, ExportedStepperInputProps["styleOverrides"]>
>;
type StepperInputVisualStylesHaveNoRadius = AssertFalse<IsAssignable<"radius", StepperInputVisualStyleKey>>;
type StepperInputVisualStylesHaveNoButtonRadius = AssertFalse<IsAssignable<"buttonRadius", StepperInputVisualStyleKey>>;
type StepperInputVisualStylesHaveNoPadding = AssertFalse<IsAssignable<"padding", StepperInputVisualStyleKey>>;
type StepperInputVisualStylesHaveNoFontSize = AssertFalse<IsAssignable<"fontSize", StepperInputVisualStyleKey>>;
type StepperInputVisualStylesHaveNoButtonWidth = AssertFalse<IsAssignable<"buttonWidth", StepperInputVisualStyleKey>>;
type StepperInputVisualStylesHaveNoGap = AssertFalse<IsAssignable<"gap", StepperInputVisualStyleKey>>;

const stepperInputHasChildrenProp: StepperInputHasChildrenProp = false;
const stepperInputHasNoAmbiguousSelectionNeighbor: StepperInputHasNoAmbiguousSelectionNeighbor = false;
const invalidStepperInputVariant: InvalidStepperInputVariantAllowed = false;
const invalidStepperInputValue: InvalidStepperInputValueAllowed = false;
const invalidStepperInputDefaultValue: InvalidStepperInputDefaultValueAllowed = false;
const invalidStepperInputStep: InvalidStepperInputStepAllowed = false;
const invalidStepperInputFormat: InvalidStepperInputFormatAllowed = false;
const exportedStepperInputValue: ExportedStepperInputValueAllowed = true;
const stepperInputStyleOverridesAssignableToProp: StepperInputStyleOverridesAssignableToProp = true;
const stepperInputStyleOverridesAssignableToExportedProp: StepperInputStyleOverridesAssignableToExportedProp = true;
const stepperInputVisualStylesHaveNoRadius: StepperInputVisualStylesHaveNoRadius = false;
const stepperInputVisualStylesHaveNoButtonRadius: StepperInputVisualStylesHaveNoButtonRadius = false;
const stepperInputVisualStylesHaveNoPadding: StepperInputVisualStylesHaveNoPadding = false;
const stepperInputVisualStylesHaveNoFontSize: StepperInputVisualStylesHaveNoFontSize = false;
const stepperInputVisualStylesHaveNoButtonWidth: StepperInputVisualStylesHaveNoButtonWidth = false;
const stepperInputVisualStylesHaveNoGap: StepperInputVisualStylesHaveNoGap = false;

export {
	acceptsExportedStepperInputProps,
	acceptsStepperInputChildren,
	acceptsStepperInputProps,
	exportedStepperInputValue,
	invalidStepperInputDefaultValue,
	invalidStepperInputFormat,
	invalidStepperInputStep,
	invalidStepperInputValue,
	invalidStepperInputVariant,
	stepperInputHasChildrenProp,
	stepperInputHasNoAmbiguousSelectionNeighbor,
	stepperInputStyleOverrides,
	stepperInputStyleOverridesAssignableToExportedProp,
	stepperInputStyleOverridesAssignableToProp,
	stepperInputVisualStylesHaveNoButtonRadius,
	stepperInputVisualStylesHaveNoButtonWidth,
	stepperInputVisualStylesHaveNoFontSize,
	stepperInputVisualStylesHaveNoGap,
	stepperInputVisualStylesHaveNoPadding,
	stepperInputVisualStylesHaveNoRadius,
};
