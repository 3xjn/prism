-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local ReactRoblox = TS.import(script, TS.getModule(script, "@rbxts", "react-roblox"))
local CAPTURE_OVERLAY_Z_INDEX = TS.import(script, script.Parent, "overlayLayerPolicy").CAPTURE_OVERLAY_Z_INDEX
local function resolveLayerCollector(instance)
	local _result = instance
	if _result ~= nil then
		_result = _result:FindFirstAncestorWhichIsA("LayerCollector")
	end
	return _result
end
local function usePortalTarget(instance)
	local portalTarget, setPortalTarget = React.useState()
	React.useEffect(function()
		if instance == nil then
			setPortalTarget(nil)
			return nil
		end
		local updatePortalTarget = function()
			setPortalTarget(resolveLayerCollector(instance))
		end
		updatePortalTarget()
		local ancestryConnection = instance.AncestryChanged:Connect(updatePortalTarget)
		return function()
			ancestryConnection:Disconnect()
		end
	end, { instance })
	return portalTarget
end
local function resolveTriggerOverlayZIndexBase(trigger, portalTarget)
	local zIndexBase = trigger.ZIndex
	local current = trigger
	while current ~= nil and current ~= portalTarget do
		if current:IsA("GuiObject") then
			zIndexBase = math.max(zIndexBase, current.ZIndex)
		end
		current = current.Parent
	end
	return zIndexBase
end
local function resolveTriggerOverlayLayout(trigger)
	if trigger == nil then
		return nil
	end
	local portalTarget = resolveLayerCollector(trigger)
	if portalTarget == nil then
		return nil
	end
	return {
		portalTarget = portalTarget,
		zIndexBase = resolveTriggerOverlayZIndexBase(trigger, portalTarget),
		bounds = {
			position = trigger.AbsolutePosition,
			size = trigger.AbsoluteSize,
		},
	}
end
local function useTriggerOverlayLayout(trigger, enabled)
	if enabled == nil then
		enabled = true
	end
	local layout, setLayout = React.useState()
	React.useEffect(function()
		if not enabled or trigger == nil then
			setLayout(nil)
			return nil
		end
		local updateLayout = function()
			setLayout(resolveTriggerOverlayLayout(trigger))
		end
		local cancelled = false
		local updateLayoutAfterCommit = function()
			if not cancelled then
				updateLayout()
			end
		end
		updateLayout()
		task.delay(0, updateLayoutAfterCommit)
		local absolutePositionConnection = trigger:GetPropertyChangedSignal("AbsolutePosition"):Connect(updateLayout)
		local absoluteSizeConnection = trigger:GetPropertyChangedSignal("AbsoluteSize"):Connect(updateLayout)
		local ancestryConnection = trigger.AncestryChanged:Connect(updateLayout)
		return function()
			cancelled = true
			absolutePositionConnection:Disconnect()
			absoluteSizeConnection:Disconnect()
			ancestryConnection:Disconnect()
		end
	end, { enabled, trigger })
	return layout
end
local function useOverlayOrigin(overlayFrame)
	local overlayOrigin, setOverlayOrigin = React.useState()
	React.useEffect(function()
		if overlayFrame == nil then
			setOverlayOrigin(nil)
			return nil
		end
		local updateOverlayOrigin = function()
			setOverlayOrigin(overlayFrame.AbsolutePosition)
		end
		updateOverlayOrigin()
		local absolutePositionConnection = overlayFrame:GetPropertyChangedSignal("AbsolutePosition"):Connect(updateOverlayOrigin)
		local ancestryConnection = overlayFrame.AncestryChanged:Connect(updateOverlayOrigin)
		return function()
			absolutePositionConnection:Disconnect()
			ancestryConnection:Disconnect()
		end
	end, { overlayFrame })
	return overlayOrigin
end
local function useOverlayLocalPosition(overlayFrame, absolutePosition)
	local overlayOrigin = useOverlayOrigin(overlayFrame)
	return if absolutePosition ~= nil and overlayOrigin ~= nil then absolutePosition - overlayOrigin else nil
end
local function LayerPortal(_param)
	local children = _param.children
	local target = _param.target
	return if target ~= nil then ReactRoblox.createPortal(children, target) else nil
end
local function PortalLayer(_param)
	local children = _param.children
	local hostSlotProps = _param.hostSlotProps
	local hostInstance, setHostInstance = React.useState()
	local portalTarget = usePortalTarget(hostInstance)
	local _attributes = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromOffset(0, 0),
		Visible = false,
	}
	if hostSlotProps then
		for _k, _v in hostSlotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = setHostInstance
	return React.createElement(React.Fragment, nil, React.createElement("frame", _attributes), React.createElement(LayerPortal, {
		target = portalTarget,
	}, children))
end
local function ScreenOverlayLayer(_param)
	local children = _param.children
	local hostSlotProps = _param.hostSlotProps
	local slotProps = _param.slotProps
	local zIndex = _param.zIndex
	local _attributes = {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Active = false,
		Selectable = false,
		ZIndex = zIndex,
	}
	if slotProps then
		for _k, _v in slotProps do
			_attributes[_k] = _v
		end
	end
	return React.createElement(PortalLayer, {
		hostSlotProps = hostSlotProps,
	}, React.createElement("frame", _attributes, children))
end
local function CaptureOverlay(_param)
	local active = _param.active
	local target = _param.target
	local Event = _param.Event
	local zIndex = _param.zIndex
	if zIndex == nil then
		zIndex = CAPTURE_OVERLAY_Z_INDEX
	end
	local slotProps = _param.slotProps
	if not active or Event == nil then
		return nil
	end
	local _attributes = {
		AutoButtonColor = false,
		Active = true,
		Selectable = false,
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Text = "",
		TextTransparency = 1,
		TextStrokeTransparency = 1,
		ZIndex = zIndex,
		Event = Event,
	}
	if slotProps then
		for _k, _v in slotProps do
			_attributes[_k] = _v
		end
	end
	return React.createElement(LayerPortal, {
		target = target,
	}, React.createElement("textbutton", _attributes))
end
return {
	usePortalTarget = usePortalTarget,
	useTriggerOverlayLayout = useTriggerOverlayLayout,
	useOverlayLocalPosition = useOverlayLocalPosition,
	LayerPortal = LayerPortal,
	ScreenOverlayLayer = ScreenOverlayLayer,
	CaptureOverlay = CaptureOverlay,
}
