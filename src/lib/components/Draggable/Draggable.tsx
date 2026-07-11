import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import { renderElevationShadow } from "../_shared/elevation";
import { pushDecorator, renderPaddingDecorator, renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import {
	assignRef,
	composeEventMaps,
	isPressInput,
	resolveDragInputKind,
	shouldHandleDragEndInput,
	shouldHandleMouseDragMoveInput,
	shouldHandleTouchDragMoveInput,
	type DragInputKind,
} from "../_shared/interaction";
import { DRAG_OVERLAY_Z_INDEX } from "../_shared/overlayLayerPolicy";
import {
	resolveThemeSizeSafe,
	resolveUDimSafe,
	mergeSharedStyleProps,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { resolveDraggableSelectionNeighborIndex } from "./selection";
import type { DraggableItem, DraggableItemRenderState, DraggableProps, DraggableSlotProps } from "./types";

const UserInputService = game.GetService("UserInputService");
const RunService = game.GetService("RunService");
const TweenService = game.GetService("TweenService");

const DRAG_LIFT_SCALE = 0.04;
const DRAG_LIFT_ROTATION = 1.5;

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];

function resolveGap(theme: Theme, value: DraggableProps["gap"]): UDim | undefined {
	if (value === undefined) {
		return undefined;
	}

	switch (value) {
		case "xs":
		case "sm":
		case "md":
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "draggable", value, "spacing", 0));
		default:
			return resolveUDimSafe("draggable", value, "gap");
	}
}

function resolveFillDirection(direction: DraggableProps["direction"]): Enum.FillDirection {
	return direction === "horizontal" ? Enum.FillDirection.Horizontal : Enum.FillDirection.Vertical;
}

function resolveHorizontalAlignment(
	direction: DraggableProps["direction"],
	align: DraggableProps["align"],
	justify: DraggableProps["justify"],
): Enum.HorizontalAlignment | undefined {
	const isVertical = direction !== "horizontal";

	if (isVertical) {
		switch (align) {
			case "start":
				return Enum.HorizontalAlignment.Left;
			case "center":
				return Enum.HorizontalAlignment.Center;
			case "end":
				return Enum.HorizontalAlignment.Right;
			case "stretch":
				return Enum.HorizontalAlignment.Center;
			default:
				return undefined;
		}
	}

	switch (justify) {
		case "start":
			return Enum.HorizontalAlignment.Left;
		case "center":
			return Enum.HorizontalAlignment.Center;
		case "end":
			return Enum.HorizontalAlignment.Right;
		default:
			return undefined;
	}
}

function resolveVerticalAlignment(
	direction: DraggableProps["direction"],
	align: DraggableProps["align"],
	justify: DraggableProps["justify"],
): Enum.VerticalAlignment | undefined {
	const isVertical = direction !== "horizontal";

	if (isVertical) {
		switch (justify) {
			case "start":
				return Enum.VerticalAlignment.Top;
			case "center":
				return Enum.VerticalAlignment.Center;
			case "end":
				return Enum.VerticalAlignment.Bottom;
			default:
				return undefined;
		}
	}

	switch (align) {
		case "start":
			return Enum.VerticalAlignment.Top;
		case "center":
			return Enum.VerticalAlignment.Center;
		case "end":
			return Enum.VerticalAlignment.Bottom;
		case "stretch":
			return Enum.VerticalAlignment.Center;
		default:
			return undefined;
	}
}

function resolveHorizontalFlex(
	direction: DraggableProps["direction"],
	justify: DraggableProps["justify"],
): Enum.UIFlexAlignment | undefined {
	if (direction !== "horizontal") {
		return undefined;
	}

	switch (justify) {
		case "fill":
			return Enum.UIFlexAlignment.Fill;
		case "spaceAround":
			return Enum.UIFlexAlignment.SpaceAround;
		case "spaceBetween":
			return Enum.UIFlexAlignment.SpaceBetween;
		case "spaceEvenly":
			return Enum.UIFlexAlignment.SpaceEvenly;
		default:
			return undefined;
	}
}

function resolveVerticalFlex(
	direction: DraggableProps["direction"],
	justify: DraggableProps["justify"],
): Enum.UIFlexAlignment | undefined {
	if (direction === "horizontal") {
		return undefined;
	}

	switch (justify) {
		case "fill":
			return Enum.UIFlexAlignment.Fill;
		case "spaceAround":
			return Enum.UIFlexAlignment.SpaceAround;
		case "spaceBetween":
			return Enum.UIFlexAlignment.SpaceBetween;
		case "spaceEvenly":
			return Enum.UIFlexAlignment.SpaceEvenly;
		default:
			return undefined;
	}
}

function resolveItemLineAlignment(align: DraggableProps["align"]): Enum.ItemLineAlignment | undefined {
	return align === "stretch" ? Enum.ItemLineAlignment.Stretch : undefined;
}

function resolveInputPosition(input: InputObject): Vector2 {
	return new Vector2(input.Position.X, input.Position.Y);
}

