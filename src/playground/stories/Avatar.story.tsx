import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";
import ReactRoblox from "@rbxts/react-roblox";
import { Avatar, Box, Stack, Text } from "@prism";
import type { AvatarColor, AvatarSize } from "@prism";
import { CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	fallback: String("AV"),
	color: EnumList(
		{
			primary: "primary",
			secondary: "secondary",
			info: "info",
			success: "success",
			warning: "warning",
			error: "error",
		},
		"primary",
	),
	size: EnumList(
		{
			xs: "xs",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"lg",
	),
};

type AvatarStoryControls = InferControls<typeof controls>;

function AvatarStoryCanvas({ controls: currentControls }: { readonly controls: AvatarStoryControls }): React.ReactElement {
	const resolvedColor = currentControls.color as AvatarColor;
	const resolvedSize = currentControls.size as AvatarSize;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Avatar" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text text="A small Image-backed identity primitive with a circular fallback state for player HUDs, party lists, chat rows, and world prompts." color={themeRefs.text.secondary} wrap width="100%" />
					<Stack direction="horizontal" gap="md" align="center">
						<Avatar fallback={currentControls.fallback} color={resolvedColor} size={resolvedSize} />
						<Avatar fallback="P1" color="success" size="sm" />
						<Avatar fallback="GM" color="warning" size="md" border={2} />
						<Avatar fallback="!" color="error" size="xl" />
					</Stack>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Avatar",
		summary: "Circular player identity primitive built on ImageLabel with fallback initials and slot-level escape hatches.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<AvatarStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
