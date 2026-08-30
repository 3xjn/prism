import React from "@rbxts/react";
import type { InputProps } from "./types";
type InputComponent = ((props: InputProps) => React.ReactElement) & React.ForwardRefExoticComponent<InputProps>;
export declare const Input: InputComponent;
export {};
