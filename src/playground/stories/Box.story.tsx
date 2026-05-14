import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box } from "@prism";
import { useTheme } from "@prism/theme";
import type { ThemeSize } from "@prism/theme";
import { CreateReactStory, Datatype, EnumList, Number, Slider } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const sizeOptions = {
	none: "none",
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
};

const sizeOptionsWithPixels = { ...sizeOptions, "20px": 20 };

const controls = {
	theme: storyThemeControl,
	widthMode: EnumList(
		{
			offset: "offset",
			scale: "scale",
		},
		"offset",
	),
	widthOffset: Slider(280, 0, 420, 10),
	widthScale: Slider(50, 0, 100, 5),
	height: Number(0, 0, 320, 10),
	radius: EnumList(
		sizeOptionsWithPixels,
		"md",
	),
	bg: Datatype.Color3(new Color3(0.24, 0.38, 0.94)),
	p: EnumList(
		sizeOptionsWithPixels,
		"md",
	),
	px: EnumList(
		sizeOptionsWithPixels,
		"none",
	),
	py: EnumList(
		sizeOptionsWithPixels,
		"none",
	),
	strokeColor: Datatype.Color3(new Color3(0.42, 0.45, 0.5)),
	strokeThickness: Number(2, 0, 8, 1),
	aspectRatio: Number(1.6, 0, 3, 0.1),
};

type BoxStoryControls = InferControls<typeof controls>;

function resolveOptionalValue(value: string | number): ThemeSize | number | undefined {
	return value === "none" ? undefined : (value as ThemeSize | number);
}

function resolveOptionalNumber(value: number): number | undefined {
	return value > 0 ? value : undefined;
}

function BoxStoryCanvas({ controls: currentControls }: { readonly controls: BoxStoryControls }): React.ReactElement {
	const theme = useTheme();
	const resolvedRadius = resolveOptionalValue(currentControls.radius);
	const resolvedPadding = resolveOptionalValue(currentControls.p);
	const resolvedPaddingX = resolveOptionalValue(currentControls.px);
	const resolvedPaddingY = resolveOptionalValue(currentControls.py);
	const resolvedWidth =
		currentControls.widthMode === "scale" ? `${currentControls.widthScale}%` : resolveOptionalNumber(currentControls.widthOffset);
	const resolvedHeight = resolveOptionalNumber(currentControls.height);
	const resolvedAspectRatio = resolveOptionalNumber(currentControls.aspectRatio);

	return (
		<StoryCanvas>
			<frame LayoutOrder={1} Size={new UDim2(1, 0, 0, 280)} BackgroundTransparency={1} BorderSizePixel={0} ClipsDescendants>
				<Box
					width={resolvedWidth}
					height={resolvedHeight}
					radius={resolvedRadius}
					bg={currentControls.bg}
					p={resolvedPadding}
					px={resolvedPaddingX}
					py={resolvedPaddingY}
					aspectRatio={resolvedAspectRatio}
					stroke={
						currentControls.strokeThickness > 0
							? {
									color: currentControls.strokeColor,
									thickness: currentControls.strokeThickness,
							  }
							: undefined
					}
					center
				>
					<frame
						Size={UDim2.fromOffset(96, 32)}
						BackgroundColor3={theme.colors.text.primary}
						BackgroundTransparency={0.45}
						BorderSizePixel={0}
					>
						<uicorner CornerRadius={new UDim(0, theme.radius.xs)} />
					</frame>
				</Box>
			</frame>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Box",
		summary: "Styled container with spacing, background, stroke, and sizing.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<BoxStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
