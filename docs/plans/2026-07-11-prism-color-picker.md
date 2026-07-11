# Prism ColorPicker Implementation Plan

**Goal:** Add a first-class, theme-driven color editor and use it as the precise visual input for Theme Workbench color tokens.

**Architecture:** `ColorPicker` owns no global state. A controlled or uncontrolled `Color3` is converted through pure HSV/hex/RGB helpers; the saturation/value field and hue rail share Prism's mouse/touch drag rules, while precise fields preserve exact commits. The component remains inline so consumers choose their own popover or panel composition.

## Public behavior

- Support `value`, `defaultValue`, `onChange`, `disabled`, `size`, and `fullWidth`.
- Render a saturation/value field, hue rail, current-color preview, hex input, and RGB inputs.
- Preserve stable controlled semantics, clamp malformed numeric input safely, and restore invalid text to the current value.
- Expose typed root/field/rail/indicator/input slots without introducing a provider, tag, or custom selection graph.
- Keep visual controls selectable and use native Roblox ordering; mouse and touch dragging must share the existing input-capture policy.

## Integration and validation

- Replace Theme Workbench's raw RGB-only token editor with `ColorPicker` while keeping immutable draft updates.
- Add an exact UI Labs story for light/dark, disabled, controlled, and uncontrolled states.
- Assert HSV round trips, hex/RGB parsing, clamping, and formatting in the unit harness.
- Run tests, typecheck, lint, build, Studio visual/interaction QA, and a read-only QA-agent review before closing the bead.
