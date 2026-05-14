import React from "@rbxts/react";

import type { Theme } from "@prism/theme";

import { pushDecorator, renderPaddingDecorator, renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { resolveThemeSizeSafe, resolveUDimSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { StackAlign, StackDirection, StackJustify, StackGapValue, StackProps } from "./types";

function resolveGap(theme: Theme, value: StackGapValue | undefined): UDim | undefined {
	if (value === undefined) {
		return undefined;
	}

	switch (value) {
		case "xs":
		case "sm":
		case "md":
		case "lg":
		case "xl":
			return new UDim(0, resolveThemeSizeSafe(theme, "stack", value, "spacing", 0));
		default:
			return resolveUDimSafe("stack", value, "gap");
	}
}

function resolveFillDirection(direction: StackDirection | undefined): Enum.FillDirection {
	return direction === "horizontal" ? Enum.FillDirection.Horizontal : Enum.FillDirection.Vertical;
}

function resolveHorizontalAlignment(
	direction: StackDirection | undefined,
	align: StackAlign | undefined,
	justify: StackJustify | undefined,
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
	direction: StackDirection | undefined,
	align: StackAlign | undefined,
	justify: StackJustify | undefined,
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
	direction: StackDirection | undefined,
	justify: StackJustify | undefined,
): Enum.UIFlexAlignment | undefined {
	if (direction !== "horizontal") return undefined;

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
	direction: StackDirection | undefined,
	justify: StackJustify | undefined,
): Enum.UIFlexAlignment | undefined {
	if (direction === "horizontal") return undefined;

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

function resolveItemLineAlignment(align: StackAlign | undefined): Enum.ItemLineAlignment | undefined {
	if (align === "stretch") {
		return Enum.ItemLineAlignment.Stretch;
	}

	return undefined;
}

export const Stack = React.forwardRef<Frame, StackProps>((props, ref) => {
	const { slotProps } = props;
	const rootSlotProps = slotProps?.root;
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
	} = useResolvedStyleProps("stack", props);

	const direction = props.direction ?? "vertical";
	const resolvedGap = resolveGap(theme, props.gap);

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

	const horizontalAlignment = resolveHorizontalAlignment(direction, props.align, props.justify);
	const verticalAlignment = resolveVerticalAlignment(direction, props.align, props.justify);
	const horizontalFlex = resolveHorizontalFlex(direction, props.justify);
	const verticalFlex = resolveVerticalFlex(direction, props.justify);
	const itemLineAlignment = resolveItemLineAlignment(props.align);

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
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }));

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
			Wraps={props.wrap ?? false}
			{...slotProps?.listLayout}
		/>,
	);

	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootEvent = useRootCursorEvent(props.Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const frameInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: props.bgTransparency ?? (props.bg !== undefined ? 0 : 1),
		Size: computedSize,
		AutomaticSize: computedAutoSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		BackgroundColor3: resolvedBackgroundColor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: props.zIndex,
		Event: rootEvent,
		Change: props.Change,
	};

	return (
		<frame {...frameInstanceProps} {...rootSlotProps} ref={ref}>
			{decoratorChildren}
			{props.children}
		</frame>
	);
});

Stack.displayName = "Stack";
