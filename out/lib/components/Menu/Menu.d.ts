import React from "@rbxts/react";
import type { MenuProps } from "./types";
type MenuComponent = ((props: MenuProps) => React.ReactElement) & React.ForwardRefExoticComponent<MenuProps>;
export declare const Menu: MenuComponent;
export {};
