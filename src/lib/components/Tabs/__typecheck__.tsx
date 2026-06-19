import React from "@rbxts/react";

import { Tabs } from "./Tabs";
import type { TabsProps, TabsTab } from "./types";

const tabsRef = React.createRef<Frame>();
type ExportedTabsProps = React.ComponentProps<typeof Tabs>;

const tabs: readonly TabsTab[] = [
	{ value: "overview", label: "Overview", panel: <frame /> },
	{ value: "inventory", label: "Inventory", panel: <frame /> },
	{ value: "store", label: "Store", panel: <frame />, disabled: true },
];

const validTabsProps: TabsProps[] = [
	{ tabs },
	{ tabs, defaultValue: "inventory" },
	{ tabs, value: "overview", onChange: () => undefined },
	{ tabs, disabled: true },
	{ tabs, keepMounted: true },
	{ tabs, fullWidth: true, width: "100%" },
	{ tabs, variant: "contained", color: "secondary", size: "lg" },
	{ tabs, renderPanel: (tab) => tab.panel },
	{ tabs, cursor: "pointer", p: "xs", layoutOrder: 2 },
	{ tabs, slotProps: { root: { ZIndex: 3 }, tab: { AutoButtonColor: true }, tabText: { Text: "Override" } } },
	{ tabs, slotProps: { list: { BackgroundTransparency: 0.1 }, tabStroke: { Transparency: 0.2 } } },
	{ tabs, slotProps: { panel: { BackgroundTransparency: 0.04 }, panelPadding: { PaddingLeft: new UDim(0, 18) } } },
	{ tabs, slotProps: { sizeConstraint: { MinSize: new Vector2(260, 140) } } },
	{ tabs, ref: tabsRef },
];

const validExportedTabsProps: ExportedTabsProps[] = [
	{ tabs },
	{ tabs, defaultValue: "overview", cursor: "default" },
	{ tabs, value: "inventory", onChange: () => undefined, color: "primary", variant: "line" },
	{ tabs, size: "lg", fullWidth: true, keepMounted: true },
];

const validTabsExamples = [
	<Tabs key="basic" tabs={tabs} />,
	<Tabs key="uncontrolled" tabs={tabs} defaultValue="inventory" />,
	<Tabs key="controlled" tabs={tabs} value="overview" onChange={() => undefined} />,
	<Tabs key="disabled" tabs={tabs} disabled />,
	<Tabs key="mounted" tabs={tabs} keepMounted />,
	<Tabs key="full-width" tabs={tabs} fullWidth />,
	<Tabs key="render-panel" tabs={tabs} renderPanel={(tab, state) => (state.active ? tab.panel : undefined)} />,
	<Tabs
		key="slots"
		tabs={tabs}
		slotProps={{
			root: { ZIndex: 3 },
			list: { BackgroundTransparency: 0.05 },
			tabText: { TextXAlignment: Enum.TextXAlignment.Center },
		}}
	/>,
	<Tabs key="ref" tabs={tabs} ref={tabsRef} />,
];

const acceptsTabsChildren: React.ReactNode = validTabsExamples;
const acceptsTabsProps: TabsProps[] = validTabsProps;
const acceptsExportedTabsProps: ExportedTabsProps[] = validExportedTabsProps;

type TabsHasChildrenProp = "children" extends keyof TabsProps ? true : false;
type InvalidTabsColorAllowed = "palette.primary.5" extends NonNullable<TabsProps["color"]> ? true : false;
type InvalidTabsValueAllowed = number extends NonNullable<TabsProps["value"]> ? true : false;
type InvalidTabsVariantAllowed = "outline" extends NonNullable<TabsProps["variant"]> ? true : false;
type TabsPanelAllowed = React.ReactNode extends TabsTab["panel"] ? true : false;

const tabsHasChildrenProp: TabsHasChildrenProp = false;
const invalidTabsColor: InvalidTabsColorAllowed = false;
const invalidTabsValue: InvalidTabsValueAllowed = false;
const invalidTabsVariant: InvalidTabsVariantAllowed = false;
const tabsPanelAllowed: TabsPanelAllowed = true;

export {
	acceptsExportedTabsProps,
	acceptsTabsChildren,
	acceptsTabsProps,
	invalidTabsColor,
	invalidTabsValue,
	invalidTabsVariant,
	tabsHasChildrenProp,
	tabsPanelAllowed,
};
