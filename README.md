<p align="center">
  <img width="150" height="150" src="assets/prism-icon.png" alt="Prism logo">
</p>

<h1 align="center">Prism</h1>

Prism is a Roblox TypeScript UI kit for [`@rbxts/react`](https://github.com/roblox-ts/react). Components share a token theme and Roblox-native sizing (`UDim`, offsets, and scale).

Not published to npm yet (`0.0.0`). The package name is `@3xjn/prism` (private). Tokens and visual language are in [DESIGN.md](DESIGN.md).

## Use in another rbxts project

```json
{
	"dependencies": {
		"@3xjn/prism": "github:3xjn/prism"
	}
}
```

```json
{
	"dependencies": {
		"@3xjn/prism": "file:../prism"
	}
}
```

```ts
import { Button, ThemeProvider, DEFAULT_DARK_THEME } from "@3xjn/prism";
```

roblox-ts 3 resolves non-`@rbxts` scopes the same way as `@flamework` / `@rbxutil`. Both of these consumer lines are required:

```json
"typeRoots": ["node_modules/@rbxts", "node_modules/@3xjn"]
```

```json
"node_modules": {
	"$className": "Folder",
	"@rbxts": {
		"$path": "node_modules/@rbxts"
	},
	"@3xjn": {
		"$path": "node_modules/@3xjn"
	}
}
```

`main` / `types` follow the usual library layout (`out/lib/init.luau` + `out/lib/index.d.ts`). `@prism` is an optional paths alias if you want the same imports this repo uses internally:

```json
{
	"compilerOptions": {
		"paths": {
			"@prism": ["./node_modules/@3xjn/prism/out/lib"],
			"@prism/*": ["./node_modules/@3xjn/prism/out/lib/*"]
		}
	}
}
```

The host must pass a parent `Instance` (PlayerGui, a ScreenGui, a plugin widget, and so on). Wrap the tree in `ThemeProvider`. Pass `density="compact"` for tighter control heights and padding, and `theme={DEFAULT_DARK_THEME}` for dark:

```tsx
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Button, ThemeProvider, DEFAULT_DARK_THEME } from "@3xjn/prism";

export function mount(parent: Instance) {
	const root = ReactRoblox.createRoot(parent);
	root.render(
		<ThemeProvider theme={DEFAULT_DARK_THEME} density="compact">
			<Button label="Save changes" />
		</ThemeProvider>,
	);
	return root;
}
```

`npm install` / `prepare` compiles `out/lib`, so a `file:` or `github:` consumer does not copy `src/` into their tree.

## Quick start

You need [Node.js](https://nodejs.org/), [Rojo](https://rojo.space/), and Roblox Studio.

```sh
npm install
npm run build
rojo serve
```

Wrap your tree in `ThemeProvider`:

```tsx
import React from "@rbxts/react";
import { Button, Divider, Stack, Text } from "@prism";
import { ThemeProvider, theme } from "@prism/theme";

export function ServerControls() {
	return (
		<ThemeProvider>
			<Stack width={280} bg={theme.primary.main} radius="md" p="md" gap="sm">
				<Text size="lg" color={theme.text.inverse} text="Server controls" />
				<Divider color={theme.border.subtle} />
				<Button variant="light" color="secondary" label="Save changes" />
			</Stack>
		</ThemeProvider>
	);
}
```

Pass `density="compact"` (or `theme={{ density: "compact" }}`) for tighter control heights and padding. Light and dark themes both honor it; default density stays as it is today.

## Components

| Family | Components |
| --- | --- |
| Layout | `Box`, `Stack`, `Divider`, `Card`, `ScrollArea` |
| Text and media | `Text`, `Icon`, `Image`, `Avatar` |
| Inputs and forms | `Button`, `Pressable`, `Input`, `KeybindInput`, `Checkbox`, `Switch`, `StepperInput`, `Slider` |
| Feedback | `Progress`, `CircularProgress`, `Backdrop` |
| Navigation | `SegmentedControl`, `Tabs`, `Menu`, `Select` |
| Overlays | `WorldPortal`, `Popover`, `Modal`, `Tooltip`, `Window` |
| Utility | `Draggable` |

`@prism/theme` is providers and tokens, `@prism/motion` is motion hooks, `@prism/utils` is unit helpers, and `mountPrism` is the Luau bridge.

## Notes

Copy goes through `text` and `label`. JSX text children are not typed on these `forwardRef` components.

Intent props take strings (`color="success"`). Concrete color props take `theme.*` refs or raw `Color3` — not dotted strings like `"text.secondary"`.

Numbers are pixel offsets, `"50%"` is scale, and `UDim` / `UDim2` pass through. Size tokens `"xs"` through `"xl"` cover spacing, radius, and text size.

`slotProps` are last-write-wins escapes for instance properties the component API does not cover. Do not override a property the component is already animating.

```tsx
<Button
	label="Danger"
	color="error"
	variant="outline"
	slotProps={{
		root: { LayoutOrder: 10 },
		stroke: { Thickness: 2 },
	}}
/>
```

`useMotion` animates numbers, `Color3` values, and theme refs:

```tsx
const animated = useMotion({
	values: {
		scale: hovered ? 1.04 : 1,
		bg: hovered ? theme.primary.light : theme.background.surface,
	},
	transition: { duration: "fast", easing: "out" },
});
```

## Playground

Stories live in `src/playground/stories` ([ui-labs](https://ui-labs.luau.page/)).

## Scripts

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Tests

`npm test` compiles with `rbxtsc` and runs `@rbxts/jest` **inside a Roblox DataModel** via [`@isentinel/jest-roblox`](https://github.com/christopher-buss/jest-roblox-cli). It is not Vitest and not a Node `vm` fake DataModel.

The CLI needs [Rojo](https://rojo.space/) on `PATH` (this repo pins it in `rokit.toml`) and **Node.js 24.12+**. GitHub Actions ubuntu has no Studio GUI, so CI uses Roblox Open Cloud Luau execution. Locally, `jest-roblox` uses a connected Studio plugin when present, otherwise Open Cloud.

Set these when using Open Cloud (`JEST_`-prefixed names override the same unprefixed values):

| Variable | Purpose |
| --- | --- |
| `ROBLOX_OPEN_CLOUD_API_KEY` | Open Cloud API key |
| `ROBLOX_UNIVERSE_ID` | Universe that receives the test place |
| `ROBLOX_PLACE_ID` | Place to publish and execute |

The key needs `universe-places:write` and `universe.place.luau-execution-session:write`. If those values are missing locally, `npm test` fails with that requirement instead of falling back to Node. GitHub Actions skips the Test step until `ROBLOX_OPEN_CLOUD_API_KEY` is set as a repository secret; typecheck, lint, and build still run.

`__typecheck__.tsx` files stay compile-time contracts. They are not the runtime runner.

`Window` overlay tests mount a `ScreenGui` with `ZIndexBehavior.Sibling`, the same host requirement as Modal.
