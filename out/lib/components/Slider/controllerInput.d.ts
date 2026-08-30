import React from "@rbxts/react";
import type { SliderStepDirection } from "./utils";
type TextButtonEventMap = React.InstanceProps<TextButton>["Event"];
interface SliderControllerInputConfig {
    readonly disabled: boolean;
    readonly hitboxInstance: TextButton | undefined;
    readonly commitStep: (direction: SliderStepDirection) => void;
}
interface SliderControllerInputResult {
    readonly selected: boolean;
    readonly event: TextButtonEventMap;
}
export declare function useSliderControllerInput(config: SliderControllerInputConfig): SliderControllerInputResult;
export {};
