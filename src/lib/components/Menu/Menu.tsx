import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";

import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { Popover } from "../Popover";
import type { PopoverSlotProps } from "../Popover";
import { renderCornerDecorator, renderPaddingDecorator } from "../_shared/foundationDecorators";
import { assignRef, composeEventMaps } from "../_shared/interaction";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { resolveTextFontFace } from "../_shared/textFont";
import { usePressInteraction } from "../_shared/usePressInteraction";
import { reportComponentFailure, resolveThemeSizeSafe, resolveUDimSafe } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import {
	resolveMenuItemMotionTransition,
	resolveMenuItemVisualStyles,
	resolveMenuPanelVisualStyles,
	resolveMenuSizeStyles,
	type MenuItemState,
	type MenuSizeStyles,
} from "./styles";
import type { MenuActionItem, MenuItem, MenuProps } from "./types";

const TextService = game.GetService("TextService");

type MenuComponent = ((props: MenuProps) => React.ReactElement) & React.ForwardRefExoticComponent<MenuProps>;

function isMenuActionItem(item: MenuItem): item is MenuActionItem {
	return item.type === undefined || item.type === "item";
}

function resolveRowHeight(item: MenuItem, sizeStyles: MenuSizeStyles): number {
	if (item.type === "divider") {
		return sizeStyles.dividerHeight;
	}

	if (item.type === "label") {
		return sizeStyles.labelHeight;
	}

	return sizeStyles.itemHeight;
}

function resolveVisibleListHeight(items: readonly MenuItem[], maxVisibleItems: number, sizeStyles: MenuSizeStyles): number {
	let height = 0;
	let visibleRows = 0;

	for (const item of items) {
		if (visibleRows >= maxVisibleItems) {
			break;
		}

		height += resolveRowHeight(item, sizeStyles);
		visibleRows += 1;
	}

	return height + math.max(0, visibleRows - 1) * sizeStyles.itemGap;
}

function resolveMenuPanelWidth(props: MenuProps, sizeStyles: MenuSizeStyles): UDim {
	return props.panelWidth !== undefined
		? resolveUDimSafe("menu", props.panelWidth, "panelWidth", new UDim(0, sizeStyles.panelWidth))
		: new UDim(0, sizeStyles.panelWidth);
}

function resolveRightSectionWidth(panelWidth: UDim): UDim {
	return new UDim(panelWidth.Scale * 0.34, math.floor(panelWidth.Offset * 0.34));
}

function resolveMenuItemIcon(
	icon: IconName | React.ReactElement | undefined,
	iconSize: number,
): React.ReactNode {
	if (icon === undefined) {
		return undefined;
	}

	if (typeIs(icon, "string")) {
		return <Icon name={icon} size={iconSize} />;
	}

	if (React.isValidElement(icon)) {
		return icon;
	}

	// Untyped (Luau) callers can pass anything; drop the icon with the
	// shared failure policy instead of crashing the React reconciler.
	reportComponentFailure("menu", `Invalid item icon ${tostring(icon)}. Expected an icon name or a React element.`);
	return undefined;
}

function resolvePrimitiveMenuSection(value: React.ReactElement | string | number | undefined): string | number | undefined {
	return typeIs(value, "string") || typeIs(value, "number") ? value : undefined;
}

function resolveRichMenuSection(value: React.ReactElement | string | number | undefined): React.ReactElement | undefined {
	if (value === undefined || typeIs(value, "string") || typeIs(value, "number")) {
		return undefined;
	}

	return value;
}

