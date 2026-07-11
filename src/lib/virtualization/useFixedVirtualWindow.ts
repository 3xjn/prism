import React from "@rbxts/react";

import {
	areVirtualItemRangesEqual,
	resolveFixedVirtualCanvasExtent,
	resolveFixedVirtualViewportRange,
	resolveFixedVirtualViewportScrollOffset,
	type VirtualItemKey,
	type VirtualItemKeyIndex,
} from "./fixedVirtualCollection";
import type {
	FixedVirtualGeometry,
	FixedVirtualRange,
	VirtualItemRange,
	VirtualScrollAlignment,
} from "./_internal/fixedVirtualGeometry";

export interface FixedVirtualWindowApi<TKey extends VirtualItemKey = VirtualItemKey> {
	readonly scrollToIndex: (index: number, alignment?: VirtualScrollAlignment) => boolean;
	readonly scrollToKey: (key: TKey, alignment?: VirtualScrollAlignment) => boolean;
}

export type FixedVirtualGeometryResolver = (viewportSize: Vector2) => FixedVirtualGeometry;

export interface UseFixedVirtualWindowInput<TKey extends VirtualItemKey = VirtualItemKey> {
	readonly geometry: FixedVirtualGeometry | FixedVirtualGeometryResolver;
	readonly keyIndex: VirtualItemKeyIndex<TKey>;
	readonly overscanLines?: number;
	readonly leadingInset?: UDim;
	readonly trailingInset?: UDim;
	readonly apiRef?: React.Ref<FixedVirtualWindowApi<TKey>>;
	readonly onVisibleRangeChange?: (range: VirtualItemRange) => void;
}

export interface FixedVirtualWindowResult {
	readonly viewportSize: Vector2;
	readonly geometry: FixedVirtualGeometry;
	readonly leadingInset: number;
	readonly trailingInset: number;
	readonly canvasExtent: number;
	readonly range: FixedVirtualRange;
	readonly setViewportInstance: (instance: ScrollingFrame | undefined) => void;
}

interface FixedVirtualWindowSnapshot {
	readonly viewportSize: Vector2;
	readonly leadingInset: number;
	readonly trailingInset: number;
	readonly visibleItemRange: VirtualItemRange;
	readonly renderedItemRange: VirtualItemRange;
	readonly ready: boolean;
}

function resolveUDimPixels(value: UDim | undefined, axisExtent: number): number {
	return value === undefined ? 0 : math.max(0, value.Scale * math.max(0, axisExtent) + value.Offset);
}

function resolveInputGeometry(
	source: FixedVirtualGeometry | FixedVirtualGeometryResolver,
	viewportSize: Vector2,
): FixedVirtualGeometry {
	return typeOf(source) === "function"
		? (source as FixedVirtualGeometryResolver)(viewportSize)
		: (source as FixedVirtualGeometry);
}

function snapshotsMatch(left: FixedVirtualWindowSnapshot, right: FixedVirtualWindowSnapshot): boolean {
	return (
		left.viewportSize.X === right.viewportSize.X &&
		left.viewportSize.Y === right.viewportSize.Y &&
		left.leadingInset === right.leadingInset &&
		left.trailingInset === right.trailingInset &&
		left.ready === right.ready &&
		areVirtualItemRangesEqual(left.visibleItemRange, right.visibleItemRange) &&
		areVirtualItemRangesEqual(left.renderedItemRange, right.renderedItemRange)
	);
}

function createSnapshot<TKey extends VirtualItemKey>(
	input: UseFixedVirtualWindowInput<TKey>,
	viewportSize = new Vector2(0, 0),
	physicalScrollOffset = 0,
	ready = false,
): FixedVirtualWindowSnapshot {
	const geometry = resolveInputGeometry(input.geometry, viewportSize);
	const leadingInset = resolveUDimPixels(input.leadingInset, viewportSize.Y);
	const trailingInset = resolveUDimPixels(input.trailingInset, viewportSize.Y);
	const range = resolveFixedVirtualViewportRange(geometry, {
		scrollOffset: physicalScrollOffset,
		viewportExtent: viewportSize.Y,
		overscanLines: input.overscanLines,
		leadingInset,
		trailingInset,
	});

	return {
		viewportSize,
		leadingInset,
		trailingInset,
		visibleItemRange: range.visibleItemRange,
		renderedItemRange: range.renderedItemRange,
		ready,
	};
}

