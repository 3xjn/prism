-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local renderSizeConstraintDecorator = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators").renderSizeConstraintDecorator
local resolveFrameSizeProps = TS.import(script, script.Parent.Parent, "_shared", "frameSize").resolveFrameSizeProps
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local TriggerOverlayLayer = TS.import(script, script.Parent.Parent, "_shared", "TriggerOverlayLayer").TriggerOverlayLayer
local useDelayedCallback = TS.import(script, script.Parent.Parent, "_shared", "useDelayedCallback").useDelayedCallback
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local TooltipOverlayBubble = TS.import(script, script.Parent, "TooltipOverlayBubble").TooltipOverlayBubble
local _styles = TS.import(script, script.Parent, "styles")
local resolveTooltipSizeStyles = _styles.resolveTooltipSizeStyles
local resolveTooltipVisualStyles = _styles.resolveTooltipVisualStyles
local DEFAULT_TOOLTIP_TAIL_IMAGE = "rbxassetid://10983945016"
local DEFAULT_TOOLTIP_TAIL_BORDER_IMAGE = "rbxassetid://10983946430"
local TOP_PLACEMENT_TAIL_ROTATION = 180
local TOP_PLACEMENT_TAIL_ATTACHMENT_OFFSET_Y = 0
local function isPrimitiveTooltipContent(value)
	local _value = value
	local _condition = type(_value) == "string"
	if not _condition then
		local _value_1 = value
		_condition = type(_value_1) == "number"
	end
	return _condition
