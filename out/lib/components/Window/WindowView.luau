-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local themeRefs = TS.import(script, script.Parent.Parent.Parent, "theme").theme
local Divider = TS.import(script, script.Parent.Parent, "Divider").Divider
local Icon = TS.import(script, script.Parent.Parent, "Icon").Icon
local Text = TS.import(script, script.Parent.Parent, "Text").Text
local _layering = TS.import(script, script.Parent.Parent, "_shared", "layering")
local CaptureOverlay = _layering.CaptureOverlay
local ScreenOverlayLayer = _layering.ScreenOverlayLayer
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local renderElevationShadow = TS.import(script, script.Parent.Parent, "_shared", "elevation").renderElevationShadow
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local WindowChromeButton = TS.import(script, script.Parent, "WindowChromeButton").WindowChromeButton
local function WindowView(props)
	local sizeStyles = props.sizeStyles
	local slotProps = props.slotProps
	local titleBarZIndex = props.titleBarZIndex
	local bodyZIndex = props.bodyZIndex
	local hasRail = props.rail ~= nil
	local railWidth = if hasRail then sizeStyles.railMinWidth else 0
	local railDividerWidth = if hasRail then 1 else 0
	local bodyLeftOffset = railWidth + railDividerWidth
	local _attributes = {
		zIndex = props.overlayZIndex,
	}
	local _result = slotProps
	if _result ~= nil then
		_result = _result.overlay
	end
	_attributes.slotProps = _result
	local _exp = React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Active = false,
		Selectable = false,
		ZIndex = props.overlayZIndex,
		ref = props.overlayRef,
	})
	local _attributes_1 = table.clone(props.rootInstanceProps)
	setmetatable(_attributes_1, nil)
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.root
	end
	if _result_1 then
		for _k, _v in _result_1 do
			_attributes_1[_k] = _v
		end
	end
	_attributes_1.ref = props.windowRef
	local _object = {
		shadow = props.theme.shadows.md,
		radius = sizeStyles.radius,
		zIndex = props.shadowZIndex,
	}
	local _left = "slotProps"
	local _object_1 = {}
	local _left_1 = "root"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.shadow
	end
	_object_1[_left_1] = _result_2
	_object[_left] = _object_1
	local _exp_1 = renderElevationShadow(_object)
	local _object_2 = {
		radius = sizeStyles.radius,
	}
	local _left_2 = "slotProps"
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.rootCorner
	end
	_object_2[_left_2] = _result_3
	local _exp_2 = renderCornerDecorator(_object_2)
	local _object_3 = {
		enabled = true,
		color = props.theme.colors.border.default,
		thickness = 1,
		transparency = 0.08,
	}
	local _left_3 = "slotProps"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.rootStroke
	end
	_object_3[_left_3] = _result_4
	local _exp_3 = renderStrokeDecorator(_object_3)
	local _object_4 = {
		constraint = props.resolvedConstraint,
	}
	local _left_4 = "slotProps"
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.sizeConstraint
	end
	_object_4[_left_4] = _result_5
	local _exp_4 = renderSizeConstraintDecorator(_object_4)
	local _result_6
	if props.showCollapseControl then
		local _result_7 = slotProps
		if _result_7 ~= nil then
			_result_7 = _result_7.collapseControl
		end
		local _attributes_2 = {
			AutoButtonColor = false,
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			Text = "",
			TextTransparency = 1,
			ZIndex = props.collapseControlZIndex,
			Event = props.collapseControlEvent,
		}
		if _result_7 then
			for _k, _v in _result_7 do
				_attributes_2[_k] = _v
			end
		end
		_result_6 = (React.createElement("textbutton", _attributes_2, React.createElement(Icon, {
			name = "app-window",
			size = sizeStyles.iconSize,
			color = themeRefs.text.secondary,
			anchor = Vector2.new(0.5, 0.5),
			position = UDim2.fromScale(0.5, 0.5),
			slotProps = {
				root = {
					ZIndex = incrementZIndex(props.collapseControlZIndex, 1),
				},
			},
		})))
	else
		local _result_7 = slotProps
		if _result_7 ~= nil then
			_result_7 = _result_7.titleBar
		end
		local _attributes_2 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Active = true,
			Selectable = false,
			Size = UDim2.new(1, 0, 0, sizeStyles.titleBarHeight),
			ZIndex = titleBarZIndex,
			Event = props.titleBarEvent,
		}
		if _result_7 then
			for _k, _v in _result_7 do
				_attributes_2[_k] = _v
			end
		end
		local _result_8
		if props.leading ~= nil then
			local _result_9 = slotProps
			if _result_9 ~= nil then
				_result_9 = _result_9.leading
			end
			local _attributes_3 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Position = UDim2.fromOffset(sizeStyles.titlePaddingX, 0),
				Size = UDim2.fromOffset(sizeStyles.controlSize, sizeStyles.titleBarHeight),
				ZIndex = incrementZIndex(titleBarZIndex, 1),
			}
			if _result_9 then
				for _k, _v in _result_9 do
					_attributes_3[_k] = _v
				end
			end
			_result_8 = (React.createElement("frame", _attributes_3, React.createElement("uilistlayout", {
				FillDirection = Enum.FillDirection.Horizontal,
				HorizontalAlignment = Enum.HorizontalAlignment.Center,
				VerticalAlignment = Enum.VerticalAlignment.Center,
				SortOrder = Enum.SortOrder.LayoutOrder,
			}), props.leading))
		else
			_result_8 = nil
		end
		local _attributes_3 = {}
		local _condition = props.title
		if _condition == nil then
			_condition = ""
		end
		_attributes_3.text = _condition
		_attributes_3.size = sizeStyles.titleSize
		_attributes_3.weight = 700
		_attributes_3.lineHeight = sizeStyles.titleLineHeight
		_attributes_3.color = themeRefs.text.primary
		_attributes_3.valign = "middle"
		_attributes_3.truncate = "atend"
		_attributes_3.position = UDim2.fromOffset(props.titleLeft, 0)
		_attributes_3.width = UDim.new(1, -props.titleWidthOffset)
		_attributes_3.height = sizeStyles.titleBarHeight
		local _object_5 = {}
		local _left_5 = "root"
		local _object_6 = {
			ZIndex = incrementZIndex(titleBarZIndex, 1),
		}
		local _result_9 = slotProps
		if _result_9 ~= nil then
			_result_9 = _result_9.title
		end
		if _result_9 then
			for _k, _v in _result_9 do
				_object_6[_k] = _v
			end
		end
		_object_5[_left_5] = _object_6
		_attributes_3.slotProps = _object_5
		local _exp_5 = React.createElement(Text, _attributes_3)
		local _result_10 = slotProps
		if _result_10 ~= nil then
			_result_10 = _result_10.controls
		end
		local _attributes_4 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Position = UDim2.new(1, -sizeStyles.titlePaddingX, 0.5, 0),
			AnchorPoint = Vector2.new(1, 0.5),
			Size = UDim2.new(0, 0, 0, sizeStyles.controlSize),
			AutomaticSize = Enum.AutomaticSize.X,
			ZIndex = props.controlsZIndex,
			ref = props.controlsRef,
		}
		if _result_10 then
			for _k, _v in _result_10 do
				_attributes_4[_k] = _v
			end
		end
		local _exp_6 = React.createElement("uilistlayout", {
			FillDirection = Enum.FillDirection.Horizontal,
			HorizontalAlignment = Enum.HorizontalAlignment.Right,
			VerticalAlignment = Enum.VerticalAlignment.Center,
			Padding = UDim.new(0, sizeStyles.titleGap),
			SortOrder = Enum.SortOrder.LayoutOrder,
		})
		local _result_11
		if props.trailing ~= nil then
			local _result_12 = slotProps
			if _result_12 ~= nil then
				_result_12 = _result_12.trailing
			end
			local _attributes_5 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.fromOffset(0, sizeStyles.controlSize),
				AutomaticSize = Enum.AutomaticSize.X,
				LayoutOrder = 1,
			}
			if _result_12 then
				for _k, _v in _result_12 do
					_attributes_5[_k] = _v
				end
			end
			_result_11 = (React.createElement("frame", _attributes_5, props.trailing))
		else
			_result_11 = nil
		end
		local _attributes_5 = {
			iconName = "minus",
			size = sizeStyles.controlSize,
			iconSize = sizeStyles.iconSize,
			radius = props.controlRadius,
			zIndex = incrementZIndex(props.controlsZIndex, 1),
			layoutOrder = 2,
			onPress = props.onCollapse,
			onInputBegan = props.chromeInputBegan,
		}
		local _result_12 = slotProps
		if _result_12 ~= nil then
			_result_12 = _result_12.collapseButton
		end
		_attributes_5.slotProps = _result_12
		local _exp_7 = React.createElement(WindowChromeButton, _attributes_5)
		local _attributes_6 = {
			iconName = if props.maximized then "minimize" else "maximize",
			size = sizeStyles.controlSize,
			iconSize = sizeStyles.iconSize,
			radius = props.controlRadius,
			zIndex = incrementZIndex(props.controlsZIndex, 1),
			layoutOrder = 3,
			onPress = props.onToggleMaximized,
			onInputBegan = props.chromeInputBegan,
		}
		local _result_13 = slotProps
		if _result_13 ~= nil then
			_result_13 = _result_13.maximizeButton
		end
		_attributes_6.slotProps = _result_13
		local _exp_8 = React.createElement(WindowChromeButton, _attributes_6)
		local _result_14
		if props.hasClose then
			local _attributes_7 = {
				iconName = "x",
				size = sizeStyles.controlSize,
				iconSize = sizeStyles.iconSize,
				radius = props.controlRadius,
				zIndex = incrementZIndex(props.controlsZIndex, 1),
				layoutOrder = 4,
				onPress = function()
					local _result_15 = props.onClose
					if _result_15 ~= nil then
						_result_15 = _result_15()
					end
					return _result_15
				end,
				onInputBegan = props.chromeInputBegan,
			}
			local _result_15 = slotProps
			if _result_15 ~= nil then
				_result_15 = _result_15.closeButton
			end
			_attributes_7.slotProps = _result_15
			_result_14 = (React.createElement(WindowChromeButton, _attributes_7))
		else
			_result_14 = nil
		end
		local _exp_9 = React.createElement("frame", _attributes_2, _result_8, _exp_5, React.createElement("frame", _attributes_4, _exp_6, _result_11, _exp_7, _exp_8, _result_14))
		local _exp_10 = React.createElement(Divider, {
			color = themeRefs.border.subtle,
			size = 1,
			slotProps = {
				root = {
					Position = UDim2.fromOffset(0, sizeStyles.titleBarHeight),
					ZIndex = titleBarZIndex,
				},
			},
		})
		local _result_15 = slotProps
		if _result_15 ~= nil then
			_result_15 = _result_15.body
		end
		local _attributes_7 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Position = UDim2.fromOffset(0, sizeStyles.titleBarHeight + 1),
			Size = UDim2.new(1, 0, 1, -(sizeStyles.titleBarHeight + 1)),
			ZIndex = bodyZIndex,
		}
		if _result_15 then
			for _k, _v in _result_15 do
				_attributes_7[_k] = _v
			end
		end
		local _result_16
		if hasRail then
			local _result_17 = slotProps
			if _result_17 ~= nil then
				_result_17 = _result_17.rail
			end
			local _attributes_8 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				ClipsDescendants = true,
				Size = UDim2.new(0, railWidth, 1, 0),
				ZIndex = incrementZIndex(bodyZIndex, 1),
			}
			if _result_17 then
				for _k, _v in _result_17 do
					_attributes_8[_k] = _v
				end
			end
			_result_16 = (React.createElement("frame", _attributes_8, props.rail))
		else
			_result_16 = nil
		end
		local _exp_11 = if hasRail then (React.createElement(Divider, {
			orientation = "vertical",
			color = themeRefs.border.subtle,
			size = 1,
			layoutOrder = 2,
			slotProps = {
				root = {
					Position = UDim2.fromOffset(railWidth, 0),
				},
			},
		})) else nil
		local _result_17 = slotProps
		if _result_17 ~= nil then
			_result_17 = _result_17.content
		end
		local _attributes_8 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			ClipsDescendants = true,
			Position = UDim2.fromOffset(bodyLeftOffset, 0),
			Size = UDim2.new(1, -bodyLeftOffset, 1, 0),
			ZIndex = incrementZIndex(bodyZIndex, 1),
		}
		if _result_17 then
			for _k, _v in _result_17 do
				_attributes_8[_k] = _v
			end
		end
		local _exp_12 = React.createElement("frame", _attributes_7, _result_16, _exp_11, React.createElement("frame", _attributes_8, props.children))
		local _result_18
		if props.canResize then
			local _result_19 = slotProps
			if _result_19 ~= nil then
				_result_19 = _result_19.resizeHandle
			end
			local _attributes_9 = {
				AutoButtonColor = false,
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.fromOffset(sizeStyles.resizeHandleSize, sizeStyles.resizeHandleSize),
				Position = UDim2.fromScale(1, 1),
				AnchorPoint = Vector2.new(1, 1),
				Text = "",
				TextTransparency = 1,
				ZIndex = props.resizeHandleZIndex,
				Event = props.resizeHandleEvent,
			}
			if _result_19 then
				for _k, _v in _result_19 do
					_attributes_9[_k] = _v
				end
			end
			_result_18 = (React.createElement("textbutton", _attributes_9, React.createElement("frame", {
				BackgroundColor3 = props.theme.colors.text.disabled,
				BackgroundTransparency = 0.35,
				BorderSizePixel = 0,
				Size = UDim2.fromOffset(math.max(2, sizeStyles.resizeHandleSize - 6), 2),
				Position = UDim2.new(1, -2, 1, -6),
				AnchorPoint = Vector2.new(1, 1),
				Active = false,
			}), React.createElement("frame", {
				BackgroundColor3 = props.theme.colors.text.disabled,
				BackgroundTransparency = 0.35,
				BorderSizePixel = 0,
				Size = UDim2.fromOffset(2, math.max(2, sizeStyles.resizeHandleSize - 6)),
				Position = UDim2.new(1, -6, 1, -2),
				AnchorPoint = Vector2.new(1, 1),
				Active = false,
			})))
		else
			_result_18 = nil
		end
		_result_6 = (React.createElement(React.Fragment, nil, _exp_9, _exp_10, _exp_12, _result_18))
	end
	return React.createElement(ScreenOverlayLayer, _attributes, _exp, React.createElement("frame", _attributes_1, _exp_1, _exp_2, _exp_3, _exp_4, _result_6), React.createElement(CaptureOverlay, {
		active = props.mouseDragCaptureActive,
		target = props.portalTarget,
		Event = props.dragCaptureOverlayEvent,
	}))
end
return {
	WindowView = WindowView,
}
