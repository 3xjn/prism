-- Compiled with roblox-ts v3.0.0
local function applyStyleOverride(styles, override, ctx)
	local _result
	if override then
		local _object = {}
		if styles ~= 0 and styles == styles and styles ~= "" and styles then
			for _k, _v in styles do
				_object[_k] = _v
			end
		end
		for _k, _v in override(styles, ctx) do
			_object[_k] = _v
		end
		_result = _object
	else
		_result = styles
	end
	return _result
end
return {
	applyStyleOverride = applyStyleOverride,
}
