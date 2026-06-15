import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { SegmentedControlSmokeTest } from "./SegmentedControlSmokeTest";

const Players = game.GetService("Players");
const SCREEN_GUI_NAME = "PrismSegmentedControlSmokeTest";
const STALE_BRIDGE_GUI_NAME = "PrismBridgeLuauSmoke";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const existingGui = playerGui.FindFirstChild(SCREEN_GUI_NAME);

const destroyStaleBridgeGui = () => {
	const staleBridgeGui = playerGui.FindFirstChild(STALE_BRIDGE_GUI_NAME);

	if (staleBridgeGui?.IsA("ScreenGui")) {
		staleBridgeGui.Destroy();
	}
};

destroyStaleBridgeGui();
task.defer(destroyStaleBridgeGui);
task.delay(0.25, destroyStaleBridgeGui);
task.delay(1, destroyStaleBridgeGui);
task.delay(2, destroyStaleBridgeGui);

if (existingGui?.IsA("ScreenGui")) {
	existingGui.Destroy();
}

const screenGui = new Instance("ScreenGui");
screenGui.Name = SCREEN_GUI_NAME;
screenGui.DisplayOrder = 1000;
screenGui.IgnoreGuiInset = true;
screenGui.ResetOnSpawn = false;
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
screenGui.Parent = playerGui;

const root = ReactRoblox.createRoot(screenGui);
root.render(React.createElement(SegmentedControlSmokeTest));

let cleanedUp = false;

const cleanup = () => {
	if (cleanedUp) {
		return;
	}

	cleanedUp = true;
	root.unmount();
	screenGui.Destroy();
	ancestryConnection.Disconnect();
};

const ancestryConnection = script.AncestryChanged.Connect((_instance, parent) => {
	if (parent === undefined) {
		cleanup();
	}
});
