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

class Vector2 {
	constructor(x = 0, y = 0) {
		this.X = x;
		this.Y = y;
	}

	add(other) {
		return new Vector2(this.X + other.X, this.Y + other.Y);
	}

	sub(other) {
		return new Vector2(this.X - other.X, this.Y - other.Y);
	}
}

class Color3 {
	constructor(red = 0, green = 0, blue = 0) {
		this.R = red;
		this.G = green;
		this.B = blue;
	}

	static fromRGB(red, green, blue) {
		return new Color3(red / 255, green / 255, blue / 255);
	}

	static fromHSV(hue, saturation, value) {
		const wrappedHue = ((hue % 1) + 1) % 1;
		const sector = wrappedHue * 6;
		const index = Math.floor(sector);
		const fraction = sector - index;
		const p = value * (1 - saturation);
		const q = value * (1 - saturation * fraction);
		const t = value * (1 - saturation * (1 - fraction));
		switch (index % 6) {
			case 0:
				return new Color3(value, t, p);
			case 1:
				return new Color3(q, value, p);
			case 2:
				return new Color3(p, value, t);
			case 3:
				return new Color3(p, q, value);
			case 4:
				return new Color3(t, p, value);
			default:
				return new Color3(value, p, q);
		}
	}

	ToHSV() {
		const maximum = Math.max(this.R, this.G, this.B);
		const minimum = Math.min(this.R, this.G, this.B);
		const delta = maximum - minimum;
		let hue = 0;
		if (delta > 0) {
			if (maximum === this.R) hue = ((this.G - this.B) / delta) % 6;
			else if (maximum === this.G) hue = (this.B - this.R) / delta + 2;
			else hue = (this.R - this.G) / delta + 4;
			hue /= 6;
			if (hue < 0) hue += 1;
		}
		return [hue, maximum === 0 ? 0 : delta / maximum, maximum];
	}
}

function enumItem(name) {
	return Object.freeze({ Name: name });
}

const themeEnum = Object.freeze({
	Font: Object.freeze({ BuilderSans: enumItem("BuilderSans"), Gotham: enumItem("Gotham") }),
	EasingStyle: Object.freeze({
		Linear: enumItem("Linear"),
		Cubic: enumItem("Cubic"),
		Quint: enumItem("Quint"),
	}),
	EasingDirection: Object.freeze({
		Out: enumItem("Out"),
		In: enumItem("In"),
		InOut: enumItem("InOut"),
	}),
});

const themeMath = Object.freeze({
	abs: Math.abs,
	clamp: mathClamp,
	floor: Math.floor,
	huge: Infinity,
	max: Math.max,
	min: Math.min,
	round: Math.round,
});

const luaTable = Object.freeze({ freeze: Object.freeze });

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

function tonumber(value, radix) {
	if (typeof value === "number") {
		return value;
	}

	if (typeof value !== "string" || value.length === 0) {
		return undefined;
	}

	const parsed = radix === undefined ? Number(value) : Number.parseInt(value, radix);
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

function evaluateTypeScriptModule(filePath, source, globals = {}, setupSource) {
	const compiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2019,
		},
		fileName: filePath,
	}).outputText;
	const module = { exports: {} };
	const context = vm.createContext({ module, exports: module.exports, require, ...globals });

	if (setupSource !== undefined) {
		vm.runInContext(setupSource, context);
	}

	vm.runInContext(compiled, context, { filename: filePath });
	return module.exports;
}

function loadUnitsModule() {
	const filePath = path.join(process.cwd(), "src/lib/utils/units.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(
		filePath,
		source,
		{
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
		},
		"String.prototype.size = function () { return this.length; };",
	);
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
	return evaluateTypeScriptModule(filePath, sourceSlice, {
		math: {
			clamp: mathClamp,
			huge: Infinity,
		},
	});
}

function loadSliderRangeModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/Slider/utils.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const helpersStart = source.indexOf("export interface SliderRange");

	if (helpersStart < 0) {
		throw new Error("Slider range helpers could not be found.");
	}

	return evaluateTypeScriptModule(filePath, source.slice(helpersStart), {
		math: {
			abs: Math.abs,
			clamp: mathClamp,
			huge: Infinity,
			pow: Math.pow,
			round: Math.round,
		},
	});
}

function loadResponsiveModule() {
	const filePath = path.join(process.cwd(), "src/lib/responsive/resolve.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source, {
		math: {
			huge: Infinity,
			max: Math.max,
		},
	});
}

function loadFixedVirtualGeometryModule() {
	const filePath = path.join(process.cwd(), "src/lib/virtualization/_internal/fixedVirtualGeometry.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source, {
		math: {
			ceil: Math.ceil,
			clamp: mathClamp,
			floor: Math.floor,
			huge: Infinity,
			max: Math.max,
			min: Math.min,
		},
	});
}

function loadFixedVirtualCollectionModule(fixedVirtualGeometryModule) {
	const filePath = path.join(process.cwd(), "src/lib/virtualization/fixedVirtualCollection.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(
		filePath,
		source,
		{
			math: {
				clamp: mathClamp,
				floor: Math.floor,
				huge: Infinity,
				max: Math.max,
				min: Math.min,
			},
			string: {
				rep: (value, count) => value.repeat(count),
			},
			typeIs,
			require: (moduleName) => {
				if (moduleName === "./_internal/fixedVirtualGeometry") {
					return fixedVirtualGeometryModule;
				}

				return require(moduleName);
			},
		},
		"Array.prototype.size = function () { return this.length; }; String.prototype.size = function () { return this.length; };",
	);
}

function loadFixedVirtualGridLayoutModule(fixedVirtualGeometryModule) {
	const filePath = path.join(process.cwd(), "src/lib/virtualization/fixedVirtualGridLayout.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source, {
		math: {
			floor: Math.floor,
			huge: Infinity,
			max: Math.max,
		},
		require: (moduleName) => {
			if (moduleName === "./_internal/fixedVirtualGeometry") {
				return fixedVirtualGeometryModule;
			}

			return require(moduleName);
		},
	});
}

function loadSelectionModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/_shared/selection.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source);
}

function loadOverlaySelectionLifecyclePolicyModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/_shared/useOverlaySelectionLifecycle.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const policyStart = source.indexOf("export type OverlaySelectionEntryPolicy");
	const policyEnd = source.indexOf("function isInSubtree");

	if (policyStart < 0 || policyEnd < 0) {
		throw new Error("Overlay selection lifecycle policies could not be found.");
	}

	return evaluateTypeScriptModule(filePath, source.slice(policyStart, policyEnd), {
		Enum: {
			PreferredInput: {
				Gamepad: "Gamepad",
				MouseAndKeyboard: "MouseAndKeyboard",
				Touch: "Touch",
			},
		},
	});
}

function loadThemeDefaultsModule() {
	const filePath = path.join(process.cwd(), "src/lib/theme/defaults.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source, {
		Color3,
		Enum: themeEnum,
		table: luaTable,
	});
}

function loadColorContrastModule() {
	const filePath = path.join(process.cwd(), "src/lib/theme/contrast.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source, { math: themeMath });
}

function loadColorPickerUtilsModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/ColorPicker/utils.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(
		filePath,
		source,
		{
			Color3,
			Vector2,
			math: themeMath,
			string: {
				format: (template, ...values) => {
					let valueIndex = 0;
					return template.replace(/%02X/g, () =>
						Math.round(values[valueIndex++]).toString(16).toUpperCase().padStart(2, "0"),
					);
				},
				lower: (value) => value.toLowerCase(),
				sub: luaSub,
				upper: (value) => value.toUpperCase(),
			},
			tonumber,
		},
		"Array.prototype.size = function () { return this.length; }; String.prototype.size = function () { return this.length; };",
	);
}

function loadWorkbenchModelModule() {
	const filePath = path.join(process.cwd(), "src/playground/theme-workbench/model.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(
		filePath,
		source,
		{
			Color3,
			math: themeMath,
			table: luaTable,
			tonumber,
		},
		"Array.prototype.size = function () { return this.length; }; String.prototype.size = function () { return this.length; };",
	);
}

function loadWorkbenchSerializerModule(defaultTheme, modelModule) {
	const filePath = path.join(process.cwd(), "src/playground/theme-workbench/serialize.ts");
	const source = fs.readFileSync(filePath, "utf8");
	const moduleRequire = (moduleName) => {
		if (moduleName === "@prism/theme") {
			return { DEFAULT_THEME: defaultTheme };
		}
		if (moduleName === "./model") {
			return modelModule;
		}
		return require(moduleName);
	};
	return evaluateTypeScriptModule(
		filePath,
		source,
		{
			math: themeMath,
			require: moduleRequire,
			string: { rep: (value, count) => value.repeat(count) },
			table: luaTable,
			tostring: String,
			typeIs,
		},
		"Array.prototype.size = function () { return this.length; };",
	);
}

