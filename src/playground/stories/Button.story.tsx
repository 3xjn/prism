import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import {Box, Button, Icon, Stack, Text} from "@prism";
import type { ButtonColor, ButtonSize } from "@prism";
import type { Variant } from "@prism/theme";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	label: String("Save changes"),
	variant: EnumList(
		{
			filled: "filled",
			light: "light",
			outline: "outline",
			subtle: "subtle",
		},
		"filled",
	),
	color: EnumList(
		{
			primary: "primary",
			secondary: "secondary",
			success: "success",
			warning: "warning",
			error: "error",
			info: "info",
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
};

type ButtonStoryControls = InferControls<typeof controls>;

function VariantGallery({ size }: { readonly size: ButtonSize }): React.ReactElement {
	const variants: Variant[] = ["filled", "light", "outline", "subtle"];
	const colors: ButtonColor[] = ["primary", "success", "warning", "error"];
	const rows = new Array<React.ReactElement>();

	for (let index = 0; index < variants.size(); index++) {
		const variant = variants[index];
		const buttons = new Array<React.ReactElement>();

		for (const color of colors) {
			buttons.push(
				<React.Fragment key={`${variant}-${color}`}>
					<Button variant={variant} color={color} size={size} label={`${variant}-${color}`} />
				</React.Fragment>,
			);
		}

		buttons.push(
			<React.Fragment key={`${variant}-disabled`}>
				<Button variant={variant} color="primary" size={size} disabled label={`${variant}-disabled`} />
			</React.Fragment>,
		);

		rows.push(
			<Stack key={variant} width="100%" direction="horizontal" gap="sm" align="center" wrap layoutOrder={index + 1}>
				{buttons}
			</Stack>,
		);
	}

	return <Stack width="100%" gap="sm">{rows}</Stack>;
}

function ButtonStoryCanvas({ controls: currentControls }: { readonly controls: ButtonStoryControls }): React.ReactElement {
	const theme = useTheme();
	const variant = currentControls.variant as Variant;
	const color = currentControls.color as ButtonColor;
	const size = currentControls.size as ButtonSize;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Button" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Hover and press the preview to inspect the built-in motion. Variant and intent controls update the same component API Prism ships publicly."
						color={themeRefs.text.secondary}
						wrap
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Stack width="100%" gap="sm" align="center">
							<Button
								variant={variant}
								color={color}
								size={size}
								disabled={currentControls.disabled}
								fullWidth={currentControls.fullWidth}
								label={currentControls.label}
							/>
							<Button
								variant={variant}
								color={color}
								size={size}
								disabled={currentControls.disabled}
								fullWidth={currentControls.fullWidth}
								label={currentControls.label}
							>
								<Icon name="save" color={themeRefs.primary.contrast} />
							</Button>
							<Text
								text="Use `label` for normal copy. Optional React children render as unscaled adornments before the label, while the press animation stays on the visual body only."
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
		name: "Button",
		summary: "Animated interactive action with semantic variants, disabled styling, and internal motion ownership.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<ButtonStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
