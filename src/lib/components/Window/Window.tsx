import React from "@rbxts/react";

import { theme as themeRefs, useTheme } from "@prism/theme";

import { usePortalTarget } from "../_shared/layering";
import {
	assignRef,
	composeEventMaps,
	isMouseDragActive,
	isPressInput,
	resolveDragInputKind,
	shouldHandleDragEndInput,
	shouldHandleMouseDragMoveInput,
	shouldHandleTouchDragMoveInput,
	type DragInputKind,
} from "../_shared/interaction";
import { DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX, incrementZIndex } from "../_shared/overlayLayerPolicy";
import { mergeSharedStyleProps, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useControllableState } from "../_shared/useControllableState";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { WindowView } from "./WindowView";
import {
	useAbsoluteSize,
	resolveInitialWindowBounds,
	resolveLocalInputPosition,
	resolveViewport,
	toClampOptions,
} from "./layout";
import { resolveWindowSizeStyles } from "./styles";
import type { WindowProps } from "./types";
import { useWindowCollapseMotion } from "./useCollapseMotion";
import {
	DEFAULT_WINDOW_HEIGHT,
	DEFAULT_WINDOW_MIN_HEIGHT,
	DEFAULT_WINDOW_MIN_WIDTH,
	DEFAULT_WINDOW_WIDTH,
	applyWindowMove,
	applyWindowResize,
	areWindowBoundsEqual,
	clampWindowBounds,
	resolveCollapsedWindowBounds,
	resolveMaximizedWindowBounds,
	resolveUDimPixels,
	type WindowBounds,
} from "./utils";

const UserInputService = game.GetService("UserInputService");

const WINDOW_DRAG_CLICK_THRESHOLD = 4;

type WindowFrameEventMap = React.InstanceProps<Frame>["Event"];
type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type WindowDragMode = "move" | "resize";
type WindowComponent = ((props: WindowProps) => React.ReactElement) & React.ForwardRefExoticComponent<WindowProps>;

