import React from "@rbxts/react";

import type { Theme } from "@prism/theme";

import {
	pushDecorator,
	renderAspectRatioDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import {
	resolveColorSafe,
	resolveThemeSizeSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type {
	BoxGradientProps,
	BoxProps,
	BoxRadiusValue,
	BoxStrokeProps,
} from "./types";

function resolveRadius(theme: Theme, value: BoxRadiusValue | undefined): UDim | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (typeIs(value, "number")) {
		return new UDim(0, value);
	}

	if (typeIs(value, "UDim")) {
		return value;
	}

	return new UDim(0, resolveThemeSizeSafe(theme, "box", value, "radius", 0));
}

export const Box = React.forwardRef<Frame, BoxProps>((props, ref) => {
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
	} = useResolvedStyleProps("box", props);
	const resolvedRadius = resolveRadius(theme, props.radius);

	const aspectRatio = props.aspectRatio;
	let computedSize: UDim2 | undefined;
	let computedAutoSize: Enum.AutomaticSize | undefined;
	if (resolvedSize !== undefined) {
		computedSize = resolvedSize;
	} else if (resolvedWidth !== undefined && resolvedHeight === undefined && aspectRatio !== undefined) {
		const derivedHeightScale = resolvedWidth.Scale / aspectRatio;
		const derivedHeightOffset = resolvedWidth.Offset / aspectRatio;
		computedSize = new UDim2(resolvedWidth, new UDim(derivedHeightScale, derivedHeightOffset));
	} else if (resolvedHeight !== undefined && resolvedWidth === undefined && aspectRatio !== undefined) {
		const derivedWidthScale = resolvedHeight.Scale * aspectRatio;
		const derivedWidthOffset = resolvedHeight.Offset * aspectRatio;
		computedSize = new UDim2(new UDim(derivedWidthScale, derivedWidthOffset), resolvedHeight);
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

	const resolvedStrokeColor = resolveColorSafe(
		theme,
		"box",
		props.stroke?.color ?? props.borderColor,
		theme.colors.border.default,
	);
	const resolvedStrokeThickness = props.stroke?.thickness ?? props.border ?? (props.borderColor !== undefined ? 1 : undefined);
	const shouldRenderStroke =
		props.stroke !== undefined || props.border !== undefined || props.borderColor !== undefined || slotProps?.stroke !== undefined;

	const decoratorChildren = new Array<React.ReactElement>();

	pushDecorator(decoratorChildren, renderCornerDecorator({ radius: resolvedRadius, slotProps: slotProps?.corner }));
	pushDecorator(
		decoratorChildren,
		renderStrokeDecorator({
			enabled: shouldRenderStroke,
			color: resolvedStrokeColor ?? theme.colors.border.default,
			thickness: resolvedStrokeThickness ?? 1,
			transparency: props.stroke?.transparency,
			mode: props.stroke?.mode,
			slotProps: slotProps?.stroke,
		}),
	);
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

	if (props.gradient !== undefined || slotProps?.gradient !== undefined) {
		decoratorChildren.push(
			<uigradient
				key="gradient"
				Color={props.gradient?.colors}
				Rotation={props.gradient?.rotation}
				Transparency={props.gradient?.transparency}
				Offset={props.gradient?.offset}
				Enabled={props.gradient?.enabled}
				{...slotProps?.gradient}
			/>,
		);
	}

	pushDecorator(decoratorChildren, renderAspectRatioDecorator({ aspectRatio: props.aspectRatio, slotProps: slotProps?.aspectRatio }));
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }));

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

Box.displayName = "Box";