function resolveAxisLockedDragPosition(
	direction: DraggableProps["direction"],
	inputPosition: Vector2,
	grabOffset: Vector2,
	origin: Vector2,
): Vector2 {
	const freePosition = inputPosition.sub(grabOffset);
	return direction === "horizontal" ? new Vector2(freePosition.X, origin.Y) : new Vector2(origin.X, freePosition.Y);
}

function clampDragPositionToListBounds(
	position: Vector2,
	itemSize: Vector2 | undefined,
	listInstance: Frame | undefined,
): Vector2 {
	if (itemSize === undefined || listInstance === undefined) {
		return position;
	}

	const listPosition = listInstance.AbsolutePosition;
	const listSize = listInstance.AbsoluteSize;
	const minX = listPosition.X;
	const minY = listPosition.Y;
	const maxX = math.max(minX, listPosition.X + listSize.X - itemSize.X);
	const maxY = math.max(minY, listPosition.Y + listSize.Y - itemSize.Y);

	return new Vector2(math.clamp(position.X, minX, maxX), math.clamp(position.Y, minY, maxY));
}

function resolveItemCenter(direction: DraggableProps["direction"], instance: GuiObject): number {
	return direction === "horizontal"
		? instance.AbsolutePosition.X + instance.AbsoluteSize.X / 2
		: instance.AbsolutePosition.Y + instance.AbsoluteSize.Y / 2;
}

function resolveVisualItemCenter(
	direction: DraggableProps["direction"],
	visualPosition: Vector2,
	instance: GuiObject,
): number {
	return direction === "horizontal"
		? visualPosition.X + instance.AbsoluteSize.X / 2
		: visualPosition.Y + instance.AbsoluteSize.Y / 2;
}

function findOrderIndex(order: readonly string[], itemId: string): number {
	for (let index = 0; index < order.size(); index += 1) {
		if (order[index] === itemId) {
			return index;
		}
	}

	return -1;
}

function areOrdersEqual(left: readonly string[], right: readonly string[]): boolean {
	if (left.size() !== right.size()) {
		return false;
	}

	for (let index = 0; index < left.size(); index += 1) {
		if (left[index] !== right[index]) {
			return false;
		}
	}

	return true;
}

function dedupeItems<TItem extends DraggableItem>(items: readonly TItem[]): readonly TItem[] {
	const seen = new Set<string>();
	const unique: TItem[] = [];

	for (const item of items) {
		if (seen.has(item.id)) {
			continue;
		}

		seen.add(item.id);
		unique.push(item);
	}

	return unique;
}

function buildItemRecord<TItem extends DraggableItem>(items: readonly TItem[]): Record<string, TItem> {
	const record = {} as Record<string, TItem>;

	for (const item of items) {
		record[item.id] = item;
	}

	return record;
}

function normalizeOrder<TItem extends DraggableItem>(
	candidate: readonly string[] | undefined,
	items: readonly TItem[],
): readonly string[] {
	const itemIds = new Set<string>();
	for (const item of items) {
		itemIds.add(item.id);
	}

	const seen = new Set<string>();
	const normalized: string[] = [];

	for (const id of candidate ?? []) {
		if (!itemIds.has(id) || seen.has(id)) {
			continue;
		}

		seen.add(id);
		normalized.push(id);
	}

	for (const item of items) {
		if (seen.has(item.id)) {
			continue;
		}

		seen.add(item.id);
		normalized.push(item.id);
	}

	return normalized;
}

function resolveReorderedOrder(
	order: readonly string[],
	activeItemId: string,
	pointerCoordinate: number,
	itemRefs: Record<string, TextButton | undefined>,
	direction: DraggableProps["direction"],
): readonly string[] {
	if (!order.includes(activeItemId)) {
		return order;
	}

	const remaining = order.filter((id) => id !== activeItemId);
	let insertionIndex = remaining.size();

	for (let index = 0; index < remaining.size(); index += 1) {
		const instance = itemRefs[remaining[index]];
		if (instance === undefined) {
			continue;
		}

		if (pointerCoordinate <= resolveItemCenter(direction, instance)) {
			insertionIndex = index;
			break;
		}
	}

	const nextOrder = new Array<string>();
	for (let index = 0; index < insertionIndex; index += 1) {
		nextOrder.push(remaining[index]);
	}

	nextOrder.push(activeItemId);

	for (let index = insertionIndex; index < remaining.size(); index += 1) {
		nextOrder.push(remaining[index]);
	}

	return nextOrder;
}

function resolveItemSize(
	direction: DraggableProps["direction"],
	align: DraggableProps["align"],
): {
	readonly size?: UDim2;
	readonly automaticSize: Enum.AutomaticSize;
} {
	if (direction === "horizontal") {
		if (align === "stretch") {
			return {
				size: UDim2.fromScale(0, 1),
				automaticSize: Enum.AutomaticSize.X,
			};
		}

		return {
			automaticSize: Enum.AutomaticSize.XY,
		};
	}

	if (align === "stretch") {
		return {
			size: UDim2.fromScale(1, 0),
			automaticSize: Enum.AutomaticSize.Y,
		};
	}

	return {
		automaticSize: Enum.AutomaticSize.XY,
	};
}

