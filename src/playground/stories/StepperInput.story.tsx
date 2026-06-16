import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Stack, StepperInput, Text } from "@prism";
import type { StepperInputSize } from "@prism";
import type { Variant } from "@prism/theme";
import { useTheme } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

function resolveStoryRange(min: number, max: number) {
	return max <= min ? { min, max: min } : { min, max };
}

function resolveStoryStep(step: number): number {
	return step > 0 ? step : 1;
}

function resolveStoryPrecision(step: number): number {
	let precision = 0;
	let scaledStep = step;

	while (precision < 6 && math.abs(scaledStep - math.round(scaledStep)) > 1e-6) {
		precision += 1;
		scaledStep *= 10;
	}

	return precision;
}

function normalizeStoryValue(value: number, min: number, max: number, step: number): number {
	const range = resolveStoryRange(min, max);
	const clampedValue = math.clamp(value, range.min, range.max);
	const scale = math.pow(10, resolveStoryPrecision(step));
	const snappedValue = range.min + math.round((clampedValue - range.min) / step) * step;
	return math.clamp(math.round(snappedValue * scale) / scale, range.min, range.max);
}

const controls = {
	theme: storyThemeControl,
	value: Number(4, -10, 20, 1),
	min: Number(1, -20, 20, 1),
	max: Number(8, -20, 30, 1),
	step: Number(1, 0, 5, 0.25),
	variant: EnumList(
		{
			outline: "outline",
			light: "light",
			subtle: "subtle",
			filled: "filled",
		},
		"outline",
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

type StepperInputStoryControls = InferControls<typeof controls>;

function StepperInputStoryCanvas({ controls: currentControls }: { readonly controls: StepperInputStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedStep = resolveStoryStep(currentControls.step);
	const resolvedVariant = currentControls.variant as Variant;
	const resolvedSize = currentControls.size as StepperInputSize;
	const [squadCap, setSquadCap] = React.useState(normalizeStoryValue(currentControls.value, currentControls.min, currentControls.max, resolvedStep));
	const [respawns, setRespawns] = React.useState(3);
	const normalizedValue = normalizeStoryValue(squadCap, currentControls.min, currentControls.max, resolvedStep);
	const width = currentControls.fullWidth ? "100%" : undefined;

	React.useEffect(() => {
		setSquadCap(normalizeStoryValue(currentControls.value, currentControls.min, currentControls.max, resolvedStep));
	}, [currentControls.max, currentControls.min, currentControls.value, resolvedStep]);

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="StepperInput" size="lg" weight={700} color="text.primary" />
					<Text
						text="A compact tactical value rail for game settings. Drag the center control to scrub across the range, or use the side arrows for exact stepped changes."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="md">
							<Stack width="100%" gap="xs">
								<Text text="Squad capacity" size="sm" weight={700} color="text.primary" />
								<StepperInput
									value={normalizedValue}
									onChange={setSquadCap}
									min={currentControls.min}
									max={currentControls.max}
									step={resolvedStep}
									variant={resolvedVariant}
									size={resolvedSize}
									disabled={currentControls.disabled}
									readOnly={currentControls.readOnly}
									fullWidth={currentControls.fullWidth}
									width={width}
								/>
							</Stack>
							<Stack width="100%" gap="xs">
								<Text text="Respawn charges" size="sm" weight={700} color="text.primary" />
								<StepperInput
									value={respawns}
									onChange={setRespawns}
									min={0}
									max={6}
									step={1}
									formatValue={(currentValue) => `${tostring(currentValue)} charges`}
									variant="subtle"
									size={resolvedSize}
									fullWidth
									width="100%"
								/>
							</Stack>
							<Text text={`Squad cap: ${tostring(normalizedValue)} | Respawns: ${tostring(respawns)}`} size="sm" color="text.secondary" wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "StepperInput",
		summary: "Compact game-setting number rail with horizontal drag input, arrow stepping, safe value normalization, semantic variants, and raw slot escape hatches.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<StepperInputStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
