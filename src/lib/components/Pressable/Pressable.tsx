import React from "@rbxts/react";

import { pushDecorator, renderPaddingDecorator, renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { composeEventMaps, isPressInput } from "../_shared/interaction";
import { mergeSharedStyleProps, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { PressableInteractionState, PressableProps, PressableRenderState } from "./types";

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];

function resolveInteractionState(disabled: boolean, hovered: boolean, pressed: boolean): PressableInteractionState {
	if (disabled) {
		return "disabled";
	}

	if (pressed) {
		return "pressed";
	}

	if (hovered) {
		return "hovered";
	}

	return "idle";
}

export const Pressable = React.forwardRef<TextButton, PressableProps>((props, ref) => {
	const { Event, Change, onPress, slotProps } = props;
	const rootSlotProps = slotProps?.root;
	const disabled = props.disabled ?? false;
	const active = props.active ?? true;
	const interactive = active && !disabled;
	const [hovered, setHovered] = React.useState(false);
	const [pressed, setPressed] = React.useState(false);
	const mergedStyleProps = mergeSharedStyleProps({ cursor: "pointer" }, props);

	React.useEffect(() => {
		if (interactive) {
			return;
		}

		setHovered(false);
		setPressed(false);
	}, [interactive]);

	const {
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
	} = useResolvedStyleProps("pressable", mergedStyleProps);

	let computedSize: UDim2 | undefined;
	let computedAutoSize: Enum.AutomaticSize | undefined;
	if (resolvedSize !== undefined) {
		computedSize = resolvedSize;
	} else if (resolvedWidth !== undefined) {
		computedSize = new UDim2(resolvedWidth, new UDim(0, 0));
		computedAutoSize = Enum.AutomaticSize.Y;
	} else if (resolvedHeight !== undefined) {
		computedSize = new UDim2(new UDim(0, 0), resolvedHeight);
		computedAutoSize = Enum.AutomaticSize.X;
	}

	const effectiveHovered = interactive && hovered;
	const effectivePressed = interactive && pressed;
	const interactionState = resolveInteractionState(disabled, effectiveHovered, effectivePressed);
	const renderState: PressableRenderState = {
		state: interactionState,
		hovered: effectiveHovered,
		pressed: effectivePressed,
		disabled,
		active,
	};
	const children = props.render !== undefined ? props.render(renderState) : props.children;

	const internalEvent: TextButtonEventMap = {
		MouseEnter: () => {
			if (!interactive) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			setHovered(false);
			setPressed(false);
		},
		InputBegan: (_button, input) => {
			if (!interactive || !isPressInput(input)) {
				return;
			}

			setPressed(true);
		},
		InputEnded: (_button, input) => {
			if (!isPressInput(input)) {
				return;
			}

			setPressed(false);
		},
		Activated: () => {
			if (!interactive) {
				return;
			}

			onPress?.();
		},
	};
	const rootEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, Event),
		rootSlotProps?.Event === undefined && interactive ? mergedStyleProps.cursor : undefined,
		!interactive,
	);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const decoratorChildren: React.ReactElement[] = [];

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

	const textButtonInstanceProps: Partial<React.InstanceProps<TextButton>> = {
		AutoButtonColor: false,
		Active: interactive,
		Selectable: interactive,
		BorderSizePixel: 0,
		BackgroundTransparency: props.bgTransparency ?? (props.bg !== undefined ? 0 : 1),
		BackgroundColor3: resolvedBackgroundColor,
		Size: computedSize,
		AutomaticSize: computedAutoSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: props.zIndex,
		Text: "",
		TextTransparency: 1,
		TextStrokeTransparency: 1,
		Event: rootEvent,
		Change,
	};

	return (
		<textbutton {...textButtonInstanceProps} {...rootSlotProps} ref={ref}>
			{decoratorChildren}
			{children}
		</textbutton>
	);
});

Pressable.displayName = "Pressable";
