export interface VirtualInventoryTargetAssignmentInput<TSelection> {
	readonly currentSelection: TSelection | undefined;
	readonly lastOwnedSelection: TSelection | undefined;
	readonly targetSelection: TSelection;
	readonly selectionOwned: boolean;
}

export function shouldAssignVirtualInventoryTarget<TSelection>({
	currentSelection,
	lastOwnedSelection,
	targetSelection,
	selectionOwned,
}: VirtualInventoryTargetAssignmentInput<TSelection>): boolean {
	return (
		currentSelection === targetSelection ||
		(selectionOwned && (currentSelection === undefined || currentSelection === lastOwnedSelection))
	);
}

export interface VirtualInventoryRelayAssignmentInput<
	TSelection,
> extends VirtualInventoryTargetAssignmentInput<TSelection> {
	readonly currentSelectionIsInventoryItem: boolean;
}

export function shouldAssignVirtualInventoryRelay<TSelection>(
	input: VirtualInventoryRelayAssignmentInput<TSelection>,
): boolean {
	return (
		!input.currentSelectionIsInventoryItem &&
		shouldAssignVirtualInventoryTarget({
			currentSelection: input.currentSelection,
			lastOwnedSelection: input.lastOwnedSelection,
			targetSelection: input.targetSelection,
			selectionOwned: input.selectionOwned,
		})
	);
}

export interface VirtualInventoryFallbackIndexInput {
	readonly mappedIndex: number | undefined;
	readonly fallbackIsLastOwned: boolean;
	readonly selectionOwned: boolean;
	readonly selectedIndex: number;
}

export function resolveVirtualInventoryFallbackIndex({
	mappedIndex,
	fallbackIsLastOwned,
	selectionOwned,
	selectedIndex,
}: VirtualInventoryFallbackIndexInput): number | undefined {
	return mappedIndex ?? (fallbackIsLastOwned && selectionOwned ? selectedIndex : undefined);
}

export interface VirtualInventoryRollbackSelectionInput<TSelection> {
	readonly capturedSelection: TSelection | undefined;
	readonly capturedSelectionRestorable: boolean;
	readonly fallbackIndex: number | undefined;
	readonly mountedSelection: TSelection | undefined;
	readonly mountedSelectionRestorable: boolean;
}

export function resolveVirtualInventoryRollbackSelection<TSelection>({
	capturedSelection,
	capturedSelectionRestorable,
	fallbackIndex,
	mountedSelection,
	mountedSelectionRestorable,
}: VirtualInventoryRollbackSelectionInput<TSelection>): TSelection | undefined {
	if (fallbackIndex !== undefined && mountedSelection !== undefined && mountedSelectionRestorable) {
		return mountedSelection;
	}
	return capturedSelection !== undefined && capturedSelectionRestorable ? capturedSelection : undefined;
}

export function shouldClearVirtualInventorySelection<TSelection>(
	currentSelection: TSelection | undefined,
	lastOwnedSelection: TSelection | undefined,
	isCurrentInventorySelection = false,
): boolean {
	return currentSelection !== undefined && (currentSelection === lastOwnedSelection || isCurrentInventorySelection);
}
