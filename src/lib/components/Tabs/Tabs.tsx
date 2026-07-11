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
	resolveTabsListVisualStyles,
	resolveTabsPanelVisualStyles,
	resolveTabsSizeStyles,
	resolveTabsTabMotionTransition,
	resolveTabsTabVisualStyles,
	type TabsSizeStyles,
	type TabsTabState,
	type TabsTabVisualStyles,
} from "./styles";
import { resolveTabsSelectionNeighborIndex } from "./selection";
import type { TabsPanelRenderState, TabsProps, TabsTab } from "./types";

type FrameEventMap = React.InstanceProps<Frame>["Event"];
type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
type FrameProps = React.InstanceProps<Frame>;
type TextButtonProps = React.InstanceProps<TextButton>;
type TextLabelProps = React.InstanceProps<TextLabel>;
type TabsComponent = ((props: TabsProps) => React.ReactElement) & React.ForwardRefExoticComponent<TabsProps>;

interface TabMotionValues extends Readonly<Record<string, MotionInputValue>> {
	readonly backgroundColor: Color3;
	readonly backgroundTransparency: number;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
	readonly textTransparency: number;
	readonly indicatorColor: Color3;
	readonly indicatorTransparency: number;
}

interface TabsTabViewProps {
	readonly tab: TabsTab;
	readonly index: number;
	readonly tabCount: number;
	readonly tabDisabled: boolean;
	readonly focused: boolean;
	readonly fullWidth: boolean;
	readonly interactionState: TabsTabState;
	readonly tabVisualStyles: TabsTabVisualStyles;
	readonly tabEvent: TextButtonEventMap;
	readonly nextSelectionLeft: TextButton | undefined;
	readonly nextSelectionRight: TextButton | undefined;
	readonly setTabRef: (value: string, instance: TextButton | undefined) => void;
	readonly tabSlotProps: TextButtonProps | undefined;
	readonly tabTextSlotProps: TextLabelProps | undefined;
	readonly slotProps: TabsProps["slotProps"];
	readonly theme: Theme;
	readonly sizeStyles: TabsSizeStyles;
	readonly tabTextFont: TextLabelProps["Font"];
	readonly tabTextFontFace: TextLabelProps["FontFace"];
	readonly resolvedTabZIndex: TextButtonProps["ZIndex"];
	readonly resolvedTabTextZIndex: TextLabelProps["ZIndex"];
}

function findTab(tabs: readonly TabsTab[], value: string | undefined): TabsTab | undefined {
	if (value === undefined) {
		return undefined;
	}

	for (const tab of tabs) {
		if (tab.value === value) {
			return tab;
		}
	}

	return undefined;
}

function isTabEnabled(tab: TabsTab): boolean {
	return tab.disabled !== true;
}

function resolveInitialValue(tabs: readonly TabsTab[], value: string | undefined): string | undefined {
	const matchingTab = findTab(tabs, value);
	if (matchingTab !== undefined && isTabEnabled(matchingTab)) {
		return matchingTab.value;
	}

	for (const tab of tabs) {
		if (isTabEnabled(tab)) {
			return tab.value;
		}
	}

	return tabs[0]?.value;
}

function offsetZIndex(zIndex: FrameProps["ZIndex"], offset: number): number | undefined {
	return typeIs(zIndex, "number") ? zIndex + offset : undefined;
}

