import React from "@rbxts/react";

import type { VirtualGridApi, VirtualGridVisibleRange, VirtualScrollAlignment } from "@prism";

import {
	resolveVirtualInventoryDirection,
	resolveVirtualInventoryNavigationTarget,
} from "./_virtualInventoryNavigation";
import {
	resolveVirtualInventoryFallbackIndex,
	resolveVirtualInventoryRollbackSelection,
	shouldAssignVirtualInventoryRelay,
	shouldAssignVirtualInventoryTarget,
	shouldClearVirtualInventorySelection,
} from "./_virtualInventorySelectionPolicy";

const ContextActionService = game.GetService("ContextActionService");
const GuiService = game.GetService("GuiService");
const RunService = game.GetService("RunService");

const DPAD_INPUTS: readonly Enum.KeyCode[] = [
	Enum.KeyCode.DPadLeft,
	Enum.KeyCode.DPadRight,
	Enum.KeyCode.DPadUp,
	Enum.KeyCode.DPadDown,
];

let nextInventoryActionId = 0;

function canAssignGuiServiceSelection(instance: GuiObject): boolean {
	return instance.FindFirstAncestorWhichIsA("PlayerGui") !== undefined;
}

interface PendingSelectionHandoff {
	readonly requestId: number;
	readonly targetIndex: number;
	readonly previousIndex: number;
	readonly fallbackSelection: GuiObject | undefined;
	readonly fallbackIndex: number | undefined;
}

interface VirtualInventorySelectionOptions {
	readonly itemCount: number;
	readonly columns: number;
	readonly visibleRange: VirtualGridVisibleRange;
	readonly apiRef: { readonly current: VirtualGridApi<string> | undefined };
}

function isVisibleIndex(index: number, range: VirtualGridVisibleRange): boolean {
	return index >= range.startIndex && index < range.endIndex;
}

function isRestorableSelectionTarget(instance: GuiObject | undefined): instance is GuiObject {
	return (
		instance !== undefined &&
		instance.Parent !== undefined &&
		instance.Visible &&
		instance.Selectable &&
		canAssignGuiServiceSelection(instance)
	);
}

export interface VirtualInventorySelectionController {
	readonly selectedIndex: number;
	readonly selectionActive: boolean;
	readonly pendingIndex: number | undefined;
	readonly handoffCount: number;
	readonly selectionLossCount: number;
	readonly mountedRevision: number;
	readonly relayActive: boolean;
	readonly setRelayInstance: (instance: TextButton | undefined) => void;
	readonly getItemRef: (index: number) => (instance: TextButton | undefined) => void;
	readonly getMountedInstance: (index: number | undefined) => TextButton | undefined;
	readonly requestSelection: (index: number, alignment?: VirtualScrollAlignment) => boolean;
}

