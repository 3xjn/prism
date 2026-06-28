import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Stack, Switch, Text } from "@prism";
import type { SwitchColor, SwitchProps, SwitchSize } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	checked: Boolean(false),
	label: String("Enable notifications"),
	showIcons: Boolean(true),
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

type SwitchStoryControls = InferControls<typeof controls>;

function SwitchStoryCanvas({ controls: currentControls }: { readonly controls: SwitchStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [previewChecked, setPreviewChecked] = React.useState(currentControls.checked);
	const resolvedColor = currentControls.color as SwitchColor;
	const resolvedSize = currentControls.size as SwitchSize;
	const resolvedLabel = currentControls.label.size() > 0 ? currentControls.label : undefined;
	const checkedText = previewChecked ? "Current checked state: true" : "Current checked state: false";
	const switchIcons: SwitchProps["icons"] = currentControls.showIcons
		? {
				unchecked: "x",
				checked: "check",
		  }
		: undefined;

	React.useEffect(() => {
		setPreviewChecked(currentControls.checked);
	}, [currentControls.checked]);

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Switch" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Inspect one calm boolean control sized for preference rows. When icons are enabled, the preview shows distinct unchecked and checked symbols, and activation still controls the same local preview echoed underneath."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Switch
								checked={previewChecked}
								onChange={setPreviewChecked}
								label={resolvedLabel}
								icons={switchIcons}
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
		name: "Switch",
		summary: "Boolean control with native toggle activation, optional settings-row label, disabled styling, restrained internal motion, and optional checked-state icons.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<SwitchStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
