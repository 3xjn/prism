import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { CircularProgress } from "./CircularProgress";
import type {
	CircularProgressProps,
	CircularProgressStyleOverride,
	CircularProgressStyleOverrideContext,
	CircularProgressVisualStyles,
} from "./types";

const circularProgressRef = React.createRef<Frame>();
type ExportedCircularProgressProps = React.ComponentProps<typeof CircularProgress>;

const circularProgressStyleOverride: CircularProgressStyleOverride = (_visualStyles, ctx) => {
	if (ctx.variant === "subtle") {
		return { trackTransparency: 0.3 };
	}

	if (ctx.color === "error") {
		return { fillColor: ctx.theme.colors.error.dark, fillTailColor: ctx.theme.colors.error.light };
	}

	return {};
};

const validCircularProgressProps: CircularProgressProps[] = [
	{},
	{ mode: "indeterminate" },
	{ value: 42 },
	{ mode: "determinate", value: 64, min: 10, max: 90 },
	{ value: 0.35, min: 0, max: 1, formatValue: (value) => `${math.floor(value * 100)}%` },
	{ label: "XP", showValue: true, value: 72 },
	{ variant: "subtle", color: "success", size: "sm", cap: "round" },
	{ variant: "light", color: "warning", size: "lg", cap: "butt" },
	{ startAngle: 0, disableAnimation: true },
	{ value: 40, styleOverrides: circularProgressStyleOverride },
	{ width: 72, height: 72, layoutOrder: 2, p: "xs" },
	{ slotProps: { root: { BackgroundTransparency: 0.5 } } },
	{ slotProps: { center: { BackgroundTransparency: 1 }, label: { Text: "Override" }, valueLabel: { Text: "Ready" } } },
	{ slotProps: { trackGroup: { Rotation: 0 }, fillGroup: { Rotation: 45 } } },
	{ slotProps: { trackSegment: { BackgroundTransparency: 0.3 }, fillSegment: { BackgroundTransparency: 0.02 } } },
	{ slotProps: { padding: { PaddingLeft: new UDim(0, 6) }, sizeConstraint: { MinSize: new Vector2(36, 36) } } },
	{ slotProps: { aspectRatio: { DominantAxis: Enum.DominantAxis.Width } } },
	{ ref: circularProgressRef, label: "Ref circular progress" },
];

const validExportedCircularProgressProps: ExportedCircularProgressProps[] = [
	{ value: 50 },
	{ mode: "indeterminate", color: "info" },
	{ label: "Energy", showValue: true, color: "success" },
	{ value: 12, min: 0, max: 20, variant: "filled" },
];

const validCircularProgressExamples = [
	<CircularProgress key="indeterminate" />,
	<CircularProgress key="determinate" value={42} />,
	<CircularProgress key="labeled" label="Quest" showValue value={72} />,
	<CircularProgress key="range" value={12} min={0} max={20} />,
	<CircularProgress key="compact" value={0.45} min={0} max={1} size="xs" color="info" />,
	<CircularProgress key="slots" slotProps={{ root: { ZIndex: 4 }, fillGroup: { Rotation: 0 }, label: { Text: "Override" } }} />,
	<CircularProgress key="ref" ref={circularProgressRef} value={88} />,
];

const acceptsCircularProgressChildren: React.ReactNode = validCircularProgressExamples;
const acceptsCircularProgressProps: CircularProgressProps[] = validCircularProgressProps;
const acceptsExportedCircularProgressProps: ExportedCircularProgressProps[] = validExportedCircularProgressProps;

type CircularProgressHasChildrenProp = "children" extends keyof CircularProgressProps ? true : false;
type InvalidCircularProgressColorAllowed = "palette.primary.5" extends NonNullable<CircularProgressProps["color"]> ? true : false;
type InvalidCircularProgressValueAllowed = string extends NonNullable<CircularProgressProps["value"]> ? true : false;
type InvalidCircularProgressModeAllowed = "buffer" extends NonNullable<CircularProgressProps["mode"]> ? true : false;
type ExportedCircularProgressValueAllowed = 42 extends NonNullable<ExportedCircularProgressProps["value"]> ? true : false;
type CircularProgressStyleOverrideAssignableToProp = AssertTrue<
	IsAssignable<CircularProgressStyleOverride, CircularProgressProps["styleOverrides"]>
>;
type CircularProgressStyleOverrideAssignableToExportedProp = AssertTrue<
	IsAssignable<CircularProgressStyleOverride, ExportedCircularProgressProps["styleOverrides"]>