export function useVirtualInventorySelection({
	itemCount,
	columns,
	visibleRange,
	apiRef,
}: VirtualInventorySelectionOptions): VirtualInventorySelectionController {
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [selectionActive, setSelectionActive] = React.useState(false);
	const [pendingIndex, setPendingIndex] = React.useState<number>();
	const [handoffCount, setHandoffCount] = React.useState(0);
	const [selectionLossCount, setSelectionLossCount] = React.useState(0);
	const [mountedRevision, setMountedRevision] = React.useState(0);
	const [relayActive, setRelayActive] = React.useState(false);
	const [relayInstance, setRelayInstanceState] = React.useState<TextButton>();

	const actionNameRef = React.useRef<string>();
	if (actionNameRef.current === undefined) {
		nextInventoryActionId += 1;
		actionNameRef.current = `PrismVirtualInventory${nextInventoryActionId}`;
	}
	const actionName = actionNameRef.current;
	const mountedRef = React.useRef(true);
	const itemCountRef = React.useRef(itemCount);
	const columnsRef = React.useRef(columns);
	const visibleRangeRef = React.useRef(visibleRange);
	const selectedIndexRef = React.useRef(selectedIndex);
	const selectionOwnedRef = React.useRef(false);
	const lastOwnedSelectionRef = React.useRef<GuiObject>();
	const relayInstanceRef = React.useRef<TextButton>();
	const instanceByIndexRef = React.useRef(new Map<number, TextButton>());
	const indexByInstanceRef = React.useRef(new Map<GuiObject, number>());
	const itemRefCallbacksRef = React.useRef(new Map<number, (instance: TextButton | undefined) => void>());
	const pendingRef = React.useRef<PendingSelectionHandoff>();
	const nextRequestIdRef = React.useRef(0);
	const refRevisionScheduledRef = React.useRef(false);

	itemCountRef.current = itemCount;
	columnsRef.current = columns;
	visibleRangeRef.current = visibleRange;
	selectedIndexRef.current = selectedIndex;
	relayInstanceRef.current = relayInstance;

	const scheduleMountedRevision = React.useCallback(() => {
		if (refRevisionScheduledRef.current) {
			return;
		}
		refRevisionScheduledRef.current = true;
		task.defer(() => {
			refRevisionScheduledRef.current = false;
			if (mountedRef.current) {
				setMountedRevision((current) => current + 1);
			}
		});
	}, []);

	const setRelaySelectable = React.useCallback((active: boolean) => {
		const relay = relayInstanceRef.current;
		if (relay !== undefined && relay.Parent !== undefined) {
			relay.Selectable = active;
		}
		setRelayActive(active);
	}, []);

	const finishPending = React.useCallback(
		(requestId?: number): boolean => {
			const request = pendingRef.current;
			if (request === undefined || (requestId !== undefined && request.requestId !== requestId)) {
				return false;
			}

			pendingRef.current = undefined;
			setPendingIndex(undefined);
			setRelaySelectable(false);
			return true;
		},
		[setRelaySelectable],
	);

	const rollbackPending = React.useCallback(
		(requestId: number, attemptedTarget?: GuiObject) => {
			const request = pendingRef.current;
			if (request === undefined || request.requestId !== requestId) {
				return;
			}

			const selectedObject = GuiService.SelectedObject;
			const relay = relayInstanceRef.current;
			const selectedItemIndex =
				selectedObject === undefined || selectedObject === attemptedTarget
					? undefined
					: indexByInstanceRef.current.get(selectedObject);
			const ownsTransientSelection =
				selectedObject === undefined || selectedObject === relay || selectedObject === attemptedTarget;
			const mountedFallback =
				request.fallbackIndex === undefined ? undefined : instanceByIndexRef.current.get(request.fallbackIndex);
			const fallback = resolveVirtualInventoryRollbackSelection({
				capturedSelection: request.fallbackSelection,
				capturedSelectionRestorable: isRestorableSelectionTarget(request.fallbackSelection),
				fallbackIndex: request.fallbackIndex,
				mountedSelection: mountedFallback,
				mountedSelectionRestorable: isRestorableSelectionTarget(mountedFallback),
			});
			const fallbackIndex =
				fallback === undefined ? undefined : (request.fallbackIndex ?? indexByInstanceRef.current.get(fallback));
			const restoredIndex = selectedItemIndex ?? fallbackIndex ?? request.previousIndex;
			const restoredOwnership =
				selectedItemIndex !== undefined || (ownsTransientSelection && fallbackIndex !== undefined);

			// Clear the request before changing SelectedObject so the observer cannot repair a failed handoff back to the relay.
			pendingRef.current = undefined;
			setPendingIndex(undefined);
			selectedIndexRef.current = restoredIndex;
			setSelectedIndex(restoredIndex);
			selectionOwnedRef.current = restoredOwnership;
			lastOwnedSelectionRef.current =
				selectedItemIndex !== undefined
					? selectedObject
					: ownsTransientSelection && fallbackIndex !== undefined
						? fallback
						: undefined;
			setSelectionActive(restoredOwnership);
			if (ownsTransientSelection) {
				GuiService.SelectedObject = fallback;
			}
			setRelaySelectable(false);
		},
		[setRelaySelectable],
	);

	const completeHandoff = React.useCallback(
		(targetIndex: number, target: TextButton) => {
			const request = pendingRef.current;
			if (
				!mountedRef.current ||
				request === undefined ||
				request.targetIndex !== targetIndex ||
				target.Parent === undefined
			) {
				return;
			}

			if (!canAssignGuiServiceSelection(target)) {
				selectedIndexRef.current = targetIndex;
				setSelectedIndex(targetIndex);
				selectionOwnedRef.current = false;
				lastOwnedSelectionRef.current = undefined;
				setSelectionActive(false);
				finishPending(request.requestId);
				return;
			}

			const currentSelection = GuiService.SelectedObject;
			if (
				!shouldAssignVirtualInventoryTarget({
					currentSelection,
					lastOwnedSelection: lastOwnedSelectionRef.current,
					targetSelection: target,
					selectionOwned: selectionOwnedRef.current,
				})
			) {
				const currentIndex =
					currentSelection === undefined ? undefined : indexByInstanceRef.current.get(currentSelection);
				if (currentIndex !== undefined) {
					selectionOwnedRef.current = true;
					lastOwnedSelectionRef.current = currentSelection;
					selectedIndexRef.current = currentIndex;
					setSelectedIndex(currentIndex);
					setSelectionActive(true);
				} else {
					selectionOwnedRef.current = false;
					lastOwnedSelectionRef.current = undefined;
					setSelectionActive(false);
				}
				finishPending(request.requestId);
				return;
			}

			selectedIndexRef.current = targetIndex;
			setSelectedIndex(targetIndex);
			selectionOwnedRef.current = true;
			lastOwnedSelectionRef.current = target;
			setSelectionActive(true);
			GuiService.SelectedObject = target;
			const requestId = request.requestId;
			task.spawn(() => {
				RunService.Heartbeat.Wait();
				if (!mountedRef.current || pendingRef.current?.requestId !== requestId) {
					return;
				}
				if (target.Parent === undefined) {
					rollbackPending(requestId, target);
					return;
				}
				if (GuiService.SelectedObject === target) {
					finishPending(requestId);
					return;
				}

				const relay = relayInstanceRef.current;
				if (GuiService.SelectedObject !== relay && GuiService.SelectedObject !== undefined) {
					rollbackPending(requestId, target);
					return;
				}

				// Roblox may reject an assignment while geometry settles; retry once, then restore the prior owner.
				GuiService.SelectedObject = target;
				RunService.Heartbeat.Wait();
				if (!mountedRef.current || pendingRef.current?.requestId !== requestId) {
					return;
				}
				if (target.Parent !== undefined && GuiService.SelectedObject === target) {
					finishPending(requestId);
					return;
				}
				rollbackPending(requestId, target);
			});
		},
		[finishPending, rollbackPending],
	);

	const beginHandoff = React.useCallback(
		(targetIndex: number, alignment: VirtualScrollAlignment = "center"): boolean => {
			if (!mountedRef.current || targetIndex < 0 || targetIndex >= itemCountRef.current) {
				return false;
			}

			const previousRequest = pendingRef.current;
			const relay = relayInstanceRef.current;
			const currentSelection = GuiService.SelectedObject;
			nextRequestIdRef.current += 1;
			const fallbackSelection =
				previousRequest?.fallbackSelection ?? (currentSelection === relay ? undefined : currentSelection);
			const fallbackIndex =
				previousRequest?.fallbackIndex ??
				(fallbackSelection === undefined
					? undefined
					: resolveVirtualInventoryFallbackIndex({
							mappedIndex: indexByInstanceRef.current.get(fallbackSelection),
							fallbackIsLastOwned: fallbackSelection === lastOwnedSelectionRef.current,
							selectionOwned: selectionOwnedRef.current,
							selectedIndex: selectedIndexRef.current,
						}));
			const request: PendingSelectionHandoff = {
				requestId: nextRequestIdRef.current,
				targetIndex,
				previousIndex: previousRequest?.previousIndex ?? selectedIndexRef.current,
				fallbackSelection,
				fallbackIndex,
			};
			pendingRef.current = request;
			setPendingIndex(targetIndex);
			selectedIndexRef.current = targetIndex;
			setSelectedIndex(targetIndex);
			setHandoffCount((current) => current + 1);
			setRelaySelectable(true);
			const canOwnSelection = relay !== undefined && relay.Parent !== undefined && canAssignGuiServiceSelection(relay);
			selectionOwnedRef.current = canOwnSelection;
			lastOwnedSelectionRef.current = canOwnSelection ? relay : undefined;
			setSelectionActive(canOwnSelection);
			if (canOwnSelection && relay !== undefined) {
				relay.Selectable = true;
				GuiService.SelectedObject = relay;
			}

			const moved = apiRef.current?.scrollToIndex(targetIndex, alignment) ?? false;
			if (!moved) {
				rollbackPending(request.requestId);
				return false;
			}

			const mountedTarget = instanceByIndexRef.current.get(targetIndex);
			if (mountedTarget !== undefined) {
				task.spawn(() => {
					RunService.Heartbeat.Wait();
					if (!mountedRef.current || pendingRef.current?.requestId !== request.requestId) {
						return;
					}
					const currentTarget = instanceByIndexRef.current.get(targetIndex);
					if (currentTarget !== undefined) {
						completeHandoff(targetIndex, currentTarget);
					}
				});
			}
			return true;
		},
		[apiRef, completeHandoff, rollbackPending, setRelaySelectable],
	);

	const getItemRef = React.useCallback(
		(index: number) => {
			const existing = itemRefCallbacksRef.current.get(index);
			if (existing !== undefined) {
				return existing;
			}

			let previousInstance: TextButton | undefined;
			const callback = (instance: TextButton | undefined) => {
				if (instance === previousInstance) {
					return;
				}

				const previous = previousInstance;
				previousInstance = instance;
				if (previous !== undefined && instanceByIndexRef.current.get(index) === previous) {
					const shouldPreserveSelection =
						mountedRef.current && GuiService.SelectedObject === previous && selectionOwnedRef.current;
					instanceByIndexRef.current.delete(index);
					indexByInstanceRef.current.delete(previous);
					if (shouldPreserveSelection) {
						beginHandoff(selectedIndexRef.current, "center");
					}
				}

				if (instance !== undefined && mountedRef.current) {
					instanceByIndexRef.current.set(index, instance);
					indexByInstanceRef.current.set(instance, index);
					if (pendingRef.current?.targetIndex === index) {
						completeHandoff(index, instance);
					}
				} else {
					task.defer(() => {
						if (previousInstance === undefined && itemRefCallbacksRef.current.get(index) === callback) {
							itemRefCallbacksRef.current.delete(index);
						}
					});
				}
				scheduleMountedRevision();
			};
			itemRefCallbacksRef.current.set(index, callback);
			return callback;
		},
		[beginHandoff, completeHandoff, scheduleMountedRevision],
	);

	const getMountedInstance = React.useCallback((index: number | undefined) => {
		return index === undefined ? undefined : instanceByIndexRef.current.get(index);
	}, []);

	const setRelayInstance = React.useCallback((instance: TextButton | undefined) => {
		const previousRelay = relayInstanceRef.current;
		relayInstanceRef.current = instance;
		if (!mountedRef.current) {
			if (previousRelay !== undefined && previousRelay.Parent !== undefined) {
				previousRelay.Selectable = false;
			}
			return;
		}
		setRelayInstanceState(instance);
		if (instance !== undefined) {
			const request = pendingRef.current;
			const pending = request !== undefined;
			const currentSelection = GuiService.SelectedObject;
			instance.Selectable = pending;
			if (
				request !== undefined &&
				canAssignGuiServiceSelection(instance) &&
				shouldAssignVirtualInventoryRelay({
					currentSelection,
					currentSelectionIsInventoryItem:
						currentSelection !== undefined && indexByInstanceRef.current.has(currentSelection),
					lastOwnedSelection: lastOwnedSelectionRef.current,
					targetSelection: instance,
					selectionOwned: selectionOwnedRef.current,
				})
			) {
				selectionOwnedRef.current = true;
				lastOwnedSelectionRef.current = instance;
				setSelectionActive(true);
				GuiService.SelectedObject = instance;
			}
		}
	}, []);

	React.useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			ContextActionService.UnbindAction(actionName);
			const relay = relayInstanceRef.current;
			const selectedObject = GuiService.SelectedObject;
			const lastOwnedSelection = lastOwnedSelectionRef.current;
			const isCurrentInventorySelection =
				selectedObject !== undefined && indexByInstanceRef.current.has(selectedObject);
			selectionOwnedRef.current = false;
			pendingRef.current = undefined;
			if (shouldClearVirtualInventorySelection(selectedObject, lastOwnedSelection, isCurrentInventorySelection)) {
				GuiService.SelectedObject = undefined;
			}
			lastOwnedSelectionRef.current = undefined;
			if (relay !== undefined && relay.Parent !== undefined) {
				relay.Selectable = false;
			}
		};
	}, [actionName]);

	React.useEffect(() => {
		const observeSelection = () => {
			if (!mountedRef.current) {
				return;
			}
			const selectedObject = GuiService.SelectedObject;
			const itemIndex = selectedObject === undefined ? undefined : indexByInstanceRef.current.get(selectedObject);
			if (itemIndex !== undefined) {
				selectionOwnedRef.current = true;
				lastOwnedSelectionRef.current = selectedObject;
				selectedIndexRef.current = itemIndex;
				setSelectedIndex(itemIndex);
				setSelectionActive(true);
				const request = pendingRef.current;
				if (request !== undefined && request.targetIndex !== itemIndex) {
					finishPending(request.requestId);
				}
				return;
			}

			if (selectedObject === relayInstanceRef.current && pendingRef.current !== undefined) {
				selectionOwnedRef.current = true;
				lastOwnedSelectionRef.current = selectedObject;
				setSelectionActive(true);
				return;
			}

			if (selectionOwnedRef.current && selectedObject === undefined) {
				setSelectionLossCount((current) => current + 1);
				const relay = relayInstanceRef.current;
				if (pendingRef.current !== undefined && relay !== undefined && relay.Parent !== undefined) {
					relay.Selectable = true;
					lastOwnedSelectionRef.current = relay;
					GuiService.SelectedObject = relay;
					return;
				}
			}

			selectionOwnedRef.current = false;
			lastOwnedSelectionRef.current = undefined;
			setSelectionActive(false);
			const request = pendingRef.current;
			if (request !== undefined) {
				finishPending(request.requestId);
			}
		};
		const connection = GuiService.GetPropertyChangedSignal("SelectedObject").Connect(observeSelection);
		observeSelection();
		return () => {
			connection.Disconnect();
		};
	}, [finishPending]);

	React.useEffect(() => {
		if (!selectionActive) {
			return;
		}

		let interceptedKey: Enum.KeyCode | undefined;
		const handleAction = (_boundAction: string, inputState: Enum.UserInputState, input: InputObject) => {
			if (interceptedKey === input.KeyCode) {
				if (inputState === Enum.UserInputState.End || inputState === Enum.UserInputState.Cancel) {
					interceptedKey = undefined;
				}
				return Enum.ContextActionResult.Sink;
			}
			if (inputState !== Enum.UserInputState.Begin) {
				return Enum.ContextActionResult.Pass;
			}

			const selectedObject = GuiService.SelectedObject;
			const currentIndex = selectedObject === undefined ? undefined : indexByInstanceRef.current.get(selectedObject);
			const direction = resolveVirtualInventoryDirection(input.KeyCode.Name);
			if (currentIndex === undefined || direction === undefined) {
				return Enum.ContextActionResult.Pass;
			}

			const targetIndex = resolveVirtualInventoryNavigationTarget({
				index: currentIndex,
				itemCount: itemCountRef.current,
				columns: columnsRef.current,
				direction,
			});
			if (targetIndex === undefined) {
				return Enum.ContextActionResult.Pass;
			}

			if (instanceByIndexRef.current.has(targetIndex) && isVisibleIndex(targetIndex, visibleRangeRef.current)) {
				return Enum.ContextActionResult.Pass;
			}

			interceptedKey = input.KeyCode;
			beginHandoff(targetIndex, "nearest");
			return Enum.ContextActionResult.Sink;
		};
		ContextActionService.BindActionAtPriority(
			actionName,
			handleAction,
			false,
			Enum.ContextActionPriority.High.Value,
			...DPAD_INPUTS,
		);
		return () => {
			ContextActionService.UnbindAction(actionName);
		};
	}, [actionName, beginHandoff, selectionActive]);

	return {
		selectedIndex,
		selectionActive,
		pendingIndex,
		handoffCount,
		selectionLossCount,
		mountedRevision,
		relayActive,
		setRelayInstance,
		getItemRef,
		getMountedInstance,
		requestSelection: beginHandoff,
	};
}
