# Prism Native Overlay Selection Lifecycle Plan

**Goal:** Move Roblox gamepad selection into open Select/Popover/Menu/Modal content and restore it on close without introducing SelectionScope, a provider, or a general overlay runtime.

**Architecture:** One internal hook captures `GuiService.SelectedObject` on an open transition, enters a real mounted overlay subtree only when the player's preferred input is gamepad, and restores the captured target when the overlay closes if Prism still owns selection. Trigger overlays enter only when the captured selection came from their trigger subtree; Modal may enter for any gamepad-open transition. Each consumer provides real refs and native SelectionGroup defaults.

**Tech Stack:** rbxts-react, Roblox `GuiService.SelectedObject`/`GuiService.Select`, `UserInputService.PreferredInput`, native `SelectionGroup` and `SelectionOrder`, Prism selection prop helpers.

---

Bead `prism-v2-jxd.3` is the status source of truth. Roblox documents that `GuiService.Select(parent)` chooses the eligible visible/on-screen descendant with the smallest `SelectionOrder`; this plan uses that native rule rather than building a focus graph.

### Task 1: Add the internal lifecycle hook

**Files:**

- Create: `src/lib/components/_shared/useOverlaySelectionLifecycle.ts`
- Modify: `scripts/run-units-assertions.cjs`

1. Capture the previous selected object once per open session.
2. Manage selection only for `Enum.PreferredInput.Gamepad`.
3. Support trigger-owned entry and unconditional gamepad entry as separate concrete policies.
4. After portal commit, select an eligible preferred target or call `GuiService.Select` on the mounted container.
5. On close/unmount, restore the captured target when still mounted/visible/selectable; otherwise use an eligible fallback trigger; otherwise clear selection.
6. Do not overwrite selection if it has already moved outside the overlay subtree.
7. Isolate and assert pure policy decisions for gamepad gating, trigger ownership, and restore ownership.

### Task 2: Integrate Select

**Files:**

- Modify: `src/lib/components/Select/Select.tsx`
- Modify: `src/lib/components/Select/SelectDropdown.tsx`
- Modify: `src/lib/components/Select/SelectOptionRow.tsx`

1. Track option button refs without exposing a new public wrapper.
2. Prefer the current enabled selected option, then the first enabled option.
3. Give option rows deterministic `SelectionOrder` while preserving raw slot overrides.
4. Make the dropdown list a native SelectionGroup with Stop behavior in every direction.
5. Enter only when the opening gamepad selection belonged to Select's trigger; restore that trigger on close.

### Task 3: Integrate Popover/Menu

**Files:**

- Modify: `src/lib/components/Popover/Popover.tsx`
- Modify: `src/lib/components/Popover/PopoverOverlayPanel.tsx`
- Modify: `src/lib/components/Menu/Menu.tsx` only if Menu-specific preferred targeting is required

1. Treat Popover's mounted panel as the native selection container; Menu inherits this path.
2. Enter only when selection belonged to the trigger subtree and the panel contains an eligible selectable descendant.
3. Default the panel to a Stop SelectionGroup while preserving slot-level native overrides.
4. Restore the exact captured trigger descendant rather than a synthetic wrapper.

### Task 4: Integrate Modal

**Files:**

- Modify: `src/lib/components/Modal/Modal.tsx`

1. Treat the mounted content layer as a Stop SelectionGroup.
2. On a gamepad open transition, call native `GuiService.Select` so the smallest `SelectionOrder` descendant wins (normally an explicit child control or close button).
3. Restore the pre-modal selected target as soon as `opened` becomes false, before visual exit completes.
4. Never trap mouse/touch users or mutate global navigation-enabled settings.

### Task 5: Demonstrate and verify

**Files:**

- Modify: `src/playground/stories/ControllerSelection.story.tsx`
- Modify: `src/playground/stories/Select.story.tsx`
- Modify: `src/playground/stories/Menu.story.tsx`
- Modify: `src/playground/stories/Modal.story.tsx`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md`

1. Add controller instructions and live selected-object labels for enter, navigate, choose/dismiss, and restore flows.
2. Preserve mouse/touch behavior and all public prop contracts.
3. Run unit assertions, typecheck, lint, build, advisory Fallow, and focused read-only QA for each exact story.
4. Fix blockers, rerun hard gates, close `prism-v2-jxd.3`, export/sync beads, commit, rebase, and push.

### Explicit non-goals

- No SelectionScope, focus trap provider, or globally authored directional graph.
- No topmost ButtonB/Escape dismissal in this slice; that remains `prism-v2-jxd.4` and a separate interaction stack.
- No custom SelectionImageObject styling.
- No compound Tabs/SegmentedControl/Stepper/Draggable navigation changes in this slice.
