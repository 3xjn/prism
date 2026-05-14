import type React from "@rbxts/react";

import type { ColorToken, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedCursorValue } from "../_shared/useResolvedStyleProps";

export type DividerOrientation = "horizontal" | "vertical";

export type DividerColorValue = ColorToken | Color3;

export type DividerSizeValue = ThemeSize | number;

export interface DividerStyleProps {
	readonly orientation?: DividerOrientation;
	readonly color?: DividerColorValue;
	readonly size?: DividerSizeValue;
	readonly cursor?: SharedCursorValue;
	readonly visible?: boolean;
	readonly layoutOrder?: number;
}

export interface DividerSlots {
	readonly root: Frame;
}

export type DividerSlotProps = RawSlotProps<DividerSlots>;

export interface DividerProps extends DividerStyleProps {
	readonly children?: never;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: DividerSlotProps;
	readonly ref?: React.Ref<Frame>;
}
