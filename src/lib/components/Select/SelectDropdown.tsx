import React from "@rbxts/react";

import { useTheme } from "@prism/theme";
import type { Variant } from "@prism/theme";

import { renderElevationShadow } from "../_shared/elevation";
import { renderCornerDecorator, renderPaddingDecorator, renderStrokeDecorator } from "../_shared/foundationDecorators";
import { OutsidePressLayer } from "../_shared/OutsidePressLayer";
import { applyStyleOverride } from "../_shared/styleOverride";
import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";

import { SelectOptionRow } from "./SelectOptionRow";
import { resolveSelectListVisualStyles, type SelectSizeStyles } from "./styles";
import type { SelectColor, SelectOption, SelectProps, SelectSize, SelectSlotProps, SelectStyleOverrides } from "./types";
import { incrementZIndex, resolveVisibleOptionCount, type GuiZIndex, type SelectOverlayPlacement } from "./utils";

interface SelectDropdownProps {
	readonly placement: SelectOverlayPlacement;
	readonly localAnchorPosition: Vector2;
	readonly overlayZIndex: GuiZIndex | undefined;
	readonly variant: Variant;
	readonly color: SelectColor;
	readonly size: SelectSize;
	readonly options: readonly SelectOption[];
	readonly currentValue: string | undefined;
	readonly sizeStyles: SelectSizeStyles;
	readonly maxVisibleOptions: number;
	readonly slotProps: SelectSlotProps | undefined;
	readonly styleOverrides: SelectStyleOverrides | undefined;
	readonly cursor: SelectProps["cursor"];
	readonly closeOnOutsidePress: boolean;
	readonly setListInstance: (instance: Frame | undefined) => void;
	readonly setPreferredOptionInstance: (instance: TextButton | undefined) => void;
	readonly onOutsidePress: () => void;
	readonly onSelect: (value: string) => void;
}

