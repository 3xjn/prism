import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import type { MotionInputValue } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme, Variant } from "@prism/theme";

import { CaptureOverlay, usePortalTarget } from "../_shared/layering";
import {
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
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
import { applyStyleOverride } from "../_shared/styleOverride";
import { resolveTextFontFace } from "../_shared/textFont";
import { mergeSharedStyleProps, resolveThemeSizeSafe, resolveUDimSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import {
	resolveStepperInputButtonMotionTransition,
	resolveStepperInputButtonVisualStyles,
	resolveStepperInputFrameMotionTransition,
	resolveStepperInputFrameVisualStyles,
	resolveStepperInputSizeStyles,
	type StepperInputButtonState,
	type StepperInputButtonVisualStyles,
	type StepperInputSizeStyles,
} from "./styles";
import type { StepperInputButtonStyleOverrideContext, StepperInputProps } from "./types";
import {
	formatStepperInputValue,
	normalizeStepperInputValue,
	resolveStepperInputRailAlphaFromPositionX,
	resolveStepperInputRailRange,
	resolveStepperInputRange,
	resolveValidStepperInputStep,
	stepStepperInputValue,
	stepperInputRailAlphaToValue,
	valueToStepperInputRailAlpha,
} from "./utils";

const UserInputService = game.GetService("UserInputService");
const HORIZONTAL_DRAG_CURSOR = "resize-ew";

type FrameEventMap = React.InstanceProps<Frame>["Event"];
type FrameProps = React.InstanceProps<Frame>;
type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type TextButtonProps = React.InstanceProps<TextButton>;
type TextLabelProps = React.InstanceProps<TextLabel>;
type StepperInputComponent = ((props: StepperInputProps) => React.ReactElement) & React.ForwardRefExoticComponent<StepperInputProps>;

interface ButtonMotionValues extends Readonly<Record<string, MotionInputValue>> {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
}

interface StepperButtonViewProps {
	readonly label: string;
	readonly state: StepperInputButtonState;
	readonly disabled: boolean;
	readonly layoutOrder: number;
	readonly zIndex: TextButtonProps["ZIndex"];
	readonly textZIndex: TextLabelProps["ZIndex"];
	readonly buttonSlotProps: TextButtonProps | undefined;
	readonly textSlotProps: TextLabelProps | undefined;
	readonly slotProps: StepperInputProps["slotProps"];
	readonly sizeStyles: StepperInputSizeStyles;
	readonly visualStyles: StepperInputButtonVisualStyles;
	readonly event: TextButtonEventMap;
	readonly theme: Theme;
}

interface StepperRailViewProps {
	readonly railProps: Partial<TextButtonProps>;
	readonly railSlotProps: TextButtonProps | undefined;
	readonly railFillSlotProps: FrameProps | undefined;
	readonly railValueSlotProps: TextLabelProps | undefined;
	readonly slotProps: StepperInputProps["slotProps"];
	readonly sizeStyles: StepperInputSizeStyles;
	readonly displayAlpha: number;
	readonly displayText: string;
	readonly dragging: boolean;
	readonly fillColor: Color3;
	readonly fillTransparency: FrameProps["BackgroundTransparency"];
	readonly valueColor: Color3;
	readonly valueFont: TextLabelProps["Font"];
	readonly valueFontFace: TextLabelProps["FontFace"];
	readonly fillZIndex: FrameProps["ZIndex"];
	readonly valueZIndex: TextLabelProps["ZIndex"];
	readonly railRef: React.Ref<TextButton>;
}

function offsetZIndex(zIndex: TextButtonProps["ZIndex"], offset: number): number | undefined {
	return typeIs(zIndex, "number") ? zIndex + offset : undefined;
}

function StepperButtonView({
	label,
	state,
	disabled,
	layoutOrder,
	zIndex,
	textZIndex,
	buttonSlotProps,
	textSlotProps,
	slotProps,
	sizeStyles,
	visualStyles,
	event,
	theme,
}: StepperButtonViewProps): React.ReactElement {
	const motionValues: ButtonMotionValues = {
		backgroundColor: visualStyles.backgroundColor,
		backgroundTransparency: visualStyles.backgroundTransparency,
		strokeColor: visualStyles.strokeColor,
		strokeTransparency: visualStyles.strokeTransparency,
		textColor: visualStyles.textColor,
	};
	const animated = useMotion({
		values: motionValues,
		transition: resolveStepperInputButtonMotionTransition(state),
	});
	const resolvedTextFont = textSlotProps?.Font ?? theme.fontFamily;
	const resolvedTextFontFace = resolveTextFontFace(textSlotProps?.Font, textSlotProps?.FontFace, theme.fontFamily);

	return (
		<textbutton
			AutoButtonColor={false}
			Active={!disabled}
			Selectable={!disabled}
			BackgroundColor3={animated.backgroundColor}
			BackgroundTransparency={animated.backgroundTransparency}
			BorderSizePixel={0}
			Size={new UDim2(0, sizeStyles.buttonWidth, 1, 0)}
			LayoutOrder={layoutOrder}
			Text=""
			TextTransparency={1}
			TextStrokeTransparency={1}
			ZIndex={zIndex}
			Event={event}
			{...buttonSlotProps}
		>
			{renderCornerDecorator({ radius: sizeStyles.buttonRadius, slotProps: slotProps?.buttonCorner })}
			{renderStrokeDecorator({
				enabled: true,
				color: animated.strokeColor,
				transparency: animated.strokeTransparency,
				thickness: 1,
				slotProps: slotProps?.buttonStroke,
			})}
			{renderPaddingDecorator({
				enabled: true,
				paddingTop: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingY, "spacing", theme.spacing.xs)),
				paddingRight: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingX, "spacing", theme.spacing.xs)),
				paddingBottom: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingY, "spacing", theme.spacing.xs)),
				paddingLeft: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.buttonPaddingX, "spacing", theme.spacing.xs)),
				slotProps: slotProps?.buttonPadding,
			})}
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Text={textSlotProps?.Text ?? label}
				TextColor3={textSlotProps?.TextColor3 ?? animated.textColor}
				TextTransparency={textSlotProps?.TextTransparency ?? 0}
				TextStrokeTransparency={textSlotProps?.TextStrokeTransparency ?? 1}
				TextSize={textSlotProps?.TextSize ?? sizeStyles.fontSize + 2}
				Font={resolvedTextFont}
				FontFace={resolvedTextFontFace}
				LineHeight={textSlotProps?.LineHeight ?? sizeStyles.lineHeight}
				TextWrapped={textSlotProps?.TextWrapped ?? false}
				TextTruncate={textSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextXAlignment={textSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
				TextYAlignment={textSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
				ZIndex={textZIndex}
				{...textSlotProps}
			/>
		</textbutton>
	);
}

function StepperRailView({
	railProps,
	railSlotProps,
	railFillSlotProps,
	railValueSlotProps,
	slotProps,
	sizeStyles,
	displayAlpha,
	displayText,
	dragging,
	fillColor,
	fillTransparency,
	valueColor,
	valueFont,
	valueFontFace,
	fillZIndex,
	valueZIndex,
	railRef,
}: StepperRailViewProps): React.ReactElement {
	return (
		<textbutton {...railProps} {...railSlotProps} ref={railRef}>
			{renderCornerDecorator({ radius: sizeStyles.buttonRadius, slotProps: slotProps?.buttonCorner })}
			<frame
				BackgroundColor3={fillColor}
				BackgroundTransparency={railFillSlotProps?.BackgroundTransparency ?? fillTransparency}
				BorderSizePixel={0}
				Size={dragging ? new UDim2(displayAlpha, 0, 1, 0) : new UDim2(displayAlpha, 0, 0, 2)}
				Position={dragging ? new UDim2(0, 0, 0, 0) : new UDim2(0, 0, 1, 0)}
				AnchorPoint={dragging ? new Vector2(0, 0) : new Vector2(0, 1)}
				ZIndex={fillZIndex}
				Active={false}
				Selectable={false}
				{...railFillSlotProps}
			>
				{renderCornerDecorator({ radius: sizeStyles.buttonRadius, slotProps: slotProps?.buttonCorner })}
			</frame>
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Text={railValueSlotProps?.Text ?? displayText}
				TextColor3={railValueSlotProps?.TextColor3 ?? valueColor}
				TextTransparency={railValueSlotProps?.TextTransparency ?? 0}
				TextStrokeTransparency={railValueSlotProps?.TextStrokeTransparency ?? 1}
				TextSize={railValueSlotProps?.TextSize ?? sizeStyles.fontSize}
				Font={valueFont}
				FontFace={valueFontFace}
				LineHeight={railValueSlotProps?.LineHeight ?? sizeStyles.lineHeight}
				TextWrapped={railValueSlotProps?.TextWrapped ?? false}
				TextTruncate={railValueSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextXAlignment={railValueSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
				TextYAlignment={railValueSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
				RichText={railValueSlotProps?.RichText ?? false}
				ZIndex={valueZIndex}
				{...railValueSlotProps}
			/>
		</textbutton>
	);
}

const StepperInputBase = React.forwardRef<TextButton, StepperInputProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		variant = "outline",
		size = "md",
		disabled = false,
		readOnly = false,
		fullWidth = false,
		min,
		max,
		step,
		value,
		defaultValue,
		onChange,
		onChangeEnd,
		formatValue,
		styleOverrides,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const [dragging, setDragging] = React.useState(false);
	const [dragValueOverride, setDragValueOverride] = React.useState<number | undefined>(undefined);
	const [railInstance, setRailInstance] = React.useState<TextButton>();
	const [decrementHovered, setDecrementHovered] = React.useState(false);
	const [decrementPressed, setDecrementPressed] = React.useState(false);
	const [incrementHovered, setIncrementHovered] = React.useState(false);
	const [incrementPressed, setIncrementPressed] = React.useState(false);
	const portalTarget = usePortalTarget(railInstance);
	const sizeStyles = resolveStepperInputSizeStyles(theme, size);
	const range = React.useMemo(() => resolveStepperInputRange(min, max), [min, max]);
	const railRange = React.useMemo(() => resolveStepperInputRailRange(range), [range]);
	const resolvedStep = React.useMemo(() => resolveValidStepperInputStep(step), [step]);
	const [uncontrolledValue, setUncontrolledValue] = React.useState(() => normalizeStepperInputValue(value ?? defaultValue, range, resolvedStep));
	const resolvedValue = normalizeStepperInputValue(value ?? uncontrolledValue, range, resolvedStep);
	const displayValue = dragValueOverride ?? resolvedValue;
	const displayAlpha = valueToStepperInputRailAlpha(displayValue, railRange);
	const valueRef = React.useRef(resolvedValue);
	const dragValueRef = React.useRef(displayValue);
	const onChangeRef = React.useRef(onChange);
	const onChangeEndRef = React.useRef(onChangeEnd);
	const configRef = React.useRef({
		range,
		railRange,
		step: resolvedStep,
		controlled: value !== undefined,
	});
	const railRef = React.useRef<TextButton>();
	const dragKindRef = React.useRef<DragInputKind | undefined>(undefined);
	const activeTouchRef = React.useRef<InputObject | undefined>(undefined);
	const moveConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const endConnectionRef = React.useRef<RBXScriptConnection | undefined>(undefined);
	const draggingRef = React.useRef(false);

	valueRef.current = resolvedValue;
	dragValueRef.current = displayValue;
	onChangeRef.current = onChange;
	onChangeEndRef.current = onChangeEnd;
	configRef.current = {
		range,
		railRange,
		step: resolvedStep,
		controlled: value !== undefined,
	};

	React.useEffect(() => {
		if (value !== undefined) {
			setUncontrolledValue(normalizeStepperInputValue(value, range, resolvedStep));
			return;
		}

		setUncontrolledValue((currentValue) => normalizeStepperInputValue(currentValue, range, resolvedStep));
	}, [range, resolvedStep, value]);

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

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHovered(false);
		setDecrementHovered(false);
		setDecrementPressed(false);
		setIncrementHovered(false);
		setIncrementPressed(false);
		endDrag(false);
	}, [disabled, endDrag]);

	React.useEffect(() => {
		return () => {
			draggingRef.current = false;
			disconnectDragTracking();
		};
	}, [disconnectDragTracking]);

	const commitValue = React.useCallback((nextValue: number, emitChangeEnd: boolean, useDragOverride: boolean = false) => {
		const { range: currentRange, step: currentStep, controlled } = configRef.current;
		const normalizedValue = normalizeStepperInputValue(nextValue, currentRange, currentStep, valueRef.current);

		dragValueRef.current = normalizedValue;
		if (useDragOverride === true) {
			setDragValueOverride(normalizedValue);
		}

		if (normalizedValue !== valueRef.current) {
			valueRef.current = normalizedValue;

			if (!controlled) {
				setUncontrolledValue(normalizedValue);
			}

			onChangeRef.current?.(normalizedValue);
		}

		if (emitChangeEnd) {
			onChangeEndRef.current?.(normalizedValue);
		}

		return normalizedValue;
	}, []);

	const updateValueFromPositionX = React.useCallback(
		(positionX: number) => {
			const { railRange: currentRailRange, step: currentStep } = configRef.current;
			const nextAlpha = resolveStepperInputRailAlphaFromPositionX(railRef.current, positionX);
			return commitValue(stepperInputRailAlphaToValue(nextAlpha, currentRailRange, currentStep), false, true);
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
			if (disabled || readOnly || !isPressInput(input)) {
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
		[disabled, disconnectDragTracking, handleDragEndInput, handleDragMoveInput, portalTarget, readOnly, updateValueFromInput],
	);

	const commitStep = React.useCallback(
		(direction: -1 | 1) => {
			if (disabled || readOnly) {
				return;
			}

			const { range: currentRange, step: currentStep } = configRef.current;
			commitValue(stepStepperInputValue(valueRef.current, direction, currentRange, currentStep), true);
		},
		[commitValue, disabled, readOnly],
	);

	const canEdit = !disabled && !readOnly;
	const decrementDisabled = !canEdit || stepStepperInputValue(resolvedValue, -1, range, resolvedStep) === resolvedValue;
	const incrementDisabled = !canEdit || stepStepperInputValue(resolvedValue, 1, range, resolvedStep) === resolvedValue;
	const frameState = disabled ? "disabled" : dragging ? "focused" : hovered ? "hovered" : "idle";
	const frameVisualStyles = applyStyleOverride(resolveStepperInputFrameVisualStyles(theme, variant, frameState, readOnly), styleOverrides?.frame, {
		theme,
		variant,
		size,
		state: frameState,
		readOnly,
	});
	const animatedFrame = useMotion({
		values: {
			backgroundColor: frameVisualStyles.backgroundColor,
			inputBackgroundColor: frameVisualStyles.inputBackgroundColor,
			inputBackgroundTransparency: frameVisualStyles.inputBackgroundTransparency,
			strokeColor: frameVisualStyles.strokeColor,
			strokeTransparency: frameVisualStyles.strokeTransparency,
			strokeThickness: frameVisualStyles.strokeThickness,
			textColor: frameVisualStyles.textColor,
			placeholderColor: frameVisualStyles.placeholderColor,
			railFillColor: frameVisualStyles.railFillColor,
			railFillTransparency: frameVisualStyles.railFillTransparency,
		},
		transition: resolveStepperInputFrameMotionTransition(frameState),
	});
	const decrementState: StepperInputButtonState = decrementDisabled ? "disabled" : decrementPressed ? "pressed" : decrementHovered ? "hovered" : "idle";
	const incrementState: StepperInputButtonState = incrementDisabled ? "disabled" : incrementPressed ? "pressed" : incrementHovered ? "hovered" : "idle";
	const decrementStyleOverrideContext: StepperInputButtonStyleOverrideContext = { theme, variant, size, state: decrementState, control: "decrement" };
	const incrementStyleOverrideContext: StepperInputButtonStyleOverrideContext = { theme, variant, size, state: incrementState, control: "increment" };
	const decrementVisualStyles = applyStyleOverride(
		resolveStepperInputButtonVisualStyles(theme, variant, decrementState),
		styleOverrides?.button,
		decrementStyleOverrideContext,
	);
	const incrementVisualStyles = applyStyleOverride(
		resolveStepperInputButtonVisualStyles(theme, variant, incrementState),
		styleOverrides?.button,
		incrementStyleOverrideContext,
	);
	const mergedStyleProps = mergeSharedStyleProps({ cursor: canEdit ? "pointer" : "default" }, props);
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
	} = useResolvedStyleProps("stepperInput", mergedStyleProps);
	const computedWidth = fullWidth ? resolveUDimSafe("stepperInput", "100%", "width") : resolvedWidth ?? new UDim(0, sizeStyles.defaultWidth);
	const computedHeight = resolvedHeight ?? new UDim(0, sizeStyles.minHeight);
	const computedSize = resolvedSize ?? new UDim2(computedWidth, computedHeight);
	const computedConstraint =
		resolvedConstraint === undefined
			? {
				min: new Vector2(0, sizeStyles.minHeight),
				max: undefined,
			  }
			: {
				min:
					resolvedConstraint.min === undefined
						? new Vector2(0, sizeStyles.minHeight)
						: new Vector2(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, sizeStyles.minHeight)),
				max: resolvedConstraint.max,
			  };
	const rootSlotProps = slotProps?.root;
	const frameSlotProps = slotProps?.frame;
	const railSlotProps = slotProps?.rail;
	const railFillSlotProps = slotProps?.railFill;
	const railValueSlotProps = slotProps?.railValue;
	const decrementSlotProps = slotProps?.decrement;
	const incrementSlotProps = slotProps?.increment;
	const decrementTextSlotProps = slotProps?.decrementText;
	const incrementTextSlotProps = slotProps?.incrementText;
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedFrameZIndex = frameSlotProps?.ZIndex ?? resolvedRootZIndex;
	const resolvedRailZIndex = railSlotProps?.ZIndex ?? offsetZIndex(resolvedFrameZIndex, 1);
	const resolvedRailFillZIndex = railFillSlotProps?.ZIndex ?? resolvedRailZIndex;
	const resolvedRailValueZIndex = railValueSlotProps?.ZIndex ?? offsetZIndex(resolvedRailZIndex, 1);
	const resolvedDecrementZIndex = decrementSlotProps?.ZIndex ?? offsetZIndex(resolvedFrameZIndex, 1);
	const resolvedIncrementZIndex = incrementSlotProps?.ZIndex ?? offsetZIndex(resolvedFrameZIndex, 1);
	const resolvedDecrementTextZIndex = decrementTextSlotProps?.ZIndex ?? resolvedDecrementZIndex;
	const resolvedIncrementTextZIndex = incrementTextSlotProps?.ZIndex ?? resolvedIncrementZIndex;
	const resolvedRailValueFont = railValueSlotProps?.Font ?? theme.fontFamily;
	const resolvedRailValueFontFace = resolveTextFontFace(railValueSlotProps?.Font, railValueSlotProps?.FontFace, theme.fontFamily);
	const displayText = formatStepperInputValue(displayValue, formatValue);
	const railWidthOffset = -(sizeStyles.buttonWidth * 2 + sizeStyles.gap * 2);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootEvent = useRootCursorEvent<NonNullable<FrameEventMap>>(
		undefined,
		rootSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);
	const railEvent: TextButtonEventMap = {
		MouseEnter: () => {
			if (!disabled) {
				setHovered(true);
			}
		},
		MouseLeave: () => {
			setHovered(false);
		},
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
	const railCursor = props.cursor ?? (canEdit ? HORIZONTAL_DRAG_CURSOR : "default");
	const railRootEvent = useRootCursorEvent(composeEventMaps(railEvent, Event), railSlotProps?.Event === undefined ? railCursor : undefined, disabled || readOnly);
	const mouseDragCaptureActive = dragging && isMouseDragActive(dragKindRef.current) && portalTarget !== undefined;
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
	const railRefCallback = React.useCallback(
		(instance: TextButton | undefined) => {
			railRef.current = instance;
			setRailInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			assignRef(ref, instance);
		},
		[ref],
	);
	const decrementEvent: TextButtonEventMap = {
		MouseEnter: () => {
			if (!decrementDisabled) {
				setDecrementHovered(true);
			}
		},
		MouseLeave: () => {
			setDecrementHovered(false);
			setDecrementPressed(false);
		},
		InputBegan: (_button, input) => {
			if (!decrementDisabled && isPressInput(input)) {
				setDecrementPressed(true);
			}
		},
		InputEnded: (_button, input) => {
			if (isPressInput(input)) {
				setDecrementPressed(false);
			}
		},
		Activated: () => {
			commitStep(-1);
		},
	};
	const incrementEvent: TextButtonEventMap = {
		MouseEnter: () => {
			if (!incrementDisabled) {
				setIncrementHovered(true);
			}
		},
		MouseLeave: () => {
			setIncrementHovered(false);
			setIncrementPressed(false);
		},
		InputBegan: (_button, input) => {
			if (!incrementDisabled && isPressInput(input)) {
				setIncrementPressed(true);
			}
		},
		InputEnded: (_button, input) => {
			if (isPressInput(input)) {
				setIncrementPressed(false);
			}
		},
		Activated: () => {
			commitStep(1);
		},
	};
	const railInstanceProps: Partial<React.InstanceProps<TextButton>> = {
		Active: !disabled,
		Selectable: !disabled,
		BackgroundColor3: animatedFrame.inputBackgroundColor,
		BackgroundTransparency: animatedFrame.inputBackgroundTransparency,
		BorderSizePixel: 0,
		Size: new UDim2(1, railWidthOffset, 1, 0),
		LayoutOrder: 2,
		Text: "",
		TextTransparency: 1,
		TextStrokeTransparency: 1,
		AutoButtonColor: false,
		ZIndex: resolvedRailZIndex,
		Event: railRootEvent,
		Change,
	};

	// luau: rbxtsc never reuses temp locals, so the JSX tree must compile in its own
	// function scope — inlined in StepperInputBase it exceeds Luau's 200-register limit.
	const renderTree = (): React.ReactElement => (
		<>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={computedSize}
				Position={computedPosition}
				AnchorPoint={resolvedAnchor}
				ClipsDescendants={props.clip}
				Visible={props.visible}
				LayoutOrder={props.layoutOrder}
				ZIndex={resolvedRootZIndex}
				Event={rootEvent}
				{...rootSlotProps}
			>
				{renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint })}
				{renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding })}
				<frame
					BackgroundColor3={animatedFrame.backgroundColor}
					BackgroundTransparency={0}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={resolvedFrameZIndex}
					Active={false}
					Selectable={false}
					{...frameSlotProps}
				>
					{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.frameCorner })}
					{renderStrokeDecorator({
						enabled: true,
						color: animatedFrame.strokeColor,
						transparency: animatedFrame.strokeTransparency,
						thickness: animatedFrame.strokeThickness,
						slotProps: slotProps?.frameStroke,
					})}
					{renderPaddingDecorator({
						enabled: true,
						paddingTop: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
						paddingRight: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
						paddingBottom: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
						paddingLeft: new UDim(0, resolveThemeSizeSafe(theme, "stepperInput", sizeStyles.padding, "spacing", theme.spacing.xs)),
						slotProps: slotProps?.framePadding,
					})}
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						Padding={new UDim(0, sizeStyles.gap)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						{...slotProps?.listLayout}
					/>
					<StepperButtonView
						label="-"
						state={decrementState}
						disabled={decrementDisabled}
						layoutOrder={1}
						zIndex={resolvedDecrementZIndex}
						textZIndex={resolvedDecrementTextZIndex}
						buttonSlotProps={decrementSlotProps}
						textSlotProps={decrementTextSlotProps}
						slotProps={slotProps}
						sizeStyles={sizeStyles}
						visualStyles={decrementVisualStyles}
						event={composeEventMaps(decrementEvent, decrementSlotProps?.Event)}
						theme={theme}
					/>
					<StepperRailView
						railProps={railInstanceProps}
						railSlotProps={railSlotProps}
						railFillSlotProps={railFillSlotProps}
						railValueSlotProps={railValueSlotProps}
						slotProps={slotProps}
						sizeStyles={sizeStyles}
						displayAlpha={displayAlpha}
						displayText={displayText}
						dragging={dragging}
						fillColor={animatedFrame.railFillColor}
						fillTransparency={animatedFrame.railFillTransparency}
						valueColor={animatedFrame.textColor}
						valueFont={resolvedRailValueFont}
						valueFontFace={resolvedRailValueFontFace}
						fillZIndex={resolvedRailFillZIndex}
						valueZIndex={resolvedRailValueZIndex}
						railRef={railRefCallback}
					/>
					<StepperButtonView
						label="+"
						state={incrementState}
						disabled={incrementDisabled}
						layoutOrder={3}
						zIndex={resolvedIncrementZIndex}
						textZIndex={resolvedIncrementTextZIndex}
						buttonSlotProps={incrementSlotProps}
						textSlotProps={incrementTextSlotProps}
						slotProps={slotProps}
						sizeStyles={sizeStyles}
						visualStyles={incrementVisualStyles}
						event={composeEventMaps(incrementEvent, incrementSlotProps?.Event)}
						theme={theme}
					/>
				</frame>
			</frame>
			<CaptureOverlay active={mouseDragCaptureActive} target={portalTarget} Event={dragCaptureOverlayEvent} />
		</>
	);

	return renderTree();
});

export const StepperInput = StepperInputBase as StepperInputComponent;

StepperInput.displayName = "StepperInput";
