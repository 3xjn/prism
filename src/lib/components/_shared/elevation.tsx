import React from "@rbxts/react";

import type { ThemeShadow } from "@prism/theme";

interface ShadowRing {
	readonly thickness: number;
	readonly transparency: number;
}

export interface ElevationShadowProps {
	/** Theme shadow token driving color, spread, and opacity. */
	readonly shadow: ThemeShadow;
	/** Corner radius of the surface the shadow sits behind. */
	readonly radius: UDim;
	/**
	 * Explicit container size. REQUIRED when the surface uses
	 * AutomaticSize: scale-sized children can lock an AutomaticSize
	 * parent into an inflated layout fixed point, so pass the measured
	 * pixel size instead (see Card). Defaults to full surface scale.
	 */
	readonly size?: UDim2;
	readonly zIndex?: number;
	readonly visible?: boolean;
	readonly slotProps?: {
		readonly root?: Partial<React.InstanceProps<Frame>>;
		readonly ring?: Partial<React.InstanceProps<UIStroke>>;
	};
}

const SHADOW_RING_COUNT = 10;

function resolveShadowRings(shadow: ThemeShadow): ShadowRing[] {
	// Stacked strokes: ring i covers 0..t_i outward, so the cumulative
	// alpha at distance d is the sum of every ring reaching past d.
	// Setting each ring's alpha to the gaussian *difference* between its
	// inner and outer shell makes the stack reproduce a smooth gaussian
	// falloff with no visible banding.
	const spread = math.max(shadow.thickness, 1) * 12;
	const sigma = spread / 1.7;
	const peak = math.min((1 - shadow.transparency) * 1.45, 0.4);
	const rings: ShadowRing[] = [];

	const gauss = (d: number) => math.exp(-(d * d) / (2 * sigma * sigma));

	for (let index = 1; index <= SHADOW_RING_COUNT; index++) {
		const inner = (spread * (index - 1)) / SHADOW_RING_COUNT;
		const outer = (spread * index) / SHADOW_RING_COUNT;
		const alpha = peak * (gauss(inner) - gauss(outer));
		rings.push({ thickness: outer, transparency: math.clamp(1 - alpha, 0, 1) });
	}

	return rings;
}

/**
 * Soft drop shadow built from stacked UIStroke rings. Every ring frame is
 * exactly surface-sized and the falloff lives entirely in stroke
 * thickness, so the shadow neither tints the surface nor inflates
 * AutomaticSize parents (strokes are render-only). Render it before
 * decorators and content so it stays underneath siblings.
 */
export function renderElevationShadow(props: ElevationShadowProps): React.ReactElement {
	const { shadow, radius, size, zIndex, visible, slotProps } = props;
	const rings = resolveShadowRings(shadow);

	return (
		<frame
			key="elevation-shadow"
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={size ?? UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			ZIndex={zIndex ?? 0}
			Visible={visible}
			{...slotProps?.root}
		>
			{rings.map((ring, index) => (
				<frame
					key={`ring-${index}`}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<uicorner CornerRadius={radius} />
					<uistroke
						Color={shadow.color}
						Thickness={ring.thickness}
						Transparency={ring.transparency}
						{...slotProps?.ring}
					/>
				</frame>
			))}
		</frame>
	);
}
