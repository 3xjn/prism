import React from "@rbxts/react";

import { theme as themeRefs, type Theme } from "@prism/theme";

import { Divider } from "../Divider";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { CaptureOverlay, ScreenOverlayLayer } from "../_shared/layering";
import {
	renderCornerDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { renderElevationShadow } from "../_shared/elevation";
import { incrementZIndex, type GuiZIndex } from "../_shared/overlayLayerPolicy";
import type { SharedSizeConstraint } from "../_shared/useResolvedStyleProps";

import { WindowChromeButton } from "./WindowChromeButton";
import type { WindowSizeStyles } from "./styles";
import type { WindowSlotProps } from "./types";

type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];

export interface WindowViewProps {
	readonly theme: Theme;
	readonly sizeStyles: WindowSizeStyles;
	readonly slotProps: WindowSlotProps | undefined;
	readonly overlayZIndex: GuiZIndex | undefined;
	readonly overlayRef: (instance: Frame | undefined) => void;
	readonly windowRef: (instance: Frame | undefined) => void;
	readonly controlsRef: (instance: Frame | undefined) => void;
	readonly rootInstanceProps: Partial<React.InstanceProps<Frame>>;
	readonly resolvedConstraint: SharedSizeConstraint | undefined;
	readonly shadowZIndex: number;
	readonly collapsed: boolean;
	readonly collapseControlZIndex: GuiZIndex | undefined;
	readonly collapseControlEvent: TextButtonEventMap | undefined;
	readonly titleBarZIndex: GuiZIndex | undefined;
	readonly titleBarEvent: React.InstanceProps<Frame>["Event"];
	readonly leading: React.ReactNode;
	readonly title: string | number | undefined;
	readonly titleLeft: number;
	readonly titleWidthOffset: number;
	readonly controlsZIndex: GuiZIndex | undefined;
	readonly trailing: React.ReactNode;
	readonly controlRadius: UDim;
	readonly maximized: boolean;
	readonly hasClose: boolean;
	readonly onCollapse: () => void;
	readonly onToggleMaximized: () => void;
	readonly onClose: (() => void) | undefined;
	readonly chromeInputBegan: (input: InputObject) => void;
	readonly bodyZIndex: GuiZIndex | undefined;
	readonly rail: React.ReactNode;
	readonly children: React.ReactNode;
	readonly canResize: boolean;
	readonly resizeHandleZIndex: GuiZIndex | undefined;
	readonly resizeHandleEvent: TextButtonEventMap | undefined;
	readonly mouseDragCaptureActive: boolean;
	readonly portalTarget: LayerCollector | undefined;
	readonly dragCaptureOverlayEvent: TextButtonEventMap | undefined;
}

