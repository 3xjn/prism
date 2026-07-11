import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { Switch } from "./Switch";
import type { SwitchProps, SwitchStyleOverride, SwitchStyleOverrideContext, SwitchVisualStyles } from "./types";

const switchRef = React.createRef<TextButton>();
type ExportedSwitchProps = React.ComponentProps<typeof Switch>;

const switchStyleOverride: SwitchStyleOverride = (_visualStyles, ctx) => {
	if (ctx.state === "hovered") {
		return { trackStrokeTransparency: 0 };
	}

	if (ctx.state === "pressed") {
		return { trackColor: ctx.theme.colors[ctx.color].dark, thumbColor: ctx.checked ? ctx.theme.colors[ctx.color].light : ctx.theme.colors.background.surface };
	}

	return {};
};

const validSwitchProps: SwitchProps[] = [
	{ defaultChecked: true },
	{ checked: true, onChange: () => undefined },
	{ label: "Enable notifications", defaultChecked: true },
	{ label: "Disabled", disabled: true, checked: false, onChange: () => undefined },
	{ label: "Cursor default", cursor: "default", defaultChecked: true },
	{ color: "secondary", size: "sm", defaultChecked: true },
	{ label: "Navigation", selectable: true, selectionOrder: 10, nextSelectionRight: switchRef.current },
	{ label: "Disabled slot escape", disabled: true, selectable: true, slotProps: { root: { Selectable: true } } },
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
	{ styleOverrides: switchStyleOverride },
	{ ref: switchRef, label: "Ref switch" },
];

const validExportedSwitchProps: ExportedSwitchProps[] = [
	{ defaultChecked: true },
	{ defaultChecked: true, cursor: "rbxasset://SystemCursors/PointingHand" },
	{ checked: false, onChange: () => undefined, color: "primary" },
	{ label: "Presence", size: "lg" },
	{ label: "Ordered", selectionOrder: 20, nextSelectionDown: switchRef.current },
	{ icons: { unchecked: "x", checked: "check", hover: { checked: "info" } } },
	{ label: 42 },
	{ styleOverrides: switchStyleOverride },
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
type SwitchStyleOverrideAssignableToProp = AssertTrue<IsAssignable<SwitchStyleOverride, SwitchProps["styleOverrides"]>>;
type SwitchStyleOverrideAssignableToExportedProp = AssertTrue<IsAssignable<SwitchStyleOverride, ExportedSwitchProps["styleOverrides"]>>;
type SwitchStyleOverrideContextHasFields = AssertTrue<
	IsAssignable<"theme" | "color" | "size" | "state" | "checked", keyof SwitchStyleOverrideContext>
>;
type SwitchStyleOverrideContextHasTheme = AssertTrue<HasProp<SwitchStyleOverrideContext, "theme">>;
type SwitchVisualStyleOverrideFieldsAllowed = AssertTrue<
	IsAssignable<
		{
			readonly trackColor: Color3;
			readonly thumbColor: Color3;
			readonly trackStrokeTransparency: number;
			readonly thumbOffset: number;
			readonly labelColor: Color3;
		},
		Partial<SwitchVisualStyles>
	>
>;
type SwitchVisualStylesHasNoRadius = AssertFalse<IsAssignable<"radius", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoCornerRadius = AssertFalse<IsAssignable<"cornerRadius", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoPadding = AssertFalse<IsAssignable<"padding", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoFontSize = AssertFalse<IsAssignable<"fontSize", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoLabelSize = AssertFalse<IsAssignable<"labelSize", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoLineHeight = AssertFalse<IsAssignable<"lineHeight", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoLayout = AssertFalse<IsAssignable<"layout", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoTrackWidth = AssertFalse<IsAssignable<"trackWidth", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoThumbDiameter = AssertFalse<IsAssignable<"thumbDiameter", keyof SwitchVisualStyles>>;
type SwitchVisualStylesHasNoSlotProps = AssertFalse<IsAssignable<"slotProps", keyof SwitchVisualStyles>>;

const switchHasChildrenProp: SwitchHasChildrenProp = false;
const invalidSwitchColor: InvalidSwitchColorAllowed = false;
const invalidSwitchChecked: InvalidSwitchCheckedAllowed = false;
const switchLabelNumber: SwitchLabelNumberAllowed = true;
const exportedSwitchChecked: ExportedSwitchCheckedAllowed = true;
const exportedSwitchDefaultChecked: ExportedSwitchDefaultCheckedAllowed = true;
const switchStyleOverrideAssignableToProp: SwitchStyleOverrideAssignableToProp = true;
const switchStyleOverrideAssignableToExportedProp: SwitchStyleOverrideAssignableToExportedProp = true;
const switchStyleOverrideContextHasFields: SwitchStyleOverrideContextHasFields = true;
const switchStyleOverrideContextHasTheme: SwitchStyleOverrideContextHasTheme = true;
const switchVisualStyleOverrideFieldsAllowed: SwitchVisualStyleOverrideFieldsAllowed = true;
const switchVisualStylesHasNoRadius: SwitchVisualStylesHasNoRadius = false;
const switchVisualStylesHasNoCornerRadius: SwitchVisualStylesHasNoCornerRadius = false;
const switchVisualStylesHasNoPadding: SwitchVisualStylesHasNoPadding = false;
const switchVisualStylesHasNoFontSize: SwitchVisualStylesHasNoFontSize = false;
const switchVisualStylesHasNoLabelSize: SwitchVisualStylesHasNoLabelSize = false;
const switchVisualStylesHasNoLineHeight: SwitchVisualStylesHasNoLineHeight = false;
const switchVisualStylesHasNoLayout: SwitchVisualStylesHasNoLayout = false;
const switchVisualStylesHasNoTrackWidth: SwitchVisualStylesHasNoTrackWidth = false;
const switchVisualStylesHasNoThumbDiameter: SwitchVisualStylesHasNoThumbDiameter = false;
const switchVisualStylesHasNoSlotProps: SwitchVisualStylesHasNoSlotProps = false;

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
	switchStyleOverride,
	switchStyleOverrideAssignableToExportedProp,
	switchStyleOverrideAssignableToProp,
	switchStyleOverrideContextHasFields,
	switchStyleOverrideContextHasTheme,
	switchVisualStyleOverrideFieldsAllowed,
	switchVisualStylesHasNoCornerRadius,
	switchVisualStylesHasNoFontSize,
	switchVisualStylesHasNoLabelSize,
	switchVisualStylesHasNoLayout,
	switchVisualStylesHasNoLineHeight,
	switchVisualStylesHasNoPadding,
	switchVisualStylesHasNoRadius,
	switchVisualStylesHasNoSlotProps,
	switchVisualStylesHasNoThumbDiameter,
	switchVisualStylesHasNoTrackWidth,
};
