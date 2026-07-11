import React from "@rbxts/react";

const Workspace = game.GetService("Workspace");

function readViewportWidth(target: GuiBase2d | undefined): number {
	if (target !== undefined) {
		return target.AbsoluteSize.X;
	}

	return Workspace.CurrentCamera?.ViewportSize.X ?? 0;
}

export function useViewportWidth(target?: GuiBase2d): number {
	const [width, setWidth] = React.useState(() => readViewportWidth(target));

	React.useEffect(() => {
		const updateWidth = () => {
			const nextWidth = readViewportWidth(target);
			setWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
		};

		updateWidth();

		if (target !== undefined) {
			const absoluteSizeConnection = target.GetPropertyChangedSignal("AbsoluteSize").Connect(updateWidth);
			return () => {
				absoluteSizeConnection.Disconnect();
			};
		}

		let viewportSizeConnection: RBXScriptConnection | undefined;
		const connectCamera = () => {
			viewportSizeConnection?.Disconnect();
			viewportSizeConnection = undefined;

			const camera = Workspace.CurrentCamera;
			if (camera !== undefined) {
				viewportSizeConnection = camera.GetPropertyChangedSignal("ViewportSize").Connect(updateWidth);
			}

			updateWidth();
		};

		connectCamera();
		const currentCameraConnection = Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(connectCamera);

		return () => {
			currentCameraConnection.Disconnect();
			viewportSizeConnection?.Disconnect();
		};
	}, [target]);

	return width;
}
