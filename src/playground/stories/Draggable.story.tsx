import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Draggable, Stack, Text } from "@prism";
import type { DraggableItem } from "@prism";
import { Boolean, CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

interface StoryItem extends DraggableItem {
	readonly label: string;
	readonly note: string;
}

const baseItems: readonly StoryItem[] = [
	{ id: "backlog", label: "Backlog", note: "Ideas and incoming tasks" },
	{ id: "design", label: "Design", note: "Specs, mocks, and content" },
	{ id: "build", label: "Build", note: "Implementation work in progress" },
	{ id: "qa", label: "QA", note: "Verification before shipping" },
	{ id: "done", label: "Done", note: "Everything ready to publish" },
];

const controls = {
	theme: storyThemeControl,
	disabled: Boolean(false),
	active: Boolean(true),
	direction: EnumList(
		{
			vertical: "vertical",
			horizontal: "horizontal",
		},
		"vertical",
	),
		gap: Number(12, 0, 32, 1),
};

type DraggableStoryControls = InferControls<typeof controls>;

function SortableCard({
	item,
	disabled,
	active,
	dragging,
	direction,
}: {
	readonly item: StoryItem;
	readonly disabled: boolean;
	readonly active: boolean;
	readonly dragging: boolean;
	readonly direction: "vertical" | "horizontal";
}): React.ReactElement {
	const background = disabled ? "action.disabledBackground" : dragging ? "primary.light" : active ? "action.hover" : "background.surface";
	const border = disabled ? "border.subtle" : dragging ? "primary.main" : active ? "primary.light" : "border.default";
	const badgeBackground = dragging ? "primary.main" : active ? "secondary.light" : "background.default";
	const badgeColor = dragging ? "text.inverse" : active ? "secondary.dark" : "text.secondary";

	return (
		<Box
			width={direction === "horizontal" ? 160 : "100%"}
			bg={background}
			radius="md"
			borderColor={border}
			p="md"
		>
			<Stack width="100%" gap="sm">
				<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
					<Text text={item.label} weight={700} color={disabled ? "text.disabled" : "text.primary"} />
					<Box bg={badgeBackground} radius="xl" px="sm" py="xs">
						<Text text={dragging ? "Dragging" : active ? "Active" : "Ready"} size="sm" color={badgeColor} />
					</Box>
				</Stack>
				<Text text={item.note} size="sm" color={disabled ? "text.disabled" : "text.secondary"} wrap width="100%" />
				<Box width="100%" bg="background.default" radius="sm" p="sm">
					<Text text={`ID: ${item.id}`} size="sm" color="text.secondary" />
				</Box>
			</Stack>
		</Box>
	);
}

function DraggableStoryCanvas({ controls: currentControls }: { readonly controls: DraggableStoryControls }): React.ReactElement {
	const direction = currentControls.direction as "vertical" | "horizontal";
	const [order, setOrder] = React.useState<readonly string[]>(() => baseItems.map((item) => item.id));
	const orderedLabelParts: string[] = [];
	for (const id of order) {
		const label = baseItems.find((item) => item.id === id)?.label;
		if (label !== undefined) {
			orderedLabelParts.push(label);
		}
	}
	const orderedLabels = orderedLabelParts.join(" → ");

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Draggable" size="lg" weight={700} color="text.primary" />
					<Text
						text="A headless reorderable Stack primitive. Drag an item through the list and Prism updates the order while your render function owns the actual visuals."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" bg="background.default" radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Text text="Sortable workflow" weight={700} color="text.primary" />
							<Text
								text="This behaves like a Stack with drag-and-drop reordering. It supports controlled order, disabled states, and both vertical and horizontal lists without introducing game-specific visuals."
								size="sm"
								color="text.secondary"
								wrap
								width="100%"
							/>
							<Draggable
								width="100%"
								direction={direction}
								gap={currentControls.gap}
								align={direction === "vertical" ? "stretch" : "center"}
								justify="start"
								items={baseItems}
								value={order}
								onReorder={setOrder}
								disabled={currentControls.disabled}
								active={currentControls.active}
								renderItem={(state) => (
									<SortableCard
										item={state.item}
										disabled={state.disabled}
										active={state.active}
										dragging={state.dragging}
										direction={direction}
									/>
								)}
							/>
							<Text text={`Order: ${orderedLabels}`} size="sm" color="text.secondary" wrap width="100%" />
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
		summary: "Headless drag-and-drop reorderable Stack/list primitive with controlled or uncontrolled order, mouse and touch dragging, and render-state driven item styling.",
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
