--[[
	Open Cloud Jest loadstring-isolates each spec (fresh RuntimeLib / TS table)
	while sharing `_G`. TypeScript `import { describe } from "@rbxts/jest-globals"`
	compiles to `TS.import`, which trips RuntimeLib's `_G[module]` check on the
	second spec.

	Load Jest globals once via Lua `require` (not RuntimeLib) and publish them
	on `_G` so specs can use injectGlobals without re-entering RuntimeLib.
]]

if _G.describe ~= nil then
	return true
end

local jestGlobals = require(script.Parent
	:WaitForChild("node_modules")
	:WaitForChild("@rbxts")
	:WaitForChild("jest-globals")
	:WaitForChild("src"))

_G.afterAll = jestGlobals.afterAll
_G.afterEach = jestGlobals.afterEach
_G.beforeAll = jestGlobals.beforeAll
_G.beforeEach = jestGlobals.beforeEach
_G.describe = jestGlobals.describe
_G.expect = jestGlobals.expect
_G.it = jestGlobals.it
_G.test = jestGlobals.test

return true
