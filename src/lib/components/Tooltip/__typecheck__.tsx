import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Button } from "../Button";
import { Box } from "../Box";

import { Tooltip } from "./Tooltip";
import type { TooltipProps } from "./types";

const tooltipRef = React.createRef<Frame>();
type ExportedTooltipProps = React.ComponentProps<typeof Tooltip>;

const infoTarget = <Box width={140} height={44} bg={themeRefs.background.surface} radius="md" border={1} borderColor={themeRefs.border.default} />;
const buttonChild = <Button label="Action with info" variant="outline" />;

const validTooltipProps: TooltipProps[] = [
	{ content: "System status", children: infoTarget },
	{ content: <Box width={220} height={120} bg={themeRefs.background.surface} radius="md" />, children: infoTarget },
	{ label: "Queued", children: <Box width={96} height={32} bg={themeRefs.background.surface} radius="sm" /> },
	{ content: 42, children: <Box width={42} height={24} /> },
	{ content: "Disabled tooltip", disabled: true, children: <Box width={120} height={32} /> },
	{ content: "Pinned tooltip", opened: true, children: <Box width={120} height={32} /> },
	{ content: "Offset tooltip", gap: 12, children: <Box width={120} height={32} /> },
	{ content: "Custom tail", tailImage: "rbxassetid://105854070513330", children: <Button label="Tail" /> },
	{
		content: "Slot overrides",
		slotProps: {
			root: { BackgroundTransparency: 1 },
			overlay: { ZIndex: 12 },
			bubble: { BackgroundTransparency: 0.02 },
			bubbleStroke: { Thickness: 2 },
			label: { TextColor3: Color3.fromRGB(41, 47, 62) },
			tail: { Image: "rbxassetid://105854070513330" },
			tailBorder: { ImageTransparency: 0.1 },
		},
		children: infoTarget,
	},
	{ content: "Ref tooltip", ref: tooltipRef, children: infoTarget },
];

const validExportedTooltipProps: ExportedTooltipProps[] = [
	{ content: "Basic tooltip", children: infoTarget },
	{ content: <Box width={180} height={80} />, children: infoTarget },
	{ label: "Open tooltip", opened: true, children: <Box width={120} height={32} /> },
	{ content: "Disabled tooltip", disabled: true, children: <Box width={120} height={32} /> },
];

const validTooltipExamples = [
	<Tooltip key="basic" content="Status bubble">{infoTarget}</Tooltip>,
	<Tooltip key="rich" content={<Box width={180} height={80} bg={themeRefs.background.surface} radius="md" />}>{infoTarget}</Tooltip>,
	<Tooltip key="number" content={7}><Box width={24} height={24} /></Tooltip>,
	<Tooltip key="opened" content="Pinned" opened><Box width={120} height={32} /></Tooltip>,
	<Tooltip
		key="slots"
		content="Slot tooltip"
		slotProps={{
			overlay: { ZIndex: 8 },
			bubble: { BackgroundTransparency: 0.04 },
			label: { Text: "Override" },
			tailBorder: { Image: "rbxassetid://10983946430" },
		}}
	>
		{infoTarget}
	</Tooltip>,
	<Tooltip key="button-child" content="Action details">{buttonChild}</Tooltip>,
	<Tooltip key="ref" content="Ref tooltip" ref={tooltipRef}>{infoTarget}</Tooltip>,
];

const acceptsTooltipChildren: React.ReactNode = validTooltipExamples;
const acceptsTooltipProps: TooltipProps[] = validTooltipProps;
const acceptsExportedTooltipProps: ExportedTooltipProps[] = validExportedTooltipProps;

type TooltipHasChildrenProp = "children" extends keyof TooltipProps ? true : false;
type InvalidTooltipPlacementAllowed = "bottom" extends NonNullable<TooltipProps["placement"]> ? true : false;
type InvalidTooltipContentAllowed = boolean extends NonNullable<TooltipProps["content"]> ? true : false;
type ExportedTooltipOpenedAllowed = true extends NonNullable<ExportedTooltipProps["opened"]> ? true : false;

const tooltipHasChildrenProp: TooltipHasChildrenProp = true;
const invalidTooltipPlacement: InvalidTooltipPlacementAllowed = false;
const invalidTooltipContent: InvalidTooltipContentAllowed = false;
const exportedTooltipOpened: ExportedTooltipOpenedAllowed = true;

export {
	acceptsExportedTooltipProps,
	acceptsTooltipChildren,
	acceptsTooltipProps,
	exportedTooltipOpened,
	invalidTooltipContent,
	invalidTooltipPlacement,
	tooltipHasChildrenProp,
};
