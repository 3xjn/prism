import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { TabsListVisualStyles, TabsPanelVisualStyles, TabsTabState, TabsTabVisualStyles } from "./styles";

export interface TabsTab {
	readonly value: string;
	readonly label: string;
	readonly panel?: React.ReactNode;
	readonly disabled?: boolean;
}

export interface TabsPanelRenderState {
	readonly index: number;
	readonly active: boolean;
}

export type TabsVariant = "line" | "contained";

export type TabsSize = ThemeSize;

export type TabsColor = SemanticIntent;

export interface TabsSlots {
	readonly root: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly list: Frame;
	readonly listStroke: UIStroke;
	readonly listLayout: UIListLayout;
	readonly tab: TextButton;
	readonly tabCorner: UICorner;
	readonly tabStroke: UIStroke;
	readonly tabPadding: UIPadding;
	readonly tabText: TextLabel;
	readonly panel: Frame;
	readonly panelCorner: UICorner;
	readonly panelStroke: UIStroke;
	readonly panelPadding: UIPadding;
}

export type TabsSlotProps = RawSlotProps<TabsSlots>;

export interface TabsListStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: TabsVariant;
	readonly color: TabsColor;
	readonly size: TabsSize;
	readonly disabled: boolean;
}

export interface TabsTabStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: TabsVariant;
	readonly color: TabsColor;
	readonly size: TabsSize;
	readonly tab: TabsTab;
	readonly state: TabsTabState;
}

export interface TabsPanelStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: TabsVariant;
	readonly color: TabsColor;
	readonly size: TabsSize;
	readonly disabled: boolean;
}

export interface TabsStyleOverrides {
	readonly list?: StyleOverride<TabsListVisualStyles, TabsListStyleOverrideContext>;
	readonly tab?: StyleOverride<TabsTabVisualStyles, TabsTabStyleOverrideContext>;
	readonly panel?: StyleOverride<TabsPanelVisualStyles, TabsPanelStyleOverrideContext>;
}

export interface TabsStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: TabsVariant;
	readonly color?: TabsColor;
	readonly size?: TabsSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 * Callbacks must be pure and inexpensive because they run on every render; the tab callback runs once per rendered tab.
	 */
	readonly styleOverrides?: TabsStyleOverrides;
}

export interface TabsProps extends TabsStyleProps {
	readonly tabs: readonly TabsTab[];
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onChange?: (value: string) => void;
	readonly renderPanel?: (tab: TabsTab, state: TabsPanelRenderState) => React.ReactNode;
	readonly keepMounted?: boolean;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: TabsSlotProps;
	readonly ref?: React.Ref<Frame>;
}
