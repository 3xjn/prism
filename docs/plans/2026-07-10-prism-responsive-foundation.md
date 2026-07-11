# Prism Responsive Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add configurable MUI-style `xs`/`sm`/`md`/`lg`/`xl` breakpoints plus reactive hooks for responsive values and Roblox preferred input.

**Architecture:** Theme data owns an immutable ordered breakpoint table. Pure resolution helpers choose the active breakpoint and mobile-first inherited value; React hooks only subscribe to a supplied `GuiBase2d.AbsoluteSize` or the current camera viewport and delegate to those helpers. The first release stays hook-driven and does not widen every Prism prop or introduce a required provider.

**Tech Stack:** roblox-ts 3, `@rbxts/react` 17, Roblox `Workspace`/`UserInputService`, UI Labs stories, TypeScript type contracts, Node assertion harness.

---

Execution note: the referenced `superpowers:executing-plans` helper is not installed in this environment, so Codex is applying the same test-first steps directly in the isolated `codex/prism-platform-roadmap` worktree. Bead `prism-v2-dk6.1` is the status source of truth.

### Task 1: Extend the immutable theme with breakpoint values

**Files:**

- Modify: `src/lib/theme/types.ts`
- Modify: `src/lib/theme/defaults.ts`
- Modify: `src/lib/theme/ThemeProvider.tsx`
- Modify: `src/lib/theme/index.ts`

**Step 1: Add the public breakpoint types**

```ts
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
export type ThemeBreakpoints = Readonly<Record<Breakpoint, number>>;
export type PartialThemeBreakpoints = Readonly<Partial<Record<Breakpoint, number>>>;
```

Add `breakpoints: ThemeBreakpoints` to `Theme` and `breakpoints?: PartialThemeBreakpoints` to `ThemeOverride`.

**Step 2: Add MUI-compatible defaults**

```ts
breakpoints: table.freeze({ xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }),
```

These are content-fit thresholds, not device detection.

**Step 3: Merge overrides without mutating defaults**

Add a `mergeBreakpoints` helper in `ThemeProvider.tsx` that preserves each default when an override key is absent, freezes the result, and adds it to the merged theme.

**Step 4: Export the new types**

Export `Breakpoint`, `ThemeBreakpoints`, and `PartialThemeBreakpoints` from `@prism/theme`.

**Step 5: Run the type checker**

Run: `npm run typecheck`

Expected: PASS after every `Theme` construction includes `breakpoints`.

### Task 2: Build and test pure responsive resolution

**Files:**

- Create: `src/lib/responsive/types.ts`
- Create: `src/lib/responsive/resolve.ts`
- Modify: `scripts/run-units-assertions.cjs`

**Step 1: Write failing assertions**

Extend the Node harness to load `responsive/resolve.ts` and assert:

- Exact default boundaries: 0→xs, 600→sm, 900→md, 1200→lg, 1536→xl.
- Values immediately below each boundary stay at the previous tier.
- Negative/non-finite widths safely resolve to `xs`.
- Custom threshold tables are honored.
- Sparse responsive values inherit from the nearest defined smaller tier.
- Object values retain identity rather than being cloned.

Run: `npm test`

Expected: FAIL because the responsive module does not exist.

**Step 2: Add the shared types**

```ts
export type ResponsiveValue<T> = Readonly<{ xs: T } & Partial<Record<Exclude<Breakpoint, "xs">, T>>>;
```

Requiring `xs` guarantees that `useResponsiveValue` always returns `T`.

**Step 3: Implement the pure helpers**

```ts
export const BREAKPOINT_ORDER = ["xs", "sm", "md", "lg", "xl"] as const;

export function resolveBreakpoint(width: number, breakpoints: ThemeBreakpoints): Breakpoint;
export function resolveResponsiveValue<T>(values: ResponsiveValue<T>, breakpoint: Breakpoint): T;
```

`resolveBreakpoint` walks thresholds in ascending semantic order. `resolveResponsiveValue` walks backward from the active tier until it finds a defined value.

