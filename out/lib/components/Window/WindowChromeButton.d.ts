import React from "@rbxts/react";
import type { IconName } from "../Icon/index";
import { type GuiZIndex } from "../_shared/overlayLayerPolicy";
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
export declare function WindowChromeButton(props: WindowChromeButtonProps): React.JSX.Element;
