--!strict
-- Public Luau declarations. Update alongside the TypeScript component contracts.
local React = require(script.Parent.React)
local Icons = require(script.Parent.icons)

type ColorTokens_1 =
	"primary.main"
	| "primary.light"
	| "primary.dark"
	| "primary.contrast"
	| "secondary.main"
	| "secondary.light"
	| "secondary.dark"
	| "secondary.contrast"
	| "error.main"
	| "error.light"
	| "error.dark"
	| "error.contrast"
	| "warning.main"
	| "warning.light"
	| "warning.dark"
	| "warning.contrast"
	| "info.main"
	| "info.light"
	| "info.dark"
	| "info.contrast"
	| "success.main"
	| "success.light"
	| "success.dark"
	| "success.contrast"
	| "text.disabled"
	| "text.primary"
	| "text.secondary"
	| "text.inverse"
	| "background.default"
	| "background.surface"
	| "background.raised"
	| "border.default"
	| "border.subtle"
	| "border.strong"
	| "action.disabled"
	| "action.hover"
	| "action.pressed"
	| "action.disabledBackground"
	| "palette.primary.0"
	| "palette.primary.1"
	| "palette.primary.2"
	| "palette.primary.3"
	| "palette.primary.4"
	| "palette.primary.5"
	| "palette.primary.6"
	| "palette.primary.7"
	| "palette.primary.8"
	| "palette.primary.9"
	| "palette.gray.0"
	| "palette.gray.1"
	| "palette.gray.2"
	| "palette.gray.3"
	| "palette.gray.4"
	| "palette.gray.5"
	| "palette.gray.6"
	| "palette.gray.7"
	| "palette.gray.8"
	| "palette.gray.9"
	| "palette.red.0"
	| "palette.red.1"
	| "palette.red.2"
	| "palette.red.3"
	| "palette.red.4"
	| "palette.red.5"
type ColorTokens_2 =
	"palette.red.6"
	| "palette.red.7"
	| "palette.red.8"
	| "palette.red.9"
	| "palette.green.0"
	| "palette.green.1"
	| "palette.green.2"
	| "palette.green.3"
	| "palette.green.4"
	| "palette.green.5"
	| "palette.green.6"
	| "palette.green.7"
	| "palette.green.8"
	| "palette.green.9"
	| "palette.yellow.0"
	| "palette.yellow.1"
	| "palette.yellow.2"
	| "palette.yellow.3"
	| "palette.yellow.4"
	| "palette.yellow.5"
	| "palette.yellow.6"
	| "palette.yellow.7"
	| "palette.yellow.8"
	| "palette.yellow.9"
	| "palette.blue.0"
	| "palette.blue.1"
	| "palette.blue.2"
	| "palette.blue.3"
	| "palette.blue.4"
	| "palette.blue.5"
	| "palette.blue.6"
	| "palette.blue.7"
	| "palette.blue.8"
	| "palette.blue.9"
	| "primary.0"
	| "primary.1"
	| "primary.2"
	| "primary.3"
	| "primary.4"
	| "primary.5"
	| "primary.6"
	| "primary.7"
	| "primary.8"
	| "primary.9"
	| "gray.0"
	| "gray.1"
	| "gray.2"
	| "gray.3"
	| "gray.4"
	| "gray.5"
	| "gray.6"
	| "gray.7"
	| "gray.8"
	| "gray.9"
	| "red.0"
	| "red.1"
	| "red.2"
	| "red.3"
	| "red.4"
	| "red.5"
	| "red.6"
	| "red.7"
	| "red.8"
	| "red.9"
type ColorTokens_3 =
	"green.0"
	| "green.1"
	| "green.2"
	| "green.3"
	| "green.4"
	| "green.5"
	| "green.6"
	| "green.7"
	| "green.8"
	| "green.9"
	| "yellow.0"
	| "yellow.1"
	| "yellow.2"
	| "yellow.3"
	| "yellow.4"
	| "yellow.5"
	| "yellow.6"
	| "yellow.7"
	| "yellow.8"
	| "yellow.9"
	| "blue.0"
	| "blue.1"
	| "blue.2"
	| "blue.3"
	| "blue.4"
	| "blue.5"
	| "blue.6"
	| "blue.7"
	| "blue.8"
	| "blue.9"
type ColorTokens = ColorTokens_1 | ColorTokens_2 | ColorTokens_3

export type Node = React.Node
export type Ref<T> = React.Ref<T>
export type Binding<T> = React.Binding<T>

-- Low-level Roblox property overrides are a dynamic escape hatch. Slot names and
-- normal component props remain typed without expanding every engine property.
export type RawInstanceProps = { [string]: any }
export type InstanceEventMap<T> = { [string]: (T, ...any) -> () }