const WindowBase = React.forwardRef<Frame, WindowProps>((props, ref) => {
	const theme = useTheme();
	const { slotProps, title, children, leading, trailing, rail, onClose, Event, Change } = props;
	const sizeStyles = resolveWindowSizeStyles(theme);
	const [collapsed, setCollapsed] = useControllableState({
		controlled: props.collapsed,
		defaultValue: props.defaultCollapsed ?? false,
		onChange: props.onCollapsedChange,
	});
	const [maximized, setMaximized] = useControllableState({
		controlled: props.maximized,
		defaultValue: props.defaultMaximized ?? false,
		onChange: props.onMaximizedChange,
	});
	const mergedStyleProps = mergeSharedStyleProps(
		{
			bg: themeRefs.background.surface,
			clip: true,
			width: DEFAULT_WINDOW_WIDTH,
			height: DEFAULT_WINDOW_HEIGHT,
			minWidth: DEFAULT_WINDOW_MIN_WIDTH,
			minHeight: DEFAULT_WINDOW_MIN_HEIGHT,
		},
		props,
	);
	const { resolvedWidth, resolvedHeight, resolvedSize, resolvedPosition, resolvedBackgroundColor, resolvedConstraint } =
		useResolvedStyleProps("window", mergedStyleProps);
	const [overlayInstance, setOverlayInstance] = React.useState<Frame>();
	const [windowInstance, setWindowInstance] = React.useState<Frame>();
	const [controlsInstance, setControlsInstance] = React.useState<Frame>();
	const overlaySize = useAbsoluteSize(overlayInstance);
	const controlsSize = useAbsoluteSize(controlsInstance);
	const portalTarget = usePortalTarget(windowInstance);
	const viewport = resolveViewport(overlaySize);
	const [bounds, setBounds] = React.useState<WindowBounds>();
	const [raisedZIndex, setRaisedZIndex] = React.useState(
		() => slotProps?.overlay?.ZIndex ?? mergedStyleProps.zIndex ?? DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX,
	);
	const [dragging, setDragging] = React.useState(false);
	const dragModeRef = React.useRef<WindowDragMode | undefined>(undefined);
	const inputKindRef = React.useRef<DragInputKind | undefined>(undefined);
	const activeTouchRef = React.useRef<InputObject | undefined>(undefined);
	const grabOffsetRef = React.useRef(new Vector2(0, 0));
	const draggingRef = React.useRef(false);
	const dragMovedRef = React.useRef(false);
	const dragStartInputRef = React.useRef<Vector2 | undefined>(undefined);
	const moveConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const endConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const overlayInstanceRef = React.useRef<Frame | undefined>(undefined);
	const boundsRef = React.useRef<WindowBounds | undefined>(undefined);
	const maximizedRef = React.useRef(maximized);
	const collapsedRef = React.useRef(collapsed);
	const viewportRef = React.useRef(viewport);
	const cancelCollapseTweenRef = React.useRef<() => void>(() => undefined);
	overlayInstanceRef.current = overlayInstance;
	boundsRef.current = bounds;
	maximizedRef.current = maximized;
	collapsedRef.current = collapsed;
	viewportRef.current = viewport;

	const minWidth = resolvedConstraint?.min?.X ?? DEFAULT_WINDOW_MIN_WIDTH;
	const minHeight = resolvedConstraint?.min?.Y ?? DEFAULT_WINDOW_MIN_HEIGHT;
	const maxWidth = resolvedConstraint?.max?.X;
	const maxHeight = resolvedConstraint?.max?.Y;
	const clampOptions = toClampOptions(viewport, minWidth, minHeight, maxWidth, maxHeight, sizeStyles.viewportMargin);
	const clampOptionsRef = React.useRef(clampOptions);
	const collapsedSizeRef = React.useRef(sizeStyles.collapseControlSize);
	clampOptionsRef.current = clampOptions;
	collapsedSizeRef.current = sizeStyles.collapseControlSize;

	const raiseWindow = React.useCallback(() => {
		setRaisedZIndex((current) => (typeOf(current) === "number" ? (current as number) + 1 : current));
	}, []);

	const disconnectDragTracking = React.useCallback(() => {
		moveConnectionRef.current?.Disconnect();
		moveConnectionRef.current = undefined;
		endConnectionRef.current?.Disconnect();
		endConnectionRef.current = undefined;
		inputKindRef.current = undefined;
		activeTouchRef.current = undefined;
		dragModeRef.current = undefined;
	}, []);

	const commitBounds = React.useCallback((nextBounds: WindowBounds) => {
		setBounds((current) => (current !== undefined && areWindowBoundsEqual(current, nextBounds) ? current : nextBounds));
	}, []);

	const updateDragFromInput = React.useCallback(
		(input: InputObject) => {
			const overlay = overlayInstanceRef.current;
			const currentBounds = boundsRef.current;
			if (overlay === undefined || currentBounds === undefined || !draggingRef.current) {
				return;
			}

			const localPosition = resolveLocalInputPosition(input, overlay);
			const startInput = dragStartInputRef.current;
			if (
				startInput !== undefined &&
				(math.abs(localPosition.X - startInput.X) > WINDOW_DRAG_CLICK_THRESHOLD ||
					math.abs(localPosition.Y - startInput.Y) > WINDOW_DRAG_CLICK_THRESHOLD)
			) {
				dragMovedRef.current = true;
			}

			if (dragModeRef.current === "resize") {
				commitBounds(
					applyWindowResize(
						currentBounds,
						localPosition.X - currentBounds.x,
						localPosition.Y - currentBounds.y,
						clampOptionsRef.current,
					),
				);
				return;
			}

			const collapseSize = collapsedSizeRef.current;
			const moveSource = collapsedRef.current
				? {
						x: currentBounds.x,
						y: currentBounds.y,
						width: collapseSize,
						height: collapseSize,
					}
				: currentBounds;
			const moveOptions = collapsedRef.current
				? toClampOptions(
						clampOptionsRef.current.viewport,
						collapseSize,
						collapseSize,
						collapseSize,
						collapseSize,
						clampOptionsRef.current.margin,
					)
				: clampOptionsRef.current;
			const moved = applyWindowMove(
				moveSource,
				localPosition.X - grabOffsetRef.current.X,
				localPosition.Y - grabOffsetRef.current.Y,
				moveOptions,
			);
			commitBounds({
				x: moved.x,
				y: moved.y,
				width: currentBounds.width,
				height: currentBounds.height,
			});
		},
		[commitBounds],
	);

	const handleDragMoveInput = React.useCallback(
		(input: InputObject) => {
			if (shouldHandleMouseDragMoveInput(inputKindRef.current, input)) {
				updateDragFromInput(input);
				return;
			}

			if (shouldHandleTouchDragMoveInput(inputKindRef.current, activeTouchRef.current, input)) {
				updateDragFromInput(input);
			}
		},
		[updateDragFromInput],
	);

	const endDrag = React.useCallback(
		(emitClick: boolean) => {
			if (!draggingRef.current) {
				disconnectDragTracking();
				return;
			}

			const wasMove = dragModeRef.current === "move";
			const wasClick = emitClick && wasMove && !dragMovedRef.current && collapsedRef.current;
			draggingRef.current = false;
			disconnectDragTracking();
			setDragging(false);

			if (wasClick) {
				setCollapsed(false);
			}
		},
		[disconnectDragTracking, setCollapsed],
	);

	const handleDragEndInput = React.useCallback(
		(input: InputObject) => {
			if (!shouldHandleDragEndInput(inputKindRef.current, activeTouchRef.current, input)) {
				return;
			}

			endDrag(true);
		},
		[endDrag],
	);

	const beginDrag = React.useCallback(
		(input: InputObject, mode: WindowDragMode) => {
			if (!isPressInput(input) || (maximizedRef.current && mode === "resize")) {
				return;
			}

			if (maximizedRef.current && mode === "move" && !collapsedRef.current) {
				return;
			}

			const overlay = overlayInstanceRef.current;
			const currentBounds = boundsRef.current;
			if (overlay === undefined || currentBounds === undefined) {
				return;
			}

			const dragKind = resolveDragInputKind(input);
			if (dragKind === undefined) {
				return;
			}

			const localPosition = resolveLocalInputPosition(input, overlay);
			disconnectDragTracking();
			cancelCollapseTweenRef.current();
			dragModeRef.current = mode;
			inputKindRef.current = dragKind;
			activeTouchRef.current = dragKind === "touch" ? input : undefined;
			grabOffsetRef.current = localPosition.sub(new Vector2(currentBounds.x, currentBounds.y));
			dragStartInputRef.current = localPosition;
			dragMovedRef.current = false;
			draggingRef.current = true;
			setDragging(true);
			raiseWindow();

			if (!isMouseDragActive(dragKind) || portalTarget === undefined) {
				moveConnectionRef.current = UserInputService.InputChanged.Connect((changedInput) => {
					handleDragMoveInput(changedInput);
				});
			}

			endConnectionRef.current = UserInputService.InputEnded.Connect((endedInput) => {
				handleDragEndInput(endedInput);
			});
		},
		[disconnectDragTracking, handleDragEndInput, handleDragMoveInput, portalTarget, raiseWindow],
	);

	React.useEffect(() => {
		if (viewport.width <= 0 || viewport.height <= 0) {
			return;
		}

		const widthSource = resolvedSize?.X ?? resolvedWidth ?? new UDim(0, DEFAULT_WINDOW_WIDTH);
		const heightSource = resolvedSize?.Y ?? resolvedHeight ?? new UDim(0, DEFAULT_WINDOW_HEIGHT);
		const nextOptions = toClampOptions(viewport, minWidth, minHeight, maxWidth, maxHeight, sizeStyles.viewportMargin);

		setBounds((current) => {
			const nextBounds =
				current !== undefined
					? clampWindowBounds(current, nextOptions)
					: resolveInitialWindowBounds(
							viewport,
							math.max(0, resolveUDimPixels(widthSource, viewport.width)),
							math.max(0, resolveUDimPixels(heightSource, viewport.height)),
							resolvedPosition,
							props.center,
							nextOptions,
						);

			return current !== undefined && areWindowBoundsEqual(current, nextBounds) ? current : nextBounds;
		});
	}, [
		maxHeight,
		maxWidth,
		minHeight,
		minWidth,
		props.center,
		props.position,
		resolvedHeight,
		resolvedPosition,
		resolvedSize,
		resolvedWidth,
		sizeStyles.viewportMargin,
		viewport.height,
		viewport.width,
	]);

	React.useEffect(() => {
		return () => {
			draggingRef.current = false;
			disconnectDragTracking();
		};
	}, [disconnectDragTracking]);

	const windowRef = React.useCallback(
		(instance: Frame | undefined) => {
			setWindowInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			assignRef(ref, instance);
		},
		[ref],
	);
	const overlayRef = React.useCallback((instance: Frame | undefined) => {
		setOverlayInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
	}, []);
	const controlsRef = React.useCallback((instance: Frame | undefined) => {
		setControlsInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
	}, []);

	const overlayZIndex = slotProps?.overlay?.ZIndex ?? raisedZIndex;
	const rootZIndex = slotProps?.root?.ZIndex ?? incrementZIndex(overlayZIndex, 1);
	const contentZIndex = incrementZIndex(rootZIndex, 1);
	const titleBarZIndex = slotProps?.titleBar?.ZIndex ?? contentZIndex;
	const controlsZIndex = slotProps?.controls?.ZIndex ?? incrementZIndex(titleBarZIndex, 1);
	const bodyZIndex = slotProps?.body?.ZIndex ?? contentZIndex;
	const resizeHandleZIndex = slotProps?.resizeHandle?.ZIndex ?? incrementZIndex(contentZIndex, 2);
	const collapseControlZIndex = slotProps?.collapseControl?.ZIndex ?? contentZIndex;
	const shadowZIndex = typeIs(rootZIndex, "number") ? math.max(rootZIndex - 1, 0) : 0;
	const hasClose = onClose !== undefined;
	const controlCount = 2 + (hasClose ? 1 : 0);
	const fallbackControlsWidth =
		controlCount * sizeStyles.controlSize + math.max(0, controlCount - 1) * sizeStyles.titleGap;
	const rightControlsWidth = controlsSize?.X ?? fallbackControlsWidth;
	const leadingWidth = leading !== undefined ? sizeStyles.controlSize : 0;
	const titleLeft = sizeStyles.titlePaddingX + leadingWidth + (leading !== undefined ? sizeStyles.titleGap : 0);
	const titleWidthOffset = titleLeft + sizeStyles.titleGap + rightControlsWidth + sizeStyles.titlePaddingX;
	const panelBackgroundColor = resolvedBackgroundColor ?? theme.colors.background.surface;
	const controlRadius = new UDim(0, theme.radius.sm);
	const floatingBounds = bounds ?? {
		x: 0,
		y: 0,
		width: DEFAULT_WINDOW_WIDTH,
		height: DEFAULT_WINDOW_HEIGHT,
	};
	const collapsedBounds = resolveCollapsedWindowBounds(
		floatingBounds,
		sizeStyles.collapseControlSize,
		viewport,
		sizeStyles.viewportMargin,
	);
	const maximizedBounds = resolveMaximizedWindowBounds(viewport);
	const targetBounds = collapsed ? collapsedBounds : maximized ? maximizedBounds : floatingBounds;
	const collapseMotion = useWindowCollapseMotion({
		collapsed,
		targetBounds,
		duration: theme.motion.duration.normal,
		easing: theme.motion.easing.out,
	});
	cancelCollapseTweenRef.current = collapseMotion.cancelTween;
	const displayBounds = collapseMotion.displayBounds;
	const canResize = !collapsed && !maximized && !collapseMotion.tweening;
	const canMove = collapsed || !maximized;
	const mouseDragCaptureActive = dragging && isMouseDragActive(inputKindRef.current) && portalTarget !== undefined;
	const titleBarCursor = dragging && dragModeRef.current === "move" ? "grabbing" : "grab";
	const rootEvent = composeEventMaps(
		{
			InputBegan: (_frame: Frame, input: InputObject) => {
				if (isPressInput(input)) {
					raiseWindow();
				}
			},
		} as WindowFrameEventMap,
		Event,
	);
	const titleBarEvent = useRootCursorEvent(
		composeEventMaps(
			{
				InputBegan: (_frame: Frame, input: InputObject) => {
					if (!isPressInput(input)) {
						return;
					}

					raiseWindow();
					if (canMove) {
						beginDrag(input, "move");
					}
				},
				InputChanged: (_frame: Frame, input: InputObject) => {
					handleDragMoveInput(input);
				},
				InputEnded: (_frame: Frame, input: InputObject) => {
					handleDragEndInput(input);
				},
			} as WindowFrameEventMap,
			slotProps?.titleBar?.Event,
		),
		slotProps?.titleBar?.Event === undefined && canMove ? titleBarCursor : undefined,
		!canMove,
	);
	const collapseControlEvent = useRootCursorEvent(
		composeEventMaps(
			{
				InputBegan: (_button: TextButton, input: InputObject) => {
					if (!isPressInput(input)) {
						return;
					}

					raiseWindow();
					beginDrag(input, "move");
				},
				InputChanged: (_button: TextButton, input: InputObject) => {
					handleDragMoveInput(input);
				},
				InputEnded: (_button: TextButton, input: InputObject) => {
					handleDragEndInput(input);
				},
			} as TextButtonEventMap,
			slotProps?.collapseControl?.Event,
		),
		slotProps?.collapseControl?.Event === undefined ? (dragging ? "grabbing" : "grab") : undefined,
	);
	const resizeHandleEvent = useRootCursorEvent(
		composeEventMaps(
			{
				InputBegan: (_button: TextButton, input: InputObject) => {
					if (!isPressInput(input)) {
						return;
					}

					raiseWindow();
					beginDrag(input, "resize");
				},
				InputChanged: (_button: TextButton, input: InputObject) => {
					handleDragMoveInput(input);
				},
				InputEnded: (_button: TextButton, input: InputObject) => {
					handleDragEndInput(input);
				},
			} as TextButtonEventMap,
			slotProps?.resizeHandle?.Event,
		),
		slotProps?.resizeHandle?.Event === undefined ? "resize-nwse" : undefined,
		!canResize,
	);
	const dragCaptureOverlayEvent: TextButtonEventMap | undefined = mouseDragCaptureActive
		? {
				InputChanged: (_button, input) => {
					handleDragMoveInput(input);
				},
				InputEnded: (_button, input) => {
					handleDragEndInput(input);
				},
			}
		: undefined;
	const chromeInputBegan = (input: InputObject) => {
		if (isPressInput(input)) {
			raiseWindow();
		}
	};
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BackgroundColor3: panelBackgroundColor,
		BackgroundTransparency: mergedStyleProps.bgTransparency ?? 0,
		BorderSizePixel: 0,
		ClipsDescendants: mergedStyleProps.clip ?? true,
		Position: UDim2.fromOffset(displayBounds.x, displayBounds.y),
		Size: UDim2.fromOffset(displayBounds.width, displayBounds.height),
		Visible: bounds === undefined ? false : mergedStyleProps.visible,
		LayoutOrder: mergedStyleProps.layoutOrder,
		ZIndex: rootZIndex,
		Active: true,
		Selectable: false,
		Event: rootEvent,
		Change,
	};

	return (
		<WindowView
			theme={theme}
			sizeStyles={sizeStyles}
			slotProps={slotProps}
			overlayZIndex={overlayZIndex}
			overlayRef={overlayRef}
			windowRef={windowRef}
			controlsRef={controlsRef}
			rootInstanceProps={rootInstanceProps}
			resolvedConstraint={collapsed || collapseMotion.tweening ? undefined : resolvedConstraint}
			shadowZIndex={shadowZIndex}
			showCollapseControl={collapseMotion.showCollapseControl}
			collapseControlZIndex={collapseControlZIndex}
			collapseControlEvent={collapseControlEvent}
			titleBarZIndex={titleBarZIndex}
			titleBarEvent={titleBarEvent}
			leading={leading}
			title={title}
			titleLeft={titleLeft}
			titleWidthOffset={titleWidthOffset}
			controlsZIndex={controlsZIndex}
			trailing={trailing}
			controlRadius={controlRadius}
			maximized={maximized}
			hasClose={hasClose}
			onCollapse={() => setCollapsed(true)}
			onToggleMaximized={() => setMaximized(!maximized)}
			onClose={onClose}
			chromeInputBegan={chromeInputBegan}
			bodyZIndex={bodyZIndex}
			rail={rail}
			canResize={canResize}
			resizeHandleZIndex={resizeHandleZIndex}
			resizeHandleEvent={resizeHandleEvent}
			mouseDragCaptureActive={mouseDragCaptureActive}
			portalTarget={portalTarget}
			dragCaptureOverlayEvent={dragCaptureOverlayEvent}
		>
			{children}
		</WindowView>
	);
});

export const Window = WindowBase as WindowComponent;

Window.displayName = "Window";
