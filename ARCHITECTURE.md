# Prism architecture

This document describes the rules for Prism's foundation layer. It is intentionally stricter than a loose style guide because the token system and primitive API will shape every later component.

Prism is still in early foundation work. Some of the foundation layer is shipped in this repo today, and the rest of the document explains the rules that current and future components follow.

## Tokens

Prism uses strict token discipline.

### Core rules

1. Tokens are closed enums. If a value is outside the token unions, it must use a typed escape hatch.
2. Concrete color props prefer exported theme refs such as `theme.text.primary`, `theme.background.surface`, and `theme.border.subtle`.
3. Size-style tokens use named scale keys such as `"xs"`, `"sm"`, `"md"`, `"lg"`, and `"xl"`.
4. Component intent props use intent strings such as `"primary"`, `"success"`, and `"warning"`; concrete color props do not accept intent strings.
5. Escape hatches are explicit. Use raw `Color3`, `UDim`, `UDim2`, or `number` values when tokens are not enough.
6. There is no magic-string fallthrough. Invalid tokens should throw in development and warn in production.
7. The theme is immutable after mount. If part of the tree needs a different theme, nest a child `ThemeProvider` instead of mutating the existing theme object.

### Why Prism is strict here

Loose token systems feel easy at first, then drift fast. Closed token unions keep autocomplete useful, make mistakes obvious, and stop random string values from becoming permanent API baggage.

### Dev mode

"Throw in development and warn in production" is decided by `isDevMode()` in `@prism/utils`:

- Dev mode defaults to `RunService:IsStudio()`, so Studio sessions (including the ui-labs playground) fail loudly on invalid tokens.
- Setting `_G.__DEV__` to a boolean before Prism first loads overrides the default in either direction.
- In production (live servers), token failures warn to the console and resolve to a safe fallback so a bad prop degrades one component instead of unmounting the tree.

Component code reaches this behavior through the safe resolver wrappers in `components/_shared/useResolvedStyleProps.ts` (`resolveColorSafe`, `resolveThemeSizeSafe`, `resolveUDimSafe`). Do not call the raw throwing `resolveColor`/`resolveSize` from component render paths.

### Planned token shape

The foundation plan locks in these token families:

- semantic color roles for intent, text, background, border, and action states
- explicit palette color scales under `palette.gray`, `palette.primary`, `palette.red`, `palette.green`, `palette.yellow`, and `palette.blue`
- spacing scale keys
- radius scale keys
- font size scale keys
- line height scale keys
- shadows
- motion duration tokens in seconds plus a small easing token set
- a single theme font family, with `Enum.Font.BuilderSans` as the planned default

### Color token tiers

- Theme refs are the primary API for concrete colors: `theme.text.secondary`, `theme.background.default`, `theme.background.surface`, `theme.border.default`, `theme.action.hover`
- Intent strings are the component-semantic API: `"primary"`, `"secondary"`, `"success"`, `"warning"`, `"error"`, `"info"`
- Explicit palette refs are the low-level API: `theme.palette.primary["5"]`, `theme.palette.gray["9"]`, `theme.palette.blue["4"]`
- Dotted strings such as `"primary.main"`, `"palette.primary.5"`, and legacy shade tokens such as `"primary.5"` are resolver internals only, not public component prop API

## Slots

Slots are Prism's way to expose controlled customization without opening every component to ad hoc structure changes.

### Slot rules

1. Every component declares its slots in a `Slots` interface.
2. Shipped slots match the raw Roblox instances each component owns: every component exposes at least `root`, plus its decorator and layout instances where relevant.
3. New slots are added intentionally, component by component.
4. Slot override order is fixed: defaults, then direct Prism props, then raw `slotProps`, with `slotProps` spread last as the final escape hatch.

### Current slot intent

Every shipped component declares its `Slots` interface in its `types.ts`, mapping slot names to the raw Roblox instances the component owns. Representative examples:

- `BoxSlots` is `{ root: Frame, corner: UICorner, stroke: UIStroke, padding: UIPadding, gradient: UIGradient, aspectRatio: UIAspectRatioConstraint, sizeConstraint: UISizeConstraint }`
- `TextSlots` is `{ root: TextLabel, padding: UIPadding, sizeConstraint: UISizeConstraint, textSizeConstraint: UITextSizeConstraint }`
- `DividerSlots` is `{ root: Frame }`
- `ButtonSlots` is `{ root: TextButton, corner: UICorner, stroke: UIStroke, padding: UIPadding, scale: UIScale, sizeConstraint: UISizeConstraint }`

