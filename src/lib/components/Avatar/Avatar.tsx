import React from "@rbxts/react";

import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import { pushDecorator, renderPaddingDecorator, renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { resolveTextFontFace } from "../_shared/textFont";
import { resolveColorSafe, resolveThemeSizeSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import { mixColor } from "../_shared/visual";

import type { AvatarProps, AvatarSize } from "./types";

function resolveAvatarSize(theme: Theme, size: AvatarSize | undefined): number {
	if (size === undefined) {
		return 40;
	}

	if (typeIs(size, "number")) {
		return math.max(1, math.abs(size));
	}

	switch (size) {
		case "xs":
			return 24;
		case "sm":
			return 32;
		case "lg":
			return 52;
		case "xl":
			return 64;
		case "md":
		default:
			return 40;
	}
}

function resolveAvatarRadius(theme: Theme, size: number, radius: AvatarProps["radius"]): UDim {
	if (radius === undefined) {
		return new UDim(0.5, 0);
	}

	if (typeIs(radius, "number")) {
		return new UDim(0, radius);
	}

	if (typeIs(radius, "UDim")) {
		return radius;
	}

	return new UDim(0, resolveThemeSizeSafe(theme, "avatar", radius, "radius", size / 2));
}

function resolveFallbackText(fallback: string | number | undefined): string {
	if (fallback === undefined) {
		return "?";
	}

	const text = tostring(fallback);
	return text.size() <= 2 ? text.upper() : text.sub(1, 2).upper();
}

export const Avatar = React.forwardRef<Frame, AvatarProps>((props, ref) => {
	const theme = useTheme();
	const { slotProps, src, color = "primary" } = props;
	const rootSlotProps = slotProps?.root;
	const {
		resolvedPosition,
		resolvedAnchor,
		resolvedBackgroundColor,
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hasPadding,
	} = useResolvedStyleProps("avatar", props);
	const size = resolveAvatarSize(theme, props.size);
	const computedSize = resolvedSize ?? new UDim2(resolvedWidth ?? new UDim(0, size), resolvedHeight ?? new UDim(0, size));
	const intentColors = theme.colors[color];
	const fallbackBackground = resolvedBackgroundColor ?? mixColor(theme.colors.background.surface, intentColors.light, 0.42);
	const fallbackColor = resolveColorSafe(theme, "avatar", props.fallbackColor ?? intentColors.dark, intentColors.dark) ?? intentColors.dark;
	const strokeColor = resolveColorSafe(theme, "avatar", props.borderColor ?? mixColor(intentColors.light, theme.colors.background.surface, 0.3), theme.colors.border.default);
	const borderThickness = props.border ?? 1;
	const cornerRadius = resolveAvatarRadius(theme, size, props.radius);
	const hasImage = src !== undefined && src.size() > 0;
	const contentZIndex = (props.zIndex ?? 1) + 1;
	const rootEvent = useRootCursorEvent(props.Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding }),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }));

	return (
		<frame
			BackgroundColor3={fallbackBackground}
			BackgroundTransparency={props.bgTransparency ?? 0}
			BorderSizePixel={0}
			Size={computedSize}
			Position={resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined)}
			AnchorPoint={resolvedAnchor}
			ClipsDescendants={props.clip ?? true}
			Visible={props.visible}
			LayoutOrder={props.layoutOrder}
			ZIndex={props.zIndex}
			Event={rootEvent}
			Change={props.Change}
			{...rootSlotProps}
			ref={ref}
		>
			{decoratorChildren}
			<uicorner CornerRadius={cornerRadius} {...slotProps?.corner} />
			<uistroke Color={strokeColor} Transparency={0.18} Thickness={borderThickness} {...slotProps?.stroke} />
			{hasImage ? (
				<imagelabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Image={src}
					ImageTransparency={props.imageTransparency ?? 0}
					ScaleType={Enum.ScaleType.Crop}
					ZIndex={contentZIndex}
					{...slotProps?.image}
				/>
			) : (
				<textlabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Text={resolveFallbackText(props.fallback)}
					TextColor3={fallbackColor}
					TextTransparency={0}
					TextStrokeTransparency={1}
					TextSize={math.max(11, math.floor(size * 0.42))}
					Font={theme.fontFamily}
					FontFace={resolveTextFontFace(undefined, undefined, theme.fontFamily)}
					TextXAlignment={Enum.TextXAlignment.Center}
					TextYAlignment={Enum.TextYAlignment.Center}
					ZIndex={contentZIndex}
					{...slotProps?.fallback}
				/>
			)}
		</frame>
	);
});

Avatar.displayName = "Avatar";
