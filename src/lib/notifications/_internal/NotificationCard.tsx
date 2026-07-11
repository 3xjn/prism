import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { theme as themeRefs, useTheme } from "@prism/theme";

import { Box } from "../../components/Box";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { Stack } from "../../components/Stack";
import { Text } from "../../components/Text";
import { renderElevationShadow } from "../../components/_shared/elevation";
import { incrementZIndex } from "../../components/_shared/overlayLayerPolicy";
import { usePresence } from "../../components/_shared/usePresence";
import type { NotificationContent } from "../types";

import type { ResolvedNotificationData } from "./notificationsApi";
import type { NotificationRecord, NotificationStore } from "./notificationStore";
import { useReducedMotion } from "./useReducedMotion";

const ENTER_DURATION = 0.16;
const EXIT_DURATION = 0.12;
const HIDDEN_SCALE = 0.98;

type PauseSource = "pointer" | "action-selection" | "close-selection";

export interface NotificationCardProps {
	readonly record: NotificationRecord<ResolvedNotificationData>;
	readonly store: NotificationStore<ResolvedNotificationData>;
	readonly layoutOrder: number;
	readonly zIndex: number;
}

function renderContent(
	content: NotificationContent | undefined,
	options: {
		readonly title: boolean;
		readonly zIndex: number;
	},
): React.ReactElement | undefined {
	if (content === undefined || content === false || content === true) {
		return undefined;
	}

	if (typeIs(content, "string") || typeIs(content, "number")) {
		return (
			<Text
				key={options.title ? "title" : "message"}
				text={content}
				size={options.title ? "md" : "sm"}
				weight={options.title ? 700 : 400}
				color={options.title ? themeRefs.text.primary : themeRefs.text.secondary}
				wrap
				width="100%"
				zIndex={options.zIndex}
			/>
		);
	}

	return (
		<frame
			key={options.title ? "rich-title" : "rich-message"}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Active={false}
			Selectable={false}
			ZIndex={options.zIndex}
		>
			{content}
		</frame>
	);
}

function renderNotificationIcon(data: ResolvedNotificationData, zIndex: number): React.ReactElement | undefined {
	if (data.icon === undefined) {
		return undefined;
	}

	if (typeIs(data.icon, "string")) {
		return <Icon key="icon" name={data.icon} size="md" color={themeRefs[data.color].main} zIndex={zIndex} />;
	}

	return (
		<frame
			key="custom-icon"
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={UDim2.fromOffset(24, 24)}
			Active={false}
			Selectable={false}
			ZIndex={zIndex}
		>
			{data.icon}
		</frame>
	);
}

export function NotificationCard({
	record,
	store,
	layoutOrder,
	zIndex,
}: NotificationCardProps): React.ReactElement | undefined {
	const theme = useTheme();
	const reducedMotion = useReducedMotion();
	const open = record.phase === "open";
	const exitDuration = reducedMotion ? 0 : EXIT_DURATION;
	const presence = usePresence(open, { exitDuration });
	const pauseSourcesRef = React.useRef(new Set<PauseSource>());
	const interactionLockedRef = React.useRef(false);
	const animated = useMotion({
		values: {
			transparency: presence.present ? 0 : 1,
			scale: presence.present || reducedMotion ? 1 : HIDDEN_SCALE,
		},
		transition: {
			duration: reducedMotion ? 0 : open ? ENTER_DURATION : EXIT_DURATION,
			easing: open ? "out" : "in",
		},
	});
	const data = record.data;
	const contentZIndex = incrementZIndex(zIndex, 1) as number;
	const controlsZIndex = incrementZIndex(contentZIndex, 1) as number;

	React.useEffect(() => {
		if (record.phase === "closing" && !presence.shouldRender) {
			store.finishClose(record.id);
		}
	}, [presence.shouldRender, record.id, record.phase, store]);

	React.useEffect(() => {
		if (open && !record.paused && pauseSourcesRef.current.size() > 0) {
			store.pause(record.id);
		}
	}, [open, record.duration, record.id, record.paused, store]);

	if (!presence.shouldRender) {
		return undefined;
	}

	const pause = (source: PauseSource) => {
		const pauseSources = pauseSourcesRef.current;
		const wasPaused = pauseSources.size() > 0;
		pauseSources.add(source);
		if (!wasPaused) {
			store.pause(record.id);
		}
	};
	const resume = (source: PauseSource) => {
		const pauseSources = pauseSourcesRef.current;
		pauseSources.delete(source);
		if (pauseSources.size() === 0) {
			store.resume(record.id);
		}
	};
	const dismiss = () => {
		if (interactionLockedRef.current) {
			return;
		}

		interactionLockedRef.current = true;
		store.dismiss(record.id, "user");
	};
	const onActionPress = () => {
		if (interactionLockedRef.current) {
			return;
		}

		try {
			data.action?.onPress();
		} finally {
			if (data.action?.closeOnPress !== false) {
				dismiss();
			}
		}
	};

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			LayoutOrder={layoutOrder}
			Active={false}
			Selectable={false}
			ZIndex={zIndex}
		>
			<canvasgroup
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				GroupTransparency={animated.transparency}
				Active={open}
				Selectable={false}
				ZIndex={zIndex}
				Event={{ MouseEnter: () => pause("pointer"), MouseLeave: () => resume("pointer") }}
			>
				<uiscale Scale={animated.scale} />
				<Box
					width="100%"
					bg={themeRefs.background.surface}
					radius="md"
					p="md"
					pr={data.withCloseButton ? 60 : "md"}
					stroke={{ color: theme.colors[data.color].main, thickness: 1, transparency: 0.3 }}
					zIndex={zIndex}
				>
					{renderElevationShadow({
						shadow: theme.shadows.sm,
						radius: new UDim(0, theme.radius.md),
						zIndex: zIndex - 1,
					})}
					<Stack width="100%" gap="sm" zIndex={contentZIndex}>
						{renderNotificationIcon(data, contentZIndex)}
						{renderContent(data.title, { title: true, zIndex: contentZIndex })}
						{renderContent(data.message, { title: false, zIndex: contentZIndex })}
						{data.action !== undefined ? (
							<Button
								key="action"
								label={data.action.label}
								size="sm"
								variant="light"
								color={data.color}
								disabled={!open}
								onPress={onActionPress}
								zIndex={controlsZIndex}
								Event={{
									SelectionGained: () => pause("action-selection"),
									SelectionLost: () => resume("action-selection"),
								}}
							/>
						) : undefined}
					</Stack>
					{data.withCloseButton ? (
						<Button
							key="close"
							size="xs"
							variant="subtle"
							color="secondary"
							width={44}
							height={44}
							position={new UDim2(1, -8, 0, 8)}
							anchor={new Vector2(1, 0)}
							disabled={!open}
							onPress={dismiss}
							zIndex={controlsZIndex}
							Event={{
								SelectionGained: () => pause("close-selection"),
								SelectionLost: () => resume("close-selection"),
							}}
						>
							<Icon name="x" size="sm" color={themeRefs.text.secondary} zIndex={controlsZIndex} />
						</Button>
					) : undefined}
				</Box>
			</canvasgroup>
		</frame>
	);
}
