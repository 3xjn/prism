import React from "@rbxts/react";
import type { ModalProps } from "./types";
type ModalComponent = ((props: ModalProps) => React.ReactElement) & React.ForwardRefExoticComponent<ModalProps>;
export declare const Modal: ModalComponent;
export {};
