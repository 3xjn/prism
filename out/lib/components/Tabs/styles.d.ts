import type { Theme, ThemeSize } from "../../theme/index";
import type { TabsColor, TabsSize, TabsVariant } from "./types";
export type TabsTabState = "idle" | "hovered" | "focused" | "pressed" | "selected" | "disabled";
export interface TabsSizeStyles {
    readonly tabGap: number;
    readonly tabPaddingX: ThemeSize;
    readonly tabPaddingY: ThemeSize;
    readonly panelPaddingX: ThemeSize;
    readonly panelPaddingY: ThemeSize;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly listHeight: number;
    readonly panelMinHeight: number;
    readonly defaultWidth: number;
    readonly tabRadius: UDim;
    readonly panelRadius: UDim;
}
export interface TabsListVisualStyles {
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
}
export interface TabsTabVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly textColor: Color3;
    readonly textTransparency: number;
    readonly indicatorColor: Color3;
    readonly indicatorTransparency: number;
}
export interface TabsPanelVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
}
export declare function resolveTabsSizeStyles(theme: Theme, size: TabsSize): TabsSizeStyles;
export declare function resolveTabsListVisualStyles(theme: Theme, variant: TabsVariant, color: TabsColor, disabled: boolean): TabsListVisualStyles;
export declare function resolveTabsTabVisualStyles(theme: Theme, variant: TabsVariant, color: TabsColor, state: TabsTabState): TabsTabVisualStyles;
export declare function resolveTabsPanelVisualStyles(theme: Theme, variant: TabsVariant, color: TabsColor, disabled: boolean): TabsPanelVisualStyles;
export declare function resolveTabsTabMotionTransition(state: TabsTabState): {
    readonly backgroundColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly strokeColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly strokeTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly textTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly indicatorColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly indicatorTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
} | {
    readonly backgroundColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly strokeColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly strokeTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly textTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly indicatorColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly indicatorTransparency: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
};