export function SelectDropdown(props: SelectDropdownProps): React.ReactElement {
	const theme = useTheme();
	const {
		placement,
		localAnchorPosition,
		overlayZIndex,
		variant,
		color,
		size,
		options,
		currentValue,
		sizeStyles,
		maxVisibleOptions,
		slotProps,
		styleOverrides,
		cursor,
		closeOnOutsidePress,
		setListInstance: setExternalListInstance,
		setPreferredOptionInstance,
		onOutsidePress,
		onSelect,
	} = props;
	const [listInstance, setListInstanceState] = React.useState<Frame>();
	const optionInstancesRef = React.useRef(new Map<string, TextButton>());
	const outsideCaptureSlotProps = slotProps?.outsideCapture;
	const listSlotProps = slotProps?.list;
	const listViewportSlotProps = slotProps?.listViewport;
	const listVisualStyles = applyStyleOverride(resolveSelectListVisualStyles(theme, color, variant), styleOverrides?.list, {
		theme,
		variant,
		color,
		size,
	});
	const listPadding = resolveThemeSizeSafe(theme, "select", sizeStyles.listPadding, "spacing", 0);
	const visibleOptionCount = math.min(options.size(), resolveVisibleOptionCount(maxVisibleOptions));
	const visibleListHeight =
		listPadding * 2 + sizeStyles.optionHeight * visibleOptionCount + sizeStyles.optionGap * math.max(visibleOptionCount - 1, 0);
	const scrollingEnabled = options.size() > visibleOptionCount;
	const resolvedOutsideCaptureZIndex = outsideCaptureSlotProps?.ZIndex ?? overlayZIndex;
	const resolvedListZIndex = listSlotProps?.ZIndex ?? incrementZIndex(resolvedOutsideCaptureZIndex, 1);
	const resolvedViewportZIndex = listViewportSlotProps?.ZIndex ?? resolvedListZIndex;
	const resolvePreferredOptionInstance = React.useCallback(() => {
		if (currentValue !== undefined) {
			const selectedOption = options.find((option) => option.value === currentValue && option.disabled !== true);
			if (selectedOption !== undefined) {
				const selectedInstance = optionInstancesRef.current.get(selectedOption.value);
				if (selectedInstance !== undefined) {
					return selectedInstance;
				}
			}
		}

		for (const option of options) {
			if (option.disabled !== true) {
				const optionInstance = optionInstancesRef.current.get(option.value);
				if (optionInstance !== undefined) {
					return optionInstance;
				}
			}
		}

		return undefined;
	}, [currentValue, options]);
	const syncPreferredOptionInstance = React.useCallback(() => {
		setPreferredOptionInstance(resolvePreferredOptionInstance());
	}, [resolvePreferredOptionInstance, setPreferredOptionInstance]);
	const handleOptionInstance = React.useCallback(
		(option: SelectOption, instance: TextButton | undefined) => {
			if (instance === undefined) {
				optionInstancesRef.current.delete(option.value);
			} else {
				optionInstancesRef.current.set(option.value, instance);
			}

			syncPreferredOptionInstance();
		},
		[syncPreferredOptionInstance],
	);
	const listRef = React.useCallback(
		(instance: Frame | undefined) => {
			setListInstanceState((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			setExternalListInstance(instance);
		},
		[setExternalListInstance],
	);

	React.useEffect(() => {
		syncPreferredOptionInstance();
	}, [syncPreferredOptionInstance]);

	React.useEffect(() => {
		return () => {
			setPreferredOptionInstance(undefined);
		};
	}, [setPreferredOptionInstance]);

	return (
		<>
			<OutsidePressLayer
				active={closeOnOutsidePress}
				excludeInstances={listInstance !== undefined ? [listInstance] : undefined}
				zIndex={resolvedOutsideCaptureZIndex}
				onOutsidePress={onOutsidePress}
				slotProps={outsideCaptureSlotProps}
			/>
			<frame
				key="list-shadow"
				BackgroundTransparency={1}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0, localAnchorPosition.X, 0, localAnchorPosition.Y)}
				Size={new UDim2(0, placement.dropdownSize.X, 0, visibleListHeight)}
				Active={false}
				Selectable={false}
				ZIndex={resolvedOutsideCaptureZIndex}
			>
				{renderElevationShadow({ shadow: theme.shadows.md, radius: sizeStyles.radius })}
			</frame>
			<frame
				BackgroundColor3={listVisualStyles.backgroundColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 0)}
				ClipsDescendants={true}
				Position={new UDim2(0, localAnchorPosition.X, 0, localAnchorPosition.Y)}
				Size={new UDim2(0, placement.dropdownSize.X, 0, visibleListHeight)}
				SelectionGroup={true}
				SelectionBehaviorUp={Enum.SelectionBehavior.Stop}
				SelectionBehaviorDown={Enum.SelectionBehavior.Stop}
				SelectionBehaviorLeft={Enum.SelectionBehavior.Stop}
				SelectionBehaviorRight={Enum.SelectionBehavior.Stop}
				ZIndex={resolvedListZIndex}
				{...listSlotProps}
				ref={listRef}
			>
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.listCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: listVisualStyles.strokeColor,
					transparency: listVisualStyles.strokeTransparency,
					thickness: 1,
					slotProps: slotProps?.listStroke,
				})}
				<scrollingframe
					Active={scrollingEnabled}
					AutomaticCanvasSize={Enum.AutomaticSize.Y}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					CanvasSize={UDim2.fromOffset(0, 0)}
					Position={UDim2.fromOffset(0, 0)}
					ScrollBarImageColor3={theme.colors.text.disabled}
					ScrollBarImageTransparency={0.2}
					ScrollBarThickness={scrollingEnabled ? theme.spacing.xs : 0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
					ScrollingEnabled={scrollingEnabled}
					Selectable={false}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={resolvedViewportZIndex}
					{...listViewportSlotProps}
				>
					{renderPaddingDecorator({
						enabled: true,
						paddingTop: new UDim(0, listPadding),
						paddingRight: new UDim(0, listPadding),
						paddingBottom: new UDim(0, listPadding),
						paddingLeft: new UDim(0, listPadding),
						slotProps: slotProps?.listPadding,
					})}
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, sizeStyles.optionGap)}
						{...slotProps?.optionsLayout}
					/>
					{options.map((option, index) => (
						<SelectOptionRow
							key={option.value}
							option={option}
							selected={currentValue === option.value}
							color={color}
							size={size}
							sizeStyles={sizeStyles}
							slotProps={slotProps}
							styleOverrides={styleOverrides}
							zIndex={resolvedViewportZIndex}
							cursor={cursor}
							selectionOrder={index + 1}
							onInstanceChange={handleOptionInstance}
							onSelect={onSelect}
						/>
					))}
				</scrollingframe>
			</frame>
		</>
	);
}
