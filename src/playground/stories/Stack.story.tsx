import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Stack, Text } from "@prism";
import type { StackAlign, StackDirection, StackGapValue, StackJustify, TextProps } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
import type { ThemeSize } from "@prism/theme";
import { CreateReactStory, Datatype, EnumList, Slider } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	gap: EnumList(
		{
			none: "none",
			xs: "xs",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
			"12px": 12,
		},
		"md",
	),
	direction: EnumList(
		{
			vertical: "vertical",
			horizontal: "horizontal",
		},
		"vertical",
	),
	align: EnumList(
		{
			start: "start",
			center: "center",
			end: "end",
			stretch: "stretch",
		},
		"start",
	),
	justify: EnumList(
		{
			start: "start",
			center: "center",
			end: "end",
			fill: "fill",
			spaceAround: "spaceAround",
			spaceBetween: "spaceBetween",
			spaceEvenly: "spaceEvenly",
		},
		"start",
	),
	wrap: EnumList(
		{
			off: "off",
			on: "on",
		},
		"off",
	),
	bg: Datatype.Color3(new Color3(0.14, 0.16, 0.2)),
	childCount: Slider(5, 1, 10, 1),
};

type StackStoryControls = InferControls<typeof controls>;
type OptionalGapValue = ThemeSize | number | "none";

function Swatch({
	color,
	width = 80,
	height = 40,
	label,
	layoutOrder,
}: {
	readonly color: Color3;
	readonly width?: number;
	readonly height?: number;
	readonly label: string;
	readonly layoutOrder?: number;
}): React.ReactElement {
	return (
		<Box layoutOrder={layoutOrder} width={width} height={height} bg={color} p="xs">
			<Text
				size="xs"
				color={themeRefs.text.inverse}
				align="center"
				valign="middle"
				weight={500}
				slotProps={{ root: { Size: UDim2.fromScale(1, 1), BackgroundTransparency: 1, BorderSizePixel: 0 } }}
				text={label}
			/>
		</Box>
	);
}

function InteractivePreview({ controls: currentControls }: { readonly controls: StackStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedGap = currentControls.gap as OptionalGapValue;
	const resolvedDirection = currentControls.direction as StackDirection;
	const resolvedAlign = currentControls.align as StackAlign;
	const resolvedJustify = currentControls.justify as StackJustify;
	const resolvedWrap = (currentControls.wrap as string) === "on";
	const gapProp = resolvedGap === "none" ? undefined : (resolvedGap as StackGapValue);
	const swatchColors = [
		theme.colors.primary.main,
		theme.colors.info.main,
		theme.colors.success.main,
		theme.colors.warning.main,
		theme.colors.error.main,
	];
	const swatchWidths = [80, 120, 60, 100, 80];
	const swatchHeights = [40, 48, 60, 36, 40];
	const children = new Array<React.ReactElement>();

	for (let index = 0; index < currentControls.childCount; index++) {
		const patternIndex = index % swatchColors.size();

		children.push(
			<Swatch
				key={tostring(index)}
				layoutOrder={index + 1}
				color={swatchColors[patternIndex]}
				label={tostring(index + 1)}
				width={swatchWidths[patternIndex]}
				height={swatchHeights[patternIndex]}
			/>,
		);
	}

	return (
		<Stack
			gap={gapProp}
			direction={resolvedDirection}
			align={resolvedAlign}
			justify={resolvedJustify}
			wrap={resolvedWrap}
			bg={currentControls.bg}
			p="md"
			width="100%"
			slotProps={{ root: { AutomaticSize: Enum.AutomaticSize.Y } }}
		>
			{children}
		</Stack>
	);
}

function StackStoryCanvas({ controls: currentControls }: { readonly controls: StackStoryControls }): React.ReactElement {
	return (
		<StoryCanvas>
			<InteractivePreview controls={currentControls} />
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Stack",
		summary: "Arranges elements in a row or column with consistent spacing.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<StackStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
