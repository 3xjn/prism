import type React from "@rbxts/react";

import type { SemanticIntent } from "@prism/theme";

import type { IconName } from "../components/Icon";

export type NotificationId = string;

export type NotificationDuration = number | false;

export type NotificationContent = React.ReactNode | string | number;

export type NotificationPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";

export interface NotificationAction {
	readonly label: string | number;
	readonly onPress: () => void;
	readonly closeOnPress?: boolean;
}

export interface NotificationOptions {
	readonly id?: NotificationId;
	readonly title?: NotificationContent;
	readonly message: NotificationContent;
	readonly color?: SemanticIntent;
	readonly icon?: IconName | React.ReactElement | false;
	readonly action?: NotificationAction | false;
	readonly withCloseButton?: boolean;
	readonly duration?: NotificationDuration;
}

export interface NotificationUpdate {
	readonly title?: NotificationContent;
	readonly message?: NotificationContent;
	readonly color?: SemanticIntent;
	readonly icon?: IconName | React.ReactElement | false;
	readonly action?: NotificationAction | false;
	readonly withCloseButton?: boolean;
	readonly duration?: NotificationDuration;
}

export interface NotificationsApi {
	readonly show: (options: NotificationOptions) => NotificationId;
	readonly update: (id: NotificationId, update: NotificationUpdate) => boolean;
	readonly dismiss: (id: NotificationId) => boolean;
	readonly clear: () => void;
}

export interface NotificationsProviderProps {
	readonly children?: React.ReactNode;
	readonly defaultDuration?: NotificationDuration;
	readonly maxVisible?: number;
	readonly position?: NotificationPosition;
	readonly zIndex?: number;
}
