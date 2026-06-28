import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";
import ReactRoblox from "@rbxts/react-roblox";
import { Avatar, Box, Progress, Stack, Text, WorldPortal } from "@prism";
import { Boolean, CreateReactStory, EnumList, Number, String } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";
import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const Workspace = game.GetService("Workspace");
const RunService = game.GetService("RunService");

function avatarThumbnail(userId: number): string {
	return `rbxthumb://type=AvatarHeadShot&id=${math.floor(userId)}&w=150&h=150`;
}

const controls = {
	theme: storyThemeControl,
	kind: EnumList(
		{
			billboard: "billboard",
			surface: "surface",
		},
		"billboard",
	),
	billboardSizing: EnumList(
		{
			pixels: "pixels",
			world: "world",
		},
		"world",
	),
	userId: Number(1, 1, 1000000000, 1),
	playerName: String("AsterVale"),
	role: String("Scout • Lv. 24"),
	team: String("Blue Team"),
	health: Number(76, 0, 100, 1),
	energy: Number(42, 0, 100, 1),
	alwaysOnTop: Boolean(true),
	studsOffsetY: Number(3.25, -2, 8, 0.25),
};

type WorldPortalStoryControls = InferControls<typeof controls>;

function useStoryPart(): BasePart | undefined {
	const [part, setPart] = React.useState<BasePart>();

	React.useEffect(() => {
		const storyPart = new Instance("Part");
		storyPart.Name = "PrismWorldPortalPlayerAnchor";
		storyPart.Anchored = true;
		storyPart.Size = new Vector3(4, 5, 1);
		storyPart.Position = new Vector3(0, 4, -12);
		storyPart.Color = Color3.fromRGB(64, 84, 108);
		storyPart.Material = Enum.Material.SmoothPlastic;
		storyPart.Parent = Workspace;

		setPart(storyPart);

		return () => {
			storyPart.Destroy();
		};
	}, []);

	return part;
}

function useBillboardContentScale(target: BasePart | undefined, enabled: boolean): number {
	const [scale, setScale] = React.useState(1);
	const referenceDistance = React.useRef<number>();

	React.useEffect(() => {
		if (!enabled || target === undefined) {
			referenceDistance.current = undefined;
			setScale(1);
			return;
		}

		const updateScale = () => {
			const camera = Workspace.CurrentCamera;

			if (camera === undefined) {
				setScale(1);
				return;
			}

			const distance = camera.CFrame.Position.sub(target.Position).Magnitude;

			if (referenceDistance.current === undefined) {
				referenceDistance.current = math.max(distance, 1);
			}

			setScale(math.clamp(referenceDistance.current / math.max(distance, 1), 0.35, 1.35));
		};

		updateScale();
		const connection = RunService.RenderStepped.Connect(updateScale);

		return () => {
			connection.Disconnect();
		};
	}, [enabled, target]);

	return scale;
}

function MetricRow({ label, value, color }: { readonly label: string; readonly value: number; readonly color: "error" | "info" }): React.ReactElement {
	return (
		<Stack width="100%" gap="xs">
			<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
				<Text text={label} size="xs" weight={700} color={themeRefs.text.secondary} />
				<Text text={`${math.floor(value)}%`} size="xs" weight={700} color={themeRefs.text.primary} />
			</Stack>
			<Progress value={value} color={color} size="xs" fullWidth />
		</Stack>
	);
}