function resolveMeasuredItemLayout(measuredSize: Vector2 | undefined): {
	readonly size?: UDim2;
	readonly automaticSize?: Enum.AutomaticSize;
} {
	if (measuredSize === undefined || measuredSize.X <= 0 || measuredSize.Y <= 0) {
		return {};
	}

	return {
		size: UDim2.fromOffset(measuredSize.X, measuredSize.Y),
		automaticSize: Enum.AutomaticSize.None,
	};
}

interface DraggableItemButtonProps<TItem extends DraggableItem> {
	readonly item: TItem;
	readonly index: number;
	readonly interactive: boolean;
	readonly itemDisabled: boolean;
	readonly itemActive: boolean;
	readonly itemDragging: boolean;
	/** True while the drag overlay owns this item's visual (dragging or settling). */
	readonly itemHidden: boolean;
	readonly direction: DraggableProps["direction"];
	readonly align: DraggableProps["align"];
	readonly cursor: DraggableProps["cursor"];
	readonly slotProps: DraggableSlotProps["item"] | undefined;
	readonly resolvedBackgroundColor: Color3 | undefined;
	readonly renderItem: (state: DraggableItemRenderState<TItem>) => React.ReactNode;
	readonly onBeginDrag: (itemId: string, itemDisabled: boolean | undefined, input: InputObject) => void;
	readonly onDragMove: (input: InputObject) => void;
	readonly onDragEnd: (input: InputObject) => void;
	readonly onSelectionChange: (itemId: string, selected: boolean) => void;
	readonly nextSelectionUp: TextButton | undefined;
	readonly nextSelectionDown: TextButton | undefined;
	readonly nextSelectionLeft: TextButton | undefined;
	readonly nextSelectionRight: TextButton | undefined;
	readonly setItemRef: (itemId: string, instance: TextButton | undefined) => void;
}

