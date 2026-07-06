import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { Checkbox } from "./Checkbox";
import type { CheckboxProps, CheckboxStyleOverride, CheckboxStyleOverrideContext, CheckboxVisualStyles } from "./types";

const checkboxRef = React.createRef<TextButton>();
type ExportedCheckboxProps = React.ComponentProps<typeof Checkbox>;

const checkboxStyleOverride: CheckboxStyleOverride = (_visualStyles, ctx) => {
	if (ctx.state === "hovered") {
		return { markStrokeTransparency: 0, markStrokeColor: ctx.theme.colors[ctx.color].main };
	}

	if (ctx.state === "pressed" && ctx.checked) {
		return { fillColor: ctx.theme.colors[ctx.color].dark };
	}

	return {};
};

const validCheckboxProps: CheckboxProps[] = [
	{ defaultChecked: true },
	{ label: "Override", styleOverrides: checkboxStyleOverride },
	{ checked: true, onChange: () => undefined },
	{ label: "Accept mission rules", defaultChecked: true },
	{ label: "Disabled", disabled: true, checked: false, onChange: () => undefined },
	{ label: "Cursor default", cursor: "default", defaultChecked: true },
	{ color: "secondary", size: "sm", defaultChecked: true },
	{ width: 260, minWidth: 180, layoutOrder: 2, p: "xs" },
	{ slotProps: { root: { AutoButtonColor: true } } },
	{ slotProps: { mark: { BackgroundTransparency: 0.05 }, fill: { BackgroundTransparency: 0.08 } } },
	{ slotProps: { glyph: { ImageTransparency: 0.2, ScaleType: Enum.ScaleType.Crop } } },
	{ slotProps: { markCorner: { CornerRadius: new UDim(0, 8) }, fillCorner: { CornerRadius: new UDim(0, 8) } } },
	{ slotProps: { markStroke: { Thickness: 2 } } },
	{ slotProps: { padding: { PaddingLeft: new UDim(0, 6) }, listLayout: { Padding: new UDim(0, 12) } } },
	{ slotProps: { sizeConstraint: { MinSize: new Vector2(220, 28) } } },
	{ slotProps: { label: { TextColor3: Color3.fromRGB(82, 98, 126) } } },
	{ ref: checkboxRef, label: "Ref checkbox" },
];

const validExportedCheckboxProps: ExportedCheckboxProps[] = [
	{ defaultChecked: true },
	{ defaultChecked: true, cursor: "rbxasset://SystemCursors/PointingHand" },
	{ checked: false, onChange: () => undefined, color: "primary" },
	{ label: "Presence", size: "lg" },
	{ label: 42 },
];

const validCheckboxExamples = [
	<Checkbox key="uncontrolled" defaultChecked />,
	<Checkbox key="controlled" checked onChange={() => undefined} />,
	<Checkbox key="labeled" label="Enable analytics" checked={false} onChange={() => undefined} />,
	<Checkbox key="compact" label="Compact" size="xs" color="info" defaultChecked />,
	<Checkbox key="disabled" disabled defaultChecked label="Disabled" />,
	<Checkbox key="slots" slotProps={{ root: { ZIndex: 4 }, mark: { Rotation: 0 }, label: { Text: "Override" } }} />,
	<Checkbox key="glyph-slot" slotProps={{ glyph: { ImageTransparency: 0.1, ZIndex: 12 } }} />,
	<Checkbox key="ref" ref={checkboxRef} defaultChecked={false} />,
];

const acceptsCheckboxChildren: React.ReactNode = validCheckboxExamples;
const acceptsCheckboxProps: CheckboxProps[] = validCheckboxProps;
const acceptsExportedCheckboxProps: ExportedCheckboxProps[] = validExportedCheckboxProps;

type CheckboxHasChildrenProp = "children" extends keyof CheckboxProps ? true : false;
type InvalidCheckboxColorAllowed = "palette.primary.5" extends NonNullable<CheckboxProps["color"]> ? true : false;
type InvalidCheckboxCheckedAllowed = string extends NonNullable<CheckboxProps["checked"]> ? true : false;
type CheckboxLabelNumberAllowed = 42 extends NonNullable<CheckboxProps["label"]> ? true : false;
type ExportedCheckboxCheckedAllowed = true extends NonNullable<ExportedCheckboxProps["checked"]> ? true : false;
type ExportedCheckboxDefaultCheckedAllowed = true extends NonNullable<ExportedCheckboxProps["defaultChecked"]> ? true : false;
type CheckboxStyleOverrideAssignableToProp = AssertTrue<IsAssignable<CheckboxStyleOverride, CheckboxProps["styleOverrides"]>>;
type CheckboxStyleOverrideAssignableToExportedProp = AssertTrue<
	IsAssignable<CheckboxStyleOverride, ExportedCheckboxProps["styleOverrides"]>
>;
type CheckboxStyleOverrideContextHasFields = AssertTrue<
	IsAssignable<"theme" | "color" | "size" | "state" | "checked", keyof CheckboxStyleOverrideContext>
