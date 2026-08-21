import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface WindowSlots {
	readonly overlay: Frame;
	readonly root: Frame;
	readonly rootCorner: UICorner;
	readonly rootStroke: UIStroke;
	readonly sizeConstraint: UISizeConstraint;
	readonly shadow: Frame;
	readonly titleBar: Frame;
	readonly leading: Frame;
	readonly title: TextLabel;
	readonly trailing: Frame;
	readonly controls: Frame;
	readonly collapseButton: TextButton;
	readonly maximizeButton: TextButton;
	readonly closeButton: TextButton;
	readonly body: Frame;
	readonly rail: Frame;
	readonly content: Frame;
	readonly resizeHandle: TextButton;
	readonly collapseControl: TextButton;
}

export type WindowSlotProps = RawSlotProps<WindowSlots>;

export interface WindowStyleProps extends SharedStyleProps {
	readonly title?: string | number;
}

/**
 * Floating framed overlay. Prism portals it into the nearest
 * `LayerCollector` (typically a `ScreenGui`) so drag, resize, and
 * maximize are not owned by a parent layout.
 *
 * Host the tree in a `ScreenGui` with `ZIndexBehavior.Sibling`, the
 * same requirement as Modal and other overlays. Maximize fills that
 * collector flush. Bounds are clamped to the collector with a theme
 * spacing margin while floating.
 */
export interface WindowProps extends WindowStyleProps {
	readonly collapsed?: boolean;
	readonly defaultCollapsed?: boolean;
	readonly onCollapsedChange?: (collapsed: boolean) => void;
	readonly maximized?: boolean;
	readonly defaultMaximized?: boolean;
	readonly onMaximizedChange?: (maximized: boolean) => void;
	readonly onClose?: () => void;
	readonly leading?: React.ReactNode;
	readonly trailing?: React.ReactNode;
	readonly rail?: React.ReactNode;
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: WindowSlotProps;
	readonly ref?: React.Ref<Frame>;
}
