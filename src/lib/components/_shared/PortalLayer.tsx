import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

export interface PortalLayerProps {
	readonly children?: React.ReactNode;
	readonly hostSlotProps?: Partial<React.InstanceProps<Frame>>;
}

export function PortalLayer({ children, hostSlotProps }: PortalLayerProps): React.ReactElement {
	const [hostInstance, setHostInstance] = React.useState<Frame>();
	const [portalTarget, setPortalTarget] = React.useState<LayerCollector>();

	React.useEffect(() => {
		if (hostInstance === undefined) {
			setPortalTarget(undefined);
			return;
		}

		const updatePortalTarget = () => {
			setPortalTarget(hostInstance.FindFirstAncestorWhichIsA("LayerCollector"));
		};

		updatePortalTarget();
		const ancestryConnection = hostInstance.AncestryChanged.Connect(updatePortalTarget);

		return () => {
			ancestryConnection.Disconnect();
		};
	}, [hostInstance]);

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
			{portalTarget !== undefined ? ReactRoblox.createPortal(children, portalTarget) : undefined}
		</>
	);
}
