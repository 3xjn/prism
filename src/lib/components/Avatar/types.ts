import type React from "@rbxts/react";

import type { ColorToken, SemanticIntent, ThemeSize } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface AvatarSlots {
	readonly root: Frame;
	readonly image: ImageLabel;
	readonly fallback: TextLabel;
	readonly corner: UICorner;
	readonly stroke: UIStroke;
	readonly padding: UIPadding;
	readonly sizeConstraint: UISizeConstraint;
}

export type AvatarSlotProps = RawSlotProps<AvatarSlots>;

export type AvatarSize = ThemeSize | number;

export type AvatarColor = SemanticIntent;

export interface AvatarStyleProps extends SharedStyleProps {
	readonly size?: AvatarSize;
	readonly color?: AvatarColor;
	readonly fallbackColor?: ColorToken | Color3;
	readonly radius?: ThemeSize | number | UDim;
	readonly border?: number;
	readonly borderColor?: ColorToken | Color3;
}

export interface AvatarProps extends AvatarStyleProps {
	readonly src?: string;
	readonly fallback?: string | number;
	readonly imageTransparency?: number;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: AvatarSlotProps;
	readonly ref?: React.Ref<Frame>;
}
