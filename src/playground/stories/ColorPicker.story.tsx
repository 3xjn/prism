import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { Box, ColorPicker, Stack, Text, type ColorPickerSize } from "@prism";
import { theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";

import { formatHexColor, formatRgbColor } from "../../lib/components/ColorPicker/utils";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	size: EnumList({ xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }, "md"),
	disabled: Boolean(false),
	fullWidth: Boolean(false),
};

type ColorPickerStoryControls = InferControls<typeof controls>;

function resolveInputLabel(input: InputObject): string {
	if (input.UserInputType === Enum.UserInputType.Touch) {
		return "Touch drag";
	}
	if (input.UserInputType === Enum.UserInputType.MouseButton1) {
		return "Mouse drag";
	}
	if (input.KeyCode !== Enum.KeyCode.Unknown) {
		return input.KeyCode.Name;
	}

	return input.UserInputType.Name;
}

function ColorPickerStoryCanvas({
	controls: currentControls,
}: {
	readonly controls: ColorPickerStoryControls;
}): React.ReactElement {
	const [color, setColor] = React.useState(Color3.fromRGB(59, 130, 246));
	const [changeCount, setChangeCount] = React.useState(0);
	const [commitCount, setCommitCount] = React.useState(0);
	const [lastInput, setLastInput] = React.useState("No pointer input yet");
	const [uncontrolledStatus, setUncontrolledStatus] = React.useState("#D97706 initial value");
	const size = currentControls.size as ColorPickerSize;
	const updateColor = (updatedColor: Color3) => {
		setColor(updatedColor);
		setChangeCount((current) => current + 1);
	};

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="lg" p="xl">
				<Stack width="100%" gap="lg">
					<Stack width="100%" gap="xs">
						<Text text="ColorPicker" size="xl" weight={800} color={themeRefs.text.primary} />
						<Text
							text="Drag with mouse or touch, or use native controller focus. Left/Right changes field saturation or hue, L1/R1 changes field value, and Up/Down remains native navigation. HEX and RGB fields commit precise keyboard input."
							color={themeRefs.text.secondary}
							wrap
							width="100%"
						/>
					</Stack>

					<Stack width="100%" direction="horizontal" align="start" gap="xl" wrap>
						<Stack gap="sm" width={currentControls.fullWidth ? "100%" : undefined}>
							<Text text="Live controlled value" size="sm" weight={800} color={themeRefs.text.primary} />
							<ColorPicker
								value={color}
								onChange={updateColor}
								onChangeEnd={() => setCommitCount((current) => current + 1)}
								size={size}
								disabled={currentControls.disabled}
								fullWidth={currentControls.fullWidth}
								selectionOrder={1}
								Event={{ InputBegan: (_button, input) => setLastInput(resolveInputLabel(input)) }}
							/>
							<Box width="100%" bg={themeRefs.background.default} radius="md" p="md">
								<Stack width="100%" gap="xs">
									<Text text={formatHexColor(color)} weight={800} color={themeRefs.text.primary} />
									<Text text={formatRgbColor(color)} size="sm" color={themeRefs.text.secondary} />
									<Text
										text={`${lastInput} - ${changeCount} live changes / ${commitCount} commits`}
										size="xs"
										color={themeRefs.text.secondary}
									/>
								</Stack>
							</Box>
						</Stack>

						<Stack gap="sm">
							<Text text="Active uncontrolled value" size="sm" weight={800} color={themeRefs.text.primary} />
							<ColorPicker
								defaultValue={Color3.fromRGB(217, 119, 6)}
								size="sm"
								selectionOrder={10}
								onChange={(nextColor) => setUncontrolledStatus(`${formatHexColor(nextColor)} internal update`)}
							/>
							<Text text={uncontrolledStatus} size="xs" color={themeRefs.text.secondary} />
						</Stack>

						<Stack gap="sm">
							<Text text="Disabled reference" size="sm" weight={800} color={themeRefs.text.primary} />
							<ColorPicker defaultValue={Color3.fromRGB(210, 153, 34)} size="sm" disabled />
							<Text
								text="Selection, drag capture, and precision fields are all inactive."
								size="xs"
								color={themeRefs.text.secondary}
								wrap
								width={240}
							/>
						</Stack>
					</Stack>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "ColorPicker",
		summary:
			"Inline HSV color editing with mouse/touch drag surfaces, precise HEX/RGB entry, controlled state, change-end commits, native selection, and theme-aware disabled/focus visuals.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => (
		<StoryThemeProvider mode={props.controls.theme}>
			<ColorPickerStoryCanvas controls={props.controls} />
		</StoryThemeProvider>
	),
);

export = story;
