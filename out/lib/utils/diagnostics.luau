-- Compiled with roblox-ts v3.0.0
local RunService = game:GetService("RunService")
local function resolveDiagnosticAction(policy, scope, code)
	local _result = policy.codes
	if _result ~= nil then
		_result = _result[`{scope}.{code}`]
	end
	local _condition = _result
	if _condition == nil then
		local _result_1 = policy.scopes
		if _result_1 ~= nil then
			_result_1 = _result_1[scope]
		end
		_condition = _result_1
		if _condition == nil then
			_condition = policy.defaultAction
		end
	end
	return _condition
end
local function createDiagnostics(policy)
	return {
		scope = function(self, scope)
			return {
				violation = function(self, code, message)
					local _exp = resolveDiagnosticAction(policy, scope, code)
					repeat
						local _fallthrough = false
						if _exp == "ignore" then
							return nil
						end
						if _exp == "warn" then
							warn(message())
							return nil
						end
						if _exp == "throw" then
							error(message())
						end
					until true
				end,
			}
		end,
	}
end
local studioDiagnosticAction = if RunService:IsStudio() then "throw" else "ignore"
local diagnostics = createDiagnostics({
	defaultAction = "ignore",
	scopes = {
		bridge = studioDiagnosticAction,
		component = studioDiagnosticAction,
	},
})
local bridgeDiagnostics = diagnostics:scope("bridge")
local componentDiagnostics = diagnostics:scope("component")
return {
	bridgeDiagnostics = bridgeDiagnostics,
	componentDiagnostics = componentDiagnostics,
}
