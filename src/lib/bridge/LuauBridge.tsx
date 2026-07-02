import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { Backdrop } from "../components/Backdrop";
import type { BackdropExcludeRect } from "../components/Backdrop";
import { Box } from "../components/Box";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Divider } from "../components/Divider";
import { Draggable } from "../components/Draggable";
import type { DraggableItem } from "../components/Draggable";
import { Icon } from "../components/Icon";
import { Image } from "../components/Image";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { Popover } from "../components/Popover";
import type { PopoverAlign, PopoverPlacement, PopoverTriggerMode } from "../components/Popover";
import { Pressable } from "../components/Pressable";
import { ScrollArea } from "../components/ScrollArea";
import { SegmentedControl } from "../components/SegmentedControl";
import { Select } from "../components/Select";
import { Slider } from "../components/Slider";
import { Stack } from "../components/Stack";
import { StepperInput } from "../components/StepperInput";
import { Switch } from "../components/Switch";
import { Text } from "../components/Text";
import { Tooltip } from "../components/Tooltip";
import { ThemeProvider, theme as themeRefs } from "@prism/theme";
import type { ConcreteColorValue, SemanticIntent, ThemeOverride, ThemeSize, Variant } from "@prism/theme";
import { isDevMode } from "@prism/utils";
import type { SizeValue, SizeValue2D } from "@prism/utils";
import type { SharedCursorValue } from "../components/_shared/useResolvedStyleProps";
import type { SegmentedControlOption } from "../components/SegmentedControl";
import type { SelectOption } from "../components/Select";

type LuauProps = Record<string, unknown>;
type BridgeColorValue = ConcreteColorValue;
type BridgeSizeValue = SizeValue;
type BridgeSizeValue2D = SizeValue2D;
type BridgeCursorValue = SharedCursorValue;

interface BridgeDraggableItem extends DraggableItem {
	readonly label: string;
}

export interface PrismLuauNode {
	readonly component: string;
	readonly props?: LuauProps;
	readonly children?: PrismLuauNode | readonly PrismLuauNode[];
}

export interface PrismLuauMountHandle {
	readonly update: (tree: PrismLuauNode) => void;
	readonly destroy: () => void;
}

function readProps(node: PrismLuauNode): LuauProps {
	return node.props ?? {};
}

function readString(props: LuauProps, key: string, fallback?: string): string | undefined {
	const value = props[key];
	return typeIs(value, "string") ? value : fallback;
}

function readStringOrNumber(props: LuauProps, key: string): string | number | undefined {
	const value = props[key];
	return typeIs(value, "string") || typeIs(value, "number") ? value : undefined;
}

function readNumber(props: LuauProps, key: string): number | undefined {
	const value = props[key];
	return typeIs(value, "number") ? value : undefined;
}

function readThemeSize(props: LuauProps, key: string, fallback?: ThemeSize): ThemeSize | undefined {
	const value = readString(props, key, fallback);
	switch (value) {
		case "xs":
		case "sm":
		case "md":
		case "lg":
		case "xl":
			return value;
		default:
			return fallback;
	}
}

function readVariant(props: LuauProps, key: string, fallback?: Variant): Variant | undefined {
	const value = readString(props, key, fallback);
	switch (value) {
		case "filled":
		case "light":
		case "outline":
		case "subtle":
			return value;
		default:
			return fallback;
	}
}

function readIntent(props: LuauProps, key: string, fallback?: SemanticIntent): SemanticIntent | undefined {
	const value = readString(props, key, fallback);
	switch (value) {
		case "primary":
		case "secondary":
		case "success":
		case "warning":
		case "error":
		case "info":
			return value;
		default:
			return fallback;
	}
}

function readCursor(props: LuauProps, key: string): BridgeCursorValue | undefined {
	const value = readString(props, key);
	switch (value) {
		case "default":
		case "pointer":
		case "grab":
		case "grabbing":
		case "resize-ew":
		case "resize-ns":
		case "resize-nesw":
		case "resize-nwse":
		case "resize-all":
		case "split-ew":
		case "split-ns":
		case "forbidden":
		case "wait":
		case "busy":
		case "crosshair":
			return value;
		default:
			return value !== undefined && string.sub(value, 1, 11) === "rbxasset://" ? value as `rbxasset://${string}` : undefined;
	}
}

