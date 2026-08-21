import React from "@rbxts/react";

import {
	clampWindowBounds,
	resolveCenteredWindowPosition,
	resolveUDimPixels,
	type WindowBounds,
	type WindowClampOptions,
	type WindowViewport,
} from "./utils";

export function useAbsoluteSize(instance: GuiObject | undefined): Vector2 | undefined {
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

export function resolveViewport(size: Vector2 | undefined): WindowViewport {
	if (size === undefined) {
		return { width: 0, height: 0 };
	}

	return { width: size.X, height: size.Y };
}

export function resolveLocalInputPosition(input: InputObject, overlay: GuiObject): Vector2 {
	return new Vector2(input.Position.X, input.Position.Y).sub(overlay.AbsolutePosition);
}

export function resolveInitialWindowBounds(
	viewport: WindowViewport,
	width: number,
	height: number,
	position: UDim2 | undefined,
	center: boolean | undefined,
	options: WindowClampOptions,
): WindowBounds {
	const centered = resolveCenteredWindowPosition(width, height, viewport);
	const usesCenteredPlacement = position === undefined && center !== false;
	const x = usesCenteredPlacement || position === undefined ? centered.x : resolveUDimPixels(position.X, viewport.width);
	const y = usesCenteredPlacement || position === undefined ? centered.y : resolveUDimPixels(position.Y, viewport.height);

	return clampWindowBounds({ x, y, width, height }, options);
}

export function toClampOptions(
	viewport: WindowViewport,
	minWidth: number,
	minHeight: number,
	maxWidth: number | undefined,
	maxHeight: number | undefined,
	margin: number,
): WindowClampOptions {
	return {
		minWidth,
		minHeight,
		maxWidth,
		maxHeight,
		viewport,
		margin,
	};
}
