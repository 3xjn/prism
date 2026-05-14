import type React from "@rbxts/react";

import type { ColorToken, ThemeSize } from "@prism/theme";

import type { SupportedLucideIconName } from "../../icons/lucide";
import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface IconSlots {
	readonly root: ImageLabel;
	readonly sizeConstraint: UISizeConstraint;
}

export type IconSlotProps = RawSlotProps<IconSlots>;

type IconLayoutProps = Pick<
	SharedStyleProps,
	| "width"
	| "height"
	| "minWidth"
	| "maxWidth"
	| "minHeight"
	| "maxHeight"
	| "position"
	| "anchor"
	| "center"
	| "cursor"
	| "sizeConstraint"
	| "bg"
	| "bgTransparency"
	| "clip"
	| "visible"
	| "layoutOrder"
	| "zIndex"
>;

export type IconName = SupportedLucideIconName;

export interface IconStyleProps extends IconLayoutProps {
	readonly size?: ThemeSize | number;
	readonly color?: ColorToken | Color3;
}

export interface IconProps extends IconStyleProps {
	readonly name: IconName;
	readonly Event?: React.InstanceProps<ImageLabel>["Event"];
	readonly Change?: React.InstanceProps<ImageLabel>["Change"];
	readonly slotProps?: IconSlotProps;
	readonly ref?: React.Ref<ImageLabel>;
}
