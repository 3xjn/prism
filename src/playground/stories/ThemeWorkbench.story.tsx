import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";

import { ThemeWorkbench } from "../theme-workbench";

const story = CreateReactStory(
	{
		name: "Theme Workbench",
		summary:
			"Internal theme editor with immutable presets, deterministic TypeScript/Luau export, and responsive real-component compositions.",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {},
	},
	(props) => <ThemeWorkbench target={props.target} />,
);

export = story;
