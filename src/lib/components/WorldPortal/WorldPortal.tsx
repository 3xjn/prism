import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

import { assignRef } from "../_shared/interaction";

import type { WorldPortalHost, WorldPortalProps } from "./types";

const DEFAULT_BILLBOARD_SIZE = UDim2.fromScale(4, 1.6);
const DEFAULT_SURFACE_CANVAS_SIZE = new Vector2(512, 256);

type WorldPortalComponent = ((props: WorldPortalProps) => React.ReactElement | undefined) & React.ForwardRefExoticComponent<WorldPortalProps>;

const WorldPortalBase = React.forwardRef<WorldPortalHost, WorldPortalProps>((props, ref) => {
	const {
		children,
		enabled = true,
		parent,
		zIndexBehavior = Enum.ZIndexBehavior.Sibling,
		slotProps,
	} = props;

	if (!enabled) {
		return <></>;
	}

	if (props.kind === "surface") {
		const portalParent = parent ?? props.adornee;

		return ReactRoblox.createPortal(
			<surfacegui
				Adornee={props.adornee}
				Face={props.face ?? Enum.NormalId.Front}
				CanvasSize={props.canvasSize ?? DEFAULT_SURFACE_CANVAS_SIZE}
				SizingMode={props.sizingMode ?? Enum.SurfaceGuiSizingMode.PixelsPerStud}
				PixelsPerStud={props.pixelsPerStud ?? 50}
				AlwaysOnTop={props.alwaysOnTop ?? false}
				Active={props.active ?? false}
				Brightness={props.brightness ?? 1}
				ClipsDescendants={props.clipsDescendants ?? true}
				LightInfluence={props.lightInfluence ?? 0}
				ZIndexBehavior={zIndexBehavior}
				{...slotProps?.surface}
				ref={(instance) => assignRef(ref, instance)}
			>
				{children}
			</surfacegui>,
			portalParent,
		);
	}

	const portalParent = parent ?? props.adornee;

	return ReactRoblox.createPortal(
		<billboardgui
			Adornee={props.adornee}
			Size={props.size ?? DEFAULT_BILLBOARD_SIZE}
			SizeOffset={props.sizeOffset ?? Vector2.zero}
			StudsOffset={props.studsOffset ?? Vector3.zero}
			StudsOffsetWorldSpace={props.studsOffsetWorldSpace ?? Vector3.zero}
			MaxDistance={props.maxDistance ?? 100}
			AlwaysOnTop={props.alwaysOnTop ?? true}
			Active={props.active ?? false}
			Brightness={props.brightness ?? 1}
			ClipsDescendants={props.clipsDescendants ?? false}
			LightInfluence={props.lightInfluence ?? 0}
			ZIndexBehavior={zIndexBehavior}
			{...slotProps?.billboard}
			ref={(instance) => assignRef(ref, instance)}
		>
			{children}
		</billboardgui>,
		portalParent,
	);
});

export const WorldPortal = WorldPortalBase as WorldPortalComponent;

WorldPortal.displayName = "WorldPortal";
