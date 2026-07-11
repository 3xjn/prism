import type React from "@rbxts/react";

import type { Theme, ThemeSize } from "@prism/theme";

import type { SelectionProps } from "../_shared/selection";
import type { RawSlotProps } from "../_shared/slotProps";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { ColorPickerInteractionState, ColorPickerVisualStyles } from "./styles";

export type { ColorPickerVisualStyles } from "./styles";

export interface ColorPickerSlots {
	readonly root: Frame;
	readonly rootCorner: UICorner;
	readonly rootStroke: UIStroke;
	readonly content: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly layout: UIListLayout;
	readonly preview: Frame;
	readonly previewSwatch: Frame;
	readonly previewSwatchCorner: UICorner;
	readonly previewSwatchStroke: UIStroke;
	readonly previewLabel: TextLabel;
	readonly field: Frame;
	readonly fieldCorner: UICorner;
	readonly fieldStroke: UIStroke;
	readonly saturationOverlay: Frame;
	readonly saturationGradient: UIGradient;
	readonly valueOverlay: Frame;
	readonly valueGradient: UIGradient;
	readonly fieldMarker: Frame;
	readonly fieldMarkerCorner: UICorner;
	readonly fieldMarkerStroke: UIStroke;
	readonly fieldMarkerInner: Frame;
	readonly fieldMarkerInnerCorner: UICorner;
	readonly fieldHitbox: TextButton;
	readonly hue: Frame;
	readonly hueCorner: UICorner;
	readonly hueGradient: UIGradient;
	readonly hueMarker: Frame;
	readonly hueMarkerCorner: UICorner;
	readonly hueMarkerStroke: UIStroke;
	readonly hueHitbox: TextButton;
	readonly inputs: Frame;
	readonly inputsLayout: UIListLayout;
	readonly hexField: Frame;
	readonly hexLabel: TextLabel;
	readonly hexInputRoot: Frame;
	readonly hexInput: TextBox;
	readonly hexInputCorner: UICorner;
	readonly hexInputStroke: UIStroke;
	readonly hexInputPadding: UIPadding;
	readonly rgbField: Frame;
	readonly rgbLabel: TextLabel;
	readonly rgbInputRoot: Frame;
	readonly rgbInput: TextBox;
	readonly rgbInputCorner: UICorner;
	readonly rgbInputStroke: UIStroke;
	readonly rgbInputPadding: UIPadding;
	readonly disabledOverlay: Frame;
}

export type ColorPickerSlotProps = RawSlotProps<ColorPickerSlots>;

export type ColorPickerSize = ThemeSize;

export interface ColorPickerStyleOverrideContext {
	readonly theme: Theme;
	readonly size: ColorPickerSize;
	readonly state: ColorPickerInteractionState;
	readonly value: Color3;
}

export type ColorPickerStyleOverride = StyleOverride<ColorPickerVisualStyles, ColorPickerStyleOverrideContext>;

export interface ColorPickerStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly size?: ColorPickerSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
	/** Per-state visual values only. Raw slotProps remain the final escape hatch. */
	readonly styleOverrides?: ColorPickerStyleOverride;
}

export interface ColorPickerProps extends ColorPickerStyleProps, SelectionProps {
	readonly value?: Color3;
	readonly defaultValue?: Color3;
	readonly onChange?: (value: Color3) => void;
	readonly onChangeEnd?: (value: Color3) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: ColorPickerSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
