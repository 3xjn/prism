import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import {
	resolveFixedGridLaneCount,
	resolveFixedVirtualGeometry,
	resolveFixedVirtualRange,
	type FixedVirtualGeometry,
	type FixedVirtualRange,
} from "../lib/virtualization/_internal/fixedVirtualGeometry";

const HttpService = game.GetService("HttpService");
const Players = game.GetService("Players");
const RunService = game.GetService("RunService");
const Stats = game.GetService("Stats");

type BenchmarkShape = "list" | "grid";
type BenchmarkStrategy = "eager" | "window";

interface BenchmarkConfig {
	readonly strategy: BenchmarkStrategy;
	readonly shape: BenchmarkShape;
	readonly itemCount: number;
	readonly overscanLines: number;
}

interface BenchmarkProbe {
	contentRoot?: Frame;
	geometry?: FixedVirtualGeometry;
	renderedEnd: number;
	renderedStart: number;
	viewport?: ScrollingFrame;
}

interface MemorySnapshot {
	readonly instanceCount: number;
	readonly instancesMb: number;
	readonly luaHeapMb: number;
	readonly totalMb: number;
}

interface TrialResult {
	readonly blankFrames: number;
	readonly blankFramesSampled: number;
	readonly frameSamples: ReadonlyArray<number>;
	readonly guiObjects: number;
	/** ContentRoot plus all descendants; retained under this raw-capture field name for schema compatibility. */
	readonly instanceDescendants: number;
	readonly memoryBaseline: MemorySnapshot;
	readonly memoryMounted: MemorySnapshot;
	readonly memoryUnmounted: MemorySnapshot;
	readonly mountMs: number;
	readonly mountedItemRoots: number;
	readonly renderCpuSamples: ReadonlyArray<number>;
	readonly renderGpuSamples: ReadonlyArray<number>;
}

const VIEWPORT_WIDTH = 680;
const VIEWPORT_HEIGHT = 320;
const LIST_ITEM_EXTENT = 56;
const LIST_GAP = 8;
const GRID_ITEM_EXTENT = 116;
const GRID_GAP = 12;
const GRID_MINIMUM_CELL_WIDTH = 148;
const SCROLLBAR_GUTTER = 14;
const OVERSCAN_LINES = 2;
const SCRIPTED_VIEWPORTS_PER_SECOND = 6;

const WARMUP_TRIALS = 3;
const RECORDED_TRIALS = 5;
const WARMUP_FRAMES = 60;
const MEASURED_FRAMES = 120;
const BLANK_CHECK_FRAMES = 60;
const MEMORY_SAMPLE_FRAMES = 5;
const MOUNT_TIMEOUT_FRAMES = 1_800;

const BACKGROUND_COLOR = Color3.fromRGB(19, 23, 31);
const SURFACE_COLOR = Color3.fromRGB(31, 38, 50);
const BORDER_COLOR = Color3.fromRGB(74, 86, 105);
const PRIMARY_COLOR = Color3.fromRGB(76, 141, 255);
const INFO_COLOR = Color3.fromRGB(56, 170, 255);
const SUCCESS_COLOR = Color3.fromRGB(72, 196, 120);
const TEXT_PRIMARY_COLOR = Color3.fromRGB(238, 242, 248);
const TEXT_SECONDARY_COLOR = Color3.fromRGB(166, 176, 194);

function resolveGeometry(config: BenchmarkConfig): FixedVirtualGeometry {
	const laneCount =
		config.shape === "grid"
			? resolveFixedGridLaneCount({
					viewportWidth: VIEWPORT_WIDTH - SCROLLBAR_GUTTER,
					minimumCellWidth: GRID_MINIMUM_CELL_WIDTH,
					columnGap: GRID_GAP,
				})
			: 1;

	return resolveFixedVirtualGeometry({
		itemCount: config.itemCount,
		itemExtent: config.shape === "grid" ? GRID_ITEM_EXTENT : LIST_ITEM_EXTENT,
		lineGap: config.shape === "grid" ? GRID_GAP : LIST_GAP,
		laneCount,
	});
}

