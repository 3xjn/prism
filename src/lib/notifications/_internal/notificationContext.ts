import React from "@rbxts/react";

import type { NotificationsApi } from "../types";

import type { ResolvedNotificationData } from "./notificationsApi";
import type { NotificationSnapshot, NotificationStore } from "./notificationStore";

interface NotificationSnapshotContextValue {
	readonly snapshot: NotificationSnapshot<ResolvedNotificationData>;
	readonly store: NotificationStore<ResolvedNotificationData>;
}

export const NotificationsApiContext = React.createContext<NotificationsApi | undefined>(undefined);

export const NotificationSnapshotContext = React.createContext<NotificationSnapshotContextValue | undefined>(undefined);
