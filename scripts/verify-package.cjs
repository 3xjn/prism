"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const requiredTypeNames = [
	"Avatar",
	"Box",
	"Button",
	"Card",
	"DEFAULT_DARK_THEME",
	"DEFAULT_THEME",
	"Icon",
	"IconName",
	"Input",
	"Pressable",
	"ScrollArea",
	"Slider",
	"Stack",
	"Text",
	"ThemeProvider",
	"theme",
	"useMotion",
];

function run(command, args, options) {
	const result = spawnSync(command, args, {
		encoding: "utf8",
		stdio: "pipe",
		...options,
	});
	if (result.status !== 0) {
		const detail = [result.stdout, result.stderr].filter(Boolean).join("\n");
		throw new Error(`${command} ${args.join(" ")} failed (${result.status}):\n${detail}`);
	}
	return result;
}

function which(command) {
	return spawnSync(command, ["--version"], { encoding: "utf8" }).status === 0;
}

function assertExists(filePath, label) {
	if (!fs.existsSync(filePath)) {
		throw new Error(`missing ${label}: ${filePath}`);
	}
}

function writeJson(filePath, value) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, "\t")}\n`);
}

function writeText(filePath, value) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, value);
}

function assertGitIgnoresOut() {
	const tracked = run("git", ["ls-files", "--", "out"], { cwd: repoRoot }).stdout.trim();
	if (tracked) {
		throw new Error(`generated out/ must not be tracked:\n${tracked}`);
	}
	const ignore = run("git", ["check-ignore", "-v", "out/lib/index.d.ts"], { cwd: repoRoot });
	if (!ignore.stdout.includes(".gitignore")) {
		throw new Error("out/lib must stay gitignored");
	}
	process.stdout.write("[git] out/ is untracked and gitignored\n");
}

function npmPack() {
	const packed = run("npm", ["pack", "--json"], { cwd: repoRoot });
	const stdout = packed.stdout.trim();
	const jsonStart = Math.min(
		...["[", "{"].map((token) => {
			const index = stdout.indexOf(token);
			return index === -1 ? Number.POSITIVE_INFINITY : index;
		}),
	);
	if (!Number.isFinite(jsonStart)) {
		throw new Error(`npm pack did not report JSON:\n${packed.stdout}\n${packed.stderr}`);
	}
	const parsed = JSON.parse(stdout.slice(jsonStart));
	const filename = Array.isArray(parsed) ? parsed[0].filename : parsed.filename;
	if (!filename) {
		throw new Error(`npm pack did not report a filename:\n${packed.stdout}`);
	}
	return path.join(repoRoot, filename);
}

function assertTarballContents(tarball) {
	const listing = run("tar", ["-tzf", tarball]).stdout.split("\n").filter(Boolean);
	const names = listing.map((entry) => entry.replace(/^package\//, ""));
	const required = ["out/lib/index.d.ts", "out/lib/init.luau", "package.json"];
	for (const name of required) {
		if (!names.includes(name)) {
			throw new Error(`tarball missing ${name}`);
		}
	}
	const forbidden = names.filter((name) => name === "src" || name.startsWith("src/"));
	if (forbidden.length > 0) {
		throw new Error(`tarball must not include source:\n${forbidden.slice(0, 20).join("\n")}`);
	}
	process.stdout.write(`[tarball] ${names.length} files, compiled out/lib present, src/ absent\n`);
}

function assertShippedPackage(prismRoot) {
	const indexDts = path.join(prismRoot, "out", "lib", "index.d.ts");
	const initLuau = path.join(prismRoot, "out", "lib", "init.luau");
	assertExists(indexDts, "out/lib/index.d.ts");
	assertExists(initLuau, "out/lib/init.luau");

	const declarations = [];
	const walk = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
			} else if (entry.name.endsWith(".d.ts")) {
				declarations.push(fs.readFileSync(full, "utf8"));
			}
		}
	};
	walk(path.join(prismRoot, "out", "lib"));
	const dts = declarations.join("\n");
	for (const name of requiredTypeNames) {
		if (!dts.includes(name)) {
			throw new Error(`compiled declarations do not mention public export ${name}`);
		}
	}
}

function createConsumerProject(consumerDir, prismSpec) {
	writeJson(path.join(consumerDir, "package.json"), {
		name: "prism-consumer-smoke",
		private: true,
		version: "0.0.0",
		dependencies: {
			"@3xjn/prism": prismSpec,
		},
		devDependencies: {
			"@rbxts/compiler-types": "3.0.0-types.0",
			"@rbxts/types": "1.0.916",
			"roblox-ts": "3.0.0",
			typescript: "5.8.3",
		},
	});

	writeJson(path.join(consumerDir, "tsconfig.json"), {
		compilerOptions: {
			allowSyntheticDefaultImports: true,
			declaration: false,
			downlevelIteration: true,
			experimentalDecorators: true,
			forceConsistentCasingInFileNames: true,
			jsx: "react",
			jsxFactory: "React.createElement",
			jsxFragmentFactory: "React.Fragment",
			module: "commonjs",
			moduleDetection: "force",
			moduleResolution: "Node",
			noLib: true,
			outDir: "out",
			resolveJsonModule: true,
			rootDir: "src",
			skipLibCheck: true,
			strict: true,
			target: "ESNext",
			typeRoots: ["node_modules/@rbxts", "node_modules/@3xjn"],
		},
		include: ["src"],
	});

	writeJson(path.join(consumerDir, "default.project.json"), {
		name: "prism-consumer-smoke",
		tree: {
			$className: "DataModel",
			ReplicatedStorage: {
				TS: {
					$path: "out",
				},
				rbxts_include: {
					$path: "include",
					node_modules: {
						$className: "Folder",
						"@rbxts": {
							$path: "node_modules/@rbxts",
						},
						"@3xjn": {
							$path: "node_modules/@3xjn",
						},
					},
				},
			},
		},
	});

	writeText(
		path.join(consumerDir, "src", "main.ts"),
		`import {
	Avatar,
	Box,
	Button,
	Card,
	DEFAULT_DARK_THEME,
	DEFAULT_THEME,
	Icon,
	type IconName,
	Input,
	Pressable,
	ScrollArea,
	Slider,
	Stack,
	Text,
	ThemeProvider,
	theme,
	useMotion,
} from "@3xjn/prism";

