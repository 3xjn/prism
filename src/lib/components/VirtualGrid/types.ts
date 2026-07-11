import type React from "@rbxts/react";

import type { ConcreteColorValue, ThemeSize } from "@prism/theme";

import type { SelectionGroupProps } from "../_shared/selection";
import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";
import type { VirtualItemRange, VirtualScrollAlignment } from "../../virtualization/_internal/fixedVirtualGeometry";
import type { VirtualItemKey } from "../../virtualization/fixedVirtualCollection";
import type { FixedVirtualWindowApi } from "../../virtualization/useFixedVirtualWindow";

export type VirtualGridGapValue = ThemeSize | number;
export type VirtualGridVisibleRange = VirtualItemRange;

export interface VirtualGridRenderState<TItem, TKey extends VirtualItemKey = VirtualItemKey> {
	readonly item: TItem;
	readonly index: number;
	readonly key: TKey;
	readonly row: number;
	readonly column: number;
	readonly visible: boolean;
}

export interface VirtualGridSlots {
	readonly root: ScrollingFrame;
	readonly content: Frame;
	readonly item: Frame;
	readonly sizeConstraint: UISizeConstraint;
}

export type VirtualGridSlotProps = RawSlotProps<VirtualGridSlots>;

export interface VirtualGridStyleProps extends SharedStyleProps {
	readonly gap?: VirtualGridGapValue;
	readonly rowGap?: VirtualGridGapValue;
	readonly columnGap?: VirtualGridGapValue;
	readonly scrollbarSize?: number;
	readonly scrollbarColor?: ConcreteColorValue;
	readonly scrollbarTransparency?: number;
	readonly scrollingEnabled?: boolean;
}

export interface VirtualGridExplicitColumnProps {
	readonly columns: number;
	readonly minimumCellWidth?: never;
	readonly maxColumns?: never;
}

export interface VirtualGridResponsiveColumnProps {
	readonly columns?: never;
	readonly minimumCellWidth: number;
	readonly maxColumns?: number;
}

export type VirtualGridColumnProps = VirtualGridExplicitColumnProps | VirtualGridResponsiveColumnProps;

export interface VirtualGridApi<TKey extends VirtualItemKey = VirtualItemKey> extends FixedVirtualWindowApi<TKey> {
	readonly scrollToIndex: (index: number, alignment?: VirtualScrollAlignment) => boolean;
	readonly scrollToKey: (key: TKey, alignment?: VirtualScrollAlignment) => boolean;
}

export interface VirtualGridBaseProps<TItem = unknown, TKey extends VirtualItemKey = VirtualItemKey>
	extends VirtualGridStyleProps, SelectionGroupProps {
	readonly items: ReadonlyArray<TItem>;
	readonly cellHeight: number;
	readonly getKey: (item: TItem, index: number) => TKey;
	readonly renderItem: (state: VirtualGridRenderState<TItem, TKey>) => React.ReactNode;
	readonly overscan?: number;
	readonly apiRef?: React.Ref<VirtualGridApi<TKey>>;
	readonly onVisibleRangeChange?: (range: VirtualGridVisibleRange) => void;
	readonly Event?: React.InstanceProps<ScrollingFrame>["Event"];
	readonly Change?: React.InstanceProps<ScrollingFrame>["Change"];
	readonly slotProps?: VirtualGridSlotProps;
	readonly ref?: React.Ref<ScrollingFrame>;
}

export type VirtualGridProps<TItem = unknown, TKey extends VirtualItemKey = VirtualItemKey> = VirtualGridBaseProps<
	TItem,
	TKey
> &
	VirtualGridColumnProps;

export type { VirtualItemRange, VirtualItemKey, VirtualScrollAlignment };
