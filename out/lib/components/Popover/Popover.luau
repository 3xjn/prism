-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useTheme = TS.import(script, script.Parent.Parent.Parent, "theme").useTheme
local renderSizeConstraintDecorator = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators").renderSizeConstraintDecorator
local resolveFrameSizeProps = TS.import(script, script.Parent.Parent, "_shared", "frameSize").resolveFrameSizeProps
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local isPressInput = _interaction.isPressInput
local TriggerOverlayLayer = TS.import(script, script.Parent.Parent, "_shared", "TriggerOverlayLayer").TriggerOverlayLayer
local incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
local applyStyleOverride = TS.import(script, script.Parent.Parent, "_shared", "styleOverride").applyStyleOverride
local useDelayedCallback = TS.import(script, script.Parent.Parent, "_shared", "useDelayedCallback").useDelayedCallback
local useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps").useResolvedStyleProps
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local PopoverOverlayPanel = TS.import(script, script.Parent, "PopoverOverlayPanel").PopoverOverlayPanel
local _styles = TS.import(script, script.Parent, "styles")
local resolvePopoverSizeStyles = _styles.resolvePopoverSizeStyles
local resolvePopoverVisualStyles = _styles.resolvePopoverVisualStyles
local resolvePopoverPanelPlacement = TS.import(script, script.Parent, "utils").resolvePopoverPanelPlacement
local function isPrimitivePopoverContent(value)
	local _value = value
	local _condition = type(_value) == "string"
	if not _condition then
		local _value_1 = value
		_condition = type(_value_1) == "number"
	end
	return _condition
