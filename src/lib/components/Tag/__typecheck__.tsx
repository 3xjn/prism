import React from "@rbxts/react";

import type { AssertFalse, AssertTrue, IsAssignable } from "@prism/testing/typeContracts";

import { Tag } from "./Tag";
import type { TagProps } from "./types";

const tagRef = React.createRef<Frame>();
type ExportedTagProps = React.ComponentProps<typeof Tag>;

const validTagProps: TagProps[] = [
	{},
	{ label: "Ready" },
	{ children: "Queued" },
	{ label: 42 },
	{ variant: "outline", color: "neutral", size: "sm" },
	{ variant: "filled", color: "success", size: "md", radius: "xl" },
	{ color: "warning", leftSection: <imagelabel key="warning-icon" /> },
	{ color: "info", rightSection: <textlabel key="count" Text="3" /> },
	{ fullWidth: true, width: 260, minWidth: 180, layoutOrder: 2, p: "xs" },
	{ radius: 6 },
	{ radius: new UDim(0, 10) },
	{ slotProps: { root: { BackgroundTransparency: 0.5 } } },
	{ slotProps: { label: { Text: "Override" }, listLayout: { Padding: new UDim(0, 6) } } },
	{ slotProps: { leftSection: { LayoutOrder: 0 }, rightSection: { LayoutOrder: 2 } } },
	{ slotProps: { corner: { CornerRadius: new UDim(0, 8) }, stroke: { Thickness: 2 } } },
	{ slotProps: { padding: { PaddingLeft: new UDim(0, 6) }, sizeConstraint: { MinSize: new Vector2(64, 24) } } },
	{ ref: tagRef, label: "Ref tag" },
];

const validExportedTagProps: ExportedTagProps[] = [
	{ label: "Stable" },
	{ color: "neutral" },
	{ color: "primary", variant: "light" },
	{ size: "lg", leftSection: <frame key="dot" /> },
];

const validTagExamples = [
	<Tag key="default" label="Ready" />,
	<Tag key="neutral" color="neutral" label="Neutral" />,
	<Tag key="semantic" color="success" variant="filled" label="Live" />,
	<Tag key="adorned" label="Squad" leftSection={<frame key="dot" />} rightSection={<textlabel key="count" Text="4" />} />,
	<Tag key="slots" slotProps={{ root: { ZIndex: 4 }, label: { Text: "Override" }, stroke: { Thickness: 2 } }} />,
	<Tag key="ref" ref={tagRef} label="Ref" />,
];

const acceptsTagChildren: React.ReactNode = validTagExamples;
const acceptsTagProps: TagProps[] = validTagProps;
const acceptsExportedTagProps: ExportedTagProps[] = validExportedTagProps;

type NeutralColorAllowed = AssertTrue<IsAssignable<"neutral", NonNullable<TagProps["color"]>>>;
type InvalidTagColorAllowed = AssertFalse<IsAssignable<"palette.primary.5", NonNullable<TagProps["color"]>>>;
type InvalidTagVariantAllowed = AssertFalse<IsAssignable<"ghost", NonNullable<TagProps["variant"]>>>;
type TagLabelNumberAllowed = AssertTrue<IsAssignable<42, NonNullable<TagProps["label"]>>>;
type TagChildrenElementAllowed = AssertFalse<IsAssignable<React.ReactElement, NonNullable<TagProps["children"]>>>;
type ExportedTagColorAllowed = AssertTrue<IsAssignable<"success", NonNullable<ExportedTagProps["color"]>>>;

const neutralColorAllowed: NeutralColorAllowed = true;
const invalidTagColor: InvalidTagColorAllowed = false;
const invalidTagVariant: InvalidTagVariantAllowed = false;
const tagLabelNumber: TagLabelNumberAllowed = true;
const tagChildrenElement: TagChildrenElementAllowed = false;
const exportedTagColor: ExportedTagColorAllowed = true;

export {
	acceptsExportedTagProps,
	acceptsTagChildren,
	acceptsTagProps,
	exportedTagColor,
	invalidTagColor,
	invalidTagVariant,
	neutralColorAllowed,
	tagChildrenElement,
	tagLabelNumber,
};
