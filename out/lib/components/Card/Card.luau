-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local themeRefs = TS.import(script, script.Parent.Parent.Parent, "theme").theme
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local pushDecorator = _foundationDecorators.pushDecorator
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local renderElevationShadow = TS.import(script, script.Parent.Parent, "_shared", "elevation").renderElevationShadow
local composeEventMaps = TS.import(script, script.Parent.Parent, "_shared", "interaction").composeEventMaps
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local resolveColorSafe = _useResolvedStyleProps.resolveColorSafe
local resolveThemeSizeSafe = _useResolvedStyleProps.resolveThemeSizeSafe
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local function resolveRadius(theme, value)
	if value == nil then
		return nil
	end
	local _value = value
	if type(_value) == "number" then
		return UDim.new(0, value)
	end
	local _value_1 = value
	if typeof(_value_1) == "UDim" then
		return value
	end
	return UDim.new(0, resolveThemeSizeSafe(theme, "card", value, "radius", theme.radius.md))
end
local function resolveCardDefaults(variant)
	repeat
		local _fallthrough = false
		if variant == "outline" then
			return {
				sharedStyleProps = {
					bg = themeRefs.background.surface,
					clip = true,
					p = "lg",
				},
				radius = "md",
				strokeColor = themeRefs.border.strong,
				strokeThickness = 1,
				strokeTransparency = 0.08,
			}
		end
		if variant == "subtle" then
			return {
				sharedStyleProps = {
					bg = themeRefs.background.default,
					clip = true,
					p = "lg",
				},
				radius = "md",
				strokeColor = themeRefs.border.subtle,
				strokeThickness = 1,
				strokeTransparency = 0.12,
			}
		end
		if variant == "elevated" then
			return {
				sharedStyleProps = {
					bg = themeRefs.background.surface,
					clip = false,
					p = "lg",
				},
				radius = "lg",
				strokeColor = themeRefs.border.subtle,
				strokeThickness = 1,
				strokeTransparency = 0.04,
				shadow = "md",
			}
		end
		if variant == "surface" then
		end
		return {
			sharedStyleProps = {
				bg = themeRefs.background.surface,
				clip = true,
				p = "lg",
			},
			radius = "md",
			strokeColor = themeRefs.border.default,
			strokeThickness = 1,
			strokeTransparency = 0.12,
		}
	until true
