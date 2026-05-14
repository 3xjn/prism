import React from "@rbxts/react";

import { Text } from "./Text";
import type { TextProps } from "./types";

const textRef = React.createRef<TextLabel>();

const validTextProps: TextProps[] = [
	{ text: "Hello" },
	{ text: 42 },
	{ text: "Preferred", children: "Fallback" },
	{ children: "Hello" },
	{ children: 42 },
	{ children: "X", size: "lg" },
	{ children: "X", size: 32 },
	{ children: "X", color: "primary.main" },
	{ children: "X", align: "center", valign: "middle" },
	{ children: "long text", wrap: true },
	{ children: "Auto-sized label", p: "sm" },
	{ children: "Pointer", cursor: "pointer" },
	{ children: "x", truncate: "atend" },
	{ children: "x", maxFontSize: 24, minFontSize: 12 },
	{ children: "x", font: Enum.Font.Gotham, weight: 700 },
	{ children: "x", font: Enum.Font.Gotham, weight: 600, slotProps: { root: { Font: Enum.Font.Code } } },
	{ children: "x", font: Enum.Font.Gotham, weight: 700, slotProps: { root: { FontFace: Font.fromEnum(Enum.Font.Arcade) } } },
	{ children: "layout", width: 240, position: { x: "50%", y: 0 }, p: "md" },
	{ children: "x", slotProps: { root: { TextStrokeTransparency: 0, AutomaticSize: Enum.AutomaticSize.Y } } },
	{ children: "x", slotProps: { padding: { PaddingTop: new UDim(0, 8) } } },
	{ children: "x", slotProps: { sizeConstraint: { MaxSize: new Vector2(200, 60) } } },
	{ children: "x", slotProps: { textSizeConstraint: { MaxTextSize: 28 } } },
];

const validTextExamples = [
	<Text key="text" text="Hello" />,
	<Text key="text-number" text={42} />,
	<Text key="layout" width={240} position={{ x: "50%", y: 0 }} p="md" />,
	<Text key="appearance" size="lg" color="primary.main" align="center" wrap />,
	<Text key="cursor" text="Pointer" cursor="pointer" />,
	<Text key="constraints" maxFontSize={24} minFontSize={12} truncate="atend" />,
	<Text key="font" font={Enum.Font.Gotham} weight={700} />,
	<Text key="font-slot-override" font={Enum.Font.Gotham} weight={600} slotProps={{ root: { Font: Enum.Font.Code } }} />,
	<Text
		key="font-face-slot-override"
		font={Enum.Font.Gotham}
		weight={700}
		slotProps={{ root: { FontFace: Font.fromEnum(Enum.Font.Arcade) } }}
	/>,
	<Text key="slot-props-root" slotProps={{ root: { TextStrokeTransparency: 0, AutomaticSize: Enum.AutomaticSize.Y } }} />,
	<Text key="slot-props-padding" slotProps={{ padding: { PaddingTop: new UDim(0, 8) } }} />,
	<Text key="slot-props-size-constraint" slotProps={{ sizeConstraint: { MaxSize: new Vector2(200, 60) } }} />,
	<Text key="slot-props-text-size-constraint" slotProps={{ textSizeConstraint: { MaxTextSize: 28 } }} />,
	<Text key="ref" ref={textRef} />,
];

const acceptsTextChildren: React.ReactNode = validTextExamples;
const acceptsTextProps: TextProps[] = validTextProps;

type InvalidTextColorAllowed = "invalid.token" extends NonNullable<TextProps["color"]> ? true : false;
type InvalidTextTruncateAllowed = "clip" extends NonNullable<TextProps["truncate"]> ? true : false;
type InvalidTextChildAllowed = React.ReactElement extends NonNullable<TextProps["children"]> ? true : false;
type InvalidTextPropAllowed = React.ReactElement extends NonNullable<TextProps["text"]> ? true : false;

const invalidTextColor: InvalidTextColorAllowed = false;
const invalidTextTruncate: InvalidTextTruncateAllowed = false;
const invalidTextChild: InvalidTextChildAllowed = false;
const invalidTextProp: InvalidTextPropAllowed = false;

export { acceptsTextChildren, acceptsTextProps, invalidTextChild, invalidTextColor, invalidTextProp, invalidTextTruncate };
