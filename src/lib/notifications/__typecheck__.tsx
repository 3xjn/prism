import React from "@rbxts/react";

import { NotificationsProvider, useNotifications } from "@prism";
import type {
	NotificationAction,
	NotificationId,
	NotificationOptions,
	NotificationPosition,
	NotificationsApi,
	NotificationsProviderProps,
	NotificationUpdate,
} from "@prism";
import type {
	AssertFalse,
	AssertTrue,
	HasProp,
	IsAssignable,
	IsOptional,
	IsRequired,
} from "@prism/testing/typeContracts";

const notificationAction: NotificationAction = {
	label: "Undo",
	onPress: () => undefined,
	closeOnPress: true,
};

const validNotificationOptions: NotificationOptions[] = [
	{ message: "Settings saved" },
	{ id: "party-ready", message: 3, title: "Party ready", color: "success", icon: "bell" },
	{
		message: <textlabel BackgroundTransparency={1} Text="Rich message" />,
		title: <textlabel BackgroundTransparency={1} Text="Rich title" />,
		icon: <imagelabel BackgroundTransparency={1} Image="rbxassetid://0" />,
		action: notificationAction,
		duration: false,
		withCloseButton: false,
	},
	{ message: "Numeric action", action: { label: 5, onPress: () => undefined } },
	{ message: "Explicitly clear optional presentation", icon: false, action: false },
];

const validNotificationUpdates: NotificationUpdate[] = [
	{},
	{ message: "Updated" },
	{ color: "warning", duration: 2.5 },
	{ icon: false, action: false, duration: false, withCloseButton: false },
];

const validNotificationPositions: NotificationPosition[] = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
];

const validProviderExamples = [
	<NotificationsProvider key="defaults" />,
	<NotificationsProvider key="configured" defaultDuration={8} maxVisible={5} position="bottom-center" zIndex={140}>
		<frame BackgroundTransparency={1} />
	</NotificationsProvider>,
	<NotificationsProvider key="persistent" defaultDuration={false} maxVisible={1} />,
];

function NotificationsConsumer(): React.ReactElement {
	const notifications: NotificationsApi = useNotifications();
	const id: NotificationId = notifications.show({ message: "Queued" });
	const updated: boolean = notifications.update(id, { title: "Updated" });
	const dismissed: boolean = notifications.dismiss(id);
	notifications.clear();

	return <frame LayoutOrder={updated && dismissed ? 1 : 0} />;
}

type MessageIsRequired = AssertTrue<IsRequired<NotificationOptions, "message">>;
type UpdateMessageIsOptional = AssertTrue<IsOptional<NotificationUpdate, "message">>;
type ProviderChildrenIsOptional = AssertTrue<IsOptional<NotificationsProviderProps, "children">>;
type MissingMessageAllowed = AssertFalse<IsAssignable<{ readonly title: string }, NotificationOptions>>;
type InvalidColorAllowed = AssertFalse<
	IsAssignable<{ readonly message: string; readonly color: "blue" }, NotificationOptions>
>;
type InvalidDurationAllowed = AssertFalse<
	IsAssignable<{ readonly message: string; readonly duration: "forever" }, NotificationOptions>
>;
type BooleanDurationAllowed = AssertFalse<
	IsAssignable<{ readonly message: string; readonly duration: true }, NotificationOptions>
>;
type InvalidProviderDurationAllowed = AssertFalse<
	IsAssignable<{ readonly defaultDuration: true }, NotificationsProviderProps>
>;
type ProviderPositionAllowed = AssertTrue<
	IsAssignable<{ readonly position: "bottom-right"; readonly zIndex: 180 }, NotificationsProviderProps>
>;
type InvalidNotificationPositionAllowed = AssertFalse<IsAssignable<"center", NotificationPosition>>;
type InvalidProviderPositionAllowed = AssertFalse<
	IsAssignable<{ readonly position: "center" }, NotificationsProviderProps>
>;
type InvalidProviderZIndexAllowed = AssertFalse<IsAssignable<{ readonly zIndex: "front" }, NotificationsProviderProps>>;
type UpdateHasNoId = AssertFalse<HasProp<NotificationUpdate, "id">>;
type ApiHasNoPause = AssertFalse<HasProp<NotificationsApi, "pause">>;
type ApiHasNoSnapshot = AssertFalse<HasProp<NotificationsApi, "getSnapshot">>;
type ShowReturnsId = AssertTrue<IsAssignable<ReturnType<NotificationsApi["show"]>, NotificationId>>;
type UpdateReturnsBoolean = AssertTrue<IsAssignable<ReturnType<NotificationsApi["update"]>, boolean>>;
type DismissReturnsBoolean = AssertTrue<IsAssignable<ReturnType<NotificationsApi["dismiss"]>, boolean>>;
type ClearReturnsVoid = AssertTrue<IsAssignable<ReturnType<NotificationsApi["clear"]>, void>>;

const acceptsNotificationOptions: NotificationOptions[] = validNotificationOptions;
const acceptsNotificationUpdates: NotificationUpdate[] = validNotificationUpdates;
const acceptsProviderExamples: React.ReactNode = validProviderExamples;
const messageIsRequired: MessageIsRequired = true;
const updateMessageIsOptional: UpdateMessageIsOptional = true;
const providerChildrenIsOptional: ProviderChildrenIsOptional = true;
const missingMessageAllowed: MissingMessageAllowed = false;
const invalidColorAllowed: InvalidColorAllowed = false;
const invalidDurationAllowed: InvalidDurationAllowed = false;
const booleanDurationAllowed: BooleanDurationAllowed = false;
const invalidProviderDurationAllowed: InvalidProviderDurationAllowed = false;
const providerPositionAllowed: ProviderPositionAllowed = true;
const invalidNotificationPositionAllowed: InvalidNotificationPositionAllowed = false;
const invalidProviderPositionAllowed: InvalidProviderPositionAllowed = false;
const invalidProviderZIndexAllowed: InvalidProviderZIndexAllowed = false;
const updateHasNoId: UpdateHasNoId = false;
const apiHasNoPause: ApiHasNoPause = false;
const apiHasNoSnapshot: ApiHasNoSnapshot = false;
const showReturnsId: ShowReturnsId = true;
const updateReturnsBoolean: UpdateReturnsBoolean = true;
const dismissReturnsBoolean: DismissReturnsBoolean = true;
const clearReturnsVoid: ClearReturnsVoid = true;

export {
	acceptsNotificationOptions,
	validNotificationPositions,
	acceptsNotificationUpdates,
	acceptsProviderExamples,
	apiHasNoPause,
	apiHasNoSnapshot,
	booleanDurationAllowed,
	clearReturnsVoid,
	dismissReturnsBoolean,
	invalidColorAllowed,
	invalidDurationAllowed,
	invalidProviderDurationAllowed,
	invalidNotificationPositionAllowed,
	invalidProviderPositionAllowed,
	invalidProviderZIndexAllowed,
	messageIsRequired,
	missingMessageAllowed,
	notificationAction,
	NotificationsConsumer,
	providerChildrenIsOptional,
	providerPositionAllowed,
	showReturnsId,
	updateHasNoId,
	updateMessageIsOptional,
	updateReturnsBoolean,
};
