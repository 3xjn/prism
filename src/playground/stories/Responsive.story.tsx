import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Stack, Text, useBreakpoint, usePreferredInput, useResponsiveValue } from "@prism";
import type { StackDirection, ThemeSize } from "@prism";
import { theme as themeRefs, useTheme } from "@prism/theme";
import { CreateReactStory } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
};

type ResponsiveStoryControls = InferControls<typeof controls>;

const INVENTORY_ITEMS = [
	"Pulse scanner",
	"Repair kit",
	"Signal key",
	"Field map",
	"Relay core",
	"Survey lens",
	"Power cell",
	"Access card",
] as const;

function InventoryPreview({
	columns,
	compact,
}: {
	readonly columns: number;
	readonly compact: boolean;
}): React.ReactElement {
	const theme = useTheme();
	const cellHeight = compact ? 52 : 64;
	const rowCount = math.ceil(INVENTORY_ITEMS.size() / columns);
	const gridHeight = rowCount * cellHeight + math.max(rowCount - 1, 0) * theme.spacing.sm;

	return (
		<frame BackgroundTransparency={1} BorderSizePixel={0} Size={new UDim2(1, 0, 0, gridHeight)}>
			<uigridlayout
				CellPadding={UDim2.fromOffset(theme.spacing.sm, theme.spacing.sm)}
				CellSize={new UDim2(1 / columns, -theme.spacing.sm, 0, cellHeight)}
				FillDirection={Enum.FillDirection.Horizontal}
				FillDirectionMaxCells={columns}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{INVENTORY_ITEMS.map((label, index) => (
				<Box
					key={label}
					width="100%"
					height="100%"
					bg={themeRefs.background.default}
					border={1}
					borderColor={themeRefs.border.subtle}
					radius="sm"
					p="sm"
					layoutOrder={index + 1}
				>
					<Text
						text={label}
						color={themeRefs.text.primary}
						size={compact ? "xs" : "sm"}
						weight={600}
						width="100%"
						height="100%"
						wrap
					/>
				</Box>
			))}
		</frame>
	);
}

function ResponsiveStoryCanvas({ target }: { readonly target: Frame }): React.ReactElement {
	const theme = useTheme();
	const breakpoint = useBreakpoint({ target });
	const preferredInput = usePreferredInput();
	const columns = useResponsiveValue({ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }, { target });
	const direction = useResponsiveValue<StackDirection>({ xs: "vertical", md: "horizontal" }, { target });
	const controlSize = useResponsiveValue<ThemeSize>({ xs: "sm", lg: "md" }, { target });
	const compact = breakpoint === "xs" || breakpoint === "sm";
	const panelWidth = direction === "vertical" ? "100%" : "48%";

	return (
		<StoryCanvas>
			<Stack width="100%" gap="lg">
				<Stack width="100%" gap="xs">
					<Text text="Responsive foundation" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Resize the UI Labs preview. Prism resolves MUI-style breakpoints from this host frame, while input adaptation stays tied to Roblox PreferredInput."
						color={themeRefs.text.secondary}
						width="100%"
						wrap
					/>
				</Stack>

				<Box
					width="100%"
					bg={themeRefs.background.surface}
					border={1}
					borderColor={themeRefs.border.subtle}
					radius="md"
					p="md"
				>
					<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center" gap="sm" wrap>
						<Text
							text={`Host width: ${math.floor(target.AbsoluteSize.X)} px`}
							color={themeRefs.text.secondary}
							size="sm"
						/>
						<Text text={`Breakpoint: ${breakpoint}`} color={themeRefs.primary.main} size="sm" weight={700} />
						<Text text={`Preferred input: ${preferredInput.Name}`} color={themeRefs.text.secondary} size="sm" />
					</Stack>
				</Box>

				<Stack width="100%" direction={direction} justify="spaceBetween" align="start" gap="lg">
					<Box
						width={panelWidth}
						bg={themeRefs.background.surface}
						border={1}
						borderColor={themeRefs.border.subtle}
						radius="md"
						p="lg"
					>
						<Stack width="100%" gap="md">
							<Stack width="100%" gap="xs">
								<Text text="Field loadout" size="lg" weight={700} color={themeRefs.text.primary} />
								<Text
									text="The same information hierarchy reflows instead of shrinking into an unreadable desktop panel."
									color={themeRefs.text.secondary}
									size="sm"
									width="100%"
									wrap
								/>
							</Stack>
							<Button label="Deploy loadout" size={controlSize} fullWidth color="primary" />
							<Button label="Review changes" size={controlSize} fullWidth variant="outline" color="secondary" />
						</Stack>
					</Box>

					<Box
						width={panelWidth}
						bg={themeRefs.background.surface}
						border={1}
						borderColor={themeRefs.border.subtle}
						radius="md"
						p="lg"
					>
						<Stack width="100%" gap="md">
							<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center" gap="sm">
								<Text text="Inventory" size="lg" weight={700} color={themeRefs.text.primary} />
								<Text text={`${columns} columns`} size="sm" color={themeRefs.text.secondary} />
							</Stack>
							<InventoryPreview columns={columns} compact={compact} />
						</Stack>
					</Box>
				</Stack>
			</Stack>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Responsive",
		summary: "MUI-style xs–xl breakpoints and Roblox preferred-input reactivity against the actual UI host.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => (
		<StoryThemeProvider mode={props.controls.theme}>
			<ResponsiveStoryCanvas target={props.target} />
		</StoryThemeProvider>
	),
);

export = story;