export const prismApi = {
	Avatar,
	Box,
	Button,
	Card,
	DEFAULT_DARK_THEME,
	DEFAULT_THEME,
	Icon,
	Input,
	Pressable,
	ScrollArea,
	Slider,
	Stack,
	Text,
	ThemeProvider,
	theme,
	useMotion,
};

export const iconName: IconName = "circle";
`,
	);
}

function installAndTypecheck(label, installer, consumerDir) {
	process.stdout.write(`\n[${label}] install\n`);
	installer();
	const prismRoot = path.join(consumerDir, "node_modules", "@3xjn", "prism");
	assertShippedPackage(prismRoot);

	process.stdout.write(`[${label}] rbxtsc\n`);
	const compile = run("npx", ["--no-install", "rbxtsc", "--type", "game"], { cwd: consumerDir });
	process.stdout.write(compile.stdout);
	if (compile.stderr) {
		process.stdout.write(compile.stderr);
	}

	const compiledLuau = path.join(consumerDir, "out", "main.luau");
	const compiledLua = path.join(consumerDir, "out", "main.lua");
	if (!fs.existsSync(compiledLuau) && !fs.existsSync(compiledLua)) {
		throw new Error(`[${label}] rbxtsc did not emit consumer out/main.luau`);
	}
	process.stdout.write(`[${label}] ok\n`);
}

function main() {
	assertGitIgnoresOut();
	const tarball = npmPack();
	process.stdout.write(`packed ${tarball}\n`);
	assertTarballContents(tarball);

	const npmIgnoreDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-npm-ignore-scripts-"));
	createConsumerProject(npmIgnoreDir, tarball);
	installAndTypecheck(
		"npm --ignore-scripts",
		() => {
			run("npm", ["install", "--ignore-scripts", "--no-fund", "--no-audit"], { cwd: npmIgnoreDir });
		},
		npmIgnoreDir,
	);

	const npmScriptsDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-npm-scripts-"));
	createConsumerProject(npmScriptsDir, tarball);
	installAndTypecheck(
		"npm",
		() => {
			run("npm", ["install", "--no-fund", "--no-audit"], { cwd: npmScriptsDir });
		},
		npmScriptsDir,
	);

	if (which("bun")) {
		const bunIgnoreDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-bun-ignore-scripts-"));
		createConsumerProject(bunIgnoreDir, tarball);
		installAndTypecheck(
			"bun --ignore-scripts",
			() => {
				run("bun", ["install", "--ignore-scripts"], { cwd: bunIgnoreDir });
			},
			bunIgnoreDir,
		);

		const bunDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-bun-"));
		createConsumerProject(bunDir, tarball);
		installAndTypecheck(
			"bun",
			() => {
				run("bun", ["install"], { cwd: bunDir });
			},
			bunDir,
		);
	} else {
		process.stdout.write("[bun] skipped (bun not on PATH)\n");
	}

	fs.unlinkSync(tarball);
	process.stdout.write("\npackage tarball verification passed\n");
}

main();