function loadOutsidePressModule() {
	const filePath = path.join(process.cwd(), "src/lib/components/_shared/outsidePress.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source, { Vector2 });
}

function loadNotificationStoreModule() {
	const filePath = path.join(process.cwd(), "src/lib/notifications/_internal/notificationStore.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(
		filePath,
		source,
		{
			error: (message) => {
				throw new Error(message);
			},
			math: {
				floor: Math.floor,
				huge: Infinity,
				max: Math.max,
			},
			os: {
				clock: () => 0,
			},
			table: {
				freeze: Object.freeze,
			},
			task: {
				cancel: () => undefined,
				delay: () => undefined,
			},
			tostring: String,
		},
		"Array.prototype.size = function () { return this.length; };",
	);
}

function loadNotificationsApiModule() {
	const filePath = path.join(process.cwd(), "src/lib/notifications/_internal/notificationsApi.ts");
	const source = fs.readFileSync(filePath, "utf8");
	return evaluateTypeScriptModule(filePath, source, {
		table: {
			freeze: Object.freeze,
		},
	});
}

function createManualScheduler() {
	let currentTime = 0;
	let nextTaskId = 1;
	const tasks = [];

	function findTask(taskId) {
		const scheduledTask = tasks.find((task) => task.id === taskId);

		if (scheduledTask === undefined) {
			throw new Error(`Unknown scheduled task ${taskId}`);
		}

		return scheduledTask;
	}

	function runDueTasks() {
		while (true) {
			const scheduledTask = tasks
				.filter((task) => !task.canceled && !task.fired && task.dueAt <= currentTime)
				.sort((left, right) => left.dueAt - right.dueAt || left.id - right.id)[0];

			if (scheduledTask === undefined) {
				return;
			}

			scheduledTask.fired = true;
			scheduledTask.callback();
		}
	}

	return {
		scheduler: {
			now: () => currentTime,
			schedule: (delaySeconds, callback) => {
				const scheduledTask = {
					id: nextTaskId,
					dueAt: currentTime + delaySeconds,
					callback,
					canceled: false,
					fired: false,
				};

				nextTaskId += 1;
				tasks.push(scheduledTask);

				return () => {
					scheduledTask.canceled = true;
				};
			},
		},
		advance(seconds) {
			assertCondition(seconds >= 0, "manual scheduler cannot move backward");
			currentTime += seconds;
			runDueTasks();
		},
		fireCanceled(taskId) {
			const scheduledTask = findTask(taskId);
			assertCondition(scheduledTask.canceled, `scheduled task ${taskId} was not canceled`);
			assertCondition(!scheduledTask.fired, `scheduled task ${taskId} already fired`);
			scheduledTask.fired = true;
			scheduledTask.callback();
		},
		latestTaskId() {
			return tasks.at(-1)?.id;
		},
		pendingCount() {
			return tasks.filter((task) => !task.canceled && !task.fired).length;
		},
	};
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

function assertVirtualLineRange(actual, startLine, endLine, label) {
	assertCondition(
		actual.startLine === startLine && actual.endLine === endLine,
		`${label}: expected [${startLine}, ${endLine}), got [${actual.startLine}, ${actual.endLine})`,
	);
}

function assertVirtualItemRange(actual, startIndex, endIndex, label) {
	assertCondition(
		actual.startIndex === startIndex && actual.endIndex === endIndex,
		`${label}: expected [${startIndex}, ${endIndex}), got [${actual.startIndex}, ${actual.endIndex})`,
	);
}

function runFixedVirtualGeometryAssertions() {
	const {
		resolveFixedGridLaneCount,
		resolveFixedVirtualGeometry,
		resolveFixedVirtualRange,
		resolveFixedVirtualScrollOffset,
	} = loadFixedVirtualGeometryModule();

	const emptyGeometry = resolveFixedVirtualGeometry({ itemCount: 0, itemExtent: 20 });
	assertCondition(emptyGeometry.itemCount === 0, "virtual geometry preserves an empty item count");
	assertCondition(emptyGeometry.laneCount === 1, "virtual geometry defaults to one lane");
	assertCondition(emptyGeometry.lineCount === 0, "virtual geometry gives empty collections zero lines");
	assertCondition(emptyGeometry.canvasExtent === 0, "virtual geometry gives empty collections zero canvas extent");

	const listGeometry = resolveFixedVirtualGeometry({
		itemCount: 3,
		itemExtent: 20,
		lineGap: 4,
	});
	assertCondition(listGeometry.lineCount === 3, "single-lane geometry creates one line per item");
	assertCondition(listGeometry.lineStride === 24, "single-lane geometry includes the gap in its stride");
	assertCondition(listGeometry.canvasExtent === 68, "canvas extent excludes a trailing line gap");

	const sparseGridGeometry = resolveFixedVirtualGeometry({
		itemCount: 10,
		itemExtent: 20,
		lineGap: 4,
		laneCount: 3,
	});
	assertCondition(sparseGridGeometry.lineCount === 4, "multi-lane geometry keeps a sparse final line");
	assertCondition(sparseGridGeometry.canvasExtent === 92, "multi-lane canvas extent is based on line count");

	const normalizedGeometry = resolveFixedVirtualGeometry({
		itemCount: -10,
		itemExtent: -20,
		lineGap: -4,
		laneCount: 0,
	});
	assertCondition(normalizedGeometry.itemCount === 0, "virtual geometry clamps negative item counts");
	assertCondition(normalizedGeometry.itemExtent === 0, "virtual geometry clamps negative item extents");
	assertCondition(normalizedGeometry.lineGap === 0, "virtual geometry clamps negative gaps");
	assertCondition(normalizedGeometry.laneCount === 1, "virtual geometry clamps lane count to at least one");

	const boundaryGeometry = resolveFixedVirtualGeometry({
		itemCount: 10,
		itemExtent: 10,
		lineGap: 2,
	});
	const firstRange = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: -100,
		viewportExtent: 10,
		overscanLines: 2,
	});
	assertCondition(firstRange.scrollOffset === 0, "virtual ranges clamp negative scroll offsets");
	assertVirtualLineRange(firstRange.visibleLineRange, 0, 1, "first line is visible at the canvas start");
	assertVirtualItemRange(firstRange.visibleItemRange, 0, 1, "first item is visible at the canvas start");
	assertVirtualItemRange(firstRange.renderedItemRange, 0, 3, "leading overscan clamps at item zero");

	const lastRange = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: 10_000,
		viewportExtent: 10,
		overscanLines: 2,
	});
	assertCondition(lastRange.scrollOffset === 108, "virtual ranges clamp offsets to the maximum scroll");
	assertVirtualItemRange(lastRange.visibleItemRange, 9, 10, "last item is visible at maximum scroll");
	assertVirtualItemRange(lastRange.renderedItemRange, 7, 10, "trailing overscan clamps at item count");

	const zeroViewportRange = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: 24,
		viewportExtent: 0,
		overscanLines: 4,
	});
	assertVirtualLineRange(zeroViewportRange.visibleLineRange, 2, 2, "zero viewport has an empty visible line range");
	assertVirtualItemRange(zeroViewportRange.visibleItemRange, 2, 2, "zero viewport has an empty visible item range");
	assertVirtualItemRange(zeroViewportRange.renderedItemRange, 2, 2, "zero viewport does not mount overscan");

	const exactItemRange = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: 0,
		viewportExtent: 10,
	});
	assertVirtualItemRange(exactItemRange.visibleItemRange, 0, 1, "viewport ending at item end includes that item");

	const exactGapRange = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: 10,
		viewportExtent: 2,
	});
	assertVirtualItemRange(exactGapRange.visibleItemRange, 1, 1, "viewport covering only an exact gap is empty");

	const boundaryBeforeNextLine = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: 9,
		viewportExtent: 3,
	});
	assertVirtualItemRange(
		boundaryBeforeNextLine.visibleItemRange,
		0,
		1,
		"line starting exactly at viewport end remains excluded",
	);

	const boundaryPastNextLine = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: 10,
		viewportExtent: 2.01,
	});
	assertVirtualItemRange(
		boundaryPastNextLine.visibleItemRange,
		1,
		2,
		"crossing a line boundary includes the next item",
	);

	const exactSecondLine = resolveFixedVirtualRange(boundaryGeometry, {
		scrollOffset: 12,
		viewportExtent: 10,
		overscanLines: -2,
	});
	assertVirtualItemRange(exactSecondLine.visibleItemRange, 1, 2, "exact line starts resolve to that line");
	assertVirtualItemRange(exactSecondLine.renderedItemRange, 1, 2, "negative overscan normalizes to zero");

	const emptyRange = resolveFixedVirtualRange(emptyGeometry, {
		scrollOffset: Number.POSITIVE_INFINITY,
		viewportExtent: 100,
		overscanLines: 5,
	});
	assertVirtualItemRange(emptyRange.visibleItemRange, 0, 0, "empty collections keep empty visible ranges");
	assertVirtualItemRange(emptyRange.renderedItemRange, 0, 0, "empty collections keep empty rendered ranges");

	const zeroExtentGeometry = resolveFixedVirtualGeometry({
		itemCount: 3,
		itemExtent: 0,
		lineGap: 5,
	});
	const zeroExtentRange = resolveFixedVirtualRange(zeroExtentGeometry, {
		scrollOffset: Number.POSITIVE_INFINITY,
		viewportExtent: 2,
		overscanLines: 2,
	});
	assertCondition(zeroExtentRange.scrollOffset === 8, "zero-extent geometry still clamps its gap canvas offset");
	assertVirtualItemRange(zeroExtentRange.visibleItemRange, 0, 0, "zero-extent items are never visible");
	assertVirtualItemRange(zeroExtentRange.renderedItemRange, 0, 0, "zero-extent items are never rendered");

	const gridGeometry = resolveFixedVirtualGeometry({
		itemCount: 10,
		itemExtent: 10,
		lineGap: 2,
		laneCount: 3,
	});
	const firstTwoGridLines = resolveFixedVirtualRange(gridGeometry, {
		scrollOffset: 0,
		viewportExtent: 22,
	});
	assertVirtualLineRange(firstTwoGridLines.visibleLineRange, 0, 2, "grid range includes two exact-fit lines");
	assertVirtualItemRange(firstTwoGridLines.visibleItemRange, 0, 6, "grid lines map to every lane item");

	const sparseFinalGridLine = resolveFixedVirtualRange(gridGeometry, {
		scrollOffset: Number.POSITIVE_INFINITY,
		viewportExtent: 10,
	});
	assertVirtualLineRange(
		sparseFinalGridLine.visibleLineRange,
		3,
		4,
		"grid maximum scroll reaches its sparse final line",
	);
	assertVirtualItemRange(sparseFinalGridLine.visibleItemRange, 9, 10, "sparse final line clamps to item count");

	const overscannedGridRange = resolveFixedVirtualRange(gridGeometry, {
		scrollOffset: 12,
		viewportExtent: 10,
		overscanLines: 1,
	});
	assertVirtualItemRange(
		overscannedGridRange.visibleItemRange,
		3,
		6,
		"grid visible range maps one line to three items",
	);
	assertVirtualItemRange(overscannedGridRange.renderedItemRange, 0, 9, "grid overscan expands by complete lines");

	assertCondition(
		resolveFixedGridLaneCount({ viewportWidth: 320, minimumCellWidth: 100, columnGap: 10 }) === 3,
		"grid lane count includes an exact three-column fit",
	);
	assertCondition(
		resolveFixedGridLaneCount({ viewportWidth: 319, minimumCellWidth: 100, columnGap: 10 }) === 2,
		"grid lane count drops one lane a pixel below the threshold",
	);
	assertCondition(
		resolveFixedGridLaneCount({ viewportWidth: 99, minimumCellWidth: 100, columnGap: 10 }) === 1,
		"grid lane count keeps one lane in a narrow viewport",
	);
	assertCondition(
		resolveFixedGridLaneCount({
			viewportWidth: 1_000,
			minimumCellWidth: 100,
			columnGap: 10,
			maximumLaneCount: 4,
		}) === 4,
		"grid lane count respects its optional maximum",
	);
	assertCondition(
		resolveFixedGridLaneCount({ viewportWidth: Number.NaN, minimumCellWidth: 100 }) === 1,
		"grid lane count handles invalid viewport widths",
	);
	assertCondition(
		resolveFixedGridLaneCount({ viewportWidth: 500, minimumCellWidth: 0 }) === 1,
		"grid lane count handles invalid minimum cell widths",
	);

	const thousandGeometry = resolveFixedVirtualGeometry({
		itemCount: 1_000,
		itemExtent: 32,
		lineGap: 8,
		laneCount: 4,
	});
	const tenThousandGeometry = resolveFixedVirtualGeometry({
		itemCount: 10_000,
		itemExtent: 32,
		lineGap: 8,
		laneCount: 4,
	});
	const plateauInput = { scrollOffset: 1_000, viewportExtent: 180, overscanLines: 2 };
	const thousandWindow = resolveFixedVirtualRange(thousandGeometry, plateauInput).renderedItemRange;
	const tenThousandWindow = resolveFixedVirtualRange(tenThousandGeometry, plateauInput).renderedItemRange;
	const thousandMountedCount = thousandWindow.endIndex - thousandWindow.startIndex;
	const tenThousandMountedCount = tenThousandWindow.endIndex - tenThousandWindow.startIndex;
	assertCondition(thousandMountedCount === 36, "virtual window has the expected fixed geometry bound");
	assertCondition(
		thousandMountedCount === tenThousandMountedCount,
		"1,000 and 10,000 items produce the same mounted-window size",
	);

	const alignmentGeometry = resolveFixedVirtualGeometry({
		itemCount: 20,
		itemExtent: 20,
		lineGap: 5,
		laneCount: 2,
	});
	const alignmentBase = { index: 8, viewportExtent: 50, currentScrollOffset: 80 };
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, { ...alignmentBase, alignment: "start" }) === 100,
		"start alignment places the item line at viewport start",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, { ...alignmentBase, alignment: "center" }) === 85,
		"center alignment centers the item extent",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, { ...alignmentBase, alignment: "end" }) === 70,
		"end alignment places the item line at viewport end",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, { ...alignmentBase, alignment: "nearest" }) === 80,
		"nearest alignment preserves an already-visible line",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, {
			...alignmentBase,
			currentScrollOffset: 0,
			alignment: "nearest",
		}) === 70,
		"nearest alignment uses the smallest forward scroll",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, {
			...alignmentBase,
			currentScrollOffset: 150,
			alignment: "nearest",
		}) === 100,
		"nearest alignment uses the smallest backward scroll",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, {
			index: 9,
			viewportExtent: 50,
			currentScrollOffset: 0,
			alignment: "start",
		}) === 100,
		"items in the same lane line share a scroll target",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, {
			index: 0,
			viewportExtent: 50,
			currentScrollOffset: 0,
			alignment: "center",
		}) === 0,
		"alignment clamps at the canvas start",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(alignmentGeometry, {
			index: 19,
			viewportExtent: 50,
			currentScrollOffset: 0,
			alignment: "start",
		}) === 195,
		"alignment clamps at the canvas end",
	);

	const oversizedGeometry = resolveFixedVirtualGeometry({ itemCount: 5, itemExtent: 100, lineGap: 10 });
	assertCondition(
		resolveFixedVirtualScrollOffset(oversizedGeometry, {
			index: 2,
			viewportExtent: 40,
			currentScrollOffset: 250,
			alignment: "nearest",
		}) === 250,
		"nearest alignment keeps a viewport already inside an oversized item",
	);
	assertCondition(
		resolveFixedVirtualScrollOffset(oversizedGeometry, {
			index: 2,
			viewportExtent: 40,
			currentScrollOffset: 0,
			alignment: "nearest",
		}) === 220,
		"nearest alignment reaches an oversized item with minimum movement",
	);

	for (const invalidIndex of [-1, 20, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
		assertCondition(
			resolveFixedVirtualScrollOffset(alignmentGeometry, {
				index: invalidIndex,
				viewportExtent: 50,
				currentScrollOffset: 0,
			}) === undefined,
			`invalid virtual index ${invalidIndex} returns undefined`,
		);
	}

	console.log("fixed virtual geometry: PASS");
}

