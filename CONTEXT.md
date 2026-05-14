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