export function WindowView(props: WindowViewProps) {
	const sizeStyles = props.sizeStyles;
	const slotProps = props.slotProps;
	const titleBarZIndex = props.titleBarZIndex;
	const bodyZIndex = props.bodyZIndex;
	const hasRail = props.rail !== undefined;
	const railWidth = hasRail ? sizeStyles.railMinWidth : 0;
	const railDividerWidth = hasRail ? 1 : 0;
	const bodyLeftOffset = railWidth + railDividerWidth;

	return (
		<ScreenOverlayLayer zIndex={props.overlayZIndex} slotProps={slotProps?.overlay}>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Active={false}
				Selectable={false}
				ZIndex={props.overlayZIndex}
				ref={props.overlayRef}
			/>
			<frame {...props.rootInstanceProps} {...slotProps?.root} ref={props.windowRef}>
				{renderElevationShadow({
					shadow: props.theme.shadows.md,
					radius: sizeStyles.radius,
					zIndex: props.shadowZIndex,
					slotProps: { root: slotProps?.shadow },
				})}
				{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.rootCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: props.theme.colors.border.default,
					thickness: 1,
					transparency: 0.08,
					slotProps: slotProps?.rootStroke,
				})}
				{renderSizeConstraintDecorator({
					constraint: props.resolvedConstraint,
					slotProps: slotProps?.sizeConstraint,
				})}
				{props.collapsed ? (
					<textbutton
						AutoButtonColor={false}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 1)}
						Text=""
						TextTransparency={1}
						ZIndex={props.collapseControlZIndex}
						Event={props.collapseControlEvent}
						{...slotProps?.collapseControl}
					>
						<Icon
							name="app-window"
							size={sizeStyles.iconSize}
							color={themeRefs.text.secondary}
							anchor={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
							slotProps={{ root: { ZIndex: incrementZIndex(props.collapseControlZIndex, 1) } }}
						/>
					</textbutton>
				) : (
					<>
						<frame
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Active={true}
							Selectable={false}
							Size={new UDim2(1, 0, 0, sizeStyles.titleBarHeight)}
							ZIndex={titleBarZIndex}
							Event={props.titleBarEvent}
							{...slotProps?.titleBar}
						>
							{props.leading !== undefined ? (
								<frame
									BackgroundTransparency={1}
									BorderSizePixel={0}
									Position={UDim2.fromOffset(sizeStyles.titlePaddingX, 0)}
									Size={UDim2.fromOffset(sizeStyles.controlSize, sizeStyles.titleBarHeight)}
									ZIndex={incrementZIndex(titleBarZIndex, 1)}
									{...slotProps?.leading}
								>
									<uilistlayout
										FillDirection={Enum.FillDirection.Horizontal}
										HorizontalAlignment={Enum.HorizontalAlignment.Center}
										VerticalAlignment={Enum.VerticalAlignment.Center}
										SortOrder={Enum.SortOrder.LayoutOrder}
									/>
									{props.leading}
								</frame>
							) : undefined}
							<Text
								text={props.title ?? ""}
								size={sizeStyles.titleSize}
								weight={700}
								lineHeight={sizeStyles.titleLineHeight}
								color={themeRefs.text.primary}
								valign="middle"
								truncate="atend"
								position={UDim2.fromOffset(props.titleLeft, 0)}
								width={new UDim(1, -props.titleWidthOffset)}
								height={sizeStyles.titleBarHeight}
								slotProps={{ root: { ZIndex: incrementZIndex(titleBarZIndex, 1), ...slotProps?.title } }}
							/>
							<frame
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Position={new UDim2(1, -sizeStyles.titlePaddingX, 0.5, 0)}
								AnchorPoint={new Vector2(1, 0.5)}
								Size={new UDim2(0, 0, 0, sizeStyles.controlSize)}
								AutomaticSize={Enum.AutomaticSize.X}
								ZIndex={props.controlsZIndex}
								ref={props.controlsRef}
								{...slotProps?.controls}
							>
								<uilistlayout
									FillDirection={Enum.FillDirection.Horizontal}
									HorizontalAlignment={Enum.HorizontalAlignment.Right}
									VerticalAlignment={Enum.VerticalAlignment.Center}
									Padding={new UDim(0, sizeStyles.titleGap)}
									SortOrder={Enum.SortOrder.LayoutOrder}
								/>
								{props.trailing !== undefined ? (
									<frame
										BackgroundTransparency={1}
										BorderSizePixel={0}
										Size={UDim2.fromOffset(0, sizeStyles.controlSize)}
										AutomaticSize={Enum.AutomaticSize.X}
										LayoutOrder={1}
										{...slotProps?.trailing}
									>
										{props.trailing}
									</frame>
								) : undefined}
								<WindowChromeButton
									iconName="minus"
									size={sizeStyles.controlSize}
									iconSize={sizeStyles.iconSize}
									radius={props.controlRadius}
									zIndex={incrementZIndex(props.controlsZIndex, 1)}
									layoutOrder={2}
									onPress={props.onCollapse}
									onInputBegan={props.chromeInputBegan}
									slotProps={slotProps?.collapseButton}
								/>
								<WindowChromeButton
									iconName={props.maximized ? "minimize" : "maximize"}
									size={sizeStyles.controlSize}
									iconSize={sizeStyles.iconSize}
									radius={props.controlRadius}
									zIndex={incrementZIndex(props.controlsZIndex, 1)}
									layoutOrder={3}
									onPress={props.onToggleMaximized}
									onInputBegan={props.chromeInputBegan}
									slotProps={slotProps?.maximizeButton}
								/>
								{props.hasClose ? (
									<WindowChromeButton
										iconName="x"
										size={sizeStyles.controlSize}
										iconSize={sizeStyles.iconSize}
										radius={props.controlRadius}
										zIndex={incrementZIndex(props.controlsZIndex, 1)}
										layoutOrder={4}
										onPress={() => props.onClose?.()}
										onInputBegan={props.chromeInputBegan}
										slotProps={slotProps?.closeButton}
									/>
								) : undefined}
							</frame>
						</frame>
						<Divider
							color={themeRefs.border.subtle}
							size={1}
							slotProps={{
								root: {
									Position: UDim2.fromOffset(0, sizeStyles.titleBarHeight),
									ZIndex: titleBarZIndex,
								},
							}}
						/>
						<frame
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Position={UDim2.fromOffset(0, sizeStyles.titleBarHeight + 1)}
							Size={new UDim2(1, 0, 1, -(sizeStyles.titleBarHeight + 1))}
							ZIndex={bodyZIndex}
							{...slotProps?.body}
						>
							{hasRail ? (
								<frame
									BackgroundTransparency={1}
									BorderSizePixel={0}
									ClipsDescendants={true}
									Size={new UDim2(0, railWidth, 1, 0)}
									ZIndex={incrementZIndex(bodyZIndex, 1)}
									{...slotProps?.rail}
								>
									{props.rail}
								</frame>
							) : undefined}
							{hasRail ? (
								<Divider
									orientation="vertical"
									color={themeRefs.border.subtle}
									size={1}
									layoutOrder={2}
									slotProps={{
										root: {
											Position: UDim2.fromOffset(railWidth, 0),
										},
									}}
								/>
							) : undefined}
							<frame
								BackgroundTransparency={1}
								BorderSizePixel={0}
								ClipsDescendants={true}
								Position={UDim2.fromOffset(bodyLeftOffset, 0)}
								Size={new UDim2(1, -bodyLeftOffset, 1, 0)}
								ZIndex={incrementZIndex(bodyZIndex, 1)}
								{...slotProps?.content}
							>
								{props.children}
							</frame>
						</frame>
						{props.canResize ? (
							<textbutton
								AutoButtonColor={false}
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Size={UDim2.fromOffset(sizeStyles.resizeHandleSize, sizeStyles.resizeHandleSize)}
								Position={UDim2.fromScale(1, 1)}
								AnchorPoint={new Vector2(1, 1)}
								Text=""
								TextTransparency={1}
								ZIndex={props.resizeHandleZIndex}
								Event={props.resizeHandleEvent}
								{...slotProps?.resizeHandle}
							>
								<frame
									BackgroundColor3={props.theme.colors.text.disabled}
									BackgroundTransparency={0.35}
									BorderSizePixel={0}
									Size={UDim2.fromOffset(math.max(2, sizeStyles.resizeHandleSize - 6), 2)}
									Position={new UDim2(1, -2, 1, -6)}
									AnchorPoint={new Vector2(1, 1)}
									Active={false}
								/>
								<frame
									BackgroundColor3={props.theme.colors.text.disabled}
									BackgroundTransparency={0.35}
									BorderSizePixel={0}
									Size={UDim2.fromOffset(2, math.max(2, sizeStyles.resizeHandleSize - 6))}
									Position={new UDim2(1, -6, 1, -2)}
									AnchorPoint={new Vector2(1, 1)}
									Active={false}
								/>
							</textbutton>
						) : undefined}
					</>
				)}
			</frame>
			<CaptureOverlay
				active={props.mouseDragCaptureActive}
				target={props.portalTarget}
				Event={props.dragCaptureOverlayEvent}
			/>
		</ScreenOverlayLayer>
	);
}
