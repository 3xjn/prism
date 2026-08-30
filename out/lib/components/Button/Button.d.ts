import React from "@rbxts/react";
import type { ButtonProps } from "./types";
type ButtonComponent = ((props: ButtonProps) => React.ReactElement) & React.ForwardRefExoticComponent<ButtonProps>;
export declare const Button: ButtonComponent;
export {};
