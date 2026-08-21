import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { theme as themeRefs, useTheme } from "@prism/theme";

import { Divider } from "../Divider";
import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { Text } from "../Text";
import { CaptureOverlay, ScreenOverlayLayer, usePortalTarget } from "../_shared/layering";
import {
	renderCornerDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { renderElevationShadow } from "../_shared/elevation";
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
import {
	DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX,
	incrementZIndex,
	type GuiZIndex,
} from "../_shared/overlayLayerPolicy";
import { mergeSharedStyleProps, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useControllableState } from "../_shared/useControllableState";
import { usePressInteraction } from "../_shared/usePressInteraction";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { resolveWindowSizeStyles } from "./styles";
import type { WindowProps } from "./types";
import {
	DEFAULT_WINDOW_HEIGHT,
	DEFAULT_WINDOW_MIN_HEIGHT,
	DEFAULT_WINDOW_MIN_WIDTH,
	DEFAULT_WINDOW_WIDTH,
	applyWindowMove,
	applyWindowResize,
	areWindowBoundsEqual,
	clampWindowBounds,
	resolveCenteredWindowPosition,
	resolveMaximizedWindowBounds,
	resolveUDimPixels,
	type WindowBounds,
	type WindowClampOptions,
	type WindowViewport,
} from "./utils";

const UserInputService = game.GetService("UserInputService");

const WINDOW_CHROME_HOVER_SCALE = 1.04;
const WINDOW_CHROME_PRESS_SCALE = 0.92;
const WINDOW_DRAG_CLICK_THRESHOLD = 4;

type WindowFrameEventMap = React.InstanceProps<Frame>["Event"];
type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type WindowDragMode = "move" | "resize";

function useAbsoluteSize(instance: GuiObject | undefined): Vector2 | undefined {
	const [absoluteSize, setAbsoluteSize] = React.useState<Vector2>();

	React.useEffect(() => {
		if (instance === undefined) {
			setAbsoluteSize(undefined);
			return;
		}

		const updateAbsoluteSize = () => {
			const nextSize = instance.AbsoluteSize;
			setAbsoluteSize((currentSize) =>
				currentSize !== undefined && currentSize.X === nextSize.X && currentSize.Y === nextSize.Y ? currentSize : nextSize,
			);
		};

		updateAbsoluteSize();
		const absoluteSizeConnection = instance.GetPropertyChangedSignal("AbsoluteSize").Connect(updateAbsoluteSize);

		return () => {
			absoluteSizeConnection.Disconnect();
		};
	}, [instance]);

	return absoluteSize;
}

function resolveViewport(size: Vector2 | undefined): WindowViewport {
	if (size === undefined) {
		return { width: 0, height: 0 };
	}

	return { width: size.X, height: size.Y };
}

function resolveLocalInputPosition(input: InputObject, overlay: GuiObject): Vector2 {
	return new Vector2(input.Position.X, input.Position.Y).sub(overlay.AbsolutePosition);
}

function resolveInitialWindowBounds(
	viewport: WindowViewport,
	width: number,
	height: number,
	position: UDim2 | undefined,
	center: boolean | undefined,
	options: WindowClampOptions,
): WindowBounds {
	const centered = resolveCenteredWindowPosition(width, height, viewport);
	const usesCenteredPlacement = position === undefined && center !== false;
	const x = usesCenteredPlacement || position === undefined ? centered.x : resolveUDimPixels(position.X, viewport.width);
	const y = usesCenteredPlacement || position === undefined ? centered.y : resolveUDimPixels(position.Y, viewport.height);

	return clampWindowBounds({ x, y, width, height }, options);
}

function toClampOptions(
	viewport: WindowViewport,
	minWidth: number,
	minHeight: number,
	maxWidth: number | undefined,
	maxHeight: number | undefined,
	margin: number,
): WindowClampOptions {
	return {
		minWidth,
		minHeight,
		maxWidth,
		maxHeight,
		viewport,
		margin,
	};
}

interface WindowChromeButtonProps {
	readonly iconName: IconName;
	readonly size: number;
	readonly iconSize: number;
	readonly radius: UDim;
	readonly zIndex: GuiZIndex | undefined;
	readonly onPress: () => void;
	readonly onInputBegan?: (input: InputObject) => void;
	readonly layoutOrder?: number;
	readonly slotProps?: Partial<React.InstanceProps<TextButton>>;
	readonly iconSlotProps?: Partial<React.InstanceProps<ImageLabel>>;
}

function WindowChromeButton(props: WindowChromeButtonProps) {
	const theme = useTheme();
	const press = usePressInteraction({ interactive: true, onActivated: props.onPress });
	const closeButtonScale = press.pressed ? WINDOW_CHROME_PRESS_SCALE : press.hovered ? WINDOW_CHROME_HOVER_SCALE : 1;
	const motionDuration = press.pressed || press.hovered ? "fast" : "normal";
	const animated = useMotion({
		values: {
			backgroundColor: press.pressed ? theme.colors.action.pressed : theme.colors.action.hover,
			backgroundTransparency: press.hovered || press.pressed ? 0 : 1,
			iconColor: press.pressed ? theme.colors.text.primary : theme.colors.text.secondary,
			scale: closeButtonScale,
		},
		transition: {
			backgroundColor: { duration: motionDuration, easing: "standard" },
			backgroundTransparency: { duration: motionDuration, easing: "standard" },
			iconColor: { duration: motionDuration, easing: "standard" },
			scale: { duration: "fast", easing: "out" },
		},
	});
	const buttonEvent = useRootCursorEvent(
		composeEventMaps(
			{
				...press.eventMap,
				InputBegan: (_button: TextButton, input: InputObject) => {
					press.eventMap?.InputBegan?.(_button, input);
					props.onInputBegan?.(input);
				},
			},
			props.slotProps?.Event,
		),
		props.slotProps?.Event === undefined ? "pointer" : undefined,
	);

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundColor3={animated.backgroundColor}
			BackgroundTransparency={animated.backgroundTransparency}
			BorderSizePixel={0}
			Size={UDim2.fromOffset(props.size, props.size)}
			LayoutOrder={props.layoutOrder}
			Text=""
			TextTransparency={1}
			ZIndex={props.zIndex}
			Event={buttonEvent}
			{...props.slotProps}
		>
			<uiscale Scale={animated.scale} />
			{renderCornerDecorator({ radius: props.radius, slotProps: undefined })}
			<Icon
				name={props.iconName}
				size={props.iconSize}
				color={animated.iconColor}
				anchor={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				slotProps={{ root: { ZIndex: incrementZIndex(props.zIndex, 1), ...props.iconSlotProps } }}
			/>
		</textbutton>
	);
}

type WindowComponent = ((props: WindowProps) => React.ReactElement) & React.ForwardRefExoticComponent<WindowProps>;

const WindowBase = React.forwardRef<Frame, WindowProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		title,
		children,
		leading,
		trailing,
		rail,
		onClose,
		Event,
		Change,
	} = props;
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
	const {
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedBackgroundColor,
		resolvedConstraint,
	} = useResolvedStyleProps("window", mergedStyleProps);
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
				? toClampOptions(clampOptionsRef.current.viewport, collapseSize, collapseSize, collapseSize, collapseSize, clampOptionsRef.current.margin)
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
	const collapsedBounds = clampWindowBounds(
		{
			x: floatingBounds.x,
			y: floatingBounds.y,
			width: sizeStyles.collapseControlSize,
			height: sizeStyles.collapseControlSize,
		},
		toClampOptions(
			viewport,
			sizeStyles.collapseControlSize,
			sizeStyles.collapseControlSize,
			sizeStyles.collapseControlSize,
			sizeStyles.collapseControlSize,
			sizeStyles.viewportMargin,
		),
	);
	const maximizedBounds = resolveMaximizedWindowBounds(viewport);
	const renderedBounds = collapsed ? collapsedBounds : maximized ? maximizedBounds : floatingBounds;
	const canResize = !collapsed && !maximized;
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
	const hasRail = rail !== undefined;
	const railWidth = hasRail ? sizeStyles.railMinWidth : 0;
	const railDividerWidth = hasRail ? 1 : 0;
	const bodyLeftOffset = railWidth + railDividerWidth;
	const rootSlotProps = slotProps?.root;
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BackgroundColor3: panelBackgroundColor,
		BackgroundTransparency: mergedStyleProps.bgTransparency ?? 0,
		BorderSizePixel: 0,
		ClipsDescendants: mergedStyleProps.clip ?? true,
		Position: UDim2.fromOffset(renderedBounds.x, renderedBounds.y),
		Size: UDim2.fromOffset(renderedBounds.width, renderedBounds.height),
		Visible: bounds === undefined ? false : mergedStyleProps.visible,
		LayoutOrder: mergedStyleProps.layoutOrder,
		ZIndex: rootZIndex,
		Active: true,
		Selectable: false,
		Event: rootEvent,
		Change,
	};

	return (
		<ScreenOverlayLayer zIndex={overlayZIndex} slotProps={slotProps?.overlay}>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Active={false}
				Selectable={false}
				ZIndex={overlayZIndex}
				ref={overlayRef}
			/>
			<frame {...rootInstanceProps} {...rootSlotProps} ref={windowRef}>
				{renderElevationShadow({
					shadow: theme.shadows.md,
					radius: sizeStyles.radius,
					zIndex: shadowZIndex,
					slotProps: { root: slotProps?.shadow },
				})}
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.rootCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: theme.colors.border.default,
					thickness: 1,
					transparency: 0.08,
					slotProps: slotProps?.rootStroke,
				})}
				{renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint })}
				{collapsed ? (
					<textbutton
						AutoButtonColor={false}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 1)}
						Text=""
						TextTransparency={1}
						ZIndex={collapseControlZIndex}
						Event={collapseControlEvent}
						{...slotProps?.collapseControl}
					>
						<Icon
							name="app-window"
							size={sizeStyles.iconSize}
							color={themeRefs.text.secondary}
							anchor={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
							slotProps={{ root: { ZIndex: incrementZIndex(collapseControlZIndex, 1) } }}
						/>
					</textbutton>
				) : (
					<>
						<frame
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Active={true}
							Selectable={false}
							Size={new UDim2(1, 0, 0, sizeStyles.titleBarHeight)}
							ZIndex={titleBarZIndex}
							Event={titleBarEvent}
							{...slotProps?.titleBar}
						>
							{leading !== undefined ? (
								<frame
									BackgroundTransparency={1}
									BorderSizePixel={0}
									Position={UDim2.fromOffset(sizeStyles.titlePaddingX, 0)}
									Size={UDim2.fromOffset(sizeStyles.controlSize, sizeStyles.titleBarHeight)}
									ZIndex={incrementZIndex(titleBarZIndex, 1)}
									{...slotProps?.leading}
								>
									<uilistlayout
										FillDirection={Enum.FillDirection.Horizontal}
										HorizontalAlignment={Enum.HorizontalAlignment.Center}
										VerticalAlignment={Enum.VerticalAlignment.Center}
										SortOrder={Enum.SortOrder.LayoutOrder}
									/>
									{leading}
								</frame>
							) : undefined}
							<Text
								text={title ?? ""}
								size={sizeStyles.titleSize}
								weight={700}
								lineHeight={sizeStyles.titleLineHeight}
								color={themeRefs.text.primary}
								valign="middle"
								truncate="atend"
								position={UDim2.fromOffset(titleLeft, 0)}
								width={new UDim(1, -titleWidthOffset)}
								height={sizeStyles.titleBarHeight}
								slotProps={{ root: { ZIndex: incrementZIndex(titleBarZIndex, 1), ...slotProps?.title } }}
							/>
							<frame
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Position={new UDim2(1, -sizeStyles.titlePaddingX, 0.5, 0)}
								AnchorPoint={new Vector2(1, 0.5)}
								Size={new UDim2(0, 0, 0, sizeStyles.controlSize)}
								AutomaticSize={Enum.AutomaticSize.X}
								ZIndex={controlsZIndex}
								ref={controlsRef}
								{...slotProps?.controls}
							>
								<uilistlayout
									FillDirection={Enum.FillDirection.Horizontal}
									HorizontalAlignment={Enum.HorizontalAlignment.Right}
									VerticalAlignment={Enum.VerticalAlignment.Center}
									Padding={new UDim(0, sizeStyles.titleGap)}
									SortOrder={Enum.SortOrder.LayoutOrder}
								/>
								{trailing !== undefined ? (
									<frame
										BackgroundTransparency={1}
										BorderSizePixel={0}
										Size={UDim2.fromOffset(0, sizeStyles.controlSize)}
										AutomaticSize={Enum.AutomaticSize.X}
										LayoutOrder={1}
										{...slotProps?.trailing}
									>
										{trailing}
									</frame>
								) : undefined}
								<WindowChromeButton
									iconName="minus"
									size={sizeStyles.controlSize}
									iconSize={sizeStyles.iconSize}
									radius={controlRadius}
									zIndex={incrementZIndex(controlsZIndex, 1)}
									layoutOrder={2}
									onPress={() => setCollapsed(true)}
									onInputBegan={chromeInputBegan}
									slotProps={slotProps?.collapseButton}
								/>
								<WindowChromeButton
									iconName={maximized ? "minimize" : "maximize"}
									size={sizeStyles.controlSize}
									iconSize={sizeStyles.iconSize}
									radius={controlRadius}
									zIndex={incrementZIndex(controlsZIndex, 1)}
									layoutOrder={3}
									onPress={() => setMaximized(!maximized)}
									onInputBegan={chromeInputBegan}
									slotProps={slotProps?.maximizeButton}
								/>
								{hasClose ? (
									<WindowChromeButton
										iconName="x"
										size={sizeStyles.controlSize}
										iconSize={sizeStyles.iconSize}
										radius={controlRadius}
										zIndex={incrementZIndex(controlsZIndex, 1)}
										layoutOrder={4}
										onPress={() => onClose?.()}
										onInputBegan={chromeInputBegan}
										slotProps={slotProps?.closeButton}
									/>
								) : undefined}
							</frame>
						</frame>
						<Divider
							color={themeRefs.border.subtle}
							size={1}
							slotProps={{
								root: {
									Position: UDim2.fromOffset(0, sizeStyles.titleBarHeight),
									ZIndex: titleBarZIndex,
								},
							}}
						/>
						<frame
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Position={UDim2.fromOffset(0, sizeStyles.titleBarHeight + 1)}
							Size={new UDim2(1, 0, 1, -(sizeStyles.titleBarHeight + 1))}
							ZIndex={bodyZIndex}
							{...slotProps?.body}
						>
							{hasRail ? (
								<frame
									BackgroundTransparency={1}
									BorderSizePixel={0}
									ClipsDescendants={true}
									Size={new UDim2(0, railWidth, 1, 0)}
									ZIndex={incrementZIndex(bodyZIndex, 1)}
									{...slotProps?.rail}
								>
									{rail}
								</frame>
							) : undefined}
							{hasRail ? (
								<Divider
									orientation="vertical"
									color={themeRefs.border.subtle}
									size={1}
									layoutOrder={2}
									slotProps={{
										root: {
											Position: UDim2.fromOffset(railWidth, 0),
										},
									}}
								/>
							) : undefined}
							<frame
								BackgroundTransparency={1}
								BorderSizePixel={0}
								ClipsDescendants={true}
								Position={UDim2.fromOffset(bodyLeftOffset, 0)}
								Size={new UDim2(1, -bodyLeftOffset, 1, 0)}
								ZIndex={incrementZIndex(bodyZIndex, 1)}
								{...slotProps?.content}
							>
								{children}
							</frame>
						</frame>
						{canResize ? (
							<textbutton
								AutoButtonColor={false}
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Size={UDim2.fromOffset(sizeStyles.resizeHandleSize, sizeStyles.resizeHandleSize)}
								Position={UDim2.fromScale(1, 1)}
								AnchorPoint={new Vector2(1, 1)}
								Text=""
								TextTransparency={1}
								ZIndex={resizeHandleZIndex}
								Event={resizeHandleEvent}
								{...slotProps?.resizeHandle}
							>
								<frame
									BackgroundColor3={theme.colors.text.disabled}
									BackgroundTransparency={0.35}
									BorderSizePixel={0}
									Size={UDim2.fromOffset(math.max(2, sizeStyles.resizeHandleSize - 6), 2)}
									Position={new UDim2(1, -2, 1, -6)}
									AnchorPoint={new Vector2(1, 1)}
									Active={false}
								/>
								<frame
									BackgroundColor3={theme.colors.text.disabled}
									BackgroundTransparency={0.35}
									BorderSizePixel={0}
									Size={UDim2.fromOffset(2, math.max(2, sizeStyles.resizeHandleSize - 6))}
									Position={new UDim2(1, -6, 1, -2)}
									AnchorPoint={new Vector2(1, 1)}
									Active={false}
								/>
							</textbutton>
						) : undefined}
					</>
				)}
			</frame>
			<CaptureOverlay active={mouseDragCaptureActive} target={portalTarget} Event={dragCaptureOverlayEvent} />
		</ScreenOverlayLayer>
	);
});

export const Window = WindowBase as WindowComponent;

Window.displayName = "Window";