export type BoxProps = {
	children: React.Node?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		corner: RawInstanceProps?,
		stroke: RawInstanceProps?,
		padding: RawInstanceProps?,
		gradient: RawInstanceProps?,
		aspectRatio: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	stroke: (nil | BoxStrokeProps)?,
	gradient: (nil | BoxGradientProps)?,
	aspectRatio: (nil | number)?,
	sizeConstraint: (nil | BoxSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type BoxGradientProps = {
	colors: ColorSequence,
	rotation: (nil | number)?,
	transparency: (nil | NumberSequence)?,
	offset: (nil | Vector2)?,
	enabled: (nil | boolean)?,
}

export type BoxSlotProps = {
	root: RawInstanceProps?,
	corner: RawInstanceProps?,
	stroke: RawInstanceProps?,
	padding: RawInstanceProps?,
	gradient: RawInstanceProps?,
	aspectRatio: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type BoxStrokeProps = {
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	thickness: (nil | number)?,
	transparency: (nil | number)?,
	mode: (nil | Enum.ApplyStrokeMode)?,
}

export type BoxStyleProps = {
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	stroke: (nil | BoxStrokeProps)?,
	gradient: (nil | BoxGradientProps)?,
	aspectRatio: (nil | number)?,
	sizeConstraint: (nil | BoxSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type TextProps = {
	text: (nil | string | number)?,
	children: React.Node?,
	Event: (InstanceEventMap<TextLabel> | nil)?,
	Change: (InstanceEventMap<TextLabel> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		textSizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<TextLabel>?,
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	weight: (nil | number)?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	font: (nil | Enum.Font)?,
	lineHeight: (nil | number)?,
	align: (nil | "center" | "left" | "right")?,
	valign: (nil | "top" | "middle" | "bottom")?,
	wrap: (nil | boolean)?,
	truncate: (nil | "none" | "atend" | "splitword")?,
	maxFontSize: (nil | number)?,
	minFontSize: (nil | number)?,
	sizeConstraint: (nil | BoxSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type TextSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	textSizeConstraint: RawInstanceProps?,
}

export type TextStyleProps = {
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	weight: (nil | number)?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	font: (nil | Enum.Font)?,
	lineHeight: (nil | number)?,
	align: (nil | "center" | "left" | "right")?,
	valign: (nil | "top" | "middle" | "bottom")?,
	wrap: (nil | boolean)?,
	truncate: (nil | "none" | "atend" | "splitword")?,
	maxFontSize: (nil | number)?,
	minFontSize: (nil | number)?,
	sizeConstraint: (nil | BoxSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type StackProps = {
	children: React.Node?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		listLayout: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	direction: (nil | "vertical" | "horizontal")?,
	gap: (nil | string | number | UDim)?,
	align: (nil | "center" | "start" | "end" | "stretch")?,
	justify: (nil | "center" | "start" | "end" | "fill" | "spaceAround" | "spaceBetween" | "spaceEvenly")?,
	wrap: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type StackSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	listLayout: RawInstanceProps?,
}

export type StackStyleProps = {
	direction: (nil | "vertical" | "horizontal")?,
	gap: (nil | string | number | UDim)?,
	align: (nil | "center" | "start" | "end" | "stretch")?,
	justify: (nil | "center" | "start" | "end" | "fill" | "spaceAround" | "spaceBetween" | "spaceEvenly")?,
	wrap: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type DividerProps = {
	children: React.Node?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | { root: RawInstanceProps? })?,
	ref: React.Ref<Frame>?,
	orientation: (nil | "vertical" | "horizontal")?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	cursor: string?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
}

export type DividerSlotProps = { root: RawInstanceProps? }

export type DividerStyleProps = {
	orientation: (nil | "vertical" | "horizontal")?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	cursor: string?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
}

export type ButtonProps = {
	label: (nil | string | number)?,
	children: React.Node?,
	onPress: (nil | (() -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		corner: RawInstanceProps?,
		stroke: RawInstanceProps?,
		padding: RawInstanceProps?,
		scale: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<TextButton>?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	styleOverrides: (nil | ButtonStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ButtonSlotProps = {
	root: RawInstanceProps?,
	corner: RawInstanceProps?,
	stroke: RawInstanceProps?,
	padding: RawInstanceProps?,
	scale: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type ButtonStyleProps = {
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	styleOverrides: (nil | ButtonStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type PressableProps = {
	children: React.Node?,
	render: (nil | ((state: PressableRenderState) -> React.Node))?,
	onPress: (nil | (() -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | { root: RawInstanceProps?, padding: RawInstanceProps?, sizeConstraint: RawInstanceProps? })?,
	ref: React.Ref<TextButton>?,
	disabled: (nil | boolean)?,
	active: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type PressableSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type PressableStyleProps = {
	disabled: (nil | boolean)?,
	active: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type DraggableProps<TItem = DraggableItem> = {
	items: { TItem },
	value: (nil | { string })?,
	defaultValue: (nil | { string })?,
	onReorder: (nil | ((order: { string }) -> ()))?,
	renderItem: (state: DraggableItemRenderState<TItem>) -> React.Node,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		listLayout: RawInstanceProps?,
		item: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	direction: (nil | "vertical" | "horizontal")?,
	gap: (nil | string | number | UDim)?,
	align: (nil | "center" | "start" | "end" | "stretch")?,
	justify: (nil | "center" | "start" | "end" | "fill" | "spaceAround" | "spaceBetween" | "spaceEvenly")?,
	disabled: (nil | boolean)?,
	active: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type DraggableItem = {
	id: string,
	disabled: (nil | boolean)?,
}

export type DraggableSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	listLayout: RawInstanceProps?,
	item: RawInstanceProps?,
}

export type DraggableStyleProps = {
	direction: (nil | "vertical" | "horizontal")?,
	gap: (nil | string | number | UDim)?,
	align: (nil | "center" | "start" | "end" | "stretch")?,
	justify: (nil | "center" | "start" | "end" | "fill" | "spaceAround" | "spaceBetween" | "spaceEvenly")?,
	disabled: (nil | boolean)?,
	active: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type IconProps = {
	name: Icons.Name,
	Event: (InstanceEventMap<ImageLabel> | nil)?,
	Change: (InstanceEventMap<ImageLabel> | nil)?,
	slotProps: (nil | { root: RawInstanceProps?, sizeConstraint: RawInstanceProps? })?,
	ref: React.Ref<ImageLabel>?,
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type IconSlotProps = { root: RawInstanceProps?, sizeConstraint: RawInstanceProps? }

export type IconStyleProps = {
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ImageProps = {
	src: string,
	children: React.Node?,
	Event: (InstanceEventMap<ImageLabel> | nil)?,
	Change: (InstanceEventMap<ImageLabel> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		corner: RawInstanceProps?,
		stroke: RawInstanceProps?,
		padding: RawInstanceProps?,
		aspectRatio: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<ImageLabel>?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	transparency: (nil | number)?,
	scaleType: (nil | Enum.ScaleType)?,
	imageRectOffset: (nil | Vector2)?,
	imageRectSize: (nil | Vector2)?,
	resampleMode: (nil | Enum.ResamplerMode)?,
	sliceCenter: (nil | Rect)?,
	sliceScale: (nil | number)?,
	tileSize: (nil | UDim2)?,
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	stroke: (nil | ImageStrokeProps)?,
	aspectRatio: (nil | number)?,
	sizeConstraint: (nil | ImageSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ImageSlotProps = {
	root: RawInstanceProps?,
	corner: RawInstanceProps?,
	stroke: RawInstanceProps?,
	padding: RawInstanceProps?,
	aspectRatio: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type ImageStrokeProps = {
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	thickness: (nil | number)?,
	transparency: (nil | number)?,
	mode: (nil | Enum.ApplyStrokeMode)?,
}

export type ImageStyleProps = {
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	transparency: (nil | number)?,
	scaleType: (nil | Enum.ScaleType)?,
	imageRectOffset: (nil | Vector2)?,
	imageRectSize: (nil | Vector2)?,
	resampleMode: (nil | Enum.ResamplerMode)?,
	sliceCenter: (nil | Rect)?,
	sliceScale: (nil | number)?,
	tileSize: (nil | UDim2)?,
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	stroke: (nil | ImageStrokeProps)?,
	aspectRatio: (nil | number)?,
	sizeConstraint: (nil | ImageSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type AvatarProps = {
	src: (nil | string)?,
	fallback: (nil | string | number)?,
	imageTransparency: (nil | number)?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		image: RawInstanceProps?,
		fallback: RawInstanceProps?,
		corner: RawInstanceProps?,
		stroke: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	fallbackColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type AvatarSlotProps = {
	root: RawInstanceProps?,
	image: RawInstanceProps?,
	fallback: RawInstanceProps?,
	corner: RawInstanceProps?,
	stroke: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type AvatarStyleProps = {
	size: (nil | number | "xs" | "sm" | "md" | "lg" | "xl")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	fallbackColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type InputProps = {
	value: (nil | string)?,
	defaultValue: (nil | string)?,
	onChange: (nil | ((value: string) -> ()))?,
	Event: (InstanceEventMap<TextBox> | nil)?,
	Change: (InstanceEventMap<TextBox> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		textbox: RawInstanceProps?,
		corner: RawInstanceProps?,
		stroke: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<TextBox>?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	readOnly: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	placeholder: (nil | string)?,
	maxLength: (nil | number)?,
	styleOverrides: (nil | InputStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type InputSlotProps = {
	root: RawInstanceProps?,
	textbox: RawInstanceProps?,
	corner: RawInstanceProps?,
	stroke: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type InputStyleProps = {
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	readOnly: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	placeholder: (nil | string)?,
	maxLength: (nil | number)?,
	styleOverrides: (nil | InputStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type KeybindInputProps = {
	value: (nil | Enum.KeyCode)?,
	defaultValue: (nil | Enum.KeyCode)?,
	onChange: (nil | ((value: Enum.KeyCode) -> ()))?,
	captureDevice: (nil | "gamepad" | "keyboard" | "both")?,
	cancelKeyCodes: (nil | { Enum.KeyCode })?,
	allowedKeyCodes: (nil | { Enum.KeyCode })?,
	blockedKeyCodes: (nil | { Enum.KeyCode })?,
	onCaptureStart: (nil | (() -> ()))?,
	onCaptureCancel: (nil | (() -> ()))?,
	onCaptureEnd: (nil | ((value: Enum.KeyCode) -> ()))?,
	onCapturingChange: (nil | ((capturing: boolean) -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		trigger: RawInstanceProps?,
		triggerCorner: RawInstanceProps?,
		triggerStroke: RawInstanceProps?,
		triggerPadding: RawInstanceProps?,
		content: RawInstanceProps?,
		deviceFrame: RawInstanceProps?,
		deviceFrameCorner: RawInstanceProps?,
		deviceIcon: RawInstanceProps?,
		keycap: RawInstanceProps?,
		keycapCorner: RawInstanceProps?,
		keycapStroke: RawInstanceProps?,
		gamepadGlyph: RawInstanceProps?,
		label: RawInstanceProps?,
		hint: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<TextButton>?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	readOnly: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	placeholder: (nil | string)?,
	captureLabel: (nil | string)?,
	clearable: (nil | boolean)?,
	displayDevice: (nil | "gamepad" | "keyboard" | "mouse")?,
	styleOverrides: (nil | KeybindInputStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type KeybindInputSlotProps = {
	root: RawInstanceProps?,
	trigger: RawInstanceProps?,
	triggerCorner: RawInstanceProps?,
	triggerStroke: RawInstanceProps?,
	triggerPadding: RawInstanceProps?,
	content: RawInstanceProps?,
	deviceFrame: RawInstanceProps?,
	deviceFrameCorner: RawInstanceProps?,
	deviceIcon: RawInstanceProps?,
	keycap: RawInstanceProps?,
	keycapCorner: RawInstanceProps?,
	keycapStroke: RawInstanceProps?,
	gamepadGlyph: RawInstanceProps?,
	label: RawInstanceProps?,
	hint: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type KeybindInputStyleProps = {
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	readOnly: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	placeholder: (nil | string)?,
	captureLabel: (nil | string)?,
	clearable: (nil | boolean)?,
	displayDevice: (nil | "gamepad" | "keyboard" | "mouse")?,
	styleOverrides: (nil | KeybindInputStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type CardProps = {
	children: React.Node?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		content: RawInstanceProps?,
		shadow: RawInstanceProps?,
		shadowCorner: RawInstanceProps?,
		shadowStroke: RawInstanceProps?,
		corner: RawInstanceProps?,
		stroke: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	variant: (nil | "surface" | "subtle" | "outline" | "elevated")?,
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	shadow: (nil | boolean | "xs" | "sm" | "md" | "lg" | "xl")?,
	stroke: (nil | CardStrokeProps)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type CardSlotProps = {
	root: RawInstanceProps?,
	content: RawInstanceProps?,
	shadow: RawInstanceProps?,
	shadowCorner: RawInstanceProps?,
	shadowStroke: RawInstanceProps?,
	corner: RawInstanceProps?,
	stroke: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type CardStrokeProps = {
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	thickness: (nil | number)?,
	transparency: (nil | number)?,
	mode: (nil | Enum.ApplyStrokeMode)?,
}

export type CardStyleProps = {
	variant: (nil | "surface" | "subtle" | "outline" | "elevated")?,
	border: (nil | number)?,
	borderColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	shadow: (nil | boolean | "xs" | "sm" | "md" | "lg" | "xl")?,
	stroke: (nil | CardStrokeProps)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type CheckboxProps = {
	checked: (nil | boolean)?,
	defaultChecked: (nil | boolean)?,
	onChange: (nil | ((checked: boolean) -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		listLayout: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		mark: RawInstanceProps?,
		markCorner: RawInstanceProps?,
		markStroke: RawInstanceProps?,
		fill: RawInstanceProps?,
		fillCorner: RawInstanceProps?,
		glyph: RawInstanceProps?,
		label: RawInstanceProps?,
	})?,
	ref: React.Ref<TextButton>?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	label: (nil | string | number)?,
	styleOverrides: (nil | CheckboxStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type CheckboxSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	listLayout: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	mark: RawInstanceProps?,
	markCorner: RawInstanceProps?,
	markStroke: RawInstanceProps?,
	fill: RawInstanceProps?,
	fillCorner: RawInstanceProps?,
	glyph: RawInstanceProps?,
	label: RawInstanceProps?,
}

export type CheckboxStyleProps = {
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	label: (nil | string | number)?,
	styleOverrides: (nil | CheckboxStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ProgressProps = {
	value: (nil | number)?,
	min: (nil | number)?,
	max: (nil | number)?,
	formatValue: (nil | ((value: number, percent: number) -> string))?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		header: RawInstanceProps?,
		label: RawInstanceProps?,
		valueLabel: RawInstanceProps?,
		track: RawInstanceProps?,
		trackCorner: RawInstanceProps?,
		trackStroke: RawInstanceProps?,
		fill: RawInstanceProps?,
		fillCorner: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	fullWidth: (nil | boolean)?,
	label: (nil | string | number)?,
	showValue: (nil | boolean)?,
	styleOverrides: (nil | ProgressStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ProgressSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	header: RawInstanceProps?,
	label: RawInstanceProps?,
	valueLabel: RawInstanceProps?,
	track: RawInstanceProps?,
	trackCorner: RawInstanceProps?,
	trackStroke: RawInstanceProps?,
	fill: RawInstanceProps?,
	fillCorner: RawInstanceProps?,
}

export type ProgressStyleProps = {
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	radius: (nil | number | "xs" | "sm" | "md" | "lg" | "xl" | UDim)?,
	fullWidth: (nil | boolean)?,
	label: (nil | string | number)?,
	showValue: (nil | boolean)?,
	styleOverrides: (nil | ProgressStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type CircularProgressProps = {
	value: (nil | number)?,
	min: (nil | number)?,
	max: (nil | number)?,
	formatValue: (nil | ((value: number, percent: number) -> string))?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		aspectRatio: RawInstanceProps?,
		trackGroup: RawInstanceProps?,
		trackSegment: RawInstanceProps?,
		fillGroup: RawInstanceProps?,
		fillSegment: RawInstanceProps?,
		center: RawInstanceProps?,
		label: RawInstanceProps?,
		valueLabel: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	mode: (nil | "determinate" | "indeterminate")?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	cap: (nil | "round" | "butt")?,
	label: (nil | string | number)?,
	showValue: (nil | boolean)?,
	startAngle: (nil | number)?,
	disableAnimation: (nil | boolean)?,
	styleOverrides: (nil | CircularProgressStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type CircularProgressSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	aspectRatio: RawInstanceProps?,
	trackGroup: RawInstanceProps?,
	trackSegment: RawInstanceProps?,
	fillGroup: RawInstanceProps?,
	fillSegment: RawInstanceProps?,
	center: RawInstanceProps?,
	label: RawInstanceProps?,
	valueLabel: RawInstanceProps?,
}

export type CircularProgressStyleProps = {
	mode: (nil | "determinate" | "indeterminate")?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	cap: (nil | "round" | "butt")?,
	label: (nil | string | number)?,
	showValue: (nil | boolean)?,
	startAngle: (nil | number)?,
	disableAnimation: (nil | boolean)?,
	styleOverrides: (nil | CircularProgressStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type WorldPortalProps = WorldPortalBillboardProps | WorldPortalSurfaceProps

export type WorldPortalBillboardProps = {
	kind: (nil | "billboard")?,
	adornee: PVInstance | Attachment,
	active: (nil | boolean)?,
	alwaysOnTop: (nil | boolean)?,
	brightness: (nil | number)?,
	clipsDescendants: (nil | boolean)?,
	lightInfluence: (nil | number)?,
	maxDistance: (nil | number)?,
	size: (nil | UDim2)?,
	sizeOffset: (nil | Vector2)?,
	studsOffset: (nil | Vector3)?,
	studsOffsetWorldSpace: (nil | Vector3)?,
	children: React.Node?,
	enabled: (nil | boolean)?,
	parent: (nil | Instance)?,
	zIndexBehavior: (nil | Enum.ZIndexBehavior)?,
	slotProps: (nil | { billboard: RawInstanceProps?, surface: RawInstanceProps? })?,
	ref: React.Ref<WorldPortalHost>?,
}

export type WorldPortalSlotProps = { billboard: RawInstanceProps?, surface: RawInstanceProps? }

export type WorldPortalSurfaceProps = {
	kind: "surface",
	adornee: BasePart,
	active: (nil | boolean)?,
	alwaysOnTop: (nil | boolean)?,
	brightness: (nil | number)?,
	canvasSize: (nil | Vector2)?,
	clipsDescendants: (nil | boolean)?,
	face: (nil | Enum.NormalId)?,
	lightInfluence: (nil | number)?,
	pixelsPerStud: (nil | number)?,
	sizingMode: (nil | Enum.SurfaceGuiSizingMode)?,
	children: React.Node?,
	enabled: (nil | boolean)?,
	parent: (nil | Instance)?,
	zIndexBehavior: (nil | Enum.ZIndexBehavior)?,
	slotProps: (nil | { billboard: RawInstanceProps?, surface: RawInstanceProps? })?,
	ref: React.Ref<WorldPortalHost>?,
}

export type SwitchProps = {
	checked: (nil | boolean)?,
	defaultChecked: (nil | boolean)?,
	onChange: (nil | ((checked: boolean) -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		listLayout: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		track: RawInstanceProps?,
		trackCorner: RawInstanceProps?,
		trackStroke: RawInstanceProps?,
		thumb: RawInstanceProps?,
		thumbCorner: RawInstanceProps?,
		icon: RawInstanceProps?,
		label: RawInstanceProps?,
	})?,
	ref: React.Ref<TextButton>?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	label: (nil | string | number)?,
	icons: (nil | SwitchIcons)?,
	styleOverrides: (nil | SwitchStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type SwitchSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	listLayout: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	track: RawInstanceProps?,
	trackCorner: RawInstanceProps?,
	trackStroke: RawInstanceProps?,
	thumb: RawInstanceProps?,
	thumbCorner: RawInstanceProps?,
	icon: RawInstanceProps?,
	label: RawInstanceProps?,
}

export type SwitchStyleProps = {
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	label: (nil | string | number)?,
	icons: (nil | SwitchIcons)?,
	styleOverrides: (nil | SwitchStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type SegmentedControlProps = {
	options: { SegmentedControlOption },
	value: (nil | string)?,
	defaultValue: (nil | string)?,
	onChange: (nil | ((value: string) -> ()))?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		frame: RawInstanceProps?,
		frameCorner: RawInstanceProps?,
		frameStroke: RawInstanceProps?,
		framePadding: RawInstanceProps?,
		listLayout: RawInstanceProps?,
		segment: RawInstanceProps?,
		segmentCorner: RawInstanceProps?,
		segmentStroke: RawInstanceProps?,
		segmentPadding: RawInstanceProps?,
		segmentText: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	styleOverrides: (nil | SegmentedControlStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type SegmentedControlSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	frame: RawInstanceProps?,
	frameCorner: RawInstanceProps?,
	frameStroke: RawInstanceProps?,
	framePadding: RawInstanceProps?,
	listLayout: RawInstanceProps?,
	segment: RawInstanceProps?,
	segmentCorner: RawInstanceProps?,
	segmentStroke: RawInstanceProps?,
	segmentPadding: RawInstanceProps?,
	segmentText: RawInstanceProps?,
}

export type SegmentedControlStyleProps = {
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	styleOverrides: (nil | SegmentedControlStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type TabsProps = {
	tabs: { TabsTab },
	value: (nil | string)?,
	defaultValue: (nil | string)?,
	onChange: (nil | ((value: string) -> ()))?,
	renderPanel: (nil | ((tab: TabsTab, state: TabsPanelRenderState) -> React.Node))?,
	keepMounted: (nil | boolean)?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		list: RawInstanceProps?,
		listStroke: RawInstanceProps?,
		listLayout: RawInstanceProps?,
		tab: RawInstanceProps?,
		tabCorner: RawInstanceProps?,
		tabStroke: RawInstanceProps?,
		tabPadding: RawInstanceProps?,
		tabText: RawInstanceProps?,
		panel: RawInstanceProps?,
		panelCorner: RawInstanceProps?,
		panelStroke: RawInstanceProps?,
		panelPadding: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	variant: (nil | "line" | "contained")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	styleOverrides: (nil | TabsStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type TabsSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	list: RawInstanceProps?,
	listStroke: RawInstanceProps?,
	listLayout: RawInstanceProps?,
	tab: RawInstanceProps?,
	tabCorner: RawInstanceProps?,
	tabStroke: RawInstanceProps?,
	tabPadding: RawInstanceProps?,
	tabText: RawInstanceProps?,
	panel: RawInstanceProps?,
	panelCorner: RawInstanceProps?,
	panelStroke: RawInstanceProps?,
	panelPadding: RawInstanceProps?,
}

export type TabsStyleProps = {
	variant: (nil | "line" | "contained")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	styleOverrides: (nil | TabsStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type StepperInputProps = {
	value: (nil | number)?,
	defaultValue: (nil | number)?,
	onChange: (nil | ((value: number) -> ()))?,
	onChangeEnd: (nil | ((value: number) -> ()))?,
	formatValue: (nil | ((value: number) -> string))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		frame: RawInstanceProps?,
		frameCorner: RawInstanceProps?,
		frameStroke: RawInstanceProps?,
		framePadding: RawInstanceProps?,
		rail: RawInstanceProps?,
		railFill: RawInstanceProps?,
		railValue: RawInstanceProps?,
		decrement: RawInstanceProps?,
		decrementText: RawInstanceProps?,
		increment: RawInstanceProps?,
		incrementText: RawInstanceProps?,
		buttonCorner: RawInstanceProps?,
		buttonStroke: RawInstanceProps?,
		buttonPadding: RawInstanceProps?,
		listLayout: RawInstanceProps?,
	})?,
	ref: React.Ref<TextButton>?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	readOnly: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	min: (nil | number)?,
	max: (nil | number)?,
	step: (nil | number)?,
	styleOverrides: (nil | StepperInputStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type StepperInputSlotProps = {
	root: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	frame: RawInstanceProps?,
	frameCorner: RawInstanceProps?,
	frameStroke: RawInstanceProps?,
	framePadding: RawInstanceProps?,
	rail: RawInstanceProps?,
	railFill: RawInstanceProps?,
	railValue: RawInstanceProps?,
	decrement: RawInstanceProps?,
	decrementText: RawInstanceProps?,
	increment: RawInstanceProps?,
	incrementText: RawInstanceProps?,
	buttonCorner: RawInstanceProps?,
	buttonStroke: RawInstanceProps?,
	buttonPadding: RawInstanceProps?,
	listLayout: RawInstanceProps?,
}

export type StepperInputStyleProps = {
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	readOnly: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	min: (nil | number)?,
	max: (nil | number)?,
	step: (nil | number)?,
	styleOverrides: (nil | StepperInputStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type PopoverProps = {
	children: React.Node?,
	onOpenedChange: (nil | ((opened: boolean) -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		trigger: RawInstanceProps?,
		overlay: RawInstanceProps?,
		outsideCapture: RawInstanceProps?,
		panel: RawInstanceProps?,
		panelCorner: RawInstanceProps?,
		panelStroke: RawInstanceProps?,
		panelPadding: RawInstanceProps?,
		content: RawInstanceProps?,
		label: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	content: (nil | string | number | React.ReactElement)?,
	placement: (nil | "left" | "right" | "top" | "bottom")?,
	align: (nil | "center" | "start" | "end")?,
	triggerMode: (nil | "hover" | "click" | "manual")?,
	openDelay: (nil | number)?,
	disabled: (nil | boolean)?,
	opened: (nil | boolean)?,
	defaultOpened: (nil | boolean)?,
	closeOnOutsidePress: (nil | boolean)?,
	gap: (nil | number)?,
	offset: (nil | Vector2)?,
	styleOverrides: (nil | PopoverStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type PopoverSlotProps = {
	root: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	trigger: RawInstanceProps?,
	overlay: RawInstanceProps?,
	outsideCapture: RawInstanceProps?,
	panel: RawInstanceProps?,
	panelCorner: RawInstanceProps?,
	panelStroke: RawInstanceProps?,
	panelPadding: RawInstanceProps?,
	content: RawInstanceProps?,
	label: RawInstanceProps?,
}

export type PopoverStyleProps = {
	content: (nil | string | number | React.ReactElement)?,
	placement: (nil | "left" | "right" | "top" | "bottom")?,
	align: (nil | "center" | "start" | "end")?,
	triggerMode: (nil | "hover" | "click" | "manual")?,
	openDelay: (nil | number)?,
	disabled: (nil | boolean)?,
	opened: (nil | boolean)?,
	defaultOpened: (nil | boolean)?,
	closeOnOutsidePress: (nil | boolean)?,
	gap: (nil | number)?,
	offset: (nil | Vector2)?,
	styleOverrides: (nil | PopoverStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type MenuProps = {
	items: { MenuItem },
	children: React.Node?,
	onItemPress: (nil | ((value: string) -> ()))?,
	onOpenedChange: (nil | ((opened: boolean) -> ()))?,
	closeOnItemPress: (nil | boolean)?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		trigger: RawInstanceProps?,
		overlay: RawInstanceProps?,
		outsideCapture: RawInstanceProps?,
		panel: RawInstanceProps?,
		panelCorner: RawInstanceProps?,
		panelStroke: RawInstanceProps?,
		panelPadding: RawInstanceProps?,
		content: RawInstanceProps?,
		list: RawInstanceProps?,
		listPadding: RawInstanceProps?,
		listLayout: RawInstanceProps?,
		item: RawInstanceProps?,
		itemCorner: RawInstanceProps?,
		itemPadding: RawInstanceProps?,
		itemLayout: RawInstanceProps?,
		itemIcon: RawInstanceProps?,
		itemLabel: RawInstanceProps?,
		itemRightSection: RawInstanceProps?,
		itemRightLabel: RawInstanceProps?,
		divider: RawInstanceProps?,
		groupLabel: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	panelWidth: (nil | string | number | UDim)?,
	maxVisibleItems: (nil | number)?,
	styleOverrides: (nil | MenuStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
	align: (nil | "center" | "start" | "end")?,
	gap: (nil | number)?,
	disabled: (nil | boolean)?,
	placement: (nil | "left" | "right" | "top" | "bottom")?,
	triggerMode: (nil | "hover" | "click" | "manual")?,
	openDelay: (nil | number)?,
	opened: (nil | boolean)?,
	defaultOpened: (nil | boolean)?,
	closeOnOutsidePress: (nil | boolean)?,
	offset: (nil | Vector2)?,
}

export type MenuSlotProps = {
	root: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	trigger: RawInstanceProps?,
	overlay: RawInstanceProps?,
	outsideCapture: RawInstanceProps?,
	panel: RawInstanceProps?,
	panelCorner: RawInstanceProps?,
	panelStroke: RawInstanceProps?,
	panelPadding: RawInstanceProps?,
	content: RawInstanceProps?,
	list: RawInstanceProps?,
	listPadding: RawInstanceProps?,
	listLayout: RawInstanceProps?,
	item: RawInstanceProps?,
	itemCorner: RawInstanceProps?,
	itemPadding: RawInstanceProps?,
	itemLayout: RawInstanceProps?,
	itemIcon: RawInstanceProps?,
	itemLabel: RawInstanceProps?,
	itemRightSection: RawInstanceProps?,
	itemRightLabel: RawInstanceProps?,
	divider: RawInstanceProps?,
	groupLabel: RawInstanceProps?,
}

export type MenuStyleProps = {
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	panelWidth: (nil | string | number | UDim)?,
	maxVisibleItems: (nil | number)?,
	styleOverrides: (nil | MenuStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
	align: (nil | "center" | "start" | "end")?,
	gap: (nil | number)?,
	disabled: (nil | boolean)?,
	placement: (nil | "left" | "right" | "top" | "bottom")?,
	triggerMode: (nil | "hover" | "click" | "manual")?,
	openDelay: (nil | number)?,
	opened: (nil | boolean)?,
	defaultOpened: (nil | boolean)?,
	closeOnOutsidePress: (nil | boolean)?,
	offset: (nil | Vector2)?,
}

export type SelectProps = {
	options: { SelectOption },
	selected: (nil | string)?,
	value: (nil | string)?,
	defaultValue: (nil | string)?,
	onChange: (nil | ((value: string) -> ()))?,
	maxVisibleOptions: (nil | number)?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		rootLayout: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		trigger: RawInstanceProps?,
		triggerCorner: RawInstanceProps?,
		triggerStroke: RawInstanceProps?,
		triggerPadding: RawInstanceProps?,
		triggerText: RawInstanceProps?,
		indicator: RawInstanceProps?,
		overlay: RawInstanceProps?,
		list: RawInstanceProps?,
		listCorner: RawInstanceProps?,
		listStroke: RawInstanceProps?,
		listViewport: RawInstanceProps?,
		listPadding: RawInstanceProps?,
		optionsLayout: RawInstanceProps?,
		option: RawInstanceProps?,
		optionCorner: RawInstanceProps?,
		optionPadding: RawInstanceProps?,
		optionText: RawInstanceProps?,
	})?,
	ref: React.Ref<TextButton>?,
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	placeholder: (nil | string)?,
	styleOverrides: (nil | SelectStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type SelectSlotProps = {
	root: RawInstanceProps?,
	rootLayout: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	trigger: RawInstanceProps?,
	triggerCorner: RawInstanceProps?,
	triggerStroke: RawInstanceProps?,
	triggerPadding: RawInstanceProps?,
	triggerText: RawInstanceProps?,
	indicator: RawInstanceProps?,
	overlay: RawInstanceProps?,
	list: RawInstanceProps?,
	listCorner: RawInstanceProps?,
	listStroke: RawInstanceProps?,
	listViewport: RawInstanceProps?,
	listPadding: RawInstanceProps?,
	optionsLayout: RawInstanceProps?,
	option: RawInstanceProps?,
	optionCorner: RawInstanceProps?,
	optionPadding: RawInstanceProps?,
	optionText: RawInstanceProps?,
}

export type SelectStyleProps = {
	variant: (nil | "light" | "subtle" | "filled" | "outline")?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	placeholder: (nil | string)?,
	styleOverrides: (nil | SelectStyleOverrides)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ModalProps = {
	opened: boolean,
	onClose: () -> (),
	children: React.Node?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		overlay: RawInstanceProps?,
		backdrop: RawInstanceProps?,
		contentLayer: RawInstanceProps?,
		content: RawInstanceProps?,
		contentCorner: RawInstanceProps?,
		contentStroke: RawInstanceProps?,
		contentPadding: RawInstanceProps?,
		contentLayout: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		header: RawInstanceProps?,
		headerSizeConstraint: RawInstanceProps?,
		title: RawInstanceProps?,
		closeButton: RawInstanceProps?,
		closeButtonCorner: RawInstanceProps?,
		closeIcon: RawInstanceProps?,
		body: RawInstanceProps?,
		bodyContent: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	size: (nil | "sm" | "md" | "lg" | "xl")?,
	fullWidth: (nil | boolean)?,
	title: (nil | string | number)?,
	closeOnBackdropClick: (nil | boolean)?,
	withCloseButton: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ModalSlotProps = {
	overlay: RawInstanceProps?,
	backdrop: RawInstanceProps?,
	contentLayer: RawInstanceProps?,
	content: RawInstanceProps?,
	contentCorner: RawInstanceProps?,
	contentStroke: RawInstanceProps?,
	contentPadding: RawInstanceProps?,
	contentLayout: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	header: RawInstanceProps?,
	headerSizeConstraint: RawInstanceProps?,
	title: RawInstanceProps?,
	closeButton: RawInstanceProps?,
	closeButtonCorner: RawInstanceProps?,
	closeIcon: RawInstanceProps?,
	body: RawInstanceProps?,
	bodyContent: RawInstanceProps?,
}

export type ModalStyleProps = {
	size: (nil | "sm" | "md" | "lg" | "xl")?,
	fullWidth: (nil | boolean)?,
	title: (nil | string | number)?,
	closeOnBackdropClick: (nil | boolean)?,
	withCloseButton: (nil | boolean)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type WindowProps = {
	collapsed: (nil | boolean)?,
	defaultCollapsed: (nil | boolean)?,
	onCollapsedChange: (nil | ((collapsed: boolean) -> ()))?,
	maximized: (nil | boolean)?,
	defaultMaximized: (nil | boolean)?,
	onMaximizedChange: (nil | ((maximized: boolean) -> ()))?,
	onClose: (nil | (() -> ()))?,
	leading: React.Node?,
	trailing: React.Node?,
	rail: React.Node?,
	children: React.Node?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		overlay: RawInstanceProps?,
		root: RawInstanceProps?,
		rootCorner: RawInstanceProps?,
		rootStroke: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		shadow: RawInstanceProps?,
		titleBar: RawInstanceProps?,
		leading: RawInstanceProps?,
		title: RawInstanceProps?,
		trailing: RawInstanceProps?,
		controls: RawInstanceProps?,
		collapseButton: RawInstanceProps?,
		maximizeButton: RawInstanceProps?,
		closeButton: RawInstanceProps?,
		body: RawInstanceProps?,
		rail: RawInstanceProps?,
		content: RawInstanceProps?,
		resizeHandle: RawInstanceProps?,
		collapseControl: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	title: (nil | string | number)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type WindowSlotProps = {
	overlay: RawInstanceProps?,
	root: RawInstanceProps?,
	rootCorner: RawInstanceProps?,
	rootStroke: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	shadow: RawInstanceProps?,
	titleBar: RawInstanceProps?,
	leading: RawInstanceProps?,
	title: RawInstanceProps?,
	trailing: RawInstanceProps?,
	controls: RawInstanceProps?,
	collapseButton: RawInstanceProps?,
	maximizeButton: RawInstanceProps?,
	closeButton: RawInstanceProps?,
	body: RawInstanceProps?,
	rail: RawInstanceProps?,
	content: RawInstanceProps?,
	resizeHandle: RawInstanceProps?,
	collapseControl: RawInstanceProps?,
}

export type WindowStyleProps = {
	title: (nil | string | number)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type SliderProps = {
	value: (nil | number)?,
	defaultValue: (nil | number)?,
	tooltip: (nil | string | boolean | ((value: number) -> string))?,
	onChange: (nil | ((value: number) -> ()))?,
	onChangeEnd: (nil | ((value: number) -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		padding: RawInstanceProps?,
		label: RawInstanceProps?,
		valueLabel: RawInstanceProps?,
		track: RawInstanceProps?,
		trackCorner: RawInstanceProps?,
		trackStroke: RawInstanceProps?,
		range: RawInstanceProps?,
		rangeCorner: RawInstanceProps?,
		thumb: RawInstanceProps?,
		thumbCorner: RawInstanceProps?,
		thumbStroke: RawInstanceProps?,
		tooltipTrigger: RawInstanceProps?,
		tooltipOverlay: RawInstanceProps?,
		tooltip: RawInstanceProps?,
		tooltipCorner: RawInstanceProps?,
		tooltipStroke: RawInstanceProps?,
		tooltipPadding: RawInstanceProps?,
		tooltipLabel: RawInstanceProps?,
		tooltipTail: RawInstanceProps?,
		tooltipTailBorder: RawInstanceProps?,
		hitbox: RawInstanceProps?,
	})?,
	ref: React.Ref<TextButton>?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	min: (nil | number)?,
	max: (nil | number)?,
	step: (nil | number)?,
	styleOverrides: (nil | SliderStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type SliderSlotProps = {
	root: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	padding: RawInstanceProps?,
	label: RawInstanceProps?,
	valueLabel: RawInstanceProps?,
	track: RawInstanceProps?,
	trackCorner: RawInstanceProps?,
	trackStroke: RawInstanceProps?,
	range: RawInstanceProps?,
	rangeCorner: RawInstanceProps?,
	thumb: RawInstanceProps?,
	thumbCorner: RawInstanceProps?,
	thumbStroke: RawInstanceProps?,
	tooltipTrigger: RawInstanceProps?,
	tooltipOverlay: RawInstanceProps?,
	tooltip: RawInstanceProps?,
	tooltipCorner: RawInstanceProps?,
	tooltipStroke: RawInstanceProps?,
	tooltipPadding: RawInstanceProps?,
	tooltipLabel: RawInstanceProps?,
	tooltipTail: RawInstanceProps?,
	tooltipTailBorder: RawInstanceProps?,
	hitbox: RawInstanceProps?,
}

export type SliderStyleProps = {
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	size: (nil | "xs" | "sm" | "md" | "lg" | "xl")?,
	disabled: (nil | boolean)?,
	fullWidth: (nil | boolean)?,
	min: (nil | number)?,
	max: (nil | number)?,
	step: (nil | number)?,
	styleOverrides: (nil | SliderStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type TooltipProps = {
	children: React.Node?,
	Event: (InstanceEventMap<Frame> | nil)?,
	Change: (InstanceEventMap<Frame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
		overlay: RawInstanceProps?,
		bubble: RawInstanceProps?,
		bubbleCorner: RawInstanceProps?,
		bubbleStroke: RawInstanceProps?,
		bubblePadding: RawInstanceProps?,
		label: RawInstanceProps?,
		tail: RawInstanceProps?,
		tailBorder: RawInstanceProps?,
	})?,
	ref: React.Ref<Frame>?,
	label: (nil | string | number)?,
	content: (nil | string | number | React.ReactElement)?,
	placement: (nil | "top")?,
	disabled: (nil | boolean)?,
	opened: (nil | boolean)?,
	openDelay: (nil | number)?,
	gap: (nil | number)?,
	tailImage: (nil | string)?,
	tailBorderImage: (nil | string)?,
	styleOverrides: (nil | TooltipStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type TooltipSlotProps = {
	root: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
	overlay: RawInstanceProps?,
	bubble: RawInstanceProps?,
	bubbleCorner: RawInstanceProps?,
	bubbleStroke: RawInstanceProps?,
	bubblePadding: RawInstanceProps?,
	label: RawInstanceProps?,
	tail: RawInstanceProps?,
	tailBorder: RawInstanceProps?,
}

export type TooltipStyleProps = {
	label: (nil | string | number)?,
	content: (nil | string | number | React.ReactElement)?,
	placement: (nil | "top")?,
	disabled: (nil | boolean)?,
	opened: (nil | boolean)?,
	openDelay: (nil | number)?,
	gap: (nil | number)?,
	tailImage: (nil | string)?,
	tailBorderImage: (nil | string)?,
	styleOverrides: (nil | TooltipStyleOverride)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	clip: (nil | boolean)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type BackdropProps = {
	children: React.Node?,
	onPress: (nil | (() -> ()))?,
	Event: (InstanceEventMap<TextButton> | nil)?,
	Change: (InstanceEventMap<TextButton> | nil)?,
	slotProps: (nil | { root: RawInstanceProps? })?,
	ref: React.Ref<TextButton>?,
	visible: (nil | boolean)?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	opacity: (nil | number)?,
	cursor: string?,
	zIndex: (nil | number | React.Binding<number>)?,
	active: (nil | boolean)?,
	excludeRect: (nil | BackdropExcludeRect)?,
	excludeInstance: (nil | GuiObject)?,
}

export type BackdropSlotProps = { root: RawInstanceProps? }

export type BackdropStyleProps = {
	visible: (nil | boolean)?,
	color: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	opacity: (nil | number)?,
	cursor: string?,
	zIndex: (nil | number | React.Binding<number>)?,
	active: (nil | boolean)?,
	excludeRect: (nil | BackdropExcludeRect)?,
	excludeInstance: (nil | GuiObject)?,
}

export type ScrollAreaProps = {
	children: React.Node?,
	onCanvasPositionChange: (nil | ((position: Vector2) -> ()))?,
	Event: (InstanceEventMap<ScrollingFrame> | nil)?,
	Change: (InstanceEventMap<ScrollingFrame> | nil)?,
	slotProps: (nil | {
		root: RawInstanceProps?,
		content: RawInstanceProps?,
		padding: RawInstanceProps?,
		sizeConstraint: RawInstanceProps?,
	})?,
	ref: React.Ref<ScrollingFrame>?,
	direction: (nil | "vertical" | "horizontal" | "both")?,
	scrollbarSize: (nil | number)?,
	scrollbarColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	scrollbarTransparency: (nil | number)?,
	canvasSize: (nil | UDim2)?,
	canvasPosition: (nil | Vector2)?,
	automaticCanvasSize: (nil | Enum.AutomaticSize)?,
	scrollingEnabled: (nil | boolean)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type ScrollAreaSlotProps = {
	root: RawInstanceProps?,
	content: RawInstanceProps?,
	padding: RawInstanceProps?,
	sizeConstraint: RawInstanceProps?,
}

export type ScrollAreaStyleProps = {
	direction: (nil | "vertical" | "horizontal" | "both")?,
	scrollbarSize: (nil | number)?,
	scrollbarColor: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	scrollbarTransparency: (nil | number)?,
	canvasSize: (nil | UDim2)?,
	canvasPosition: (nil | Vector2)?,
	automaticCanvasSize: (nil | Enum.AutomaticSize)?,
	scrollingEnabled: (nil | boolean)?,
	sizeConstraint: (nil | SharedSizeConstraint)?,
	cursor: string?,
	width: (nil | string | number | UDim)?,
	height: (nil | string | number | UDim)?,
	minWidth: (nil | string | number | UDim)?,
	maxWidth: (nil | string | number | UDim)?,
	minHeight: (nil | string | number | UDim)?,
	maxHeight: (nil | string | number | UDim)?,
	position: (nil | string | number | UDim2 | {
		x: SizeValue,
		y: SizeValue,
	})?,
	anchor: (nil | Vector2)?,
	center: (nil | boolean)?,
	p: (nil | string | number | UDim)?,
	px: (nil | string | number | UDim)?,
	py: (nil | string | number | UDim)?,
	pt: (nil | string | number | UDim)?,
	pr: (nil | string | number | UDim)?,
	pb: (nil | string | number | UDim)?,
	pl: (nil | string | number | UDim)?,
	bg: (nil | Color3 | ThemeColorRef<ColorToken>)?,
	bgTransparency: (nil | number)?,
	visible: (nil | boolean)?,
	layoutOrder: (nil | number)?,
	zIndex: (nil | number)?,
}

export type Theme = {
	colors: ThemeColors,
	density: ThemeDensity,
	spacing: {
		xs: number,
		sm: number,
		md: number,
		lg: number,
		xl: number,
	},
	radius: {
		xs: number,
		sm: number,
		md: number,
		lg: number,
		xl: number,
	},
	fontSizes: {
		xs: number,
		sm: number,
		md: number,
		lg: number,
		xl: number,
	},
	lineHeights: {
		xs: number,
		sm: number,
		md: number,
		lg: number,
		xl: number,
	},
	fontFamily: Enum.Font,
	shadows: {
		xs: ThemeShadow,
		sm: ThemeShadow,
		md: ThemeShadow,
		lg: ThemeShadow,
		xl: ThemeShadow,
	},
	motion: ThemeMotion,
}

export type ThemeColorRef<Token = ColorToken> = {
	kind: "themeColor",
	token: Token,
}

export type ThemeProviderProps = {
	children: React.Node?,
	theme: (nil | ThemeOverride)?,
	density: (nil | "default" | "compact")?,
}

export type ConcreteColorValue = Color3 | ThemeColorRef<ColorToken>

export type ThemeSize = "xs" | "sm" | "md" | "lg" | "xl"

export type SizeValue = string | number | UDim

export type SizeValue2D = string | number | UDim2 | {
	x: SizeValue,
	y: SizeValue,
}

export type LucideIconAsset = {
	AtlasSize: LucideIconAtlasSize,
	IconName: Icons.Name,
	Id: number,
	Url: string,
	ImageRectSize: Vector2,
	ImageRectOffset: Vector2,
}

export type ColorToken = ColorTokens

export type BoxSizeConstraint = {
	min: (nil | Vector2)?,
	max: (nil | Vector2)?,
}

export type SharedSizeConstraint = {
	min: (nil | Vector2)?,
	max: (nil | Vector2)?,
}

export type ButtonStyleOverride = (
	styles: ButtonVisualStyles,
	ctx: ButtonStyleOverrideContext
) -> {
	backgroundColor: (nil | Color3)?,
	backgroundTransparency: (nil | number)?,
	textColor: (nil | Color3)?,
	strokeColor: (nil | Color3)?,
	strokeTransparency: (nil | number)?,
	scale: (nil | number)?,
	shouldRenderStroke: (nil | boolean)?,
}

export type PressableRenderState = {
	state: InteractionState,
	hovered: boolean,
	pressed: boolean,
	disabled: boolean,
	active: boolean,
}

export type DraggableItemRenderState<TItem = DraggableItem> = {
	item: TItem,
	index: number,
	dragging: boolean,
	active: boolean,
	disabled: boolean,
}

export type ImageSizeConstraint = {
	min: (nil | Vector2)?,
	max: (nil | Vector2)?,
}

export type InputStyleOverride = (
	styles: InputVisualStyles,
	ctx: InputStyleOverrideContext
) -> {
	backgroundColor: (nil | Color3)?,
	strokeColor: (nil | Color3)?,
	strokeTransparency: (nil | number)?,
	strokeThickness: (nil | number)?,
	textColor: (nil | Color3)?,
	placeholderColor: (nil | Color3)?,
}

export type KeybindInputStyleOverride = (
	styles: KeybindInputVisualStyles,
	ctx: KeybindInputStyleOverrideContext
) -> {
	backgroundColor: (nil | Color3)?,
	strokeColor: (nil | Color3)?,
	strokeTransparency: (nil | number)?,
	strokeThickness: (nil | number)?,
	labelColor: (nil | Color3)?,
	labelTransparency: (nil | number)?,
	hintColor: (nil | Color3)?,
	hintTransparency: (nil | number)?,
	deviceBackgroundColor: (nil | Color3)?,
	deviceBackgroundTransparency: (nil | number)?,
	deviceIconColor: (nil | Color3)?,
	keycapBackgroundColor: (nil | Color3)?,
	keycapBackgroundTransparency: (nil | number)?,
	keycapStrokeColor: (nil | Color3)?,
	keycapStrokeTransparency: (nil | number)?,
	keycapStrokeThickness: (nil | number)?,
}

export type CheckboxStyleOverride = (
	styles: CheckboxVisualStyles,
	ctx: CheckboxStyleOverrideContext
) -> {
	markColor: (nil | Color3)?,
	markStrokeColor: (nil | Color3)?,
	markStrokeTransparency: (nil | number)?,
	fillColor: (nil | Color3)?,
	fillTransparency: (nil | number)?,
	glyphColor: (nil | Color3)?,
	glyphTransparency: (nil | number)?,
	labelColor: (nil | Color3)?,
}

export type ProgressStyleOverride = (
	styles: ProgressVisualStyles,
	ctx: ProgressStyleOverrideContext
) -> {
	trackColor: (nil | Color3)?,
	trackStrokeColor: (nil | Color3)?,
	trackStrokeTransparency: (nil | number)?,
	fillColor: (nil | Color3)?,
	labelColor: (nil | Color3)?,
	valueLabelColor: (nil | Color3)?,
}

export type CircularProgressStyleOverride = (
	styles: CircularProgressVisualStyles,
	ctx: CircularProgressStyleOverrideContext
) -> {
	trackColor: (nil | Color3)?,
	trackTransparency: (nil | number)?,
	fillColor: (nil | Color3)?,
	fillTailColor: (nil | Color3)?,
	labelColor: (nil | Color3)?,
	valueLabelColor: (nil | Color3)?,
}

export type WorldPortalHost = BillboardGui | SurfaceGui

export type SwitchIcons = {
	unchecked: Icons.Name?,
	checked: Icons.Name?,
	hover: (nil | {
		unchecked: Icons.Name?,
		checked: Icons.Name?,
	})?,
}

export type SwitchStyleOverride = (
	styles: SwitchVisualStyles,
	ctx: SwitchStyleOverrideContext
) -> {
	trackColor: (nil | Color3)?,
	trackStrokeColor: (nil | Color3)?,
	trackStrokeTransparency: (nil | number)?,
	thumbColor: (nil | Color3)?,
	thumbStrokeColor: (nil | Color3)?,
	thumbStrokeTransparency: (nil | number)?,
	thumbOffset: (nil | number)?,
	iconColor: (nil | Color3)?,
	iconTransparency: (nil | number)?,
	labelColor: (nil | Color3)?,
}

export type SegmentedControlOption = {
	value: string,
	label: string,
	disabled: (nil | boolean)?,
}

export type SegmentedControlStyleOverrides = {
	frame: (nil | ((
		styles: SegmentedControlFrameVisualStyles,
		context: SegmentedControlFrameStyleOverrideContext
	) -> { backgroundColor: Color3?, strokeColor: Color3?, strokeTransparency: number? }))?,
	segment: (nil | ((
		styles: SegmentedControlSegmentVisualStyles,
		context: SegmentedControlSegmentStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		backgroundTransparency: number?,
		strokeColor: Color3?,
		strokeTransparency: number?,
		textColor: Color3?,
		textTransparency: number?,
	}))?,
	indicator: (nil | ((
		styles: SegmentedControlIndicatorVisualStyles,
		context: SegmentedControlIndicatorStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		backgroundTransparency: number?,
		strokeColor: Color3?,
		strokeTransparency: number?,
	}))?,
}

export type TabsTab = {
	value: string,
	label: string,
	panel: React.Node?,
	disabled: (nil | boolean)?,
}

export type TabsPanelRenderState = {
	index: number,
	active: boolean,
}

export type TabsStyleOverrides = {
	list: (nil | ((
		styles: TabsListVisualStyles,
		context: TabsListStyleOverrideContext
	) -> { strokeColor: Color3?, strokeTransparency: number? }))?,
	tab: (nil | ((
		styles: TabsTabVisualStyles,
		context: TabsTabStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		backgroundTransparency: number?,
		strokeColor: Color3?,
		strokeTransparency: number?,
		textColor: Color3?,
		textTransparency: number?,
		indicatorColor: Color3?,
		indicatorTransparency: number?,
	}))?,
	panel: (nil | ((
		styles: TabsPanelVisualStyles,
		context: TabsPanelStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		backgroundTransparency: number?,
		strokeColor: Color3?,
		strokeTransparency: number?,
	}))?,
}

export type StepperInputStyleOverrides = {
	frame: (nil | ((
		styles: StepperInputFrameVisualStyles,
		context: StepperInputFrameStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		inputBackgroundColor: Color3?,
		inputBackgroundTransparency: number?,
		strokeColor: Color3?,
		strokeTransparency: number?,
		strokeThickness: number?,
		textColor: Color3?,
		placeholderColor: Color3?,
		railFillColor: Color3?,
		railFillTransparency: number?,
	}))?,
	button: (nil | ((
		styles: StepperInputButtonVisualStyles,
		context: StepperInputButtonStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		backgroundTransparency: number?,
		strokeColor: Color3?,
		strokeTransparency: number?,
		textColor: Color3?,
	}))?,
}

export type PopoverStyleOverride = (
	styles: PopoverVisualStyles,
	ctx: PopoverStyleOverrideContext
) -> {
	backgroundColor: (nil | Color3)?,
	strokeColor: (nil | Color3)?,
	strokeTransparency: (nil | number)?,
	strokeThickness: (nil | number)?,
	textColor: (nil | Color3)?,
	shadow: (nil | ThemeShadow)?,
}

export type MenuItem = MenuActionItem | MenuDividerItem | MenuLabelItem

export type MenuStyleOverrides = {
	panel: (nil | ((
		styles: MenuPanelVisualStyles,
		context: MenuPanelStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		strokeColor: Color3?,
		strokeTransparency: number?,
		dividerColor: Color3?,
		dividerTransparency: number?,
		labelColor: Color3?,
		labelTransparency: number?,
	}))?,
	item: (nil | ((
		styles: MenuItemVisualStyles,
		context: MenuItemStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		backgroundTransparency: number?,
		textColor: Color3?,
		textTransparency: number?,
		rightTextColor: Color3?,
		rightTextTransparency: number?,
	}))?,
}

export type SelectOption = {
	value: string,
	label: string,
	disabled: (nil | boolean)?,
}

export type SelectStyleOverrides = {
	trigger: (nil | ((
		styles: SelectTriggerVisualStyles,
		context: SelectTriggerStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		strokeColor: Color3?,
		strokeTransparency: number?,
		strokeThickness: number?,
		textColor: Color3?,
		placeholderColor: Color3?,
		indicatorColor: Color3?,
		indicatorRotation: number?,
	}))?,
	list: (nil | ((
		styles: SelectListVisualStyles,
		context: SelectListStyleOverrideContext
	) -> { backgroundColor: Color3?, strokeColor: Color3?, strokeTransparency: number? }))?,
	option: (nil | ((
		styles: SelectOptionVisualStyles,
		context: SelectOptionStyleOverrideContext
	) -> {
		backgroundColor: Color3?,
		backgroundTransparency: number?,
		textColor: Color3?,
		textTransparency: number?,
	}))?,
}

export type SliderStyleOverride = (
	styles: SliderVisualStyles,
	ctx: SliderStyleOverrideContext
) -> {
	trackColor: (nil | Color3)?,
	trackStrokeColor: (nil | Color3)?,
	trackStrokeTransparency: (nil | number)?,
	rangeColor: (nil | Color3)?,
	thumbColor: (nil | Color3)?,
	thumbStrokeColor: (nil | Color3)?,
	thumbStrokeTransparency: (nil | number)?,
	labelColor: (nil | Color3)?,
	valueLabelColor: (nil | Color3)?,
}

export type TooltipStyleOverride = (
	styles: TooltipVisualStyles,
	ctx: TooltipStyleOverrideContext
) -> {
	backgroundColor: (nil | Color3)?,
	strokeColor: (nil | Color3)?,
	strokeTransparency: (nil | number)?,
	textColor: (nil | Color3)?,
	tailFillColor: (nil | Color3)?,
	tailBorderColor: (nil | Color3)?,
	tailBorderTransparency: (nil | number)?,
	shadow: (nil | ThemeShadow)?,
}

export type BackdropExcludeRect = {
	position: UDim2,
	size: UDim2,
	anchor: (nil | Vector2)?,
}

export type ThemeColors = {
	palette: {
		primary: {
			["0"]: Color3,
			["1"]: Color3,
			["2"]: Color3,
			["3"]: Color3,
			["4"]: Color3,
			["5"]: Color3,
			["6"]: Color3,
			["7"]: Color3,
			["8"]: Color3,
			["9"]: Color3,
		},
		gray: {
			["0"]: Color3,
			["1"]: Color3,
			["2"]: Color3,
			["3"]: Color3,
			["4"]: Color3,
			["5"]: Color3,
			["6"]: Color3,
			["7"]: Color3,
			["8"]: Color3,
			["9"]: Color3,
		},
		red: {
			["0"]: Color3,
			["1"]: Color3,
			["2"]: Color3,
			["3"]: Color3,
			["4"]: Color3,
			["5"]: Color3,
			["6"]: Color3,
			["7"]: Color3,
			["8"]: Color3,
			["9"]: Color3,
		},
		green: {
			["0"]: Color3,
			["1"]: Color3,
			["2"]: Color3,
			["3"]: Color3,
			["4"]: Color3,
			["5"]: Color3,
			["6"]: Color3,
			["7"]: Color3,
			["8"]: Color3,
			["9"]: Color3,
		},
		yellow: {
			["0"]: Color3,
			["1"]: Color3,
			["2"]: Color3,
			["3"]: Color3,
			["4"]: Color3,
			["5"]: Color3,
			["6"]: Color3,
			["7"]: Color3,
			["8"]: Color3,
			["9"]: Color3,
		},
		blue: {
			["0"]: Color3,
			["1"]: Color3,
			["2"]: Color3,
			["3"]: Color3,
			["4"]: Color3,
			["5"]: Color3,
			["6"]: Color3,
			["7"]: Color3,
			["8"]: Color3,
			["9"]: Color3,
		},
	},
	primary: {
		main: Color3,
		light: Color3,
		dark: Color3,
		contrast: Color3,
	},
	secondary: {
		main: Color3,
		light: Color3,
		dark: Color3,
		contrast: Color3,
	},
	error: {
		main: Color3,
		light: Color3,
		dark: Color3,
		contrast: Color3,
	},
	warning: {
		main: Color3,
		light: Color3,
		dark: Color3,
		contrast: Color3,
	},
	info: {
		main: Color3,
		light: Color3,
		dark: Color3,
		contrast: Color3,
	},
	success: {
		main: Color3,
		light: Color3,
		dark: Color3,
		contrast: Color3,
	},
	text: {
		disabled: Color3,
		primary: Color3,
		secondary: Color3,
		inverse: Color3,
	},
	background: {
		default: Color3,
		surface: Color3,
		raised: Color3,
	},
	border: {
		default: Color3,
		subtle: Color3,
		strong: Color3,
	},
	action: {
		disabled: Color3,
		hover: Color3,
		pressed: Color3,
		disabledBackground: Color3,
	},
}

export type ThemeDensity = "default" | "compact"

export type ThemeShadow = {
	color: Color3,
	thickness: number,
	transparency: number,
}

export type ThemeMotion = {
	duration: {
		instant: number,
		fast: number,
		normal: number,
		slow: number,
	},
	easing: {
		linear: ThemeMotionEasing,
		standard: ThemeMotionEasing,
		out: ThemeMotionEasing,
		["in"]: ThemeMotionEasing,
		inOut: ThemeMotionEasing,
	},
}

export type ThemeOverride = {
	colors: (nil | PartialThemeColors)?,
	density: (nil | "default" | "compact")?,
	spacing: (nil | {
		xs: (nil | number)?,
		sm: (nil | number)?,
		md: (nil | number)?,
		lg: (nil | number)?,
		xl: (nil | number)?,
	})?,
	radius: (nil | {
		xs: (nil | number)?,
		sm: (nil | number)?,
		md: (nil | number)?,
		lg: (nil | number)?,
		xl: (nil | number)?,
	})?,
	fontSizes: (nil | {
		xs: (nil | number)?,
		sm: (nil | number)?,
		md: (nil | number)?,
		lg: (nil | number)?,
		xl: (nil | number)?,
	})?,
	lineHeights: (nil | {
		xs: (nil | number)?,
		sm: (nil | number)?,
		md: (nil | number)?,
		lg: (nil | number)?,
		xl: (nil | number)?,
	})?,
	fontFamily: (nil | Enum.Font)?,
	shadows: (nil | {
		xs: (nil | {
			color: (nil | Color3)?,
			thickness: (nil | number)?,
			transparency: (nil | number)?,
		})?,
		sm: (nil | {
			color: (nil | Color3)?,
			thickness: (nil | number)?,
			transparency: (nil | number)?,
		})?,
		md: (nil | {
			color: (nil | Color3)?,
			thickness: (nil | number)?,
			transparency: (nil | number)?,
		})?,
		lg: (nil | {
			color: (nil | Color3)?,
			thickness: (nil | number)?,
			transparency: (nil | number)?,
		})?,
		xl: (nil | {
			color: (nil | Color3)?,
			thickness: (nil | number)?,
			transparency: (nil | number)?,
		})?,
	})?,
	motion: (nil | PartialThemeMotion)?,
}

export type LucideIconAtlasSize = number

export type ButtonVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	textColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
	scale: number,
	shouldRenderStroke: boolean,
}

export type ButtonStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
	state: InteractionState,
}

export type InteractionState = "disabled" | "pressed" | "idle" | "hovered"

export type InputVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
	strokeThickness: number,
	textColor: Color3,
	placeholderColor: Color3,
}

export type InputStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
	readOnly: boolean,
	state: InputInteractionState,
}

export type KeybindInputVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
	strokeThickness: number,
	labelColor: Color3,
	labelTransparency: number,
	hintColor: Color3,
	hintTransparency: number,
	deviceBackgroundColor: Color3,
	deviceBackgroundTransparency: number,
	deviceIconColor: Color3,
	keycapBackgroundColor: Color3,
	keycapBackgroundTransparency: number,
	keycapStrokeColor: Color3,
	keycapStrokeTransparency: number,
	keycapStrokeThickness: number,
}

export type KeybindInputStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
	state: KeybindInputInteractionState,
	hasValue: boolean,
}

export type CheckboxVisualStyles = {
	markColor: Color3,
	markStrokeColor: Color3,
	markStrokeTransparency: number,
	fillColor: Color3,
	fillTransparency: number,
	glyphColor: Color3,
	glyphTransparency: number,
	labelColor: Color3,
}

export type CheckboxStyleOverrideContext = {
	theme: Theme,
	color: SemanticIntent,
	size: ThemeSize,
	state: InteractionState,
	checked: boolean,
}

export type ProgressVisualStyles = {
	trackColor: Color3,
	trackStrokeColor: Color3,
	trackStrokeTransparency: number,
	fillColor: Color3,
	labelColor: Color3,
	valueLabelColor: Color3,
}

export type ProgressStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
}

export type CircularProgressVisualStyles = {
	trackColor: Color3,
	trackTransparency: number,
	fillColor: Color3,
	fillTailColor: Color3,
	labelColor: Color3,
	valueLabelColor: Color3,
}

export type CircularProgressStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
}

export type SwitchVisualStyles = {
	trackColor: Color3,
	trackStrokeColor: Color3,
	trackStrokeTransparency: number,
	thumbColor: Color3,
	thumbStrokeColor: Color3,
	thumbStrokeTransparency: number,
	thumbOffset: number,
	iconColor: Color3,
	iconTransparency: number,
	labelColor: Color3,
}

export type SwitchStyleOverrideContext = {
	theme: Theme,
	color: SemanticIntent,
	size: ThemeSize,
	state: InteractionState,
	checked: boolean,
}

export type SegmentedControlFrameVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
}

export type SegmentedControlFrameStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
	disabled: boolean,
}

export type SegmentedControlSegmentVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	strokeColor: Color3,
	strokeTransparency: number,
	textColor: Color3,
	textTransparency: number,
}

export type SegmentedControlSegmentStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
	option: SegmentedControlOption,
	state: SegmentedControlSegmentState,
}

export type SegmentedControlIndicatorVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	strokeColor: Color3,
	strokeTransparency: number,
}

export type SegmentedControlIndicatorStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
	disabled: boolean,
}

export type TabsListVisualStyles = {
	strokeColor: Color3,
	strokeTransparency: number,
}

export type TabsListStyleOverrideContext = {
	theme: Theme,
	variant: TabsVariant,
	color: SemanticIntent,
	size: ThemeSize,
	disabled: boolean,
}

export type TabsTabVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	strokeColor: Color3,
	strokeTransparency: number,
	textColor: Color3,
	textTransparency: number,
	indicatorColor: Color3,
	indicatorTransparency: number,
}

export type TabsTabStyleOverrideContext = {
	theme: Theme,
	variant: TabsVariant,
	color: SemanticIntent,
	size: ThemeSize,
	tab: TabsTab,
	state: TabsTabState,
}

export type TabsPanelVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	strokeColor: Color3,
	strokeTransparency: number,
}

export type TabsPanelStyleOverrideContext = {
	theme: Theme,
	variant: TabsVariant,
	color: SemanticIntent,
	size: ThemeSize,
	disabled: boolean,
}

export type StepperInputFrameVisualStyles = {
	backgroundColor: Color3,
	inputBackgroundColor: Color3,
	inputBackgroundTransparency: number,
	strokeColor: Color3,
	strokeTransparency: number,
	strokeThickness: number,
	textColor: Color3,
	placeholderColor: Color3,
	railFillColor: Color3,
	railFillTransparency: number,
}

export type StepperInputFrameStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	size: ThemeSize,
	state: StepperInputFrameState,
	readOnly: boolean,
}

export type StepperInputButtonVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	strokeColor: Color3,
	strokeTransparency: number,
	textColor: Color3,
}

export type StepperInputButtonStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	size: ThemeSize,
	state: StepperInputButtonState,
	control: "decrement" | "increment",
}

export type PopoverVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
	strokeThickness: number,
	textColor: Color3,
	shadow: ThemeShadow,
}

export type PopoverStyleOverrideContext = {
	theme: Theme,
}

export type MenuActionItem = {
	["type"]: (nil | "item")?,
	value: string,
	label: string | number,
	disabled: (nil | boolean)?,
	color: (nil | "primary" | "secondary" | "error" | "warning" | "info" | "success")?,
	icon: Icons.Name?,
	rightSection: (nil | string | number | React.ReactElement)?,
	closeMenuOnPress: (nil | boolean)?,
	onPress: (nil | ((value: string) -> ()))?,
}

export type MenuDividerItem = {
	["type"]: "divider",
}

export type MenuLabelItem = {
	["type"]: "label",
	label: string | number,
}

export type MenuPanelVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
	dividerColor: Color3,
	dividerTransparency: number,
	labelColor: Color3,
	labelTransparency: number,
}

export type MenuPanelStyleOverrideContext = {
	theme: Theme,
	size: ThemeSize,
}

export type MenuItemVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	textColor: Color3,
	textTransparency: number,
	rightTextColor: Color3,
	rightTextTransparency: number,
}

export type MenuItemStyleOverrideContext = {
	theme: Theme,
	size: ThemeSize,
	item: MenuActionItem,
	state: InteractionState,
}

export type SelectTriggerVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
	strokeThickness: number,
	textColor: Color3,
	placeholderColor: Color3,
	indicatorColor: Color3,
	indicatorRotation: number,
}

export type SelectTriggerStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
	state: SelectTriggerState,
	hasValue: boolean,
}

export type SelectListVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
}

export type SelectListStyleOverrideContext = {
	theme: Theme,
	variant: Variant,
	color: SemanticIntent,
	size: ThemeSize,
}

export type SelectOptionVisualStyles = {
	backgroundColor: Color3,
	backgroundTransparency: number,
	textColor: Color3,
	textTransparency: number,
}

export type SelectOptionStyleOverrideContext = {
	theme: Theme,
	color: SemanticIntent,
	size: ThemeSize,
	option: SelectOption,
	state: SelectOptionState,
}

export type SliderVisualStyles = {
	trackColor: Color3,
	trackStrokeColor: Color3,
	trackStrokeTransparency: number,
	rangeColor: Color3,
	thumbColor: Color3,
	thumbStrokeColor: Color3,
	thumbStrokeTransparency: number,
	labelColor: Color3,
	valueLabelColor: Color3,
}

export type SliderStyleOverrideContext = {
	theme: Theme,
	color: SemanticIntent,
	size: ThemeSize,
	state: SliderInteractionState,
}

export type TooltipVisualStyles = {
	backgroundColor: Color3,
	strokeColor: Color3,
	strokeTransparency: number,
	textColor: Color3,
	tailFillColor: Color3,
	tailBorderColor: Color3,
	tailBorderTransparency: number,
	shadow: ThemeShadow,
}

export type TooltipStyleOverrideContext = {
	theme: Theme,
}

export type ThemeMotionEasing = {
	style: Enum.EasingStyle,
	direction: Enum.EasingDirection,
}

export type PartialThemeColors = {
	palette: (nil | {
		primary: (nil | {
			["0"]: (nil | Color3)?,
			["1"]: (nil | Color3)?,
			["2"]: (nil | Color3)?,
			["3"]: (nil | Color3)?,
			["4"]: (nil | Color3)?,
			["5"]: (nil | Color3)?,
			["6"]: (nil | Color3)?,
			["7"]: (nil | Color3)?,
			["8"]: (nil | Color3)?,
			["9"]: (nil | Color3)?,
		})?,
		gray: (nil | {
			["0"]: (nil | Color3)?,
			["1"]: (nil | Color3)?,
			["2"]: (nil | Color3)?,
			["3"]: (nil | Color3)?,
			["4"]: (nil | Color3)?,
			["5"]: (nil | Color3)?,
			["6"]: (nil | Color3)?,
			["7"]: (nil | Color3)?,
			["8"]: (nil | Color3)?,
			["9"]: (nil | Color3)?,
		})?,
		red: (nil | {
			["0"]: (nil | Color3)?,
			["1"]: (nil | Color3)?,
			["2"]: (nil | Color3)?,
			["3"]: (nil | Color3)?,
			["4"]: (nil | Color3)?,
			["5"]: (nil | Color3)?,
			["6"]: (nil | Color3)?,
			["7"]: (nil | Color3)?,
			["8"]: (nil | Color3)?,
			["9"]: (nil | Color3)?,
		})?,
		green: (nil | {
			["0"]: (nil | Color3)?,
			["1"]: (nil | Color3)?,
			["2"]: (nil | Color3)?,
			["3"]: (nil | Color3)?,
			["4"]: (nil | Color3)?,
			["5"]: (nil | Color3)?,
			["6"]: (nil | Color3)?,
			["7"]: (nil | Color3)?,
			["8"]: (nil | Color3)?,
			["9"]: (nil | Color3)?,
		})?,
		yellow: (nil | {
			["0"]: (nil | Color3)?,
			["1"]: (nil | Color3)?,
			["2"]: (nil | Color3)?,
			["3"]: (nil | Color3)?,
			["4"]: (nil | Color3)?,
			["5"]: (nil | Color3)?,
			["6"]: (nil | Color3)?,
			["7"]: (nil | Color3)?,
			["8"]: (nil | Color3)?,
			["9"]: (nil | Color3)?,
		})?,
		blue: (nil | {
			["0"]: (nil | Color3)?,
			["1"]: (nil | Color3)?,
			["2"]: (nil | Color3)?,
			["3"]: (nil | Color3)?,
			["4"]: (nil | Color3)?,
			["5"]: (nil | Color3)?,
			["6"]: (nil | Color3)?,
			["7"]: (nil | Color3)?,
			["8"]: (nil | Color3)?,
			["9"]: (nil | Color3)?,
		})?,
	})?,
	primary: (nil | {
		main: (nil | Color3)?,
		light: (nil | Color3)?,
		dark: (nil | Color3)?,
		contrast: (nil | Color3)?,
	})?,
	secondary: (nil | {
		main: (nil | Color3)?,
		light: (nil | Color3)?,
		dark: (nil | Color3)?,
		contrast: (nil | Color3)?,
	})?,
	error: (nil | {
		main: (nil | Color3)?,
		light: (nil | Color3)?,
		dark: (nil | Color3)?,
		contrast: (nil | Color3)?,
	})?,
	warning: (nil | {
		main: (nil | Color3)?,
		light: (nil | Color3)?,
		dark: (nil | Color3)?,
		contrast: (nil | Color3)?,
	})?,
	info: (nil | {
		main: (nil | Color3)?,
		light: (nil | Color3)?,
		dark: (nil | Color3)?,
		contrast: (nil | Color3)?,
	})?,
	success: (nil | {
		main: (nil | Color3)?,
		light: (nil | Color3)?,
		dark: (nil | Color3)?,
		contrast: (nil | Color3)?,
	})?,
	text: (nil | {
		disabled: (nil | Color3)?,
		primary: (nil | Color3)?,
		secondary: (nil | Color3)?,
		inverse: (nil | Color3)?,
	})?,
	background: (nil | {
		default: (nil | Color3)?,
		surface: (nil | Color3)?,
		raised: (nil | Color3)?,
	})?,
	border: (nil | {
		default: (nil | Color3)?,
		subtle: (nil | Color3)?,
		strong: (nil | Color3)?,
	})?,
	action: (nil | {
		disabled: (nil | Color3)?,
		hover: (nil | Color3)?,
		pressed: (nil | Color3)?,
		disabledBackground: (nil | Color3)?,
	})?,
}

export type PartialThemeMotion = {
	duration: (nil | {
		instant: (nil | number)?,
		fast: (nil | number)?,
		normal: (nil | number)?,
		slow: (nil | number)?,
	})?,
	easing: (nil | {
		linear: (nil | {
			style: (nil | Enum.EasingStyle)?,
			direction: (nil | Enum.EasingDirection)?,
		})?,
		standard: (nil | {
			style: (nil | Enum.EasingStyle)?,
			direction: (nil | Enum.EasingDirection)?,
		})?,
		out: (nil | {
			style: (nil | Enum.EasingStyle)?,
			direction: (nil | Enum.EasingDirection)?,
		})?,
		["in"]: (nil | {
			style: (nil | Enum.EasingStyle)?,
			direction: (nil | Enum.EasingDirection)?,
		})?,
		inOut: (nil | {
			style: (nil | Enum.EasingStyle)?,
			direction: (nil | Enum.EasingDirection)?,
		})?,
	})?,
}

export type Variant = "light" | "subtle" | "filled" | "outline"

export type SemanticIntent = "primary" | "secondary" | "error" | "warning" | "info" | "success"

export type InputInteractionState = "disabled" | "idle" | "hovered" | "focused"

export type KeybindInputInteractionState = "disabled" | "pressed" | "idle" | "hovered" | "capturing" | "readOnly"

export type SegmentedControlSegmentState = "disabled" | "pressed" | "idle" | "hovered" | "selected"

export type TabsVariant = "line" | "contained"

export type TabsTabState = "disabled" | "pressed" | "idle" | "hovered" | "focused" | "selected"

export type StepperInputFrameState = "disabled" | "idle" | "hovered" | "focused"

export type StepperInputButtonState = "disabled" | "pressed" | "idle" | "hovered"

export type SelectTriggerState = "disabled" | "pressed" | "idle" | "hovered" | "open"

export type SelectOptionState = "disabled" | "idle" | "hovered" | "selected"

export type SliderInteractionState = "disabled" | "pressed" | "idle" | "hovered"

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
	Box: React.AbstractComponent<BoxProps, Instance>,
	Text: React.AbstractComponent<TextProps, Instance>,
	Stack: React.AbstractComponent<StackProps, Instance>,
	Divider: React.AbstractComponent<DividerProps, Instance>,
	Button: React.AbstractComponent<ButtonProps, Instance>,
	Pressable: React.AbstractComponent<PressableProps, Instance>,
	Draggable: React.AbstractComponent<DraggableProps<DraggableItem>, Instance>,
	Icon: React.AbstractComponent<IconProps, Instance>,
	Image: React.AbstractComponent<ImageProps, Instance>,
	Avatar: React.AbstractComponent<AvatarProps, Instance>,
	Input: React.AbstractComponent<InputProps, Instance>,
	KeybindInput: React.AbstractComponent<KeybindInputProps, Instance>,
	Card: React.AbstractComponent<CardProps, Instance>,
	Checkbox: React.AbstractComponent<CheckboxProps, Instance>,
	Progress: React.AbstractComponent<ProgressProps, Instance>,
	CircularProgress: React.AbstractComponent<CircularProgressProps, Instance>,
	WorldPortal: React.AbstractComponent<WorldPortalProps, Instance>,
	Switch: React.AbstractComponent<SwitchProps, Instance>,
	SegmentedControl: React.AbstractComponent<SegmentedControlProps, Instance>,
	Tabs: React.AbstractComponent<TabsProps, Instance>,
	StepperInput: React.AbstractComponent<StepperInputProps, Instance>,
	Popover: React.AbstractComponent<PopoverProps, Instance>,
	Menu: React.AbstractComponent<MenuProps, Instance>,
	Select: React.AbstractComponent<SelectProps, Instance>,
	Modal: React.AbstractComponent<ModalProps, Instance>,
	Window: React.AbstractComponent<WindowProps, Instance>,
	Slider: React.AbstractComponent<SliderProps, Instance>,
	Tooltip: React.AbstractComponent<TooltipProps, Instance>,
	Backdrop: React.AbstractComponent<BackdropProps, Instance>,
	ScrollArea: React.AbstractComponent<ScrollAreaProps, Instance>,
	DEFAULT_THEME: Theme,
	DEFAULT_DARK_THEME: Theme,
	theme: {
		primary: {
			main: ThemeColorRef<"primary.main">,
			light: ThemeColorRef<"primary.light">,
			dark: ThemeColorRef<"primary.dark">,
			contrast: ThemeColorRef<"primary.contrast">,
		},
		secondary: {
			main: ThemeColorRef<"secondary.main">,
			light: ThemeColorRef<"secondary.light">,
			dark: ThemeColorRef<"secondary.dark">,
			contrast: ThemeColorRef<"secondary.contrast">,
		},
		error: {
			main: ThemeColorRef<"error.main">,
			light: ThemeColorRef<"error.light">,
			dark: ThemeColorRef<"error.dark">,
			contrast: ThemeColorRef<"error.contrast">,
		},
		warning: {
			main: ThemeColorRef<"warning.main">,
			light: ThemeColorRef<"warning.light">,
			dark: ThemeColorRef<"warning.dark">,
			contrast: ThemeColorRef<"warning.contrast">,
		},
		info: {
			main: ThemeColorRef<"info.main">,
			light: ThemeColorRef<"info.light">,
			dark: ThemeColorRef<"info.dark">,
			contrast: ThemeColorRef<"info.contrast">,
		},
		success: {
			main: ThemeColorRef<"success.main">,
			light: ThemeColorRef<"success.light">,
			dark: ThemeColorRef<"success.dark">,
			contrast: ThemeColorRef<"success.contrast">,
		},
		text: {
			primary: ThemeColorRef<"text.primary">,
			secondary: ThemeColorRef<"text.secondary">,
			disabled: ThemeColorRef<"text.disabled">,
			inverse: ThemeColorRef<"text.inverse">,
		},
		background: {
			default: ThemeColorRef<"background.default">,
			surface: ThemeColorRef<"background.surface">,
			raised: ThemeColorRef<"background.raised">,
		},
		border: {
			subtle: ThemeColorRef<"border.subtle">,
			default: ThemeColorRef<"border.default">,
			strong: ThemeColorRef<"border.strong">,
		},
		action: {
			hover: ThemeColorRef<"action.hover">,
			pressed: ThemeColorRef<"action.pressed">,
			disabled: ThemeColorRef<"action.disabled">,
			disabledBackground: ThemeColorRef<"action.disabledBackground">,
		},
		palette: {
			gray: {
				["0"]: ThemeColorRef<"palette.gray.0">,
				["1"]: ThemeColorRef<"palette.gray.1">,
				["2"]: ThemeColorRef<"palette.gray.2">,
				["3"]: ThemeColorRef<"palette.gray.3">,
				["4"]: ThemeColorRef<"palette.gray.4">,
				["5"]: ThemeColorRef<"palette.gray.5">,
				["6"]: ThemeColorRef<"palette.gray.6">,
				["7"]: ThemeColorRef<"palette.gray.7">,
				["8"]: ThemeColorRef<"palette.gray.8">,
				["9"]: ThemeColorRef<"palette.gray.9">,
			},
			primary: {
				["0"]: ThemeColorRef<"palette.primary.0">,
				["1"]: ThemeColorRef<"palette.primary.1">,
				["2"]: ThemeColorRef<"palette.primary.2">,
				["3"]: ThemeColorRef<"palette.primary.3">,
				["4"]: ThemeColorRef<"palette.primary.4">,
				["5"]: ThemeColorRef<"palette.primary.5">,
				["6"]: ThemeColorRef<"palette.primary.6">,
				["7"]: ThemeColorRef<"palette.primary.7">,
				["8"]: ThemeColorRef<"palette.primary.8">,
				["9"]: ThemeColorRef<"palette.primary.9">,
			},
			red: {
				["0"]: ThemeColorRef<"palette.red.0">,
				["1"]: ThemeColorRef<"palette.red.1">,
				["2"]: ThemeColorRef<"palette.red.2">,
				["3"]: ThemeColorRef<"palette.red.3">,
				["4"]: ThemeColorRef<"palette.red.4">,
				["5"]: ThemeColorRef<"palette.red.5">,
				["6"]: ThemeColorRef<"palette.red.6">,
				["7"]: ThemeColorRef<"palette.red.7">,
				["8"]: ThemeColorRef<"palette.red.8">,
				["9"]: ThemeColorRef<"palette.red.9">,
			},
			green: {
				["0"]: ThemeColorRef<"palette.green.0">,
				["1"]: ThemeColorRef<"palette.green.1">,
				["2"]: ThemeColorRef<"palette.green.2">,
				["3"]: ThemeColorRef<"palette.green.3">,
				["4"]: ThemeColorRef<"palette.green.4">,
				["5"]: ThemeColorRef<"palette.green.5">,
				["6"]: ThemeColorRef<"palette.green.6">,
				["7"]: ThemeColorRef<"palette.green.7">,
				["8"]: ThemeColorRef<"palette.green.8">,
				["9"]: ThemeColorRef<"palette.green.9">,
			},
			yellow: {
				["0"]: ThemeColorRef<"palette.yellow.0">,
				["1"]: ThemeColorRef<"palette.yellow.1">,
				["2"]: ThemeColorRef<"palette.yellow.2">,
				["3"]: ThemeColorRef<"palette.yellow.3">,
				["4"]: ThemeColorRef<"palette.yellow.4">,
				["5"]: ThemeColorRef<"palette.yellow.5">,
				["6"]: ThemeColorRef<"palette.yellow.6">,
				["7"]: ThemeColorRef<"palette.yellow.7">,
				["8"]: ThemeColorRef<"palette.yellow.8">,
				["9"]: ThemeColorRef<"palette.yellow.9">,
			},
			blue: {
				["0"]: ThemeColorRef<"palette.blue.0">,
				["1"]: ThemeColorRef<"palette.blue.1">,
				["2"]: ThemeColorRef<"palette.blue.2">,
				["3"]: ThemeColorRef<"palette.blue.3">,
				["4"]: ThemeColorRef<"palette.blue.4">,
				["5"]: ThemeColorRef<"palette.blue.5">,
				["6"]: ThemeColorRef<"palette.blue.6">,
				["7"]: ThemeColorRef<"palette.blue.7">,
				["8"]: ThemeColorRef<"palette.blue.8">,
				["9"]: ThemeColorRef<"palette.blue.9">,
			},
		},
	},
	ThemeProvider: (ThemeProviderProps) -> React.ReactElement,
	useTheme: () -> Theme,
	resolveColor: (theme: Theme, value: ConcreteColorValue) -> Color3,
	resolveSize: (theme: Theme, key: ThemeSize, scale: "radius" | "spacing" | "fontSizes") -> number,
	toUDim: (value: SizeValue) -> UDim,
	toUDim2: (value: SizeValue2D) -> UDim2,
	toUDimAxis: (value: SizeValue, _axis: "x" | "y") -> UDim,
	SUPPORTED_LUCIDE_ICON_NAMES: { string },
	getLucideIconAsset: (name: string, requestedSize: nil | number) -> nil | LucideIconAsset,
	isLucideIconName: (name: string) -> boolean,
	useMotion: (MotionOptions) -> { [string]: number | Color3 },
	styled: <P>(React.AbstractComponent<P, Instance>) -> ({ [string]: any }) -> React.AbstractComponent<P, Instance>,
}

return {}
