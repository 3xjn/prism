import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Boolean, CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { Box, Icon, Menu, Pressable, Stack, Text } from "@prism";
import type { MenuAlign, MenuItem, MenuPlacement, MenuSize } from "@prism";
import { useTheme , theme as themeRefs } from "@prism/theme";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";
import { useSelectedObjectLabel } from "./_selectionStoryUtils";

const controls = {
	theme: storyThemeControl,
	placement: EnumList({ bottom: "bottom", top: "top", left: "left", right: "right" }, "bottom"),
	align: EnumList({ start: "start", center: "center", end: "end" }, "start"),
	size: EnumList({ xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }, "md"),
	disabled: Boolean(false),
	maxVisibleItems: Number(6, 2, 10, 1),
};

type MenuStoryControls = InferControls<typeof controls>;

function MenuTrigger({ disabled, onPress }: { readonly disabled: boolean; readonly onPress: () => void }): React.ReactElement {
	return (
		<Pressable width={244} height={68} disabled={disabled} onPress={onPress} selectionOrder={10}>
			<Box width="100%" height="100%" bg={themeRefs.background.surface} radius="md" border={1} borderColor={themeRefs.border.default} p="md">
				<Stack width="100%" direction="horizontal" align="center" gap="sm">
					<Box width={34} height={34} bg={themeRefs.primary.light} radius="sm">
						<Stack width="100%" height="100%" align="center" justify="center">
							<Icon name="settings" size={18} color={themeRefs.primary.main} />
						</Stack>
					</Box>
					<Stack width="100%" gap="xs">
						<Text text="Squad actions" weight={700} color={themeRefs.text.primary} />
						<Text text="Press A or click to open" size="sm" color={themeRefs.text.secondary} />
					</Stack>
				</Stack>
			</Box>
		</Pressable>
	);
}

function MenuStoryCanvas({ controls: currentControls }: { readonly controls: MenuStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [lastAction, setLastAction] = React.useState("none");
	const [opened, setOpened] = React.useState(false);
	const selectedObjectLabel = useSelectedObjectLabel();
	const resolvedPlacement = currentControls.placement as MenuPlacement;
	const resolvedAlign = currentControls.align as MenuAlign;
	const resolvedSize = currentControls.size as MenuSize;
	const items: readonly MenuItem[] = [
		{ type: "label", label: "Loadout" },
		{ value: "equip", label: "Equip primary", icon: "swords", rightSection: "E" },
		{ value: "inspect", label: "Inspect stats", icon: "search", rightSection: "I" },
		{ value: "favorite", label: "Mark favorite", icon: "star", disabled: true },
		{ type: "divider" },
		{ type: "label", label: "Inventory" },
		{ value: "duplicate", label: "Duplicate kit", icon: "copy" },
		{ value: "drop", label: "Drop item", color: "error", icon: "trash-2", rightSection: "Hold" },
	];

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Menu" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Select the Squad actions trigger and press A. Selection enters the first enabled command, skips the disabled favorite row, and returns to the exact trigger after choosing an item or dismissing the panel. The live label shows each native handoff."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" height={340} bg={theme.colors.action.hover} radius="md" p="xl">
						<Stack width="100%" height="100%" align="center" justify="center" gap="lg">
							<Menu
								items={items}
								opened={opened}
								onOpenedChange={setOpened}
								placement={resolvedPlacement}
								align={resolvedAlign}
								size={resolvedSize}
								disabled={currentControls.disabled}
								maxVisibleItems={currentControls.maxVisibleItems}
								onItemPress={setLastAction}
								gap={8}
							>
								<MenuTrigger
									disabled={currentControls.disabled}
									onPress={() => setOpened((current) => !current)}
								/>
							</Menu>
							<Text text={`Last action: ${lastAction}`} size="sm" color={themeRefs.text.secondary} />
							<Text text={selectedObjectLabel} size="sm" weight={600} color={themeRefs.primary.main} wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Menu",
		summary: "Popover-backed anchored command list for in-game actions, with disabled rows, separators, labels, destructive intent, scrolling, and slot escapes.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<MenuStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
