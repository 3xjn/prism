import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emitNativeTypes } from "./native-types.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(root, "dist", "native");
const source = path.join(output, "src");

function copyLuau(from: string, to: string): void {
	fs.mkdirSync(to, { recursive: true });
	for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
		if (/^(__tests?__|__typecheck__|testing)$/.test(entry.name)) continue;
		const original = path.join(from, entry.name);
		const target = path.join(to, entry.name);
		if (entry.isDirectory()) copyLuau(original, target);
		else if (/\.(lua|luau)$/.test(entry.name) && !/(__typecheck__|__test__|\.spec)\./.test(entry.name)) {
			fs.copyFileSync(original, target);
		}
	}
}

export function buildNative() {
	if (!fs.existsSync(path.join(root, "out/lib/init.luau"))) throw new Error("Run build:package before build-native.ts");
	// Delete only this build's generated output, never follow an output symlink.
	if (path.resolve(output) !== path.join(root, "dist", "native")) throw new Error("Invalid native output path");
	if (fs.existsSync(path.dirname(output)) && fs.lstatSync(path.dirname(output)).isSymbolicLink())
		throw new Error("Native output parent must not be a symlink");
	if (fs.existsSync(output)) {
		if (fs.lstatSync(output).isSymbolicLink()) throw new Error("Native output must not be a symlink");
		fs.rmSync(output, { recursive: true });
	}
	fs.mkdirSync(source, { recursive: true });
	copyLuau(path.join(root, "out/lib"), path.join(source, "_lib"));
	copyLuau(path.join(root, "include"), path.join(source, "_runtime"));
	const runtime = fs.readFileSync(path.join(source, "_runtime/RuntimeLib.lua"), "utf8");
	if (runtime.includes("Prism Jest"))
		throw new Error("Rebuild with clean compiler helpers; test-only runtime flags cannot ship");

	const versions: Record<string, string> = {};
	const notices: string[] = [];
	const installed = new Map<string, string>();
	function collect(name: string): void {
		if (versions[name]) return;
		const packageDir = path.join(root, "node_modules", name);
		const metadata = JSON.parse(fs.readFileSync(path.join(packageDir, "package.json"), "utf8"));
		const project = JSON.parse(fs.readFileSync(path.join(packageDir, "default.project.json"), "utf8"));
		const [scope] = name.split("/");
		const moduleName = project.name;
		const destination = path.join(source, "node_modules", scope, moduleName);
		if (installed.has(destination)) throw new Error(`Duplicate native module name: ${name}`);
		installed.set(destination, name);
		versions[name] = metadata.version;
		copyLuau(path.resolve(packageDir, project.tree.$path), destination);
		for (const entry of fs.readdirSync(packageDir)) {
			if (/^(license|copying)(\.|$)/i.test(entry)) {
				const relative = `licenses/${name.replace(/[@/]/g, "_")}/${entry}`;
				fs.mkdirSync(path.dirname(path.join(output, relative)), { recursive: true });
				fs.copyFileSync(path.join(packageDir, entry), path.join(output, relative));
			}
		}
		notices.push(
			`${name}@${metadata.version}: ${metadata.license || "see source notices"}; ${metadata.repository?.url || metadata.homepage || ""}`,
		);
		for (const dependency of Object.keys(metadata.dependencies || {})) collect(dependency);
	}
	collect("@rbxts/react");
	collect("@rbxts/react-roblox");

	const nativeTypes = emitNativeTypes(root);
	const template = fs.readFileSync(path.join(root, "native/init.template.luau"), "utf8");
	fs.writeFileSync(
		path.join(source, "init.luau"),
		template
			.replace("-- @generated-types", nativeTypes.types)
			.replace("-- @generated-fields", nativeTypes.fields + ","),
	);
	for (const name of ["React", "ReactRoblox"])
		fs.copyFileSync(path.join(root, `native/${name}.luau`), path.join(source, `${name}.luau`));
	const metadata = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
	fs.writeFileSync(
		path.join(output, "default.project.json"),
		JSON.stringify({ name: "Prism", tree: { $path: "src" } }, null, 2) + "\n",
	);
	fs.writeFileSync(
		path.join(output, "wally.toml"),
		`[package]\nname = "3xjn/prism"\nversion = "${metadata.version}"\nregistry = "https://github.com/UpliftGames/wally-index"\nrealm = "shared"\nlicense = "MIT"\ninclude = ["src", "src/**", "licenses", "licenses/**", "default.project.json", "wally.toml", "LICENSE", "README.md", "THIRD_PARTY_NOTICES.md", "runtime-versions.json"]\nexclude = ["*"]\n`,
	);
	fs.writeFileSync(path.join(output, "runtime-versions.json"), JSON.stringify(versions, null, 2) + "\n");
	fs.writeFileSync(
		path.join(output, "THIRD_PARTY_NOTICES.md"),
		"# Included runtime dependencies\n\n" +
			notices
				.sort()
				.map((line) => `- ${line}`)
				.join("\n") +
			"\n\nCompiler helpers: roblox-ts 3.0.0 (MIT), https://github.com/roblox-ts/roblox-ts.\n",
	);
	fs.copyFileSync(path.join(root, "native/README.md"), path.join(output, "README.md"));
	fs.copyFileSync(path.join(root, "LICENSE"), path.join(output, "LICENSE"));
	const compilerLicense = path.join(root, "node_modules/roblox-ts/LICENSE");
	fs.mkdirSync(path.join(output, "licenses/roblox-ts"), { recursive: true });
	fs.copyFileSync(compilerLicense, path.join(output, "licenses/roblox-ts/LICENSE"));
	const licenseFiles: string[] = [];
	function licensesIn(directory: string): void {
		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			const file = path.join(directory, entry.name);
			if (entry.isDirectory()) licensesIn(file);
			else licenseFiles.push(fs.readFileSync(file, "utf8"));
		}
	}
	licensesIn(path.join(output, "licenses"));
	const modelNotices = [fs.readFileSync(path.join(root, "LICENSE"), "utf8"), ...notices, ...new Set(licenseFiles)].join(
		"\n\n",
	);
	let delimiter = "==";
	while (modelNotices.includes(`]${delimiter}]`)) delimiter += "=";
	fs.writeFileSync(
		path.join(source, "ThirdPartyNotices.luau"),
		`-- Licenses travel with the Studio model as well as the source archive.\nreturn [${delimiter}[\n${modelNotices}\n]${delimiter}]\n`,
	);
	console.log(
		`Native package: ${nativeTypes.typeCount} public Luau types, ${Object.keys(versions).length} pinned runtime packages in dist/native`,
	);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildNative();
