import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { SegmentedControl } from "./SegmentedControl";
import type {
	SegmentedControlFrameVisualStyles,
	SegmentedControlIndicatorVisualStyles,
	SegmentedControlSegmentVisualStyles,
} from "./styles";
import type {
	SegmentedControlFrameStyleOverrideContext,
	SegmentedControlIndicatorStyleOverrideContext,
	SegmentedControlOption,
	SegmentedControlProps,
	SegmentedControlStyleOverrides,
} from "./types";

const segmentedControlRef = React.createRef<Frame>();
type ExportedSegmentedControlProps = React.ComponentProps<typeof SegmentedControl>;

const options: readonly SegmentedControlOption[] = [
	{ value: "solo", label: "Solo" },
	{ value: "duo", label: "Duo" },
	{ value: "squad", label: "Squad", disabled: true },
];

const segmentedControlStyleOverrides: SegmentedControlStyleOverrides = {
	frame: (visualStyles, ctx) =>
		ctx.disabled
			? { strokeTransparency: 0.5 }
			: {
					backgroundColor: ctx.theme.colors[ctx.color].light,
					strokeTransparency: visualStyles.strokeTransparency * 0.5,
				},
	segment: (_visualStyles, ctx) => {
		if (ctx.state === "selected") {
			return { textColor: ctx.theme.colors[ctx.color].contrast };
		}

		return ctx.state === "hovered" && ctx.option.disabled !== true && ctx.size === "md"
			? { strokeTransparency: 0.2 }
			: {};
	},
	indicator: (_visualStyles, ctx) =>
		ctx.disabled
			? {}
			: {
					backgroundColor:
						ctx.variant === "filled" ? ctx.theme.colors[ctx.color].dark : ctx.theme.colors[ctx.color].main,
				},
};

const validSegmentedControlProps: SegmentedControlProps[] = [
	{ options },
	{ options, styleOverrides: segmentedControlStyleOverrides },
	{
		options,
		styleOverrides: { segment: (_visualStyles, ctx) => (ctx.state === "pressed" ? { backgroundTransparency: 0 } : {}) },
	},
	{ options, defaultValue: "solo" },
	{ options, value: "duo", onChange: () => undefined },
	{ options, disabled: true },
	{ options, fullWidth: true },
	{ options, variant: "filled", color: "secondary", size: "lg" },
	{ options, width: 320, minWidth: 240, maxWidth: 480, p: "xs", layoutOrder: 2 },
	{ options, slotProps: { root: { BackgroundTransparency: 0.1 } } },
	{
		options,
		slotProps: {
			frame: { BackgroundTransparency: 0.04 },
			segment: { AutoButtonColor: true, NextSelectionLeft: segmentedControlRef.current },
		},
	},
	{ options, slotProps: { segmentText: { TextXAlignment: Enum.TextXAlignment.Center } } },
	{
		options,
		slotProps: { frameCorner: { CornerRadius: new UDim(0, 12) }, segmentCorner: { CornerRadius: new UDim(0, 9) } },
	},
	{
		options,
		slotProps: { framePadding: { PaddingLeft: new UDim(0, 4) }, segmentPadding: { PaddingRight: new UDim(0, 16) } },
	},
	{ options, slotProps: { sizeConstraint: { MinSize: new Vector2(220, 34) } } },
	{ options, ref: segmentedControlRef },
];

const validExportedSegmentedControlProps: ExportedSegmentedControlProps[] = [
	{ options },
	{ options, defaultValue: "solo", cursor: "default" },
	{ options, value: "duo", onChange: () => undefined, color: "primary", variant: "outline" },
	{ options, size: "lg", fullWidth: true },
	{ options, styleOverrides: segmentedControlStyleOverrides },
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
	<SegmentedControl key="overrides" options={options} styleOverrides={segmentedControlStyleOverrides} />,
	<SegmentedControl key="ref" options={options} ref={segmentedControlRef} />,
];

const acceptsSegmentedControlChildren: React.ReactNode = validSegmentedControlExamples;
const acceptsSegmentedControlProps: SegmentedControlProps[] = validSegmentedControlProps;
const acceptsExportedSegmentedControlProps: ExportedSegmentedControlProps[] = validExportedSegmentedControlProps;

type SegmentedControlHasChildrenProp = "children" extends keyof SegmentedControlProps ? true : false;
type SegmentedControlHasNoAmbiguousSelectionNeighbor = AssertFalse<HasProp<SegmentedControlProps, "nextSelectionLeft">>;
type InvalidSegmentedControlColorAllowed =
	"palette.primary.5" extends NonNullable<SegmentedControlProps["color"]> ? true : false;
