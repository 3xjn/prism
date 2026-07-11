import React from "@rbxts/react";

import { useTheme } from "@prism/theme";

import { ScreenOverlayLayer } from "../../components/_shared/layering";
import { DEFAULT_NOTIFICATION_OVERLAY_Z_INDEX } from "../../components/_shared/overlayLayerPolicy";
import type { NotificationPosition } from "../types";

import { NotificationCard } from "./NotificationCard";
import { NotificationSnapshotContext } from "./notificationContext";

const MAX_STACK_WIDTH = 360;
const MAX_STACK_HEIGHT = 100_000;

interface NotificationStackProps {
	readonly portal: boolean;
	readonly position: NotificationPosition;
	readonly zIndex?: number;
}

interface NotificationStackPlacement {
	readonly anchorPoint: Vector2;
	readonly position: UDim2;
	readonly reverseOrder: boolean;
}

function resolveStackPlacement(position: NotificationPosition): NotificationStackPlacement {
	switch (position) {
		case "top-left":
			return {
				anchorPoint: new Vector2(0, 0),
				position: UDim2.fromScale(0, 0),
				reverseOrder: false,
			};
		case "top-center":
			return {
				anchorPoint: new Vector2(0.5, 0),
				position: UDim2.fromScale(0.5, 0),
				reverseOrder: false,
			};
		case "bottom-left":
			return {
				anchorPoint: new Vector2(0, 1),
				position: UDim2.fromScale(0, 1),
				reverseOrder: true,
			};
		case "bottom-center":
			return {
				anchorPoint: new Vector2(0.5, 1),
				position: UDim2.fromScale(0.5, 1),
				reverseOrder: true,
			};
		case "bottom-right":
			return {
				anchorPoint: new Vector2(1, 1),
				position: UDim2.fromScale(1, 1),
				reverseOrder: true,
			};
		case "top-right":
		default:
			return {
				anchorPoint: new Vector2(1, 0),
				position: UDim2.fromScale(1, 0),
				reverseOrder: false,
			};
	}
}

export function NotificationStack({ portal, position, zIndex }: NotificationStackProps): React.ReactElement | undefined {
	const context = React.useContext(NotificationSnapshotContext);
	const theme = useTheme();

	if (context === undefined) {
		return undefined;
	}

	const resolvedZIndex = zIndex ?? DEFAULT_NOTIFICATION_OVERLAY_Z_INDEX;
	const edgeInset = theme.spacing.lg;
	const placement = resolveStackPlacement(position);

	const stack = (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Position={UDim2.fromOffset(edgeInset, edgeInset)}
			Size={new UDim2(1, -(edgeInset * 2), 1, -(edgeInset * 2))}
			ClipsDescendants={false}
			Active={false}
			Selectable={false}
			ZIndex={resolvedZIndex}
		>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				AnchorPoint={placement.anchorPoint}
				Position={placement.position}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				ClipsDescendants={false}
				Active={false}
				Selectable={false}
				ZIndex={resolvedZIndex}
			>
				<uisizeconstraint key="width-constraint" MaxSize={new Vector2(MAX_STACK_WIDTH, MAX_STACK_HEIGHT)} />
				<uilistlayout
					key="list-layout"
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, theme.spacing.sm)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{context.snapshot.visible.map((record, index) => (
					<NotificationCard
						key={record.id}
						record={record}
						store={context.store}
						layoutOrder={placement.reverseOrder ? -index : index}
						zIndex={resolvedZIndex}
					/>
				))}
			</frame>
		</frame>
	);

	return portal ? <ScreenOverlayLayer zIndex={resolvedZIndex}>{stack}</ScreenOverlayLayer> : stack;
}
