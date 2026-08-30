-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local SHADOW_RING_COUNT = 10
local function resolveShadowRings(shadow)
	-- Stacked strokes: ring i covers 0..t_i outward, so the cumulative
	-- alpha at distance d is the sum of every ring reaching past d.
	-- Setting each ring's alpha to the gaussian *difference* between its
	-- inner and outer shell makes the stack reproduce a smooth gaussian
	-- falloff with no visible banding.
	local spread = math.max(shadow.thickness, 1) * 12
	local sigma = spread / 1.7
	local peak = math.min((1 - shadow.transparency) * 1.45, 0.4)
	local rings = {}
	local gauss = function(d)
		return math.exp(-(d * d) / (2 * sigma * sigma))
	end
	for index = 1, SHADOW_RING_COUNT do
		local inner = (spread * (index - 1)) / SHADOW_RING_COUNT
		local outer = (spread * index) / SHADOW_RING_COUNT
		local alpha = peak * (gauss(inner) - gauss(outer))
		local _arg0 = {
			thickness = outer,
			transparency = math.clamp(1 - alpha, 0, 1),
		}
		table.insert(rings, _arg0)
	end
	return rings
end
local function ElevationShadow(props)
	local _binding = props
	local shadow = _binding.shadow
	local radius = _binding.radius
	local size = _binding.size
	local zIndex = _binding.zIndex
	local visible = _binding.visible
	local slotProps = _binding.slotProps
	local rings = resolveShadowRings(shadow)
	local containerInstance, setContainerInstance = React.useState()
	local measuredSize, setMeasuredSize = React.useState()
	React.useEffect(function()
		if size ~= nil or containerInstance == nil then
			return nil
		end
		local surface = containerInstance.Parent
		if surface == nil or not surface:IsA("GuiObject") then
			return nil
		end
		local updateMeasuredSize = function()
			local nextSize = surface.AbsoluteSize
			setMeasuredSize(function(currentSize)
				return if currentSize ~= nil and currentSize.X == nextSize.X and currentSize.Y == nextSize.Y then currentSize else nextSize
			end)
		end
		updateMeasuredSize()
		local connection = surface:GetPropertyChangedSignal("AbsoluteSize"):Connect(updateMeasuredSize)
		return function()
			connection:Disconnect()
		end
	end, { containerInstance, size })
	-- The container is never scale-sized: explicit sizes pass through and
	-- measured surfaces get pixel sizes, so AutomaticSize parents are
	-- never given a self-referential layout to lock onto.
	local containerSize = size or (if measuredSize ~= nil then UDim2.fromOffset(measuredSize.X, measuredSize.Y) else UDim2.fromOffset(0, 0))
	local _condition = visible
	if _condition == nil then
		_condition = (size ~= nil or measuredSize ~= nil)
	end
	local ringsVisible = _condition
	local _attributes = {
		key = "elevation-shadow",
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Size = containerSize,
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
	}
	local _condition_1 = zIndex
	if _condition_1 == nil then
		_condition_1 = 0
	end
	_attributes.ZIndex = _condition_1
	_attributes.Visible = ringsVisible
	_attributes.ref = setContainerInstance
	local _result = slotProps
	if _result ~= nil then
		_result = _result.root
	end
	if _result then
		for _k, _v in _result do
			_attributes[_k] = _v
		end
	end
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#rings)
	local _callback = function(ring, index)
		local _exp = React.createElement("uicorner", {
			CornerRadius = radius,
		})
		local _result_1 = slotProps
		if _result_1 ~= nil then
			_result_1 = _result_1.ring
		end
		local _attributes_1 = {
			Color = shadow.color,
			Thickness = ring.thickness,
			Transparency = ring.transparency,
		}
		if _result_1 then
			for _k, _v in _result_1 do
				_attributes_1[_k] = _v
			end
		end
		return React.createElement("frame", {
			key = `ring-{index}`,
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Size = UDim2.fromScale(1, 1),
			Position = UDim2.fromScale(0.5, 0.5),
			AnchorPoint = Vector2.new(0.5, 0.5),
		}, _exp, React.createElement("uistroke", _attributes_1))
	end
	for _k, _v in rings do
		_newValue[_k] = _callback(_v, _k - 1, rings)
	end
	-- ▲ ReadonlyArray.map ▲
	return React.createElement("frame", _attributes, _newValue)
end
--[[
	*
	 * Soft drop shadow built from stacked UIStroke rings. Ring frames never
	 * exceed the surface bounds and the falloff lives entirely in stroke
	 * thickness (strokes are render-only), so the shadow neither tints the
	 * surface nor inflates AutomaticSize parents. Render it before
	 * decorators and content so it stays underneath siblings.
	 
]]
local function renderElevationShadow(props)
	local _attributes = {
		key = "elevation-shadow",
	}
	for _k, _v in props do
		_attributes[_k] = _v
	end
	return React.createElement(ElevationShadow, _attributes)
end
return {
	renderElevationShadow = renderElevationShadow,
}
