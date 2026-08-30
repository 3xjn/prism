import type { SemanticIntent, Theme, ThemeSize } from "../../theme/index";
import type { InteractionState } from "../_shared/usePressInteraction";
import type { MenuSize } from "./types";
export type MenuItemState = InteractionState;
export interface MenuSizeStyles {
    readonly panelWidth: number;
    readonly listPadding: ThemeSize;
    readonly itemPaddingX: ThemeSize;
    readonly itemPaddingY: ThemeSize;
    readonly itemGap: number;
    readonly itemHeight: number;
    readonly labelHeight: number;
    readonly dividerHeight: number;
    readonly dividerInset: number;
    readonly labelPaddingX: ThemeSize;
    readonly labelLetterSpacing: number;
    readonly radius: UDim;
    readonly itemRadius: UDim;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly metaFontSize: number;
    readonly iconSize: number;
    readonly scrollBarThickness: number;
}
export interface MenuPanelVisualStyles {
    readonly backgroundColor: Color3;
    readonly strokeColor: Color3;
    readonly strokeTransparency: number;
    readonly dividerColor: Color3;
    readonly dividerTransparency: number;
    readonly labelColor: Color3;
    readonly labelTransparency: number;
}
export interface MenuItemVisualStyles {
    readonly backgroundColor: Color3;
    readonly backgroundTransparency: number;
    readonly textColor: Color3;
    readonly textTransparency: number;
    readonly rightTextColor: Color3;
    readonly rightTextTransparency: number;
}
export declare function resolveMenuSizeStyles(theme: Theme, size: MenuSize): MenuSizeStyles;
export declare function resolveMenuPanelVisualStyles(theme: Theme): MenuPanelVisualStyles;
export declare function resolveMenuItemVisualStyles(theme: Theme, color: SemanticIntent | undefined, state: MenuItemState): MenuItemVisualStyles;
export declare function resolveMenuItemMotionTransition(state: MenuItemState): {
    readonly backgroundColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly textColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly textTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly rightTextColor: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
    readonly rightTextTransparency: {
        readonly duration: "instant";
        readonly easing: "standard";
    };
} | {
    readonly backgroundColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly backgroundTransparency: {
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
    readonly rightTextColor: {
        readonly duration: "fast";
        readonly easing: "standard";
    };
    readonly rightTextTransparency: {
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
    readonly textColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly textTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly rightTextColor: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
    readonly rightTextTransparency: {
        readonly duration: "normal";
        readonly easing: "standard";
    };
};
