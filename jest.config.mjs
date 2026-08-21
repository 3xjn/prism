import { defineConfig, defineProject } from "@isentinel/jest-roblox";

export default defineConfig({
	placeFile: ".jest-roblox/place.rbxl",
	rojoProject: "default.project.json",
	// Stock roblox-ts does not emit the source maps jest-roblox needs.
	sourceMap: false,
	test: {
		// Default in @rbxts/jest. Specs must not TS.import @rbxts/jest-globals:
		// Open Cloud Jest loadstring-isolates each spec (fresh RuntimeLib) while
		// sharing _G, which trips "Invalid module access!".
		injectGlobals: true,
		setupFilesAfterEnv: ["./include/jest-setup.lua"],
		projects: [
			defineProject({
				test: {
					displayName: { name: "prism", color: "cyan" },
					include: ["src/lib/**/*.spec.ts", "src/lib/**/*.spec.tsx"],
					injectGlobals: true,
					setupFilesAfterEnv: ["./include/jest-setup.lua"],
					outDir: "out/lib",
				},
			}),
		],
	},
});
