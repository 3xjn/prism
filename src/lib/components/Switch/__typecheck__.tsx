import React from "@rbxts/react";

import { Switch } from "./Switch";
import type { SwitchProps } from "./types";

const switchRef = React.createRef<TextButton>();
type ExportedSwitchProps = React.ComponentProps<typeof Switch>;

const validSwitchProps: SwitchProps[] = [
	{ defaultChecked: true },
	{ checked: true, onChange: () => undefined },
	{ label: "Enable notifications", defaultChecked: true },
	{ label: "Disabled", disabled: true, checked: false, onChange: () => undefined },
	{ label: "Cursor default", cursor: "default", defaultChecked: true },
	{ color: "secondary", size: "sm", defaultChecked: true },
	{ icons: { unchecked: "x" } },
	{ icons: { checked: "check" }, checked: true, onChange: () => undefined },
	{ icons: { unchecked: "x", hover: { unchecked: "settings", checked: "info" }, checked: "check" } },
	{ icons: { unchecked: "x", checked: "check", hover: { checked: "info" } }, disabled: true, checked: true },
	{ width: 260, minWidth: 180, layoutOrder: 2, p: "xs" },
	{ slotProps: { root: { AutoButtonColor: true } } },
	{ slotProps: { track: { BackgroundTransparency: 0.05 }, thumb: { BackgroundTransparency: 0.08 } } },
	{ slotProps: { icon: { ImageTransparency: 0.2, ScaleType: Enum.ScaleType.Crop } }, icons: { checked: "check" } },
	{ slotProps: { trackCorner: { CornerRadius: new UDim(0, 999) }, thumbCorner: { CornerRadius: new UDim(0, 999) } } },
	{ slotProps: { trackStroke: { Thickness: 2 } } },
	{ slotProps: { padding: { PaddingLeft: new UDim(0, 6) }, listLayout: { Padding: new UDim(0, 12) } } },
	{ slotProps: { sizeConstraint: { MinSize: new Vector2(220, 28) } } },
	{ slotProps: { label: { TextColor3: Color3.fromRGB(82, 98, 126) } } },
	{ ref: switchRef, label: "Ref switch" },
];

const validExportedSwitchProps: ExportedSwitchProps[] = [
	{ defaultChecked: true },
	{ defaultChecked: true, cursor: "rbxasset://SystemCursors/PointingHand" },
	{ checked: false, onChange: () => undefined, color: "primary" },
	{ label: "Presence", size: "lg" },
	{ icons: { unchecked: "x", checked: "check", hover: { checked: "info" } } },
	{ label: 42 },
];

const validSwitchExamples = [
	<Switch key="uncontrolled" defaultChecked />,
	<Switch key="controlled" checked onChange={() => undefined} />,
	<Switch key="labeled" label="Enable analytics" checked={false} onChange={() => undefined} />,
	<Switch key="compact" label="Compact" size="xs" color="info" defaultChecked />,
	<Switch key="disabled" disabled defaultChecked label="Disabled" />,
	<Switch key="unchecked-icon" icons={{ unchecked: "x" }} defaultChecked={false} />,
	<Switch key="checked-icon" icons={{ checked: "check" }} checked onChange={() => undefined} />,
	<Switch key="hover-icon" icons={{ unchecked: "x", checked: "check", hover: { unchecked: "settings", checked: "info" } }} />,
	<Switch key="disabled-icons" disabled icons={{ unchecked: "x", checked: "check", hover: { unchecked: "settings" } }} defaultChecked />,
	<Switch key="slots" slotProps={{ root: { ZIndex: 4 }, track: { Rotation: 0 }, label: { Text: "Override" } }} />,
	<Switch key="icon-slot" icons={{ checked: "check" }} slotProps={{ icon: { ImageTransparency: 0.1, ZIndex: 12 } }} />,
	<Switch key="ref" ref={switchRef} defaultChecked={false} />,
];

const acceptsSwitchChildren: React.ReactNode = validSwitchExamples;
const acceptsSwitchProps: SwitchProps[] = validSwitchProps;
const acceptsExportedSwitchProps: ExportedSwitchProps[] = validExportedSwitchProps;

type SwitchHasChildrenProp = "children" extends keyof SwitchProps ? true : false;
type InvalidSwitchColorAllowed = "palette.primary.5" extends NonNullable<SwitchProps["color"]> ? true : false;
type InvalidSwitchCheckedAllowed = string extends NonNullable<SwitchProps["checked"]> ? true : false;
type SwitchLabelNumberAllowed = 42 extends NonNullable<SwitchProps["label"]> ? true : false;
type ExportedSwitchCheckedAllowed = true extends NonNullable<ExportedSwitchProps["checked"]> ? true : false;
type ExportedSwitchDefaultCheckedAllowed = true extends NonNullable<ExportedSwitchProps["defaultChecked"]> ? true : false;

const switchHasChildrenProp: SwitchHasChildrenProp = false;
const invalidSwitchColor: InvalidSwitchColorAllowed = false;
const invalidSwitchChecked: InvalidSwitchCheckedAllowed = false;
const switchLabelNumber: SwitchLabelNumberAllowed = true;
const exportedSwitchChecked: ExportedSwitchCheckedAllowed = true;
const exportedSwitchDefaultChecked: ExportedSwitchDefaultCheckedAllowed = true;

export {
	acceptsExportedSwitchProps,
	acceptsSwitchChildren,
	acceptsSwitchProps,
	exportedSwitchChecked,
	exportedSwitchDefaultChecked,
	invalidSwitchChecked,
	invalidSwitchColor,
	switchHasChildrenProp,
	switchLabelNumber,
};