>;
type CircularProgressStyleOverrideContextHasFields = AssertTrue<
	IsAssignable<"theme" | "variant" | "color" | "size", keyof CircularProgressStyleOverrideContext>
>;
type CircularProgressStyleOverrideContextHasNoState = AssertFalse<HasProp<CircularProgressStyleOverrideContext, "state">>;
type CircularProgressVisualStylesHasNoDiameter = AssertFalse<IsAssignable<"diameter", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoThickness = AssertFalse<IsAssignable<"thickness", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoSegmentLength = AssertFalse<IsAssignable<"segmentLength", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoRadius = AssertFalse<IsAssignable<"radius", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoPadding = AssertFalse<IsAssignable<"padding", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoFontSize = AssertFalse<IsAssignable<"fontSize", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoLabelSize = AssertFalse<IsAssignable<"labelSize", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoLineHeight = AssertFalse<IsAssignable<"lineHeight", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoLayout = AssertFalse<IsAssignable<"layout", keyof CircularProgressVisualStyles>>;
type CircularProgressVisualStylesHasNoSlotProps = AssertFalse<IsAssignable<"slotProps", keyof CircularProgressVisualStyles>>;

const circularProgressHasChildrenProp: CircularProgressHasChildrenProp = false;
const invalidCircularProgressColor: InvalidCircularProgressColorAllowed = false;
const invalidCircularProgressValue: InvalidCircularProgressValueAllowed = false;
const invalidCircularProgressMode: InvalidCircularProgressModeAllowed = false;
const exportedCircularProgressValue: ExportedCircularProgressValueAllowed = true;
const circularProgressStyleOverrideAssignableToProp: CircularProgressStyleOverrideAssignableToProp = true;
const circularProgressStyleOverrideAssignableToExportedProp: CircularProgressStyleOverrideAssignableToExportedProp = true;
const circularProgressStyleOverrideContextHasFields: CircularProgressStyleOverrideContextHasFields = true;
const circularProgressStyleOverrideContextHasNoState: CircularProgressStyleOverrideContextHasNoState = false;
const circularProgressVisualStylesHasNoDiameter: CircularProgressVisualStylesHasNoDiameter = false;
const circularProgressVisualStylesHasNoThickness: CircularProgressVisualStylesHasNoThickness = false;
const circularProgressVisualStylesHasNoSegmentLength: CircularProgressVisualStylesHasNoSegmentLength = false;
const circularProgressVisualStylesHasNoRadius: CircularProgressVisualStylesHasNoRadius = false;
const circularProgressVisualStylesHasNoPadding: CircularProgressVisualStylesHasNoPadding = false;
const circularProgressVisualStylesHasNoFontSize: CircularProgressVisualStylesHasNoFontSize = false;
const circularProgressVisualStylesHasNoLabelSize: CircularProgressVisualStylesHasNoLabelSize = false;
const circularProgressVisualStylesHasNoLineHeight: CircularProgressVisualStylesHasNoLineHeight = false;
const circularProgressVisualStylesHasNoLayout: CircularProgressVisualStylesHasNoLayout = false;
const circularProgressVisualStylesHasNoSlotProps: CircularProgressVisualStylesHasNoSlotProps = false;

export {
	acceptsCircularProgressChildren,
	acceptsCircularProgressProps,
	acceptsExportedCircularProgressProps,
	circularProgressHasChildrenProp,
	circularProgressStyleOverride,
	circularProgressStyleOverrideAssignableToExportedProp,
	circularProgressStyleOverrideAssignableToProp,
	circularProgressStyleOverrideContextHasFields,
	circularProgressStyleOverrideContextHasNoState,
	circularProgressVisualStylesHasNoDiameter,
	circularProgressVisualStylesHasNoFontSize,
	circularProgressVisualStylesHasNoLabelSize,
	circularProgressVisualStylesHasNoLayout,
	circularProgressVisualStylesHasNoLineHeight,
	circularProgressVisualStylesHasNoPadding,
	circularProgressVisualStylesHasNoRadius,
	circularProgressVisualStylesHasNoSegmentLength,
	circularProgressVisualStylesHasNoSlotProps,
	circularProgressVisualStylesHasNoThickness,
	exportedCircularProgressValue,
	invalidCircularProgressColor,
	invalidCircularProgressMode,
	invalidCircularProgressValue,
};
