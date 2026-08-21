import { defineConfig, defineProject } from "@isentinel/jest-roblox";

export default defineConfig({
	placeFile: ".jest-roblox/place.rbxl",
	rojoProject: "default.project.json",
	// Stock roblox-ts does not emit the source maps jest-roblox needs.
	sourceMap: false,
	test: {
		projects: [
			defineProject({
				test: {
					displayName: { name: "prism", color: "cyan" },
					include: ["src/lib/**/*.spec.ts", "src/lib/**/*.spec.tsx"],
					outDir: "out/lib",
				},
			}),
		],
	},
});
