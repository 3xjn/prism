import { describe, expect, it } from "@rbxts/jest-globals";

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

const viewport: WindowViewport = { width: 1280, height: 720 };
const margin = 12;
const options = {
	minWidth: DEFAULT_WINDOW_MIN_WIDTH,
	minHeight: DEFAULT_WINDOW_MIN_HEIGHT,
	viewport,
	margin,
};

function expectBounds(actual: WindowBounds, expected: WindowBounds): void {
	expect(areWindowBoundsEqual(actual, expected)).toBe(true);
}

describe("window bounds", () => {
	it("uses generic floating default sizes", () => {
		expect(DEFAULT_WINDOW_WIDTH < 900 && DEFAULT_WINDOW_HEIGHT < 500).toBe(true);
	});

	it("resolves UDim values against the viewport", () => {
		expect(resolveUDimPixels(new UDim(0, 480), 1280)).toBe(480);
		expect(resolveUDimPixels(new UDim(0.5, 20), 800)).toBe(420);
	});

	it("centers the default size in the viewport", () => {
		const centered = resolveCenteredWindowPosition(480, 360, viewport);
		expect(centered.x).toBe(400);
		expect(centered.y).toBe(180);
	});

	it("clamps position to the viewport margin", () => {
		expectBounds(clampWindowBounds({ x: -80, y: -40, width: 480, height: 360 }, options), {
			x: 12,
			y: 12,
			width: 480,
			height: 360,
		});
	});

	it("clamps position so the window stays on-screen", () => {
		expectBounds(clampWindowBounds({ x: 2000, y: 2000, width: 480, height: 360 }, options), {
			x: 788,
			y: 348,
			width: 480,
			height: 360,
		});
	});

	it("shrinks oversized windows to the padded viewport", () => {
		const shrunk = clampWindowBounds({ x: 0, y: 0, width: 4000, height: 3000 }, options);
		expect(shrunk.width).toBe(1256);
		expect(shrunk.height).toBe(696);
		expect(shrunk.x).toBe(12);
		expect(shrunk.y).toBe(12);
	});

	it("clamps moves without changing size", () => {
		const moved = applyWindowMove({ x: 40, y: 40, width: 480, height: 360 }, -100, 80, options);
		expect(moved.x).toBe(12);
		expect(moved.y).toBe(80);
		expect(moved.width).toBe(480);
		expect(moved.height).toBe(360);
	});

	it("respects min size when resizing", () => {
		const resized = applyWindowResize({ x: 100, y: 100, width: 480, height: 360 }, 20, 20, options);
		expect(resized.width).toBe(DEFAULT_WINDOW_MIN_WIDTH);
		expect(resized.height).toBe(DEFAULT_WINDOW_MIN_HEIGHT);
		expect(resized.x).toBe(100);
		expect(resized.y).toBe(100);
	});

	it("cannot resize past the padded viewport", () => {
		const limited = applyWindowResize({ x: 1000, y: 500, width: 200, height: 160 }, 800, 800, options);
		expect(limited.width).toBe(268);
		expect(limited.height).toBe(208);
	});

	it("maximizes flush to the host", () => {
		expectBounds(resolveMaximizedWindowBounds(viewport), { x: 0, y: 0, width: 1280, height: 720 });
		expectBounds(resolveMaximizedWindowBounds({ width: 0, height: 0 }), { x: 0, y: 0, width: 0, height: 0 });
	});

	it("yields min size to a smaller viewport", () => {
		const tiny = clampWindowBounds(
			{ x: 0, y: 0, width: 480, height: 360 },
			{ minWidth: 400, minHeight: 280, viewport: { width: 200, height: 150 }, margin: 8 },
		);
		expect(tiny.width).toBe(184);
		expect(tiny.height).toBe(134);
	});
});
