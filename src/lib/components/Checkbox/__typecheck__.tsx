import React from "@rbxts/react";

import { Checkbox } from "./Checkbox";
import type { CheckboxProps } from "./types";

const checkboxRef = React.createRef<TextButton>();
type ExportedCheckboxProps = React.ComponentProps<typeof Checkbox>;

const validCheckboxProps: CheckboxProps[] = [
	{ defaultChecked: true },
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

const checkboxHasChildrenProp: CheckboxHasChildrenProp = false;
const invalidCheckboxColor: InvalidCheckboxColorAllowed = false;
const invalidCheckboxChecked: InvalidCheckboxCheckedAllowed = false;
const checkboxLabelNumber: CheckboxLabelNumberAllowed = true;
const exportedCheckboxChecked: ExportedCheckboxCheckedAllowed = true;
const exportedCheckboxDefaultChecked: ExportedCheckboxDefaultCheckedAllowed = true;

export {
	acceptsCheckboxChildren,
	acceptsCheckboxProps,
	acceptsExportedCheckboxProps,
	checkboxHasChildrenProp,
	checkboxLabelNumber,
	exportedCheckboxChecked,
	exportedCheckboxDefaultChecked,
	invalidCheckboxChecked,
	invalidCheckboxColor,
};