function readDividerOrientation(props: LuauProps): "horizontal" | "vertical" | undefined {
	const value = readString(props, "orientation");
	return value === "horizontal" || value === "vertical" ? value : undefined;
}

function readCardVariant(props: LuauProps): "surface" | "outline" | "subtle" | "elevated" | undefined {
	const value = readString(props, "variant");
	switch (value) {
		case "surface":
		case "outline":
		case "subtle":
		case "elevated":
			return value;
		default:
			return undefined;
	}
}

function readIconName(props: LuauProps): "alert-circle" | "check" | "chevron-right" | "info" | "search" | "server" | "settings" | "x" {
	const value = readString(props, "name", "settings");
	switch (value) {
		case "alert-circle":
		case "check":
		case "chevron-right":
		case "info":
		case "search":
		case "server":
		case "settings":
		case "x":
			return value;
		default:
			return "settings";
	}
}

function readModalSize(props: LuauProps): "sm" | "md" | "lg" | "xl" {
	const value = readString(props, "size", "sm");
	switch (value) {
		case "sm":
		case "md":
		case "lg":
		case "xl":
			return value;
		default:
			return "sm";
	}
}

function readScrollAreaDirection(props: LuauProps): "vertical" | "horizontal" | "both" | undefined {
	const value = readString(props, "direction");
	switch (value) {
		case "vertical":
		case "horizontal":
		case "both":
			return value;
		default:
			return undefined;
	}
}

function readPopoverPlacement(props: LuauProps): PopoverPlacement | undefined {
	const value = readString(props, "placement");
	switch (value) {
		case "top":
		case "bottom":
		case "left":
		case "right":
			return value;
		default:
			return undefined;
	}
}

function readPopoverAlign(props: LuauProps): PopoverAlign | undefined {
	const value = readString(props, "align");
	switch (value) {
		case "start":
		case "center":
		case "end":
			return value;
		default:
			return undefined;
	}
}

function readPopoverTriggerMode(props: LuauProps): PopoverTriggerMode | undefined {
	const value = readString(props, "triggerMode");
	switch (value) {
		case "click":
		case "hover":
		case "manual":
			return value;
		default:
			return undefined;
	}
}

function readStackDirection(props: LuauProps): "vertical" | "horizontal" | undefined {
	const value = readString(props, "direction");
	return value === "vertical" || value === "horizontal" ? value : undefined;
}

function readStackAlign(props: LuauProps): "start" | "center" | "end" | "stretch" | undefined {
	const value = readString(props, "align");
	switch (value) {
		case "start":
		case "center":
		case "end":
		case "stretch":
			return value;
		default:
			return undefined;
	}
}

function readStackJustify(props: LuauProps): "start" | "center" | "end" | "fill" | "spaceAround" | "spaceBetween" | "spaceEvenly" | undefined {
	const value = readString(props, "justify");
	switch (value) {
		case "start":
		case "center":
		case "end":
		case "fill":
		case "spaceAround":
		case "spaceBetween":
		case "spaceEvenly":
			return value;
		default:
			return undefined;
	}
}

function readTextAlign(props: LuauProps): "left" | "center" | "right" | undefined {
	const value = readString(props, "align");
	switch (value) {
		case "left":
		case "center":
		case "right":
			return value;
		default:
			return undefined;
	}
}

function readTextVerticalAlign(props: LuauProps): "top" | "middle" | "bottom" | undefined {
	const value = readString(props, "valign");
	switch (value) {
		case "top":
		case "middle":
		case "bottom":
			return value;
		default:
			return undefined;
	}
}

function readTextTruncate(props: LuauProps): "none" | "atend" | "splitword" | undefined {
	const value = readString(props, "truncate");
	switch (value) {
		case "none":
		case "atend":
		case "splitword":
			return value;
		default:
			return undefined;
	}
}

function readAutomaticCanvasSize(props: LuauProps): Enum.AutomaticSize | undefined {
	const value = props.automaticCanvasSize;
	if (value === Enum.AutomaticSize.None || value === Enum.AutomaticSize.X || value === Enum.AutomaticSize.Y || value === Enum.AutomaticSize.XY) {
		return value as Enum.AutomaticSize;
	}

	return undefined;
}

