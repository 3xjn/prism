# Prism Design System

## 1. Atmosphere & Identity

Prism is a quiet Roblox application UI kit for focused in-game tools. The signature is restrained utility: soft neutral surfaces, clear semantic color, compact spacing, and overlay layers that feel anchored to the object that opened them.

## 2. Color

### Palette

| Role             | Token                | Light       | Dark        | Usage                                    |
| ---------------- | -------------------- | ----------- | ----------- | ---------------------------------------- |
| Surface/default  | `background.default` | `gray.0`    | not defined | Screen and transparent component backing |
| Surface/elevated | `background.surface` | `#FFFFFF`   | not defined | Cards, popovers, tooltips, modal panels  |
| Text/primary     | `text.primary`       | `gray.9`    | not defined | Primary labels and content               |
| Text/secondary   | `text.secondary`     | `gray.7`    | not defined | Supporting copy                          |
| Text/disabled    | `text.disabled`      | `gray.5`    | not defined | Disabled labels and muted state          |
| Border/subtle    | `border.subtle`      | `gray.2`    | not defined | Gentle separators                        |
| Border/default   | `border.default`     | `gray.4`    | not defined | Standard strokes                         |
| Border/strong    | `border.strong`      | `gray.6`    | not defined | Higher contrast strokes                  |
| Action/hover     | `action.hover`       | `gray.1`    | not defined | Hover backgrounds                        |
| Action/pressed   | `action.pressed`     | `gray.2`    | not defined | Pressed backgrounds                      |
| Intent/primary   | `primary.main`       | `primary.5` | not defined | Primary actions                          |
| Intent/secondary | `secondary.main`     | `blue.5`    | not defined | Secondary actions                        |
| Intent/error     | `error.main`         | `red.5`     | not defined | Error and destructive states             |
| Intent/warning   | `warning.main`       | `yellow.5`  | not defined | Warning states                           |
| Intent/info      | `info.main`          | `blue.5`    | not defined | Informational states                     |
| Intent/success   | `success.main`       | `green.5`   | not defined | Success states                           |

### Rules

- Component code uses theme tokens from `src/lib/theme/defaults.ts`; raw `Color3.fromRGB` belongs in theme definitions or isolated visual assets.
- Accent color is semantic, not decorative.
- Add a theme token before introducing a repeated new visual role.

## 3. Typography

### Scale

| Level   | Size | Weight            | Line Height | Tracking | Usage                |
| ------- | ---- | ----------------- | ----------- | -------- | -------------------- |
| Body/xs | 12   | component-defined | 1.2         | 0        | Compact metadata     |
| Body/sm | 14   | component-defined | 1.4         | 0        | Secondary labels     |
| Body/md | 16   | component-defined | 1.5         | 0        | Default control text |
| Body/lg | 18   | component-defined | 1.5         | 0        | Section labels       |
| Body/xl | 24   | component-defined | 1.5         | 0        | Large headings       |

### Font Stack

- Primary: `Enum.Font.BuilderSans`
- Mono: not defined
- Serif: not used

### Rules

- Use `theme.fontSizes`, `theme.lineHeights`, and `resolveTextFontFace` for component text.
- Text inside compact controls must stay readable and avoid viewport-scaled font sizing.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4 Roblox offset units.

| Token        | Value | Usage                                    |
| ------------ | ----- | ---------------------------------------- |
| `spacing.xs` | 4     | Tight inline gaps                        |
| `spacing.sm` | 8     | Compact padding                          |
| `spacing.md` | 12    | Default control padding and overlay gaps |
| `spacing.lg` | 16    | Roomier groups                           |
| `spacing.xl` | 24    | Large story and panel padding            |

### Grid

- Roblox components use explicit `UDim`, `UDim2`, and `AutomaticSize` rather than a web grid.
- Reusable layout primitives such as `Box` and `Stack` own high-level spacing.

### Rules

- Prefer theme spacing tokens for repeated spacing.
- Fixed offsets are acceptable for geometry-specific assets such as tooltip tails when documented by the owning component.

## 5. Components

### Trigger-Anchored Overlay

- **Structure**: mounted trigger/root instance, portal target lookup, full-layer transparent overlay frame, locally positioned floating surface.
- **Variants**: tooltip bubble, popover panel, menu panel, select dropdown.
- **Spacing**: trigger gap uses component `gap` prop with theme fallback.
- **States**: closed, open, disabled, hover-open, click-open, forced-open.
- **Accessibility**: Roblox input handling remains component-specific; invisible capture layers must not steal interaction unless the overlay is open.
- **Motion**: no default animation yet; future motion must use theme motion tokens.

### Screen Overlay

- **Structure**: invisible portal anchor, full-screen overlay frame, optional backdrop, centered panel.
- **Variants**: modal.
- **Spacing**: panel padding and viewport bounds use theme spacing.
- **States**: closed, open, backdrop-dismissable, forced-open.
- **Accessibility**: close actions remain explicit and backdrop behavior is configurable.
- **Motion**: no default animation yet; future motion must use theme motion tokens.

## 6. Motion & Interaction

### Timing

| Type    | Duration                  | Easing     | Usage                         |
| ------- | ------------------------- | ---------- | ----------------------------- |
| Instant | `motion.duration.instant` | `linear`   | State with no animation       |
| Fast    | `motion.duration.fast`    | `standard` | Press and hover feedback      |
| Normal  | `motion.duration.normal`  | `out`      | Panel and control transitions |
| Slow    | `motion.duration.slow`    | `inOut`    | Emphasized state changes      |

### Rules

- Prefer transform/transparency-style effects over layout mutation when adding animation.
- Every interactive overlay must define how it opens, closes, and handles disabled state.

## 7. Depth & Surface

### Strategy

Prism uses a mixed but restrained strategy: tonal surface shifts plus 1-pixel Roblox strokes for separation. Shadows exist in the theme as stroke-like shadow tokens, not web-style blurred elevation.

| Level     | Token                       | Usage                      |
| --------- | --------------------------- | -------------------------- |
| Subtle    | `shadows.xs`                | Low emphasis controls      |
| Default   | `shadows.sm` / `shadows.md` | Elevated controls          |
| Prominent | `shadows.lg` / `shadows.xl` | Modal and overlay emphasis |

### Rules

- Overlays should feel above the trigger through z-index policy, portal placement, surface color, and stroke clarity.
- Do not add decorative blur, glow, or arbitrary shadows outside the theme.
