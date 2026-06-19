import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import { getLucideIconAsset } from "../../icons/lucide";

import { Backdrop } from "../Backdrop";
import { ScreenOverlayLayer } from "../_shared/layering";
import {
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { assignRef, isPressInput } from "../_shared/interaction";
import {
	DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX,
	incrementZIndex,
} from "../_shared/overlayLayerPolicy";
import {
	mergeSharedStyleProps,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { usePresence } from "../_shared/usePresence";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { ModalProps, ModalSize } from "./types";

const DEFAULT_MODAL_BODY_HEIGHT = 160;
const DEFAULT_MODAL_MAX_HEIGHT = 480;
const MODAL_BACKDROP_ENTER_DURATION = 0.14;
const MODAL_BACKDROP_EXIT_DURATION = 0.12;
const MODAL_PANEL_ENTER_DURATION = 0.13;
const MODAL_PANEL_EXIT_DURATION = 0.1;
const MODAL_EXIT_DURATION = MODAL_BACKDROP_EXIT_DURATION;
const MODAL_CLOSED_SCALE = 0.96;
const MODAL_CLOSED_OFFSET_Y = 10;
const MODAL_CLOSE_HOVER_SCALE = 1.04;
const MODAL_CLOSE_PRESS_SCALE = 0.92;

interface ModalSizeStyles {
	readonly width: number;
	readonly radius: UDim;
	readonly overlayPadding: number;
	readonly headerGap: number;
	readonly closeButtonSize: number;
	readonly titleSize: number;
	readonly titleLineHeight: number;
}

function resolvePaddingOffset(value: UDim | React.Binding<UDim> | undefined): number {
	return typeIs(value, "UDim") ? value.Offset : 0;
}

function resolveModalSizeStyles(theme: Theme, size: ModalSize): ModalSizeStyles {
	const baseWidth = theme.spacing.xl;

	switch (size) {
		case "sm":
			return {
				width: baseWidth * 14,
				radius: new UDim(0, theme.radius.md),
				overlayPadding: theme.spacing.xl,
				headerGap: theme.spacing.md,
				closeButtonSize: theme.spacing.xl + theme.spacing.md,
				titleSize: theme.fontSizes.md,
				titleLineHeight: theme.lineHeights.md,
			};
		case "lg":
			return {
				width: baseWidth * 24,
				radius: new UDim(0, theme.radius.lg),
				overlayPadding: theme.spacing.xl,
				headerGap: theme.spacing.lg,
				closeButtonSize: theme.spacing.xl + theme.spacing.lg,
				titleSize: theme.fontSizes.lg,
				titleLineHeight: theme.lineHeights.lg,
			};
		case "xl":
			return {
				width: baseWidth * 30,
				radius: new UDim(0, theme.radius.lg),
				overlayPadding: theme.spacing.xl,
				headerGap: theme.spacing.lg,
				closeButtonSize: theme.spacing.xl + theme.spacing.lg,
				titleSize: theme.fontSizes.xl,
				titleLineHeight: theme.lineHeights.xl,
			};
		case "md":
		default:
			return {
				width: baseWidth * 18,
				radius: new UDim(0, theme.radius.md),
				overlayPadding: theme.spacing.xl,
				headerGap: theme.spacing.md,
				closeButtonSize: theme.spacing.xl + theme.spacing.md,
				titleSize: theme.fontSizes.lg,
				titleLineHeight: theme.lineHeights.lg,
			};
	}
}

function useAbsoluteSize(instance: GuiObject | undefined): Vector2 | undefined {
	const [absoluteSize, setAbsoluteSize] = React.useState<Vector2>();

	React.useEffect(() => {
		if (instance === undefined) {
			setAbsoluteSize(undefined);
			return;
		}

		const updateAbsoluteSize = () => {
			const nextSize = instance.AbsoluteSize;
			setAbsoluteSize((currentSize) =>
				currentSize !== undefined && currentSize.X === nextSize.X && currentSize.Y === nextSize.Y ? currentSize : nextSize,
			);
		};

		updateAbsoluteSize();
		const absoluteSizeConnection = instance.GetPropertyChangedSignal("AbsoluteSize").Connect(updateAbsoluteSize);

		return () => {
			absoluteSizeConnection.Disconnect();
		};
	}, [instance]);

	return absoluteSize;
}

type ModalComponent = ((props: ModalProps) => React.ReactElement) & React.ForwardRefExoticComponent<ModalProps>;

const ModalBase = React.forwardRef<Frame, ModalProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		opened,
		onClose,
		title,
		children,
		size = "md",
		fullWidth = false,
		closeOnBackdropClick = true,
		withCloseButton = true,
		Event,
		Change,
	} = props;
	const [contentLayerInstance, setContentLayerInstance] = React.useState<Frame>();
	const [panelInstance, setPanelInstance] = React.useState<Frame>();
	const [headerInstance, setHeaderInstance] = React.useState<Frame>();
	const [bodyContentInstance, setBodyContentInstance] = React.useState<Frame>();
	const [closeHovered, setCloseHovered] = React.useState(false);
	const [closePressed, setClosePressed] = React.useState(false);
	const contentLayerSize = useAbsoluteSize(contentLayerInstance);
	const headerHeight = useAbsoluteSize(headerInstance)?.Y ?? 0;
	const bodyContentHeight = useAbsoluteSize(bodyContentInstance)?.Y ?? 0;
	const sizeStyles = resolveModalSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps(
		{
			bg: "background.surface",
			clip: true,
			center: true,
			p: "lg",
		},
		props,
	);
	const {
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedBackgroundColor,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hasPadding,
	} = useResolvedStyleProps("modal", mergedStyleProps);
	const shouldRenderHeader = title !== undefined || withCloseButton;
	const usesDefaultCenteredLayout = props.position === undefined && props.anchor === undefined && props.center !== false;
	const rootOverlayZIndex = slotProps?.overlay?.ZIndex ?? mergedStyleProps.zIndex ?? DEFAULT_SCREEN_OVERLAY_BASE_Z_INDEX;
	const backdropZIndex = slotProps?.backdrop?.ZIndex ?? rootOverlayZIndex;
	const contentLayerZIndex = slotProps?.contentLayer?.ZIndex ?? incrementZIndex(rootOverlayZIndex, 1);
	const contentZIndex = slotProps?.content?.ZIndex ?? incrementZIndex(contentLayerZIndex, 1);
	const contentInnerZIndex = incrementZIndex(contentZIndex, 1);
	const headerZIndex = slotProps?.header?.ZIndex ?? contentInnerZIndex;
	const titleZIndex = slotProps?.title?.ZIndex ?? incrementZIndex(headerZIndex, 1);
	const closeButtonZIndex = slotProps?.closeButton?.ZIndex ?? titleZIndex;
	const bodyZIndex = slotProps?.body?.ZIndex ?? contentInnerZIndex;
	const bodyContentZIndex = slotProps?.bodyContent?.ZIndex ?? bodyZIndex;
	const closeIconSize = UDim2.fromOffset(sizeStyles.titleSize, sizeStyles.titleSize);
	const closeIconAsset = getLucideIconAsset("x", sizeStyles.titleSize);
	const presence = usePresence(opened, { exitDuration: MODAL_EXIT_DURATION });
	const closeButtonScale = closePressed ? MODAL_CLOSE_PRESS_SCALE : closeHovered ? MODAL_CLOSE_HOVER_SCALE : 1;
	const closeButtonMotionDuration = closePressed ? 0.045 : closeHovered ? 0.09 : 0.1;
	const animated = useMotion({
		values: {
			backdropOpacity: presence.present ? 0.28 : 0,
			panelOpacity: presence.present ? 1 : 0,
			panelScale: presence.present ? 1 : MODAL_CLOSED_SCALE,
			panelOffsetY: presence.present ? 0 : MODAL_CLOSED_OFFSET_Y,
			closeButtonBackgroundColor: closePressed ? theme.colors.action.pressed : theme.colors.action.hover,
			closeButtonBackgroundTransparency: closeHovered || closePressed ? 0 : 1,
			closeButtonIconColor: closePressed ? theme.colors.text.primary : theme.colors.text.secondary,
			closeButtonScale,
		},
		transition: {
			backdropOpacity: { duration: presence.present ? MODAL_BACKDROP_ENTER_DURATION : MODAL_BACKDROP_EXIT_DURATION, easing: presence.present ? "out" : "in" },
			panelOpacity: { duration: presence.present ? MODAL_PANEL_ENTER_DURATION : MODAL_PANEL_EXIT_DURATION, easing: presence.present ? "out" : "in" },
			panelScale: { duration: presence.present ? MODAL_PANEL_ENTER_DURATION : MODAL_PANEL_EXIT_DURATION, easing: presence.present ? "out" : "in" },
			panelOffsetY: { duration: presence.present ? MODAL_PANEL_ENTER_DURATION : MODAL_PANEL_EXIT_DURATION, easing: presence.present ? "out" : "in" },
			closeButtonBackgroundColor: { duration: closeButtonMotionDuration, easing: "standard" },
			closeButtonBackgroundTransparency: { duration: closeButtonMotionDuration, easing: "standard" },
			closeButtonIconColor: { duration: closeButtonMotionDuration, easing: "standard" },
			closeButtonScale: { duration: closePressed ? 0.05 : 0.1, easing: "out" },
		},
	});

	React.useEffect(() => {
		if (withCloseButton) {
			return;
		}

		setCloseHovered(false);
		setClosePressed(false);
	}, [withCloseButton]);

	const closeButtonEvent = useRootCursorEvent(
		withCloseButton
			? {
				MouseEnter: () => {
					setCloseHovered(true);
				},
				MouseLeave: () => {
					setCloseHovered(false);
					setClosePressed(false);
				},
				InputBegan: (_button: TextButton, input: InputObject) => {
					if (!isPressInput(input)) {
						return;
					}

					setClosePressed(true);
				},
				InputEnded: (_button: TextButton, input: InputObject) => {
					if (!isPressInput(input)) {
						return;
					}

					setClosePressed(false);
				},
				Activated: () => {
					onClose();
				},
			  }
			: undefined,
		slotProps?.closeButton?.Event === undefined ? mergedStyleProps.cursor ?? "pointer" : undefined,
		!withCloseButton,
	);
	const contentLayerRef = React.useCallback((instance: Frame | undefined) => {
		setContentLayerInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
	}, []);
	const panelRef = React.useCallback((instance: Frame | undefined) => {
		setPanelInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
		assignRef(ref, instance);
	}, [ref]);
	const headerRef = React.useCallback((instance: Frame | undefined) => {
		setHeaderInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
	}, []);
	const bodyContentRef = React.useCallback((instance: Frame | undefined) => {
		setBodyContentInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
	}, []);

	if (!presence.shouldRender) {
		return <></>;
	}

	const availableLayerSize = contentLayerSize ?? new Vector2(sizeStyles.width, DEFAULT_MODAL_MAX_HEIGHT);
	const availableLayerWidth = math.max(0, availableLayerSize.X);
	const availableLayerHeight = math.max(0, availableLayerSize.Y);
	const panelFallbackHeight = math.max(DEFAULT_MODAL_MAX_HEIGHT, sizeStyles.closeButtonSize + sizeStyles.overlayPadding * 2);
	const defaultMaxPanelHeight = availableLayerHeight > 0 ? availableLayerHeight : panelFallbackHeight;
	const hasExplicitWidth = resolvedSize !== undefined || resolvedWidth !== undefined;
	const hasExplicitHeight = resolvedSize !== undefined || resolvedHeight !== undefined;
	const defaultMaxPanelWidth = fullWidth ? availableLayerWidth : math.min(sizeStyles.width, availableLayerWidth > 0 ? availableLayerWidth : sizeStyles.width);
	const resolvedMaxPanelWidth =
		resolvedConstraint?.max !== undefined
			? math.min(defaultMaxPanelWidth, resolvedConstraint.max.X)
			: defaultMaxPanelWidth;
	const resolvedMaxPanelHeight =
		resolvedConstraint?.max !== undefined
			? math.min(defaultMaxPanelHeight, resolvedConstraint.max.Y)
			: defaultMaxPanelHeight;
	const panelMaxSize = new Vector2(math.max(0, resolvedMaxPanelWidth), math.max(0, resolvedMaxPanelHeight));
	const panelMinSize = resolvedConstraint?.min;
	const bodyGap = shouldRenderHeader ? sizeStyles.headerGap : 0;
	const panelVerticalPadding = resolvePaddingOffset(paddingTop) + resolvePaddingOffset(paddingBottom);
	const availableBodyHeight = math.max(0, panelMaxSize.Y - panelVerticalPadding - headerHeight - bodyGap);
	const fallbackBodyHeight = math.min(DEFAULT_MODAL_BODY_HEIGHT, availableBodyHeight);
	const resolvedBodyHeight = math.max(0, math.min(bodyContentHeight > 0 ? bodyContentHeight : fallbackBodyHeight, availableBodyHeight));
	const bodyScrollable = bodyContentHeight > availableBodyHeight + 1;
	const scrollBarThickness = bodyScrollable ? theme.spacing.xs : 0;
	const bodyHorizontalOverflow = math.max(
		0,
		math.min(resolvePaddingOffset(paddingLeft), resolvePaddingOffset(paddingRight)),
	);

	let panelSize: UDim2;
	let panelAutoSize: Enum.AutomaticSize | undefined;
	if (resolvedSize !== undefined) {
		panelSize = resolvedSize;
		panelAutoSize = undefined;
	} else if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		panelSize = new UDim2(resolvedWidth, resolvedHeight);
		panelAutoSize = undefined;
	} else if (resolvedWidth !== undefined) {
		panelSize = new UDim2(resolvedWidth, new UDim(0, 0));
		panelAutoSize = Enum.AutomaticSize.Y;
	} else if (resolvedHeight !== undefined) {
		panelSize = usesDefaultCenteredLayout ? new UDim2(1, 0, resolvedHeight.Scale, resolvedHeight.Offset) : new UDim2(0, panelMaxSize.X, resolvedHeight.Scale, resolvedHeight.Offset);
		panelAutoSize = undefined;
	} else if (usesDefaultCenteredLayout) {
		panelSize = new UDim2(1, 0, 0, 0);
		panelAutoSize = Enum.AutomaticSize.Y;
	} else {
		panelSize = fullWidth ? new UDim2(1, 0, 0, 0) : UDim2.fromOffset(panelMaxSize.X, 0);
		panelAutoSize = Enum.AutomaticSize.Y;
	}

	const resolvedPanelPosition = usesDefaultCenteredLayout ? UDim2.fromScale(0.5, 0.5) : resolvedPosition ?? UDim2.fromScale(0.5, 0.5);
	const animatedPanelPosition = new UDim2(
		resolvedPanelPosition.X.Scale,
		resolvedPanelPosition.X.Offset,
		resolvedPanelPosition.Y.Scale,
		resolvedPanelPosition.Y.Offset + animated.panelOffsetY,
	);
	const resolvedPanelAnchor = usesDefaultCenteredLayout ? new Vector2(0.5, 0.5) : resolvedAnchor ?? new Vector2(0.5, 0.5);
	const panelBackgroundColor = resolvedBackgroundColor ?? theme.colors.background.surface;
	const panelBackgroundTransparency = 1 - ((1 - (mergedStyleProps.bgTransparency ?? 0)) * animated.panelOpacity);
	const panelStrokeTransparency = 1 - ((1 - 0.08) * animated.panelOpacity);
	const contentEvent = slotProps?.content?.Event === undefined ? Event : undefined;
	const panelSizeConstraint = panelMinSize !== undefined || panelMaxSize.X > 0 || panelMaxSize.Y > 0
		? { min: panelMinSize, max: panelMaxSize }
		: undefined;

	const panelElement = (
		<frame
			BackgroundColor3={panelBackgroundColor}
			BackgroundTransparency={panelBackgroundTransparency}
			BorderSizePixel={0}
			ClipsDescendants={mergedStyleProps.clip}
			Size={panelSize}
			AutomaticSize={panelAutoSize}
			Position={animatedPanelPosition}
			AnchorPoint={resolvedPanelAnchor}
			Visible={mergedStyleProps.visible}
			LayoutOrder={usesDefaultCenteredLayout ? 1 : mergedStyleProps.layoutOrder}
			ZIndex={contentZIndex}
			Event={contentEvent}
			Change={Change}
			ref={panelRef}
			{...slotProps?.content}
		>
			<uiscale Scale={animated.panelScale} />
			{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.contentCorner })}
			{renderStrokeDecorator({
				enabled: true,
				color: theme.colors.border.default,
				thickness: 1,
				transparency: panelStrokeTransparency,
				slotProps: slotProps?.contentStroke,
			})}
			{renderSizeConstraintDecorator({ constraint: panelSizeConstraint, slotProps: slotProps?.sizeConstraint })}
			<canvasgroup
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={panelAutoSize === undefined ? UDim2.fromScale(1, 1) : new UDim2(1, 0, 0, 0)}
				AutomaticSize={panelAutoSize}
				GroupTransparency={1 - animated.panelOpacity}
				ZIndex={contentInnerZIndex}
			>
				{renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.contentPadding })}
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, bodyGap)}
					{...slotProps?.contentLayout}
				/>
				{shouldRenderHeader ? (
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					LayoutOrder={1}
					ZIndex={headerZIndex}
					ref={headerRef}
					{...slotProps?.header}
				>
					{renderSizeConstraintDecorator({
						constraint: withCloseButton ? { min: new Vector2(0, sizeStyles.closeButtonSize) } : undefined,
						slotProps: slotProps?.headerSizeConstraint,
					})}
					{title !== undefined ? (
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={new UDim2(
								1,
								withCloseButton ? -(sizeStyles.closeButtonSize + sizeStyles.headerGap) : 0,
								0,
								withCloseButton ? sizeStyles.closeButtonSize : 0,
							)}
							AutomaticSize={Enum.AutomaticSize.Y}
							Text={tostring(title)}
							TextColor3={theme.colors.text.primary}
							TextSize={sizeStyles.titleSize}
							FontFace={Font.fromEnum(theme.fontFamily)}
							LineHeight={sizeStyles.titleLineHeight}
							TextWrapped={true}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
							TextTruncate={Enum.TextTruncate.None}
							ZIndex={titleZIndex}
							{...slotProps?.title}
						/>
					) : undefined}
					{withCloseButton ? (
						<textbutton
							AutoButtonColor={false}
							BackgroundColor3={animated.closeButtonBackgroundColor}
							BackgroundTransparency={animated.closeButtonBackgroundTransparency}
							BorderSizePixel={0}
							Size={UDim2.fromOffset(sizeStyles.closeButtonSize, sizeStyles.closeButtonSize)}
							Position={UDim2.fromScale(1, 0.5)}
							AnchorPoint={new Vector2(1, 0.5)}
							Text=""
							TextTransparency={1}
							ZIndex={closeButtonZIndex}
							Event={closeButtonEvent}
							{...slotProps?.closeButton}
						>
							<uiscale Scale={animated.closeButtonScale} />
							{renderCornerDecorator({ radius: new UDim(0, theme.radius.sm), slotProps: slotProps?.closeButtonCorner })}
							<imagelabel
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Size={closeIconSize}
								Position={UDim2.fromScale(0.5, 0.5)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Image={closeIconAsset?.Url}
								ImageRectSize={closeIconAsset?.ImageRectSize}
								ImageRectOffset={closeIconAsset?.ImageRectOffset}
								ImageColor3={animated.closeButtonIconColor}
								ScaleType={Enum.ScaleType.Fit}
								ZIndex={incrementZIndex(closeButtonZIndex, 1)}
								Active={false}
								Selectable={false}
								{...slotProps?.closeIcon}
							/>
						</textbutton>
					) : undefined}
				</frame>
				) : undefined}
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					ClipsDescendants={false}
					Size={new UDim2(1, 0, 0, resolvedBodyHeight)}
					LayoutOrder={2}
					ZIndex={bodyZIndex}
				>
					<scrollingframe
						Active={bodyScrollable}
						AutomaticCanvasSize={Enum.AutomaticSize.Y}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						CanvasSize={UDim2.fromOffset(0, 0)}
						Position={UDim2.fromOffset(-bodyHorizontalOverflow, 0)}
						ScrollBarImageColor3={theme.colors.text.disabled}
						ScrollBarImageTransparency={0.2}
						ScrollBarThickness={scrollBarThickness}
						ScrollingDirection={Enum.ScrollingDirection.Y}
						ScrollingEnabled={bodyScrollable}
						Selectable={false}
						Size={new UDim2(1, bodyHorizontalOverflow * 2, 1, 0)}
						ZIndex={bodyZIndex}
						{...slotProps?.body}
					>
						<frame
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={new UDim2(1, -(bodyHorizontalOverflow * 2 + scrollBarThickness), 0, 0)}
							Position={UDim2.fromOffset(bodyHorizontalOverflow, 0)}
							AutomaticSize={Enum.AutomaticSize.Y}
							ZIndex={bodyContentZIndex}
							ref={bodyContentRef}
							{...slotProps?.bodyContent}
						>
							{children}
						</frame>
					</scrollingframe>
				</frame>
			</canvasgroup>
		</frame>
	);

	return (
		<ScreenOverlayLayer zIndex={rootOverlayZIndex} slotProps={slotProps?.overlay}>
			<Backdrop
				active={opened && closeOnBackdropClick}
				color={theme.colors.text.primary}
				opacity={animated.backdropOpacity}
				cursor={mergedStyleProps.cursor ?? "pointer"}
				zIndex={backdropZIndex}
				excludeInstance={panelInstance}
				onPress={closeOnBackdropClick ? onClose : undefined}
				slotProps={{ root: slotProps?.backdrop }}
			/>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromOffset(sizeStyles.overlayPadding, sizeStyles.overlayPadding)}
				Size={new UDim2(1, -(sizeStyles.overlayPadding * 2), 1, -(sizeStyles.overlayPadding * 2))}
				ClipsDescendants={false}
				Active={false}
				Selectable={false}
				ZIndex={contentLayerZIndex}
				ref={contentLayerRef}
				{...slotProps?.contentLayer}
			>
				{panelElement}
			</frame>
		</ScreenOverlayLayer>
	);
});

export const Modal = ModalBase as ModalComponent;

Modal.displayName = "Modal";
