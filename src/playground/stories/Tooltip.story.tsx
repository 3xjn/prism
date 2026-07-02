import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Button, Icon, Stack, Text, Tooltip } from "@prism";
import { theme as themeRefs } from "@prism/theme";
import { Boolean, CreateReactStory, Number, String } from "@rbxts/ui-labs";
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

const controls = {
	theme: storyThemeControl,
	label: String("Restores 25 HP over 5 seconds."),
	openDelay: Number(0.35, 0, 1, 0.05),
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

function ItemTooltipContent(): React.ReactElement {
	return (
		<Box width={340} bg={ITEM_PANEL} border={1} borderColor={ITEM_BORDER} p="md" clip>
			<Stack width="100%" gap="sm">
				<Stack width="100%" direction="horizontal" align="center" gap="sm">
					<Box width={50} height={50} bg={ITEM_PANEL_DEEP} radius="sm" border={1} borderColor={ITEM_GOLD} clip>
						<Stack width="100%" height="100%" align="center" justify="center">
							<Icon name="zap" size={26} color={ITEM_GOLD} />
						</Stack>
					</Box>
					<Stack width={258} gap="xs">
						<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
							<Text text="Stormglass Saber" size="lg" weight={700} color={ITEM_ORANGE} truncate="atend" width={190} />
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
						width={316}
					/>
				</Stack>
			</Stack>
		</Box>
	);
}

function ItemTrigger(): React.ReactElement {
	return (
		<Box width={280} bg={ITEM_PANEL} radius="md" p="md" border={1} borderColor={ITEM_BORDER} clip>
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Box width={42} height={42} bg={ITEM_PANEL_DEEP} radius="sm" border={1} borderColor={ITEM_GOLD} clip>
					<Stack width="100%" height="100%" align="center" justify="center">
						<Icon name="zap" size={24} color={ITEM_GOLD} />
					</Stack>
				</Box>
				<Stack width={206} gap="xs">
					<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
						<Text text="Stormglass Saber" weight={700} color={ITEM_ORANGE} truncate="atend" width={130} />
						<Text text="Legendary" size="xs" weight={700} color={ITEM_PURPLE} />
					</Stack>
					<Text text="Hover for stats and effects" size="sm" color={ITEM_MUTED} />
				</Stack>
			</Stack>
		</Box>
	);
}

function TooltipStoryCanvas({ controls: currentControls }: { readonly controls: TooltipStoryControls }): React.ReactElement {
	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Tooltip" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Hover-intent label bubbles with an inverse default style, a configurable open delay, and a rich-content escape hatch for custom panels."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={themeRefs.background.default} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Text text="Default bubbles" weight={700} color={themeRefs.text.primary} />
							<Text
								text="Plain labels render the inverse bubble with a tail. Tune openDelay in the controls -- leaving before the delay cancels the open."
								size="sm"
								color={themeRefs.text.secondary}
								wrap
								width="100%"
							/>
							<Stack direction="horizontal" gap="lg" align="center" p="xl">
								<Tooltip label={currentControls.label} openDelay={currentControls.openDelay} disabled={currentControls.disabled}>
									<Button label="Use potion" />
								</Tooltip>
								<Tooltip label="Mute voice chat (M)" openDelay={currentControls.openDelay} disabled={currentControls.disabled}>
									<Button label="Mute" variant="outline" />
								</Tooltip>
								<Tooltip label="Party leader" openDelay={currentControls.openDelay} disabled={currentControls.disabled}>
									<Box width={36} height={36} bg={themeRefs.background.surface} radius="xl" border={1} borderColor={themeRefs.border.default}>
										<Stack width="100%" height="100%" align="center" justify="center">
											<Icon name="crown" size={18} color={themeRefs.text.secondary} />
										</Stack>
									</Box>
								</Tooltip>
							</Stack>
						</Stack>
					</Box>
					<Box width="100%" bg={themeRefs.background.default} radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Text text="Rich content escape hatch" weight={700} color={themeRefs.text.primary} />
							<Text
								text="Custom panels replace the bubble chrome entirely via slotProps while keeping the portal, tail, and hover-intent behavior."
								size="sm"
								color={themeRefs.text.secondary}
								wrap
								width="100%"
							/>
							<Box p="xl">
								<Tooltip
									content={<ItemTooltipContent />}
									disabled={currentControls.disabled}
									openDelay={currentControls.openDelay}
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
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Tooltip",
		summary:
			"Hover-intent tooltip with inverse default bubbles, configurable open delay, image-based tail, and a rich-content escape hatch for custom game panels.",
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
