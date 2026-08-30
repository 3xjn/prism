import type { ThemeOverride } from "../theme/index";
type LuauProps = Record<string, unknown>;
export interface PrismLuauNode {
    readonly component: string;
    readonly props?: LuauProps;
    readonly children?: PrismLuauNode | readonly PrismLuauNode[];
}
export interface PrismLuauMountHandle {
    readonly update: (tree: PrismLuauNode) => void;
    readonly destroy: () => void;
}
export declare function mountPrism(parent: Instance, tree: PrismLuauNode, theme?: ThemeOverride): PrismLuauMountHandle;
export {};
