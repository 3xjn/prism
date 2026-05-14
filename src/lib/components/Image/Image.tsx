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
import { resolveColorSafe, resolveThemeSizeSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { ImageProps, ImageRadiusValue } from "./types";

function resolveRadius(theme: Theme, value: ImageRadiusValue | undefined): UDim | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (typeIs(value, "number")) {
		return new UDim(0, value);
	}

	if (typeIs(value, "UDim")) {
		return value;
	}

	return new UDim(0, resolveThemeSizeSafe(theme, "image", value, "radius", 0));
}

function resolveImageSize(
	resolvedSize: UDim2 | undefined,
	resolvedWidth: UDim | undefined,
	resolvedHeight: UDim | undefined,
	aspectRatio: number | undefined,
): UDim2 | undefined {
	if (resolvedSize !== undefined) {
		return resolvedSize;
	}

	if (resolvedWidth !== undefined && resolvedHeight === undefined && aspectRatio !== undefined) {
		return new UDim2(resolvedWidth, new UDim(resolvedWidth.Scale / aspectRatio, resolvedWidth.Offset / aspectRatio));
	}

	if (resolvedHeight !== undefined && resolvedWidth === undefined && aspectRatio !== undefined) {
		return new UDim2(new UDim(resolvedHeight.Scale * aspectRatio, resolvedHeight.Offset * aspectRatio), resolvedHeight);
	}

	if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		return new UDim2(resolvedWidth, resolvedHeight);
	}

	if (resolvedWidth !== undefined) {
		return new UDim2(resolvedWidth, resolvedWidth);
	}

	if (resolvedHeight !== undefined) {
		return new UDim2(resolvedHeight, resolvedHeight);
	}

	return undefined;
}

export const Image = React.forwardRef<ImageLabel, ImageProps>((props, ref) => {
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
	} = useResolvedStyleProps("image", props);

	const resolvedRadius = resolveRadius(theme, props.radius);
	const resolvedImageColor = resolveColorSafe(theme, "image", props.color, new Color3(1, 1, 1));
	const resolvedStrokeColor = resolveColorSafe(
		theme,
		"image",
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
	pushDecorator(decoratorChildren, renderAspectRatioDecorator({ aspectRatio: props.aspectRatio, slotProps: slotProps?.aspectRatio }));
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }));

	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const computedSize = resolveImageSize(resolvedSize, resolvedWidth, resolvedHeight, props.aspectRatio);
	const rootEvent = useRootCursorEvent(props.Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const rootProps: Partial<React.InstanceProps<ImageLabel>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: props.bgTransparency ?? (props.bg !== undefined ? 0 : 1),
		BackgroundColor3: resolvedBackgroundColor,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		Size: computedSize,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: props.zIndex,
		Image: props.src,
		ImageColor3: resolvedImageColor ?? new Color3(1, 1, 1),
		ImageTransparency: props.transparency,
		ImageRectOffset: props.imageRectOffset,
		ImageRectSize: props.imageRectSize,
		ResampleMode: props.resampleMode,
		ScaleType: props.scaleType ?? Enum.ScaleType.Fit,
		SliceCenter: props.sliceCenter,
		SliceScale: props.sliceScale,
		TileSize: props.tileSize,
		Event: rootEvent,
		Change: props.Change,
	};

	return (
		<imagelabel {...rootProps} {...rootSlotProps} ref={ref}>
			{decoratorChildren}
			{props.children}
		</imagelabel>
	);
});

Image.displayName = "Image";
