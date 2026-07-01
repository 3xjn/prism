import React from "@rbxts/react";

import { useTheme } from "@prism/theme";
import type { Variant } from "@prism/theme";

import { renderElevationShadow } from "../_shared/elevation";
import { renderCornerDecorator, renderPaddingDecorator, renderStrokeDecorator } from "../_shared/foundationDecorators";
import { LayerPortal, useOverlayLocalPosition } from "../_shared/layering";
import { resolveThemeSizeSafe } from "../_shared/useResolvedStyleProps";

import { SelectOptionRow } from "./SelectOptionRow";
import { resolveSelectListVisualStyles, type SelectSizeStyles } from "./styles";
import type { SelectColor, SelectOption, SelectProps, SelectSlotProps } from "./types";
import { incrementZIndex, resolveVisibleOptionCount, type GuiZIndex, type SelectOverlayLayout } from "./utils";

interface SelectDropdownProps {
	readonly layout: SelectOverlayLayout;
	readonly variant: Variant;
	readonly color: SelectColor;
	readonly options: readonly SelectOption[];
	readonly currentValue: string | undefined;
	readonly sizeStyles: SelectSizeStyles;
	readonly maxVisibleOptions: number;
	readonly slotProps: SelectSlotProps | undefined;
	readonly cursor: SelectProps["cursor"];
	readonly zIndex: GuiZIndex | undefined;
	readonly onSelect: (value: string) => void;
}

export function SelectDropdown(props: SelectDropdownProps): React.ReactElement {
	const theme = useTheme();
	const { layout, variant, color, options, currentValue, sizeStyles, maxVisibleOptions, slotProps, cursor, zIndex, onSelect } = props;
	const [overlayFrame, setOverlayFrame] = React.useState<Frame>();
	const overlaySlotProps = slotProps?.overlay;
	const listSlotProps = slotProps?.list;
	const listViewportSlotProps = slotProps?.listViewport;
	const listVisualStyles = resolveSelectListVisualStyles(theme, color, variant);
	const listPadding = resolveThemeSizeSafe(theme, "select", sizeStyles.listPadding, "spacing", 0);
	const visibleOptionCount = math.min(options.size(), resolveVisibleOptionCount(maxVisibleOptions));
	const visibleListHeight =
		listPadding * 2 + sizeStyles.optionHeight * visibleOptionCount + sizeStyles.optionGap * math.max(visibleOptionCount - 1, 0);
	const scrollingEnabled = options.size() > visibleOptionCount;
	const resolvedOverlayZIndex = overlaySlotProps?.ZIndex ?? zIndex;
	const resolvedListZIndex = listSlotProps?.ZIndex ?? incrementZIndex(resolvedOverlayZIndex, 1);
	const resolvedViewportZIndex = listViewportSlotProps?.ZIndex ?? resolvedListZIndex;
	const localListPosition = useOverlayLocalPosition(overlayFrame, layout.position);

	return (
		<LayerPortal target={layout.portalTarget}>
			<frame
				ref={setOverlayFrame}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0, 0)}
				Position={UDim2.fromOffset(0, 0)}
				Size={UDim2.fromScale(1, 1)}
				Active={false}
				Selectable={false}
				ZIndex={resolvedOverlayZIndex}
				{...overlaySlotProps}
			>
				{localListPosition !== undefined ? (
					<frame
						key="list-shadow"
						BackgroundTransparency={1}
						BorderSizePixel={0}
						AnchorPoint={new Vector2(0, 0)}
						Position={new UDim2(0, localListPosition.X, 0, localListPosition.Y)}
						Size={new UDim2(0, layout.size.X, 0, visibleListHeight)}
						Active={false}
						Selectable={false}
						ZIndex={resolvedOverlayZIndex}
					>
						{renderElevationShadow({ shadow: theme.shadows.md, radius: sizeStyles.radius })}
					</frame>
				) : undefined}
				{localListPosition !== undefined ? (
					<frame
						BackgroundColor3={listVisualStyles.backgroundColor}
						BackgroundTransparency={0}
						BorderSizePixel={0}
						AnchorPoint={new Vector2(0, 0)}
						ClipsDescendants={true}
						Position={new UDim2(0, localListPosition.X, 0, localListPosition.Y)}
						Size={new UDim2(0, layout.size.X, 0, visibleListHeight)}
						ZIndex={resolvedListZIndex}
						{...listSlotProps}
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
							{options.map((option) => (
								<SelectOptionRow
									key={option.value}
									option={option}
									selected={currentValue === option.value}
									color={color}
									sizeStyles={sizeStyles}
									slotProps={slotProps}
									zIndex={resolvedViewportZIndex}
									cursor={cursor}
									onSelect={onSelect}
								/>
							))}
						</scrollingframe>
					</frame>
				) : undefined}
			</frame>
		</LayerPortal>
	);
}