**Step 4: Run assertions**

Run: `npm test`

Expected: PASS with a new `responsive: PASS` line.

### Task 3: Add reactive viewport and input hooks

**Files:**

- Create: `src/lib/responsive/useViewportWidth.ts`
- Create: `src/lib/responsive/useBreakpoint.ts`
- Create: `src/lib/responsive/useResponsiveValue.ts`
- Create: `src/lib/responsive/usePreferredInput.ts`

**Step 1: Implement target-aware width measurement**

```ts
export interface ResponsiveTargetOptions {
	readonly target?: GuiBase2d;
}
```

When `target` is supplied, read and subscribe to `target.AbsoluteSize.X`. Otherwise subscribe to `Workspace.CurrentCamera`, reconnect when the camera changes, and observe `ViewportSize.X`. Clean up every connection on dependency changes and unmount.

**Step 2: Implement `useBreakpoint`**

Read `theme.breakpoints`, observe the width, and memoize `resolveBreakpoint`.

**Step 3: Implement `useResponsiveValue`**

Resolve the active breakpoint through `useBreakpoint(options)` and return the mobile-first inherited value.

**Step 4: Implement `usePreferredInput`**

Initialize from `UserInputService.PreferredInput`, subscribe through `GetPropertyChangedSignal("PreferredInput")`, and return the native `Enum.PreferredInput` item.

### Task 4: Export and type-check the public interface

**Files:**

- Create: `src/lib/responsive/index.ts`
- Create: `src/lib/responsive/__typecheck__.tsx`
- Modify: `src/lib/index.ts`

**Step 1: Add compile-time contracts**

Cover:

- `xs` is required for responsive values.
- Generic inference preserves strings, numbers, objects, and unions.
- `target` accepts `GuiBase2d` and rejects unrelated instances.
- `usePreferredInput` returns `Enum.PreferredInput`.
- Theme breakpoint overrides accept only `xs`–`xl` numeric keys.

**Step 2: Export the interface**

Export `useBreakpoint`, `useResponsiveValue`, `usePreferredInput`, resolver helpers, and their public types through `@prism` and `@prism/responsive`.

**Step 3: Run type checking**

Run: `npm run typecheck`

Expected: PASS.

### Task 5: Add the responsive playground story

**Files:**

- Create: `src/playground/stories/Responsive.story.tsx`
- Modify: `src/playground/stories/index.ts`

**Step 1: Build a target-measured story**

Pass the UI Labs `props.target` instance into the responsive hooks so resizing the preview widget changes the active breakpoint. Demonstrate:

- Current width and active breakpoint.
- A mobile-first responsive column count.
- Vertical-to-horizontal structural layout change.
- Native preferred-input reporting.
- The same composition in light and dark story themes.

Keep the presentation calm and developer-tool oriented; use one realistic settings/inventory composition rather than a repeated card grid.

**Step 2: Register the story**

Import `./Responsive.story` from the story index.

### Task 6: Document semantics and verify the slice

**Files:**

- Modify: `README.md`
- Modify: `ARCHITECTURE.md`

**Step 1: Document responsive behavior**

Explain:

- Default and customizable `xs`–`xl` thresholds.
- Mobile-first inheritance.
- `target` measurement for embedded panels and UI Labs.
- Camera viewport fallback for ordinary ScreenGui applications.
- `usePreferredInput` for input adaptation.
- Why the first release does not accept responsive objects on every Prism prop.
- Native `StyleQuery` remains appropriate for stylesheet/container-query use cases.

**Step 2: Run all quality gates**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: all PASS.

**Step 3: Run read-only QA**

The QA agent verifies breakpoint boundaries, target resizing, camera fallback reasoning, preferred-input reactivity, story registration, theme override merging, and user-facing documentation.

**Step 4: Commit, sync, and push**

Stage only responsive/theme/story/docs/plan/bead changes, commit intentionally, rebase, `bd sync`, push `codex/prism-platform-roadmap`, and verify the branch is up to date with origin.
