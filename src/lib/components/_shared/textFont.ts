import type React from "@rbxts/react";

type HostFont = React.InstanceProps<TextLabel>["Font"] | React.InstanceProps<TextBox>["Font"];
type HostFontFace = React.InstanceProps<TextLabel>["FontFace"] | React.InstanceProps<TextBox>["FontFace"];

export function resolveTextFontFace(
	font: HostFont | undefined,
	fontFace: HostFontFace | undefined,
	fallback: Enum.Font,
): Font | React.Binding<Font> {
	if (fontFace !== undefined) {
		return fontFace;
	}

	if (typeOf(font) === "EnumItem") {
		return Font.fromEnum(font as Enum.Font);
	}

	return Font.fromEnum(fallback);
}
