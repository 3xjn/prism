import React from "@rbxts/react";

const GuiService = game.GetService("GuiService");
const RunService = game.GetService("RunService");
const UserInputService = game.GetService("UserInputService");

export type OverlaySelectionEntryPolicy = "trigger" | "always";

export type OverlaySelectionLocation = "overlay" | "missing" | "outside";

export interface OverlaySelectionLifecycleConfig {
	readonly opened: boolean;
	readonly container: GuiObject | undefined;
	readonly entryPolicy: OverlaySelectionEntryPolicy;
	readonly trigger?: GuiObject;
	readonly preferredTarget?: GuiObject;
}

interface OverlaySelectionSession {
	readonly capturedTarget: GuiObject | undefined;
	readonly preferredInput: Enum.PreferredInput;
	managed: boolean | undefined;
	entered: boolean;
	ownsSelection: boolean;
	entryScheduled: boolean;
	repairScheduled: boolean;
	container: GuiObject | undefined;
	trigger: GuiObject | undefined;
	lastOwnedTarget: GuiObject | undefined;
}

/** @internal Pure policy for gamepad gating and trigger-owned overlay entry. */
export function shouldManageOverlaySelection(
	preferredInput: Enum.PreferredInput,
	entryPolicy: OverlaySelectionEntryPolicy,
	capturedByTrigger: boolean,
): boolean {
	return preferredInput === Enum.PreferredInput.Gamepad && (entryPolicy === "always" || capturedByTrigger);
}

/** @internal Pure ownership policy used before restoring a closed overlay. */
export function shouldRestoreOverlaySelection(ownsSelection: boolean, location: OverlaySelectionLocation): boolean {
	return ownsSelection && location !== "outside";
}

/** @internal Pure repair policy; identity can remain stable while target eligibility changes. */
export function shouldRepairOverlaySelection(
	ownsSelection: boolean,
	location: OverlaySelectionLocation,
	targetEligible: boolean,
): boolean {
	return ownsSelection && location !== "outside" && !targetEligible;
}

/** @internal Pure location policy keeps reparented targets outside while treating destroyed owned targets as missing. */
export function resolveOverlaySelectionLocation(
	hasCurrentTarget: boolean,
	isInsideContainer: boolean,
	isLastOwnedTarget: boolean,
	isDetached: boolean,
): OverlaySelectionLocation {
	if (!hasCurrentTarget) {
		return "missing";
	}
	if (isInsideContainer) {
		return "overlay";
	}
	if (isLastOwnedTarget && isDetached) {
		return "missing";
	}
	return "outside";
}

function isInSubtree(instance: Instance | undefined, root: Instance | undefined): boolean {
	return instance !== undefined && root !== undefined && (instance === root || instance.IsDescendantOf(root));
}

function isVisibleInHierarchy(target: GuiObject): boolean {
	let current: Instance | undefined = target;

	while (current !== undefined) {
		if (current.IsA("GuiObject") && !current.Visible) {
			return false;
		}

		if (current.IsA("LayerCollector") && !current.Enabled) {
			return false;
		}

		current = current.Parent;
	}

	return true;
}

/** @internal Shared validity check for entry, repair, and restoration. */
export function isEligibleOverlaySelectionTarget(target: GuiObject | undefined): boolean {
	return target !== undefined && target.Parent !== undefined && target.Selectable && isVisibleInHierarchy(target);
}

function hasEligibleSelectionTarget(container: GuiObject): boolean {
	if (isEligibleOverlaySelectionTarget(container)) {
		return true;
	}

	for (const descendant of container.GetDescendants()) {
		if (descendant.IsA("GuiObject") && isEligibleOverlaySelectionTarget(descendant)) {
			return true;
		}
	}

	return false;
}

function resolveSelectionLocation(
	currentTarget: GuiObject | undefined,
	container: GuiObject | undefined,
	lastOwnedTarget: GuiObject | undefined,
): OverlaySelectionLocation {
	return resolveOverlaySelectionLocation(
		currentTarget !== undefined,
		isInSubtree(currentTarget, container),
		currentTarget === lastOwnedTarget,
		currentTarget?.Parent === undefined,
	);
}

function selectIntoContainer(
	session: OverlaySelectionSession,
	container: GuiObject,
	preferredTarget: GuiObject | undefined,
	clearWhenUnavailable = false,
): boolean {
	if (container.Parent === undefined || !hasEligibleSelectionTarget(container)) {
		if (clearWhenUnavailable) {
			GuiService.SelectedObject = undefined;
		}
		return false;
	}

	session.entered = true;
	session.ownsSelection = true;

	if (isInSubtree(preferredTarget, container) && isEligibleOverlaySelectionTarget(preferredTarget)) {
		GuiService.SelectedObject = preferredTarget;
	} else {
		GuiService.Select(container);
	}

	const selectedTarget = GuiService.SelectedObject;
	if (isInSubtree(selectedTarget, container)) {
		session.lastOwnedTarget = selectedTarget;
		return true;
	}

	if (selectedTarget !== undefined) {
		session.ownsSelection = false;
	}

	return false;
}