function DraggableItemButton<TItem extends DraggableItem>(props: DraggableItemButtonProps<TItem>) {
	const theme = useTheme();
	const [itemInstance, setItemInstance] = React.useState<TextButton>();
	const [animatedOffset, setAnimatedOffset] = React.useState(new Vector2(0, 0));
	const [measuredSize, setMeasuredSize] = React.useState<Vector2>();
	const lastAbsolutePositionRef = React.useRef<Vector2>();
	const draggingRef = React.useRef(props.itemHidden);
	const transitionConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const transitionVersionRef = React.useRef(0);
	const shiftMotionRef = React.useRef(theme.motion);
	const itemSize = React.useMemo(() => resolveItemSize(props.direction, props.align), [props.align, props.direction]);

	draggingRef.current = props.itemHidden;
	shiftMotionRef.current = theme.motion;

	const stopTransition = React.useCallback(() => {
		transitionConnectionRef.current?.Disconnect();
		transitionConnectionRef.current = undefined;
		transitionVersionRef.current += 1;
	}, []);

	const animateOffsetToZero = React.useCallback(
		(offset: Vector2) => {
			stopTransition();
			setAnimatedOffset(offset);

			const version = transitionVersionRef.current;
			const startedAt = os.clock();
			transitionConnectionRef.current = RunService.Heartbeat.Connect(() => {
				if (transitionVersionRef.current !== version) {
					transitionConnectionRef.current?.Disconnect();
					transitionConnectionRef.current = undefined;
					return;
				}

				const motion = shiftMotionRef.current;
				const alpha = math.clamp((os.clock() - startedAt) / math.max(motion.duration.normal, 0.01), 0, 1);
				const easedAlpha = TweenService.GetValue(alpha, motion.easing.out.style, motion.easing.out.direction);
				const remainingAlpha = 1 - easedAlpha;
				setAnimatedOffset(new Vector2(offset.X * remainingAlpha, offset.Y * remainingAlpha));

				if (alpha >= 1) {
					transitionConnectionRef.current?.Disconnect();
					transitionConnectionRef.current = undefined;
					setAnimatedOffset(new Vector2(0, 0));
				}
			});
		},
		[stopTransition],
	);

	React.useEffect(() => {
		if (itemInstance === undefined) {
			return;
		}

		const updateMeasuredSize = () => {
			const nextSize = itemInstance.AbsoluteSize;
			if (nextSize.X <= 0 || nextSize.Y <= 0) {
				return;
			}

			setMeasuredSize((currentSize) =>
				currentSize !== undefined && currentSize.X === nextSize.X && currentSize.Y === nextSize.Y
					? currentSize
					: nextSize,
			);
		};

		updateMeasuredSize();
		const absoluteSizeConnection = itemInstance.GetPropertyChangedSignal("AbsoluteSize").Connect(updateMeasuredSize);

		return () => {
			absoluteSizeConnection.Disconnect();
		};
	}, [itemInstance]);

	React.useEffect(() => {
		if (itemInstance === undefined) {
			return;
		}

		lastAbsolutePositionRef.current = itemInstance.AbsolutePosition;

		const updateLayoutOffset = () => {
			const previousPosition = lastAbsolutePositionRef.current;
			const nextPosition = itemInstance.AbsolutePosition;
			lastAbsolutePositionRef.current = nextPosition;

			if (previousPosition === undefined || draggingRef.current) {
				return;
			}

			const offset = previousPosition.sub(nextPosition);
			if (offset.X === 0 && offset.Y === 0) {
				return;
			}

			animateOffsetToZero(offset);
		};

		const absolutePositionConnection = itemInstance
			.GetPropertyChangedSignal("AbsolutePosition")
			.Connect(updateLayoutOffset);

		return () => {
			absolutePositionConnection.Disconnect();
		};
	}, [animateOffsetToZero, itemInstance]);

	React.useEffect(() => {
		if (props.itemHidden) {
			stopTransition();
			setAnimatedOffset(new Vector2(0, 0));
		}
	}, [props.itemHidden, stopTransition]);

	React.useEffect(() => {
		return () => {
			stopTransition();
		};
	}, [stopTransition]);

	const internalEvent: TextButtonEventMap = {
		SelectionGained: () => {
			if (props.interactive && !props.itemDisabled) {
				props.onSelectionChange(props.item.id, true);
			}
		},
		SelectionLost: () => {
			props.onSelectionChange(props.item.id, false);
		},
		InputBegan: (_button, input) => {
			props.onBeginDrag(props.item.id, props.item.disabled, input);
		},
		InputChanged: (_button, input) => {
			props.onDragMove(input);
		},
		InputEnded: (_button, input) => {
			props.onDragEnd(input);
		},
	};
	const itemEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, props.slotProps?.Event),
		props.slotProps?.Event === undefined && props.interactive && !props.itemDisabled ? props.cursor : undefined,
		!props.interactive || props.itemDisabled,
	);
	const renderState: DraggableItemRenderState<TItem> = {
		item: props.item,
		index: props.index,
		dragging: props.itemDragging,
		active: props.itemActive,
		disabled: props.itemDisabled,
	};
	const renderedOffset = props.itemHidden ? new Vector2(0, 0) : animatedOffset;
	const hasVisualOffset = renderedOffset.X !== 0 || renderedOffset.Y !== 0;
	const measuredLayout = props.itemHidden || hasVisualOffset ? resolveMeasuredItemLayout(measuredSize) : undefined;
	const layoutSize = measuredLayout?.size ?? itemSize.size;
	const layoutAutomaticSize = measuredLayout?.automaticSize ?? itemSize.automaticSize;
	const visualSize = measuredLayout?.size ?? itemSize.size ?? UDim2.fromScale(1, 1);
	const visualAutomaticSize =
		measuredLayout?.automaticSize ?? (itemSize.size === undefined ? itemSize.automaticSize : Enum.AutomaticSize.None);
	const itemRef = React.useCallback(
		(instance: TextButton | undefined) => {
			setItemInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			props.setItemRef(props.item.id, instance);
		},
		[props.item.id, props.setItemRef],
	);

	return (
		<textbutton
			AutoButtonColor={false}
			Active={props.interactive && !props.itemDisabled}
			Selectable={props.interactive && !props.itemDisabled}
			BorderSizePixel={0}
			BackgroundTransparency={1}
			BackgroundColor3={props.resolvedBackgroundColor}
			Size={layoutSize}
			AutomaticSize={layoutAutomaticSize}
			LayoutOrder={props.index}
			NextSelectionUp={props.nextSelectionUp}
			NextSelectionDown={props.nextSelectionDown}
			NextSelectionLeft={props.nextSelectionLeft}
			NextSelectionRight={props.nextSelectionRight}
			Event={itemEvent}
			Text=""
			TextTransparency={1}
			TextStrokeTransparency={1}
			ref={itemRef}
			{...props.slotProps}
		>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromOffset(renderedOffset.X, renderedOffset.Y)}
				Size={visualSize}
				AutomaticSize={visualAutomaticSize}
				Active={false}
				Selectable={false}
				Visible={!props.itemHidden}
			>
				{props.renderItem(renderState)}
			</frame>
		</textbutton>
	);
}

