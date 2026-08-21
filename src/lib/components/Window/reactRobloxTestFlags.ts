// Side-effect module: import this before @rbxts/react and @rbxts/react-roblox.
// ReactGlobals copies these from _G on first require; ReactRoblox.act is only
// wired when __ROACT_17_MOCK_SCHEDULER__ is already set at that moment.

interface ReactLuaTestGlobals {
	__DEV__: boolean;
	__ROACT_17_MOCK_SCHEDULER__: boolean;
}

const globals = _G as unknown as ReactLuaTestGlobals;
globals.__DEV__ = true;
globals.__ROACT_17_MOCK_SCHEDULER__ = true;
