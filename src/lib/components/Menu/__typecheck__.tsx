import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";
import { theme as themeRefs } from "@prism/theme";

import { Box } from "../Box";
import { Text } from "../Text";

import { Menu } from "./Menu";
import type { MenuItemVisualStyles, MenuPanelVisualStyles } from "./styles";
import type { MenuItem, MenuPanelStyleOverrideContext, MenuProps, MenuStyleOverrides } from "./types";

const menuRef = React.createRef<Frame>();
type ExportedMenuProps = React.ComponentProps<typeof Menu>;

const trigger = <Box width={160} height={36} bg={themeRefs.background.surface} radius="sm" />;
const items: readonly MenuItem[] = [
	{ type: "label", label: "Actions" },
	{ value: "equip", label: "Equip" },
	{ value: "inspect", label: "Inspect", rightSection: "I" },
	{ type: "divider" },
	{ value: "drop", label: "Drop", color: "error", disabled: true },
];

const menuStyleOverrides: MenuStyleOverrides = {
	panel: (visualStyles, ctx) =>
		ctx.size === "lg"
			? { strokeColor: ctx.theme.colors.primary.dark, dividerTransparency: visualStyles.dividerTransparency * 0.5 }
			: {},
	item: (_visualStyles, ctx) => {
		if (ctx.state === "pressed") {
			return { backgroundColor: ctx.theme.colors.primary.dark, textColor: ctx.theme.colors.primary.contrast };
		}

		return ctx.state === "hovered" && ctx.item.color === "error" ? { textColor: ctx.theme.colors.error.dark } : {};
	},
};

const validMenuProps: MenuProps[] = [
	{ items, children: trigger },
	{ items, children: trigger, styleOverrides: menuStyleOverrides },
	{ items, children: trigger, styleOverrides: { item: (_visualStyles, ctx) => (ctx.state === "disabled" ? { textTransparency: 0.4 } : {}) } },
	{ items, children: trigger, opened: true },
	{ items, children: trigger, defaultOpened: true },
	{ items, children: trigger, disabled: true },
	{ items, children: trigger, triggerMode: "hover" },
	{ items, children: trigger, triggerMode: "manual", opened: true },
	{ items, children: trigger, placement: "right", align: "end", gap: 10, offset: new Vector2(2, 4) },
	{ items, children: trigger, closeOnOutsidePress: false, closeOnItemPress: false },
	{ items, children: trigger, maxVisibleItems: 4, panelWidth: 260, size: "lg" },
	{ items, children: trigger, width: 180, minWidth: 120, maxWidth: 260, layoutOrder: 3 },
	{ items, children: trigger, slotProps: { root: { ZIndex: 4 }, panel: { BackgroundTransparency: 0.04 } } },
	{ items, children: trigger, slotProps: { item: { AutoButtonColor: true }, itemLabel: { TextColor3: Color3.fromRGB(255, 255, 255) } } },
	{ items, children: trigger, slotProps: { divider: { BackgroundTransparency: 1 }, groupLabel: { Text: "Override" } } },
	{ items, children: trigger, onItemPress: () => undefined, ref: menuRef },
];

const validExportedMenuProps: ExportedMenuProps[] = [
	{ items, children: trigger },
	{ items, placement: "bottom", align: "start", triggerMode: "click", children: trigger },
	{ items, opened: true, onOpenedChange: () => undefined, children: trigger },
];

const validMenuExamples = [
	<Menu key="basic" items={items}>{trigger}</Menu>,
	<Menu key="open" items={items} opened>{trigger}</Menu>,
	<Menu key="hover" items={items} triggerMode="hover" placement="top">{trigger}</Menu>,
	<Menu key="slots" items={items} slotProps={{ itemCorner: { CornerRadius: new UDim(0, 10) }, content: { ZIndex: 12 } }}>{trigger}</Menu>,
	<Menu key="rich" items={[{ value: "preview", label: "Preview", icon: <Text text="P" /> }]} ref={menuRef}>{trigger}</Menu>,
];

const acceptsMenuChildren: React.ReactNode = validMenuExamples;
const acceptsMenuProps: MenuProps[] = validMenuProps;
const acceptsExportedMenuProps: ExportedMenuProps[] = validExportedMenuProps;

type MenuVisualStyleKey = keyof MenuPanelVisualStyles | keyof MenuItemVisualStyles;
type MenuStyleOverridesAssignableToProp = AssertTrue<IsAssignable<MenuStyleOverrides, MenuProps["styleOverrides"]>>;
type MenuStyleOverridesAssignableToExportedProp = AssertTrue<IsAssignable<MenuStyleOverrides, ExportedMenuProps["styleOverrides"]>>;
type MenuPanelCtxHasNoState = AssertFalse<HasProp<MenuPanelStyleOverrideContext, "state">>;
type MenuVisualStylesHaveNoRadius = AssertFalse<IsAssignable<"radius", MenuVisualStyleKey>>;
type MenuVisualStylesHaveNoItemRadius = AssertFalse<IsAssignable<"itemRadius", MenuVisualStyleKey>>;
type MenuVisualStylesHaveNoPadding = AssertFalse<IsAssignable<"padding", MenuVisualStyleKey>>;
type MenuVisualStylesHaveNoFontSize = AssertFalse<IsAssignable<"fontSize", MenuVisualStyleKey>>;
type MenuVisualStylesHaveNoItemHeight = AssertFalse<IsAssignable<"itemHeight", MenuVisualStyleKey>>;

const menuStyleOverridesAssignableToProp: MenuStyleOverridesAssignableToProp = true;
const menuStyleOverridesAssignableToExportedProp: MenuStyleOverridesAssignableToExportedProp = true;
const menuPanelCtxHasNoState: MenuPanelCtxHasNoState = false;
const menuVisualStylesHaveNoRadius: MenuVisualStylesHaveNoRadius = false;
const menuVisualStylesHaveNoItemRadius: MenuVisualStylesHaveNoItemRadius = false;
const menuVisualStylesHaveNoPadding: MenuVisualStylesHaveNoPadding = false;
const menuVisualStylesHaveNoFontSize: MenuVisualStylesHaveNoFontSize = false;
const menuVisualStylesHaveNoItemHeight: MenuVisualStylesHaveNoItemHeight = false;

type MenuHasChildrenProp = "children" extends keyof MenuProps ? true : false;
type InvalidMenuPlacementAllowed = "center" extends NonNullable<MenuProps["placement"]> ? true : false;
type InvalidMenuTriggerModeAllowed = "focus" extends NonNullable<MenuProps["triggerMode"]> ? true : false;
type MenuItemsRequired = undefined extends MenuProps["items"] ? false : true;

const menuHasChildrenProp: MenuHasChildrenProp = true;
const invalidMenuPlacement: InvalidMenuPlacementAllowed = false;
const invalidMenuTriggerMode: InvalidMenuTriggerModeAllowed = false;
const menuItemsRequired: MenuItemsRequired = true;

export {
	acceptsExportedMenuProps,
	acceptsMenuChildren,
	acceptsMenuProps,
	invalidMenuPlacement,
	invalidMenuTriggerMode,
	menuHasChildrenProp,
	menuItemsRequired,
	menuPanelCtxHasNoState,
	menuStyleOverrides,
	menuStyleOverridesAssignableToExportedProp,
	menuStyleOverridesAssignableToProp,
	menuVisualStylesHaveNoFontSize,
	menuVisualStylesHaveNoItemHeight,
	menuVisualStylesHaveNoItemRadius,
	menuVisualStylesHaveNoPadding,
	menuVisualStylesHaveNoRadius,
};
