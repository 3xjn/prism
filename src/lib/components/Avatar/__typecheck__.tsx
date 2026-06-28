import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Avatar } from "./Avatar";
import type { AvatarProps } from "./types";

const avatarRef = React.createRef<Frame>();
type ExportedAvatarProps = React.ComponentProps<typeof Avatar>;

const validAvatarProps: AvatarProps[] = [
	{},
	{ src: "rbxassetid://0" },
	{ fallback: "AK" },
	{ fallback: 12, size: "lg", color: "success" },
	{ size: 48, radius: 10, border: 2, borderColor: themeRefs.primary.main },
	{ width: 36, height: 36, position: { x: "50%", y: 0 }, center: true },
	{ p: "xs", minWidth: 32, minHeight: 32, cursor: "pointer", clip: false },
	{ slotProps: { root: { BackgroundTransparency: 0.2 }, fallback: { Text: "GM" }, stroke: { Thickness: 0 }, padding: { PaddingLeft: new UDim(0, 2) } } },
	{ ref: avatarRef },
];

const validExportedAvatarProps: ExportedAvatarProps[] = [
	{ fallback: "P1" },
	{ src: "rbxassetid://0", size: "sm" },
];

const validAvatarExamples = [
	<Avatar key="fallback" fallback="AK" />,
	<Avatar key="image" src="rbxassetid://0" size="xl" />,
	<Avatar key="ref" ref={avatarRef} fallback="RF" />,
];

const acceptsAvatarChildren: React.ReactNode = validAvatarExamples;
const acceptsAvatarProps: AvatarProps[] = validAvatarProps;
const acceptsExportedAvatarProps: ExportedAvatarProps[] = validExportedAvatarProps;

type AvatarHasChildrenProp = "children" extends keyof AvatarProps ? true : false;
type InvalidAvatarColorAllowed = "palette.primary.5" extends NonNullable<AvatarProps["color"]> ? true : false;
type ExportedAvatarFallbackAllowed = "AK" extends NonNullable<ExportedAvatarProps["fallback"]> ? true : false;

const avatarHasChildrenProp: AvatarHasChildrenProp = false;
const invalidAvatarColorAllowed: InvalidAvatarColorAllowed = false;
const exportedAvatarFallbackAllowed: ExportedAvatarFallbackAllowed = true;

export {
	acceptsAvatarChildren,
	acceptsAvatarProps,
	acceptsExportedAvatarProps,
	avatarHasChildrenProp,
	exportedAvatarFallbackAllowed,
	invalidAvatarColorAllowed,
};
