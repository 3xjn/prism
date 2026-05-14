import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Text } from "@prism";
import type { TextProps } from "@prism";
import { useTheme } from "@prism/theme";
import type { ThemeSize } from "@prism/theme";
import { Boolean, CreateReactStory, Datatype, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	text: String("Prism Text turns theme tokens into Roblox typography without depending on rich-text internals."),
	size: EnumList(
		{
			xs: "xs",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
			"30px": 30,
		},
		"md",
	),
	color: Datatype.Color3(new Color3(0.2, 0.2, 0.2)),
	weight: EnumList(
		{
			regular: 400,
			medium: 500,
			semibold: 600,
			bold: 700,
			heavy: 900,
		},
		"semibold",
	),
	align: EnumList(
		{
			left: "left",
			center: "center",
			right: "right",
		},
		"left",
	),
	wrap: Boolean(true),
	truncate: EnumList(
		{
			none: "none",
			atend: "atend",
			splitword: "splitword",
		},
		"none",
	),
};

type TextStoryControls = InferControls<typeof controls>;
type TextSizeValue = ThemeSize | number;

function InteractivePreview({ controls: currentControls }: { readonly controls: TextStoryControls }): React.ReactElement {
	const theme = useTheme();
	const previewWidth = theme.spacing.xl * 14;
	const resolvedSize = currentControls.size as TextSizeValue;

	return (
		<frame
			LayoutOrder={3}
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			BackgroundTransparency={1}
			BorderSizePixel={0}
		>
			<uilistlayout
				Padding={new UDim(0, theme.spacing.md)}
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
			/>
			<frame
				LayoutOrder={1}
				Size={UDim2.fromOffset(previewWidth, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				BackgroundColor3={theme.colors.background.surface}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(0, theme.radius.sm)} />
				<uistroke Color={theme.colors.border.default} Thickness={1} Transparency={0.2} />
				<Text
					width="100%"
					p="md"
					size={resolvedSize}
					color={currentControls.color}
					weight={currentControls.weight}
					align={currentControls.align}
					wrap={currentControls.wrap}
					truncate={currentControls.truncate}
					slotProps={{ root: { AutomaticSize: Enum.AutomaticSize.Y } }}
					text={currentControls.text}
				/>
			</frame>
		</frame>
	);
}

function TextStoryCanvas({ controls: currentControls }: { readonly controls: TextStoryControls }): React.ReactElement {
	return (
		<StoryCanvas>
			<InteractivePreview controls={currentControls} />
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Text",
		summary: "Typography with theme-driven sizing, weight, and color.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<TextStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
