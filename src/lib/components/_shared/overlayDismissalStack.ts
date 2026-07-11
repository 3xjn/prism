export interface OverlayBackRecord<TToken = unknown> {
	readonly token: TToken;
	readonly layer: number;
	readonly openedOrder: number;
	readonly dismissible: boolean;
}

function resolveTopmostOverlayBackRecord<TRecord extends OverlayBackRecord>(
	records: readonly TRecord[],
): TRecord | undefined {
	let topmostRecord: TRecord | undefined;

	for (const record of records) {
		if (
			topmostRecord === undefined ||
			record.layer > topmostRecord.layer ||
			(record.layer === topmostRecord.layer && record.openedOrder > topmostRecord.openedOrder)
		) {
			topmostRecord = record;
		}
	}

	return topmostRecord;
}

/**
 * Resolves a back target without skipping a non-dismissible top record. Returning undefined can
 * therefore mean either an empty stack or an intentional barrier at the top of the stack.
 */
export function resolveOverlayBackDismissalTarget<TRecord extends OverlayBackRecord>(
	records: readonly TRecord[],
): TRecord | undefined {
	const topmostRecord = resolveTopmostOverlayBackRecord(records);
	return topmostRecord?.dismissible === true ? topmostRecord : undefined;
}
