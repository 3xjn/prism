import type React from "@rbxts/react";

type ComponentPropsOf<TComponent> = TComponent extends (props: infer TProps) => unknown ? TProps : never;

export type RawSlotProps<TSlots> = {
	readonly [Slot in keyof TSlots]?: TSlots[Slot] extends Instance ? Partial<React.InstanceProps<TSlots[Slot]>> : never;
};

export type ComponentSlotProps<TSlots> = {
	readonly [Slot in keyof TSlots]?: Partial<ComponentPropsOf<TSlots[Slot]>>;
};
