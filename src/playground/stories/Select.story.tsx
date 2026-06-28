import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Select, Stack, Text } from "@prism";
import type { SelectColor, SelectOption, SelectSize } from "@prism";
import type { Variant } from "@prism/theme";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, Number, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const previewOptions: readonly SelectOption[] = [
	{ value: "aurora", label: "Aurora Watch" },
	{ value: "harbor", label: "Harbor Shift" },
	{ value: "legacy", label: "Legacy Queue", disabled: true },
	{ value: "summit", label: "Summit Relay" },
	{ value: "delta", label: "Delta Routing" },
	{ value: "comet", label: "Comet Dispatch" },
	{ value: "atlas", label: "Atlas Link" },
	{ value: "echo", label: "Echo Terminal" },
];

const controls = {
	theme: storyThemeControl,
	placeholder: String("Choose a queue"),
	variant: EnumList(
		{
			outline: "outline",
			subtle: "subtle",
			light: "light",
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
	maxVisibleOptions: Number(6, 1, 8, 1),
	disabled: Boolean(false),
	fullWidth: Boolean(false),
};

type SelectStoryControls = InferControls<typeof controls>;

function SelectStoryCanvas({ controls: currentControls }: { readonly controls: SelectStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [previewValue, setPreviewValue] = React.useState("");
	const resolvedVariant = currentControls.variant as Variant;
	const resolvedColor = currentControls.color as SelectColor;
	const resolvedSize = currentControls.size as SelectSize;
	const currentOption = previewOptions.find((option) => option.value === previewValue);
	const currentValueLabel = currentOption === undefined ? "Current value: (none)" : `Current value: ${currentOption.label}`;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Select" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Inspect one live dropdown-style choice control. Choose from the dropdown to update the live local selection; use the other controls to adjust its styling and behavior."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Select
							selected={previewValue}
							onChange={setPreviewValue}
							options={previewOptions}
							placeholder={currentControls.placeholder}
							variant={resolvedVariant}
							color={resolvedColor}
							size={resolvedSize}
							maxVisibleOptions={currentControls.maxVisibleOptions}
							disabled={currentControls.disabled}
							fullWidth={currentControls.fullWidth}
						/>
							<Text text={currentValueLabel} size="sm" color={themeRefs.text.secondary} wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Select",
		summary: "Single-value dropdown trigger with semantic tones, a portal-backed overlay list, disabled-safe options, and capped scrolling for longer choice sets.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<SelectStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