function readBackdropExcludeRect(props: LuauProps): BackdropExcludeRect | undefined {
	const value = props.excludeRect;
	if (!typeIs(value, "table")) {
		return undefined;
	}

	const rectProps = value as LuauProps;
	const position = readUDim2(rectProps, "position");
	const size = readUDim2(rectProps, "size");
	if (position === undefined || size === undefined) {
		return undefined;
	}

	return {
		position,
		size,
		anchor: readVector2(rectProps, "anchor"),
	};
}

function readScaleType(props: LuauProps): Enum.ScaleType | undefined {
	const value = props.scaleType;
	if (
		value === Enum.ScaleType.Fit ||
		value === Enum.ScaleType.Crop ||
		value === Enum.ScaleType.Stretch ||
		value === Enum.ScaleType.Slice ||
		value === Enum.ScaleType.Tile
	) {
		return value as Enum.ScaleType;
	}

	return undefined;
}

function readResampleMode(props: LuauProps): Enum.ResamplerMode | undefined {
	const value = props.resampleMode;
	if (value === Enum.ResamplerMode.Default || value === Enum.ResamplerMode.Pixelated) {
		return value as Enum.ResamplerMode;
	}

	return undefined;
}

function readSizeValue(props: LuauProps, key: string): BridgeSizeValue | undefined {
	const value = props[key];
	if (typeIs(value, "number") || typeIs(value, "string") || typeOf(value) === "UDim") {
		return value as BridgeSizeValue;
	}

	return undefined;
}

function readSizeValue2D(props: LuauProps, key: string): BridgeSizeValue2D | undefined {
	const value = props[key];
	if (typeOf(value) === "UDim2") {
		return value as BridgeSizeValue2D;
	}

	return undefined;
}

function readColor(props: LuauProps, key: string, fallback?: BridgeColorValue): BridgeColorValue | undefined {
	const value = props[key];
	if (typeIs(value, "Color3")) {
		return value;
	}

	return fallback;
}

function readStrokeProps(props: LuauProps): { readonly color?: BridgeColorValue; readonly thickness?: number; readonly transparency?: number; readonly mode?: Enum.ApplyStrokeMode } | undefined {
	const value = props.stroke;
	if (!typeIs(value, "table")) {
		return undefined;
	}

	const strokeProps = value as LuauProps;
	const mode = strokeProps.mode;
	return {
		color: readColor(strokeProps, "color"),
		thickness: readNumber(strokeProps, "thickness"),
		transparency: readNumber(strokeProps, "transparency"),
		mode: mode === Enum.ApplyStrokeMode.Border || mode === Enum.ApplyStrokeMode.Contextual ? (mode as Enum.ApplyStrokeMode) : undefined,
	};
}

function readBoolean(props: LuauProps, key: string, fallback?: boolean): boolean | undefined {
	const value = props[key];
	return typeIs(value, "boolean") ? value : fallback;
}

function readUDim2(props: LuauProps, key: string): UDim2 | undefined {
	const value = props[key];
	return typeOf(value) === "UDim2" ? (value as UDim2) : undefined;
}

function readVector2(props: LuauProps, key: string): Vector2 | undefined {
	const value = props[key];
	return typeOf(value) === "Vector2" ? (value as Vector2) : undefined;
}

function readRect(props: LuauProps, key: string): Rect | undefined {
	const value = props[key];
	return typeOf(value) === "Rect" ? (value as Rect) : undefined;
}

function readCallback(props: LuauProps, key: string): (() => void) | undefined {
	const value = props[key];
	return typeOf(value) === "function" ? (value as () => void) : undefined;
}

function readBooleanCallback(props: LuauProps, key: string): ((value: boolean) => void) | undefined {
	const value = props[key];
	return typeOf(value) === "function" ? (value as (value: boolean) => void) : undefined;
}

function readNumberCallback(props: LuauProps, key: string): ((value: number) => void) | undefined {
	const value = props[key];
	return typeOf(value) === "function" ? (value as (value: number) => void) : undefined;
}

