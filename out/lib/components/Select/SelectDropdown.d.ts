import React from "@rbxts/react";
import type { Variant } from "../../theme/index";
import { type SelectSizeStyles } from "./styles";
import type { SelectColor, SelectOption, SelectProps, SelectSize, SelectSlotProps, SelectStyleOverrides } from "./types";
import { type GuiZIndex, type SelectOverlayLayout } from "./utils";
interface SelectDropdownProps {
    readonly layout: SelectOverlayLayout;
    readonly variant: Variant;
    readonly color: SelectColor;
    readonly size: SelectSize;
    readonly options: readonly SelectOption[];
    readonly currentValue: string | undefined;
    readonly sizeStyles: SelectSizeStyles;
    readonly maxVisibleOptions: number;
    readonly slotProps: SelectSlotProps | undefined;
    readonly styleOverrides: SelectStyleOverrides | undefined;
    readonly cursor: SelectProps["cursor"];
    readonly zIndex: GuiZIndex | undefined;
    readonly onSelect: (value: string) => void;
}
export declare function SelectDropdown(props: SelectDropdownProps): React.ReactElement;
export {};