function runFixedVirtualCollectionAssertions() {
	const fixedVirtualGeometry = loadFixedVirtualGeometryModule();
	const {
		areVirtualItemRangesEqual,
		findVirtualItemIndexByKey,
		resolveFixedVirtualCanvasExtent,
		resolveFixedVirtualViewportRange,
		resolveFixedVirtualViewportScrollOffset,
		resolveVirtualItemKeyIndex,
		resolveVirtualItemReactKey,
	} = loadFixedVirtualCollectionModule(fixedVirtualGeometry);
	const { resolveFixedVirtualGeometry } = fixedVirtualGeometry;
	const items = [{ id: "alpha" }, { id: "beta" }, { id: "gamma" }];
	items.size = () => items.length;
	const getKey = (item) => item.id;
	const uniqueIndex = resolveVirtualItemKeyIndex(items, getKey);

	assertCondition(uniqueIndex.keys.length === 3, "virtual key index preserves every positional key");
	assertCondition(uniqueIndex.indexByKey.get("beta") === 1, "virtual key index resolves a stable consumer key");
	assertCondition(uniqueIndex.duplicateKeys.size === 0, "unique virtual keys produce no duplicate diagnostics");
	assertCondition(
		findVirtualItemIndexByKey(items, getKey, "gamma") === 2,
		"virtual key lookup resolves an unambiguous key",
	);

	const duplicateItems = [{ id: "same" }, { id: "same" }, { id: "unique" }];
	duplicateItems.size = () => duplicateItems.length;
	const duplicateIndex = resolveVirtualItemKeyIndex(duplicateItems, getKey);
	assertCondition(duplicateIndex.duplicateKeys.has("same"), "duplicate virtual keys are diagnosed");
	assertCondition(!duplicateIndex.indexByKey.has("same"), "duplicate virtual keys are excluded from imperative lookup");
	assertCondition(
		findVirtualItemIndexByKey(duplicateItems, getKey, "same") === undefined,
		"ambiguous virtual key lookup deliberately fails",
	);
	const collisionItems = [{ id: "same" }, { id: "same" }, { id: "virtual-list-duplicate-same-0" }];
	collisionItems.size = () => collisionItems.length;
	const collisionIndex = resolveVirtualItemKeyIndex(collisionItems, getKey);
	const resolvedReactKeys = collisionItems.map((_item, index) => resolveVirtualItemReactKey(collisionIndex, index));
	assertCondition(
		new Set(resolvedReactKeys).size === collisionItems.length,
		"duplicate fallback React keys cannot collide with a valid consumer key",
	);
	assertCondition(
		String(resolvedReactKeys[0]).length > "virtual-list-duplicate-same-0".length,
		"duplicate fallback keys use a namespace longer than every consumer string key",
	);

	const geometry = resolveFixedVirtualGeometry({ itemCount: 3, itemExtent: 20, lineGap: 4 });
	assertCondition(
		resolveFixedVirtualCanvasExtent(geometry, 10, 6) === 84,
		"virtual canvas extent includes normalized leading and trailing padding",
	);
	assertCondition(
		resolveFixedVirtualCanvasExtent(geometry, -10, Number.NaN) === 68,
		"virtual canvas extent ignores invalid padding",
	);

	const leadingPaddingRange = resolveFixedVirtualViewportRange(geometry, {
		scrollOffset: 0,
		viewportExtent: 20,
		leadingInset: 30,
		trailingInset: 10,
		overscanLines: 4,
	});
	assertVirtualItemRange(
		leadingPaddingRange.visibleItemRange,
		0,
		0,
		"a viewport entirely inside leading padding has no visible items",
	);
	assertVirtualItemRange(
		leadingPaddingRange.renderedItemRange,
		0,
		0,
		"a viewport entirely inside leading padding does not mount overscan",
	);

	const paddedFirstRange = resolveFixedVirtualViewportRange(geometry, {
		scrollOffset: 0,
		viewportExtent: 40,
		leadingInset: 10,
		trailingInset: 6,
		overscanLines: 1,
	});
	assertVirtualItemRange(paddedFirstRange.visibleItemRange, 0, 2, "padded viewport intersects the first two rows");
	assertVirtualItemRange(paddedFirstRange.renderedItemRange, 0, 3, "padded viewport overscans by a full row");

	const paddedLastRange = resolveFixedVirtualViewportRange(geometry, {
		scrollOffset: Number.POSITIVE_INFINITY,
		viewportExtent: 20,
		leadingInset: 10,
		trailingInset: 6,
	});
	assertCondition(paddedLastRange.scrollOffset === 64, "padded virtual range clamps to its physical canvas maximum");
	assertVirtualItemRange(paddedLastRange.visibleItemRange, 2, 3, "maximum padded scroll reaches the final row");

	const startTarget = resolveFixedVirtualViewportScrollOffset(geometry, {
		index: 1,
		viewportExtent: 20,
		currentScrollOffset: 0,
		alignment: "start",
		leadingInset: 10,
		trailingInset: 6,
	});
	assertCondition(startTarget === 34, "imperative start alignment preserves leading padding");
	assertCondition(
		resolveFixedVirtualViewportScrollOffset(geometry, {
			index: 99,
			viewportExtent: 20,
			currentScrollOffset: 0,
			leadingInset: 10,
			trailingInset: 6,
		}) === undefined,
		"imperative collection scrolling rejects an invalid item index",
	);

	const shrunkGeometry = resolveFixedVirtualGeometry({ itemCount: 1, itemExtent: 20, lineGap: 4 });
	const shrunkRange = resolveFixedVirtualViewportRange(shrunkGeometry, {
		scrollOffset: 10_000,
		viewportExtent: 20,
		leadingInset: 10,
		trailingInset: 6,
	});
	assertCondition(shrunkRange.scrollOffset === 16, "dataset shrink clamps a stale scroll offset to the new canvas");
	assertVirtualItemRange(shrunkRange.visibleItemRange, 0, 1, "dataset shrink keeps the remaining row reachable");
	assertCondition(
		areVirtualItemRangesEqual({ startIndex: 2, endIndex: 5 }, { startIndex: 2, endIndex: 5 }),
		"equal virtual ranges compare by half-open bounds",
	);
	assertCondition(
		!areVirtualItemRangesEqual({ startIndex: 2, endIndex: 5 }, { startIndex: 2, endIndex: 6 }),
		"different virtual ranges do not compare equal",
	);

	console.log("fixed virtual collection: PASS");
}

