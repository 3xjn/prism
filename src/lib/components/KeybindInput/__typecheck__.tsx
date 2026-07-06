import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, HasProp, IsAssignable } from "@prism/testing/typeContracts";

import { KeybindInput } from "./KeybindInput";
import type {
	KeybindInputProps,
	KeybindInputStyleOverride,
	KeybindInputStyleOverrideContext,
	KeybindInputVisualStyles,
} from "./types";

const keybindRef = React.createRef<TextButton>();
type ExportedKeybindInputProps = React.ComponentProps<typeof KeybindInput>;

const keybindInputStyleOverride: KeybindInputStyleOverride = (_visualStyles, ctx) => {
	if (ctx.state === "capturing") {
		return { strokeColor: ctx.theme.colors[ctx.color].light, strokeThickness: 2 };
	}

	if (ctx.state === "hovered" && !ctx.hasValue) {
		return { labelTransparency: 0.2 };
	}

	if (ctx.state === "disabled") {
		return { keycapStrokeTransparency: 0.4 };
	}

	return {};
};

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
	{ styleOverrides: keybindInputStyleOverride },
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
type KeybindInputStyleOverrideAssignableToProp = AssertTrue<
	IsAssignable<KeybindInputStyleOverride, KeybindInputProps["styleOverrides"]>
>;
type KeybindInputStyleOverrideAssignableToExportedProp = AssertTrue<
	IsAssignable<KeybindInputStyleOverride, ExportedKeybindInputProps["styleOverrides"]>
>;
type KeybindInputStyleOverrideContextHasFields = AssertTrue<
	IsAssignable<"theme" | "variant" | "color" | "size" | "state" | "hasValue", keyof KeybindInputStyleOverrideContext>
>;
type KeybindInputStyleOverrideContextHasTheme = AssertTrue<HasProp<KeybindInputStyleOverrideContext, "theme">>;
type KeybindInputStyleOverrideContextHasNoDisabled = AssertFalse<
	IsAssignable<"disabled", keyof KeybindInputStyleOverrideContext>
>;
type KeybindInputStyleOverrideContextHasNoCapturing = AssertFalse<
	IsAssignable<"capturing", keyof KeybindInputStyleOverrideContext>
>;
type KeybindInputVisualStylesHasNoRadius = AssertFalse<IsAssignable<"radius", keyof KeybindInputVisualStyles>>;
type KeybindInputVisualStylesHasNoPadding = AssertFalse<IsAssignable<"padding", keyof KeybindInputVisualStyles>>;
type KeybindInputVisualStylesHasNoPaddingX = AssertFalse<IsAssignable<"paddingX", keyof KeybindInputVisualStyles>>;
type KeybindInputVisualStylesHasNoFontSize = AssertFalse<IsAssignable<"fontSize", keyof KeybindInputVisualStyles>>;
type KeybindInputVisualStylesHasNoHintFontSize = AssertFalse<
	IsAssignable<"hintFontSize", keyof KeybindInputVisualStyles>
>;
type KeybindInputVisualStylesHasNoMinHeight = AssertFalse<IsAssignable<"minHeight", keyof KeybindInputVisualStyles>>;
type KeybindInputVisualStylesHasNoDefaultWidth = AssertFalse<
	IsAssignable<"defaultWidth", keyof KeybindInputVisualStyles>
>;
type KeybindInputVisualStylesHasNoGap = AssertFalse<IsAssignable<"gap", keyof KeybindInputVisualStyles>>;
type KeybindInputVisualStylesHasNoLayout = AssertFalse<IsAssignable<"layout", keyof KeybindInputVisualStyles>>;
type KeybindInputVisualStylesHasNoSlotProps = AssertFalse<IsAssignable<"slotProps", keyof KeybindInputVisualStyles>>;

const invalidCaptureDevice: InvalidCaptureDeviceAllowed = false;
const invalidValue: InvalidValueAllowed = false;
const keybindValueOptional: KeybindValueOptional = true;
const keybindInputStyleOverrideAssignableToProp: KeybindInputStyleOverrideAssignableToProp = true;
const keybindInputStyleOverrideAssignableToExportedProp: KeybindInputStyleOverrideAssignableToExportedProp = true;
const keybindInputStyleOverrideContextHasFields: KeybindInputStyleOverrideContextHasFields = true;
const keybindInputStyleOverrideContextHasTheme: KeybindInputStyleOverrideContextHasTheme = true;
const keybindInputStyleOverrideContextHasNoDisabled: KeybindInputStyleOverrideContextHasNoDisabled = false;
const keybindInputStyleOverrideContextHasNoCapturing: KeybindInputStyleOverrideContextHasNoCapturing = false;
const keybindInputVisualStylesHasNoRadius: KeybindInputVisualStylesHasNoRadius = false;
const keybindInputVisualStylesHasNoPadding: KeybindInputVisualStylesHasNoPadding = false;
const keybindInputVisualStylesHasNoPaddingX: KeybindInputVisualStylesHasNoPaddingX = false;
const keybindInputVisualStylesHasNoFontSize: KeybindInputVisualStylesHasNoFontSize = false;
const keybindInputVisualStylesHasNoHintFontSize: KeybindInputVisualStylesHasNoHintFontSize = false;
const keybindInputVisualStylesHasNoMinHeight: KeybindInputVisualStylesHasNoMinHeight = false;
const keybindInputVisualStylesHasNoDefaultWidth: KeybindInputVisualStylesHasNoDefaultWidth = false;
const keybindInputVisualStylesHasNoGap: KeybindInputVisualStylesHasNoGap = false;
const keybindInputVisualStylesHasNoLayout: KeybindInputVisualStylesHasNoLayout = false;
const keybindInputVisualStylesHasNoSlotProps: KeybindInputVisualStylesHasNoSlotProps = false;

export {
	acceptsExportedKeybindInputProps,
	acceptsKeybindInputChildren,
	acceptsKeybindInputProps,
	invalidCaptureDevice,
	invalidValue,
	keybindInputStyleOverride,
	keybindInputStyleOverrideAssignableToExportedProp,
	keybindInputStyleOverrideAssignableToProp,
	keybindInputStyleOverrideContextHasFields,
	keybindInputStyleOverrideContextHasNoCapturing,
	keybindInputStyleOverrideContextHasNoDisabled,
	keybindInputStyleOverrideContextHasTheme,
	keybindInputVisualStylesHasNoDefaultWidth,
	keybindInputVisualStylesHasNoFontSize,
	keybindInputVisualStylesHasNoGap,
	keybindInputVisualStylesHasNoHintFontSize,
	keybindInputVisualStylesHasNoLayout,
	keybindInputVisualStylesHasNoMinHeight,
	keybindInputVisualStylesHasNoPadding,
	keybindInputVisualStylesHasNoPaddingX,
	keybindInputVisualStylesHasNoRadius,
	keybindInputVisualStylesHasNoSlotProps,
	keybindValueOptional,
};
