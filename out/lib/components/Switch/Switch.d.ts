import React from "@rbxts/react";
import type { SwitchProps } from "./types";
type SwitchComponent = ((props: SwitchProps) => React.ReactElement) & React.ForwardRefExoticComponent<SwitchProps>;
export declare const Switch: SwitchComponent;
export {};
