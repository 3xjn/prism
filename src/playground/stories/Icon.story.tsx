import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Icon, Stack, Text } from "@prism";
import type { IconName, IconProps } from "@prism";
import { useTheme } from "@prism/theme";
import { CreateReactStory, Datatype, EnumList } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	name: EnumList(
		{
			"alert-circle": "alert-circle",
			check: "check",
			"chevron-right": "chevron-right",
			info: "info",
			search: "search",
			server: "server",
			settings: "settings",
			x: "x",
		},
		"search",
	),
	size: EnumList(
		{
			xs: "xs",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
			"16px": 16,
			"24px": 24,
			"32px": 32,
		},
		"md",
	),
	color: Datatype.Color3(new Color3(0.2, 0.2, 0.2)),
};

type IconStoryControls = InferControls<typeof controls>;
type IconSizeValue = NonNullable<IconProps["size"]>;
type IconColorValue = NonNullable<IconProps["color"]>;

function IconStoryCanvas({ controls: currentControls }: { readonly controls: IconStoryControls }): React.ReactElement {
	const theme = useTheme();
	const name = currentControls.name as IconName;
	const size = currentControls.size as IconSizeValue;
	const color = currentControls.color as IconColorValue;
	const previewHeight = theme.spacing.xl * 6;

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Icon" size="lg" weight={700} color="text.primary" />
					<Box width="100%" bg="background.default" radius="md" p="xl" height={previewHeight}>
						<Stack width="100%" height="100%" align="center" justify="center">
							<Icon name={name} size={size} color={color} />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Icon",
		summary: "Typed Lucide-backed icon primitive that resolves atlas metadata into a themed Roblox ImageLabel.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<IconStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
