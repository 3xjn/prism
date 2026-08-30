-- Compiled with roblox-ts v3.0.0
local function mergeSharedSizeConstraint(base, override)
	if base == nil and override == nil then
		return nil
	end
	local _object = {}
	local _left = "min"
	local _result = override
	if _result ~= nil then
		_result = _result.min
	end
	local _condition = _result
	if _condition == nil then
		local _result_1 = base
		if _result_1 ~= nil then
			_result_1 = _result_1.min
		end
		_condition = _result_1
	end
	_object[_left] = _condition
	local _left_1 = "max"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.max
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		local _result_2 = base
		if _result_2 ~= nil then
			_result_2 = _result_2.max
		end
		_condition_1 = _result_2
	end
	_object[_left_1] = _condition_1
	return _object
end
local function mergeSharedStyleProps(base, override)
	local _object = {}
	local _left = "cursor"
	local _result = override
	if _result ~= nil then
		_result = _result.cursor
	end
	local _condition = _result
	if _condition == nil then
		local _result_1 = base
		if _result_1 ~= nil then
			_result_1 = _result_1.cursor
		end
		_condition = _result_1
	end
	_object[_left] = _condition
	local _left_1 = "width"
	local _result_1 = override
	if _result_1 ~= nil then
		_result_1 = _result_1.width
	end
	local _condition_1 = _result_1
	if _condition_1 == nil then
		local _result_2 = base
		if _result_2 ~= nil then
			_result_2 = _result_2.width
		end
		_condition_1 = _result_2
	end
	_object[_left_1] = _condition_1
	local _left_2 = "height"
	local _result_2 = override
	if _result_2 ~= nil then
		_result_2 = _result_2.height
	end
	local _condition_2 = _result_2
	if _condition_2 == nil then
		local _result_3 = base
		if _result_3 ~= nil then
			_result_3 = _result_3.height
		end
		_condition_2 = _result_3
	end
	_object[_left_2] = _condition_2
	local _left_3 = "minWidth"
	local _result_3 = override
	if _result_3 ~= nil then
		_result_3 = _result_3.minWidth
	end
	local _condition_3 = _result_3
	if _condition_3 == nil then
		local _result_4 = base
		if _result_4 ~= nil then
			_result_4 = _result_4.minWidth
		end
		_condition_3 = _result_4
	end
	_object[_left_3] = _condition_3
	local _left_4 = "maxWidth"
	local _result_4 = override
	if _result_4 ~= nil then
		_result_4 = _result_4.maxWidth
	end
	local _condition_4 = _result_4
	if _condition_4 == nil then
		local _result_5 = base
		if _result_5 ~= nil then
			_result_5 = _result_5.maxWidth
		end
		_condition_4 = _result_5
	end
	_object[_left_4] = _condition_4
	local _left_5 = "minHeight"
	local _result_5 = override
	if _result_5 ~= nil then
		_result_5 = _result_5.minHeight
	end
	local _condition_5 = _result_5
	if _condition_5 == nil then
		local _result_6 = base
		if _result_6 ~= nil then
			_result_6 = _result_6.minHeight
		end
		_condition_5 = _result_6
	end
	_object[_left_5] = _condition_5
	local _left_6 = "maxHeight"
	local _result_6 = override
	if _result_6 ~= nil then
		_result_6 = _result_6.maxHeight
	end
	local _condition_6 = _result_6
	if _condition_6 == nil then
		local _result_7 = base
		if _result_7 ~= nil then
			_result_7 = _result_7.maxHeight
		end
		_condition_6 = _result_7
	end
	_object[_left_6] = _condition_6
	local _left_7 = "position"
	local _result_7 = override
	if _result_7 ~= nil then
		_result_7 = _result_7.position
	end
	local _condition_7 = _result_7
	if _condition_7 == nil then
		local _result_8 = base
		if _result_8 ~= nil then
			_result_8 = _result_8.position
		end
		_condition_7 = _result_8
	end
	_object[_left_7] = _condition_7
	local _left_8 = "anchor"
	local _result_8 = override
	if _result_8 ~= nil then
		_result_8 = _result_8.anchor
	end
	local _condition_8 = _result_8
	if _condition_8 == nil then
		local _result_9 = base
		if _result_9 ~= nil then
			_result_9 = _result_9.anchor
		end
		_condition_8 = _result_9
	end
	_object[_left_8] = _condition_8
	local _left_9 = "center"
	local _result_9 = override
	if _result_9 ~= nil then
		_result_9 = _result_9.center
	end
	local _condition_9 = _result_9
	if _condition_9 == nil then
		local _result_10 = base
		if _result_10 ~= nil then
			_result_10 = _result_10.center
		end
		_condition_9 = _result_10
	end
	_object[_left_9] = _condition_9
	local _left_10 = "p"
	local _result_10 = override
	if _result_10 ~= nil then
		_result_10 = _result_10.p
	end
	local _condition_10 = _result_10
	if _condition_10 == nil then
		local _result_11 = base
		if _result_11 ~= nil then
			_result_11 = _result_11.p
		end
		_condition_10 = _result_11
	end
	_object[_left_10] = _condition_10
	local _left_11 = "px"
	local _result_11 = override
	if _result_11 ~= nil then
		_result_11 = _result_11.px
	end
	local _condition_11 = _result_11
	if _condition_11 == nil then
		local _result_12 = base
		if _result_12 ~= nil then
			_result_12 = _result_12.px
		end
		_condition_11 = _result_12
	end
	_object[_left_11] = _condition_11
	local _left_12 = "py"
	local _result_12 = override
	if _result_12 ~= nil then
		_result_12 = _result_12.py
	end
	local _condition_12 = _result_12
	if _condition_12 == nil then
		local _result_13 = base
		if _result_13 ~= nil then
			_result_13 = _result_13.py
		end
		_condition_12 = _result_13
	end
	_object[_left_12] = _condition_12
	local _left_13 = "pt"
	local _result_13 = override
	if _result_13 ~= nil then
		_result_13 = _result_13.pt
	end
	local _condition_13 = _result_13
	if _condition_13 == nil then
		local _result_14 = base
		if _result_14 ~= nil then
			_result_14 = _result_14.pt
		end
		_condition_13 = _result_14
	end
	_object[_left_13] = _condition_13
	local _left_14 = "pr"
	local _result_14 = override
	if _result_14 ~= nil then
		_result_14 = _result_14.pr
	end
	local _condition_14 = _result_14
	if _condition_14 == nil then
		local _result_15 = base
		if _result_15 ~= nil then
			_result_15 = _result_15.pr
		end
		_condition_14 = _result_15
	end
	_object[_left_14] = _condition_14
	local _left_15 = "pb"
	local _result_15 = override
	if _result_15 ~= nil then
		_result_15 = _result_15.pb
	end
	local _condition_15 = _result_15
	if _condition_15 == nil then
		local _result_16 = base
		if _result_16 ~= nil then
			_result_16 = _result_16.pb
		end
		_condition_15 = _result_16
	end
	_object[_left_15] = _condition_15
	local _left_16 = "pl"
	local _result_16 = override
	if _result_16 ~= nil then
		_result_16 = _result_16.pl
	end
	local _condition_16 = _result_16
	if _condition_16 == nil then
		local _result_17 = base
		if _result_17 ~= nil then
			_result_17 = _result_17.pl
		end
		_condition_16 = _result_17
	end
	_object[_left_16] = _condition_16
	local _left_17 = "bg"
	local _result_17 = override
	if _result_17 ~= nil then
		_result_17 = _result_17.bg
	end
	local _condition_17 = _result_17
	if _condition_17 == nil then
		local _result_18 = base
		if _result_18 ~= nil then
			_result_18 = _result_18.bg
		end
		_condition_17 = _result_18
	end
	_object[_left_17] = _condition_17
	local _left_18 = "bgTransparency"
	local _result_18 = override
	if _result_18 ~= nil then
		_result_18 = _result_18.bgTransparency
	end
	local _condition_18 = _result_18
	if _condition_18 == nil then
		local _result_19 = base
		if _result_19 ~= nil then
			_result_19 = _result_19.bgTransparency
		end
		_condition_18 = _result_19
	end
	_object[_left_18] = _condition_18
	local _left_19 = "sizeConstraint"
	local _result_19 = base
	if _result_19 ~= nil then
		_result_19 = _result_19.sizeConstraint
	end
	local _result_20 = override
	if _result_20 ~= nil then
		_result_20 = _result_20.sizeConstraint
	end
	_object[_left_19] = mergeSharedSizeConstraint(_result_19, _result_20)
	local _left_20 = "clip"
	local _result_21 = override
	if _result_21 ~= nil then
		_result_21 = _result_21.clip
	end
	local _condition_19 = _result_21
	if _condition_19 == nil then
		local _result_22 = base
		if _result_22 ~= nil then
			_result_22 = _result_22.clip
		end
		_condition_19 = _result_22
	end
	_object[_left_20] = _condition_19
	local _left_21 = "visible"
	local _result_22 = override
	if _result_22 ~= nil then
		_result_22 = _result_22.visible
	end
	local _condition_20 = _result_22
	if _condition_20 == nil then
		local _result_23 = base
		if _result_23 ~= nil then
			_result_23 = _result_23.visible
		end
		_condition_20 = _result_23
	end
	_object[_left_21] = _condition_20
	local _left_22 = "layoutOrder"
	local _result_23 = override
	if _result_23 ~= nil then
		_result_23 = _result_23.layoutOrder
	end
	local _condition_21 = _result_23
	if _condition_21 == nil then
		local _result_24 = base
		if _result_24 ~= nil then
			_result_24 = _result_24.layoutOrder
		end
		_condition_21 = _result_24
	end
	_object[_left_22] = _condition_21
	local _left_23 = "zIndex"
	local _result_24 = override
	if _result_24 ~= nil then
		_result_24 = _result_24.zIndex
	end
	local _condition_22 = _result_24
	if _condition_22 == nil then
		local _result_25 = base
		if _result_25 ~= nil then
			_result_25 = _result_25.zIndex
		end
		_condition_22 = _result_25
	end
	_object[_left_23] = _condition_22
	return _object
end
return {
	mergeSharedStyleProps = mergeSharedStyleProps,
}
