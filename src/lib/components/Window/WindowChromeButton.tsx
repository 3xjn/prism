import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";

import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { renderCornerDecorator } from "../_shared/foundationDecorators";
import { composeEventMaps } from "../_shared/interaction";
import { incrementZIndex, type GuiZIndex } from "../_shared/overlayLayerPolicy";
import { usePressInteraction } from "../_shared/usePressInteraction";
import { useRootCursorEvent } from "../_shared/useRootCursor";

const WINDOW_CHROME_HOVER_SCALE = 1.04;
const WINDOW_CHROME_PRESS_SCALE = 0.92;

export interface WindowChromeButtonProps {
	readonly iconName: IconName;
	readonly size: number;
	readonly iconSize: number;
	readonly radius: UDim;
	readonly zIndex: GuiZIndex | undefined;
	readonly onPress: () => void;
	readonly onInputBegan?: (input: InputObject) => void;
	readonly layoutOrder?: number;
	readonly slotProps?: Partial<React.InstanceProps<TextButton>>;
	readonly iconSlotProps?: Partial<React.InstanceProps<ImageLabel>>;
}

export function WindowChromeButton(props: WindowChromeButtonProps) {
	const theme = useTheme();
	const press = usePressInteraction({ interactive: true, onActivated: props.onPress });
	const closeButtonScale = press.pressed ? WINDOW_CHROME_PRESS_SCALE : press.hovered ? WINDOW_CHROME_HOVER_SCALE : 1;
	const motionDuration = press.pressed || press.hovered ? "fast" : "normal";
	const animated = useMotion({
		values: {
			backgroundColor: press.pressed ? theme.colors.action.pressed : theme.colors.action.hover,
			backgroundTransparency: press.hovered || press.pressed ? 0 : 1,
			iconColor: press.pressed ? theme.colors.text.primary : theme.colors.text.secondary,
			scale: closeButtonScale,
		},
		transition: {
			backgroundColor: { duration: motionDuration, easing: "standard" },
			backgroundTransparency: { duration: motionDuration, easing: "standard" },
			iconColor: { duration: motionDuration, easing: "standard" },
			scale: { duration: "fast", easing: "out" },
		},
	});
	const buttonEvent = useRootCursorEvent(
		composeEventMaps(
			{
				...press.eventMap,
				InputBegan: (_button: TextButton, input: InputObject) => {
					press.eventMap?.InputBegan?.(_button, input);
					props.onInputBegan?.(input);
				},
			},
			props.slotProps?.Event,
		),
		props.slotProps?.Event === undefined ? "pointer" : undefined,
	);

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundColor3={animated.backgroundColor}
			BackgroundTransparency={animated.backgroundTransparency}
			BorderSizePixel={0}
			Size={UDim2.fromOffset(props.size, props.size)}
			LayoutOrder={props.layoutOrder}
			Text=""
			TextTransparency={1}
			ZIndex={props.zIndex}
			Event={buttonEvent}
			{...props.slotProps}
		>
			<uiscale Scale={animated.scale} />
			{renderCornerDecorator({ radius: props.radius, slotProps: undefined })}
			<Icon
				name={props.iconName}
				size={props.iconSize}
				color={animated.iconColor}
				anchor={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				slotProps={{ root: { ZIndex: incrementZIndex(props.zIndex, 1), ...props.iconSlotProps } }}
			/>
		</textbutton>
	);
}
