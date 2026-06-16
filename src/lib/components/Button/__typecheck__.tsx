import React from "@rbxts/react";

import { Button } from "./Button";
import type { ButtonProps } from "./types";

const buttonRef = React.createRef<TextButton>();
type ButtonStoryRenderer = (props: ButtonProps) => React.ReactElement;
type ExportedButtonProps = React.ComponentProps<typeof Button>;

function ButtonAdornment(): React.ReactElement {
	return <frame Size={UDim2.fromOffset(12, 12)} BackgroundColor3={Color3.fromRGB(64, 145, 108)} BorderSizePixel={0} />;
}

function renderButton(props: ButtonProps): React.ReactElement {
	return (Button as ButtonStoryRenderer)(props);
}

// Direct `<Button>Save</Button>` JSX still stays blocked by the current @rbxts/react typings.
// `label` is the preferred public copy prop, while primitive `children` remains as an explicit
// compatibility path for existing callable-render and object-prop usage.

const validButtonProps: ButtonProps[] = [
	{ label: "Save" },
	{ label: "Publish", variant: "light", color: "success" },
	{ label: "Delete", variant: "outline", color: "error" },
	{ label: "More", variant: "subtle", size: "sm" },
	{ label: "Disabled", disabled: true, onPress: () => undefined },
	{ label: "Cursor default", cursor: "default" },
	{ label: "Cursor raw", cursor: "rbxasset://SystemCursors/PointingHand" },
	{ label: "Wide", fullWidth: true },
	{ label: "Layout", position: { x: "50%", y: 0 }, p: "md", zIndex: 3 },
	{ label: "Root slot", slotProps: { root: { AutoButtonColor: true, TextTransparency: 0.1 } } },
	{ label: "Cursor event override", slotProps: { root: { Event: { MouseEnter: () => undefined, MouseLeave: () => undefined } } } },
	{ label: "Decorators", slotProps: { corner: { CornerRadius: new UDim(0, 16) }, scale: { Scale: 0.98 } } },
	{ label: "Constraint", slotProps: { sizeConstraint: { MinSize: new Vector2(160, 40) } } },
	{ label: "Padding", slotProps: { padding: { PaddingLeft: new UDim(0, 18) } } },
	{ label: "Legacy", children: "Legacy" },
	{ label: "Preferred", children: "Legacy fallback ignored" },
	{ children: <ButtonAdornment key="icon-only" /> },
	{ label: "Apply", children: <ButtonAdornment key="left" /> },
	{ label: "Ref", ref: buttonRef },
];

const validExportedButtonProps: ExportedButtonProps[] = [
	{ label: "Save" },
	{ label: "Pointer", cursor: "pointer" },
	{ children: "Save", variant: "light", color: "secondary" },
	{ children: 42 },
	{ label: 42 },
	{ label: "Apply", children: <ButtonAdornment key="exported-left" /> },
];

const validButtonExamples = [
	renderButton({ label: "Save" }),
	renderButton({ color: "primary", variant: "filled", label: "Save" }),
	renderButton({ color: "success", variant: "light", label: "Saved" }),
	renderButton({ color: "warning", variant: "outline", label: "Review" }),
	renderButton({ color: "secondary", variant: "subtle", label: "Secondary" }),
	renderButton({ disabled: true, onPress: () => undefined, label: "Disabled" }),
	renderButton({ children: "Legacy child label" }),
	renderButton({ children: <ButtonAdornment key="example-icon-only" /> }),
	renderButton({ label: "Slot props", children: <ButtonAdornment key="example-left" />, slotProps: { stroke: { Thickness: 2 }, scale: { Scale: 1.01 } } }),
	renderButton({ ref: buttonRef, label: "Ref button" }),
];

const acceptsButtonChildren: React.ReactNode = validButtonExamples;
const acceptsButtonProps: ButtonProps[] = validButtonProps;
const acceptsExportedButtonProps: ExportedButtonProps[] = validExportedButtonProps;

type InvalidButtonColorAllowed = "palette.orange.5" extends NonNullable<ButtonProps["color"]> ? true : false;
type InvalidButtonVariantAllowed = "ghost" extends NonNullable<ButtonProps["variant"]> ? true : false;
type InvalidButtonCursorAllowed = "resize-horizontal" extends NonNullable<ButtonProps["cursor"]> ? true : false;
type ReactElementButtonChildAllowed = React.ReactElement extends NonNullable<ButtonProps["children"]> ? true : false;
type ButtonLabelNumberAllowed = 42 extends NonNullable<ButtonProps["label"]> ? true : false;
type ExportedButtonStringChildAllowed = "Save" extends NonNullable<ExportedButtonProps["children"]> ? true : false;
type ExportedButtonNumberChildAllowed = 42 extends NonNullable<ExportedButtonProps["children"]> ? true : false;
type ExportedButtonLabelStringAllowed = "Save" extends NonNullable<ExportedButtonProps["label"]> ? true : false;
type ReactAttributesStringChildAllowed = "Save" extends NonNullable<React.Attributes["children"]> ? true : false;

const invalidButtonColor: InvalidButtonColorAllowed = false;
const invalidButtonVariant: InvalidButtonVariantAllowed = false;
const invalidButtonCursor: InvalidButtonCursorAllowed = false;
const reactElementButtonChild: ReactElementButtonChildAllowed = true;
const buttonLabelNumber: ButtonLabelNumberAllowed = true;
const exportedButtonStringChild: ExportedButtonStringChildAllowed = true;
const exportedButtonNumberChild: ExportedButtonNumberChildAllowed = true;
const exportedButtonLabelString: ExportedButtonLabelStringAllowed = true;
const reactAttributesStringChild: ReactAttributesStringChildAllowed = false;

export {
	acceptsButtonChildren,
	acceptsButtonProps,
	acceptsExportedButtonProps,
	buttonLabelNumber,
	exportedButtonNumberChild,
	exportedButtonLabelString,
	exportedButtonStringChild,
	invalidButtonCursor,
	invalidButtonColor,
	invalidButtonVariant,
	reactElementButtonChild,
	reactAttributesStringChild,
};
