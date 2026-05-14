import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Progress, Stack, Text } from "@prism";
import type { ProgressColor, ProgressSize, ProgressVariant } from "@prism";
import { useTheme } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, Number, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

function resolveStoryRange(min: number, max: number) {
	return max <= min ? { min, max: min + 1 } : { min, max };
}

function normalizeStoryValue(value: number, min: number, max: number): number {
	const range = resolveStoryRange(min, max);
	return math.clamp(value, range.min, range.max);
}

const controls = {
	theme: storyThemeControl,
	value: Number(64, -50, 150, 1),
	min: Number(0, -100, 100, 1),
	max: Number(100, -100, 200, 1),
	label: String("Mission progress"),
	showValue: Boolean(true),
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
		"success",
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
	fullWidth: Boolean(false),
};

type ProgressStoryControls = InferControls<typeof controls>;

function ProgressStoryCanvas({ controls: currentControls }: { readonly controls: ProgressStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedVariant = currentControls.variant as ProgressVariant;
	const resolvedColor = currentControls.color as ProgressColor;
	const resolvedSize = currentControls.size as ProgressSize;
	const normalizedValue = normalizeStoryValue(currentControls.value, currentControls.min, currentControls.max);
	const resolvedLabel = currentControls.label.size() > 0 ? currentControls.label : undefined;
	const range = resolveStoryRange(currentControls.min, currentControls.max);
	const rangeText = `Range: ${range.min} to ${range.max}`;

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Progress" size="lg" weight={700} color="text.primary" />
					<Text
						text="Inspect one Roblox-native meter for XP, stamina, loading, cooldowns, and quest progress. The track, solid fill, labels, and decorators all expose raw slotProps for replacement."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Progress
								value={normalizedValue}
								min={currentControls.min}
								max={currentControls.max}
								label={resolvedLabel}
								showValue={currentControls.showValue}
								variant={resolvedVariant}
								color={resolvedColor}
								size={resolvedSize}
								fullWidth={currentControls.fullWidth}
							/>
							<Text text={`Current value: ${normalizedValue}`} size="sm" color="text.primary" wrap width="100%" />
							<Text text={rangeText} size="sm" color="text.secondary" wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Progress",
		summary: "Non-interactive Roblox-native meter with semantic fills, optional label/value row, safe clamping, and slot-level escape hatches for every backing surface.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<ProgressStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