end
local TooltipBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local children = _binding.children
	local content = _binding.content
	local label = _binding.label
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = false
	end
	local opened = _binding.opened
	local placement = _binding.placement
	if placement == nil then
		placement = "top"
	end
	local openDelay = _binding.openDelay
	if openDelay == nil then
		openDelay = 0.35
	end
	local tailImage = _binding.tailImage
	if tailImage == nil then
		tailImage = DEFAULT_TOOLTIP_TAIL_IMAGE
	end
	local tailBorderImage = _binding.tailBorderImage
	if tailBorderImage == nil then
		tailBorderImage = DEFAULT_TOOLTIP_TAIL_BORDER_IMAGE
	end
	local Event = _binding.Event
	local Change = _binding.Change
	local hovered, setHovered = React.useState(false)
	local delayedOpen = useDelayedCallback()
	local rootInstance, setRootInstance = React.useState()
	local _condition = content
	if _condition == nil then
		_condition = label
	end
	local tooltipContent = _condition
	local hasContent = tooltipContent ~= nil
	local primitiveTooltipContent = if isPrimitiveTooltipContent(tooltipContent) then tooltipContent else nil
	local richTooltipContent = if tooltipContent ~= nil and not isPrimitiveTooltipContent(tooltipContent) then tooltipContent else nil
	local _condition_1 = not disabled and hasContent
	if _condition_1 then
		local _condition_2 = opened
		if _condition_2 == nil then
			_condition_2 = hovered
		end
		_condition_1 = _condition_2
	end
	local isOpen = _condition_1
	local sizeStyles = resolveTooltipSizeStyles(theme, props.gap)
	local visualStyles = applyStyleOverride(resolveTooltipVisualStyles(theme), props.styleOverrides, {
		theme = theme,
	})
	local _binding_1 = useResolvedStyleProps("tooltip", props)
	local resolvedWidth = _binding_1.resolvedWidth
	local resolvedHeight = _binding_1.resolvedHeight
	local resolvedSize = _binding_1.resolvedSize
	local resolvedPosition = _binding_1.resolvedPosition
	local resolvedAnchor = _binding_1.resolvedAnchor
	local resolvedConstraint = _binding_1.resolvedConstraint
	local _rootSlotProps = slotProps
	if _rootSlotProps ~= nil then
		_rootSlotProps = _rootSlotProps.root
	end
	local rootSlotProps = _rootSlotProps
	local _overlaySlotProps = slotProps
	if _overlaySlotProps ~= nil then
		_overlaySlotProps = _overlaySlotProps.overlay
	end
	local overlaySlotProps = _overlaySlotProps
	local defaultTailRotation = if placement == "top" then TOP_PLACEMENT_TAIL_ROTATION else 0
	local defaultTailAttachmentOffsetY = if placement == "top" then TOP_PLACEMENT_TAIL_ATTACHMENT_OFFSET_Y else 0
	React.useEffect(function()
		if not disabled and hasContent then
			return nil
		end
		setHovered(false)
	end, { disabled, hasContent })
	local resolveTooltipPlacement = React.useCallback(function(layout)
		local _binding_2 = layout
		local _binding_3 = _binding_2.bounds
		local position = _binding_3.position
		local size = _binding_3.size
		local centerX = position.X + size.X * 0.5
		repeat
			local _fallthrough = false
			if placement == "top" then
			end
			return {
				anchorPosition = Vector2.new(centerX, position.Y - (sizeStyles.tailHeight + sizeStyles.gap)),
			}
		until true
	end, { placement, sizeStyles.gap, sizeStyles.tailHeight })
	local rootSizeProps = resolveFrameSizeProps(resolvedSize, resolvedWidth, resolvedHeight)
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.ZIndex
	end
	local _condition_2 = _result
	if _condition_2 == nil then
		_condition_2 = props.zIndex
	end
	local resolvedRootZIndex = _condition_2
	local resolveOverlayZIndex = React.useCallback(function(layout)
		local _condition_3 = resolvedRootZIndex
		if _condition_3 == nil then
			_condition_3 = layout.zIndexBase
		end
		return incrementZIndex(_condition_3, 1)
	end, { resolvedRootZIndex })
	local internalEvent = {
		MouseEnter = function()
			if disabled or opened ~= nil or not hasContent then
				return nil
			end
			delayedOpen.schedule(openDelay, function()
				return setHovered(true)
			end)
		end,
		MouseLeave = function()
			if opened ~= nil then
				return nil
			end
			delayedOpen.cancel()
			setHovered(false)
		end,
	}
	local _exp = composeEventMaps(internalEvent, Event)
	local _result_1 = rootSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.Event
	end
	local rootEvent = useRootCursorEvent(_exp, if _result_1 == nil then props.cursor else nil, disabled)
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local rootInstanceProps = {
		Active = not disabled,
		Selectable = false,
		BackgroundTransparency = 1,
		BackgroundColor3 = theme.colors.background.default,
		BorderSizePixel = 0,
		Size = rootSizeProps.size,
		AutomaticSize = rootSizeProps.automaticSize,
		Position = computedPosition,
		AnchorPoint = resolvedAnchor,
		ClipsDescendants = props.clip,
		Visible = props.visible,
		LayoutOrder = props.layoutOrder,
		ZIndex = resolvedRootZIndex,
		Event = rootEvent,
		Change = Change,
	}
	local rootRef = React.useCallback(function(instance)
		setRootInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local _attributes = table.clone(rootInstanceProps)
	setmetatable(_attributes, nil)
	if rootSlotProps then
		for _k, _v in rootSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = rootRef
	local _object = {
		constraint = resolvedConstraint,
	}
	local _left = "slotProps"
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.sizeConstraint
	end
	_object[_left] = _result_2
	return React.createElement(React.Fragment, nil, React.createElement("frame", _attributes, renderSizeConstraintDecorator(_object), children), React.createElement(TriggerOverlayLayer, {
		trigger = rootInstance,
		enabled = isOpen,
		resolvePlacement = resolveTooltipPlacement,
		resolveZIndex = resolveOverlayZIndex,
		backgroundColor = theme.colors.background.default,
		slotProps = overlaySlotProps,
		render = function(_param)
			local localAnchorPosition = _param.localAnchorPosition
			local overlayZIndex = _param.overlayZIndex
			return React.createElement(TooltipOverlayBubble, {
				localAnchorPosition = localAnchorPosition,
				overlayZIndex = overlayZIndex,
				primitiveContent = primitiveTooltipContent,
				richContent = richTooltipContent,
				sizeStyles = sizeStyles,
				visualStyles = visualStyles,
				slotProps = slotProps,
				themeFontFamily = theme.fontFamily,
				tailImage = tailImage,
				tailBorderImage = tailBorderImage,
				tailRotation = defaultTailRotation,
				tailAttachmentOffsetY = defaultTailAttachmentOffsetY,
			})
		end,
	}))
end)
local Tooltip = TooltipBase
Tooltip.displayName = "Tooltip"
return {
	Tooltip = Tooltip,
}
