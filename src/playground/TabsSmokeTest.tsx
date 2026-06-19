import React from "@rbxts/react";

import { Box, Stack, Tabs, Text } from "@prism";
import type { TabsTab } from "@prism";
import { ThemeProvider } from "@prism/theme";

function SmokePanel({
	eyebrow,
	title,
	body,
}: {
	readonly eyebrow: string;
	readonly title: string;
	readonly body: string;
}): React.ReactElement {
	return (
		<Stack width="100%" gap="xs">
			<Text text={eyebrow} size="xs" weight={800} color="primary.main" />
			<Text text={title} size="lg" weight={800} color="text.primary" />
			<Text text={body} color="text.secondary" wrap width="100%" />
		</Stack>
	);
}

function createSmokeTabs(): readonly TabsTab[] {
	return [
		{
			value: "briefing",
			label: "Briefing",
			panel: (
				<SmokePanel
					eyebrow="ACTIVE"
					title="Briefing panel"
					body="This panel should be visible when the Briefing tab is selected."
				/>
			),
		},
		{
			value: "loadout",
			label: "Loadout",
			panel: (
				<SmokePanel
					eyebrow="READY"
					title="Loadout panel"
					body="Clicking Loadout should switch the selected readout and panel content."
				/>
			),
		},
		{
			value: "rewards",
			label: "Rewards",
			panel: (
					<SmokePanel
						eyebrow="CLAIM"
						title="Rewards panel"
						body="This verifies a third enabled tab without adding another menu surface."
					/>
				),
		},
		{
			value: "locked",
			label: "Locked",
			panel: (
				<SmokePanel eyebrow="LOCKED" title="Locked panel" body="This panel should not become active from user input." />
			),
			disabled: true,
		},
	];
}

function TabsSmokeTestSurface(): React.ReactElement {
	const [selected, setSelected] = React.useState("briefing");
	const smokeTabs = React.useMemo(createSmokeTabs, []);

	return (
		<Box width="100%" height="100%" bgTransparency={1}>
			<Box
				width={620}
				position={UDim2.fromOffset(24, 24)}
				bg="background.surface"
				radius="lg"
				borderColor="border.subtle"
				p="lg"
			>
				<Stack width="100%" gap="md">
					<Text text="Tabs" size="lg" weight={700} color="text.primary" />
					<Tabs tabs={smokeTabs} value={selected} onChange={setSelected} fullWidth width="100%" keepMounted />
					<Text text={`Selected: ${selected}`} size="sm" color="text.secondary" width="100%" />
				</Stack>
			</Box>
		</Box>
	);
}

export function TabsSmokeTest(): React.ReactElement {
	return (
		<ThemeProvider>
			<TabsSmokeTestSurface />
		</ThemeProvider>
	);
}
