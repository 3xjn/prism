import React from "@rbxts/react";

import { SegmentedControl } from "./SegmentedControl";
import type { SegmentedControlOption, SegmentedControlProps } from "./types";

const segmentedControlRef = React.createRef<Frame>();
type ExportedSegmentedControlProps = React.ComponentProps<typeof SegmentedControl>;

const options: readonly SegmentedControlOption[] = [
	{ value: "solo", label: "Solo" },
	{ value: "duo", label: "Duo" },
	{ value: "squad", label: "Squad", disabled: true },
];

const validSegmentedControlProps: SegmentedControlProps[] = [
	{ options },
	{ options, defaultValue: "solo" },
	{ options, value: "duo", onChange: () => undefined },
	{ options, disabled: true },
	{ options, fullWidth: true },
	{ options, variant: "filled", color: "secondary", size: "lg" },
	{ options, width: 320, minWidth: 240, maxWidth: 480, p: "xs", layoutOrder: 2 },
	{ options, slotProps: { root: { BackgroundTransparency: 0.1 } } },
	{ options, slotProps: { frame: { BackgroundTransparency: 0.04 }, segment: { AutoButtonColor: true } } },
	{ options, slotProps: { segmentText: { TextXAlignment: Enum.TextXAlignment.Center } } },
	{ options, slotProps: { frameCorner: { CornerRadius: new UDim(0, 12) }, segmentCorner: { CornerRadius: new UDim(0, 9) } } },
	{ options, slotProps: { framePadding: { PaddingLeft: new UDim(0, 4) }, segmentPadding: { PaddingRight: new UDim(0, 16) } } },
	{ options, slotProps: { sizeConstraint: { MinSize: new Vector2(220, 34) } } },
	{ options, ref: segmentedControlRef },
];

const validExportedSegmentedControlProps: ExportedSegmentedControlProps[] = [
	{ options },
	{ options, defaultValue: "solo", cursor: "default" },
	{ options, value: "duo", onChange: () => undefined, color: "primary", variant: "outline" },
	{ options, size: "lg", fullWidth: true },
];

const validSegmentedControlExamples = [
	<SegmentedControl key="basic" options={options} />,
	<SegmentedControl key="uncontrolled" options={options} defaultValue="solo" />,
	<SegmentedControl key="controlled" options={options} value="duo" onChange={() => undefined} />,
	<SegmentedControl key="disabled" options={options} disabled />,
	<SegmentedControl key="full-width" options={options} fullWidth />,
	<SegmentedControl
		key="slots"
		options={options}
		slotProps={{
			root: { ZIndex: 3 },
			frame: { BackgroundTransparency: 0.03 },
			segmentText: { Text: "Override" },
		}}
	/>,
	<SegmentedControl key="ref" options={options} ref={segmentedControlRef} />,
];

const acceptsSegmentedControlChildren: React.ReactNode = validSegmentedControlExamples;
const acceptsSegmentedControlProps: SegmentedControlProps[] = validSegmentedControlProps;
const acceptsExportedSegmentedControlProps: ExportedSegmentedControlProps[] = validExportedSegmentedControlProps;

type SegmentedControlHasChildrenProp = "children" extends keyof SegmentedControlProps ? true : false;
type InvalidSegmentedControlColorAllowed = "palette.primary.5" extends NonNullable<SegmentedControlProps["color"]> ? true : false;
type InvalidSegmentedControlValueAllowed = number extends NonNullable<SegmentedControlProps["value"]> ? true : false;
type SegmentedControlDisabledOptionAllowed = true extends NonNullable<SegmentedControlOption["disabled"]> ? true : false;
type ExportedSegmentedControlValueAllowed = "solo" extends NonNullable<ExportedSegmentedControlProps["value"]> ? true : false;

const segmentedControlHasChildrenProp: SegmentedControlHasChildrenProp = false;
const invalidSegmentedControlColor: InvalidSegmentedControlColorAllowed = false;
const invalidSegmentedControlValue: InvalidSegmentedControlValueAllowed = false;
const segmentedControlDisabledOption: SegmentedControlDisabledOptionAllowed = true;
const exportedSegmentedControlValue: ExportedSegmentedControlValueAllowed = true;

export {
	acceptsExportedSegmentedControlProps,
	acceptsSegmentedControlChildren,
	acceptsSegmentedControlProps,
	exportedSegmentedControlValue,
	invalidSegmentedControlColor,
	invalidSegmentedControlValue,
	segmentedControlDisabledOption,
	segmentedControlHasChildrenProp,
};
