# Fixed virtual range decision

**Status:** Pure geometry accepted; Roblox Studio performance measurements pending.

**Decision:** Continue with the Prism-native fixed-geometry engine as the basis for the internal benchmark prototype. Do not add a third-party virtualization dependency, and do not publish `VirtualList` or `VirtualGrid` until the Studio comparison below is captured.

## Scope

This proof covers vertical, fixed-extent collections only. A list is a one-lane collection; a uniform grid uses multiple lanes and may end with a sparse final line. Variable item measurement, horizontal scrolling, instance recycling, virtualized drag-and-drop, and controller navigation are outside this decision.

## Geometry

Given normalized item count `N`, lane count `L >= 1`, item extent `S >= 0`, line gap `G >= 0`, viewport extent `V >= 0`, clamped scroll offset `O`, and overscan line count `K >= 0`:

- `lineCount = ceil(N / L)` for non-empty collections, otherwise `0`.
- `lineStride = S + G`.
- `canvasExtent = lineCount * S + max(lineCount - 1, 0) * G`.
- `maxScrollOffset = max(canvasExtent - V, 0)`.
- `visibleStartLine = floor((O + G) / lineStride)`.
- `visibleEndLine = ceil((O + V) / lineStride)`.
- `renderedStartLine = max(visibleStartLine - K, 0)`.
- `renderedEndLine = min(visibleEndLine + K, lineCount)`.
- A line interval maps to item indices by multiplying by `L` and clamping both ends to `N`.

All ranges are half-open. The `+ G` term in the visible-start formula makes spacing real empty space: a viewport covering only the gap after one line and ending exactly at the next line start has an empty visible range. A zero-sized viewport also produces empty visible and rendered ranges.

The visible-line formulas apply when `S > 0` and `lineStride > 0`; zero-extent items deliberately produce empty ranges.

The range, extent, lane-count, and scroll-alignment calculations are `O(1)` time and `O(1)` auxiliary memory. `nearest` alignment clamps the current offset into the interval between the line's start- and end-aligned targets, which produces the minimum necessary movement and remains stable when a viewport is already inside an oversized item.

For a non-empty viewport and positive item extent, a conservative mounted-item bound is:

```text
L * (ceil((V + S) / (S + G)) + 2K)
```

clamped to `N`. Dataset growth therefore should not increase the mounted window away from collection boundaries.

## Deterministic proof result

The Node assertion harness covers empty collections, zero viewports, negative and over-maximum offsets, exact item/gap boundaries, leading and trailing overscan, multi-lane and sparse-final-line mapping, lane thresholds, all four alignments, oversized items, and invalid indices.

For the fixed test geometry below, both 1,000 and 10,000 items resolve to exactly 36 rendered items:

| Field           |    Value |
| --------------- | -------: |
| Lane count      |        4 |
| Item extent     |    32 px |
| Line gap        |     8 px |
| Viewport extent |   180 px |
| Scroll offset   | 1,000 px |
| Overscan        |  2 lines |
| Rendered lines  |        9 |
| Rendered items  |       36 |

This is a deterministic geometry result, not a Studio timing, memory, or frame-rate measurement.

## Third-party candidate

