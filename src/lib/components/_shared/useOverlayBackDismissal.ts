import React from "@rbxts/react";

import { resolveOverlayBackDismissalTarget, type OverlayBackRecord } from "./overlayDismissalStack";

const ContextActionService = game.GetService("ContextActionService");

const OVERLAY_BACK_ACTION = "PrismOverlayBackDismissal";
const OVERLAY_BACK_INPUTS: readonly Enum.KeyCode[] = [Enum.KeyCode.ButtonB, Enum.KeyCode.Escape];

interface RuntimeOverlayBackRecord extends OverlayBackRecord<number> {
	readonly dismiss: () => void;
}

export interface UseOverlayBackDismissalOptions {
	readonly opened: boolean;
	readonly dismissible: boolean;
	readonly overlay: GuiObject | undefined;
	readonly onDismiss: () => void;
}

interface OverlayLayerSnapshot {
	readonly overlay: GuiObject;
	readonly layer: number;
}

const activeRecords = new Map<number, RuntimeOverlayBackRecord>();
const activePressDecisions = new Map<InputObject, boolean>();
let nextRecordToken = 0;
let nextOpenedOrder = 0;
let actionBound = false;

function allocateRecordToken(): number {
	nextRecordToken += 1;
	return nextRecordToken;
}

function allocateOpenedOrder(): number {
	nextOpenedOrder += 1;
	return nextOpenedOrder;
}

function collectActiveRecords(): RuntimeOverlayBackRecord[] {
	const records = new Array<RuntimeOverlayBackRecord>();
	for (const [, record] of activeRecords) {
		records.push(record);
	}
	return records;
}

function resolvePressResult(claimed: boolean): Enum.ContextActionResult {
	return claimed ? Enum.ContextActionResult.Sink : Enum.ContextActionResult.Pass;
}

function handleOverlayBackAction(
	_actionName: string,
	inputState: Enum.UserInputState,
	input: InputObject,
): Enum.ContextActionResult {
	const existingDecision = activePressDecisions.get(input);
	if (inputState !== Enum.UserInputState.Begin) {
		if (existingDecision === undefined) {
			return Enum.ContextActionResult.Pass;
		}

		const result = resolvePressResult(existingDecision);
		if (inputState === Enum.UserInputState.End || inputState === Enum.UserInputState.Cancel) {
			activePressDecisions.delete(input);
			unbindActionIfUnused();
		}
		return result;
	}

	if (existingDecision !== undefined) {
		return resolvePressResult(existingDecision);
	}

	const target = resolveOverlayBackDismissalTarget(collectActiveRecords());
	const claimed = target !== undefined;
	activePressDecisions.set(input, claimed);
	if (target !== undefined) {
		target.dismiss();
	}

	return resolvePressResult(claimed);
}

function bindActionIfNeeded(): void {
	if (actionBound || activeRecords.isEmpty()) {
		return;
	}

	ContextActionService.BindActionAtPriority(
		OVERLAY_BACK_ACTION,
		handleOverlayBackAction,
		false,
		Enum.ContextActionPriority.High.Value,
		...OVERLAY_BACK_INPUTS,
	);
	actionBound = true;
}

function unbindActionIfUnused(): void {
	if (!actionBound || !activeRecords.isEmpty() || !activePressDecisions.isEmpty()) {
		return;
	}

	ContextActionService.UnbindAction(OVERLAY_BACK_ACTION);
	actionBound = false;
}

function registerOverlayBackRecord(record: RuntimeOverlayBackRecord): () => void {
	activeRecords.set(record.token, record);
	bindActionIfNeeded();

	return () => {
		if (activeRecords.get(record.token) !== record) {
			return;
		}

		activeRecords.delete(record.token);
		unbindActionIfUnused();
	};
}

function useOverlayLayer(overlay: GuiObject | undefined): number | undefined {
	const [snapshot, setSnapshot] = React.useState<OverlayLayerSnapshot>();

	React.useEffect(() => {
		if (overlay === undefined) {
			setSnapshot(undefined);
			return;
		}

		const updateLayer = () => {
			const layer = overlay.ZIndex;
			setSnapshot((current) =>
				current?.overlay === overlay && current.layer === layer ? current : { overlay, layer },
			);
		};

		updateLayer();
		const connection = overlay.GetPropertyChangedSignal("ZIndex").Connect(updateLayer);
		return () => connection.Disconnect();
	}, [overlay]);

	return snapshot !== undefined && snapshot.overlay === overlay ? snapshot.layer : overlay?.ZIndex;
}

export function useOverlayBackDismissal({
	opened,
	dismissible,
	overlay,
	onDismiss,
}: UseOverlayBackDismissalOptions): void {
	const tokenRef = React.useRef<number>();
	if (tokenRef.current === undefined) {
		tokenRef.current = allocateRecordToken();
	}

	const openedOrderRef = React.useRef(0);
	const wasOpenedRef = React.useRef(false);
	if (opened && !wasOpenedRef.current) {
		openedOrderRef.current = allocateOpenedOrder();
	}
	wasOpenedRef.current = opened;

	const dismissRef = React.useRef(onDismiss);
	dismissRef.current = onDismiss;

	const token = tokenRef.current;
	const openedOrder = openedOrderRef.current;
	const layer = useOverlayLayer(overlay);

	React.useEffect(() => {
		if (!opened || overlay === undefined || layer === undefined) {
			return;
		}

		return registerOverlayBackRecord({
			token,
			layer,
			openedOrder,
			dismissible,
			dismiss: () => dismissRef.current(),
		});
	}, [dismissible, layer, opened, openedOrder, overlay, token]);
}
