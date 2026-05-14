import React from "@rbxts/react";

import { Box } from "../Box";
import { Text } from "../Text";

import { Draggable } from "./Draggable";
import type { DraggableItem, DraggableItemRenderState, DraggableProps } from "./types";

interface DemoItem extends DraggableItem {
	readonly label: string;
}

const draggableRef = React.createRef<Frame>();
const TypedDraggable = Draggable<DemoItem>;
type ExportedDraggableProps = React.ComponentProps<typeof TypedDraggable>;

const demoItems: readonly DemoItem[] = [
	{ id: "one", label: "First task" },
	{ id: "two", label: "Second task" },
	{ id: "three", label: "Third task", disabled: true },
];

const validDraggableProps: DraggableProps<DemoItem>[] = [
	{
		items: demoItems,
		renderItem: (state) => <Text text={state.item.label} />,
	},
	{
		items: demoItems,
		defaultValue: ["two", "one"],
		renderItem: (state) => <Box key={state.item.id} width={120} height={32} bg={state.dragging ? "primary.light" : "background.surface"} />,
	},
	{
		items: demoItems,
		value: ["three", "one", "two"],
		onReorder: (_order) => undefined,
		renderItem: (state) => <Text text={`${state.index + 1}. ${state.item.label}`} />,
	},
	{
		items: demoItems,
		direction: "horizontal",
		gap: "sm",
		align: "center",
		justify: "spaceBetween",
		renderItem: (state) => <Text text={state.active ? `Active ${state.item.label}` : state.item.label} />,
	},
	{
		items: demoItems,
		disabled: true,
		active: false,
		width: 320,
		position: UDim2.fromOffset(20, 24),
		p: "md",
		bg: "background.surface",
		bgTransparency: 0.05,
		clip: true,
		visible: true,
		layoutOrder: 2,
		zIndex: 4,
		renderItem: (state) => <Text text={state.disabled ? `${state.item.label} disabled` : state.item.label} />,
	},
	{
		items: demoItems,
		renderItem: (state) => <Text text={state.item.label} />,
		slotProps: {
			root: { BorderSizePixel: 2 },
			padding: { PaddingLeft: new UDim(0, 14) },
			listLayout: { HorizontalAlignment: Enum.HorizontalAlignment.Center },
			item: { AutoButtonColor: true },
		},
	},
	{
		items: demoItems,
		renderItem: (state) => <Text text={state.item.label} />,
		ref: draggableRef,
	},
];

const validExportedDraggableProps: ExportedDraggableProps[] = [
	{
		items: demoItems,
		renderItem: (state: DraggableItemRenderState<DemoItem>) => <Text text={state.item.label} />,
	},
	{
		items: demoItems,
		value: ["two", "one", "three"],
		onReorder: (_order) => undefined,
		renderItem: (state) => <Box key={state.item.id} width={100} height={28} />,
	},
];

const validDraggableExamples = [
	<Draggable key="plain" items={demoItems} renderItem={(state) => <Text text={state.item.label} />} />,
	<Draggable
		key="render-state"
		items={demoItems}
		defaultValue={["three", "one", "two"]}
		renderItem={(state) => <Box bg={state.dragging ? "action.pressed" : "background.surface"} width={140} height={40} />}
	/>,
	<Draggable key="ref" ref={draggableRef} items={demoItems} renderItem={(state) => <Text text={state.item.label} />} />,
];

const acceptsDraggableChildren: React.ReactNode = validDraggableExamples;
const acceptsDraggableProps: DraggableProps<DemoItem>[] = validDraggableProps;
const acceptsExportedDraggableProps: ExportedDraggableProps[] = validExportedDraggableProps;

type InvalidDraggableDirectionAllowed = "diagonal" extends NonNullable<DraggableProps["direction"]> ? true : false;
type InvalidDraggableValueAllowed = number[] extends NonNullable<DraggableProps["value"]> ? true : false;
type InvalidDraggableRenderAllowed = ((state: { readonly foo: string }) => React.ReactNode) extends NonNullable<DraggableProps["renderItem"]>
	? true
	: false;
type DraggableRenderStateHasItem = DraggableItemRenderState<DemoItem>["item"] extends DemoItem ? true : false;

const invalidDraggableDirection: InvalidDraggableDirectionAllowed = false;
const invalidDraggableValue: InvalidDraggableValueAllowed = false;
const invalidDraggableRender: InvalidDraggableRenderAllowed = false;
const draggableRenderStateHasItem: DraggableRenderStateHasItem = true;

export {
	acceptsDraggableChildren,
	acceptsDraggableProps,
	acceptsExportedDraggableProps,
	draggableRenderStateHasItem,
	invalidDraggableDirection,
	invalidDraggableRender,
	invalidDraggableValue,
};
