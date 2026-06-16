import React from "@rbxts/react";

import { Box } from "../Box";

import { Pressable } from "./Pressable";
import type { PressableInteractionState, PressableProps, PressableRenderState } from "./types";

const pressableRef = React.createRef<TextButton>();
type ExportedPressableProps = React.ComponentProps<typeof Pressable>;

function PressableChild(): React.ReactElement {
	return <frame Size={UDim2.fromOffset(12, 12)} BackgroundColor3={Color3.fromRGB(64, 145, 108)} BorderSizePixel={0} />;
}

const validPressableProps: PressableProps[] = [
	{ onPress: () => undefined },
	{ disabled: true, onPress: () => undefined },
	{ active: false, onPress: () => undefined },
	{ cursor: "default" },
	{ cursor: "pointer" },
	{ cursor: "rbxasset://SystemCursors/PointingHand" },
	{ width: 200, height: 48, position: { x: "50%", y: 0 }, p: "md", zIndex: 3 },
	{ bg: "background.surface", bgTransparency: 0.1, clip: true },
	{ slotProps: { root: { AutoButtonColor: true }, padding: { PaddingLeft: new UDim(0, 18) } } },
	{ slotProps: { sizeConstraint: { MinSize: new Vector2(120, 36) } } },
	{ children: <PressableChild key="child" /> },
	{ render: (state) => <Box key={state.state} bg={state.pressed ? "action.pressed" : "action.hover"} /> },
	{ ref: pressableRef },
];

const validExportedPressableProps: ExportedPressableProps[] = [
	{ children: <PressableChild key="exported-child" /> },
	{ render: (state: PressableRenderState) => <Box key={state.state} /> },
	{ disabled: true },
];

const validPressableExamples = [
	<Pressable key="plain" onPress={() => undefined} />,
	<Pressable key="child"><PressableChild /></Pressable>,
	<Pressable key="render-state" render={(state) => <Box bg={state.hovered ? "action.hover" : "background.surface"} />} />,
	<Pressable key="ref" ref={pressableRef} />,
];

const acceptsPressableChildren: React.ReactNode = validPressableExamples;
const acceptsPressableProps: PressableProps[] = validPressableProps;
const acceptsExportedPressableProps: ExportedPressableProps[] = validExportedPressableProps;

type InvalidPressableCursorAllowed = "resize-horizontal" extends NonNullable<PressableProps["cursor"]> ? true : false;
type RenderStatePressedAllowed = Extract<PressableInteractionState, "pressed"> extends never ? false : true;
type RenderPropAllowed = ((state: PressableRenderState) => React.ReactNode) extends NonNullable<PressableProps["render"]> ? true : false;

const invalidPressableCursor: InvalidPressableCursorAllowed = false;
const renderStatePressed: RenderStatePressedAllowed = true;
const renderProp: RenderPropAllowed = true;

export {
	acceptsExportedPressableProps,
	acceptsPressableChildren,
	acceptsPressableProps,
	invalidPressableCursor,
	renderProp,
	renderStatePressed,
};
