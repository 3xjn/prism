import React from "@rbxts/react";

import { Box } from "../Box";
import { Text } from "../Text";

import { Menu } from "./Menu";
import type { MenuItem, MenuProps } from "./types";

const menuRef = React.createRef<Frame>();
type ExportedMenuProps = React.ComponentProps<typeof Menu>;

const trigger = <Box width={160} height={36} bg="background.surface" radius="sm" />;
const items: readonly MenuItem[] = [
	{ type: "label", label: "Actions" },
	{ value: "equip", label: "Equip" },
	{ value: "inspect", label: "Inspect", rightSection: "I" },
	{ type: "divider" },
	{ value: "drop", label: "Drop", color: "error", disabled: true },
];

const validMenuProps: MenuProps[] = [
	{ items, children: trigger },
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
};
