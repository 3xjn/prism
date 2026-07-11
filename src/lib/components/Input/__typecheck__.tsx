import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { Input } from "./Input";
import type { InputProps, InputStyleOverride, InputStyleOverrideContext, InputVisualStyles } from "./types";

const inputRef = React.createRef<TextBox>();
type InputRenderer = (props: InputProps) => React.ReactElement;
type ExportedInputProps = React.ComponentProps<typeof Input>;

function renderInput(props: InputProps): React.ReactElement {
	return (Input as InputRenderer)(props);
}

const inputStyleOverride: InputStyleOverride = (_visualStyles, ctx) => {
	if (ctx.state === "focused") {
		return { strokeColor: ctx.theme.colors[ctx.color].dark, strokeThickness: ctx.size === "xl" ? 2 : 1.5 };
	}

	if (ctx.state === "hovered") {
		return { backgroundColor: ctx.theme.colors.background.surface, strokeTransparency: 0 };
	}

	if (ctx.readOnly) {
		return { textColor: ctx.theme.colors.text.secondary };
	}

	return {};
};

const validInputProps: InputProps[] = [
	{ placeholder: "Search Prism", defaultValue: "Initial" },
	{ placeholder: "Override", styleOverrides: inputStyleOverride },
	{ placeholder: "Max length", defaultValue: "Clamped", maxLength: 12 },
	{ value: "Controlled", onChange: () => undefined },
	{ placeholder: "Readonly", readOnly: true, defaultValue: "Locked" },
	{ placeholder: "Disabled", disabled: true },
	{ placeholder: "Cursor pointer", cursor: "pointer" },
	{ placeholder: "Wide", fullWidth: true },
	{ placeholder: "Tone", variant: "subtle", color: "secondary", size: "sm" },
	{
		placeholder: "Navigation",
		selectable: true,
		selectionOrder: 10,
		nextSelectionUp: inputRef.current,
		nextSelectionDown: inputRef.current,
	},
	{ placeholder: "Disabled slot escape", disabled: true, selectable: true, slotProps: { textbox: { Selectable: true } } },
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
	{ placeholder: "Override", styleOverrides: inputStyleOverride },
	{ placeholder: "Pointer", cursor: "pointer" },
	{ placeholder: "Ordered", selectionOrder: 20, nextSelectionRight: inputRef.current },
	{ value: "Prism", onChange: () => undefined, variant: "outline", color: "primary", maxLength: 20 },
	{ defaultValue: "Theme", size: "lg", readOnly: true },
];