The current candidate is [`jsdotlua/virtualized-list-lua`](https://github.com/jsdotlua/virtualized-list-lua), exposed to roblox-ts through [`@rbxts/virtualized-list`](https://www.npmjs.com/package/@rbxts/virtualized-list).

It is rejected before an integration proof for this slice:

- The roblox-ts package instructs consumers to install `@rbxts/react-ts`, while Prism pins `@rbxts/react` and `@rbxts/react-roblox` at `17.3.7-ts.1`. Sharing Prism's exact React runtime is a prerequisite, not an assumption.
- The upstream repository still lists porting upstream unit tests and adding performance benchmarks as TODO work.
- Its broader React Native-derived interface and asynchronous fill behavior solve more cases than this fixed-geometry proof needs, increasing integration and blank-window risk before Prism has baseline measurements.

No package is added. This decision can be revisited if a candidate demonstrates exact-runtime compatibility and beats the local prototype under the same protocol.

## Studio measurement protocol

### Environment record

Fill every field from the machine and Studio session used for the capture.

| Field                                         | Recorded value |
| --------------------------------------------- | -------------- |
| Git commit                                    | `0c7923e` baseline plus uncommitted benchmark source |
| Date/time and timezone                        | 2026-07-11 01:18 -05:00 (America/Chicago) |
| Roblox Studio version/channel                 | `0.729.0.7290838`; channel not exposed in the session UI |
| Run mode (`Play Solo`, device emulator, etc.) | UI Labs 1.6.0 edit-mode story preview; not Play Solo |
| OS version                                    | Windows 11 Home `10.0.26200` |
| CPU                                           | AMD Ryzen 7 9800X3D 8-Core Processor |
| GPU                                           | NVIDIA GeForce RTX 5070; AMD Radeon integrated graphics also present |
| System RAM                                    | 31.1 GiB reported by Windows |
| Viewport size and scale                       | UI Labs story panel approximately 945 x 252 px; desktop scale not recorded |
| Studio quality level                          | Not applicable to the edit-mode plugin preview |
| `@rbxts/react` / `react-roblox` versions      | `17.3.7-ts.1` / `17.3.7-ts.1` |
| MicroProfiler capture duration                | **UNMEASURED** |

### Studio smoke observations

These are screenshot-sampled functional observations from the session above, not timing or memory measurements. The scripted `6x viewport/s` control remained enabled long enough to move through multiple windows. No empty viewport region was visible in the sampled frames, but the story does not yet count every continuously rendered frame, so this is not a formal zero-blank-frame result.

| Strategy | Shape | Items | Sample | Visible range | Rendered range | Mounted roots | Theoretical bound | Observation |
| -------- | ----- | ----: | ------ | ------------- | -------------- | ------------: | ----------------: | ----------- |
| Local window | Grid | 10,000 | Initial | `[0, 15)` | `[0, 25)` | 25 | 40 | Five lanes rendered normally. |
| Local window | Grid | 10,000 | Fast scroll | `[1045, 1065)` | `[1035, 1075)` | 40 | 40 | Mounted count reached, but did not exceed, the bound. |
| Local window | Grid | 10,000 | Later fast scroll | `[1945, 1960)` | `[1935, 1970)` | 35 | 40 | No empty region was visible in the sampled viewport. |
| Local window | List | 10,000 | Initial | `[0, 5)` | `[0, 7)` | 7 | 10 | One-lane list rendered normally. |
| Local window | List | 10,000 | Fast scroll | `[176, 182)` | `[174, 184)` | 10 | 10 | No empty region was visible in the sampled viewport. |
| Eager | List | 100 | Initial | `[0, 5)` | `[0, 100)` | 100 | 10 | All roots mounted, as expected for the comparison baseline. |
| Eager | Grid | 100 | Initial | `[0, 15)` | `[0, 100)` | 100 | 40 | All roots mounted across five lanes. |

### Procedure

1. Compare eager mounting and the local sparse-window prototype over identical row/tile data, viewport geometry, and theme.
2. Run list and grid shapes at 100, 1,000, 5,000, and 10,000 items with the same overscan and scripted scroll velocity.
3. Start each trial from a fresh story mount. Perform three warm-up trials, then five recorded trials per matrix row.
4. Record initial mount time from story mount to the first settled rendered frame.
5. Record mounted `GuiObject` count using the same descendant-count proxy for both strategies.
6. Capture Lua heap/total memory before mount, after settled mount, and after unmount.
7. Capture frame time through the scripted scroll interval and report median, p95, and maximum frame time.
8. Record blank-window frames by inspecting whether any viewport region lacks an expected row/tile during scripted scrolling.
9. Preserve the raw MicroProfiler capture and note its filename beside the result row.

### Raw measurement slots

No Roblox client run has been performed for this document. Every performance field intentionally remains explicit and unfilled.

| Strategy     | Shape |  Items | Mount ms       | Mounted GuiObjects | Lua heap delta | Frame p50 ms   | Frame p95 ms   | Frame max ms   | Blank frames   | Capture        |
| ------------ | ----- | -----: | -------------- | ------------------ | -------------- | -------------- | -------------- | -------------- | -------------- | -------------- |
| Eager        | List  |    100 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Eager        | List  |  1,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Eager        | List  |  5,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Eager        | List  | 10,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | List  |    100 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | List  |  1,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | List  |  5,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | List  | 10,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Eager        | Grid  |    100 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Eager        | Grid  |  1,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Eager        | Grid  |  5,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Eager        | Grid  | 10,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | Grid  |    100 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | Grid  |  1,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | Grid  |  5,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |
| Local window | Grid  | 10,000 | **UNMEASURED** | **UNMEASURED**     | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** | **UNMEASURED** |

## Exit criteria for the public adapters

- The local strategy's mounted `GuiObject` count follows the rendered-range bound and plateaus between 1,000 and 10,000 items for identical viewport geometry.
- No blank viewport is observed at the agreed scripted scroll velocities.
- Mount time, memory, and frame-time captures demonstrate a practical advantage over eager mounting at the target collection sizes.
- The benchmark result includes its environment, raw capture references, and any observed tradeoffs before the public interface is committed.