function runFixedVirtualGridLayoutAssertions() {
	const fixedVirtualGeometry = loadFixedVirtualGeometryModule();
	const { resolveFixedVirtualGridCellLayout, resolveFixedVirtualGridLayout } =
		loadFixedVirtualGridLayoutModule(fixedVirtualGeometry);
	const { resolveFixedVirtualGeometry, resolveFixedVirtualRange } = fixedVirtualGeometry;

	const explicitLayout = resolveFixedVirtualGridLayout({
		availableWidth: 440,
		columnGap: 10,
		columns: 4,
		minimumCellWidth: 300,
		maxColumns: 2,
	});
	assertCondition(explicitLayout.laneCount === 4, "explicit virtual grid columns override responsive inputs");
	assertCondition(explicitLayout.cellWidth === 102.5, "explicit virtual grid columns divide the available width");

	const exactResponsiveLayout = resolveFixedVirtualGridLayout({
		availableWidth: 320,
		columnGap: 10,
		minimumCellWidth: 100,
	});
	assertCondition(exactResponsiveLayout.laneCount === 3, "responsive virtual grid includes an exact three-column fit");
	assertCondition(exactResponsiveLayout.cellWidth === 100, "responsive virtual grid preserves its exact minimum width");

	const thresholdLayout = resolveFixedVirtualGridLayout({
		availableWidth: 319,
		columnGap: 10,
		minimumCellWidth: 100,
	});
	assertCondition(thresholdLayout.laneCount === 2, "responsive virtual grid drops a lane below the width threshold");
	assertCondition(thresholdLayout.cellWidth === 154.5, "responsive virtual grid redistributes remaining width fluidly");

	const cappedLayout = resolveFixedVirtualGridLayout({
		availableWidth: 1_000,
		columnGap: 10,
		minimumCellWidth: 100,
		maxColumns: 4,
	});
	assertCondition(cappedLayout.laneCount === 4, "responsive virtual grid respects maxColumns");
	assertCondition(cappedLayout.cellWidth === 242.5, "capped virtual grid cells expand to fill the row");

	const invalidLayout = resolveFixedVirtualGridLayout({
		availableWidth: Number.NaN,
		minimumCellWidth: 100,
	});
	assertCondition(invalidLayout.laneCount === 1, "invalid virtual grid widths retain one lane");
	assertCondition(invalidLayout.cellWidth === 0, "invalid virtual grid widths produce a safe zero-width cell");

	const geometry = resolveFixedVirtualGeometry({
		itemCount: 10,
		itemExtent: 72,
		lineGap: 8,
		laneCount: exactResponsiveLayout.laneCount,
	});
	const cell = resolveFixedVirtualGridCellLayout(5, geometry, exactResponsiveLayout);
	assertCondition(cell.row === 1 && cell.column === 2, "virtual grid cell layout resolves row and column");
	assertCondition(cell.x === 220 && cell.y === 80, "virtual grid cell layout resolves sparse absolute position");
	assertCondition(cell.width === 100 && cell.height === 72, "virtual grid cell layout resolves fixed cell size");
	assertCondition(
		resolveFixedVirtualGridCellLayout(-1, geometry, exactResponsiveLayout) === undefined &&
			resolveFixedVirtualGridCellLayout(10, geometry, exactResponsiveLayout) === undefined,
		"virtual grid cell layout rejects invalid indices",
	);

	const narrowLayout = resolveFixedVirtualGridLayout({
		availableWidth: 260,
		columnGap: 8,
		minimumCellWidth: 120,
	});
	const wideLayout = resolveFixedVirtualGridLayout({
		availableWidth: 500,
		columnGap: 8,
		minimumCellWidth: 120,
	});
	assertCondition(narrowLayout.laneCount === 2 && wideLayout.laneCount === 3, "virtual grid resize recomputes lanes");
	for (const layout of [narrowLayout, wideLayout]) {
		const resizedGeometry = resolveFixedVirtualGeometry({
			itemCount: 63,
			itemExtent: 72,
			lineGap: 8,
			laneCount: layout.laneCount,
		});
		const resizedRange = resolveFixedVirtualRange(resizedGeometry, {
			scrollOffset: Number.POSITIVE_INFINITY,
			viewportExtent: 220,
			overscanLines: 2,
		});
		assertCondition(
			resizedRange.renderedItemRange.startIndex >= 0 && resizedRange.renderedItemRange.endIndex <= 63,
			"virtual grid resize keeps the rendered range clamped to the dataset",
		);
	}

	console.log("fixed virtual grid layout: PASS");
}

