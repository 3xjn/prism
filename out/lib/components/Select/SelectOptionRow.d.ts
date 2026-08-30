import React from "@rbxts/react";
import { type SelectSizeStyles } from "./styles";
import type { SelectColor, SelectOption, SelectProps, SelectSize, SelectSlotProps, SelectStyleOverrides } from "./types";
import { type GuiZIndex } from "./utils";
interface SelectOptionRowProps {
    readonly option: SelectOption;
    readonly selected: boolean;
    readonly color: SelectColor;
    readonly size: SelectSize;
    readonly sizeStyles: SelectSizeStyles;
    readonly slotProps: SelectSlotProps | undefined;
    readonly styleOverrides: SelectStyleOverrides | undefined;
    readonly zIndex: GuiZIndex | undefined;
    readonly cursor: SelectProps["cursor"];
    readonly onSelect: (value: string) => void;
}
export declare function SelectOptionRow(props: SelectOptionRowProps): React.ReactElement;
export {};
