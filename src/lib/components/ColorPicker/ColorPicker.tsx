import React from "@rbxts/react";

import { useTheme } from "@prism/theme";

import {
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { resolveMinimumHeightConstraint } from "../_shared/frameSize";
import { assignRef, composeEventMaps } from "../_shared/interaction";
import { CaptureOverlay } from "../_shared/layering";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { applyStyleOverride } from "../_shared/styleOverride";
import { mergeSharedStyleProps, resolveUDimSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { ColorPickerField } from "./ColorPickerField";
import { ColorPickerHue } from "./ColorPickerHue";
import { ColorPickerInputs } from "./ColorPickerInputs";
import { ColorPickerPreview } from "./ColorPickerPreview";
import {
	resolveColorPickerSizeStyles,
	resolveColorPickerVisualStyles,
	type ColorPickerInteractionState,
} from "./styles";
import type { ColorPickerProps } from "./types";
import { useColorControllerInput } from "./useColorControllerInput";
import { useColorDrag } from "./useColorDrag";
import {
	color3ToHsv,
	colorsEqual,
	formatHexColor,
	formatRgbColor,
	hsvToColor3,
	parseHexColor,
	parseRgbColor,
	resolveHueFromPoint,
	resolvePrecisionCommitColor,
	resolveSaturationValueFromPoint,
} from "./utils";

const FIELD_CONTROLLER_STEP = 1 / 50;
const HUE_CONTROLLER_STEP = 1 / 72;

function resolveInputHeight(size: ColorPickerProps["size"]): number {
	switch (size) {
		case "xs":
			return 32;
		case "sm":
			return 36;
		case "lg":
			return 44;
		case "xl":
			return 52;
		case "md":
		default:
			return 40;
	}
}

type ColorPickerComponent = ((props: ColorPickerProps) => React.ReactElement) &
	React.ForwardRefExoticComponent<ColorPickerProps>;

const ColorPickerBase = React.forwardRef<TextButton, ColorPickerProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		size = "md",
		disabled = false,
		fullWidth = false,
		value,
		defaultValue,
		onChange,
		onChangeEnd,
		styleOverrides,
		Event,
		Change,
	} = props;
	const initialValue = value ?? defaultValue ?? theme.colors.primary.main;
	const [uncontrolledValue, setUncontrolledValue] = React.useState(initialValue);
	const resolvedValue = value ?? uncontrolledValue;
	const [dragColorOverride, setDragColorOverride] = React.useState<Color3>();
	const displayColor = dragColorOverride ?? resolvedValue;
	const displayHsv = color3ToHsv(displayColor);
	const [rememberedHue, setRememberedHue] = React.useState(displayHsv.hue);
	const effectiveHue = displayHsv.saturation > 1e-4 ? displayHsv.hue : rememberedHue;
	const [fieldInstance, setFieldInstance] = React.useState<Frame>();
	const [hueInstance, setHueInstance] = React.useState<Frame>();
	const [hexText, setHexText] = React.useState(formatHexColor(displayColor));
	const [rgbText, setRgbText] = React.useState(formatRgbColor(displayColor));
	const [hexInvalid, setHexInvalid] = React.useState(false);
	const [rgbInvalid, setRgbInvalid] = React.useState(false);
	const reportedColorRef = React.useRef(displayColor);
	const emitChangeEnd = React.useCallback(() => {
		onChangeEnd?.(reportedColorRef.current);
	}, [onChangeEnd]);

	const sizeStyles = resolveColorPickerSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps({ cursor: "crosshair" }, props);
	const { resolvedWidth, resolvedHeight, resolvedSize, resolvedPosition, resolvedAnchor, resolvedConstraint } =
		useResolvedStyleProps("colorPicker", mergedStyleProps);

	const publishColor = React.useCallback(
		(color: Color3, transient: boolean) => {
			if (transient) {
				setDragColorOverride(color);
			} else {
				setDragColorOverride(undefined);
			}

			if (colorsEqual(color, reportedColorRef.current)) {
				return;
			}

			reportedColorRef.current = color;
			if (value === undefined) {
				setUncontrolledValue(color);
			}
			onChange?.(color);
		},
		[onChange, value],
	);

	const updateSaturationValue = React.useCallback(
		(point: Vector2) => {
			if (fieldInstance === undefined) {
				return;
			}

			const saturationValue = resolveSaturationValueFromPoint(
				{ position: fieldInstance.AbsolutePosition, size: fieldInstance.AbsoluteSize },
				point,
			);
			publishColor(
				hsvToColor3({
					hue: effectiveHue,
					saturation: saturationValue.saturation,
					value: saturationValue.value,
				}),
				true,
			);
		},
		[effectiveHue, fieldInstance, publishColor],
	);

	const updateHue = React.useCallback(
		(point: Vector2) => {
			if (hueInstance === undefined) {
				return;
			}

			const hue = resolveHueFromPoint(
				{ position: hueInstance.AbsolutePosition, size: hueInstance.AbsoluteSize },
				point,
			);
			setRememberedHue(hue);
			publishColor(hsvToColor3({ hue, saturation: displayHsv.saturation, value: displayHsv.value }), true);
		},
		[displayHsv.saturation, displayHsv.value, hueInstance, publishColor],
	);
	const commitFieldControllerStep = React.useCallback(
		(channel: "saturation" | "value", direction: -1 | 1) => {
			const saturation =
				channel === "saturation"
					? math.clamp(displayHsv.saturation + direction * FIELD_CONTROLLER_STEP, 0, 1)
					: displayHsv.saturation;
			const nextValue =
				channel === "value" ? math.clamp(displayHsv.value + direction * FIELD_CONTROLLER_STEP, 0, 1) : displayHsv.value;
			const color = hsvToColor3({ hue: effectiveHue, saturation, value: nextValue });
			publishColor(color, false);
			onChangeEnd?.(color);
		},
		[displayHsv.saturation, displayHsv.value, effectiveHue, onChangeEnd, publishColor],
	);
	const commitHueControllerStep = React.useCallback(
		(direction: -1 | 1) => {
			const hue = (effectiveHue + direction * HUE_CONTROLLER_STEP + 1) % 1;
			setRememberedHue(hue);
			const color = hsvToColor3({ hue, saturation: displayHsv.saturation, value: displayHsv.value });
			publishColor(color, false);
			onChangeEnd?.(color);
		},
		[displayHsv.saturation, displayHsv.value, effectiveHue, onChangeEnd, publishColor],
	);

	const fieldDrag = useColorDrag({ disabled, onPoint: updateSaturationValue, onEnd: emitChangeEnd });
	const hueDrag = useColorDrag({ disabled, onPoint: updateHue, onEnd: emitChangeEnd });
	const controllerInput = useColorControllerInput({
		disabled,
		fieldHitboxInstance: fieldDrag.hitboxInstance,
		hueHitboxInstance: hueDrag.hitboxInstance,
		commitFieldStep: commitFieldControllerStep,
		commitHueStep: commitHueControllerStep,
	});
	const dragging = fieldDrag.dragging || hueDrag.dragging;
	const hovered = fieldDrag.hovered || hueDrag.hovered;
	const selected = controllerInput.fieldSelected || controllerInput.hueSelected;

	React.useEffect(() => {
		if (value !== undefined) {
			setUncontrolledValue(value);
		}
	}, [value]);

	React.useEffect(() => {
		if (displayHsv.saturation > 1e-4) {
			setRememberedHue(displayHsv.hue);
		}
	}, [displayHsv.hue, displayHsv.saturation]);

	React.useEffect(() => {
		reportedColorRef.current = displayColor;
		setHexText(formatHexColor(displayColor));
		setRgbText(formatRgbColor(displayColor));
		setHexInvalid(false);
		setRgbInvalid(false);
	}, [displayColor]);

	React.useEffect(() => {
		if (!dragging) {
			setDragColorOverride(undefined);
		}
	}, [dragging]);

	const commitPrecisionColor = (color: Color3) => {
		publishColor(color, false);
		onChangeEnd?.(color);
		const committedDisplayColor = resolvePrecisionCommitColor(color, resolvedValue, value !== undefined);
		// A controlled parent may reject or delay this request. Restore the dedupe
		// baseline with the displayed prop so retrying the same candidate still emits.
		reportedColorRef.current = committedDisplayColor;
		setHexText(formatHexColor(committedDisplayColor));
		setRgbText(formatRgbColor(committedDisplayColor));
	};

	const commitHex = () => {
		const color = parseHexColor(hexText);
		if (color === undefined) {
			setHexText(formatHexColor(displayColor));
			setHexInvalid(true);
			return;
		}

		setHexInvalid(false);
		commitPrecisionColor(color);
	};
	const commitRgb = () => {
		const color = parseRgbColor(rgbText);
		if (color === undefined) {
			setRgbText(formatRgbColor(displayColor));
			setRgbInvalid(true);
			return;
		}

		setRgbInvalid(false);
		commitPrecisionColor(color);
	};
	const handleHexChange = (text: string) => {
		setHexText(text);
		setHexInvalid(false);
	};
	const handleRgbChange = (text: string) => {
		setRgbText(text);
		setRgbInvalid(false);
	};

	const interactionState: ColorPickerInteractionState = disabled
		? "disabled"
		: dragging
			? "pressed"
			: selected
				? "selected"
				: hovered
					? "hovered"
					: "idle";
	const visualStyles = applyStyleOverride(resolveColorPickerVisualStyles(theme, interactionState), styleOverrides, {
		theme,
		size,
		state: interactionState,
		value: displayColor,
	});
	const computedWidth = fullWidth
		? resolveUDimSafe("colorPicker", "100%", "width")
		: (resolvedSize?.X ?? resolvedWidth ?? new UDim(0, sizeStyles.defaultWidth));
	const explicitHeight = resolvedSize?.Y ?? resolvedHeight;
	const labelHeight = math.ceil(sizeStyles.fontSize * theme.lineHeights.sm);
	const inputsHeight = labelHeight + theme.spacing.xs + resolveInputHeight(size);
	const minimumHeight =
		sizeStyles.padding * 2 +
		sizeStyles.previewHeight +
		sizeStyles.fieldHeight +
		sizeStyles.hueHeight +
		inputsHeight +
		sizeStyles.gap * 3;
	const computedConstraint = resolveMinimumHeightConstraint(resolvedConstraint, minimumHeight);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);

	const rootSlotProps = slotProps?.root;
	const fieldHitboxSlotProps = slotProps?.fieldHitbox;
	const hueHitboxSlotProps = slotProps?.hueHitbox;
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const contentZIndex = slotProps?.content?.ZIndex ?? incrementZIndex(resolvedRootZIndex, 1);
	const previewZIndex = slotProps?.preview?.ZIndex ?? contentZIndex;
	const fieldZIndex = slotProps?.field?.ZIndex ?? contentZIndex;
	const fieldMarkerZIndex = slotProps?.fieldMarker?.ZIndex ?? incrementZIndex(fieldZIndex, 2);
	const fieldHitboxZIndex = fieldHitboxSlotProps?.ZIndex ?? incrementZIndex(fieldMarkerZIndex, 1);
	const hueZIndex = slotProps?.hue?.ZIndex ?? contentZIndex;
	const hueMarkerZIndex = slotProps?.hueMarker?.ZIndex ?? incrementZIndex(hueZIndex, 2);
	const hueHitboxZIndex = hueHitboxSlotProps?.ZIndex ?? incrementZIndex(hueMarkerZIndex, 1);
	const inputZIndex = slotProps?.inputs?.ZIndex ?? contentZIndex;
	const managedInputZIndex = typeIs(inputZIndex, "number") ? inputZIndex : undefined;
	const disabledOverlayZIndex = slotProps?.disabledOverlay?.ZIndex ?? incrementZIndex(fieldHitboxZIndex, 10);
	const fieldEvent = useRootCursorEvent(
		composeEventMaps(composeEventMaps(fieldDrag.event, controllerInput.fieldEvent), Event),
		fieldHitboxSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);
	const hueEvent = useRootCursorEvent(
		composeEventMaps(hueDrag.event, controllerInput.hueEvent),
		hueHitboxSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);
	const fieldHitboxRef = React.useCallback(
		(instance: TextButton | undefined) => {
			fieldDrag.setHitboxInstance(instance);
			assignRef(ref, instance);
		},
		[fieldDrag.setHitboxInstance, ref],
	);
	const hueHitboxRef = React.useCallback(
		(instance: TextButton | undefined) => {
			hueDrag.setHitboxInstance(instance);
		},
		[hueDrag.setHitboxInstance],
	);
	const internalSelectionOrder = props.selectionOrder;
	const hueSelectionOrder = internalSelectionOrder !== undefined ? internalSelectionOrder + 1 : undefined;

	return (
		<>
			<frame
				BackgroundColor3={visualStyles.backgroundColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={new UDim2(computedWidth, explicitHeight ?? new UDim(0, 0))}
				AutomaticSize={explicitHeight === undefined ? Enum.AutomaticSize.Y : Enum.AutomaticSize.None}
				Position={computedPosition}
				AnchorPoint={resolvedAnchor}
				ClipsDescendants={props.clip}
				Visible={props.visible}
				LayoutOrder={props.layoutOrder}
				ZIndex={resolvedRootZIndex}
				{...rootSlotProps}
			>
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.rootCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: visualStyles.strokeColor,
					transparency: visualStyles.strokeTransparency,
					thickness: visualStyles.strokeThickness,
					slotProps: slotProps?.rootStroke,
				})}
				{renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint })}

				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					ZIndex={contentZIndex}
					{...slotProps?.content}
				>
					{renderPaddingDecorator({
						enabled: true,
						paddingTop: new UDim(0, sizeStyles.padding),
						paddingRight: new UDim(0, sizeStyles.padding),
						paddingBottom: new UDim(0, sizeStyles.padding),
						paddingLeft: new UDim(0, sizeStyles.padding),
						slotProps: slotProps?.padding,
					})}
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, sizeStyles.gap)}
						{...slotProps?.layout}
					/>

					<ColorPickerPreview
						color={displayColor}
						theme={theme}
						sizeStyles={sizeStyles}
						visualStyles={visualStyles}
						slotProps={slotProps}
						zIndex={previewZIndex}
					/>

					<ColorPickerField
						color={displayColor}
						hsv={displayHsv}
						hue={effectiveHue}
						disabled={disabled}
						selectionProps={props}
						sizeStyles={sizeStyles}
						visualStyles={visualStyles}
						slotProps={slotProps}
						fieldZIndex={fieldZIndex}
						markerZIndex={fieldMarkerZIndex}
						hitboxZIndex={fieldHitboxZIndex}
						frameRef={setFieldInstance}
						hitboxRef={fieldHitboxRef}
						event={fieldEvent}
						change={Change}
					/>

					<ColorPickerHue
						hue={effectiveHue}
						selected={controllerInput.hueSelected}
						disabled={disabled}
						selectable={props.selectable ?? true}
						selectionOrder={hueSelectionOrder}
						theme={theme}
						sizeStyles={sizeStyles}
						visualStyles={visualStyles}
						slotProps={slotProps}
						hueZIndex={hueZIndex}
						markerZIndex={hueMarkerZIndex}
						hitboxZIndex={hueHitboxZIndex}
						frameRef={setHueInstance}
						hitboxRef={hueHitboxRef}
						event={hueEvent}
					/>

					<ColorPickerInputs
						hexText={hexText}
						rgbText={rgbText}
						hexInvalid={hexInvalid}
						rgbInvalid={rgbInvalid}
						onHexChange={handleHexChange}
						onRgbChange={handleRgbChange}
						onHexCommit={commitHex}
						onRgbCommit={commitRgb}
						size={size}
						disabled={disabled}
						selectable={props.selectable ?? true}
						selectionOrder={internalSelectionOrder}
						theme={theme}
						sizeStyles={sizeStyles}
						visualStyles={visualStyles}
						slotProps={slotProps}
						height={inputsHeight}
						labelHeight={labelHeight}
						zIndex={inputZIndex}
						managedInputZIndex={managedInputZIndex}
					/>
				</frame>

				{disabled ? (
					<frame
						BackgroundColor3={visualStyles.disabledOverlayColor}
						BackgroundTransparency={visualStyles.disabledOverlayTransparency}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 1)}
						Active={false}
						Selectable={false}
						ZIndex={disabledOverlayZIndex}
						{...slotProps?.disabledOverlay}
					>
						<uicorner CornerRadius={sizeStyles.radius} />
					</frame>
				) : undefined}
			</frame>
			<CaptureOverlay
				active={fieldDrag.captureActive}
				target={fieldDrag.captureTarget}
				Event={fieldDrag.captureEvent}
			/>
			<CaptureOverlay active={hueDrag.captureActive} target={hueDrag.captureTarget} Event={hueDrag.captureEvent} />
		</>
	);
});

export const ColorPicker = ColorPickerBase as ColorPickerComponent;

ColorPicker.displayName = "ColorPicker";
