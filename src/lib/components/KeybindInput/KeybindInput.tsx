import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";

import { getLucideIconAsset } from "../../icons/lucide";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { assignRef, composeEventMaps, isPressInput } from "../_shared/interaction";
import { resolveSelectionProps } from "../_shared/selection";
import { applyStyleOverride } from "../_shared/styleOverride";
import { resolveTextFontFace } from "../_shared/textFont";
import {
	mergeSharedStyleProps,
	resolveThemeSizeSafe,
	resolveUDimSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import type { IconName } from "../Icon";

import {
	resolveKeybindInputMotionTransition,
	resolveKeybindInputSizeStyles,
	resolveKeybindInputVisualStyles,
	type KeybindInputInteractionState,
	type KeybindInputSizeStyles,
	type KeybindInputVisualStyles,
} from "./styles";
import type { KeybindCaptureDevice, KeybindDisplayDevice, KeybindInputProps, KeybindInputSlotProps } from "./types";

const UserInputService = game.GetService("UserInputService");
const GuiService = game.GetService("GuiService");
const GAMEPAD_KEYCODE_MIN = Enum.KeyCode.ButtonX.Value;
const GAMEPAD_KEYCODE_MAX = Enum.KeyCode.Thumbstick2Right.Value;
const DEFAULT_CANCEL_KEY_CODES = [Enum.KeyCode.Escape, Enum.KeyCode.ButtonSelect] as const;
const SPECIAL_KEY_LABELS = new Map<Enum.KeyCode, string>([
	[Enum.KeyCode.LeftShift, "Left Shift"],
	[Enum.KeyCode.RightShift, "Right Shift"],
	[Enum.KeyCode.LeftControl, "Left Ctrl"],
	[Enum.KeyCode.RightControl, "Right Ctrl"],
	[Enum.KeyCode.LeftAlt, "Left Alt"],
	[Enum.KeyCode.RightAlt, "Right Alt"],
	[Enum.KeyCode.Return, "Enter"],
	[Enum.KeyCode.Escape, "Esc"],
	[Enum.KeyCode.Backspace, "Backspace"],
	[Enum.KeyCode.Delete, "Delete"],
	[Enum.KeyCode.Space, "Space"],
]);
const GAMEPAD_KEY_LABELS = new Map<Enum.KeyCode, string>([
	[Enum.KeyCode.ButtonA, "A"],
	[Enum.KeyCode.ButtonB, "B"],
	[Enum.KeyCode.ButtonX, "X"],
	[Enum.KeyCode.ButtonY, "Y"],
	[Enum.KeyCode.ButtonL1, "LB"],
	[Enum.KeyCode.ButtonR1, "RB"],
	[Enum.KeyCode.ButtonL2, "LT"],
	[Enum.KeyCode.ButtonR2, "RT"],
]);
const DISPLAY_DEVICE_ICON_NAMES: Readonly<Record<KeybindDisplayDevice, IconName>> = table.freeze({
	keyboard: "keyboard",
	mouse: "mouse",
	gamepad: "gamepad-2",
});
const GAMEPAD_FACE_BUTTON_BADGES = new Map<string, GamepadBadgeDescriptor>([
	["ButtonA", { label: "A", backgroundColor: Color3.fromRGB(67, 190, 70), textColor: Color3.fromRGB(245, 249, 255) }],
	["ButtonB", { label: "B", backgroundColor: Color3.fromRGB(255, 40, 62), textColor: Color3.fromRGB(245, 249, 255) }],
	["ButtonX", { label: "X", backgroundColor: Color3.fromRGB(16, 137, 224), textColor: Color3.fromRGB(245, 249, 255) }],
	["ButtonY", { label: "Y", backgroundColor: Color3.fromRGB(255, 197, 22), textColor: Color3.fromRGB(18, 24, 33) }],
	[
		"ButtonCross",
		{ label: "✕", backgroundColor: Color3.fromRGB(30, 112, 229), textColor: Color3.fromRGB(245, 249, 255) },
	],
	[
		"ButtonCircle",
		{ label: "○", backgroundColor: Color3.fromRGB(232, 38, 68), textColor: Color3.fromRGB(245, 249, 255) },
	],
	[
		"ButtonSquare",
		{ label: "□", backgroundColor: Color3.fromRGB(218, 65, 151), textColor: Color3.fromRGB(245, 249, 255) },
	],
	[
		"ButtonTriangle",
		{ label: "△", backgroundColor: Color3.fromRGB(39, 176, 104), textColor: Color3.fromRGB(245, 249, 255) },
	],
]);
const PLAYSTATION_FACE_BUTTON_GLYPH_COLORS = new Map<string, Color3>([
	["ButtonCross", Color3.fromRGB(30, 112, 229)],
	["ButtonCircle", Color3.fromRGB(232, 38, 68)],
	["ButtonSquare", Color3.fromRGB(218, 65, 151)],
	["ButtonTriangle", Color3.fromRGB(39, 176, 104)],
]);
const GAMEPAD_FACE_BUTTON_FALLBACK_BADGES = new Map<Enum.KeyCode, GamepadBadgeDescriptor>([
	[
		Enum.KeyCode.ButtonA,
		{ label: "A", backgroundColor: Color3.fromRGB(67, 190, 70), textColor: Color3.fromRGB(245, 249, 255) },
	],
	[
		Enum.KeyCode.ButtonB,
		{ label: "B", backgroundColor: Color3.fromRGB(255, 40, 62), textColor: Color3.fromRGB(245, 249, 255) },
	],
	[
		Enum.KeyCode.ButtonX,
		{ label: "X", backgroundColor: Color3.fromRGB(16, 137, 224), textColor: Color3.fromRGB(245, 249, 255) },
	],
	[
		Enum.KeyCode.ButtonY,
		{ label: "Y", backgroundColor: Color3.fromRGB(255, 197, 22), textColor: Color3.fromRGB(18, 24, 33) },
	],
]);
const GAMEPAD_SHOULDER_BUTTON_LABELS = new Map<string, string>([
	["ButtonL1", "L1"],
	["ButtonR1", "R1"],
	["ButtonL2", "L2"],
	["ButtonR2", "R2"],
	["ButtonLB", "LB"],
	["ButtonRB", "RB"],
	["ButtonLT", "LT"],
	["ButtonRT", "RT"],
]);
const GAMEPAD_SHOULDER_BUTTON_FALLBACK_LABELS = new Map<Enum.KeyCode, string>([
	[Enum.KeyCode.ButtonL1, "L1"],
	[Enum.KeyCode.ButtonR1, "R1"],
	[Enum.KeyCode.ButtonL2, "L2"],
	[Enum.KeyCode.ButtonR2, "R2"],
]);

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type TextButtonChangeMap = React.InstanceProps<TextButton>["Change"];
type FrameEventMap = React.InstanceProps<Frame>["Event"];
type KeybindInputComponent = ((props: KeybindInputProps) => React.ReactElement) &
	React.ForwardRefExoticComponent<KeybindInputProps>;
type TextLabelColor = React.InstanceProps<TextLabel>["TextColor3"];
type TextLabelTransparency = React.InstanceProps<TextLabel>["TextTransparency"];
type TextLabelFont = React.InstanceProps<TextLabel>["Font"];
type TextLabelFontFace = React.InstanceProps<TextLabel>["FontFace"];

interface KeybindTileContentState {
	readonly displayText: string;
	readonly hintText: string;
	readonly value: Enum.KeyCode;
	readonly captureDevice: KeybindCaptureDevice;
	readonly displayDevice: KeybindDisplayDevice | undefined;
	readonly capturing: boolean;
	readonly hasValue: boolean;
	readonly clearReserveWidth: number;
}

interface KeybindTileColors {
	readonly labelColor: TextLabelColor;
	readonly labelTransparency: TextLabelTransparency;
	readonly hintColor: TextLabelColor;
	readonly hintTransparency: TextLabelTransparency;
	readonly deviceBackgroundColor: React.InstanceProps<Frame>["BackgroundColor3"];
	readonly deviceIconColor: React.InstanceProps<ImageLabel>["ImageColor3"];
	readonly keycapBackgroundColor: React.InstanceProps<Frame>["BackgroundColor3"];
	readonly keycapStrokeColor: React.InstanceProps<UIStroke>["Color"];
	readonly keycapStrokeTransparency: React.InstanceProps<UIStroke>["Transparency"];
	readonly keycapStrokeThickness: React.InstanceProps<UIStroke>["Thickness"];
}

interface KeybindTileZIndexes {
	readonly content: React.InstanceProps<Frame>["ZIndex"] | undefined;
	readonly deviceFrame: React.InstanceProps<Frame>["ZIndex"] | undefined;
	readonly deviceIcon: React.InstanceProps<ImageLabel>["ZIndex"] | undefined;
	readonly keycap: React.InstanceProps<Frame>["ZIndex"] | undefined;
	readonly gamepadGlyph: React.InstanceProps<ImageLabel>["ZIndex"] | undefined;
	readonly label: React.InstanceProps<TextLabel>["ZIndex"] | undefined;
	readonly hint: React.InstanceProps<TextLabel>["ZIndex"] | undefined;
}

interface KeybindComputedLayout {
	readonly size: UDim2;
	readonly constraint: { readonly min?: Vector2; readonly max?: Vector2 };
}

interface KeybindValueLayout {
	readonly leftTextReserve: number;
	readonly rightTextReserve: number;
	readonly centeredContentOffset: number;
}

interface GamepadBadgeStyle {
	readonly label: string;
	readonly backgroundColor: Color3;
	readonly textColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
	readonly size: UDim2;
	readonly radius: UDim;
	readonly fontSize: number;
}

interface GamepadBadgeDescriptor {
	readonly label: string;
	readonly backgroundColor: Color3;
	readonly textColor: Color3;
}

interface GamepadBadgeRenderState {
	readonly badge: GamepadBadgeStyle;
	readonly font: TextLabelFont;
	readonly fontFace: TextLabelFontFace;
	readonly positionOffset: number;
	readonly zIndex: React.InstanceProps<Frame>["ZIndex"] | undefined;
}

function isGamepadKeyCode(keyCode: Enum.KeyCode): boolean {
	return keyCode.Value >= GAMEPAD_KEYCODE_MIN && keyCode.Value <= GAMEPAD_KEYCODE_MAX;
}

function isGamepadInput(input: InputObject): boolean {
	return (
		input.UserInputType === Enum.UserInputType.Gamepad1 ||
		input.UserInputType === Enum.UserInputType.Gamepad2 ||
		input.UserInputType === Enum.UserInputType.Gamepad3 ||
		input.UserInputType === Enum.UserInputType.Gamepad4 ||
		input.UserInputType === Enum.UserInputType.Gamepad5 ||
		input.UserInputType === Enum.UserInputType.Gamepad6 ||
		input.UserInputType === Enum.UserInputType.Gamepad7 ||
		input.UserInputType === Enum.UserInputType.Gamepad8
	);
}

function isDeviceAllowed(input: InputObject, captureDevice: KeybindCaptureDevice): boolean {
	if (captureDevice === "keyboard") {
		return input.UserInputType === Enum.UserInputType.Keyboard;
	}

	if (captureDevice === "gamepad") {
		return isGamepadInput(input);
	}

	return input.UserInputType === Enum.UserInputType.Keyboard || isGamepadInput(input);
}

function containsKeyCode(values: readonly Enum.KeyCode[] | undefined, keyCode: Enum.KeyCode): boolean {
	if (values === undefined) {
		return false;
	}

	for (const value of values) {
		if (value === keyCode) {
			return true;
		}
	}

	return false;
}

function isAllowedKeyCode(
	keyCode: Enum.KeyCode,
	allowed: readonly Enum.KeyCode[] | undefined,
	blocked: readonly Enum.KeyCode[] | undefined,
): boolean {
	if (keyCode === Enum.KeyCode.Unknown) {
		return false;
	}

	if (containsKeyCode(blocked, keyCode)) {
		return false;
	}

	return allowed === undefined || containsKeyCode(allowed, keyCode);
}

function resolveKeyCodeLabel(keyCode: Enum.KeyCode): string {
	if (keyCode === Enum.KeyCode.Unknown) {
		return "";
	}

	const specialLabel = SPECIAL_KEY_LABELS.get(keyCode);
	if (specialLabel !== undefined) {
		return specialLabel;
	}

	if (!isGamepadKeyCode(keyCode)) {
		const layoutLabel = UserInputService.GetStringForKeyCode(keyCode);
		if (layoutLabel !== "") {
			return layoutLabel;
		}
	}

	return GAMEPAD_KEY_LABELS.get(keyCode) ?? keyCode.Name;
}

function resolveKeybindInteractionState(
	disabled: boolean,
	readOnly: boolean,
	capturing: boolean,
	pressed: boolean,
	hovered: boolean,
): KeybindInputInteractionState {
	if (disabled) {
		return "disabled";
	}

	if (readOnly) {
		return "readOnly";
	}

	if (capturing) {
		return "capturing";
	}

	if (pressed) {
		return "pressed";
	}

	return hovered ? "hovered" : "idle";
}

function resolveKeybindComputedLayout(
	fullWidth: boolean,
	resolvedWidth: UDim | undefined,
	resolvedHeight: UDim | undefined,
	resolvedSize: UDim2 | undefined,
	resolvedConstraint: { readonly min?: Vector2; readonly max?: Vector2 } | undefined,
	sizeStyles: KeybindInputSizeStyles,
): KeybindComputedLayout {
	const width = fullWidth
		? resolveUDimSafe("keybindInput", "100%", "width")
		: (resolvedWidth ?? new UDim(0, sizeStyles.defaultWidth));
	const height = resolvedHeight ?? new UDim(0, sizeStyles.minHeight);
	const minConstraint = resolvedConstraint?.min;

	return {
		size: resolvedSize ?? new UDim2(width, height),
		constraint: {
			min:
				minConstraint === undefined
					? new Vector2(0, sizeStyles.minHeight)
					: new Vector2(minConstraint.X, math.max(minConstraint.Y, sizeStyles.minHeight)),
			max: resolvedConstraint?.max,
		},
	};
}

function resolveKeybindTileZIndexes(
	slotProps: KeybindInputSlotProps | undefined,
	rootZIndex: React.InstanceProps<Frame>["ZIndex"] | undefined,
): KeybindTileZIndexes & {
	readonly root: React.InstanceProps<Frame>["ZIndex"] | undefined;
	readonly trigger: React.InstanceProps<TextButton>["ZIndex"] | undefined;
} {
	const trigger = slotProps?.trigger?.ZIndex ?? rootZIndex;
	const content = slotProps?.content?.ZIndex ?? trigger;
	const keycap = slotProps?.keycap?.ZIndex ?? content;

	return {
		root: rootZIndex,
		trigger,
		content,
		deviceFrame: slotProps?.deviceFrame?.ZIndex ?? content,
		deviceIcon: slotProps?.deviceIcon?.ZIndex ?? slotProps?.deviceFrame?.ZIndex ?? content,
		keycap,
		gamepadGlyph: slotProps?.gamepadGlyph?.ZIndex ?? keycap,
		label: slotProps?.label?.ZIndex ?? keycap,
		hint: slotProps?.hint?.ZIndex ?? slotProps?.label?.ZIndex ?? keycap,
	};
}

function resolveGamepadGlyphImage(keyCode: Enum.KeyCode): string | undefined {
	if (!isGamepadKeyCode(keyCode)) {
		return undefined;
	}

	const image = UserInputService.GetImageForKeyCode(keyCode);
	return image === "" ? undefined : image;
}

function resolveGamepadPlatformName(keyCode: Enum.KeyCode): string {
	const platformName = UserInputService.GetStringForKeyCode(keyCode);
	return platformName === "" ? keyCode.Name : platformName;
}

function shouldPreferNativeGamepadGlyph(platformName: string): boolean {
	return PLAYSTATION_FACE_BUTTON_GLYPH_COLORS.has(platformName) || GAMEPAD_SHOULDER_BUTTON_LABELS.has(platformName);
}

function resolveDeviceIconName(
	captureDevice: KeybindCaptureDevice,
	displayDevice: KeybindDisplayDevice | undefined,
	value: Enum.KeyCode,
	capturing: boolean,
): IconName {
	if (displayDevice !== undefined) {
		return DISPLAY_DEVICE_ICON_NAMES[displayDevice];
	}

	const shouldShowGamepadIcon = captureDevice === "gamepad" || (!capturing && isGamepadKeyCode(value));

	return shouldShowGamepadIcon ? "gamepad-2" : "keyboard";
}

function resolveGamepadFaceBadgeStyle(
	keyCode: Enum.KeyCode,
	platformName: string,
	sizeStyles: KeybindInputSizeStyles,
): GamepadBadgeStyle | undefined {
	const faceButtonBadge =
		GAMEPAD_FACE_BUTTON_BADGES.get(platformName) ?? GAMEPAD_FACE_BUTTON_FALLBACK_BADGES.get(keyCode);
	if (faceButtonBadge === undefined) {
		return undefined;
	}

	const badgeSize = math.max(16, sizeStyles.gamepadGlyphSize - 3);

	return {
		label: faceButtonBadge.label,
		backgroundColor: faceButtonBadge.backgroundColor,
		textColor: faceButtonBadge.textColor,
		strokeColor: faceButtonBadge.backgroundColor,
		strokeTransparency: 1,
		strokeThickness: 0,
		size: UDim2.fromOffset(badgeSize, badgeSize),
		radius: new UDim(1, 0),
		fontSize: math.max(11, sizeStyles.fontSize - 3),
	};
}

function resolveGamepadShoulderBadgeStyle(
	keyCode: Enum.KeyCode,
	platformName: string,
	sizeStyles: KeybindInputSizeStyles,
): GamepadBadgeStyle | undefined {
	const shoulderButtonLabel =
		GAMEPAD_SHOULDER_BUTTON_LABELS.get(platformName) ?? GAMEPAD_SHOULDER_BUTTON_FALLBACK_LABELS.get(keyCode);
	if (shoulderButtonLabel === undefined) {
		return undefined;
	}

	const badgeHeight = math.max(16, sizeStyles.gamepadGlyphSize - 7);
	const badgeWidth = badgeHeight + 10;

	return {
		label: shoulderButtonLabel,
		backgroundColor: Color3.fromRGB(24, 28, 34),
		textColor: Color3.fromRGB(245, 249, 255),
		strokeColor: Color3.fromRGB(217, 224, 234),
		strokeTransparency: 0,
		strokeThickness: 1,
		size: UDim2.fromOffset(badgeWidth, badgeHeight),
		radius: new UDim(0, 3),
		fontSize: math.max(10, sizeStyles.fontSize - 6),
	};
}

function resolveGamepadBadgeStyle(
	keyCode: Enum.KeyCode,
	platformName: string,
	sizeStyles: KeybindInputSizeStyles,
): GamepadBadgeStyle | undefined {
	return (
		resolveGamepadFaceBadgeStyle(keyCode, platformName, sizeStyles) ??
		resolveGamepadShoulderBadgeStyle(keyCode, platformName, sizeStyles)
	);
}

function GamepadBadge({ state }: { readonly state: GamepadBadgeRenderState }): React.ReactElement {
	const { badge, font, fontFace, positionOffset, zIndex } = state;

	return (
		<frame
			BackgroundColor3={badge.backgroundColor}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			Position={new UDim2(0.5, positionOffset, 0.5, 0)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={badge.size}
			ZIndex={zIndex}
		>
			{renderCornerDecorator({ radius: badge.radius })}
			{renderStrokeDecorator({
				enabled: badge.strokeThickness > 0,
				color: badge.strokeColor,
				transparency: badge.strokeTransparency,
				thickness: badge.strokeThickness,
			})}
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 1)}
				Text={badge.label}
				TextColor3={badge.textColor}
				TextTransparency={0}
				TextStrokeTransparency={1}
				TextSize={badge.fontSize}
				Font={font}
				FontFace={fontFace}
				LineHeight={1}
				TextWrapped={false}
				TextTruncate={Enum.TextTruncate.None}
				TextXAlignment={Enum.TextXAlignment.Center}
				TextYAlignment={Enum.TextYAlignment.Center}
				ZIndex={incrementZIndex(zIndex, 1)}
			/>
		</frame>
	);
}

