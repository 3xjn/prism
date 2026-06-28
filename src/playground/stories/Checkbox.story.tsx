import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Checkbox, Stack, Text } from "@prism";
import type { CheckboxColor, CheckboxSize } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	checked: Boolean(false),
	label: String("Confirm loadout"),
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
};

type CheckboxStoryControls = InferControls<typeof controls>;

function CheckboxStoryCanvas({ controls: currentControls }: { readonly controls: CheckboxStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [previewChecked, setPreviewChecked] = React.useState(currentControls.checked);
	const resolvedColor = currentControls.color as CheckboxColor;
	const resolvedSize = currentControls.size as CheckboxSize;
	const resolvedLabel = currentControls.label.size() > 0 ? currentControls.label : undefined;
	const checkedText = previewChecked ? "Current checked state: true" : "Current checked state: false";

	React.useEffect(() => {
		setPreviewChecked(currentControls.checked);
	}, [currentControls.checked]);

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Checkbox" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Inspect a compact Prism mark control. It uses a rounded token and animated fill instead of a web-style square, while raw slots can still replace the mark, glyph, label, and layout."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Checkbox
								checked={previewChecked}
								onChange={setPreviewChecked}
								label={resolvedLabel}
								color={resolvedColor}
								size={resolvedSize}
								disabled={currentControls.disabled}
								width="100%"
							/>
							<Text text={checkedText} size="sm" color={themeRefs.text.secondary} wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Checkbox",
		summary: "Boolean mark control with a Prism-native rounded token, semantic intent fill, label-row activation, disabled styling, and slot-level escape hatches.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<CheckboxStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
