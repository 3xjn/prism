--!strict
-- Generated public types come from Prism's TypeScript component contracts.
local React = require(script.React)
local TS = require(script._runtime.RuntimeLib)

export type Node = React.Node
export type Ref<T> = React.Ref<T>
export type Binding<T> = React.Binding<T>

-- Low-level Roblox property overrides are a dynamic escape hatch. Slot names and
-- normal component props remain typed without expanding every engine property.
export type RawInstanceProps = { [string]: any }
export type InstanceEventMap<T> = { [string]: (T, ...any) -> () }

-- @generated-types

export type MotionInputValue = number | Color3 | ThemeColorRef<ColorToken>
export type MotionTransition = {
	duration: (number | "instant" | "fast" | "normal" | "slow")?,
	easing: ("linear" | "standard" | "out" | "in" | "inOut" | ThemeMotionEasing)?,
}
export type MotionOptions = {
	values: { [string]: MotionInputValue },
	transition: (MotionTransition | { [string]: MotionTransition })?,
}

export type Prism = {
	-- @generated-fields
	useMotion: (MotionOptions) -> { [string]: number | Color3 },
	styled: <P>(React.AbstractComponent<P, Instance>) -> ({ [string]: any }) -> React.AbstractComponent<P, Instance>,
}

-- TS.import initializes the compiler helper on every compiled module before require.
-- This adapter returns the components themselves; it does not render or translate props.
return (TS.import(script, script._lib) :: any) :: Prism
