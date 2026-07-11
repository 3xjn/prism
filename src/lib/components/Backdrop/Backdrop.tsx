import React from "@rbxts/react";

import { useTheme } from "@prism/theme";

import { isPressInput } from "../_shared/interaction";
import { isPointInsideOutsidePressExclusions } from "../_shared/outsidePress";
import { resolveColorSafe } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { BackdropColorValue, BackdropExcludeRect, BackdropProps } from "./types";

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type TextButtonActivatedEvent = NonNullable<TextButtonEventMap>["Activated"];
type TextButtonActivatedArgs = Parameters<NonNullable<TextButtonActivatedEvent>>;
type TextButtonInputBeganEvent = NonNullable<TextButtonEventMap>["InputBegan"];
type TextButtonInputBeganArgs = Parameters<NonNullable<TextButtonInputBeganEvent>>;

function resolveBackdropColor(theme: ReturnType<typeof useTheme>, color: BackdropColorValue | undefined): Color3 {
	if (color === undefined) {
		return theme.colors.text.primary;
	}

	if (typeIs(color, "Color3")) {
		return color;
	}

	return resolveColorSafe(theme, "backdrop", color, theme.colors.text.primary) ?? theme.colors.text.primary;
}

function resolveBackdropTransparency(opacity: number | undefined): number {
	return 1 - math.clamp(opacity ?? 0.28, 0, 1);
}

function findInputObject(args: readonly unknown[]): InputObject | undefined {
	for (const value of args) {
		if (typeIs(value, "Instance") && value.IsA("InputObject")) {
			return value;
		}
	}

	return undefined;
}

function findTextButton(args: readonly unknown[]): TextButton | undefined {
	for (const value of args) {
		if (typeIs(value, "Instance") && value.IsA("TextButton")) {
			return value;
		}
	}

	return undefined;
}

function shouldIgnoreBackdropPoint(
	root: TextButton,
	input: InputObject,
	excludeRect: BackdropExcludeRect | undefined,
	excludeInstance: GuiObject | undefined,
): boolean {
	if (!isPressInput(input)) {
		return false;
	}

	const point = new Vector2(input.Position.X, input.Position.Y);
	const excludeInstances = excludeInstance === undefined ? undefined : [excludeInstance];
	return isPointInsideOutsidePressExclusions(root, point, excludeRect, excludeInstances);
}

function shouldIgnoreBackdropPress(
	args: TextButtonActivatedArgs,
	excludeRect: BackdropExcludeRect | undefined,
	excludeInstance: GuiObject | undefined,
): boolean {
	const root = findTextButton(args);
	const input = findInputObject(args);
	return root !== undefined && input !== undefined && shouldIgnoreBackdropPoint(root, input, excludeRect, excludeInstance);
}

export const Backdrop = React.forwardRef<TextButton, BackdropProps>((props, ref) => {
	const theme = useTheme();
	const { slotProps } = props;
	const ignoreNextActivatedRef = React.useRef(false);
	const rootSlotProps = slotProps?.root;
	const active = props.active ?? (props.onPress !== undefined || props.Event !== undefined);
	const rootInputBegan = props.Event?.InputBegan;
	const rootActivated = props.Event?.Activated;
	const rootInputBeganEvent = (...args: TextButtonInputBeganArgs) => {
		rootInputBegan?.(...args);

		const root = findTextButton(args);
		const input = findInputObject(args);
		ignoreNextActivatedRef.current = root !== undefined && input !== undefined && shouldIgnoreBackdropPoint(root, input, props.excludeRect, props.excludeInstance);
	};
	const rootActivatedEvent = props.onPress === undefined && rootActivated === undefined ? undefined : (...args: TextButtonActivatedArgs) => {
		if (ignoreNextActivatedRef.current || shouldIgnoreBackdropPress(args, props.excludeRect, props.excludeInstance)) {
			ignoreNextActivatedRef.current = false;
			return;
		}

		rootActivated?.(...args);
		props.onPress?.();
	};
	const rootEvents: TextButtonEventMap | undefined = rootActivatedEvent === undefined && props.excludeRect === undefined && props.excludeInstance === undefined ? props.Event : {
		...props.Event,
		InputBegan: rootInputBeganEvent,
		Activated: rootActivatedEvent,
	};
	const rootEvent = useRootCursorEvent(
		rootEvents,
		rootSlotProps?.Event === undefined && active ? props.cursor ?? "pointer" : undefined,
		!active,
	);
	const rootInstanceProps: Partial<React.InstanceProps<TextButton>> = {
		AutoButtonColor: false,
		Active: active,
		Selectable: active,
		BackgroundColor3: resolveBackdropColor(theme, props.color),
		BackgroundTransparency: resolveBackdropTransparency(props.opacity),
		BorderSizePixel: 0,
		Size: UDim2.fromScale(1, 1),
		Text: "",
		TextTransparency: 1,
		TextStrokeTransparency: 1,
		Visible: props.visible,
		ZIndex: props.zIndex,
		Event: rootEvent,
		Change: props.Change,
	};

	return <textbutton {...rootInstanceProps} {...rootSlotProps} ref={ref} />;
});

Backdrop.displayName = "Backdrop";
