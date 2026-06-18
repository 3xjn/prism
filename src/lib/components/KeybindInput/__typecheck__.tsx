import React from "@rbxts/react";

import { KeybindInput } from "./KeybindInput";
import type { KeybindInputProps } from "./types";

const keybindRef = React.createRef<TextButton>();
type ExportedKeybindInputProps = React.ComponentProps<typeof KeybindInput>;

const validKeybindInputProps: KeybindInputProps[] = [
	{},
	{ value: Enum.KeyCode.E, onChange: () => undefined },
	{ defaultValue: Enum.KeyCode.ButtonA, captureDevice: "gamepad" },
	{ value: Enum.KeyCode.Unknown, placeholder: "Unbound", clearable: false },
	{ defaultValue: Enum.KeyCode.ButtonB, captureDevice: "gamepad", cancelKeyCodes: [Enum.KeyCode.ButtonSelect] },
	{ disabled: true, readOnly: true, fullWidth: true },
	{ variant: "light", color: "success", size: "lg" },
	{ displayDevice: "mouse", slotProps: { label: { Text: "Mouse4" } } },
	{ allowedKeyCodes: [Enum.KeyCode.E, Enum.KeyCode.F], blockedKeyCodes: [Enum.KeyCode.Escape] },
	{
		onCaptureStart: () => undefined,
		onCaptureCancel: () => undefined,
		onCaptureEnd: () => undefined,
		onCapturingChange: () => undefined,
	},
	{ slotProps: { root: { ZIndex: 2 }, trigger: { AutoButtonColor: true }, label: { Text: "Override" } } },
	{
		slotProps: {
			triggerCorner: { CornerRadius: new UDim(0, 10) },
			triggerStroke: { Thickness: 2 },
			deviceIcon: { ImageTransparency: 0.2 },
		},
	},
	{ slotProps: { gamepadGlyph: { ImageTransparency: 0.1 } } },
	{ ref: keybindRef },
];

const validExportedKeybindInputProps: ExportedKeybindInputProps[] = [
	{},
	{ value: Enum.KeyCode.Space, onChange: () => undefined },
	{ defaultValue: Enum.KeyCode.ButtonR1, captureDevice: "both" },
];

const validKeybindInputExamples = [
	<KeybindInput key="basic" />,
	<KeybindInput key="value" value={Enum.KeyCode.Q} onChange={() => undefined} />,
	<KeybindInput key="clear" defaultValue={Enum.KeyCode.LeftShift} clearable />,
	<KeybindInput key="gamepad" captureDevice="gamepad" defaultValue={Enum.KeyCode.ButtonA} />,
	<KeybindInput
		key="slots"
		slotProps={{ triggerPadding: { PaddingLeft: new UDim(0, 14) }, hint: { Text: "Custom hint" } }}
	/>,
	<KeybindInput key="ref" ref={keybindRef} />,
];

const acceptsKeybindInputChildren: React.ReactNode = validKeybindInputExamples;
const acceptsKeybindInputProps: KeybindInputProps[] = validKeybindInputProps;
const acceptsExportedKeybindInputProps: ExportedKeybindInputProps[] = validExportedKeybindInputProps;

type InvalidCaptureDeviceAllowed = "mouse" extends NonNullable<KeybindInputProps["captureDevice"]> ? true : false;
type InvalidValueAllowed = string extends NonNullable<KeybindInputProps["value"]> ? true : false;
type KeybindValueOptional = undefined extends KeybindInputProps["value"] ? true : false;

const invalidCaptureDevice: InvalidCaptureDeviceAllowed = false;
const invalidValue: InvalidValueAllowed = false;
const keybindValueOptional: KeybindValueOptional = true;

export {
	acceptsExportedKeybindInputProps,
	acceptsKeybindInputChildren,
	acceptsKeybindInputProps,
	invalidCaptureDevice,
	invalidValue,
	keybindValueOptional,
};
