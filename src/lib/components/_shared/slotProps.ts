import type React from "@rbxts/react";

export type RawSlotProps<TSlots> = {
	readonly [Slot in keyof TSlots]?: TSlots[Slot] extends Instance ? Partial<React.InstanceProps<TSlots[Slot]>> : never;
};
