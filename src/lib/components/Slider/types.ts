import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface SliderSlots {
	readonly root: Frame;
	readonly sizeConstraint: UISizeConstraint;
	readonly padding: UIPadding;
	readonly label: TextLabel;
	readonly valueLabel: TextLabel;
	readonly track: Frame;
	readonly trackCorner: UICorner;
	readonly trackStroke: UIStroke;
	readonly range: Frame;
	readonly rangeCorner: UICorner;
	readonly thumb: Frame;
	readonly thumbCorner: UICorner;
	readonly thumbStroke: UIStroke;
	readonly tooltipTrigger: Frame;
	readonly tooltipOverlay: Frame;
	readonly tooltip: Frame;
	readonly tooltipCorner: UICorner;
	readonly tooltipStroke: UIStroke;
	readonly tooltipPadding: UIPadding;
	readonly tooltipLabel: TextLabel;
	readonly tooltipTail: ImageLabel;
	readonly tooltipTailBorder: ImageLabel;
	readonly hitbox: TextButton;
}

export type SliderSlotProps = RawSlotProps<SliderSlots>;

export type SliderSize = ThemeSize;

export type SliderColor = SemanticIntent;

export interface SliderStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly color?: SliderColor;
	readonly size?: SliderSize;
	readonly disabled?: boolean;
	readonly fullWidth?: boolean;
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
}

export interface SliderProps extends SliderStyleProps {
	readonly value?: number;
	readonly defaultValue?: number;
	readonly tooltip?: boolean | string | ((value: number) => string);
	readonly onChange?: (value: number) => void;
	readonly onChangeEnd?: (value: number) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: SliderSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