function rangesMatch(left: FixedVirtualRange, right: FixedVirtualRange): boolean {
	return (
		left.visibleItemRange.startIndex === right.visibleItemRange.startIndex &&
		left.visibleItemRange.endIndex === right.visibleItemRange.endIndex &&
		left.renderedItemRange.startIndex === right.renderedItemRange.startIndex &&
		left.renderedItemRange.endIndex === right.renderedItemRange.endIndex
	);
}

interface BenchmarkItemProps {
	readonly geometry: FixedVirtualGeometry;
	readonly index: number;
	readonly shape: BenchmarkShape;
}

function BenchmarkItem({ geometry, index, shape }: BenchmarkItemProps): React.ReactElement {
	const line = math.floor(index / geometry.laneCount);
	const lane = index % geometry.laneCount;
	const usableWidth = VIEWPORT_WIDTH - SCROLLBAR_GUTTER;
	const crossGap = shape === "grid" ? GRID_GAP : 0;
	const cellWidth =
		shape === "grid"
			? (usableWidth - crossGap * math.max(geometry.laneCount - 1, 0)) / geometry.laneCount
			: usableWidth;
	const accentColor = index % 3 === 0 ? PRIMARY_COLOR : index % 3 === 1 ? INFO_COLOR : SUCCESS_COLOR;
	const x = lane * (cellWidth + crossGap);
	const y = line * geometry.lineStride;
	const itemNumber = index + 1;

	return (
		<frame
			ref={(instance) => {
				if (instance !== undefined) {
					instance.Name = `item-${index}`;
				}
			}}
			BackgroundColor3={SURFACE_COLOR}
			BorderSizePixel={0}
			ClipsDescendants={true}
			Position={UDim2.fromOffset(x, y)}
			Size={UDim2.fromOffset(cellWidth, geometry.itemExtent)}
			Active={false}
			Selectable={false}
		>
			<uicorner CornerRadius={new UDim(0, 8)} />
			<uistroke Color={BORDER_COLOR} Thickness={1} Transparency={0.08} />
			<frame
				BackgroundColor3={accentColor}
				BackgroundTransparency={0.12}
				BorderSizePixel={0}
				Position={shape === "grid" ? UDim2.fromOffset(12, 12) : UDim2.fromOffset(12, 10)}
				Size={UDim2.fromOffset(36, 36)}
				Active={false}
				Selectable={false}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
			</frame>
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={shape === "grid" ? UDim2.fromOffset(12, 56) : UDim2.fromOffset(60, 8)}
				Size={shape === "grid" ? new UDim2(1, -24, 0, 24) : new UDim2(1, -72, 0, 22)}
				Text={shape === "grid" ? `Asset ${itemNumber}` : `Inventory record ${itemNumber}`}
				TextColor3={TEXT_PRIMARY_COLOR}
				TextSize={14}
				Font={Enum.Font.Gotham}
				TextTruncate={Enum.TextTruncate.AtEnd}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Center}
			/>
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={shape === "grid" ? UDim2.fromOffset(12, 80) : UDim2.fromOffset(60, 29)}
				Size={shape === "grid" ? new UDim2(1, -24, 0, 20) : new UDim2(1, -72, 0, 18)}
				Text={
					shape === "grid"
						? `slot ${lane + 1} - line ${line + 1}`
						: `Stable key item-${itemNumber} - fixed ${geometry.itemExtent}px row`
				}
				TextColor3={TEXT_SECONDARY_COLOR}
				TextSize={12}
				Font={Enum.Font.Gotham}
				TextTruncate={Enum.TextTruncate.AtEnd}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Center}
			/>
		</frame>
	);
}

interface BenchmarkSurfaceProps {
	readonly config: BenchmarkConfig;
	readonly probe: BenchmarkProbe;
}

