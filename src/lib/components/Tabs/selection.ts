import type { TabsTab } from "./types";

export type TabsSelectionDirection = -1 | 1;

/** @internal Finds the next enabled tab in a wrapping horizontal tab row. */
export function resolveTabsSelectionNeighborIndex(
	tabs: readonly TabsTab[],
	index: number,
	direction: TabsSelectionDirection,
): number | undefined {
	if (tabs.size() <= 1 || index < 0 || index >= tabs.size()) {
		return undefined;
	}

	for (let step = 1; step < tabs.size(); step += 1) {
		const candidateIndex = (index + step * direction + tabs.size()) % tabs.size();
		if (tabs[candidateIndex].disabled !== true) {
			return candidateIndex;
		}
	}

	return undefined;
}
