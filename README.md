# Prism

Prism is an in-progress UI library for rbxts-react on Roblox. The goal is a clean component workflow that feels familiar if you like Mantine or MUI, while still matching Roblox rules around instances, sizing, and composition.

## Status

Prism is in foundation alpha.

What is present in this repo today:

- project scaffolding for roblox-ts, rbxts-react, Rojo, and ui-labs
- a Rojo layout that maps the library and playground output
- a ui-labs discovery setup for Studio work
- shipped theme tokens, default theme values, and typed token definitions
- shipped `ThemeProvider`, `useTheme`, `resolveColor`, and `resolveSize` exports under `@prism/theme`
- shipped theme motion tokens plus `useMotion` under `@prism/motion` for custom smooth components
- shipped unit helpers `toUDim`, `toUDim2`, and `toUDimAxis` under `@prism/utils`
- shipped components from `@prism`, including layout primitives, text and media primitives, form controls, feedback components, navigation controls, and overlays
- shipped ui-labs stories for the public component set under `src/playground/stories`

What is not shipped yet:

- app-level patterns and application shells built from the component set

## Install and setup

This repo is meant for local development right now. It is not set up for npm publishing yet.

### 1. Install dependencies

```bash
npm install
```

### 2. Confirm the TypeScript setup

`tsconfig.json` is already wired for rbxts-react with these important pieces:

- `jsx: "react"`
- `jsxFactory: "React.createElement"`
- `jsxFragmentFactory: "React.Fragment"`
- `baseUrl: "src"`
- path alias `@prism/* -> src/lib/*`

### 3. Confirm the Rojo mapping

`default.project.json` currently maps compiled output like this:

- `ReplicatedStorage.Prism -> out/lib`
- `StarterPlayer.StarterPlayerScripts.Playground -> out/playground`
- `ReplicatedStorage.rbxts_include.node_modules.@rbxts -> node_modules/@rbxts`

That layout keeps library code and playground code separate while still making both available in Studio.

### 4. Note the current peer and toolchain packages

The scaffold already includes:

- `@rbxts/react`
- `@rbxts/react-roblox`
- `@rbxts/ui-labs`
- `roblox-ts`

There is also extra typing support in `devDependencies` because this toolchain expects a few Roblox packages to be present during compilation.

## Quick start

The current public surface is split across the top-level component exports plus the theme, motion, and utility modules. Components such as `Box`, `Text`, `Stack`, `Button`, `Input`, `Select`, `Modal`, `Tooltip`, and `Draggable` come from `@prism`, theme tokens and resolvers stay under `@prism/theme`, and custom animated values come from `@prism/motion`.

```tsx
import React from "@rbxts/react";
import { Box, Button, Divider, Stack, Text } from "@prism";
import { ThemeProvider } from "@prism/theme";

export function Example() {
	return (
		<ThemeProvider>
			<Stack width={280} bg="primary.main" radius="md" p="md" gap="sm">
				<Text size="lg" color="text.inverse" children="Hello from Prism" />
				<Divider color="border.subtle" />
				<Box height={24} bg="background.surface" radius="sm" />
				<Button variant="light" color="secondary" children="Save" />
			</Stack>
		</ThemeProvider>
	);
}
```

In this repo's current `@rbxts/react` toolchain, examples pass primitive text through the `children` prop for `Text` and `Button` because direct JSX text children on `forwardRef` components are not type-supported.

Use semantic tokens like `primary.main`, `text.primary`, `background.surface`, and `border.subtle` for normal UI work. Low-level shade access is still available through explicit palette tokens such as `palette.primary.5`, and legacy shade tokens like `primary.5` or `gray.9` continue to resolve as compatibility behavior.

The sizing rules behind that API are:

- numbers mean pixel offsets, so `width={280}` means 280 pixels
- percentage strings mean scale, so values like `"50%"` map to scale
- raw `UDim` and `UDim2` values stay as-is when you need a direct escape hatch

## Project structure

```text
.
├─ src/
│  ├─ lib/
│  │  └─ index.ts
│  └─ playground/
│     ├─ main.client.ts
│     └─ stories/
│        ├─ index.storybook.ts
│        └─ index.ts
├─ out/
│  ├─ lib/
│  └─ playground/
├─ default.project.json
├─ tsconfig.json
└─ package.json
```

Right now `src/lib` contains shipped `theme/`, `utils/`, `motion/`, `bridge/`, and `components/` modules. `src/lib/index.ts` re-exports the public component surface, including layout, form, feedback, navigation, overlay, and media components, while theme helpers stay under `@prism/theme`. The playable part of the repo is the ui-labs wiring under `src/playground`.

Each component also exposes raw `slotProps` for Roblox instance-level escape hatches. Those values are spread last onto the backing instances and decorators, so they are last-write-wins when they overlap with Prism props.

## Motion foundation

Prism now ships a small reusable motion layer for custom components.

- `Theme.motion.duration` uses seconds and defaults to `instant`, `fast`, `normal`, and `slow`
- `Theme.motion.easing` exposes a small semantic easing set mapped to Roblox easing enums
- `useMotion({ values, transition })` animates target values in and returns animated values out
- v1 accepts `number`, `Color3`, and Prism `ColorToken` inputs, while returning concrete renderable values
- duration can be a token like `"fast"` or a raw number like `0.2`

```tsx
import React from "@rbxts/react";
import { useMotion } from "@prism/motion";
import { ThemeProvider } from "@prism/theme";

function MotionExample() {
	const animated = useMotion({
		values: {
			scale: 1,
			bg: "primary.main",
		},
		transition: {
			scale: { duration: "fast", easing: "out" },
			bg: { duration: 0.24, easing: "standard" },
		},
	});

	return (
		<frame BackgroundColor3={animated.bg} Size={UDim2.fromOffset(140, 44)}>
			<uiscale Scale={animated.scale} />
		</frame>
	);
}

export function Example() {
	return (
		<ThemeProvider>
			<MotionExample />
		</ThemeProvider>
	);
}
```

`useMotion` is intentionally for building custom components. Existing and future Prism components keep ownership of their own motion behavior, and raw `slotProps` still remain last-write-wins escape hatches that can bypass component-managed values. v1 does not animate `UDim` or `UDim2`, but semantic color tokens like `"primary.main"` work directly and still resolve to concrete `Color3` outputs.

## Playground workflow

The preferred inner loop is Rojo serve plus Studio.

### Start the compiler

```bash
npm run build
```

### Start Rojo

```bash
rojo serve default.project.json
```

Then open the place file in Studio and connect to the running Rojo server. The repo also includes `playground.rbxlx` and `test.rbxlx`, which can help during local checks.

The playground integration is discovery-driven. `src/playground/stories/index.storybook.ts` exports the ui-labs `Storybook` object and points `storyRoots` at the stories folder, then `src/playground/stories/index.ts` imports each component story so those modules are included in the compiled output. `src/playground/main.client.ts` stays intentionally inert in this setup because discovery happens through the `*.storybook.ts` file, not through a separately mounted runtime storybook app.

## Current foundation approach

Prism is being built from the bottom up.

- first, the scaffold and playground loop
- next, shipped tokens, theme context, token resolvers, and unit helpers
- then shipped reusable primitives such as `Box`, `Text`, `Stack`, `Button`, `Pressable`, and `Draggable`
- then added focused component families such as form controls, overlays, navigation controls, feedback, and media primitives
- after that, one higher-level pattern plan at a time

That keeps the early architecture small enough to test in Studio before more components depend on it.

## Architecture and roadmap

Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the rules that shape the library, especially token discipline, slot conventions, motion ownership, unit handling, composition rules, and the roadmap.