function BenchmarkSurface({ config, probe }: BenchmarkSurfaceProps): React.ReactElement {
	const geometry = React.useMemo(
		() => resolveGeometry(config),
		[config.itemCount, config.overscanLines, config.shape, config.strategy],
	);
	const initialScrollOffset = math.max(0, geometry.canvasExtent - VIEWPORT_HEIGHT) * 0.3;
	const [observedRange, setObservedRange] = React.useState(() =>
		resolveFixedVirtualRange(geometry, {
			scrollOffset: initialScrollOffset,
			viewportExtent: VIEWPORT_HEIGHT,
			overscanLines: config.overscanLines,
		}),
	);
	const canvasConnectionRef = React.useRef<RBXScriptConnection>();

	const bindViewport = React.useCallback(
		(instance: ScrollingFrame | undefined) => {
			canvasConnectionRef.current?.Disconnect();
			canvasConnectionRef.current = undefined;
			probe.viewport = instance;

			if (instance === undefined) {
				return;
			}

			instance.CanvasPosition = new Vector2(0, initialScrollOffset);
			if (config.strategy === "window") {
				const updateRange = () => {
					debug.profilebegin("PrismVirtualRangeResolve");
					const nextRange = resolveFixedVirtualRange(geometry, {
						scrollOffset: instance.CanvasPosition.Y,
						viewportExtent: VIEWPORT_HEIGHT,
						overscanLines: config.overscanLines,
					});
					debug.profileend();
					setObservedRange((current) => (rangesMatch(current, nextRange) ? current : nextRange));
				};

				canvasConnectionRef.current = instance.GetPropertyChangedSignal("CanvasPosition").Connect(updateRange);
			}
		},
		[config.overscanLines, config.strategy, geometry, initialScrollOffset, probe],
	);

	React.useEffect(
		() => () => {
			canvasConnectionRef.current?.Disconnect();
			canvasConnectionRef.current = undefined;
		},
		[],
	);

	const renderedStart = config.strategy === "eager" ? 0 : observedRange.renderedItemRange.startIndex;
	const renderedEnd = config.strategy === "eager" ? config.itemCount : observedRange.renderedItemRange.endIndex;
	const renderedItems = new Array<React.ReactElement>();
	for (let index = renderedStart; index < renderedEnd; index += 1) {
		renderedItems.push(
			<BenchmarkItem key={`benchmark-${index}`} geometry={geometry} index={index} shape={config.shape} />,
		);
	}

	probe.geometry = geometry;
	probe.renderedStart = renderedStart;
	probe.renderedEnd = renderedEnd;

	return (
		<frame BackgroundColor3={BACKGROUND_COLOR} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)}>
			<scrollingframe
				ref={bindViewport}
				Active={true}
				Selectable={false}
				AnchorPoint={new Vector2(0.5, 0.5)}
				AutomaticCanvasSize={Enum.AutomaticSize.None}
				BackgroundColor3={BACKGROUND_COLOR}
				BorderSizePixel={0}
				CanvasSize={UDim2.fromOffset(0, geometry.canvasExtent)}
				ClipsDescendants={true}
				Position={UDim2.fromScale(0.5, 0.5)}
				ScrollBarImageColor3={TEXT_SECONDARY_COLOR}
				ScrollBarImageTransparency={0.2}
				ScrollBarThickness={8}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				ScrollingEnabled={geometry.canvasExtent > VIEWPORT_HEIGHT}
				Size={UDim2.fromOffset(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)}
			>
				<frame
					ref={(instance) => {
						probe.contentRoot = instance;
						if (instance !== undefined) {
							instance.Name = "ContentRoot";
						}
					}}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={UDim2.fromOffset(0, 0)}
					Size={UDim2.fromOffset(VIEWPORT_WIDTH - SCROLLBAR_GUTTER, geometry.canvasExtent)}
				>
					{renderedItems}
				</frame>
			</scrollingframe>
		</frame>
	);
}

function copyAndSort(values: ReadonlyArray<number>): Array<number> {
	const sorted = values.map((value) => value);
	sorted.sort((left, right) => left < right);
	return sorted;
}

function percentile(values: ReadonlyArray<number>, fraction: number): number {
	if (values.size() === 0) {
		return 0;
	}

	const sorted = copyAndSort(values);
	const index = math.clamp(math.ceil(sorted.size() * fraction) - 1, 0, sorted.size() - 1);
	return sorted[index];
}

function median(values: ReadonlyArray<number>): number {
	return percentile(values, 0.5);
}

function round(value: number, decimalPlaces = 3): number {
	const factor = math.pow(10, decimalPlaces);
	return math.round(value * factor) / factor;
}

function waitFrame(): number {
	const [deltaTime] = RunService.PreRender.Wait();
	return deltaTime;
}

