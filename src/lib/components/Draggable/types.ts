import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";
import type { StackAlign, StackDirection, StackGapValue, StackJustify } from "../Stack/types";

export interface DraggableItem {
	readonly id: string;
	readonly disabled?: boolean;
}

export interface DraggableItemRenderState<TItem extends DraggableItem = DraggableItem> {
	readonly item: TItem;
	readonly index: number;
	readonly dragging: boolean;
	/** True while the item is being dragged or owns native controller selection. */
	readonly active: boolean;
	readonly disabled: boolean;
}

export interface DraggableSlots {
	readonly root: Frame;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
	readonly listLayout: UIListLayout;
	readonly item: TextButton;
}

export type DraggableSlotProps = RawSlotProps<DraggableSlots>;

export interface DraggableStyleProps extends SharedStyleProps {
	readonly direction?: StackDirection;
	readonly gap?: StackGapValue;
	readonly align?: StackAlign;
	readonly justify?: StackJustify;
	readonly disabled?: boolean;
	readonly active?: boolean;
}

export interface DraggableProps<TItem extends DraggableItem = DraggableItem> extends DraggableStyleProps {
	/**
	 * Enabled item buttons are native selection targets along `direction`. Directional movement
	 * skips disabled items without wrapping; reordering remains a pointer/touch gesture.
	 */
	readonly items: readonly TItem[];
	readonly value?: readonly string[];
	readonly defaultValue?: readonly string[];
	readonly onReorder?: (order: readonly string[]) => void;
	readonly renderItem: (state: DraggableItemRenderState<TItem>) => React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: DraggableSlotProps;
	/** Ref ownership stays on the non-interactive root Frame; item targets remain internal. */
	readonly ref?: React.Ref<Frame>;
}