type InvalidSegmentedControlValueAllowed = number extends NonNullable<SegmentedControlProps["value"]> ? true : false;
type SegmentedControlDisabledOptionAllowed =
	true extends NonNullable<SegmentedControlOption["disabled"]> ? true : false;
type ExportedSegmentedControlValueAllowed =
	"solo" extends NonNullable<ExportedSegmentedControlProps["value"]> ? true : false;
type SegmentedControlVisualStyleKey =
	| keyof SegmentedControlFrameVisualStyles
	| keyof SegmentedControlSegmentVisualStyles
	| keyof SegmentedControlIndicatorVisualStyles;
type SegmentedControlStyleOverridesAssignableToProp = AssertTrue<
	IsAssignable<SegmentedControlStyleOverrides, SegmentedControlProps["styleOverrides"]>
>;
type SegmentedControlStyleOverridesAssignableToExportedProp = AssertTrue<
	IsAssignable<SegmentedControlStyleOverrides, ExportedSegmentedControlProps["styleOverrides"]>
>;
type SegmentedControlFrameCtxHasNoState = AssertFalse<HasProp<SegmentedControlFrameStyleOverrideContext, "state">>;
type SegmentedControlIndicatorCtxHasNoState = AssertFalse<
	HasProp<SegmentedControlIndicatorStyleOverrideContext, "state">
>;
type SegmentedControlVisualStylesHaveNoRadius = AssertFalse<IsAssignable<"radius", SegmentedControlVisualStyleKey>>;
type SegmentedControlVisualStylesHaveNoSegmentRadius = AssertFalse<
	IsAssignable<"segmentRadius", SegmentedControlVisualStyleKey>
>;
type SegmentedControlVisualStylesHaveNoPadding = AssertFalse<IsAssignable<"padding", SegmentedControlVisualStyleKey>>;
type SegmentedControlVisualStylesHaveNoFontSize = AssertFalse<IsAssignable<"fontSize", SegmentedControlVisualStyleKey>>;
type SegmentedControlVisualStylesHaveNoGap = AssertFalse<IsAssignable<"gap", SegmentedControlVisualStyleKey>>;

const segmentedControlHasChildrenProp: SegmentedControlHasChildrenProp = false;
const segmentedControlHasNoAmbiguousSelectionNeighbor: SegmentedControlHasNoAmbiguousSelectionNeighbor = false;
const invalidSegmentedControlColor: InvalidSegmentedControlColorAllowed = false;
const invalidSegmentedControlValue: InvalidSegmentedControlValueAllowed = false;
const segmentedControlDisabledOption: SegmentedControlDisabledOptionAllowed = true;
const exportedSegmentedControlValue: ExportedSegmentedControlValueAllowed = true;
const segmentedControlStyleOverridesAssignableToProp: SegmentedControlStyleOverridesAssignableToProp = true;
const segmentedControlStyleOverridesAssignableToExportedProp: SegmentedControlStyleOverridesAssignableToExportedProp = true;
const segmentedControlFrameCtxHasNoState: SegmentedControlFrameCtxHasNoState = false;
const segmentedControlIndicatorCtxHasNoState: SegmentedControlIndicatorCtxHasNoState = false;
const segmentedControlVisualStylesHaveNoRadius: SegmentedControlVisualStylesHaveNoRadius = false;
const segmentedControlVisualStylesHaveNoSegmentRadius: SegmentedControlVisualStylesHaveNoSegmentRadius = false;
const segmentedControlVisualStylesHaveNoPadding: SegmentedControlVisualStylesHaveNoPadding = false;
const segmentedControlVisualStylesHaveNoFontSize: SegmentedControlVisualStylesHaveNoFontSize = false;
const segmentedControlVisualStylesHaveNoGap: SegmentedControlVisualStylesHaveNoGap = false;

export {
	acceptsExportedSegmentedControlProps,
	acceptsSegmentedControlChildren,
	acceptsSegmentedControlProps,
	exportedSegmentedControlValue,
	invalidSegmentedControlColor,
	invalidSegmentedControlValue,
	segmentedControlDisabledOption,
	segmentedControlFrameCtxHasNoState,
	segmentedControlHasChildrenProp,
	segmentedControlHasNoAmbiguousSelectionNeighbor,
	segmentedControlIndicatorCtxHasNoState,
	segmentedControlStyleOverrides,
	segmentedControlStyleOverridesAssignableToExportedProp,
	segmentedControlStyleOverridesAssignableToProp,
	segmentedControlVisualStylesHaveNoFontSize,
	segmentedControlVisualStylesHaveNoGap,
	segmentedControlVisualStylesHaveNoPadding,
	segmentedControlVisualStylesHaveNoRadius,
	segmentedControlVisualStylesHaveNoSegmentRadius,
};
