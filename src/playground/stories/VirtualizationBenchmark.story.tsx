import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";

import { Box, Stack, Text } from "@prism";
import { theme as themeRefs, useTheme } from "@prism/theme";

import {
	resolveFixedGridLaneCount,
	resolveFixedVirtualGeometry,
	resolveFixedVirtualRange,
	type FixedVirtualGeometry,
	type FixedVirtualRange,
} from "../../lib/virtualization/_internal/fixedVirtualGeometry";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const RunService = game.GetService("RunService");

type BenchmarkStrategy = "window" | "eager";
type BenchmarkShape = "list" | "grid";
type BenchmarkSpeed = "off" | "slow" | "fast";

const VIEWPORT_FALLBACK_SIZE = new Vector2(680, 320);
const LIST_ITEM_EXTENT = 56;
const LIST_GAP = 8;
const GRID_ITEM_EXTENT = 116;
const GRID_GAP = 12;
const GRID_MINIMUM_CELL_WIDTH = 148;
const SCROLLBAR_GUTTER = 14;

const controls = {
	theme: storyThemeControl,
	strategy: EnumList({ window: "Local window", eager: "Eager mount" }, "window"),
	shape: EnumList({ list: "List", grid: "Grid" }, "grid"),
	itemCount: EnumList(
		{ hundred: "100", thousand: "1,000", fiveThousand: "5,000", tenThousand: "10,000" },
		"tenThousand",
	),
	overscan: Number(2, 0, 10, 1),
	scriptedSpeed: EnumList({ off: "Off", slow: "3x viewport/s", fast: "6x viewport/s" }, "off"),
};

type BenchmarkControls = InferControls<typeof controls>;

function resolveItemCount(value: string): number {
	switch (value) {
		case "hundred":
		case "100":
			return 100;
		case "thousand":
		case "1,000":
			return 1_000;
		case "fiveThousand":
		case "5,000":
			return 5_000;
		case "tenThousand":
		case "10,000":
		default:
			return 10_000;
	}
}

function resolveStrategy(value: string): BenchmarkStrategy {
	return value === "eager" || value === "Eager mount" ? "eager" : "window";
}

function resolveShape(value: string): BenchmarkShape {
	return value === "grid" || value === "Grid" ? "grid" : "list";
}

function resolveSpeed(value: string): BenchmarkSpeed {
	if (value === "slow" || value === "3x viewport/s") {
		return "slow";
	}
	if (value === "fast" || value === "6x viewport/s") {
		return "fast";
	}

	return "off";
}

function resolveScriptedSpeed(value: BenchmarkSpeed, viewportHeight: number): number {
	switch (value) {
		case "slow":
			return viewportHeight * 3;
		case "fast":
			return viewportHeight * 6;
		case "off":
		default:
			return 0;
	}
}

function resolveGeometry(itemCount: number, shape: BenchmarkShape, viewportWidth: number): FixedVirtualGeometry {
	const laneCount =
		shape === "grid"
			? resolveFixedGridLaneCount({
					viewportWidth: math.max(0, viewportWidth - SCROLLBAR_GUTTER),
					minimumCellWidth: GRID_MINIMUM_CELL_WIDTH,
					columnGap: GRID_GAP,
				})
			: 1;

	return resolveFixedVirtualGeometry({
		itemCount,
		itemExtent: shape === "grid" ? GRID_ITEM_EXTENT : LIST_ITEM_EXTENT,
		lineGap: shape === "grid" ? GRID_GAP : LIST_GAP,
		laneCount,
	});
}

function rangesMatch(left: FixedVirtualRange, right: FixedVirtualRange): boolean {
	return (
		left.maxScrollOffset === right.maxScrollOffset &&
		left.visibleLineRange.startLine === right.visibleLineRange.startLine &&
		left.visibleLineRange.endLine === right.visibleLineRange.endLine &&
		left.renderedLineRange.startLine === right.renderedLineRange.startLine &&
		left.renderedLineRange.endLine === right.renderedLineRange.endLine &&
		left.visibleItemRange.startIndex === right.visibleItemRange.startIndex &&
		left.visibleItemRange.endIndex === right.visibleItemRange.endIndex &&
		left.renderedItemRange.startIndex === right.renderedItemRange.startIndex &&
		left.renderedItemRange.endIndex === right.renderedItemRange.endIndex
	);
}

