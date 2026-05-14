import React from "@rbxts/react";

export interface TriggerOverlayBounds {
	readonly position: Vector2;
	readonly size: Vector2;
}

export interface TriggerOverlayLayout {
	readonly portalTarget: LayerCollector;
	readonly bounds: TriggerOverlayBounds;
	readonly zIndexBase: number;
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

	const portalTarget = trigger.FindFirstAncestorWhichIsA("LayerCollector");
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

		updateLayout();

		const absolutePositionConnection = trigger.GetPropertyChangedSignal("AbsolutePosition").Connect(updateLayout);
		const absoluteSizeConnection = trigger.GetPropertyChangedSignal("AbsoluteSize").Connect(updateLayout);
		const ancestryConnection = trigger.AncestryChanged.Connect(updateLayout);

		return () => {
			absolutePositionConnection.Disconnect();
			absoluteSizeConnection.Disconnect();
			ancestryConnection.Disconnect();
		};
	}, [enabled, trigger]);

	return layout;
}
