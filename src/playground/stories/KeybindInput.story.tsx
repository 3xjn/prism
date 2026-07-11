import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Boolean, CreateReactStory, EnumList } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { Box, KeybindInput, Stack, Text } from "@prism";
import type { KeybindCaptureDevice, KeybindInputColor, KeybindInputSize } from "@prism";
import type { Variant } from "@prism/theme";
import { useTheme, theme as themeRefs } from "@prism/theme";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	variant: EnumList({ outline: "outline", subtle: "subtle", light: "light", filled: "filled" }, "outline"),
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
	size: EnumList({ xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }, "md"),
	captureDevice: EnumList({ both: "both", keyboard: "keyboard", gamepad: "gamepad" }, "both"),
	disabled: Boolean(false),
	readOnly: Boolean(false),
	clearable: Boolean(true),
	fullWidth: Boolean(false),
};

type KeybindInputStoryControls = InferControls<typeof controls>;

function formatKeyCode(value: Enum.KeyCode): string {
	return value === Enum.KeyCode.Unknown ? "Unbound" : value.Name;
}

function KeybindInputStoryCanvas({
	controls: currentControls,
}: {
	readonly controls: KeybindInputStoryControls;
}): React.ReactElement {
	const theme = useTheme();
	const [interactKey, setInteractKey] = React.useState<Enum.KeyCode>(Enum.KeyCode.E);
	const [ultimateKey, setUltimateKey] = React.useState<Enum.KeyCode>(Enum.KeyCode.ButtonR1);
	const [capturing, setCapturing] = React.useState(false);
	const resolvedVariant = currentControls.variant as Variant;
	const resolvedColor = currentControls.color as KeybindInputColor;
	const resolvedSize = currentControls.size as KeybindInputSize;
	const resolvedCaptureDevice = currentControls.captureDevice as KeybindCaptureDevice;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="KeybindInput" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Click or controller-select a control and press ButtonA to begin capture. The next allowed keyboard or gamepad input, including ButtonA, becomes the bind; Escape/ButtonSelect cancels, and Backspace/Delete clears when allowed."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="md">
							<Stack width="100%" gap="xs">
								<Text text="Interact" size="sm" weight={700} color={themeRefs.text.primary} />
								<KeybindInput
									value={interactKey}
									onChange={setInteractKey}
									variant={resolvedVariant}
									color={resolvedColor}
									size={resolvedSize}
									captureDevice={resolvedCaptureDevice}
									disabled={currentControls.disabled}
									readOnly={currentControls.readOnly}
									clearable={currentControls.clearable}
									fullWidth={currentControls.fullWidth}
									width={currentControls.fullWidth ? "100%" : undefined}
									onCapturingChange={setCapturing}
								/>
							</Stack>
							<Stack width="100%" gap="xs">
								<Text text="Ultimate" size="sm" weight={700} color={themeRefs.text.primary} />
								<KeybindInput
									value={ultimateKey}
									onChange={setUltimateKey}
									variant="subtle"
									color="secondary"
									size={resolvedSize}
									captureDevice="both"
									clearable
									fullWidth
									width="100%"
								/>
							</Stack>
							<Text
								text={`Interact: ${formatKeyCode(interactKey)} | Ultimate: ${formatKeyCode(ultimateKey)} | Capturing: ${capturing ? "yes" : "no"}`}
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
		name: "KeybindInput",
		summary:
			"Game keybind capture control for keyboard and gamepad mappings, with clear/cancel behavior, semantic variants, and typed slot escapes.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<KeybindInputStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
