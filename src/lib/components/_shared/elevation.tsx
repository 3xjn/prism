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

function ElevationShadow(props: ElevationShadowProps): React.ReactElement {
	const { shadow, radius, size, zIndex, visible, slotProps } = props;
	const rings = resolveShadowRings(shadow);
	const [containerInstance, setContainerInstance] = React.useState<Frame>();
	const [measuredSize, setMeasuredSize] = React.useState<Vector2>();

	React.useEffect(() => {
		if (size !== undefined || containerInstance === undefined) {
			return;
		}

		const surface = containerInstance.Parent;
		if (surface === undefined || !surface.IsA("GuiObject")) {
			return;
		}

		const updateMeasuredSize = () => {
			const nextSize = surface.AbsoluteSize;
			setMeasuredSize((currentSize) =>
				currentSize !== undefined && currentSize.X === nextSize.X && currentSize.Y === nextSize.Y
					? currentSize
					: nextSize,
			);
		};

		updateMeasuredSize();
		const connection = surface.GetPropertyChangedSignal("AbsoluteSize").Connect(updateMeasuredSize);

		return () => {
			connection.Disconnect();
		};
	}, [containerInstance, size]);

	// The container is never scale-sized: explicit sizes pass through and
	// measured surfaces get pixel sizes, so AutomaticSize parents are
	// never given a self-referential layout to lock onto.
	const containerSize = size ?? (measuredSize !== undefined ? UDim2.fromOffset(measuredSize.X, measuredSize.Y) : UDim2.fromOffset(0, 0));
	const ringsVisible = visible ?? (size !== undefined || measuredSize !== undefined);

	return (
		<frame
			key="elevation-shadow"
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Size={containerSize}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			ZIndex={zIndex ?? 0}
			Visible={ringsVisible}
			ref={setContainerInstance}
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

/**
 * Soft drop shadow built from stacked UIStroke rings. Ring frames never
 * exceed the surface bounds and the falloff lives entirely in stroke
 * thickness (strokes are render-only), so the shadow neither tints the
 * surface nor inflates AutomaticSize parents. Render it before
 * decorators and content so it stays underneath siblings.
 */
export function renderElevationShadow(props: ElevationShadowProps): React.ReactElement {
	return <ElevationShadow key="elevation-shadow" {...props} />;
}
