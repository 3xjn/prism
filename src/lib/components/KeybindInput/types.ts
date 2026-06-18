import type React from "@rbxts/react";

import type { SemanticIntent, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export type KeybindInputSize = ThemeSize;

export type KeybindInputColor = SemanticIntent;

export type KeybindCaptureDevice = "keyboard" | "gamepad" | "both";

export type KeybindDisplayDevice = "keyboard" | "mouse" | "gamepad";

export interface KeybindInputSlots {
	readonly root: Frame;
	readonly trigger: TextButton;
	readonly triggerCorner: UICorner;
	readonly triggerStroke: UIStroke;
	readonly triggerPadding: UIPadding;
	readonly content: Frame;
	readonly deviceFrame: Frame;
	readonly deviceFrameCorner: UICorner;
	readonly deviceIcon: ImageLabel;
	readonly keycap: Frame;
	readonly keycapCorner: UICorner;
	readonly keycapStroke: UIStroke;
	readonly gamepadGlyph: ImageLabel;
	readonly label: TextLabel;
	readonly hint: TextLabel;
	readonly sizeConstraint: UISizeConstraint;
}

export type KeybindInputSlotProps = RawSlotProps<KeybindInputSlots>;

export interface KeybindInputStyleProps extends Omit<SharedStyleProps, "bg" | "bgTransparency"> {
	readonly variant?: Variant;
	readonly color?: KeybindInputColor;
	readonly size?: KeybindInputSize;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly fullWidth?: boolean;
	readonly placeholder?: string;
	readonly captureLabel?: string;
	readonly clearable?: boolean;
	readonly displayDevice?: KeybindDisplayDevice;
}

export interface KeybindInputProps extends KeybindInputStyleProps {
	readonly value?: Enum.KeyCode;
	readonly defaultValue?: Enum.KeyCode;
	readonly onChange?: (value: Enum.KeyCode) => void;
	readonly captureDevice?: KeybindCaptureDevice;
	readonly allowedKeyCodes?: readonly Enum.KeyCode[];
	readonly blockedKeyCodes?: readonly Enum.KeyCode[];
	readonly onCaptureStart?: () => void;
	readonly onCaptureCancel?: () => void;
	readonly onCaptureEnd?: (value: Enum.KeyCode) => void;
	readonly onCapturingChange?: (capturing: boolean) => void;
	readonly Event?: React.InstanceProps<TextButton>["Event"];
	readonly Change?: React.InstanceProps<TextButton>["Change"];
	readonly slotProps?: KeybindInputSlotProps;
	readonly ref?: React.Ref<TextButton>;
}
