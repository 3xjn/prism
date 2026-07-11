import React from "@rbxts/react";

import { DEFAULT_NOTIFICATION_OVERLAY_Z_INDEX } from "../components/_shared/overlayLayerPolicy";

import { NotificationStack } from "./_internal/NotificationStack";
import { NotificationsApiContext, NotificationSnapshotContext } from "./_internal/notificationContext";
import { createNotificationsApi, type ResolvedNotificationData } from "./_internal/notificationsApi";
import { createNotificationStore } from "./_internal/notificationStore";
import type { NotificationDuration, NotificationsApi, NotificationsProviderProps } from "./types";

const DEFAULT_DURATION: NotificationDuration = 5;
const DEFAULT_MAX_VISIBLE = 3;

export function NotificationsProvider({
	children,
	defaultDuration = DEFAULT_DURATION,
	maxVisible = DEFAULT_MAX_VISIBLE,
	portal = true,
	position = "top-right",
	zIndex = DEFAULT_NOTIFICATION_OVERLAY_Z_INDEX,
}: NotificationsProviderProps): React.ReactElement {
	const defaultDurationRef = React.useRef<NotificationDuration>(defaultDuration);
	defaultDurationRef.current = defaultDuration;

	const [store] = React.useState(() => createNotificationStore<ResolvedNotificationData>({ maxVisible }));
	const [api] = React.useState(() => createNotificationsApi(store, () => defaultDurationRef.current));
	const [snapshot, setSnapshot] = React.useState(() => store.getSnapshot());

	React.useEffect(() => {
		const unsubscribe = store.subscribe(setSnapshot);
		setSnapshot(store.getSnapshot());

		return () => {
			unsubscribe();
			store.destroy();
		};
	}, [store]);

	React.useEffect(() => {
		store.setMaxVisible(maxVisible);
	}, [maxVisible, store]);

	const snapshotContextValue = React.useMemo(() => table.freeze({ snapshot, store }), [snapshot, store]);

	return (
		<NotificationsApiContext.Provider value={api}>
			<NotificationSnapshotContext.Provider value={snapshotContextValue}>
				{children}
				<NotificationStack portal={portal} position={position} zIndex={zIndex} />
			</NotificationSnapshotContext.Provider>
		</NotificationsApiContext.Provider>
	);
}

export function useNotifications(): NotificationsApi {
	const api = React.useContext(NotificationsApiContext);
	if (api === undefined) {
		error("useNotifications must be used within a NotificationsProvider.");
	}

	return api;
}