end
local Card = React.forwardRef(function(props, ref)
	local _binding = props
	local slotProps = _binding.slotProps
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local variant = props.variant or "surface"
	local contentHeight, setContentHeight = React.useState(0)
	local defaults = resolveCardDefaults(variant)
	local mergedStyleProps = mergeSharedStyleProps(defaults.sharedStyleProps, props)
	local _binding_1 = useResolvedStyleProps("card", mergedStyleProps)
	local theme = _binding_1.theme
	local resolvedWidth = _binding_1.resolvedWidth
	local resolvedHeight = _binding_1.resolvedHeight
	local resolvedSize = _binding_1.resolvedSize
	local resolvedPosition = _binding_1.resolvedPosition
	local resolvedAnchor = _binding_1.resolvedAnchor
	local resolvedBackgroundColor = _binding_1.resolvedBackgroundColor
	local resolvedConstraint = _binding_1.resolvedConstraint
	local paddingTop = _binding_1.paddingTop
	local paddingRight = _binding_1.paddingRight
	local paddingBottom = _binding_1.paddingBottom
	local paddingLeft = _binding_1.paddingLeft
	local hasPadding = _binding_1.hasPadding
	local _condition = props.radius
	if _condition == nil then
		_condition = defaults.radius
	end
	local resolvedRadius = resolveRadius(theme, _condition)
	local _result = props.stroke
	if _result ~= nil then
		_result = _result.color
	end
	local _condition_1 = _result
	if _condition_1 == nil then
		_condition_1 = props.borderColor or defaults.strokeColor
	end
	local resolvedStrokeColor = resolveColorSafe(theme, "card", _condition_1, theme.colors.border.default)
	local _result_1 = props.stroke
	if _result_1 ~= nil then
		_result_1 = _result_1.thickness
	end
	local _condition_2 = _result_1
	if _condition_2 == nil then
		_condition_2 = props.border
		if _condition_2 == nil then
			_condition_2 = defaults.strokeThickness
		end
	end
	local resolvedStrokeThickness = _condition_2
	local _result_2 = props.stroke
	if _result_2 ~= nil then
		_result_2 = _result_2.transparency
	end
	local _condition_3 = _result_2
	if _condition_3 == nil then
		_condition_3 = defaults.strokeTransparency
	end
	local resolvedStrokeTransparency = _condition_3
	local resolvedShadowToken = if props.shadow == nil then defaults.shadow else props.shadow
	local resolvedShadow = if resolvedShadowToken == false or resolvedShadowToken == nil then nil else theme.shadows[resolvedShadowToken]
	local fallbackShadow = resolvedShadow or theme.shadows.sm
	local _condition_4 = resolvedShadow ~= nil
	if not _condition_4 then
		local _result_3 = slotProps
		if _result_3 ~= nil then
			_result_3 = _result_3.shadow
		end
		_condition_4 = _result_3 ~= nil
		if not _condition_4 then
			local _result_4 = slotProps
			if _result_4 ~= nil then
				_result_4 = _result_4.shadowCorner
			end
			_condition_4 = _result_4 ~= nil
			if not _condition_4 then
				local _result_5 = slotProps
				if _result_5 ~= nil then
					_result_5 = _result_5.shadowStroke
				end
				_condition_4 = _result_5 ~= nil
			end
		end
	end
	local renderShadow = _condition_4
	local computedSize
	local computedAutoSize
	if resolvedSize ~= nil then
		computedSize = resolvedSize
	elseif resolvedWidth ~= nil and resolvedHeight ~= nil then
		computedSize = UDim2.new(resolvedWidth, resolvedHeight)
	elseif resolvedWidth ~= nil then
		computedSize = UDim2.new(resolvedWidth, UDim.new(0, 0))
		computedAutoSize = Enum.AutomaticSize.Y
	elseif resolvedHeight ~= nil then
		computedSize = UDim2.new(UDim.new(0, 0), resolvedHeight)
		computedAutoSize = Enum.AutomaticSize.X
	end
	local contentSize = UDim2.fromScale(1, 1)
	local contentAutoSize
	if computedAutoSize == Enum.AutomaticSize.Y then
		contentSize = UDim2.new(1, 0, 0, 0)
		contentAutoSize = Enum.AutomaticSize.Y
	elseif computedAutoSize == Enum.AutomaticSize.X then
		contentSize = UDim2.new(0, 0, 1, 0)
		contentAutoSize = Enum.AutomaticSize.X
	end
	local shadowHeight = if contentHeight > 0 then contentHeight else nil
	local _condition_5 = hasPadding
	if not _condition_5 then
		local _result_3 = slotProps
		if _result_3 ~= nil then
			_result_3 = _result_3.padding
		end
		_condition_5 = _result_3 ~= nil
	end
	local shouldRenderPadding = _condition_5
	local _exp = {
		AbsoluteSize = function(instance)
			setContentHeight(instance.AbsoluteSize.Y)
		end,
	}
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.content
		if _result_3 ~= nil then
			_result_3 = _result_3.Change
		end
	end
	local contentChange = composeEventMaps(_exp, _result_3)
	local shadowElement
	local decoratorChildren = {}
	if renderShadow then
		local _object = {
			shadow = fallbackShadow,
			radius = resolvedRadius or UDim.new(0, 0),
		}
		local _left = "size"
		local _condition_6 = shadowHeight
		if _condition_6 == nil then
			_condition_6 = 0
		end
		_object[_left] = UDim2.new(1, 0, 0, _condition_6)
		local _left_1 = "zIndex"
		local _condition_7 = mergedStyleProps.zIndex
		if _condition_7 == nil then
			_condition_7 = 1
		end
		_object[_left_1] = math.max(_condition_7 - 1, 0)
		_object.visible = shadowHeight ~= nil
		local _left_2 = "slotProps"
		local _object_1 = {}
		local _left_3 = "root"
		local _result_4 = slotProps
		if _result_4 ~= nil then
			_result_4 = _result_4.shadow
		end
		_object_1[_left_3] = _result_4
		local _left_4 = "ring"
		local _result_5 = slotProps
		if _result_5 ~= nil then
			_result_5 = _result_5.shadowStroke
		end
		_object_1[_left_4] = _result_5
		_object[_left_2] = _object_1
		shadowElement = renderElevationShadow(_object)
	end
	local _object = {
		radius = resolvedRadius,
	}
	local _left = "slotProps"
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.corner
	end
	_object[_left] = _result_4
	pushDecorator(decoratorChildren, renderCornerDecorator(_object))
	local _object_1 = {
		enabled = resolvedStrokeThickness ~= nil and resolvedStrokeThickness > 0,
		color = resolvedStrokeColor or theme.colors.border.default,
	}
	local _left_1 = "thickness"
	local _condition_6 = resolvedStrokeThickness
	if _condition_6 == nil then
		_condition_6 = defaults.strokeThickness
	end
	_object_1[_left_1] = _condition_6
	_object_1.transparency = resolvedStrokeTransparency
	local _left_2 = "mode"
	local _result_5 = props.stroke
	if _result_5 ~= nil then
		_result_5 = _result_5.mode
	end
	_object_1[_left_2] = _result_5
	local _left_3 = "slotProps"
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.stroke
	end
	_object_1[_left_3] = _result_6
	pushDecorator(decoratorChildren, renderStrokeDecorator(_object_1))
	local _object_2 = {
		constraint = resolvedConstraint,
	}
	local _left_4 = "slotProps"
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.sizeConstraint
	end
	_object_2[_left_4] = _result_7
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator(_object_2))
	local computedPosition = resolvedPosition or (if mergedStyleProps.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _exp_1 = props.Event
	local _result_8 = rootSlotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.Event
	end
	local rootEvent = useRootCursorEvent(_exp_1, if _result_8 == nil then mergedStyleProps.cursor else nil)
	local _object_3 = {
		BorderSizePixel = 0,
	}
	local _left_5 = "BackgroundTransparency"
	local _condition_7 = mergedStyleProps.bgTransparency
	if _condition_7 == nil then
		_condition_7 = 0
	end
	_object_3[_left_5] = _condition_7
	_object_3.Size = computedSize
	_object_3.AutomaticSize = computedAutoSize
	_object_3.Position = computedPosition
	_object_3.AnchorPoint = resolvedAnchor
	_object_3.BackgroundColor3 = resolvedBackgroundColor
	_object_3.ClipsDescendants = mergedStyleProps.clip
	_object_3.Visible = mergedStyleProps.visible
	_object_3.LayoutOrder = mergedStyleProps.layoutOrder
	_object_3.ZIndex = mergedStyleProps.zIndex
	_object_3.Event = rootEvent
	_object_3.Change = props.Change
	local frameInstanceProps = _object_3
	local _attributes = table.clone(frameInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = ref
	local _exp_2 = shadowElement
	local _exp_3 = decoratorChildren
	local _result_9 = slotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.content
	end
	local _attributes_1 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = contentSize,
		AutomaticSize = contentAutoSize,
	}
	if _result_9 then
		for _k, _v in _result_9 do
			_attributes_1[_k] = _v
		end
	end
	_attributes_1.Change = contentChange
	local _object_4 = {
		enabled = shouldRenderPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_6 = "slotProps"
	local _result_10 = slotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.padding
	end
	_object_4[_left_6] = _result_10
	return React.createElement("frame", _attributes, _exp_2, _exp_3, React.createElement("frame", _attributes_1, renderPaddingDecorator(_object_4), props.children))
end)
Card.displayName = "Card"
return {
	Card = Card,
}
