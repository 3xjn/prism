import type React from "@rbxts/react";

type EventHandler = (...args: unknown[]) => void;
type EventMapLike = Record<string, unknown>;

export type DragInputKind = "mouse" | "touch";

export function isPressInput(input: InputObject): boolean {
	return input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch;
}

export function resolveDragInputKind(input: InputObject): DragInputKind | undefined {
	if (input.UserInputType === Enum.UserInputType.MouseButton1) {
		return "mouse";
	}

	if (input.UserInputType === Enum.UserInputType.Touch) {
		return "touch";
	}

	return undefined;
}

export function shouldHandleTouchDragMoveInput(
	kind: DragInputKind | undefined,
	activeTouch: InputObject | undefined,
	input: InputObject,
): boolean {
	if (kind === "touch") {
		return input.UserInputType === Enum.UserInputType.Touch && input === activeTouch;
	}

	return false;
}

export function shouldHandleMouseDragMoveInput(kind: DragInputKind | undefined, input: InputObject): boolean {
	return kind === "mouse" && input.UserInputType === Enum.UserInputType.MouseMovement;
}

export function isMouseDragActive(kind: DragInputKind | undefined): boolean {
	return kind === "mouse";
}

export function shouldHandleDragEndInput(
	kind: DragInputKind | undefined,
	activeTouch: InputObject | undefined,
	input: InputObject,
): boolean {
	if (kind === "mouse") {
		return input.UserInputType === Enum.UserInputType.MouseButton1;
	}

	if (kind === "touch") {
		return input.UserInputType === Enum.UserInputType.Touch && input === activeTouch;
	}

	return false;
}

function asEventHandler(value: unknown): EventHandler | undefined {
	return typeOf(value) === "function" ? (value as EventHandler) : undefined;
}

export function composeEventMaps<TEventMap>(internal?: EventMapLike | TEventMap, external?: TEventMap): TEventMap | undefined {
	if (internal === undefined) {
		return external;
	}

	if (external === undefined) {
		return internal as TEventMap;
	}

	const composed: EventMapLike = {};
	const internalHandlers = internal as EventMapLike;
	const externalHandlers = external as EventMapLike;

	for (const [key, handler] of pairs(internalHandlers)) {
		const resolvedHandler = asEventHandler(handler);

		if (resolvedHandler !== undefined) {
			composed[key as string] = resolvedHandler;
		}
	}

	for (const [key, handler] of pairs(externalHandlers)) {
		const resolvedHandler = asEventHandler(handler);

		if (resolvedHandler === undefined) {
			continue;
		}

		const handlerKey = key as string;
		const internalHandler = asEventHandler(internalHandlers[handlerKey]);
		composed[handlerKey] =
			internalHandler === undefined
				? resolvedHandler
				: (...args: unknown[]) => {
					internalHandler(...args);
					resolvedHandler(...args);
				};
	}

	return composed as TEventMap;
}

export function assignRef<TInstance>(ref: React.Ref<TInstance> | undefined, value: TInstance | undefined): void {
	if (ref === undefined) {
		return;
	}

	if (typeOf(ref) === "function") {
		(ref as (instance: TInstance | undefined) => void)(value);
		return;
	}

	(ref as React.MutableRefObject<TInstance | undefined>).current = value;
}
