import React from "@rbxts/react";

import { useTheme } from "@prism/theme";
import type { ThemeShadow } from "@prism/theme";

import { renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { resolveFrameSizeProps } from "../_shared/frameSize";
import { assignRef, composeEventMaps } from "../_shared/interaction";
import { TriggerOverlayLayer } from "../_shared/TriggerOverlayLayer";
import type { TriggerOverlayLayout } from "../_shared/layering";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { resolveThemeSizeSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";

import { useRootCursorEvent } from "../_shared/useRootCursor";

import { TooltipOverlayBubble } from "./TooltipOverlayBubble";
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
	readonly shadow: ThemeShadow;
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
		tailBorderTransparency: 0.24,
		shadow: theme.shadows.sm,
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
	const tooltipContent = content ?? label;
	const hasContent = tooltipContent !== undefined;
	const primitiveTooltipContent = isPrimitiveTooltipContent(tooltipContent) ? tooltipContent : undefined;
	const richTooltipContent =
		tooltipContent !== undefined && !isPrimitiveTooltipContent(tooltipContent) ? tooltipContent : undefined;
	const isOpen = !disabled && hasContent && (opened ?? hovered);
	const sizeStyles = resolveTooltipSizeStyles(theme, props.gap);
	const visualStyles = resolveTooltipVisualStyles(theme);
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