function readMemory(): MemorySnapshot {
	return {
		instanceCount: Stats.InstanceCount,
		instancesMb: Stats.MemoryTrackingEnabled
			? Stats.GetMemoryUsageMbForTag(Enum.DeveloperMemoryTag.Instances)
			: 0,
		luaHeapMb: Stats.MemoryTrackingEnabled
			? Stats.GetMemoryUsageMbForTag(Enum.DeveloperMemoryTag.LuaHeap)
			: 0,
		totalMb: Stats.GetTotalMemoryUsageMb(),
	};
}

function medianMemory(samples: ReadonlyArray<MemorySnapshot>): MemorySnapshot {
	return {
		instanceCount: median(samples.map((sample) => sample.instanceCount)),
		instancesMb: median(samples.map((sample) => sample.instancesMb)),
		luaHeapMb: median(samples.map((sample) => sample.luaHeapMb)),
		totalMb: median(samples.map((sample) => sample.totalMb)),
	};
}

function sampleMemory(frameCount: number): MemorySnapshot {
	const samples = new Array<MemorySnapshot>();
	for (let frame = 0; frame < frameCount; frame += 1) {
		waitFrame();
		samples.push(readMemory());
	}
	return medianMemory(samples);
}

function countGuiObjects(root: Instance): number {
	let count = root.IsA("GuiObject") ? 1 : 0;
	for (const descendant of root.GetDescendants()) {
		if (descendant.IsA("GuiObject")) {
			count += 1;
		}
	}
	return count;
}

function updateScroll(probe: BenchmarkProbe, direction: number, deltaTime: number): number {
	const viewport = probe.viewport;
	const geometry = probe.geometry;
	if (viewport === undefined || geometry === undefined) {
		return direction;
	}

	const maxOffset = math.max(0, geometry.canvasExtent - VIEWPORT_HEIGHT);
	const speed = VIEWPORT_HEIGHT * SCRIPTED_VIEWPORTS_PER_SECOND;
	let nextOffset = viewport.CanvasPosition.Y + speed * deltaTime * direction;
	let nextDirection = direction;
	if (nextOffset >= maxOffset) {
		nextOffset = maxOffset;
		nextDirection = -1;
	} else if (nextOffset <= 0) {
		nextOffset = 0;
		nextDirection = 1;
	}
	viewport.CanvasPosition = new Vector2(0, nextOffset);
	return nextDirection;
}

function countBlankFrame(probe: BenchmarkProbe, config: BenchmarkConfig): boolean {
	const contentRoot = probe.contentRoot;
	const viewport = probe.viewport;
	const geometry = probe.geometry;
	if (contentRoot === undefined || viewport === undefined || geometry === undefined) {
		return true;
	}

	const visibleRange = resolveFixedVirtualRange(geometry, {
		scrollOffset: viewport.CanvasPosition.Y,
		viewportExtent: VIEWPORT_HEIGHT,
		overscanLines: config.overscanLines,
	}).visibleItemRange;
	for (let index = visibleRange.startIndex; index < visibleRange.endIndex; index += 1) {
		if (contentRoot.FindFirstChild(`item-${index}`) === undefined) {
			return true;
		}
	}
	return false;
}

function destroyTrial(root: ReactRoblox.Root, screenGui: ScreenGui): void {
	root.unmount();
	screenGui.Destroy();
}

