import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { Box, Button, Divider, NotificationsProvider, Stack, Text, useNotifications } from "@prism";
import type { NotificationId, NotificationPosition } from "@prism";
import { theme as themeRefs, useTheme } from "@prism/theme";
import { CreateReactStory, EnumList, Number } from "@rbxts/ui-labs";
import type { InferControls } from "@rbxts/ui-labs";

import { StoryCanvas, StoryThemeProvider, storyThemeControl } from "./_shared";

const GuiService = game.GetService("GuiService");

const BURST_MESSAGES = [
	"Party member joined",
	"Daily contract advanced",
	"Inventory synced",
	"Friend came online",
	"Match found",
	"Voice chat connected",
];

const controls = {
	theme: storyThemeControl,
	position: EnumList(
		{
			topLeft: "top-left",
			topCenter: "top-center",
			topRight: "top-right",
			bottomLeft: "bottom-left",
			bottomCenter: "bottom-center",
			bottomRight: "bottom-right",
		},
		"top-right",
	),
	maxVisible: Number(3, 1, 6, 1),
};

type NotificationsStoryControls = InferControls<typeof controls>;

function useNativeReducedMotionPreference(): boolean {
	const [reducedMotion, setReducedMotion] = React.useState(GuiService.ReducedMotionEnabled);

	React.useEffect(() => {
		const update = () => {
			setReducedMotion(GuiService.ReducedMotionEnabled);
		};
		const connection = GuiService.GetPropertyChangedSignal("ReducedMotionEnabled").Connect(update);
		update();

		return () => {
			connection.Disconnect();
		};
	}, []);

	return reducedMotion;
}

