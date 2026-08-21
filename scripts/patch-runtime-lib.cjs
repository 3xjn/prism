"use strict";

const fs = require("fs");
const path = require("path");

const flagsMarker = "Prism Jest: enable ReactRoblox.act";
const flagsLines = `_G.__DEV__ = true
_G.__ROACT_17_MOCK_SCHEDULER__ = true
`;

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

// Jest loadstring re-executes RuntimeLib per spec. That isolated _G is not the
// _G ReactGlobals sees. Patch the real ReactGlobals ModuleScript on disk.
const reactGlobalsPath = path.join(
	__dirname,
	"..",
	"node_modules",
	"@rbxts-js",
	"react-globals",
	"src",
	"ReactGlobals.global.lua",
);
if (!fs.existsSync(reactGlobalsPath)) {
	process.stderr.write(`scripts/patch-runtime-lib.cjs: missing ${reactGlobalsPath}\n`);
	process.exit(1);
}

const reactGlobalsMarker =
	"Prism Jest: ReactGlobals is a real ModuleScript; RuntimeLib loadstring _G never reaches it";
let reactGlobalsSource = fs.readFileSync(reactGlobalsPath, "utf8");
if (!reactGlobalsSource.includes(reactGlobalsMarker)) {
	reactGlobalsSource = `-- ${reactGlobalsMarker}\n${flagsLines}\n${reactGlobalsSource}`;
	fs.writeFileSync(reactGlobalsPath, reactGlobalsSource);
	process.stdout.write("patched ReactGlobals.global.lua with ReactRoblox.act _G flags\n");
} else {
	process.stdout.write("ReactGlobals.global.lua already patched for Jest\n");
}
