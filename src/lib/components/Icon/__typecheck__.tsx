import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Icon } from "./Icon";
import type { IconProps } from "./types";

const iconRef = React.createRef<ImageLabel>();
type ExportedIconProps = React.ComponentProps<typeof Icon>;

const validIconProps: IconProps[] = [
	{ name: "search" },
	{ name: "settings", size: "sm", color: themeRefs.text.secondary },
	{ name: "server", size: 24, color: Color3.fromRGB(59, 130, 246) },
	{ name: "check", cursor: "pointer" },
	{ name: "check", width: 20, height: 20, position: { x: "50%", y: 0 } },
	{ name: "chevron-right", minWidth: 16, minHeight: 16, maxWidth: 48, maxHeight: 48 },
	{ name: "alert-circle", bg: themeRefs.background.surface, bgTransparency: 0, clip: true },
	{ name: "info", sizeConstraint: { min: new Vector2(12, 12), max: new Vector2(32, 32) } },
	{ name: "x", Event: { MouseEnter: () => undefined }, Change: { AbsoluteSize: () => undefined } },
	{ name: "search", slotProps: { root: { ImageTransparency: 0.15, ScaleType: Enum.ScaleType.Stretch } } },
	{ name: "server", slotProps: { sizeConstraint: { MinSize: new Vector2(20, 20) } } },
	{ name: "check", ref: iconRef },
];

const validExportedIconProps: ExportedIconProps[] = [
	{ name: "search" },
	{ name: "check", cursor: "pointer" },
	{ name: "server", size: "lg", color: themeRefs.primary.main },
	{ name: "check", size: 20, color: Color3.fromRGB(64, 145, 108) },
];

const validIconExamples = [
	<Icon key="search" name="search" />,
	<Icon key="settings" name="settings" size="sm" color={themeRefs.text.secondary} />,
	<Icon key="server" name="server" size={24} color={Color3.fromRGB(59, 130, 246)} />,
	<Icon key="layout" name="check" width={20} height={20} position={{ x: "50%", y: 0 }} />,
	<Icon key="constraint" name="info" slotProps={{ sizeConstraint: { MinSize: new Vector2(20, 20) } }} />,
	<Icon key="slot-root" name="x" slotProps={{ root: { ImageTransparency: 0.1 } }} />,
	<Icon key="ref" name="alert-circle" ref={iconRef} />,
];

const acceptsIconChildren: React.ReactNode = validIconExamples;
const acceptsIconProps: IconProps[] = validIconProps;
const acceptsExportedIconProps: ExportedIconProps[] = validExportedIconProps;

type InvalidIconNameAllowed = "not-a-lucide-icon" extends IconProps["name"] ? true : false;
type InvalidIconColorAllowed = "not-a-color" extends NonNullable<IconProps["color"]> ? true : false;
type InvalidIconChildAllowed = React.ReactElement extends NonNullable<IconProps[keyof Pick<IconProps, never>]> ? true : false;

const invalidIconName: InvalidIconNameAllowed = false;
const invalidIconColor: InvalidIconColorAllowed = false;
const invalidIconChild: InvalidIconChildAllowed = false;

export {
	acceptsExportedIconProps,
	acceptsIconChildren,
	acceptsIconProps,
	invalidIconChild,
	invalidIconColor,
	invalidIconName,
};