function TabsTabView({
	tab,
	index,
	tabCount,
	tabDisabled,
	focused,
	fullWidth,
	interactionState,
	tabVisualStyles,
	tabEvent,
	nextSelectionLeft,
	nextSelectionRight,
	setTabRef,
	tabSlotProps,
	tabTextSlotProps,
	slotProps,
	theme,
	sizeStyles,
	tabTextFont,
	tabTextFontFace,
	resolvedTabZIndex,
	resolvedTabTextZIndex,
}: TabsTabViewProps): React.ReactElement {
	const motionValues: TabMotionValues = {
		backgroundColor: tabVisualStyles.backgroundColor,
		backgroundTransparency: tabVisualStyles.backgroundTransparency,
		strokeColor: tabVisualStyles.strokeColor,
		strokeTransparency: tabVisualStyles.strokeTransparency,
		textColor: tabVisualStyles.textColor,
		textTransparency: tabVisualStyles.textTransparency,
		indicatorColor: tabVisualStyles.indicatorColor,
		indicatorTransparency: tabVisualStyles.indicatorTransparency,
	};
	const animatedTabStyles = useMotion({
		values: motionValues,
		transition: resolveTabsTabMotionTransition(interactionState),
	});
	const tabRef = React.useCallback(
		(instance: TextButton | undefined) => {
			setTabRef(tab.value, instance);
		},
		[setTabRef, tab.value],
	);

	return (
		<textbutton
			key={tab.value}
			AutoButtonColor={false}
			Active={!tabDisabled}
			Selectable={!tabDisabled}
			BackgroundColor3={animatedTabStyles.backgroundColor}
			BackgroundTransparency={animatedTabStyles.backgroundTransparency}
			BorderSizePixel={0}
			Size={fullWidth ? new UDim2(1 / tabCount, -sizeStyles.tabGap, 1, 0) : new UDim2(0, 0, 1, 0)}
			AutomaticSize={fullWidth ? Enum.AutomaticSize.None : Enum.AutomaticSize.X}
			LayoutOrder={index}
			Text=""
			TextTransparency={1}
			TextStrokeTransparency={1}
			ZIndex={resolvedTabZIndex}
			NextSelectionLeft={nextSelectionLeft}
			NextSelectionRight={nextSelectionRight}
			Event={tabEvent}
			ref={tabRef}
			{...tabSlotProps}
		>
			{renderCornerDecorator({ radius: sizeStyles.tabRadius, slotProps: slotProps?.tabCorner })}
			{renderStrokeDecorator({
				enabled: true,
				color: animatedTabStyles.strokeColor,
				transparency: animatedTabStyles.strokeTransparency,
				thickness: 1,
				slotProps: slotProps?.tabStroke,
			})}
			{renderStrokeDecorator({
				keyName: "focus-stroke",
				enabled: focused && !tabDisabled,
				color: tabVisualStyles.strokeColor,
				transparency: 0.18,
				thickness: 2,
			})}
			<frame
				key="indicator"
				BackgroundColor3={animatedTabStyles.indicatorColor}
				BackgroundTransparency={animatedTabStyles.indicatorTransparency}
				BorderSizePixel={0}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={UDim2.fromScale(0.5, 1)}
				Size={new UDim2(1, 0, 0, 2)}
				Active={false}
				Selectable={false}
				ZIndex={resolvedTabZIndex}
			/>
			{renderPaddingDecorator({
				enabled: true,
				paddingTop: new UDim(
					0,
					resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingY, "spacing", theme.spacing.xs),
				),
				paddingRight: new UDim(
					0,
					resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingX, "spacing", theme.spacing.sm),
				),
				paddingBottom: new UDim(
					0,
					resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingY, "spacing", theme.spacing.xs),
				),
				paddingLeft: new UDim(
					0,
					resolveThemeSizeSafe(theme, "tabs", sizeStyles.tabPaddingX, "spacing", theme.spacing.sm),
				),
				slotProps: slotProps?.tabPadding,
			})}
			<textlabel
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				AutomaticSize={fullWidth ? Enum.AutomaticSize.None : Enum.AutomaticSize.X}
				Text={tabTextSlotProps?.Text ?? tab.label}
				TextColor3={tabTextSlotProps?.TextColor3 ?? animatedTabStyles.textColor}
				TextTransparency={tabTextSlotProps?.TextTransparency ?? animatedTabStyles.textTransparency}
				TextStrokeTransparency={tabTextSlotProps?.TextStrokeTransparency ?? 1}
				TextSize={tabTextSlotProps?.TextSize ?? sizeStyles.fontSize}
				Font={tabTextFont}
				FontFace={tabTextFontFace}
				LineHeight={tabTextSlotProps?.LineHeight ?? sizeStyles.lineHeight}
				TextWrapped={tabTextSlotProps?.TextWrapped ?? false}
				TextTruncate={tabTextSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				TextXAlignment={tabTextSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
				TextYAlignment={tabTextSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
				ZIndex={resolvedTabTextZIndex}
				{...tabTextSlotProps}
			/>
		</textbutton>
	);
}

const TabsBase = React.forwardRef<Frame, TabsProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		styleOverrides,
		tabs,
		variant = "line",
		color = "primary",
		size = "md",
		disabled = false,
		fullWidth = false,
		value,
		defaultValue,
		onChange,
		renderPanel: renderPanelProp,
		keepMounted = false,
		Event,
		Change,
	} = props;
	const [hoveredValue, setHoveredValue] = React.useState<string>();
	const [pressedValue, setPressedValue] = React.useState<string>();
	const [focusedValue, setFocusedValue] = React.useState<string>();
	const [tabInstances, setTabInstances] = React.useState<Readonly<Record<string, TextButton | undefined>>>({});
	const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
		resolveInitialValue(tabs, value ?? defaultValue),
	);
	const selectedValue = resolveInitialValue(tabs, value ?? uncontrolledValue);
	const selectedTab = findTab(tabs, selectedValue);
	const sizeStyles = resolveTabsSizeStyles(theme, size);
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
	} = useResolvedStyleProps("tabs", mergedStyleProps);

	React.useEffect(() => {
		if (value !== undefined) {
			setUncontrolledValue(resolveInitialValue(tabs, value));
		}
	}, [tabs, value]);

	React.useEffect(() => {
		setUncontrolledValue((currentValue) => resolveInitialValue(tabs, currentValue));
	}, [tabs]);

	React.useEffect(() => {
		if (!disabled) {
			return;
		}

		setHoveredValue(undefined);
		setPressedValue(undefined);
		setFocusedValue(undefined);
	}, [disabled]);

	const rootSlotProps = slotProps?.root;
	const listSlotProps = slotProps?.list;
	const tabSlotProps = slotProps?.tab;
	const tabTextSlotProps = slotProps?.tabText;
	const panelSlotProps = slotProps?.panel;
	const tabCount = math.max(tabs.size(), 1);
	const listVisualStyles = applyStyleOverride(
		resolveTabsListVisualStyles(theme, variant, color, disabled),
		styleOverrides?.list,
		{
			theme,
			variant,
			color,
			size,
			disabled,
		},
	);
	const panelVisualStyles = applyStyleOverride(
		resolveTabsPanelVisualStyles(theme, variant, color, disabled),
		styleOverrides?.panel,
		{
			theme,
			variant,
			color,
			size,
			disabled,
		},
	);
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedListZIndex = listSlotProps?.ZIndex ?? resolvedRootZIndex;
	const resolvedTabZIndex = tabSlotProps?.ZIndex ?? offsetZIndex(resolvedListZIndex, 2);
	const resolvedTabTextZIndex = tabTextSlotProps?.ZIndex ?? resolvedTabZIndex;
	const resolvedPanelZIndex = panelSlotProps?.ZIndex ?? resolvedRootZIndex;
	const tabTextFont = tabTextSlotProps?.Font ?? theme.fontFamily;
	const tabTextFontFace = resolveTextFontFace(tabTextSlotProps?.Font, tabTextSlotProps?.FontFace, theme.fontFamily);

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
					min: new Vector2(0, sizeStyles.listHeight + sizeStyles.panelMinHeight),
					max: undefined,
				}
			: {
					min:
						resolvedConstraint.min === undefined
							? new Vector2(0, sizeStyles.listHeight + sizeStyles.panelMinHeight)
							: new Vector2(
									resolvedConstraint.min.X,
									math.max(resolvedConstraint.min.Y, sizeStyles.listHeight + sizeStyles.panelMinHeight),
								),
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
	const setTabRef = React.useCallback((tabValue: string, instance: TextButton | undefined) => {
		setTabInstances((currentInstances) => {
			if (currentInstances[tabValue] === instance) {
				return currentInstances;
			}

			return { ...currentInstances, [tabValue]: instance };
		});
	}, []);

	const commitValue = (nextValue: string) => {
		if (disabled) {
			return;
		}

		const nextTab = findTab(tabs, nextValue);
		if (nextTab === undefined || nextTab.disabled === true || nextValue === selectedValue) {
			return;
		}

		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}

		onChange?.(nextValue);
	};

	const renderTab = (tab: TabsTab, index: number) => {
		const tabDisabled = disabled || tab.disabled === true;
		const selected = tab.value === selectedValue;
		const focused = focusedValue === tab.value;
		const interactionState: TabsTabState = tabDisabled
			? "disabled"
			: selected
				? "selected"
				: pressedValue === tab.value
					? "pressed"
					: focused
						? "focused"
						: hoveredValue === tab.value
							? "hovered"
							: "idle";
		const rawTabVisualStyles = applyStyleOverride(
			resolveTabsTabVisualStyles(theme, variant, color, interactionState),
			styleOverrides?.tab,
			{ theme, variant, color, size, tab, state: interactionState },
		);
		const previousIndex = tabDisabled ? undefined : resolveTabsSelectionNeighborIndex(tabs, index, -1);
		const nextIndex = tabDisabled ? undefined : resolveTabsSelectionNeighborIndex(tabs, index, 1);
		const tabEvent: TextButtonEventMap = {
			MouseEnter: () => {
				if (!tabDisabled) {
					setHoveredValue(tab.value);
				}
			},
			MouseLeave: () => {
				if (hoveredValue === tab.value) {
					setHoveredValue(undefined);
				}
				if (pressedValue === tab.value) {
					setPressedValue(undefined);
				}
			},
			InputBegan: (_button, input) => {
				if (!tabDisabled && isPressInput(input)) {
					setPressedValue(tab.value);
				}
			},
			InputEnded: (_button, input) => {
				if (isPressInput(input) && pressedValue === tab.value) {
					setPressedValue(undefined);
				}
			},
			SelectionGained: () => {
				if (!tabDisabled) {
					setFocusedValue(tab.value);
					commitValue(tab.value);
				}
			},
			SelectionLost: () => {
				if (focusedValue === tab.value) {
					setFocusedValue(undefined);
				}
			},
			Activated: () => {
				commitValue(tab.value);
			},
		};
		const mergedTabEvent = composeEventMaps(tabEvent, tabSlotProps?.Event);

		return (
			<TabsTabView
				key={tab.value}
				tab={tab}
				index={index}
				tabCount={tabCount}
				tabDisabled={tabDisabled}
				focused={focused}
				fullWidth={fullWidth}
				interactionState={interactionState}
				tabVisualStyles={rawTabVisualStyles}
				tabEvent={mergedTabEvent}
				nextSelectionLeft={previousIndex === undefined ? undefined : tabInstances[tabs[previousIndex].value]}
				nextSelectionRight={nextIndex === undefined ? undefined : tabInstances[tabs[nextIndex].value]}
				setTabRef={setTabRef}
				tabSlotProps={tabSlotProps}
				tabTextSlotProps={tabTextSlotProps}
				slotProps={slotProps}
				theme={theme}
				sizeStyles={sizeStyles}
				tabTextFont={tabTextFont}
				tabTextFontFace={tabTextFontFace}
				resolvedTabZIndex={resolvedTabZIndex}
				resolvedTabTextZIndex={resolvedTabTextZIndex}
			/>
		);
	};

	const renderPanelContent = (tab: TabsTab, index: number, active: boolean): React.ReactNode => {
		const renderState: TabsPanelRenderState = { index, active };
		return renderPanelProp?.(tab, renderState) ?? tab.panel;
	};

	const renderPanel = (tab: TabsTab, index: number) => {
		const active = tab.value === selectedValue;
		if (!keepMounted && !active) {
			return undefined;
		}

		return (
			<frame
				key={tab.value}
				BackgroundColor3={panelSlotProps?.BackgroundColor3 ?? panelVisualStyles.backgroundColor}
				BackgroundTransparency={panelSlotProps?.BackgroundTransparency ?? panelVisualStyles.backgroundTransparency}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				Visible={active}
				Active={false}
				Selectable={false}
				ZIndex={resolvedPanelZIndex}
				LayoutOrder={index}
				{...panelSlotProps}
			>
				{renderCornerDecorator({ radius: sizeStyles.panelRadius, slotProps: slotProps?.panelCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: panelVisualStyles.strokeColor,
					transparency: panelVisualStyles.strokeTransparency,
					thickness: 1,
					slotProps: slotProps?.panelStroke,
				})}
				{renderPaddingDecorator({
					enabled: true,
					paddingTop: new UDim(
						0,
						resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingY, "spacing", theme.spacing.sm),
					),
					paddingRight: new UDim(
						0,
						resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingX, "spacing", theme.spacing.md),
					),
					paddingBottom: new UDim(
						0,
						resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingY, "spacing", theme.spacing.sm),
					),
					paddingLeft: new UDim(
						0,
						resolveThemeSizeSafe(theme, "tabs", sizeStyles.panelPaddingX, "spacing", theme.spacing.md),
					),
					slotProps: slotProps?.panelPadding,
				})}
				{renderPanelContent(tab, index, active)}
			</frame>
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
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				Padding={new UDim(0, sizeStyles.tabGap)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 0, sizeStyles.listHeight)}
				LayoutOrder={0}
				Active={false}
				Selectable={false}
				ZIndex={resolvedListZIndex}
				{...listSlotProps}
			>
				{renderStrokeDecorator({
					enabled: variant === "contained",
					color: listVisualStyles.strokeColor,
					transparency: listVisualStyles.strokeTransparency,
					thickness: 1,
					slotProps: slotProps?.listStroke,
				})}
				{variant === "line" ? (
					<frame
						key="baseline"
						BackgroundColor3={listVisualStyles.strokeColor}
						BackgroundTransparency={listVisualStyles.strokeTransparency}
						BorderSizePixel={0}
						AnchorPoint={new Vector2(0, 1)}
						Position={UDim2.fromScale(0, 1)}
						Size={new UDim2(1, 0, 0, 1)}
						Active={false}
						Selectable={false}
						ZIndex={resolvedListZIndex}
					/>
				) : undefined}
				<frame
					key="tab-row"
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Active={false}
					Selectable={false}
					ZIndex={resolvedListZIndex}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						Padding={new UDim(0, sizeStyles.tabGap)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						HorizontalAlignment={fullWidth ? Enum.HorizontalAlignment.Center : Enum.HorizontalAlignment.Left}
						{...slotProps?.listLayout}
					/>
					{tabs.map(renderTab)}
				</frame>
			</frame>
			{selectedTab !== undefined || keepMounted ? tabs.map(renderPanel) : undefined}
		</frame>
	);
});

export const Tabs = TabsBase as TabsComponent;

Tabs.displayName = "Tabs";
