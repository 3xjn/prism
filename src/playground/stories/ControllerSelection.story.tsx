import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Input, Slider, Stack, Text } from "@prism";
import { theme as themeRefs, useTheme } from "@prism/theme";
import { CreateReactStory } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";
import { useSelectedObjectLabel } from "./_selectionStoryUtils";

const controls = {
	theme: storyThemeControl,
};

type InstanceBinder<T extends GuiObject> = (instance: T | undefined) => void;

function useInstanceState<T extends GuiObject>(): [T | undefined, InstanceBinder<T>] {
	const [instance, setInstance] = React.useState<T>();
	const bindInstance = React.useCallback((nextInstance: T | undefined) => {
		setInstance((currentInstance) => (currentInstance === nextInstance ? currentInstance : nextInstance));
	}, []);

	return [instance, bindInstance];
}

function ControllerSelectionStoryCanvas(): React.ReactElement {
	const theme = useTheme();
	const [query, setQuery] = React.useState("");
	const [volume, setVolume] = React.useState(55);
	const [friendsOnly, setFriendsOnly] = React.useState(true);
	const [status, setStatus] = React.useState("Route ready");
	const [searchInstance, bindSearchInstance] = useInstanceState<TextBox>();
	const [resetInstance, bindResetInstance] = useInstanceState<TextButton>();
	const [privacyInstance, bindPrivacyInstance] = useInstanceState<TextButton>();
	const [volumeInstance, bindVolumeInstance] = useInstanceState<TextButton>();
	const [queueInstance, bindQueueInstance] = useInstanceState<TextButton>();
	const selectedObjectLabel = useSelectedObjectLabel();
	const columnWidth = new UDim(0.5, -theme.spacing.sm / 2);
	const privacyLabel = friendsOnly ? "Friends only" : "Open squad";

	return (
		<StoryCanvas>
			<Box width="100%" maxWidth={760} bg={themeRefs.background.surface} radius="lg" p="lg">
				<Stack width="100%" gap="lg">
					<Stack width="100%" gap="xs">
						<Text text="NATIVE CONTROLLER ROUTE" size="xs" weight={700} color={themeRefs.primary.main} />
						<Text text="Match setup" size="xl" weight={700} color={themeRefs.text.primary} />
						<Text
							text="Press a D-pad direction to enter Roblox selection, then move through the two-column setup. On Squad volume, Left/Right adjusts the value and Down continues to Queue squad. The live label below shows the exact native object Roblox owns."
							color={themeRefs.text.secondary}
							wrap
							width="100%"
						/>
					</Stack>

					<Box
						width="100%"
						bg={themeRefs.background.default}
						radius="md"
						p="md"
						selectionGroup
						selectionBehaviorUp={Enum.SelectionBehavior.Stop}
						selectionBehaviorDown={Enum.SelectionBehavior.Stop}
						selectionBehaviorLeft={Enum.SelectionBehavior.Stop}
						selectionBehaviorRight={Enum.SelectionBehavior.Stop}
					>
						<Stack width="100%" gap="sm">
							<Stack width="100%" direction="horizontal" gap="sm" align="center">
								<Input
									ref={bindSearchInstance}
									width={columnWidth}
									value={query}
									onChange={setQuery}
									placeholder="Search maps or modes"
									selectable
									selectionOrder={10}
									nextSelectionRight={resetInstance}
									nextSelectionDown={privacyInstance}
								/>
								<Button
									ref={bindResetInstance}
									width={columnWidth}
									label="Reset setup"
									variant="outline"
									selectable
									selectionOrder={20}
									nextSelectionLeft={searchInstance}
									nextSelectionDown={queueInstance}
									onPress={() => {
										setQuery("");
										setVolume(55);
										setStatus("Setup reset");
									}}
								/>
							</Stack>

							<Stack width="100%" direction="horizontal" gap="sm" align="center">
								<Button
									ref={bindPrivacyInstance}
									width={columnWidth}
									label={privacyLabel}
									variant="light"
									selectable
									selectionOrder={30}
									nextSelectionUp={searchInstance}
									nextSelectionRight={queueInstance}
									nextSelectionDown={volumeInstance}
									onPress={() => {
										setFriendsOnly((current) => !current);
										setStatus("Squad privacy updated");
									}}
								/>
								<Button
									width={columnWidth}
									label="Ranked locked"
									variant="subtle"
									color="secondary"
									disabled
									selectable
									selectionOrder={40}
								/>
							</Stack>

							<Stack width="100%" direction="horizontal" gap="sm" align="center">
								<Slider
									ref={bindVolumeInstance}
									width={columnWidth}
									value={volume}
									onChange={setVolume}
									min={0}
									max={100}
									step={5}
									tooltip
									selectable
									selectionOrder={50}
									nextSelectionUp={privacyInstance}
									nextSelectionDown={queueInstance}
									slotProps={{
										label: { Text: "Squad volume" },
										valueLabel: { Text: `${volume}%` },
									}}
								/>
								<Button
									ref={bindQueueInstance}
									width={columnWidth}
									label="Queue squad"
									color="success"
									selectable
									selectionOrder={60}
									nextSelectionUp={resetInstance}
									nextSelectionLeft={volumeInstance}
									onPress={() => setStatus("Squad queued")}
								/>
							</Stack>
						</Stack>
					</Box>

					<Stack width="100%" gap="xs">
						<Text text={status} size="sm" weight={600} color={themeRefs.text.primary} />
						<Text text={selectedObjectLabel} size="sm" weight={600} color={themeRefs.primary.main} wrap width="100%" />
						<Text
							text="The right-hand route intentionally skips Ranked locked: disabled controls remain non-selectable even when selectable is requested."
							size="sm"
							color={themeRefs.text.secondary}
							wrap
							width="100%"
						/>
					</Stack>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Controller Selection",
		summary:
			"Roblox-native two-dimensional selection wiring across Input, Button, and Slider, with explicit neighbors, a stopped selection group, and disabled-safe routing.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<ControllerSelectionStoryCanvas />
			</StoryThemeProvider>
		);
	},
);

export = story;
