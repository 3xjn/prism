import React from "@rbxts/react";

import { useTheme } from "@prism/theme";

import { CaptureOverlay, usePortalTarget } from "../_shared/layering";
import { incrementZIndex, type GuiZIndex } from "../_shared/overlayLayerPolicy";
import {
	mergeSharedStyleProps,
	resolveUDimSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { applyStyleOverride } from "../_shared/styleOverride";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import { Tooltip } from "../Tooltip";

import {
	assignRef,
	composeEventMaps,
	isMouseDragActive,
	isPressInput,
	resolveDragInputKind,
	shouldHandleDragEndInput,
	shouldHandleMouseDragMoveInput,
	shouldHandleTouchDragMoveInput,
	type DragInputKind,
} from "../_shared/interaction";
import { useSliderControllerInput } from "./controllerInput";
import {
	alphaToValue,
	normalizeSliderValue,
	resolveAlphaFromPositionX,
	resolveSliderRange,
	resolveTextFontFace,
	resolveValidStep,
	stepSliderValue,
	type SliderStepDirection,
	valueToAlpha,
} from "./utils";
import { resolveSliderSizeStyles, resolveSliderVisualStyles, type SliderInteractionState } from "./styles";
import type { SliderProps } from "./types";

const UserInputService = game.GetService("UserInputService");

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];

function resolveSliderTooltipContent(
	tooltip: SliderProps["tooltip"],
	value: number,
): string | undefined {
	if (tooltip === undefined || tooltip === false) {
		return undefined;
	}

	if (tooltip === true) {
		return tostring(value);
	}

	if (typeIs(tooltip, "string")) {
		return tooltip;
	}

	return tooltip(value);
}

type SliderComponent = ((props: SliderProps) => React.ReactElement) & React.ForwardRefExoticComponent<SliderProps>;

