"use strict";

const fs = require("fs");
const path = require("path");

const runtimeLibPath = path.join(__dirname, "..", "include", "RuntimeLib.lua");
let source = fs.readFileSync(runtimeLibPath, "utf8");

const flagsMarker = "Prism Jest: enable ReactRoblox.act";
const flagsSnippet = `-- ${flagsMarker} (real ModuleScript, before TS.import)
_G.__DEV__ = true
_G.__ROACT_17_MOCK_SCHEDULER__ = true

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
	source = flagsSnippet + source;
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