function KeybindValueContent({
	contentState,
	layout,
	sizeStyles,
	slotProps,
	colors,
	zIndexes,
}: {
	readonly contentState: KeybindTileContentState;
	readonly layout: KeybindValueLayout;
	readonly sizeStyles: KeybindInputSizeStyles;
	readonly slotProps: KeybindInputSlotProps | undefined;
	readonly colors: KeybindTileColors;
	readonly zIndexes: KeybindTileZIndexes;
}): React.ReactElement {
	const theme = useTheme();
	const gamepadGlyphSlotProps = slotProps?.gamepadGlyph;
	const labelSlotProps = slotProps?.label;
	const hintSlotProps = slotProps?.hint;
	const resolvedLabelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const resolvedHintFont = hintSlotProps?.Font ?? theme.fontFamily;
	const resolvedHintFontFace = resolveTextFontFace(hintSlotProps?.Font, hintSlotProps?.FontFace, theme.fontFamily);
	const gamepadPlatformName = contentState.hasValue ? resolveGamepadPlatformName(contentState.value) : undefined;
	const playStationGlyphColor =
		gamepadPlatformName === undefined ? undefined : PLAYSTATION_FACE_BUTTON_GLYPH_COLORS.get(gamepadPlatformName);
	const shouldUseNativeGamepadGlyph =
		gamepadPlatformName !== undefined && shouldPreferNativeGamepadGlyph(gamepadPlatformName);
	const preferredGamepadGlyphImage =
		shouldUseNativeGamepadGlyph && !contentState.capturing && labelSlotProps?.Text === undefined
			? resolveGamepadGlyphImage(contentState.value)
			: undefined;
	const gamepadBadge =
		preferredGamepadGlyphImage === undefined &&
		gamepadPlatformName !== undefined &&
		!contentState.capturing &&
		labelSlotProps?.Text === undefined
			? resolveGamepadBadgeStyle(contentState.value, gamepadPlatformName, sizeStyles)
			: undefined;
	const gamepadGlyphImage =
		preferredGamepadGlyphImage ??
		(gamepadBadge === undefined && !contentState.capturing && contentState.hasValue
			? resolveGamepadGlyphImage(contentState.value)
			: undefined);
	const shouldRenderGamepadGlyph = gamepadGlyphImage !== undefined && labelSlotProps?.Text === undefined;
	const gamepadGlyphSize = math.max(14, sizeStyles.gamepadGlyphSize - 4);
	const gamepadGlyphColor =
		preferredGamepadGlyphImage === undefined ? colors.labelColor : (playStationGlyphColor ?? colors.labelColor);
	const shouldRenderHint = contentState.hintText !== "" || hintSlotProps?.Text !== undefined;
	const labelHeight = shouldRenderHint ? 0.62 : 1;
	const valueWidthOffset = -(layout.leftTextReserve + layout.rightTextReserve);

	return (
		<React.Fragment>
			{gamepadBadge !== undefined ? (
				<GamepadBadge
					state={{
						badge: gamepadBadge,
						font: resolvedLabelFont,
						fontFace: resolvedLabelFontFace,
						positionOffset: layout.centeredContentOffset,
						zIndex: zIndexes.gamepadGlyph,
					}}
				/>
			) : undefined}
			{shouldRenderGamepadGlyph ? (
				<imagelabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={new UDim2(0.5, layout.centeredContentOffset, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={UDim2.fromOffset(gamepadGlyphSize, gamepadGlyphSize)}
					Image={gamepadGlyphImage}
					ImageColor3={gamepadGlyphSlotProps?.ImageColor3 ?? gamepadGlyphColor}
					ScaleType={Enum.ScaleType.Fit}
					ZIndex={zIndexes.gamepadGlyph}
					{...gamepadGlyphSlotProps}
				/>
			) : undefined}
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={new UDim2(0, layout.leftTextReserve, 0, 0)}
				Size={new UDim2(1, valueWidthOffset, labelHeight, 0)}
				Visible={labelSlotProps?.Visible ?? (gamepadBadge === undefined && !shouldRenderGamepadGlyph)}
				Text={labelSlotProps?.Text ?? contentState.displayText}
				TextColor3={labelSlotProps?.TextColor3 ?? colors.labelColor}
				TextTransparency={labelSlotProps?.TextTransparency ?? colors.labelTransparency}
				TextStrokeTransparency={labelSlotProps?.TextStrokeTransparency ?? 1}
				TextSize={labelSlotProps?.TextSize ?? sizeStyles.fontSize}
				Font={resolvedLabelFont}
				FontFace={resolvedLabelFontFace}
				LineHeight={labelSlotProps?.LineHeight ?? sizeStyles.lineHeight}
				TextWrapped={labelSlotProps?.TextWrapped ?? false}
				TextTruncate={labelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextXAlignment={labelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
				TextYAlignment={
					labelSlotProps?.TextYAlignment ?? (shouldRenderHint ? Enum.TextYAlignment.Bottom : Enum.TextYAlignment.Center)
				}
				TextScaled={labelSlotProps?.TextScaled ?? false}
				RichText={labelSlotProps?.RichText ?? false}
				ZIndex={zIndexes.label}
				{...labelSlotProps}
			/>
			{shouldRenderHint ? (
				<textlabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={new UDim2(0, layout.leftTextReserve, 0.62, 0)}
					Size={new UDim2(1, valueWidthOffset, 0.38, 0)}
					Text={hintSlotProps?.Text ?? contentState.hintText}
					TextColor3={hintSlotProps?.TextColor3 ?? colors.hintColor}
					TextTransparency={hintSlotProps?.TextTransparency ?? colors.hintTransparency}
					TextStrokeTransparency={hintSlotProps?.TextStrokeTransparency ?? 1}
					TextSize={hintSlotProps?.TextSize ?? sizeStyles.hintFontSize}
					Font={resolvedHintFont}
					FontFace={resolvedHintFontFace}
					LineHeight={hintSlotProps?.LineHeight ?? sizeStyles.lineHeight}
					TextWrapped={hintSlotProps?.TextWrapped ?? false}
					TextTruncate={hintSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
					TextXAlignment={hintSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
					TextYAlignment={hintSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Top}
					TextScaled={hintSlotProps?.TextScaled ?? false}
					RichText={hintSlotProps?.RichText ?? false}
					ZIndex={zIndexes.hint}
					{...hintSlotProps}
				/>
			) : undefined}
		</React.Fragment>
	);
}

function KeybindInputTileContent({
	contentState,
	sizeStyles,
	visualStyles,
	slotProps,
	colors,
	zIndexes,
}: {
	readonly contentState: KeybindTileContentState;
	readonly sizeStyles: KeybindInputSizeStyles;
	readonly visualStyles: KeybindInputVisualStyles;
	readonly slotProps: KeybindInputSlotProps | undefined;
	readonly colors: KeybindTileColors;
	readonly zIndexes: KeybindTileZIndexes;
}): React.ReactElement {
	const contentSlotProps = slotProps?.content;
	const deviceFrameSlotProps = slotProps?.deviceFrame;
	const deviceIconSlotProps = slotProps?.deviceIcon;
	const keycapSlotProps = slotProps?.keycap;
	const deviceIconName = resolveDeviceIconName(
		contentState.captureDevice,
		contentState.displayDevice,
		contentState.value,
		contentState.capturing,
	);
	const deviceIconAsset = getLucideIconAsset(deviceIconName, sizeStyles.deviceIconSize);
	const leftTextReserve = sizeStyles.keycapPaddingX + sizeStyles.deviceFrameSize + sizeStyles.gap;
	const rightTextReserve = math.max(leftTextReserve, contentState.clearReserveWidth + sizeStyles.keycapPaddingX);
	const valueLayout: KeybindValueLayout = {
		leftTextReserve,
		rightTextReserve,
		centeredContentOffset: (leftTextReserve - rightTextReserve) / 2,
	};

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0, 0)}
			Size={UDim2.fromScale(1, 1)}
			ZIndex={zIndexes.content}
			{...contentSlotProps}
		>
			<frame
				BackgroundColor3={keycapSlotProps?.BackgroundColor3 ?? colors.keycapBackgroundColor}
				BackgroundTransparency={keycapSlotProps?.BackgroundTransparency ?? visualStyles.keycapBackgroundTransparency}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={zIndexes.keycap}
				{...keycapSlotProps}
			>
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.keycapCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: colors.keycapStrokeColor,
					transparency: colors.keycapStrokeTransparency,
					thickness: colors.keycapStrokeThickness,
					slotProps: slotProps?.keycapStroke,
				})}
				<frame
					BackgroundColor3={deviceFrameSlotProps?.BackgroundColor3 ?? colors.deviceBackgroundColor}
					BackgroundTransparency={
						deviceFrameSlotProps?.BackgroundTransparency ?? visualStyles.deviceBackgroundTransparency
					}
					BorderSizePixel={0}
					Position={new UDim2(0, sizeStyles.keycapPaddingX, 0.5, 0)}
					AnchorPoint={new Vector2(0, 0.5)}
					Size={UDim2.fromOffset(sizeStyles.deviceFrameSize, sizeStyles.deviceFrameSize)}
					ZIndex={zIndexes.deviceFrame}
					{...deviceFrameSlotProps}
				>
					{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.deviceFrameCorner })}
					<imagelabel
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={UDim2.fromOffset(sizeStyles.deviceIconSize, sizeStyles.deviceIconSize)}
						Image={deviceIconAsset?.Url}
						ImageRectSize={deviceIconAsset?.ImageRectSize}
						ImageRectOffset={deviceIconAsset?.ImageRectOffset}
						ImageColor3={deviceIconSlotProps?.ImageColor3 ?? colors.deviceIconColor}
						ScaleType={Enum.ScaleType.Fit}
						ZIndex={zIndexes.deviceIcon}
						{...deviceIconSlotProps}
					/>
				</frame>
				<KeybindValueContent
					contentState={contentState}
					layout={valueLayout}
					sizeStyles={sizeStyles}
					slotProps={slotProps}
					colors={colors}
					zIndexes={zIndexes}
				/>
			</frame>
		</frame>
	);
}

