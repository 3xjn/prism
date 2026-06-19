import React from "@rbxts/react";

import { LayerPortal, useOverlayLocalPosition, useTriggerOverlayLayout } from "./layering";
import type { TriggerOverlayLayout } from "./layering";

export interface TriggerOverlayLayerPlacement {
	readonly anchorPosition: Vector2;
}

export interface TriggerOverlayLayerState<TPlacement extends TriggerOverlayLayerPlacement> {
	readonly layout: TriggerOverlayLayout;
	readonly placement: TPlacement;
	readonly localAnchorPosition: Vector2;
	readonly overlayZIndex: React.InstanceProps<Frame>["ZIndex"] | undefined;
}

export interface TriggerOverlayLayerProps<TPlacement extends TriggerOverlayLayerPlacement> {
	readonly render: (state: TriggerOverlayLayerState<TPlacement>) => React.ReactNode;
	readonly trigger: GuiObject | undefined;
	readonly enabled?: boolean;
	readonly resolvePlacement: (layout: TriggerOverlayLayout) => TPlacement | undefined;
	readonly resolveZIndex?: (layout: TriggerOverlayLayout) => React.InstanceProps<Frame>["ZIndex"] | undefined;
	readonly backgroundColor?: Color3;
	readonly slotProps?: Partial<React.InstanceProps<Frame>>;
}

export function TriggerOverlayLayer<TPlacement extends TriggerOverlayLayerPlacement>({
	render,
	trigger,
	enabled = true,
	resolvePlacement,
	resolveZIndex,
	backgroundColor,
	slotProps,
}: TriggerOverlayLayerProps<TPlacement>): React.ReactElement | undefined {
	const [overlayFrame, setOverlayFrame] = React.useState<Frame>();
	const layout = useTriggerOverlayLayout(trigger, enabled);
	const placement = React.useMemo(() => {
		return layout !== undefined ? resolvePlacement(layout) : undefined;
	}, [layout, resolvePlacement]);
	const localAnchorPosition = useOverlayLocalPosition(overlayFrame, placement?.anchorPosition);

	if (!enabled || layout === undefined || placement === undefined) {
		return undefined;
	}

	const overlayZIndex = slotProps?.ZIndex ?? resolveZIndex?.(layout);

	return (
		<LayerPortal target={layout.portalTarget}>
			<frame
				BackgroundTransparency={1}
				BackgroundColor3={backgroundColor}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Active={false}
				Selectable={false}
				ZIndex={overlayZIndex}
				{...slotProps}
				ref={setOverlayFrame}
			>
				{localAnchorPosition !== undefined
					? render({ layout, placement, localAnchorPosition, overlayZIndex })
					: undefined}
			</frame>
		</LayerPortal>
	);
}
