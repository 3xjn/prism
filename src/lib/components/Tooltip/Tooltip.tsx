import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { useTheme } from "@prism/theme";

import {
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { assignRef, composeEventMaps } from "../_shared/interaction";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { resolveTextFontFace } from "../_shared/textFont";
import {
	resolveThemeSizeSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";

import { useTriggerOverlayLayout } from "../_shared/useTriggerOverlayLayout";

import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { TooltipPlacement, TooltipProps } from "./types";

const DEFAULT_TOOLTIP_TAIL_IMAGE = "rbxassetid://10983945016";
const DEFAULT_TOOLTIP_TAIL_BORDER_IMAGE = "rbxassetid://10983946430";
const TOP_PLACEMENT_TAIL_ROTATION = 180;
const TOP_PLACEMENT_TAIL_ATTACHMENT_OFFSET_Y = 0;

type FrameEventMap = React.InstanceProps<Frame>["Event"];

function isPrimitiveTooltipContent(value: unknown): value is string | number {
	return typeIs(value, "string") || typeIs(value, "number");
}

interface TooltipSizeStyles {
	readonly paddingX: number;
	readonly paddingY: number;
	readonly radius: UDim;
	readonly fontSize: number;
	readonly lineHeight: number;
	readonly tailWidth: number;
	readonly tailHeight: number;
	readonly triggerMinimumSize: number;
	readonly gap: number;
}

interface TooltipVisualStyles {
	readonly backgroundColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly textColor: Color3;
	readonly tailFillColor: Color3;
	readonly tailBorderColor: Color3;
	readonly tailBorderTransparency: number;
}

interface TooltipOverlayLayout {
	readonly portalTarget: LayerCollector;
	readonly anchorPosition: Vector2;
	readonly zIndexBase: number;
}

type TooltipComponent = ((props: TooltipProps) => React.ReactElement) & React.ForwardRefExoticComponent<TooltipProps>;

function resolveTooltipSizeStyles(theme: ReturnType<typeof useTheme>, gap: number | undefined): TooltipSizeStyles {
	return {
		paddingX: theme.spacing.sm,
		paddingY: theme.spacing.xs,
		radius: new UDim(0, resolveThemeSizeSafe(theme, "tooltip", "sm", "radius", theme.radius.sm)),
		fontSize: theme.fontSizes.sm,
		lineHeight: theme.lineHeights.sm,
		tailWidth: 18,
		tailHeight: 8,
		triggerMinimumSize: 1,
		gap: gap ?? theme.spacing.xs,
	};
}

function resolveTooltipVisualStyles(theme: ReturnType<typeof useTheme>): TooltipVisualStyles {
	return {
		backgroundColor: theme.colors.background.surface,
		strokeColor: theme.colors.border.default,
		strokeTransparency: 0.08,
		textColor: theme.colors.text.primary,
		tailFillColor: theme.colors.background.surface,
		tailBorderColor: theme.colors.border.default,
		tailBorderTransparency: 0.08,
	};
}

const TooltipBase = React.forwardRef<Frame, TooltipProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		children,
		content,
		label,
		disabled = false,
		opened,
		placement = "top",
		tailImage = DEFAULT_TOOLTIP_TAIL_IMAGE,
		tailBorderImage = DEFAULT_TOOLTIP_TAIL_BORDER_IMAGE,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const [rootInstance, setRootInstance] = React.useState<Frame>();
	const [overlayFrame, setOverlayFrame] = React.useState<Frame>();
	const [overlayOrigin, setOverlayOrigin] = React.useState<Vector2>();
	const tooltipContent = content ?? label;
	const hasContent = tooltipContent !== undefined;
	const primitiveTooltipContent = isPrimitiveTooltipContent(tooltipContent) ? tooltipContent : undefined;
	const richTooltipContent = tooltipContent !== undefined && !isPrimitiveTooltipContent(tooltipContent) ? tooltipContent : undefined;
	const isOpen = !disabled && hasContent && (opened ?? hovered);
	const sizeStyles = resolveTooltipSizeStyles(theme, props.gap);
	const visualStyles = resolveTooltipVisualStyles(theme);
	const {
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedConstraint,
	} = useResolvedStyleProps("tooltip", props);
	const rootSlotProps = slotProps?.root;
	const overlaySlotProps = slotProps?.overlay;
	const bubbleSlotProps = slotProps?.bubble;
	const labelSlotProps = slotProps?.label;
	const tailSlotProps = slotProps?.tail;
	const tailBorderSlotProps = slotProps?.tailBorder;
	const defaultTailRotation = placement === "top" ? TOP_PLACEMENT_TAIL_ROTATION : 0;
	const defaultTailAttachmentOffsetY = placement === "top" ? TOP_PLACEMENT_TAIL_ATTACHMENT_OFFSET_Y : 0;
	const triggerOverlayLayout = useTriggerOverlayLayout(rootInstance, isOpen);

	React.useEffect(() => {
		if (!disabled && hasContent) {
			return;
		}

		setHovered(false);
	}, [disabled, hasContent]);
	React.useEffect(() => {
		if (overlayFrame === undefined) {
			setOverlayOrigin(undefined);
			return;
		}

		const updateOverlayOrigin = () => {
			setOverlayOrigin(overlayFrame.AbsolutePosition);
		};

		updateOverlayOrigin();
		const absolutePositionConnection = overlayFrame.GetPropertyChangedSignal("AbsolutePosition").Connect(updateOverlayOrigin);
		const ancestryConnection = overlayFrame.AncestryChanged.Connect(updateOverlayOrigin);

		return () => {
			absolutePositionConnection.Disconnect();
			ancestryConnection.Disconnect();
		};
	}, [overlayFrame]);
	const overlayLayout = React.useMemo<TooltipOverlayLayout | undefined>(() => {
		if (triggerOverlayLayout === undefined) {
			return undefined;
		}

		const {
			portalTarget,
			bounds: { position, size },
		} = triggerOverlayLayout;
		const centerX = position.X + size.X * 0.5;

		switch (placement) {
			case "top":
			default:
				return {
					portalTarget,
					zIndexBase: triggerOverlayLayout.zIndexBase,
					anchorPosition: new Vector2(centerX, position.Y - (sizeStyles.tailHeight + sizeStyles.gap)),
				};
		}
	}, [placement, sizeStyles.gap, sizeStyles.tailHeight, triggerOverlayLayout]);
	const localAnchorPosition = overlayOrigin === undefined || overlayLayout === undefined
		? undefined
		: overlayLayout.anchorPosition.sub(overlayOrigin);

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
		computedSize = new UDim2(new UDim(0, 0), resolvedHeight);
		computedAutoSize = Enum.AutomaticSize.X;
	} else {
		computedSize = UDim2.fromOffset(0, 0);
		computedAutoSize = Enum.AutomaticSize.XY;
	}

	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedOverlayZIndex = overlaySlotProps?.ZIndex ?? incrementZIndex(resolvedRootZIndex ?? overlayLayout?.zIndexBase, 1);
	const resolvedBubbleZIndex = bubbleSlotProps?.ZIndex ?? incrementZIndex(resolvedOverlayZIndex, 1);
	const resolvedTailBorderZIndex = tailBorderSlotProps?.ZIndex ?? incrementZIndex(resolvedBubbleZIndex, 1);
	const resolvedTailZIndex = tailSlotProps?.ZIndex ?? incrementZIndex(resolvedTailBorderZIndex, 1);
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? incrementZIndex(resolvedTailZIndex, 1);
 
	const internalEvent: FrameEventMap = {
		MouseEnter: () => {
			if (disabled || opened !== undefined || !hasContent) {
				return;
			}

			setHovered(true);
		},
		MouseLeave: () => {
			if (opened !== undefined) {
				return;
			}

			setHovered(false);
		},
	};
	const rootEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, Event),
		rootSlotProps?.Event === undefined ? props.cursor : undefined,
		disabled,
	);
	const resolvedLabelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		Active: !disabled,
		Selectable: false,
		BackgroundTransparency: 1,
		BackgroundColor3: theme.colors.background.default,
		BorderSizePixel: 0,
		Size: computedSize,
		AutomaticSize: computedAutoSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: resolvedRootZIndex,
		Event: rootEvent,
		Change: Change,
	};
	const rootRef = React.useCallback(
		(instance: Frame | undefined) => {
			setRootInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			assignRef(ref, instance);
		},
		[ref],
	);

	return (
		<>
			<frame {...rootInstanceProps} {...rootSlotProps} ref={rootRef}>
				{renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint })}
				{children}
			</frame>
			{isOpen && overlayLayout !== undefined
				? ReactRoblox.createPortal(
						<frame
							ref={setOverlayFrame}
							BackgroundTransparency={1}
							BackgroundColor3={theme.colors.background.default}
							BorderSizePixel={0}
							Size={UDim2.fromScale(1, 1)}
							Active={false}
							Selectable={false}
							ZIndex={resolvedOverlayZIndex}
							{...overlaySlotProps}
						>
							{localAnchorPosition !== undefined ? (
							<frame
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Position={new UDim2(0, localAnchorPosition.X, 0, localAnchorPosition.Y)}
								AnchorPoint={new Vector2(0.5, 1)}
								Size={UDim2.fromOffset(0, 0)}
								ClipsDescendants={false}
								Active={false}
								Selectable={false}
							>
								<frame
									BackgroundColor3={bubbleSlotProps?.BackgroundColor3 ?? visualStyles.backgroundColor}
									BackgroundTransparency={bubbleSlotProps?.BackgroundTransparency ?? 0}
									BorderSizePixel={0}
									Position={bubbleSlotProps?.Position ?? UDim2.fromOffset(0, 0)}
									AnchorPoint={bubbleSlotProps?.AnchorPoint ?? new Vector2(0.5, 1)}
									AutomaticSize={Enum.AutomaticSize.XY}
									ClipsDescendants={false}
									ZIndex={resolvedBubbleZIndex}
									Active={false}
									Selectable={false}
									{...bubbleSlotProps}
								>
									{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.bubbleCorner })}
									{renderStrokeDecorator({
										enabled: true,
										color: visualStyles.strokeColor,
										transparency: visualStyles.strokeTransparency,
										thickness: 1,
										slotProps: slotProps?.bubbleStroke,
									})}
									{renderPaddingDecorator({
										enabled: true,
										paddingTop: new UDim(0, sizeStyles.paddingY),
										paddingRight: new UDim(0, sizeStyles.paddingX),
										paddingBottom: new UDim(0, sizeStyles.paddingY),
										paddingLeft: new UDim(0, sizeStyles.paddingX),
										slotProps: slotProps?.bubblePadding,
									})}
									{richTooltipContent ?? (
										<textlabel
											AutomaticSize={Enum.AutomaticSize.XY}
											BackgroundTransparency={1}
											BorderSizePixel={0}
											Size={UDim2.fromOffset(0, 0)}
											Text={labelSlotProps?.Text ?? tostring(primitiveTooltipContent)}
											TextColor3={labelSlotProps?.TextColor3 ?? visualStyles.textColor}
											TextTransparency={labelSlotProps?.TextTransparency ?? 0}
											TextStrokeTransparency={labelSlotProps?.TextStrokeTransparency ?? 1}
											TextSize={labelSlotProps?.TextSize ?? sizeStyles.fontSize}
											Font={resolvedLabelFont}
											FontFace={resolvedLabelFontFace}
											LineHeight={labelSlotProps?.LineHeight ?? sizeStyles.lineHeight}
											TextWrapped={labelSlotProps?.TextWrapped ?? false}
											TextTruncate={labelSlotProps?.TextTruncate ?? Enum.TextTruncate.None}
											TextXAlignment={labelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
											TextYAlignment={labelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
											TextScaled={labelSlotProps?.TextScaled ?? false}
											RichText={labelSlotProps?.RichText ?? false}
											ZIndex={resolvedLabelZIndex}
											{...labelSlotProps}
										/>
									)}
								</frame>
								<imagelabel
									BackgroundTransparency={1}
									BorderSizePixel={0}
									Size={UDim2.fromOffset(sizeStyles.tailWidth, sizeStyles.tailHeight)}
									Position={tailBorderSlotProps?.Position ?? UDim2.fromOffset(0, defaultTailAttachmentOffsetY)}
									AnchorPoint={tailBorderSlotProps?.AnchorPoint ?? new Vector2(0.5, 0)}
									Image={tailBorderSlotProps?.Image ?? tailBorderImage}
									ImageColor3={tailBorderSlotProps?.ImageColor3 ?? visualStyles.tailBorderColor}
									ImageTransparency={tailBorderSlotProps?.ImageTransparency ?? visualStyles.tailBorderTransparency}
									Rotation={tailBorderSlotProps?.Rotation ?? defaultTailRotation}
									ScaleType={tailBorderSlotProps?.ScaleType ?? Enum.ScaleType.Fit}
									ZIndex={resolvedTailBorderZIndex}
									Active={false}
									Selectable={false}
									{...tailBorderSlotProps}
								/>
								<imagelabel
									BackgroundTransparency={1}
									BorderSizePixel={0}
									Size={UDim2.fromOffset(sizeStyles.tailWidth, sizeStyles.tailHeight)}
									Position={tailSlotProps?.Position ?? UDim2.fromOffset(0, defaultTailAttachmentOffsetY)}
									AnchorPoint={tailSlotProps?.AnchorPoint ?? new Vector2(0.5, 0)}
									Image={tailSlotProps?.Image ?? tailImage}
									ImageColor3={tailSlotProps?.ImageColor3 ?? visualStyles.tailFillColor}
									ImageTransparency={tailSlotProps?.ImageTransparency ?? 0}
									Rotation={tailSlotProps?.Rotation ?? defaultTailRotation}
									ScaleType={tailSlotProps?.ScaleType ?? Enum.ScaleType.Fit}
									ZIndex={resolvedTailZIndex}
									Active={false}
									Selectable={false}
									{...tailSlotProps}
								/>
							</frame>
							) : undefined}
						</frame>,
						overlayLayout.portalTarget,
					)
				: undefined}
		</>
	);
});

export const Tooltip = TooltipBase as TooltipComponent;

Tooltip.displayName = "Tooltip";
