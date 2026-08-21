import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Box } from "../Box";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { Text } from "../Text";

import { Window } from "./Window";
import type { WindowProps } from "./types";

const windowRef = React.createRef<Frame>();
type ExportedWindowProps = React.ComponentProps<typeof Window>;

const validWindowProps: WindowProps[] = [
	{ title: "Inspector" },
	{ title: 12, width: 720, height: 480, minWidth: 400, minHeight: 280 },
	{ collapsed: true, onCollapsedChange: () => undefined },
	{ defaultCollapsed: false, maximized: false, onMaximizedChange: () => undefined },
	{ defaultMaximized: true, onClose: () => undefined },
	{ leading: <Icon key="mark" name="search" size="sm" />, trailing: <Box key="extra" width={12} height={12} /> },
	{ rail: <Box key="rail" width="100%" height="100%" />, children: <Text key="body" text="Body" /> },
	{ width: "50%", height: new UDim(0, 360), position: { x: 24, y: 48 }, zIndex: 12 },
	{ bg: themeRefs.background.surface, p: "md", clip: true },
	{
		slotProps: {
			overlay: { ZIndex: 8 },
			root: { Rotation: 0 },
			titleBar: { BackgroundTransparency: 1 },
			title: { Text: "Override" },
			collapseControl: { AutoButtonColor: true },
			resizeHandle: { Size: UDim2.fromOffset(18, 18) },
		},
	},
	{ ref: windowRef },
];

const validExportedWindowProps: ExportedWindowProps[] = [
	{ title: "Inspector" },
	{ title: "Tools", onClose: () => undefined, collapsed: false },
	{ width: 560, height: 400, rail: <Box key="exported-rail" /> },
];

const validWindowExamples = [
	<Window key="default" title="Inspector" />,
	<Window key="sized" title="Sized" width={720} height={480} minWidth={400} minHeight={280} />,
	<Window key="collapsed" title="Collapsed" defaultCollapsed />,
	<Window key="maximized" title="Maximized" defaultMaximized />,
	<Window key="close" title="Closeable" onClose={() => undefined} />,
	<Window
		key="slots"
		title="Slots"
		leading={<Icon key="leading" name="box" size="sm" />}
		rail={<Stack key="rail" width="100%" p="sm" />}
		onClose={() => undefined}
		slotProps={{
			overlay: { ZIndex: 11 },
			root: { Rotation: 0 },
			title: { Text: "Override" },
			content: { BackgroundTransparency: 1 },
			resizeHandle: { Visible: true },
		}}
	>
		<Box width="100%" height="100%" p="md">
			<Text text="Preview body" width="100%" wrap />
		</Box>
	</Window>,
	<Window key="ref" title="Ref" ref={windowRef} />,
];

const acceptsWindowChildren: React.ReactNode = validWindowExamples;
const acceptsWindowProps: WindowProps[] = validWindowProps;
const acceptsExportedWindowProps: ExportedWindowProps[] = validExportedWindowProps;

type WindowTitleOptional = undefined extends WindowProps["title"] ? true : false;
type WindowCloseOptional = undefined extends WindowProps["onClose"] ? true : false;
type InvalidWindowCollapsedAllowed = "yes" extends NonNullable<WindowProps["collapsed"]> ? true : false;
type ExportedWindowTitleAllowed = string extends NonNullable<ExportedWindowProps["title"]> ? true : false;

const windowTitleOptional: WindowTitleOptional = true;
const windowCloseOptional: WindowCloseOptional = true;
const invalidWindowCollapsed: InvalidWindowCollapsedAllowed = false;
const exportedWindowTitle: ExportedWindowTitleAllowed = true;

export {
	acceptsExportedWindowProps,
	acceptsWindowChildren,
	acceptsWindowProps,
	exportedWindowTitle,
	invalidWindowCollapsed,
	windowCloseOptional,
	windowTitleOptional,
};
