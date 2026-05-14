import React from "@rbxts/react";

import { Select } from "./Select";
import type { SelectOption, SelectProps } from "./types";

const selectRef = React.createRef<TextButton>();
type ExportedSelectProps = React.ComponentProps<typeof Select>;

const options: readonly SelectOption[] = [
	{ value: "aurora", label: "Aurora Watch" },
	{ value: "harbor", label: "Harbor Shift" },
	{ value: "legacy", label: "Legacy Queue", disabled: true },
];

const longOptions: readonly SelectOption[] = [
	{ value: "aurora", label: "Aurora Watch" },
	{ value: "harbor", label: "Harbor Shift" },
	{ value: "legacy", label: "Legacy Queue", disabled: true },
	{ value: "summit", label: "Summit Relay" },
	{ value: "delta", label: "Delta Routing" },
	{ value: "comet", label: "Comet Dispatch" },
	{ value: "atlas", label: "Atlas Link" },
	{ value: "echo", label: "Echo Terminal" },
];

const validSelectProps: SelectProps[] = [
	{ options, placeholder: "Choose a profile" },
	{ options, defaultValue: "aurora" },
	{ options, selected: "aurora", onChange: () => undefined },
	{ options, value: "harbor", onChange: () => undefined },
	{ options, disabled: true, placeholder: "Unavailable" },
	{ options, value: "legacy", onChange: () => undefined },
	{ options, fullWidth: true },
	{ options, cursor: "pointer" },
	{ options, variant: "subtle", color: "secondary", size: "sm" },
	{ options: longOptions, maxVisibleOptions: 4 },
	{ options, width: 260, minWidth: 220, maxWidth: 320, p: "xs", layoutOrder: 2 },
	{ options, slotProps: { root: { BackgroundTransparency: 0.1 } } },
	{ options, slotProps: { trigger: { AutoButtonColor: true } } },
	{ options, slotProps: { triggerText: { TextXAlignment: Enum.TextXAlignment.Center } } },
	{ options, slotProps: { overlay: { ZIndex: 9 }, list: { BackgroundTransparency: 0.02 }, listViewport: { ScrollBarThickness: 10 }, optionsLayout: { Padding: new UDim(0, 10) } } },
	{ options, slotProps: { option: { AutoButtonColor: true }, optionText: { TextColor3: Color3.fromRGB(96, 108, 134) } } },
	{ options, slotProps: { triggerCorner: { CornerRadius: new UDim(0, 12) }, optionCorner: { CornerRadius: new UDim(0, 10) } } },
	{ options, slotProps: { triggerPadding: { PaddingLeft: new UDim(0, 18) }, optionPadding: { PaddingRight: new UDim(0, 18) } } },
	{ options, slotProps: { sizeConstraint: { MinSize: new Vector2(220, 38) } } },
	{ options, ref: selectRef },
];

const validExportedSelectProps: ExportedSelectProps[] = [
	{ options, placeholder: "Choose" },
	{ options, defaultValue: "aurora", cursor: "default" },
	{ options, selected: "aurora", onChange: () => undefined },
	{ options, value: "harbor", onChange: () => undefined, color: "primary", variant: "outline" },
	{ options, size: "lg", fullWidth: true, maxVisibleOptions: 5 },
];

const validSelectExamples = [
	<Select key="placeholder" options={options} placeholder="Choose a route" />,
	<Select key="uncontrolled" options={options} defaultValue="aurora" />,
	<Select key="selected" options={options} selected="aurora" onChange={() => undefined} />,
	<Select key="controlled" options={options} value="harbor" onChange={() => undefined} />,
	<Select key="disabled" options={options} disabled placeholder="Disabled" />,
	<Select key="disabled-option" options={options} defaultValue="legacy" />,
	<Select key="full-width" options={options} fullWidth />,
	<Select key="cursor" options={options} cursor="pointer" />,
	<Select key="scroll" options={longOptions} defaultValue="aurora" maxVisibleOptions={4} />,
	<Select
		key="slots"
		options={options}
		slotProps={{
			root: { ZIndex: 3 },
			trigger: { Rotation: 0 },
			overlay: { ZIndex: 5 },
			list: { BackgroundTransparency: 0.04 },
			listViewport: { ScrollBarThickness: 12 },
			optionText: { Text: "Override" },
		}}
	/>,
	<Select key="ref" options={options} ref={selectRef} defaultValue="aurora" />,
];

const acceptsSelectChildren: React.ReactNode = validSelectExamples;
const acceptsSelectProps: SelectProps[] = validSelectProps;
const acceptsExportedSelectProps: ExportedSelectProps[] = validExportedSelectProps;

type SelectHasChildrenProp = "children" extends keyof SelectProps ? true : false;
type InvalidSelectColorAllowed = "palette.primary.5" extends NonNullable<SelectProps["color"]> ? true : false;
type InvalidSelectValueAllowed = number extends NonNullable<SelectProps["value"]> ? true : false;
type InvalidSelectSelectedAllowed = number extends NonNullable<SelectProps["selected"]> ? true : false;
type InvalidSelectMaxVisibleOptionsAllowed = string extends NonNullable<SelectProps["maxVisibleOptions"]> ? true : false;
type SelectDisabledOptionAllowed = true extends NonNullable<SelectOption["disabled"]> ? true : false;
type ExportedSelectValueAllowed = "aurora" extends NonNullable<ExportedSelectProps["value"]> ? true : false;
type ExportedSelectSelectedAllowed = "aurora" extends NonNullable<ExportedSelectProps["selected"]> ? true : false;

const selectHasChildrenProp: SelectHasChildrenProp = false;
const invalidSelectColor: InvalidSelectColorAllowed = false;
const invalidSelectValue: InvalidSelectValueAllowed = false;
const invalidSelectSelected: InvalidSelectSelectedAllowed = false;
const invalidSelectMaxVisibleOptions: InvalidSelectMaxVisibleOptionsAllowed = false;
const selectDisabledOption: SelectDisabledOptionAllowed = true;
const exportedSelectValue: ExportedSelectValueAllowed = true;
const exportedSelectSelected: ExportedSelectSelectedAllowed = true;

export {
	acceptsExportedSelectProps,
	acceptsSelectChildren,
	acceptsSelectProps,
	exportedSelectSelected,
	exportedSelectValue,
	invalidSelectColor,
	invalidSelectMaxVisibleOptions,
	invalidSelectSelected,
	invalidSelectValue,
	selectDisabledOption,
	selectHasChildrenProp,
};
