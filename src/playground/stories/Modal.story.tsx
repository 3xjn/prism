import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Menu, Modal, Stack, Text } from "@prism";
import type { MenuItem, ModalSize } from "@prism";
import { useTheme, theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";
import { useSelectedObjectLabel } from "./_selectionStoryUtils";

const controls = {
	theme: storyThemeControl,
	size: EnumList(
		{
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"md",
	),
	closeOnBackdropClick: Boolean(true),
	closeOnBack: Boolean(true),
	withCloseButton: Boolean(true),
	fullWidth: Boolean(false),
};

type ModalStoryControls = InferControls<typeof controls>;

function ModalStoryCanvas({
	controls: currentControls,
}: {
	readonly controls: ModalStoryControls;
}): React.ReactElement {
	const theme = useTheme();
	const [opened, setOpened] = React.useState(false);
	const [menuOpened, setMenuOpened] = React.useState(false);
	const selectedObjectLabel = useSelectedObjectLabel();
	const resolvedSize = currentControls.size as ModalSize;
	const closeModal = React.useCallback(() => {
		setMenuOpened(false);
		setOpened(false);
	}, []);
	const openModal = React.useCallback(() => {
		setMenuOpened(false);
		setOpened(true);
	}, []);
	const nestedMenuItems: readonly MenuItem[] = [
		{ value: "resume", label: "Resume mission" },
		{ value: "restart", label: "Restart checkpoint", color: "warning" },
	];

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Modal" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Open the modal, then open Mission actions. The first B (or Escape) closes only that nested Menu; the next closes the Modal and restores the original trigger. Turn Close On Back off to make the Modal a barrier after its Menu closes."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack align="center" width="100%" gap="sm">
							<Button label="Open modal" onPress={openModal} selectionOrder={10} />
							<Text
								text={selectedObjectLabel}
								size="sm"
								weight={600}
								color={themeRefs.primary.main}
								wrap
								width="100%"
							/>
						</Stack>
					</Box>
				</Stack>
			</Box>
			<Modal
				opened={opened}
				onClose={closeModal}
				title="Settings"
				size={resolvedSize}
				fullWidth={currentControls.fullWidth}
				closeOnBackdropClick={currentControls.closeOnBackdropClick}
				closeOnBack={currentControls.closeOnBack}
				withCloseButton={currentControls.withCloseButton}
			>
				<Stack width="100%" gap="md">
					<Text
						text="Use Prism modal defaults for focused app work without pushing the surrounding layout. This reworked version keeps a bounded shell, a scrolling body for longer content, and a centered panel that stays inside the viewport."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Text
						text="Longer content should scroll inside the body instead of forcing the whole panel off-screen. Size presets still control the shell width, and fullWidth expands to the available padded viewport."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Text text={selectedObjectLabel} size="sm" weight={600} color={themeRefs.primary.main} wrap width="100%" />
					<Menu
						items={nestedMenuItems}
						opened={menuOpened}
						onOpenedChange={setMenuOpened}
						closeOnBack
						placement="bottom"
						align="start"
					>
						<Button
							label={menuOpened ? "Mission actions open" : "Open mission actions"}
							onPress={() => setMenuOpened((current) => !current)}
							selectionOrder={10}
						/>
					</Menu>
					<Button label="Close modal" onPress={closeModal} selectionOrder={20} />
				</Stack>
			</Modal>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Modal",
		summary:
			"Controlled dialog with a portal-backed overlay, dim backdrop dismiss, calm card-like panel styling, size presets, and typed slot escapes.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<ModalStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
