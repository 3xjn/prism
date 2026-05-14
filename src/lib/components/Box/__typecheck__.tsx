import React from "@rbxts/react";

import type { AssertFalse, AssertTrue, IsAssignable } from "@prism/testing/typeContracts";

import { Box } from "./Box";
import type { BoxProps } from "./types";

const boxRef = React.createRef<Frame>();

const validBoxExamples = [
	<Box key="size-offset" width={200} height={100} />,
	<Box key="size-scale" width="50%" />,
	<Box key="radius-number" radius={20} />,
	<Box key="radius-token" radius="md" />,
	<Box key="background" bg="primary.main" />,
	<Box key="cursor-pointer" cursor="pointer" />,
	<Box key="cursor-default" cursor="default" />,
	<Box key="cursor-raw" cursor="rbxasset://SystemCursors/PointingHand" />,
	<Box key="stroke" stroke={{ color: "border.strong", thickness: 2 }} />,
	<Box key="padding" p="md" />,
	<Box key="padding-axes" px="lg" py="sm" />,
	<Box key="slot-props-root" bg="background.surface" slotProps={{ root: { BackgroundColor3: Color3.fromRGB(255, 0, 0) } }} />,
	<Box key="slot-props-stroke" slotProps={{ stroke: { Thickness: 3 } }} />,
	<Box key="ref" ref={boxRef} />,
	<Box key="children-order">
		<textlabel Text="child" />
	</Box>,
];

const acceptsBoxChildren: React.ReactNode = validBoxExamples;

type InvalidTokenAllowed = AssertFalse<IsAssignable<"invalid.token", NonNullable<BoxProps["bg"]>>>;
type InvalidCursorAllowed = AssertFalse<IsAssignable<"crosshair", NonNullable<BoxProps["cursor"]>>>;
type RawCursorAllowed = AssertTrue<IsAssignable<"rbxasset://SystemCursors/PointingHand", NonNullable<BoxProps["cursor"]>>>;

const invalidToken: InvalidTokenAllowed = false;
const invalidCursor: InvalidCursorAllowed = false;
const rawCursor: RawCursorAllowed = true;

export { acceptsBoxChildren, invalidCursor, invalidToken, rawCursor };
