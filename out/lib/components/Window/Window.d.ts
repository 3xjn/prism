import React from "@rbxts/react";
import type { WindowProps } from "./types";
type WindowComponent = ((props: WindowProps) => React.ReactElement) & React.ForwardRefExoticComponent<WindowProps>;
export declare const Window: WindowComponent;
export {};