These are raw Roblox instance escape hatches. They exist so consumers can reach backing instances like decorators, list layouts, and text constraints without Prism inventing a separate prop for every host property.

Because `slotProps` spreads last, a component must not re-assert host properties after the spread. If a component needs to force a host property (for example `Pressable` blanking its backing `TextButton` text), the forced value belongs in the pre-spread instance props so a consumer override still wins.

## Units

Prism uses simple, predictable sizing rules that match Roblox datatypes.

### Unit rules

1. A `number` means pixel offset.
2. A string ending in `%` means scale.
3. A `UDim` or `UDim2` passes through unchanged.
4. Theme scale props use the `ThemeSize` union, `"xs" | "sm" | "md" | "lg" | "xl"`.
5. There is no silent coercion. Prism should not guess what a value means.

### Examples

- `width={200}` means 200 pixels
- `width="50%"` means 0.5 scale
- `radius="md"` means the theme's `md` radius token
- `position={new UDim2(...)}` stays exactly as provided

### Edge cases the plan already defines

- negative numbers are allowed where the receiving prop can support them
- percentages may exceed 100%
- mixed scale and offset values are not inferred from strings, use raw `UDim` or `UDim2` instead
- `0` is valid and should not be treated as missing input

## Responsive layout

Prism keeps responsive structure explicit and mobile-first.

### Breakpoint rules

1. `Theme.breakpoints` is the closed `xs | sm | md | lg | xl` scale, with MUI-compatible defaults of `0`, `600`, `900`, `1200`, and `1536` pixels.
2. Breakpoints describe available width, not device identity. Input adaptation uses Roblox `PreferredInput` separately.
3. Responsive values require an `xs` value and inherit from the nearest defined smaller breakpoint.
4. A supplied `GuiBase2d` target is measured through `AbsoluteSize`; otherwise hooks observe the current camera viewport and reconnect when Roblox replaces the camera.
5. Responsive objects are not accepted by every Prism prop. Callers resolve values through hooks and pass ordinary typed props to components.
6. Native `StyleQuery` remains the right lower-level tool for stylesheet and parent-size container conditions; Prism's hooks cover React structural decisions.

This keeps the responsive module deep: one small interface resolves layout, application state, and composition choices without widening every component type or duplicating subscriptions across component implementations.

## Native selection

Prism's first controller-navigation layer is native-first and deliberately small.

### Selection rules

1. Interactive controls mirror Roblox's `Selectable`, `SelectionOrder`, and four `NextSelection*` properties through typed camel-case props.
2. Layout primitives expose `SelectionGroup` and the four `SelectionBehavior*` axes independently from controls.
3. Managed selection props land on the component's real interactive instance: the button root, input textbox, keybind trigger, or slider hitbox. Disabled controls resolve managed `Selectable` to `false`.
4. Raw `slotProps` remain last-write-wins, including for selection properties. This is the same explicit low-level escape policy used throughout Prism.
5. Explicit neighbors should be held in callback state. Updating `ref.current` alone does not schedule a render, so a neighbor read during the first render would otherwise remain `undefined`.
6. Prism does not require a `SelectionScope`, provider, custom graph solver, or global `GuiService` configuration.
7. Roblox owns navigation and the focus visual in this slice. A styled `SelectionImageObject`, overlay entry/restoration, and topmost back dismissal are separate follow-up layers.

This boundary keeps selection composable: ordinary controls expose the native graph where precision is needed, while `Box`, `Stack`, and `ScrollArea` can define native group boundaries without becoming stateful navigation coordinators.

## Notifications

Notifications are provider-local screen feedback, not a global imperative service.

### Notification rules

1. Every `NotificationsProvider` lazily owns one queue store. Nested or sibling providers remain independent even when their generated notification IDs match.
2. The public context exposes only stable `show`, `update`, `dismiss`, and `clear` actions. Snapshots, timers, pause/resume, close completion, and dismissal reasons stay internal.
3. Public placement is a closed six-value screen-position union. The default is `top-right`; `zIndex` coordinates the stack with other app layers without exposing the stack itself.
4. `duration: false` means persistent. On partial updates, omitted presentation values are preserved while `icon: false` and `action: false` are explicit clear sentinels for Luau callers.
5. Notification actions dismiss with a user reason after `onPress` by default. `closeOnPress: false` keeps the record open for repeatable actions.
6. The stack portals through the shared screen overlay layer and stays at most 360 pixels wide while shrinking naturally in narrower hosts.
7. The nearest host `ScreenGui.ScreenInsets` defines device and Core UI safe bounds. Prism adds theme edge spacing inside those bounds and never creates a competing `ScreenGui` or guesses raw inset values.
8. Motion observes `GuiService.ReducedMotionEnabled`. Entry and exit animate only group transparency and scale; native list layout owns reflow, so width, height, and absolute position are never animated.

