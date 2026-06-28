import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Box } from "../Box";
import { Text } from "../Text";

import { Popover } from "./Popover";
import type { PopoverProps } from "./types";

const popoverRef = React.createRef<Frame>();
type ExportedPopoverProps = React.ComponentProps<typeof Popover>;

const trigger = <Box width={160} height={36} bg={themeRefs.background.surface} radius="sm" />;
const content = <Text text="Inspect loadout details" />;

const validPopoverProps: PopoverProps[] = [
	{ content, children: trigger },
	{ content: "Simple content", children: trigger },
	{ content, opened: true, children: trigger },
	{ content, defaultOpened: true, children: trigger },
	{ content, disabled: true, children: trigger },
	{ content, triggerMode: "hover", children: trigger },
	{ content, triggerMode: "manual", opened: true, children: trigger },
	{ content, placement: "top", align: "start", gap: 12, offset: new Vector2(4, -2), children: trigger },
	{ content, closeOnOutsidePress: false, children: trigger },
	{ content, width: 180, minWidth: 120, maxWidth: 260, layoutOrder: 3, children: trigger },
	{ content, cursor: "pointer", children: trigger },
	{ content, slotProps: { root: { ZIndex: 4 }, panel: { BackgroundTransparency: 0.04 } }, children: trigger },
	{ content, slotProps: { trigger: { AutoButtonColor: true }, outsideCapture: { ZIndex: 40 } }, children: trigger },
	{ content, slotProps: { panelCorner: { CornerRadius: new UDim(0, 10) }, panelPadding: { PaddingLeft: new UDim(0, 14) } }, children: trigger },
	{ content, ref: popoverRef, children: trigger },
];

const validExportedPopoverProps: ExportedPopoverProps[] = [
	{ content, children: trigger },
	{ content, placement: "right", align: "end", triggerMode: "click", children: trigger },
	{ content, opened: true, onOpenedChange: () => undefined, children: trigger },
];

const validPopoverExamples = [
	<Popover key="basic" content={content}>{trigger}</Popover>,
	<Popover key="open" content={content} opened>{trigger}</Popover>,
	<Popover key="hover" content={content} triggerMode="hover" placement="top">{trigger}</Popover>,
	<Popover key="slots" content={content} slotProps={{ panelStroke: { Thickness: 2 }, content: { ZIndex: 12 } }}>{trigger}</Popover>,
	<Popover key="ref" content={content} ref={popoverRef}>{trigger}</Popover>,
];

const acceptsPopoverChildren: React.ReactNode = validPopoverExamples;
const acceptsPopoverProps: PopoverProps[] = validPopoverProps;
const acceptsExportedPopoverProps: ExportedPopoverProps[] = validExportedPopoverProps;

type PopoverHasChildrenProp = "children" extends keyof PopoverProps ? true : false;
type InvalidPopoverPlacementAllowed = "center" extends NonNullable<PopoverProps["placement"]> ? true : false;
type InvalidPopoverTriggerModeAllowed = "focus" extends NonNullable<PopoverProps["triggerMode"]> ? true : false;
type ExportedPopoverContentAllowed = React.ReactElement extends NonNullable<ExportedPopoverProps["content"]> ? true : false;

const popoverHasChildrenProp: PopoverHasChildrenProp = true;
const invalidPopoverPlacement: InvalidPopoverPlacementAllowed = false;
const invalidPopoverTriggerMode: InvalidPopoverTriggerModeAllowed = false;
const exportedPopoverContentAllowed: ExportedPopoverContentAllowed = true;

export {
	acceptsExportedPopoverProps,
	acceptsPopoverChildren,
	acceptsPopoverProps,
	exportedPopoverContentAllowed,
	invalidPopoverPlacement,
	invalidPopoverTriggerMode,
	popoverHasChildrenProp,
};
