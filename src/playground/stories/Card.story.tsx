import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Card, Divider, Input, Stack, Text } from "@prism";
import type { CardShadowValue, CardVariant } from "@prism";
import type { ThemeSize } from "@prism/theme";
import { useTheme , theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, EnumList, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	title: String("Change Name"),
	variant: EnumList(
		{
			surface: "surface",
			outline: "outline",
			subtle: "subtle",
			elevated: "elevated",
		},
		"surface",
	),
	padding: EnumList(
		{
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"lg",
	),
	radius: EnumList(
		{
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"md",
	),
	shadow: EnumList(
		{
			variantDefault: "variantDefault",
			none: "none",
			sm: "sm",
			md: "md",
			lg: "lg",
			xl: "xl",
		},
		"variantDefault",
	),
	fullWidth: Boolean(false),
	showInput: Boolean(true),
	showActions: Boolean(true),
};

type CardStoryControls = InferControls<typeof controls>;

function CardStoryCanvas({ controls: currentControls }: { readonly controls: CardStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [query, setQuery] = React.useState("");
	const resolvedVariant = currentControls.variant as CardVariant;
	const resolvedPadding = currentControls.padding as ThemeSize;
	const resolvedRadius = currentControls.radius as ThemeSize;
	const resolvedShadow: CardShadowValue | undefined =
		currentControls.shadow === "variantDefault"
			? undefined
			: currentControls.shadow === "none"
				? false
				: (currentControls.shadow as ThemeSize);
	const cardWidth = currentControls.fullWidth ? "100%" : 380;

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Card" size="xl" weight={700} color={themeRefs.text.primary} />
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="lg">
						<Card
							variant={resolvedVariant}
							width={cardWidth}
							p={resolvedPadding}
							radius={resolvedRadius}
							shadow={resolvedShadow}
						>
							<Stack width="100%" gap="md">
								<Stack width="100%" gap="xs">
									<Text text={currentControls.title} size="lg" weight={700} color={themeRefs.text.primary} />
									<Text
										text="Tip: you can only change your name once a week"
										color={themeRefs.text.secondary}
										align="left"
										wrap
									/>
								</Stack>
								{currentControls.showInput ? (
									<Input
										value={query}
										onChange={setQuery}
										placeholder="Enter name here..."
										variant="outline"
										fullWidth
									/>
								) : undefined}
								{currentControls.showActions ? (
									<Stack width="100%" direction="horizontal" justify="end" gap="sm">
										<Button size="sm" variant="outline" label="Cancel" />
										<Button size="sm" label="Confirm" />
									</Stack>
								) : undefined}
							</Stack>
						</Card>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Card",
		summary: "Opinionated content surface with Prism panel defaults for padding, border treatment, clipping, and optional elevation.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<CardStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