>;
type CheckboxStyleOverrideContextHasTheme = AssertTrue<HasProp<CheckboxStyleOverrideContext, "theme">>;
type CheckboxStyleOverrideContextHasNoDisabled = AssertFalse<IsAssignable<"disabled", keyof CheckboxStyleOverrideContext>>;
type CheckboxVisualStyleOverrideFieldsAllowed = AssertTrue<
	IsAssignable<
		{
			readonly markColor: Color3;
			readonly markStrokeTransparency: number;
			readonly fillColor: Color3;
			readonly glyphTransparency: number;
			readonly labelColor: Color3;
		},
		Partial<CheckboxVisualStyles>
	>
>;
type CheckboxVisualStylesHasNoRadius = AssertFalse<IsAssignable<"radius", keyof CheckboxVisualStyles>>;
type CheckboxVisualStylesHasNoCornerRadius = AssertFalse<IsAssignable<"cornerRadius", keyof CheckboxVisualStyles>>;
type CheckboxVisualStylesHasNoPadding = AssertFalse<IsAssignable<"padding", keyof CheckboxVisualStyles>>;
type CheckboxVisualStylesHasNoFontSize = AssertFalse<IsAssignable<"fontSize", keyof CheckboxVisualStyles>>;
type CheckboxVisualStylesHasNoLabelSize = AssertFalse<IsAssignable<"labelSize", keyof CheckboxVisualStyles>>;
type CheckboxVisualStylesHasNoMarkWidth = AssertFalse<IsAssignable<"markWidth", keyof CheckboxVisualStyles>>;
type CheckboxVisualStylesHasNoLayout = AssertFalse<IsAssignable<"layout", keyof CheckboxVisualStyles>>;
type CheckboxVisualStylesHasNoSlotProps = AssertFalse<IsAssignable<"slotProps", keyof CheckboxVisualStyles>>;

const checkboxHasChildrenProp: CheckboxHasChildrenProp = false;
const invalidCheckboxColor: InvalidCheckboxColorAllowed = false;
const invalidCheckboxChecked: InvalidCheckboxCheckedAllowed = false;
const checkboxLabelNumber: CheckboxLabelNumberAllowed = true;
const exportedCheckboxChecked: ExportedCheckboxCheckedAllowed = true;
const exportedCheckboxDefaultChecked: ExportedCheckboxDefaultCheckedAllowed = true;
const checkboxStyleOverrideAssignableToProp: CheckboxStyleOverrideAssignableToProp = true;
const checkboxStyleOverrideAssignableToExportedProp: CheckboxStyleOverrideAssignableToExportedProp = true;
const checkboxStyleOverrideContextHasFields: CheckboxStyleOverrideContextHasFields = true;
const checkboxStyleOverrideContextHasTheme: CheckboxStyleOverrideContextHasTheme = true;
const checkboxStyleOverrideContextHasNoDisabled: CheckboxStyleOverrideContextHasNoDisabled = false;
const checkboxVisualStyleOverrideFieldsAllowed: CheckboxVisualStyleOverrideFieldsAllowed = true;
const checkboxVisualStylesHasNoRadius: CheckboxVisualStylesHasNoRadius = false;
const checkboxVisualStylesHasNoCornerRadius: CheckboxVisualStylesHasNoCornerRadius = false;
const checkboxVisualStylesHasNoPadding: CheckboxVisualStylesHasNoPadding = false;
const checkboxVisualStylesHasNoFontSize: CheckboxVisualStylesHasNoFontSize = false;
const checkboxVisualStylesHasNoLabelSize: CheckboxVisualStylesHasNoLabelSize = false;
const checkboxVisualStylesHasNoMarkWidth: CheckboxVisualStylesHasNoMarkWidth = false;
const checkboxVisualStylesHasNoLayout: CheckboxVisualStylesHasNoLayout = false;
const checkboxVisualStylesHasNoSlotProps: CheckboxVisualStylesHasNoSlotProps = false;

export {
	acceptsCheckboxChildren,
	acceptsCheckboxProps,
	acceptsExportedCheckboxProps,
	checkboxHasChildrenProp,
	checkboxLabelNumber,
	checkboxStyleOverride,
	checkboxStyleOverrideAssignableToExportedProp,
	checkboxStyleOverrideAssignableToProp,
	checkboxStyleOverrideContextHasFields,
	checkboxStyleOverrideContextHasNoDisabled,
	checkboxStyleOverrideContextHasTheme,
	checkboxVisualStyleOverrideFieldsAllowed,
	checkboxVisualStylesHasNoCornerRadius,
	checkboxVisualStylesHasNoFontSize,
	checkboxVisualStylesHasNoLabelSize,
	checkboxVisualStylesHasNoLayout,
	checkboxVisualStylesHasNoMarkWidth,
	checkboxVisualStylesHasNoPadding,
	checkboxVisualStylesHasNoRadius,
	checkboxVisualStylesHasNoSlotProps,
	exportedCheckboxChecked,
	exportedCheckboxDefaultChecked,
	invalidCheckboxChecked,
	invalidCheckboxColor,
};
