import React from "@rbxts/react";

import { Box, Button, Modal, Stack, Text } from "@prism";
import { ThemeProvider, useTheme } from "@prism/theme";

function ModalSmokeTestSurface(): React.ReactElement {
	const theme = useTheme();
	const [opened, setOpened] = React.useState(false);

	const openModal = React.useCallback(() => {
		setOpened(true);
	}, []);

	const closeModal = React.useCallback(() => {
		setOpened(false);
	}, []);

	return (
		<Box width="100%" height="100%" bgTransparency={1}>
			<Box
				width={380}
				position={UDim2.fromOffset(24, 24)}
				bg="background.surface"
				radius="lg"
				borderColor="border.subtle"
				p="lg"
			>
				<Stack width="100%" gap="md">
					<Text text="Prism Modal smoke test" size="lg" weight={700} color="text.primary" />
					<Text
						text="Development-only check for production-style modal portal behavior outside ui-labs. The backdrop should cover the game viewport, not a story cell."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="md">
						<Stack width="100%" gap="sm">
							<Button label="Open modal smoke test" onPress={openModal} fullWidth />
							<Text
								text="Expected: the overlay escapes this panel and behaves like normal PlayerGui UI."
								size="sm"
								color="text.secondary"
								wrap
								width="100%"
							/>
						</Stack>
					</Box>
				</Stack>
			</Box>
			<Modal opened={opened} onClose={closeModal} title="Modal portal smoke test" size="md" withCloseButton>
				<Stack width="100%" gap="md">
					<Text
						text="This modal is mounted from the playground client script so its portal should cover the in-game viewport instead of the ui-labs story container."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Button label="Close from modal body" onPress={closeModal} />
				</Stack>
			</Modal>
		</Box>
	);
}

export function ModalSmokeTest(): React.ReactElement {
	return (
		<ThemeProvider>
			<ModalSmokeTestSurface />
		</ThemeProvider>
	);
}
