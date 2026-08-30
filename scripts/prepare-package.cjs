"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

function isInstalledAsDependency() {
	const cwd = path.resolve(process.cwd());
	const parts = cwd.split(path.sep);
	if (parts.includes("node_modules")) {
		return true;
	}

	// npm/bun set INIT_CWD to the directory where install was invoked.
	// When this package is a git/github dependency, that is the consumer root,
	// not this package — never compile from a consumer install.
	if (process.env.INIT_CWD) {
		const initCwd = path.resolve(process.env.INIT_CWD);
		if (initCwd !== cwd) {
			return true;
		}
	}

	return false;
}

if (isInstalledAsDependency()) {
	process.stdout.write("[@3xjn/prism] skip prepare: installed as a dependency (compiled out/lib is shipped)\n");
	process.exit(0);
}

const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build:package"], {
	stdio: "inherit",
	shell: false,
});

if (result.error) {
	process.stderr.write(`[@3xjn/prism] prepare failed: ${result.error.message}\n`);
	process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
