import React from "@rbxts/react";

import { WorldPortal } from "./WorldPortal";
import type { WorldPortalHost, WorldPortalProps } from "./types";

const part = new Instance("Part");
const attachment = new Instance("Attachment");
const portalRef = React.createRef<WorldPortalHost>();
type ExportedWorldPortalProps = React.ComponentProps<typeof WorldPortal>;

const validWorldPortalProps: WorldPortalProps[] = [
	{ adornee: part },
	{ kind: "billboard", adornee: attachment, size: UDim2.fromOffset(180, 72), studsOffset: new Vector3(0, 3, 0) },
	{ kind: "surface", adornee: part, face: Enum.NormalId.Top, canvasSize: new Vector2(256, 256), pixelsPerStud: 32 },
	{ adornee: part, enabled: false, parent: game.GetService("Workspace") },
	{ adornee: part, slotProps: { billboard: { MaxDistance: 48, AlwaysOnTop: false } } },
	{ kind: "surface", adornee: part, slotProps: { surface: { LightInfluence: 0.4, AlwaysOnTop: true } } },
	{ adornee: part, ref: portalRef },
];

const validExportedWorldPortalProps: ExportedWorldPortalProps[] = [
	{ adornee: part },
	{ kind: "surface", adornee: part },
];

const validWorldPortalExamples = [
	<WorldPortal key="billboard" adornee={part}>
		<frame Size={UDim2.fromOffset(120, 44)} BackgroundTransparency={1} />
	</WorldPortal>,
	<WorldPortal key="surface" kind="surface" adornee={part} face={Enum.NormalId.Front}>
		<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} />
	</WorldPortal>,
];

const acceptsWorldPortalChildren: React.ReactNode = validWorldPortalExamples;
const acceptsWorldPortalProps: WorldPortalProps[] = validWorldPortalProps;
const acceptsExportedWorldPortalProps: ExportedWorldPortalProps[] = validExportedWorldPortalProps;

type WorldPortalHasChildrenProp = "children" extends keyof WorldPortalProps ? true : false;
type InvalidWorldPortalKindAllowed = "screen" extends NonNullable<WorldPortalProps["kind"]> ? true : false;
type ExportedWorldPortalAdorneeAllowed = BasePart extends NonNullable<ExportedWorldPortalProps["adornee"]> ? true : false;

const worldPortalHasChildrenProp: WorldPortalHasChildrenProp = true;
const invalidWorldPortalKindAllowed: InvalidWorldPortalKindAllowed = false;
const exportedWorldPortalAdorneeAllowed: ExportedWorldPortalAdorneeAllowed = true;

export {
	acceptsExportedWorldPortalProps,
	acceptsWorldPortalChildren,
	acceptsWorldPortalProps,
	exportedWorldPortalAdorneeAllowed,
	invalidWorldPortalKindAllowed,
	worldPortalHasChildrenProp,
};
