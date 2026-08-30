-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _layering = TS.import(script, script.Parent, "layering")
local LayerPortal = _layering.LayerPortal
local useOverlayLocalPosition = _layering.useOverlayLocalPosition
local useTriggerOverlayLayout = _layering.useTriggerOverlayLayout
local function TriggerOverlayLayer(_param)
	local render = _param.render
	local trigger = _param.trigger
	local enabled = _param.enabled
	if enabled == nil then
		enabled = true
	end
	local resolvePlacement = _param.resolvePlacement
	local resolveZIndex = _param.resolveZIndex
	local backgroundColor = _param.backgroundColor
	local slotProps = _param.slotProps
	local overlayFrame, setOverlayFrame = React.useState()
	local layout = useTriggerOverlayLayout(trigger, enabled)
	local placement = React.useMemo(function()
		return if layout ~= nil then resolvePlacement(layout) else nil
	end, { layout, resolvePlacement })
	local _result = placement
	if _result ~= nil then
		_result = _result.anchorPosition
	end
	local localAnchorPosition = useOverlayLocalPosition(overlayFrame, _result)
	if not enabled or layout == nil or placement == nil then
		return nil
	end
	local _result_1 = slotProps
	if _result_1 ~= nil then
		_result_1 = _result_1.ZIndex
	end
	local _condition = _result_1
	if _condition == nil then
		local _result_2 = resolveZIndex
		if _result_2 ~= nil then
			_result_2 = _result_2(layout)
		end
		_condition = _result_2
	end
	local overlayZIndex = _condition
	local _attributes = {
		BackgroundTransparency = 1,
		BackgroundColor3 = backgroundColor,
		BorderSizePixel = 0,
		Size = UDim2.fromScale(1, 1),
		Active = false,
		Selectable = false,
		ZIndex = overlayZIndex,
	}
	if slotProps then
		for _k, _v in slotProps do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = setOverlayFrame
	return React.createElement(LayerPortal, {
		target = layout.portalTarget,
	}, React.createElement("frame", _attributes, if localAnchorPosition ~= nil then render({
		layout = layout,
		placement = placement,
		localAnchorPosition = localAnchorPosition,
		overlayZIndex = overlayZIndex,
	}) else nil))
end
return {
	TriggerOverlayLayer = TriggerOverlayLayer,
}
