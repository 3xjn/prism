import React from "@rbxts/react";
import type { PopoverProps } from "./types";
type PopoverComponent = ((props: PopoverProps) => React.ReactElement) & React.ForwardRefExoticComponent<PopoverProps>;
export declare const Popover: PopoverComponent;
export {};