function MenuActionRow({
	item,
	sizeStyles,
	slotProps,
	zIndex,
	cursor,
	rightSectionWidth,
	onPress,
}: {
	readonly item: MenuActionItem;
	readonly sizeStyles: MenuSizeStyles;
	readonly slotProps: MenuProps["slotProps"];
	readonly zIndex: React.InstanceProps<TextButton>["ZIndex"] | undefined;
	readonly cursor: MenuProps["cursor"];
	readonly rightSectionWidth: UDim;
	readonly onPress: (item: MenuActionItem) => void;
}): React.ReactElement {
	const theme = useTheme();
	const itemSlotProps = slotProps?.item;
	const itemLabelSlotProps = slotProps?.itemLabel;
	const itemRightLabelSlotProps = slotProps?.itemRightLabel;
	const disabled = item.disabled === true;
	const press = usePressInteraction({
		interactive: !disabled,
		onActivated: () => {
			onPress(item);
		},
	});

	const state: MenuItemState = press.state;
	const visualStyles = resolveMenuItemVisualStyles(theme, item.color, state);
	const animated = useMotion({
		values: {
			backgroundColor: visualStyles.backgroundColor,
			backgroundTransparency: visualStyles.backgroundTransparency,
			textColor: visualStyles.textColor,
			textTransparency: visualStyles.textTransparency,
			rightTextColor: visualStyles.rightTextColor,
			rightTextTransparency: visualStyles.rightTextTransparency,
		},
		transition: resolveMenuItemMotionTransition(state),
	});
	const resolvedLabelFont = itemLabelSlotProps?.Font ?? theme.fontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(itemLabelSlotProps?.Font, itemLabelSlotProps?.FontFace, theme.fontFamily);
	const resolvedRightLabelFont = itemRightLabelSlotProps?.Font ?? theme.fontFamily;
	const resolvedRightLabelFontFace = resolveTextFontFace(itemRightLabelSlotProps?.Font, itemRightLabelSlotProps?.FontFace, theme.fontFamily);
	const resolvedItemZIndex = itemSlotProps?.ZIndex ?? zIndex;
	const resolvedContentZIndex = incrementZIndex(resolvedItemZIndex, 1);
	const resolvedLabelZIndex = itemLabelSlotProps?.ZIndex ?? resolvedContentZIndex;
	const resolvedRightSectionZIndex = slotProps?.itemRightSection?.ZIndex ?? resolvedContentZIndex;
	const resolvedRightLabelZIndex = itemRightLabelSlotProps?.ZIndex ?? incrementZIndex(resolvedRightSectionZIndex, 1);
	const primitiveRightSection = resolvePrimitiveMenuSection(item.rightSection);
	const richRightSection = resolveRichMenuSection(item.rightSection);
	const hasIcon = item.icon !== undefined;
	const hasRightSection = item.rightSection !== undefined;
	const iconReservedWidth = hasIcon ? sizeStyles.iconSize + sizeStyles.itemGap : 0;
	// Primitive sections reserve their measured text width; only rich
	// (element) sections fall back to the fractional panel reservation.
	const rightSlotText = itemRightLabelSlotProps?.Text;
	const rightSlotTextSize = itemRightLabelSlotProps?.TextSize;
	const measuredRightSectionWidth =
		primitiveRightSection !== undefined && richRightSection === undefined
			? math.ceil(
					TextService.GetTextSize(
						typeIs(rightSlotText, "string") ? rightSlotText : tostring(primitiveRightSection),
						typeIs(rightSlotTextSize, "number") ? rightSlotTextSize : sizeStyles.metaFontSize,
						typeIs(resolvedRightLabelFont, "EnumItem") ? (resolvedRightLabelFont as Enum.Font) : theme.fontFamily,
						new Vector2(1000, 100),
					).X,
				) + 2
			: undefined;
	const resolvedRightSectionWidth =
		measuredRightSectionWidth !== undefined ? new UDim(0, measuredRightSectionWidth) : rightSectionWidth;
	const rightReservedScale = hasRightSection ? resolvedRightSectionWidth.Scale : 0;
	const rightReservedWidth = hasRightSection ? resolvedRightSectionWidth.Offset + sizeStyles.itemGap : 0;
	const event = useRootCursorEvent(
		composeEventMaps(press.eventMap, itemSlotProps?.Event),
		itemSlotProps?.Event === undefined ? cursor ?? "pointer" : undefined,
		disabled,
	);

	return (
		<textbutton
			AutoButtonColor={false}
			Active={!disabled}
			Selectable={!disabled}
			BackgroundColor3={animated.backgroundColor}
			BackgroundTransparency={animated.backgroundTransparency}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, sizeStyles.itemHeight)}
			Text=""
			TextTransparency={1}
			TextStrokeTransparency={1}
			ZIndex={resolvedItemZIndex}
			Event={event}
			{...itemSlotProps}
		>
			{renderCornerDecorator({ radius: sizeStyles.itemRadius, slotProps: slotProps?.itemCorner })}
			{renderPaddingDecorator({
				enabled: true,
				paddingTop: new UDim(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingY, "spacing", 0)),
				paddingRight: new UDim(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingX, "spacing", 0)),
				paddingBottom: new UDim(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingY, "spacing", 0)),
				paddingLeft: new UDim(0, resolveThemeSizeSafe(theme, "menu", sizeStyles.itemPaddingX, "spacing", 0)),
				slotProps: slotProps?.itemPadding,
			})}
			{slotProps?.itemLayout !== undefined ? (
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, sizeStyles.itemGap)}
					{...slotProps.itemLayout}
				/>
			) : undefined}
			{item.icon !== undefined ? (
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromOffset(sizeStyles.iconSize, sizeStyles.iconSize)}
					Position={UDim2.fromScale(0, 0.5)}
					AnchorPoint={new Vector2(0, 0.5)}
					ZIndex={slotProps?.itemIcon?.ZIndex ?? resolvedContentZIndex}
					{...slotProps?.itemIcon}
				>
					{resolveMenuItemIcon(item.icon, sizeStyles.iconSize)}
				</frame>
			) : undefined}
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromOffset(iconReservedWidth, 0)}
				Size={new UDim2(1 - rightReservedScale, -(iconReservedWidth + rightReservedWidth), 1, 0)}
				Text={itemLabelSlotProps?.Text ?? tostring(item.label)}
				TextColor3={itemLabelSlotProps?.TextColor3 ?? animated.textColor}
				TextTransparency={itemLabelSlotProps?.TextTransparency ?? animated.textTransparency}
				TextStrokeTransparency={itemLabelSlotProps?.TextStrokeTransparency ?? 1}
				TextSize={itemLabelSlotProps?.TextSize ?? sizeStyles.fontSize}
				Font={resolvedLabelFont}
				FontFace={resolvedLabelFontFace}
				LineHeight={itemLabelSlotProps?.LineHeight ?? sizeStyles.lineHeight}
				TextWrapped={itemLabelSlotProps?.TextWrapped ?? false}
				TextTruncate={itemLabelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextXAlignment={itemLabelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left}
				TextYAlignment={itemLabelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
				TextScaled={itemLabelSlotProps?.TextScaled ?? false}
				RichText={itemLabelSlotProps?.RichText ?? false}
				ZIndex={resolvedLabelZIndex}
				{...itemLabelSlotProps}
			/>
			{item.rightSection !== undefined ? (
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={new UDim2(resolvedRightSectionWidth, new UDim(1, 0))}
					Position={UDim2.fromScale(1, 0)}
					AnchorPoint={new Vector2(1, 0)}
					ZIndex={resolvedRightSectionZIndex}
					{...slotProps?.itemRightSection}
				>
					{richRightSection ?? (
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={UDim2.fromScale(1, 1)}
							Text={itemRightLabelSlotProps?.Text ?? tostring(primitiveRightSection)}
							TextColor3={itemRightLabelSlotProps?.TextColor3 ?? animated.rightTextColor}
							TextTransparency={itemRightLabelSlotProps?.TextTransparency ?? animated.rightTextTransparency}
							TextStrokeTransparency={itemRightLabelSlotProps?.TextStrokeTransparency ?? 1}
							TextSize={itemRightLabelSlotProps?.TextSize ?? sizeStyles.metaFontSize}
							Font={resolvedRightLabelFont}
							FontFace={resolvedRightLabelFontFace}
							LineHeight={itemRightLabelSlotProps?.LineHeight ?? sizeStyles.lineHeight}
							TextWrapped={itemRightLabelSlotProps?.TextWrapped ?? false}
							TextTruncate={itemRightLabelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
							TextXAlignment={itemRightLabelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Right}
							TextYAlignment={itemRightLabelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={itemRightLabelSlotProps?.TextScaled ?? false}
							RichText={itemRightLabelSlotProps?.RichText ?? false}
							ZIndex={resolvedRightLabelZIndex}
							{...itemRightLabelSlotProps}
						/>
					)}
				</frame>
			) : undefined}
		</textbutton>
	);
}

function MenuPanel({ props, opened, setOpened }: { readonly props: MenuProps; readonly opened: boolean; readonly setOpened: (opened: boolean) => void }): React.ReactElement {
	const theme = useTheme();
	const { items, slotProps, closeOnItemPress = true, maxVisibleItems = 6, size = "md" } = props;
	const sizeStyles = resolveMenuSizeStyles(theme, size);
	const panelVisualStyles = resolveMenuPanelVisualStyles(theme);
	const listPadding = resolveThemeSizeSafe(theme, "menu", sizeStyles.listPadding, "spacing", 0);
	const labelPaddingX = resolveThemeSizeSafe(theme, "menu", sizeStyles.labelPaddingX, "spacing", 0);
	const clampedMaxVisibleItems = math.max(1, maxVisibleItems);
	const visibleHeight = resolveVisibleListHeight(items, clampedMaxVisibleItems, sizeStyles);
	const totalHeight = resolveVisibleListHeight(items, math.max(items.size(), 1), sizeStyles);
	const scrollable = totalHeight > visibleHeight + 1;
	const panelWidth = resolveMenuPanelWidth(props, sizeStyles);
	const rightSectionWidth = resolveRightSectionWidth(panelWidth);
	const listZIndex = slotProps?.list?.ZIndex;
	const contentZIndex = incrementZIndex(listZIndex, 1);
	const dividerZIndex = slotProps?.divider?.ZIndex ?? contentZIndex;
	const groupLabelZIndex = slotProps?.groupLabel?.ZIndex ?? contentZIndex;
	const resolvedGroupLabelFont = slotProps?.groupLabel?.Font ?? theme.fontFamily;
	const resolvedGroupLabelFontFace = resolveTextFontFace(slotProps?.groupLabel?.Font, slotProps?.groupLabel?.FontFace, theme.fontFamily);
	const onItemPress = React.useCallback(
		(item: MenuActionItem) => {
			item.onPress?.(item.value);
			props.onItemPress?.(item.value);

			if (closeOnItemPress && item.closeMenuOnPress !== false) {
				setOpened(false);
			}
		},
		[closeOnItemPress, props, setOpened],
	);

	return (
		<scrollingframe
			Active={scrollable}
			AutomaticCanvasSize={Enum.AutomaticSize.Y}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			CanvasSize={UDim2.fromOffset(0, 0)}
			ScrollBarImageColor3={theme.colors.text.disabled}
			ScrollBarImageTransparency={0.2}
			ScrollBarThickness={scrollable ? sizeStyles.scrollBarThickness : 0}
			ScrollingDirection={Enum.ScrollingDirection.Y}
			ScrollingEnabled={scrollable}
			Selectable={false}
			Size={new UDim2(panelWidth, new UDim(0, visibleHeight + listPadding * 2))}
			ZIndex={listZIndex}
			{...slotProps?.list}
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
				Padding={new UDim(0, sizeStyles.itemGap)}
				{...slotProps?.listLayout}
			/>
			{items.map((item, index) => {
				if (item.type === "divider") {
					return (
						<frame
							key={`divider-${index}`}
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={new UDim2(1, 0, 0, sizeStyles.dividerHeight)}
							ZIndex={dividerZIndex}
							{...slotProps?.divider}
						>
							<frame
								BackgroundColor3={panelVisualStyles.dividerColor}
								BackgroundTransparency={panelVisualStyles.dividerTransparency}
								BorderSizePixel={0}
								Position={UDim2.fromOffset(sizeStyles.dividerInset, math.floor(sizeStyles.dividerHeight / 2))}
								Size={new UDim2(1, -(sizeStyles.dividerInset * 2), 0, 1)}
								ZIndex={incrementZIndex(dividerZIndex, 1)}
							/>
						</frame>
					);
				}

				if (item.type === "label") {
					return (
						<textlabel
							key={`label-${index}`}
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={new UDim2(1, -labelPaddingX, 0, sizeStyles.labelHeight)}
							Position={UDim2.fromOffset(labelPaddingX, 0)}
							Text={slotProps?.groupLabel?.Text ?? tostring(item.label)}
							TextColor3={slotProps?.groupLabel?.TextColor3 ?? panelVisualStyles.labelColor}
							TextTransparency={slotProps?.groupLabel?.TextTransparency ?? panelVisualStyles.labelTransparency}
							TextStrokeTransparency={slotProps?.groupLabel?.TextStrokeTransparency ?? 1}
							TextSize={slotProps?.groupLabel?.TextSize ?? sizeStyles.metaFontSize}
							Font={resolvedGroupLabelFont}
							FontFace={resolvedGroupLabelFontFace}
							LineHeight={slotProps?.groupLabel?.LineHeight ?? sizeStyles.lineHeight}
							TextWrapped={slotProps?.groupLabel?.TextWrapped ?? false}
							TextTruncate={slotProps?.groupLabel?.TextTruncate ?? Enum.TextTruncate.AtEnd}
							TextXAlignment={slotProps?.groupLabel?.TextXAlignment ?? Enum.TextXAlignment.Left}
							TextYAlignment={slotProps?.groupLabel?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={slotProps?.groupLabel?.TextScaled ?? false}
							RichText={slotProps?.groupLabel?.RichText ?? false}
							ZIndex={groupLabelZIndex}
							{...slotProps?.groupLabel}
						/>
					);
				}

				if (isMenuActionItem(item)) {
					return (
						<MenuActionRow
							key={item.value}
							item={item}
							sizeStyles={sizeStyles}
							slotProps={slotProps}
							zIndex={contentZIndex}
							cursor={props.cursor}
							rightSectionWidth={rightSectionWidth}
							onPress={onItemPress}
						/>
					);
				}

				return undefined;
			})}
			{items.isEmpty() ? (
				<textlabel
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, sizeStyles.itemHeight)}
					Text="No actions"
					TextColor3={theme.colors.text.disabled}
					TextSize={sizeStyles.fontSize}
					Font={theme.fontFamily}
					FontFace={Font.fromEnum(theme.fontFamily)}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Center}
					ZIndex={contentZIndex}
				/>
			) : undefined}
		</scrollingframe>
	);
}

