import React from "@rbxts/react";

import { Stack } from "./Stack";
import type { StackProps } from "./types";

const stackRef = React.createRef<Frame>();
type ExportedStackProps = React.ComponentProps<typeof Stack>;

const validStackProps: StackProps[] = [
	{},
	{ direction: "vertical", gap: "md", align: "center", justify: "spaceBetween" },
	{
		selectionGroup: true,
		selectionBehaviorUp: Enum.SelectionBehavior.Stop,
		selectionBehaviorDown: Enum.SelectionBehavior.Escape,
		selectionBehaviorLeft: Enum.SelectionBehavior.Stop,
		selectionBehaviorRight: Enum.SelectionBehavior.Escape,
	},
	{ slotProps: { root: { SelectionGroup: false }, listLayout: { Padding: new UDim(0, 8) } } },
	{ ref: stackRef },
];

const validExportedStackProps: ExportedStackProps[] = [
	{},
	{ direction: "horizontal", gap: 8 },
	{ selectionGroup: true, selectionBehaviorRight: Enum.SelectionBehavior.Stop },
];

const validStackExamples = [
	<Stack key="basic" direction="vertical" gap="sm">
		<frame />
	</Stack>,
	<Stack
		key="selection-group"
		selectionGroup
		selectionBehaviorUp={Enum.SelectionBehavior.Stop}
		selectionBehaviorDown={Enum.SelectionBehavior.Escape}
		selectionBehaviorLeft={Enum.SelectionBehavior.Stop}
		selectionBehaviorRight={Enum.SelectionBehavior.Escape}
	/>,
	<Stack key="slot-override" selectionGroup slotProps={{ root: { SelectionGroup: false } }} />,
	<Stack key="ref" ref={stackRef} />,
];

const acceptsStackChildren: React.ReactNode = validStackExamples;
const acceptsStackProps: StackProps[] = validStackProps;
const acceptsExportedStackProps: ExportedStackProps[] = validExportedStackProps;

type InvalidStackDirectionAllowed = "diagonal" extends NonNullable<StackProps["direction"]> ? true : false;
type ExportedStackChildrenAllowed = React.ReactNode extends ExportedStackProps["children"] ? true : false;

const invalidStackDirection: InvalidStackDirectionAllowed = false;
const exportedStackChildren: ExportedStackChildrenAllowed = true;

export {
	acceptsExportedStackProps,
	acceptsStackChildren,
	acceptsStackProps,
	exportedStackChildren,
	invalidStackDirection,
};
