-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local ReactRoblox = TS.import(script, TS.getModule(script, "@rbxts", "react-roblox"))
local assignRef = TS.import(script, script.Parent.Parent, "_shared", "interaction").assignRef
local DEFAULT_BILLBOARD_SIZE = UDim2.fromScale(4, 1.6)
local DEFAULT_SURFACE_CANVAS_SIZE = Vector2.new(512, 256)
local WorldPortalBase = React.forwardRef(function(props, ref)
	local _binding = props
	local children = _binding.children
	local enabled = _binding.enabled
	if enabled == nil then
		enabled = true
	end
	local parent = _binding.parent
	local zIndexBehavior = _binding.zIndexBehavior
	if zIndexBehavior == nil then
		zIndexBehavior = Enum.ZIndexBehavior.Sibling
	end
	local slotProps = _binding.slotProps
	if not enabled then
		return React.createElement(React.Fragment)
	end
	if props.kind == "surface" then
		local portalParent = parent or props.adornee
		local _attributes = {
			Adornee = props.adornee,
			Face = props.face or Enum.NormalId.Front,
			CanvasSize = props.canvasSize or DEFAULT_SURFACE_CANVAS_SIZE,
			SizingMode = props.sizingMode or Enum.SurfaceGuiSizingMode.PixelsPerStud,
		}
		local _condition = props.pixelsPerStud
		if _condition == nil then
			_condition = 50
		end
		_attributes.PixelsPerStud = _condition
		local _condition_1 = props.alwaysOnTop
		if _condition_1 == nil then
			_condition_1 = false
		end
		_attributes.AlwaysOnTop = _condition_1
		local _condition_2 = props.active
		if _condition_2 == nil then
			_condition_2 = false
		end
		_attributes.Active = _condition_2
		local _condition_3 = props.brightness
		if _condition_3 == nil then
			_condition_3 = 1
		end
		_attributes.Brightness = _condition_3
		local _condition_4 = props.clipsDescendants
		if _condition_4 == nil then
			_condition_4 = true
		end
		_attributes.ClipsDescendants = _condition_4
		local _condition_5 = props.lightInfluence
		if _condition_5 == nil then
			_condition_5 = 0
		end
		_attributes.LightInfluence = _condition_5
		_attributes.ZIndexBehavior = zIndexBehavior
		local _result = slotProps
		if _result ~= nil then
			_result = _result.surface
		end
		if _result then
			for _k, _v in _result do
				_attributes[_k] = _v
			end
		end
		_attributes.ref = function(instance)
			return assignRef(ref, instance)
		end
		return ReactRoblox.createPortal(React.createElement("surfacegui", _attributes, children), portalParent)
	end
	local portalParent = parent or props.adornee
	local _attributes = {
		Adornee = props.adornee,
		Size = props.size or DEFAULT_BILLBOARD_SIZE,
		SizeOffset = props.sizeOffset or Vector2.zero,
		StudsOffset = props.studsOffset or Vector3.zero,
		StudsOffsetWorldSpace = props.studsOffsetWorldSpace or Vector3.zero,
	}
	local _condition = props.maxDistance
	if _condition == nil then
		_condition = 100
	end
	_attributes.MaxDistance = _condition
	local _condition_1 = props.alwaysOnTop
	if _condition_1 == nil then
		_condition_1 = true
	end
	_attributes.AlwaysOnTop = _condition_1
	local _condition_2 = props.active
	if _condition_2 == nil then
		_condition_2 = false
	end
	_attributes.Active = _condition_2
	local _condition_3 = props.brightness
	if _condition_3 == nil then
		_condition_3 = 1
	end
	_attributes.Brightness = _condition_3
	local _condition_4 = props.clipsDescendants
	if _condition_4 == nil then
		_condition_4 = false
	end
	_attributes.ClipsDescendants = _condition_4
	local _condition_5 = props.lightInfluence
	if _condition_5 == nil then
		_condition_5 = 0
	end
	_attributes.LightInfluence = _condition_5
	_attributes.ZIndexBehavior = zIndexBehavior
	local _result = slotProps
	if _result ~= nil then
		_result = _result.billboard
	end
	if _result then
		for _k, _v in _result do
			_attributes[_k] = _v
		end
	end
	_attributes.ref = function(instance)
		return assignRef(ref, instance)
	end
	return ReactRoblox.createPortal(React.createElement("billboardgui", _attributes, children), portalParent)
end)
local WorldPortal = WorldPortalBase
WorldPortal.displayName = "WorldPortal"
return {
	WorldPortal = WorldPortal,
}
