export type DraggableSelectionDirection = -1 | 1;

/** @internal Finds the next enabled item without wrapping past the collection edge. */
export function resolveDraggableSelectionNeighborIndex(
	disabledItems: readonly boolean[],
	index: number,
	direction: DraggableSelectionDirection,
): number | undefined {
	if (index < 0 || index >= disabledItems.size()) {
		return undefined;
	}

	for (
		let candidateIndex = index + direction;
		candidateIndex >= 0 && candidateIndex < disabledItems.size();
		candidateIndex += direction
	) {
		if (!disabledItems[candidateIndex]) {
			return candidateIndex;
		}
	}

	return undefined;
}