function restoreTriggerSelection(session: OverlaySelectionSession): void {
	const fallbackTrigger = session.trigger;
	if (fallbackTrigger !== undefined && isEligibleOverlaySelectionTarget(fallbackTrigger)) {
		const eligibleTrigger = fallbackTrigger;
		GuiService.SelectedObject = eligibleTrigger;
		RunService.Heartbeat.Once(() => {
			const verifiedTarget = GuiService.SelectedObject;
			if (verifiedTarget !== undefined || eligibleTrigger.Parent === undefined) {
				return;
			}

			// Let Roblox apply its authoritative clipping/on-screen filter when a
			// structurally valid trigger was rejected after direct assignment.
			GuiService.Select(eligibleTrigger);
		});
		return;
	}

	if (fallbackTrigger !== undefined && fallbackTrigger.Parent !== undefined && hasEligibleSelectionTarget(fallbackTrigger)) {
		GuiService.Select(fallbackTrigger);
		return;
	}

	GuiService.SelectedObject = undefined;
}

function restoreSessionSelection(session: OverlaySelectionSession): void {
	const currentTarget = GuiService.SelectedObject;
	const location = resolveSelectionLocation(currentTarget, session.container, session.lastOwnedTarget);
	if (!shouldRestoreOverlaySelection(session.ownsSelection, location)) {
		return;
	}

	const capturedTarget = session.capturedTarget;
	if (isEligibleOverlaySelectionTarget(capturedTarget)) {
		GuiService.SelectedObject = capturedTarget;
		RunService.Heartbeat.Once(() => {
			const verifiedTarget = GuiService.SelectedObject;
			if (verifiedTarget === capturedTarget || verifiedTarget !== undefined) {
				return;
			}

			// SelectedObject can reset to nil one frame later when Roblox rejects a
			// clipped/off-screen candidate. Only fall back while nobody else took it.
			restoreTriggerSelection(session);
		});
		return;
	}

	restoreTriggerSelection(session);
}

/**
 * @internal Moves native gamepad selection into a mounted overlay and restores the
 * opening target when Prism still owns selection. This deliberately authors no
 * directional graph; Roblox remains responsible for navigation within the group.
 */
