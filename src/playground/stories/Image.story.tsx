import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Image, Stack, Text } from "@prism";
import type { ImageProps } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { CreateReactStory, Datatype, EnumList, Number, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	src: String("rbxassetid://0"),
	scaleType: EnumList(
		{
			Fit: "Fit",
			Crop: "Crop",
			Stretch: "Stretch",
			Slice: "Slice",
			Tile: "Tile",
		},
		"Fit",
	),
	color: Datatype.Color3(new Color3(1, 1, 1)),
	transparency: Number(0, 0, 1, 0.05),
	width: Number(160, 48, 420, 8),
	height: Number(96, 48, 280, 8),
	aspectRatio: EnumList(
		{
			free: "free",
			square: "square",
			"16:9": "16:9",
			"4:3": "4:3",
		},
		"free",
	),
	radius: EnumList(
		{
			none: 0,
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"md",
	),
};

type ImageStoryControls = InferControls<typeof controls>;
type ImageRadiusValue = NonNullable<ImageProps["radius"]>;

function resolveAspectRatio(value: string): number | undefined {
	switch (value) {
		case "square":
			return 1;
		case "16:9":
			return 16 / 9;
		case "4:3":
			return 4 / 3;
		case "free":
		default:
			return undefined;
	}
}

function resolveScaleType(value: string): Enum.ScaleType {
	switch (value) {
		case "Crop":
			return Enum.ScaleType.Crop;
		case "Stretch":
			return Enum.ScaleType.Stretch;
		case "Slice":
			return Enum.ScaleType.Slice;
		case "Tile":
			return Enum.ScaleType.Tile;
		case "Fit":
		default:
			return Enum.ScaleType.Fit;
	}
}

function ImageStoryCanvas({ controls: currentControls }: { readonly controls: ImageStoryControls }): React.ReactElement {
	const theme = useTheme();
	const radius = currentControls.radius as ImageRadiusValue;
	const aspectRatio = resolveAspectRatio(currentControls.aspectRatio);

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Image" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="A theme-aware ImageLabel primitive for thumbnails, media previews, atlas sprites, and textured UI surfaces."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="xl">
						<Stack width="100%" align="center" gap="md">
							<Image
								src={currentControls.src}
								width={currentControls.width}
								height={aspectRatio === undefined ? currentControls.height : undefined}
								aspectRatio={aspectRatio}
								bg={themeRefs.background.default}
								borderColor={themeRefs.border.subtle}
								radius={radius}
								color={currentControls.color}
								transparency={currentControls.transparency}
								scaleType={resolveScaleType(currentControls.scaleType)}
								clip
							/>
							<Text
								text="Adjust width, height, and aspect ratio to inspect radius, cropping, and layout behavior at thumbnail sizes."
								color={themeRefs.text.secondary}
								align="center"
								wrap
								width={360}
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
		name: "Image",
		summary: "Theme-aware Roblox ImageLabel primitive with layout props, tinting, cropping modes, decorators, and raw slot escapes.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<ImageStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
