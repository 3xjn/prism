import React from "@rbxts/react";
import type { TooltipProps } from "./types";
type TooltipComponent = ((props: TooltipProps) => React.ReactElement) & React.ForwardRefExoticComponent<TooltipProps>;
export declare const Tooltip: TooltipComponent;
export {};
