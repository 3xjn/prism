import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, SegmentedControl, Stack, Text } from "@prism";
import type { SegmentedControlColor, SegmentedControlOption, SegmentedControlSize } from "@prism";
import type { Variant } from "@prism/theme";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const modeOptions: readonly SegmentedControlOption[] = [
	{ value: "solo", label: "Solo" },
	{ value: "duo", label: "Duo" },
	{ value: "squad", label: "Squad" },
];

const pacingOptions: readonly SegmentedControlOption[] = [
	{ value: "quick", label: "Quick" },
	{ value: "standard", label: "Standard" },
	{ value: "ranked", label: "Ranked", disabled: true },
];

const controls = {
	theme: storyThemeControl,
	variant: EnumList(
		{
			outline: "outline",
			light: "light",
			subtle: "subtle",
			filled: "filled",
		},
		"outline",
	),
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
		"md",
	),
	disabled: Boolean(false),
	fullWidth: Boolean(false),
};

type SegmentedControlStoryControls = InferControls<typeof controls>;

function SegmentedControlStoryCanvas({ controls: currentControls }: { readonly controls: SegmentedControlStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [mode, setMode] = React.useState("duo");
	const [pacing, setPacing] = React.useState("standard");
	const resolvedVariant = currentControls.variant as Variant;
	const resolvedColor = currentControls.color as SegmentedControlColor;
	const resolvedSize = currentControls.size as SegmentedControlSize;
	const width = currentControls.fullWidth ? "100%" : undefined;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="SegmentedControl" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="A direct option picker for game settings and queue choices. It keeps every choice visible, with a compact rail and selected segment that reads as a control instead of website tabs."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="md">
							<Stack width="100%" gap="xs">
								<Text text="Party size" size="sm" weight={700} color={themeRefs.text.primary} />
								<SegmentedControl
									options={modeOptions}
									value={mode}
									onChange={setMode}
									variant={resolvedVariant}
									color={resolvedColor}
									size={resolvedSize}
									disabled={currentControls.disabled}
									fullWidth={currentControls.fullWidth}
									width={width}
								/>
							</Stack>
							<Stack width="100%" gap="xs">
								<Text text="Match pace" size="sm" weight={700} color={themeRefs.text.primary} />
								<SegmentedControl
									options={pacingOptions}
									value={pacing}
									onChange={setPacing}
									variant="outline"
									color="primary"
									size={resolvedSize}
									fullWidth
									width="100%"
								/>
							</Stack>
							<Text text={`Selected: ${mode} | ${pacing}`} size="sm" color={themeRefs.text.secondary} wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "SegmentedControl",
		summary: "Visible single-choice control for game options, queue modes, and settings choices without dropdown hiding or SaaS tab styling.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<SegmentedControlStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
