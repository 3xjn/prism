import React from "@rbxts/react";

import { Box, Stack, StepperInput, Text } from "@prism";
import { ThemeProvider, useTheme } from "@prism/theme";

function StepperInputSmokeTestSurface(): React.ReactElement {
	const theme = useTheme();
	const [squadCap, setSquadCap] = React.useState(4);
	const [respawns, setRespawns] = React.useState(3);
	const [throttle, setThrottle] = React.useState(1.25);

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
					<Text text="StepperInput smoke test" size="lg" weight={700} color="text.primary" />
					<Text
						text="Settings-row number rails. Drag the center value to scrub, use arrows for exact steps, and test range clamps plus disabled/read-only behavior."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Stack width="100%" direction="horizontal" gap="md" align="center" justify="spaceBetween">
								<Text text="Squad capacity" size="sm" weight={700} color="text.primary" />
								<StepperInput value={squadCap} onChange={setSquadCap} min={1} max={8} step={1} width={360} />
							</Stack>
							<Stack width="100%" direction="horizontal" gap="md" align="center" justify="spaceBetween">
								<Text text="Respawn charges" size="sm" weight={700} color="text.primary" />
								<StepperInput
									value={respawns}
									onChange={setRespawns}
									min={0}
									max={6}
									step={1}
									variant="subtle"
									formatValue={(currentValue) => `${tostring(currentValue)} charges`}
									width={360}
								/>
							</Stack>
							<Stack width="100%" direction="horizontal" gap="md" align="center" justify="spaceBetween">
								<Text text="Throttle multiplier" size="sm" weight={700} color="text.primary" />
								<StepperInput value={throttle} onChange={setThrottle} min={0.5} max={2} step={0.25} size="sm" width={220} formatValue={(currentValue) => `${tostring(currentValue)}x`} />
							</Stack>
							<Stack width="100%" direction="horizontal" gap="md" align="center" justify="spaceBetween">
								<Text text="Locked reserve" size="sm" weight={700} color="text.primary" />
								<StepperInput defaultValue={10} min={0} max={10} step={1} size="sm" width={220} readOnly formatValue={(currentValue) => `${tostring(currentValue)} locked`} />
							</Stack>
							<Text text={`Cap ${squadCap} | Respawns ${respawns} | Throttle ${throttle}x`} size="sm" color="text.secondary" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
}

export function StepperInputSmokeTest(): React.ReactElement {
	return (
		<ThemeProvider>
			<StepperInputSmokeTestSurface />
		</ThemeProvider>
	);
}