function NotificationActions(): React.ReactElement {
	const notifications = useNotifications();
	const lastNotificationId = React.useRef<NotificationId>();
	const [activity, setActivity] = React.useState("Choose a scenario to populate the live stack.");
	const reducedMotion = useNativeReducedMotionPreference();
	const theme = useTheme();

	const remember = (id: NotificationId, message: string) => {
		lastNotificationId.current = id;
		setActivity(message);
	};

	const showSuccess = () => {
		const id = notifications.show({
			title: "Loadout saved",
			message: "Recon kit is ready for the next round.",
			color: "success",
			icon: "check-circle",
			duration: 4,
		});
		remember(id, "Success notification shown for four seconds.");
	};

	const showError = () => {
		const id = notifications.show({
			title: "Matchmaking failed",
			message: "The region did not respond. Your party is still intact.",
			color: "error",
			icon: "alert-triangle",
			duration: 7,
		});
		remember(id, "Error notification shown with a manual close affordance.");
	};

	const showClosingAction = () => {
		const id = notifications.show({
			title: "New loadout available",
			message: "Equip the support preset before matchmaking starts.",
			color: "info",
			icon: "package-check",
			action: {
				label: "Equip",
				closeOnPress: true,
				onPress: () => setActivity("Equip action ran and closed its notification."),
			},
			duration: 10,
		});
		remember(id, "Action notification shown. Equip uses closeOnPress=true.");
	};

	const showPersistentAction = () => {
		const id = notifications.show({
			title: "Connection quality",
			message: "Run the check repeatedly without dismissing this notification.",
			color: "warning",
			icon: "wifi",
			action: {
				label: "Check again",
				closeOnPress: false,
				onPress: () => setActivity("Connection check ran; closeOnPress=false kept the notification open."),
			},
			duration: false,
		});
		remember(id, "Persistent action shown. Check again intentionally stays open.");
	};

	const showUpdateFlow = () => {
		const id = notifications.show({
			title: "Publishing build",
			message: "Uploading shared assets...",
			color: "info",
			icon: "refresh-cw",
			withCloseButton: false,
			duration: false,
		});
		remember(id, "Publish started; the same notification will update in a moment.");

		task.delay(1.25, () => {
			if (
				notifications.update(id, {
					title: "Publish complete",
					message: "Version 42 is available to the team.",
					color: "success",
					icon: "check-circle",
					withCloseButton: true,
					duration: 4,
				})
			) {
				setActivity("Publish notification updated in place and now expires automatically.");
			}
		});
	};

	const showPersistent = () => {
		const id = notifications.show({
			title: "Server restart scheduled",
			message: "This stays visible until it is dismissed or cleared.",
			color: "warning",
			icon: "clock",
			duration: false,
		});
		remember(id, "Persistent notification shown with duration=false.");
	};

	const showBurst = () => {
		let finalId: NotificationId | undefined;
		for (let index = 0; index < BURST_MESSAGES.size(); index += 1) {
			finalId = notifications.show({
				title: `Activity ${index + 1}`,
				message: BURST_MESSAGES[index] ?? "New activity",
				color: index === BURST_MESSAGES.size() - 1 ? "success" : "info",
				duration: 6,
			});
		}
		if (finalId !== undefined) {
			remember(finalId, `Burst queued ${BURST_MESSAGES.size()} items; maxVisible controls the live stack.`);
		}
	};

	const dismissLatest = () => {
		const id = lastNotificationId.current;
		if (id === undefined) {
			setActivity("Nothing has been shown yet.");
			return;
		}

		setActivity(
			notifications.dismiss(id)
				? "The latest notification is leaving the stack."
				: "The latest notification already left or is closing.",
		);
	};

	const clearAll = () => {
		notifications.clear();
		setActivity("All queued notifications were removed and visible notifications are closing.");
	};

	return (
		<StoryCanvas>
			<Box width="100%" bg={themeRefs.background.surface} radius="lg" p="xl">
				<Stack width="100%" gap="lg">
					<Stack width="100%" gap="xs">
						<Text text="Notifications" size="xl" weight={700} color={themeRefs.text.primary} />
						<Text
							text="A provider-local feedback stack for game actions, background work, and recoverable errors. Use the story controls to move it between all six screen placements."
							color={themeRefs.text.secondary}
							wrap
							width="100%"
						/>
					</Stack>

					<Box width="100%" bg={theme.colors.action.hover} radius="md" p="md">
						<Stack width="100%" gap="xs">
							<Text
								text={`Native ReducedMotionEnabled: ${reducedMotion ? "on" : "off"}`}
								size="sm"
								weight={700}
								color={reducedMotion ? theme.colors.warning.main : theme.colors.success.main}
							/>
							<Text
								text="Safe bounds come from the nearest host ScreenGui.ScreenInsets. Prism adds theme edge spacing inside those bounds, so the host should own the inset policy."
								size="sm"
								color={themeRefs.text.secondary}
								wrap
								width="100%"
							/>
						</Stack>
					</Box>

					<Divider />

					<Stack width="100%" gap="sm">
						<Text text="Feedback states" size="md" weight={700} color={themeRefs.text.primary} />
						<Stack direction="horizontal" wrap gap="sm" width="100%">
							<Button label="Success" color="success" onPress={showSuccess} />
							<Button label="Error" color="error" variant="light" onPress={showError} />
							<Button label="Persistent" color="warning" variant="light" onPress={showPersistent} />
							<Button label="Burst queue" color="info" variant="outline" onPress={showBurst} />
						</Stack>
					</Stack>

					<Stack width="100%" gap="sm">
						<Text text="Actions and lifecycle" size="md" weight={700} color={themeRefs.text.primary} />
						<Stack direction="horizontal" wrap gap="sm" width="100%">
							<Button label="Action: closes" onPress={showClosingAction} />
							<Button label="Action: stays" color="secondary" variant="light" onPress={showPersistentAction} />
							<Button label="Update in place" color="info" variant="light" onPress={showUpdateFlow} />
							<Button label="Dismiss latest" variant="outline" onPress={dismissLatest} />
							<Button label="Clear all" color="error" variant="subtle" onPress={clearAll} />
						</Stack>
					</Stack>

					<Box width="100%" bg={themeRefs.background.default} radius="md" p="md">
						<Text text={activity} size="sm" color={themeRefs.text.secondary} wrap width="100%" />
					</Box>
				</Stack>
			</Box>
		</StoryCanvas>
	);
}

const story = CreateReactStory(
	{
		name: "Notifications",
		summary:
			"Provider-local screen feedback with six placements, queueing, updates, actions, persistence, native reduced motion, and safe-area-aware layout.",
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props) => {
		return (
			<StoryThemeProvider mode={props.controls.theme}>
				<NotificationsProvider
					position={props.controls.position as NotificationPosition}
					maxVisible={props.controls.maxVisible}
				>
					<NotificationActions />
				</NotificationsProvider>
			</StoryThemeProvider>
		);
	},
);

export = story;
