import React from "@rbxts/react";
import type { DraggableItem, DraggableProps } from "./types";
type DraggableComponentType = <TItem extends DraggableItem>(props: DraggableProps<TItem>) => React.ReactElement;
export declare const Draggable: DraggableComponentType;
export {};
