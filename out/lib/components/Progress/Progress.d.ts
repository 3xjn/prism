import React from "@rbxts/react";
import type { ProgressProps } from "./types";
type ProgressComponent = ((props: ProgressProps) => React.ReactElement) & React.ForwardRefExoticComponent<ProgressProps>;
export declare const Progress: ProgressComponent;
export {};
