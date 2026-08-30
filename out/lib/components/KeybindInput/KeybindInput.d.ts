import React from "@rbxts/react";
import type { KeybindInputProps } from "./types";
type KeybindInputComponent = ((props: KeybindInputProps) => React.ReactElement) & React.ForwardRefExoticComponent<KeybindInputProps>;
export declare const KeybindInput: KeybindInputComponent;
export {};
