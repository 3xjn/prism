import React from "@rbxts/react";

import type { ConcreteColorValue, Theme, ThemeSize } from "@prism/theme";

import { renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { assignRef } from "../_shared/interaction";
import { resolveSelectionGroupProps } from "../_shared/selection";
import {
	reportComponentFailure,
	resolveColorSafe,
	resolveThemeSizeSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import { resolveFixedVirtualGeometry } from "../../virtualization/_internal/fixedVirtualGeometry";
import {
	resolveVirtualItemKeyIndex,
	resolveVirtualItemReactKey,
	type VirtualItemKey,
} from "../../virtualization/fixedVirtualCollection";
import { useFixedVirtualWindow } from "../../virtualization/useFixedVirtualWindow";

import type { VirtualListGapValue, VirtualListProps, VirtualListRenderState } from "./types";

const ZERO_UDIM = new UDim(0, 0);

function isThemeSize(value: VirtualListGapValue): value is ThemeSize {
	return typeIs(value, "string");
}

function resolveGap(theme: Theme, value: VirtualListGapValue | undefined): number {
	if (value === undefined) {
		return 0;
	}

	return isThemeSize(value) ? resolveThemeSizeSafe(theme, "virtualList", value, "spacing", 0) : math.max(0, value);
}

function resolveScrollbarColor(theme: Theme, value: ConcreteColorValue | undefined): Color3 {
	if (value === undefined) {
		return theme.colors.text.disabled;
	}

	if (typeIs(value, "Color3")) {
		return value;
	}

	return resolveColorSafe(theme, "virtualList", value, theme.colors.text.disabled) ?? theme.colors.text.disabled;
}

function resolveRootSize(
	resolvedSize: UDim2 | undefined,
	resolvedWidth: UDim | undefined,
	resolvedHeight: UDim | undefined,
): UDim2 | undefined {
	if (resolvedSize !== undefined) {
		return resolvedSize;
	}
	if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		return new UDim2(resolvedWidth, resolvedHeight);
	}
	if (resolvedWidth !== undefined) {
		return new UDim2(resolvedWidth, ZERO_UDIM);
	}
	if (resolvedHeight !== undefined) {
		return new UDim2(ZERO_UDIM, resolvedHeight);
	}

	return undefined;
}

function formatDuplicateKeySignature(keys: ReadonlySet<VirtualItemKey>): string {
	const labels = new Array<string>();
	for (const key of keys) {
		labels.push(tostring(key));
	}
	labels.sort();
	return labels.join(", ");
}

function VirtualListComponent<TItem, TKey extends VirtualItemKey>(
	props: VirtualListProps<TItem, TKey>,
	ref: React.Ref<ScrollingFrame>,
): React.ReactElement {
	const {
		items,
		itemHeight,
		getKey,
		renderItem,
		overscan = 2,
		apiRef,
		onVisibleRangeChange,
		Event,
		Change,
		slotProps,
	} = props;
	const rootSlotProps = slotProps?.root;
	const contentSlotProps = slotProps?.content;
	const itemSlotProps = slotProps?.item;
	const {
		theme,
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedBackgroundColor,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
	} = useResolvedStyleProps("virtualList", props);
	const gap = resolveGap(theme, props.gap);
	const scrollbarSize = math.max(0, props.scrollbarSize ?? theme.spacing.xs);
	const geometry = React.useMemo(
		() => resolveFixedVirtualGeometry({ itemCount: items.size(), itemExtent: itemHeight, lineGap: gap, laneCount: 1 }),
		[gap, itemHeight, items],
	);
	const keyIndex = React.useMemo(() => resolveVirtualItemKeyIndex(items, getKey), [getKey, items]);
	const duplicateKeySignature = formatDuplicateKeySignature(keyIndex.duplicateKeys);
	const reportedDuplicateKeysRef = React.useRef<string>();

	if (duplicateKeySignature.size() > 0 && reportedDuplicateKeysRef.current !== duplicateKeySignature) {
		reportedDuplicateKeysRef.current = duplicateKeySignature;
		reportComponentFailure(
			"virtualList",
			`getKey returned duplicate keys (${duplicateKeySignature}). Keys must be unique for stable identity and scrollToKey.`,
		);
	} else if (duplicateKeySignature.size() === 0) {
		reportedDuplicateKeysRef.current = undefined;
	}

	const virtualWindow = useFixedVirtualWindow({
		geometry,
		keyIndex,
		overscanLines: overscan,
		leadingInset: paddingTop,
		trailingInset: paddingBottom,
		apiRef,
		onVisibleRangeChange,
	});
	const rootRef = React.useCallback(
		(instance: ScrollingFrame | undefined) => {
			virtualWindow.setViewportInstance(instance);
			assignRef(ref, instance);
		},
		[ref, virtualWindow.setViewportInstance],
	);
	const computedSize = resolveRootSize(resolvedSize, resolvedWidth, resolvedHeight);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootEvent = useRootCursorEvent(Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const resolvedZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const leftInset = paddingLeft ?? ZERO_UDIM;
	const rightInset = paddingRight ?? ZERO_UDIM;
	const contentWidthScale = math.max(0, 1 - leftInset.Scale - rightInset.Scale);
	const contentWidthOffset = -leftInset.Offset - rightInset.Offset - scrollbarSize;
	const renderedStart = math.min(items.size(), virtualWindow.range.renderedItemRange.startIndex);
	const renderedEnd = math.max(renderedStart, math.min(items.size(), virtualWindow.range.renderedItemRange.endIndex));
	const visibleRange = virtualWindow.range.visibleItemRange;
	const renderedItems = new Array<React.ReactElement>();

	for (let index = renderedStart; index < renderedEnd; index += 1) {
		const item = items[index];
		const itemKey = keyIndex.keys[index];
		const visible = index >= visibleRange.startIndex && index < visibleRange.endIndex;
		const renderState: VirtualListRenderState<TItem, TKey> = { item, index, key: itemKey, visible };
		const reactKey = resolveVirtualItemReactKey(keyIndex, index);

		renderedItems.push(
			<frame
				key={reactKey}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromOffset(0, index * geometry.lineStride)}
				Size={new UDim2(1, 0, 0, geometry.itemExtent)}
				Active={false}
				Selectable={false}
				LayoutOrder={index}
				ZIndex={resolvedZIndex}
				{...itemSlotProps}
			>
				{renderItem(renderState)}
			</frame>,
		);
	}

	const rootInstanceProps: Partial<React.InstanceProps<ScrollingFrame>> = {
		...resolveSelectionGroupProps(props),
		Active: props.scrollingEnabled ?? true,
		AutomaticCanvasSize: Enum.AutomaticSize.None,
		BackgroundColor3: resolvedBackgroundColor,
		BackgroundTransparency: props.bgTransparency ?? (props.bg !== undefined ? 0 : 1),
		BorderSizePixel: 0,
		CanvasSize: UDim2.fromOffset(0, virtualWindow.canvasExtent),
		ClipsDescendants: props.clip ?? true,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ScrollBarImageColor3: resolveScrollbarColor(theme, props.scrollbarColor),
		ScrollBarImageTransparency: props.scrollbarTransparency ?? 0.2,
		ScrollBarThickness: scrollbarSize,
		ScrollingDirection: Enum.ScrollingDirection.Y,
		ScrollingEnabled: props.scrollingEnabled ?? true,
		Selectable: false,
		Size: computedSize,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: props.zIndex,
		Event: rootEvent,
		Change,
	};

	return (
		<scrollingframe {...rootInstanceProps} {...rootSlotProps} ref={rootRef}>
			{renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint })}
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={new UDim2(leftInset, new UDim(0, virtualWindow.leadingInset))}
				Size={new UDim2(contentWidthScale, contentWidthOffset, 0, geometry.canvasExtent)}
				Active={false}
				Selectable={false}
				ZIndex={resolvedZIndex}
				{...contentSlotProps}
			>
				{renderedItems}
			</frame>
		</scrollingframe>
	);
}

type VirtualListComponentType = <TItem, TKey extends VirtualItemKey = VirtualItemKey>(
	props: VirtualListProps<TItem, TKey>,
) => React.ReactElement;

const VirtualListBase = React.forwardRef(VirtualListComponent);

VirtualListBase.displayName = "VirtualList";

export const VirtualList = VirtualListBase as VirtualListComponentType;
