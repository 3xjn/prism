# Prism Fixed Virtual Range Benchmark Plan

**Goal:** Prove a Prism-native, fixed-geometry windowing engine before committing to public VirtualList and VirtualGrid APIs.

**Architecture:** A pure line/lane geometry module calculates half-open visible and overscanned item ranges in O(1), total canvas extent, grid lane counts, and clamped scroll targets. An internal playground benchmark compares eager mounting with a sparse absolute-position prototype over the same data. The prototype deliberately does not reuse `ScrollArea`, `UIListLayout`, or `UIGridLayout` because those abstractions assume all layout siblings are mounted.

**Tech Stack:** roblox-ts, rbxts-react, Roblox ScrollingFrame, Node assertion harness, UI Labs, MicroProfiler-oriented benchmark notes.

---

Bead `prism-v2-dk6.3.1` is the status source of truth. No public component is exported in this proof slice.

### Task 1: Define the domain and pure engine

**Files:**

- Modify: `CONTEXT.md`
- Create: `src/lib/virtualization/_internal/fixedVirtualGeometry.ts`

1. Define fixed virtual collection, line/lane, visible range, rendered range, and overscan vocabulary.
2. Calculate line count and canvas extent for empty, single-lane, multi-lane, and sparse-final-line inputs.
3. Calculate half-open visible ranges from clamped scroll/viewport geometry, including exact item and gap boundaries.
4. Expand overscan by lines and map line ranges back to item indices.
5. Resolve `nearest`, `start`, `center`, and `end` scroll offsets with bounds clamping.
6. Resolve responsive grid lane count from viewport width, minimum cell width, column gap, and optional maximum.

### Task 2: Lock geometry with deterministic assertions

**Files:**

- Modify: `scripts/run-units-assertions.cjs`

1. Cover empty and zero-sized viewports, first/last lines, negative and over-max offsets, exact gap boundaries, and overscan clamping.
2. Cover multiple lanes, sparse final rows, grid exact-fit and one-pixel-below thresholds.
3. Prove 1,000 and 10,000 items produce the same mounted-window size for identical viewport geometry.
4. Cover every alignment mode plus invalid index behavior.

### Task 3: Build an internal benchmark story

**Files:**

- Create: `src/playground/stories/VirtualizationBenchmark.story.tsx`
- Modify: `src/playground/stories/index.ts`

1. Compare eager and local-window strategies with controls for list/grid shape, 100/1,000/5,000/10,000 items, overscan, and scripted scroll speed.
2. Render realistic row/tile surfaces and report current visible/rendered ranges, mounted GuiObject count proxy, and theoretical window bound.
3. Use a manually sized ScrollingFrame and absolute wrappers for the local prototype; do not use automatic canvas sizing or native sibling layouts for sparse cells.
4. Keep the story explicitly internal/benchmark-oriented so it cannot be mistaken for the final public API.

### Task 4: Record the decision

**Files:**

- Create: `docs/benchmarks/2026-07-10-fixed-virtual-range.md`
- Modify: `ARCHITECTURE.md`

1. Record the algorithm, measurement protocol, environment fields, and expected mounted-window plateau.
2. Document why the current third-party virtualized-list candidate is rejected before a proof: its React dependency line does not match Prism's exact runtime and its upstream benchmark/test work is incomplete.
3. Leave raw Studio/MicroProfiler measurement slots explicit rather than inventing numbers outside a Roblox client run.

### Task 5: Verify and land

1. Run unit assertions, typecheck, lint, build, diff checks, and the advisory Fallow scan.
2. Launch read-only QA against the exact benchmark story and pure geometry wiring.
3. Fix blockers, rerun hard gates, close `prism-v2-dk6.3.1`, export/sync beads, commit, rebase, and push.

### Explicit non-goals

- No public VirtualList or VirtualGrid export in this slice.
- No variable item sizes, measurement cache, true instance recycling, horizontal list, or virtualized Draggable.
- No controller-navigation behavior until the public adapters exist.
- No fabricated benchmark timing or memory results without an actual Studio/device run.