interface BenchmarkItemProps {
	readonly index: number;
	readonly shape: BenchmarkShape;
	readonly geometry: FixedVirtualGeometry;
	readonly viewportWidth: number;
}

function BenchmarkItem({ index, shape, geometry, viewportWidth }: BenchmarkItemProps): React.ReactElement {
	const theme = useTheme();
	const line = math.floor(index / geometry.laneCount);
	const lane = index % geometry.laneCount;
	const usableWidth = math.max(0, viewportWidth - SCROLLBAR_GUTTER);
	const crossGap = shape === "grid" ? GRID_GAP : 0;
	const cellWidth =
		shape === "grid"
			? math.max(0, (usableWidth - crossGap * math.max(geometry.laneCount - 1, 0)) / geometry.laneCount)
			: usableWidth;
	const x = lane * (cellWidth + crossGap);
	const y = line * geometry.lineStride;
	const itemNumber = index + 1;
	const accentColor = index % 3 === 0 ? theme.colors.primary.main : index % 3 === 1 ? theme.colors.info.main : theme.colors.success.main;
	const label = shape === "grid" ? `Asset ${itemNumber}` : `Inventory record ${itemNumber}`;
	const detail = shape === "grid" ? `slot ${lane + 1} · line ${line + 1}` : `Stable key item-${itemNumber} · fixed ${geometry.itemExtent}px row`;

	return (
		<frame
			key={`benchmark-item-${index}`}
			BackgroundColor3={theme.colors.background.surface}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			ClipsDescendants={true}
			Position={UDim2.fromOffset(x, y)}
			Size={UDim2.fromOffset(cellWidth, geometry.itemExtent)}
			Active={false}
			Selectable={false}
		>
			<uicorner CornerRadius={new UDim(0, theme.radius.md)} />
			<uistroke Color={theme.colors.border.default} Thickness={1} Transparency={0.08} />
			<frame
				BackgroundColor3={accentColor}
				BackgroundTransparency={0.12}
				BorderSizePixel={0}
				Position={shape === "grid" ? UDim2.fromOffset(12, 12) : UDim2.fromOffset(12, 10)}
				Size={shape === "grid" ? UDim2.fromOffset(36, 36) : UDim2.fromOffset(36, 36)}
				Active={false}
				Selectable={false}
			>
				<uicorner CornerRadius={new UDim(0, theme.radius.sm)} />
			</frame>
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={shape === "grid" ? UDim2.fromOffset(12, 56) : UDim2.fromOffset(60, 8)}
				Size={
					shape === "grid"
						? new UDim2(1, -24, 0, 24)
						: new UDim2(1, -72, 0, 22)
				}
				Text={label}
				TextColor3={theme.colors.text.primary}
				TextSize={theme.fontSizes.sm}
				Font={theme.fontFamily}
				TextTruncate={Enum.TextTruncate.AtEnd}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Center}
			/>
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={shape === "grid" ? UDim2.fromOffset(12, 80) : UDim2.fromOffset(60, 29)}
				Size={
					shape === "grid"
						? new UDim2(1, -24, 0, 20)
						: new UDim2(1, -72, 0, 18)
				}
				Text={detail}
				TextColor3={theme.colors.text.secondary}
				TextSize={theme.fontSizes.xs}
				Font={theme.fontFamily}
				TextTruncate={Enum.TextTruncate.AtEnd}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Center}
			/>
		</frame>
	);
}

interface BenchmarkViewportProps {
	readonly strategy: BenchmarkStrategy;
	readonly shape: BenchmarkShape;
	readonly itemCount: number;
	readonly overscanLines: number;
	readonly scriptedSpeed: BenchmarkSpeed;
}

