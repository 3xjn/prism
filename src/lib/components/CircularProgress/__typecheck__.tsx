import React from "@rbxts/react";

import { CircularProgress } from "./CircularProgress";
import type { CircularProgressProps } from "./types";

const circularProgressRef = React.createRef<Frame>();
type ExportedCircularProgressProps = React.ComponentProps<typeof CircularProgress>;

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

const circularProgressHasChildrenProp: CircularProgressHasChildrenProp = false;
const invalidCircularProgressColor: InvalidCircularProgressColorAllowed = false;
const invalidCircularProgressValue: InvalidCircularProgressValueAllowed = false;
const invalidCircularProgressMode: InvalidCircularProgressModeAllowed = false;
const exportedCircularProgressValue: ExportedCircularProgressValueAllowed = true;

export {
	acceptsCircularProgressChildren,
	acceptsCircularProgressProps,
	acceptsExportedCircularProgressProps,
	circularProgressHasChildrenProp,
	exportedCircularProgressValue,
	invalidCircularProgressColor,
	invalidCircularProgressMode,
	invalidCircularProgressValue,
};
