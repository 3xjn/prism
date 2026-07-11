import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Box } from "../Box";
import { Text } from "../Text";

import { Modal } from "./Modal";
import type { ModalProps } from "./types";

const modalRef = React.createRef<Frame>();
type ExportedModalProps = React.ComponentProps<typeof Modal>;

const validModalProps: ModalProps[] = [
	{ opened: true, onClose: () => undefined },
	{ opened: false, onClose: () => undefined, title: "Settings" },
	{ opened: true, onClose: () => undefined, closeOnBackdropClick: false },
	{ opened: true, onClose: () => undefined, closeOnBack: false },
	{ opened: true, onClose: () => undefined, withCloseButton: false },
	{ opened: true, onClose: () => undefined, size: "sm" },
	{ opened: true, onClose: () => undefined, size: "md" },
	{ opened: true, onClose: () => undefined, size: "lg" },
	{ opened: true, onClose: () => undefined, size: "xl", fullWidth: true },
	{ opened: true, onClose: () => undefined, width: 420, minWidth: 320, maxWidth: 640, maxHeight: 520, zIndex: 12 },
	{ opened: true, onClose: () => undefined, p: "xl", bg: themeRefs.background.surface },
	{
		opened: true,
		onClose: () => undefined,
		slotProps: {
			overlay: { ZIndex: 8 },
			backdrop: { BackgroundTransparency: 0.8 },
			contentLayer: { BackgroundTransparency: 1 },
		},
	},
	{ opened: true, onClose: () => undefined, slotProps: { content: { Rotation: 0 }, contentStroke: { Thickness: 2 } } },
	{
		opened: true,
		onClose: () => undefined,
		slotProps: { header: { BackgroundTransparency: 1 }, title: { TextColor3: Color3.fromRGB(33, 37, 41) } },
	},
	{
		opened: true,
		onClose: () => undefined,
		slotProps: {
			closeButton: { AutoButtonColor: true },
			closeButtonCorner: { CornerRadius: new UDim(0, 10) },
			closeIcon: { Size: UDim2.fromOffset(14, 14) },
		},
	},
	{
		opened: true,
		onClose: () => undefined,
		slotProps: {
			body: { ScrollBarThickness: 10 },
			bodyContent: { BackgroundTransparency: 1 },
			contentPadding: { PaddingLeft: new UDim(0, 24) },
		},
	},
	{ opened: true, onClose: () => undefined, ref: modalRef },
];

const validExportedModalProps: ExportedModalProps[] = [
	{ opened: true, onClose: () => undefined },
	{ opened: true, onClose: () => undefined, title: "Modal", withCloseButton: false },
	{ opened: true, onClose: () => undefined, size: "lg", closeOnBackdropClick: false, closeOnBack: false },
	{ opened: false, onClose: () => undefined, fullWidth: true },
];

const validModalExamples = [
	<Modal key="closed" opened={false} onClose={() => undefined} />,
	<Modal key="title" opened onClose={() => undefined} title="Settings" />,
	<Modal key="body" opened onClose={() => undefined} title="Profile">
		<React.Fragment>
			<Text text="Preview body" width="100%" wrap />
		</React.Fragment>
	</Modal>,
	<Modal key="backdrop" opened onClose={() => undefined} closeOnBackdropClick={false} />,
	<Modal key="back-barrier" opened onClose={() => undefined} closeOnBack={false} />,
	<Modal key="button" opened onClose={() => undefined} withCloseButton={false} />,
	<Modal key="sizes" opened onClose={() => undefined} size="xl" fullWidth />,
	<Modal
		key="slots"
		opened
		onClose={() => undefined}
		slotProps={{
			overlay: { ZIndex: 11 },
			contentLayer: { BackgroundTransparency: 1 },
			content: { Rotation: 0 },
			title: { Text: "Override" },
			closeIcon: { ImageTransparency: 0.1 },
			body: { ScrollBarThickness: 12 },
			bodyContent: { BackgroundTransparency: 1 },
		}}
	>
		<Box width="100%" />
	</Modal>,
	<Modal key="ref" opened onClose={() => undefined} ref={modalRef} />,
];

const acceptsModalChildren: React.ReactNode = validModalExamples;
const acceptsModalProps: ModalProps[] = validModalProps;
const acceptsExportedModalProps: ExportedModalProps[] = validExportedModalProps;

type ModalOpenedRequired = undefined extends ModalProps["opened"] ? false : true;
type InvalidModalSizeAllowed = "xxl" extends NonNullable<ModalProps["size"]> ? true : false;
type InvalidModalTitleAllowed = boolean extends NonNullable<ModalProps["title"]> ? true : false;
type ExportedModalOpenedAllowed = true extends NonNullable<ExportedModalProps["opened"]> ? true : false;

const modalOpenedRequired: ModalOpenedRequired = true;
const invalidModalSize: InvalidModalSizeAllowed = false;
const invalidModalTitle: InvalidModalTitleAllowed = false;
const exportedModalOpened: ExportedModalOpenedAllowed = true;

export {
	acceptsExportedModalProps,
	acceptsModalChildren,
	acceptsModalProps,
	exportedModalOpened,
	invalidModalSize,
	invalidModalTitle,
	modalOpenedRequired,
};
