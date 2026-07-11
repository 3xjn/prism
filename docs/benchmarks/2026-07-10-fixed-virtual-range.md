# Fixed virtual range decision

**Status:** Accepted; deterministic geometry and the full Roblox Studio Play Solo matrix are captured.

**Decision:** Proceed with Prism-native `VirtualList` and `VirtualGrid` adapters over the fixed-geometry engine. Do not add a third-party virtualization dependency. The local window keeps mounted work bounded, has materially better high-count mount and frame results, and produced zero detected blank frames across its 2,400 correctness checks in this run.

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

| Field                                         | Recorded value                                                       |
| --------------------------------------------- | -------------------------------------------------------------------- |
| Git commit                                    | `3450e2d` baseline plus the benchmark runner in this change          |
| Date/time and timezone                        | 2026-07-11 01:35-01:39 -05:00 (America/Chicago)                      |
| Roblox Studio version/channel                 | `0.729.0.7290838`, production channel                                |
| Run mode (`Play Solo`, device emulator, etc.) | Studio Play Solo client                                              |
| OS version                                    | Windows 11 Home `10.0.26200`                                         |
| CPU                                           | AMD Ryzen 7 9800X3D 8-Core Processor                                 |
| GPU                                           | NVIDIA GeForce RTX 5070; AMD Radeon integrated graphics also present |
| System RAM                                    | 31.1 GiB reported by Windows                                         |
| Viewport size and scale                       | Fixed `680 x 320` benchmark viewport; desktop scale not recorded     |
| Studio quality level                          | Studio automatic/default; exact level not recorded                   |
| `@rbxts/react` / `react-roblox` versions      | `17.3.7-ts.1` / `17.3.7-ts.1`                                        |
| MicroProfiler capture duration                | No HTML dump; Stats samples cover 5 x 120 measured frames per row    |

### Studio smoke observations

These are screenshot-sampled functional observations from the session above, not timing or memory measurements. The scripted `6x viewport/s` control remained enabled long enough to move through multiple windows. No empty viewport region was visible in the sampled frames, but the story does not yet count every continuously rendered frame, so this is not a formal zero-blank-frame result.

| Strategy     | Shape |  Items | Sample            | Visible range  | Rendered range | Mounted roots | Theoretical bound | Observation                                                 |
| ------------ | ----- | -----: | ----------------- | -------------- | -------------- | ------------: | ----------------: | ----------------------------------------------------------- |
| Local window | Grid  | 10,000 | Initial           | `[0, 15)`      | `[0, 25)`      |            25 |                40 | Five lanes rendered normally.                               |
| Local window | Grid  | 10,000 | Fast scroll       | `[1045, 1065)` | `[1035, 1075)` |            40 |                40 | Mounted count reached, but did not exceed, the bound.       |
| Local window | Grid  | 10,000 | Later fast scroll | `[1945, 1960)` | `[1935, 1970)` |            35 |                40 | No empty region was visible in the sampled viewport.        |
| Local window | List  | 10,000 | Initial           | `[0, 5)`       | `[0, 7)`       |             7 |                10 | One-lane list rendered normally.                            |
| Local window | List  | 10,000 | Fast scroll       | `[176, 182)`   | `[174, 184)`   |            10 |                10 | No empty region was visible in the sampled viewport.        |
| Eager        | List  |    100 | Initial           | `[0, 5)`       | `[0, 100)`     |           100 |                10 | All roots mounted, as expected for the comparison baseline. |
| Eager        | Grid  |    100 | Initial           | `[0, 15)`      | `[0, 100)`     |           100 |                40 | All roots mounted across five lanes.                        |

### Procedure

1. Build the client runner, then build `virtualization-benchmark.project.json` into a disposable place.
2. Start that place in Play Solo. The runner mounts directly under `PlayerGui`; the UI Labs story is not used for timing.
3. Compare eager mounting and the local sparse-window prototype over identical realistic row/tile surfaces, a fixed `680 x 320` viewport, overscan `2`, and a ping-pong scroll speed of `6x viewport/s`.
4. Run list and grid shapes at 100, 1,000, 5,000, and 10,000 items. Perform three warm-up trials, then five recorded trials per matrix row.
5. Measure mount time with `os.clock()` through two stable client frames, and count item roots, actual `GuiObject` instances, and all instances at or under the dedicated `ContentRoot`, including `ContentRoot` itself.
6. Sample Stats memory before mount, after settled mount, and after unmount while memory tracking is enabled.
7. Collect 120 `Stats.FrameTime` samples per recorded trial and report pooled median, p95, and maximum frame time.
8. Run a separate 60-frame correctness pass per trial. A frame is blank if any expected visible item root is absent; this check does not contaminate the timing pass.
9. Preserve the emitted JSON results and runner configuration as the raw capture.

### Play Solo measurements

The raw configuration and all 16 aggregate result objects are preserved in [`raw/2026-07-11-virtualization-play-solo.jsonl`](raw/2026-07-11-virtualization-play-solo.jsonl). `Mounted GuiObjects` is a settled, pre-scroll snapshot that counts the content root plus every `GuiObject` below it; each realistic item contributes four. The raw `instanceDescendants` field likewise includes `ContentRoot` itself despite its legacy name. `Blank frames` is reported across 300 correctness frames (60 per recorded trial). The artifact preserves aggregate percentiles rather than per-frame samples, so it reconciles the reported matrix but cannot independently recompute those percentiles.

