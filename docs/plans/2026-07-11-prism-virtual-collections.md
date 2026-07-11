# Prism VirtualList and VirtualGrid Implementation Plan

**Goal:** Turn the measured fixed-geometry proof into small public list/grid APIs whose mounted instance count stays proportional to the viewport, not the dataset.

**Architecture:** Both components use `fixedVirtualGeometry.ts` as the only range/scroll math authority. A shared React hook observes a manually sized `ScrollingFrame`, resolves the sparse rendered range, and publishes an imperative API. `VirtualList` supplies one lane; `VirtualGrid` supplies explicit or viewport-derived lanes. Roblox owns canvas input and scroll physics; Prism only mounts positioned wrappers for the rendered range.

## Shared collection engine

- Track `CanvasPosition`, `AbsoluteWindowSize`, and width changes without per-frame polling.
- Keep range state stable when the half-open indices have not changed.
- Expose `scrollToIndex(index, alignment)` and `scrollToKey(key, alignment)` through an `apiRef`, while the normal component `ref` continues to reference the root `ScrollingFrame`.
- Emit `onVisibleRangeChange` only when the visible item range changes.
- Use consumer keys for React identity and reject duplicate-key ambiguity in development-facing diagnostics.
- Preserve normal Prism style props, native selection-group props, and typed root/content/item slots.

## VirtualList

- Require fixed `itemHeight`; accept `gap`, `overscan`, `items`, `getKey`, and `renderItem`.
- Set an explicit vertical canvas extent and position each rendered row at its geometry-derived Y offset.
- Support empty datasets, viewport resize, dataset shrink, and invalid imperative indices without blank or stale rows.

## VirtualGrid

- Require fixed `cellHeight`; accept either explicit `columns` or `minimumCellWidth` plus optional maximum columns.
- Recompute lanes and cell width from the observed viewport width, preserving a valid range and canvas offset after resize.
- Position each rendered cell from its row/column and keep mounted cells proportional to visible rows × columns plus overscan.

## Validation

- Extend unit coverage for boundaries, alignment, key lookup, resize/lane changes, empty datasets, and dataset shrink.
- Add exact VirtualList and VirtualGrid stories with 10,000-item controls, mounted-count labels, jump-to-index/key actions, and responsive resizing.
- Re-run the measured benchmark assumptions against the public wrappers, then run tests, typecheck, lint, build, Studio interaction QA, and read-only QA review.
