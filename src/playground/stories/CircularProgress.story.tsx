import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, CircularProgress, Stack, Text } from "@prism";
import type { CircularProgressCap, CircularProgressColor, CircularProgressMode, CircularProgressSize, CircularProgressVariant } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
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
	mode: EnumList(
		{
			indeterminate: "indeterminate",
			determinate: "determinate",
		},
		"indeterminate",
	),
	value: Number(64, -50, 150, 1),
	min: Number(0, -100, 100, 1),
	max: Number(100, -100, 200, 1),
	label: String(""),
	showValue: Boolean(false),
	disableAnimation: Boolean(false),
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
		"lg",
	),
	cap: EnumList(
		{
			round: "round",
			butt: "butt",
		},
		"round",
	),
};

type CircularProgressStoryControls = InferControls<typeof controls>;

function CircularProgressStoryCanvas({ controls: currentControls }: { readonly controls: CircularProgressStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedMode = currentControls.mode as CircularProgressMode;
	const resolvedVariant = currentControls.variant as CircularProgressVariant;
	const resolvedColor = currentControls.color as CircularProgressColor;
	const resolvedSize = currentControls.size as CircularProgressSize;
	const resolvedCap = currentControls.cap as CircularProgressCap;
	const normalizedValue = normalizeStoryValue(currentControls.value, currentControls.min, currentControls.max);
	const resolvedLabel = currentControls.label.size() > 0 ? currentControls.label : undefined;
	const range = resolveStoryRange(currentControls.min, currentControls.max);
	const rangeText = `Range: ${range.min} to ${range.max}`;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="CircularProgress" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Inspect a segmented Roblox-native ring. Indeterminate mode rotates while the visible arc grows and catches up, echoing MUI's spinner without SVG stroke paths."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<CircularProgress
								mode={resolvedMode}
								value={normalizedValue}
								min={currentControls.min}
								max={currentControls.max}
								label={resolvedLabel}
								showValue={currentControls.showValue}
								disableAnimation={currentControls.disableAnimation}
								variant={resolvedVariant}
								color={resolvedColor}
								size={resolvedSize}
								cap={resolvedCap}
							/>
							<Text text={`Current value: ${normalizedValue}`} size="sm" color={themeRefs.text.primary} wrap width="100%" />
							<Text text={rangeText} size="sm" color={themeRefs.text.secondary} wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "CircularProgress",
		summary: "Segmented circular meter with determinate value display and MUI-inspired indeterminate chase animation, built from Roblox UI primitives with slot-level escape hatches.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<CircularProgressStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
