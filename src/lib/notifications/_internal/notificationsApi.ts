import type React from "@rbxts/react";

import type { SemanticIntent } from "@prism/theme";

import type { IconName } from "../../components/Icon";
import type {
	NotificationAction,
	NotificationContent,
	NotificationDuration,
	NotificationId,
	NotificationOptions,
	NotificationsApi,
	NotificationUpdate,
} from "../types";

import type { NotificationRecord, NotificationStore } from "./notificationStore";

export interface ResolvedNotificationData {
	readonly title: NotificationContent | undefined;
	readonly message: NotificationContent;
	readonly color: SemanticIntent;
	readonly icon: IconName | React.ReactElement | undefined;
	readonly action: NotificationAction | undefined;
	readonly withCloseButton: boolean;
}

function resolveDuration(duration: NotificationDuration): number | undefined {
	return duration === false ? undefined : duration;
}

function resolveIcon(icon: NotificationOptions["icon"]): ResolvedNotificationData["icon"] {
	return icon === false ? undefined : icon;
}

function resolveAction(action: NotificationOptions["action"]): ResolvedNotificationData["action"] {
	return action === false ? undefined : action;
}

function freezeData(data: ResolvedNotificationData): ResolvedNotificationData {
	return table.freeze(data);
}

function findRecord(
	store: NotificationStore<ResolvedNotificationData>,
	id: NotificationId,
): NotificationRecord<ResolvedNotificationData> | undefined {
	const snapshot = store.getSnapshot();
	for (const record of snapshot.visible) {
		if (record.id === id) {
			return record;
		}
	}
	for (const record of snapshot.queued) {
		if (record.id === id) {
			return record;
		}
	}

	return undefined;
}

export function createNotificationsApi(
	store: NotificationStore<ResolvedNotificationData>,
	getDefaultDuration: () => NotificationDuration,
): NotificationsApi {
	function show(options: NotificationOptions): NotificationId {
		const duration = options.duration ?? getDefaultDuration();
		return store.show({
			id: options.id,
			data: freezeData({
				title: options.title,
				message: options.message,
				color: options.color ?? "info",
				icon: resolveIcon(options.icon),
				action: resolveAction(options.action),
				withCloseButton: options.withCloseButton ?? true,
			}),
			duration: resolveDuration(duration),
		});
	}

	function update(id: NotificationId, patch: NotificationUpdate): boolean {
		const record = findRecord(store, id);
		if (record === undefined || record.phase === "closing") {
			return false;
		}

		return store.update(id, {
			data: freezeData({
				title: patch.title === undefined ? record.data.title : patch.title,
				message: patch.message === undefined ? record.data.message : patch.message,
				color: patch.color ?? record.data.color,
				icon: patch.icon === undefined ? record.data.icon : resolveIcon(patch.icon),
				action: patch.action === undefined ? record.data.action : resolveAction(patch.action),
				withCloseButton: patch.withCloseButton ?? record.data.withCloseButton,
			}),
			duration: patch.duration === undefined ? record.duration : resolveDuration(patch.duration),
		});
	}

	function dismiss(id: NotificationId): boolean {
		return store.dismiss(id, "programmatic");
	}

	function clear(): void {
		store.clear();
	}

	return table.freeze({ show, update, dismiss, clear });
}