function BenchmarkViewport({
	strategy,
	shape,
	itemCount,
	overscanLines,
	scriptedSpeed,
}: BenchmarkViewportProps): React.ReactElement {
	const theme = useTheme();
	const [viewportInstance, setViewportInstance] = React.useState<ScrollingFrame>();
	const [viewportSize, setViewportSize] = React.useState(VIEWPORT_FALLBACK_SIZE);
	const geometry = React.useMemo(
		() => resolveGeometry(itemCount, shape, viewportSize.X),
		[itemCount, shape, viewportSize.X],
	);
	const [observedRange, setObservedRange] = React.useState(() =>
		resolveFixedVirtualRange(geometry, {
			scrollOffset: 0,
			viewportExtent: viewportSize.Y,
			overscanLines,
		}),
	);

	React.useEffect(() => {
		if (viewportInstance === undefined) {
			return;
		}

		const updateViewportSize = () => {
			const nextSize = viewportInstance.AbsoluteWindowSize;
			setViewportSize((current) =>
				current.X === nextSize.X && current.Y === nextSize.Y ? current : nextSize,
			);
		};

		updateViewportSize();
		const connection = viewportInstance.GetPropertyChangedSignal("AbsoluteWindowSize").Connect(updateViewportSize);
		return () => connection.Disconnect();
	}, [viewportInstance]);

	React.useEffect(() => {
		if (viewportInstance === undefined) {
			return;
		}

		const updateRange = () => {
			const nextRange = resolveFixedVirtualRange(geometry, {
				scrollOffset: viewportInstance.CanvasPosition.Y,
				viewportExtent: viewportSize.Y,
				overscanLines,
			});
			setObservedRange((current) => (rangesMatch(current, nextRange) ? current : nextRange));
		};

		updateRange();
		const connection = viewportInstance.GetPropertyChangedSignal("CanvasPosition").Connect(updateRange);
		return () => connection.Disconnect();
	}, [geometry, overscanLines, viewportInstance, viewportSize.Y]);

	React.useEffect(() => {
		if (viewportInstance !== undefined) {
			viewportInstance.CanvasPosition = new Vector2(0, 0);
		}
	}, [itemCount, shape, viewportInstance]);

	React.useEffect(() => {
		if (viewportInstance === undefined) {
			return;
		}

		const pixelsPerSecond = resolveScriptedSpeed(scriptedSpeed, math.max(viewportSize.Y, 1));
		if (pixelsPerSecond <= 0) {
			return;
		}

		let direction = 1;
		const connection = RunService.RenderStepped.Connect((deltaTime) => {
			const maxOffset = math.max(0, geometry.canvasExtent - viewportInstance.AbsoluteWindowSize.Y);
			let nextOffset = viewportInstance.CanvasPosition.Y + pixelsPerSecond * deltaTime * direction;
			if (nextOffset >= maxOffset) {
				nextOffset = maxOffset;
				direction = -1;
			} else if (nextOffset <= 0) {
				nextOffset = 0;
				direction = 1;
			}
			viewportInstance.CanvasPosition = new Vector2(0, nextOffset);
		});

		return () => connection.Disconnect();
	}, [geometry.canvasExtent, scriptedSpeed, viewportInstance, viewportSize.Y]);

	const renderedStart = strategy === "eager" ? 0 : observedRange.renderedItemRange.startIndex;
	const renderedEnd = strategy === "eager" ? itemCount : observedRange.renderedItemRange.endIndex;
	const renderedItems = new Array<React.ReactElement>();
	for (let index = renderedStart; index < renderedEnd; index += 1) {
		renderedItems.push(
			<BenchmarkItem
				key={`benchmark-${index}`}
				index={index}
				shape={shape}
				geometry={geometry}
				viewportWidth={viewportSize.X}
			/>,
		);
	}

	const mountedCount = renderedEnd - renderedStart;
	const theoreticalWindowBound = math.min(
		itemCount,
		geometry.laneCount *
			(math.ceil((viewportSize.Y + geometry.itemExtent) / math.max(geometry.lineStride, 1)) + overscanLines * 2),
	);
	const visibleLabel = `[${observedRange.visibleItemRange.startIndex}, ${observedRange.visibleItemRange.endIndex})`;
	const renderedLabel = `[${renderedStart}, ${renderedEnd})`;

	return (
		<Stack width="100%" gap="sm">
			<Stack width="100%" direction="horizontal" gap="lg" align="center">
				<Text text={`Visible ${visibleLabel}`} size="sm" color={themeRefs.text.secondary} />
				<Text text={`Mounted roots ${mountedCount}`} size="sm" weight={700} color={themeRefs.text.primary} />
				<Text text={`Rendered ${renderedLabel}`} size="sm" color={themeRefs.text.secondary} />
				<Text
					text={`Lanes ${geometry.laneCount} · window bound ${theoreticalWindowBound}`}
					size="sm"
					color={themeRefs.text.secondary}
				/>
			</Stack>
			<scrollingframe
				ref={setViewportInstance}
				Active={true}
				Selectable={false}
				AutomaticCanvasSize={Enum.AutomaticSize.None}
				BackgroundColor3={theme.colors.background.default}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				CanvasSize={UDim2.fromOffset(0, geometry.canvasExtent)}
				ClipsDescendants={true}
				ScrollBarImageColor3={theme.colors.text.disabled}
				ScrollBarImageTransparency={0.2}
				ScrollBarThickness={8}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				ScrollingEnabled={geometry.canvasExtent > viewportSize.Y}
				Size={new UDim2(1, 0, 0, VIEWPORT_FALLBACK_SIZE.Y)}
			>
				<uicorner CornerRadius={new UDim(0, theme.radius.md)} />
				<uistroke Color={theme.colors.border.default} Thickness={1} Transparency={0.04} />
				{renderedItems}
			</scrollingframe>
		</Stack>
	);
}

