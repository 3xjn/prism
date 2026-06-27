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
	assertUDim(toUDim("10px"), new UDim(0, 10), "toUDim converts px strings to offset");
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
	const extremeSliderValue = normalizeSliderValue(Number.MAX_VALUE, extremeSliderRange, undefined);
	const extremeSliderAlpha = valueToAlpha(extremeSliderValue, extremeSliderRange);
	const extremeSliderAlphaValue = alphaToValue(0.5, extremeSliderRange, undefined);
	const unusableSliderAlpha = valueToAlpha(0, { min: 0, max: Number.MAX_VALUE, span: Infinity });
	const unusableSliderValue = alphaToValue(0.5, { min: 0, max: Number.MAX_VALUE, span: Infinity }, undefined);

	assertFiniteNumber(extremeSliderRange.min, "Slider extreme fallback min");
	assertFiniteNumber(extremeSliderRange.max, "Slider extreme fallback max");
	assertFiniteNumber(extremeSliderRange.span, "Slider extreme fallback span");
	assertCondition(extremeSliderRange.max > extremeSliderRange.min, "Slider extreme fallback keeps a strict range");
	assertFiniteNumber(equalExtremeSliderRange.span, "Slider equal extreme fallback span");
	assertCondition(equalExtremeSliderRange.max > equalExtremeSliderRange.min, "Slider equal extreme fallback keeps a strict range");
	assertFiniteNumber(extremeSliderValue, "Slider extreme fallback normalized value");
	assertCondition(extremeSliderValue >= extremeSliderRange.min && extremeSliderValue <= extremeSliderRange.max, "Slider extreme fallback normalized value stays clamped");
	assertFiniteNumber(extremeSliderAlpha, "Slider extreme fallback display alpha");
	assertCondition(extremeSliderAlpha >= 0 && extremeSliderAlpha <= 1, "Slider extreme fallback display alpha stays clamped");
	assertFiniteNumber(extremeSliderAlphaValue, "Slider extreme fallback alpha-to-value result");
	assertCondition(extremeSliderAlphaValue >= extremeSliderRange.min && extremeSliderAlphaValue <= extremeSliderRange.max, "Slider extreme fallback alpha-to-value result stays clamped");
	assertFiniteNumber(unusableSliderAlpha, "Slider unusable range alpha fallback");
	assertFiniteNumber(unusableSliderValue, "Slider unusable range value fallback");

	console.log("slider: PASS");
}

run();
