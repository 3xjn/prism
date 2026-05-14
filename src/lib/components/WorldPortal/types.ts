import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";

export type WorldPortalKind = "billboard" | "surface";

export type WorldPortalHost = BillboardGui | SurfaceGui;

export interface WorldPortalSlots {
	readonly billboard: BillboardGui;
	readonly surface: SurfaceGui;
}

export type WorldPortalSlotProps = RawSlotProps<WorldPortalSlots>;

interface WorldPortalSharedProps {
	readonly children?: React.ReactNode;
	readonly enabled?: boolean;
	readonly parent?: Instance;
	readonly zIndexBehavior?: Enum.ZIndexBehavior;
	readonly slotProps?: WorldPortalSlotProps;
	readonly ref?: React.Ref<WorldPortalHost>;
}

export interface WorldPortalBillboardProps extends WorldPortalSharedProps {
	readonly kind?: "billboard";
	readonly adornee: PVInstance | Attachment;
	readonly active?: boolean;
	readonly alwaysOnTop?: boolean;
	readonly brightness?: number;
	readonly clipsDescendants?: boolean;
	readonly lightInfluence?: number;
	readonly maxDistance?: number;
	readonly size?: UDim2;
	readonly sizeOffset?: Vector2;
	readonly studsOffset?: Vector3;
	readonly studsOffsetWorldSpace?: Vector3;
}

export interface WorldPortalSurfaceProps extends WorldPortalSharedProps {
	readonly kind: "surface";
	readonly adornee: BasePart;
	readonly active?: boolean;
	readonly alwaysOnTop?: boolean;
	readonly brightness?: number;
	readonly canvasSize?: Vector2;
	readonly clipsDescendants?: boolean;
	readonly face?: Enum.NormalId;
	readonly lightInfluence?: number;
	readonly pixelsPerStud?: number;
	readonly sizingMode?: Enum.SurfaceGuiSizingMode;
}

export type WorldPortalProps = WorldPortalBillboardProps | WorldPortalSurfaceProps;
