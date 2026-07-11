# Prism Notification Store Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a deterministic, UI-free notification queue that can support a later `NotificationsProvider` and animated stack without exposing store or runtime terminology publicly.

**Architecture:** One internal generic store owns immutable snapshots and private timer metadata. Visible records move through `open` and `closing`; queued records promote FIFO only when capacity is available. Scheduling is injected so every race and lifecycle transition can be tested synchronously without React or Roblox rendering.

**Tech Stack:** roblox-ts 3, plain TypeScript/Luau data structures, `task.delay`, `os.clock`, the existing Node assertion harness.

---

Execution note: the referenced `superpowers:executing-plans` helper is not installed in this environment, so Codex is applying these steps directly in the isolated `codex/prism-platform-roadmap` worktree. Bead `prism-v2-tc8.1` is the status source of truth.

### Task 1: Define the internal lifecycle contract

**File:** `src/lib/notifications/_internal/notificationStore.ts`

1. Define internal scheduler, phase, dismissal-reason, input, record, snapshot, and store interfaces.
2. Keep all exports off the root library barrel until the provider supplies the public seam.
3. Use per-store monotonic IDs and normalize `maxVisible` to an integer of at least one.

### Task 2: Implement queue and lifecycle transitions

1. `show` opens immediately when capacity exists, otherwise queues FIFO.
2. `update` preserves queued position and restarts open timers; closing updates are no-ops.
3. `dismiss` removes queued items immediately or moves open items to `closing` with a reason.
4. `finishClose` removes the closing record and promotes queued work in the same single emission.
5. Lowering capacity never force-closes; raising capacity promotes immediately.
6. `clear` empties the queue and moves all open items to closing without promotion.

### Task 3: Make timing deterministic and race-safe

1. Inject `now()` and a cancellable `schedule()`; default to `os.clock` and `task.delay`.
2. Start timers only for open, non-persistent records.
3. Keep remaining-duration and timer tokens private.
4. `pause` records exact remaining time; `resume` schedules it.
5. Token-check every callback so canceled, late, updated, and reused-ID callbacks are harmless.
6. `destroy` cancels everything, removes listeners, is idempotent, and rejects future `show` calls clearly.

### Task 4: Add exhaustive deterministic assertions

**File:** `scripts/run-units-assertions.cjs`

1. Add a manual scheduler that can advance time and deliberately fire canceled callbacks.
2. Cover generated/explicit IDs, duplicate no-ops, FIFO overflow, promotion timing, close completion, timeout reasons, queued/open/closing updates, timer-reset races, pause/resume, persistent records, clear, capacity changes, listener emission counts, and destruction.
3. Print a distinct `notifications: PASS` marker.

### Task 5: Verify and land

1. Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
2. Run `npm run fallow:audit` and review new findings.
3. Request a read-only state-machine review because this store becomes the provider's correctness boundary.
4. Close `prism-v2-tc8.1`, export/sync beads, commit, rebase, and push.

### Explicit non-goals

- No public notification API yet.
- No React context/provider yet.
- No rendered stack, overlay, motion, safe-area behavior, or actions yet.
- No process-wide singleton or external state dependency.
