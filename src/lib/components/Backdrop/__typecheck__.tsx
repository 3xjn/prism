import React from "@rbxts/react";

import type { AssertFalse, AssertTrue, IsAssignable } from "@prism/testing/typeContracts";

import { Backdrop } from "./Backdrop";
import type { BackdropProps } from "./types";

const backdropRef = React.createRef<TextButton>();
type ExportedBackdropProps = React.ComponentProps<typeof Backdrop>;

const validBackdropProps: BackdropProps[] = [
	{},
	{ visible: true },
	{ visible: false },
	{ opacity: 0.5 },
	{ color: "background.default" },
	{ color: Color3.fromRGB(12, 16, 24) },
	{ onPress: () => undefined },
	{ active: false, cursor: "default" },
	{ zIndex: 12 },
	{ excludeRect: { position: UDim2.fromScale(0.5, 0.5), size: UDim2.fromOffset(320, 240), anchor: new Vector2(0.5, 0.5) } },
	{ slotProps: { root: { BackgroundTransparency: 0.9, ZIndex: 30 } } },
	{ ref: backdropRef },
];

const validExportedBackdropProps: ExportedBackdropProps[] = [
	{},
	{ opacity: 0.42, onPress: () => undefined },
	{ color: "text.primary", visible: true },
];

const validBackdropExamples = [
	<Backdrop key="basic" />,
	<Backdrop key="press" opacity={0.45} onPress={() => undefined} />,
	<Backdrop key="exclude" excludeRect={{ position: UDim2.fromScale(0.5, 0.5), size: UDim2.fromOffset(320, 240), anchor: new Vector2(0.5, 0.5) }} />,
	<Backdrop key="slot" slotProps={{ root: { ZIndex: 20 } }} />,
	<Backdrop key="ref" ref={backdropRef} />,
];

const acceptsBackdropChildren: React.ReactNode = validBackdropExamples;
const acceptsBackdropProps: BackdropProps[] = validBackdropProps;
const acceptsExportedBackdropProps: ExportedBackdropProps[] = validExportedBackdropProps;

type InvalidBackdropOpacityAllowed = AssertFalse<IsAssignable<string, NonNullable<BackdropProps["opacity"]>>>;
type InvalidBackdropColorAllowed = AssertFalse<IsAssignable<boolean, NonNullable<BackdropProps["color"]>>>;
type ExportedBackdropOnPressAllowed = AssertTrue<IsAssignable<() => void, NonNullable<ExportedBackdropProps["onPress"]>>>;

const invalidBackdropOpacity: InvalidBackdropOpacityAllowed = false;
const invalidBackdropColor: InvalidBackdropColorAllowed = false;
const exportedBackdropOnPress: ExportedBackdropOnPressAllowed = true;

export {
	acceptsBackdropChildren,
	acceptsBackdropProps,
	acceptsExportedBackdropProps,
	exportedBackdropOnPress,
	invalidBackdropColor,
	invalidBackdropOpacity,
};
