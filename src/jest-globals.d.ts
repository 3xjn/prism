import type * as JestGlobals from "@rbxts/jest-globals";

declare global {
	const afterAll: typeof JestGlobals.afterAll;
	const afterEach: typeof JestGlobals.afterEach;
	const beforeAll: typeof JestGlobals.beforeAll;
	const beforeEach: typeof JestGlobals.beforeEach;
	const describe: typeof JestGlobals.describe;
	const expect: typeof JestGlobals.expect;
	const it: typeof JestGlobals.it;
	const test: typeof JestGlobals.test;
}

export {};