Memory-tag updates and garbage collection are delayed in Studio. A few eager rows therefore report negative before/after Lua or instance-category deltas even though their exact descendant counts increase. Those values are retained rather than sanitized; the decision uses exact mounted counts, mount time, frame percentiles, and the stable positive high-count Lua deltas. Total/category memory deltas are available in the raw JSONL.

| Strategy     | Shape |  Items |  Mount ms | Mounted GuiObjects | Lua heap delta | Frame p50 ms | Frame p95 ms | Frame max ms | Blank frames | Capture   |
| ------------ | ----- | -----: | --------: | -----------------: | -------------: | -----------: | -----------: | -----------: | -----------: | --------- |
| Eager        | List  |    100 |    22.521 |                401 |       0.170 MB |        4.059 |        6.257 |        9.955 |      0 / 300 | JSONL row |
| Eager        | List  |  1,000 |   190.428 |              4,001 |      -2.250 MB |        4.174 |        6.186 |       11.173 |      0 / 300 | JSONL row |
| Eager        | List  |  5,000 | 1,075.888 |             20,001 |       8.382 MB |        5.090 |       10.282 |       22.488 |      0 / 300 | JSONL row |
| Eager        | List  | 10,000 | 3,099.613 |             40,001 |      11.175 MB |       13.074 |       26.157 |       39.898 |      0 / 300 | JSONL row |
| Local window | List  |    100 |    12.237 |                 41 |       0.008 MB |        4.168 |        5.993 |       63.194 |      0 / 300 | JSONL row |
| Local window | List  |  1,000 |    15.442 |                 41 |       0.008 MB |        4.146 |        6.644 |       13.531 |      0 / 300 | JSONL row |
| Local window | List  |  5,000 |    11.169 |                 41 |       0.008 MB |        4.076 |        6.394 |        8.857 |      0 / 300 | JSONL row |
| Local window | List  | 10,000 |    12.970 |                 41 |       0.023 MB |        4.165 |        5.846 |       89.375 |      0 / 300 | JSONL row |
| Eager        | Grid  |    100 |    29.159 |                401 |       1.030 MB |        4.149 |        6.071 |       10.996 |      0 / 300 | JSONL row |
| Eager        | Grid  |  1,000 |   163.111 |              4,001 |       0.621 MB |        4.136 |        6.427 |       10.952 |      0 / 300 | JSONL row |
| Eager        | Grid  |  5,000 | 1,015.631 |             20,001 |      39.987 MB |        4.531 |       10.016 |       16.137 |      0 / 300 | JSONL row |
| Eager        | Grid  | 10,000 | 2,752.954 |             40,001 |      34.585 MB |       14.405 |       23.481 |      114.472 |      0 / 300 | JSONL row |
| Local window | Grid  |    100 |    14.047 |                129 |       0.117 MB |        4.113 |        6.434 |       13.556 |      0 / 300 | JSONL row |
| Local window | Grid  |  1,000 |    13.555 |                113 |       0.101 MB |        4.078 |        6.291 |       12.013 |      0 / 300 | JSONL row |
| Local window | Grid  |  5,000 |    12.987 |                113 |       0.093 MB |        4.078 |        6.659 |        8.683 |      0 / 300 | JSONL row |
| Local window | Grid  | 10,000 |    13.664 |                113 |       0.008 MB |        4.062 |        6.922 |       82.423 |      0 / 300 | JSONL row |

### Interpretation

- At the fixed 30% starting offset, the settled local-list snapshot is 10 roots / 41 GUI objects across 100 through 10,000 items. The settled local-grid snapshot is 28 / 113 from 1,000 through 10,000 and 32 / 129 at 100 items. These table values are not scrolling maxima. Independently, the range formula bounds this fixed 680-pixel, four-lane runner at 10 / 41 for lists and 32 / 129 for grids. The fluid-width five-lane story smoke pass is recorded separately above and reached 40 grid roots.
- At 10,000 items, eager list mounting took 3,099.613 ms with a 26.157 ms frame p95; the local list took 12.970 ms with a 5.846 ms p95. Eager grid took 2,752.954 ms with a 23.481 ms p95; the local grid took 13.664 ms with a 6.922 ms p95.
- The high-count eager rows mounted 40,001 GUI objects and 70,001 content-tree instances including `ContentRoot`. The corresponding local rows mounted 41/113 GUI objects and 71/197 content-tree instances including the root.
- The local strategy had no missing expected visible item root across 2,400 correctness frames at `6x viewport/s`. Eager controls were also 0 / 2,400, producing 0 / 4,800 across the full matrix. This check verifies expected root presence, not rendered pixels.
- Maximum-frame outliers occurred in Studio even on bounded local rows, while their medians and p95 values stayed flat. The decision therefore treats p95 as the stable scrolling signal and retains maxima in the raw evidence for transparency.

## Exit criteria for the public adapters

- Met: settled mounted snapshots stay flat between 1,000 and 10,000 items, and the deterministic range formula keeps all scrolling work within the stated bounds.
- Met: no expected visible item root was missing across 2,400 local-window correctness checks (and 4,800 total matrix checks) at the agreed scripted velocity.
- Met: exact mounted counts, mount time, high-count Lua heap deltas, and frame p95 demonstrate a practical advantage over eager mounting.
- Met: the environment, reproducible client runner, raw JSONL, memory caveat, and Studio max-frame outliers are recorded before the public interface is committed.
