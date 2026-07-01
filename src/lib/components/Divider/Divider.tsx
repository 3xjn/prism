import React from "@rbxts/react";

import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";
import { resolveColorSafe, resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { DividerColorValue, DividerOrientation, DividerProps, DividerSizeValue } from "./types";

const DEFAULT_DIVIDER_THICKNESS = 1;

function resolveDividerThickness(theme: Theme, value: DividerSizeValue | undefined): number {
	if (value === undefined) {
		return DEFAULT_DIVIDER_THICKNESS;
	}

	if (typeIs(value, "number")) {
		return value;
	}

	return resolveThemeSizeSafe(theme, "divider", value, "spacing", DEFAULT_DIVIDER_THICKNESS);
}

function resolveDividerColor(theme: Theme, value: DividerColorValue | undefined): Color3 {
	if (value === undefined) {
		return theme.colors.border.default;
	}

	if (typeIs(value, "Color3")) {
		return value;
	}

	return resolveColorSafe(theme, "divider", value, theme.colors.border.default) ?? theme.colors.border.default;
}

export const Divider = React.forwardRef<Frame, DividerProps>((props, ref) => {
	const theme = useTheme();
	const { slotProps } = props;
	const rootSlotProps = slotProps?.root;
	const orientation: DividerOrientation = props.orientation ?? "horizontal";
	const thickness = resolveDividerThickness(theme, props.size);
	const backgroundColor = resolveDividerColor(theme, props.color);

	const computedSize: UDim2 =
		orientation === "horizontal"
			? new UDim2(1, 0, 0, thickness)
			: new UDim2(0, thickness, 1, 0);

	const rootEvent = useRootCursorEvent(props.Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const frameInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundColor3: backgroundColor,
		Size: computedSize,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		Event: rootEvent,
		Change: props.Change,
	};

	return <frame {...frameInstanceProps} {...rootSlotProps} ref={ref} />;
});

Divider.displayName = "Divider";
