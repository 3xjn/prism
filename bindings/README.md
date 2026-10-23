# Prism for Luau

Build Roblox interfaces with Prism and React-Luau. The Luau package includes all Prism components, Luau types, and the React modules you need to render them.

## Installation

Download the `prism-bindings` artifact from a successful [CI build](https://github.com/3xjn/prism/actions/workflows/ci.yml). It contains a Studio model and a source archive. Luau packages are not published to Wally yet.

### Roblox Studio

Insert `Prism.rbxm` into `ReplicatedStorage`. The resulting module should be named `Prism`.

### Rojo

Extract `prism-bindings.zip` into `vendor/prism`, then add Prism to your project's `ReplicatedStorage`:

```json
"ReplicatedStorage": {
	"$className": "ReplicatedStorage",
	"Prism": { "$path": "vendor/prism/src" }
}
```

Keep the entire `src` folder together. Your game does not need npm or a TypeScript compiler to use it.

To build the package yourself, follow the [contributor guide](https://github.com/3xjn/prism/blob/master/CONTRIBUTING.md#luau-bindings).

## Quick start

Create a LocalScript in `StarterPlayerScripts`:

```luau
local Players = game:GetService("Players")
local Package = game:GetService("ReplicatedStorage").Prism
local React = require(Package.React)
local ReactRoblox = require(Package.ReactRoblox)
local Prism = require(Package)
local e = React.createElement

local function Counter()
	local count, setCount = React.useState(0)

	return e(Prism.Stack, { width = 280, p = "md", gap = "sm" }, {
		Count = e(Prism.Text, {
			text = "Count: " .. count,
			size = "lg",
			layoutOrder = 1,
		}),
		Add = e(Prism.Button, {
			label = "Add one",
			layoutOrder = 2,
			onPress = function()
				setCount(count + 1)
			end,
		}),
	})
end

local screen = Instance.new("ScreenGui")
screen.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screen.Parent = Players.LocalPlayer:WaitForChild("PlayerGui")

local root = ReactRoblox.createRoot(screen)
root:render(e(Prism.ThemeProvider, {}, {
	Counter = e(Counter),
}))
```

When you remove the interface, call `root:unmount()` and `screen:Destroy()`.

Use `Package.React` and `Package.ReactRoblox` throughout this UI. They share the React runtime used by Prism. Mixing them with another React installation can break hooks and context. If your app already uses its own React installation, use the npm integration for now.

## Working with state

Pass the current value to a control and update it in its callback:

```luau
local function Notifications()
	local enabled, setEnabled = React.useState(false)

	return e(Prism.Switch, {
		label = "Notifications",
		checked = enabled,
		onChange = setEnabled,
	})
end
```

`Input` uses `value` and `onChange`. `Button` uses `onPress`. Components accept React children, refs, and bindings just like other React-Luau components.

## Themes

Choose a dark theme or compact spacing on the provider:

```luau
root:render(e(Prism.ThemeProvider, {
	theme = Prism.DEFAULT_DARK_THEME,
	density = "compact",
}, {
	Counter = e(Counter),
}))
```

Use semantic control colors such as `color = "success"`. For concrete colors, pass a theme token such as `Prism.theme.text.primary` or a `Color3` value.

## Layout and styling

`Stack` owns the spacing between children. Set `layoutOrder` on each child to control the order, `gap` for spacing, and `p` for padding.

Sizes accept pixels (`280`), percentages (`"100%"`), and `UDim` / `UDim2` values. Spacing, radius, and text sizes also accept tokens from `"xs"` to `"xl"`.

Use `slotProps` to set a Roblox property a component does not expose:

```luau
e(Prism.Button, {
	label = "Delete",
	color = "error",
	variant = "outline",
	slotProps = {
		root = { LayoutOrder = 10 },
		stroke = { Thickness = 2 },
	},
})
```

Slot properties override component defaults. Avoid overriding animated properties; use `styleOverrides` for state-dependent styles.

`Window` and `Modal` need a `ScreenGui` with `ZIndexBehavior.Sibling`, as used in the quick start.

## Types

Annotate prop tables to get field completion and catch invalid values:

```luau
local saveProps: Prism.ButtonProps = {
	label = "Save",
	disabled = false,
	onPress = function()
		print("Saved")
	end,
}

local saveButton = e(Prism.Button, saveProps)
```

Every component exports a corresponding props type. Theme overrides, style overrides, and callback signatures are typed too.

Slot names are checked, but the Roblox properties inside each slot are dynamic. `styled` presets also accept dynamic fields, and `useMotion` returns a dictionary of numbers and colors. Annotate component prop tables when you need stricter checks.

## More examples

See [Preferences.luau](https://github.com/3xjn/prism/blob/master/bindings/examples/Preferences.luau) for a form with inputs, conditional content, and custom button styles.
