export interface NotificationScheduler {
	readonly now: () => number;
	readonly schedule: (delaySeconds: number, callback: () => void) => () => void;
}

export type NotificationPhase = "queued" | "open" | "closing";

export type NotificationDismissReason = "timeout" | "user" | "programmatic" | "clear";

export interface NotificationInput<T> {
	readonly id?: string;
	readonly data: T;
	readonly duration: number | undefined;
}

export interface NotificationStoreUpdate<T> {
	readonly data: T;
	readonly duration: number | undefined;
}

export interface NotificationRecord<T> {
	readonly id: string;
	readonly data: T;
	readonly duration: number | undefined;
	readonly phase: NotificationPhase;
	readonly createdAt: number;
	readonly updatedAt: number;
	readonly openedAt?: number;
	readonly dismissReason?: NotificationDismissReason;
	readonly paused: boolean;
}

export interface NotificationSnapshot<T> {
	readonly visible: readonly NotificationRecord<T>[];
	readonly queued: readonly NotificationRecord<T>[];
}

export interface NotificationStore<T> {
	readonly getSnapshot: () => NotificationSnapshot<T>;
	readonly subscribe: (listener: (snapshot: NotificationSnapshot<T>) => void) => () => void;
	readonly show: (input: NotificationInput<T>) => string;
	readonly update: (id: string, update: NotificationStoreUpdate<T>) => boolean;
	readonly dismiss: (id: string, reason?: NotificationDismissReason) => boolean;
	readonly pause: (id: string) => boolean;
	readonly resume: (id: string) => boolean;
	readonly finishClose: (id: string) => boolean;
	readonly clear: () => void;
	readonly setMaxVisible: (maxVisible: number) => void;
	readonly destroy: () => void;
}

export interface CreateNotificationStoreOptions {
	readonly maxVisible: number;
	readonly scheduler?: NotificationScheduler;
}

interface NotificationTimer {
	readonly token: number;
	readonly remaining: number;
	readonly deadline?: number;
	cancel?: () => void;
}

const defaultScheduler: NotificationScheduler = {
	now: () => os.clock(),
	schedule: (delaySeconds, callback) => {
		let active = true;
		const scheduledThread = task.delay(delaySeconds, () => {
			if (!active) {
				return;
			}

			active = false;
			callback();
		});
		return () => {
			if (!active) {
				return;
			}

			active = false;
			task.cancel(scheduledThread);
		};
	},
};

function normalizeMaxVisible(maxVisible: number): number {
	if (maxVisible !== maxVisible || maxVisible === math.huge || maxVisible === -math.huge) {
		return 1;
	}

	return math.max(1, math.floor(maxVisible));
}

function normalizeDuration(duration: number | undefined): number | undefined {
	if (duration === undefined) {
		return undefined;
	}

	if (duration !== duration) {
		return 0;
	}
	if (duration === math.huge) {
		return undefined;
	}

	return math.max(0, duration);
}

function freezeRecord<T>(record: NotificationRecord<T>): NotificationRecord<T> {
	return table.freeze(record);
}

function freezeSnapshot<T>(
	visible: readonly NotificationRecord<T>[],
	queued: readonly NotificationRecord<T>[],
): NotificationSnapshot<T> {
	return table.freeze({
		visible: table.freeze([...visible]),
		queued: table.freeze([...queued]),
	});
}

function findRecordIndex<T>(records: readonly NotificationRecord<T>[], id: string): number {
	for (let index = 0; index < records.size(); index += 1) {
		if (records[index]?.id === id) {
			return index;
		}
	}

	return -1;
}

/**
 * Creates the UI-free state machine used by the notifications provider.
 * This module intentionally stays internal until that provider defines the public API.
 */