end
local PopoverBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local children = _binding.children
	local content = _binding.content
	local disabled = _binding.disabled
	if disabled == nil then
		disabled = false
	end
	local opened = _binding.opened
	local defaultOpened = _binding.defaultOpened
	if defaultOpened == nil then
		defaultOpened = false
	end
	local onOpenedChange = _binding.onOpenedChange
	local placement = _binding.placement
	if placement == nil then
		placement = "bottom"
	end
	local align = _binding.align
	if align == nil then
		align = "center"
	end
	local triggerMode = _binding.triggerMode
	if triggerMode == nil then
		triggerMode = "click"
	end
	local openDelay = _binding.openDelay
	if openDelay == nil then
		openDelay = 0
	end
	local closeOnOutsidePress = _binding.closeOnOutsidePress
	if closeOnOutsidePress == nil then
		closeOnOutsidePress = true
	end
	local Event = _binding.Event
	local Change = _binding.Change
	local uncontrolledOpened, setUncontrolledOpened = React.useState(defaultOpened)
	local delayedOpen = useDelayedCallback()
	local rootInstance, setRootInstance = React.useState()
	local panelInstance, setPanelInstance = React.useState()
	local pressArmedRef = React.useRef(false)
	local hasContent = content ~= nil
	local _condition = not disabled and hasContent
	if _condition then
		local _condition_1 = opened
		if _condition_1 == nil then
			_condition_1 = uncontrolledOpened
		end
		_condition = _condition_1
	end
	local isOpen = _condition
	local sizeStyles = resolvePopoverSizeStyles(theme, props.gap)
	local visualStyles = applyStyleOverride(resolvePopoverVisualStyles(theme), props.styleOverrides, {
		theme = theme,
	})
	local _binding_1 = useResolvedStyleProps("popover", props)
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
	local _triggerSlotProps = slotProps
	if _triggerSlotProps ~= nil then
		_triggerSlotProps = _triggerSlotProps.trigger
	end
	local triggerSlotProps = _triggerSlotProps
	local _overlaySlotProps = slotProps
	if _overlaySlotProps ~= nil then
		_overlaySlotProps = _overlaySlotProps.overlay
	end
	local overlaySlotProps = _overlaySlotProps
	local primitiveContent = if isPrimitivePopoverContent(content) then content else nil
	local richContent = if content ~= nil and not isPrimitivePopoverContent(content) then content else nil
	local resolvePanelPlacement = React.useCallback(function(layout)
		return resolvePopoverPanelPlacement(layout.bounds, placement, align, sizeStyles.gap, props.offset)
	end, { align, placement, props.offset, sizeStyles.gap })
	local rootSizeProps = resolveFrameSizeProps(resolvedSize, resolvedWidth, resolvedHeight)
	local setOpened = React.useCallback(function(nextOpened)
		if disabled then
			return nil
		end
		local _condition_1 = opened
		if _condition_1 == nil then
			_condition_1 = uncontrolledOpened
		end
		local currentOpened = _condition_1
		if opened == nil then
			setUncontrolledOpened(nextOpened)
		end
		if nextOpened ~= currentOpened then
			local _result = onOpenedChange
			if _result ~= nil then
				_result(nextOpened)
			end
		end
	end, { disabled, onOpenedChange, opened, uncontrolledOpened })
	React.useEffect(function()
		if not disabled and hasContent then
			return nil
		end
		pressArmedRef.current = false
		if opened == nil then
			setUncontrolledOpened(false)
		end
	end, { disabled, hasContent, opened })
	local _result = rootSlotProps
	if _result ~= nil then
		_result = _result.ZIndex
	end
	local _condition_1 = _result
	if _condition_1 == nil then
		_condition_1 = props.zIndex
	end
	local resolvedRootZIndex = _condition_1
	local _result_1 = triggerSlotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.ZIndex
	end
	local _condition_2 = _result_1
	if _condition_2 == nil then
		_condition_2 = incrementZIndex(resolvedRootZIndex, 1)
	end
	local resolvedTriggerZIndex = _condition_2
	local resolveOverlayZIndex = React.useCallback(function(layout)
		local _condition_3 = resolvedRootZIndex
		if _condition_3 == nil then
			_condition_3 = layout.zIndexBase
		end
		return incrementZIndex(_condition_3, 1)
	end, { resolvedRootZIndex })
	local shouldRenderOutsideCapture = closeOnOutsidePress and triggerMode ~= "hover"
	local internalTriggerEvent = {
		MouseEnter = function()
			if triggerMode == "hover" then
				delayedOpen.schedule(openDelay, function()
					return setOpened(true)
				end)
			end
		end,
		MouseLeave = function()
			pressArmedRef.current = false
			if triggerMode == "hover" then
				delayedOpen.cancel()
				setOpened(false)
			end
		end,
		InputBegan = function(_button, input)
			if triggerMode ~= "click" or disabled or not hasContent or not isPressInput(input) then
				return nil
			end
			pressArmedRef.current = true
		end,
		InputEnded = function(_button, input)
			if triggerMode ~= "click" or not isPressInput(input) then
				return nil
			end
			local wasPressArmed = pressArmedRef.current
			pressArmedRef.current = false
			if wasPressArmed then
				setOpened(not isOpen)
			end
		end,
	}
	local _exp = composeEventMaps(internalTriggerEvent, Event)
	local _result_2 = triggerSlotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.Event
	end
	local triggerEvent = useRootCursorEvent(_exp, if _result_2 == nil then (props.cursor or "pointer") else nil, disabled or triggerMode == "manual" or not hasContent)
	local rootRef = React.useCallback(function(instance)
		setRootInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local panelRef = React.useCallback(function(instance)
		setPanelInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
	end, {})
	local computedPosition = resolvedPosition or (if props.center then UDim2.fromScale(0.5, 0.5) else nil)
	local _attributes = {
		Active = false,
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
		Change = Change,
	}
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
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.sizeConstraint
	end
	_object[_left] = _result_3
	local _exp_1 = renderSizeConstraintDecorator(_object)
	local _exp_2 = children
	local _attributes_1 = {
		AutoButtonColor = false,
		Active = not disabled and triggerMode ~= "manual" and hasContent,
		Selectable = false,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = resolvedTriggerZIndex,
		Event = triggerEvent,
	}
	if triggerSlotProps then
		for _k, _v in triggerSlotProps do
			_attributes_1[_k] = _v
		end
	end
	return React.createElement(React.Fragment, nil, React.createElement("frame", _attributes, _exp_1, _exp_2, React.createElement("textbutton", _attributes_1)), React.createElement(TriggerOverlayLayer, {
		trigger = rootInstance,
		enabled = isOpen,
		resolvePlacement = resolvePanelPlacement,
		resolveZIndex = resolveOverlayZIndex,
		slotProps = overlaySlotProps,
		render = function(_param)
			local panelPlacement = _param.placement
			local localAnchorPosition = _param.localAnchorPosition
			local overlayZIndex = _param.overlayZIndex
			return React.createElement(PopoverOverlayPanel, {
				localAnchorPosition = localAnchorPosition,
				panelPlacement = panelPlacement,
				overlayZIndex = overlayZIndex,
				panelInstance = panelInstance,
				primitiveContent = primitiveContent,
				richContent = richContent,
				shouldRenderOutsideCapture = shouldRenderOutsideCapture,
				sizeStyles = sizeStyles,
				visualStyles = visualStyles,
				slotProps = slotProps,
				themeFontFamily = theme.fontFamily,
				onOutsidePress = function()
					return setOpened(false)
				end,
				setPanelInstance = panelRef,
			})
		end,
	}))
end)
local Popover = PopoverBase
Popover.displayName = "Popover"
return {
	Popover = Popover,
}
