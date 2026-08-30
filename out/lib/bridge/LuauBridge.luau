-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local ReactRoblox = TS.import(script, TS.getModule(script, "@rbxts", "react-roblox"))
local Backdrop = TS.import(script, script.Parent.Parent, "components", "Backdrop").Backdrop
local Box = TS.import(script, script.Parent.Parent, "components", "Box").Box
local Button = TS.import(script, script.Parent.Parent, "components", "Button").Button
local Card = TS.import(script, script.Parent.Parent, "components", "Card").Card
local Divider = TS.import(script, script.Parent.Parent, "components", "Divider").Divider
local Draggable = TS.import(script, script.Parent.Parent, "components", "Draggable").Draggable
local Icon = TS.import(script, script.Parent.Parent, "components", "Icon").Icon
local Image = TS.import(script, script.Parent.Parent, "components", "Image").Image
local Input = TS.import(script, script.Parent.Parent, "components", "Input").Input
local Modal = TS.import(script, script.Parent.Parent, "components", "Modal").Modal
local Popover = TS.import(script, script.Parent.Parent, "components", "Popover").Popover
local Pressable = TS.import(script, script.Parent.Parent, "components", "Pressable").Pressable
local ScrollArea = TS.import(script, script.Parent.Parent, "components", "ScrollArea").ScrollArea
local SegmentedControl = TS.import(script, script.Parent.Parent, "components", "SegmentedControl").SegmentedControl
local Select = TS.import(script, script.Parent.Parent, "components", "Select").Select
local Slider = TS.import(script, script.Parent.Parent, "components", "Slider").Slider
local Stack = TS.import(script, script.Parent.Parent, "components", "Stack").Stack
local StepperInput = TS.import(script, script.Parent.Parent, "components", "StepperInput").StepperInput
local Switch = TS.import(script, script.Parent.Parent, "components", "Switch").Switch
local Text = TS.import(script, script.Parent.Parent, "components", "Text").Text
local Tooltip = TS.import(script, script.Parent.Parent, "components", "Tooltip").Tooltip
local _theme = TS.import(script, script.Parent.Parent, "theme")
local ThemeProvider = _theme.ThemeProvider
local themeRefs = _theme.theme
local bridgeDiagnostics = TS.import(script, script.Parent.Parent, "utils", "diagnostics").bridgeDiagnostics
local function readProps(node)
	return node.props or {}
end
local function readString(props, key, fallback)
	local value = props[key]
	return if type(value) == "string" then value else fallback
end
local function readStringOrNumber(props, key)
	local value = props[key]
	return if type(value) == "string" or type(value) == "number" then value else nil
end
local function readNumber(props, key)
	local value = props[key]
	return if type(value) == "number" then value else nil
end
local function readThemeSize(props, key, fallback)
	local value = readString(props, key, fallback)
	repeat
		local _fallthrough = false
		if value == "xs" then
			_fallthrough = true
		end
		if _fallthrough or value == "sm" then
			_fallthrough = true
		end
		if _fallthrough or value == "md" then
			_fallthrough = true
		end
		if _fallthrough or value == "lg" then
			_fallthrough = true
		end
		if _fallthrough or value == "xl" then
			return value
		end
		return fallback
	until true
end
local function readVariant(props, key, fallback)
	local value = readString(props, key, fallback)
	repeat
		local _fallthrough = false
		if value == "filled" then
			_fallthrough = true
		end
		if _fallthrough or value == "light" then
			_fallthrough = true
		end
		if _fallthrough or value == "outline" then
			_fallthrough = true
		end
		if _fallthrough or value == "subtle" then
			return value
		end
		return fallback
	until true
end
local function readIntent(props, key, fallback)
	local value = readString(props, key, fallback)
	repeat
		local _fallthrough = false
		if value == "primary" then
			_fallthrough = true
		end
		if _fallthrough or value == "secondary" then
			_fallthrough = true
		end
		if _fallthrough or value == "success" then
			_fallthrough = true
		end
		if _fallthrough or value == "warning" then
			_fallthrough = true
		end
		if _fallthrough or value == "error" then
			_fallthrough = true
		end
		if _fallthrough or value == "info" then
			return value
		end
		return fallback
	until true
