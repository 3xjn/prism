# Prism

A Roblox TypeScript UI kit for `rbxts-react` — typed components, theme tokens, Roblox-native sizing. Early and private (`0.0.0`, not on npm).

## Components

|                  |                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Layout           | `Box`, `Stack`, `Divider`, `Card`, `ScrollArea`                                                               |
| Text and media   | `Text`, `Icon`, `Image`, `Avatar`                                                                             |
| Inputs and forms | `Button`, `Pressable`, `Input`, `KeybindInput`, `ColorPicker`, `Checkbox`, `Switch`, `StepperInput`, `Slider` |
| Feedback         | `Progress`, `CircularProgress`, `Backdrop`, `NotificationsProvider`                                           |
| Navigation       | `SegmentedControl`, `Tabs`, `Menu`, `Select`                                                                  |
| Overlays         | `WorldPortal`, `Popover`, `Modal`, `Tooltip`                                                                  |
| Collections      | `VirtualList`, `VirtualGrid`                                                                                  |
| Utility          | `Draggable`                                                                                                   |

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

<Input value={query} onChange={setQuery} placeholder="Search" variant="outline" fullWidth />;
```

## Overlay behavior

`Select`, `Popover`, and `Menu` share trigger-relative portal anchoring and dismiss on a mouse or touch press outside their panel by default. Set `closeOnOutsidePress={false}` when the surrounding surface should remain interactive without closing them. Their invisible, interaction-only input catcher is separate from `Backdrop`, which remains the visual dimming surface used by components such as `Modal`.

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

## Responsive layout

Prism uses MUI-style mobile-first breakpoints. The defaults are `xs: 0`, `sm: 600`, `md: 900`, `lg: 1200`, and `xl: 1536`; override any threshold through `ThemeProvider`.

Custom thresholds must stay in ascending `xs` → `xl` order so each tier remains reachable.

```tsx
<ThemeProvider theme={{ breakpoints: { sm: 560, lg: 1100 } }}>
	<App />
</ThemeProvider>
```

`useResponsiveValue` inherits from the nearest smaller defined breakpoint, and requires `xs` so every viewport resolves a value:

```tsx
const columns = useResponsiveValue({ xs: 2, sm: 4, md: 6, xl: 10 });
const direction = useResponsiveValue({ xs: "vertical", md: "horizontal" });
```

By default the hooks observe `Workspace.CurrentCamera.ViewportSize`. For embedded panels, world UI, or ui-labs stories, pass the actual GUI host so breakpoints follow its `AbsoluteSize` instead:

```tsx
const columns = useResponsiveValue({ xs: 2, md: 6 }, { target: panel });
```

Use `usePreferredInput()` separately when presentation should respond to Roblox's current touch, gamepad, or keyboard/mouse preference. Breakpoints describe available space, not device identity.

The first responsive release is hook-driven; ordinary component props do not accept responsive objects. Roblox `StyleQuery` remains available for stylesheet and native container-query use cases.

## Virtual collections

`VirtualList` and `VirtualGrid` keep mounted GUI instances proportional to the viewport instead of the dataset. Both require fixed geometry and stable consumer keys, expose visible half-open ranges, and keep the normal `ref` for the root `ScrollingFrame` separate from the imperative `apiRef` used for index/key jumps.

```tsx
const listApi = React.useRef<VirtualListApi<string>>();

<VirtualList
	items={missions}
	itemHeight={48}
	gap="sm"
	getKey={(mission) => mission.id}
	renderItem={({ item }) => <Button label={item.name} fullWidth />}
	height={320}
	apiRef={listApi}
/>;

listApi.current?.scrollToKey("harbor-defense", "center");
```

`VirtualGrid` accepts exactly one lane strategy: `columns={4}` for an explicit count, or `minimumCellWidth={128}` with optional `maxColumns` for a viewport-derived count. `rowGap` and `columnGap` can differ. Variable-size items, masonry, and true instance recycling remain outside this fixed-geometry API.

## Controller selection

Prism exposes Roblox's native selection surface instead of requiring a `SelectionScope`, provider, or custom navigation graph. Interactive controls accept `selectable`, `selectionOrder`, and the four `nextSelection*` neighbors. `Box`, `Stack`, and `ScrollArea` independently expose `selectionGroup` and the four `selectionBehavior*` boundary rules.

When one control needs another control's backing instance as a neighbor, keep that instance in callback state:

```tsx
const [primary, setPrimary] = React.useState<TextButton>();
const [secondary, setSecondary] = React.useState<TextButton>();

<Button ref={setPrimary} label="Primary" nextSelectionRight={secondary} />
<Button ref={setSecondary} label="Secondary" nextSelectionLeft={primary} />
```

Assigning only to `ref.current` does not trigger a React render. Callback state does, so the neighboring control receives the native instance after mount. Disabled controls resolve to `Selectable={false}`; as elsewhere in Prism, a raw `slotProps` override remains the final escape hatch.

Ordinary directional navigation and focus visuals still belong to Roblox. When a gamepad opens a Prism-owned Select, Menu, Modal, or eligible Popover, Prism briefly manages `GuiService.SelectedObject` only for that overlay session: it enters through the preferred/native eligible target, uses native selection-group boundaries, repairs an invalid owned target, and restores the opening target on close. If selection moves outside the overlay, Prism releases ownership and does not pull it back. There is no `SelectionScope`, global coordinator, custom graph solver, or replacement `SelectionImageObject`.

## Color picking

`ColorPicker` is an inline, controlled or uncontrolled HSV editor with mouse/touch drag surfaces and precise hex/RGB entry. Because it is inline, it can live in a settings panel directly or inside an app-owned `Popover`.

```tsx
const [accent, setAccent] = React.useState(Color3.fromRGB(59, 130, 246));

<ColorPicker value={accent} onChange={setAccent} size="md" fullWidth />;
```

It supports the shared `xs` through `xl` size scale, disabled styling, native selection properties, typed slots, and visual style overrides. Use `onChangeEnd` when persistence or undo history should commit once after a drag, controller step, or precise text edit.

## Notifications

Mount `NotificationsProvider` around the part of the tree that owns screen feedback, then call `useNotifications()` from descendants. Each provider owns an independent queue; Prism does not expose a process-wide singleton.

```tsx
function SaveLoadoutButton() {
	const notifications = useNotifications();

	return (
		<Button
			label="Save loadout"
			onPress={() =>
				notifications.show({
					title: "Loadout saved",
					message: "Recon kit is ready for the next round.",
					color: "success",
					icon: "check-circle",
				})
			}
		/>
	);
}

<NotificationsProvider position="top-right" defaultDuration={5} maxVisible={3}>
	<SaveLoadoutButton />
</NotificationsProvider>;
```

`position` accepts `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, and `bottom-right`; `zIndex` is available when the stack needs to coordinate with an app's other screen layers. Stacks portal to the host `LayerCollector` by default; use `portal={false}` for an intentionally contained preview or embedded surface. Notification actions dismiss their notification after `onPress` by default. Set `closeOnPress: false` when an action should leave it open.

Use `duration: false` for a persistent notification. In updates, `icon: false` and `action: false` explicitly clear those values; omission preserves the current value because Luau cannot distinguish an omitted table key from `nil`.

The stack observes Roblox's native `GuiService.ReducedMotionEnabled` preference. Safe bounds come from the nearest host `ScreenGui.ScreenInsets`, and Prism adds theme spacing inside those bounds; configure inset policy on the host instead of manually applying the same safe area twice.

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