function readStringCallback(props: LuauProps, key: string): ((value: string) => void) | undefined {
	const value = props[key];
	return typeOf(value) === "function" ? (value as (value: string) => void) : undefined;
}

function readStringArrayCallback(props: LuauProps, key: string): ((value: readonly string[]) => void) | undefined {
	const value = props[key];
	return typeOf(value) === "function" ? (value as (value: readonly string[]) => void) : undefined;
}

function readSlotProps(props: LuauProps): LuauProps | undefined {
	const value = props.slotProps;
	if (!typeIs(value, "table")) {
		return undefined;
	}

	const slots: LuauProps = {};
	for (const [slotName, slotValue] of pairs(value as LuauProps)) {
		if (typeIs(slotName, "string") && typeOf(slotValue) === "table") {
			slots[slotName] = slotValue;
		}
	}

	return slots;
}

function readSelectOptions(props: LuauProps): readonly SelectOption[] {
	const value = props.options;
	if (!typeIs(value, "table")) {
		return [];
	}

	const options: SelectOption[] = [];
	for (const option of value as readonly unknown[]) {
		if (!typeIs(option, "table")) {
			continue;
		}

		const optionProps = option as LuauProps;
		const optionValue = readString(optionProps, "value");
		const label = readString(optionProps, "label", optionValue);
		if (optionValue === undefined || label === undefined) {
			continue;
		}

		options.push({ value: optionValue, label, disabled: readBoolean(optionProps, "disabled") });
	}

	return options;
}

function readSegmentedControlOptions(props: LuauProps): readonly SegmentedControlOption[] {
	return readSelectOptions(props);
}

function readStringArray(props: LuauProps, key: string): readonly string[] | undefined {
	const value = props[key];
	if (!typeIs(value, "table")) {
		return undefined;
	}

	const result: string[] = [];
	for (const entry of value as readonly unknown[]) {
		if (typeIs(entry, "string")) {
			result.push(entry);
		}
	}

	return result;
}

function readDraggableItems(props: LuauProps): readonly BridgeDraggableItem[] {
	const value = props.items;
	if (!typeIs(value, "table")) {
		return [];
	}

	const items: BridgeDraggableItem[] = [];
	for (const entry of value as readonly unknown[]) {
		if (!typeIs(entry, "table")) {
			continue;
		}

		const itemProps = entry as LuauProps;
		const id = readString(itemProps, "id");
		const label = readString(itemProps, "label", id);
		if (id === undefined || label === undefined) {
			continue;
		}

		items.push({
			id,
			label,
			disabled: readBoolean(itemProps, "disabled"),
		});
	}

	return items;
}

function warnUnknownComponent(component: string): void {
	if (isDevMode()) {
		warn(`[prism/bridge] Unknown component '${component}'. Rendering an empty fragment.`);
	}
}

function renderChildren(children: PrismLuauNode | readonly PrismLuauNode[] | undefined): React.ReactNode {
	if (children === undefined) {
		return undefined;
	}

	if (typeIs(children, "table") && "component" in children) {
		return renderNode(children as PrismLuauNode, "child");
	}

	const renderedChildren: React.ReactElement[] = [];
	let childIndex = 0;
	for (const child of children as readonly PrismLuauNode[]) {
		childIndex += 1;
		renderedChildren.push(renderNode(child, tostring(childIndex)));
	}

	return renderedChildren;
}

