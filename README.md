# Prism

Prism is an early Roblox TypeScript UI kit for `rbxts-react`. It gives Roblox React developers typed components, strict theme tokens, Roblox-native sizing, and escape hatches for raw instances when a component API is too narrow.

It exists for teams building reusable UI inside Roblox experiences and Studio-driven workflows. If Mantine or MUI feels familiar, Prism should feel approachable, while still being honest about Roblox constraints such as instances, portals, sizing, input, and Rojo output.

Status: Prism is foundation-first and currently a private, local workspace. The package is marked `private` at version `0.0.0`; it is not published to npm and this README does not describe public package install support.

## Who this is for

- Roblox TypeScript and React developers evaluating or contributing to Prism locally
- UI authors who need theme tokens, typed props, slot escape hatches, and ui-labs stories
- Studio-focused workflows that build with roblox-ts, sync with Rojo, and inspect components in Roblox

## Start Here

1. [Quick Start](#quick-start) with local prerequisites, dependencies, build output, and Rojo.
2. [Use a component](#use-a-component) from the current `@prism` surface.
3. [Check the playground](#playground) in Studio with Rojo when you need visual feedback.

## What is here

Prism currently includes theme tokens, motion helpers, unit helpers, public components from `@prism`, ui-labs stories under `src/playground/stories`, and Rojo wiring that separates library output from playground output. The component set covers layout, text, media, forms, feedback, navigation, overlays, and a small Luau bridge layer.

## Component and API inventory

This inventory is generated from the current export list in `src/lib/index.ts`. It includes 30 public component exports from `@prism` and keeps the small bridge export separate.

<!-- component-inventory:start -->
| Purpose | Components |
| --- | --- |
| Layout | `Box`, `Stack`, `Divider`, `Card`, `ScrollArea` |
| Text and media | `Text`, `Icon`, `Image`, `Avatar` |
| Inputs and forms | `Button`, `Pressable`, `Input`, `KeybindInput`, `Checkbox`, `Switch`, `StepperInput`, `Slider` |
| Feedback | `Progress`, `CircularProgress`, `Backdrop`, `Tag` |
| Navigation | `SegmentedControl`, `Tabs`, `Menu`, `Select` |
| Overlays | `WorldPortal`, `Popover`, `Modal`, `Tooltip` |
| Utility and advanced | `Draggable` |
<!-- component-inventory:end -->

Supporting surfaces:

- `@prism/theme` maps to `src/lib/theme` for `ThemeProvider`, token definitions, and theme resolution helpers.
- `@prism/motion` maps to `src/lib/motion` for token-aware motion hooks and animation helpers.
- `@prism/utils` maps to `src/lib/utils` for Roblox unit helpers and shared value conversion.
- `src/lib/bridge` is re-exported from the top-level `@prism` source as `bridge`. Its public bridge surface is `mountPrism` plus Luau mount types from `src/lib/bridge/index.ts`. Treat it as an early, advanced Luau interop layer, not a replacement for normal React usage in TypeScript.

## Quick Start

Prism is a local workspace, so start from a checkout of this repository rather than a public package install.

Prerequisites:

- Node.js and npm
- Rojo CLI
- Roblox Studio
- This repository checked out locally

Install workspace dependencies:

```bash
npm install
```

Build the roblox-ts output:

```bash
npm run build
```

That runs `rbxtsc` and writes compiled output to `out/`.

Serve the Rojo project from the repository root:

```bash
rojo serve default.project.json
```

In Roblox Studio, open a local place or a new empty place, then connect to the Rojo server. This repository does not include a bundled place file, so the README should not point you to one.

## Use a component

Start with composition. Prism components are Roblox instances wrapped in typed React props, so a small panel can combine layout, text, dividers, and actions without raw `Frame` setup.

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

A small quirk of the current `@rbxts/react` setup: examples pass text through props like `text`, `children`, or `label`. Direct JSX text children on `forwardRef` components are not type-supported in this toolchain.

## Controlled input

Controlled fields follow normal React state. `Input` receives the current value and reports edits through `onChange`, while nearby Prism text can render derived state.

```tsx
import React from "@rbxts/react";
import { Input, Stack, Text } from "@prism";
import { theme } from "@prism/theme";

export function SearchBox() {
	const [query, setQuery] = React.useState("");
	const status = query.size() > 0 ? `Searching for ${query}` : "Type to search";

	return (
		<Stack width={320} gap="sm">
			<Input
				value={query}
				onChange={setQuery}
				placeholder="Search commands, settings, or players"
				variant="outline"
				fullWidth
			/>
			<Text size="sm" color={theme.text.secondary} text={status} />
		</Stack>
	);
}
```

Use this shape when game state owns the value. Use `defaultValue` only when the input can manage its first value internally.

## Tokens and units

Prism keeps styling strict on purpose. Component-level intent props use small strings, while concrete color props use theme refs or raw Roblox values. `Button color="success"` means "render this button with the success intent". `theme.text.secondary`, `theme.background.surface`, and `theme.border.subtle` are concrete color refs that resolve through the active `ThemeProvider`.

```tsx
<Button color="success" variant="filled" label="Publish" />
<Text color={theme.text.secondary} text="Autosaved just now" />
<Stack bg={theme.background.surface} radius="lg" p="md" />
<Stack bg={Color3.fromRGB(20, 20, 20)} radius="lg" p="md" />
```

Do not pass dotted token strings such as `"text.secondary"` or `"palette.primary.5"` to concrete color props. Use `theme.*` refs instead so the public API has one concrete token shape with autocomplete.

Sizing stays Roblox-native. Numbers become pixel offsets, percentage strings become scale values, and `UDim` or `UDim2` values pass through when you need the exact Roblox shape.

```tsx
<Stack width={280} />
<Stack width="50%" />
<Stack width={new UDim(0, 280)} />
```

Theme size tokens such as `"xs"`, `"sm"`, `"md"`, `"lg"`, and `"xl"` are for spacing, radius, text size, and similar theme scales. Invalid tokens should fail loudly during development instead of silently picking a fallback.

## Slot props

Most components expose `slotProps` for the Roblox instances they own. Prism applies slot props last, so they are the narrow escape hatch for instance properties that the public component API does not cover.

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

Prefer normal Prism props first because they stay theme-aware. Reach for `slotProps` when you need a specific Roblox property, like `LayoutOrder` on the root `TextButton` or `Thickness` on a component-owned `UIStroke`.

## Motion

`useMotion` is for custom components that need the same token-aware motion Prism components use internally. It accepts numbers, `Color3` values, and theme color refs, then returns animated numbers or resolved `Color3` values.

```tsx
import React from "@rbxts/react";
import { useMotion } from "@prism/motion";
import { theme } from "@prism/theme";

export function HoverTile() {
	const [hovered, setHovered] = React.useState(false);
	const animated = useMotion({
		values: {
			scale: hovered ? 1.04 : 1,
			bg: hovered ? theme.primary.light : theme.background.surface,
		},
		transition: { duration: "fast", easing: "out" },
	});

	return (
		<frame
			BackgroundColor3={animated.bg}
			BorderSizePixel={0}
			Size={UDim2.fromOffset(140, 44)}
			Event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
			}}
		>
			<uiscale Scale={animated.scale} />
		</frame>
	);
}
```

Prism components own their internal motion. `slotProps` can still override raw properties, but writing over the same property can bypass a component-managed animation.

## Playground

Use the playground when you want to inspect Prism components through ui-labs stories in Studio.

```bash
npm run build
rojo serve default.project.json
```

Open a local place or a new empty place in Studio, then connect it to the Rojo server. The Rojo project maps the compiled library to `ReplicatedStorage.Prism` from `out/lib` and maps the compiled playground to `StarterPlayer.StarterPlayerScripts.Playground` from `out/playground`. This repository does not include a bundled place file.

The ui-labs story setup is file based:

- `src/playground/stories/index.storybook.ts` exports the storybook config with `storyRoots` pointed at the stories folder.
- `src/playground/stories/index.ts` imports each `*.story` module so roblox-ts emits the stories for ui-labs to find.

The playground surface is story-based. Add or update `*.story.tsx` modules under `src/playground/stories` when a component needs Studio-facing examples.

## Roadmap

Prism is foundation-first.

Done or underway:

- project scaffolding for roblox-ts, rbxts-react, Rojo, and ui-labs
- strict theme tokens and resolvers
- motion and unit helpers
- reusable components with ui-labs stories

Non-goals for the current workspace:

- npm publishing
- Wally support
- public package install instructions
- public contribution process or support channel promises
- API stability or production readiness guarantees
- polymorphic `as` props
- big app shell patterns
- timeline, keyframe, or stagger animation systems

## Policy status

This repository does not specify a license file or contribution guide yet. The README therefore avoids naming a license, claiming a public contribution process, or promising public package support.
