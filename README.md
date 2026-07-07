# Prism

A Roblox TypeScript UI kit for `rbxts-react` — typed components, theme tokens, Roblox-native sizing. Early and private (`0.0.0`, not on npm).

## Components

| | |
| --- | --- |
| Layout | `Box`, `Stack`, `Divider`, `Card`, `ScrollArea` |
| Text and media | `Text`, `Icon`, `Image`, `Avatar` |
| Inputs and forms | `Button`, `Pressable`, `Input`, `KeybindInput`, `Checkbox`, `Switch`, `StepperInput`, `Slider` |
| Feedback | `Progress`, `CircularProgress`, `Backdrop` |
| Navigation | `SegmentedControl`, `Tabs`, `Menu`, `Select` |
| Overlays | `WorldPortal`, `Popover`, `Modal`, `Tooltip` |
| Utility | `Draggable` |

Also: `@prism/theme` (ThemeProvider, tokens), `@prism/motion` (motion hooks), `@prism/utils` (unit helpers), `bridge` (`mountPrism` — Luau interop).

## Setup

Needs Node, Rojo, and Roblox Studio.

```bash
npm install
npm run build
rojo serve
```

## Usage

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

Text goes through `text` / `label` props — JSX text children aren't type-supported on `forwardRef` components in this toolchain.

Controlled inputs are plain React state:

```tsx
const [query, setQuery] = React.useState("");

<Input value={query} onChange={setQuery} placeholder="Search" variant="outline" fullWidth />
```

## Tokens and units

Intent props take strings (`color="success"`); concrete color props take `theme.*` refs or raw `Color3` values. Dotted strings like `"text.secondary"` are not accepted.

```tsx
<Button color="success" variant="filled" label="Publish" />
<Text color={theme.text.secondary} text="Autosaved just now" />
<Stack bg={Color3.fromRGB(20, 20, 20)} radius="lg" p="md" />
```

Sizing is Roblox-native — numbers are pixel offsets, percentage strings are scale, `UDim`/`UDim2` pass through:

```tsx
<Stack width={280} />
<Stack width="50%" />
<Stack width={new UDim(0, 280)} />
```

Size tokens (`"xs"` … `"xl"`) cover spacing, radius, and text size. Invalid tokens throw in dev.

## Slot props

Escape hatch for instance properties the component API doesn't cover. Applied last.

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

## Motion

`useMotion` animates numbers, `Color3` values, and theme refs with the same tokens Prism uses internally:

```tsx
const animated = useMotion({
	values: {
		scale: hovered ? 1.04 : 1,
		bg: hovered ? theme.primary.light : theme.background.surface,
	},
	transition: { duration: "fast", easing: "out" },
});
```

Components own their internal motion — overriding the same property via `slotProps` can fight a managed animation.

## Playground

ui-labs stories live in `src/playground/stories`. `index.storybook.ts` is the storybook config; `index.ts` imports each `*.story` module so roblox-ts emits them. Add `*.story.tsx` files there for new components.

## Non-goals

npm publishing, Wally, polymorphic `as` props, app shell patterns, timeline/keyframe animation. No license or contribution guide yet.
