--!strict
local React = require(script.Parent.node_modules["@rbxts-js"].React)

export type Node = React.Node
export type ReactElement<P = { [string]: unknown }, T = any> = React.ReactElement<P, T>
export type ComponentType<P> = React.ComponentType<P>
export type AbstractComponent<P, T> = React.AbstractComponent<P, T>
export type Ref<T> = React.Ref<T>
export type RefObject<T> = React.RefObject<T>
export type Binding<T> = React.Binding<T>
export type Context<T> = React.Context<T>
export type FC<P> = React.FC<P>
export type ComponentClass<P> = React.ComponentClass<P>
export type PureComponent<P, S = nil> = React.PureComponent<P, S>
export type ElementType = React.ElementType
export type Element<C> = React.Element<C>
export type ElementProps<C> = React.ElementProps<C>
export type ElementConfig<C> = React.ElementConfig<C>
export type ElementRef<C> = React.ElementRef<C>
export type Key = React.Key
export type ReactChild = React.ReactChild
export type ReactNode = React.ReactNode
export type BindingUpdater<T> = React.BindingUpdater<T>
export type LazyComponent<T, P> = React.LazyComponent<T, P>
export type StatelessFunctionalComponent<P> = React.StatelessFunctionalComponent<P>

return React
