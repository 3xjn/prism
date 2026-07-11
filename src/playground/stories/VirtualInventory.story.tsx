import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import {
	Box,
	Button,
	Stack,
	Text,
	VirtualGrid,
	useBreakpoint,
	usePreferredInput,
	useResponsiveValue,
	type VirtualGridApi,
	type VirtualGridVisibleRange,
} from "@prism";
import { theme as themeRefs } from "@prism/theme";
import { CreateReactStory, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";
import { useSelectedObjectLabel } from "./_selectionStoryUtils";
import { resolveVirtualInventoryColumns, resolveVirtualInventoryNavigationTarget } from "./_virtualInventoryNavigation";
import { useVirtualInventorySelection } from "./_virtualInventorySelection";

interface InventoryItem {
	readonly id: string;
	readonly label: string;
	readonly category: string;
}

const ITEM_COUNT = 10_000;
const CELL_HEIGHT = 88;
const ROW_GAP = 8;
const COLUMN_GAP = 8;
const OVERSCAN = 2;
const VIEWPORT_HEIGHT = 420;
const CATEGORIES = ["Utility", "Signal", "Defense", "Traversal"] as const;
const inventoryItems = new Array<InventoryItem>();

for (let index = 0; index < ITEM_COUNT; index += 1) {
	inventoryItems.push(
		table.freeze({
			id: `asset-${index}`,
			label: `Asset ${index + 1}`,
			category: CATEGORIES[index % CATEGORIES.size()],
		}),
	);
}
table.freeze(inventoryItems);

function getInventoryItemKey(item: InventoryItem): string {
	return item.id;
}

const controls = {
	theme: storyThemeControl,
	inventoryWidth: Number(760, 320, 1_600, 40),
};

type VirtualInventoryStoryControls = InferControls<typeof controls>;

function rangesMatch(left: VirtualGridVisibleRange, right: VirtualGridVisibleRange): boolean {
	return left.startIndex === right.startIndex && left.endIndex === right.endIndex;
}

function resolveMountedBound(columns: number): number {
	const visibleRows = math.ceil((VIEWPORT_HEIGHT + CELL_HEIGHT) / (CELL_HEIGHT + ROW_GAP));
	return math.min(ITEM_COUNT, columns * (visibleRows + OVERSCAN * 2));
}

function VirtualInventoryCanvas({
	target,
	controls: currentControls,
}: {
	readonly target: Frame;
	readonly controls: VirtualInventoryStoryControls;
}): React.ReactElement {
	const [inventoryTarget, setInventoryTarget] = React.useState<Frame>();
	const responsiveTarget = inventoryTarget ?? target;
	const breakpoint = useBreakpoint({ target: responsiveTarget });
	const columns = useResponsiveValue({ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }, { target: responsiveTarget });
	const preferredInput = usePreferredInput();
	const selectedObjectLabel = useSelectedObjectLabel();
	const rootRef = React.useRef<ScrollingFrame>();
	const apiRef = React.useRef<VirtualGridApi<string>>();
	const [visibleRange, setVisibleRange] = React.useState<VirtualGridVisibleRange>({ startIndex: 0, endIndex: 0 });
	const [mountedCount, setMountedCount] = React.useState(0);
	const [status, setStatus] = React.useState("Choose Enter inventory, then use the D-pad across a virtual boundary.");
	const selection = useVirtualInventorySelection({ itemCount: ITEM_COUNT, columns, visibleRange, apiRef });
	const expectedColumns = resolveVirtualInventoryColumns(breakpoint);
	const mountedBound = resolveMountedBound(columns);
	const selectedItem = inventoryItems[selection.selectedIndex];
	const selectedButton = selection.getMountedInstance(selection.selectedIndex);

	React.useEffect(() => {
		let active = true;
		task.defer(() => {
			if (!active) {
				return;
			}
			const content = rootRef.current?.FindFirstChildWhichIsA("Frame");
			const nextMountedCount = content?.GetChildren().size() ?? 0;
			setMountedCount((current) => (current === nextMountedCount ? current : nextMountedCount));
		});
		return () => {
			active = false;
		};
	}, [columns, selection.mountedRevision, visibleRange.endIndex, visibleRange.startIndex]);

	const focusItem = (index: number, label: string) => {
		const moved = selection.requestSelection(index, "center");
		setStatus(`${label}: ${moved ? "selection requested" : "target unavailable"}`);
	};
	const toolbarNeighbor = selectedButton;

	return (
		<StoryCanvas>
			<Stack width="100%" gap="lg">
				<Stack width="100%" gap="xs">
					<Text text="Virtual inventory" size="xl" weight={800} color={themeRefs.text.primary} />
					<Text
						text="Ten thousand stable cells, MUI-style responsive columns, and a story-local native selection handoff. Visible mounted neighbors stay Roblox-native; only an offscreen D-pad destination is bridged."
						color={themeRefs.text.secondary}
						width="100%"
						wrap
					/>
				</Stack>

				<Box width="100%" bg={themeRefs.background.surface} borderColor={themeRefs.border.subtle} radius="md" p="md">
					<Stack width="100%" gap="sm">
						<Stack width="100%" direction="horizontal" gap="sm" align="center" wrap>
							<Button
								label="Enter inventory"
								size="sm"
								onPress={() => focusItem(selection.selectedIndex, "Enter inventory")}
								nextSelectionDown={toolbarNeighbor}
							/>
							<Button
								label="Item 2,049"
								size="sm"
								variant="outline"
								onPress={() => focusItem(2_048, "Deep jump")}
								nextSelectionDown={toolbarNeighbor}
							/>
							<Button
								label="Item 7,778"
								size="sm"
								variant="outline"
								onPress={() => focusItem(7_777, "Deep jump")}
								nextSelectionDown={toolbarNeighbor}
							/>
							<Button
								label="Last item"
								size="sm"
								variant="outline"
								onPress={() => focusItem(ITEM_COUNT - 1, "Last item")}
								nextSelectionDown={toolbarNeighbor}
							/>
							<Button
								label={selection.relayActive ? "Moving native focus..." : "Focus relay idle"}
								size="sm"
								variant="subtle"
								selectable={selection.relayActive}
								ref={selection.setRelayInstance}
							/>
						</Stack>
						<Text text={status} size="sm" color={themeRefs.text.secondary} width="100%" wrap />
					</Stack>
				</Box>

				<Box width="100%" bg={themeRefs.action.hover} radius="md" p="md">
					<Stack width="100%" direction="horizontal" gap="lg" align="center" wrap>
						<Text text={`Dataset ${ITEM_COUNT}`} size="sm" color={themeRefs.text.secondary} />
						<Text text={`Host ${currentControls.inventoryWidth} px`} size="sm" color={themeRefs.text.secondary} />
						<Text text={`${breakpoint} / ${columns} columns`} size="sm" weight={800} color={themeRefs.text.primary} />
						<Text
							text={`Visible [${visibleRange.startIndex}, ${visibleRange.endIndex})`}
							size="sm"
							color={themeRefs.text.secondary}
						/>
						<Text text={`Mounted ${mountedCount} / bound ${mountedBound}`} size="sm" color={themeRefs.text.secondary} />
						<Text
							text={`Logical ${selection.selectedIndex + 1} (${selectedItem.id})`}
							size="sm"
							color={themeRefs.text.secondary}
						/>
						<Text text={`Handoffs ${selection.handoffCount}`} size="sm" color={themeRefs.text.secondary} />
						<Text
							text={`Selection losses ${selection.selectionLossCount}`}
							size="sm"
							weight={selection.selectionLossCount === 0 ? 700 : 900}
							color={selection.selectionLossCount === 0 ? themeRefs.success.main : themeRefs.error.main}
						/>
						<Text text={`Input ${preferredInput.Name}`} size="sm" color={themeRefs.text.secondary} />
					</Stack>
				</Box>

				<Box
					ref={setInventoryTarget}
					width={currentControls.inventoryWidth}
					bg={themeRefs.background.surface}
					borderColor={themeRefs.border.default}
					radius="md"
					p="sm"
				>
					<VirtualGrid
						items={inventoryItems}
						columns={columns}
						cellHeight={CELL_HEIGHT}
						rowGap={ROW_GAP}
						columnGap={COLUMN_GAP}
						overscan={OVERSCAN}
						getKey={getInventoryItemKey}
						renderItem={({ item, index, row, column }) => {
							const leftIndex = resolveVirtualInventoryNavigationTarget({
								index,
								itemCount: ITEM_COUNT,
								columns,
								direction: "left",
							});
							const rightIndex = resolveVirtualInventoryNavigationTarget({
								index,
								itemCount: ITEM_COUNT,
								columns,
								direction: "right",
							});
							const upIndex = resolveVirtualInventoryNavigationTarget({
								index,
								itemCount: ITEM_COUNT,
								columns,
								direction: "up",
							});
							const downIndex = resolveVirtualInventoryNavigationTarget({
								index,
								itemCount: ITEM_COUNT,
								columns,
								direction: "down",
							});
							return (
								<Button
									ref={selection.getItemRef(index)}
									width="100%"
									height="100%"
									fullWidth
									size="sm"
									variant={index === selection.selectedIndex ? "filled" : "light"}
									label={`${item.label}\n${item.category} | row ${row + 1}, col ${column + 1}`}
									selectionOrder={index + 1}
									nextSelectionLeft={selection.getMountedInstance(leftIndex)}
									nextSelectionRight={selection.getMountedInstance(rightIndex)}
									nextSelectionUp={selection.getMountedInstance(upIndex)}
									nextSelectionDown={selection.getMountedInstance(downIndex)}
									onPress={() => setStatus(`Activated ${item.label} (${item.id})`)}
									slotProps={{ root: { TextWrapped: true } }}
								/>
							);
						}}
						width="100%"
						height={VIEWPORT_HEIGHT}
						bg={themeRefs.background.default}
						scrollbarColor={themeRefs.primary.main}
						selectionGroup
						selectionBehaviorUp={Enum.SelectionBehavior.Stop}
						selectionBehaviorDown={Enum.SelectionBehavior.Stop}
						selectionBehaviorLeft={Enum.SelectionBehavior.Stop}
						selectionBehaviorRight={Enum.SelectionBehavior.Stop}
						onVisibleRangeChange={(nextRange) =>
							setVisibleRange((current) => (rangesMatch(current, nextRange) ? current : nextRange))
						}
						ref={rootRef}
						apiRef={apiRef}
						slotProps={{ content: { ClipsDescendants: false }, item: { ClipsDescendants: true } }}
					/>
				</Box>

				<Box width="100%" bg={themeRefs.background.surface} borderColor={themeRefs.border.subtle} radius="md" p="md">
					<Stack width="100%" gap="xs">
						<Text text={selectedObjectLabel} size="sm" weight={700} color={themeRefs.primary.main} width="100%" wrap />
						<Text
							text={`Responsive contract: ${breakpoint} resolves ${columns} columns${columns === expectedColumns ? "" : " (waiting for host resize)"}. Prior 10k benchmark baseline: 13.664 ms mount, 6.922 ms p95, 28 roots at four lanes.`}
							size="xs"
							color={themeRefs.text.secondary}
							width="100%"
							wrap
						/>
					</Stack>
				</Box>
			</Stack>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Virtual Inventory",
		summary:
			"A 10,000-item responsive VirtualGrid with native visible-neighbor selection and story-local controller handoff across sparse-window boundaries.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => (
		<StoryThemeProvider mode={props.controls.theme}>
			<VirtualInventoryCanvas target={props.target} controls={props.controls} />
		</StoryThemeProvider>
	),
);

export = story;
