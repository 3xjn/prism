import React from "@rbxts/react";

import { Box, SegmentedControl, Stack, Text } from "@prism";
import type { SegmentedControlOption } from "@prism";
import { ThemeProvider, useTheme } from "@prism/theme";

const PARTY_OPTIONS: readonly SegmentedControlOption[] = [
	{ value: "solo", label: "Solo" },
	{ value: "duo", label: "Duo" },
	{ value: "squad", label: "Squad" },
];

const PACE_OPTIONS: readonly SegmentedControlOption[] = [
	{ value: "quick", label: "Quick" },
	{ value: "standard", label: "Standard" },
	{ value: "ranked", label: "Ranked", disabled: true },
];

function SegmentedControlSmokeTestSurface(): React.ReactElement {
	const theme = useTheme();
	const [party, setParty] = React.useState("duo");
	const [pace, setPace] = React.useState("standard");

	return (
		<Box width="100%" height="100%" bgTransparency={1}>
			<Box
				width={520}
				position={UDim2.fromOffset(24, 24)}
				bg="background.surface"
				radius="lg"
				borderColor="border.subtle"
				p="lg"
			>
				<Stack width="100%" gap="md">
					<Text text="SegmentedControl smoke test" size="lg" weight={700} color="text.primary" />
					<Text
						text="Visible game-option picker for compact choices. Check whether it reads like a settings control rather than SaaS tabs."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="md">
							<Stack width="100%" gap="xs">
								<Text text="Party size" size="sm" weight={700} color="text.primary" />
								<SegmentedControl options={PARTY_OPTIONS} value={party} onChange={setParty} color="primary" fullWidth width="100%" />
							</Stack>
							<Stack width="100%" gap="xs">
								<Text text="Match pace" size="sm" weight={700} color="text.primary" />
								<SegmentedControl options={PACE_OPTIONS} value={pace} onChange={setPace} variant="outline" color="primary" fullWidth width="100%" />
							</Stack>
							<Stack width="100%" direction="horizontal" gap="sm" align="center">
								<SegmentedControl options={PARTY_OPTIONS} value={party} onChange={setParty} size="sm" />
								<Text text={`Selected: ${party} | ${pace}`} size="sm" color="text.secondary" />
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
}

export function SegmentedControlSmokeTest(): React.ReactElement {
	return (
		<ThemeProvider>
			<SegmentedControlSmokeTestSurface />
		</ThemeProvider>
	);
}
