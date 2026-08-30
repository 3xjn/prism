import React from "@rbxts/react";
import type { SelectProps } from "./types";
type SelectComponent = ((props: SelectProps) => React.ReactElement) & React.ForwardRefExoticComponent<SelectProps>;
export declare const Select: SelectComponent;
export {};
