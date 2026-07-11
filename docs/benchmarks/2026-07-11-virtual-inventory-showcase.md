# Controller-responsive virtual inventory acceptance

**Status:** Accepted in both the exact UI Labs story and a temporary Play Solo `PlayerGui` harness. UI Labs covers responsive geometry, bounded mounting, and its deliberate logical-selection fallback; Play Solo covers native `GuiService.SelectedObject` ownership, offscreen handoff, rollback, focus cancellation, responsive reflow, and teardown.

## Scope

The `Virtual Inventory` story combines the public `VirtualGrid`, Prism responsive hooks, and Roblox-native selection properties over exactly 10,000 fixed-size inventory tiles. It is a showcase, not a second virtualization implementation: range calculation, scrolling, and mounting remain owned by `VirtualGrid`, while the story owns only inventory-specific controller handoff state.

The responsive lane map is:

| Breakpoint | Columns |
| ---------- | ------: |
| `xs`       |       2 |
| `sm`       |       3 |
| `md`       |       4 |
| `lg`       |       6 |
| `xl`       |       8 |

Horizontal navigation stops at row edges, vertical navigation preserves the current column, and movement stops when the corresponding cell does not exist in a sparse final row. The pure assertion harness covers every lane count, all four directions, boundary cells, sparse rows, invalid inputs, and disabled-item skipping.

## Studio observations

Captured on 2026-07-11 in Roblox Studio `0.729.0.7290838` through the exact `Virtual Inventory` UI Labs entry. The story uses an 88-pixel cell, an 8-pixel row gap, two overscan lines, and a 420-pixel viewport. Ranges are half-open.

| Story width | Breakpoint / columns | Logical selection | Visible range  | Mounted roots | Displayed bound | Selection losses |
| ----------: | -------------------- | ----------------: | -------------- | ------------: | --------------: | ---------------: |
|      760 px | `sm` / 3             |                 1 | `[0, 15)`      |            21 |              30 |                0 |
|    1,200 px | `lg` / 6             |                 1 | `[0, 30)`      |            42 |              60 |                0 |
|    1,200 px | `lg` / 6             |             7,778 | `[7764, 7794)` |            54 |              60 |                0 |

The deep jump to item 7,778 completed one logical handoff, retained key `asset-7777`, and stayed below the displayed mount bound. A narrow two-column smoke pass likewise rendered 14 roots against a bound of 20. No runtime errors remained after the final synchronized build.

Because UI Labs is hosted in a `PluginGui`, the story does not attempt an invalid `GuiService.SelectedObject` assignment there. In an actual `PlayerGui`, the selected-only controller binding preserves a logical index while an offscreen target is requested, transfers ownership when that concrete target mounts, verifies it on the next heartbeat, and cancels without stealing focus if selection leaves the inventory. Callback cleanup is guarded by instance identity so an old unmount cannot erase a newer cell.

## PlayerGui Play Solo verification

A temporary client harness mounted the same 10,000-item grid under `PlayerGui` and completed these phases in sequence:

- established native selection and confirmed that the inventory action was bound only while the grid owned selection;
- handed off to a mounted-but-offscreen overscan target at index 15;
- handed off to an unmounted target at index 2,048;
- forced a failed scroll request while replacing the prior instance, then restored the remounted logical selection;
- moved selection to an external control in the same turn as handoff completion and confirmed that the pending request did not steal it back;
- repeated external-focus cancellation during a deep request;
- handed off to the deep target at index 7,777, then reflowed from three to eight columns while preserving its logical key;
- moved focus outside the inventory and unmounted in the same turn, confirming that external focus survived and the inventory action was unbound.

The final client marker was:

```text
PRISM_VIRTUAL_INVENTORY_QA_PASS {"handoffs":7,"selectionLosses":0,"mountedRoots":80,"secondDeepIndex":7777,"items":10000,"externalFocusPreserved":true,"columnsBefore":3,"firstDeepIndex":2048,"actionUnbound":true,"overscanIndex":15,"columnsAfter":8}
```

The harness was removed after verification; the exact story and deterministic assertion suite remain as the permanent regression surfaces.

## Prior timing baseline

The established four-column Play Solo benchmark remains the timing evidence for the public virtual-grid engine; these values are not live measurements from the showcase story:

|  Items | Mount time | Frame p95 | Settled item roots | Missing-root checks |
| -----: | ---------: | --------: | -----------------: | ------------------: |
| 10,000 |  13.664 ms |  6.922 ms |                 28 |             0 / 300 |

See [the fixed virtual range decision](2026-07-10-fixed-virtual-range.md) and its [raw Play Solo capture](raw/2026-07-11-virtualization-play-solo.jsonl) for the full environment, protocol, comparison matrix, and caveats.

## Acceptance result

- The story contains exactly 10,000 stable inventory records and resolves all five column values through Prism responsive hooks.
- Mounted roots remain proportional to the viewport and stayed within the story's conservative bound at every sampled size and deep position.
- Logical selection survived responsive changes and deep jumps with a zero selection-loss count in the exact story.
- Native `PlayerGui` selection completed overscan, unmounted-target, rollback, external-focus cancellation, responsive-reflow, and teardown checks with zero selection losses.
- Native handoff is scoped to this inventory, intercepts only valid offscreen D-pad targets, passes visible mounted-target navigation back to Roblox, and introduces no provider, `SelectionScope`, or global coordinator.
- The benchmark baseline, exact story observations, navigation assertions, and UI Labs host limitation are recorded rather than conflated.
