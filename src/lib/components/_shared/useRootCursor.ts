import React from "@rbxts/react";

import { composeEventMaps } from "./interaction";
import type { SharedCursorValue } from "./useResolvedStyleProps";

const UserInputService = game.GetService("UserInputService");

const POINTING_HAND_CURSOR = "rbxasset://SystemCursors/PointingHand";

type EventMapLike = Record<string, unknown>;

interface CursorClaim {
	readonly id: number;
	cursor: string;
}

let activeCursorClaims: CursorClaim[] = [];
let nextCursorClaimId = 0;
let previousMouseCursor: string | undefined;

function resolveMouseCursor(cursor: SharedCursorValue | undefined): string | undefined {
	if (cursor === undefined || cursor === "default") {
		return undefined;
	}

	return cursor === "pointer" ? POINTING_HAND_CURSOR : cursor;
}

function applyActiveMouseCursor(): void {
	const activeClaim = activeCursorClaims[activeCursorClaims.size() - 1];

	if (UserInputService.MouseEnabled) {
		UserInputService.MouseIcon = activeClaim?.cursor ?? previousMouseCursor ?? "";
	}

	if (activeClaim === undefined) {
		previousMouseCursor = undefined;
	}
}

function acquireMouseCursor(cursor: string): number | undefined {
	if (!UserInputService.MouseEnabled) {
		return undefined;
	}

	if (activeCursorClaims.size() === 0) {
		previousMouseCursor = UserInputService.MouseIcon;
	}

	const claimId = nextCursorClaimId;
	nextCursorClaimId += 1;
	activeCursorClaims.push({ id: claimId, cursor });
	applyActiveMouseCursor();
	return claimId;
}

function updateMouseCursor(claimId: number, cursor: string): void {
	let updated = false;

	for (const claim of activeCursorClaims) {
		if (claim.id !== claimId) {
			continue;
		}

		claim.cursor = cursor;
		updated = true;
		break;
	}

	if (updated) {
		applyActiveMouseCursor();
	}
}

function releaseMouseCursor(claimId: number | undefined): void {
	if (claimId === undefined) {
		return;
	}

	const remainingClaims: CursorClaim[] = [];

	for (const claim of activeCursorClaims) {
		if (claim.id !== claimId) {
			remainingClaims.push(claim);
		}
	}

	if (remainingClaims.size() === activeCursorClaims.size()) {
		return;
	}

	activeCursorClaims = remainingClaims;
	applyActiveMouseCursor();
}

export function useRootCursorEvent<TEventMap>(
	eventMap: TEventMap | undefined,
	cursor: SharedCursorValue | undefined,
	disabled = false,
): TEventMap | undefined {
	const claimIdRef = React.useRef<number | undefined>(undefined);
	const resolvedCursor = resolveMouseCursor(cursor);

	React.useEffect(() => {
		if (disabled || resolvedCursor === undefined) {
			releaseMouseCursor(claimIdRef.current);
			claimIdRef.current = undefined;
			return;
		}

		if (claimIdRef.current !== undefined) {
			updateMouseCursor(claimIdRef.current, resolvedCursor);
		}

		return () => {
			releaseMouseCursor(claimIdRef.current);
			claimIdRef.current = undefined;
		};
	}, [disabled, resolvedCursor]);

	const cursorEvents = React.useMemo(() => {
		if (disabled || resolvedCursor === undefined) {
			return undefined;
		}

		const internalEvents: EventMapLike = {
			MouseEnter: () => {
				if (claimIdRef.current === undefined) {
					claimIdRef.current = acquireMouseCursor(resolvedCursor);
					return;
				}

				updateMouseCursor(claimIdRef.current, resolvedCursor);
			},
			MouseLeave: () => {
				releaseMouseCursor(claimIdRef.current);
				claimIdRef.current = undefined;
			},
		};

		return internalEvents;
	}, [disabled, resolvedCursor]);

	return React.useMemo(() => composeEventMaps(cursorEvents, eventMap), [cursorEvents, eventMap]);
}