const validInputExamples = [
	renderInput({ placeholder: "Search" }),
	renderInput({ defaultValue: "PlayerOne", size: "sm" }),
	renderInput({ value: "Command palette", onChange: () => undefined, variant: "subtle", color: "secondary" }),
	renderInput({ defaultValue: "Short code", maxLength: 8 }),
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
type InputStyleOverrideAssignableToProp = AssertTrue<IsAssignable<InputStyleOverride, InputProps["styleOverrides"]>>;
type InputStyleOverrideAssignableToExportedProp = AssertTrue<
	IsAssignable<InputStyleOverride, ExportedInputProps["styleOverrides"]>
>;
type InputStyleOverrideContextHasFields = AssertTrue<
	IsAssignable<"theme" | "variant" | "color" | "size" | "readOnly" | "state", keyof InputStyleOverrideContext>
>;
type InputStyleOverrideContextHasTheme = AssertTrue<HasProp<InputStyleOverrideContext, "theme">>;
type InputStyleOverrideContextHasNoDisabled = AssertFalse<IsAssignable<"disabled", keyof InputStyleOverrideContext>>;
type InputVisualStyleOverrideFieldsAllowed = AssertTrue<
	IsAssignable<
		{
			readonly backgroundColor: Color3;
			readonly strokeColor: Color3;
			readonly strokeTransparency: number;
			readonly strokeThickness: number;
			readonly textColor: Color3;
			readonly placeholderColor: Color3;
		},
		Partial<InputVisualStyles>
	>
>;
type InputVisualStylesHasNoRadius = AssertFalse<IsAssignable<"radius", keyof InputVisualStyles>>;
type InputVisualStylesHasNoCornerRadius = AssertFalse<IsAssignable<"cornerRadius", keyof InputVisualStyles>>;
type InputVisualStylesHasNoPadding = AssertFalse<IsAssignable<"padding", keyof InputVisualStyles>>;
type InputVisualStylesHasNoPaddingX = AssertFalse<IsAssignable<"paddingX", keyof InputVisualStyles>>;
type InputVisualStylesHasNoFont = AssertFalse<IsAssignable<"font", keyof InputVisualStyles>>;
type InputVisualStylesHasNoFontSize = AssertFalse<IsAssignable<"fontSize", keyof InputVisualStyles>>;
type InputVisualStylesHasNoTextSize = AssertFalse<IsAssignable<"textSize", keyof InputVisualStyles>>;
type InputVisualStylesHasNoLineHeight = AssertFalse<IsAssignable<"lineHeight", keyof InputVisualStyles>>;
type InputVisualStylesHasNoLayout = AssertFalse<IsAssignable<"layout", keyof InputVisualStyles>>;
type InputVisualStylesHasNoSlotProps = AssertFalse<IsAssignable<"slotProps", keyof InputVisualStyles>>;

const inputHasChildrenProp: InputHasChildrenProp = false;
const invalidInputColor: InvalidInputColorAllowed = false;
const invalidInputVariant: InvalidInputVariantAllowed = false;
const invalidInputValue: InvalidInputValueAllowed = false;
const exportedInputValue: ExportedInputValueAllowed = true;
const inputStyleOverrideAssignableToProp: InputStyleOverrideAssignableToProp = true;
const inputStyleOverrideAssignableToExportedProp: InputStyleOverrideAssignableToExportedProp = true;
const inputStyleOverrideContextHasFields: InputStyleOverrideContextHasFields = true;
const inputStyleOverrideContextHasTheme: InputStyleOverrideContextHasTheme = true;
const inputStyleOverrideContextHasNoDisabled: InputStyleOverrideContextHasNoDisabled = false;
const inputVisualStyleOverrideFieldsAllowed: InputVisualStyleOverrideFieldsAllowed = true;
const inputVisualStylesHasNoRadius: InputVisualStylesHasNoRadius = false;
const inputVisualStylesHasNoCornerRadius: InputVisualStylesHasNoCornerRadius = false;
const inputVisualStylesHasNoPadding: InputVisualStylesHasNoPadding = false;
const inputVisualStylesHasNoPaddingX: InputVisualStylesHasNoPaddingX = false;
const inputVisualStylesHasNoFont: InputVisualStylesHasNoFont = false;
const inputVisualStylesHasNoFontSize: InputVisualStylesHasNoFontSize = false;
const inputVisualStylesHasNoTextSize: InputVisualStylesHasNoTextSize = false;
const inputVisualStylesHasNoLineHeight: InputVisualStylesHasNoLineHeight = false;
const inputVisualStylesHasNoLayout: InputVisualStylesHasNoLayout = false;
const inputVisualStylesHasNoSlotProps: InputVisualStylesHasNoSlotProps = false;

export {
	acceptsExportedInputProps,
	acceptsInputChildren,
	acceptsInputProps,
	exportedInputValue,
	inputHasChildrenProp,
	inputStyleOverride,
	inputStyleOverrideAssignableToExportedProp,
	inputStyleOverrideAssignableToProp,
	inputStyleOverrideContextHasFields,
	inputStyleOverrideContextHasNoDisabled,
	inputStyleOverrideContextHasTheme,
	inputVisualStyleOverrideFieldsAllowed,
	inputVisualStylesHasNoCornerRadius,
	inputVisualStylesHasNoFont,
	inputVisualStylesHasNoFontSize,
	inputVisualStylesHasNoLayout,
	inputVisualStylesHasNoLineHeight,
	inputVisualStylesHasNoPadding,
	inputVisualStylesHasNoPaddingX,
	inputVisualStylesHasNoRadius,
	inputVisualStylesHasNoSlotProps,
	inputVisualStylesHasNoTextSize,
	invalidInputColor,
	invalidInputValue,
	invalidInputVariant,
};