function runOutsidePressAssertions() {
	const { isPointInsideOutsidePressExclusions } = loadOutsidePressModule();
	const root = {
		AbsolutePosition: new Vector2(100, 200),
		AbsoluteSize: new Vector2(800, 600),
	};
	const anchoredRect = {
		position: new UDim2(0.5, 10, 0.25, -5),
		size: new UDim2(0.25, 20, 0, 120),
		anchor: new Vector2(0.5, 0.5),
	};
	assertCondition(
		isPointInsideOutsidePressExclusions(root, new Vector2(400, 285), anchoredRect),
		"outside press includes the minimum edge",
	);
	assertCondition(
		isPointInsideOutsidePressExclusions(root, new Vector2(620, 405), anchoredRect),
		"outside press includes the maximum edge",
	);
	assertCondition(
		!isPointInsideOutsidePressExclusions(root, new Vector2(399.99, 285), anchoredRect),
		"outside press rejects a point left of the minimum edge",
	);
	assertCondition(
		!isPointInsideOutsidePressExclusions(root, new Vector2(620, 405.01), anchoredRect),
		"outside press rejects a point below the maximum edge",
	);

	const firstInstance = {
		AbsolutePosition: new Vector2(25, 40),
		AbsoluteSize: new Vector2(50, 70),
	};
	const secondInstance = {
		AbsolutePosition: new Vector2(700, 500),
		AbsoluteSize: new Vector2(80, 60),
	};
	assertCondition(
		isPointInsideOutsidePressExclusions(root, new Vector2(25, 40), undefined, [firstInstance]),
		"outside press includes an instance minimum edge",
	);
	assertCondition(
		isPointInsideOutsidePressExclusions(root, new Vector2(75, 110), undefined, [firstInstance]),
		"outside press includes an instance maximum edge",
	);
	assertCondition(
		isPointInsideOutsidePressExclusions(root, new Vector2(500, 350), anchoredRect, [firstInstance, secondInstance]),
		"outside press recognizes the configured rectangle among multiple exclusions",
	);
	assertCondition(
		isPointInsideOutsidePressExclusions(root, new Vector2(50, 75), anchoredRect, [firstInstance, secondInstance]),
		"outside press recognizes the first excluded instance",
	);
	assertCondition(
		isPointInsideOutsidePressExclusions(root, new Vector2(780, 560), anchoredRect, [firstInstance, secondInstance]),
		"outside press recognizes the second excluded instance edge",
	);
	assertCondition(
		!isPointInsideOutsidePressExclusions(root, new Vector2(200, 250), anchoredRect, [firstInstance, secondInstance]),
		"outside press rejects a point outside every exclusion",
	);
	assertCondition(
		!isPointInsideOutsidePressExclusions(root, new Vector2(500, 350)),
		"outside press handles an empty exclusion set",
	);

	console.log("outside press: PASS");
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

function getNotificationRecord(store, id) {
	const snapshot = store.getSnapshot();
	return [...snapshot.visible, ...snapshot.queued].find((record) => record.id === id);
}

function assertNotificationIds(records, expectedIds, label) {
	const actualIds = records.map((record) => record.id);
	assertCondition(actualIds.join("|") === expectedIds.join("|"), `${label}: got ${actualIds.join(", ")}`);
}

function assertNotificationPhase(store, id, expectedPhase, label) {
	const record = getNotificationRecord(store, id);
	assertCondition(record?.phase === expectedPhase, `${label}: expected ${expectedPhase}, got ${record?.phase}`);
	return record;
}

function runNotificationIdentityAssertions(createNotificationStore) {
	const manual = createManualScheduler();
	const store = createNotificationStore({ maxVisible: 2, scheduler: manual.scheduler });
	const firstId = store.show({ data: "first", duration: undefined });
	const firstSnapshot = store.getSnapshot();
	const explicitId = store.show({ id: "custom", data: "explicit", duration: undefined });
	const secondId = store.show({ data: "second", duration: undefined });

	assertCondition(firstId === "prism-notification-1", "notifications generate deterministic per-store IDs");
	assertCondition(explicitId === "custom", "notifications preserve explicit IDs");
	assertCondition(secondId === "prism-notification-2", "explicit IDs do not consume generated IDs");
	assertNotificationIds(store.getSnapshot().visible, [firstId, explicitId], "notifications fill visible capacity");
	assertNotificationIds(store.getSnapshot().queued, [secondId], "notifications queue overflow in order");
	assertCondition(firstSnapshot.visible.length === 1, "notification snapshots remain immutable after later writes");
	assertCondition(Object.isFrozen(firstSnapshot), "notification snapshots are frozen");
	assertCondition(Object.isFrozen(firstSnapshot.visible), "notification snapshot arrays are frozen");
	assertCondition(Object.isFrozen(firstSnapshot.visible[0]), "notification record shells are frozen");

	const beforeDuplicate = store.getSnapshot();
	const duplicateId = store.show({ id: explicitId, data: "replacement", duration: 1 });
	assertCondition(duplicateId === explicitId, "duplicate notification shows return the existing ID");
	assertCondition(store.getSnapshot() === beforeDuplicate, "duplicate notification shows are snapshot no-ops");
	assertCondition(
		getNotificationRecord(store, explicitId)?.data === "explicit",
		"duplicate shows preserve existing data",
	);
	store.dismiss(firstId);
	store.finishClose(firstId);
	assertCondition(
		store.show({ data: "third", duration: undefined }) === "prism-notification-3",
		"generated IDs stay monotonic after earlier records are fully removed",
	);

	store.destroy();

	const collisionStore = createNotificationStore({ maxVisible: 2, scheduler: manual.scheduler });
	collisionStore.show({ id: "prism-notification-1", data: "explicit-generated-shape", duration: undefined });
	assertCondition(
		collisionStore.show({ data: "generated-after-collision", duration: undefined }) === "prism-notification-2",
		"generated notification IDs skip active explicit collisions",
	);
	collisionStore.destroy();
}

function runNotificationQueueAssertions(createNotificationStore) {
	const manual = createManualScheduler();
	const store = createNotificationStore({ maxVisible: 1, scheduler: manual.scheduler });
	const firstId = store.show({ id: "first", data: "first", duration: 5 });
	const secondId = store.show({ id: "second", data: "second", duration: 2 });
	const removedQueuedId = store.show({ id: "removed", data: "removed", duration: undefined });

	assertNotificationIds(store.getSnapshot().visible, [firstId], "notifications open the first FIFO item");
	assertNotificationIds(store.getSnapshot().queued, [secondId, removedQueuedId], "notifications retain FIFO overflow");
	assertCondition(manual.pendingCount() === 1, "queued notifications do not start timers");
	assertCondition(store.dismiss(removedQueuedId, "user"), "queued notifications can be dismissed immediately");
	assertNotificationIds(store.getSnapshot().queued, [secondId], "queued dismissal preserves remaining order");

	manual.advance(4);
	assertNotificationPhase(store, firstId, "open", "notification timers wait for their full duration");
	manual.advance(1);
	const timedOut = assertNotificationPhase(store, firstId, "closing", "elapsed notifications enter closing");
	assertCondition(timedOut.dismissReason === "timeout", "elapsed notifications record the timeout reason");
	assertCondition(timedOut.updatedAt === 5, "timeout transitions update notification timestamps");
	assertNotificationPhase(store, secondId, "queued", "closing records continue occupying visible capacity");

	let closeEmissions = 0;
	const unsubscribe = store.subscribe(() => {
		closeEmissions += 1;
	});
	assertCondition(store.finishClose(firstId), "finishClose removes a closing notification");
	assertCondition(closeEmissions === 1, "close completion and promotion publish one atomic snapshot");
	const promoted = assertNotificationPhase(store, secondId, "open", "finishClose promotes the next queued item");
	assertCondition(promoted.openedAt === 5, "promoted notifications record their actual open time");
	assertCondition(promoted.updatedAt === 5, "promotion updates notification timestamps");
	assertCondition(manual.pendingCount() === 1, "promoted notifications start their timers on promotion");

	manual.advance(2);
	assertNotificationPhase(store, secondId, "closing", "promoted timers use the full duration from promotion");
	assertCondition(!store.update(secondId, { data: "late", duration: 10 }), "closing notifications reject updates");
	assertCondition(store.finishClose(secondId), "timed-out promoted notifications can finish closing");

	const programmaticId = store.show({ data: "programmatic", duration: undefined });
	assertCondition(store.dismiss(programmaticId), "open notifications support default dismissal");
	assertCondition(
		getNotificationRecord(store, programmaticId)?.dismissReason === "programmatic",
		"default dismissal records the programmatic reason",
	);
	store.finishClose(programmaticId);
	const userId = store.show({ data: "user", duration: undefined });
	store.dismiss(userId, "user");
	assertCondition(
		getNotificationRecord(store, userId)?.dismissReason === "user",
		"user dismissal preserves its reason",
	);

	unsubscribe();
	store.destroy();
}

function runNotificationUpdateAndRaceAssertions(createNotificationStore) {
	const manual = createManualScheduler();
	const store = createNotificationStore({ maxVisible: 1, scheduler: manual.scheduler });
	const openId = store.show({ id: "open", data: "open-old", duration: 10 });
	const queuedId = store.show({ id: "queued", data: "queued-old", duration: 4 });
	const queuedTailId = store.show({ id: "queued-tail", data: "tail", duration: undefined });
	const firstTimerId = manual.latestTaskId();

	manual.advance(2);
	assertCondition(
		store.update(queuedId, { data: "queued-new", duration: 6 }),
		"queued notifications accept replacement updates",
	);
	assertNotificationIds(store.getSnapshot().queued, [queuedId, queuedTailId], "queued updates preserve FIFO position");
	const updatedQueued = getNotificationRecord(store, queuedId);
	assertCondition(updatedQueued.data === "queued-new", "queued updates replace data");
	assertCondition(updatedQueued.duration === 6, "queued updates replace duration");
	assertCondition(updatedQueued.updatedAt === 2, "queued updates record their update time");
	assertCondition(manual.pendingCount() === 1, "queued updates do not schedule timers");

	const beforeOpenUpdate = store.getSnapshot();
	assertCondition(store.update(openId, { data: "open-new", duration: 8 }), "open notifications accept updates");
	const replacementTimerId = manual.latestTaskId();
	assertCondition(replacementTimerId !== firstTimerId, "open updates replace active timers");
	assertCondition(beforeOpenUpdate.visible[0].data === "open-old", "notification updates preserve older snapshots");
	manual.fireCanceled(firstTimerId);
	assertNotificationPhase(store, openId, "open", "late canceled timer callbacks cannot close updated records");
	manual.advance(7);
	assertNotificationPhase(store, openId, "open", "updated timers restart from the update time");
	manual.advance(1);
	assertNotificationPhase(store, openId, "closing", "updated timers eventually close the current record");

	const closingSnapshot = store.getSnapshot();
	assertCondition(!store.update(openId, { data: "ignored", duration: 20 }), "closing updates are no-ops");
	assertCondition(store.getSnapshot() === closingSnapshot, "closing update no-ops do not emit snapshots");
	store.finishClose(openId);
	assertNotificationPhase(store, queuedId, "open", "updated queued records promote normally");
	manual.advance(6);
	assertNotificationPhase(store, queuedId, "closing", "queued updates determine the promoted timer duration");

	store.destroy();

	const reusedManual = createManualScheduler();
	const reusedStore = createNotificationStore({ maxVisible: 1, scheduler: reusedManual.scheduler });
	reusedStore.show({ id: "reused", data: "old", duration: 5 });
	const staleTimerId = reusedManual.latestTaskId();
	reusedStore.dismiss("reused");
	reusedStore.finishClose("reused");
	reusedStore.show({ id: "reused", data: "new", duration: 8 });
	reusedManual.fireCanceled(staleTimerId);
	const reusedRecord = assertNotificationPhase(
		reusedStore,
		"reused",
		"open",
		"stale callbacks cannot affect a later record reusing the same ID",
	);
	assertCondition(reusedRecord.data === "new", "reused IDs retain the current record data");
	reusedManual.advance(8);
	assertNotificationPhase(reusedStore, "reused", "closing", "the current reused-ID timer remains authoritative");
	reusedStore.destroy();
}

function runNotificationPauseAssertions(createNotificationStore) {
	const manual = createManualScheduler();
	const store = createNotificationStore({ maxVisible: 1, scheduler: manual.scheduler });
	const id = store.show({ data: "pausable", duration: 10 });
	const originalTimerId = manual.latestTaskId();

	manual.advance(3);
	assertCondition(store.pause(id), "open timed notifications can pause");
	assertCondition(getNotificationRecord(store, id)?.paused === true, "paused notifications expose paused state");
	assertCondition(!store.pause(id), "already-paused notifications reject duplicate pauses");
	manual.fireCanceled(originalTimerId);
	manual.advance(20);
	assertNotificationPhase(store, id, "open", "paused notifications ignore time and canceled callbacks");
	assertCondition(store.resume(id), "paused notifications can resume");
	assertCondition(getNotificationRecord(store, id)?.paused === false, "resumed notifications clear paused state");
	assertCondition(!store.resume(id), "active notifications reject duplicate resumes");
	manual.advance(6);
	assertNotificationPhase(store, id, "open", "resume preserves the exact remaining duration");
	manual.advance(1);
	assertNotificationPhase(store, id, "closing", "resumed notifications close at the remaining deadline");
	store.finishClose(id);

	const persistentId = store.show({ data: "persistent", duration: undefined });
	assertCondition(!store.pause(persistentId), "persistent notifications do not pause without an active timer");
	manual.advance(100);
	assertNotificationPhase(store, persistentId, "open", "persistent notifications do not expire");
	store.dismiss(persistentId);
	store.finishClose(persistentId);

	const updatedId = store.show({ data: "timed", duration: 5 });
	store.pause(updatedId);
	assertCondition(
		store.update(updatedId, { data: "now-persistent", duration: undefined }),
		"paused notifications can become persistent",
	);
	assertCondition(getNotificationRecord(store, updatedId)?.paused === true, "persistent updates retain paused intent");
	assertCondition(store.resume(updatedId), "resuming a persistent paused notification clears paused state");
	assertCondition(manual.pendingCount() === 0, "resumed persistent notifications do not schedule timers");
	manual.advance(100);
	assertNotificationPhase(store, updatedId, "open", "updated persistent notifications remain open");

	store.update(updatedId, { data: "timed-again", duration: 4 });
	store.pause(updatedId);
	store.update(updatedId, { data: "reset-paused", duration: 6 });
	store.resume(updatedId);
	manual.advance(5);
	assertNotificationPhase(store, updatedId, "open", "paused updates reset the full remaining duration");
	manual.advance(1);
	assertNotificationPhase(store, updatedId, "closing", "updated paused duration expires after resume");
	store.finishClose(updatedId);

	const infiniteId = store.show({ data: "infinite", duration: Infinity });
	assertCondition(
		getNotificationRecord(store, infiniteId)?.duration === undefined,
		"infinite durations normalize to persistent",
	);
	assertCondition(manual.pendingCount() === 0, "infinite persistent durations do not schedule timers");
	manual.advance(100);
	assertNotificationPhase(store, infiniteId, "open", "infinite persistent durations remain open");

	store.destroy();
}

function runNotificationCapacityAndClearAssertions(createNotificationStore) {
	const capacityManual = createManualScheduler();
	const capacityStore = createNotificationStore({ maxVisible: 0, scheduler: capacityManual.scheduler });
	const firstId = capacityStore.show({ id: "one", data: 1, duration: undefined });
	const secondId = capacityStore.show({ id: "two", data: 2, duration: undefined });
	assertNotificationIds(capacityStore.getSnapshot().visible, [firstId], "maxVisible normalizes to at least one");
	assertNotificationIds(capacityStore.getSnapshot().queued, [secondId], "normalized capacity still queues overflow");

	let capacityEmissions = 0;
	const unsubscribe = capacityStore.subscribe(() => {
		capacityEmissions += 1;
	});
	capacityStore.setMaxVisible(2.9);
	assertNotificationIds(
		capacityStore.getSnapshot().visible,
		[firstId, secondId],
		"fractional capacity floors before promotion",
	);
	assertCondition(capacityEmissions === 1, "raising capacity publishes promoted records once");
	const thirdId = capacityStore.show({ id: "three", data: 3, duration: undefined });
	capacityStore.setMaxVisible(Infinity);
	assertNotificationIds(
		capacityStore.getSnapshot().visible,
		[firstId, secondId],
		"lowering normalized capacity never force-closes visible records",
	);
	assertNotificationIds(capacityStore.getSnapshot().queued, [thirdId], "lowered capacity preserves queued records");
	capacityStore.setMaxVisible(3);
	assertNotificationIds(
		capacityStore.getSnapshot().visible,
		[firstId, secondId, thirdId],
		"raising capacity promotes queued records immediately",
	);
	unsubscribe();
	capacityStore.destroy();

	const clearManual = createManualScheduler();
	const clearStore = createNotificationStore({ maxVisible: 2, scheduler: clearManual.scheduler });
	const visibleA = clearStore.show({ id: "visible-a", data: "a", duration: 10 });
	const timerA = clearManual.latestTaskId();
	const visibleB = clearStore.show({ id: "visible-b", data: "b", duration: 20 });
	const timerB = clearManual.latestTaskId();
	clearStore.show({ id: "queued-a", data: "c", duration: 1 });
	clearStore.show({ id: "queued-b", data: "d", duration: undefined });
	let clearEmissions = 0;
	clearStore.subscribe(() => {
		clearEmissions += 1;
	});
	clearManual.advance(2);
	clearStore.clear();
	assertCondition(clearEmissions === 1, "clear publishes one lifecycle snapshot");
	assertCondition(clearStore.getSnapshot().queued.length === 0, "clear removes all queued notifications");
	for (const id of [visibleA, visibleB]) {
		const record = assertNotificationPhase(clearStore, id, "closing", "clear closes every open notification");
		assertCondition(record.dismissReason === "clear", "clear records its dismissal reason");
		assertCondition(record.updatedAt === 2, "clear updates lifecycle timestamps");
	}
	clearManual.fireCanceled(timerA);
	clearManual.fireCanceled(timerB);
	assertNotificationPhase(clearStore, visibleA, "closing", "late cleared timers cannot change lifecycle state");
	clearStore.clear();
	assertCondition(clearEmissions === 1, "clearing an already-cleared store is an emission no-op");
	clearStore.finishClose(visibleA);
	assertNotificationIds(clearStore.getSnapshot().visible, [visibleB], "clear never promotes removed queued records");
	clearStore.finishClose(visibleB);
	clearStore.destroy();
}

function runNotificationSubscriptionAndDestroyAssertions(createNotificationStore) {
	const manual = createManualScheduler();
	const store = createNotificationStore({ maxVisible: 1, scheduler: manual.scheduler });
	let emissions = 0;
	let lastSnapshot;
	const unsubscribe = store.subscribe((snapshot) => {
		emissions += 1;
		lastSnapshot = snapshot;
	});

	const firstId = store.show({ id: "listener-open", data: "open", duration: undefined });
	const queuedId = store.show({ id: "listener-queued", data: "queued", duration: undefined });
	assertCondition(emissions === 2, "listeners receive one snapshot for each successful show");
	assertCondition(lastSnapshot === store.getSnapshot(), "listeners receive the current immutable snapshot");
	store.show({ id: firstId, data: "duplicate", duration: 1 });
	store.show({ id: queuedId, data: "duplicate-queued", duration: 1 });
	store.update("missing", { data: "missing", duration: 1 });
	store.pause(queuedId);
	store.dismiss("missing");
	assertCondition(emissions === 2, "failed and duplicate mutations do not emit snapshots");
	store.dismiss(queuedId);
	store.dismiss(firstId);
	store.show({ id: firstId, data: "duplicate-closing", duration: 1 });
	store.finishClose(firstId);
	assertCondition(emissions === 5, "successful dismissals and close completion each emit once");
	store.finishClose(firstId);
	store.clear();
	store.setMaxVisible(1);
	store.setMaxVisible(2);
	assertCondition(emissions === 5, "empty lifecycle and capacity no-ops do not emit snapshots");

	unsubscribe();
	unsubscribe();
	let retainedListenerEmissions = 0;
	store.subscribe(() => {
		retainedListenerEmissions += 1;
	});
	const timedId = store.show({ id: "destroyed-timer", data: "timer", duration: 5 });
	const destroyedTimer = manual.latestTaskId();
	assertCondition(emissions === 5, "unsubscribed listeners stop receiving snapshots");
	assertCondition(retainedListenerEmissions === 1, "active listeners receive snapshots before destroy");
	store.destroy();
	store.destroy();
	assertCondition(store.getSnapshot().visible.length === 0, "destroy clears visible records");
	assertCondition(store.getSnapshot().queued.length === 0, "destroy clears queued records");
	manual.fireCanceled(destroyedTimer);
	assertCondition(store.getSnapshot().visible.length === 0, "late callbacks remain harmless after destroy");
	assertCondition(retainedListenerEmissions === 1, "destroy removes active listeners before late callbacks");
	expectThrows(
		() => store.show({ data: "after-destroy", duration: undefined }),
		"destroyed",
		"destroyed notification stores reject new shows",
	);
	assertCondition(!store.update(timedId, { data: "ignored", duration: 1 }), "destroyed stores reject updates");
	assertCondition(!store.dismiss(timedId), "destroyed stores reject dismissals");
	assertCondition(!store.pause(timedId), "destroyed stores reject pauses");
	assertCondition(!store.resume(timedId), "destroyed stores reject resumes");
	assertCondition(!store.finishClose(timedId), "destroyed stores reject close completion");
	store.clear();
	store.setMaxVisible(10);
	store.subscribe(() => {
		throw new Error("destroyed stores must not retain new listeners");
	})();
}

function runNotificationStoreAssertions() {
	const { createNotificationStore } = loadNotificationStoreModule();
	runNotificationIdentityAssertions(createNotificationStore);
	runNotificationQueueAssertions(createNotificationStore);
	runNotificationUpdateAndRaceAssertions(createNotificationStore);
	runNotificationPauseAssertions(createNotificationStore);
	runNotificationCapacityAndClearAssertions(createNotificationStore);
	runNotificationSubscriptionAndDestroyAssertions(createNotificationStore);

	console.log("notifications: PASS");
}

function runNotificationsApiAssertions() {
	const { createNotificationStore } = loadNotificationStoreModule();
	const { createNotificationsApi } = loadNotificationsApiModule();
	const primaryManual = createManualScheduler();
	const secondaryManual = createManualScheduler();
	const primaryStore = createNotificationStore({ maxVisible: 10, scheduler: primaryManual.scheduler });
	const secondaryStore = createNotificationStore({ maxVisible: 10, scheduler: secondaryManual.scheduler });
	const primaryApi = createNotificationsApi(primaryStore, () => 8);
	const secondaryApi = createNotificationsApi(secondaryStore, () => false);

	assertCondition(Object.isFrozen(primaryApi), "notification API action objects are frozen");

	const primaryDefaultId = primaryApi.show({ message: "Primary default" });
	const secondaryDefaultId = secondaryApi.show({ message: "Secondary default" });
	const primaryDefault = getNotificationRecord(primaryStore, primaryDefaultId);
	const secondaryDefault = getNotificationRecord(secondaryStore, secondaryDefaultId);

	assertCondition(primaryDefaultId === "prism-notification-1", "notification API preserves generated IDs");
	assertCondition(
		secondaryDefaultId === primaryDefaultId,
		"independent notification providers can generate the same local ID",
	);
	assertCondition(primaryDefault?.duration === 8, "notification API applies numeric provider durations");
	assertCondition(
		secondaryDefault?.duration === undefined,
		"notification API maps false provider durations to persistent",
	);
	assertCondition(primaryDefault?.data.message === "Primary default", "notification API preserves required messages");
	assertCondition(primaryDefault?.data.color === "info", "notification API defaults colors to info");
	assertCondition(primaryDefault?.data.withCloseButton === true, "notification API enables close buttons by default");
	assertCondition(primaryDefault?.data.title === undefined, "notification API leaves omitted titles unset");
	assertCondition(primaryDefault?.data.icon === undefined, "notification API leaves omitted icons unset");
	assertCondition(primaryDefault?.data.action === undefined, "notification API leaves omitted actions unset");
	assertCondition(Object.isFrozen(primaryDefault?.data), "notification API freezes resolved presentation data");

	const icon = { kind: "test-icon" };
	const action = { label: "Retry", onPress: () => undefined, closeOnPress: false };
	const preservedId = primaryApi.show({
		message: "Original message",
		title: "Original title",
		color: "success",
		icon,
		action,
		withCloseButton: false,
		duration: 12,
	});
	assertCondition(
		primaryApi.update(preservedId, { message: "Updated message" }),
		"notification API updates open records",
	);

	const partiallyUpdated = getNotificationRecord(primaryStore, preservedId);
	assertCondition(partiallyUpdated?.data.message === "Updated message", "notification API applies supplied patches");
	assertCondition(partiallyUpdated?.data.title === "Original title", "notification API preserves omitted titles");
	assertCondition(partiallyUpdated?.data.color === "success", "notification API preserves omitted colors");
	assertCondition(partiallyUpdated?.data.icon === icon, "notification API preserves omitted icon identity");
	assertCondition(partiallyUpdated?.data.action === action, "notification API preserves omitted action identity");
	assertCondition(
		partiallyUpdated?.data.withCloseButton === false,
		"notification API preserves omitted close-button state",
	);
	assertCondition(partiallyUpdated?.duration === 12, "notification API preserves omitted duration");

	assertCondition(
		primaryApi.update(preservedId, { duration: false, icon: false, action: false }),
		"notification API accepts explicit clearing patches",
	);
	const clearedPresentation = getNotificationRecord(primaryStore, preservedId);
	assertCondition(clearedPresentation?.duration === undefined, "notification API maps duration false to persistent");
	assertCondition(clearedPresentation?.data.icon === undefined, "notification API clears icons with false");
	assertCondition(clearedPresentation?.data.action === undefined, "notification API clears actions with false");
	assertCondition(clearedPresentation?.data.message === "Updated message", "clearing preserves omitted messages");
	assertCondition(clearedPresentation?.data.title === "Original title", "clearing preserves omitted titles");

	const explicitPersistentId = primaryApi.show({ message: "Explicit persistent", duration: false });
	assertCondition(
		getNotificationRecord(primaryStore, explicitPersistentId)?.duration === undefined,
		"notification API maps explicit show duration false to persistent",
	);

	assertCondition(primaryApi.dismiss(primaryDefaultId), "notification API dismisses records in its own store");
	assertNotificationPhase(primaryStore, primaryDefaultId, "closing", "notification API dismissal reaches its store");
	assertNotificationPhase(
		secondaryStore,
		secondaryDefaultId,
		"open",
		"notification API dismissal stays isolated from a provider with the same ID",
	);

	const secondarySurvivorId = secondaryApi.show({ message: "Secondary survivor" });
	primaryApi.clear();
	assertNotificationPhase(primaryStore, preservedId, "closing", "notification API clear reaches its own store");
	assertNotificationPhase(
		secondaryStore,
		secondarySurvivorId,
		"open",
		"notification API clear stays isolated from sibling providers",
	);

	primaryStore.destroy();
	secondaryStore.destroy();

	console.log("notifications API: PASS");
}

function run() {
	const { toUDim, toUDim2, toUDimAxis } = loadUnitsModule();
	const { resolveProgressRange, resolveProgressValue, resolveProgressPercent } = loadProgressRangeModule();
	const { alphaToValue, normalizeSliderValue, resolveSliderRange, valueToAlpha } = loadSliderRangeModule();
	const { resolveBreakpoint, resolveResponsiveValue } = loadResponsiveModule();
	const { resolveSelectionGroupProps, resolveSelectionProps } = loadSelectionModule();
	const {
		resolveOverlaySelectionLocation,
		shouldManageOverlaySelection,
		shouldRepairOverlaySelection,
		shouldRestoreOverlaySelection,
	} = loadOverlaySelectionLifecyclePolicyModule();
	const { DEFAULT_THEME, DARK_THEME } = loadThemeDefaultsModule();
	const { getColorContrastRatio, resolveHigherContrastColor, resolveReadableColor } = loadColorContrastModule();
	const colorPickerUtils = loadColorPickerUtilsModule();
	const workbenchModel = loadWorkbenchModelModule();
	const { countChangedThemeTokens, serializeWorkbenchThemeOverride } = loadWorkbenchSerializerModule(
		DEFAULT_THEME,
		workbenchModel,
	);
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

	const extremeProgressRange = resolveProgressRange(Number.MAX_VALUE, Number.MAX_VALUE);
	const extremeProgressValue = resolveProgressValue(Number.MAX_VALUE, extremeProgressRange);
	const extremeProgressPercent = resolveProgressPercent(extremeProgressValue, extremeProgressRange);

	assertFiniteNumber(extremeProgressRange.min, "Progress extreme fallback min");
	assertFiniteNumber(extremeProgressRange.max, "Progress extreme fallback max");
	assertFiniteNumber(extremeProgressRange.max - extremeProgressRange.min, "Progress extreme fallback denominator");
	assertCondition(
		extremeProgressRange.max > extremeProgressRange.min,
		"Progress extreme fallback keeps a strict range",
	);
	assertFiniteNumber(extremeProgressPercent, "Progress extreme fallback percent");
	assertCondition(
		extremeProgressPercent >= 0 && extremeProgressPercent <= 1,
		"Progress extreme fallback percent stays clamped",
	);

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
	assertCondition(
		equalExtremeSliderRange.max > equalExtremeSliderRange.min,
		"Slider equal extreme fallback keeps a strict range",
	);
	assertCondition(invertedFiniteSliderRange.min === 10, "Slider inverted finite range keeps supplied min");
	assertCondition(invertedFiniteSliderRange.max === 10, "Slider inverted finite range clamps max to min");
	assertCondition(invertedFiniteSliderRange.span === 0, "Slider inverted finite range stays non-interactive");
	assertCondition(invertedFiniteSliderValue === 10, "Slider inverted finite range alpha-to-value stays clamped at min");
	assertCondition(equalFiniteSliderRange.min === 10, "Slider equal finite range keeps supplied min");
	assertCondition(equalFiniteSliderRange.max === 10, "Slider equal finite range keeps supplied max");
	assertCondition(equalFiniteSliderRange.span === 0, "Slider equal finite range stays non-interactive");
	assertCondition(equalFiniteSliderValue === 10, "Slider equal finite range alpha-to-value stays clamped at min");
	assertFiniteNumber(extremeSliderValue, "Slider extreme fallback normalized value");
	assertCondition(
		extremeSliderValue >= extremeSliderRange.min && extremeSliderValue <= extremeSliderRange.max,
		"Slider extreme fallback normalized value stays clamped",
	);
	assertFiniteNumber(extremeSliderAlpha, "Slider extreme fallback display alpha");
	assertCondition(
		extremeSliderAlpha >= 0 && extremeSliderAlpha <= 1,
		"Slider extreme fallback display alpha stays clamped",
	);
	assertFiniteNumber(extremeSliderAlphaValue, "Slider extreme fallback alpha-to-value result");
	assertCondition(
		extremeSliderAlphaValue >= extremeSliderRange.min && extremeSliderAlphaValue <= extremeSliderRange.max,
		"Slider extreme fallback alpha-to-value result stays clamped",
	);
	assertFiniteNumber(unusableSliderAlpha, "Slider unusable range alpha fallback");
	assertFiniteNumber(unusableSliderValue, "Slider unusable range value fallback");

	console.log("slider: PASS");

	const defaultBreakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };
	const customBreakpoints = { xs: 0, sm: 320, md: 640, lg: 960, xl: 1280 };
	const objectValue = { columns: 8 };

	assertCondition(resolveBreakpoint(0, defaultBreakpoints) === "xs", "responsive resolves the xs boundary");
	assertCondition(resolveBreakpoint(599, defaultBreakpoints) === "xs", "responsive stays below the sm boundary");
	assertCondition(resolveBreakpoint(600, defaultBreakpoints) === "sm", "responsive resolves the sm boundary");
	assertCondition(resolveBreakpoint(899, defaultBreakpoints) === "sm", "responsive stays below the md boundary");
	assertCondition(resolveBreakpoint(900, defaultBreakpoints) === "md", "responsive resolves the md boundary");
	assertCondition(resolveBreakpoint(1199, defaultBreakpoints) === "md", "responsive stays below the lg boundary");
	assertCondition(resolveBreakpoint(1200, defaultBreakpoints) === "lg", "responsive resolves the lg boundary");
	assertCondition(resolveBreakpoint(1535, defaultBreakpoints) === "lg", "responsive stays below the xl boundary");
	assertCondition(resolveBreakpoint(1536, defaultBreakpoints) === "xl", "responsive resolves the xl boundary");
	assertCondition(resolveBreakpoint(-10, defaultBreakpoints) === "xs", "responsive clamps negative widths to xs");
	assertCondition(resolveBreakpoint(Number.NaN, defaultBreakpoints) === "xs", "responsive handles NaN widths");
	assertCondition(resolveBreakpoint(Infinity, defaultBreakpoints) === "xs", "responsive handles infinite widths");
	assertCondition(resolveBreakpoint(640, customBreakpoints) === "md", "responsive honors custom thresholds");
	assertCondition(
		resolveResponsiveValue({ xs: 2, md: 6, xl: 10 }, "lg") === 6,
		"responsive values inherit from the nearest smaller breakpoint",
	);
	assertCondition(
		resolveResponsiveValue({ xs: "vertical", lg: "horizontal" }, "md") === "vertical",
		"responsive values retain the xs fallback",
	);
	assertCondition(
		resolveResponsiveValue({ xs: objectValue }, "xl") === objectValue,
		"responsive object values retain identity",
	);

	console.log("responsive: PASS");

	const neighbor = {};
	const enabledSelection = resolveSelectionProps({
		selectionOrder: 12,
		nextSelectionRight: neighbor,
	});
	const disabledSelection = resolveSelectionProps({ selectable: true }, false);
	const optedOutSelection = resolveSelectionProps({ selectable: false }, true);
	const selectionGroup = resolveSelectionGroupProps({
		selectionGroup: true,
		selectionBehaviorRight: "Stop",
	});

	assertCondition(enabledSelection.Selectable === true, "selection defaults enabled controls to selectable");
	assertCondition(enabledSelection.SelectionOrder === 12, "selection preserves native order");
	assertCondition(enabledSelection.NextSelectionRight === neighbor, "selection preserves native neighbor identity");
	assertCondition(disabledSelection.Selectable === false, "selection keeps disabled controls non-selectable");
	assertCondition(optedOutSelection.Selectable === false, "selection supports an explicit selectable opt-out");
	assertCondition(selectionGroup.SelectionGroup === true, "selection preserves native group state");
	assertCondition(selectionGroup.SelectionBehaviorRight === "Stop", "selection preserves native group behavior");

	console.log("selection: PASS");

	assertCondition(
		shouldManageOverlaySelection("Gamepad", "always", false),
		"overlay selection enters an always-managed modal from gamepad input",
	);
	assertCondition(
		shouldManageOverlaySelection("Gamepad", "trigger", true),
		"overlay selection enters a trigger overlay captured from its trigger subtree",
	);
	assertCondition(
		!shouldManageOverlaySelection("Gamepad", "trigger", false),
		"overlay selection does not steal a gamepad selection outside the trigger subtree",
	);
	assertCondition(
		!shouldManageOverlaySelection("MouseAndKeyboard", "always", true),
		"overlay selection leaves mouse and keyboard openings unmanaged",
	);
	assertCondition(
		!shouldManageOverlaySelection("Touch", "always", true),
		"overlay selection leaves touch openings unmanaged",
	);
	assertCondition(
		shouldRestoreOverlaySelection(true, "overlay"),
		"overlay selection restores while Prism still owns an overlay target",
	);
	assertCondition(
		shouldRestoreOverlaySelection(true, "missing"),
		"overlay selection repairs a missing owned target during close",
	);
	assertCondition(
		!shouldRestoreOverlaySelection(true, "outside"),
		"overlay selection preserves a target moved outside before close",
	);
	assertCondition(
		!shouldRestoreOverlaySelection(false, "overlay"),
		"overlay selection does not restore after ownership is released",
	);
	assertCondition(
		shouldRepairOverlaySelection(true, "overlay", false),
		"overlay selection repairs an owned target whose identity stayed stable while it became invalid",
	);
	assertCondition(
		shouldRepairOverlaySelection(true, "missing", false),
		"overlay selection repairs an owned target that was unmounted",
	);
	assertCondition(
		!shouldRepairOverlaySelection(true, "outside", false),
		"overlay selection does not repair over a target moved outside",
	);
	assertCondition(
		!shouldRepairOverlaySelection(true, "overlay", true),
		"overlay selection leaves an eligible owned target unchanged",
	);
	assertCondition(
		resolveOverlaySelectionLocation(true, false, true, false) === "outside",
		"overlay selection releases a last-owned target reparented outside",
	);
	assertCondition(
		resolveOverlaySelectionLocation(true, false, true, true) === "missing",
		"overlay selection treats a detached last-owned target as missing",
	);

	console.log("overlay selection lifecycle: PASS");

	const pickerColor = Color3.fromRGB(12, 34, 56);
	assertCondition(
		colorPickerUtils.formatHexColor(pickerColor) === "#0C2238",
		"color picker formats canonical uppercase hex",
	);
	assertCondition(
		colorPickerUtils.colorsEqual(colorPickerUtils.parseHexColor("#0c2238"), pickerColor),
		"color picker parses six-digit hex",
	);
	assertCondition(
		colorPickerUtils.colorsEqual(colorPickerUtils.parseHexColor("#0F8"), Color3.fromRGB(0, 255, 136)),
		"color picker expands three-digit hex",
	);
	assertCondition(colorPickerUtils.parseHexColor("#12FG00") === undefined, "color picker rejects invalid hex");
	assertCondition(
		colorPickerUtils.colorsEqual(colorPickerUtils.parseRgbColor("rgb(12, 34, 56)"), pickerColor),
		"color picker parses wrapped RGB input",
	);
	assertCondition(
		colorPickerUtils.parseRgbColor("256, 0, 0") === undefined,
		"color picker rejects out-of-range RGB input",
	);
	const pickerHsv = colorPickerUtils.color3ToHsv(pickerColor);
	assertCondition(
		colorPickerUtils.colorsEqual(colorPickerUtils.hsvToColor3(pickerHsv), pickerColor),
		"color picker HSV conversion round-trips Color3 values",
	);
	const pickerSaturationValue = colorPickerUtils.resolveSaturationValueFromPoint(
		{ position: new Vector2(10, 20), size: new Vector2(100, 50) },
		new Vector2(60, 45),
	);
	assertCondition(
		pickerSaturationValue.saturation === 0.5 && pickerSaturationValue.value === 0.5,
		"color picker resolves saturation/value from local pointer geometry",
	);
	assertCondition(
		colorPickerUtils.resolveHueFromPoint(
			{ position: new Vector2(100, 0), size: new Vector2(200, 10) },
			new Vector2(150, 5),
		) === 0.25,
		"color picker resolves hue from rail geometry",
	);
	const fieldLeftStep = colorPickerUtils.resolveColorFieldControllerStep("DPadLeft");
	const fieldRightStep = colorPickerUtils.resolveColorFieldControllerStep("Right");
	const fieldValueDownStep = colorPickerUtils.resolveColorFieldControllerStep("ButtonL1");
	const fieldValueUpStep = colorPickerUtils.resolveColorFieldControllerStep("ButtonR1");
	assertCondition(
		fieldLeftStep?.channel === "saturation" && fieldLeftStep.direction === -1,
		"color picker maps D-pad Left to saturation decrement",
	);
	assertCondition(
		fieldRightStep?.channel === "saturation" && fieldRightStep.direction === 1,
		"color picker maps Right to saturation increment",
	);
	assertCondition(
		fieldValueDownStep?.channel === "value" && fieldValueDownStep.direction === -1,
		"color picker maps L1 to value decrement",
	);
	assertCondition(
		fieldValueUpStep?.channel === "value" && fieldValueUpStep.direction === 1,
		"color picker maps R1 to value increment",
	);
	assertCondition(
		colorPickerUtils.resolveColorFieldControllerStep("DPadUp") === undefined &&
			colorPickerUtils.resolveColorFieldControllerStep("Down") === undefined,
		"color picker leaves Up/Down available for native navigation",
	);
	assertCondition(
		colorPickerUtils.resolveColorHueControllerStep("Left") === -1 &&
			colorPickerUtils.resolveColorHueControllerStep("DPadRight") === 1 &&
			colorPickerUtils.resolveColorHueControllerStep("ButtonR1") === undefined,
		"color picker limits hue controller adjustment to horizontal input",
	);
	const controlledPickerColor = Color3.fromRGB(59, 130, 246);
	const candidatePickerColor = Color3.fromRGB(255, 0, 170);
	assertCondition(
		colorPickerUtils.resolvePrecisionCommitColor(candidatePickerColor, controlledPickerColor, true) ===
			controlledPickerColor,
		"color picker rejected controlled commits retain the resolved prop color",
	);
	assertCondition(
		colorPickerUtils.resolvePrecisionCommitColor(candidatePickerColor, controlledPickerColor, false) ===
			candidatePickerColor,
		"color picker uncontrolled commits retain the candidate color",
	);

	console.log("color picker: PASS");

	for (const theme of [DEFAULT_THEME, DARK_THEME]) {
		for (const intent of ["primary", "secondary", "error", "warning", "info", "success"]) {
			assertCondition(
				getColorContrastRatio(theme.colors[intent].main, theme.colors[intent].contrast) >= 4.5,
				`${theme === DEFAULT_THEME ? "default" : "dark"} ${intent} main/contrast meets WCAG AA`,
			);
		}
	}
	const defaultTooltipSurface = resolveHigherContrastColor(
		DEFAULT_THEME.colors.text.inverse,
		DEFAULT_THEME.colors.palette.gray["9"],
		DEFAULT_THEME.colors.palette.gray["0"],
	);
	const darkTooltipSurface = resolveHigherContrastColor(
		DARK_THEME.colors.text.inverse,
		DARK_THEME.colors.palette.gray["9"],
		DARK_THEME.colors.palette.gray["0"],
	);
	assertCondition(
		defaultTooltipSurface === DEFAULT_THEME.colors.palette.gray["9"],
		"default tooltip chooses the dark inverse surface",
	);
	assertCondition(
		darkTooltipSurface === DARK_THEME.colors.palette.gray["0"],
		"dark tooltip chooses the light inverse surface",
	);
	assertCondition(
		getColorContrastRatio(DEFAULT_THEME.colors.text.inverse, defaultTooltipSurface) >= 4.5,
		"default tooltip text/surface meets WCAG AA",
	);
	assertCondition(
		getColorContrastRatio(DARK_THEME.colors.text.inverse, darkTooltipSurface) >= 4.5,
		"dark tooltip text/surface meets WCAG AA",
	);
	const defaultPrimaryPressedSurface = new Color3(
		DEFAULT_THEME.colors.primary.dark.R +
			(DEFAULT_THEME.colors.action.pressed.R - DEFAULT_THEME.colors.primary.dark.R) * 0.14,
		DEFAULT_THEME.colors.primary.dark.G +
			(DEFAULT_THEME.colors.action.pressed.G - DEFAULT_THEME.colors.primary.dark.G) * 0.14,
		DEFAULT_THEME.colors.primary.dark.B +
			(DEFAULT_THEME.colors.action.pressed.B - DEFAULT_THEME.colors.primary.dark.B) * 0.14,
	);
	const defaultPrimaryPressedGlyph = resolveReadableColor(
		defaultPrimaryPressedSurface,
		DEFAULT_THEME.colors.primary.contrast,
		DEFAULT_THEME.colors.text.inverse,
	);
	assertCondition(
		getColorContrastRatio(defaultPrimaryPressedSurface, defaultPrimaryPressedGlyph) >= 4.5,
		"default pressed primary checkbox chooses a readable glyph fallback",
	);

	console.log("theme contrast: PASS");

	const workbenchDraft = workbenchModel.createWorkbenchThemeOverride(DEFAULT_THEME);
	assertCondition(Object.isFrozen(workbenchDraft), "workbench draft root is immutable");
	assertCondition(Object.isFrozen(workbenchDraft.colors), "workbench color draft is immutable");
	assertCondition(Object.isFrozen(workbenchDraft.motion.easing.standard), "workbench easing draft is immutable");
	const editedWorkbenchDraft = workbenchModel.updateFoundationScale(workbenchDraft, "spacing", "md", 37);
	assertCondition(workbenchDraft.spacing.md === 12, "workbench edits preserve the previous draft");
	assertCondition(editedWorkbenchDraft.spacing.md === 37, "workbench edits create the requested token value");
	assertCondition(
		editedWorkbenchDraft.colors === workbenchDraft.colors,
		"workbench edits retain untouched branch identity",
	);
	const orderedWorkbenchDraft = workbenchModel.updateBreakpoint(workbenchDraft, "sm", 4_000);
	assertCondition(
		orderedWorkbenchDraft.breakpoints.sm === workbenchDraft.breakpoints.md,
		"workbench breakpoint edits cannot pass the next breakpoint",
	);
	const coloredWorkbenchDraft = workbenchModel.updateSemanticIntentColor(
		editedWorkbenchDraft,
		"primary",
		"main",
		Color3.fromRGB(12, 34, 56),
	);
	assertCondition(countChangedThemeTokens(coloredWorkbenchDraft) === 2, "workbench counts only changed leaf tokens");
	const fontWorkbenchDraft = workbenchModel.updateFontFamily(coloredWorkbenchDraft, themeEnum.Font.Gotham);
	const completeWorkbenchDraft = workbenchModel.updateMotionEasing(fontWorkbenchDraft, "standard", {
		style: themeEnum.EasingStyle.Linear,
	});
	assertCondition(
		completeWorkbenchDraft.motion.easing.standard.style === themeEnum.EasingStyle.Linear,
		"workbench edits motion easing without mutating the previous draft",
	);
	assertCondition(
		fontWorkbenchDraft.motion.easing.standard.style === themeEnum.EasingStyle.Cubic,
		"workbench keeps prior easing immutable",
	);
	assertCondition(
		countChangedThemeTokens(completeWorkbenchDraft) === 4,
		"workbench counts color, scale, font, and easing leaves",
	);
	const typescriptThemeExport = serializeWorkbenchThemeOverride(completeWorkbenchDraft, "typescript");
	const luauThemeExport = serializeWorkbenchThemeOverride(completeWorkbenchDraft, "luau");
	assertCondition(typescriptThemeExport.includes("primary"), "workbench TypeScript export includes edited colors");
	assertCondition(typescriptThemeExport.includes("spacing"), "workbench TypeScript export includes edited scales");
	assertCondition(!typescriptThemeExport.includes("radius"), "workbench TypeScript export omits unchanged sections");
	assertCondition(
		typescriptThemeExport.includes("fontFamily"),
		"workbench TypeScript export includes font family edits",
	);
	assertCondition(typescriptThemeExport.includes("easing"), "workbench TypeScript export includes easing edits");
	assertCondition(
		typescriptThemeExport.indexOf("colors") < typescriptThemeExport.indexOf("spacing"),
		"workbench TypeScript export uses deterministic section order",
	);
	assertCondition(luauThemeExport.includes("colors ="), "workbench Luau export uses assignment syntax");
	assertCondition(luauThemeExport.endsWith("return themeOverride"), "workbench Luau export is a complete ModuleScript");

	console.log("theme workbench: PASS");
	runFixedVirtualGeometryAssertions();
	runFixedVirtualCollectionAssertions();
	runFixedVirtualGridLayoutAssertions();
	runOutsidePressAssertions();

	runNotificationStoreAssertions();
	runNotificationsApiAssertions();
}

run();
