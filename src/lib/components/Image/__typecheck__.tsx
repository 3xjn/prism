import React from "@rbxts/react";

import { Text } from "../Text";

import { Image } from "./Image";
import type { ImageProps } from "./types";

const imageRef = React.createRef<ImageLabel>();
type ExportedImageProps = React.ComponentProps<typeof Image>;

const validImageProps: ImageProps[] = [
	{ src: "rbxassetid://0" },
	{ src: "rbxassetid://0", width: 120, height: 80 },
	{ src: "rbxassetid://0", width: "100%", aspectRatio: 16 / 9 },
	{ src: "rbxassetid://0", color: "text.secondary", transparency: 0.25 },
	{ src: "rbxassetid://0", scaleType: Enum.ScaleType.Crop, clip: true },
	{ src: "rbxassetid://0", scaleType: Enum.ScaleType.Slice, sliceCenter: new Rect(8, 8, 24, 24), sliceScale: 1 },
	{ src: "rbxassetid://0", imageRectOffset: new Vector2(0, 0), imageRectSize: new Vector2(32, 32) },
	{ src: "rbxassetid://0", bg: "background.surface", radius: "md", borderColor: "border.subtle" },
	{ src: "rbxassetid://0", stroke: { color: Color3.fromRGB(255, 255, 255), thickness: 2, transparency: 0.2 } },
	{ src: "rbxassetid://0", p: "sm" },
	{ src: "rbxassetid://0", slotProps: { root: { ImageTransparency: 0.1 }, corner: { CornerRadius: new UDim(0, 12) } } },
	{ src: "rbxassetid://0", slotProps: { sizeConstraint: { MinSize: new Vector2(24, 24) }, aspectRatio: { AspectRatio: 1 } } },
	{ src: "rbxassetid://0", ref: imageRef },
];

const validExportedImageProps: ExportedImageProps[] = [
	{ src: "rbxassetid://0" },
	{ src: "rbxassetid://0", width: 64, height: 64 },
	{ src: "rbxassetid://0", scaleType: Enum.ScaleType.Fit, color: Color3.fromRGB(255, 255, 255) },
];

const validImageExamples = [
	<Image key="basic" src="rbxassetid://0" width={96} height={96} />,
	<Image key="crop" src="rbxassetid://0" width={160} height={96} scaleType={Enum.ScaleType.Crop} radius="md" />,
	<Image key="slot" src="rbxassetid://0" slotProps={{ root: { ImageTransparency: 0.2 } }} />,
	<Image key="children" src="rbxassetid://0"><Text text="Overlay" /></Image>,
	<Image key="ref" src="rbxassetid://0" ref={imageRef} />,
];

const acceptsImageChildren: React.ReactNode = validImageExamples;
const acceptsImageProps: ImageProps[] = validImageProps;
const acceptsExportedImageProps: ExportedImageProps[] = validExportedImageProps;

type ImageSrcRequired = {} extends Pick<ImageProps, "src"> ? true : false;
type InvalidImageColorAllowed = "primary" extends NonNullable<ImageProps["color"]> ? true : false;
type InvalidScaleTypeAllowed = "fit" extends NonNullable<ImageProps["scaleType"]> ? true : false;

const imageSrcRequired: ImageSrcRequired = false;
const invalidImageColor: InvalidImageColorAllowed = false;
const invalidScaleType: InvalidScaleTypeAllowed = false;

export {
	acceptsExportedImageProps,
	acceptsImageChildren,
	acceptsImageProps,
	imageSrcRequired,
	invalidImageColor,
	invalidScaleType,
};
