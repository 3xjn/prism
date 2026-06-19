import React from "@rbxts/react";

import { Box, Icon, Menu, Stack, Text } from "@prism";
import type { MenuItem } from "@prism";
import { ThemeProvider, useTheme } from "@prism/theme";

function MenuTrigger({ title, detail }: { readonly title: string; readonly detail: string }): React.ReactElement {
	return (
		<Box width={252} bg="background.surface" radius="md" border={1} borderColor="border.default" p="md">
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Box width={34} height={34} bg="primary.light" radius="sm">
					<Stack width="100%" height="100%" align="center" justify="center">
						<Icon name="settings" size={18} color="primary.main" />
					</Stack>
				</Box>
				<Stack width="100%" gap="xs">
					<Text text={title} weight={700} color="text.primary" />
					<Text text={detail} size="sm" color="text.secondary" wrap width="100%" />
				</Stack>
			</Stack>
		</Box>
	);
}

function MenuSmokeTestSurface(): React.ReactElement {
	const theme = useTheme();
	const [lastAction, setLastAction] = React.useState("none");
	const [controlledOpened, setControlledOpened] = React.useState(false);
	const items: readonly MenuItem[] = [
		{ type: "label", label: "Loadout" },
		{ value: "equip", label: "Equip primary", icon: <Icon name="swords" size={15} color="primary.main" />, rightSection: "E" },
		{ value: "inspect", label: "Inspect stats", icon: <Icon name="scan-search" size={15} color="info.main" />, rightSection: "I" },
		{ value: "favorite", label: "Mark favorite", disabled: true },
		{ type: "divider" },
		{ type: "label", label: "Inventory" },
		{ value: "duplicate", label: "Duplicate kit", icon: <Icon name="copy" size={15} color="secondary.main" /> },
		{ value: "drop", label: "Drop item", icon: <Icon name="trash-2" size={15} color="error.main" />, color: "error", rightSection: "Hold" },
	];

	return (
		<Box width="100%" height="100%" bgTransparency={1}>
			<Box width={760} position={UDim2.fromOffset(24, 24)} bg="background.surface" radius="lg" borderColor="border.subtle" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Menu smoke test" size="lg" weight={700} color="text.primary" />
					<Text
						text="Main Studio smoke for the Popover-backed Menu. Click the controlled menu, verify item presses close it, disabled rows do nothing, outside click dismisses, and the forced-open reference keeps shortcuts inside the panel."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" height={430} bg={theme.colors.action.hover} radius="md" p="xl">
						<Stack width="100%" height="100%" gap="xl" align="center" justify="end">
							<Stack width="100%" direction="horizontal" align="center" justify="spaceBetween">
								<Menu
									items={items}
									opened={controlledOpened}
									onOpenedChange={setControlledOpened}
									onItemPress={setLastAction}
									placement="bottom"
									align="start"
									gap={8}
								>
									<MenuTrigger title="Click menu" detail={controlledOpened ? "Menu open" : "Menu closed"} />
								</Menu>

								<Menu
									items={items}
									opened
									placement="bottom"
									align="end"
									gap={10}
									panelWidth={300}
									maxVisibleItems={6}
									closeOnOutsidePress={false}
								>
									<MenuTrigger title="Forced open" detail="Top/end with shortcuts" />
								</Menu>
							</Stack>

							<Menu
								items={items}
								onItemPress={setLastAction}
								placement="right"
								align="center"
								gap={6}
								panelWidth={260}
							>
								<MenuTrigger title="Compact menu" detail="Right/center placement" />
							</Menu>

							<Text text={`Last action: ${lastAction}`} size="sm" weight={700} color="text.secondary" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
}

export function MenuSmokeTest(): React.ReactElement {
	return (
		<ThemeProvider>
			<MenuSmokeTestSurface />
		</ThemeProvider>
	);
}
