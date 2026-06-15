import type { PrismLuauMountHandle, PrismLuauNode } from "./LuauBridge";
import { mountPrism } from "./LuauBridge";

const fragmentTree: PrismLuauNode = {
	component: "Fragment",
	children: [
		{ component: "Text", props: { text: "Bridge text", color: "text.primary" } },
		{ component: "Button", props: { label: "Save", variant: "filled", color: "primary", slotProps: { root: { ZIndex: 2 } } } },
	],
};

const selectTree: PrismLuauNode = {
	component: "Select",
	props: {
		options: [
			{ value: "alpha", label: "Alpha" },
			{ value: "beta", label: "Beta", disabled: true },
		],
		value: "alpha",
		onChange: (_value: string) => undefined,
		slotProps: { trigger: { ZIndex: 3 } },
	},
};

const segmentedControlTree: PrismLuauNode = {
	component: "SegmentedControl",
	props: {
		options: [
			{ value: "solo", label: "Solo" },
			{ value: "duo", label: "Duo" },
			{ value: "squad", label: "Squad", disabled: true },
		],
		value: "duo",
		onChange: (_value: string) => undefined,
		slotProps: { segment: { ZIndex: 3 } },
	},
};

const draggableTree: PrismLuauNode = {
	component: "Draggable",
	props: {
		items: [
			{ id: "one", label: "One" },
			{ id: "two", label: "Two", disabled: true },
		],
		value: ["one", "two"],
		onReorder: (_value: readonly string[]) => undefined,
	},
};

const pressableTree: PrismLuauNode = {
	component: "Pressable",
	props: {
		cursor: "pointer",
		onPress: () => undefined,
		slotProps: { root: { ZIndex: 4 } },
	},
	children: { component: "Text", props: { text: "Press" } },
};

function acceptMountFunction(
	mount: typeof mountPrism,
	parent: Instance,
	tree: PrismLuauNode,
): PrismLuauMountHandle {
	const handle: PrismLuauMountHandle = mount(parent, tree);
	handle.update(selectTree);
	handle.update(segmentedControlTree);
	handle.update(draggableTree);
	handle.update(pressableTree);
	handle.destroy();
	return handle;
}

const acceptsBridgeTrees: PrismLuauNode[] = [fragmentTree, selectTree, segmentedControlTree, draggableTree, pressableTree];
const acceptsMountFunction: (parent: Instance, tree: PrismLuauNode) => PrismLuauMountHandle = mountPrism;

export { acceptMountFunction, acceptsBridgeTrees, acceptsMountFunction };
