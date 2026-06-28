import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Slider, Stack, Text } from "@prism";
import type { SliderColor, SliderSize } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

function resolveStoryRange(min: number, max: number) {
	return max <= min ? { min, max: min, span: 0 } : { min, max, span: max - min };
}

function resolveStoryStep(step: number): number | undefined {
	return step > 0 ? step : undefined;
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

function normalizeStoryValue(value: number, min: number, max: number, step: number | undefined): number {
	const range = resolveStoryRange(min, max);
	const clampedValue = math.clamp(value, range.min, range.max);

	if (range.span <= 0 || step === undefined) {
		return clampedValue;
	}

	const scale = math.pow(10, resolveStoryPrecision(step));
	const snappedValue = range.min + math.round((clampedValue - range.min) / step) * step;
	return math.clamp(math.round(snappedValue * scale) / scale, range.min, range.max);
}

const controls = {
	theme: storyThemeControl,
	value: Number(42, -50, 150, 1),
	min: Number(0, -100, 100, 1),
	max: Number(100, -100, 200, 1),
	step: Number(1, 0, 25, 0.5),
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
	tooltip: Boolean(true),
};

type SliderStoryControls = InferControls<typeof controls>;

function SliderStoryCanvas({ controls: currentControls }: { readonly controls: SliderStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedStep = resolveStoryStep(currentControls.step);
	const resolvedColor = currentControls.color as SliderColor;
	const resolvedSize = currentControls.size as SliderSize;
	const [previewValue, setPreviewValue] = React.useState(
		normalizeStoryValue(currentControls.value, currentControls.min, currentControls.max, resolvedStep),
	);
	const normalizedValue = normalizeStoryValue(previewValue, currentControls.min, currentControls.max, resolvedStep);
	const rangeText =
		resolvedStep === undefined
			? `Range: ${currentControls.min} to ${currentControls.max} | Continuous`
			: `Range: ${currentControls.min} to ${currentControls.max} | Step ${resolvedStep}`;
	const valueText = `Current value: ${tostring(normalizedValue)}`;

	React.useEffect(() => {
		setPreviewValue(normalizeStoryValue(currentControls.value, currentControls.min, currentControls.max, resolvedStep));
	}, [currentControls.max, currentControls.min, currentControls.value, resolvedStep]);

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Slider" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Inspect one numeric control built for direct click-and-drag input. The full-width hit target still lets you grab anywhere on the rail, and the optional hover tooltip now surfaces the current value without changing the capture path."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Slider
								value={normalizedValue}
								onChange={setPreviewValue}
								min={currentControls.min}
								max={currentControls.max}
								step={resolvedStep}
								disabled={currentControls.disabled}
								fullWidth={currentControls.fullWidth}
								tooltip={currentControls.tooltip}
								color={resolvedColor}
								size={resolvedSize}
							/>
							<Text text={valueText} size="sm" color={themeRefs.text.primary} wrap width="100%" />
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
		name: "Slider",
		summary:
			"Single-value numeric rail with semantic thumb and range styling, full-width click-and-drag input, optional hover tooltip value feedback, controlled or uncontrolled state, and safe clamping when ranges or steps change.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<SliderStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
