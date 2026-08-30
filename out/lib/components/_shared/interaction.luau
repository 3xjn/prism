-- Compiled with roblox-ts v3.0.0
local function isPressInput(input)
	return input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch
end
local function resolveDragInputKind(input)
	if input.UserInputType == Enum.UserInputType.MouseButton1 then
		return "mouse"
	end
	if input.UserInputType == Enum.UserInputType.Touch then
		return "touch"
	end
	return nil
end
local function shouldHandleTouchDragMoveInput(kind, activeTouch, input)
	if kind == "touch" then
		return input.UserInputType == Enum.UserInputType.Touch and input == activeTouch
	end
	return false
end
local function shouldHandleMouseDragMoveInput(kind, input)
	return kind == "mouse" and input.UserInputType == Enum.UserInputType.MouseMovement
end
local function isMouseDragActive(kind)
	return kind == "mouse"
end
local function shouldHandleDragEndInput(kind, activeTouch, input)
	if kind == "mouse" then
		return input.UserInputType == Enum.UserInputType.MouseButton1
	end
	if kind == "touch" then
		return input.UserInputType == Enum.UserInputType.Touch and input == activeTouch
	end
	return false
end
local function asEventHandler(value)
	local _value = value
	return if typeof(_value) == "function" then value else nil
end
local function composeEventMaps(internal, external)
	if internal == nil then
		return external
	end
	if external == nil then
		return internal
	end
	local composed = {}
	local internalHandlers = internal
	local externalHandlers = external
	for key, handler in pairs(internalHandlers) do
		local resolvedHandler = asEventHandler(handler)
		if resolvedHandler ~= nil then
			composed[key] = resolvedHandler
		end
	end
	for key, handler in pairs(externalHandlers) do
		local resolvedHandler = asEventHandler(handler)
		if resolvedHandler == nil then
			continue
		end
		local handlerKey = key
		local internalHandler = asEventHandler(internalHandlers[handlerKey])
		composed[handlerKey] = if internalHandler == nil then resolvedHandler else function(...)
			local args = { ... }
			internalHandler(unpack(args))
			resolvedHandler(unpack(args))
		end
	end
	return composed
end
local function assignRef(ref, value)
	if ref == nil then
		return nil
	end
	local _ref = ref
	if typeof(_ref) == "function" then
		ref(value)
		return nil
	end
	ref.current = value
end
return {
	isPressInput = isPressInput,
	resolveDragInputKind = resolveDragInputKind,
	shouldHandleTouchDragMoveInput = shouldHandleTouchDragMoveInput,
	shouldHandleMouseDragMoveInput = shouldHandleMouseDragMoveInput,
	isMouseDragActive = isMouseDragActive,
	shouldHandleDragEndInput = shouldHandleDragEndInput,
	composeEventMaps = composeEventMaps,
	assignRef = assignRef,
}
