import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(root, "dist", "bindings");
const source = path.join(output, "src");
const npm = process.env.npm_execpath;
if (!npm) throw new Error("Run this script through npm run build:bindings");

// npm owns dependency resolution; this script only stages files for Rojo and Wally.
const packages = execFileSync(process.execPath, [npm, "ls", "--omit=dev", "--all", "--parseable"], {
	cwd: root,
	encoding: "utf8",
})
	.trim()
	.split(/\r?\n/)
	.filter((directory) => path.resolve(directory) !== path.resolve(root));

for (const directory of [path.dirname(output), output]) {
	if (fs.existsSync(directory) && fs.lstatSync(directory).isSymbolicLink())
		throw new Error(`Package output must not be a symlink: ${directory}`);
}
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(source, { recursive: true });

function copySources(from: string, to: string) {
	fs.cpSync(from, to, {
		recursive: true,
		filter: (file) =>
			!/(__tests?__|__typecheck__|testing|\.spec\.)/.test(path.relative(from, file)) &&
			(fs.statSync(file).isDirectory() || /\.(lua|luau)$/.test(file)),
	});
}

copySources(path.join(root, "out/lib"), path.join(source, "_lib"));
copySources(path.join(root, "include"), path.join(source, "_runtime"));
if (fs.readFileSync(path.join(source, "_runtime/RuntimeLib.lua"), "utf8").includes("Prism Jest"))
	throw new Error("Build the package with clean compiler helpers before packaging");

const licenses = [fs.readFileSync(path.join(root, "LICENSE"), "utf8")];
const installed = new Set<string>();
for (const directory of [...new Set(packages), path.join(root, "node_modules/roblox-ts")]) {
	const metadata = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8")) as {
		name: string;
		version: string;
	};
	if (metadata.name !== "roblox-ts") {
		const project = JSON.parse(fs.readFileSync(path.join(directory, "default.project.json"), "utf8")) as {
			name: string;
			tree: { $path: string };
		};
		const scope = metadata.name.split("/")[0];
		const destination = path.join(source, "node_modules", scope, project.name);
		if (installed.has(destination)) throw new Error(`Conflicting runtime packages: ${metadata.name}`);
		installed.add(destination);
		copySources(path.resolve(directory, project.tree.$path), destination);
	}
	for (const file of fs.readdirSync(directory)) {
		if (/^(license|copying)(\.|$)/i.test(file) && fs.statSync(path.join(directory, file)).isFile())
			licenses.push(`${metadata.name}@${metadata.version}\n${fs.readFileSync(path.join(directory, file), "utf8")}`);
	}
}

for (const file of ["init.luau", "types.luau", "icons.luau", "React.luau", "ReactRoblox.luau"])
	fs.copyFileSync(path.join(root, "bindings", file), path.join(source, file));
for (const file of ["README.md", "wally.toml", "default.project.json"])
	fs.copyFileSync(path.join(root, "bindings", file), path.join(output, file));
fs.copyFileSync(path.join(root, "LICENSE"), path.join(output, "LICENSE"));
const notices = licenses.join("\n\n");
let delimiter = "==";
while (notices.includes(`]${delimiter}]`)) delimiter += "=";
fs.writeFileSync(path.join(source, "ThirdPartyNotices.luau"), `return [${delimiter}[\n${notices}\n]${delimiter}]\n`);