end
local function readCursor(props, key)
	local value = readString(props, key)
	repeat
		local _fallthrough = false
		if value == "default" then
			_fallthrough = true
		end
		if _fallthrough or value == "pointer" then
			_fallthrough = true
		end
		if _fallthrough or value == "grab" then
			_fallthrough = true
		end
		if _fallthrough or value == "grabbing" then
			_fallthrough = true
		end
		if _fallthrough or value == "resize-ew" then
			_fallthrough = true
		end
		if _fallthrough or value == "resize-ns" then
			_fallthrough = true
		end
		if _fallthrough or value == "resize-nesw" then
			_fallthrough = true
		end
		if _fallthrough or value == "resize-nwse" then
			_fallthrough = true
		end
		if _fallthrough or value == "resize-all" then
			_fallthrough = true
		end
		if _fallthrough or value == "split-ew" then
			_fallthrough = true
		end
		if _fallthrough or value == "split-ns" then
			_fallthrough = true
		end
		if _fallthrough or value == "forbidden" then
			_fallthrough = true
		end
		if _fallthrough or value == "wait" then
			_fallthrough = true
		end
		if _fallthrough or value == "busy" then
			_fallthrough = true
		end
		if _fallthrough or value == "crosshair" then
			return value
		end
		return if value ~= nil and string.sub(value, 1, 11) == "rbxasset://" then value else nil
	until true
end
local function readDividerOrientation(props)
	local value = readString(props, "orientation")
	return if value == "horizontal" or value == "vertical" then value else nil
end
local function readCardVariant(props)
	local value = readString(props, "variant")
	repeat
		local _fallthrough = false
		if value == "surface" then
			_fallthrough = true
		end
		if _fallthrough or value == "outline" then
			_fallthrough = true
		end
		if _fallthrough or value == "subtle" then
			_fallthrough = true
		end
		if _fallthrough or value == "elevated" then
			return value
		end
		return nil
	until true
end
local function readIconName(props)
	local value = readString(props, "name", "settings")
	repeat
		local _fallthrough = false
		if value == "alert-circle" then
			_fallthrough = true
		end
		if _fallthrough or value == "check" then
			_fallthrough = true
		end
		if _fallthrough or value == "chevron-right" then
			_fallthrough = true
		end
		if _fallthrough or value == "info" then
			_fallthrough = true
		end
		if _fallthrough or value == "search" then
			_fallthrough = true
		end
		if _fallthrough or value == "server" then
			_fallthrough = true
		end
		if _fallthrough or value == "settings" then
			_fallthrough = true
		end
		if _fallthrough or value == "x" then
			return value
		end
		return "settings"
	until true
end
local function readModalSize(props)
	local value = readString(props, "size", "sm")
	repeat
		local _fallthrough = false
		if value == "sm" then
			_fallthrough = true
		end
		if _fallthrough or value == "md" then
			_fallthrough = true
		end
		if _fallthrough or value == "lg" then
			_fallthrough = true
		end
		if _fallthrough or value == "xl" then
			return value
		end
		return "sm"
	until true
end
local function readScrollAreaDirection(props)
	local value = readString(props, "direction")
	repeat
		local _fallthrough = false
		if value == "vertical" then
			_fallthrough = true
		end
		if _fallthrough or value == "horizontal" then
			_fallthrough = true
		end
		if _fallthrough or value == "both" then
			return value
		end
		return nil
	until true
end
local function readPopoverPlacement(props)
	local value = readString(props, "placement")
	repeat
		local _fallthrough = false
		if value == "top" then
			_fallthrough = true
		end
		if _fallthrough or value == "bottom" then
			_fallthrough = true
		end
		if _fallthrough or value == "left" then
			_fallthrough = true
		end
		if _fallthrough or value == "right" then
			return value
		end
		return nil
	until true
