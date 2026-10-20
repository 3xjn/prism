import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(root, "dist/native");
const read = (relative: string) => fs.readFileSync(path.join(root, relative), "utf8");
function walk(directory: string): string[] {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(directory, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
}
function run(command: string, args: string[], cwd = root, quiet = false): string {
	const result = spawnSync(command, args, { cwd, encoding: "utf8" });
	if (result.error) throw result.error;
	if (result.status !== 0) throw new Error(`${command} failed:\n${result.stdout}\n${result.stderr}`);
	if (!quiet) process.stdout.write(result.stdout);
	return result.stdout;
}

const facade = read("dist/native/src/init.luau");
const publicSource = read("src/lib/index.ts");
const components = [...publicSource.matchAll(/export \* from "\.\/components\/([^"/]+)"/g)].map((match) => match[1]);
for (const name of components) {
	assert(facade.includes(`${name}: React.AbstractComponent<${name}Props`), `Missing native component: ${name}`);
	assert(facade.includes(`export type ${name}Props`), `Missing native props: ${name}`);
}
assert(facade.includes("ThemeProvider: (ThemeProviderProps)"));
assert(facade.includes("export type ThemeOverride"));
assert(facade.includes("useMotion:"));
assert(facade.includes("styled:"));
assert(!facade.includes("mountPrism:"), "Native API must not require the legacy bridge");
assert(facade.includes("strokeTransparency: (number)?"), "Style overrides must retain partial visual fields");
assert(!/\b(?:Contextual|Linear|InOut):?\s*\|/.test(facade), "Engine enums must use native Enum types");

// All implementation files are the same emitted components used by npm consumers.
for (const file of walk(path.join(root, "out/lib")).filter(
	(file) => /\.(lua|luau)$/.test(file) && !/(__typecheck__|__test__|\.spec)\./.test(file),
)) {
	const relative = path.relative(path.join(root, "out/lib"), file);
	if (relative.split(path.sep).includes("testing")) continue;
	assert.equal(fs.readFileSync(path.join(output, "src/_lib", relative), "utf8"), fs.readFileSync(file, "utf8"));
}

const versions = JSON.parse(read("dist/native/runtime-versions.json"));
const lock = JSON.parse(read("package-lock.json"));
for (const [name, version] of Object.entries(versions)) {
	assert.equal(lock.packages[`node_modules/${name}`].version, version, `Unpinned runtime: ${name}`);
	assert(!/jest|ui-labs/.test(name), `Development dependency in runtime: ${name}`);
	const project = JSON.parse(read(`node_modules/${name}/default.project.json`));
	const scope = name.split("/")[0];
	const moduleDir = path.join(output, "src/node_modules", scope, project.name);
	assert(fs.existsSync(moduleDir), `Missing runtime module: ${name}`);
}
assert.equal(versions["@rbxts-js/react"], versions["@rbxts-js/react-roblox"]);
assert(read("native/React.luau").includes('node_modules["@rbxts-js"].React'));
assert(read("native/ReactRoblox.luau").includes('node_modules["@rbxts-js"].ReactRoblox'));
assert(!read("dist/native/src/_runtime/RuntimeLib.lua").includes("Prism Jest"));

const sources = [...walk(path.join(output, "src")), ...walk(path.join(root, "native/examples"))].filter((file) =>
	/\.(lua|luau)$/.test(file),
);
const syntaxList = path.join(root, "dist/native-syntax-files.json");
fs.writeFileSync(syntaxList, JSON.stringify(sources));
run("lune", ["run", "native/verify-syntax.luau", syntaxList]);
run("rojo", ["build", "dist/native/default.project.json", "--output", "dist/Prism.rbxm"]);
const listing = run("wally", ["package", "--list"], output, true).replace(/\\/g, "/");
for (const file of [
	"src/init.luau",
	"src/React.luau",
	"src/ReactRoblox.luau",
	"src/ThirdPartyNotices.luau",
	"LICENSE",
]) {
	assert(listing.includes(file), `Wally archive missing ${file}`);
}
assert(!listing.includes("__test__"), "Tests must not ship in native package");

// Analyze the generated API and a real handwritten consumer in a DataModel.
// Version-pinned engine definitions avoid relying on a local editor installation.
const definitions = path.join(root, "dist/native-robloxTypes.d.luau");
if (!fs.existsSync(definitions)) {
	const response = await fetch(
		"https://raw.githubusercontent.com/JohnnyMorganz/luau-lsp/5c14dad8d4e82357074e5553244d3621797ff876/scripts/globalTypes.d.luau",
		{ signal: AbortSignal.timeout(30_000) },
	);
	if (!response.ok) throw new Error(`Roblox type definitions: HTTP ${response.status}`);
	fs.writeFileSync(definitions, await response.text());
}
fs.mkdirSync(path.join(output, "checks"), { recursive: true });
fs.writeFileSync(
	path.join(output, "checks/InvalidProps.luau"),
	`--!strict
local Prism = require(game:GetService("ReplicatedStorage").Prism)
local invalidDisabled: Prism.ButtonProps = { disabled = "yes" }
local invalidCallback: Prism.InputProps = { onChange = 42 }
local invalidSlot: Prism.ButtonSlotProps = { root = "invalid" }
return { disabled = invalidDisabled, callback = invalidCallback, slot = invalidSlot }
`,
);
fs.writeFileSync(
	path.join(output, "checks.project.json"),
	JSON.stringify(
		{
			name: "NativeConsumerCheck",
			tree: {
				$className: "DataModel",
				ReplicatedStorage: {
					$className: "ReplicatedStorage",
					Prism: { $path: "src" },
				},
				StarterPlayer: {
					$className: "StarterPlayer",
					StarterPlayerScripts: {
						$className: "StarterPlayerScripts",
						Preferences: { $path: "../../native/examples/Preferences.luau" },
						InvalidProps: { $path: "checks/InvalidProps.luau" },
					},
				},
			},
		},
		null,
		2,
	),
);
run("rojo", ["sourcemap", "checks.project.json", "--output", "checks/sourcemap.json"], output);
const analysisArgs = [
	"analyze",
	"--platform=roblox",
	"--definitions=../native-robloxTypes.d.luau",
	"--sourcemap=checks/sourcemap.json",
	"--ignore=**/node_modules/**",
	"--ignore=**/_runtime/**",
	"--ignore=**/_lib/**",
];
run(
	"luau-lsp",
	[
		...analysisArgs,
		"src/init.luau",
		"src/React.luau",
		"src/ReactRoblox.luau",
		"../../native/examples/Preferences.luau",
	],
	output,
);
const negative = spawnSync("luau-lsp", [...analysisArgs, "checks/InvalidProps.luau"], {
	cwd: output,
	encoding: "utf8",
});
if (negative.error) throw negative.error;
assert.notEqual(negative.status, 0, "Native types must reject invalid props");
const errors = negative.stdout + negative.stderr;
for (const line of [3, 4, 5])
	assert(
		new RegExp(`InvalidProps\\.luau[^\\n]*\\(${line},.*TypeError`).test(errors),
		`Missing expected native type error at line ${line}:\n${errors}`,
	);
console.log(
	`Verified ${components.length} native component exports, source parity, shared runtimes, Luau syntax, positive/negative Luau type contracts, Rojo model and Wally package contents`,
);
run("wally", ["package", "--output", "../prism-native.zip"], output);
