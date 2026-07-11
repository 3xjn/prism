# Controller-responsive virtual inventory

## Goal

Demonstrate a 10,000-item `VirtualGrid` whose column count follows Prism's `xs`/`sm`/`md`/`lg`/`xl` breakpoints and whose controller focus crosses sparse-window boundaries without leaving Roblox native selection stranded.

## Interaction contract

- Every mounted, enabled inventory cell is a normal Roblox-selectable `Button`.
- Mounted neighbors use explicit native `NextSelection*` links; disabled items are skipped by logical navigation.
- D-pad input is intercepted only when the currently selected inventory cell needs a logical neighbor outside the visible range, including a mounted overscan cell. The story scrolls that index into view and hands `GuiService.SelectedObject` to its callback ref as soon as it is ready.
- Boundary input remains stopped inside the inventory selection group. Input outside an owned inventory selection is never captured.
- Responsive column changes preserve the logical index and re-center only when the selected item leaves the mounted window.

## Showcase and profiling

- Generate 10,000 deterministic inventory records once at module load.
- Resolve columns with `useResponsiveValue({ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 })` against the UI Labs story target.
- Report breakpoint, columns, logical selection, visible range, and the actual mounted content-frame child count.
- Include controller-entry and far-jump actions plus concise native-selection instructions.

## Verification

- Pure assertions cover row-aware direction math, disabled skipping, boundaries, and responsive lane mapping.
- Run test, typecheck, lint, and build.
- In the exact story, verify entry, within-window native movement, an unmounted-boundary handoff, a far jump, resize across at least two breakpoints, stable logical selection, bounded mounted cells, and no runtime errors.
- Finish with a read-only QA pass before closing the bead.