Keeping the changing snapshot in a private context prevents action-only consumers from rerendering for every queue mutation. The rendered stack remains an implementation detail mounted by the provider rather than a required public composition step.

## Composition

Prism favors a small set of composition rules over highly dynamic polymorphism.

### Component pattern

- every public component uses `forwardRef`
- every public component sets `displayName`
- decorator children such as `UICorner`, `UIStroke`, `UIPadding`, and other `UI*` helpers render before user children
- raw `slotProps` are spread last, so overlapping values are last-write-wins by design

### Shared component plumbing

Recurring mechanics live in `components/_shared` and new components must use them instead of re-implementing:

- `usePressInteraction` owns the hover/press state machine (`"idle" | "hovered" | "pressed" | "disabled"`) and returns the root `Event` handlers; compose extras with `composeEventMaps`
- `useControllableState` owns controlled/uncontrolled value plumbing for `value`/`defaultValue`/`onChange`-shaped props
- `frameSize.ts` derives `Size`/`AutomaticSize` and minimum-height constraints from resolved style props
- `useResolvedStyleProps` resolves shared style props and is the sole gateway to token resolution failures
- `elevation.tsx` renders drop shadows from `theme.shadows` tokens (`sm` for cards, `md` for dropdown/popover panels, `lg` for modals); when no explicit size is passed it measures its parent's `AbsoluteSize` instead of scale-sizing, because scale-sized shadow children can lock an `AutomaticSize` parent into an inflated layout fixed point
- `foundationDecorators`, `layering`/`TriggerOverlayLayer`, `OutsidePressLayer`, `usePresence`, `useRootCursor`, `textFont`, and `visual` cover decorators, overlay portals, interaction-only outside dismissal, presence transitions, cursor claims, fonts, and color mixing

Components whose semantics genuinely differ (for example per-item hover maps keyed by value in `Tabs` and `SegmentedControl`, or conditional `onChange` firing) may keep local logic, but the divergence should be deliberate, not copy-paste drift.

### Host requirements

Trigger overlays keep positioning, input capture, and visuals as separate adapters. `TriggerOverlayLayer` owns portal-relative placement for Select, Popover, and therefore Menu; `OutsidePressLayer` is their transparent, non-selectable mouse/touch catcher; `Backdrop` owns visible dimming and remains the right primitive for Modal. This separation is intentionally concrete rather than a mode-driven overlay runtime.

Prism's overlay stacking (`incrementZIndex` ladders in Select, Popover, Menu, Modal, Tooltip) assumes the hosting `ScreenGui` uses `ZIndexBehavior.Sibling`. Under `Global` behavior, inner content whose `ZIndex` is not explicitly laddered can render beneath ancestor surfaces (a `ScreenGui` created via `Instance.new` defaults to `Global` — set it to `Sibling`).

### rbxts-react rules that matter here

- host elements are lowercase intrinsics like `<frame>` and `<textlabel>`
- use `ref` for instance access
- use `Event` and `Change` for Roblox event and property bindings
- do not put `onClick` directly on a host instance
- do not use legacy Roact-only patterns

### Why there is no polymorphism in v1

Prism does not ship an `as`, `component`, or general polymorphic host prop in v1. `Frame` and `TextLabel` do not behave the same way in Roblox, and forcing one generic abstraction too early would make the foundation harder to reason about.

The first step is simpler: `Box` owns `Frame`, `Text` owns `TextLabel`, and both share resolver logic where that reuse is actually proven.

## Motion

Prism now ships a small motion foundation, but it stays deliberately narrow.

### Motion rules

1. `Theme.motion.duration` stores seconds, not milliseconds, because Roblox animation APIs are second-based.
2. `Theme.motion.duration` is a closed token set: `instant`, `fast`, `normal`, and `slow`.
3. `Theme.motion.easing` is a small semantic token set that maps to Roblox easing enums.
4. `useMotion({ values, transition })` is for custom component construction only; it accepts target values in and returns animated values out.
5. v1 motion inputs are limited to `number` plus concrete color values: raw `Color3`, exported theme refs, and intent strings. Returned animated values stay concrete as `number` or `Color3`.
6. Prism components keep ownership of their own internals. Future component-level motion belongs in component props and state-style systems, not in external `useMotion` injections.
7. Raw `slotProps` remain last-write-wins escape hatches, so they can still bypass component-managed motion if they overlap with the same Roblox properties.

