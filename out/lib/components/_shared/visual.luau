-- Compiled with roblox-ts v3.0.0
local function mixColor(from, to, alpha)
	return Color3.new(from.R + (to.R - from.R) * alpha, from.G + (to.G - from.G) * alpha, from.B + (to.B - from.B) * alpha)
end
return {
	mixColor = mixColor,
}
