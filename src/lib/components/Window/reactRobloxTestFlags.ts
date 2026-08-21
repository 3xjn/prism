// Side-effect module: import this before @rbxts/react and @rbxts/react-roblox.
//
// ReactIsolatedGlobalsEnabled copies flags from _G into a ReactGlobals table on
// first require. Jest loadstring sandboxes mean a spec's `_G` writes may not be
// the table ReactGlobals reads, so we also require ReactGlobals through Jest's
// sandboxed require and set the flags on that table before ReactRoblox loads.
// ReactRoblox.act is only wired when __ROACT_17_MOCK_SCHEDULER__ is already set.

interface ReactLuaTestGlobals {
	__DEV__: boolean;
	__ROACT_17_MOCK_SCHEDULER__: boolean;
}

function enableReactRobloxAct(globals: ReactLuaTestGlobals) {
	globals.__DEV__ = true;
	globals.__ROACT_17_MOCK_SCHEDULER__ = true;
}

enableReactRobloxAct(_G as unknown as ReactLuaTestGlobals);

const rbxtsJs = game
	.GetService("ReplicatedStorage")
	.WaitForChild("rbxts_include")
	.WaitForChild("node_modules")
	.WaitForChild("@rbxts-js");

const reactGlobalsModule = rbxtsJs.FindFirstChild("ReactGlobals") ?? rbxtsJs.FindFirstChild("react-globals");
if (reactGlobalsModule === undefined || !reactGlobalsModule.IsA("ModuleScript")) {
	error("ReactGlobals ModuleScript not found under ReplicatedStorage.rbxts_include.node_modules.@rbxts-js");
}

enableReactRobloxAct(require(reactGlobalsModule) as ReactLuaTestGlobals);
