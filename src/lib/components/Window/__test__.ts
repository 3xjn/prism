import {
	DEFAULT_WINDOW_HEIGHT,
	DEFAULT_WINDOW_MIN_HEIGHT,
	DEFAULT_WINDOW_MIN_WIDTH,
	DEFAULT_WINDOW_WIDTH,
	applyWindowMove,
	applyWindowResize,
	areWindowBoundsEqual,
	clampWindowBounds,
	resolveCenteredWindowPosition,
	resolveMaximizedWindowBounds,
	resolveUDimPixels,
	type WindowBounds,
	type WindowViewport,
} from "./utils";

function assertCondition(condition: boolean, message: string): void {
	if (!condition) {
		error(message);
	}
}

function assertBounds(actual: WindowBounds, expected: WindowBounds, label: string): void {
	assertCondition(
		areWindowBoundsEqual(actual, expected),
		`${label}: expected ${expected.x},${expected.y} ${expected.width}x${expected.height}, got ${actual.x},${actual.y} ${actual.width}x${actual.height}`,
	);
}

function runWindowAssertions(): void {
	const viewport: WindowViewport = { width: 1280, height: 720 };
	const margin = 12;
	const options = {
		minWidth: DEFAULT_WINDOW_MIN_WIDTH,
		minHeight: DEFAULT_WINDOW_MIN_HEIGHT,
		viewport,
		margin,
	};

	assertCondition(DEFAULT_WINDOW_WIDTH < 900 && DEFAULT_WINDOW_HEIGHT < 500, "defaults are generic floating sizes");
	assertCondition(resolveUDimPixels(new UDim(0, 480), 1280) === 480, "offset UDim resolves to pixels");
	assertCondition(resolveUDimPixels(new UDim(0.5, 20), 800) === 420, "scale UDim resolves against viewport");

	const centered = resolveCenteredWindowPosition(480, 360, viewport);
	assertCondition(centered.x === 400 && centered.y === 180, "default size centers in the viewport");

	assertBounds(
		clampWindowBounds({ x: -80, y: -40, width: 480, height: 360 }, options),
		{ x: 12, y: 12, width: 480, height: 360 },
		"position clamps to the viewport margin",
	);
	assertBounds(
		clampWindowBounds({ x: 2000, y: 2000, width: 480, height: 360 }, options),
		{ x: 788, y: 348, width: 480, height: 360 },
		"position clamps so the window stays on-screen",
	);

	const shrunk = clampWindowBounds({ x: 0, y: 0, width: 4000, height: 3000 }, options);
	assertCondition(shrunk.width === 1256 && shrunk.height === 696, "size shrinks to the padded viewport");
	assertCondition(shrunk.x === 12 && shrunk.y === 12, "oversized windows sit on the margin");

	const moved = applyWindowMove({ x: 40, y: 40, width: 480, height: 360 }, -100, 80, options);
	assertCondition(moved.x === 12 && moved.y === 80, "moves clamp X and keep a valid Y");
	assertCondition(moved.width === 480 && moved.height === 360, "moves do not change size");

	const resized = applyWindowResize({ x: 100, y: 100, width: 480, height: 360 }, 20, 20, options);
	assertCondition(resized.width === DEFAULT_WINDOW_MIN_WIDTH && resized.height === DEFAULT_WINDOW_MIN_HEIGHT, "resize respects min size");
	assertCondition(resized.x === 100 && resized.y === 100, "resize keeps the origin");

	const limited = applyWindowResize({ x: 1000, y: 500, width: 200, height: 160 }, 800, 800, options);
	assertCondition(limited.width === 268 && limited.height === 208, "resize cannot leave the padded viewport");

	assertBounds(resolveMaximizedWindowBounds(viewport), { x: 0, y: 0, width: 1280, height: 720 }, "maximize fills the host flush");
	assertBounds(
		resolveMaximizedWindowBounds({ width: 0, height: 0 }),
		{ x: 0, y: 0, width: 0, height: 0 },
		"maximize against an empty host stays at zero",
	);

	const tiny = clampWindowBounds(
		{ x: 0, y: 0, width: 480, height: 360 },
		{ minWidth: 400, minHeight: 280, viewport: { width: 200, height: 150 }, margin: 8 },
	);
	assertCondition(tiny.width === 184 && tiny.height === 134, "min size yields to a smaller viewport");

	print("window: PASS");
}

runWindowAssertions();