function renderNode(node: PrismLuauNode, key = "root"): React.ReactElement {
	const props = readProps(node);
	const children = renderChildren(node.children);

		switch (node.component) {
			case "Backdrop":
			return (
				<Backdrop
					key={key}
					visible={readBoolean(props, "visible")}
					color={readColor(props, "color")}
					opacity={readNumber(props, "opacity")}
					zIndex={readNumber(props, "zIndex")}
					active={readBoolean(props, "active")}
					excludeRect={readBackdropExcludeRect(props)}
					cursor={readCursor(props, "cursor")}
					onPress={readCallback(props, "onPress")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Box":
			return (
				<Box
					key={key}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					center={readBoolean(props, "center")}
					p={readStringOrNumber(props, "p")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					clip={readBoolean(props, "clip")}
					cursor={readCursor(props, "cursor")}
					border={readNumber(props, "border")}
					borderColor={readColor(props, "borderColor")}
					stroke={readStrokeProps(props)}
					radius={readStringOrNumber(props, "radius") as ThemeSize | number | undefined}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Box>
			);
		case "Button":
			return (
				<Button
					key={key}
					label={readStringOrNumber(props, "label")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readUDim2(props, "position")}
					anchor={readVector2(props, "anchor")}
					variant={readVariant(props, "variant", "subtle")}
					color={readIntent(props, "color", "secondary")}
					size={readThemeSize(props, "size")}
					disabled={readBoolean(props, "disabled")}
					fullWidth={readBoolean(props, "fullWidth")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					onPress={readCallback(props, "onPress")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Button>
			);
		case "Card":
			return (
				<Card
					key={key}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					center={readBoolean(props, "center")}
					p={readStringOrNumber(props, "p")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					variant={readCardVariant(props)}
					border={readNumber(props, "border")}
					borderColor={readColor(props, "borderColor")}
					radius={readStringOrNumber(props, "radius") as ThemeSize | number | undefined}
					shadow={readThemeSize(props, "shadow")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Card>
			);
			case "Divider":
				return (
					<Divider
					key={key}
					orientation={readDividerOrientation(props)}
					color={readColor(props, "color")}
					size={readStringOrNumber(props, "size") as ThemeSize | number | undefined}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					cursor={readCursor(props, "cursor")}
					slotProps={readSlotProps(props)}
					/>
				);
		case "Draggable": {
			const draggableItems = readDraggableItems(props);
			return (
				<Draggable
					key={key}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					center={readBoolean(props, "center")}
					p={readStringOrNumber(props, "p")}
					px={readStringOrNumber(props, "px")}
					py={readStringOrNumber(props, "py")}
					pt={readStringOrNumber(props, "pt")}
					pr={readStringOrNumber(props, "pr")}
					pb={readStringOrNumber(props, "pb")}
					pl={readStringOrNumber(props, "pl")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					clip={readBoolean(props, "clip")}
					cursor={readCursor(props, "cursor")}
					gap={readStringOrNumber(props, "gap")}
					direction={readStackDirection(props)}
					align={readStackAlign(props)}
					justify={readStackJustify(props)}
					disabled={readBoolean(props, "disabled")}
					active={readBoolean(props, "active")}
					items={draggableItems}
					value={readStringArray(props, "value")}
					defaultValue={readStringArray(props, "defaultValue")}
					onReorder={readStringArrayCallback(props, "onReorder")}
					renderItem={(state) => (
						<Box
							width={state.item.label.size() > 14 ? 180 : 144}
							bg={state.disabled ? themeRefs.action.disabledBackground : state.dragging ? themeRefs.primary.light : themeRefs.background.surface}
							radius="md"
							borderColor={state.dragging ? themeRefs.primary.main : themeRefs.border.default}
							p="sm"
						>
							<Text text={state.item.label} color={state.disabled ? themeRefs.text.disabled : themeRefs.text.primary} wrap width="100%" />
						</Box>
					)}
				/>
			);
		}
			case "Fragment":
				return <React.Fragment key={key}>{children}</React.Fragment>;
		case "Icon":
			return (
				<Icon
					key={key}
					name={readIconName(props)}
					size={readStringOrNumber(props, "size") as ThemeSize | number | undefined}
						color={readColor(props, "color", themeRefs.text.inverse)}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Image":
			return (
				<Image
					key={key}
					src={readString(props, "src") ?? ""}
					color={readColor(props, "color")}
					transparency={readNumber(props, "transparency")}
					scaleType={readScaleType(props)}
					imageRectOffset={readVector2(props, "imageRectOffset")}
					imageRectSize={readVector2(props, "imageRectSize")}
					resampleMode={readResampleMode(props)}
					sliceCenter={readRect(props, "sliceCenter")}
					sliceScale={readNumber(props, "sliceScale")}
					tileSize={readUDim2(props, "tileSize")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					center={readBoolean(props, "center")}
					p={readStringOrNumber(props, "p")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					clip={readBoolean(props, "clip")}
					border={readNumber(props, "border")}
					borderColor={readColor(props, "borderColor")}
					radius={readStringOrNumber(props, "radius") as ThemeSize | number | undefined}
					aspectRatio={readNumber(props, "aspectRatio")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Image>
			);
		case "Input":
			return (
				<Input
					key={key}
					value={readString(props, "value")}
					defaultValue={readString(props, "defaultValue")}
					placeholder={readString(props, "placeholder")}
					variant={readVariant(props, "variant")}
					color={readIntent(props, "color")}
					size={readThemeSize(props, "size")}
					disabled={readBoolean(props, "disabled")}
					readOnly={readBoolean(props, "readOnly")}
					fullWidth={readBoolean(props, "fullWidth")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					onChange={readStringCallback(props, "onChange")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Modal":
			return (
				<Modal
					key={key}
					opened={readBoolean(props, "opened", false) ?? false}
					onClose={readCallback(props, "onClose") ?? (() => undefined)}
					title={readString(props, "title", "Settings")}
					size={readModalSize(props)}
					withCloseButton={readBoolean(props, "withCloseButton", true)}
					zIndex={readNumber(props, "zIndex")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Modal>
			);
		case "Pressable":
			return (
				<Pressable
					key={key}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					center={readBoolean(props, "center")}
					p={readStringOrNumber(props, "p")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					clip={readBoolean(props, "clip")}
					cursor={readCursor(props, "cursor")}
					disabled={readBoolean(props, "disabled")}
					active={readBoolean(props, "active")}
					onPress={readCallback(props, "onPress")}
				>
					{children}
				</Pressable>
			);
		case "ScrollArea":
			return (
				<ScrollArea
					key={key}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					p={readStringOrNumber(props, "p")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					direction={readScrollAreaDirection(props)}
					scrollbarSize={readNumber(props, "scrollbarSize")}
					scrollbarColor={readColor(props, "scrollbarColor")}
					scrollbarTransparency={readNumber(props, "scrollbarTransparency")}
					canvasSize={readUDim2(props, "canvasSize")}
					canvasPosition={readVector2(props, "canvasPosition")}
					automaticCanvasSize={readAutomaticCanvasSize(props)}
					scrollingEnabled={readBoolean(props, "scrollingEnabled")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</ScrollArea>
			);
		case "Select":
			return (
				<Select
					key={key}
					options={readSelectOptions(props)}
					value={readString(props, "value")}
					defaultValue={readString(props, "defaultValue")}
					placeholder={readString(props, "placeholder")}
					variant={readVariant(props, "variant")}
					color={readIntent(props, "color")}
					size={readThemeSize(props, "size")}
					disabled={readBoolean(props, "disabled")}
					fullWidth={readBoolean(props, "fullWidth")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					maxVisibleOptions={readNumber(props, "maxVisibleOptions")}
					onChange={readStringCallback(props, "onChange")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Popover":
			return (
				<Popover
					key={key}
					content={readStringOrNumber(props, "content")}
					placement={readPopoverPlacement(props)}
					align={readPopoverAlign(props)}
					triggerMode={readPopoverTriggerMode(props)}
					disabled={readBoolean(props, "disabled")}
					opened={readBoolean(props, "opened")}
					defaultOpened={readBoolean(props, "defaultOpened")}
					closeOnOutsidePress={readBoolean(props, "closeOnOutsidePress")}
					gap={readNumber(props, "gap")}
					offset={readVector2(props, "offset")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					cursor={readCursor(props, "cursor")}
					onOpenedChange={readBooleanCallback(props, "onOpenedChange")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Popover>
			);
		case "SegmentedControl":
			return (
				<SegmentedControl
					key={key}
					options={readSegmentedControlOptions(props)}
					value={readString(props, "value")}
					defaultValue={readString(props, "defaultValue")}
					variant={readVariant(props, "variant")}
					color={readIntent(props, "color")}
					size={readThemeSize(props, "size")}
					disabled={readBoolean(props, "disabled")}
					fullWidth={readBoolean(props, "fullWidth")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					onChange={readStringCallback(props, "onChange")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Stack":
			return (
				<Stack
					key={key}
					width={readSizeValue(props, "width") ?? "100%"}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					p={readStringOrNumber(props, "p")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					direction={readStackDirection(props)}
					gap={readStringOrNumber(props, "gap") as ThemeSize | number | undefined}
					align={readStackAlign(props)}
					justify={readStackJustify(props)}
					wrap={readBoolean(props, "wrap")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Stack>
			);
		case "Slider":
			return (
				<Slider
					key={key}
					value={readNumber(props, "value")}
					defaultValue={readNumber(props, "defaultValue")}
					min={readNumber(props, "min")}
					max={readNumber(props, "max")}
					step={readNumber(props, "step")}
					color={readIntent(props, "color", "primary")}
					size={readThemeSize(props, "size", "md")}
					disabled={readBoolean(props, "disabled", false)}
					fullWidth={readBoolean(props, "fullWidth", false)}
					tooltip={readBoolean(props, "tooltip", false)}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					onChange={readNumberCallback(props, "onChange")}
					onChangeEnd={readNumberCallback(props, "onChangeEnd")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "StepperInput":
			return (
				<StepperInput
					key={key}
					value={readNumber(props, "value")}
					defaultValue={readNumber(props, "defaultValue")}
					min={readNumber(props, "min")}
					max={readNumber(props, "max")}
					step={readNumber(props, "step")}
					variant={readVariant(props, "variant")}
					size={readThemeSize(props, "size")}
					disabled={readBoolean(props, "disabled")}
					readOnly={readBoolean(props, "readOnly")}
					fullWidth={readBoolean(props, "fullWidth")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					onChange={readNumberCallback(props, "onChange")}
					onChangeEnd={readNumberCallback(props, "onChangeEnd")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Switch":
			return (
				<Switch
					key={key}
					label={readString(props, "label", "Option")}
					checked={readBoolean(props, "checked", false)}
					defaultChecked={readBoolean(props, "defaultChecked")}
					color={readIntent(props, "color")}
					size={readThemeSize(props, "size")}
					disabled={readBoolean(props, "disabled")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					onChange={readBooleanCallback(props, "onChange")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Text":
			return (
				<Text
					key={key}
					text={readStringOrNumber(props, "text")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					p={readStringOrNumber(props, "p")}
					bg={readColor(props, "bg")}
					bgTransparency={readNumber(props, "bgTransparency")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					size={readStringOrNumber(props, "size") as ThemeSize | number | undefined}
					weight={readNumber(props, "weight")}
					color={readColor(props, "color")}
					align={readTextAlign(props)}
					valign={readTextVerticalAlign(props)}
					wrap={readBoolean(props, "wrap")}
					truncate={readTextTruncate(props)}
					maxFontSize={readNumber(props, "maxFontSize")}
					minFontSize={readNumber(props, "minFontSize")}
					slotProps={readSlotProps(props)}
				/>
			);
		case "Tooltip":
			return (
				<Tooltip
					key={key}
					label={readStringOrNumber(props, "label")}
					content={readStringOrNumber(props, "content")}
					disabled={readBoolean(props, "disabled")}
					opened={readBoolean(props, "opened")}
					gap={readNumber(props, "gap")}
					width={readSizeValue(props, "width")}
					height={readSizeValue(props, "height")}
					position={readSizeValue2D(props, "position")}
					anchor={readVector2(props, "anchor")}
					visible={readBoolean(props, "visible")}
					layoutOrder={readNumber(props, "layoutOrder")}
					zIndex={readNumber(props, "zIndex")}
					slotProps={readSlotProps(props)}
				>
					{children}
				</Tooltip>
			);
		default:
			warnUnknownComponent(node.component);
			return <React.Fragment key={key} />;
	}
}

export function mountPrism(parent: Instance, tree: PrismLuauNode, theme?: ThemeOverride): PrismLuauMountHandle {
	const root = ReactRoblox.createRoot(parent);
	let destroyed = false;

	const render = (nextTree: PrismLuauNode) => {
		if (destroyed) {
			return;
		}

		root.render(<ThemeProvider theme={theme}>{renderNode(nextTree)}</ThemeProvider>);
	};

	const handle: PrismLuauMountHandle = {
		update: render,
		destroy: () => {
			if (destroyed) {
				return;
			}

			destroyed = true;
			root.unmount();
		},
	};

	render(tree);
	return handle;
}
