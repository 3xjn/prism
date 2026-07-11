import React from "@rbxts/react";

import { renderPaddingDecorator, renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { resolveSelectionGroupProps } from "../_shared/selection";
import { resolveColorSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { ScrollAreaDirection, ScrollAreaProps, ScrollAreaScrollbarColorValue } from "./types";

function resolveScrollingDirection(direction: ScrollAreaDirection | undefined): Enum.ScrollingDirection {
	switch (direction) {
		case "horizontal":
			return Enum.ScrollingDirection.X;
		case "both":
			return Enum.ScrollingDirection.XY;
		case "vertical":
		default:
			return Enum.ScrollingDirection.Y;
	}
}

function resolveAutomaticCanvasSize(direction: ScrollAreaDirection | undefined, value: Enum.AutomaticSize | undefined): Enum.AutomaticSize {
	if (value !== undefined) {
		return value;
	}

	switch (direction) {
		case "horizontal":
			return Enum.AutomaticSize.X;
		case "both":
			return Enum.AutomaticSize.XY;
		case "vertical":
		default:
			return Enum.AutomaticSize.Y;
	}
}

function resolveContentSize(direction: ScrollAreaDirection | undefined, scrollbarSize: number): UDim2 {
	switch (direction) {
		case "horizontal":
			return new UDim2(0, 0, 1, 0);
		case "both":
			return UDim2.fromOffset(0, 0);
		case "vertical":
		default:
			return new UDim2(1, -scrollbarSize, 0, 0);
	}
}

function resolveContentAutomaticSize(direction: ScrollAreaDirection | undefined): Enum.AutomaticSize {
	switch (direction) {
		case "horizontal":
			return Enum.AutomaticSize.X;
		case "both":
			return Enum.AutomaticSize.XY;
		case "vertical":
		default:
			return Enum.AutomaticSize.Y;
	}
}

function resolveScrollbarColor(
	theme: ReturnType<typeof useResolvedStyleProps>["theme"],
	color: ScrollAreaScrollbarColorValue | undefined,
): Color3 {
	if (color === undefined) {
		return theme.colors.text.disabled;
	}

	if (typeIs(color, "Color3")) {
		return color;
	}

	return resolveColorSafe(theme, "scrollArea", color, theme.colors.text.disabled) ?? theme.colors.text.disabled;
}

export const ScrollArea = React.forwardRef<ScrollingFrame, ScrollAreaProps>((props, ref) => {
	const { slotProps } = props;
	const rootSlotProps = slotProps?.root;
	const contentSlotProps = slotProps?.content;
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
	} = useResolvedStyleProps("scrollArea", props);
	const scrollbarSize = props.scrollbarSize ?? theme.spacing.xs;

	let computedSize: UDim2 | undefined;
	if (resolvedSize !== undefined) {
		computedSize = resolvedSize;
	} else if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		computedSize = new UDim2(resolvedWidth, resolvedHeight);
	} else if (resolvedWidth !== undefined) {
		computedSize = new UDim2(resolvedWidth, new UDim(0, 0));
	} else if (resolvedHeight !== undefined) {
		computedSize = new UDim2(new UDim(0, 0), resolvedHeight);
	}

	const rootEvent = useRootCursorEvent(props.Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const rootChange = props.onCanvasPositionChange === undefined ? props.Change : {
		...props.Change,
		CanvasPosition: (instance: ScrollingFrame) => {
			props.Change?.CanvasPosition?.(instance);
			props.onCanvasPositionChange?.(instance.CanvasPosition);
		},
	};
	const rootInstanceProps: Partial<React.InstanceProps<ScrollingFrame>> = {
		...resolveSelectionGroupProps(props),
		Active: props.scrollingEnabled ?? true,
		AutomaticCanvasSize: resolveAutomaticCanvasSize(props.direction, props.automaticCanvasSize),
		BackgroundColor3: resolvedBackgroundColor,
		BackgroundTransparency: props.bgTransparency ?? (props.bg !== undefined ? 0 : 1),
		BorderSizePixel: 0,
		CanvasPosition: props.canvasPosition,
		CanvasSize: props.canvasSize ?? UDim2.fromOffset(0, 0),
		ClipsDescendants: true,
		Position: resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined),
		AnchorPoint: resolvedAnchor,
		ScrollBarImageColor3: resolveScrollbarColor(theme, props.scrollbarColor),
		ScrollBarImageTransparency: props.scrollbarTransparency ?? 0.2,
		ScrollBarThickness: scrollbarSize,
		ScrollingDirection: resolveScrollingDirection(props.direction),
		ScrollingEnabled: props.scrollingEnabled ?? true,
		Selectable: false,
		Size: computedSize,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: props.zIndex,
		Event: rootEvent,
		Change: rootChange,
	};

	return (
		<scrollingframe {...rootInstanceProps} {...rootSlotProps} ref={ref}>
			{renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint })}
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={resolveContentSize(props.direction, scrollbarSize)}
				AutomaticSize={resolveContentAutomaticSize(props.direction)}
				ZIndex={rootSlotProps?.ZIndex ?? props.zIndex}
				{...contentSlotProps}
			>
				{renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding })}
				{props.children}
			</frame>
		</scrollingframe>
	);
});

ScrollArea.displayName = "ScrollArea";