end
local function readPopoverAlign(props)
	local value = readString(props, "align")
	repeat
		local _fallthrough = false
		if value == "start" then
			_fallthrough = true
		end
		if _fallthrough or value == "center" then
			_fallthrough = true
		end
		if _fallthrough or value == "end" then
			return value
		end
		return nil
	until true
end
local function readPopoverTriggerMode(props)
	local value = readString(props, "triggerMode")
	repeat
		local _fallthrough = false
		if value == "click" then
			_fallthrough = true
		end
		if _fallthrough or value == "hover" then
			_fallthrough = true
		end
		if _fallthrough or value == "manual" then
			return value
		end
		return nil
	until true
end
local function readStackDirection(props)
	local value = readString(props, "direction")
	return if value == "vertical" or value == "horizontal" then value else nil
end
local function readStackAlign(props)
	local value = readString(props, "align")
	repeat
		local _fallthrough = false
		if value == "start" then
			_fallthrough = true
		end
		if _fallthrough or value == "center" then
			_fallthrough = true
		end
		if _fallthrough or value == "end" then
			_fallthrough = true
		end
		if _fallthrough or value == "stretch" then
			return value
		end
		return nil
	until true
end
local function readStackJustify(props)
	local value = readString(props, "justify")
	repeat
		local _fallthrough = false
		if value == "start" then
			_fallthrough = true
		end
		if _fallthrough or value == "center" then
			_fallthrough = true
		end
		if _fallthrough or value == "end" then
			_fallthrough = true
		end
		if _fallthrough or value == "fill" then
			_fallthrough = true
		end
		if _fallthrough or value == "spaceAround" then
			_fallthrough = true
		end
		if _fallthrough or value == "spaceBetween" then
			_fallthrough = true
		end
		if _fallthrough or value == "spaceEvenly" then
			return value
		end
		return nil
	until true
end
local function readTextAlign(props)
	local value = readString(props, "align")
	repeat
		local _fallthrough = false
		if value == "left" then
			_fallthrough = true
		end
		if _fallthrough or value == "center" then
			_fallthrough = true
		end
		if _fallthrough or value == "right" then
			return value
		end
		return nil
	until true
end
local function readTextVerticalAlign(props)
	local value = readString(props, "valign")
	repeat
		local _fallthrough = false
		if value == "top" then
			_fallthrough = true
		end
		if _fallthrough or value == "middle" then
			_fallthrough = true
		end
		if _fallthrough or value == "bottom" then
			return value
		end
		return nil
	until true
end
local function readTextTruncate(props)
	local value = readString(props, "truncate")
	repeat
		local _fallthrough = false
		if value == "none" then
			_fallthrough = true
		end
		if _fallthrough or value == "atend" then
			_fallthrough = true
		end
		if _fallthrough or value == "splitword" then
			return value
		end
		return nil
	until true
end
local function readAutomaticCanvasSize(props)
	local value = props.automaticCanvasSize
	if value == Enum.AutomaticSize.None or value == Enum.AutomaticSize.X or value == Enum.AutomaticSize.Y or value == Enum.AutomaticSize.XY then
		return value
	end
	return nil
end
local readUDim2, readVector2
local function readBackdropExcludeRect(props)
	local value = props.excludeRect
	if not (type(value) == "table") then
		return nil
	end
	local rectProps = value
	local position = readUDim2(rectProps, "position")
	local size = readUDim2(rectProps, "size")
	if position == nil or size == nil then
		return nil
	end
	return {
		position = position,
		size = size,
		anchor = readVector2(rectProps, "anchor"),
	}
end
local function readScaleType(props)
	local value = props.scaleType
	if value == Enum.ScaleType.Fit or value == Enum.ScaleType.Crop or value == Enum.ScaleType.Stretch or value == Enum.ScaleType.Slice or value == Enum.ScaleType.Tile then
		return value
	end
	return nil
end
local function readResampleMode(props)
	local value = props.resampleMode
	if value == Enum.ResamplerMode.Default or value == Enum.ResamplerMode.Pixelated then
		return value
	end
	return nil
end
local function readSizeValue(props, key)
	local value = props[key]
	if type(value) == "number" or type(value) == "string" or typeof(value) == "UDim" then
		return value
	end
	return nil
