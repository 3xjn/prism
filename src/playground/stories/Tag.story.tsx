import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Icon, Stack, Tag, Text } from "@prism";
import type { TagColor, TagSize, TagVariant } from "@prism";
import { useTheme, theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	label: String("Ready"),
	variant: EnumList(
		{
			filled: "filled",
			light: "light",
			outline: "outline",
			subtle: "subtle",
		},
		"subtle",
	),
	color: EnumList(
		{
			neutral: "neutral",
			primary: "primary",
			secondary: "secondary",
			success: "success",
			warning: "warning",
			error: "error",
			info: "info",
		},
		"neutral",
	),
	size: EnumList(
		{
			xs: "xs",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"sm",
	),
	leftSection: Boolean(true),
	rightSection: Boolean(false),
	fullWidth: Boolean(false),
};

type TagStoryControls = InferControls<typeof controls>;

function StatusDot({ color }: { readonly color: Color3 }): React.ReactElement {
	return (
		<frame BackgroundColor3={color} BorderSizePixel={0} Size={UDim2.fromOffset(7, 7)}>
			<uicorner CornerRadius={new UDim(1, 0)} />
		</frame>
	);
}

function VariantGallery({ size }: { readonly size: TagSize }): React.ReactElement {
	const variants: TagVariant[] = ["subtle", "outline", "light", "filled"];
	const colors: TagColor[] = ["neutral", "success", "warning", "error", "info"];
	const rows = new Array<React.ReactElement>();

	for (let index = 0; index < variants.size(); index++) {
		const variant = variants[index];
		const tags = new Array<React.ReactElement>();

		for (const color of colors) {
			tags.push(
				<React.Fragment key={`${variant}-${color}`}>
					<Tag variant={variant} color={color} size={size} label={`${variant}-${color}`} />
				</React.Fragment>,
			);
		}

		rows.push(
			<Stack key={variant} width="100%" direction="horizontal" gap="sm" align="center" wrap layoutOrder={index + 1}>
				{tags}
			</Stack>,
		);
	}

	return <Stack width="100%" gap="sm">{rows}</Stack>;
}

function TagStoryCanvas({ controls: currentControls }: { readonly controls: TagStoryControls }): React.ReactElement {
	const theme = useTheme();
	const variant = currentControls.variant as TagVariant;
	const color = currentControls.color as TagColor;
	const size = currentControls.size as TagSize;
	const statusColor = color === "neutral" ? theme.colors.border.strong : theme.colors[color].main;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Tag" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Small status labels for game UI metadata, using neutral defaults plus semantic intent variants when the marker carries state."
						color={themeRefs.text.secondary}
						wrap
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm" align="center">
							<Tag
								variant={variant}
								color={color}
								size={size}
								fullWidth={currentControls.fullWidth}
								label={currentControls.label}
								leftSection={currentControls.leftSection ? <StatusDot color={statusColor} /> : undefined}
								rightSection={currentControls.rightSection ? <Icon name="info" color={themeRefs.text.secondary} size={14} /> : undefined}
							/>
							<Stack direction="horizontal" gap="sm" align="center" wrap>
								<Tag label="Zone A" />
								<Tag label="Live" color="success" leftSection={<StatusDot color={theme.colors.success.main} />} />
								<Tag label="Low ammo" color="warning" variant="light" />
								<Tag label="Locked" color="error" variant="outline" rightSection={<Icon name="lock" color={themeRefs.error.dark} size={14} />} />
							</Stack>
							<Text
								text="Use `label` for compact copy. Optional leftSection and rightSection accept small Prism content without making Tag interactive."
								size="sm"
								color={themeRefs.text.secondary}
								align="center"
								wrap
								width="100%"
							/>
						</Stack>
					</Box>
					<VariantGallery size={size} />
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Tag",
		summary: "Compact non-interactive label and status marker with neutral defaults, semantic variants, theme sizing, and optional adornment slots.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<TagStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
