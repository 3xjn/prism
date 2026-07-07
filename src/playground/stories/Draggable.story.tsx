import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Draggable, Image, Stack, Text } from "@prism";
import type { DraggableItem } from "@prism";
import { Boolean, CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

interface AbilityItem extends DraggableItem {
	readonly label: string;
	readonly icon: string;
	readonly cooldown: string;
}

const abilities: readonly AbilityItem[] = [
	{ id: "dash", label: "Dash", icon: "rbxassetid://110526050617848", cooldown: "4s" },
	{ id: "barrier", label: "Barrier", icon: "rbxassetid://70420218349466", cooldown: "12s" },
	{ id: "mend", label: "Mend", icon: "rbxassetid://77237225617245", cooldown: "9s" },
	{ id: "ignite", label: "Ignite", icon: "rbxassetid://124578818898399", cooldown: "7s" },
	{ id: "focus", label: "Focus", icon: "rbxassetid://125807330222658", cooldown: "15s" },
];

const abilityLabelById: Record<string, string> = {};
for (const ability of abilities) {
	abilityLabelById[ability.id] = ability.label;
}

const controls = {
	theme: storyThemeControl,
	disabled: Boolean(false),
	active: Boolean(true),
	direction: EnumList(
		{
			horizontal: "horizontal",
			vertical: "vertical",
		},
		"horizontal",
	),
	gap: Number(8, 0, 32, 1),
};

type DraggableStoryControls = InferControls<typeof controls>;

function AbilitySlot({
	item,
	slotNumber,
	disabled,
	dragging,
	direction,
}: {
	readonly item: AbilityItem;
	readonly slotNumber: number;
	readonly disabled: boolean;
	readonly dragging: boolean;
	readonly direction: "vertical" | "horizontal";
}): React.ReactElement {
	const background = disabled
		? themeRefs.action.disabledBackground
		: dragging
			? themeRefs.primary.light
			: themeRefs.background.surface;
	const border = disabled ? themeRefs.border.subtle : dragging ? themeRefs.primary.main : themeRefs.border.default;
	const iconColor = disabled ? themeRefs.text.disabled : dragging ? themeRefs.primary.dark : themeRefs.text.primary;

	if (direction === "horizontal") {
		const slotBackground = disabled
			? themeRefs.palette.gray["7"]
			: dragging
				? themeRefs.palette.gray["7"]
				: themeRefs.palette.gray["8"];
		const slotBorder = dragging ? themeRefs.primary.main : themeRefs.palette.gray["6"];

		return (
			<Box width={64} height={64} bg={slotBackground} radius="md" borderColor={slotBorder}>
				<Image src={item.icon} width={52} height={52} center transparency={disabled ? 0.6 : 0} />
				<Box
					width={18}
					height={16}
					bg={themeRefs.palette.gray["9"]}
					radius="sm"
					position={{ x: "100%", y: "100%" }}
					anchor={new Vector2(1, 1)}
				>
					<Text
						text={`${slotNumber}`}
						size="xs"
						weight={700}
						color={themeRefs.text.inverse}
						width="100%"
						height="100%"
						align="center"
					/>
				</Box>
			</Box>
		);
	}

	return (
		<Box width="100%" bg={background} radius="md" borderColor={border} p="sm">
			<Stack width="100%" direction="horizontal" gap="md" align="center">
				<Box bg={themeRefs.background.default} radius="sm" px="sm" py="xs">
					<Text text={`${slotNumber}`} weight={700} color={themeRefs.text.secondary} />
				</Box>
				<Image src={item.icon} width={36} height={36} transparency={disabled ? 0.6 : 0} />
				<Stack gap="xs">
					<Text text={item.label} weight={700} color={iconColor} />
					<Text text={`Cooldown ${item.cooldown}`} size="xs" color={themeRefs.text.secondary} />
				</Stack>
			</Stack>
		</Box>
	);
}

function DraggableStoryCanvas({ controls: currentControls }: { readonly controls: DraggableStoryControls }): React.ReactElement {
	const direction = currentControls.direction as "vertical" | "horizontal";
	const [order, setOrder] = React.useState<readonly string[]>(() => abilities.map((item) => item.id));

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Draggable" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="A headless reorderable list primitive. Drag an ability to change its hotbar slot -- Prism animates the pickup, the reorder shifts, and the drop settle while your render function owns the visuals."
						color={themeRefs.text.secondary}
						align="left"
						wrap
						width="100%"
					/>
					<Box width="100%" bg={themeRefs.background.default} radius="md" p="lg">
						<Stack width="100%" gap="md">
							<Text text="Ability loadout" weight={700} color={themeRefs.text.primary} />
							<Text
								text="Keybind slots follow the order: whatever sits first casts on 1, and so on. Try dropping an ability far from its slot to see the settle animation."
								size="sm"
								color={themeRefs.text.secondary}
								align="left"
								wrap
								width="100%"
							/>
							<Box
								width={direction === "horizontal" ? undefined : "100%"}
								bg={direction === "horizontal" ? themeRefs.palette.gray["9"] : undefined}
								bgTransparency={direction === "horizontal" ? 0 : 1}
								borderColor={direction === "horizontal" ? themeRefs.palette.gray["7"] : undefined}
								radius="lg"
								p={direction === "horizontal" ? "sm" : undefined}
							>
								<Draggable
									width={direction === "horizontal" ? undefined : "100%"}
									direction={direction}
									gap={currentControls.gap}
									align={direction === "vertical" ? "stretch" : "center"}
									justify="start"
									items={abilities}
									value={order}
									onReorder={setOrder}
									disabled={currentControls.disabled}
									active={currentControls.active}
									renderItem={(state) => {
										const slotIndex = order.indexOf(state.item.id);
										return (
											<AbilitySlot
												item={state.item}
												slotNumber={(slotIndex >= 0 ? slotIndex : state.index) + 1}
												disabled={state.disabled}
												dragging={state.dragging}
												direction={direction}
											/>
										);
									}}
								/>
							</Box>
							<Text
								text={`Cast order: ${order.map((id, index) => `${index + 1} ${abilityLabelById[id]}`).join("   ")}`}
								size="sm"
								color={themeRefs.text.secondary}
								align="left"
								width="100%"
							/>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Draggable",
		summary:
			"Headless drag-and-drop reorderable list primitive with controlled or uncontrolled order, mouse and touch dragging, animated pickup/settle, and render-state driven item styling.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<DraggableStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
