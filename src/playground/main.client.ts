import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { PopoverSmokeTest } from "./PopoverSmokeTest";

const Players = game.GetService("Players");
const SCREEN_GUI_NAME = "PrismPopoverSmokeTest";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
const existingGui = playerGui.FindFirstChild(SCREEN_GUI_NAME);

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
root.render(React.createElement(PopoverSmokeTest));

let cleanedUp = false;
let ancestryConnection: RBXScriptConnection | undefined;

const cleanup = () => {
	if (cleanedUp) {
		return;
	}

	cleanedUp = true;
	root.unmount();
	screenGui.Destroy();
	ancestryConnection?.Disconnect();
};

ancestryConnection = script.AncestryChanged.Connect((_instance, parent) => {
	if (parent === undefined) {
		cleanup();
	}
});
