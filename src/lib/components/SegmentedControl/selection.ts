import type { SegmentedControlOption } from "./types";

export type SegmentedControlSelectionDirection = -1 | 1;

/** @internal Finds the next enabled segment in a wrapping horizontal option row. */
export function resolveSegmentedControlSelectionNeighborIndex(
	options: readonly SegmentedControlOption[],
	index: number,
	direction: SegmentedControlSelectionDirection,
): number | undefined {
	if (options.size() <= 1 || index < 0 || index >= options.size()) {
		return undefined;
	}

	for (let step = 1; step < options.size(); step += 1) {
		const candidateIndex = (index + step * direction + options.size()) % options.size();
		if (options[candidateIndex].disabled !== true) {
			return candidateIndex;
		}
	}

	return undefined;
}