function DraggableComponent<TItem extends DraggableItem>(props: DraggableProps<TItem>, ref: React.Ref<Frame>) {
	const {
		items,
		value,
		defaultValue,
		onReorder,
		renderItem,
		disabled = false,
		active = true,
		Event,
		Change,
		slotProps,
	} = props;
	const mergedStyleProps = mergeSharedStyleProps({ cursor: "pointer" }, props);
	const rootSlotProps = slotProps?.root;
	const itemSlotProps = slotProps?.item;
	const direction = props.direction ?? "vertical";
	const interactive = active && !disabled;
	const controlled = value !== undefined;
	const uniqueItems = React.useMemo(() => dedupeItems(items), [items]);
	const itemRecord = React.useMemo(() => buildItemRecord(uniqueItems), [uniqueItems]);
	const [uncontrolledOrder, setUncontrolledOrder] = React.useState<readonly string[]>(() =>
		normalizeOrder(defaultValue, uniqueItems),
	);
	const resolvedOrder = React.useMemo(
		() => normalizeOrder(controlled ? value : uncontrolledOrder, uniqueItems),
		[controlled, uniqueItems, uncontrolledOrder, value],
	);
	const [activeItemId, setActiveItemId] = React.useState<string | undefined>(undefined);
	const [focusedItemId, setFocusedItemId] = React.useState<string | undefined>(undefined);
	const [draggingItemId, setDraggingItemId] = React.useState<string | undefined>(undefined);
	const [settlingItemId, setSettlingItemId] = React.useState<string | undefined>(undefined);
	const [dragVisualPosition, setDragVisualPosition] = React.useState<Vector2 | undefined>(undefined);
	const [dragVisualSize, setDragVisualSize] = React.useState<Vector2 | undefined>(undefined);
	const [rootInstance, setRootInstance] = React.useState<Frame>();
	const [listInstance, setListInstance] = React.useState<Frame>();
	const [measuredListSize, setMeasuredListSize] = React.useState<Vector2>();
	const itemRefs = React.useRef<Record<string, TextButton | undefined>>({});
	const [selectionItemInstances, setSelectionItemInstances] = React.useState<
		Readonly<Record<string, TextButton | undefined>>
	>({});
	const currentOrderRef = React.useRef<readonly string[]>(resolvedOrder);
	const dragKindRef = React.useRef<DragInputKind | undefined>(undefined);
	const activeTouchRef = React.useRef<InputObject | undefined>(undefined);
	const dragGrabOffsetRef = React.useRef<Vector2 | undefined>(undefined);
	const dragOriginRef = React.useRef<Vector2 | undefined>(undefined);
	const dragVisualSizeRef = React.useRef<Vector2 | undefined>(undefined);
	const moveConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const endConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const settleConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const dragVisualPositionRef = React.useRef<Vector2 | undefined>(undefined);
	const draggingItemIdRef = React.useRef<string | undefined>(undefined);
	const configRef = React.useRef({ controlled, direction });
	const onReorderRef = React.useRef(onReorder);

	onReorderRef.current = onReorder;
	currentOrderRef.current = resolvedOrder;
	configRef.current = { controlled, direction };
	const setItemRef = React.useCallback((itemId: string, instance: TextButton | undefined) => {
		itemRefs.current[itemId] = instance;
		setSelectionItemInstances((currentInstances) => {
			if (currentInstances[itemId] === instance) {
				return currentInstances;
			}

			return { ...currentInstances, [itemId]: instance };
		});
	}, []);
	const handleSelectionChange = React.useCallback((itemId: string, selected: boolean) => {
		setFocusedItemId((currentItemId) => (selected ? itemId : currentItemId === itemId ? undefined : currentItemId));
	}, []);

	const {
		theme,
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedBackgroundColor,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hasPadding,
	} = useResolvedStyleProps("draggable", mergedStyleProps);

	const themeRef = React.useRef(theme);
	themeRef.current = theme;

	const disconnectDragTracking = React.useCallback(() => {
		moveConnectionRef.current?.Disconnect();
		moveConnectionRef.current = undefined;
		endConnectionRef.current?.Disconnect();
		endConnectionRef.current = undefined;
		dragKindRef.current = undefined;
		activeTouchRef.current = undefined;
		dragGrabOffsetRef.current = undefined;
		dragOriginRef.current = undefined;
		dragVisualSizeRef.current = undefined;
	}, []);

	const stopSettle = React.useCallback(() => {
		settleConnectionRef.current?.Disconnect();
		settleConnectionRef.current = undefined;
		setSettlingItemId(undefined);
	}, []);

	const clearDragVisual = React.useCallback(() => {
		dragVisualPositionRef.current = undefined;
		setDragVisualPosition(undefined);
		setDragVisualSize(undefined);
	}, []);

	const endDrag = React.useCallback(
		(clearActiveItem: boolean) => {
			const itemId = draggingItemIdRef.current;
			const startPosition = dragVisualPositionRef.current;

			disconnectDragTracking();
			draggingItemIdRef.current = undefined;
			setDraggingItemId(undefined);

			if (clearActiveItem) {
				setActiveItemId(undefined);
			}

			// Settle: fly the overlay back to its slot before releasing it,
			// tracking the slot live in case layout shifts mid-flight.
			const targetInstance = itemId !== undefined ? itemRefs.current[itemId] : undefined;
			if (itemId === undefined || startPosition === undefined || targetInstance === undefined) {
				clearDragVisual();
				return;
			}

			stopSettle();
			setSettlingItemId(itemId);
			const motion = themeRef.current.motion;
			const duration = math.max(motion.duration.slow, 0.01);
			const startedAt = os.clock();
			settleConnectionRef.current = RunService.Heartbeat.Connect(() => {
				const instance = itemRefs.current[itemId];
				const alpha = math.clamp((os.clock() - startedAt) / duration, 0, 1);
				if (instance === undefined || alpha >= 1) {
					settleConnectionRef.current?.Disconnect();
					settleConnectionRef.current = undefined;
					setSettlingItemId(undefined);
					clearDragVisual();
					return;
				}

				const easedAlpha = TweenService.GetValue(alpha, motion.easing.out.style, motion.easing.out.direction);
				setDragVisualPosition(startPosition.Lerp(instance.AbsolutePosition, easedAlpha));
			});
		},
		[clearDragVisual, disconnectDragTracking, stopSettle],
	);

	const commitOrder = React.useCallback((nextOrder: readonly string[]) => {
		const previousOrder = currentOrderRef.current;
		if (areOrdersEqual(nextOrder, previousOrder)) {
			return previousOrder;
		}

		currentOrderRef.current = nextOrder;

		if (!configRef.current.controlled) {
			setUncontrolledOrder(nextOrder);
		}

		onReorderRef.current?.(nextOrder);
		return nextOrder;
	}, []);

	const updateDragVisualPosition = React.useCallback(
		(input: InputObject) => {
			const grabOffset = dragGrabOffsetRef.current;
			const origin = dragOriginRef.current;
			if (grabOffset === undefined || origin === undefined) {
				return undefined;
			}

			const pointerPosition = resolveAxisLockedDragPosition(
				configRef.current.direction,
				resolveInputPosition(input),
				grabOffset,
				origin,
			);
			const visualPosition = clampDragPositionToListBounds(pointerPosition, dragVisualSizeRef.current, listInstance);
			dragVisualPositionRef.current = visualPosition;
			setDragVisualPosition(visualPosition);
			// Reordering follows the unclamped pointer: the clamp caps the visual's center at the
			// boundary slots' centers, which would make the trailing slot unreachable.
			return pointerPosition;
		},
		[listInstance],
	);

	const updateOrderFromInput = React.useCallback(
		(pointerPosition: Vector2 | undefined) => {
			const activeId = draggingItemIdRef.current;
			if (activeId === undefined || pointerPosition === undefined) {
				return;
			}

			const activeInstance = itemRefs.current[activeId];
			if (activeInstance === undefined) {
				return;
			}

			commitOrder(
				resolveReorderedOrder(
					currentOrderRef.current,
					activeId,
					resolveVisualItemCenter(configRef.current.direction, pointerPosition, activeInstance),
					itemRefs.current,
					configRef.current.direction,
				),
			);
		},
		[commitOrder],
	);

	const handleDragMoveInput = React.useCallback(
		(input: InputObject) => {
			if (shouldHandleMouseDragMoveInput(dragKindRef.current, input)) {
				const pointerPosition = updateDragVisualPosition(input);
				updateOrderFromInput(pointerPosition);
				return;
			}

			if (shouldHandleTouchDragMoveInput(dragKindRef.current, activeTouchRef.current, input)) {
				const pointerPosition = updateDragVisualPosition(input);
				updateOrderFromInput(pointerPosition);
			}
		},
		[updateDragVisualPosition, updateOrderFromInput],
	);

	const handleDragEndInput = React.useCallback(
		(input: InputObject) => {
			if (!shouldHandleDragEndInput(dragKindRef.current, activeTouchRef.current, input)) {
				return;
			}

			endDrag(true);
		},
		[endDrag],
	);

	const beginDrag = React.useCallback(
		(itemId: string, itemDisabled: boolean | undefined, input: InputObject) => {
			if (!interactive || itemDisabled || !isPressInput(input)) {
				return;
			}

			const dragKind = resolveDragInputKind(input);
			if (dragKind === undefined) {
				return;
			}

			disconnectDragTracking();
			stopSettle();

			const itemInstance = itemRefs.current[itemId];
			if (itemInstance !== undefined) {
				const inputPosition = resolveInputPosition(input);
				const grabOffset = inputPosition.sub(itemInstance.AbsolutePosition);
				dragGrabOffsetRef.current = grabOffset;
				dragOriginRef.current = itemInstance.AbsolutePosition;
				dragVisualSizeRef.current = itemInstance.AbsoluteSize;
				dragVisualPositionRef.current = itemInstance.AbsolutePosition;
				setDragVisualPosition(itemInstance.AbsolutePosition);
				setDragVisualSize(itemInstance.AbsoluteSize);
			} else {
				dragOriginRef.current = undefined;
				dragVisualSizeRef.current = undefined;
				dragVisualPositionRef.current = undefined;
				setDragVisualPosition(undefined);
				setDragVisualSize(undefined);
			}
			dragKindRef.current = dragKind;
			activeTouchRef.current = dragKind === "touch" ? input : undefined;
			draggingItemIdRef.current = itemId;
			setActiveItemId(itemId);
			setDraggingItemId(itemId);

			moveConnectionRef.current = UserInputService.InputChanged.Connect((changedInput) => {
				handleDragMoveInput(changedInput);
			});

			endConnectionRef.current = UserInputService.InputEnded.Connect((endedInput) => {
				handleDragEndInput(endedInput);
			});
		},
		[
			disconnectDragTracking,
			handleDragEndInput,
			handleDragMoveInput,
			interactive,
			stopSettle,
			updateDragVisualPosition,
			updateOrderFromInput,
		],
	);

	React.useEffect(() => {
		if (controlled) {
			return;
		}

		setUncontrolledOrder((current) => {
			const normalizedOrder = normalizeOrder(current, uniqueItems);
			return areOrdersEqual(normalizedOrder, current) ? current : normalizedOrder;
		});
	}, [controlled, uniqueItems]);

	React.useEffect(() => {
		if (interactive) {
			return;
		}

		endDrag(true);
	}, [endDrag, interactive]);

	React.useEffect(() => {
		const activeId = draggingItemIdRef.current;
		if (activeId === undefined) {
			return;
		}

		if (!resolvedOrder.includes(activeId)) {
			endDrag(true);
			return;
		}

		const activeItem = itemRecord[activeId];
		if (activeItem === undefined || activeItem.disabled) {
			endDrag(true);
		}
	}, [endDrag, itemRecord, resolvedOrder]);

	React.useEffect(() => {
		if (focusedItemId === undefined) {
			return;
		}

		const focusedItem = itemRecord[focusedItemId];
		if (
			!interactive ||
			focusedItem === undefined ||
			focusedItem.disabled === true ||
			!resolvedOrder.includes(focusedItemId)
		) {
			setFocusedItemId(undefined);
		}
	}, [focusedItemId, interactive, itemRecord, resolvedOrder]);

	React.useEffect(() => {
		return () => {
			disconnectDragTracking();
			settleConnectionRef.current?.Disconnect();
			settleConnectionRef.current = undefined;
		};
	}, [disconnectDragTracking]);

	React.useEffect(() => {
		if (listInstance === undefined) {
			return;
		}

		const updateMeasuredListSize = () => {
			const nextSize = listInstance.AbsoluteSize;
			if (nextSize.X <= 0 || nextSize.Y <= 0) {
				return;
			}

			setMeasuredListSize((currentSize) =>
				currentSize !== undefined && currentSize.X === nextSize.X && currentSize.Y === nextSize.Y
					? currentSize
					: nextSize,
			);
		};

		updateMeasuredListSize();
		const absoluteSizeConnection = listInstance
			.GetPropertyChangedSignal("AbsoluteSize")
			.Connect(updateMeasuredListSize);

		return () => {
			absoluteSizeConnection.Disconnect();
		};
	}, [listInstance]);

	let computedSize: UDim2 | undefined;
	let computedAutoSize: Enum.AutomaticSize | undefined;
	if (resolvedSize !== undefined) {
		computedSize = resolvedSize;
	} else if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		computedSize = new UDim2(resolvedWidth, resolvedHeight);
	} else if (resolvedWidth !== undefined) {
		computedSize = new UDim2(resolvedWidth, new UDim(0, 0));
		computedAutoSize = Enum.AutomaticSize.Y;
	} else if (resolvedHeight !== undefined) {
		computedSize = new UDim2(new UDim(0, 0), resolvedHeight);
		computedAutoSize = Enum.AutomaticSize.X;
	} else {
		computedAutoSize = Enum.AutomaticSize.XY;
	}

	const resolvedGap = resolveGap(theme, props.gap);
	const horizontalAlignment = resolveHorizontalAlignment(direction, props.align, props.justify);
	const verticalAlignment = resolveVerticalAlignment(direction, props.align, props.justify);
	const horizontalFlex = resolveHorizontalFlex(direction, props.justify);
	const verticalFlex = resolveVerticalFlex(direction, props.justify);
	const itemLineAlignment = resolveItemLineAlignment(props.align);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootEvent = useRootCursorEvent(Event, undefined, false);
	const decoratorChildren = new Array<React.ReactElement>();

	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({
			enabled: hasPadding,
			paddingTop,
			paddingRight,
			paddingBottom,
			paddingLeft,
			slotProps: slotProps?.padding,
		}),
	);
	pushDecorator(
		decoratorChildren,
		renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }),
	);

	decoratorChildren.push(
		<uilistlayout
			key="list-layout"
			FillDirection={resolveFillDirection(direction)}
			Padding={resolvedGap ?? new UDim(0, 0)}
			SortOrder={Enum.SortOrder.LayoutOrder}
			HorizontalAlignment={horizontalAlignment}
			VerticalAlignment={verticalAlignment}
			HorizontalFlex={horizontalFlex}
			VerticalFlex={verticalFlex}
			ItemLineAlignment={itemLineAlignment}
			Wraps={false}
			{...slotProps?.listLayout}
		/>,
	);

	const selectionDisabledItems = resolvedOrder.map((itemId) => !interactive || itemRecord[itemId]?.disabled === true);
	const itemElements = resolvedOrder.map((itemId, index) => {
		const item = itemRecord[itemId];
		if (item === undefined) {
			return undefined;
		}

		const itemDisabled = disabled || item.disabled === true;
		const previousIndex = itemDisabled
			? undefined
			: resolveDraggableSelectionNeighborIndex(selectionDisabledItems, index, -1);
		const nextIndex = itemDisabled
			? undefined
			: resolveDraggableSelectionNeighborIndex(selectionDisabledItems, index, 1);
		const previousInstance =
			previousIndex === undefined ? undefined : selectionItemInstances[resolvedOrder[previousIndex]];
		const nextInstance = nextIndex === undefined ? undefined : selectionItemInstances[resolvedOrder[nextIndex]];

		return (
			<DraggableItemButton
				key={item.id}
				item={item}
				index={index}
				interactive={interactive}
				itemDisabled={itemDisabled}
				itemActive={activeItemId === item.id || focusedItemId === item.id}
				itemDragging={draggingItemId === item.id}
				itemHidden={draggingItemId === item.id || settlingItemId === item.id}
				direction={direction}
				align={props.align}
				cursor={mergedStyleProps.cursor}
				slotProps={itemSlotProps}
				resolvedBackgroundColor={resolvedBackgroundColor}
				renderItem={renderItem}
				onBeginDrag={beginDrag}
				onDragMove={handleDragMoveInput}
				onDragEnd={handleDragEndInput}
				onSelectionChange={handleSelectionChange}
				nextSelectionUp={direction === "vertical" ? previousInstance : undefined}
				nextSelectionDown={direction === "vertical" ? nextInstance : undefined}
				nextSelectionLeft={direction === "horizontal" ? previousInstance : undefined}
				nextSelectionRight={direction === "horizontal" ? nextInstance : undefined}
				setItemRef={setItemRef}
			/>
		);
	});

	const shouldFreezeRootSize =
		draggingItemId !== undefined && computedAutoSize !== undefined && measuredListSize !== undefined;
	const effectiveRootSize = shouldFreezeRootSize
		? UDim2.fromOffset(measuredListSize.X, measuredListSize.Y)
		: computedSize;
	const effectiveRootAutoSize = shouldFreezeRootSize ? Enum.AutomaticSize.None : computedAutoSize;
	const frameInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: props.bgTransparency ?? (props.bg !== undefined ? 0 : 1),
		Size: effectiveRootSize,
		AutomaticSize: effectiveRootAutoSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		BackgroundColor3: resolvedBackgroundColor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: props.zIndex,
		Event: rootEvent,
		Change,
	};
	const rootRef = React.useCallback(
		(instance: Frame | undefined) => {
			setRootInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			assignRef(ref, instance);
		},
		[ref],
	);
	const listRef = React.useCallback((instance: Frame | undefined) => {
		setListInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
	}, []);
	const overlayItemId = draggingItemId ?? settlingItemId;
	const overlayItem = overlayItemId !== undefined ? itemRecord[overlayItemId] : undefined;
	const overlayIndex = overlayItemId !== undefined ? findOrderIndex(resolvedOrder, overlayItemId) : -1;
	const overlayPosition =
		dragVisualPosition !== undefined && rootInstance !== undefined
			? dragVisualPosition.sub(rootInstance.AbsolutePosition)
			: undefined;
	const overlaySize = dragVisualSize ?? dragVisualSizeRef.current;
	const animatedLift = useMotion({
		values: { lift: draggingItemId !== undefined ? 1 : 0 },
		transition: { lift: { duration: "fast", easing: "out" } },
	});
	const overlayElement =
		overlayItem !== undefined && overlayPosition !== undefined && overlaySize !== undefined ? (
			<frame
				key="drag-overlay"
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromOffset(overlayPosition.X, overlayPosition.Y)}
				Size={UDim2.fromOffset(overlaySize.X, overlaySize.Y)}
				Rotation={DRAG_LIFT_ROTATION * animatedLift.lift}
				ZIndex={DRAG_OVERLAY_Z_INDEX}
				Active={false}
				Selectable={false}
			>
				{renderElevationShadow({
					shadow: theme.shadows.md,
					radius: new UDim(0, theme.radius.md),
					size: UDim2.fromOffset(overlaySize.X, overlaySize.Y),
					visible: animatedLift.lift > 0.05,
				})}
				<uiscale Scale={1 + DRAG_LIFT_SCALE * animatedLift.lift} />
				{renderItem({
					item: overlayItem,
					index: overlayIndex >= 0 ? overlayIndex : 0,
					dragging: true,
					active: true,
					disabled: disabled || overlayItem.disabled === true,
				})}
			</frame>
		) : undefined;

	return (
		<frame {...frameInstanceProps} {...rootSlotProps} ref={rootRef}>
			<frame
				key="list"
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={computedSize ?? UDim2.fromScale(1, 0)}
				AutomaticSize={computedAutoSize}
				ref={listRef}
			>
				{decoratorChildren}
				{itemElements}
			</frame>
			<frame
				key="overlay-layer"
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromOffset(0, 0)}
				Size={UDim2.fromOffset(0, 0)}
				ZIndex={DRAG_OVERLAY_Z_INDEX}
			>
				{overlayElement}
			</frame>
		</frame>
	);
}

type DraggableComponentType = <TItem extends DraggableItem>(props: DraggableProps<TItem>) => React.ReactElement;

const DraggableBase = React.forwardRef(DraggableComponent);

DraggableBase.displayName = "Draggable";

export const Draggable = DraggableBase as DraggableComponentType;
