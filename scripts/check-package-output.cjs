"use strict";

const { spawnSync } = require("child_process");

const status = spawnSync("git", ["status", "--porcelain", "--", "out/lib"], {
	encoding: "utf8",
});

if (status.status !== 0) {
	process.stderr.write(status.stderr || "git status failed\n");
	process.exit(status.status === null ? 1 : status.status);
}

const dirty = status.stdout.trim();
if (dirty) {
	process.stderr.write("Committed out/lib is stale. Run `npm run build:package` and commit the result.\n\n");
	process.stderr.write(`${dirty}\n`);
	spawnSync("git", ["diff", "--", "out/lib"], { stdio: "inherit" });
	process.exit(1);
}

process.stdout.write("out/lib matches the package build\n");
