import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Input, Stack, Text } from "@prism";
import type { InputColor, InputSize } from "@prism";
import type { Variant } from "@prism/theme";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	value: String(""),
	placeholder: String("Search commands, settings, or players"),
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
	disabled: Boolean(false),
	readOnly: Boolean(false),
	fullWidth: Boolean(false),
};

type InputStoryControls = InferControls<typeof controls>;

function InputStoryCanvas({ controls: currentControls }: { readonly controls: InputStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [previewValue, setPreviewValue] = React.useState(currentControls.value);
	const resolvedVariant = currentControls.variant as Variant;
	const resolvedColor = currentControls.color as InputColor;
	const resolvedSize = currentControls.size as InputSize;
	const previewValueLabel = previewValue.size() > 0 ? `Current value: ${previewValue}` : "Current value: (empty)";

	React.useEffect(() => {
		setPreviewValue(currentControls.value);
	}, [currentControls.value]);

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Input" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Use the controls below to inspect one live Input. The preview stays locally controlled so typing here updates the same value surfaced by ui-labs."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Input
								value={previewValue}
								onChange={setPreviewValue}
								placeholder={currentControls.placeholder}
								variant={resolvedVariant}
								color={resolvedColor}
								size={resolvedSize}
								disabled={currentControls.disabled}
								readOnly={currentControls.readOnly}
								fullWidth={currentControls.fullWidth}
							/>
							<Text
								text={previewValueLabel}
								size="sm"
								color={themeRefs.text.secondary}
								wrap
								width="100%"
							/>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Input",
		summary: "Low-level text entry with semantic tones, stable sizing, and restrained focus feedback.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<InputStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
