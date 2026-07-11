import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Text } from "../Text";

import { ScrollArea } from "./ScrollArea";
import type { ScrollAreaProps } from "./types";

const scrollAreaRef = React.createRef<ScrollingFrame>();
type ExportedScrollAreaProps = React.ComponentProps<typeof ScrollArea>;

const validScrollAreaProps: ScrollAreaProps[] = [
	{},
	{ width: 240, height: 160 },
	{ direction: "vertical", automaticCanvasSize: Enum.AutomaticSize.Y },
	{ direction: "horizontal", canvasSize: UDim2.fromOffset(640, 0) },
	{ direction: "both", canvasPosition: new Vector2(12, 20) },
	{ scrollbarSize: 8, scrollbarTransparency: 0.1, scrollbarColor: themeRefs.text.secondary },
	{ scrollingEnabled: false },
	{
		selectionGroup: true,
		selectionBehaviorUp: Enum.SelectionBehavior.Stop,
		selectionBehaviorDown: Enum.SelectionBehavior.Escape,
		selectionBehaviorLeft: Enum.SelectionBehavior.Stop,
		selectionBehaviorRight: Enum.SelectionBehavior.Escape,
	},
	{ onCanvasPositionChange: () => undefined },
	{ p: "sm", bg: themeRefs.background.surface },
	{ slotProps: { root: { ScrollBarThickness: 12 }, content: { BackgroundTransparency: 1 }, padding: { PaddingLeft: new UDim(0, 12) } } },
	{ ref: scrollAreaRef },
];

const validExportedScrollAreaProps: ExportedScrollAreaProps[] = [
	{},
	{ height: 120, direction: "vertical" },
	{ onCanvasPositionChange: () => undefined },
];

const validScrollAreaExamples = [
	<ScrollArea key="basic" height={120}><Text text="Scrollable content" /></ScrollArea>,
	<ScrollArea key="horizontal" direction="horizontal" width={200} height={80} />,
	<ScrollArea
		key="selection-group"
		selectionGroup
		selectionBehaviorUp={Enum.SelectionBehavior.Stop}
		selectionBehaviorDown={Enum.SelectionBehavior.Escape}
		selectionBehaviorLeft={Enum.SelectionBehavior.Stop}
		selectionBehaviorRight={Enum.SelectionBehavior.Escape}
	/>,
	<ScrollArea key="slots" slotProps={{ root: { ScrollBarThickness: 10 }, content: { ZIndex: 2 } }} />,
	<ScrollArea key="ref" ref={scrollAreaRef} />,
];

const acceptsScrollAreaChildren: React.ReactNode = validScrollAreaExamples;
const acceptsScrollAreaProps: ScrollAreaProps[] = validScrollAreaProps;
const acceptsExportedScrollAreaProps: ExportedScrollAreaProps[] = validExportedScrollAreaProps;

type InvalidScrollAreaDirectionAllowed = "diagonal" extends NonNullable<ScrollAreaProps["direction"]> ? true : false;
type InvalidScrollAreaScrollbarSizeAllowed = string extends NonNullable<ScrollAreaProps["scrollbarSize"]> ? true : false;
type ExportedScrollAreaChildrenAllowed = React.ReactNode extends ExportedScrollAreaProps["children"] ? true : false;

const invalidScrollAreaDirection: InvalidScrollAreaDirectionAllowed = false;
const invalidScrollAreaScrollbarSize: InvalidScrollAreaScrollbarSizeAllowed = false;
const exportedScrollAreaChildren: ExportedScrollAreaChildrenAllowed = true;

export {
	acceptsExportedScrollAreaProps,
	acceptsScrollAreaChildren,
	acceptsScrollAreaProps,
	exportedScrollAreaChildren,
	invalidScrollAreaDirection,
	invalidScrollAreaScrollbarSize,
};
