# Prism architecture

This document describes the rules for Prism's foundation layer. It is intentionally stricter than a loose style guide because the token system and primitive API will shape every later component.

Prism is still in early foundation work. Some of the foundation layer is shipped in this repo today, and the rest of the document explains the rules that current and future components follow.

## Tokens

Prism uses strict token discipline.

### Core rules

1. Tokens are closed enums. If a value is outside the token unions, it must use a typed escape hatch.
2. Color tokens prefer semantic roles such as `"primary.main"`, `"text.primary"`, `"background.surface"`, and `"border.subtle"`.
3. Size-style tokens use named scale keys such as `"xs"`, `"sm"`, `"md"`, `"lg"`, and `"xl"`.
4. Escape hatches are explicit. Use raw `Color3`, `UDim`, `UDim2`, or `number` values when token strings are not enough.
5. There is no magic-string fallthrough. Invalid tokens should throw in development and warn in production.
6. The theme is immutable after mount. If part of the tree needs a different theme, nest a child `ThemeProvider` instead of mutating the existing theme object.

### Why Prism is strict here

Loose token systems feel easy at first, then drift fast. Closed token unions keep autocomplete useful, make mistakes obvious, and stop random string values from becoming permanent API baggage.

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

- Semantic tokens are the primary API: `primary.main`, `secondary.dark`, `text.secondary`, `background.default`, `background.surface`, `border.default`, `action.hover`
- Explicit palette tokens are the low-level API: `palette.primary.5`, `palette.gray.9`, `palette.blue.4`
- Legacy shade tokens such as `primary.5` and `gray.9` still resolve for compatibility, but they are not the preferred public style

## Slots

Slots are Prism's way to expose controlled customization without opening every component to ad hoc structure changes.

### Slot rules

1. Every component declares its slots in a `Slots` interface.
2. Shipped slots match the raw Roblox instances each component owns. `Box`, `Text`, `Stack`, `Button`, and `Draggable` expose their root plus relevant decorator or layout slots, while `Divider` exposes `root`.
3. New slots are added intentionally, component by component.
4. Slot override order is fixed: defaults, then direct Prism props, then raw `slotProps`, with `slotProps` spread last as the final escape hatch.

### Current slot intent

- `BoxSlots` is `{ root: Frame, corner: UICorner, stroke: UIStroke, padding: UIPadding, gradient: UIGradient, aspectRatio: UIAspectRatioConstraint, sizeConstraint: UISizeConstraint }`
- `TextSlots` is `{ root: TextLabel, padding: UIPadding, sizeConstraint: UISizeConstraint, textSizeConstraint: UITextSizeConstraint }`
- `StackSlots` is `{ root: Frame, padding: UIPadding, sizeConstraint: UISizeConstraint, listLayout: UIListLayout }`
- `DividerSlots` is `{ root: Frame }`
- `ButtonSlots` is `{ root: TextButton, corner: UICorner, stroke: UIStroke, padding: UIPadding, scale: UIScale, sizeConstraint: UISizeConstraint }`
- `DraggableSlots` is `{ root: Frame, padding: UIPadding, sizeConstraint: UISizeConstraint, listLayout: UIListLayout, item: TextButton }`

These are raw Roblox instance escape hatches. They exist so consumers can reach backing instances like decorators, list layouts, and text constraints without Prism inventing a separate prop for every host property.

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

## Composition

Prism favors a small set of composition rules over highly dynamic polymorphism.

### Component pattern

- every public component uses `forwardRef`
- every public component sets `displayName`
- decorator children such as `UICorner`, `UIStroke`, `UIPadding`, and other `UI*` helpers render before user children
- raw `slotProps` are spread last, so overlapping values are last-write-wins by design

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
5. v1 motion inputs are limited to `number`, raw `Color3`, and Prism `ColorToken` strings, while returned animated values stay concrete as `number` or `Color3`.
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
- unit conversion helpers under `src/lib/utils`
- reusable primitives from the top-level `@prism` entrypoint, including `Box`, `Text`, `Stack`, `Button`, `Pressable`, and `Draggable`
- playground stories for the public primitive surface under `src/playground/stories`

The current ui-labs integration is file-discovery based. `index.storybook.ts` exports the `Storybook` config and points `storyRoots` at the stories folder, while `src/playground/stories/index.ts` imports each story module so they are emitted and discoverable. `src/playground/main.client.ts` is intentionally empty because this repo is not mounting a separate PlayerGui storybook app at runtime.

Planned within the current foundation plan:

- tighter refinement of the shipped primitives and story coverage as later plans require

Planned after the foundation plan, one follow-up plan at a time:

- more primitives and components as real needs appear

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
