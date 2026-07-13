# Scoped Diagnostics Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace scattered development-mode checks with a private diagnostics policy that throws in Studio and remains silent in live games.

**Architecture:** A utility-local diagnostics factory resolves a policy once from `RunService:IsStudio()` and creates scoped reporters. Call sites report a code and lazily produced message; the policy chooses `throw`, `warn`, or `ignore`. The initial internal policy uses `throw` in Studio and `ignore` in live games, without a consumer configuration API.

**Tech Stack:** roblox-ts, Luau, Node assertion harness, TypeScript, ESLint.

---

### Task 1: Add a scoped diagnostics primitive and tests

**Files:**
- Create: `src/lib/utils/diagnostics.ts`
- Modify: `scripts/run-units-assertions.cjs`

**Step 1: Write the failing test**

Add harness coverage that loads the diagnostics module with mocked Studio and live `RunService` values. Assert Studio reports throw, production ignores reports, and ignored reports do not evaluate their lazy messages.

**Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because the diagnostics module does not exist.

**Step 3: Write minimal implementation**

Create a private diagnostics factory and scoped `violation(code, message)` interface. Resolve an internal default policy once: `throw` in Studio and `ignore` otherwise.

**Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS, including the new diagnostics checks.

**Step 5: Commit**

```bash
git add src/lib/utils/diagnostics.ts scripts/run-units-assertions.cjs
git commit -m "feat: add scoped diagnostics"
```

### Task 2: Migrate current diagnostics call sites

**Files:**
- Delete: `src/lib/utils/devMode.ts`
- Modify: `src/lib/utils/index.ts`
- Modify: `src/lib/bridge/LuauBridge.tsx`
- Modify: `src/lib/components/_shared/useResolvedStyleProps.ts`

**Step 1: Write the failing test**

Use the diagnostics harness cases to lock the Studio-throw and live-silent policy used by the migrated callers.

**Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL until each caller uses the scoped reporter.

**Step 3: Write minimal implementation**

Remove the public `isDevMode` export. Create `bridge` and `components` scoped reporters, and replace direct `isDevMode`, `warn`, and `error` branches with `violation` calls and stable diagnostic codes.

**Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/bridge/LuauBridge.tsx src/lib/components/_shared/useResolvedStyleProps.ts src/lib/utils/index.ts src/lib/utils/devMode.ts
git commit -m "refactor: route validation through diagnostics"
```

### Task 3: Verify and publish the isolated change

**Files:**
- Modify: `.beads/issues.jsonl`

**Step 1: Run quality gates**

Run: `npm run typecheck`, `npm run lint`, `npm run build`, and `npm test`.

Expected: Every command passes.

**Step 2: Review the final diff**

Confirm only diagnostics code, its tests, the implementation plan, and the tracking issue are staged.

**Step 3: Close and synchronize tracking**

Run: `bd close prism-v2-wau --reason="Scoped diagnostics implemented and validated"` followed by `bd sync`.

**Step 4: Commit and publish**

```bash
git add docs/plans/2026-07-12-scoped-diagnostics.md .beads/issues.jsonl
git commit -m "docs: plan scoped diagnostics"
git push -u origin codex/diagnostics-policy
```

**Step 5: Merge**

Open a pull request, review the final diff, merge it into `master`, and verify the remote branch is up to date.
