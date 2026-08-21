import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Icon, Stack, Text, Window } from "@prism";
import { useTheme, theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyDensityControl, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	density: storyDensityControl,
	title: String("Inspector"),
	showRail: Boolean(true),
	showClose: Boolean(true),
	showLeading: Boolean(true),
};

type WindowStoryControls = InferControls<typeof controls>;

function WindowStoryCanvas({ controls: currentControls }: { readonly controls: WindowStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [closed, setClosed] = React.useState(false);
	const [collapsed, setCollapsed] = React.useState(false);
	const [maximized, setMaximized] = React.useState(false);
	const reopen = React.useCallback(() => {
		setClosed(false);
		setCollapsed(false);
		setMaximized(false);
	}, []);

	const rail = currentControls.showRail ? (
		<Stack width="100%" height="100%" p="sm" gap="sm" align="center">
			<Icon name="search" size="sm" color={themeRefs.text.secondary} />
			<Icon name="file-text" size="sm" color={themeRefs.text.secondary} />
			<Icon name="settings" size="sm" color={themeRefs.text.secondary} />
		</Stack>
	) : undefined;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Window" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Floating overlay with a title bar, optional rail, drag, corner resize, collapse, and maximize. Host it in a ScreenGui with ZIndexBehavior.Sibling, same as Modal. Maximize fills that LayerCollector flush."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					{closed ? <Button label="Reopen window" onPress={reopen} /> : undefined}
				</Stack>
			</Box>
			{closed ? undefined : (
				<Window
					title={currentControls.title}
					width={560}
					height={360}
					minWidth={320}
					minHeight={220}
					collapsed={collapsed}
					onCollapsedChange={setCollapsed}
					maximized={maximized}
					onMaximizedChange={setMaximized}
					onClose={currentControls.showClose ? () => setClosed(true) : undefined}
					leading={
						currentControls.showLeading ? <Icon name="app-window" size="sm" color={themeRefs.text.secondary} /> : undefined
					}
					rail={rail}
				>
					<Box width="100%" height="100%" p="md" bg={theme.colors.background.default}>
						<Stack width="100%" gap="sm">
							<Text text="Content slot" weight={700} color={themeRefs.text.primary} />
							<Text
								text="The rail is consumer-supplied. Collapse hides chrome and leaves a compact reopen control. Close is omitted unless onClose is passed."
								color={themeRefs.text.secondary}
								wrap
								width="100%"
							/>
						</Stack>
					</Box>
				</Window>
			)}
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Window",
		summary:
			"Portaled floating frame with title-bar drag, corner resize, collapse, maximize, an optional rail slot, and opt-in close. Uses theme surfaces and density; host in a Sibling ScreenGui.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme} density={props.controls.density}>
				<WindowStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
