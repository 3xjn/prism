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
		const err = new Error(`${command} ${args.join(" ")} failed (${result.status}):\n${detail}`);
		err.result = result;
		throw err;
	}
	return result;
}

function which(command) {
	const result = spawnSync(command, ["--version"], { encoding: "utf8" });
	return result.status === 0;
}

function assertExists(filePath, label) {
	if (!fs.existsSync(filePath)) {
		throw new Error(`missing ${label}: ${filePath}`);
	}
}

function read(filePath) {
	return fs.readFileSync(filePath, "utf8");
}

function writeJson(filePath, value) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, "\t")}\n`);
}

function writeText(filePath, value) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, value);
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

export const exports = {
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
				declarations.push(read(full));
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

function installAndTypecheck(label, installer, consumerDir) {
	process.stdout.write(`\n[${label}] install\n`);
	installer();
	const prismRoot = path.join(consumerDir, "node_modules", "@3xjn", "prism");
	assertShippedPackage(prismRoot);

	if (path.resolve(prismRoot).split(path.sep).includes("node_modules") === false) {
		throw new Error("expected installed package to live under node_modules");
	}

	process.stdout.write(`[${label}] rbxtsc\n`);
	const compile = run("npx", ["--no-install", "rbxtsc", "--type", "game"], {
		cwd: consumerDir,
	});
	process.stdout.write(compile.stdout);
	if (compile.stderr) {
		process.stdout.write(compile.stderr);
	}

	const compiled = path.join(consumerDir, "out", "main.luau");
	const compiledLua = path.join(consumerDir, "out", "main.lua");
	if (!fs.existsSync(compiled) && !fs.existsSync(compiledLua)) {
		throw new Error(`[${label}] rbxtsc did not emit consumer out/main.luau`);
	}
	process.stdout.write(`[${label}] ok\n`);
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

function testPrepareSkip() {
	const fakeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "prism-prepare-skip-"));
	const fakePackage = path.join(fakeRoot, "node_modules", "@3xjn", "prism");
	fs.mkdirSync(fakePackage, { recursive: true });
	const result = spawnSync(process.execPath, [path.join(repoRoot, "scripts", "prepare-package.cjs")], {
		cwd: fakePackage,
		encoding: "utf8",
		env: { ...process.env, INIT_CWD: fakeRoot },
	});
	if (result.status !== 0) {
		throw new Error(`prepare skip failed:\n${result.stdout}\n${result.stderr}`);
	}
	if (!`${result.stdout}${result.stderr}`.includes("skip prepare")) {
		throw new Error(`prepare skip did not print skip message:\n${result.stdout}\n${result.stderr}`);
	}
	process.stdout.write("[prepare skip] ok\n");
}

function main() {
	testPrepareSkip();

	assertShippedPackage(repoRoot);
	const tarball = npmPack();
	process.stdout.write(`packed ${tarball}\n`);

	const npmIgnoreDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-npm-ignore-scripts-"));
	createConsumerProject(npmIgnoreDir, tarball);
	installAndTypecheck(
		"npm --ignore-scripts",
		() => {
			run("npm", ["install", "--ignore-scripts", "--no-fund", "--no-audit"], {
				cwd: npmIgnoreDir,
			});
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
	process.stdout.write("\nconsumer install verification passed\n");
}

main();
