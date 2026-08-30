import type { ConcreteColorValue, Theme } from "./types";
export declare function resolveColor(theme: Theme, value: ConcreteColorValue): Color3;
export declare function resolveSize(theme: Theme, key: keyof Theme["spacing"], scale: "spacing" | "radius" | "fontSizes"): number;
