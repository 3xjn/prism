import type React from "@rbxts/react";
type HostFont = React.InstanceProps<TextLabel>["Font"] | React.InstanceProps<TextBox>["Font"];
type HostFontFace = React.InstanceProps<TextLabel>["FontFace"] | React.InstanceProps<TextBox>["FontFace"];
export declare function resolveTextFontFace(font: HostFont | undefined, fontFace: HostFontFace | undefined, fallback: Enum.Font): Font | React.Binding<Font>;
export {};
