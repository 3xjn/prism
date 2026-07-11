# Prism domain context

## UI layering

### Mounted portal anchor

A mounted Roblox `Instance` used to discover the nearest `LayerCollector` for portal mounting. Prefer a real trigger/root instance when the layer naturally has one. If a screen overlay has no natural trigger, it may create an internal invisible anchor; the shared substrate should treat both cases the same.

### Trigger-anchored overlay

A floating Prism surface positioned relative to a trigger instance. It needs nearest `LayerCollector` discovery, trigger bounds measurement, and resubscription when the trigger moves, resizes, or changes ancestry.

Current examples: `Tooltip` and `Select` dropdown.

### Screen overlay

A Prism layer that covers or fills the screen/layer collector rather than anchoring to a trigger instance. It may still need portal mounting and z-index policy, but it does not share trigger bounds placement.

Current example: `Modal` overlay/backdrop.

### Capture overlay

A temporary Prism layer used to capture interaction outside the original instance while an interaction is active.

Current example: `Slider` mouse drag capture.

## Virtual collections

### Fixed virtual collection

A collection whose items share one fixed extent along the scroll axis. Only a rendered range is mounted while the full canvas extent preserves native scrolling. Variable-size measurement and instance recycling are separate problems and are not implied by this term.

### Line and lane

A line is one fixed step along the scroll axis. A lane is one cross-axis position within that line. A vertical list has one lane; a uniform grid has multiple lanes, and its final line may contain fewer items than the lane count.

### Visible range

The half-open item-index interval `[startIndex, endIndex)` whose fixed item rectangles intersect the half-open viewport interval. Spacing between lines is not visible content, so a viewport that touches only a gap has an empty visible range.

### Rendered range

The half-open item-index interval actually mounted by a virtual collection. It contains the visible range plus clamped whole-line overscan and never exceeds the collection's item count.

### Overscan

The number of complete lines mounted before and after the visible line range to absorb normal scroll movement without making mount work proportional to the full dataset.
