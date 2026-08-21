const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

class UDim {
	constructor(scale = 0, offset = 0) {
		this.Scale = scale;
		this.Offset = offset;
	}
}

class UDim2 {
	constructor(a = 0, b = 0, c = 0, d = 0) {
		if (a instanceof UDim && b instanceof UDim && c === 0 && d === 0) {
			this.X = a;
			this.Y = b;
			return;
		}

		this.X = new UDim(a, b);
		this.Y = new UDim(c, d);
	}

	static fromOffset(x, y) {
		return new UDim2(0, x, 0, y);
	}

	static fromScale(x, y) {
		return new UDim2(x, 0, y, 0);
	}
}

function luaSub(value, start, finish) {
	const size = value.length;
	const normalizedStart = start >= 0 ? start : size + start + 1;
	const normalizedFinish = finish === undefined ? size : finish >= 0 ? finish : size + finish + 1;
	const startIndex = mathClamp(normalizedStart, 1, size + 1) - 1;
	const endIndex = mathClamp(normalizedFinish, 0, size);

	if (endIndex < startIndex + 1) {
		return "";
	}

	return value.slice(startIndex, endIndex);
}

function mathClamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function luaByte(value) {
	if (value.length === 0) {
		return [undefined];
	}

	return [value.charCodeAt(0)];
}

function luaFind(value, search, init = 1, plain = false) {
	if (!plain) {
		throw new Error("Pattern-based string.find is not supported in this assertion harness.");
	}

	const index = value.indexOf(search, Math.max(init - 1, 0));
	return index >= 0 ? [index + 1, index + search.length] : [undefined, undefined];
}

function tonumber(value) {
	if (typeof value === "number") {
		return value;
	}

	if (typeof value !== "string" || value.length === 0) {
		return undefined;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
}

function typeIs(value, kind) {
	switch (kind) {
		case "number":
			return typeof value === "number";
		case "string":
			return typeof value === "string";
		case "table":
			return typeof value === "object" && value !== null;
		case "UDim":
			return value instanceof UDim;
		case "UDim2":
			return value instanceof UDim2;
		default:
			return false;
	}
}

function rawget(value, key) {
	return value[key];
}

function loadUnitsModule() {
	const filePath = path.join(process.cwd(), "src/lib/utils/units.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const compiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2019,
		},
		fileName: filePath,
	}).outputText;

	const module = { exports: {} };
	const context = vm.createContext({
		module,
		exports: module.exports,
		require,
		console,
		String,
		UDim,
		UDim2,
		rawget,
		typeIs,
		tonumber,
		tostring: String,
		string: {
			sub: luaSub,
			byte: luaByte,
			find: luaFind,
		},
	});

	vm.runInContext("String.prototype.size = function () { return this.length; };", context);

	vm.runInContext(compiled, context, { filename: filePath });
	return module.exports;
}

function loadDiagnosticsModule(isStudio) {
	const filePath = path.join(process.cwd(), "src/lib/utils/diagnostics.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const compiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2019,
		},
		fileName: filePath,
	}).outputText;

	const module = { exports: {} };
	const warnings = [];
	const context = vm.createContext({
		module,
		exports: module.exports,
		game: {
			GetService(name) {
				if (name !== "RunService") {
					throw new Error(`Unexpected service: ${name}`);
				}

				return { IsStudio: () => isStudio };
			},
		},
		warn: (message) => warnings.push(message),
		error: (message) => {
			throw new Error(message);
		},
	});

	vm.runInContext(compiled, context, { filename: filePath });
	return { exports: module.exports, warnings };
}

function loadProgressRangeModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/Progress/Progress.tsx");
	const source = fs.readFileSync(filePath, "utf8");
	const helpersStart = source.indexOf("function isFiniteNumber");
	const helpersEnd = source.indexOf("function formatDefaultProgressValue");

	if (helpersStart < 0 || helpersEnd < 0) {
		throw new Error("Progress range helpers could not be found.");
	}

	const sourceSlice = `${source.slice(helpersStart, helpersEnd)}\nexport { resolveProgressRange, resolveProgressValue, resolveProgressPercent };`;
	const compiled = ts.transpileModule(sourceSlice, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2019,
		},
		fileName: filePath,
	}).outputText;

	const module = { exports: {} };
	const context = vm.createContext({
		module,
		exports: module.exports,
		require,
		math: {
			clamp: mathClamp,
			huge: Infinity,
		},
	});

	vm.runInContext(compiled, context, { filename: filePath });
	return module.exports;
}

function loadSliderRangeModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/Slider/utils.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const helpersStart = source.indexOf("export interface SliderRange");

	if (helpersStart < 0) {
		throw new Error("Slider range helpers could not be found.");
	}

	const compiled = ts.transpileModule(source.slice(helpersStart), {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2019,
		},
		fileName: filePath,
	}).outputText;

	const module = { exports: {} };
	const context = vm.createContext({
		module,
		exports: module.exports,
		require,
		math: {
			abs: Math.abs,
			clamp: mathClamp,
			huge: Infinity,
			pow: Math.pow,
			round: Math.round,
		},
	});

	vm.runInContext(compiled, context, { filename: filePath });
	return module.exports;
}

function loadDensityModule() {
	const filePath = path.join(process.cwd(), "src/lib/theme/density.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const compiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2019,
		},
		fileName: filePath,
	}).outputText;

	const module = { exports: {} };
	const context = vm.createContext({
		module,
		exports: module.exports,
		require,
		table: {
			freeze(value) {
				return Object.freeze(value);
			},
		},
		math: {
			max: Math.max,
		},
	});

	vm.runInContext(compiled, context, { filename: filePath });
	return module.exports;
}

function loadWindowBoundsModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/Window/utils.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const compiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2019,
		},
		fileName: filePath,
	}).outputText;

	const module = { exports: {} };
	const context = vm.createContext({
		module,
		exports: module.exports,
		require,
		UDim,
		math: {
			clamp: mathClamp,
			max: Math.max,
			min: Math.min,
		},
	});

	vm.runInContext(compiled, context, { filename: filePath });
	return module.exports;
}

