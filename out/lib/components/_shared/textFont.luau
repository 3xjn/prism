-- Compiled with roblox-ts v3.0.0
local function resolveTextFontFace(font, fontFace, fallback)
	if fontFace ~= nil then
		return fontFace
	end
	local _font = font
	if typeof(_font) == "EnumItem" then
		return Font.fromEnum(font)
	end
	return Font.fromEnum(fallback)
end
return {
	resolveTextFontFace = resolveTextFontFace,
}
