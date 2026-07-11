import React from "@rbxts/react";

import { resolveFixedVirtualGeometry } from "../../virtualization/_internal/fixedVirtualGeometry";

import {
	VirtualGrid,
	resolveFixedVirtualGridCellLayout,
	resolveFixedVirtualGridLayout,
	type VirtualGridApi,
	type VirtualGridColumnProps,
	type VirtualGridProps,
} from ".";

interface DemoItem {
	readonly id: string;
	readonly label: string;
}

const demoItems: ReadonlyArray<DemoItem> = [
	{ id: "alpha", label: "Alpha" },
	{ id: "beta", label: "Beta" },
	{ id: "gamma", label: "Gamma" },
];
const getDemoKey = (item: DemoItem) => item.id;
const rootRef = React.createRef<ScrollingFrame>();
const apiRef = React.createRef<VirtualGridApi<string>>();

const validVirtualGridProps: ReadonlyArray<VirtualGridProps<DemoItem, string>> = [
	{
		items: demoItems,
		cellHeight: 72,
		columns: 3,
		getKey: getDemoKey,
		renderItem: ({ item }) => <textlabel Text={item.label} />,
	},
	{
		items: demoItems,
		cellHeight: 84,
		minimumCellWidth: 120,
		maxColumns: 5,
		gap: "sm",
		rowGap: 10,
		columnGap: 12,
		overscan: 3,
		width: "100%",
		height: 280,
		p: "sm",
		selectionGroup: true,
		selectionBehaviorLeft: Enum.SelectionBehavior.Stop,
		selectionBehaviorRight: Enum.SelectionBehavior.Stop,
		getKey: getDemoKey,
		renderItem: ({ item, row, column, visible }) => <textlabel Text={`${item.label}:${row}:${column}:${visible}`} />,
		onVisibleRangeChange: () => undefined,
		ref: rootRef,
		apiRef,
		slotProps: {
			root: { ScrollBarThickness: 10 },
			content: { BackgroundTransparency: 1 },
			item: { ClipsDescendants: true },
		},
	},
];

const validVirtualGridExamples = [
	<VirtualGrid
		key="explicit"
		items={demoItems}
		cellHeight={72}
		columns={2}
		getKey={getDemoKey}
		renderItem={({ item }) => <textlabel Text={item.label} />}
	/>,
	<VirtualGrid
		key="responsive"
		items={demoItems}
		cellHeight={84}
		minimumCellWidth={128}
		maxColumns={4}
		gap={8}
		overscan={2}
		getKey={getDemoKey}
		renderItem={({ key, row, column }) => <textlabel Text={`${key}:${row}:${column}`} />}
		ref={rootRef}
		apiRef={apiRef}
	/>,
];

const layout = resolveFixedVirtualGridLayout({
	availableWidth: 440,
	minimumCellWidth: 100,
	columnGap: 10,
	maxColumns: 4,
});
const geometry = resolveFixedVirtualGeometry({
	itemCount: demoItems.size(),
	itemExtent: 72,
	lineGap: 8,
	laneCount: layout.laneCount,
});
const cellLayout = resolveFixedVirtualGridCellLayout(2, geometry, layout);

type BothColumnModesAllowed = { columns: number; minimumCellWidth: number } extends VirtualGridColumnProps
	? true
	: false;
type MissingColumnModeAllowed = {} extends VirtualGridColumnProps ? true : false;
type InvalidCellHeightAllowed = string extends VirtualGridProps<DemoItem, string>["cellHeight"] ? true : false;

const bothColumnModesAllowed: BothColumnModesAllowed = false;
const missingColumnModeAllowed: MissingColumnModeAllowed = false;
const invalidCellHeightAllowed: InvalidCellHeightAllowed = false;

export {
	bothColumnModesAllowed,
	cellLayout,
	invalidCellHeightAllowed,
	layout,
	missingColumnModeAllowed,
	validVirtualGridExamples,
	validVirtualGridProps,
};
