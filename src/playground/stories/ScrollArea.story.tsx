import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, ScrollArea, Stack, Text } from "@prism";
import type { ScrollAreaDirection } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	direction: EnumList(
		{
			vertical: "vertical",
			horizontal: "horizontal",
			both: "both",
		},
		"vertical",
	),
	scrollbarSize: Number(8, 0, 24, 1),
};

type ScrollAreaStoryControls = InferControls<typeof controls>;

function ScrollAreaStoryCanvas({ controls: currentControls }: { readonly controls: ScrollAreaStoryControls }): React.ReactElement {
	const theme = useTheme();
	const direction = currentControls.direction as ScrollAreaDirection;
	const items: React.ReactElement[] = [];

	for (let index = 1; index <= 14; index += 1) {
		items.push(
			<Box key={`item-${index}`} width={direction === "horizontal" ? 160 : "100%"} bg={themeRefs.background.surface} radius="sm" p="sm" borderColor={themeRefs.border.subtle}>
				<Text text={`Scrollable row ${index}`} color={themeRefs.text.primary} width="100%" />
			</Box>,
		);
	}

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="ScrollArea" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="A ScrollingFrame primitive for overflow content. Use Stack, Box, or custom components inside it while ScrollArea owns canvas sizing and scrollbar behavior."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<ScrollArea width="100%" height={220} direction={direction} scrollbarSize={currentControls.scrollbarSize} p="sm">
							<Stack direction={direction === "horizontal" ? "horizontal" : "vertical"} width={direction === "horizontal" ? undefined : "100%"} gap="sm">
								{items}
							</Stack>
						</ScrollArea>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "ScrollArea",
		summary: "Overflow primitive backed by ScrollingFrame with automatic canvas sizing, themed scrollbars, and slot escapes.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<ScrollAreaStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
