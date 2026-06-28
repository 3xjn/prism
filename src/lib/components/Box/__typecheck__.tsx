import React from "@rbxts/react";

import type { AssertFalse, AssertTrue, IsAssignable } from "@prism/testing/typeContracts";
import { theme as themeRefs } from "@prism/theme";

import { Box } from "./Box";
import type { BoxProps } from "./types";

const boxRef = React.createRef<Frame>();

const validBoxExamples = [
	<Box key="size-offset" width={200} height={100} />,
	<Box key="size-scale" width="50%" />,
	<Box key="radius-number" radius={20} />,
	<Box key="radius-token" radius="md" />,
	<Box key="background" bg={themeRefs.primary.main} />,
	<Box key="background-ref" bg={themeRefs.background.surface} />,
	<Box key="cursor-pointer" cursor="pointer" />,
	<Box key="cursor-default" cursor="default" />,
	<Box key="cursor-grab" cursor="grab" />,
	<Box key="cursor-resize-ew" cursor="resize-ew" />,
	<Box key="cursor-crosshair" cursor="crosshair" />,
	<Box key="cursor-raw" cursor="rbxasset://SystemCursors/PointingHand" />,
	<Box key="stroke" stroke={{ color: themeRefs.border.strong, thickness: 2 }} />,
	<Box key="stroke-ref" stroke={{ color: themeRefs.border.strong, thickness: 2 }} />,
	<Box key="padding" p="md" />,
	<Box key="padding-axes" px="lg" py="sm" />,
	<Box key="slot-props-root" bg={themeRefs.background.surface} slotProps={{ root: { BackgroundColor3: Color3.fromRGB(255, 0, 0) } }} />,
	<Box key="slot-props-stroke" slotProps={{ stroke: { Thickness: 3 } }} />,
	<Box key="ref" ref={boxRef} />,
	<Box key="children-order">
		<textlabel Text="child" />
	</Box>,
];

const acceptsBoxChildren: React.ReactNode = validBoxExamples;

type InvalidTokenAllowed = AssertFalse<IsAssignable<"invalid.token", NonNullable<BoxProps["bg"]>>>;
type ThemeTextRefAllowed = AssertTrue<IsAssignable<typeof themeRefs.text.secondary, NonNullable<BoxProps["bg"]>>>;
type IntentStringAllowed = AssertFalse<IsAssignable<"success", NonNullable<BoxProps["bg"]>>>;
type InvalidCursorAllowed = AssertFalse<IsAssignable<"resize-horizontal", NonNullable<BoxProps["cursor"]>>>;
type NamedCursorAllowed = AssertTrue<IsAssignable<"resize-ew", NonNullable<BoxProps["cursor"]>>>;
type RawCursorAllowed = AssertTrue<IsAssignable<"rbxasset://SystemCursors/PointingHand", NonNullable<BoxProps["cursor"]>>>;

const invalidToken: InvalidTokenAllowed = false;
const themeTextRefAllowed: ThemeTextRefAllowed = true;
const intentStringAllowed: IntentStringAllowed = false;
const invalidCursor: InvalidCursorAllowed = false;
const namedCursor: NamedCursorAllowed = true;
const rawCursor: RawCursorAllowed = true;

export { acceptsBoxChildren, intentStringAllowed, invalidCursor, invalidToken, namedCursor, rawCursor, themeTextRefAllowed };