const MenuBase = React.forwardRef<Frame, MenuProps>((props, ref) => {
	const {
		children,
		disabled = false,
		opened,
		defaultOpened = false,
		onOpenedChange,
		placement = "bottom",
		align = "start",
		triggerMode = "click",
		closeOnOutsidePress = true,
		gap,
		offset,
		Event,
		Change,
		slotProps,
	} = props;
	const [uncontrolledOpened, setUncontrolledOpened] = React.useState(defaultOpened);
	const isOpen = opened ?? uncontrolledOpened;
	const setOpened = React.useCallback(
		(nextOpened: boolean) => {
			if (opened === undefined) {
				setUncontrolledOpened(nextOpened);
			}

			if (nextOpened !== isOpen) {
				onOpenedChange?.(nextOpened);
			}
		},
		[isOpen, onOpenedChange, opened],
	);
	const rootRef = React.useCallback(
		(instance: Frame | undefined) => {
			assignRef(ref, instance);
		},
		[ref],
	);
	const panelVisualStyles = resolveMenuPanelVisualStyles(useTheme());
	const popoverPanelPaddingSlotProps = {
		PaddingTop: new UDim(0, 0),
		PaddingRight: new UDim(0, 0),
		PaddingBottom: new UDim(0, 0),
		PaddingLeft: new UDim(0, 0),
		...slotProps?.panelPadding,
	};
	const popoverSlotProps: PopoverSlotProps = {
		root: slotProps?.root,
		sizeConstraint: slotProps?.sizeConstraint,
		trigger: slotProps?.trigger,
		overlay: slotProps?.overlay,
		outsideCapture: slotProps?.outsideCapture,
		panel: {
			BackgroundColor3: panelVisualStyles.backgroundColor,
			...slotProps?.panel,
		},
		panelCorner: slotProps?.panelCorner,
		panelStroke: {
			Color: panelVisualStyles.strokeColor,
			Transparency: panelVisualStyles.strokeTransparency,
			...slotProps?.panelStroke,
		},
		panelPadding: popoverPanelPaddingSlotProps,
		content: slotProps?.content,
	};

	return (
		<Popover
			content={<MenuPanel props={props} opened={isOpen} setOpened={setOpened} />}
			placement={placement}
			align={align}
			triggerMode={triggerMode}
			disabled={disabled}
			opened={isOpen}
			defaultOpened={defaultOpened}
			onOpenedChange={setOpened}
			closeOnOutsidePress={closeOnOutsidePress}
			gap={gap}
			offset={offset}
			width={props.width}
			height={props.height}
			minWidth={props.minWidth}
			maxWidth={props.maxWidth}
			minHeight={props.minHeight}
			maxHeight={props.maxHeight}
			position={props.position}
			anchor={props.anchor}
			center={props.center}
			clip={props.clip}
			visible={props.visible}
			layoutOrder={props.layoutOrder}
			zIndex={props.zIndex}
			cursor={props.cursor}
			Event={Event}
			Change={Change}
			slotProps={popoverSlotProps}
			ref={rootRef}
		>
			{children}
		</Popover>
	);
});

export const Menu = MenuBase as MenuComponent;

Menu.displayName = "Menu";
