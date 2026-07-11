# Prism Notifications Provider Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expose a React-first `NotificationsProvider` and stable `useNotifications` action API over the proven internal queue, without a singleton or public store/runtime terminology.

**Architecture:** A pure internal adapter resolves public notification options into store data and merges partial updates. Each provider lazily creates one store, publishes a stable action-only context, and keeps the changing snapshot in a separate internal context for the later rendered stack. This prevents every notification mutation from rerendering action-only consumers and preserves nested-provider independence.

**Tech Stack:** roblox-ts 3, `@rbxts/react` 17, the internal notification store, existing Prism semantic colors/icons/type-contract fixtures.

---

Execution note: the referenced `superpowers:executing-plans` helper is not installed in this environment, so Codex is applying these steps directly in the isolated `codex/prism-platform-roadmap` worktree. Bead `prism-v2-tc8.2` is the status source of truth.

### Task 1: Define the public notification model

**File:** `src/lib/notifications/types.ts`

1. Define `NotificationId`, `NotificationDuration = number | false`, `NotificationAction`, `NotificationOptions`, `NotificationUpdate`, `NotificationsApi`, and provider props.
2. Require `message` for `show`; keep update presentation fields partial.
3. Use `false` for persistent duration and for explicitly clearing icon/action because Luau cannot distinguish omitted keys from `nil`.
4. Support semantic intent colors, Prism icon names, rich React elements, and string/number action labels.

### Task 2: Build a pure API adapter

**File:** `src/lib/notifications/_internal/notificationsApi.ts`

1. Resolve show defaults: `color: "info"`, close button enabled, provider duration.
2. Merge update patches with the current queued/open record while preserving omitted values.
3. Map `false` duration to a persistent store record and false icon/action to cleared data.
4. Keep `pause`, `resume`, `finishClose`, snapshots, and dismissal reasons internal for the later stack.
5. Freeze the public action object so consumers get stable method identities.

### Task 3: Implement provider and contexts

**Files:**

- Create: `src/lib/notifications/_internal/notificationContext.ts`
- Create: `src/lib/notifications/NotificationsProvider.tsx`

1. Lazily create one store per mounted provider.
2. Keep the default duration in a ref so the action context remains stable across provider renders.
3. Subscribe before synchronizing `getSnapshot()` to close the render/effect race.
4. Apply `maxVisible` prop changes through the store.
5. On cleanup, unsubscribe before destroying the store.
6. Throw a clear error when `useNotifications` is called outside a provider.
7. Keep action and internal snapshot contexts separate; nested providers naturally remain independent.

### Task 4: Export and prove the interface

**Files:**

- Create: `src/lib/notifications/index.ts`
- Create: `src/lib/notifications/__typecheck__.tsx`
- Modify: `src/lib/index.ts`
- Modify: `scripts/run-units-assertions.cjs`

1. Export only the public provider, hook, API, and public types from the root package.
2. Add type contracts for required message, valid rich content/icons/actions, duration false, invalid colors/durations, provider props, and method return types.
3. Test the pure adapter with two stores: defaults, persistent duration, patch preservation, false clears, same generated IDs, and dismiss/clear isolation.

### Task 5: Verify and continue to the rendered stack

1. Run test, typecheck, lint, build, and Fallow advisory audit.
2. Request a read-only provider/API review.
3. Close `prism-v2-tc8.2`; keep the notification epic open for `tc8.3`.
4. Proceed directly to the rendered stack, which will consume the internal context inside this provider.

### Explicit non-goals

- No process-wide singleton.
- No public store, snapshot, pause/resume, finish-close, or dismissal-reason surface.
- No overlay target or theme wrapper prop.
- No rendered notification UI until `prism-v2-tc8.3`.
