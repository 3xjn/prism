-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local exports = {}
local _interaction = TS.import(script, script.Parent.Parent, "_shared", "interaction")
exports.assignRef = _interaction.assignRef
exports.composeEventMaps = _interaction.composeEventMaps
exports.incrementZIndex = TS.import(script, script.Parent.Parent, "_shared", "overlayLayerPolicy").incrementZIndex
exports.resolveTextFontFace = TS.import(script, script.Parent.Parent, "_shared", "textFont").resolveTextFontFace
local function findSelectedOption(options, value)
	if value == nil then
		return nil
	end
	for _, option in options do
		if option.value == value then
			return option
		end
	end
	return nil
end
local function resolveVisibleOptionCount(maxVisibleOptions)
	return math.max(1, math.floor(maxVisibleOptions))
end
local function resolveSelectOverlayLayout(layout, verticalGap, minimumTriggerHeight)
	if layout == nil then
		return nil
	end
	local _binding = layout
	local portalTarget = _binding.portalTarget
	local _binding_1 = _binding.bounds
	local position = _binding_1.position
	local size = _binding_1.size
	return {
		portalTarget = portalTarget,
		zIndexBase = layout.zIndexBase,
		position = Vector2.new(position.X, position.Y + math.max(size.Y, minimumTriggerHeight) + verticalGap),
		size = size,
	}
end
exports.findSelectedOption = findSelectedOption
exports.resolveVisibleOptionCount = resolveVisibleOptionCount
exports.resolveSelectOverlayLayout = resolveSelectOverlayLayout
return exports
