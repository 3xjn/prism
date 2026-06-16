import React from "@rbxts/react";

import { Box, Icon, Popover, Stack, Text } from "@prism";
import { ThemeProvider, useTheme } from "@prism/theme";

function PopoverPanel({ title, detail }: { readonly title: string; readonly detail: string }): React.ReactElement {
	return (
		<Stack width={260} gap="sm">
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Box width={34} height={34} bg="primary.light" radius="sm">
					<Stack width="100%" height="100%" align="center" justify="center">
						<Icon name="server" size={18} color="primary.main" />
					</Stack>
				</Box>
				<Stack width="100%" gap="xs">
					<Text text={title} weight={700} color="text.primary" />
					<Text text="Portal anchored panel" size="sm" color="text.secondary" />
				</Stack>
			</Stack>
			<Text text={detail} size="sm" color="text.primary" wrap width="100%" />
			<Box width="100%" height={1} bg="border.subtle" />
			<Stack width="100%" direction="horizontal" align="center" justify="spaceBetween">
				<Text text="Ready for Menu" size="sm" weight={700} color="success.main" />
				<Text text="outside click closes" size="sm" color="text.secondary" />
			</Stack>
		</Stack>
	);
}

function PopoverTrigger({ title, detail }: { readonly title: string; readonly detail: string }): React.ReactElement {
	return (
		<Box width={240} bg="background.surface" radius="md" border={1} borderColor="border.default" p="md">
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Icon name="settings" size={22} color="primary.main" />
				<Stack width="100%" gap="xs">
					<Text text={title} weight={700} color="text.primary" />
					<Text text={detail} size="sm" color="text.secondary" wrap width="100%" />
				</Stack>
			</Stack>
		</Box>
	);
}

function PopoverSmokeTestSurface(): React.ReactElement {
	const theme = useTheme();
	const [opened, setOpened] = React.useState(false);

	return (
		<Box width="100%" height="100%" bgTransparency={1}>
			<Box width={680} position={UDim2.fromOffset(24, 24)} bg="background.surface" radius="lg" borderColor="border.subtle" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Popover smoke test" size="lg" weight={700} color="text.primary" />
					<Text
						text="Main Studio smoke for the trigger-anchored Popover seam. Click the first trigger, use the forced-open reference to inspect placement, and hover the third trigger."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" height={360} bg={theme.colors.action.hover} radius="md" p="xl">
						<Stack width="100%" height="100%" gap="xl" align="center" justify="center">
							<Stack width="100%" direction="horizontal" align="center" justify="spaceBetween">
								<Popover
									content={<PopoverPanel title="Relay Intel" detail="Click toggles this panel. Press outside the panel to verify the invisible outside-dismiss capture." />}
									opened={opened}
									onOpenedChange={setOpened}
									placement="bottom"
									align="center"
									gap={12}
								>
									<PopoverTrigger title="Click popover" detail={opened ? "Panel open" : "Panel closed"} />
								</Popover>

								<Popover
									content={<PopoverPanel title="Placement Reference" detail="This forced-open panel proves the portal can anchor above the trigger without needing a modal backdrop." />}
									opened
									placement="top"
									align="end"
									gap={12}
									closeOnOutsidePress={false}
								>
									<PopoverTrigger title="Forced open" detail="Top/end reference" />
								</Popover>
							</Stack>

							<Popover
								content={<PopoverPanel title="Hover Intel" detail="Hover mode is trigger-bound. Menu can build richer interaction semantics on this anchored shell." />}
								triggerMode="hover"
								placement="right"
								align="center"
								gap={4}
								offset={new Vector2(-8, 0)}
							>
								<PopoverTrigger title="Hover popover" detail="Move over this card" />
							</Popover>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
}

export function PopoverSmokeTest(): React.ReactElement {
	return (
		<ThemeProvider>
			<PopoverSmokeTestSurface />
		</ThemeProvider>
	);
}
