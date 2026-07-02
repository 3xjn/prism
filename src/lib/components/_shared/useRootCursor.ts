import React from "@rbxts/react";

import { composeEventMaps } from "./interaction";
import type { SharedCursorValue } from "./useResolvedStyleProps";

const RunService = game.GetService("RunService");
const UserInputService = game.GetService("UserInputService");

// MouseIcon writes warn and no-op in Edit mode (plugin security), where
// ui-labs stories render; only drive the cursor inside a running game.
function canApplyMouseCursor(): boolean {
	return RunService.IsRunning() && UserInputService.MouseEnabled;
}

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

	switch (cursor) {
		case "pointer":
			return "rbxasset://SystemCursors/PointingHand";
		case "grab":
			return "rbxasset://SystemCursors/OpenHand";
		case "grabbing":
			return "rbxasset://SystemCursors/ClosedHand";
		case "resize-ew":
			return "rbxasset://SystemCursors/SizeEW";
		case "resize-ns":
			return "rbxasset://SystemCursors/SizeNS";
		case "resize-nesw":
			return "rbxasset://SystemCursors/SizeNESW";
		case "resize-nwse":
			return "rbxasset://SystemCursors/SizeNWSE";
		case "resize-all":
			return "rbxasset://SystemCursors/SizeAll";
		case "split-ew":
			return "rbxasset://SystemCursors/SplitEW";
		case "split-ns":
			return "rbxasset://SystemCursors/SplitNS";
		case "forbidden":
			return "rbxasset://SystemCursors/Forbidden";
		case "wait":
			return "rbxasset://SystemCursors/Wait";
		case "busy":
			return "rbxasset://SystemCursors/Busy";
		case "crosshair":
			return "rbxasset://SystemCursors/Cross";
		default:
			return cursor;
	}
}

function applyActiveMouseCursor(): void {
	const activeClaim = activeCursorClaims[activeCursorClaims.size() - 1];

	if (canApplyMouseCursor()) {
		UserInputService.MouseIcon = activeClaim?.cursor ?? previousMouseCursor ?? "";
	}

	if (activeClaim === undefined) {
		previousMouseCursor = undefined;
	}
}

function acquireMouseCursor(cursor: string): number | undefined {
	if (!canApplyMouseCursor()) {
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