const KeybindInputBase = React.forwardRef<TextButton, KeybindInputProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		variant = "outline",
		color = "primary",
		size = "md",
		disabled = false,
		readOnly = false,
		fullWidth = false,
		styleOverrides,
		placeholder = "—",
		captureLabel = "Press a key...",
		clearable = true,
		displayDevice,
		value,
		defaultValue = Enum.KeyCode.Unknown,
		onChange,
		captureDevice = "both",
		cancelKeyCodes = DEFAULT_CANCEL_KEY_CODES,
		allowedKeyCodes,
		blockedKeyCodes,
		onCaptureStart,
		onCaptureCancel,
		onCaptureEnd,
		onCapturingChange,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const [pressed, setPressed] = React.useState(false);
	const [capturing, setCapturing] = React.useState(false);
	const [uncontrolledValue, setUncontrolledValue] = React.useState(value ?? defaultValue);
	const valueRef = React.useRef(value ?? defaultValue);
	const capturingRef = React.useRef(false);
	const triggerInstanceRef = React.useRef<TextButton>();
	// ButtonA emits Activated after InputBegan; remember the exact press when capture already consumed it.
	const suppressedActivationInputRef = React.useRef<InputObject>();
	const disabledRef = React.useRef(disabled);
	const readOnlyRef = React.useRef(readOnly);
	const clearableRef = React.useRef(clearable);
	const captureDeviceRef = React.useRef(captureDevice);
	const cancelKeyCodesRef = React.useRef<readonly Enum.KeyCode[]>(cancelKeyCodes);
	const allowedKeyCodesRef = React.useRef(allowedKeyCodes);
	const blockedKeyCodesRef = React.useRef(blockedKeyCodes);
	const onChangeRef = React.useRef(onChange);
	const onCaptureStartRef = React.useRef(onCaptureStart);
	const onCaptureCancelRef = React.useRef(onCaptureCancel);
	const onCaptureEndRef = React.useRef(onCaptureEnd);
	const onCapturingChangeRef = React.useRef(onCapturingChange);
	const sizeStyles = resolveKeybindInputSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps(
		{
			cursor: "pointer",
		},
		props,
	);
	const {
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hasPadding,
	} = useResolvedStyleProps("keybindInput", mergedStyleProps);

	React.useEffect(() => {
		if (value !== undefined) {
			setUncontrolledValue(value);
		}
	}, [value]);

	React.useEffect(() => {
		valueRef.current = value ?? uncontrolledValue;
	}, [uncontrolledValue, value]);

	React.useEffect(() => {
		disabledRef.current = disabled;
		readOnlyRef.current = readOnly;
		clearableRef.current = clearable;
		captureDeviceRef.current = captureDevice;
		cancelKeyCodesRef.current = cancelKeyCodes;
		allowedKeyCodesRef.current = allowedKeyCodes;
		blockedKeyCodesRef.current = blockedKeyCodes;
		onChangeRef.current = onChange;
		onCaptureStartRef.current = onCaptureStart;
		onCaptureCancelRef.current = onCaptureCancel;
		onCaptureEndRef.current = onCaptureEnd;
		onCapturingChangeRef.current = onCapturingChange;
	}, [
		allowedKeyCodes,
		blockedKeyCodes,
		cancelKeyCodes,
		captureDevice,
		clearable,
		disabled,
		onCaptureCancel,
		onCaptureEnd,
		onCaptureStart,
		onCapturingChange,
		onChange,
		readOnly,
	]);

	const setCapturingState = React.useCallback((nextCapturing: boolean) => {
		capturingRef.current = nextCapturing;
		setCapturing(nextCapturing);
		onCapturingChangeRef.current?.(nextCapturing);
	}, []);
	const commitValue = React.useCallback(
		(nextValue: Enum.KeyCode) => {
			if (value === undefined) {
				setUncontrolledValue(nextValue);
			}

			valueRef.current = nextValue;
			onChangeRef.current?.(nextValue);
		},
		[value],
	);
	const cancelCapture = React.useCallback(() => {
		if (!capturingRef.current) {
			return;
		}

		setCapturingState(false);
		onCaptureCancelRef.current?.();
	}, [setCapturingState]);
	const finishCaptureWithCurrentValue = React.useCallback(() => {
		if (!capturingRef.current) {
			return;
		}

		const currentValue = valueRef.current;
		setCapturingState(false);
		onCaptureEndRef.current?.(currentValue);
	}, [setCapturingState]);
	const startCapture = React.useCallback(() => {
		if (disabledRef.current || readOnlyRef.current) {
			return;
		}

		if (capturingRef.current) {
			finishCaptureWithCurrentValue();
			return;
		}

		setCapturingState(true);
		onCaptureStartRef.current?.();
	}, [finishCaptureWithCurrentValue, setCapturingState]);
	const clearValue = React.useCallback(() => {
		if (disabledRef.current || readOnlyRef.current) {
			return;
		}

		commitValue(Enum.KeyCode.Unknown);
		onCaptureEndRef.current?.(Enum.KeyCode.Unknown);
		setCapturingState(false);
	}, [commitValue, setCapturingState]);
	const suppressCaptureEndingActivation = React.useCallback((input: InputObject) => {
		const triggerInstance = triggerInstanceRef.current;
		if (
			input.KeyCode === Enum.KeyCode.ButtonA &&
			triggerInstance !== undefined &&
			GuiService.SelectedObject === triggerInstance
		) {
			suppressedActivationInputRef.current = input;
		}
	}, []);

	React.useEffect(() => {
		if (!disabled && !readOnly) {
			return;
		}

		setHovered(false);
		setPressed(false);
		if (capturingRef.current) {
			setCapturingState(false);
			onCaptureCancelRef.current?.();
		}
	}, [disabled, readOnly, setCapturingState]);

	React.useEffect(() => {
		if (!capturing) {
			return;
		}

		const connection = UserInputService.InputBegan.Connect((input) => {
			if (!capturingRef.current || disabledRef.current || readOnlyRef.current) {
				return;
			}

			const keyCode = input.KeyCode;
			if (containsKeyCode(cancelKeyCodesRef.current, keyCode)) {
				suppressCaptureEndingActivation(input);
				cancelCapture();
				return;
			}

			if (keyCode === Enum.KeyCode.Backspace || keyCode === Enum.KeyCode.Delete) {
				suppressCaptureEndingActivation(input);
				if (clearableRef.current) {
					clearValue();
				} else {
					cancelCapture();
				}
				return;
			}

			if (!isDeviceAllowed(input, captureDeviceRef.current)) {
				return;
			}

			if (!isAllowedKeyCode(keyCode, allowedKeyCodesRef.current, blockedKeyCodesRef.current)) {
				return;
			}

			suppressCaptureEndingActivation(input);
			commitValue(keyCode);
			setCapturingState(false);
			onCaptureEndRef.current?.(keyCode);
		});

		return () => {
			connection.Disconnect();
		};
	}, [cancelCapture, capturing, clearValue, commitValue, setCapturingState, suppressCaptureEndingActivation]);

	const rootSlotProps = slotProps?.root;
	const triggerSlotProps = slotProps?.trigger;
	const contentSlotProps = slotProps?.content;
	const deviceFrameSlotProps = slotProps?.deviceFrame;
	const deviceIconSlotProps = slotProps?.deviceIcon;
	const keycapSlotProps = slotProps?.keycap;
	const gamepadGlyphSlotProps = slotProps?.gamepadGlyph;
	const currentValue = value ?? uncontrolledValue;
	const hasValue = currentValue !== Enum.KeyCode.Unknown;
	const displayText = capturing ? captureLabel : hasValue ? resolveKeyCodeLabel(currentValue) : placeholder;
	const hintText = "";
	const interactionState = resolveKeybindInteractionState(disabled, readOnly, capturing, pressed, hovered);
	const styleOverrideContext = { theme, variant, color, size, state: interactionState, hasValue };
	const visualStyles = applyStyleOverride(
		resolveKeybindInputVisualStyles(theme, variant, color, interactionState, hasValue),
		styleOverrides,
		styleOverrideContext,
	);
	const animated = useMotion({
		values: {
			backgroundColor: visualStyles.backgroundColor,
			strokeColor: visualStyles.strokeColor,
			strokeTransparency: visualStyles.strokeTransparency,
			strokeThickness: visualStyles.strokeThickness,
			labelColor: visualStyles.labelColor,
			hintColor: visualStyles.hintColor,
			deviceBackgroundColor: visualStyles.deviceBackgroundColor,
			deviceIconColor: visualStyles.deviceIconColor,
			keycapBackgroundColor: visualStyles.keycapBackgroundColor,
			keycapStrokeColor: visualStyles.keycapStrokeColor,
			keycapStrokeTransparency: visualStyles.keycapStrokeTransparency,
			keycapStrokeThickness: visualStyles.keycapStrokeThickness,
		},
		transition: resolveKeybindInputMotionTransition(interactionState),
	});
	const computedLayout = resolveKeybindComputedLayout(
		fullWidth,
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedConstraint,
		sizeStyles,
	);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedZIndexes = resolveKeybindTileZIndexes(slotProps, resolvedRootZIndex);
	const clearReserveWidth = 0;
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(
		decoratorChildren,
		renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.triggerCorner }),
	);
	pushDecorator(
		decoratorChildren,
		renderStrokeDecorator({
			enabled: slotProps?.triggerStroke !== undefined,
			color: animated.strokeColor,
			transparency: animated.strokeTransparency,
			thickness: animated.strokeThickness,
			slotProps: slotProps?.triggerStroke,
		}),
	);
	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({
			enabled: hasPadding,
			paddingTop,
			paddingRight,
			paddingBottom,
			paddingLeft,
			slotProps: slotProps?.triggerPadding,
		}),
	);
	pushDecorator(
		decoratorChildren,
		renderSizeConstraintDecorator({ constraint: computedLayout.constraint, slotProps: slotProps?.sizeConstraint }),
	);

	const rootEvent = useRootCursorEvent<NonNullable<FrameEventMap>>(
		undefined,
		rootSlotProps?.Event === undefined ? props.cursor : undefined,
		disabled,
	);
	const internalTriggerEvent: TextButtonEventMap = {
		MouseEnter: () => {
			if (!disabled && !readOnly) {
				setHovered(true);
			}
		},
		MouseLeave: () => {
			setHovered(false);
			setPressed(false);
		},
		InputBegan: (_button, input) => {
			if (!disabled && !readOnly && isPressInput(input)) {
				setPressed(true);
			}
		},
		InputEnded: (_button, input) => {
			if (isPressInput(input)) {
				setPressed(false);
			}
		},
		Activated: (_button, input) => {
			const suppressedInput = suppressedActivationInputRef.current;
			suppressedActivationInputRef.current = undefined;
			if (suppressedInput === input) {
				return;
			}

			startCapture();
		},
	};
	const triggerEvent = useRootCursorEvent(
		composeEventMaps(internalTriggerEvent, Event),
		triggerSlotProps?.Event === undefined ? (props.cursor ?? "pointer") : undefined,
		disabled || readOnly,
	);
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: 1,
		Size: computedLayout.size,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: resolvedRootZIndex,
		Event: rootEvent,
	};
	const triggerInstanceProps: Partial<React.InstanceProps<TextButton>> = {
		AutoButtonColor: false,
		Active: !disabled && !readOnly,
		...resolveSelectionProps(props, !disabled),
		BackgroundColor3: animated.backgroundColor,
		BackgroundTransparency: 1,
		BorderSizePixel: 0,
		Size: UDim2.fromScale(1, 1),
		Text: "",
		TextTransparency: 1,
		TextStrokeTransparency: 1,
		ZIndex: resolvedZIndexes.trigger,
		Event: triggerEvent,
		Change,
	};
	const setTriggerRef = React.useCallback(
		(instance: TextButton | undefined) => {
			triggerInstanceRef.current = instance;
			assignRef(ref, instance);
		},
		[ref],
	);

	return (
		<frame {...rootInstanceProps} {...rootSlotProps}>
			<textbutton {...triggerInstanceProps} {...triggerSlotProps} ref={setTriggerRef}>
				{decoratorChildren}
				<KeybindInputTileContent
					contentState={{
						displayText,
						hintText,
						value: currentValue,
						captureDevice,
						displayDevice,
						capturing,
						hasValue,
						clearReserveWidth,
					}}
					sizeStyles={sizeStyles}
					visualStyles={visualStyles}
					slotProps={slotProps}
					colors={{
						labelColor: animated.labelColor,
						labelTransparency: visualStyles.labelTransparency,
						hintColor: animated.hintColor,
						hintTransparency: visualStyles.hintTransparency,
						deviceBackgroundColor: animated.deviceBackgroundColor,
						deviceIconColor: animated.deviceIconColor,
						keycapBackgroundColor: animated.keycapBackgroundColor,
						keycapStrokeColor: animated.keycapStrokeColor,
						keycapStrokeTransparency: animated.keycapStrokeTransparency,
						keycapStrokeThickness: animated.keycapStrokeThickness,
					}}
					zIndexes={resolvedZIndexes}
				/>
			</textbutton>
		</frame>
	);
});

export const KeybindInput = KeybindInputBase as KeybindInputComponent;

KeybindInput.displayName = "KeybindInput";