function PlayerHudCard({ controls: currentControls, compact, contentScale = 1 }: { readonly controls: WorldPortalStoryControls; readonly compact: boolean; readonly contentScale?: number }): React.ReactElement {
	const avatarSize = compact ? 44 : 58;
	const textColumnWidth = compact ? 190 : 300;

	return (
		<Box width="100%" height="100%" bg={themeRefs.background.surface} radius="md" border={1} borderColor={themeRefs.border.default} p={compact ? "xs" : "sm"} clip>
			<frame BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)} AnchorPoint={new Vector2(0.5, 0.5)}>
				<uiscale Scale={contentScale} />
				<Stack width="100%" height="100%" gap="xs">
					<Stack width="100%" direction="horizontal" gap="xs" align="center">
						<Avatar src={avatarThumbnail(currentControls.userId)} fallback={currentControls.playerName} size={avatarSize} color="info" border={1} />
						<Stack width={textColumnWidth} gap="xs">
							<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
								<Text text={currentControls.playerName} size={compact ? "md" : "lg"} weight={700} color={themeRefs.text.primary} truncate="atend" width={compact ? 112 : 188} />
								<Text text={currentControls.team} size="xs" weight={700} color={themeRefs.info.dark} truncate="atend" width={compact ? 72 : 96} align="right" />
							</Stack>
							<Text text={currentControls.role} size="xs" color={themeRefs.text.secondary} truncate="atend" width="100%" />
						</Stack>
					</Stack>
					<MetricRow label="Health" value={currentControls.health} color="error" />
					<MetricRow label="Energy" value={currentControls.energy} color="info" />
				</Stack>
			</frame>
		</Box>
	);
}

function WorldPortalStoryCanvas({ controls: currentControls }: { readonly controls: WorldPortalStoryControls }): React.ReactElement {
	const storyPart = useStoryPart();
	const billboardSize = currentControls.billboardSizing === "world" ? UDim2.fromScale(4.2, 1.75) : UDim2.fromOffset(300, 126);
	const billboardSizingText = currentControls.billboardSizing === "world" ? "stud-scaled BillboardGui" : "pixel-offset BillboardGui";
	const billboardContentScale = useBillboardContentScale(storyPart, currentControls.kind === "billboard" && currentControls.billboardSizing === "world");

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="md" p="lg">
				<Stack width="100%" gap="md">
					<Text text="WorldPortal" size="lg" weight={700} color={themeRefs.text.primary} />
					<Text
						text="Render one Prism HUD composition from a world target. Billboard mode can use pixel offsets for constant screen size or scale values for true world/stud size; surface mode stays diegetic for terminals and in-world panels."
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
					<Box width="100%" bg={themeRefs.background.default} radius="md" p="md">
						<Stack width="100%" gap="xs">
							<Text text="Demo anchor: an anchored part near (0, 4, -12) in Workspace." size="sm" color={themeRefs.text.primary} wrap width="100%" />
							<Text text={`Rendering as ${currentControls.kind === "surface" ? "SurfaceGui under the Workspace part" : `${billboardSizingText} under the Workspace part`}.`} size="sm" color={themeRefs.text.secondary} wrap width="100%" />
						</Stack>
					</Box>
				</Stack>
			</Box>
			{storyPart !== undefined && currentControls.kind === "surface" ? (
				<WorldPortal kind="surface" adornee={storyPart} face={Enum.NormalId.Front} alwaysOnTop={currentControls.alwaysOnTop} canvasSize={new Vector2(500, 230)} pixelsPerStud={90}>
					<PlayerHudCard controls={currentControls} compact={false} />
				</WorldPortal>
			) : undefined}
			{storyPart !== undefined && currentControls.kind === "billboard" ? (
				<WorldPortal kind="billboard" adornee={storyPart} alwaysOnTop={currentControls.alwaysOnTop} studsOffset={new Vector3(0, currentControls.studsOffsetY, 0)} size={billboardSize} maxDistance={180}>
					<PlayerHudCard controls={currentControls} compact contentScale={currentControls.billboardSizing === "world" ? billboardContentScale : 1} />
				</WorldPortal>
			) : undefined}
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "WorldPortal",
		summary: "World-targeted portal that renders Prism HUD compositions into BillboardGui or SurfaceGui content, including pixel-sized and world-sized billboard examples.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<WorldPortalStoryCanvas controls={props.controls} />
			</StoryThemeProvider>
		);
	},
);

export = story;
