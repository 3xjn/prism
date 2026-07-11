import type React from "@rbxts/react";

import {
	resolveFixedVirtualRange,
	resolveFixedVirtualScrollOffset,
	type FixedVirtualGeometry,
	type FixedVirtualRange,
	type VirtualItemRange,
	type VirtualScrollAlignment,
} from "./_internal/fixedVirtualGeometry";

export type VirtualItemKey = React.Key;

export interface VirtualItemKeyIndex<TKey extends VirtualItemKey = VirtualItemKey> {
	readonly keys: ReadonlyArray<TKey>;
	readonly indexByKey: ReadonlyMap<TKey, number>;
	readonly duplicateKeys: ReadonlySet<TKey>;
	/** Prefix longer than every consumer string key, reserved for duplicate-row React identity. */
	readonly duplicateFallbackPrefix: string;
}

export interface FixedVirtualViewportRangeInput {
	readonly scrollOffset: number;
	readonly viewportExtent: number;
	readonly overscanLines?: number;
	readonly leadingInset?: number;
	readonly trailingInset?: number;
}

export interface FixedVirtualViewportScrollInput {
	readonly index: number;
	readonly viewportExtent: number;
	readonly currentScrollOffset: number;
	readonly alignment?: VirtualScrollAlignment;
	readonly leadingInset?: number;
	readonly trailingInset?: number;
}

function isFiniteNumber(value: number): boolean {
	return value === value && value !== math.huge && value !== -math.huge;
}

function normalizeNonNegative(value: number | undefined): number {
	return value !== undefined && isFiniteNumber(value) ? math.max(0, value) : 0;
}

function clampScrollOffset(scrollOffset: number, maxScrollOffset: number): number {
	if (scrollOffset !== scrollOffset || scrollOffset === -math.huge) {
		return 0;
	}
	if (scrollOffset === math.huge) {
		return maxScrollOffset;
	}

	return math.clamp(scrollOffset, 0, maxScrollOffset);
}

export function areVirtualItemRangesEqual(left: VirtualItemRange, right: VirtualItemRange): boolean {
	return left.startIndex === right.startIndex && left.endIndex === right.endIndex;
}

export function resolveVirtualItemKeyIndex<TItem, TKey extends VirtualItemKey>(
	items: ReadonlyArray<TItem>,
	getKey: (item: TItem, index: number) => TKey,
): VirtualItemKeyIndex<TKey> {
	const keys = new Array<TKey>();
	const indexByKey = new Map<TKey, number>();
	const duplicateKeys = new Set<TKey>();
	let maximumStringKeyLength = 0;

	for (let index = 0; index < items.size(); index += 1) {
		const key = getKey(items[index], index);
		keys.push(key);
		if (typeIs(key, "string")) {
			maximumStringKeyLength = math.max(maximumStringKeyLength, key.size());
		}

		if (duplicateKeys.has(key)) {
			continue;
		}

		if (indexByKey.has(key)) {
			indexByKey.delete(key);
			duplicateKeys.add(key);
			continue;
		}

		indexByKey.set(key, index);
	}

	return {
		keys,
		indexByKey,
		duplicateKeys,
		duplicateFallbackPrefix: string.rep("_", maximumStringKeyLength + 1),
	};
}

/** Resolves a React key that cannot collide with any supplied consumer string or number key. */
export function resolveVirtualItemReactKey<TKey extends VirtualItemKey>(
	keyIndex: VirtualItemKeyIndex<TKey>,
	index: number,
): VirtualItemKey {
	const itemKey = keyIndex.keys[index];
	return keyIndex.duplicateKeys.has(itemKey) ? `${keyIndex.duplicateFallbackPrefix}${index}` : itemKey;
}

/** Resolves only unambiguous consumer keys; duplicate keys deliberately return undefined. */
export function findVirtualItemIndexByKey<TItem, TKey extends VirtualItemKey>(
	items: ReadonlyArray<TItem>,
	getKey: (item: TItem, index: number) => TKey,
	key: TKey,
): number | undefined {
	return resolveVirtualItemKeyIndex(items, getKey).indexByKey.get(key);
}

export function resolveFixedVirtualCanvasExtent(
	geometry: FixedVirtualGeometry,
	leadingInset = 0,
	trailingInset = 0,
): number {
	return normalizeNonNegative(leadingInset) + geometry.canvasExtent + normalizeNonNegative(trailingInset);
}

/**
 * Resolves a fixed range inside a manually padded canvas. Only the portion of the viewport intersecting
 * item content is forwarded to the fixed-geometry engine, so a viewport inside padding stays empty.
 */
export function resolveFixedVirtualViewportRange(
	geometry: FixedVirtualGeometry,
	input: FixedVirtualViewportRangeInput,
): FixedVirtualRange {
	const viewportExtent = normalizeNonNegative(input.viewportExtent);
	const leadingInset = normalizeNonNegative(input.leadingInset);
	const trailingInset = normalizeNonNegative(input.trailingInset);
	const canvasExtent = resolveFixedVirtualCanvasExtent(geometry, leadingInset, trailingInset);
	const maxScrollOffset = math.max(0, canvasExtent - viewportExtent);
	const scrollOffset = clampScrollOffset(input.scrollOffset, maxScrollOffset);
	const contentStart = leadingInset;
	const contentEnd = leadingInset + geometry.canvasExtent;
	const intersectionStart = math.clamp(math.max(scrollOffset, contentStart), contentStart, contentEnd);
	const intersectionEnd = math.clamp(
		math.min(scrollOffset + viewportExtent, contentEnd),
		intersectionStart,
		contentEnd,
	);

	const range = resolveFixedVirtualRange(geometry, {
		scrollOffset: intersectionStart - contentStart,
		viewportExtent: intersectionEnd - intersectionStart,
		overscanLines: input.overscanLines,
	});
	return { ...range, scrollOffset, maxScrollOffset };
}

/** Resolves an item-aligned physical canvas offset while preserving leading/trailing padding. */
export function resolveFixedVirtualViewportScrollOffset(
	geometry: FixedVirtualGeometry,
	input: FixedVirtualViewportScrollInput,
): number | undefined {
	const viewportExtent = normalizeNonNegative(input.viewportExtent);
	const leadingInset = normalizeNonNegative(input.leadingInset);
	const trailingInset = normalizeNonNegative(input.trailingInset);
	const canvasExtent = resolveFixedVirtualCanvasExtent(geometry, leadingInset, trailingInset);
	const maxScrollOffset = math.max(0, canvasExtent - viewportExtent);
	const currentScrollOffset = clampScrollOffset(input.currentScrollOffset, maxScrollOffset);
	const alignment = input.alignment ?? "nearest";
	const relativeTarget = resolveFixedVirtualScrollOffset(geometry, {
		index: input.index,
		viewportExtent,
		currentScrollOffset: currentScrollOffset - leadingInset,
		alignment,
	});

	if (relativeTarget === undefined) {
		return undefined;
	}

	if (alignment !== "nearest") {
		return math.clamp(relativeTarget + leadingInset, 0, maxScrollOffset);
	}

	const line = math.floor(input.index / geometry.laneCount);
	const lineStart = leadingInset + line * geometry.lineStride;
	const startTarget = lineStart;
	const endTarget = lineStart + geometry.itemExtent - viewportExtent;
	const nearestTarget = math.clamp(
		currentScrollOffset,
		math.min(startTarget, endTarget),
		math.max(startTarget, endTarget),
	);
	return math.clamp(nearestTarget, 0, maxScrollOffset);
}
