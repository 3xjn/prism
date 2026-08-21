"use strict";

const fs = require("fs");
const path = require("path");

const flagsMarker = "Prism Jest: enable ReactRoblox.act";
const flagsLines = `_G.__DEV__ = true
_G.__ROACT_17_MOCK_SCHEDULER__ = true
`;

function prependFlags(filePath, reason) {
	if (!fs.existsSync(filePath)) {
		process.stderr.write(`scripts/patch-runtime-lib.cjs: missing ${filePath}\n`);
		process.exit(1);
	}

	let source = fs.readFileSync(filePath, "utf8");
	if (source.includes(flagsMarker)) {
		return false;
	}

	source = `-- ${flagsMarker} (${reason})\n${flagsLines}\n${source}`;
	fs.writeFileSync(filePath, source);
	return true;
}

const runtimeLibPath = path.join(__dirname, "..", "include", "RuntimeLib.lua");
let source = fs.readFileSync(runtimeLibPath, "utf8");

const runtimeFlagsSnippet = `-- ${flagsMarker} (real ModuleScript, before TS.import)
${flagsLines}
`;

const isolationMarker = "Open Cloud Jest (loadstring) re-executes RuntimeLib";
const originalIsolation = `\tif not registeredLibraries[module] then
\t\tif _G[module] then
\t\t\terror(
\t\t\t\tOUTPUT_PREFIX
\t\t\t\t.. "Invalid module access! Do you have multiple TS runtimes trying to import this? "
\t\t\t\t.. module:GetFullName(),
\t\t\t\t2
\t\t\t)
\t\tend

\t\t_G[module] = TS
\t\tregisteredLibraries[module] = true -- register as already loaded for subsequent calls
\tend`;

const patchedIsolation = `\tif not registeredLibraries[module] then
\t\t-- ${isolationMarker} per spec, so each
\t\t-- sandbox has a different TS table while sharing _G. Treat an existing
\t\t-- registration as already-initialized and continue to require().
\t\tif _G[module] == nil then
\t\t\t_G[module] = TS
\t\tend
\t\tregisteredLibraries[module] = true -- register as already loaded for subsequent calls
\tend`;

let changed = false;

if (!source.includes(flagsMarker)) {
	source = runtimeFlagsSnippet + source;
	changed = true;
	process.stdout.write("patched include/RuntimeLib.lua with ReactRoblox.act _G flags\n");
}

if (!source.includes(isolationMarker)) {
	if (!source.includes(originalIsolation)) {
		process.stderr.write(
			"scripts/patch-runtime-lib.cjs: could not find RuntimeLib _G[module] check to patch\n",
		);
		process.exit(1);
	}
	source = source.replace(originalIsolation, patchedIsolation);
	changed = true;
	process.stdout.write("patched include/RuntimeLib.lua for Jest loadstring isolation\n");
}

if (changed) {
	fs.writeFileSync(runtimeLibPath, source);
} else {
	process.stdout.write("include/RuntimeLib.lua already patched for Jest\n");
}

// Jest loadstring gives each ModuleScript its own environment. RuntimeLib _G
// writes therefore never reach ReactGlobals.loadFromGlobal. Set the flags in
// ReactGlobals's own source so act/mock-scheduler wire on first require.
const reactGlobalsPath = path.join(
	__dirname,
	"..",
	"node_modules",
	"@rbxts-js",
	"react-globals",
	"src",
	"ReactGlobals.global.lua",
);
if (prependFlags(reactGlobalsPath, "ReactGlobals sandbox, before loadFromGlobal")) {
	process.stdout.write("patched ReactGlobals.global.lua with ReactRoblox.act _G flags\n");
} else {
	process.stdout.write("ReactGlobals.global.lua already patched for Jest\n");
}
