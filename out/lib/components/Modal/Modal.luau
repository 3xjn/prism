-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMotion = TS.import(script, script.Parent.Parent.Parent, "motion").useMotion
local _theme = TS.import(script, script.Parent.Parent.Parent, "theme")
local useTheme = _theme.useTheme
local themeRefs = _theme.theme
local getLucideIconAsset = TS.import(script, script.Parent.Parent.Parent, "icons", "lucide").getLucideIconAsset
local Backdrop = TS.import(script, script.Parent.Parent, "Backdrop").Backdrop
local ScreenOverlayLayer = TS.import(script, script.Parent.Parent, "_shared", "layering").ScreenOverlayLayer
local _foundationDecorators = TS.import(script, script.Parent.Parent, "_shared", "foundationDecorators")
local renderCornerDecorator = _foundationDecorators.renderCornerDecorator
local renderPaddingDecorator = _foundationDecorators.renderPaddingDecorator
local renderSizeConstraintDecorator = _foundationDecorators.renderSizeConstraintDecorator
local renderStrokeDecorator = _foundationDecorators.renderStrokeDecorator
local renderElevationShadow = TS.import(script, script.Parent.Parent, "_shared", "elevation").renderElevationShadow
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
local assignRef = _interaction.assignRef
local isPressInput = _interaction.isPressInput
local _overlayLayerPolicy = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy")
local DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX = _overlayLayerPolicy.DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX
local incrementZIndex = _overlayLayerPolicy.incrementZIndex
local _useResolvedStyleProps = TS.import(script, script.Parent.Parent, "_shared", "useResolvedStyleProps")
local mergeSharedStyleProps = _useResolvedStyleProps.mergeSharedStyleProps
local useResolvedStyleProps = _useResolvedStyleProps.useResolvedStyleProps
local usePresence = TS.import(script, script.Parent.Parent, "_shared", "usePresence").usePresence
local useRootCursorEvent = TS.import(script, script.Parent.Parent, "_shared", "useRootCursor").useRootCursorEvent
local DEFAULT_MODAL_BODY_HEIGHT = 160
local DEFAULT_MODAL_MAX_HEIGHT = 480
local MODAL_CLOSED_SCALE = 0.96
local MODAL_CLOSED_OFFSET_Y = 10
local MODAL_CLOSE_HOVER_SCALE = 1.04
local MODAL_CLOSE_PRESS_SCALE = 0.92
local function resolvePaddingOffset(value)
	local _value = value
	return if typeof(_value) == "UDim" then value.Offset else 0
end
local function resolveModalSizeStyles(theme, size)
	local baseWidth = theme.spacing.xl
	repeat
		local _fallthrough = false
		if size == "sm" then
			return {
				width = baseWidth * 14,
				radius = UDim.new(0, theme.radius.md),
				overlayPadding = theme.spacing.xl,
				headerGap = theme.spacing.md,
				closeButtonSize = theme.spacing.xl + theme.spacing.md,
				titleSize = theme.fontSizes.md,
				titleLineHeight = theme.lineHeights.md,
			}
		end
		if size == "lg" then
			return {
				width = baseWidth * 24,
				radius = UDim.new(0, theme.radius.lg),
				overlayPadding = theme.spacing.xl,
				headerGap = theme.spacing.lg,
				closeButtonSize = theme.spacing.xl + theme.spacing.lg,
				titleSize = theme.fontSizes.lg,
				titleLineHeight = theme.lineHeights.lg,
			}
		end
		if size == "xl" then
			return {
				width = baseWidth * 30,
				radius = UDim.new(0, theme.radius.lg),
				overlayPadding = theme.spacing.xl,
				headerGap = theme.spacing.lg,
				closeButtonSize = theme.spacing.xl + theme.spacing.lg,
				titleSize = theme.fontSizes.xl,
				titleLineHeight = theme.lineHeights.xl,
			}
		end
		if size == "md" then
		end
		return {
			width = baseWidth * 18,
			radius = UDim.new(0, theme.radius.md),
			overlayPadding = theme.spacing.xl,
			headerGap = theme.spacing.md,
			closeButtonSize = theme.spacing.xl + theme.spacing.md,
			titleSize = theme.fontSizes.lg,
			titleLineHeight = theme.lineHeights.lg,
		}
	until true