export function useOverlaySelectionLifecycle(config: OverlaySelectionLifecycleConfig): void {
	const { opened, container, entryPolicy, trigger, preferredTarget } = config;
	const sessionRef = React.useRef<OverlaySelectionSession>();
	const openedRef = React.useRef(opened);
	const configRef = React.useRef(config);
	const monitoredSelectionConnectionsRef = React.useRef(new Array<RBXScriptConnection>());
	const rebindSelectionMonitoringRef = React.useRef<(session: OverlaySelectionSession) => void>();
	openedRef.current = opened;
	configRef.current = config;

	const disconnectSelectionMonitoring = React.useCallback(() => {
		for (const connection of monitoredSelectionConnectionsRef.current) {
			connection.Disconnect();
		}
		monitoredSelectionConnectionsRef.current = [];
	}, []);

	const closeSession = React.useCallback(() => {
		const session = sessionRef.current;
		if (session === undefined) {
			return;
		}

		sessionRef.current = undefined;
		disconnectSelectionMonitoring();
		restoreSessionSelection(session);
	}, [disconnectSelectionMonitoring]);

	const scheduleRepair = React.useCallback((session: OverlaySelectionSession) => {
		if (session.repairScheduled) {
			return;
		}

		session.repairScheduled = true;
		task.defer(() => {
			if (sessionRef.current !== session || !openedRef.current || !session.ownsSelection) {
				session.repairScheduled = false;
				return;
			}

			const currentTarget = GuiService.SelectedObject;
			const activeContainer = configRef.current.container ?? session.container;
			const location = resolveSelectionLocation(currentTarget, activeContainer, session.lastOwnedTarget);
			if (!shouldRepairOverlaySelection(session.ownsSelection, location, isEligibleOverlaySelectionTarget(currentTarget))) {
				session.repairScheduled = false;
				return;
			}

			if (activeContainer !== undefined) {
				session.container = activeContainer;
				// A rejected preferred target can remain structurally eligible while
				// clipped. Native Select is authoritative during repair and prevents a
				// nil -> preferred -> nil retry loop.
				selectIntoContainer(session, activeContainer, undefined, true);
				rebindSelectionMonitoringRef.current?.(session);
			}
			session.repairScheduled = false;
		});
	}, []);

	const bindSelectionMonitoring = React.useCallback(
		(session: OverlaySelectionSession) => {
			disconnectSelectionMonitoring();

			if (sessionRef.current !== session || !openedRef.current || !session.managed || !session.ownsSelection) {
				return;
			}

			const selectedTarget = GuiService.SelectedObject;
			const activeContainer = configRef.current.container ?? session.container;
			if (resolveSelectionLocation(selectedTarget, activeContainer, session.lastOwnedTarget) === "outside") {
				return;
			}

			const handlePotentialInvalidation = () => {
				if (sessionRef.current !== session || !openedRef.current || !session.ownsSelection) {
					return;
				}

				// Ancestry changes can replace the chain whose visibility determines
				// eligibility, so refresh the observers before attempting repair.
				rebindSelectionMonitoringRef.current?.(session);
				scheduleRepair(session);
			};

			let current: Instance | undefined = selectedTarget;
			while (current !== undefined) {
				monitoredSelectionConnectionsRef.current.push(
					current.AncestryChanged.Connect(handlePotentialInvalidation),
				);

				if (current.IsA("GuiObject")) {
					monitoredSelectionConnectionsRef.current.push(
						current.GetPropertyChangedSignal("Visible").Connect(handlePotentialInvalidation),
					);
					if (current === selectedTarget) {
						monitoredSelectionConnectionsRef.current.push(
							current.GetPropertyChangedSignal("Selectable").Connect(handlePotentialInvalidation),
						);
					}
				}

				if (current.IsA("LayerCollector")) {
					monitoredSelectionConnectionsRef.current.push(
						current.GetPropertyChangedSignal("Enabled").Connect(handlePotentialInvalidation),
					);
				}

				current = current.Parent;
			}
		},
		[disconnectSelectionMonitoring, scheduleRepair],
	);
	rebindSelectionMonitoringRef.current = bindSelectionMonitoring;

	React.useEffect(() => {
		if (opened) {
			if (sessionRef.current === undefined) {
				sessionRef.current = {
					capturedTarget: GuiService.SelectedObject,
					preferredInput: UserInputService.PreferredInput,
					managed: undefined,
					entered: false,
					ownsSelection: false,
					entryScheduled: false,
					repairScheduled: false,
					container: undefined,
					trigger: undefined,
					lastOwnedTarget: undefined,
				};
			}
			return;
		}

		closeSession();
	}, [closeSession, opened]);

	React.useEffect(() => {
		const session = sessionRef.current;
		if (!opened || session === undefined) {
			return;
		}

		if (container !== undefined) {
			session.container = container;
		}
		if (trigger !== undefined) {
			session.trigger = trigger;
		}

		if (session.managed === undefined) {
			if (entryPolicy === "trigger" && trigger === undefined) {
				return;
			}

			session.managed = shouldManageOverlaySelection(
				session.preferredInput,
				entryPolicy,
				isInSubtree(session.capturedTarget, trigger),
			);
		}

		if (!session.managed || container === undefined) {
			return;
		}

		if (session.entered) {
			bindSelectionMonitoring(session);
			const currentTarget = GuiService.SelectedObject;
			const location = resolveSelectionLocation(currentTarget, container, session.lastOwnedTarget);
			if (shouldRepairOverlaySelection(session.ownsSelection, location, isEligibleOverlaySelectionTarget(currentTarget))) {
				scheduleRepair(session);
			}
			return;
		}

		if (session.entryScheduled) {
			return;
		}

		session.entryScheduled = true;
		task.defer(() => {
			session.entryScheduled = false;
			if (sessionRef.current !== session || !openedRef.current || !session.managed || session.entered) {
				return;
			}

			const activeContainer = configRef.current.container ?? session.container;
			if (activeContainer !== undefined) {
				session.container = activeContainer;
				selectIntoContainer(session, activeContainer, configRef.current.preferredTarget);
				bindSelectionMonitoring(session);
			}
		});
	}, [bindSelectionMonitoring, container, entryPolicy, opened, preferredTarget, scheduleRepair, trigger]);

	React.useEffect(() => {
		const connection = GuiService.GetPropertyChangedSignal("SelectedObject").Connect(() => {
			const session = sessionRef.current;
			if (!openedRef.current || session === undefined || !session.managed || !session.entered) {
				return;
			}

			const currentTarget = GuiService.SelectedObject;
			const activeContainer = configRef.current.container ?? session.container;
			const location = resolveSelectionLocation(currentTarget, activeContainer, session.lastOwnedTarget);
			if (location === "outside") {
				session.ownsSelection = false;
				disconnectSelectionMonitoring();
				return;
			}

			session.ownsSelection = true;
			if (currentTarget !== undefined && isInSubtree(currentTarget, activeContainer)) {
				session.lastOwnedTarget = currentTarget;
			}
			bindSelectionMonitoring(session);

			if (shouldRepairOverlaySelection(session.ownsSelection, location, isEligibleOverlaySelectionTarget(currentTarget))) {
				scheduleRepair(session);
			}
		});

		return () => {
			connection.Disconnect();
			closeSession();
		};
	}, [bindSelectionMonitoring, closeSession, disconnectSelectionMonitoring, scheduleRepair]);
}
