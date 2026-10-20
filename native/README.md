# Prism for Luau

Prism's native package exports the real components for normal React-Luau composition. Use component values, keyed children, hooks, refs, bindings, and callbacks. No string component names or bridge node format are involved.

## Install

Build the native package from a source checkout:

```sh
npm ci
npm run build:native
rojo build dist/native/default.project.json -o dist/Prism.rbxm
```

Insert `Prism.rbxm` in your project, or map `dist/native/src` into your Rojo project as `ReplicatedStorage.Prism`. The whole directory must travel together. The consumer needs no npm or TypeScript build. `dist/native` also contains a Wally manifest and can be packaged with `wally package` from that directory; this build does not publish it to a registry.

The package includes the exact React/ReactRoblox dependency graph from Prism's lockfile. Its public `React` and `ReactRoblox` child modules resolve to the runtime used inside the components. Use these imports throughout a native Prism tree. A separately installed React or renderer may use a different dispatcher/context; do not mix runtime copies. Applications that already own a React dependency graph should continue using the npm/roblox-ts integration until a compatible external-runtime package target is available.

## Compose

```luau
local Package = game:GetService("ReplicatedStorage").Prism
local React = require(Package.React)
local ReactRoblox = require(Package.ReactRoblox)
local Prism = require(Package)
local e = React.createElement

local function Preferences()
    local enabled, setEnabled = React.useState(false)

    return e(Prism.Stack, { width = "100%", gap = "sm" }, {
        Heading = e(Prism.Text, { text = "Preferences", size = "lg" }),
        Notifications = e(Prism.Switch, {
            label = "Notifications",
            checked = enabled,
            onChange = setEnabled,
        }),
    })
end

local root = ReactRoblox.createRoot(host)
root:render(e(Prism.ThemeProvider, { density = "compact" }, {
    Content = e(Preferences),
}))

-- Release the tree when its owner closes:
root:unmount()
```

`host` is an application-owned GUI container. React owns its mounted descendants. For portal components such as Window and Modal, use a ScreenGui with `ZIndexBehavior.Sibling`. Native Roblox host elements use Roblox class names (`"Frame"`, `"TextButton"`) and native React event keys; Prism component props use the same `onPress`, `onChange`, `Event`, `Change`, `styleOverrides`, and `slotProps` as their TypeScript counterparts.

All public Prism components are available, including Window, Tabs, Avatar, and the form controls. The same component implementations supply the same defaults, sizing, interaction, and motion. The old mountPrism API remains a legacy npm export; native applications should use direct composition.

## Types

The build emits public `export type` definitions from the TypeScript contracts. They cover component props, slot names, theme overrides, style overrides, and callback signatures. No generated type file needs to be edited by hand.

```luau
local props: Prism.ButtonProps = {
    label = "Save",
    disabled = false,
    onPress = function()
        print("Saved")
    end,
}
local button = e(Prism.Button, props)
```

Explicit prop annotations catch invalid values even when the underlying React createElement signature does not check a particular component's props. Raw instance slot values are deliberately dynamic `any` maps: these are engine property/binding escape hatches, with checked slot names. Event maps retain the owning instance type and allow variable engine event arguments. Luau cannot express every TypeScript mapped/conditional type: useMotion returns a dictionary of number/Color3 values, and styled accepts a partial preset dictionary while retaining the component's prop type. These are type-surface differences, not alternate runtime behaviors.

Use `Prism.useMotion` inside a Luau React component. Motion durations and easing still come from ThemeProvider. For immediate updates, override the theme's `motion.duration` values to zero; there is no second renderer or animation mode.

## Development checks

```sh
npm run verify:native
```

The verifier rebuilds the package, checks component/type coverage and runtime dependency identity/layout, compiles its Luau files using Lune, and analyzes the generated API and a handwritten consumer with luau-lsp. Negative fixtures check that invalid props, callbacks, and slot values are rejected. It also builds the Rojo model and Wally archive. The first check run downloads Roblox type definitions from a pinned luau-lsp commit; later runs reuse the cached file in `dist`.

`native/examples/Preferences.luau` is a handwritten consumer fixture with a controlled input, state updates, keyed children, style overrides, a styled preset, and cleanup. Real GUI behavior still needs to be exercised in an isolated Studio place; package checks alone do not establish rendered appearance or engine interaction behavior.
