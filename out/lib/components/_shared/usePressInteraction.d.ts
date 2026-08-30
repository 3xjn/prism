import React from "@rbxts/react";
export type InteractionState = "idle" | "hovered" | "pressed" | "disabled";
export type PressInteractionEventMap = React.InstanceProps<GuiButton>["Event"];
export interface PressInteractionOptions {
    /** When false, hover/press state resets and input is ignored. */
    readonly interactive: boolean;
    /**
     * Drives the "disabled" interaction state. Defaults to !interactive;
     * pass explicitly when a component can be non-interactive without
     * being disabled (for example Pressable's `active` prop), so the
     * state reads "idle" instead of "disabled".
     */
    readonly disabled?: boolean;
    /** Called on Activated while interactive. */
    readonly onActivated?: () => void;
}
export interface PressInteraction {
    readonly hovered: boolean;
    readonly pressed: boolean;
    readonly state: InteractionState;
    /** Compose into the root's Event map via composeEventMaps. */
    readonly eventMap: PressInteractionEventMap;
}
/**
 * Shared hover/press state machine for interactive roots. Owns the
 * hovered/pressed useState pair, resets both while non-interactive, and
 * returns the Event handlers that drive them.
 */
export declare function usePressInteraction(options: PressInteractionOptions): PressInteraction;