end
local function useAbsoluteSize(instance)
	local absoluteSize, setAbsoluteSize = React.useState()
	React.useEffect(function()
		if instance == nil then
			setAbsoluteSize(nil)
			return nil
		end
		local updateAbsoluteSize = function()
			local nextSize = instance.AbsoluteSize
			setAbsoluteSize(function(currentSize)
				return if currentSize ~= nil and currentSize.X == nextSize.X and currentSize.Y == nextSize.Y then currentSize else nextSize
			end)
		end
		updateAbsoluteSize()
		local absoluteSizeConnection = instance:GetPropertyChangedSignal("AbsoluteSize"):Connect(updateAbsoluteSize)
		return function()
			absoluteSizeConnection:Disconnect()
		end
	end, { instance })
	return absoluteSize
end
local ModalBase = React.forwardRef(function(props, ref)
	local theme = useTheme()
	local _binding = props
	local slotProps = _binding.slotProps
	local opened = _binding.opened
	local onClose = _binding.onClose
	local title = _binding.title
	local children = _binding.children
	local size = _binding.size
	if size == nil then
		size = "md"
	end
	local fullWidth = _binding.fullWidth
	if fullWidth == nil then
		fullWidth = false
	end
	local closeOnBackdropClick = _binding.closeOnBackdropClick
	if closeOnBackdropClick == nil then
		closeOnBackdropClick = true
	end
	local withCloseButton = _binding.withCloseButton
	if withCloseButton == nil then
		withCloseButton = true
	end
	local Event = _binding.Event
	local Change = _binding.Change
	local contentLayerInstance, setContentLayerInstance = React.useState()
	local panelInstance, setPanelInstance = React.useState()
	local headerInstance, setHeaderInstance = React.useState()
	local bodyContentInstance, setBodyContentInstance = React.useState()
	local closeHovered, setCloseHovered = React.useState(false)
	local closePressed, setClosePressed = React.useState(false)
	local contentLayerSize = useAbsoluteSize(contentLayerInstance)
	local _result = useAbsoluteSize(headerInstance)
	if _result ~= nil then
		_result = _result.Y
	end
	local _condition = _result
	if _condition == nil then
		_condition = 0
	end
	local headerHeight = _condition
	local _result_1 = useAbsoluteSize(bodyContentInstance)
	if _result_1 ~= nil then
		_result_1 = _result_1.Y
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		_condition_1 = 0
	end
	local bodyContentHeight = _condition_1
	local sizeStyles = resolveModalSizeStyles(theme, size)
	local mergedStyleProps = mergeSharedStyleProps({
		bg = themeRefs.background.surface,
		clip = false,
		center = true,
		p = "lg",
	}, props)
	local _binding_1 = useResolvedStyleProps("modal", mergedStyleProps)
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
	local shouldRenderHeader = title ~= nil or withCloseButton
	local usesDefaultCenteredLayout = props.position == nil and props.anchor == nil and props.center ~= false
	local _result_2 = slotProps
	if _result_2 ~= nil then
		_result_2 = _result_2.overlay
		if _result_2 ~= nil then
			_result_2 = _result_2.ZIndex
		end
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		_condition_2 = mergedStyleProps.zIndex
		if _condition_2 == nil then
			_condition_2 = DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX
		end
	end
	local rootOverlayZIndex = _condition_2
	local _result_3 = slotProps
	if _result_3 ~= nil then
		_result_3 = _result_3.backdrop
		if _result_3 ~= nil then
			_result_3 = _result_3.ZIndex
		end
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		_condition_3 = rootOverlayZIndex
	end
	local backdropZIndex = _condition_3
	local _result_4 = slotProps
	if _result_4 ~= nil then
		_result_4 = _result_4.contentLayer
		if _result_4 ~= nil then
			_result_4 = _result_4.ZIndex
		end
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		_condition_4 = incrementZIndex(rootOverlayZIndex, 1)
	end
	local contentLayerZIndex = _condition_4
	local _result_5 = slotProps
	if _result_5 ~= nil then
		_result_5 = _result_5.content
		if _result_5 ~= nil then
			_result_5 = _result_5.ZIndex
		end
	end
	local _condition_5 = _result_5
	if _condition_5 == nil then
		_condition_5 = incrementZIndex(contentLayerZIndex, 1)
	end
	local contentZIndex = _condition_5
	local contentInnerZIndex = incrementZIndex(contentZIndex, 1)
	local shadowZIndex = if type(contentZIndex) == "number" then math.max(contentZIndex - 1, 0) else 0
	local _result_6 = slotProps
	if _result_6 ~= nil then
		_result_6 = _result_6.header
		if _result_6 ~= nil then
			_result_6 = _result_6.ZIndex
		end
	end
	local _condition_6 = _result_6
	if _condition_6 == nil then
		_condition_6 = contentInnerZIndex
	end
	local headerZIndex = _condition_6
	local _result_7 = slotProps
	if _result_7 ~= nil then
		_result_7 = _result_7.title
		if _result_7 ~= nil then
			_result_7 = _result_7.ZIndex
		end
	end
	local _condition_7 = _result_7
	if _condition_7 == nil then
		_condition_7 = incrementZIndex(headerZIndex, 1)
	end
	local titleZIndex = _condition_7
	local _result_8 = slotProps
	if _result_8 ~= nil then
		_result_8 = _result_8.closeButton
		if _result_8 ~= nil then
			_result_8 = _result_8.ZIndex
		end
	end
	local _condition_8 = _result_8
	if _condition_8 == nil then
		_condition_8 = titleZIndex
	end
	local closeButtonZIndex = _condition_8
	local _result_9 = slotProps
	if _result_9 ~= nil then
		_result_9 = _result_9.body
		if _result_9 ~= nil then
			_result_9 = _result_9.ZIndex
		end
	end
	local _condition_9 = _result_9
	if _condition_9 == nil then
		_condition_9 = contentInnerZIndex
	end
	local bodyZIndex = _condition_9
	local _result_10 = slotProps
	if _result_10 ~= nil then
		_result_10 = _result_10.bodyContent
		if _result_10 ~= nil then
			_result_10 = _result_10.ZIndex
		end
	end
	local _condition_10 = _result_10
	if _condition_10 == nil then
		_condition_10 = bodyZIndex
	end
	local bodyContentZIndex = _condition_10
	local closeIconSize = UDim2.fromOffset(sizeStyles.titleSize, sizeStyles.titleSize)
	local closeIconAsset = getLucideIconAsset("x", sizeStyles.titleSize)
	local presence = usePresence(opened, {
		exitDuration = theme.motion.duration.fast,
	})
	local closeButtonScale = if closePressed then MODAL_CLOSE_PRESS_SCALE elseif closeHovered then MODAL_CLOSE_HOVER_SCALE else 1
	local closeButtonMotionDuration = if closePressed or closeHovered then "fast" else "normal"
	local overlayEnterDuration = if presence.present then "normal" else "fast"
	local overlayEnterEasing = if presence.present then "out" else "in"
	local animated = useMotion({
		values = {
			backdropOpacity = if presence.present then 0.28 else 0,
			panelOpacity = if presence.present then 1 else 0,
			panelScale = if presence.present then 1 else MODAL_CLOSED_SCALE,
			panelOffsetY = if presence.present then 0 else MODAL_CLOSED_OFFSET_Y,
			closeButtonBackgroundColor = if closePressed then theme.colors.action.pressed else theme.colors.action.hover,
			closeButtonBackgroundTransparency = if closeHovered or closePressed then 0 else 1,
			closeButtonIconColor = if closePressed then theme.colors.text.primary else theme.colors.text.secondary,
			closeButtonScale = closeButtonScale,
		},
		transition = {
			backdropOpacity = {
				duration = overlayEnterDuration,
				easing = overlayEnterEasing,
			},
			panelOpacity = {
				duration = overlayEnterDuration,
				easing = overlayEnterEasing,
			},
			panelScale = {
				duration = overlayEnterDuration,
				easing = overlayEnterEasing,
			},
			panelOffsetY = {
				duration = overlayEnterDuration,
				easing = overlayEnterEasing,
			},
			closeButtonBackgroundColor = {
				duration = closeButtonMotionDuration,
				easing = "standard",
			},
			closeButtonBackgroundTransparency = {
				duration = closeButtonMotionDuration,
				easing = "standard",
			},
			closeButtonIconColor = {
				duration = closeButtonMotionDuration,
				easing = "standard",
			},
			closeButtonScale = {
				duration = "fast",
				easing = "out",
			},
		},
	})
	React.useEffect(function()
		if withCloseButton then
			return nil
		end
		setCloseHovered(false)
		setClosePressed(false)
	end, { withCloseButton })
	local _exp = if withCloseButton then {
		MouseEnter = function()
			setCloseHovered(true)
		end,
		MouseLeave = function()
			setCloseHovered(false)
			setClosePressed(false)
		end,
		InputBegan = function(_button, input)
			if not isPressInput(input) then
				return nil
			end
			setClosePressed(true)
		end,
		InputEnded = function(_button, input)
			if not isPressInput(input) then
				return nil
			end
			setClosePressed(false)
		end,
		Activated = function()
			onClose()
		end,
	} else nil
	local _result_11 = slotProps
	if _result_11 ~= nil then
		_result_11 = _result_11.closeButton
		if _result_11 ~= nil then
			_result_11 = _result_11.Event
		end
	end
	local closeButtonEvent = useRootCursorEvent(_exp, if _result_11 == nil then mergedStyleProps.cursor or "pointer" else nil, not withCloseButton)
	local contentLayerRef = React.useCallback(function(instance)
		setContentLayerInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
	end, {})
	local panelRef = React.useCallback(function(instance)
		setPanelInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
		assignRef(ref, instance)
	end, { ref })
	local headerRef = React.useCallback(function(instance)
		setHeaderInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
	end, {})
	local bodyContentRef = React.useCallback(function(instance)
		setBodyContentInstance(function(currentInstance)
			return if currentInstance == instance then currentInstance else instance
		end)
	end, {})
	if not presence.shouldRender then
		return React.createElement(React.Fragment)
	end
	local availableLayerSize = contentLayerSize or Vector2.new(sizeStyles.width, DEFAULT_MODAL_MAX_HEIGHT)
	local availableLayerWidth = math.max(0, availableLayerSize.X)
	local availableLayerHeight = math.max(0, availableLayerSize.Y)
	local panelFallbackHeight = math.max(DEFAULT_MODAL_MAX_HEIGHT, sizeStyles.closeButtonSize + sizeStyles.overlayPadding * 2)
	local defaultMaxPanelHeight = if availableLayerHeight > 0 then availableLayerHeight else panelFallbackHeight
	local hasExplicitWidth = resolvedSize ~= nil or resolvedWidth ~= nil
	local hasExplicitHeight = resolvedSize ~= nil or resolvedHeight ~= nil
	local defaultMaxPanelWidth = if fullWidth then availableLayerWidth else math.min(sizeStyles.width, if availableLayerWidth > 0 then availableLayerWidth else sizeStyles.width)
	local _result_12 = resolvedConstraint
	if _result_12 ~= nil then
		_result_12 = _result_12.max
	end
	local resolvedMaxPanelWidth = if _result_12 ~= nil then math.min(defaultMaxPanelWidth, resolvedConstraint.max.X) else defaultMaxPanelWidth
	local _result_13 = resolvedConstraint
	if _result_13 ~= nil then
		_result_13 = _result_13.max
	end
	local resolvedMaxPanelHeight = if _result_13 ~= nil then math.min(defaultMaxPanelHeight, resolvedConstraint.max.Y) else defaultMaxPanelHeight
	local panelMaxSize = Vector2.new(math.max(0, resolvedMaxPanelWidth), math.max(0, resolvedMaxPanelHeight))
	local _panelMinSize = resolvedConstraint
	if _panelMinSize ~= nil then
		_panelMinSize = _panelMinSize.min
	end
	local panelMinSize = _panelMinSize
	local bodyGap = if shouldRenderHeader then sizeStyles.headerGap else 0
	local panelVerticalPadding = resolvePaddingOffset(paddingTop) + resolvePaddingOffset(paddingBottom)
	local availableBodyHeight = math.max(0, panelMaxSize.Y - panelVerticalPadding - headerHeight - bodyGap)
	local fallbackBodyHeight = math.min(DEFAULT_MODAL_BODY_HEIGHT, availableBodyHeight)
	local resolvedBodyHeight = math.max(0, math.min(if bodyContentHeight > 0 then bodyContentHeight else fallbackBodyHeight, availableBodyHeight))
	local bodyScrollable = bodyContentHeight > availableBodyHeight + 1
	local scrollBarThickness = if bodyScrollable then theme.spacing.xs else 0
	local bodyHorizontalOverflow = math.max(0, math.min(resolvePaddingOffset(paddingLeft), resolvePaddingOffset(paddingRight)))
	local panelSize
	local panelAutoSize
	if resolvedSize ~= nil then
		panelSize = resolvedSize
		panelAutoSize = nil
	elseif resolvedWidth ~= nil and resolvedHeight ~= nil then
		panelSize = UDim2.new(resolvedWidth, resolvedHeight)
		panelAutoSize = nil
	elseif resolvedWidth ~= nil then
		panelSize = UDim2.new(resolvedWidth, UDim.new(0, 0))
		panelAutoSize = Enum.AutomaticSize.Y
	elseif resolvedHeight ~= nil then
		panelSize = if usesDefaultCenteredLayout then UDim2.new(1, 0, resolvedHeight.Scale, resolvedHeight.Offset) else UDim2.new(0, panelMaxSize.X, resolvedHeight.Scale, resolvedHeight.Offset)
		panelAutoSize = nil
	elseif usesDefaultCenteredLayout then
		panelSize = UDim2.new(1, 0, 0, 0)
		panelAutoSize = Enum.AutomaticSize.Y
	else
		panelSize = if fullWidth then UDim2.new(1, 0, 0, 0) else UDim2.fromOffset(panelMaxSize.X, 0)
		panelAutoSize = Enum.AutomaticSize.Y
	end
	local resolvedPanelPosition = if usesDefaultCenteredLayout then UDim2.fromScale(0.5, 0.5) else resolvedPosition or UDim2.fromScale(0.5, 0.5)
	local animatedPanelPosition = UDim2.new(resolvedPanelPosition.X.Scale, resolvedPanelPosition.X.Offset, resolvedPanelPosition.Y.Scale, resolvedPanelPosition.Y.Offset + animated.panelOffsetY)
	local resolvedPanelAnchor = if usesDefaultCenteredLayout then Vector2.new(0.5, 0.5) else resolvedAnchor or Vector2.new(0.5, 0.5)
	local panelBackgroundColor = resolvedBackgroundColor or theme.colors.background.surface
	local _condition_11 = mergedStyleProps.bgTransparency
	if _condition_11 == nil then
		_condition_11 = 0
	end
	local panelBackgroundTransparency = 1 - ((1 - _condition_11) * animated.panelOpacity)
	local panelStrokeTransparency = 1 - ((1 - 0.08) * animated.panelOpacity)
	local _result_14 = slotProps
	if _result_14 ~= nil then
		_result_14 = _result_14.content
		if _result_14 ~= nil then
			_result_14 = _result_14.Event
		end
	end
	local contentEvent = if _result_14 == nil then Event else nil
	local panelSizeConstraint = if panelMinSize ~= nil or panelMaxSize.X > 0 or panelMaxSize.Y > 0 then {
		min = panelMinSize,
		max = panelMaxSize,
	} else nil
	local _result_15 = slotProps
	if _result_15 ~= nil then
		_result_15 = _result_15.content
	end
	local _attributes = {
		BackgroundColor3 = panelBackgroundColor,
		BackgroundTransparency = panelBackgroundTransparency,
		BorderSizePixel = 0,
		ClipsDescendants = mergedStyleProps.clip,
		Size = panelSize,
		AutomaticSize = panelAutoSize,
		Position = animatedPanelPosition,
		AnchorPoint = resolvedPanelAnchor,
		Visible = mergedStyleProps.visible,
		LayoutOrder = if usesDefaultCenteredLayout then 1 else mergedStyleProps.layoutOrder,
		ZIndex = contentZIndex,
		Event = contentEvent,
		Change = Change,
		ref = panelRef,
	}
	if _result_15 then
		for _k, _v in _result_15 do
			_attributes[_k] = _v
		end
	end
	local _exp_1 = renderElevationShadow({
		shadow = theme.shadows.lg,
		radius = sizeStyles.radius,
		zIndex = shadowZIndex,
	})
	local _exp_2 = React.createElement("uiscale", {
		Scale = animated.panelScale,
	})
	local _object = {
		radius = sizeStyles.radius,
	}
	local _left = "slotProps"
	local _result_16 = slotProps
	if _result_16 ~= nil then
		_result_16 = _result_16.contentCorner
	end
	_object[_left] = _result_16
	local _exp_3 = renderCornerDecorator(_object)
	local _object_1 = {
		enabled = true,
		color = theme.colors.border.default,
		thickness = 1,
		transparency = panelStrokeTransparency,
	}
	local _left_1 = "slotProps"
	local _result_17 = slotProps
	if _result_17 ~= nil then
		_result_17 = _result_17.contentStroke
	end
	_object_1[_left_1] = _result_17
	local _exp_4 = renderStrokeDecorator(_object_1)
	local _object_2 = {
		constraint = panelSizeConstraint,
	}
	local _left_2 = "slotProps"
	local _result_18 = slotProps
	if _result_18 ~= nil then
		_result_18 = _result_18.sizeConstraint
	end
	_object_2[_left_2] = _result_18
	local _exp_5 = renderSizeConstraintDecorator(_object_2)
	local _object_3 = {
		enabled = hasPadding,
		paddingTop = paddingTop,
		paddingRight = paddingRight,
		paddingBottom = paddingBottom,
		paddingLeft = paddingLeft,
	}
	local _left_3 = "slotProps"
	local _result_19 = slotProps
	if _result_19 ~= nil then
		_result_19 = _result_19.contentPadding
	end
	_object_3[_left_3] = _result_19
	local _exp_6 = renderPaddingDecorator(_object_3)
	local _result_20 = slotProps
	if _result_20 ~= nil then
		_result_20 = _result_20.contentLayout
	end
	local _attributes_1 = {
		FillDirection = Enum.FillDirection.Vertical,
		HorizontalAlignment = Enum.HorizontalAlignment.Left,
		VerticalAlignment = Enum.VerticalAlignment.Top,
		SortOrder = Enum.SortOrder.LayoutOrder,
		Padding = UDim.new(0, bodyGap),
	}
	if _result_20 then
		for _k, _v in _result_20 do
			_attributes_1[_k] = _v
		end
	end
	local _exp_7 = React.createElement("uilistlayout", _attributes_1)
	local _result_21
	if shouldRenderHeader then
		local _result_22 = slotProps
		if _result_22 ~= nil then
			_result_22 = _result_22.header
		end
		local _attributes_2 = {
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 0),
			AutomaticSize = Enum.AutomaticSize.Y,
			LayoutOrder = 1,
			ZIndex = headerZIndex,
			ref = headerRef,
		}
		if _result_22 then
			for _k, _v in _result_22 do
				_attributes_2[_k] = _v
			end
		end
		local _object_4 = {
			constraint = if withCloseButton then {
				min = Vector2.new(0, sizeStyles.closeButtonSize),
			} else nil,
		}
		local _left_4 = "slotProps"
		local _result_23 = slotProps
		if _result_23 ~= nil then
			_result_23 = _result_23.headerSizeConstraint
		end
		_object_4[_left_4] = _result_23
		local _exp_8 = renderSizeConstraintDecorator(_object_4)
		local _result_24
		if title ~= nil then
			local _result_25 = slotProps
			if _result_25 ~= nil then
				_result_25 = _result_25.title
			end
			local _attributes_3 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = UDim2.new(1, if withCloseButton then -(sizeStyles.closeButtonSize + sizeStyles.headerGap) else 0, 0, if withCloseButton then sizeStyles.closeButtonSize else 0),
				AutomaticSize = Enum.AutomaticSize.Y,
				Text = tostring(title),
				TextColor3 = theme.colors.text.primary,
				TextSize = sizeStyles.titleSize,
				FontFace = Font.fromEnum(theme.fontFamily),
				LineHeight = sizeStyles.titleLineHeight,
				TextWrapped = true,
				TextXAlignment = Enum.TextXAlignment.Left,
				TextYAlignment = Enum.TextYAlignment.Center,
				TextTruncate = Enum.TextTruncate.None,
				ZIndex = titleZIndex,
			}
			if _result_25 then
				for _k, _v in _result_25 do
					_attributes_3[_k] = _v
				end
			end
			_result_24 = (React.createElement("textlabel", _attributes_3))
		else
			_result_24 = nil
		end
		local _result_25
		if withCloseButton then
			local _result_26 = slotProps
			if _result_26 ~= nil then
				_result_26 = _result_26.closeButton
			end
			local _attributes_3 = {
				AutoButtonColor = false,
				BackgroundColor3 = animated.closeButtonBackgroundColor,
				BackgroundTransparency = animated.closeButtonBackgroundTransparency,
				BorderSizePixel = 0,
				Size = UDim2.fromOffset(sizeStyles.closeButtonSize, sizeStyles.closeButtonSize),
				Position = UDim2.fromScale(1, 0.5),
				AnchorPoint = Vector2.new(1, 0.5),
				Text = "",
				TextTransparency = 1,
				ZIndex = closeButtonZIndex,
				Event = closeButtonEvent,
			}
			if _result_26 then
				for _k, _v in _result_26 do
					_attributes_3[_k] = _v
				end
			end
			local _exp_9 = React.createElement("uiscale", {
				Scale = animated.closeButtonScale,
			})
			local _object_5 = {
				radius = UDim.new(0, theme.radius.sm),
			}
			local _left_5 = "slotProps"
			local _result_27 = slotProps
			if _result_27 ~= nil then
				_result_27 = _result_27.closeButtonCorner
			end
			_object_5[_left_5] = _result_27
			local _exp_10 = renderCornerDecorator(_object_5)
			local _attributes_4 = {
				BackgroundTransparency = 1,
				BorderSizePixel = 0,
				Size = closeIconSize,
				Position = UDim2.fromScale(0.5, 0.5),
				AnchorPoint = Vector2.new(0.5, 0.5),
			}
			local _result_28 = closeIconAsset
			if _result_28 ~= nil then
				_result_28 = _result_28.Url
			end
			_attributes_4.Image = _result_28
			local _result_29 = closeIconAsset
			if _result_29 ~= nil then
				_result_29 = _result_29.ImageRectSize
			end
			_attributes_4.ImageRectSize = _result_29
			local _result_30 = closeIconAsset
			if _result_30 ~= nil then
				_result_30 = _result_30.ImageRectOffset
			end
			_attributes_4.ImageRectOffset = _result_30
			_attributes_4.ImageColor3 = animated.closeButtonIconColor
			_attributes_4.ScaleType = Enum.ScaleType.Fit
			_attributes_4.ZIndex = incrementZIndex(closeButtonZIndex, 1)
			_attributes_4.Active = false
			_attributes_4.Selectable = false
			local _result_31 = slotProps
			if _result_31 ~= nil then
				_result_31 = _result_31.closeIcon
			end
			if _result_31 then
				for _k, _v in _result_31 do
					_attributes_4[_k] = _v
				end
			end
			_result_25 = (React.createElement("textbutton", _attributes_3, _exp_9, _exp_10, React.createElement("imagelabel", _attributes_4)))
		else
			_result_25 = nil
		end
		_result_21 = (React.createElement("frame", _attributes_2, _exp_8, _result_24, _result_25))
	else
		_result_21 = nil
	end
	local _result_22 = slotProps
	if _result_22 ~= nil then
		_result_22 = _result_22.body
	end
	local _attributes_2 = {
		Active = bodyScrollable,
		AutomaticCanvasSize = Enum.AutomaticSize.Y,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		CanvasSize = UDim2.fromOffset(0, 0),
		Position = UDim2.fromOffset(-bodyHorizontalOverflow, 0),
		ScrollBarImageColor3 = theme.colors.text.disabled,
		ScrollBarImageTransparency = 0.2,
		ScrollBarThickness = scrollBarThickness,
		ScrollingDirection = Enum.ScrollingDirection.Y,
		ScrollingEnabled = bodyScrollable,
		Selectable = false,
		Size = UDim2.new(1, bodyHorizontalOverflow * 2, 1, 0),
		ZIndex = bodyZIndex,
	}
	if _result_22 then
		for _k, _v in _result_22 do
			_attributes_2[_k] = _v
		end
	end
	local _result_23 = slotProps
	if _result_23 ~= nil then
		_result_23 = _result_23.bodyContent
	end
	local _attributes_3 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.new(1, -(bodyHorizontalOverflow * 2 + scrollBarThickness), 0, 0),
		Position = UDim2.fromOffset(bodyHorizontalOverflow, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		ZIndex = bodyContentZIndex,
		ref = bodyContentRef,
	}
	if _result_23 then
		for _k, _v in _result_23 do
			_attributes_3[_k] = _v
		end
	end
	local panelElement = (React.createElement("frame", _attributes, _exp_1, _exp_2, _exp_3, _exp_4, _exp_5, React.createElement("canvasgroup", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = if panelAutoSize == nil then UDim2.fromScale(1, 1) else UDim2.new(1, 0, 0, 0),
		AutomaticSize = panelAutoSize,
		GroupTransparency = 1 - animated.panelOpacity,
		ZIndex = contentInnerZIndex,
	}, _exp_6, _exp_7, _result_21, React.createElement("frame", {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		ClipsDescendants = false,
		Size = UDim2.new(1, 0, 0, resolvedBodyHeight),
		LayoutOrder = 2,
		ZIndex = bodyZIndex,
	}, React.createElement("scrollingframe", _attributes_2, React.createElement("frame", _attributes_3, children))))))
	local _attributes_4 = {
		zIndex = rootOverlayZIndex,
	}
	local _result_24 = slotProps
	if _result_24 ~= nil then
		_result_24 = _result_24.overlay
	end
	_attributes_4.slotProps = _result_24
	local _attributes_5 = {
		active = opened and closeOnBackdropClick,
		color = theme.colors.text.primary,
		opacity = animated.backdropOpacity,
		cursor = mergedStyleProps.cursor or "pointer",
		zIndex = backdropZIndex,
		excludeInstance = panelInstance,
		onPress = if closeOnBackdropClick then onClose else nil,
	}
	local _object_4 = {}
	local _left_4 = "root"
	local _result_25 = slotProps
	if _result_25 ~= nil then
		_result_25 = _result_25.backdrop
	end
	_object_4[_left_4] = _result_25
	_attributes_5.slotProps = _object_4
	local _exp_8 = React.createElement(Backdrop, _attributes_5)
	local _result_26 = slotProps
	if _result_26 ~= nil then
		_result_26 = _result_26.contentLayer
	end
	local _attributes_6 = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromOffset(sizeStyles.overlayPadding, sizeStyles.overlayPadding),
		Size = UDim2.new(1, -(sizeStyles.overlayPadding * 2), 1, -(sizeStyles.overlayPadding * 2)),
		ClipsDescendants = false,
		Active = false,
		Selectable = false,
		ZIndex = contentLayerZIndex,
		ref = contentLayerRef,
	}
	if _result_26 then
		for _k, _v in _result_26 do
			_attributes_6[_k] = _v
		end
	end
	return React.createElement(ScreenOverlayLayer, _attributes_4, _exp_8, React.createElement("frame", _attributes_6, panelElement))
end)
local Modal = ModalBase
Modal.displayName = "Modal"
return {
	Modal = Modal,
}
