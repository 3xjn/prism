import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";
import type { Theme } from "@prism/theme";

import { getLucideIconAsset } from "../../icons/lucide";

import { renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import {
	reportComponentFailure,
	resolveColorSafe,
	resolveThemeSizeSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { IconName, IconProps } from "./types";

const FALLBACK_ICON_NAME: IconName = "alert-circle";

function resolveIconDisplaySize(theme: Theme, size: IconProps["size"]): number {
	if (size === undefined) {
		return theme.fontSizes.md;
	}

	if (typeIs(size, "number")) {
		if (size >= 0) {
			return size;
		}

		reportComponentFailure("icon", `Icon size must be a non-negative number, got ${size}.`);
		return theme.fontSizes.md;
	}

	return resolveThemeSizeSafe(theme, "icon", size, "fontSizes", theme.fontSizes.md);
}

function resolveIconSize(
	resolvedSize: UDim2 | undefined,
	resolvedWidth: UDim | undefined,
	resolvedHeight: UDim | undefined,
	fallbackOffset: number,
): UDim2 {
	if (resolvedSize !== undefined) {
		return resolvedSize;
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

	return UDim2.fromOffset(fallbackOffset, fallbackOffset);
}

export const Icon = React.forwardRef<ImageLabel, IconProps>((props, ref) => {
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
	} = useResolvedStyleProps("icon", props);

	const resolvedDisplaySize = resolveIconDisplaySize(theme, props.size);
	const resolvedColor = resolveColorSafe(theme, "icon", props.color ?? themeRefs.text.primary, theme.colors.text.primary);
	const asset = getLucideIconAsset(props.name, resolvedDisplaySize);
	const fallbackAsset = asset ?? getLucideIconAsset(FALLBACK_ICON_NAME, resolvedDisplaySize);

	if (asset === undefined) {
		reportComponentFailure(
			"icon",
			`Unsupported icon name "${tostring(props.name)}". Falling back to "${FALLBACK_ICON_NAME}".`,
		);
	}

	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const computedSize = resolveIconSize(resolvedSize, resolvedWidth, resolvedHeight, resolvedDisplaySize);
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
		Image: fallbackAsset?.Url,
		ImageRectSize: fallbackAsset?.ImageRectSize,
		ImageRectOffset: fallbackAsset?.ImageRectOffset,
		ImageColor3: resolvedColor ?? theme.colors.text.primary,
		ScaleType: Enum.ScaleType.Fit,
		Event: rootEvent,
		Change: props.Change,
	};

	return (
		<imagelabel {...rootProps} {...rootSlotProps} ref={ref}>
			{renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint })}
		</imagelabel>
	);
});

Icon.displayName = "Icon";
