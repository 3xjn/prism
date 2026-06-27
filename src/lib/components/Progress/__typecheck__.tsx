import React from "@rbxts/react";

import { Progress } from "./Progress";
import type { ProgressProps } from "./types";

const progressRef = React.createRef<Frame>();
type ExportedProgressProps = React.ComponentProps<typeof Progress>;

const validProgressProps: ProgressProps[] = [
	{},
	{ value: 42 },
	{ value: math.huge, min: -math.huge, max: 0 / 0 },
	{ value: 64, min: 10, max: 90 },
	{ value: 0.35, min: 0, max: 1, formatValue: (value) => `${math.floor(value * 100)}%` },
	{ label: "XP", showValue: true, value: 72 },
	{ variant: "subtle", color: "success", size: "sm", radius: "md" },
	{ variant: "light", color: "warning", size: "lg", fullWidth: true },
	{ radius: 6 },
	{ radius: new UDim(0, 10) },
	{ width: 260, minWidth: 180, layoutOrder: 2, p: "xs" },
	{ slotProps: { root: { BackgroundTransparency: 0.5 } } },
	{ slotProps: { header: { BackgroundTransparency: 1 }, label: { Text: "Override" }, valueLabel: { Text: "Ready" } } },
	{ slotProps: { track: { BackgroundTransparency: 0.08 }, fill: { BackgroundTransparency: 0.02 } } },
	{ slotProps: { trackCorner: { CornerRadius: new UDim(0, 4) }, fillCorner: { CornerRadius: new UDim(0, 4) } } },
	{ slotProps: { trackStroke: { Thickness: 2 }, fill: { BackgroundColor3: Color3.fromRGB(64, 160, 255) } } },
	{ slotProps: { padding: { PaddingLeft: new UDim(0, 6) }, sizeConstraint: { MinSize: new Vector2(220, 20) } } },
	{ ref: progressRef, label: "Ref progress" },
];

const validExportedProgressProps: ExportedProgressProps[] = [
	{ value: 50 },
	{ label: "Energy", showValue: true, color: "info" },
	{ value: 12, min: 0, max: 20, variant: "filled" },
	{ radius: "xl", size: "xl" },
];

const validProgressExamples = [
	<Progress key="default" value={42} />,
	<Progress key="labeled" label="Quest" showValue value={72} />,
	<Progress key="range" value={12} min={0} max={20} />,
	<Progress key="compact" value={0.45} min={0} max={1} size="xs" color="info" />,
	<Progress key="slots" slotProps={{ root: { ZIndex: 4 }, fill: { Rotation: 0 }, label: { Text: "Override" } }} />,
	<Progress key="ref" ref={progressRef} value={88} />,
];

const acceptsProgressChildren: React.ReactNode = validProgressExamples;
const acceptsProgressProps: ProgressProps[] = validProgressProps;
const acceptsExportedProgressProps: ExportedProgressProps[] = validExportedProgressProps;

type ProgressHasChildrenProp = "children" extends keyof ProgressProps ? true : false;
type InvalidProgressColorAllowed = "palette.primary.5" extends NonNullable<ProgressProps["color"]> ? true : false;
type InvalidProgressValueAllowed = string extends NonNullable<ProgressProps["value"]> ? true : false;
type InvalidProgressVariantAllowed = "ghost" extends NonNullable<ProgressProps["variant"]> ? true : false;
type ProgressRadiusNumberAllowed = 6 extends NonNullable<ProgressProps["radius"]> ? true : false;
type ExportedProgressValueAllowed = 42 extends NonNullable<ExportedProgressProps["value"]> ? true : false;

const progressHasChildrenProp: ProgressHasChildrenProp = false;
const invalidProgressColor: InvalidProgressColorAllowed = false;
const invalidProgressValue: InvalidProgressValueAllowed = false;
const invalidProgressVariant: InvalidProgressVariantAllowed = false;
const progressRadiusNumber: ProgressRadiusNumberAllowed = true;
const exportedProgressValue: ExportedProgressValueAllowed = true;

export {
	acceptsExportedProgressProps,
	acceptsProgressChildren,
	acceptsProgressProps,
	exportedProgressValue,
	invalidProgressColor,
	invalidProgressValue,
	invalidProgressVariant,
	progressHasChildrenProp,
	progressRadiusNumber,
};