function runTrial(playerGui: PlayerGui, config: BenchmarkConfig, recorded: boolean): TrialResult | undefined {
	const memoryBaseline = recorded ? sampleMemory(MEMORY_SAMPLE_FRAMES) : readMemory();
	const screenGui = new Instance("ScreenGui");
	screenGui.Name = "PrismVirtualizationBenchmark";
	screenGui.IgnoreGuiInset = true;
	screenGui.ResetOnSpawn = false;
	screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	screenGui.Parent = playerGui;

	const probe: BenchmarkProbe = {
		renderedEnd: 0,
		renderedStart: 0,
	};
	const root = ReactRoblox.createRoot(screenGui);
	const mountStartedAt = os.clock();
	debug.profilebegin("PrismVirtualMount");
	root.render(<BenchmarkSurface config={config} probe={probe} />);
	debug.profileend();

	let stableFrames = 0;
	let previousRootCount = -1;
	let mountedItemRoots = 0;
	for (let frame = 0; frame < MOUNT_TIMEOUT_FRAMES; frame += 1) {
		waitFrame();
		const contentRoot = probe.contentRoot;
		const expectedCount = probe.renderedEnd - probe.renderedStart;
		mountedItemRoots = contentRoot?.GetChildren().size() ?? 0;
		if (contentRoot !== undefined && mountedItemRoots === expectedCount && mountedItemRoots === previousRootCount) {
			stableFrames += 1;
		} else {
			stableFrames = 0;
		}
		previousRootCount = mountedItemRoots;
		if (stableFrames >= 2) {
			break;
		}
	}
	if (stableFrames < 2) {
		destroyTrial(root, screenGui);
		error(`Virtualization benchmark mount timed out for ${config.strategy}/${config.shape}/${config.itemCount}`);
	}

	const mountMs = (os.clock() - mountStartedAt) * 1_000;
	if (!recorded) {
		let warmupDirection = 1;
		for (let frame = 0; frame < WARMUP_FRAMES; frame += 1) {
			warmupDirection = updateScroll(probe, warmupDirection, waitFrame());
		}
		destroyTrial(root, screenGui);
		for (let frame = 0; frame < MEMORY_SAMPLE_FRAMES; frame += 1) {
			waitFrame();
		}
		return undefined;
	}

	const contentRoot = probe.contentRoot;
	if (contentRoot === undefined) {
		destroyTrial(root, screenGui);
		error("Virtualization benchmark content root disappeared after mount");
	}
	const memoryMounted = sampleMemory(MEMORY_SAMPLE_FRAMES);
	const guiObjects = countGuiObjects(contentRoot);
	const instanceDescendants = contentRoot.GetDescendants().size() + 1;

	let direction = 1;
	for (let frame = 0; frame < WARMUP_FRAMES; frame += 1) {
		direction = updateScroll(probe, direction, waitFrame());
	}

	const frameSamples = new Array<number>();
	const renderCpuSamples = new Array<number>();
	const renderGpuSamples = new Array<number>();
	for (let frame = 0; frame < MEASURED_FRAMES; frame += 1) {
		const deltaTime = waitFrame();
		debug.profilebegin("PrismVirtualMeasuredFrame");
		direction = updateScroll(probe, direction, deltaTime);
		frameSamples.push(Stats.FrameTime * 1_000);
		renderCpuSamples.push(Stats.RenderCPUFrameTime * 1_000);
		renderGpuSamples.push(Stats.RenderGPUFrameTime * 1_000);
		debug.profileend();
	}

	let blankFrames = 0;
	for (let frame = 0; frame < BLANK_CHECK_FRAMES; frame += 1) {
		direction = updateScroll(probe, direction, waitFrame());
		if (countBlankFrame(probe, config)) {
			blankFrames += 1;
		}
	}

	destroyTrial(root, screenGui);
	const memoryUnmounted = sampleMemory(MEMORY_SAMPLE_FRAMES);
	return {
		blankFrames,
		blankFramesSampled: BLANK_CHECK_FRAMES,
		frameSamples,
		guiObjects,
		instanceDescendants,
		memoryBaseline,
		memoryMounted,
		memoryUnmounted,
		mountMs,
		mountedItemRoots,
		renderCpuSamples,
		renderGpuSamples,
	};
}

function flattenSamples(
	results: ReadonlyArray<TrialResult>,
	selector: (result: TrialResult) => ReadonlyArray<number>,
): Array<number> {
	const samples = new Array<number>();
	for (const result of results) {
		for (const sample of selector(result)) {
			samples.push(sample);
		}
	}
	return samples;
}

