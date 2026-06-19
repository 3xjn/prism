import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Boolean, CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { Box, Icon, Menu, Stack, Text } from "@prism";
import type { MenuAlign, MenuItem, MenuPlacement, MenuSize } from "@prism";
import { useTheme } from "@prism/theme";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	placement: EnumList({ bottom: "bottom", top: "top", left: "left", right: "right" }, "bottom"),
	align: EnumList({ start: "start", center: "center", end: "end" }, "start"),
	size: EnumList({ xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }, "md"),
	disabled: Boolean(false),
	maxVisibleItems: Number(6, 2, 10, 1),
};

type MenuStoryControls = InferControls<typeof controls>;

function MenuTrigger(): React.ReactElement {
	return (
		<Box width={244} bg="background.surface" radius="md" border={1} borderColor="border.default" p="md">
			<Stack width="100%" direction="horizontal" align="center" gap="sm">
				<Box width={34} height={34} bg="primary.light" radius="sm">
					<Stack width="100%" height="100%" align="center" justify="center">
						<Icon name="settings" size={18} color="primary.main" />
					</Stack>
				</Box>
				<Stack width="100%" gap="xs">
					<Text text="Squad actions" weight={700} color="text.primary" />
					<Text text="Click to open menu" size="sm" color="text.secondary" />
				</Stack>
			</Stack>
		</Box>
	);
}

function MenuStoryCanvas({ controls: currentControls }: { readonly controls: MenuStoryControls }): React.ReactElement {
	const theme = useTheme();
	const [lastAction, setLastAction] = React.useState("none");
	const resolvedPlacement = currentControls.placement as MenuPlacement;
	const resolvedAlign = currentControls.align as MenuAlign;
	const resolvedSize = currentControls.size as MenuSize;
	const items: readonly MenuItem[] = [
		{ type: "label", label: "Loadout" },
		{ value: "equip", label: "Equip primary", rightSection: "E" },
		{ value: "inspect", label: "Inspect stats", rightSection: "I" },
		{ value: "favorite", label: "Mark favorite", disabled: true },
		{ type: "divider" },
		{ type: "label", label: "Inventory" },
		{ value: "duplicate", label: "Duplicate kit" },
		{ value: "drop", label: "Drop item", color: "error", rightSection: "Hold" },
	];

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Menu" size="lg" weight={700} color="text.primary" />
					<Text
						text="Anchored game-command list built on Popover. Menu owns action rows and disabled/destructive states; Popover owns portal positioning and click-away dismissal."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" height={340} bg={theme.colors.action.hover} radius="md" p="xl">
						<Stack width="100%" height="100%" align="center" justify="center" gap="lg">
							<Menu
								items={items}
								placement={resolvedPlacement}
								align={resolvedAlign}
								size={resolvedSize}
								disabled={currentControls.disabled}
								maxVisibleItems={currentControls.maxVisibleItems}
								onItemPress={setLastAction}
								gap={8}
							>
								<MenuTrigger />
							</Menu>
							<Text text={`Last action: ${lastAction}`} size="sm" color="text.secondary" />
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
