import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import {
	Box,
	Button,
	Stack,
	Text,
	VirtualGrid,
	resolveFixedVirtualGridLayout,
	type VirtualGridApi,
	type VirtualGridColumnProps,
	type VirtualGridVisibleRange,
} from "@prism";
import { theme as themeRefs } from "@prism/theme";
import { CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

interface InventoryCell {
	readonly id: string;
	readonly label: string;
	readonly category: string;
	readonly disabled: boolean;
	readonly selected: boolean;
}

type LayoutMode = "responsive" | "explicit";

const CELL_HEIGHT = 96;
const FULL_ITEM_COUNT = 10_000;
const CONTENT_PADDING = 8;
const SCROLLBAR_SIZE = 8;
const SELECTED_INDICES = new Set([42, 2_048, 7_777]);
const CATEGORIES = ["Utility", "Signal", "Defense", "Traversal"] as const;
const inventory = new Array<InventoryCell>();

for (let index = 0; index < FULL_ITEM_COUNT; index += 1) {
	inventory.push({
		id: `asset-${index}`,
		label: `Asset ${index + 1}`,
		category: CATEGORIES[index % CATEGORIES.size()],
		disabled: index === 4_999 || index % 997 === 0,
		selected: SELECTED_INDICES.has(index),
	});
}

const getInventoryKey = (item: InventoryCell): string => item.id;

const controls = {
	theme: storyThemeControl,
	layoutMode: EnumList({ responsive: "Responsive minimum width", explicit: "Explicit columns" }, "responsive"),
	dataset: EnumList({ full: "10,000 cells", shrink: "63 cells", empty: "Empty" }, "full"),
	viewportWidth: Number(680, 320, 760, 20),
	viewportHeight: Number(380, 220, 520, 20),
	columns: Number(4, 1, 8, 1),
	minimumCellWidth: Number(132, 80, 220, 4),
	maxColumns: Number(6, 1, 10, 1),
	rowGap: Number(8, 0, 20, 1),
	columnGap: Number(8, 0, 20, 1),
	overscan: Number(2, 0, 8, 1),
};

type VirtualGridStoryControls = InferControls<typeof controls>;

function resolveLayoutMode(value: string): LayoutMode {
	return value === "explicit" || value === "Explicit columns" ? "explicit" : "responsive";
}

function resolveItemCount(value: string): number {
	switch (value) {
		case "empty":
		case "Empty":
			return 0;
		case "shrink":
		case "63 cells":
			return 63;
		case "full":
		case "10,000 cells":
		default:
			return FULL_ITEM_COUNT;
	}
}

function rangesMatch(left: VirtualGridVisibleRange, right: VirtualGridVisibleRange): boolean {
	return left.startIndex === right.startIndex && left.endIndex === right.endIndex;
}

function takeInventoryItems(count: number): ReadonlyArray<InventoryCell> {
	const result = new Array<InventoryCell>();
	for (let index = 0; index < math.min(count, inventory.size()); index += 1) {
		result.push(inventory[index]);
	}
	return result;
}

function VirtualGridStoryCanvas({
	controls: currentControls,
}: {
	readonly controls: VirtualGridStoryControls;
}): React.ReactElement {
	const layoutMode = resolveLayoutMode(currentControls.layoutMode);
	const itemCount = resolveItemCount(currentControls.dataset);
	const visibleItems = React.useMemo(() => takeInventoryItems(itemCount), [itemCount]);
	const rootRef = React.useRef<ScrollingFrame>();
	const apiRef = React.useRef<VirtualGridApi<string>>();
	const [viewportSize, setViewportSize] = React.useState(
		new Vector2(currentControls.viewportWidth, currentControls.viewportHeight),
	);
	const [visibleRange, setVisibleRange] = React.useState<VirtualGridVisibleRange>({ startIndex: 0, endIndex: 0 });
	const [mountedCount, setMountedCount] = React.useState(0);
	const [status, setStatus] = React.useState(
		"Ready. Resize and layout controls recompute lanes from the observed root window.",
	);
	const columns = math.max(1, math.floor(currentControls.columns));
	const maxColumns = math.max(1, math.floor(currentControls.maxColumns));
	const overscan = math.max(0, math.floor(currentControls.overscan));
	const columnProps: VirtualGridColumnProps =
		layoutMode === "explicit" ? { columns } : { minimumCellWidth: currentControls.minimumCellWidth, maxColumns };
	const layout = resolveFixedVirtualGridLayout({
		availableWidth: math.max(0, viewportSize.X - CONTENT_PADDING * 2 - SCROLLBAR_SIZE),
		columnGap: currentControls.columnGap,
		columns: layoutMode === "explicit" ? columns : undefined,
		minimumCellWidth: layoutMode === "responsive" ? currentControls.minimumCellWidth : undefined,
		maxColumns: layoutMode === "responsive" ? maxColumns : undefined,
	});

	React.useEffect(() => {
		let active = true;
		task.defer(() => {
			if (!active) {
				return;
			}
			const content = rootRef.current?.FindFirstChildWhichIsA("Frame");
			const nextMountedCount = content?.GetChildren().size() ?? 0;
			setMountedCount((currentCount) => (currentCount === nextMountedCount ? currentCount : nextMountedCount));
		});
		return () => {
			active = false;
		};
	}, [
		currentControls.columnGap,
		currentControls.rowGap,
		currentControls.viewportHeight,
		currentControls.viewportWidth,
		itemCount,
		layout.laneCount,
		overscan,
		visibleRange.endIndex,
		visibleRange.startIndex,
	]);

	const runCommand = (label: string, command: () => boolean) => {
		const moved = command();
		const canvasY = rootRef.current?.CanvasPosition.Y ?? 0;
		setStatus(
			`${label}: ${moved ? "moved" : "not available in this dataset"} · root CanvasPosition.Y ${math.round(canvasY)}`,
		);
	};

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="VirtualGrid" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="A uniform-cell grid that virtualizes complete rows while cell width follows either an explicit column count or a responsive minimum. Resize, switch modes, jump deep, then shrink the dataset to verify the range stays valid."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Stack width="100%" direction="horizontal" gap="sm" align="center">
						<Button
							size="sm"
							variant="outline"
							label="Start"
							onPress={() => runCommand("Start", () => apiRef.current?.scrollToIndex(0, "start") ?? false)}
						/>
						<Button
							size="sm"
							variant="outline"
							label="Selected 2,049"
							onPress={() =>
								runCommand("Selected key", () => apiRef.current?.scrollToKey("asset-2048", "center") ?? false)
							}
						/>
						<Button
							size="sm"
							variant="outline"
							label="Disabled 5,000"
							onPress={() =>
								runCommand("Disabled index", () => apiRef.current?.scrollToIndex(4_999, "center") ?? false)
							}
						/>
						<Button
							size="sm"
							variant="outline"
							label="Last key"
							onPress={() => runCommand("Last key", () => apiRef.current?.scrollToKey("asset-9999", "end") ?? false)}
						/>
					</Stack>
					<Text text={status} size="sm" color={themeRefs.text.secondary} width="100%" wrap />
					<Stack width="100%" direction="horizontal" gap="lg" align="center">
						<Text text={`Dataset ${itemCount}`} size="sm" color={themeRefs.text.secondary} />
						<Text text={`Lanes ${layout.laneCount}`} size="sm" weight={700} color={themeRefs.text.primary} />
						<Text text={`Cell ${math.floor(layout.cellWidth)} px`} size="sm" color={themeRefs.text.secondary} />
						<Text
							text={`Visible [${visibleRange.startIndex}, ${visibleRange.endIndex})`}
							size="sm"
							color={themeRefs.text.secondary}
						/>
						<Text text={`Mounted ${mountedCount}`} size="sm" color={themeRefs.text.secondary} />
					</Stack>
					<Box
						width={currentControls.viewportWidth}
						bg={themeRefs.background.default}
						borderColor={themeRefs.border.default}
						radius="md"
						clip
					>
						<VirtualGrid
							{...columnProps}
							items={visibleItems}
							cellHeight={CELL_HEIGHT}
							rowGap={currentControls.rowGap}
							columnGap={currentControls.columnGap}
							overscan={overscan}
							getKey={getInventoryKey}
							renderItem={({ item, index, row, column, visible }) => {
								const stateLabel = item.disabled
									? "DISABLED"
									: item.selected
										? "SELECTED"
										: visible
											? "visible"
											: "overscan";
								return (
									<Button
										width="100%"
										height="100%"
										fullWidth
										size="sm"
										variant={item.selected ? "filled" : "light"}
										color="primary"
										disabled={item.disabled}
										label={`${index + 1}. ${item.label}\n${item.category} · r${row + 1} c${column + 1}\n${stateLabel}`}
										onPress={() => setStatus(`Activated ${item.label} (${item.id})`)}
										slotProps={{ root: { TextWrapped: true } }}
									/>
								);
							}}
							width={currentControls.viewportWidth}
							height={currentControls.viewportHeight}
							p={CONTENT_PADDING}
							bg={themeRefs.background.default}
							scrollbarSize={SCROLLBAR_SIZE}
							scrollbarColor={themeRefs.primary.main}
							selectionGroup
							selectionBehaviorUp={Enum.SelectionBehavior.Stop}
							selectionBehaviorDown={Enum.SelectionBehavior.Stop}
							selectionBehaviorLeft={Enum.SelectionBehavior.Stop}
							selectionBehaviorRight={Enum.SelectionBehavior.Stop}
							onVisibleRangeChange={(nextRange) =>
								setVisibleRange((currentRange) => (rangesMatch(currentRange, nextRange) ? currentRange : nextRange))
							}
							Change={{
								AbsoluteWindowSize: (instance) => {
									const nextSize = instance.AbsoluteWindowSize;
									setViewportSize((currentSize) =>
										currentSize.X === nextSize.X && currentSize.Y === nextSize.Y ? currentSize : nextSize,
									);
								},
							}}
							ref={rootRef}
							apiRef={apiRef}
							slotProps={{
								content: { ClipsDescendants: false },
								item: { ClipsDescendants: true },
							}}
						/>
					</Box>
					{itemCount === 0 ? (
						<Text
							text="Empty dataset: the manual canvas and sparse mounted window both collapse without stale cells."
							size="sm"
							color={themeRefs.text.secondary}
							width="100%"
							wrap
						/>
					) : undefined}
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "VirtualGrid",
		summary:
			"Uniform-cell grid virtualization with explicit or responsive lanes, stable keyed cells, visible-range reporting, and index/key imperative scrolling.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => (
		<StoryThemeProvider mode={props.controls.theme}>
			<VirtualGridStoryCanvas controls={props.controls} />
		</StoryThemeProvider>
	),
);

export = story;
