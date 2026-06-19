import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { CAPTURE_OVERLAY_Z_INDEX } from "./overlayLayerPolicy";

export interface TriggerOverlayBounds {
	readonly position: Vector2;
	readonly size: Vector2;
}

export interface TriggerOverlayLayout {
	readonly portalTarget: LayerCollector;
	readonly bounds: TriggerOverlayBounds;
	readonly zIndexBase: number;
}

interface PortalLayerProps {
	readonly children?: React.ReactNode;
	readonly hostSlotProps?: Partial<React.InstanceProps<Frame>>;
}

export interface ScreenOverlayLayerProps {
	readonly children?: React.ReactNode;
	readonly hostSlotProps?: Partial<React.InstanceProps<Frame>>;
	readonly slotProps?: Partial<React.InstanceProps<Frame>>;
	readonly zIndex?: React.InstanceProps<Frame>["ZIndex"];
}

export interface LayerPortalProps {
	readonly children?: React.ReactNode;
	readonly target: LayerCollector | undefined;
}

export interface CaptureOverlayProps {
	readonly active: boolean;
	readonly target: LayerCollector | undefined;
	readonly Event: React.InstanceProps<TextButton>["Event"] | undefined;
	readonly zIndex?: React.InstanceProps<TextButton>["ZIndex"];
	readonly slotProps?: Partial<React.InstanceProps<TextButton>>;
}

function resolveLayerCollector(instance: Instance | undefined): LayerCollector | undefined {
	return instance?.FindFirstAncestorWhichIsA("LayerCollector");
}

export function usePortalTarget(instance: Instance | undefined): LayerCollector | undefined {
	const [portalTarget, setPortalTarget] = React.useState<LayerCollector>();

	React.useEffect(() => {
		if (instance === undefined) {
			setPortalTarget(undefined);
			return;
		}

		const updatePortalTarget = () => {
			setPortalTarget(resolveLayerCollector(instance));
		};

		updatePortalTarget();
		const ancestryConnection = instance.AncestryChanged.Connect(updatePortalTarget);

		return () => {
			ancestryConnection.Disconnect();
		};
	}, [instance]);

	return portalTarget;
}

function resolveTriggerOverlayZIndexBase(trigger: GuiObject, portalTarget: LayerCollector): number {
	let zIndexBase = trigger.ZIndex;
	let current: Instance | undefined = trigger;

	while (current !== undefined && current !== portalTarget) {
		if (current.IsA("GuiObject")) {
			zIndexBase = math.max(zIndexBase, current.ZIndex);
		}

		current = current.Parent;
	}

	return zIndexBase;
}

function resolveTriggerOverlayLayout(trigger: GuiObject | undefined): TriggerOverlayLayout | undefined {
	if (trigger === undefined) {
		return undefined;
	}

	const portalTarget = resolveLayerCollector(trigger);
	if (portalTarget === undefined) {
		return undefined;
	}

	return {
		portalTarget,
		zIndexBase: resolveTriggerOverlayZIndexBase(trigger, portalTarget),
		bounds: {
			position: trigger.AbsolutePosition,
			size: trigger.AbsoluteSize,
		},
	};
}

export function useTriggerOverlayLayout(
	trigger: GuiObject | undefined,
	enabled = true,
): TriggerOverlayLayout | undefined {
	const [layout, setLayout] = React.useState<TriggerOverlayLayout>();

	React.useEffect(() => {
		if (!enabled || trigger === undefined) {
			setLayout(undefined);
			return;
		}

		const updateLayout = () => {
			setLayout(resolveTriggerOverlayLayout(trigger));
		};
		let cancelled = false;
		const updateLayoutAfterCommit = () => {
			if (!cancelled) {
				updateLayout();
			}
		};

		updateLayout();
		task.delay(0, updateLayoutAfterCommit);

		const absolutePositionConnection = trigger.GetPropertyChangedSignal("AbsolutePosition").Connect(updateLayout);
		const absoluteSizeConnection = trigger.GetPropertyChangedSignal("AbsoluteSize").Connect(updateLayout);
		const ancestryConnection = trigger.AncestryChanged.Connect(updateLayout);

		return () => {
			cancelled = true;
			absolutePositionConnection.Disconnect();
			absoluteSizeConnection.Disconnect();
			ancestryConnection.Disconnect();
		};
	}, [enabled, trigger]);

	return layout;
}

function useOverlayOrigin(overlayFrame: GuiObject | undefined): Vector2 | undefined {
	const [overlayOrigin, setOverlayOrigin] = React.useState<Vector2>();

	React.useEffect(() => {
		if (overlayFrame === undefined) {
			setOverlayOrigin(undefined);
			return;
		}

		const updateOverlayOrigin = () => {
			setOverlayOrigin(overlayFrame.AbsolutePosition);
		};

		updateOverlayOrigin();
		const absolutePositionConnection = overlayFrame
			.GetPropertyChangedSignal("AbsolutePosition")
			.Connect(updateOverlayOrigin);
		const ancestryConnection = overlayFrame.AncestryChanged.Connect(updateOverlayOrigin);

		return () => {
			absolutePositionConnection.Disconnect();
			ancestryConnection.Disconnect();
		};
	}, [overlayFrame]);

	return overlayOrigin;
}

export function useOverlayLocalPosition(
	overlayFrame: GuiObject | undefined,
	absolutePosition: Vector2 | undefined,
): Vector2 | undefined {
	const overlayOrigin = useOverlayOrigin(overlayFrame);

	return absolutePosition !== undefined && overlayOrigin !== undefined
		? absolutePosition.sub(overlayOrigin)
		: undefined;
}

export function LayerPortal({ children, target }: LayerPortalProps): React.ReactElement | undefined {
	return target !== undefined ? ReactRoblox.createPortal(children, target) : undefined;
}

function PortalLayer({ children, hostSlotProps }: PortalLayerProps): React.ReactElement {
	const [hostInstance, setHostInstance] = React.useState<Frame>();
	const portalTarget = usePortalTarget(hostInstance);

	return (
		<>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromOffset(0, 0)}
				Visible={false}
				{...hostSlotProps}
				ref={setHostInstance}
			/>
			<LayerPortal target={portalTarget}>{children}</LayerPortal>
		</>
	);
}

export function ScreenOverlayLayer({
	children,
	hostSlotProps,
	slotProps,
	zIndex,
}: ScreenOverlayLayerProps): React.ReactElement {
	return (
		<PortalLayer hostSlotProps={hostSlotProps}>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Active={false}
				Selectable={false}
				ZIndex={zIndex}
				{...slotProps}
			>
				{children}
			</frame>
		</PortalLayer>
	);
}

export function CaptureOverlay({
	active,
	target,
	Event,
	zIndex = CAPTURE_OVERLAY_Z_INDEX,
	slotProps,
}: CaptureOverlayProps): React.ReactElement | undefined {
	if (!active || Event === undefined) {
		return undefined;
	}

	return (
		<LayerPortal target={target}>
			<textbutton
				AutoButtonColor={false}
				Active={true}
				Selectable={false}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Text=""
				TextTransparency={1}
				TextStrokeTransparency={1}
				ZIndex={zIndex}
				Event={Event}
				{...slotProps}
			/>
		</LayerPortal>
	);
}
