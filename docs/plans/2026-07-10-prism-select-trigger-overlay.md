# Prism Select Trigger Overlay Migration Plan

**Goal:** Move Select from bespoke portal/layout plumbing onto the proven trigger-anchored and outside-press adapters while preserving its value, scrolling, styling, and slot contracts.

**Architecture:** `Select` keeps value and trigger ownership. `TriggerOverlayLayer` observes trigger bounds, resolves the dropdown anchor, portals to the nearest `LayerCollector`, and converts absolute coordinates once. `SelectDropdown` becomes a portal-free rendered panel inside that shared layer and uses `OutsidePressLayer` for dismissal. No general overlay runtime or provider is introduced.

**Tech Stack:** rbxts-react, Prism TriggerOverlayLayer/OutsidePressLayer, Roblox ScrollingFrame, TypeScript type fixtures, UI Labs stories.

---

Bead `prism-v2-dk6.2.1` is the status source of truth.

### Task 1: Replace Select's bespoke layout shape

**Files:**

- Modify: `src/lib/components/Select/utils.ts`
- Modify: `src/lib/components/Select/Select.tsx`

1. Replace `SelectOverlayLayout` with a placement shape containing only `anchorPosition` and dropdown size.
2. Resolve placement from `TriggerOverlayLayout.bounds`; let `TriggerOverlayLayer` own the portal target, z-index base observation, and local coordinate conversion.
3. Keep the existing bottom placement, minimum trigger-height gap, sizing, and z-index ladder.

### Task 2: Make the dropdown a rendered panel

**Files:**

- Modify: `src/lib/components/Select/SelectDropdown.tsx`
- Modify: `src/lib/components/Select/types.ts`

1. Remove `LayerPortal`, overlay-frame state, and `useOverlayLocalPosition` from `SelectDropdown`.
2. Accept the shared layer's local anchor position and resolved overlay z-index.
3. Add an interaction-only outside catcher behind the list, excluding the full list frame.
4. Add additive `closeOnOutsidePress` and `outsideCapture` slot contracts; default outside dismissal to true.
5. Preserve option rendering, scrolling threshold, visual styles, and all existing slot precedence.

### Task 3: Demonstrate compatibility

**Files:**

- Modify: `src/lib/components/Select/__typecheck__.tsx`
- Modify: `src/playground/stories/Select.story.tsx`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md`

1. Add compile-time examples for the new dismissal switch and slot.
2. Add observable open/dismiss/selection behavior to the exact Select story, including `closeOnOutsidePress=false`.
3. Document that Select shares trigger anchoring and interaction-only outside dismissal with Popover/Menu.
4. Remove the completed Select overlay migration from known debt.

### Task 4: Verify and land

1. Run unit assertions, typecheck, lint, build, diff checks, and the advisory Fallow scan.
2. Launch read-only QA against the exact Select story and compiled component wiring, including long-list scrolling, panel exclusion, trigger re-click, disabled/empty closure, controlled/uncontrolled values, slots, and z-index behavior.
3. Fix blockers, rerun hard gates, close `prism-v2-dk6.2.1` and the overlay epic if its acceptance criteria are complete, export/sync beads, commit, rebase, and push.

### Explicit non-goals

- No selection entry/restoration or controller-back behavior in this migration; those remain dedicated native-selection beads.
- No new placement choices or variable option heights.
- No conversion of Select into Popover composition or a mode-driven overlay component.