function VirtualizationBenchmarkCanvas({ controls: currentControls }: { readonly controls: BenchmarkControls }): React.ReactElement {
	const strategy = resolveStrategy(currentControls.strategy);
	const shape = resolveShape(currentControls.shape);
	const scriptedSpeed = resolveSpeed(currentControls.scriptedSpeed);
	const itemCount = resolveItemCount(currentControls.itemCount);
	const overscanLines = math.max(0, math.floor(currentControls.overscan));
	const eagerWarning = strategy === "eager" && itemCount >= 5_000;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Virtualization benchmark · internal" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="This story visualizes the fixed-range engine and exercises eager/local scrolling. It is not the timing source; recorded timing, memory, mounted-count, and correctness results come from the dedicated Play Solo runner documented in the benchmark decision."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					{eagerWarning ? (
						<Text
							text="Eager mode will intentionally mount thousands of item surfaces and may stall Studio. Start with 100 items before increasing the dataset."
							size="sm"
							weight={700}
							color={themeRefs.warning.main}
							wrap
							width="100%"
						/>
					) : undefined}
					<BenchmarkViewport
						strategy={strategy}
						shape={shape}
						itemCount={itemCount}
						overscanLines={overscanLines}
						scriptedSpeed={scriptedSpeed}
					/>
					<Text
						text="Measurement status: STORY UNMEASURED - RUNNER CAPTURE ACCEPTED. See docs/benchmarks/2026-07-10-fixed-virtual-range.md; do not compare editor impressions as benchmark results."
						size="sm"
						color={themeRefs.success.main}
						wrap
						width="100%"
					/>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Virtualization Benchmark",
		summary: "Measured fixed-geometry proof comparing eager and sparse-window list/grid mounting before the public virtual collection API.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => (
		<StoryThemeProvider mode={props.controls.theme}>
			<VirtualizationBenchmarkCanvas controls={props.controls} />
		</StoryThemeProvider>
	),
);

export = story;