export function createNotificationStore<T>(options: CreateNotificationStoreOptions): NotificationStore<T> {
	const scheduler = options.scheduler ?? defaultScheduler;
	const listeners = new Set<(snapshot: NotificationSnapshot<T>) => void>();
	const timers = new Map<string, NotificationTimer>();

	let maxVisible = normalizeMaxVisible(options.maxVisible);
	let visible = new Array<NotificationRecord<T>>();
	let queued = new Array<NotificationRecord<T>>();
	let snapshot = freezeSnapshot(visible, queued);
	let nextGeneratedId = 1;
	let nextTimerToken = 1;
	let destroyed = false;

	function hasRecord(id: string): boolean {
		return findRecordIndex(visible, id) >= 0 || findRecordIndex(queued, id) >= 0;
	}

	function publish(): void {
		snapshot = freezeSnapshot(visible, queued);
		for (const listener of [...listeners]) {
			listener(snapshot);
		}
	}

	function cancelTimer(id: string): void {
		const timer = timers.get(id);
		timers.delete(id);
		timer?.cancel?.();
	}

	function createPausedTimer(id: string, remaining: number): void {
		cancelTimer(id);
		timers.set(id, {
			token: nextTimerToken,
			remaining,
		});
		nextTimerToken += 1;
	}

	function moveOpenRecordToClosing(index: number, reason: NotificationDismissReason, now = scheduler.now()): void {
		const record = visible[index];
		if (record === undefined || record.phase !== "open") {
			return;
		}

		cancelTimer(record.id);
		const nextVisible = [...visible];
		nextVisible[index] = freezeRecord({
			...record,
			phase: "closing",
			dismissReason: reason,
			updatedAt: now,
			paused: false,
		});
		visible = nextVisible;
	}

	function handleTimerElapsed(id: string, token: number): void {
		if (destroyed) {
			return;
		}

		const timer = timers.get(id);
		if (timer === undefined || timer.token !== token) {
			return;
		}

		const index = findRecordIndex(visible, id);
		const record = visible[index];
		if (record === undefined || record.phase !== "open" || record.paused || record.duration === undefined) {
			return;
		}

		timers.delete(id);
		moveOpenRecordToClosing(index, "timeout");
		publish();
	}

	function scheduleTimer(id: string, delaySeconds: number): void {
		cancelTimer(id);

		const delay = math.max(0, delaySeconds);
		const token = nextTimerToken;
		nextTimerToken += 1;

		const timer: NotificationTimer = {
			token,
			remaining: delay,
			deadline: scheduler.now() + delay,
		};
		timers.set(id, timer);

		const cancel = scheduler.schedule(delay, () => handleTimerElapsed(id, token));
		const activeTimer = timers.get(id);
		if (activeTimer?.token === token) {
			activeTimer.cancel = cancel;
		} else {
			cancel();
		}
	}

	function startTimer(record: NotificationRecord<T>): void {
		if (record.phase === "open" && record.duration !== undefined && !record.paused) {
			scheduleTimer(record.id, record.duration);
		}
	}

	function promoteQueued(): boolean {
		let promoted = false;

		while (visible.size() < maxVisible && queued.size() > 0) {
			const queuedRecord = queued[0];
			if (queuedRecord === undefined) {
				break;
			}

			queued = queued.filter((_, index) => index !== 0);
			const now = scheduler.now();
			const openRecord = freezeRecord({
				...queuedRecord,
				phase: "open",
				updatedAt: now,
				openedAt: now,
				paused: false,
			});
			visible = [...visible, openRecord];
			startTimer(openRecord);
			promoted = true;
		}

		return promoted;
	}

	function generateId(): string {
		while (true) {
			const id = `prism-notification-${nextGeneratedId}`;
			nextGeneratedId += 1;
			if (!hasRecord(id)) {
				return id;
			}
		}
	}

	function getSnapshot(): NotificationSnapshot<T> {
		return snapshot;
	}

	function subscribe(listener: (snapshot: NotificationSnapshot<T>) => void): () => void {
		if (destroyed) {
			return () => undefined;
		}

		listeners.add(listener);
		let subscribed = true;
		return () => {
			if (subscribed) {
				subscribed = false;
				listeners.delete(listener);
			}
		};
	}

	function show(input: NotificationInput<T>): string {
		if (destroyed) {
			error("Cannot show a notification after its store has been destroyed.");
		}

		const id = input.id ?? generateId();
		if (hasRecord(id)) {
			return id;
		}

		const now = scheduler.now();
		const phase: NotificationPhase = visible.size() < maxVisible ? "open" : "queued";
		const record = freezeRecord({
			id,
			data: input.data,
			duration: normalizeDuration(input.duration),
			phase,
			createdAt: now,
			updatedAt: now,
			openedAt: phase === "open" ? now : undefined,
			paused: false,
		});

		if (phase === "open") {
			visible = [...visible, record];
			startTimer(record);
		} else {
			queued = [...queued, record];
		}

		publish();
		return id;
	}

	function update(id: string, updateInput: NotificationStoreUpdate<T>): boolean {
		if (destroyed) {
			return false;
		}

		const visibleIndex = findRecordIndex(visible, id);
		const visibleRecord = visible[visibleIndex];
		if (visibleRecord !== undefined) {
			if (visibleRecord.phase === "closing") {
				return false;
			}

			const nextDuration = normalizeDuration(updateInput.duration);
			const nextRecord = freezeRecord({
				...visibleRecord,
				data: updateInput.data,
				duration: nextDuration,
				updatedAt: scheduler.now(),
				paused: visibleRecord.paused,
			});
			const nextVisible = [...visible];
			nextVisible[visibleIndex] = nextRecord;
			visible = nextVisible;

			if (nextDuration === undefined) {
				cancelTimer(id);
			} else if (nextRecord.paused) {
				createPausedTimer(id, nextDuration);
			} else {
				scheduleTimer(id, nextDuration);
			}

			publish();
			return true;
		}

		const queuedIndex = findRecordIndex(queued, id);
		const queuedRecord = queued[queuedIndex];
		if (queuedRecord === undefined) {
			return false;
		}

		const nextQueued = [...queued];
		nextQueued[queuedIndex] = freezeRecord({
			...queuedRecord,
			data: updateInput.data,
			duration: normalizeDuration(updateInput.duration),
			updatedAt: scheduler.now(),
		});
		queued = nextQueued;
		publish();
		return true;
	}

	function dismiss(id: string, reason: NotificationDismissReason = "programmatic"): boolean {
		if (destroyed) {
			return false;
		}

		const queuedIndex = findRecordIndex(queued, id);
		if (queuedIndex >= 0) {
			queued = queued.filter((_, index) => index !== queuedIndex);
			cancelTimer(id);
			publish();
			return true;
		}

		const visibleIndex = findRecordIndex(visible, id);
		const record = visible[visibleIndex];
		if (record === undefined || record.phase === "closing") {
			return false;
		}

		moveOpenRecordToClosing(visibleIndex, reason);
		publish();
		return true;
	}

	function pause(id: string): boolean {
		if (destroyed) {
			return false;
		}

		const index = findRecordIndex(visible, id);
		const record = visible[index];
		if (record === undefined || record.phase !== "open" || record.duration === undefined || record.paused) {
			return false;
		}

		const now = scheduler.now();
		const timer = timers.get(id);
		const remaining = timer?.deadline !== undefined ? math.max(0, timer.deadline - now) : 0;
		if (remaining <= 0) {
			moveOpenRecordToClosing(index, "timeout", now);
			publish();
			return true;
		}

		cancelTimer(id);
		const nextVisible = [...visible];
		nextVisible[index] = freezeRecord({ ...record, updatedAt: now, paused: true });
		visible = nextVisible;
		createPausedTimer(id, remaining);
		publish();
		return true;
	}

	function resume(id: string): boolean {
		if (destroyed) {
			return false;
		}

		const index = findRecordIndex(visible, id);
		const record = visible[index];
		if (record === undefined || record.phase !== "open" || !record.paused) {
			return false;
		}
		if (record.duration === undefined) {
			cancelTimer(id);
			const nextVisible = [...visible];
			nextVisible[index] = freezeRecord({ ...record, updatedAt: scheduler.now(), paused: false });
			visible = nextVisible;
			publish();
			return true;
		}

		const timer = timers.get(id);
		const remaining = timer?.remaining ?? 0;
		if (remaining <= 0) {
			moveOpenRecordToClosing(index, "timeout");
			publish();
			return true;
		}

		const nextVisible = [...visible];
		nextVisible[index] = freezeRecord({ ...record, updatedAt: scheduler.now(), paused: false });
		visible = nextVisible;
		scheduleTimer(id, remaining);
		publish();
		return true;
	}

	function finishClose(id: string): boolean {
		if (destroyed) {
			return false;
		}

		const index = findRecordIndex(visible, id);
		const record = visible[index];
		if (record === undefined || record.phase !== "closing") {
			return false;
		}

		cancelTimer(id);
		visible = visible.filter((_, recordIndex) => recordIndex !== index);
		promoteQueued();
		publish();
		return true;
	}

	function clear(): void {
		if (destroyed) {
			return;
		}

		let changed = queued.size() > 0;
		queued = [];

		const now = scheduler.now();
		const nextVisible = visible.map((record) => {
			if (record.phase === "closing") {
				return record;
			}

			changed = true;
			cancelTimer(record.id);
			return freezeRecord({
				...record,
				phase: "closing",
				dismissReason: "clear",
				updatedAt: now,
				paused: false,
			});
		});
		visible = nextVisible;

		if (changed) {
			publish();
		}
	}

	function setMaxVisible(nextMaxVisible: number): void {
		if (destroyed) {
			return;
		}

		const normalized = normalizeMaxVisible(nextMaxVisible);
		if (normalized === maxVisible) {
			return;
		}

		const raised = normalized > maxVisible;
		maxVisible = normalized;
		if (raised && promoteQueued()) {
			publish();
		}
	}

	function destroy(): void {
		if (destroyed) {
			return;
		}

		destroyed = true;
		const timerIds = new Array<string>();
		for (const [id] of timers) {
			timerIds.push(id);
		}
		for (const id of timerIds) {
			cancelTimer(id);
		}
		timers.clear();
		listeners.clear();
		visible = [];
		queued = [];
		snapshot = freezeSnapshot(visible, queued);
	}

	return table.freeze({
		getSnapshot,
		subscribe,
		show,
		update,
		dismiss,
		pause,
		resume,
		finishClose,
		clear,
		setMaxVisible,
		destroy,
	});
}