### Why Prism is strict here

Motion gets messy fast when multiple layers think they own the same property. Keeping `useMotion` focused on custom components lets Prism add internal component motion later without creating conflicting sources of truth.

## Roadmap

Prism is following a foundation-first roadmap.

### Current stage

Shipped today in this repo:

- scaffolding for roblox-ts, rbxts-react, Rojo, and ui-labs
- a ui-labs story discovery setup driven by `src/playground/stories/index.storybook.ts`
- theme tokens, default theme values, strict theme types, `ThemeProvider`, `useTheme`, `resolveColor`, and `resolveSize` under `@prism/theme`
- theme motion tokens plus `useMotion` under `@prism/motion`
- unit conversion helpers and `isDevMode` under `@prism/utils`
- the Lucide icon atlas under `@prism/icons`
- shared component plumbing under `components/_shared` (interaction hooks, style resolution, decorators, overlay layering, presence, cursor claims)
- roughly thirty components from the top-level `@prism` entrypoint: layout primitives (`Box`, `Text`, `Stack`, `Divider`, `Card`, `ScrollArea`), interaction primitives (`Pressable`, `Button`, `Draggable`), form controls (`Checkbox`, `Switch`, `Input`, `Select`, `Slider`, `StepperInput`, `SegmentedControl`, `KeybindInput`, `Tabs`), overlays (`Modal`, `Menu`, `Popover`, `Tooltip`, `Backdrop`), display (`Avatar`, `Icon`, `Image`, `Progress`, `CircularProgress`), and world integration (`WorldPortal`)
- provider-local screen notifications with six placements, queueing, actions, persistent durations, reduced-motion handling, and host-owned safe bounds
- a Luau interop bridge (`mountPrism` under `@prism`'s `bridge`) that renders a plain data tree of Prism components for non-TypeScript callers
- playground stories for the public component surface under `src/playground/stories`
- compile-time prop contracts via per-component `__typecheck__.tsx` files, plus a Node-based assertion runner (`npm test`) for units, Progress/Slider ranges, responsive and selection mapping, and the notification store/API

The current ui-labs integration is file-discovery based. `index.storybook.ts` exports the `Storybook` config and points `storyRoots` at the stories folder, while `src/playground/stories/index.ts` imports each story module so they are emitted and discoverable. Prism does not mount a separate PlayerGui playground app at runtime.

### Known debts and follow-ups

Deliberate next steps, roughly in priority order:

- extract a shared intent-surface color resolver so per-component `styles.ts` files stop hand-tuning the same `mixColor` hover/pressed blends
- split the outsized files: `KeybindInput.tsx` (~1,100 lines), `Draggable.tsx` (~1,000 lines), and `LuauBridge.tsx` (~1,100 lines, with heavy internal duplication across its per-prop validators)
- converge `Tabs` and `SegmentedControl` per-item hover tracking with the shared interaction hook where their keyed-map semantics allow
- add runtime coverage for the theme resolvers, `mergeTheme`, motion interpolation, and the bridge; the notification state machine and public API adapter now have pure runtime coverage
- migrate the per-state duration literals in component motion transitions (e.g. `0.06`/`0.14` in Checkbox, Button, Tabs styles) to `theme.motion.duration` tokens; easing already flows through tokens, durations mostly do not (Draggable now reads both from the theme)
- styled gamepad focus (`SelectionImageObject`) so controller selection matches the design language instead of the stock Roblox box
- optional: swap `elevation.tsx` internals for a 9-slice shadow image (`assets/drop-shadow-128.png`, uploaded as `rbxassetid://110725881404654`). The current 10-ring gaussian stack is visually smooth; the image route needs a punched-out center (a child ImageLabel draws over its parent surface) and measured pixel sizing everywhere (an ImageLabel larger than an AutomaticSize surface inflates it — rotation does not exempt it), so it only pays off if stroke rendering ever becomes a bottleneck

### Non-goals for this phase

The foundation plan explicitly avoids these for now:

- polymorphic components
- npm publishing work
- Wally support
- timeline, keyframe, and stagger animation systems
- i18n and RTL work
- broad slot surfaces added before they are needed
- theme mutation after provider creation

That restraint is part of the architecture. Prism should stay small, prove the rules with the shipped primitives, and only then grow outward.
