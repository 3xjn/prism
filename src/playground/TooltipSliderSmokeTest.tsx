import React from "@rbxts/react";

import { Box, Slider, Stack, Text, Tooltip } from "@prism";
import { ThemeProvider, useTheme } from "@prism/theme";

function TooltipSliderSmokeTestSurface(): React.ReactElement {
	const theme = useTheme();
	const [sliderValue, setSliderValue] = React.useState(25);
	const [endedValue, setEndedValue] = React.useState(25);

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
					<Text text="Tooltip + Slider smoke test" size="lg" weight={700} color="text.primary" />
					<Text
						text="Hover the labeled target and the slider thumb/track. The forced-open row gives a stable reference for checking whether the tooltip sits too far above its trigger."
						color="text.secondary"
						wrap
						width="100%"
					/>

					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="lg">
							<Stack width="100%" direction="horizontal" align="center" gap="md">
								<Tooltip content="Tooltip on a regular element" gap={8}>
									<Box width={210} bg="background.surface" radius="md" borderColor="border.subtle" p="md">
										<Text text="Hover this tooltiped element" color="text.primary" />
									</Box>
								</Tooltip>
								<Tooltip content="Forced-open reference" opened gap={8}>
									<Box width={160} bg="background.surface" radius="md" borderColor="border.subtle" p="md">
										<Text text="Forced open" color="text.primary" />
									</Box>
								</Tooltip>
							</Stack>

							<Stack width="100%" gap="sm">
								<Text text="Slider with built-in value tooltip" weight={600} color="text.primary" />
								<Slider
									value={sliderValue}
									onChange={setSliderValue}
									onChangeEnd={setEndedValue}
									min={0}
									max={100}
									step={1}
									tooltip
									fullWidth
								/>
								<Text
									text={`Slider value: ${tostring(sliderValue)} | end: ${tostring(endedValue)}`}
									size="sm"
									color="text.secondary"
									wrap
									width="100%"
								/>
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
}

export function TooltipSliderSmokeTest(): React.ReactElement {
	return (
		<ThemeProvider>
			<TooltipSliderSmokeTestSurface />
		</ThemeProvider>
	);
}
