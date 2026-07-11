# Prism Native Selection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expose Roblox-native selection wiring on Prism controls and layout containers without adding a required wrapper, provider, or custom navigation graph.

**Architecture:** Public props mirror the native `GuiObject` selection surface. A small shared helper maps those props onto the component's real interactive instance before `slotProps`, so slots remain the final escape hatch. Layout containers expose native selection-group behavior independently from controls. Overlay entry, restoration, and topmost back dismissal remain separate follow-up slices.

**Tech Stack:** roblox-ts 3, `@rbxts/react` 17, Roblox `GuiObject` selection properties, UI Labs stories, TypeScript type-contract fixtures.

---

Execution note: the referenced `superpowers:executing-plans` helper is not installed in this environment, so Codex is applying these steps directly in the isolated `codex/prism-platform-roadmap` worktree. Bead `prism-v2-jxd.1` is the status source of truth.

### Task 1: Define the native-shaped public contracts

**Files:**

- Create: `src/lib/components/_shared/selection.ts`
- Modify: `src/lib/components/index.ts`

**Steps:**

1. Define `SelectionProps` for `selectable`, `selectionOrder`, and four explicit native neighbors.
2. Define `SelectionGroupProps` for `selectionGroup` and the four `Enum.SelectionBehavior` axes.
3. Add internal helpers that return Roblox property maps without manufacturing refs or mutating `GuiService`.
4. Export the public types from the component barrel while keeping mapping helpers internal.

### Task 2: Wire single-target controls

**Files:**

- Modify: `src/lib/components/Button/{types.ts,Button.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Pressable/{types.ts,Pressable.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Checkbox/{types.ts,Checkbox.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Switch/{types.ts,Switch.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Input/{types.ts,Input.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/KeybindInput/{types.ts,KeybindInput.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Slider/{types.ts,Slider.tsx,__typecheck__.tsx}`

**Steps:**

1. Extend each public prop interface with `SelectionProps`.
2. Apply managed props to the actual interactive native instance (`root`, `textbox`, `trigger`, or `hitbox`).
3. Preserve disabled behavior: disabled controls resolve managed `Selectable` to false.
4. Preserve slot ordering: component slot props are spread last and may intentionally override managed values.
5. Add compile-time examples for selection order, directions, and native neighbor objects.

### Task 3: Wire native layout groups

**Files:**

- Modify: `src/lib/components/Box/{types.ts,Box.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Stack/{types.ts,Stack.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/ScrollArea/{types.ts,ScrollArea.tsx,__typecheck__.tsx}`

**Steps:**

1. Extend each layout interface with `SelectionGroupProps`.
2. Map group and directional behavior to the root native instance.
3. Keep slot props last as the explicit low-level override.
4. Add type-contract examples for all native group directions.

### Task 4: Demonstrate native navigation

**Files:**

- Create: `src/playground/stories/ControllerSelection.story.tsx`
- Modify: `src/playground/stories/index.ts`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md`

**Steps:**

1. Build a compact two-dimensional controller navigation example with explicit native neighbors, a disabled control, a grouped layout, Input, and Slider.
2. Use callback state for neighbor instances so a ref assignment causes the example to rerender.
3. Register the story and document that `ref.current` alone does not trigger a render.
4. State explicitly that Prism delegates focus visuals and navigation to Roblox in this slice.

### Task 5: Verify and land

1. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
2. Run `npm run fallow:audit` and review only new findings.
3. Launch a read-only QA agent that checks the public goal, exact story registration, disabled/slot precedence, and compiled output.
4. Fix blockers and rerun gates.
5. Close `prism-v2-jxd.1`, commit, rebase, sync beads, and push the branch.

### Explicit non-goals

- No `SelectionScope` component or required provider.
- No custom graph solver or global `GuiService` configuration.
- No overlay entry/restoration yet.
- No global B/Escape listener yet.
- No gamepad input added to shared pointer-drag helpers.