const SliderBase = React.forwardRef<TextButton, SliderProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		color = "primary",
		size = "md",
		disabled = false,
		fullWidth = false,
		min,
		max,
		step,
		styleOverrides,
		value,
		defaultValue,
		tooltip,
		onChange,
		onChangeEnd,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const [dragging, setDragging] = React.useState(false);
	const [dragValueOverride, setDragValueOverride] = React.useState<number | undefined>(undefined);
	const [hitboxInstance, setHitboxInstance] = React.useState<TextButton>();
	const portalTarget = usePortalTarget(hitboxInstance);
	const [uncontrolledValue, setUncontrolledValue] = React.useState(() => {
		const initialRange = resolveSliderRange(min, max);
		return normalizeSliderValue(value ?? defaultValue ?? initialRange.min, initialRange, resolveValidStep(step));
	});
	const sizeStyles = resolveSliderSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps({ cursor: "pointer" }, props);
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
	} = useResolvedStyleProps("slider", mergedStyleProps);
	const sliderRange = React.useMemo(() => resolveSliderRange(min, max), [min, max]);
	const resolvedStep = React.useMemo(() => resolveValidStep(step), [step]);
	const resolvedValue = normalizeSliderValue(value ?? uncontrolledValue, sliderRange, resolvedStep);
	const displayValue = dragValueOverride ?? resolvedValue;
	const displayAlpha = valueToAlpha(displayValue, sliderRange);
	const onChangeRef = React.useRef(onChange);
	const onChangeEndRef = React.useRef(onChangeEnd);
	const configRef = React.useRef({
		range: sliderRange,
		step: resolvedStep,
		controlled: value !== undefined,
	});
	const trackRef = React.useRef<Frame>();
	const dragKindRef = React.useRef<DragInputKind | undefined>(undefined);
	const activeTouchRef = React.useRef<InputObject | undefined>(undefined);
	const moveConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const endConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const draggingRef = React.useRef(false);
	const dragValueRef = React.useRef(displayValue);

	onChangeRef.current = onChange;
	onChangeEndRef.current = onChangeEnd;
	configRef.current = {
		range: sliderRange,
		step: resolvedStep,
		controlled: value !== undefined,
	};
	dragValueRef.current = displayValue;

	const rootSlotProps = slotProps?.root;
	const labelSlotProps = slotProps?.label;
	const valueLabelSlotProps = slotProps?.valueLabel;
	const trackSlotProps = slotProps?.track;
	const hitboxSlotProps = slotProps?.hitbox;
	const tooltipContent = resolveSliderTooltipContent(tooltip, displayValue);

	const disconnectDragTracking = React.useCallback(() => {
		moveConnectionRef.current?.Disconnect();
		moveConnectionRef.current = undefined;
		endConnectionRef.current?.Disconnect();
		endConnectionRef.current = undefined;
		dragKindRef.current = undefined;
		activeTouchRef.current = undefined;
	}, []);

	const endDrag = React.useCallback(
		(emitChangeEnd: boolean) => {
			if (!draggingRef.current) {
				disconnectDragTracking();
				return;
			}

			draggingRef.current = false;
			const finalValue = dragValueRef.current;
			disconnectDragTracking();
			setDragging(false);
			setDragValueOverride(undefined);

			if (emitChangeEnd) {
				onChangeEndRef.current?.(finalValue);
			}
		},
		[disconnectDragTracking],
	);

	const commitValue = React.useCallback((nextValue: number) => {
		const { range, step: currentStep, controlled } = configRef.current;
		const normalizedValue = normalizeSliderValue(nextValue, range, currentStep);

		if (normalizedValue === dragValueRef.current) {
			return normalizedValue;
		}

		dragValueRef.current = normalizedValue;
		setDragValueOverride(normalizedValue);

		if (!controlled) {
			setUncontrolledValue(normalizedValue);
		}

		onChangeRef.current?.(normalizedValue);
		return normalizedValue;
	}, []);

	const commitControllerStep = React.useCallback(
		(direction: SliderStepDirection) => {
			if (disabled) {
				return;
			}

			const finalValue = commitValue(
				stepSliderValue({
					value: dragValueRef.current,
					direction,
					range: configRef.current.range,
					step: configRef.current.step,
				}),
			);
			onChangeEndRef.current?.(finalValue);
		},
		[commitValue, disabled],
	);
	const controllerInput = useSliderControllerInput({
		disabled,
		hitboxInstance,
		commitStep: commitControllerStep,
	});
	const tooltipOpen = tooltipContent !== undefined && !disabled && (hovered || dragging || controllerInput.selected);

	const updateValueFromPositionX = React.useCallback(
		(positionX: number) => {
			const { range, step: currentStep } = configRef.current;
			const nextAlpha = resolveAlphaFromPositionX(trackRef.current, positionX);
			return commitValue(alphaToValue(nextAlpha, range, currentStep));
		},
		[commitValue],
	);

	const updateValueFromInput = React.useCallback(
		(input: InputObject) => {
			return updateValueFromPositionX(input.Position.X);
		},
		[updateValueFromPositionX],
	);

	const handleDragMoveInput = React.useCallback(
		(input: InputObject) => {
			if (shouldHandleMouseDragMoveInput(dragKindRef.current, input)) {
				updateValueFromInput(input);
				return;
			}

			if (shouldHandleTouchDragMoveInput(dragKindRef.current, activeTouchRef.current, input)) {
				updateValueFromInput(input);
				return;
			}
		},
		[updateValueFromInput],
	);

	const handleDragEndInput = React.useCallback(
		(input: InputObject) => {
			if (!shouldHandleDragEndInput(dragKindRef.current, activeTouchRef.current, input)) {
				return;
			}

			endDrag(true);
		},
		[endDrag],
	);

	const beginDrag = React.useCallback(
		(input: InputObject) => {
			if (disabled || !isPressInput(input)) {
				return;
			}

			const dragKind = resolveDragInputKind(input);
			if (dragKind === undefined) {
				return;
			}

			disconnectDragTracking();
			dragKindRef.current = dragKind;
			activeTouchRef.current = dragKind === "touch" ? input : undefined;
			draggingRef.current = true;
			setDragging(true);
			updateValueFromInput(input);

			if (!isMouseDragActive(dragKind) || portalTarget === undefined) {
				moveConnectionRef.current = UserInputService.InputChanged.Connect((changedInput) => {
					handleDragMoveInput(changedInput);
				});
			}

			endConnectionRef.current = UserInputService.InputEnded.Connect((endedInput) => {
				handleDragEndInput(endedInput);
			});
		},
		[disabled, disconnectDragTracking, handleDragEndInput, handleDragMoveInput, portalTarget, updateValueFromInput],
	);

	React.useEffect(() => {
		if (value !== undefined) {
			setUncontrolledValue(normalizeSliderValue(value, sliderRange, resolvedStep));
			return;
		}

		setUncontrolledValue((currentValue) => normalizeSliderValue(currentValue, sliderRange, resolvedStep));
	}, [resolvedStep, sliderRange, value]);

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHovered(false);
		endDrag(false);
	}, [disabled, endDrag]);

	React.useEffect(() => {
		return () => {
			draggingRef.current = false;
			disconnectDragTracking();
		};
	}, [disconnectDragTracking]);

	const shouldRenderLabels = labelSlotProps !== undefined || valueLabelSlotProps !== undefined;
	const labelRowHeight = shouldRenderLabels ? math.ceil(sizeStyles.labelSize * sizeStyles.labelLineHeight) : 0;
	const labelGap = shouldRenderLabels ? theme.spacing.xs : 0;
	const minimumHeight = sizeStyles.minHeight + labelRowHeight + labelGap;
	const computedWidth = fullWidth
		? resolveUDimSafe("slider", "100%", "width")
		: resolvedSize?.X ?? resolvedWidth ?? new UDim(0, sizeStyles.defaultWidth);
	const computedHeight = resolvedSize?.Y ?? resolvedHeight ?? new UDim(0, minimumHeight);
	const computedSize = new UDim2(computedWidth, computedHeight);
	const computedConstraint =
		resolvedConstraint === undefined
			? {
					min: new Vector2(0, minimumHeight),
					max: undefined,
			  }
			: {
					min:
						resolvedConstraint.min === undefined
							? new Vector2(0, minimumHeight)
							: new Vector2(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, minimumHeight)),
					max: resolvedConstraint.max,
			  };
	const interactionState: SliderInteractionState = disabled ? "disabled" : dragging ? "pressed" : hovered ? "hovered" : "idle";
	const styleOverrideContext = { theme, color, size, state: interactionState };
	const visualStyles = applyStyleOverride(resolveSliderVisualStyles(theme, color, interactionState), styleOverrides, styleOverrideContext);
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? incrementZIndex(resolvedRootZIndex, 1);
	const resolvedValueLabelZIndex = valueLabelSlotProps?.ZIndex ?? incrementZIndex(resolvedRootZIndex, 1);
	const resolvedTrackZIndex = trackSlotProps?.ZIndex ?? incrementZIndex(resolvedRootZIndex, 1);
	const resolvedRangeZIndex = slotProps?.range?.ZIndex ?? resolvedTrackZIndex;
	const resolvedThumbZIndex = slotProps?.thumb?.ZIndex ?? incrementZIndex(resolvedTrackZIndex, 1);
	const resolvedHitboxZIndex = hitboxSlotProps?.ZIndex ?? incrementZIndex(resolvedThumbZIndex, 1);
	const tooltipSlotProps =
		tooltipContent === undefined
			? undefined
			: {
				root: {
					ZIndex: resolvedThumbZIndex,
					...slotProps?.tooltipTrigger,
				},
				overlay: slotProps?.tooltipOverlay,
				bubble: slotProps?.tooltip,
				bubbleCorner: slotProps?.tooltipCorner,
				bubbleStroke: slotProps?.tooltipStroke,
				bubblePadding: slotProps?.tooltipPadding,
				label: slotProps?.tooltipLabel,
				tail: slotProps?.tooltipTail,
				tailBorder: slotProps?.tooltipTailBorder,
			};
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const labelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const labelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const valueLabelFont = valueLabelSlotProps?.Font ?? theme.fontFamily;
	const valueLabelFontFace = resolveTextFontFace(valueLabelSlotProps?.Font, valueLabelSlotProps?.FontFace, theme.fontFamily);
	const trackCornerRadius = new UDim(0.5, 0);
	const thumbCornerRadius = new UDim(0.5, 0);
	const mouseDragCaptureActive = dragging && isMouseDragActive(dragKindRef.current) && portalTarget !== undefined;
	const internalEvent: TextButtonEventMap = {
		MouseEnter: () => {
			if (disabled) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			setHovered(false);
		},
		...controllerInput.event,
		InputBegan: (_button, input) => {
			beginDrag(input);
		},
		InputChanged: (_button, input) => {
			handleDragMoveInput(input);
		},
		InputEnded: (_button, input) => {
			handleDragEndInput(input);
		},
	};
	const hitboxEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, Event),
		hitboxSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);
	const dragCaptureOverlayEvent: TextButtonEventMap | undefined = mouseDragCaptureActive
		? {
				InputChanged: (_button, input) => {
					handleDragMoveInput(input);
				},
				InputEnded: (_button, input) => {
					handleDragEndInput(input);
				},
		  }
		: undefined;
	const hitboxRef = React.useCallback(
		(instance: TextButton | undefined) => {
			setHitboxInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			assignRef(ref, instance);
		},
		[ref],
	);
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: 1,
		BackgroundColor3: theme.colors.background.default,
		Size: computedSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: resolvedRootZIndex,
	};
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding }),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint }));

	return (
		<>
			<frame {...rootInstanceProps} {...rootSlotProps}>
				{decoratorChildren}
				{shouldRenderLabels ? (
					<frame
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Size={new UDim2(1, 0, 0, labelRowHeight)}
						Position={UDim2.fromOffset(0, 0)}
						Active={false}
						Selectable={false}
					>
						{labelSlotProps !== undefined ? (
							<textlabel
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Size={new UDim2(0.5, 0, 1, 0)}
								Position={UDim2.fromOffset(0, 0)}
								Text={labelSlotProps.Text ?? ""}
								TextColor3={labelSlotProps.TextColor3 ?? visualStyles.labelColor}
								TextTransparency={labelSlotProps.TextTransparency ?? 0}
								TextStrokeTransparency={labelSlotProps.TextStrokeTransparency ?? 1}
								TextSize={labelSlotProps.TextSize ?? sizeStyles.labelSize}
								Font={labelFont}
								FontFace={labelFontFace}
								LineHeight={labelSlotProps.LineHeight ?? sizeStyles.labelLineHeight}
								TextWrapped={labelSlotProps.TextWrapped ?? false}
								TextTruncate={labelSlotProps.TextTruncate ?? Enum.TextTruncate.AtEnd}
								TextXAlignment={labelSlotProps.TextXAlignment ?? Enum.TextXAlignment.Left}
								TextYAlignment={labelSlotProps.TextYAlignment ?? Enum.TextYAlignment.Center}
								TextScaled={labelSlotProps.TextScaled ?? false}
								RichText={labelSlotProps.RichText ?? false}
								ZIndex={resolvedLabelZIndex}
								{...labelSlotProps}
							/>
						) : undefined}
						{valueLabelSlotProps !== undefined ? (
							<textlabel
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Size={new UDim2(0.5, 0, 1, 0)}
								Position={UDim2.fromScale(0.5, 0)}
								Text={valueLabelSlotProps.Text ?? tostring(displayValue)}
								TextColor3={valueLabelSlotProps.TextColor3 ?? visualStyles.valueLabelColor}
								TextTransparency={valueLabelSlotProps.TextTransparency ?? 0}
								TextStrokeTransparency={valueLabelSlotProps.TextStrokeTransparency ?? 1}
								TextSize={valueLabelSlotProps.TextSize ?? sizeStyles.labelSize}
								Font={valueLabelFont}
								FontFace={valueLabelFontFace}
								LineHeight={valueLabelSlotProps.LineHeight ?? sizeStyles.labelLineHeight}
								TextWrapped={valueLabelSlotProps.TextWrapped ?? false}
								TextTruncate={valueLabelSlotProps.TextTruncate ?? Enum.TextTruncate.AtEnd}
								TextXAlignment={valueLabelSlotProps.TextXAlignment ?? Enum.TextXAlignment.Right}
								TextYAlignment={valueLabelSlotProps.TextYAlignment ?? Enum.TextYAlignment.Center}
								TextScaled={valueLabelSlotProps.TextScaled ?? false}
								RichText={valueLabelSlotProps.RichText ?? false}
								ZIndex={resolvedValueLabelZIndex}
								{...valueLabelSlotProps}
							/>
						) : undefined}
					</frame>
				) : undefined}
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 1, -(labelRowHeight + labelGap))}
					Position={UDim2.fromOffset(0, labelRowHeight + labelGap)}
					Active={false}
					Selectable={false}
				>
					<frame
						BackgroundColor3={visualStyles.trackColor}
						BackgroundTransparency={0}
						BorderSizePixel={0}
						Size={new UDim2(1, 0, 0, sizeStyles.trackHeight)}
						Position={UDim2.fromScale(0, 0.5)}
						AnchorPoint={new Vector2(0, 0.5)}
						ZIndex={resolvedTrackZIndex}
						Active={false}
						Selectable={false}
						ref={trackRef}
						{...trackSlotProps}
					>
						{renderCornerDecorator({ radius: trackCornerRadius, slotProps: slotProps?.trackCorner })}
						{renderStrokeDecorator({
							enabled: true,
							color: visualStyles.trackStrokeColor,
							transparency: visualStyles.trackStrokeTransparency,
							thickness: 1,
							slotProps: slotProps?.trackStroke,
						})}
						<frame
							BackgroundColor3={visualStyles.rangeColor}
							BackgroundTransparency={0}
							BorderSizePixel={0}
							Size={new UDim2(displayAlpha, 0, 1, 0)}
							ZIndex={resolvedRangeZIndex}
							Active={false}
							Selectable={false}
							{...slotProps?.range}
						>
							{renderCornerDecorator({ radius: trackCornerRadius, slotProps: slotProps?.rangeCorner })}
						</frame>
					</frame>
					<Tooltip
						content={tooltipContent}
						opened={tooltipOpen}
						disabled={tooltipContent === undefined || disabled}
						width={sizeStyles.thumbDiameter}
						height={sizeStyles.thumbDiameter}
						position={new UDim2(displayAlpha, 0, 0.5, 0)}
						anchor={new Vector2(0.5, 0.5)}
						slotProps={tooltipSlotProps}
					>
						<frame
							BackgroundColor3={visualStyles.thumbColor}
							BackgroundTransparency={0}
							BorderSizePixel={0}
							Size={UDim2.fromScale(1, 1)}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							ZIndex={slotProps?.thumb?.ZIndex ?? resolvedThumbZIndex}
							Active={false}
							Selectable={false}
							{...slotProps?.thumb}
						>
							{renderCornerDecorator({ radius: thumbCornerRadius, slotProps: slotProps?.thumbCorner })}
							{renderStrokeDecorator({
								enabled: true,
								color: visualStyles.thumbStrokeColor,
								transparency: visualStyles.thumbStrokeTransparency,
								thickness: 1,
								slotProps: slotProps?.thumbStroke,
							})}
						</frame>
					</Tooltip>
					<textbutton
						AutoButtonColor={false}
						Active={!disabled}
						Selectable={!disabled}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 1)}
						Text=""
						TextTransparency={1}
						TextStrokeTransparency={1}
						ZIndex={resolvedHitboxZIndex}
						Event={hitboxEvent}
						Change={Change}
						ref={hitboxRef}
						{...hitboxSlotProps}
					/>
				</frame>
			</frame>
			<CaptureOverlay active={mouseDragCaptureActive} target={portalTarget} Event={dragCaptureOverlayEvent} />
		</>
	);
});

export const Slider = SliderBase as SliderComponent;

Slider.displayName = "Slider";
