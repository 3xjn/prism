# Prism

<img width="96" height="96" src="assets/prism-icon.png" alt="Prism">

Prism is a Roblox TypeScript UI kit for [`@rbxts/react`](https://github.com/roblox-ts/react). It is not published to npm yet (`0.0.0`).

Visual tokens and language are in [DESIGN.md](DESIGN.md).

## Components

| Family               | Components                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Layout**           | `Box`, `Stack`, `Divider`, `Card`, `ScrollArea`                                                |
| **Text and media**   | `Text`, `Icon`, `Image`, `Avatar`                                                              |
| **Inputs and forms** | `Button`, `Pressable`, `Input`, `KeybindInput`, `Checkbox`, `Switch`, `StepperInput`, `Slider` |
| **Feedback**         | `Progress`, `CircularProgress`, `Backdrop`                                                     |
| **Navigation**       | `SegmentedControl`, `Tabs`, `Menu`, `Select`                                                   |
| **Overlays**         | `WorldPortal`, `Popover`, `Modal`, `Tooltip`                                                   |
| **Utility**          | `Draggable`                                                                                    |

Also: `@prism/theme` (providers and tokens), `@prism/motion`, `@prism/utils`, and `bridge` (`mountPrism`) for Luau.

## Quick start

You need [Node.js](https://nodejs.org/), [Rojo](https://rojo.space/), and Roblox Studio.

```sh
npm install
npm run build
rojo serve
```

Wrap UI in `ThemeProvider`:

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

Copy goes through `text` and `label`. JSX text children are not typed on these `forwardRef` components.

## API notes

Intent props take strings such as `color="success"`. Concrete color props take `theme.*` refs or raw `Color3`. Dotted strings like `"text.secondary"` are not accepted.

```tsx
<Button color="success" variant="filled" label="Publish" />
<Text color={theme.text.secondary} text="Autosaved just now" />
<Stack bg={Color3.fromRGB(20, 20, 20)} radius="lg" p="md" />
```

Numbers are pixel offsets, `"50%"` is scale, and `UDim` / `UDim2` pass through.

```tsx
<Stack width={280} />
<Stack width="50%" />
<Stack width={new UDim(0, 280)} />
```

`slotProps` are last-write-wins for host instance properties the component API does not cover. Don't override a property the component is already animating.

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

## Playground

[ui-labs](https://ui-labs.luau.page/) stories live in `src/playground/stories`.

## Scripts

```sh
npm run typecheck
npm run lint
npm test
npm run build
```
