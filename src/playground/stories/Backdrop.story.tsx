import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Backdrop, Box, Button, Stack, Text } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	visible: Boolean(true),
	opacity: Number(0.42, 0, 1, 0.05),
};

type BackdropStoryControls = InferControls<typeof controls>;

function BackdropStoryCanvas({ controls: currentControls }: { readonly controls: BackdropStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [dismissed, setDismissed] = React.useState(false);
	const shown = currentControls.visible && !dismissed;

	React.useEffect(() => {
		setDismissed(false);
	}, [currentControls.visible]);

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Backdrop" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="A full-screen dimming layer for overlays. Click the backdrop to test the press handler while slotProps remain available for raw TextButton overrides."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" height={220} bg={theme.colors.action.hover} radius="md" p="lg" clip>
						<Stack width="100%" gap="sm">
							<Text text="Preview area" weight={600} color={themeRefs.text.primary} />
							<Text text={shown ? "Backdrop is visible. Click the dim layer to dismiss it." : "Backdrop dismissed."} color={themeRefs.text.secondary} wrap width="100%" />
							<Button label="Show backdrop" onPress={() => setDismissed(false)} />
						</Stack>
						<Backdrop visible={shown} opacity={currentControls.opacity} onPress={() => setDismissed(true)} zIndex={8} />
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Backdrop",
		summary: "Clickable full-area dimming layer for modals, drawers, tooltips, and other overlay compositions.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<BackdropStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
