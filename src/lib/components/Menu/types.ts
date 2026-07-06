import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize } from "@prism/theme";
import type { SizeValue } from "@prism/utils";

import type { IconName } from "../Icon";
import type { PopoverAlign, PopoverPlacement, PopoverStyleProps, PopoverTriggerMode } from "../Popover";
import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";

import type { MenuItemState, MenuItemVisualStyles, MenuPanelVisualStyles } from "./styles";

export type MenuPlacement = PopoverPlacement;

export type MenuAlign = PopoverAlign;

export type MenuTriggerMode = PopoverTriggerMode;

export interface MenuActionItem {
	readonly type?: "item";
	readonly value: string;
	readonly label: string | number;
	readonly disabled?: boolean;
	readonly color?: SemanticIntent;
	readonly icon?: IconName | React.ReactElement;
	readonly rightSection?: React.ReactElement | string | number;
	readonly closeMenuOnPress?: boolean;
	readonly onPress?: (value: string) => void;
}

export interface MenuDividerItem {
	readonly type: "divider";
}

export interface MenuLabelItem {
	readonly type: "label";
	readonly label: string | number;
}

export type MenuItem = MenuActionItem | MenuDividerItem | MenuLabelItem;

export interface MenuSlots {
	readonly root: Frame;
	readonly sizeConstraint: UISizeConstraint;
	readonly trigger: TextButton;
	readonly overlay: Frame;
	readonly outsideCapture: TextButton;
	readonly panel: TextButton;
	readonly panelCorner: UICorner;
	readonly panelStroke: UIStroke;
	readonly panelPadding: UIPadding;
	readonly content: Frame;
	readonly list: ScrollingFrame;
	readonly listPadding: UIPadding;
	readonly listLayout: UIListLayout;
	readonly item: TextButton;
	readonly itemCorner: UICorner;
	readonly itemPadding: UIPadding;
	readonly itemLayout: UIListLayout;
	readonly itemIcon: Frame;
	readonly itemLabel: TextLabel;
	readonly itemRightSection: Frame;
	readonly itemRightLabel: TextLabel;
	readonly divider: Frame;
	readonly groupLabel: TextLabel;
}

export type MenuSlotProps = RawSlotProps<MenuSlots>;

export type MenuSize = ThemeSize;

export interface MenuPanelStyleOverrideContext {
	readonly theme: Theme;
	readonly size: MenuSize;
}

export interface MenuItemStyleOverrideContext {
	readonly theme: Theme;
	readonly size: MenuSize;
	readonly item: MenuActionItem;
	readonly state: MenuItemState;
}

export interface MenuStyleOverrides {
	readonly panel?: StyleOverride<MenuPanelVisualStyles, MenuPanelStyleOverrideContext>;
	readonly item?: StyleOverride<MenuItemVisualStyles, MenuItemStyleOverrideContext>;
}

export interface MenuStyleProps extends Omit<PopoverStyleProps, "content" | "styleOverrides"> {
	readonly size?: MenuSize;
	readonly panelWidth?: SizeValue;
	readonly maxVisibleItems?: number;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 * Callbacks must be pure and inexpensive because they run on every render; the item callback runs once per rendered action item.
	 */
	readonly styleOverrides?: MenuStyleOverrides;
}

export interface MenuProps extends MenuStyleProps {
	readonly items: readonly MenuItem[];
	readonly children?: React.ReactNode;
	readonly onItemPress?: (value: string) => void;
	readonly onOpenedChange?: (opened: boolean) => void;
	readonly closeOnItemPress?: boolean;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: MenuSlotProps;
	readonly ref?: React.Ref<Frame>;
}
