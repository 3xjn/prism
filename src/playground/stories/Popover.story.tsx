import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Boolean, CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { Box, Icon, Popover, Stack, Text } from "@prism";
import type { PopoverAlign, PopoverPlacement, PopoverTriggerMode } from "@prism";
import { useTheme } from "@prism/theme";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	placement: EnumList({ bottom: "bottom", top: "top", left: "left", right: "right" }, "bottom"),
	align: EnumList({ start: "start", center: "center", end: "end" }, "center"),
	triggerMode: EnumList({ click: "click", hover: "hover", manual: "manual" }, "click"),
	content: String("Squad aura, loot bias, and extract timer."),
	disabled: Boolean(false),
};

type PopoverStoryControls = InferControls<typeof controls>;

function PopoverPanelContent({ detail }: { readonly detail: string }): React.ReactElement {
	return (
		<Stack width={260} gap="sm">
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Box width={34} height={34} bg="primary.light" radius="sm">
					<Stack width="100%" height="100%" align="center" justify="center">
						<Icon name="server" size={18} color="primary.main" />
					</Stack>
				</Box>
				<Stack width="100%" gap="xs">
					<Text text="Relay Intel" weight={700} color="text.primary" />
					<Text text="Context panel" size="sm" color="text.secondary" />
				</Stack>
			</Stack>
			<Text text={detail} size="sm" color="text.primary" wrap width="100%" />
			<Box width="100%" height={1} bg="border.subtle" />
			<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
				<Text text="Ready for Menu seam" size="sm" color="success.main" weight={700} />
				<Text text="Portal anchored" size="sm" color="text.secondary" />
			</Stack>
		</Stack>
	);
}

function PopoverTrigger(): React.ReactElement {
	return (
		<Box width={232} bg="background.surface" radius="md" border={1} borderColor="border.default" p="md">
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Icon name="settings" size={22} color="primary.main" />
				<Stack width="100%" gap="xs">
					<Text text="Open relay panel" weight={700} color="text.primary" />
					<Text text="Click or hover from controls" size="sm" color="text.secondary" />
				</Stack>
			</Stack>
		</Box>
	);
}

function PopoverStoryCanvas({ controls: currentControls }: { readonly controls: PopoverStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedPlacement = currentControls.placement as PopoverPlacement;
	const resolvedAlign = currentControls.align as PopoverAlign;
	const resolvedTriggerMode = currentControls.triggerMode as PopoverTriggerMode;

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Popover" size="lg" weight={700} color="text.primary" />
					<Text
						text="Inspect the trigger-anchored seam for future Menu and possible Select/Tooltip shell reuse. The panel portals to the active LayerCollector and dismisses through an invisible outside capture layer."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" height={320} bg={theme.colors.action.hover} radius="md" p="xl">
						<Stack width="100%" height="100%" align="center" justify="center">
							<Popover
								content={<PopoverPanelContent detail={currentControls.content} />}
								placement={resolvedPlacement}
								align={resolvedAlign}
								triggerMode={resolvedTriggerMode}
								disabled={currentControls.disabled || resolvedTriggerMode === "manual"}
								gap={12}
								slotProps={{ panel: { BackgroundTransparency: 0.02 }, panelStroke: { Transparency: 0.08 } }}
							>
								<PopoverTrigger />
							</Popover>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Popover",
		summary: "Trigger-anchored portal panel seam for game UI context surfaces, with placement controls, outside-dismiss capture, neutral defaults, and slot escapes.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<PopoverStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