function aggregateResults(config: BenchmarkConfig, results: ReadonlyArray<TrialResult>): object {
	const frameSamples = flattenSamples(results, (result) => result.frameSamples);
	const renderCpuSamples = flattenSamples(results, (result) => result.renderCpuSamples);
	const renderGpuSamples = flattenSamples(results, (result) => result.renderGpuSamples);
	const blankFrames = results.reduce((total, result) => total + result.blankFrames, 0);
	const blankFramesSampled = results.reduce((total, result) => total + result.blankFramesSampled, 0);

	return {
		strategy: config.strategy,
		shape: config.shape,
		items: config.itemCount,
		overscanLines: config.overscanLines,
		viewport: `${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`,
		speedViewportsPerSecond: SCRIPTED_VIEWPORTS_PER_SECOND,
		warmupTrials: WARMUP_TRIALS,
		recordedTrials: RECORDED_TRIALS,
		framesPerTrial: MEASURED_FRAMES,
		mountMs: round(median(results.map((result) => result.mountMs))),
		mountedItemRoots: median(results.map((result) => result.mountedItemRoots)),
		guiObjects: median(results.map((result) => result.guiObjects)),
		instanceDescendants: median(results.map((result) => result.instanceDescendants)),
		luaHeapDeltaMb: round(
			median(results.map((result) => result.memoryMounted.luaHeapMb - result.memoryBaseline.luaHeapMb)),
	),
		instancesDeltaMb: round(
			median(results.map((result) => result.memoryMounted.instancesMb - result.memoryBaseline.instancesMb)),
	),
		totalMemoryDeltaMb: round(
			median(results.map((result) => result.memoryMounted.totalMb - result.memoryBaseline.totalMb)),
	),
		residualTotalMemoryDeltaMb: round(
			median(results.map((result) => result.memoryUnmounted.totalMb - result.memoryBaseline.totalMb)),
	),
		frameP50Ms: round(percentile(frameSamples, 0.5)),
		frameP95Ms: round(percentile(frameSamples, 0.95)),
		frameMaxMs: round(percentile(frameSamples, 1)),
		renderCpuP95Ms: round(percentile(renderCpuSamples, 0.95)),
		renderGpuP95Ms: round(percentile(renderGpuSamples, 0.95)),
		blankFrames,
		blankFramesSampled,
		memoryTrackingEnabled: Stats.MemoryTrackingEnabled,
	};
}

function buildMatrix(): Array<BenchmarkConfig> {
	const configs = new Array<BenchmarkConfig>();
	const counts = [100, 1_000, 5_000, 10_000];
	const shapes = ["list", "grid"] as const;
	for (const shape of shapes) {
		for (let countIndex = 0; countIndex < counts.size(); countIndex += 1) {
			const strategies =
				countIndex % 2 === 0
					? (["window", "eager"] as const)
					: (["eager", "window"] as const);
			for (const strategy of strategies) {
				configs.push({
					strategy,
					shape,
					itemCount: counts[countIndex],
					overscanLines: OVERSCAN_LINES,
				});
			}
		}
	}
	return configs;
}

function runBenchmark(): void {
	if (!RunService.IsClient()) {
		error("Virtualization benchmark runner must execute on a client");
	}
	const player = Players.LocalPlayer;
	if (player === undefined) {
		error("Virtualization benchmark runner could not resolve LocalPlayer");
	}
	const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
	print(
		`PRISM_VIRTUAL_BENCH_CONFIG ${HttpService.JSONEncode({
			viewport: `${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`,
			overscanLines: OVERSCAN_LINES,
			speedViewportsPerSecond: SCRIPTED_VIEWPORTS_PER_SECOND,
			warmupTrials: WARMUP_TRIALS,
			recordedTrials: RECORDED_TRIALS,
			warmupFrames: WARMUP_FRAMES,
			measuredFrames: MEASURED_FRAMES,
			blankCheckFrames: BLANK_CHECK_FRAMES,
			memoryTrackingEnabled: Stats.MemoryTrackingEnabled,
		})}`,
	);

	const matrix = buildMatrix();
	for (let configIndex = 0; configIndex < matrix.size(); configIndex += 1) {
		const config = matrix[configIndex];
		print(
			`PRISM_VIRTUAL_BENCH_PROGRESS ${configIndex + 1}/${matrix.size()} ${config.strategy}/${config.shape}/${config.itemCount}`,
		);
		for (let trial = 0; trial < WARMUP_TRIALS; trial += 1) {
			runTrial(playerGui, config, false);
		}
		const results = new Array<TrialResult>();
		for (let trial = 0; trial < RECORDED_TRIALS; trial += 1) {
			const result = runTrial(playerGui, config, true);
			if (result !== undefined) {
				results.push(result);
			}
		}
		print(`PRISM_VIRTUAL_BENCH_RESULT ${HttpService.JSONEncode(aggregateResults(config, results))}`);
	}
	print("PRISM_VIRTUAL_BENCH_COMPLETE");
}

task.spawn(runBenchmark);
