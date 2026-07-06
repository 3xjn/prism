import React from "@rbxts/react";

import { useTheme } from "@prism/theme";

import { renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { resolveFrameSizeProps } from "../_shared/frameSize";
import { assignRef, composeEventMaps } from "../_shared/interaction";
import { TriggerOverlayLayer } from "../_shared/TriggerOverlayLayer";
import type { TriggerOverlayLayout } from "../_shared/layering";
import { useDelayedCallback } from "../_shared/useDelayedCallback";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { applyStyleOverride } from "../_shared/styleOverride";
import { useResolvedStyleProps } from "../_shared/useResolvedStyleProps";

import { useRootCursorEvent } from "../_shared/useRootCursor";

import { TooltipOverlayBubble } from "./TooltipOverlayBubble";
import { resolveTooltipSizeStyles, resolveTooltipVisualStyles } from "./styles";
import type { TooltipProps } from "./types";

const DEFAULT_TOOLTIP_TAIL_IMAGE = "rbxassetid://10983945016";
const DEFAULT_TOOLTIP_TAIL_BORDER_IMAGE = "rbxassetid://10983946430";
const TOP_PLACEMENT_TAIL_ROTATION = 180;
const TOP_PLACEMENT_TAIL_ATTACHMENT_OFFSET_Y = 0;

type FrameEventMap = React.InstanceProps<Frame>["Event"];

function isPrimitiveTooltipContent(value: unknown): value is string | number {
	return typeIs(value, "string") || typeIs(value, "number");
}

type TooltipComponent = ((props: TooltipProps) => React.ReactElement) & React.ForwardRefExoticComponent<TooltipProps>;

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
		openDelay = 0.35,
		tailImage = DEFAULT_TOOLTIP_TAIL_IMAGE,
		tailBorderImage = DEFAULT_TOOLTIP_TAIL_BORDER_IMAGE,
		Event,
		Change,
	} = props;
	const [hovered, setHovered] = React.useState(false);
	const delayedOpen = useDelayedCallback();
	const [rootInstance, setRootInstance] = React.useState<Frame>();
	const tooltipContent = content ?? label;
	const hasContent = tooltipContent !== undefined;
	const primitiveTooltipContent = isPrimitiveTooltipContent(tooltipContent) ? tooltipContent : undefined;
	const richTooltipContent =
		tooltipContent !== undefined && !isPrimitiveTooltipContent(tooltipContent) ? tooltipContent : undefined;
	const isOpen = !disabled && hasContent && (opened ?? hovered);
	const sizeStyles = resolveTooltipSizeStyles(theme, props.gap);
	const visualStyles = applyStyleOverride(resolveTooltipVisualStyles(theme), props.styleOverrides, { theme });
	const { resolvedWidth, resolvedHeight, resolvedSize, resolvedPosition, resolvedAnchor, resolvedConstraint } =
		useResolvedStyleProps("tooltip", props);
	const rootSlotProps = slotProps?.root;
	const overlaySlotProps = slotProps?.overlay;
	const defaultTailRotation = placement === "top" ? TOP_PLACEMENT_TAIL_ROTATION : 0;
	const defaultTailAttachmentOffsetY = placement === "top" ? TOP_PLACEMENT_TAIL_ATTACHMENT_OFFSET_Y : 0;

	React.useEffect(() => {
		if (!disabled && hasContent) {
			return;
		}

		setHovered(false);
	}, [disabled, hasContent]);
	const resolveTooltipPlacement = React.useCallback(
		(layout: TriggerOverlayLayout) => {
			const {
				bounds: { position, size },
			} = layout;
			const centerX = position.X + size.X * 0.5;

			switch (placement) {
				case "top":
				default:
					return {
						anchorPosition: new Vector2(centerX, position.Y - (sizeStyles.tailHeight + sizeStyles.gap)),
					};
			}
		},
		[placement, sizeStyles.gap, sizeStyles.tailHeight],
	);

	const rootSizeProps = resolveFrameSizeProps(resolvedSize, resolvedWidth, resolvedHeight);

	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolveOverlayZIndex = React.useCallback(
		(layout: TriggerOverlayLayout) => {
			return incrementZIndex(resolvedRootZIndex ?? layout.zIndexBase, 1);
		},
		[resolvedRootZIndex],
	);

	const internalEvent: FrameEventMap = {
		MouseEnter: () => {
			if (disabled || opened !== undefined || !hasContent) {
				return;
			}

			delayedOpen.schedule(openDelay, () => setHovered(true));
		},
		MouseLeave: () => {
			if (opened !== undefined) {
				return;
			}

			delayedOpen.cancel();
			setHovered(false);
		},
	};
	const rootEvent = useRootCursorEvent(
		composeEventMaps(internalEvent, Event),
		rootSlotProps?.Event === undefined ? props.cursor : undefined,
		disabled,
	);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootInstanceProps: Partial<React.InstanceProps<Frame>> = {
		Active: !disabled,
		Selectable: false,
		BackgroundTransparency: 1,
		BackgroundColor3: theme.colors.background.default,
		BorderSizePixel: 0,
		Size: rootSizeProps.size,
		AutomaticSize: rootSizeProps.automaticSize,
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
			<TriggerOverlayLayer
				trigger={rootInstance}
				enabled={isOpen}
				resolvePlacement={resolveTooltipPlacement}
				resolveZIndex={resolveOverlayZIndex}
				backgroundColor={theme.colors.background.default}
				slotProps={overlaySlotProps}
				render={({ localAnchorPosition, overlayZIndex }) => {
					return (
						<TooltipOverlayBubble
							localAnchorPosition={localAnchorPosition}
							overlayZIndex={overlayZIndex}
							primitiveContent={primitiveTooltipContent}
							richContent={richTooltipContent}
							sizeStyles={sizeStyles}
							visualStyles={visualStyles}
							slotProps={slotProps}
							themeFontFamily={theme.fontFamily}
							tailImage={tailImage}
							tailBorderImage={tailBorderImage}
							tailRotation={defaultTailRotation}
							tailAttachmentOffsetY={defaultTailAttachmentOffsetY}
						/>
					);
				}}
			/>
		</>
	);
});

export const Tooltip = TooltipBase as TooltipComponent;

Tooltip.displayName = "Tooltip";
