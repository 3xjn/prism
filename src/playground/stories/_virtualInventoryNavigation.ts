export type VirtualInventoryDirection = "left" | "right" | "up" | "down";

export function resolveVirtualInventoryDirection(keyCodeName: string): VirtualInventoryDirection | undefined {
	switch (keyCodeName) {
		case "DPadLeft":
			return "left";
		case "DPadRight":
			return "right";
		case "DPadUp":
			return "up";
		case "DPadDown":
			return "down";
		default:
			return undefined;
	}
}

export interface VirtualInventoryNavigationInput {
	readonly index: number;
	readonly itemCount: number;
	readonly columns: number;
	readonly direction: VirtualInventoryDirection;
	readonly isDisabled?: (index: number) => boolean;
}

export function resolveVirtualInventoryColumns(breakpoint: string): number {
	switch (breakpoint) {
		case "sm":
			return 3;
		case "md":
			return 4;
		case "lg":
			return 6;
		case "xl":
			return 8;
		case "xs":
		default:
			return 2;
	}
}

export function resolveVirtualInventoryNavigationTarget({
	index,
	itemCount,
	columns,
	direction,
	isDisabled,
}: VirtualInventoryNavigationInput): number | undefined {
	const resolvedItemCount = math.max(0, math.floor(itemCount));
	const resolvedColumns = math.max(1, math.floor(columns));
	if (resolvedItemCount === 0 || index < 0 || index >= resolvedItemCount) {
		return undefined;
	}

	const currentRow = math.floor(index / resolvedColumns);
	const step =
		direction === "left" ? -1 : direction === "right" ? 1 : direction === "up" ? -resolvedColumns : resolvedColumns;
	let candidate = index + step;

	while (candidate >= 0 && candidate < resolvedItemCount) {
		if (direction === "left" || direction === "right") {
			const candidateRow = math.floor(candidate / resolvedColumns);
			if (candidateRow !== currentRow) {
				return undefined;
			}
		}

		if (!(isDisabled?.(candidate) ?? false)) {
			return candidate;
		}
		candidate += step;
	}

	return undefined;
}
