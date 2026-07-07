import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Icon, Stack, styled, Text } from "@prism";
import type { ButtonColor, ButtonSize, ButtonStyleOverride } from "@prism";
import type { Variant } from "@prism/theme";
import { theme as themeRefs, useTheme } from "@prism/theme";
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

const brandOverrideStyles: ButtonStyleOverride = (_styles, ctx) => {
	if (ctx.state === "disabled") {
		return {};
	}

	if (ctx.state === "hovered") {
		return {
			backgroundColor: ctx.theme.colors.secondary.dark,
			shouldRenderStroke: true,
			strokeColor: ctx.theme.colors.secondary.contrast,
			strokeTransparency: 0,
		};
	}

	if (ctx.state === "pressed") {
		return {
			backgroundColor: ctx.theme.colors.primary.dark,
			scale: 0.94,
		};
	}

	return {
		backgroundColor: ctx.theme.colors.secondary.main,
	};
};

const BrandButton = styled(Button)({
	color: "secondary",
	styleOverrides: brandOverrideStyles,
});

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
					<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Text text="Style override lab" size="md" weight={700} color={themeRefs.text.primary} />
							<Stack width="100%" direction="horizontal" gap="sm" align="center" wrap>
								<Button
									label="Brand override"
									color="secondary"
									size={size}
									styleOverrides={brandOverrideStyles}
								/>
								<Button
									label="Brand disabled"
									color="secondary"
									size={size}
									disabled
									styleOverrides={brandOverrideStyles}
								/>
								<BrandButton label="BrandButton" size={size} />
								<BrandButton label="Caller error" color="error" size={size} />
								<Button
									label="SlotProps static"
									variant="outline"
									color="secondary"
									size={size}
									slotProps={{
										root: {
											BackgroundColor3: theme.colors.secondary.main,
											BackgroundTransparency: 0,
											TextColor3: theme.colors.secondary.contrast,
										},
										stroke: {
											Color: theme.colors.secondary.dark,
											Transparency: 0,
											Thickness: 1,
										},
									}}
								/>
							</Stack>
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
