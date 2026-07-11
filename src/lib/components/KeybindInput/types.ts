import type React from "@rbxts/react";

import type { SemanticIntent, Theme, ThemeSize, Variant } from "@prism/theme";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SelectionProps } from "../_shared/selection";
import type { StyleOverride } from "../_shared/styleOverride";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

import type { KeybindInputInteractionState, KeybindInputVisualStyles } from "./styles";

export type { KeybindInputVisualStyles } from "./styles";

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

export interface KeybindInputStyleOverrideContext {
	readonly theme: Theme;
	readonly variant: Variant;
	readonly color: KeybindInputColor;
	readonly size: KeybindInputSize;
	readonly state: KeybindInputInteractionState;
	readonly hasValue: boolean;
}

export type KeybindInputStyleOverride = StyleOverride<KeybindInputVisualStyles, KeybindInputStyleOverrideContext>;

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
	/**
	 * Per-state visual values only. styleOverrides runs before motion/static visual use so values animate;
	 * slotProps are raw post-motion/static final escapes and win. Radius, padding, font, and layout stay on existing props/slotProps.
	 */
	readonly styleOverrides?: KeybindInputStyleOverride;
}

export interface KeybindInputProps extends KeybindInputStyleProps, SelectionProps {
	readonly value?: Enum.KeyCode;
	readonly defaultValue?: Enum.KeyCode;
	readonly onChange?: (value: Enum.KeyCode) => void;
	readonly captureDevice?: KeybindCaptureDevice;
	readonly cancelKeyCodes?: readonly Enum.KeyCode[];
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
