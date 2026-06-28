# Prism

Prism is a Roblox UI kit for `rbxts-react`.

It is still early, but the shape is already clear: small React components, strict theme tokens, Roblox-native sizing, and escape hatches when you need the raw instance underneath.

If you like Mantine or MUI, Prism should feel familiar. If you have shipped Roblox UI before, it should still feel honest about Roblox constraints.

## What is here

Prism currently includes:

- theme tokens, defaults, `ThemeProvider`, `useTheme`, `resolveColor`, and `resolveSize`
- motion tokens plus `useMotion` for custom animated components
- unit helpers: `toUDim`, `toUDim2`, and `toUDimAxis`
- public components exported from `@prism`
- ui-labs stories for the component set under `src/playground/stories`
- Rojo wiring that separates library output from playground output

The component set includes layout, text, media, forms, feedback, navigation, overlays, and a small Luau bridge layer. This is not an npm package yet. Treat the repo as a local development workspace.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

That runs `rbxtsc` and writes compiled output to `out/`.

## Use a component

```tsx
import React from "@rbxts/react";
import { Button, Divider, Stack, Text } from "@prism";
import { ThemeProvider } from "@prism/theme";

export function Example() {
	return (
		<ThemeProvider>
			<Stack width={280} bg="primary.main" radius="md" p="md" gap="sm">
				<Text size="lg" color="text.inverse" children="Server controls" />
				<Divider color="border.subtle" />
				<Button variant="light" color="secondary" label="Save changes" />
			</Stack>
		</ThemeProvider>
	);
}
```

A small quirk of the current `@rbxts/react` setup: examples pass text through props like `children`, `text`, or `label`. Direct JSX text children on `forwardRef` components are not type-supported in this toolchain.

## Controlled input

```tsx
import React from "@rbxts/react";
import { Input, Stack, Text } from "@prism";

export function SearchBox() {
	const [query, setQuery] = React.useState("");

	return (
		<Stack width={320} gap="sm">
			<Input
				value={query}
				onChange={setQuery}
				placeholder="Search commands, settings, or players"
				variant="outline"
				fullWidth
			/>
			<Text size="sm" color="text.secondary" text={query.size() > 0 ? `Searching for ${query}` : "Type to search"} />
		</Stack>
	);
}
```

## Tokens and units

Prism keeps styling strict on purpose.

Use semantic color tokens for normal UI:

```tsx
<Button color="success" variant="filled" label="Publish" />
<Text color="text.secondary" text="Autosaved just now" />
<Stack bg="background.surface" radius="lg" p="md" />
```

Raw Roblox values are still allowed where they make sense:

```tsx
<Stack width={280} />        // 280 px
<Stack width="50%" />       // 0.5 scale
<Stack width={new UDim(0, 280)} />
```

A few rules make the API predictable:

- numbers are pixel offsets
- percentage strings are scale values
- `UDim` and `UDim2` pass through unchanged
- theme sizes use `"xs"`, `"sm"`, `"md"`, `"lg"`, or `"xl"`
- invalid tokens should fail loudly during development

## Slot props

Most components expose `slotProps` for the Roblox instances they own. Prism applies slot props last, so they are the escape hatch when the component API is too narrow.

```tsx
<Button
	label="Danger"
	color="error"
	slotProps={{
		root: { LayoutOrder: 10 },
		stroke: { Thickness: 2 },
	}}
/>
```

Prefer normal Prism props first. Reach for `slotProps` when you need a specific Roblox property.

## Motion

`useMotion` is for building custom components on top of Prism tokens.

```tsx
import React from "@rbxts/react";
import { useMotion } from "@prism/motion";

export function MotionExample() {
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
```

Prism components own their internal motion. `slotProps` can still override raw properties, but that also means you can bypass component-managed animation if you write over the same property.

## Playground

The fastest loop is still Studio plus Rojo.

```bash
npm run build
rojo serve default.project.json
```

Open the place file in Studio and connect to the Rojo server.

The ui-labs setup is discovery based:

- `src/playground/stories/index.storybook.ts` exports the storybook config
- `src/playground/stories/index.ts` imports each story so it is emitted
- `src/playground/main.client.ts` stays intentionally quiet

## Project layout

```text
.
├─ src/
│  ├─ lib/
│  │  ├─ components/
│  │  ├─ motion/
│  │  ├─ theme/
│  │  ├─ utils/
│  │  └─ index.ts
│  └─ playground/
│     ├─ main.client.ts
│     └─ stories/
├─ out/
├─ default.project.json
├─ package.json
└─ tsconfig.json
```

`src/lib/index.ts` is the public `@prism` surface. Theme helpers stay under `@prism/theme`; motion helpers stay under `@prism/motion`; unit helpers stay under `@prism/utils`.

## Scripts

```bash
npm run typecheck   # TypeScript only
npm run lint        # ESLint over src
npm run build       # roblox-ts compile
npm run format      # Prettier check
```

## Roadmap

Prism is foundation-first.

Done or underway:

- project scaffolding for roblox-ts, rbxts-react, Rojo, and ui-labs
- strict theme tokens and resolvers
- motion and unit helpers
- reusable components with ui-labs stories

Not the focus yet:

- npm publishing
- Wally support
- polymorphic `as` props
- big app shell patterns
- timeline, keyframe, or stagger animation systems

For the design rules behind those choices, read [`ARCHITECTURE.md`](./ARCHITECTURE.md).