end
local function readSizeValue2D(props, key)
	local value = props[key]
	if typeof(value) == "UDim2" then
		return value
	end
	return nil
end
local function readColor(props, key, fallback)
	local value = props[key]
	if typeof(value) == "Color3" then
		return value
	end
	return fallback
end
local function readStrokeProps(props)
	local value = props.stroke
	if not (type(value) == "table") then
		return nil
	end
	local strokeProps = value
	local mode = strokeProps.mode
	return {
		color = readColor(strokeProps, "color"),
		thickness = readNumber(strokeProps, "thickness"),
		transparency = readNumber(strokeProps, "transparency"),
		mode = if mode == Enum.ApplyStrokeMode.Border or mode == Enum.ApplyStrokeMode.Contextual then mode else nil,
	}
end
local function readBoolean(props, key, fallback)
	local value = props[key]
	return if type(value) == "boolean" then value else fallback
end
function readUDim2(props, key)
	local value = props[key]
	return if typeof(value) == "UDim2" then value else nil
end
function readVector2(props, key)
	local value = props[key]
	return if typeof(value) == "Vector2" then value else nil
end
local function readRect(props, key)
	local value = props[key]
	return if typeof(value) == "Rect" then value else nil
end
local function readCallback(props, key)
	local value = props[key]
	return if typeof(value) == "function" then value else nil
end
local function readBooleanCallback(props, key)
	local value = props[key]
	return if typeof(value) == "function" then value else nil
end
local function readNumberCallback(props, key)
	local value = props[key]
	return if typeof(value) == "function" then value else nil
end
local function readStringCallback(props, key)
	local value = props[key]
	return if typeof(value) == "function" then value else nil
end
local function readStringArrayCallback(props, key)
	local value = props[key]
	return if typeof(value) == "function" then value else nil
end
local function readSlotProps(props)
	local value = props.slotProps
	if not (type(value) == "table") then
		return nil
	end
	local slots = {}
	for slotName, slotValue in pairs(value) do
		if type(slotName) == "string" and typeof(slotValue) == "table" then
			slots[slotName] = slotValue
		end
	end
	return slots
end
local function readSelectOptions(props)
	local value = props.options
	if not (type(value) == "table") then
		return {}
	end
	local options = {}
	for _, option in value do
		if not (type(option) == "table") then
			continue
		end
		local optionProps = option
		local optionValue = readString(optionProps, "value")
		local label = readString(optionProps, "label", optionValue)
		if optionValue == nil or label == nil then
			continue
		end
		local _arg0 = {
			value = optionValue,
			label = label,
			disabled = readBoolean(optionProps, "disabled"),
		}
		table.insert(options, _arg0)
	end
	return options
end
local function readSegmentedControlOptions(props)
	return readSelectOptions(props)
end
local function readStringArray(props, key)
	local value = props[key]
	if not (type(value) == "table") then
		return nil
	end
	local result = {}
	for _, entry in value do
		if type(entry) == "string" then
			table.insert(result, entry)
		end
	end
	return result
end
local function readDraggableItems(props)
	local value = props.items
	if not (type(value) == "table") then
		return {}
	end
	local items = {}
	for _, entry in value do
		if not (type(entry) == "table") then
			continue
		end
		local itemProps = entry
		local id = readString(itemProps, "id")
		local label = readString(itemProps, "label", id)
		if id == nil or label == nil then
			continue
		end
		local _arg0 = {
			id = id,
			label = label,
			disabled = readBoolean(itemProps, "disabled"),
		}
		table.insert(items, _arg0)
	end
	return items
end
local function warnUnknownComponent(component)
	bridgeDiagnostics:violation("unknown-component", function()
		return `[prism/bridge] Unknown component '{component}'. Rendering an empty fragment.`
	end)
