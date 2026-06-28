import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";
import ReactRoblox from "@rbxts/react-roblox";
import { Boolean, CreateReactStory, EnumList } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { Box, Stack, Tabs, Text } from "@prism";
import type { TabsColor, TabsSize, TabsTab, TabsVariant } from "@prism";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	variant: EnumList({ line: "line", contained: "contained" }, "line"),
	color: EnumList(
		{
			primary: "primary",
			secondary: "secondary",
			info: "info",
			success: "success",
			warning: "warning",
			error: "error",
		},
		"primary",
	),
	size: EnumList(
		{
			xs: "xs",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"md",
	),
	disabled: Boolean(false),
	fullWidth: Boolean(false),
	keepMounted: Boolean(false),
};

type TabsStoryControls = InferControls<typeof controls>;

function MissionPanel({
	title,
	body,
	accent,
}: {
	readonly title: string;
	readonly body: string;
	readonly accent: string;
}): React.ReactElement {
	return (
		<Stack width="100%" gap="xs">
			<Text text={accent} size="xs" weight={800} color={themeRefs.primary.main} />
			<Text text={title} size="lg" weight={800} color={themeRefs.text.primary} />
			<Text text={body} color={themeRefs.text.secondary} wrap width="100%" />
		</Stack>
	);
}

function createTabs(): readonly TabsTab[] {
	return [
		{
			value: "briefing",
			label: "Briefing",
			panel: (
				<MissionPanel
					accent="ACTIVE OPS"
					title="Storm Relay"
					body="Pick the next squad objective and review the modifiers before launch."
				/>
			),
		},
		{
			value: "loadout",
			label: "Loadout",
			panel: (
				<MissionPanel
					accent="GEAR LOCK"
					title="Arc Lance Ready"
					body="Tune weapons, boosts, and support tools without leaving the mission flow."
				/>
			),
		},
		{
			value: "rewards",
			label: "Rewards",
			panel: (
				<MissionPanel
					accent="CLAIMABLE"
					title="3 Cache Drops"
					body="Preview what this route unlocks and keep disabled routes visible for context."
				/>
			),
		},
		{
			value: "locked",
			label: "Locked",
			panel: (
				<MissionPanel
					accent="LOCKED"
					title="Clear Wave 8"
					body="Disabled tabs remain readable but cannot be activated."
				/>
			),
			disabled: true,
		},
	];
}

function TabsStoryCanvas({ controls: currentControls }: { readonly controls: TabsStoryControls }): React.ReactElement {
	const [activeTab, setActiveTab] = React.useState("briefing");
	const tabs = React.useMemo(createTabs, []);
	const resolvedVariant = currentControls.variant as TabsVariant;
	const resolvedColor = currentControls.color as TabsColor;
	const resolvedSize = currentControls.size as TabsSize;
	const width = currentControls.fullWidth ? "100%" : undefined;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Tabs" size="lg" weight={700} color={themeRefs.text.primary} />
					<Tabs
						tabs={tabs}
						value={activeTab}
						onChange={setActiveTab}
						variant={resolvedVariant}
						color={resolvedColor}
						size={resolvedSize}
						disabled={currentControls.disabled}
						fullWidth={currentControls.fullWidth}
						keepMounted={currentControls.keepMounted}
						width={width}
					/>
					<Text text={`Selected: ${activeTab}`} size="sm" color={themeRefs.text.secondary} wrap width="100%" />
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Tabs",
		summary: "Concise content navigation with controlled state, disabled tabs, and an owned panel region.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<TabsStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
