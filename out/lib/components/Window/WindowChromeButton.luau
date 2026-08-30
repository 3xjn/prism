-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local Icon = TS.import(script, script.Parent.Parent, "Icon").Icon
local renderCornerDecorator = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators").renderCornerDecorator
local composeEventMaps = TS.import(script, script.Parent.Parent, "_shared", "interaction").composeEventMaps
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local usePressInteraction = TS.import(script, script.Parent.Parent, "_shared", "usePressInteraction").usePressInteraction
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local WINDOW_CHROME_HOVER_SCALE = 1.04
local WINDOW_CHROME_PRESS_SCALE = 0.92
local function WindowChromeButton(props)
	local theme = useTheme()
	local press = usePressInteraction({
		interactive = true,
		onActivated = props.onPress,
	})
	local closeButtonScale = if press.pressed then WINDOW_CHROME_PRESS_SCALE elseif press.hovered then WINDOW_CHROME_HOVER_SCALE else 1
	local motionDuration = if press.pressed or press.hovered then "fast" else "normal"
	local animated = useMotion({
		values = {
			backgroundColor = if press.pressed then theme.colors.action.pressed else theme.colors.action.hover,
			backgroundTransparency = if press.hovered or press.pressed then 0 else 1,
			iconColor = if press.pressed then theme.colors.text.primary else theme.colors.text.secondary,
			scale = closeButtonScale,
		},
		transition = {
			backgroundColor = {
				duration = motionDuration,
				easing = "standard",
			},
			backgroundTransparency = {
				duration = motionDuration,
				easing = "standard",
			},
			iconColor = {
				duration = motionDuration,
				easing = "standard",
			},
			scale = {
				duration = "fast",
				easing = "out",
			},
		},
	})
	local _object = {}
	local _spread = press.eventMap
	if _spread then
		for _k, _v in _spread do
			_object[_k] = _v
		end
	end
	_object.InputBegan = function(_button, input)
		local _result = press.eventMap
		if _result ~= nil then
			_result = _result.InputBegan
			if _result ~= nil then
				_result(_button, input)
			end
		end
		local _result_1 = props.onInputBegan
		if _result_1 ~= nil then
			_result_1(input)
		end
	end
	local _result = props.slotProps
	if _result ~= nil then
		_result = _result.Event
	end
	local _exp = composeEventMaps(_object, _result)
	local _result_1 = props.slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Event
	end
	local buttonEvent = useRootCursorEvent(_exp, if _result_1 == nil then "pointer" else nil)
	local _attributes = {
		AutoButtonColor = false,
		BackgroundColor3 = animated.backgroundColor,
		BackgroundTransparency = animated.backgroundTransparency,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(props.size, props.size),
		LayoutOrder = props.layoutOrder,
		Text = "",
		TextTransparency = 1,
		ZIndex = props.zIndex,
		Event = buttonEvent,
	}
	local _attribute = props.slotProps
	if _attribute then
		for _k, _v in _attribute do
			_attributes[_k] = _v
		end
	end
	local _exp_1 = React.createElement("uiscale", {
		Scale = animated.scale,
	})
	local _exp_2 = renderCornerDecorator({
		radius = props.radius,
		slotProps = nil,
	})
	local _attributes_1 = {
		name = props.iconName,
		size = props.iconSize,
		color = animated.iconColor,
		anchor = Vector2.new(0.5, 0.5),
		position = UDim2.fromScale(0.5, 0.5),
	}
	local _object_1 = {}
	local _left = "root"
	local _object_2 = {
		ZIndex = incrementZIndex(props.zIndex, 1),
	}
	local _spread_1 = props.iconSlotProps
	if _spread_1 then
		for _k, _v in _spread_1 do
			_object_2[_k] = _v
		end
	end
	_object_1[_left] = _object_2
	_attributes_1.slotProps = _object_1
	return React.createElement("textbutton", _attributes, _exp_1, _exp_2, React.createElement(Icon, _attributes_1))
end
return {
	WindowChromeButton = WindowChromeButton,
}