end
local renderNode
local function renderChildren(children)
	if children == nil then
		return nil
	end
	local _children = children
	local _condition = type(_children) == "table"
	if _condition then
		_condition = children.component ~= nil
	end
	if _condition then
		return renderNode(children, "child")
	end
	local renderedChildren = {}
	local childIndex = 0
	for _, child in children do
		childIndex += 1
		local _arg0 = renderNode(child, tostring(childIndex))
		table.insert(renderedChildren, _arg0)
	end
	return renderedChildren
end
function renderNode(node, key)
	if key == nil then
		key = "root"
	end
	local props = readProps(node)
	local children = renderChildren(node.children)
	local _exp = node.component
	repeat
		if _exp == "Backdrop" then
			return React.createElement(Backdrop, {
				key = key,
				visible = readBoolean(props, "visible"),
				color = readColor(props, "color"),
				opacity = readNumber(props, "opacity"),
				zIndex = readNumber(props, "zIndex"),
				active = readBoolean(props, "active"),
				excludeRect = readBackdropExcludeRect(props),
				cursor = readCursor(props, "cursor"),
				onPress = readCallback(props, "onPress"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Box" then
			return React.createElement(Box, {
				key = key,
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				center = readBoolean(props, "center"),
				p = readStringOrNumber(props, "p"),
				bg = readColor(props, "bg"),
				bgTransparency = readNumber(props, "bgTransparency"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				clip = readBoolean(props, "clip"),
				cursor = readCursor(props, "cursor"),
				border = readNumber(props, "border"),
				borderColor = readColor(props, "borderColor"),
				stroke = readStrokeProps(props),
				radius = readStringOrNumber(props, "radius"),
				slotProps = readSlotProps(props),
			}, children)
		end
		if _exp == "Button" then
			return React.createElement(Button, {
				key = key,
				label = readStringOrNumber(props, "label"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readUDim2(props, "position"),
				anchor = readVector2(props, "anchor"),
				variant = readVariant(props, "variant", "subtle"),
				color = readIntent(props, "color", "secondary"),
				size = readThemeSize(props, "size"),
				disabled = readBoolean(props, "disabled"),
				fullWidth = readBoolean(props, "fullWidth"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				onPress = readCallback(props, "onPress"),
				slotProps = readSlotProps(props),
			}, children)
		end
		if _exp == "Card" then
			return React.createElement(Card, {
				key = key,
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				center = readBoolean(props, "center"),
				p = readStringOrNumber(props, "p"),
				bg = readColor(props, "bg"),
				bgTransparency = readNumber(props, "bgTransparency"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				variant = readCardVariant(props),
				border = readNumber(props, "border"),
				borderColor = readColor(props, "borderColor"),
				radius = readStringOrNumber(props, "radius"),
				shadow = readThemeSize(props, "shadow"),
				slotProps = readSlotProps(props),
			}, children)
		end
		if _exp == "Divider" then
			return React.createElement(Divider, {
				key = key,
				orientation = readDividerOrientation(props),
				color = readColor(props, "color"),
				size = readStringOrNumber(props, "size"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				cursor = readCursor(props, "cursor"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Draggable" then
			local draggableItems = readDraggableItems(props)
			return React.createElement(Draggable, {
				key = key,
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				center = readBoolean(props, "center"),
				p = readStringOrNumber(props, "p"),
				px = readStringOrNumber(props, "px"),
				py = readStringOrNumber(props, "py"),
				pt = readStringOrNumber(props, "pt"),
				pr = readStringOrNumber(props, "pr"),
				pb = readStringOrNumber(props, "pb"),
				pl = readStringOrNumber(props, "pl"),
				bg = readColor(props, "bg"),
				bgTransparency = readNumber(props, "bgTransparency"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				clip = readBoolean(props, "clip"),
				cursor = readCursor(props, "cursor"),
				gap = readStringOrNumber(props, "gap"),
				direction = readStackDirection(props),
				align = readStackAlign(props),
				justify = readStackJustify(props),
				disabled = readBoolean(props, "disabled"),
				active = readBoolean(props, "active"),
				items = draggableItems,
				value = readStringArray(props, "value"),
				defaultValue = readStringArray(props, "defaultValue"),
				onReorder = readStringArrayCallback(props, "onReorder"),
				renderItem = function(state)
					return React.createElement(Box, {
						width = if #state.item.label > 14 then 180 else 144,
						bg = if state.disabled then themeRefs.action.disabledBackground elseif state.dragging then themeRefs.primary.light else themeRefs.background.surface,
						radius = "md",
						borderColor = if state.dragging then themeRefs.primary.main else themeRefs.border.default,
						p = "sm",
					}, React.createElement(Text, {
						text = state.item.label,
						color = if state.disabled then themeRefs.text.disabled else themeRefs.text.primary,
						wrap = true,
						width = "100%",
					}))
				end,
			})
		end
		if _exp == "Fragment" then
			return React.createElement(React.Fragment, {
				key = key,
			}, children)
		end
		if _exp == "Icon" then
			return React.createElement(Icon, {
				key = key,
				name = readIconName(props),
				size = readStringOrNumber(props, "size"),
				color = readColor(props, "color", themeRefs.text.inverse),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Image" then
			local _attributes = {
				key = key,
			}
			local _condition = readString(props, "src")
			if _condition == nil then
				_condition = ""
			end
			_attributes.src = _condition
			_attributes.color = readColor(props, "color")
			_attributes.transparency = readNumber(props, "transparency")
			_attributes.scaleType = readScaleType(props)
			_attributes.imageRectOffset = readVector2(props, "imageRectOffset")
			_attributes.imageRectSize = readVector2(props, "imageRectSize")
			_attributes.resampleMode = readResampleMode(props)
			_attributes.sliceCenter = readRect(props, "sliceCenter")
			_attributes.sliceScale = readNumber(props, "sliceScale")
			_attributes.tileSize = readUDim2(props, "tileSize")
			_attributes.width = readSizeValue(props, "width")
			_attributes.height = readSizeValue(props, "height")
			_attributes.position = readSizeValue2D(props, "position")
			_attributes.anchor = readVector2(props, "anchor")
			_attributes.center = readBoolean(props, "center")
			_attributes.p = readStringOrNumber(props, "p")
			_attributes.bg = readColor(props, "bg")
			_attributes.bgTransparency = readNumber(props, "bgTransparency")
			_attributes.visible = readBoolean(props, "visible")
			_attributes.layoutOrder = readNumber(props, "layoutOrder")
			_attributes.zIndex = readNumber(props, "zIndex")
			_attributes.clip = readBoolean(props, "clip")
			_attributes.border = readNumber(props, "border")
			_attributes.borderColor = readColor(props, "borderColor")
			_attributes.radius = readStringOrNumber(props, "radius")
			_attributes.aspectRatio = readNumber(props, "aspectRatio")
			_attributes.slotProps = readSlotProps(props)
			return React.createElement(Image, _attributes, children)
		end
		if _exp == "Input" then
			return React.createElement(Input, {
				key = key,
				value = readString(props, "value"),
				defaultValue = readString(props, "defaultValue"),
				placeholder = readString(props, "placeholder"),
				variant = readVariant(props, "variant"),
				color = readIntent(props, "color"),
				size = readThemeSize(props, "size"),
				disabled = readBoolean(props, "disabled"),
				readOnly = readBoolean(props, "readOnly"),
				fullWidth = readBoolean(props, "fullWidth"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				onChange = readStringCallback(props, "onChange"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Modal" then
			local _attributes = {
				key = key,
			}
			local _condition = readBoolean(props, "opened", false)
			if _condition == nil then
				_condition = false
			end
			_attributes.opened = _condition
			_attributes.onClose = readCallback(props, "onClose") or (function()
				return nil
			end)
			_attributes.title = readString(props, "title", "Settings")
			_attributes.size = readModalSize(props)
			_attributes.withCloseButton = readBoolean(props, "withCloseButton", true)
			_attributes.zIndex = readNumber(props, "zIndex")
			_attributes.slotProps = readSlotProps(props)
			return React.createElement(Modal, _attributes, children)
		end
		if _exp == "Pressable" then
			return React.createElement(Pressable, {
				key = key,
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				center = readBoolean(props, "center"),
				p = readStringOrNumber(props, "p"),
				bg = readColor(props, "bg"),
				bgTransparency = readNumber(props, "bgTransparency"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				clip = readBoolean(props, "clip"),
				cursor = readCursor(props, "cursor"),
				disabled = readBoolean(props, "disabled"),
				active = readBoolean(props, "active"),
				onPress = readCallback(props, "onPress"),
			}, children)
		end
		if _exp == "ScrollArea" then
			return React.createElement(ScrollArea, {
				key = key,
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				p = readStringOrNumber(props, "p"),
				bg = readColor(props, "bg"),
				bgTransparency = readNumber(props, "bgTransparency"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				direction = readScrollAreaDirection(props),
				scrollbarSize = readNumber(props, "scrollbarSize"),
				scrollbarColor = readColor(props, "scrollbarColor"),
				scrollbarTransparency = readNumber(props, "scrollbarTransparency"),
				canvasSize = readUDim2(props, "canvasSize"),
				canvasPosition = readVector2(props, "canvasPosition"),
				automaticCanvasSize = readAutomaticCanvasSize(props),
				scrollingEnabled = readBoolean(props, "scrollingEnabled"),
				slotProps = readSlotProps(props),
			}, children)
		end
		if _exp == "Select" then
			return React.createElement(Select, {
				key = key,
				options = readSelectOptions(props),
				value = readString(props, "value"),
				defaultValue = readString(props, "defaultValue"),
				placeholder = readString(props, "placeholder"),
				variant = readVariant(props, "variant"),
				color = readIntent(props, "color"),
				size = readThemeSize(props, "size"),
				disabled = readBoolean(props, "disabled"),
				fullWidth = readBoolean(props, "fullWidth"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				maxVisibleOptions = readNumber(props, "maxVisibleOptions"),
				onChange = readStringCallback(props, "onChange"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Popover" then
			return React.createElement(Popover, {
				key = key,
				content = readStringOrNumber(props, "content"),
				placement = readPopoverPlacement(props),
				align = readPopoverAlign(props),
				triggerMode = readPopoverTriggerMode(props),
				disabled = readBoolean(props, "disabled"),
				opened = readBoolean(props, "opened"),
				defaultOpened = readBoolean(props, "defaultOpened"),
				closeOnOutsidePress = readBoolean(props, "closeOnOutsidePress"),
				gap = readNumber(props, "gap"),
				offset = readVector2(props, "offset"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				cursor = readCursor(props, "cursor"),
				onOpenedChange = readBooleanCallback(props, "onOpenedChange"),
				slotProps = readSlotProps(props),
			}, children)
		end
		if _exp == "SegmentedControl" then
			return React.createElement(SegmentedControl, {
				key = key,
				options = readSegmentedControlOptions(props),
				value = readString(props, "value"),
				defaultValue = readString(props, "defaultValue"),
				variant = readVariant(props, "variant"),
				color = readIntent(props, "color"),
				size = readThemeSize(props, "size"),
				disabled = readBoolean(props, "disabled"),
				fullWidth = readBoolean(props, "fullWidth"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				onChange = readStringCallback(props, "onChange"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Stack" then
			local _attributes = {
				key = key,
			}
			local _condition = readSizeValue(props, "width")
			if _condition == nil then
				_condition = "100%"
			end
			_attributes.width = _condition
			_attributes.height = readSizeValue(props, "height")
			_attributes.position = readSizeValue2D(props, "position")
			_attributes.anchor = readVector2(props, "anchor")
			_attributes.p = readStringOrNumber(props, "p")
			_attributes.bg = readColor(props, "bg")
			_attributes.bgTransparency = readNumber(props, "bgTransparency")
			_attributes.visible = readBoolean(props, "visible")
			_attributes.layoutOrder = readNumber(props, "layoutOrder")
			_attributes.zIndex = readNumber(props, "zIndex")
			_attributes.direction = readStackDirection(props)
			_attributes.gap = readStringOrNumber(props, "gap")
			_attributes.align = readStackAlign(props)
			_attributes.justify = readStackJustify(props)
			_attributes.wrap = readBoolean(props, "wrap")
			_attributes.slotProps = readSlotProps(props)
			return React.createElement(Stack, _attributes, children)
		end
		if _exp == "Slider" then
			return React.createElement(Slider, {
				key = key,
				value = readNumber(props, "value"),
				defaultValue = readNumber(props, "defaultValue"),
				min = readNumber(props, "min"),
				max = readNumber(props, "max"),
				step = readNumber(props, "step"),
				color = readIntent(props, "color", "primary"),
				size = readThemeSize(props, "size", "md"),
				disabled = readBoolean(props, "disabled", false),
				fullWidth = readBoolean(props, "fullWidth", false),
				tooltip = readBoolean(props, "tooltip", false),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				onChange = readNumberCallback(props, "onChange"),
				onChangeEnd = readNumberCallback(props, "onChangeEnd"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "StepperInput" then
			return React.createElement(StepperInput, {
				key = key,
				value = readNumber(props, "value"),
				defaultValue = readNumber(props, "defaultValue"),
				min = readNumber(props, "min"),
				max = readNumber(props, "max"),
				step = readNumber(props, "step"),
				variant = readVariant(props, "variant"),
				size = readThemeSize(props, "size"),
				disabled = readBoolean(props, "disabled"),
				readOnly = readBoolean(props, "readOnly"),
				fullWidth = readBoolean(props, "fullWidth"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				onChange = readNumberCallback(props, "onChange"),
				onChangeEnd = readNumberCallback(props, "onChangeEnd"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Switch" then
			return React.createElement(Switch, {
				key = key,
				label = readString(props, "label", "Option"),
				checked = readBoolean(props, "checked", false),
				defaultChecked = readBoolean(props, "defaultChecked"),
				color = readIntent(props, "color"),
				size = readThemeSize(props, "size"),
				disabled = readBoolean(props, "disabled"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				onChange = readBooleanCallback(props, "onChange"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Text" then
			return React.createElement(Text, {
				key = key,
				text = readStringOrNumber(props, "text"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				p = readStringOrNumber(props, "p"),
				bg = readColor(props, "bg"),
				bgTransparency = readNumber(props, "bgTransparency"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				size = readStringOrNumber(props, "size"),
				weight = readNumber(props, "weight"),
				color = readColor(props, "color"),
				align = readTextAlign(props),
				valign = readTextVerticalAlign(props),
				wrap = readBoolean(props, "wrap"),
				truncate = readTextTruncate(props),
				maxFontSize = readNumber(props, "maxFontSize"),
				minFontSize = readNumber(props, "minFontSize"),
				slotProps = readSlotProps(props),
			})
		end
		if _exp == "Tooltip" then
			return React.createElement(Tooltip, {
				key = key,
				label = readStringOrNumber(props, "label"),
				content = readStringOrNumber(props, "content"),
				disabled = readBoolean(props, "disabled"),
				opened = readBoolean(props, "opened"),
				gap = readNumber(props, "gap"),
				width = readSizeValue(props, "width"),
				height = readSizeValue(props, "height"),
				position = readSizeValue2D(props, "position"),
				anchor = readVector2(props, "anchor"),
				visible = readBoolean(props, "visible"),
				layoutOrder = readNumber(props, "layoutOrder"),
				zIndex = readNumber(props, "zIndex"),
				slotProps = readSlotProps(props),
			}, children)
		end
		warnUnknownComponent(node.component)
		return React.createElement(React.Fragment, {
			key = key,
		})
	until true
end
local function mountPrism(parent, tree, theme)
	local root = ReactRoblox.createRoot(parent)
	local destroyed = false
	local render = function(nextTree)
		if destroyed then
			return nil
		end
		root:render(React.createElement(ThemeProvider, {
			theme = theme,
		}, renderNode(nextTree)))
	end
	local handle = {
		update = render,
		destroy = function()
			if destroyed then
				return nil
			end
			destroyed = true
			root:unmount()
		end,
	}
	render(tree)
	return handle
end
return {
	mountPrism = mountPrism,
}
