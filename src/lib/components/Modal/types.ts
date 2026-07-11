import type React from "@rbxts/react";

import type { RawSlotProps } from "../_shared/slotProps";
import type { SharedStyleProps } from "../_shared/useResolvedStyleProps";

export interface ModalSlots {
	readonly overlay: Frame;
	readonly backdrop: TextButton;
	readonly contentLayer: Frame;
	readonly content: Frame;
	readonly contentCorner: UICorner;
	readonly contentStroke: UIStroke;
	readonly contentPadding: UIPadding;
	readonly contentLayout: UIListLayout;
	readonly sizeConstraint: UISizeConstraint;
	readonly header: Frame;
	readonly headerSizeConstraint: UISizeConstraint;
	readonly title: TextLabel;
	readonly closeButton: TextButton;
	readonly closeButtonCorner: UICorner;
	readonly closeIcon: ImageLabel;
	readonly body: ScrollingFrame;
	readonly bodyContent: Frame;
}

export type ModalSlotProps = RawSlotProps<ModalSlots>;

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalStyleProps extends SharedStyleProps {
	readonly size?: ModalSize;
	readonly fullWidth?: boolean;
	readonly title?: string | number;
	readonly closeOnBackdropClick?: boolean;
	/** Close the modal when Escape or gamepad ButtonB is pressed. Defaults to true. */
	readonly closeOnBack?: boolean;
	readonly withCloseButton?: boolean;
}

export interface ModalProps extends ModalStyleProps {
	readonly opened: boolean;
	readonly onClose: () => void;
	readonly children?: React.ReactNode;
	readonly Event?: React.InstanceProps<Frame>["Event"];
	readonly Change?: React.InstanceProps<Frame>["Change"];
	readonly slotProps?: ModalSlotProps;
	readonly ref?: React.Ref<Frame>;
}
