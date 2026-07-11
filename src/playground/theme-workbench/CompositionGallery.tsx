import React from "@rbxts/react";

import {
	Box,
	Button,
	Divider,
	Icon,
	Input,
	Menu,
	Progress,
	Select,
	Slider,
	Stack,
	Switch,
	Text,
	useBreakpoint,
	useNotifications,
	useResponsiveValue,
} from "@prism";
import type { MenuItem, SelectOption, StackDirection, ThemeSize } from "@prism";
import { theme as themeRefs, useTheme } from "@prism/theme";
import type { Breakpoint } from "@prism/theme";

const REGION_OPTIONS: readonly SelectOption[] = table.freeze([
	{ value: "automatic", label: "Automatic" },
	{ value: "americas", label: "Americas" },
	{ value: "europe", label: "Europe" },
	{ value: "asia-pacific", label: "Asia Pacific" },
]);

const COMMAND_ITEMS: readonly MenuItem[] = table.freeze([
	{ type: "label", label: "Current session" },
	{ value: "invite", label: "Invite squad", icon: "user-plus", rightSection: "I" },
	{ value: "loadout", label: "Open loadout", icon: "package", rightSection: "L" },
	{ type: "divider" },
	{ value: "leave", label: "Leave server", icon: "log-out", color: "error" },
]);

const BREAKPOINT_LABELS: Readonly<Record<Breakpoint, string>> = table.freeze({
	xs: "XS",
	sm: "SM",
	md: "MD",
	lg: "LG",
	xl: "XL",
});

function SettingsComposition({ controlSize }: { readonly controlSize: ThemeSize }): React.ReactElement {
	const [displayName, setDisplayName] = React.useState("SignalRook");
	const [voiceEnabled, setVoiceEnabled] = React.useState(true);
	const [volume, setVolume] = React.useState(68);
	const [region, setRegion] = React.useState("automatic");
	const [saved, setSaved] = React.useState("No pending changes");

	return (
		<Box
			width="100%"
			bg={themeRefs.background.surface}
			border={1}
			borderColor={themeRefs.border.subtle}
			radius="lg"
			p="lg"
		>
			<Stack width="100%" gap="md">
				<Stack width="100%" gap="xs">
					<Text text="Player settings" size="lg" weight={800} color={themeRefs.text.primary} />
					<Text
						text="A practical form composition for checking fields, states, spacing, and semantic surfaces together."
						size="sm"
						color={themeRefs.text.secondary}
						wrap
						width="100%"
					/>
				</Stack>
				<Divider />
				<Stack width="100%" gap="xs">
					<Text text="Display name" size="xs" weight={700} color={themeRefs.text.secondary} />
					<Input value={displayName} onChange={setDisplayName} fullWidth size={controlSize} maxLength={18} />
				</Stack>
				<Stack width="100%" gap="xs">
					<Text text="Match region" size="xs" weight={700} color={themeRefs.text.secondary} />
					<Select options={REGION_OPTIONS} value={region} onChange={setRegion} fullWidth size={controlSize} />
				</Stack>
				<Switch checked={voiceEnabled} onChange={setVoiceEnabled} label="Team voice chat" size={controlSize} />
				<Stack width="100%" gap="xs">
					<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center">
						<Text text="Interface volume" size="xs" weight={700} color={themeRefs.text.secondary} />
						<Text text={`${volume}%`} size="xs" color={themeRefs.text.primary} />
					</Stack>
					<Slider value={volume} onChange={setVolume} min={0} max={100} step={1} fullWidth size={controlSize} />
				</Stack>
				<Button
					label="Save preferences"
					fullWidth
					size={controlSize}
					onPress={() => setSaved("Preferences saved locally")}
				/>
				<Text text={saved} size="xs" color={themeRefs.text.secondary} wrap width="100%" />
			</Stack>
		</Box>
	);
}

function HudComposition(): React.ReactElement {
	const theme = useTheme();

	return (
		<Box
			width="100%"
			bg={themeRefs.background.surface}
			border={1}
			borderColor={themeRefs.border.subtle}
			radius="lg"
			p="md"
		>
			<Stack width="100%" gap="md">
				<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center" gap="sm">
					<Stack direction="horizontal" align="center" gap="sm">
						<Box width={38} height={38} bg={themeRefs.primary.light} radius="md">
							<Stack width="100%" height="100%" align="center" justify="center">
								<Icon name="radio" size={20} color={themeRefs.primary.dark} />
							</Stack>
						</Box>
						<Stack gap="xs">
							<Text text="Relay online" weight={800} color={themeRefs.text.primary} />
							<Text text="Squad latency 42 ms" size="xs" color={themeRefs.text.secondary} />
						</Stack>
					</Stack>
					<Box bg={theme.colors.success.main} radius="xl" px="sm" py="xs">
						<Text text="STABLE" size="xs" weight={800} color={theme.colors.success.contrast} />
					</Box>
				</Stack>
				<Progress value={72} label="Shield integrity" showValue fullWidth color="info" size="sm" />
				<Progress value={46} label="Core charge" showValue fullWidth color="warning" size="sm" variant="light" />
			</Stack>
		</Box>
	);
}

