# Prism Notification Stack Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Render the provider's visible notification records as a calm, responsive, safe-area-aware screen stack with actions, dismissal, hover pausing, and reduced-motion-respecting presence transitions.

**Architecture:** `NotificationsProvider` mounts one internal stack beside its children. The stack consumes the private snapshot/store context, portals through `ScreenOverlayLayer`, and renders one keyed card per open/closing record. Cards own only visual entry/exit state; the store remains authoritative and receives `finishClose` after the exit duration. Motion uses `CanvasGroup` opacity plus `UIScale` only, avoiding layout-property animation.

**Tech Stack:** rbxts-react, Prism theme/motion/components, Roblox `GuiService.ReducedMotionEnabled`, `ScreenGui.ScreenInsets`, `ScreenOverlayLayer`, UI Labs stories.

---

Execution note: the referenced `superpowers:executing-plans` helper is not installed in this environment, so Codex is applying these steps directly in the isolated `codex/prism-platform-roadmap` worktree. Bead `prism-v2-tc8.3` is the status source of truth.

### Task 1: Add placement and accessibility foundations

**Files:**

- Modify: `src/lib/notifications/types.ts`
- Create: `src/lib/notifications/_internal/useReducedMotion.ts`
- Modify: `src/lib/components/_shared/overlayLayerPolicy.ts`

1. Add six screen-corner/center `NotificationPosition` values plus optional provider `position` and `zIndex` props.
2. Add `DEFAULT_NOTIFICATION_OVERLAY_Z_INDEX = 100`, above default screen overlays and below drag/capture layers.
3. Observe Roblox's native `GuiService.ReducedMotionEnabled` preference with cleanup.
4. Rely on the nearest host `ScreenGui.ScreenInsets` for device/core safe bounds, then add theme edge spacing inside those bounds; do not guess or double-apply raw insets.

### Task 2: Render notification cards

**Files:**

- Create: `src/lib/notifications/_internal/NotificationCard.tsx`
- Create: `src/lib/notifications/styles.ts`

1. Render a restrained surface with semantic accent, optional name/custom icon, title, required message, optional action, and optional close affordance.
2. Primitive title/message values use Prism `Text`; rich elements render directly.
3. Root hover pauses/resumes timed records without making the card itself selectable.
4. Action press runs the callback and dismisses with reason `user` unless `closeOnPress === false`; omitted `closeOnPress` defaults true here.
5. Close press dismisses with reason `user`.
6. Entry uses a short opacity/scale reveal inside an auto-sized wrapper; exit is faster. Reduced motion uses zero-duration transitions and immediate close completion.

### Task 3: Render and integrate the stack

**Files:**

- Create: `src/lib/notifications/_internal/NotificationStack.tsx`
- Modify: `src/lib/notifications/NotificationsProvider.tsx`

1. Consume only the private snapshot/store context.
2. Portal through `ScreenOverlayLayer` at the notification z-index.
3. Place a max-360px stack responsively inside theme edge padding; narrower hosts shrink naturally.
4. Use native list layout for reflow; never animate width, height, or absolute position.
5. Mount the stack inside every provider while keeping it out of the public barrel.

### Task 4: Demonstrate and document behavior

**Files:**

- Create: `src/playground/stories/Notifications.story.tsx`
- Modify: `src/playground/stories/index.ts`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md`
- Modify: `src/lib/notifications/__typecheck__.tsx`

1. Add controls for position and max-visible behavior.
2. Demonstrate success/error, action, update, persistent, burst/queue, dismiss, and clear flows.
3. Display the current native reduced-motion preference and explain that host `ScreenGui.ScreenInsets` defines safe bounds.
4. Document provider placement, duration false, clear sentinels, no singleton, and default action-close behavior.

### Task 5: Verify and land

1. Run test, typecheck, lint, build, and Fallow advisory audit.
2. Launch a read-only QA agent that checks the exact Notifications story, interactions, compiled wiring, native reduced motion, safe-area assumptions, and provider/store integration.
3. Fix blockers, rerun gates, close `prism-v2-tc8.3` and its parent notification epic, export/sync beads, commit, rebase, and push.

### Motion and performance budget

- At most `maxVisible` cards animate (default three).
- Only group transparency and scale animate.
- Entrance uses the theme's normal/out transition; exit uses fast/in.
- Reduced motion settles immediately.
- No bounce, spring, long stagger, blur, or per-frame layout measurement.

### Explicit non-goals

- No process-wide singleton or imperative global notifications object.
- No trigger-anchored overlay coupling.
- No manually created ScreenGui or forced ScreenInsets policy.
- No public `NotificationStack` composition requirement.
