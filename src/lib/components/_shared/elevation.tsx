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

function resolveShadowRings(shadow: ThemeShadow): ShadowRing[] {
	const spread = math.max(shadow.thickness, 1);
	const base = shadow.transparency;

	return [
		{ thickness: spread + 1, transparency: math.min(base + 0.05, 0.98) },
		{ thickness: spread * 3 + 2, transparency: math.min(base + 0.12, 0.985) },
		{ thickness: spread * 5 + 5, transparency: math.min(base + 0.165, 0.99) },
	];
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
