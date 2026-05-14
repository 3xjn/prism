import React from "@rbxts/react";

import { Input } from "./Input";
import type { InputProps } from "./types";

const inputRef = React.createRef<TextBox>();
type InputRenderer = (props: InputProps) => React.ReactElement;
type ExportedInputProps = React.ComponentProps<typeof Input>;

function renderInput(props: InputProps): React.ReactElement {
	return (Input as InputRenderer)(props);
}

const validInputProps: InputProps[] = [
	{ placeholder: "Search Prism", defaultValue: "Initial" },
	{ value: "Controlled", onChange: () => undefined },
	{ placeholder: "Readonly", readOnly: true, defaultValue: "Locked" },
	{ placeholder: "Disabled", disabled: true },
	{ placeholder: "Cursor pointer", cursor: "pointer" },
	{ placeholder: "Wide", fullWidth: true },
	{ placeholder: "Tone", variant: "subtle", color: "secondary", size: "sm" },
	{ placeholder: "Layout", width: 240, minWidth: 180, maxWidth: 320, p: "xs", layoutOrder: 2 },
	{ placeholder: "Root slot", slotProps: { root: { BackgroundTransparency: 0.05 } } },
	{ placeholder: "Textbox slot", slotProps: { textbox: { ClearTextOnFocus: true, TextXAlignment: Enum.TextXAlignment.Center } } },
	{ placeholder: "Decorators", slotProps: { corner: { CornerRadius: new UDim(0, 12) }, stroke: { Thickness: 2 } } },
	{ placeholder: "Padding", slotProps: { padding: { PaddingLeft: new UDim(0, 18) } } },
	{ placeholder: "Constraint", slotProps: { sizeConstraint: { MinSize: new Vector2(220, 36) } } },
	{ placeholder: "Ref", ref: inputRef },
];

const validExportedInputProps: ExportedInputProps[] = [
	{ placeholder: "Search" },
	{ placeholder: "Pointer", cursor: "pointer" },
	{ value: "Prism", onChange: () => undefined, variant: "outline", color: "primary" },
	{ defaultValue: "Theme", size: "lg", readOnly: true },
];

const validInputExamples = [
	renderInput({ placeholder: "Search" }),
	renderInput({ defaultValue: "PlayerOne", size: "sm" }),
	renderInput({ value: "Command palette", onChange: () => undefined, variant: "subtle", color: "secondary" }),
	renderInput({ defaultValue: "Readonly", readOnly: true, color: "info", variant: "light" }),
	renderInput({ disabled: true, placeholder: "Disabled" }),
	renderInput({ slotProps: { root: { ZIndex: 4 }, textbox: { PlaceholderText: "Override" } } }),
	renderInput({ ref: inputRef, defaultValue: "Ref input" }),
];

const acceptsInputChildren: React.ReactNode = validInputExamples;
const acceptsInputProps: InputProps[] = validInputProps;
const acceptsExportedInputProps: ExportedInputProps[] = validExportedInputProps;

type InputHasChildrenProp = "children" extends keyof InputProps ? true : false;
type InvalidInputColorAllowed = "palette.primary.5" extends NonNullable<InputProps["color"]> ? true : false;
type InvalidInputVariantAllowed = "ghost" extends NonNullable<InputProps["variant"]> ? true : false;
type InvalidInputValueAllowed = number extends NonNullable<InputProps["value"]> ? true : false;
type ExportedInputValueAllowed = "Prism" extends NonNullable<ExportedInputProps["value"]> ? true : false;

const inputHasChildrenProp: InputHasChildrenProp = false;
const invalidInputColor: InvalidInputColorAllowed = false;
const invalidInputVariant: InvalidInputVariantAllowed = false;
const invalidInputValue: InvalidInputValueAllowed = false;
const exportedInputValue: ExportedInputValueAllowed = true;

export {
	acceptsExportedInputProps,
	acceptsInputChildren,
	acceptsInputProps,
	exportedInputValue,
	inputHasChildrenProp,
	invalidInputColor,
	invalidInputValue,
	invalidInputVariant,
};
