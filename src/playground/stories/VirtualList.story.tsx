import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Stack, Text, VirtualList, type VirtualItemRange, type VirtualListApi } from "@prism";
import { theme as themeRefs } from "@prism/theme";
import { CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

interface MissionRow {
	readonly id: string;
	readonly label: string;
	readonly disabled: boolean;
	readonly selected: boolean;
}

const ITEM_HEIGHT = 58;
const FULL_ITEM_COUNT = 10_000;
const SELECTED_INDICES = new Set([42, 2_048, 7_777]);
const missions = new Array<MissionRow>();

for (let index = 0; index < FULL_ITEM_COUNT; index += 1) {
	missions.push({
		id: `mission-${index}`,
		label: `Mission ${index + 1}`,
		disabled: index === 4_999 || index % 997 === 0,
		selected: SELECTED_INDICES.has(index),
	});
}

const getMissionKey = (item: MissionRow): string => item.id;

const controls = {
	theme: storyThemeControl,
	dataset: EnumList({ full: "10,000 rows", shrink: "64 rows", empty: "Empty" }, "full"),
	viewportHeight: Number(360, 180, 520, 20),
	gap: Number(6, 0, 20, 1),
	overscan: Number(2, 0, 8, 1),
};

type VirtualListStoryControls = InferControls<typeof controls>;

function resolveItemCount(value: string): number {
	switch (value) {
		case "empty":
		case "Empty":
			return 0;
		case "shrink":
		case "64 rows":
			return 64;
		case "full":
		case "10,000 rows":
		default:
			return FULL_ITEM_COUNT;
	}
}

function rangesMatch(left: VirtualItemRange, right: VirtualItemRange): boolean {
	return left.startIndex === right.startIndex && left.endIndex === right.endIndex;
}

function takeMissions(count: number): ReadonlyArray<MissionRow> {
	const result = new Array<MissionRow>();
	for (let index = 0; index < math.min(count, missions.size()); index += 1) {
		result.push(missions[index]);
	}
	return result;
}

function VirtualListStoryCanvas({
	controls: currentControls,
}: {
	readonly controls: VirtualListStoryControls;
}): React.ReactElement {
	const itemCount = resolveItemCount(currentControls.dataset);
	const visibleItems = React.useMemo(() => takeMissions(itemCount), [itemCount]);
	const rootRef = React.useRef<ScrollingFrame>();
	const apiRef = React.useRef<VirtualListApi<string>>();
	const [visibleRange, setVisibleRange] = React.useState<VirtualItemRange>({ startIndex: 0, endIndex: 0 });
	const [mountedCount, setMountedCount] = React.useState(0);
	const [status, setStatus] = React.useState(
		"Ready. Jump commands use apiRef; the diagnostic reads the normal root ref.",
	);
	const overscan = math.max(0, math.floor(currentControls.overscan));

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
		currentControls.gap,
		currentControls.viewportHeight,
		itemCount,
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
					<Text text="VirtualList" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="A fixed-height vertical collection that keeps only the visible and overscanned rows mounted. Resize the viewport, shrink from 10,000 rows, or jump by index/key; the same public API owns every example below."
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
								runCommand("Selected key", () => apiRef.current?.scrollToKey("mission-2048", "center") ?? false)
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
							onPress={() => runCommand("Last key", () => apiRef.current?.scrollToKey("mission-9999", "end") ?? false)}
						/>
					</Stack>
					<Text text={status} size="sm" color={themeRefs.text.secondary} width="100%" wrap />
					<Stack width="100%" direction="horizontal" gap="lg" align="center">
						<Text text={`Dataset ${itemCount}`} size="sm" color={themeRefs.text.secondary} />
						<Text
							text={`Visible [${visibleRange.startIndex}, ${visibleRange.endIndex})`}
							size="sm"
							weight={700}
							color={themeRefs.text.primary}
						/>
						<Text text={`Mounted roots ${mountedCount}`} size="sm" color={themeRefs.text.secondary} />
						<Text text={`Overscan ${overscan}`} size="sm" color={themeRefs.text.secondary} />
					</Stack>
					<Box width="100%" bg={themeRefs.background.default} borderColor={themeRefs.border.default} radius="md" clip>
						<VirtualList
							items={visibleItems}
							itemHeight={ITEM_HEIGHT}
							gap={currentControls.gap}
							overscan={overscan}
							getKey={getMissionKey}
							renderItem={({ item, index, visible }) => {
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
										variant={item.selected ? "filled" : "subtle"}
										color="primary"
										disabled={item.disabled}
										label={`${index + 1}. ${item.label} · ${stateLabel}`}
										onPress={() => setStatus(`Activated ${item.label} (${item.id})`)}
										slotProps={{ root: { TextXAlignment: Enum.TextXAlignment.Left } }}
									/>
								);
							}}
							width="100%"
							height={currentControls.viewportHeight}
							p="sm"
							bg={themeRefs.background.default}
							scrollbarSize={8}
							scrollbarColor={themeRefs.primary.main}
							selectionGroup
							selectionBehaviorUp={Enum.SelectionBehavior.Stop}
							selectionBehaviorDown={Enum.SelectionBehavior.Stop}
							onVisibleRangeChange={(nextRange) =>
								setVisibleRange((currentRange) => (rangesMatch(currentRange, nextRange) ? currentRange : nextRange))
							}
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
							text="Empty dataset: the canvas and mounted window both collapse to zero without stale rows."
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
		name: "VirtualList",
		summary:
			"Fixed-height vertical virtualization with stable consumer keys, sparse mounted rows, visible-range reporting, and index/key imperative scrolling.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => (
		<StoryThemeProvider mode={props.controls.theme}>
			<VirtualListStoryCanvas controls={props.controls} />
		</StoryThemeProvider>
	),
);

export = story;
