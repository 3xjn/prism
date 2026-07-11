import type React from "@rbxts/react";

import type { ConcreteColorValue, ThemeSize } from "@prism/theme";

import type { SelectionGroupProps } from "../_shared/selection";
import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";
import type { VirtualItemRange, VirtualScrollAlignment } from "../../virtualization/_internal/fixedVirtualGeometry";
import type { VirtualItemKey } from "../../virtualization/fixedVirtualCollection";
import type { FixedVirtualWindowApi } from "../../virtualization/useFixedVirtualWindow";

export type VirtualListGapValue = ThemeSize | number;

export interface VirtualListRenderState<TItem, TKey extends VirtualItemKey = VirtualItemKey> {
	readonly item: TItem;
	readonly index: number;
	readonly key: TKey;
	readonly visible: boolean;
}

export interface VirtualListSlots {
	readonly root: ScrollingFrame;
	readonly content: Frame;
	readonly item: Frame;
	readonly sizeConstraint: UISizeConstraint;
}

export type VirtualListSlotProps = RawSlotProps<VirtualListSlots>;

export interface VirtualListStyleProps extends SharedStyleProps {
	readonly gap?: VirtualListGapValue;
	readonly scrollbarSize?: number;
	readonly scrollbarColor?: ConcreteColorValue;
	readonly scrollbarTransparency?: number;
	readonly scrollingEnabled?: boolean;
}

export interface VirtualListApi<TKey extends VirtualItemKey = VirtualItemKey> extends FixedVirtualWindowApi<TKey> {
	readonly scrollToIndex: (index: number, alignment?: VirtualScrollAlignment) => boolean;
	readonly scrollToKey: (key: TKey, alignment?: VirtualScrollAlignment) => boolean;
}

export interface VirtualListProps<TItem = unknown, TKey extends VirtualItemKey = VirtualItemKey>
	extends VirtualListStyleProps, SelectionGroupProps {
	readonly items: ReadonlyArray<TItem>;
	readonly itemHeight: number;
	readonly getKey: (item: TItem, index: number) => TKey;
	readonly renderItem: (state: VirtualListRenderState<TItem, TKey>) => React.ReactNode;
	readonly overscan?: number;
	readonly apiRef?: React.Ref<VirtualListApi<TKey>>;
	readonly onVisibleRangeChange?: (range: VirtualItemRange) => void;
	readonly Event?: React.InstanceProps<ScrollingFrame>["Event"];
	readonly Change?: React.InstanceProps<ScrollingFrame>["Change"];
	readonly slotProps?: VirtualListSlotProps;
	readonly ref?: React.Ref<ScrollingFrame>;
}

export type { VirtualItemRange, VirtualItemKey, VirtualScrollAlignment };
