# Prism Outside-Press Layer Implementation Plan

**Goal:** Separate invisible outside-press dismissal from Prism's visual `Backdrop` without changing Popover or Menu's public behavior.

**Architecture:** A pure shared geometry module decides whether a pointer point falls inside an excluded rectangle. A small internal `OutsidePressLayer` owns the full-screen, non-selectable input catcher and composes consumer events with one-shot exclusion handling. Popover uses that adapter instead of rendering a zero-opacity visual Backdrop; Modal keeps using Backdrop because it needs a visible dimming surface.

**Tech Stack:** rbxts-react, Roblox GUI input events, Prism trigger overlay adapter, Node assertion harness, UI Labs stories.

---

Bead `prism-v2-dk6.2.2` is the status source of truth. This is deliberately not a focus manager, overlay registry, or controller-back implementation; those remain dedicated native-selection work.

### Task 1: Extract pure outside-press geometry

**Files:**

- Create: `src/lib/components/_shared/outsidePress.ts`
- Modify: `src/lib/components/Backdrop/types.ts`
- Modify: `scripts/run-units-assertions.cjs`

1. Define a shared excluded-rectangle type and pure point-in-rectangle helpers.
2. Preserve `BackdropExcludeRect` as a public alias so existing consumers compile unchanged.
3. Add deterministic assertions for edges, anchored UDim2 rectangles, instance rectangles, and multiple exclusions.

### Task 2: Add the internal interaction adapter

**Files:**

- Create: `src/lib/components/_shared/OutsidePressLayer.tsx`

1. Render a full-screen transparent `TextButton` behind the consumer panel.
2. Keep it `Selectable={false}` so it never enters controller navigation.
3. Accept one or more excluded `GuiObject`s, a z-index, existing raw slot props, and an outside-press callback.
4. Arm exclusion on pointer/touch press begin and suppress the corresponding activation exactly once.
5. Compose consumer event callbacks without allowing slot props to silently remove the adapter's behavior.

### Task 3: Prove the seam with Popover and Menu

**Files:**

- Modify: `src/lib/components/Popover/PopoverOverlayPanel.tsx`
- Modify: `src/playground/stories/Popover.story.tsx`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md`

1. Replace Popover's opacity-zero Backdrop with `OutsidePressLayer`.
2. Preserve the existing `outsideCapture` slot name and its z-index/instance-property escape hatch; Menu inherits the behavior through Popover.
3. Keep hover popovers free of the outside catcher, while controlled manual popovers retain their existing `closeOnOutsidePress` behavior.
4. Update the story and architecture prose to describe interaction capture separately from visual dimming.

### Task 4: Verify and land

1. Run unit assertions, typecheck, lint, build, and the advisory Fallow scan.
2. Launch read-only QA against both Popover and Menu, explicitly checking outside dismissal, panel interaction, trigger re-click, external trigger events, and controller non-selection.
3. Fix blockers, rerun hard gates, close `prism-v2-dk6.2.2`, export/sync beads, commit, rebase, and push.

### Explicit non-goals

- No public monolithic Overlay component or mode switch.
- No overlay registry, focus trap, selection restoration, or controller-back stack in this slice.
- No Select migration yet; it follows after this interaction seam is proven.
- No behavior change to visual Backdrop or Modal.
