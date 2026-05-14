import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Box, Pressable, Stack, Text } from "@prism";
import type { PressableRenderState } from "@prism";
import { Boolean, CreateReactStory, Number, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const controls = {
	theme: storyThemeControl,
	label: String("Open panel"),
	disabled: Boolean(false),
	active: Boolean(true),
	width: Number(240, 120, 420, 10),
	height: Number(64, 32, 140, 4),
};

type PressableStoryControls = InferControls<typeof controls>;

type LayoutPreset = "focus" | "balanced" | "dense";

function StatePreviewSurface({ count, label, state }: { readonly count: number; readonly label: string; readonly state: PressableRenderState }): React.ReactElement {
	const background = state.disabled ? "action.disabledBackground" : state.pressed ? "action.pressed" : state.hovered ? "action.hover" : "background.surface";
	const border = state.disabled ? "border.subtle" : state.pressed ? "primary.main" : state.hovered ? "border.strong" : "border.default";
	const copy = state.disabled ? "text.disabled" : "text.primary";

	return (
		<Box width="100%" height="100%" center bg={background} radius="md" borderColor={border} p="md">
			<Stack width="100%" height="100%" gap="xs" align="center" justify="center">
				<Text text={label} weight={700} color={copy} align="center" />
				<Text text={`state: ${state.state}`} size="sm" color="text.secondary" align="center" />
				<Text text={`Pressed ${count} time${count === 1 ? "" : "s"}`} size="sm" color="text.secondary" align="center" />
			</Stack>
		</Box>
	);
}

function PresetPreview({ preset }: { readonly preset: LayoutPreset }): React.ReactElement {
	if (preset === "dense") {
		return (
			<Stack width="100%" gap="xs">
				<Box width="100%" height={8} bg="border.strong" radius="xs" />
				<Box width="86%" height={8} bg="border.subtle" radius="xs" />
				<Box width="94%" height={8} bg="border.subtle" radius="xs" />
				<Box width="72%" height={8} bg="border.subtle" radius="xs" />
			</Stack>
		);
	}

	if (preset === "balanced") {
		return (
			<Stack width="100%" gap="xs">
				<Stack width="100%" direction="horizontal" gap="xs">
					<Box width="48%" height={22} bg="border.strong" radius="xs" />
					<Box width="48%" height={22} bg="border.subtle" radius="xs" />
				</Stack>
				<Stack width="100%" direction="horizontal" gap="xs">
					<Box width="48%" height={22} bg="border.subtle" radius="xs" />
					<Box width="48%" height={22} bg="border.subtle" radius="xs" />
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack width="100%" gap="xs">
			<Box width="100%" height={34} bg="border.strong" radius="xs" />
			<Stack width="100%" direction="horizontal" gap="xs">
				<Box width="38%" height={14} bg="border.subtle" radius="xs" />
				<Box width="58%" height={14} bg="border.subtle" radius="xs" />
			</Stack>
		</Stack>
	);
}

function PresetTile({ preset, selected, state }: { readonly preset: LayoutPreset; readonly selected: boolean; readonly state: PressableRenderState }): React.ReactElement {
	const title = preset === "focus" ? "Focus" : preset === "balanced" ? "Balanced" : "Dense";
	const description = preset === "focus" ? "One primary region with supporting context." : preset === "balanced" ? "Equal-weight panels for mixed content." : "Compact rows for scanning lots of items.";
	const background = state.disabled ? "action.disabledBackground" : selected ? "primary.light" : state.hovered ? "background.surface" : "background.default";
	const border = selected ? "primary.main" : state.hovered ? "border.strong" : "border.default";
	const titleColor = state.disabled ? "text.disabled" : "text.primary";

	return (
		<Box width="100%" height="100%" bg={background} radius="md" borderColor={border} p="md">
			<Stack width="100%" height="100%" gap="sm">
				<Box width="100%" height={64} bg="background.surface" radius="sm" borderColor="border.subtle" p="sm">
					<PresetPreview preset={preset} />
				</Box>
				<Stack width="100%" gap="xs">
					<Text text={title} weight={700} color={titleColor} />
					<Text text={description} size="sm" color="text.secondary" wrap width="100%" />
				</Stack>
			</Stack>
		</Box>
	);
}

function PressableStoryCanvas({ controls: currentControls }: { readonly controls: PressableStoryControls }): React.ReactElement {
	const [count, setCount] = React.useState(0);
	const [selectedPreset, setSelectedPreset] = React.useState<LayoutPreset>("balanced");

	return (
		<StoryCanvas>
			<Box width="100%" bg="background.surface" radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="Pressable" size="lg" weight={700} color="text.primary" />
					<Text
						text="A headless TextButton container for custom interactive surfaces. It owns hover, pressed, disabled, cursor, and onPress behavior while your child component owns the visuals."
						color="text.secondary"
						wrap
						width="100%"
					/>
					<Box width="100%" height={220} bg="action.hover" radius="md" p="lg">
						<Stack width="100%" height="100%" gap="sm" align="center" justify="center">
							<Pressable
								width={currentControls.width}
								height={currentControls.height}
								disabled={currentControls.disabled}
								active={currentControls.active}
								onPress={() => setCount((value) => value + 1)}
								render={(state) => <StatePreviewSurface count={count} label={currentControls.label} state={state} />}
							/>
							<Text
								text="This first preview is intentionally static: Pressable emits booleans, and the surface maps them directly to visuals."
								size="sm"
								color="text.secondary"
								align="center"
								wrap
								width="100%"
							/>
						</Stack>
					</Box>
					<Box width="100%" bg="background.default" radius="md" p="lg">
						<Stack width="100%" gap="sm">
							<Text text="Preset picker example" weight={700} color="text.primary" />
							<Text
								text="Pressable is useful when the clickable thing is a whole composition. These tiles behave like a picker, but the visuals are custom layout previews instead of checkbox controls."
								size="sm"
								color="text.secondary"
								wrap
								width="100%"
							/>
							<Stack width="100%" direction="horizontal" gap="sm" align="center" justify="center" wrap>
								<Pressable
									width={176}
									height={164}
									disabled={currentControls.disabled}
									active={currentControls.active}
									onPress={() => setSelectedPreset("focus")}
									render={(state) => <PresetTile preset="focus" selected={selectedPreset === "focus"} state={state} />}
								/>
								<Pressable
									width={176}
									height={164}
									disabled={currentControls.disabled}
									active={currentControls.active}
									onPress={() => setSelectedPreset("balanced")}
									render={(state) => <PresetTile preset="balanced" selected={selectedPreset === "balanced"} state={state} />}
								/>
								<Pressable
									width={176}
									height={164}
									disabled={currentControls.disabled}
									active={currentControls.active}
									onPress={() => setSelectedPreset("dense")}
									render={(state) => <PresetTile preset="dense" selected={selectedPreset === "dense"} state={state} />}
								/>
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Pressable",
		summary: "Headless interactive container for custom clickable surfaces with hover, pressed, disabled, and cursor behavior.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<PressableStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
