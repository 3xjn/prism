import React from "@rbxts/react";

import {
	isMouseDragActive,
	isPressInput,
	resolveDragInputKind,
	shouldHandleDragEndInput,
	shouldHandleMouseDragMoveInput,
	shouldHandleTouchDragMoveInput,
	type DragInputKind,
} from "../_shared/interaction";
import { usePortalTarget } from "../_shared/layering";

const UserInputService = game.GetService("UserInputService");

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];

interface UseColorDragOptions {
	readonly disabled: boolean;
	readonly onPoint: (point: Vector2) => void;
	readonly onEnd?: () => void;
}

export interface ColorDragResult {
	readonly hitboxInstance: TextButton | undefined;
	readonly setHitboxInstance: (instance: TextButton | undefined) => void;
	readonly hovered: boolean;
	readonly dragging: boolean;
	readonly event: TextButtonEventMap;
	readonly captureActive: boolean;
	readonly captureTarget: LayerCollector | undefined;
	readonly captureEvent: TextButtonEventMap | undefined;
}

export function useColorDrag({ disabled, onPoint, onEnd }: UseColorDragOptions): ColorDragResult {
	const [hitboxInstance, setHitboxInstance] = React.useState<TextButton>();
	const [hovered, setHovered] = React.useState(false);
	const [dragging, setDragging] = React.useState(false);
	const portalTarget = usePortalTarget(hitboxInstance);
	const onPointRef = React.useRef(onPoint);
	const onEndRef = React.useRef(onEnd);
	const dragKindRef = React.useRef<DragInputKind | undefined>(undefined);
	const activeTouchRef = React.useRef<InputObject | undefined>(undefined);
	const moveConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const endConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const draggingRef = React.useRef(false);

	onPointRef.current = onPoint;
	onEndRef.current = onEnd;

	const disconnectDragTracking = React.useCallback(() => {
		moveConnectionRef.current?.Disconnect();
		moveConnectionRef.current = undefined;
		endConnectionRef.current?.Disconnect();
		endConnectionRef.current = undefined;
		dragKindRef.current = undefined;
		activeTouchRef.current = undefined;
	}, []);

	const endDrag = React.useCallback(
		(emitChangeEnd: boolean) => {
			if (!draggingRef.current) {
				disconnectDragTracking();
				return;
			}

			draggingRef.current = false;
			disconnectDragTracking();
			setDragging(false);
			if (emitChangeEnd) {
				onEndRef.current?.();
			}
		},
		[disconnectDragTracking],
	);

	const updateFromInput = React.useCallback((input: InputObject) => {
		onPointRef.current(new Vector2(input.Position.X, input.Position.Y));
	}, []);

	const handleDragMoveInput = React.useCallback(
		(input: InputObject) => {
			if (shouldHandleMouseDragMoveInput(dragKindRef.current, input)) {
				updateFromInput(input);
				return;
			}

			if (shouldHandleTouchDragMoveInput(dragKindRef.current, activeTouchRef.current, input)) {
				updateFromInput(input);
			}
		},
		[updateFromInput],
	);

	const handleDragEndInput = React.useCallback(
		(input: InputObject) => {
			if (shouldHandleDragEndInput(dragKindRef.current, activeTouchRef.current, input)) {
				endDrag(true);
			}
		},
		[endDrag],
	);

	const beginDrag = React.useCallback(
		(input: InputObject) => {
			if (disabled || !isPressInput(input)) {
				return;
			}

			const dragKind = resolveDragInputKind(input);
			if (dragKind === undefined) {
				return;
			}

			disconnectDragTracking();
			dragKindRef.current = dragKind;
			activeTouchRef.current = dragKind === "touch" ? input : undefined;
			draggingRef.current = true;
			setDragging(true);
			updateFromInput(input);

			// Track globally from the same input frame so a fast mouse move cannot outrun
			// the CaptureOverlay render that owns subsequent pointer interaction.
			moveConnectionRef.current = UserInputService.InputChanged.Connect(handleDragMoveInput);
			endConnectionRef.current = UserInputService.InputEnded.Connect(handleDragEndInput);
		},
		[disabled, disconnectDragTracking, handleDragEndInput, handleDragMoveInput, updateFromInput],
	);

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHovered(false);
		endDrag(true);
	}, [disabled, endDrag]);

	React.useEffect(() => {
		return () => {
			draggingRef.current = false;
			disconnectDragTracking();
		};
	}, [disconnectDragTracking]);

	const event: TextButtonEventMap = {
		MouseEnter: () => {
			if (!disabled) {
				setHovered(true);
			}
		},
		MouseLeave: () => {
			setHovered(false);
		},
		InputBegan: (_button, input) => {
			beginDrag(input);
		},
		InputChanged: (_button, input) => {
			handleDragMoveInput(input);
		},
		InputEnded: (_button, input) => {
			handleDragEndInput(input);
		},
	};
	const captureActive = dragging && isMouseDragActive(dragKindRef.current) && portalTarget !== undefined;
	const captureEvent: TextButtonEventMap | undefined = captureActive
		? {
				InputChanged: (_button, input) => {
					handleDragMoveInput(input);
				},
				InputEnded: (_button, input) => {
					handleDragEndInput(input);
				},
			}
		: undefined;

	return {
		hitboxInstance,
		setHitboxInstance,
		hovered,
		dragging,
		event,
		captureActive,
		captureTarget: portalTarget,
		captureEvent,
	};
}
