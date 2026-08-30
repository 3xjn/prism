-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local themeRefs = _theme.theme
local useTheme = _theme.useTheme
local usePortalTarget = TS.import(script, script.Parent.Parent, "_shared", "layering").usePortalTarget
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local composeEventMaps = _interaction.composeEventMaps
local isMouseDragActive = _interaction.isMouseDragActive
local isPressInput = _interaction.isPressInput
local resolveDragInputKind = _interaction.resolveDragInputKind
local shouldHandleDragEndInput = _interaction.shouldHandleDragEndInput
local shouldHandleMouseDragMoveInput = _interaction.shouldHandleMouseDragMoveInput
local shouldHandleTouchDragMoveInput = _interaction.shouldHandleTouchDragMoveInput
local _overlayLayerPolicy = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy")
local DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX = _overlayLayerPolicy.DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX
local incrementZIndex = _overlayLayerPolicy.incrementZIndex
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local useControllableState = TS.import(script, script.Parent.Parent, "_shared", "useControllableState").useControllableState
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local WindowView = TS.import(script, script.Parent, "WindowView").WindowView
local _layout = TS.import(script, script.Parent, "layout")
local useAbsoluteSize = _layout.useAbsoluteSize
local resolveInitialWindowBounds = _layout.resolveInitialWindowBounds
local resolveLocalInputPosition = _layout.resolveLocalInputPosition
local resolveViewport = _layout.resolveViewport
local toClampOptions = _layout.toClampOptions
local resolveWindowSizeStyles = TS.import(script, script.Parent, "styles").resolveWindowSizeStyles
local useWindowCollapseMotion = TS.import(script, script.Parent, "useCollapseMotion").useWindowCollapseMotion
local _utils = TS.import(script, script.Parent, "utils")
local DEFAULT_WINDOW_HEIGHT = _utils.DEFAULT_WINDOW_HEIGHT
local DEFAULT_WINDOW_MIN_HEIGHT = _utils.DEFAULT_WINDOW_MIN_HEIGHT
local DEFAULT_WINDOW_MIN_WIDTH = _utils.DEFAULT_WINDOW_MIN_WIDTH
local DEFAULT_WINDOW_WIDTH = _utils.DEFAULT_WINDOW_WIDTH
local applyWindowMove = _utils.applyWindowMove
local applyWindowResize = _utils.applyWindowResize
local areWindowBoundsEqual = _utils.areWindowBoundsEqual
local clampWindowBounds = _utils.clampWindowBounds
local resolveCollapsedWindowBounds = _utils.resolveCollapsedWindowBounds
local resolveMaximizedWindowBounds = _utils.resolveMaximizedWindowBounds
local resolveUDimPixels = _utils.resolveUDimPixels
local UserInputService = game:GetService("UserInputService")
local WINDOW_DRAG_CLICK_THRESHOLD = 4
local WindowBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local title = _binding.title
	local children = _binding.children
	local leading = _binding.leading
	local trailing = _binding.trailing
	local rail = _binding.rail
	local onClose = _binding.onClose
	local Event = _binding.Event
	local Change = _binding.Change
	local sizeStyles = resolveWindowSizeStyles(theme)
	local _object = {
		controlled = props.collapsed,
	}
	local _left = "defaultValue"
	local _condition = props.defaultCollapsed
	if _condition == nil then
		_condition = false
	end
	_object[_left] = _condition
	_object.onChange = props.onCollapsedChange
	local _binding_1 = useControllableState(_object)
	local collapsed = _binding_1[1]
	local setCollapsed = _binding_1[2]
	local _object_1 = {
		controlled = props.maximized,
	}
	local _left_1 = "defaultValue"
	local _condition_1 = props.defaultMaximized
	if _condition_1 == nil then
		_condition_1 = false
	end
	_object_1[_left_1] = _condition_1
	_object_1.onChange = props.onMaximizedChange
	local _binding_2 = useControllableState(_object_1)
	local maximized = _binding_2[1]
	local setMaximized = _binding_2[2]
	local mergedStyleProps = mergeSharedStyleProps({
		bg = themeRefs.background.surface,
		clip = true,
		width = DEFAULT_WINDOW_WIDTH,
		height = DEFAULT_WINDOW_HEIGHT,
		minWidth = DEFAULT_WINDOW_MIN_WIDTH,
		minHeight = DEFAULT_WINDOW_MIN_HEIGHT,
	}, props)
	local _binding_3 = useResolvedStyleProps("window", mergedStyleProps)
	local resolvedWidth = _binding_3.resolvedWidth
	local resolvedHeight = _binding_3.resolvedHeight
	local resolvedSize = _binding_3.resolvedSize
	local resolvedPosition = _binding_3.resolvedPosition
	local resolvedBackgroundColor = _binding_3.resolvedBackgroundColor
	local resolvedConstraint = _binding_3.resolvedConstraint
	local overlayInstance, setOverlayInstance = React.useState()
	local windowInstance, setWindowInstance = React.useState()
	local controlsInstance, setControlsInstance = React.useState()
	local overlaySize = useAbsoluteSize(overlayInstance)
	local controlsSize = useAbsoluteSize(controlsInstance)
	local portalTarget = usePortalTarget(windowInstance)
	local viewport = resolveViewport(overlaySize)
	local bounds, setBounds = React.useState()
	local raisedZIndex, setRaisedZIndex = React.useState(function()
		local _result = slotProps
		if _result ~= nil then
			_result = _result.overlay
			if _result ~= nil then
				_result = _result.ZIndex
			end
		end
		local _condition_2 = _result
		if _condition_2 == nil then
			_condition_2 = mergedStyleProps.zIndex
			if _condition_2 == nil then
				_condition_2 = DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX
			end
		end
		return _condition_2
	end)
	local dragging, setDragging = React.useState(false)
	local dragModeRef = React.useRef(nil)
	local inputKindRef = React.useRef(nil)
	local activeTouchRef = React.useRef(nil)
	local grabOffsetRef = React.useRef(Vector2.new(0, 0))
	local draggingRef = React.useRef(false)
	local dragMovedRef = React.useRef(false)
	local dragStartInputRef = React.useRef(nil)
	local moveConnectionRef = React.useRef(nil)
	local endConnectionRef = React.useRef(nil)
	local overlayInstanceRef = React.useRef(nil)
	local boundsRef = React.useRef(nil)
	local maximizedRef = React.useRef(maximized)
	local collapsedRef = React.useRef(collapsed)
	local viewportRef = React.useRef(viewport)
	local cancelCollapseTweenRef = React.useRef(function()
		return nil
	end)
	overlayInstanceRef.current = overlayInstance
	boundsRef.current = bounds
	maximizedRef.current = maximized
	collapsedRef.current = collapsed
	viewportRef.current = viewport
	local _result = resolvedConstraint
	if _result ~= nil then
		_result = _result.min
		if _result ~= nil then
			_result = _result.X
		end
	end
	local _condition_2 = _result
	if _condition_2 == nil then
		_condition_2 = DEFAULT_WINDOW_MIN_WIDTH
	end
	local minWidth = _condition_2
	local _result_1 = resolvedConstraint
	if _result_1 ~= nil then
		_result_1 = _result_1.min
		if _result_1 ~= nil then
			_result_1 = _result_1.Y
		end
	end
	local _condition_3 = _result_1
	if _condition_3 == nil then
		_condition_3 = DEFAULT_WINDOW_MIN_HEIGHT
	end
	local minHeight = _condition_3
	local _maxWidth = resolvedConstraint
	if _maxWidth ~= nil then
		_maxWidth = _maxWidth.max
		if _maxWidth ~= nil then
			_maxWidth = _maxWidth.X
		end
	end
	local maxWidth = _maxWidth
	local _maxHeight = resolvedConstraint
	if _maxHeight ~= nil then
		_maxHeight = _maxHeight.max
		if _maxHeight ~= nil then
			_maxHeight = _maxHeight.Y
		end
	end
	local maxHeight = _maxHeight
	local clampOptions = toClampOptions(viewport, minWidth, minHeight, maxWidth, maxHeight, sizeStyles.viewportMargin)
	local clampOptionsRef = React.useRef(clampOptions)
	local collapsedSizeRef = React.useRef(sizeStyles.collapseControlSize)
	clampOptionsRef.current = clampOptions
	collapsedSizeRef.current = sizeStyles.collapseControlSize
	local raiseWindow = React.useCallback(function()
		setRaisedZIndex(function(current)
			local _current = current
			return if typeof(_current) == "number" then current + 1 else current
		end)
	end, {})
	local disconnectDragTracking = React.useCallback(function()
		local _result_2 = moveConnectionRef.current
		if _result_2 ~= nil then
			_result_2:Disconnect()
		end
		moveConnectionRef.current = nil
		local _result_3 = endConnectionRef.current
		if _result_3 ~= nil then
			_result_3:Disconnect()
		end
		endConnectionRef.current = nil
		inputKindRef.current = nil
		activeTouchRef.current = nil
		dragModeRef.current = nil
	end, {})
	local commitBounds = React.useCallback(function(nextBounds)
		setBounds(function(current)
			return if current ~= nil and areWindowBoundsEqual(current, nextBounds) then current else nextBounds
		end)
	end, {})
	local updateDragFromInput = React.useCallback(function(input)
		local overlay = overlayInstanceRef.current
		local currentBounds = boundsRef.current
		if overlay == nil or currentBounds == nil or not draggingRef.current then
			return nil
		end
		local localPosition = resolveLocalInputPosition(input, overlay)
		local startInput = dragStartInputRef.current
		if startInput ~= nil and (math.abs(localPosition.X - startInput.X) > WINDOW_DRAG_CLICK_THRESHOLD or math.abs(localPosition.Y - startInput.Y) > WINDOW_DRAG_CLICK_THRESHOLD) then
			dragMovedRef.current = true
		end
		if dragModeRef.current == "resize" then
			commitBounds(applyWindowResize(currentBounds, localPosition.X - currentBounds.x, localPosition.Y - currentBounds.y, clampOptionsRef.current))
			return nil
		end
		local collapseSize = collapsedSizeRef.current
		local moveSource = if collapsedRef.current then {
			x = currentBounds.x,
			y = currentBounds.y,
			width = collapseSize,
			height = collapseSize,
		} else currentBounds
		local moveOptions = if collapsedRef.current then toClampOptions(clampOptionsRef.current.viewport, collapseSize, collapseSize, collapseSize, collapseSize, clampOptionsRef.current.margin) else clampOptionsRef.current
		local moved = applyWindowMove(moveSource, localPosition.X - grabOffsetRef.current.X, localPosition.Y - grabOffsetRef.current.Y, moveOptions)
		commitBounds({
			x = moved.x,
			y = moved.y,
			width = currentBounds.width,
			height = currentBounds.height,
		})
	end, { commitBounds })
	local handleDragMoveInput = React.useCallback(function(input)
		if shouldHandleMouseDragMoveInput(inputKindRef.current, input) then
			updateDragFromInput(input)
			return nil
		end
		if shouldHandleTouchDragMoveInput(inputKindRef.current, activeTouchRef.current, input) then
			updateDragFromInput(input)
		end
	end, { updateDragFromInput })
	local endDrag = React.useCallback(function(emitClick)
		if not draggingRef.current then
			disconnectDragTracking()
			return nil
		end
		local wasMove = dragModeRef.current == "move"
		local wasClick = emitClick and wasMove and not dragMovedRef.current and collapsedRef.current
		draggingRef.current = false
		disconnectDragTracking()
		setDragging(false)
		if wasClick then
			setCollapsed(false)
		end
	end, { disconnectDragTracking, setCollapsed })
	local handleDragEndInput = React.useCallback(function(input)
		if not shouldHandleDragEndInput(inputKindRef.current, activeTouchRef.current, input) then
			return nil
		end
		endDrag(true)
	end, { endDrag })
	local beginDrag = React.useCallback(function(input, mode)
		if not isPressInput(input) or (maximizedRef.current and mode == "resize") then
			return nil
		end
		if maximizedRef.current and mode == "move" and not collapsedRef.current then
			return nil
		end
		local overlay = overlayInstanceRef.current
		local currentBounds = boundsRef.current
		if overlay == nil or currentBounds == nil then
			return nil
		end
		local dragKind = resolveDragInputKind(input)
		if dragKind == nil then
			return nil
		end
		local localPosition = resolveLocalInputPosition(input, overlay)
		disconnectDragTracking()
		cancelCollapseTweenRef.current()
		dragModeRef.current = mode
		inputKindRef.current = dragKind
		activeTouchRef.current = if dragKind == "touch" then input else nil
		local _vector2 = Vector2.new(currentBounds.x, currentBounds.y)
		grabOffsetRef.current = localPosition - _vector2
		dragStartInputRef.current = localPosition
		dragMovedRef.current = false
		draggingRef.current = true
		setDragging(true)
		raiseWindow()
		if not isMouseDragActive(dragKind) or portalTarget == nil then
			moveConnectionRef.current = UserInputService.InputChanged:Connect(function(changedInput)
				handleDragMoveInput(changedInput)
			end)
		end
		endConnectionRef.current = UserInputService.InputEnded:Connect(function(endedInput)
			handleDragEndInput(endedInput)
		end)
	end, { disconnectDragTracking, handleDragEndInput, handleDragMoveInput, portalTarget, raiseWindow })
	React.useEffect(function()
		if viewport.width <= 0 or viewport.height <= 0 then
			return nil
		end
		local _result_2 = resolvedSize
		if _result_2 ~= nil then
			_result_2 = _result_2.X
		end
		local _condition_4 = _result_2
		if _condition_4 == nil then
			_condition_4 = resolvedWidth or UDim.new(0, DEFAULT_WINDOW_WIDTH)
		end
		local widthSource = _condition_4
		local _result_3 = resolvedSize
		if _result_3 ~= nil then
			_result_3 = _result_3.Y
		end
		local _condition_5 = _result_3
		if _condition_5 == nil then
			_condition_5 = resolvedHeight or UDim.new(0, DEFAULT_WINDOW_HEIGHT)
		end
		local heightSource = _condition_5
		local nextOptions = toClampOptions(viewport, minWidth, minHeight, maxWidth, maxHeight, sizeStyles.viewportMargin)
		setBounds(function(current)
			local nextBounds = if current ~= nil then clampWindowBounds(current, nextOptions) else resolveInitialWindowBounds(viewport, math.max(0, resolveUDimPixels(widthSource, viewport.width)), math.max(0, resolveUDimPixels(heightSource, viewport.height)), resolvedPosition, props.center, nextOptions)
			return if current ~= nil and areWindowBoundsEqual(current, nextBounds) then current else nextBounds
		end)
	end, { maxHeight, maxWidth, minHeight, minWidth, props.center, props.position, resolvedHeight, resolvedPosition, resolvedSize, resolvedWidth, sizeStyles.viewportMargin, viewport.height, viewport.width })
	React.useEffect(function()
		return function()
			draggingRef.current = false
			disconnectDragTracking()
		end
	end, { disconnectDragTracking })
	local windowRef = React.useCallback(function(instance)
		setWindowInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local overlayRef = React.useCallback(function(instance)
		setOverlayInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
	end, {})
	local controlsRef = React.useCallback(function(instance)
		setControlsInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
	end, {})
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.overlay
		if _result_2 ~= nil then
			_result_2 = _result_2.ZIndex
		end
	end
	local _condition_4 = _result_2
	if _condition_4 == nil then
		_condition_4 = raisedZIndex
	end
	local overlayZIndex = _condition_4
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.root
		if _result_3 ~= nil then
			_result_3 = _result_3.ZIndex
		end
	end
	local _condition_5 = _result_3
	if _condition_5 == nil then
		_condition_5 = incrementZIndex(overlayZIndex, 1)
	end
	local rootZIndex = _condition_5
	local contentZIndex = incrementZIndex(rootZIndex, 1)
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.titleBar
		if _result_4 ~= nil then
			_result_4 = _result_4.ZIndex
		end
	end
	local _condition_6 = _result_4
	if _condition_6 == nil then
		_condition_6 = contentZIndex
	end
	local titleBarZIndex = _condition_6
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.controls
		if _result_5 ~= nil then
			_result_5 = _result_5.ZIndex
		end
	end
	local _condition_7 = _result_5
	if _condition_7 == nil then
		_condition_7 = incrementZIndex(titleBarZIndex, 1)
	end
	local controlsZIndex = _condition_7
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.body
		if _result_6 ~= nil then
			_result_6 = _result_6.ZIndex
		end
	end
	local _condition_8 = _result_6
	if _condition_8 == nil then
		_condition_8 = contentZIndex
	end
	local bodyZIndex = _condition_8
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.resizeHandle
		if _result_7 ~= nil then
			_result_7 = _result_7.ZIndex
		end
	end
	local _condition_9 = _result_7
	if _condition_9 == nil then
		_condition_9 = incrementZIndex(contentZIndex, 2)
	end
	local resizeHandleZIndex = _condition_9
	local _result_8 = slotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.collapseControl
		if _result_8 ~= nil then
			_result_8 = _result_8.ZIndex
		end
	end
	local _condition_10 = _result_8
	if _condition_10 == nil then
		_condition_10 = contentZIndex
	end
	local collapseControlZIndex = _condition_10
	local shadowZIndex = if type(rootZIndex) == "number" then math.max(rootZIndex - 1, 0) else 0
	local hasClose = onClose ~= nil
	local controlCount = 2 + (if hasClose then 1 else 0)
	local fallbackControlsWidth = controlCount * sizeStyles.controlSize + math.max(0, controlCount - 1) * sizeStyles.titleGap
	local _result_9 = controlsSize
	if _result_9 ~= nil then
		_result_9 = _result_9.X
	end
	local _condition_11 = _result_9
	if _condition_11 == nil then
		_condition_11 = fallbackControlsWidth
	end
	local rightControlsWidth = _condition_11
	local leadingWidth = if leading ~= nil then sizeStyles.controlSize else 0
	local titleLeft = sizeStyles.titlePaddingX + leadingWidth + (if leading ~= nil then sizeStyles.titleGap else 0)
	local titleWidthOffset = titleLeft + sizeStyles.titleGap + rightControlsWidth + sizeStyles.titlePaddingX
	local panelBackgroundColor = resolvedBackgroundColor or theme.colors.background.surface
	local controlRadius = UDim.new(0, theme.radius.sm)
	local floatingBounds = bounds or {
		x = 0,
		y = 0,
		width = DEFAULT_WINDOW_WIDTH,
		height = DEFAULT_WINDOW_HEIGHT,
	}
	local collapsedBounds = resolveCollapsedWindowBounds(floatingBounds, sizeStyles.collapseControlSize, viewport, sizeStyles.viewportMargin)
	local maximizedBounds = resolveMaximizedWindowBounds(viewport)
	local targetBounds = if collapsed then collapsedBounds elseif maximized then maximizedBounds else floatingBounds
	local collapseMotion = useWindowCollapseMotion({
		collapsed = collapsed,
		targetBounds = targetBounds,
		duration = theme.motion.duration.normal,
		easing = theme.motion.easing.out,
	})
	cancelCollapseTweenRef.current = collapseMotion.cancelTween
	local displayBounds = collapseMotion.displayBounds
	local canResize = not collapsed and not maximized and not collapseMotion.tweening
	local canMove = collapsed or not maximized
	local mouseDragCaptureActive = dragging and isMouseDragActive(inputKindRef.current) and portalTarget ~= nil
	local titleBarCursor = if dragging and dragModeRef.current == "move" then "grabbing" else "grab"
	local rootEvent = composeEventMaps({
		InputBegan = function(_frame, input)
			if isPressInput(input) then
				raiseWindow()
			end
		end,
	}, Event)
	local _exp = {
		InputBegan = function(_frame, input)
			if not isPressInput(input) then
				return nil
			end
			raiseWindow()
			if canMove then
				beginDrag(input, "move")
			end
		end,
		InputChanged = function(_frame, input)
			handleDragMoveInput(input)
		end,
		InputEnded = function(_frame, input)
			handleDragEndInput(input)
		end,
	}
	local _result_10 = slotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.titleBar
		if _result_10 ~= nil then
			_result_10 = _result_10.Event
		end
	end
	local _exp_1 = composeEventMaps(_exp, _result_10)
	local _result_11 = slotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.titleBar
		if _result_11 ~= nil then
			_result_11 = _result_11.Event
		end
	end
	local _condition_12 = _result_11 == nil
	if _condition_12 then
		_condition_12 = canMove
	end
	local titleBarEvent = useRootCursorEvent(_exp_1, if _condition_12 then titleBarCursor else nil, not canMove)
	local _exp_2 = {
		InputBegan = function(_button, input)
			if not isPressInput(input) then
				return nil
			end
			raiseWindow()
			beginDrag(input, "move")
		end,
		InputChanged = function(_button, input)
			handleDragMoveInput(input)
		end,
		InputEnded = function(_button, input)
			handleDragEndInput(input)
		end,
	}
	local _result_12 = slotProps
	if _result_12 ~= nil then
		_result_12 = _result_12.collapseControl
		if _result_12 ~= nil then
			_result_12 = _result_12.Event
		end
	end
	local _exp_3 = composeEventMaps(_exp_2, _result_12)
	local _result_13 = slotProps
	if _result_13 ~= nil then
		_result_13 = _result_13.collapseControl
		if _result_13 ~= nil then
			_result_13 = _result_13.Event
		end
	end
	local collapseControlEvent = useRootCursorEvent(_exp_3, if _result_13 == nil then (if dragging then "grabbing" else "grab") else nil)
	local _exp_4 = {
		InputBegan = function(_button, input)
			if not isPressInput(input) then
				return nil
			end
			raiseWindow()
			beginDrag(input, "resize")
		end,
		InputChanged = function(_button, input)
			handleDragMoveInput(input)
		end,
		InputEnded = function(_button, input)
			handleDragEndInput(input)
		end,
	}
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.resizeHandle
		if _result_14 ~= nil then
			_result_14 = _result_14.Event
		end
	end
	local _exp_5 = composeEventMaps(_exp_4, _result_14)
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.resizeHandle
		if _result_15 ~= nil then
			_result_15 = _result_15.Event
		end
	end
	local resizeHandleEvent = useRootCursorEvent(_exp_5, if _result_15 == nil then "resize-nwse" else nil, not canResize)
	local dragCaptureOverlayEvent = if mouseDragCaptureActive then {
		InputChanged = function(_button, input)
			handleDragMoveInput(input)
		end,
		InputEnded = function(_button, input)
			handleDragEndInput(input)
		end,
	} else nil
	local chromeInputBegan = function(input)
		if isPressInput(input) then
			raiseWindow()
		end
	end
	local _object_2 = {
		BackgroundColor3 = panelBackgroundColor,
	}
	local _left_2 = "BackgroundTransparency"
	local _condition_13 = mergedStyleProps.bgTransparency
	if _condition_13 == nil then
		_condition_13 = 0
	end
	_object_2[_left_2] = _condition_13
	_object_2.BorderSizePixel = 0
	local _left_3 = "ClipsDescendants"
	local _condition_14 = mergedStyleProps.clip
	if _condition_14 == nil then
		_condition_14 = true
	end
	_object_2[_left_3] = _condition_14
	_object_2.Position = UDim2.fromOffset(displayBounds.x, displayBounds.y)
	_object_2.Size = UDim2.fromOffset(displayBounds.width, displayBounds.height)
	_object_2.Visible = if bounds == nil then false else mergedStyleProps.visible
	_object_2.LayoutOrder = mergedStyleProps.layoutOrder
	_object_2.ZIndex = rootZIndex
	_object_2.Active = true
	_object_2.Selectable = false
	_object_2.Event = rootEvent
	_object_2.Change = Change
	local rootInstanceProps = _object_2
	return React.createElement(WindowView, {
		theme = theme,
		sizeStyles = sizeStyles,
		slotProps = slotProps,
		overlayZIndex = overlayZIndex,
		overlayRef = overlayRef,
		windowRef = windowRef,
		controlsRef = controlsRef,
		rootInstanceProps = rootInstanceProps,
		resolvedConstraint = if collapsed or collapseMotion.tweening then nil else resolvedConstraint,
		shadowZIndex = shadowZIndex,
		showCollapseControl = collapseMotion.showCollapseControl,
		collapseControlZIndex = collapseControlZIndex,
		collapseControlEvent = collapseControlEvent,
		titleBarZIndex = titleBarZIndex,
		titleBarEvent = titleBarEvent,
		leading = leading,
		title = title,
		titleLeft = titleLeft,
		titleWidthOffset = titleWidthOffset,
		controlsZIndex = controlsZIndex,
		trailing = trailing,
		controlRadius = controlRadius,
		maximized = maximized,
		hasClose = hasClose,
		onCollapse = function()
			return setCollapsed(true)
		end,
		onToggleMaximized = function()
			return setMaximized(not maximized)
		end,
		onClose = onClose,
		chromeInputBegan = chromeInputBegan,
		bodyZIndex = bodyZIndex,
		rail = rail,
		canResize = canResize,
		resizeHandleZIndex = resizeHandleZIndex,
		resizeHandleEvent = resizeHandleEvent,
		mouseDragCaptureActive = mouseDragCaptureActive,
		portalTarget = portalTarget,
		dragCaptureOverlayEvent = dragCaptureOverlayEvent,
	}, children)
end)
local Window = WindowBase
Window.displayName = "Window"
return {
	Window = Window,
}
