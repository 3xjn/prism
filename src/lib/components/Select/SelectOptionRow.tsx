import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";

import { renderCornerDecorator, renderPaddingDecorator } from "../_shared/foundationDecorators";
import { applyStyleOverride } from "../_shared/styleOverride";
import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import {
	resolveSelectOptionMotionTransition,
	resolveSelectOptionVisualStyles,
	type SelectOptionState,
	type SelectSizeStyles,
} from "./styles";
import type { SelectColor, SelectOption, SelectProps, SelectSize, SelectSlotProps, SelectStyleOverrides } from "./types";
import { composeEventMaps, resolveTextFontFace, type GuiZIndex } from "./utils";

interface SelectOptionRowProps {
	readonly option: SelectOption;
	readonly selected: boolean;
	readonly color: SelectColor;
	readonly size: SelectSize;
	readonly sizeStyles: SelectSizeStyles;
	readonly slotProps: SelectSlotProps | undefined;
	readonly styleOverrides: SelectStyleOverrides | undefined;
	readonly zIndex: GuiZIndex | undefined;
	readonly cursor: SelectProps["cursor"];
	readonly selectionOrder: number;
	readonly onInstanceChange: (option: SelectOption, instance: TextButton | undefined) => void;
	readonly onSelect: (value: string) => void;
}

export function SelectOptionRow(props: SelectOptionRowProps): React.ReactElement {
	const theme = useTheme();
	const {
		option,
		selected,
		color,
		size,
		sizeStyles,
		slotProps,
		styleOverrides,
		zIndex,
		cursor,
		selectionOrder,
		onInstanceChange,
		onSelect,
	} = props;
	const optionSlotProps = slotProps?.option;
	const optionTextSlotProps = slotProps?.optionText;
	const optionDisabled = option.disabled === true;
	const [hovered, setHovered] = React.useState(false);

	React.useEffect(() => {
		if (!optionDisabled) {
			return;
		}

		setHovered(false);
	}, [optionDisabled]);

	const visualState: SelectOptionState = optionDisabled ? "disabled" : selected ? "selected" : hovered ? "hovered" : "idle";
	const visualStyles = applyStyleOverride(resolveSelectOptionVisualStyles(theme, color, visualState), styleOverrides?.option, {
		theme,
		color,
		size,
		option,
		state: visualState,
	});
	const animated = useMotion({
		values: {
			backgroundColor: visualStyles.backgroundColor,
			backgroundTransparency: visualStyles.backgroundTransparency,
			textColor: visualStyles.textColor,
			textTransparency: visualStyles.textTransparency,
		},
		transition: resolveSelectOptionMotionTransition(visualState),
	});
	const resolvedTextFont = optionTextSlotProps?.Font ?? theme.fontFamily;
	const resolvedTextFontFace = resolveTextFontFace(optionTextSlotProps?.Font, optionTextSlotProps?.FontFace, theme.fontFamily);
	const resolvedTextSize = optionTextSlotProps?.TextSize ?? sizeStyles.fontSize;
	const resolvedLineHeight = optionTextSlotProps?.LineHeight ?? sizeStyles.lineHeight;
	const resolvedButtonZIndex = optionSlotProps?.ZIndex ?? zIndex;
	const resolvedTextZIndex = optionTextSlotProps?.ZIndex ?? resolvedButtonZIndex;
	const internalEvent: React.InstanceProps<TextButton>["Event"] = {
		MouseEnter: () => {
			if (optionDisabled) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			setHovered(false);
		},
		Activated: () => {
			if (optionDisabled) {
				return;
			}

			onSelect(option.value);
		},
	};
	const rootEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, optionSlotProps?.Event),
		optionSlotProps?.Event === undefined ? cursor : undefined,
		optionDisabled,
	);
	const rootRef = React.useCallback(
		(instance: TextButton | undefined) => {
			onInstanceChange(option, instance);
		},
		[onInstanceChange, option],
	);

	return (
		<textbutton
			AutoButtonColor={false}
			Active={!optionDisabled}
			Selectable={!optionDisabled}
			BackgroundColor3={animated.backgroundColor}
			BackgroundTransparency={animated.backgroundTransparency}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, sizeStyles.optionHeight)}
			SelectionOrder={selectionOrder}
			Text=""
			TextTransparency={1}
			TextStrokeTransparency={1}
			ZIndex={resolvedButtonZIndex}
			Event={rootEvent}
			{...optionSlotProps}
			ref={rootRef}
		>
			{renderCornerDecorator({ radius: sizeStyles.optionRadius, slotProps: slotProps?.optionCorner })}
			{renderPaddingDecorator({
				enabled: true,
				paddingTop: new UDim(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingY, "spacing", 0)),
				paddingRight: new UDim(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingX, "spacing", 0)),
				paddingBottom: new UDim(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingY, "spacing", 0)),
				paddingLeft: new UDim(0, resolveThemeSizeSafe(theme, "select", sizeStyles.optionPaddingX, "spacing", 0)),
				slotProps: slotProps?.optionPadding,
			})}
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Text={optionTextSlotProps?.Text ?? option.label}
				TextColor3={optionTextSlotProps?.TextColor3 ?? animated.textColor}
				TextTransparency={optionTextSlotProps?.TextTransparency ?? animated.textTransparency}
				TextStrokeTransparency={optionTextSlotProps?.TextStrokeTransparency ?? 1}
				TextSize={resolvedTextSize}
				Font={resolvedTextFont}
				FontFace={resolvedTextFontFace}
				LineHeight={resolvedLineHeight}
				TextWrapped={optionTextSlotProps?.TextWrapped ?? false}
				TextTruncate={optionTextSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextXAlignment={optionTextSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left}
				TextYAlignment={optionTextSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
				TextScaled={optionTextSlotProps?.TextScaled ?? false}
				RichText={optionTextSlotProps?.RichText ?? false}
				ZIndex={resolvedTextZIndex}
				{...optionTextSlotProps}
			/>
		</textbutton>
	);
}
