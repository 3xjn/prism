import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Divider, Stack } from "@prism";
import type { DividerOrientation } from "@prism";
import { useTheme } from "@prism/theme";
import type { ThemeSize } from "@prism/theme";
import { CreateReactStory, Datatype, EnumList } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	orientation: EnumList(
		{
			horizontal: "horizontal",
			vertical: "vertical",
		},
		"horizontal",
	),
	color: Datatype.Color3(new Color3(0.6, 0.6, 0.6)),
	size: EnumList(
		{
			"1px": 1,
			"2px": 2,
			xs: "xs",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"1px",
	),
};

type DividerStoryControls = InferControls<typeof controls>;
type OptionalSizeValue = ThemeSize | number;

function InteractivePreview({ controls: currentControls }: { readonly controls: DividerStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedOrientation = currentControls.orientation as DividerOrientation;
	const resolvedSize = currentControls.size as OptionalSizeValue;
	const isHorizontal = resolvedOrientation === "horizontal";

	return (
		<Box width="100%" bg={theme.colors.background.surface} radius="md" p="md">
			<Stack direction={isHorizontal ? "vertical" : "horizontal"} gap="sm" align="center">
				<Box width={isHorizontal ? "100%" : 40} height={isHorizontal ? 20 : 40} bg={theme.colors.action.hover} radius="sm" />
				<Divider orientation={resolvedOrientation} color={currentControls.color} size={resolvedSize} />
				<Box width={isHorizontal ? "100%" : 40} height={isHorizontal ? 20 : 40} bg={theme.colors.action.hover} radius="sm" />
			</Stack>
		</Box>
	);
}

function DividerStoryCanvas({ controls: currentControls }: { readonly controls: DividerStoryControls }): React.ReactElement {
	return (
		<StoryCanvas>
			<InteractivePreview controls={currentControls} />
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Divider",
		summary: "A thin line that separates content horizontally or vertically.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<DividerStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
