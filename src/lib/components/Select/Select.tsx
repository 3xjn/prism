import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";

import { getLucideIconAsset } from "../../icons/lucide";

import {
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { useTriggerOverlayLayout } from "../_shared/layering";
import {
	mergeSharedStyleProps,
	resolveUDimSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { SelectDropdown } from "./SelectDropdown";
import {
	resolveSelectSizeStyles,
	resolveSelectTriggerMotionTransition,
	resolveSelectTriggerVisualStyles,
	type SelectTriggerState,
} from "./styles";
import type { SelectProps } from "./types";
import {
	assignRef,
	composeEventMaps,
	findSelectedOption,
	incrementZIndex,
	isPressInput,
	resolveSelectOverlayLayout,
	resolveTextFontFace,
	type SelectOverlayLayout,
} from "./utils";

type SelectComponent = ((props: SelectProps) => React.ReactElement) & React.ForwardRefExoticComponent<SelectProps>;

const SelectBase = React.forwardRef<TextButton, SelectProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		variant = "outline",
		color = "primary",
		size = "md",
		disabled = false,
		fullWidth = false,
		placeholder,
		options,
		selected,
		value,
		defaultValue,
		onChange,
		maxVisibleOptions = 6,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const [pressed, setPressed] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const controlledValue = value ?? selected;
	const [uncontrolledValue, setUncontrolledValue] = React.useState(controlledValue ?? defaultValue);
	const [triggerInstance, setTriggerInstance] = React.useState<TextButton>();
	const sizeStyles = resolveSelectSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps(
		{
			cursor: "pointer",
			px: sizeStyles.paddingX,
			py: sizeStyles.paddingY,
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
	} = useResolvedStyleProps("select", mergedStyleProps);
	const currentValue = controlledValue ?? uncontrolledValue;
	const selectedOption = findSelectedOption(options, currentValue);
	const hasSelection = selectedOption !== undefined;
	const triggerText = hasSelection ? selectedOption.label : placeholder ?? "";
	const rootSlotProps = slotProps?.root;
	const triggerSlotProps = slotProps?.trigger;
	const triggerTextSlotProps = slotProps?.triggerText;
	const indicatorSlotProps = slotProps?.indicator;
	const indicatorAsset = getLucideIconAsset("chevron-right", sizeStyles.indicatorSize);
	const triggerOverlayLayout = useTriggerOverlayLayout(triggerInstance, open);
	React.useEffect(() => {
		if (controlledValue !== undefined) {
			setUncontrolledValue(controlledValue);
		}
	}, [controlledValue]);

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHovered(false);
		setPressed(false);
		setOpen(false);
	}, [disabled]);

	React.useEffect(() => {
		if (options.size() > 0) {
			return;
		}

		setOpen(false);
	}, [options]);

	const computedWidth = fullWidth ? resolveUDimSafe("select", "100%", "width") : resolvedSize?.X ?? resolvedWidth ?? new UDim(0, sizeStyles.defaultWidth);
	const triggerHeight = resolvedSize?.Y ?? resolvedHeight ?? new UDim(0, sizeStyles.minHeight);
	const minimumTriggerHeight = math.max(sizeStyles.minHeight, triggerHeight.Offset);
	const overlayLayout = React.useMemo<SelectOverlayLayout | undefined>(
		() => resolveSelectOverlayLayout(triggerOverlayLayout, sizeStyles.listGap, minimumTriggerHeight),
		[minimumTriggerHeight, sizeStyles.listGap, triggerOverlayLayout],
	);
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
	const triggerState: SelectTriggerState = disabled ? "disabled" : pressed ? "pressed" : open ? "open" : hovered ? "hovered" : "idle";
	const triggerVisualStyles = resolveSelectTriggerVisualStyles(theme, variant, color, triggerState, hasSelection);
	const triggerAnimated = useMotion({
		values: {
			backgroundColor: triggerVisualStyles.backgroundColor,
			strokeColor: triggerVisualStyles.strokeColor,
			strokeTransparency: triggerVisualStyles.strokeTransparency,
			strokeThickness: triggerVisualStyles.strokeThickness,
			textColor: triggerVisualStyles.textColor,
			placeholderColor: triggerVisualStyles.placeholderColor,
			indicatorColor: triggerVisualStyles.indicatorColor,
			indicatorRotation: triggerVisualStyles.indicatorRotation,
		},
		transition: resolveSelectTriggerMotionTransition(triggerState),
	});
	const resolvedTriggerFont = triggerTextSlotProps?.Font ?? theme.fontFamily;
	const resolvedTriggerFontFace = resolveTextFontFace(triggerTextSlotProps?.Font, triggerTextSlotProps?.FontFace, theme.fontFamily);
	const resolvedTriggerTextSize = triggerTextSlotProps?.TextSize ?? sizeStyles.fontSize;
	const resolvedTriggerLineHeight = triggerTextSlotProps?.LineHeight ?? sizeStyles.lineHeight;
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedTriggerZIndex = triggerSlotProps?.ZIndex ?? resolvedRootZIndex;
	const resolvedTriggerTextZIndex = triggerTextSlotProps?.ZIndex ?? resolvedTriggerZIndex;
	const resolvedIndicatorZIndex = indicatorSlotProps?.ZIndex ?? resolvedTriggerZIndex;
	const resolvedDropdownZIndex = incrementZIndex(resolvedTriggerZIndex ?? overlayLayout?.zIndexBase, 1);
	const internalEvent: React.InstanceProps<TextButton>["Event"] = {
		MouseEnter: () => {
			if (disabled) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			setHovered(false);
			setPressed(false);
		},
		InputBegan: (_button, input) => {
			if (disabled || !isPressInput(input)) {
				return;
			}

			setPressed(true);
		},
		InputEnded: (_button, input) => {
			if (!isPressInput(input)) {
				return;
			}

			setPressed(false);
		},
		Activated: () => {
			if (disabled || options.size() === 0) {
				return;
			}

			setOpen((currentOpen) => !currentOpen);
		},
	};
	const triggerEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, Event),
		triggerSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined,
		disabled,
	);
	const handleSelect = (nextValue: string) => {
		if (disabled) {
			return;
		}

		const option = findSelectedOption(options, nextValue);
		if (option === undefined || option.disabled) {
			return;
		}

		if (controlledValue === undefined) {
			setUncontrolledValue(nextValue);
		}

		if (nextValue !== currentValue) {
			onChange?.(nextValue);
		}

		setOpen(false);
		setPressed(false);
	};
	const triggerRef = React.useCallback(
		(instance: TextButton | undefined) => {
			setTriggerInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			assignRef(ref, instance);
		},
		[ref],
	);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: 1,
		BackgroundColor3: theme.colors.background.default,
		Size: new UDim2(computedWidth, new UDim(0, 0)),
		AutomaticSize: Enum.AutomaticSize.Y,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: resolvedRootZIndex,
	};
	const triggerInstanceProps: Partial<React.InstanceProps<TextButton>> = {
		AutoButtonColor: false,
		Active: !disabled,
		Selectable: !disabled,
		BackgroundColor3: triggerAnimated.backgroundColor,
		BackgroundTransparency: 0,
		BorderSizePixel: 0,
		Size: new UDim2(1, 0, triggerHeight.Scale, triggerHeight.Offset),
		LayoutOrder: 1,
		Text: "",
		TextTransparency: 1,
		TextStrokeTransparency: 1,
		ZIndex: resolvedTriggerZIndex,
		Event: triggerEvent,
		Change,
	};

	return (
		<>
			<frame {...rootInstanceProps} {...rootSlotProps}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, sizeStyles.listGap)}
					{...slotProps?.rootLayout}
				/>
				{renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint })}
				<textbutton {...triggerInstanceProps} {...triggerSlotProps} ref={triggerRef}>
					{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.triggerCorner })}
					{renderStrokeDecorator({
						enabled: true,
						color: triggerAnimated.strokeColor,
						transparency: triggerAnimated.strokeTransparency,
						thickness: triggerAnimated.strokeThickness,
						slotProps: slotProps?.triggerStroke,
					})}
					<frame BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)} Active={false} Selectable={false}>
						{renderPaddingDecorator({
							enabled: true,
							paddingTop,
							paddingRight,
							paddingBottom,
							paddingLeft,
							slotProps: slotProps?.triggerPadding,
						})}
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={new UDim2(1, -(sizeStyles.indicatorSize + sizeStyles.indicatorGap), 1, 0)}
							Text={triggerTextSlotProps?.Text ?? triggerText}
							TextColor3={triggerTextSlotProps?.TextColor3 ?? (hasSelection ? triggerAnimated.textColor : triggerAnimated.placeholderColor)}
							TextTransparency={triggerTextSlotProps?.TextTransparency ?? 0}
							TextStrokeTransparency={triggerTextSlotProps?.TextStrokeTransparency ?? 1}
							TextSize={resolvedTriggerTextSize}
							Font={resolvedTriggerFont}
							FontFace={resolvedTriggerFontFace}
							LineHeight={resolvedTriggerLineHeight}
							TextWrapped={triggerTextSlotProps?.TextWrapped ?? false}
							TextTruncate={triggerTextSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
							TextXAlignment={triggerTextSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left}
							TextYAlignment={triggerTextSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={triggerTextSlotProps?.TextScaled ?? false}
							RichText={triggerTextSlotProps?.RichText ?? false}
							ZIndex={resolvedTriggerTextZIndex}
							{...triggerTextSlotProps}
						/>
						<imagelabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={UDim2.fromOffset(sizeStyles.indicatorSize, sizeStyles.indicatorSize)}
							Position={UDim2.fromScale(1, 0.5)}
							AnchorPoint={new Vector2(1, 0.5)}
							Image={indicatorAsset?.Url}
							ImageRectSize={indicatorAsset?.ImageRectSize}
							ImageRectOffset={indicatorAsset?.ImageRectOffset}
							ImageColor3={indicatorSlotProps?.ImageColor3 ?? triggerAnimated.indicatorColor}
							ImageTransparency={indicatorSlotProps?.ImageTransparency ?? 0}
							Rotation={indicatorSlotProps?.Rotation ?? triggerAnimated.indicatorRotation}
							ScaleType={Enum.ScaleType.Fit}
							ZIndex={resolvedIndicatorZIndex}
							Active={false}
							Selectable={false}
							{...indicatorSlotProps}
						/>
					</frame>
				</textbutton>
			</frame>
			{open && options.size() > 0 && overlayLayout !== undefined ? (
				<SelectDropdown
					layout={overlayLayout}
					variant={variant}
					color={color}
					options={options}
					currentValue={currentValue}
					sizeStyles={sizeStyles}
					maxVisibleOptions={maxVisibleOptions}
					slotProps={slotProps}
					cursor={mergedStyleProps.cursor}
					zIndex={resolvedDropdownZIndex}
					onSelect={handleSelect}
				/>
			) : undefined}
		</>
	);
});

export const Select = SelectBase as SelectComponent;

Select.displayName = "Select";
