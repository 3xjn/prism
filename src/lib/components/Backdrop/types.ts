import type React from "@rbxts/react";

import type { ConcreteColorValue } from "@prism/theme";

import type { OutsidePressExcludeRect } from "../_shared/outsidePress";
import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedCursorValue } from "../_shared/useResolvedStyleProps";

export type BackdropColorValue = ConcreteColorValue;
export type BackdropExcludeRect = OutsidePressExcludeRect;

export interface BackdropSlots {
	readonly root: TextButton;
}

export type BackdropSlotProps = RawSlotProps<BackdropSlots>;

export interface BackdropStyleProps {
	readonly visible?: boolean;
	readonly color?: BackdropColorValue;
	readonly opacity?: number;
	readonly cursor?: SharedCursorValue;
	readonly zIndex?: React.InstanceProps<TextButton>["ZIndex"];
	readonly active?: boolean;
	readonly excludeRect?: BackdropExcludeRect;
	readonly excludeInstance?: GuiObject;
}

export interface BackdropProps extends BackdropStyleProps {
	readonly children?: never;
	readonly onPress?: () => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: BackdropSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
