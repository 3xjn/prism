import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import type { MotionInputValue } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import {
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { assignRef, composeEventMaps, isPressInput } from "../_shared/interaction";
import { applyStyleOverride } from "../_shared/styleOverride";
import { resolveTextFontFace } from "../_shared/textFont";
import { mergeSharedStyleProps, resolveThemeSizeSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import {
	resolveSegmentedControlFrameVisualStyles,
	resolveSegmentedControlIndicatorMotionTransition,
	resolveSegmentedControlIndicatorVisualStyles,
	resolveSegmentedControlSegmentMotionTransition,
	resolveSegmentedControlSegmentVisualStyles,
	resolveSegmentedControlSizeStyles,
	type SegmentedControlSegmentState,
	type SegmentedControlSegmentVisualStyles,
	type SegmentedControlSizeStyles,
} from "./styles";
import { resolveSegmentedControlSelectionNeighborIndex } from "./selection";
import type { SegmentedControlOption, SegmentedControlProps } from "./types";

type FrameEventMap = React.InstanceProps<Frame>["Event"];
type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type FrameProps = React.InstanceProps<Frame>;
type TextButtonProps = React.InstanceProps<TextButton>;
type TextLabelProps = React.InstanceProps<TextLabel>;
type SegmentedControlComponent = ((props: SegmentedControlProps) => React.ReactElement) &
	React.ForwardRefExoticComponent<SegmentedControlProps>;

interface SegmentMotionValues extends Readonly<Record<string, MotionInputValue>> {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
	readonly textTransparency: number;
}

interface IndicatorMotionValues extends Readonly<Record<string, MotionInputValue>> {
	readonly selectedIndex: number;
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
}

interface SegmentedControlSegmentViewProps {
	readonly option: SegmentedControlOption;
	readonly index: number;
	readonly optionDisabled: boolean;
	readonly interactionState: SegmentedControlSegmentState;
	readonly segmentCount: number;
	readonly segmentVisualStyles: SegmentedControlSegmentVisualStyles;
	readonly segmentEvent: TextButtonEventMap;
	readonly nextSelectionLeft: TextButton | undefined;
	readonly nextSelectionRight: TextButton | undefined;
	readonly setSegmentRef: (value: string, instance: TextButton | undefined) => void;
	readonly segmentSlotProps: TextButtonProps | undefined;
	readonly segmentTextSlotProps: TextLabelProps | undefined;
	readonly slotProps: SegmentedControlProps["slotProps"];
	readonly theme: Theme;
	readonly sizeStyles: SegmentedControlSizeStyles;
	readonly segmentTextFont: TextLabelProps["Font"];
	readonly segmentTextFontFace: TextLabelProps["FontFace"];
	readonly segmentTextSize: TextLabelProps["TextSize"];
	readonly segmentLineHeight: TextLabelProps["LineHeight"];
	readonly resolvedSegmentZIndex: TextButtonProps["ZIndex"];
	readonly resolvedSegmentTextZIndex: TextLabelProps["ZIndex"];
}

function findOption(
	options: readonly SegmentedControlOption[],
	value: string | undefined,
): SegmentedControlOption | undefined {
	if (value === undefined) {
		return undefined;
	}

	for (const option of options) {
		if (option.value === value) {
			return option;
		}
	}

	return undefined;
}

function resolveInitialValue(
	options: readonly SegmentedControlOption[],
	value: string | undefined,
): string | undefined {
	const matchingOption = findOption(options, value);
	if (matchingOption !== undefined) {
		return matchingOption.value;
	}

	for (const option of options) {
		if (option.disabled !== true) {
			return option.value;
		}
	}

	return options[0]?.value;
}

function resolveSelectedIndex(options: readonly SegmentedControlOption[], selectedValue: string | undefined): number {
	if (selectedValue === undefined) {
		return 0;
	}

	for (let index = 0; index < options.size(); index += 1) {
		const option = options[index];

		if (option.value === selectedValue) {
			return index;
		}
	}

	return 0;
}

function offsetZIndex(zIndex: FrameProps["ZIndex"], offset: number): number | undefined {
	return typeIs(zIndex, "number") ? zIndex + offset : undefined;
}

function SegmentedControlSegmentView({
	option,
	index,
	optionDisabled,
	interactionState,
	segmentCount,
	segmentVisualStyles,
	segmentEvent,
	nextSelectionLeft,
	nextSelectionRight,
	setSegmentRef,
	segmentSlotProps,
	segmentTextSlotProps,
	slotProps,
	theme,
	sizeStyles,
	segmentTextFont,
	segmentTextFontFace,
	segmentTextSize,
	segmentLineHeight,
	resolvedSegmentZIndex,
	resolvedSegmentTextZIndex,
}: SegmentedControlSegmentViewProps): React.ReactElement {
	const motionValues: SegmentMotionValues = {
		backgroundColor: segmentVisualStyles.backgroundColor,
		backgroundTransparency: segmentVisualStyles.backgroundTransparency,
		strokeColor: segmentVisualStyles.strokeColor,
		strokeTransparency: segmentVisualStyles.strokeTransparency,
		textColor: segmentVisualStyles.textColor,
		textTransparency: segmentVisualStyles.textTransparency,
	};
	const animatedSegmentStyles = useMotion({
		values: motionValues,
		transition: resolveSegmentedControlSegmentMotionTransition(interactionState),
	});
	const segmentRef = React.useCallback(
		(instance: TextButton | undefined) => {
			setSegmentRef(option.value, instance);
		},
		[option.value, setSegmentRef],
	);

	return (
		<textbutton
			key={option.value}
			AutoButtonColor={false}
			Active={!optionDisabled}
			Selectable={!optionDisabled}
			BackgroundColor3={animatedSegmentStyles.backgroundColor}
			BackgroundTransparency={animatedSegmentStyles.backgroundTransparency}
			BorderSizePixel={0}
			Size={new UDim2(1 / segmentCount, -sizeStyles.gap, 1, 0)}
			LayoutOrder={index}
			Text=""
			TextTransparency={1}
			TextStrokeTransparency={1}
			ZIndex={resolvedSegmentZIndex}
			NextSelectionLeft={nextSelectionLeft}
			NextSelectionRight={nextSelectionRight}
			Event={segmentEvent}
			ref={segmentRef}
			{...segmentSlotProps}
		>
			{renderCornerDecorator({ radius: sizeStyles.segmentRadius, slotProps: slotProps?.segmentCorner })}
			{renderStrokeDecorator({
				enabled: true,
				color: animatedSegmentStyles.strokeColor,
				transparency: animatedSegmentStyles.strokeTransparency,
				thickness: 1,
				slotProps: slotProps?.segmentStroke,
			})}
			{renderPaddingDecorator({
				enabled: true,
				paddingTop: new UDim(
					0,
					resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingY, "spacing", theme.spacing.xs),
				),
				paddingRight: new UDim(
					0,
					resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingX, "spacing", theme.spacing.sm),
				),
				paddingBottom: new UDim(
					0,
					resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingY, "spacing", theme.spacing.xs),
				),
				paddingLeft: new UDim(
					0,
					resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.segmentPaddingX, "spacing", theme.spacing.sm),
				),
				slotProps: slotProps?.segmentPadding,
			})}
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Text={segmentTextSlotProps?.Text ?? option.label}
				TextColor3={segmentTextSlotProps?.TextColor3 ?? animatedSegmentStyles.textColor}
				TextTransparency={segmentTextSlotProps?.TextTransparency ?? animatedSegmentStyles.textTransparency}
				TextStrokeTransparency={segmentTextSlotProps?.TextStrokeTransparency ?? 1}
				TextSize={segmentTextSize}
				Font={segmentTextFont}
				FontFace={segmentTextFontFace}
				LineHeight={segmentLineHeight}
				TextWrapped={segmentTextSlotProps?.TextWrapped ?? false}
				TextTruncate={segmentTextSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextXAlignment={segmentTextSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
				TextYAlignment={segmentTextSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
				ZIndex={resolvedSegmentTextZIndex}
				{...segmentTextSlotProps}
			/>
		</textbutton>
	);
}

const SegmentedControlBase = React.forwardRef<Frame, SegmentedControlProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		options,
		variant = "outline",
		color = "primary",
		size = "md",
		disabled = false,
		fullWidth = false,
		styleOverrides,
		value,
		defaultValue,
		onChange,
		Event,
		Change,
	} = props;
	const [hoveredValue, setHoveredValue] = React.useState<string>();
	const [pressedValue, setPressedValue] = React.useState<string>();
	const [segmentInstances, setSegmentInstances] = React.useState<Readonly<Record<string, TextButton | undefined>>>({});
	const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
		resolveInitialValue(options, value ?? defaultValue),
	);
	const selectedValue = value ?? uncontrolledValue;
	const sizeStyles = resolveSegmentedControlSizeStyles(theme, size);
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
	} = useResolvedStyleProps("segmentedControl", mergedStyleProps);

	React.useEffect(() => {
		if (value !== undefined) {
			setUncontrolledValue(value);
		}
	}, [value]);

	React.useEffect(() => {
		setUncontrolledValue((currentValue) => resolveInitialValue(options, currentValue));
	}, [options]);

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHoveredValue(undefined);
		setPressedValue(undefined);
	}, [disabled]);

	const rootSlotProps = slotProps?.root;
	const frameSlotProps = slotProps?.frame;
	const segmentSlotProps = slotProps?.segment;
	const segmentTextSlotProps = slotProps?.segmentText;
	const segmentCount = math.max(options.size(), 1);
	const frameVisualStyles = applyStyleOverride(
		resolveSegmentedControlFrameVisualStyles(theme, variant, color, disabled),
		styleOverrides?.frame,
		{
			theme,
			variant,
			color,
			size,
			disabled,
		},
	);
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedFrameZIndex = frameSlotProps?.ZIndex ?? resolvedRootZIndex;
	const resolvedSegmentZIndex = segmentSlotProps?.ZIndex ?? resolvedFrameZIndex;
	const resolvedSegmentTextZIndex = segmentTextSlotProps?.ZIndex ?? resolvedSegmentZIndex;
	const segmentTextFont = segmentTextSlotProps?.Font ?? theme.fontFamily;
	const segmentTextFontFace = resolveTextFontFace(
		segmentTextSlotProps?.Font,
		segmentTextSlotProps?.FontFace,
		theme.fontFamily,
	);
	const segmentTextSize = segmentTextSlotProps?.TextSize ?? sizeStyles.fontSize;
	const segmentLineHeight = segmentTextSlotProps?.LineHeight ?? sizeStyles.lineHeight;
	const selectedIndex = resolveSelectedIndex(options, selectedValue);
	const indicatorVisualStyles = applyStyleOverride(
		resolveSegmentedControlIndicatorVisualStyles(theme, variant, color, disabled),
		styleOverrides?.indicator,
		{ theme, variant, color, size, disabled },
	);
	const indicatorMotionValues: IndicatorMotionValues = {
		selectedIndex,
		backgroundColor: indicatorVisualStyles.backgroundColor,
		backgroundTransparency: indicatorVisualStyles.backgroundTransparency,
		strokeColor: indicatorVisualStyles.strokeColor,
		strokeTransparency: indicatorVisualStyles.strokeTransparency,
	};
	const animatedIndicatorStyles = useMotion({
		values: indicatorMotionValues,
		transition: resolveSegmentedControlIndicatorMotionTransition(),
	});
	const indicatorSegmentWidthScale = 1 / segmentCount;
	const indicatorXScale = animatedIndicatorStyles.selectedIndex / segmentCount;
	const resolvedIndicatorZIndex = offsetZIndex(resolvedFrameZIndex, 1);
	const resolvedSegmentLayerZIndex = offsetZIndex(resolvedIndicatorZIndex ?? resolvedFrameZIndex, 2);

	let computedSize: UDim2 | undefined;
	let computedAutoSize: Enum.AutomaticSize | undefined;
	if (resolvedSize !== undefined) {
		computedSize = resolvedSize;
	} else if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		computedSize = new UDim2(resolvedWidth, resolvedHeight);
	} else if (resolvedWidth !== undefined) {
		computedSize = new UDim2(resolvedWidth, new UDim(0, 0));
		computedAutoSize = Enum.AutomaticSize.Y;
	} else if (resolvedHeight !== undefined) {
		computedSize = new UDim2(new UDim(0, fullWidth ? 0 : sizeStyles.defaultWidth), resolvedHeight);
		computedAutoSize = fullWidth ? undefined : Enum.AutomaticSize.X;
	} else {
		computedSize = fullWidth ? UDim2.fromScale(1, 0) : new UDim2(0, sizeStyles.defaultWidth, 0, 0);
		computedAutoSize = Enum.AutomaticSize.Y;
	}

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
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootRef = React.useCallback(
		(instance: Frame | undefined) => {
			assignRef(ref, instance);
		},
		[ref],
	);
	const rootEvent = useRootCursorEvent(
		composeEventMaps(Event as FrameEventMap | undefined),
		rootSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);
	const setSegmentRef = React.useCallback((optionValue: string, instance: TextButton | undefined) => {
		setSegmentInstances((currentInstances) => {
			if (currentInstances[optionValue] === instance) {
				return currentInstances;
			}

			return { ...currentInstances, [optionValue]: instance };
		});
	}, []);

	const commitValue = (nextValue: string) => {
		if (disabled) {
			return;
		}

		const nextOption = findOption(options, nextValue);
		if (nextOption === undefined || nextOption.disabled === true || nextValue === selectedValue) {
			return;
		}

		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}

		onChange?.(nextValue);
	};

	const renderSegment = (option: SegmentedControlOption, index: number) => {
		const optionDisabled = disabled || option.disabled === true;
		const selected = option.value === selectedValue;
		const interactionState: SegmentedControlSegmentState = optionDisabled
			? "disabled"
			: selected
				? "selected"
				: pressedValue === option.value
					? "pressed"
					: hoveredValue === option.value
						? "hovered"
						: "idle";
		const segmentVisualStyles = applyStyleOverride(
			resolveSegmentedControlSegmentVisualStyles(theme, variant, color, interactionState),
			styleOverrides?.segment,
			{ theme, variant, color, size, option, state: interactionState },
		);
		const previousIndex = optionDisabled
			? undefined
			: resolveSegmentedControlSelectionNeighborIndex(options, index, -1);
		const nextIndex = optionDisabled ? undefined : resolveSegmentedControlSelectionNeighborIndex(options, index, 1);
		const segmentEvent: TextButtonEventMap = {
			MouseEnter: () => {
				if (!optionDisabled) {
					setHoveredValue(option.value);
				}
			},
			MouseLeave: () => {
				if (hoveredValue === option.value) {
					setHoveredValue(undefined);
				}
				if (pressedValue === option.value) {
					setPressedValue(undefined);
				}
			},
			InputBegan: (_button, input) => {
				if (!optionDisabled && isPressInput(input)) {
					setPressedValue(option.value);
				}
			},
			InputEnded: (_button, input) => {
				if (isPressInput(input) && pressedValue === option.value) {
					setPressedValue(undefined);
				}
			},
			Activated: () => {
				commitValue(option.value);
			},
		};
		const mergedSegmentEvent = composeEventMaps(segmentEvent, segmentSlotProps?.Event);

		return (
			<SegmentedControlSegmentView
				key={option.value}
				option={option}
				index={index}
				optionDisabled={optionDisabled}
				interactionState={interactionState}
				segmentCount={segmentCount}
				segmentVisualStyles={segmentVisualStyles}
				segmentEvent={mergedSegmentEvent}
				nextSelectionLeft={previousIndex === undefined ? undefined : segmentInstances[options[previousIndex].value]}
				nextSelectionRight={nextIndex === undefined ? undefined : segmentInstances[options[nextIndex].value]}
				setSegmentRef={setSegmentRef}
				segmentSlotProps={segmentSlotProps}
				segmentTextSlotProps={segmentTextSlotProps}
				slotProps={slotProps}
				theme={theme}
				sizeStyles={sizeStyles}
				segmentTextFont={segmentTextFont}
				segmentTextFontFace={segmentTextFontFace}
				segmentTextSize={segmentTextSize}
				segmentLineHeight={segmentLineHeight}
				resolvedSegmentZIndex={resolvedSegmentZIndex}
				resolvedSegmentTextZIndex={resolvedSegmentTextZIndex}
			/>
		);
	};

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={computedSize}
			AutomaticSize={computedAutoSize}
			Position={computedPosition}
			AnchorPoint={resolvedAnchor}
			ClipsDescendants={props.clip}
			Visible={props.visible}
			LayoutOrder={props.layoutOrder}
			ZIndex={resolvedRootZIndex}
			Event={rootEvent}
			Change={Change}
			{...rootSlotProps}
			ref={rootRef}
		>
			{renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint })}
			{renderPaddingDecorator({
				enabled: hasPadding,
				paddingTop,
				paddingRight,
				paddingBottom,
				paddingLeft,
				slotProps: slotProps?.padding,
			})}
			<frame
				BackgroundColor3={frameVisualStyles.backgroundColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 0, sizeStyles.minHeight)}
				AutomaticSize={Enum.AutomaticSize.None}
				ZIndex={resolvedFrameZIndex}
				Active={false}
				Selectable={false}
				{...frameSlotProps}
			>
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.frameCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: frameVisualStyles.strokeColor,
					transparency: frameVisualStyles.strokeTransparency,
					thickness: 1,
					slotProps: slotProps?.frameStroke,
				})}
				{renderPaddingDecorator({
					enabled: true,
					paddingTop: new UDim(
						0,
						resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs),
					),
					paddingRight: new UDim(
						0,
						resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs),
					),
					paddingBottom: new UDim(
						0,
						resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs),
					),
					paddingLeft: new UDim(
						0,
						resolveThemeSizeSafe(theme, "segmentedControl", sizeStyles.padding, "spacing", theme.spacing.xs),
					),
					slotProps: slotProps?.framePadding,
				})}
				<frame
					BackgroundColor3={animatedIndicatorStyles.backgroundColor}
					BackgroundTransparency={animatedIndicatorStyles.backgroundTransparency}
					BorderSizePixel={0}
					Position={new UDim2(indicatorXScale, 0, 0, 0)}
					Size={new UDim2(indicatorSegmentWidthScale, -sizeStyles.gap, 1, 0)}
					ZIndex={resolvedIndicatorZIndex}
					Active={false}
					Selectable={false}
				>
					{renderCornerDecorator({ radius: sizeStyles.segmentRadius })}
					{renderStrokeDecorator({
						enabled: true,
						color: animatedIndicatorStyles.strokeColor,
						transparency: animatedIndicatorStyles.strokeTransparency,
						thickness: 1,
					})}
				</frame>
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={resolvedSegmentLayerZIndex}
					Active={false}
					Selectable={false}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						Padding={new UDim(0, sizeStyles.gap)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						{...slotProps?.listLayout}
					/>
					{options.map(renderSegment)}
				</frame>
			</frame>
		</frame>
	);
});

export const SegmentedControl = SegmentedControlBase as SegmentedControlComponent;

SegmentedControl.displayName = "SegmentedControl";
