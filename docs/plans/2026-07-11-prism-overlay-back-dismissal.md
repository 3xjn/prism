# Prism Overlay Back Dismissal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let Escape or gamepad ButtonB dismiss only the visually topmost eligible Prism overlay without consuming gameplay input when no eligible overlay is open.

**Architecture:** A small pure stack policy ranks all active Prism overlay records by rendered ZIndex and open-session order, including non-dismissible records that must act as barriers. One internal React hook shares a single ContextActionService action across Select, Popover/Menu, and Modal; the action dismisses only an eligible top record and otherwise passes without searching lower in the stack, while existing outside-press and backdrop paths continue to own pointer dismissal independently.

**Tech Stack:** rbxts-react, Roblox ContextActionService, Prism trigger/screen overlay adapters, Node assertion harness, TypeScript type-contract fixtures, UI Labs stories.

---

Bead `prism-v2-jxd.4` is the status source of truth. This slice does not introduce a public provider, SelectionScope, selection graph, or global listener per component.

### Task 1: Define and prove topmost stack policy

**Files:**

- Create: `src/lib/components/_shared/overlayDismissalStack.ts`
- Modify: `scripts/run-units-assertions.cjs`

1. Define an internal overlay-back record with a stable token, rendered layer, open-session order, and dismissible state.
2. Resolve only the record with the greatest layer, using the newest open session to break ties.
3. Add deterministic assertions for empty, nested/higher-layer, same-layer/newer, and non-dismissible top barriers that never punch through to lower records.

### Task 2: Add the single conditional input owner

**Files:**

- Create: `src/lib/components/_shared/useOverlayBackDismissal.ts`

1. Keep one module-local active-record registry and one shared ContextActionService action.
2. Bind Escape and ButtonB at high priority only on the empty-to-active-overlay transition; unbind on the active-overlay-to-empty transition.
3. Invoke and sink only when the current topmost record is dismissible; return Pass for a non-dismissible barrier without searching lower.
4. Preserve open order across callback rerenders, refresh the live callback through a ref, and remove the exact record during close, disable, or unmount cleanup.

### Task 3: Integrate explicit eligible consumers

**Files:**

- Modify: `src/lib/components/Select/{types.ts,Select.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Popover/{types.ts,Popover.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Menu/{Menu.tsx,__typecheck__.tsx}`
- Modify: `src/lib/components/Modal/{types.ts,Modal.tsx,__typecheck__.tsx}`

1. Add `closeOnBack?: boolean`, defaulting to true, to the public overlay contracts; Menu inherits the Popover contract and forwards the option.
2. Register Select while its enabled, non-empty dropdown is open; `closeOnBack={false}` keeps the dropdown as a non-dismissible stack barrier.
3. Register Popover/Menu while open and content-backed; hover mode, `closeOnBack={false}`, and controlled Popovers without `onOpenedChange` remain non-dismissible barriers.
4. Register Modal while `opened`; `closeOnBack` controls dismissibility independently from backdrop and close-button policy.
5. Use each mounted overlay panel/content layer's final ZIndex so nested visual ownership matches the existing layering adapters.

### Task 4: Demonstrate nested and opt-out behavior

**Files:**

- Modify: `src/playground/stories/Select.story.tsx`
- Modify: `src/playground/stories/Popover.story.tsx`
- Modify: `src/playground/stories/Menu.story.tsx`
- Modify: `src/playground/stories/Modal.story.tsx`

1. Add `closeOnBack` controls and concise Escape/ButtonB instructions to each exact component story.
2. Put a controlled Menu inside the Modal story so one back input closes the Menu and the next closes the Modal.
3. Keep outside click, trigger activation, item activation, backdrop, and close-button behavior observable and unchanged.

### Task 5: Verify for parent QA

1. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
2. Report the exact files, behavior, and gate results to the parent agent without committing, pushing, or closing the bead.

### Explicit non-goals

- No public overlay runtime or provider.
- No SelectionScope, focus manager, directional graph, or GuiService ownership changes.
- No changes to compound controls, virtual inventory work, pointer geometry, or keyboard activation behavior.
- No persistent input binding when the dismissal stack is empty.