function assertCondition(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function assertFiniteNumber(value, label) {
	assertCondition(Number.isFinite(value), `${label}: expected finite number, got ${value}`);
}

function assertUDim(actual, expected, label) {
	assertCondition(actual.Scale === expected.Scale && actual.Offset === expected.Offset, label);
}

function assertUDim2(actual, expected, label) {
	assertUDim(actual.X, expected.X, `${label} (x)`);
	assertUDim(actual.Y, expected.Y, `${label} (y)`);
}

function expectThrows(callback, messagePart, label) {
	let thrown;

	try {
		callback();
	} catch (error) {
		thrown = error;
	}

	assertCondition(thrown !== undefined, `${label}: expected function to throw`);
	assertCondition(String(thrown).includes(messagePart), `${label}: unexpected error message`);
}

function run() {
	const { toUDim, toUDim2, toUDimAxis } = loadUnitsModule();
	const { resolveProgressRange, resolveProgressValue, resolveProgressPercent } = loadProgressRangeModule();
	const { alphaToValue, normalizeSliderValue, resolveSliderRange, valueToAlpha } = loadSliderRangeModule();
	const passthrough1D = new UDim(0.3, 5);
	const passthrough2D = new UDim2(0.25, 8, 0.75, 16);

	assertUDim(toUDim(200), new UDim(0, 200), "toUDim converts numbers to pixels");
	assertUDim(toUDim("50%"), new UDim(0.5, 0), "toUDim converts percent strings to scale");
	assertUDim(toUDim("150%"), new UDim(1.5, 0), "toUDim supports percentages above 100%");
	expectThrows(() => toUDim("10px"), "Invalid SizeValue", "toUDim rejects px strings like toUDim2");
	assertUDim(toUDim(-8), new UDim(0, -8), "toUDim allows negative numbers");
	assertUDim(toUDimAxis("-25%", "y"), new UDim(-0.25, 0), "toUDimAxis follows toUDim rules");
	assertCondition(toUDim(passthrough1D) === passthrough1D, "toUDim passes UDim through unchanged");

	assertUDim2(toUDim2(100), UDim2.fromOffset(100, 100), "toUDim2 converts numbers to square offsets");
	assertUDim2(toUDim2("50%"), UDim2.fromScale(0.5, 0.5), "toUDim2 converts percent strings to scale");
	assertUDim2(
		toUDim2({ x: 100, y: "50%" }),
		new UDim2(new UDim(0, 100), new UDim(0.5, 0)),
		"toUDim2 converts x/y objects",
	);
	assertCondition(toUDim2(passthrough2D) === passthrough2D, "toUDim2 passes UDim2 through unchanged");

	expectThrows(() => toUDim("invalid"), "Invalid SizeValue", "toUDim rejects invalid strings");
	expectThrows(() => toUDim("not a size"), "Invalid SizeValue", "toUDim surfaces clear errors");
	expectThrows(() => toUDim2("10px"), "Invalid SizeValue2D", "toUDim2 rejects unsupported strings");

	console.log("units: PASS");

	const studioDiagnostics = loadDiagnosticsModule(true);
	expectThrows(
		() => studioDiagnostics.exports.componentDiagnostics.violation("invalid-token", () => "Studio violation"),
		"Studio violation",
		"Studio diagnostics throw violations",
	);
	assertCondition(studioDiagnostics.warnings.length === 0, "Studio diagnostics do not warn when throwing");
	expectThrows(
		() => studioDiagnostics.exports.bridgeDiagnostics.violation("unknown-component", () => "Studio bridge violation"),
		"Studio bridge violation",
		"Studio bridge diagnostics throw violations",
	);

	const productionDiagnostics = loadDiagnosticsModule(false);
	let productionMessageEvaluated = false;
	productionDiagnostics.exports.componentDiagnostics.violation("invalid-token", () => {
		productionMessageEvaluated = true;
		return "Production violation";
	});
	assertCondition(!productionMessageEvaluated, "Production diagnostics skip lazy messages");
	let productionBridgeMessageEvaluated = false;
	productionDiagnostics.exports.bridgeDiagnostics.violation("unknown-component", () => {
		productionBridgeMessageEvaluated = true;
		return "Production bridge violation";
	});
	assertCondition(!productionBridgeMessageEvaluated, "Production bridge diagnostics skip lazy messages");
	assertCondition(productionDiagnostics.warnings.length === 0, "Production diagnostics stay silent");

	console.log("diagnostics: PASS");

	const extremeProgressRange = resolveProgressRange(Number.MAX_VALUE, Number.MAX_VALUE);
	const extremeProgressValue = resolveProgressValue(Number.MAX_VALUE, extremeProgressRange);
	const extremeProgressPercent = resolveProgressPercent(extremeProgressValue, extremeProgressRange);

	assertFiniteNumber(extremeProgressRange.min, "Progress extreme fallback min");
	assertFiniteNumber(extremeProgressRange.max, "Progress extreme fallback max");
	assertFiniteNumber(extremeProgressRange.max - extremeProgressRange.min, "Progress extreme fallback denominator");
	assertCondition(extremeProgressRange.max > extremeProgressRange.min, "Progress extreme fallback keeps a strict range");
	assertFiniteNumber(extremeProgressPercent, "Progress extreme fallback percent");
	assertCondition(extremeProgressPercent >= 0 && extremeProgressPercent <= 1, "Progress extreme fallback percent stays clamped");

	console.log("progress: PASS");

	const extremeSliderRange = resolveSliderRange(-Number.MAX_VALUE, Number.MAX_VALUE);
	const equalExtremeSliderRange = resolveSliderRange(Number.MAX_VALUE, Number.MAX_VALUE);
	const invertedFiniteSliderRange = resolveSliderRange(10, 0);
	const equalFiniteSliderRange = resolveSliderRange(10, 10);
	const extremeSliderValue = normalizeSliderValue(Number.MAX_VALUE, extremeSliderRange, undefined);
	const extremeSliderAlpha = valueToAlpha(extremeSliderValue, extremeSliderRange);
	const extremeSliderAlphaValue = alphaToValue(0.5, extremeSliderRange, undefined);
	const invertedFiniteSliderValue = alphaToValue(1, invertedFiniteSliderRange, undefined);
	const equalFiniteSliderValue = alphaToValue(1, equalFiniteSliderRange, undefined);
	const unusableSliderAlpha = valueToAlpha(0, { min: 0, max: Number.MAX_VALUE, span: Infinity });
	const unusableSliderValue = alphaToValue(0.5, { min: 0, max: Number.MAX_VALUE, span: Infinity }, undefined);

	assertFiniteNumber(extremeSliderRange.min, "Slider extreme fallback min");
	assertFiniteNumber(extremeSliderRange.max, "Slider extreme fallback max");
	assertFiniteNumber(extremeSliderRange.span, "Slider extreme fallback span");
	assertCondition(extremeSliderRange.max > extremeSliderRange.min, "Slider extreme fallback keeps a strict range");
	assertFiniteNumber(equalExtremeSliderRange.span, "Slider equal extreme fallback span");
	assertCondition(equalExtremeSliderRange.max > equalExtremeSliderRange.min, "Slider equal extreme fallback keeps a strict range");
	assertCondition(invertedFiniteSliderRange.min === 10, "Slider inverted finite range keeps supplied min");
	assertCondition(invertedFiniteSliderRange.max === 10, "Slider inverted finite range clamps max to min");
	assertCondition(invertedFiniteSliderRange.span === 0, "Slider inverted finite range stays non-interactive");
	assertCondition(invertedFiniteSliderValue === 10, "Slider inverted finite range alpha-to-value stays clamped at min");
	assertCondition(equalFiniteSliderRange.min === 10, "Slider equal finite range keeps supplied min");
	assertCondition(equalFiniteSliderRange.max === 10, "Slider equal finite range keeps supplied max");
	assertCondition(equalFiniteSliderRange.span === 0, "Slider equal finite range stays non-interactive");
	assertCondition(equalFiniteSliderValue === 10, "Slider equal finite range alpha-to-value stays clamped at min");
	assertFiniteNumber(extremeSliderValue, "Slider extreme fallback normalized value");
	assertCondition(extremeSliderValue >= extremeSliderRange.min && extremeSliderValue <= extremeSliderRange.max, "Slider extreme fallback normalized value stays clamped");
	assertFiniteNumber(extremeSliderAlpha, "Slider extreme fallback display alpha");
	assertCondition(extremeSliderAlpha >= 0 && extremeSliderAlpha <= 1, "Slider extreme fallback display alpha stays clamped");
	assertFiniteNumber(extremeSliderAlphaValue, "Slider extreme fallback alpha-to-value result");
	assertCondition(extremeSliderAlphaValue >= extremeSliderRange.min && extremeSliderAlphaValue <= extremeSliderRange.max, "Slider extreme fallback alpha-to-value result stays clamped");
	assertFiniteNumber(unusableSliderAlpha, "Slider unusable range alpha fallback");
	assertFiniteNumber(unusableSliderValue, "Slider unusable range value fallback");

	console.log("slider: PASS");

	const {
		resolveDensityControlSize,
		resolveDensityGap,
		resolveDensityMarkSize,
		resolveThemeSpacing,
	} = loadDensityModule();
	const defaultSpacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
	const defaultTheme = { density: "default", spacing: defaultSpacing };
	const compactTheme = { density: "compact", spacing: defaultSpacing };

	assertCondition(resolveThemeSpacing(defaultTheme, "md") === 12, "default spacing.md stays 12");
	assertCondition(resolveThemeSpacing(compactTheme, "xs") === 4, "compact spacing.xs stays 4");
	assertCondition(resolveThemeSpacing(compactTheme, "md") === 8, "compact spacing.md tightens to 8");
	assertCondition(resolveDensityControlSize(defaultTheme, 36) === 36, "default md control height stays 36");
	assertCondition(resolveDensityControlSize(compactTheme, 36) === 32, "compact md control height is 32");
	assertCondition(resolveDensityControlSize(compactTheme, 32) === 32, "compact sm control height stays 32");
	assertCondition(resolveDensityGap(compactTheme, 6) === 4, "compact gaps tighten by 2");
	assertCondition(resolveDensityMarkSize(compactTheme, 18) === 16, "compact checkbox marks shrink by 2");

	console.log("density: PASS");

	const {
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
	} = loadWindowBoundsModule();
	const windowViewport = { width: 1280, height: 720 };
	const windowOptions = {
		minWidth: DEFAULT_WINDOW_MIN_WIDTH,
		minHeight: DEFAULT_WINDOW_MIN_HEIGHT,
		viewport: windowViewport,
		margin: 12,
	};
	const assertWindowBounds = (actual, expected, label) => {
		assertCondition(
			areWindowBoundsEqual(actual, expected),
			`${label}: expected ${expected.x},${expected.y} ${expected.width}x${expected.height}, got ${actual.x},${actual.y} ${actual.width}x${actual.height}`,
		);
	};

	assertCondition(DEFAULT_WINDOW_WIDTH !== 1120 && DEFAULT_WINDOW_HEIGHT !== 680, "window defaults are not Hydroxide 1120x680");
	assertCondition(resolveUDimPixels(new UDim(0, 480), 1280) === 480, "window offset UDim resolves to pixels");
	assertCondition(resolveUDimPixels(new UDim(0.5, 20), 800) === 420, "window scale UDim resolves against viewport");

	const centeredWindow = resolveCenteredWindowPosition(480, 360, windowViewport);
	assertCondition(centeredWindow.x === 400 && centeredWindow.y === 180, "window default size centers in the viewport");

	assertWindowBounds(
		clampWindowBounds({ x: -80, y: -40, width: 480, height: 360 }, windowOptions),
		{ x: 12, y: 12, width: 480, height: 360 },
		"window position clamps to the viewport margin",
	);
	assertWindowBounds(
		clampWindowBounds({ x: 2000, y: 2000, width: 480, height: 360 }, windowOptions),
		{ x: 788, y: 348, width: 480, height: 360 },
		"window position clamps so the frame stays on-screen",
	);

	const shrunkWindow = clampWindowBounds({ x: 0, y: 0, width: 4000, height: 3000 }, windowOptions);
	assertCondition(shrunkWindow.width === 1256 && shrunkWindow.height === 696, "window size shrinks to the padded viewport");
	assertCondition(shrunkWindow.x === 12 && shrunkWindow.y === 12, "oversized windows sit on the margin");

	const movedWindow = applyWindowMove({ x: 40, y: 40, width: 480, height: 360 }, -100, 80, windowOptions);
	assertCondition(movedWindow.x === 12 && movedWindow.y === 80, "window moves clamp X and keep a valid Y");
	assertCondition(movedWindow.width === 480 && movedWindow.height === 360, "window moves do not change size");

	const resizedWindow = applyWindowResize({ x: 100, y: 100, width: 480, height: 360 }, 20, 20, windowOptions);
	assertCondition(
		resizedWindow.width === DEFAULT_WINDOW_MIN_WIDTH && resizedWindow.height === DEFAULT_WINDOW_MIN_HEIGHT,
		"window resize respects min size",
	);
	assertCondition(resizedWindow.x === 100 && resizedWindow.y === 100, "window resize keeps the origin");

	const limitedWindow = applyWindowResize({ x: 1000, y: 500, width: 200, height: 160 }, 800, 800, windowOptions);
	assertCondition(limitedWindow.width === 268 && limitedWindow.height === 208, "window resize cannot leave the padded viewport");

	assertWindowBounds(
		resolveMaximizedWindowBounds(windowViewport),
		{ x: 0, y: 0, width: 1280, height: 720 },
		"window maximize fills the host flush",
	);

	const tinyWindow = clampWindowBounds(
		{ x: 0, y: 0, width: 480, height: 360 },
		{ minWidth: 400, minHeight: 280, viewport: { width: 200, height: 150 }, margin: 8 },
	);
	assertCondition(tinyWindow.width === 184 && tinyWindow.height === 134, "window min size yields to a smaller viewport");

	console.log("window: PASS");
}

run();
