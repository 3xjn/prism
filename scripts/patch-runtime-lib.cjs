"use strict";

const fs = require("fs");
const path = require("path");

const runtimeLibPath = path.join(__dirname, "..", "include", "RuntimeLib.lua");
const source = fs.readFileSync(runtimeLibPath, "utf8");

if (source.includes("Open Cloud Jest (loadstring) re-executes RuntimeLib")) {
	process.stdout.write("include/RuntimeLib.lua already patched for Jest loadstring isolation\n");
	process.exit(0);
}

const original = `\tif not registeredLibraries[module] then
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

const patched = `\tif not registeredLibraries[module] then
\t\t-- Open Cloud Jest (loadstring) re-executes RuntimeLib per spec, so each
\t\t-- sandbox has a different TS table while sharing _G. Treat an existing
\t\t-- registration as already-initialized and continue to require().
\t\tif _G[module] == nil then
\t\t\t_G[module] = TS
\t\tend
\t\tregisteredLibraries[module] = true -- register as already loaded for subsequent calls
\tend`;

if (!source.includes(original)) {
	process.stderr.write(
		"scripts/patch-runtime-lib.cjs: could not find RuntimeLib _G[module] check to patch\n",
	);
	process.exit(1);
}

fs.writeFileSync(runtimeLibPath, source.replace(original, patched));
process.stdout.write("patched include/RuntimeLib.lua for Jest loadstring isolation\n");
