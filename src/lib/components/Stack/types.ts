import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedSpacingValue, SharedStyleProps } from "../_shared/useResolvedStyleProps";

export type StackDirection = "vertical" | "horizontal";

export type StackAlign = "start" | "center" | "end" | "stretch";

export type StackJustify = "start" | "center" | "end" | "fill" | "spaceAround" | "spaceBetween" | "spaceEvenly";

export type StackGapValue = SharedSpacingValue;

export interface StackStyleProps extends SharedStyleProps {
	readonly direction?: StackDirection;
	readonly gap?: StackGapValue;
	readonly align?: StackAlign;
	readonly justify?: StackJustify;
	readonly wrap?: boolean;
}

export interface StackSlots {
	readonly root: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly listLayout: UIListLayout;
}

export type StackSlotProps = RawSlotProps<StackSlots>;

export interface StackProps extends StackStyleProps {
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: StackSlotProps;
	readonly ref?: React.Ref<Frame>;
}
