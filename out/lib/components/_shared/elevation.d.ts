import React from "@rbxts/react";
import type { ThemeShadow } from "../../theme/index";
export interface ElevationShadowProps {
    /** Theme shadow token driving color, spread, and opacity. */
    readonly shadow: ThemeShadow;
    /** Corner radius of the surface the shadow sits behind. */
    readonly radius: UDim;
    /**
     * Explicit container size. When omitted, the shadow measures its
     * parent's AbsoluteSize instead — scale-sized shadow children can
     * lock an AutomaticSize parent into an inflated layout fixed point,
     * so the container is never scale-sized.
     */
    readonly size?: UDim2;
    readonly zIndex?: number;
    readonly visible?: boolean;
    readonly slotProps?: {
        readonly root?: Partial<React.InstanceProps<Frame>>;
        readonly ring?: Partial<React.InstanceProps<UIStroke>>;
    };
}
/**
 * Soft drop shadow built from stacked UIStroke rings. Ring frames never
 * exceed the surface bounds and the falloff lives entirely in stroke
 * thickness (strokes are render-only), so the shadow neither tints the
 * surface nor inflates AutomaticSize parents. Render it before
 * decorators and content so it stays underneath siblings.
 */
export declare function renderElevationShadow(props: ElevationShadowProps): React.ReactElement;
