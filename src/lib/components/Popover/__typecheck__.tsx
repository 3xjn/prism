import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";
import { theme as themeRefs } from "@prism/theme";

import { Box } from "../Box";
import { Text } from "../Text";

import { Popover } from "./Popover";
import type { PopoverProps, PopoverStyleOverride, PopoverStyleOverrideContext, PopoverVisualStyles } from "./types";

const popoverRef = React.createRef<Frame>();
type ExportedPopoverProps = React.ComponentProps<typeof Popover>;

const trigger = <Box width={160} height={36} bg={themeRefs.background.surface} radius="sm" />;
const content = <Text text="Inspect loadout details" />;

const popoverStyleOverride: PopoverStyleOverride = (visualStyles, ctx) => {
	if (visualStyles.strokeTransparency > 0.5) {
		return { strokeTransparency: 0.5 };
	}

	return { backgroundColor: ctx.theme.colors.background.default, strokeColor: ctx.theme.colors.border.strong };
};

const validPopoverProps: PopoverProps[] = [
	{ content, children: trigger },
	{ content, styleOverrides: popoverStyleOverride, children: trigger },
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
type PopoverStyleOverrideAssignableToProp = AssertTrue<IsAssignable<PopoverStyleOverride, PopoverProps["styleOverrides"]>>;
type PopoverStyleOverrideAssignableToExportedProp = AssertTrue<IsAssignable<PopoverStyleOverride, ExportedPopoverProps["styleOverrides"]>>;
type PopoverStyleOverrideContextHasTheme = AssertTrue<HasProp<PopoverStyleOverrideContext, "theme">>;
type PopoverStyleOverrideContextHasNoState = AssertFalse<HasProp<PopoverStyleOverrideContext, "state">>;
type PopoverVisualStylesHasNoRadius = AssertFalse<IsAssignable<"radius", keyof PopoverVisualStyles>>;
type PopoverVisualStylesHasNoPadding = AssertFalse<IsAssignable<"padding", keyof PopoverVisualStyles>>;
type PopoverVisualStylesHasNoPaddingX = AssertFalse<IsAssignable<"paddingX", keyof PopoverVisualStyles>>;
type PopoverVisualStylesHasNoFontSize = AssertFalse<IsAssignable<"fontSize", keyof PopoverVisualStyles>>;
type PopoverVisualStylesHasNoLineHeight = AssertFalse<IsAssignable<"lineHeight", keyof PopoverVisualStyles>>;
type PopoverVisualStylesHasNoGap = AssertFalse<IsAssignable<"gap", keyof PopoverVisualStyles>>;
type PopoverVisualStylesHasNoLayout = AssertFalse<IsAssignable<"layout", keyof PopoverVisualStyles>>;

const popoverHasChildrenProp: PopoverHasChildrenProp = true;
const invalidPopoverPlacement: InvalidPopoverPlacementAllowed = false;
const invalidPopoverTriggerMode: InvalidPopoverTriggerModeAllowed = false;
const exportedPopoverContentAllowed: ExportedPopoverContentAllowed = true;
const popoverStyleOverrideAssignableToProp: PopoverStyleOverrideAssignableToProp = true;
const popoverStyleOverrideAssignableToExportedProp: PopoverStyleOverrideAssignableToExportedProp = true;
const popoverStyleOverrideContextHasTheme: PopoverStyleOverrideContextHasTheme = true;
const popoverStyleOverrideContextHasNoState: PopoverStyleOverrideContextHasNoState = false;
const popoverVisualStylesHasNoRadius: PopoverVisualStylesHasNoRadius = false;
const popoverVisualStylesHasNoPadding: PopoverVisualStylesHasNoPadding = false;
const popoverVisualStylesHasNoPaddingX: PopoverVisualStylesHasNoPaddingX = false;
const popoverVisualStylesHasNoFontSize: PopoverVisualStylesHasNoFontSize = false;
const popoverVisualStylesHasNoLineHeight: PopoverVisualStylesHasNoLineHeight = false;
const popoverVisualStylesHasNoGap: PopoverVisualStylesHasNoGap = false;
const popoverVisualStylesHasNoLayout: PopoverVisualStylesHasNoLayout = false;

export {
	acceptsExportedPopoverProps,
	acceptsPopoverChildren,
	acceptsPopoverProps,
	exportedPopoverContentAllowed,
	invalidPopoverPlacement,
	invalidPopoverTriggerMode,
	popoverHasChildrenProp,
	popoverStyleOverride,
	popoverStyleOverrideAssignableToExportedProp,
	popoverStyleOverrideAssignableToProp,
	popoverStyleOverrideContextHasNoState,
	popoverStyleOverrideContextHasTheme,
	popoverVisualStylesHasNoFontSize,
	popoverVisualStylesHasNoGap,
	popoverVisualStylesHasNoLayout,
	popoverVisualStylesHasNoLineHeight,
	popoverVisualStylesHasNoPadding,
	popoverVisualStylesHasNoPaddingX,
	popoverVisualStylesHasNoRadius,
};