export function useFixedVirtualWindow<TKey extends VirtualItemKey>(
	input: UseFixedVirtualWindowInput<TKey>,
): FixedVirtualWindowResult {
	const inputRef = React.useRef(input);
	const viewportRef = React.useRef<ScrollingFrame>();
	const physicalScrollOffsetRef = React.useRef(0);
	const [viewportInstance, setViewportInstanceState] = React.useState<ScrollingFrame>();
	const [snapshot, setSnapshot] = React.useState<FixedVirtualWindowSnapshot>(() => createSnapshot(input));

	inputRef.current = input;

	const synchronizeViewport = React.useCallback((instance: ScrollingFrame) => {
		const currentInput = inputRef.current;
		const viewportSize = instance.AbsoluteWindowSize;
		const geometry = resolveInputGeometry(currentInput.geometry, viewportSize);
		const leadingInset = resolveUDimPixels(currentInput.leadingInset, viewportSize.Y);
		const trailingInset = resolveUDimPixels(currentInput.trailingInset, viewportSize.Y);
		const canvasExtent = resolveFixedVirtualCanvasExtent(geometry, leadingInset, trailingInset);
		const maxScrollOffset = math.max(0, canvasExtent - viewportSize.Y);
		const rawScrollOffset = instance.CanvasPosition.Y;
		const physicalScrollOffset = math.clamp(rawScrollOffset, 0, maxScrollOffset);
		physicalScrollOffsetRef.current = physicalScrollOffset;

		if (math.abs(rawScrollOffset - physicalScrollOffset) > 0.001) {
			instance.CanvasPosition = new Vector2(instance.CanvasPosition.X, physicalScrollOffset);
		}

		const nextSnapshot = createSnapshot(currentInput, viewportSize, physicalScrollOffset, true);
		setSnapshot((current) => (snapshotsMatch(current, nextSnapshot) ? current : nextSnapshot));
	}, []);

	const setViewportInstance = React.useCallback(
		(instance: ScrollingFrame | undefined) => {
			viewportRef.current = instance;
			setViewportInstanceState((current) => (current === instance ? current : instance));

			if (instance !== undefined) {
				synchronizeViewport(instance);
			} else {
				setSnapshot((current) => (current.ready ? { ...current, ready: false } : current));
			}
		},
		[synchronizeViewport],
	);

	React.useEffect(() => {
		if (viewportInstance === undefined) {
			return;
		}

		synchronizeViewport(viewportInstance);
		const canvasConnection = viewportInstance
			.GetPropertyChangedSignal("CanvasPosition")
			.Connect(() => synchronizeViewport(viewportInstance));
		const sizeConnection = viewportInstance
			.GetPropertyChangedSignal("AbsoluteWindowSize")
			.Connect(() => synchronizeViewport(viewportInstance));

		return () => {
			canvasConnection.Disconnect();
			sizeConnection.Disconnect();
		};
	}, [synchronizeViewport, viewportInstance]);

	React.useEffect(() => {
		const instance = viewportRef.current;
		if (instance !== undefined) {
			synchronizeViewport(instance);
		}
	}, [input.geometry, input.leadingInset, input.overscanLines, input.trailingInset, synchronizeViewport]);

	const scrollToIndex = React.useCallback(
		(index: number, alignment?: VirtualScrollAlignment): boolean => {
			const instance = viewportRef.current;
			if (instance === undefined) {
				return false;
			}

			const currentInput = inputRef.current;
			const viewportSize = instance.AbsoluteWindowSize;
			const geometry = resolveInputGeometry(currentInput.geometry, viewportSize);
			const leadingInset = resolveUDimPixels(currentInput.leadingInset, viewportSize.Y);
			const trailingInset = resolveUDimPixels(currentInput.trailingInset, viewportSize.Y);
			const targetOffset = resolveFixedVirtualViewportScrollOffset(geometry, {
				index,
				viewportExtent: viewportSize.Y,
				currentScrollOffset: instance.CanvasPosition.Y,
				alignment,
				leadingInset,
				trailingInset,
			});

			if (targetOffset === undefined) {
				return false;
			}

			instance.CanvasPosition = new Vector2(instance.CanvasPosition.X, targetOffset);
			synchronizeViewport(instance);
			return true;
		},
		[synchronizeViewport],
	);

	const scrollToKey = React.useCallback(
		(key: TKey, alignment?: VirtualScrollAlignment): boolean => {
			const index = inputRef.current.keyIndex.indexByKey.get(key);
			return index !== undefined ? scrollToIndex(index, alignment) : false;
		},
		[scrollToIndex],
	);

	React.useImperativeHandle(input.apiRef, () => ({ scrollToIndex, scrollToKey }), [scrollToIndex, scrollToKey]);

	const leadingInset = resolveUDimPixels(input.leadingInset, snapshot.viewportSize.Y);
	const trailingInset = resolveUDimPixels(input.trailingInset, snapshot.viewportSize.Y);
	const geometry = resolveInputGeometry(input.geometry, snapshot.viewportSize);
	const range = resolveFixedVirtualViewportRange(geometry, {
		scrollOffset: physicalScrollOffsetRef.current,
		viewportExtent: snapshot.viewportSize.Y,
		overscanLines: input.overscanLines,
		leadingInset,
		trailingInset,
	});
	const visibleRangeStart = range.visibleItemRange.startIndex;
	const visibleRangeEnd = range.visibleItemRange.endIndex;
	const onVisibleRangeChangeRef = React.useRef(input.onVisibleRangeChange);
	onVisibleRangeChangeRef.current = input.onVisibleRangeChange;

	React.useEffect(() => {
		if (snapshot.ready) {
			onVisibleRangeChangeRef.current?.({ startIndex: visibleRangeStart, endIndex: visibleRangeEnd });
		}
	}, [snapshot.ready, visibleRangeEnd, visibleRangeStart]);

	return {
		viewportSize: snapshot.viewportSize,
		geometry,
		leadingInset,
		trailingInset,
		canvasExtent: resolveFixedVirtualCanvasExtent(geometry, leadingInset, trailingInset),
		range,
		setViewportInstance,
	};
}
