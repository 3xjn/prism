import React from "@rbxts/react";

import { resolveFixedVirtualGeometry } from "../../virtualization/_internal/fixedVirtualGeometry";

import {
	VirtualList,
	findVirtualItemIndexByKey,
	resolveFixedVirtualViewportRange,
	resolveVirtualItemKeyIndex,
	type VirtualItemKey,
	type VirtualListApi,
	type VirtualListProps,
} from ".";

interface DemoItem {
	readonly id: string;
	readonly label: string;
}

const demoItems: ReadonlyArray<DemoItem> = [
	{ id: "alpha", label: "Alpha" },
	{ id: "beta", label: "Beta" },
];
const getDemoKey = (item: DemoItem) => item.id;
const rootRef = React.createRef<ScrollingFrame>();
const apiRef = React.createRef<VirtualListApi<string>>();

const validVirtualListProps: ReadonlyArray<VirtualListProps<DemoItem, string>> = [
	{
		items: demoItems,
		itemHeight: 44,
		getKey: getDemoKey,
		renderItem: ({ item }) => <textlabel Text={item.label} />,
	},
	{
		items: demoItems,
		itemHeight: 52,
		gap: "sm",
		overscan: 3,
		width: "100%",
		height: 240,
		p: "sm",
		selectionGroup: true,
		selectionBehaviorUp: Enum.SelectionBehavior.Stop,
		selectionBehaviorDown: Enum.SelectionBehavior.Stop,
		getKey: getDemoKey,
		renderItem: ({ item, visible }) => <textlabel Text={`${item.label}:${visible}`} />,
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

const validVirtualListExamples = [
	<VirtualList
		key="basic"
		items={demoItems}
		itemHeight={44}
		getKey={getDemoKey}
		renderItem={({ item }) => <textlabel Text={item.label} />}
	/>,
	<VirtualList
		key="imperative"
		items={demoItems}
		itemHeight={52}
		gap={8}
		overscan={2}
		getKey={getDemoKey}
		renderItem={({ key, index }) => <textlabel Text={`${index}:${key}`} />}
		ref={rootRef}
		apiRef={apiRef}
	/>,
];

const geometry = resolveFixedVirtualGeometry({ itemCount: demoItems.size(), itemExtent: 44, lineGap: 8 });
const keyIndex = resolveVirtualItemKeyIndex(demoItems, getDemoKey);
const betaIndex = findVirtualItemIndexByKey(demoItems, getDemoKey, "beta");
const paddedRange = resolveFixedVirtualViewportRange(geometry, {
	scrollOffset: 0,
	viewportExtent: 120,
	overscanLines: 2,
	leadingInset: 8,
	trailingInset: 8,
});

type InvalidItemHeightAllowed = string extends VirtualListProps<DemoItem, string>["itemHeight"] ? true : false;
type InvalidKeyAllowed = object extends VirtualItemKey ? true : false;

const invalidItemHeightAllowed: InvalidItemHeightAllowed = false;
const invalidKeyAllowed: InvalidKeyAllowed = false;

export {
	betaIndex,
	invalidItemHeightAllowed,
	invalidKeyAllowed,
	keyIndex,
	paddedRange,
	validVirtualListExamples,
	validVirtualListProps,
};
