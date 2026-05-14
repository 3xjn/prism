import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Icon, Stack, Text, Tooltip } from "@prism";
import { useTheme } from "@prism/theme";
import { Boolean, CreateReactStory, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const ITEM_PANEL = Color3.fromRGB(6, 19, 27);
const ITEM_PANEL_DEEP = Color3.fromRGB(3, 11, 17);
const ITEM_BORDER = Color3.fromRGB(139, 105, 43);
const ITEM_BORDER_DARK = Color3.fromRGB(75, 58, 27);
const ITEM_GOLD = Color3.fromRGB(245, 170, 38);
const ITEM_GOLD_SOFT = Color3.fromRGB(210, 177, 105);
const ITEM_TEXT = Color3.fromRGB(226, 229, 218);
const ITEM_MUTED = Color3.fromRGB(157, 166, 161);
const ITEM_BLUE = Color3.fromRGB(39, 210, 255);
const ITEM_GREEN = Color3.fromRGB(92, 213, 125);
const ITEM_PURPLE = Color3.fromRGB(188, 140, 255);
const ITEM_ORANGE = Color3.fromRGB(255, 127, 39);
const ITEM_PANEL_GRADIENT = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(9, 29, 42)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(3, 10, 16)),
]);

const controls = {
	theme: storyThemeControl,
	content: String("Limited to 1 Stormglass item."),
	disabled: Boolean(false),
};

type TooltipStoryControls = InferControls<typeof controls>;

function Divider(): React.ReactElement {
	return <Box width="100%" height={1} bg={ITEM_BORDER_DARK} />;
}

function StatRow({ icon, stat, value, color }: { readonly icon: React.ComponentProps<typeof Icon>["name"]; readonly stat: string; readonly value: string; readonly color: Color3 }): React.ReactElement {
	return (
		<Stack width="100%" direction="horizontal" align="center" gap="xs">
			<Icon name={icon} size={14} color={color} />
			<Text text={value} size="sm" weight={700} color={ITEM_TEXT} />
			<Text text={stat} size="sm" color={ITEM_MUTED} />
		</Stack>
	);
}

function ItemTooltipContent({ footer }: { readonly footer: string }): React.ReactElement {
	return (
		<Box width={360} bg={ITEM_PANEL} border={1} borderColor={ITEM_BORDER} p="md" clip>
			<Stack width="100%" gap="sm">
				<Stack width="100%" direction="horizontal" align="center" gap="sm">
					<Box width={58} height={58} bg={ITEM_PANEL_DEEP} radius="sm" border={1} borderColor={ITEM_GOLD} clip>
						<Box width="100%" height="100%" bg="primary.light" gradient={{ colors: ITEM_PANEL_GRADIENT, rotation: 35 }}>
							<Stack width="100%" height="100%" align="center" justify="center">
								<Icon name="zap" size={30} color={ITEM_GOLD} />
							</Stack>
						</Box>
					</Box>
					<Stack width="100%" gap="xs">
						<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
							<Text text="Stormglass Saber" size="lg" weight={700} color={ITEM_ORANGE} truncate="atend" width={220} />
							<Stack direction="horizontal" align="center" gap="xs">
								<Icon name="coins" size={15} color={ITEM_GOLD_SOFT} />
								<Text text="3000" size="sm" weight={700} color={ITEM_GOLD_SOFT} />
							</Stack>
						</Stack>
						<Text text="Legendary · One-Handed Sword" size="sm" color={ITEM_PURPLE} />
					</Stack>
				</Stack>

				<Divider />

				<Stack width="100%" gap="xs">
					<StatRow icon="sword" value="+40" stat="Power" color={ITEM_GOLD} />
					<StatRow icon="zap" value="+18%" stat="Attack Speed" color={ITEM_BLUE} />
					<StatRow icon="chevrons-up" value="+6%" stat="Move Speed" color={ITEM_GREEN} />
				</Stack>

				<Divider />

				<Stack width="100%" gap="xs">
					<Text text="UNIQUE PASSIVE — Stormcharge" size="sm" weight={700} color={ITEM_GOLD} />
					<Text
						text="Moving and striking builds charge. At full charge, your next hit releases lightning, dealing 60 magic damage to up to 5 nearby enemies."
						size="sm"
						color={ITEM_TEXT}
						wrap
						width="100%"
					/>
				</Stack>

				<Stack width="100%" gap="xs">
					<Text text="ACTIVE — Blinkstep" size="sm" weight={700} color={ITEM_BLUE} />
					<Text
						text="Dash a short distance and gain 25% Move Speed for 2 seconds. Cooldown: 18s."
						size="sm"
						color={ITEM_TEXT}
						wrap
						width="100%"
					/>
				</Stack>

				<Divider />
				<Text text={footer} size="sm" color={ITEM_MUTED} wrap width="100%" />
			</Stack>
		</Box>
	);
}

function ItemTrigger(): React.ReactElement {
	return (
		<Box width={244} bg={ITEM_PANEL} radius="md" p="md" border={1} borderColor={ITEM_BORDER} clip>
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Box width={42} height={42} bg={ITEM_PANEL_DEEP} radius="sm" border={1} borderColor={ITEM_GOLD} clip>
					<Stack width="100%" height="100%" align="center" justify="center">
						<Icon name="zap" size={24} color={ITEM_GOLD} />
					</Stack>
				</Box>
				<Stack width="100%" gap="xs">
					<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
						<Text text="Stormglass Saber" weight={700} color={ITEM_ORANGE} truncate="atend" width={144} />
						<Text text="Legendary" size="xs" weight={700} color={ITEM_PURPLE} />
					</Stack>
					<Text text="Hover for stats and effects" size="sm" color={ITEM_MUTED} />
				</Stack>
			</Stack>
		</Box>
	);
}

function TooltipStoryCanvas({ controls: currentControls }: { readonly controls: TooltipStoryControls }): React.ReactElement {
	const theme = useTheme();

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Tooltip" size="lg" weight={700} color="text.primary" />
					<Text
						text="Inspect one passive game item surface that portals a rich stat tooltip above its hover target, with rarity color, price, effects, and a real image-based tail."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="xl">
						<Tooltip
							content={<ItemTooltipContent footer={currentControls.content} />}
							disabled={currentControls.disabled}
							gap={14}
							slotProps={{
								bubble: { BackgroundTransparency: 1 },
								bubbleStroke: { Transparency: 1 },
								bubblePadding: {
									PaddingTop: new UDim(0, 0),
									PaddingRight: new UDim(0, 0),
									PaddingBottom: new UDim(0, 0),
									PaddingLeft: new UDim(0, 0),
								},
								tail: { ImageColor3: ITEM_PANEL, ImageTransparency: 0 },
								tailBorder: { ImageColor3: ITEM_BORDER, ImageTransparency: 0 },
							}}
						>
							<ItemTrigger />
						</Tooltip>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Tooltip",
		summary: "Portal-backed rich item tooltip for passive game UI targets, with rarity color, stat rows, price metadata, effect copy, raw slot escapes, and an image-based tail.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<TooltipStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