function CommandComposition({ controlSize }: { readonly controlSize: ThemeSize }): React.ReactElement {
	const notifications = useNotifications();
	const [lastCommand, setLastCommand] = React.useState("No command selected");

	const showPreviewNotification = () => {
		notifications.show({
			title: "Theme preview",
			message: "Notification surfaces use the current draft tokens.",
			color: "success",
			icon: "check-circle",
			duration: 4,
		});
	};

	return (
		<Box
			width="100%"
			bg={themeRefs.background.surface}
			border={1}
			borderColor={themeRefs.border.subtle}
			radius="lg"
			p="md"
		>
			<Stack width="100%" gap="sm">
				<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center" gap="sm" wrap>
					<Stack gap="xs">
						<Text text="Session actions" weight={800} color={themeRefs.text.primary} />
						<Text text={lastCommand} size="xs" color={themeRefs.text.secondary} />
					</Stack>
					<Menu items={COMMAND_ITEMS} panelWidth={230} onItemPress={(value) => setLastCommand(`Selected: ${value}`)}>
						<Box
							bg={themeRefs.action.hover}
							radius="md"
							border={1}
							borderColor={themeRefs.border.default}
							px="md"
							py="sm"
						>
							<Stack direction="horizontal" align="center" gap="sm">
								<Icon name="menu" size={18} color={themeRefs.text.primary} />
								<Text text="Open menu" size="sm" weight={700} color={themeRefs.text.primary} />
							</Stack>
						</Box>
					</Menu>
				</Stack>
				<Button
					label="Show themed notification"
					variant="light"
					color="success"
					size={controlSize}
					fullWidth
					onPress={showPreviewNotification}
				/>
			</Stack>
		</Box>
	);
}

function InteractionReview({ controlSize }: { readonly controlSize: ThemeSize }): React.ReactElement {
	return (
		<Box width="100%" bg={themeRefs.background.default} radius="lg" p="md">
			<Stack width="100%" gap="sm">
				<Text text="Interaction states" weight={800} color={themeRefs.text.primary} />
				<Stack width="100%" direction="horizontal" gap="sm" wrap>
					<Button label="Primary" size={controlSize} />
					<Button label="Outline" size={controlSize} variant="outline" />
					<Button label="Warning" size={controlSize} variant="light" color="warning" />
					<Button label="Disabled" size={controlSize} disabled />
				</Stack>
				<Input value="Read-only token sample" readOnly fullWidth size={controlSize} />
				<Switch label="Disabled setting" checked={false} disabled size={controlSize} />
			</Stack>
		</Box>
	);
}

export function ResponsiveCompositionGallery({ target }: { readonly target: GuiObject }): React.ReactElement {
	const theme = useTheme();
	const breakpoint = useBreakpoint({ target });
	const direction = useResponsiveValue<StackDirection>({ xs: "vertical", md: "horizontal" }, { target });
	const controlSize = useResponsiveValue<ThemeSize>({ xs: "sm", lg: "md" }, { target });
	const panelWidth = direction === "vertical" ? "100%" : "49%";
	const contentPadding = useResponsiveValue({ xs: theme.spacing.md, md: theme.spacing.lg }, { target });

	return (
		<Box width="100%" bg={themeRefs.background.default} p={contentPadding}>
			<Stack width="100%" gap="lg">
				<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center" gap="sm" wrap>
					<Stack gap="xs">
						<Text text="Composition preview" size="lg" weight={800} color={themeRefs.text.primary} />
						<Text
							text="Resize the host or choose a viewport preset to review the same hierarchy in context."
							size="sm"
							color={themeRefs.text.secondary}
							wrap
						/>
					</Stack>
					<Box bg={theme.colors.primary.main} radius="xl" px="sm" py="xs">
						<Text
							text={`${BREAKPOINT_LABELS[breakpoint]} | ${math.floor(target.AbsoluteSize.X)} px`}
							size="xs"
							weight={800}
							color={theme.colors.primary.contrast}
						/>
					</Box>
				</Stack>
				<Stack width="100%" direction={direction} align="start" justify="spaceBetween" gap="lg">
					<Box width={panelWidth}>
						<SettingsComposition controlSize={controlSize} />
					</Box>
					<Stack width={panelWidth} gap="md">
						<HudComposition />
						<CommandComposition controlSize={controlSize} />
						<InteractionReview controlSize={controlSize} />
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
}
