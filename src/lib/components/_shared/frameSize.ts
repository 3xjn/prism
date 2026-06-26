import type { SharedSizeConstraint } from "./useResolvedStyleProps";

export interface ResolvedFrameSizeProps {
	readonly size: UDim2;
	readonly automaticSize?: Enum.AutomaticSize;
}

export function resolveMinimumHeightConstraint(
	resolvedConstraint: SharedSizeConstraint | undefined,
	minimumHeight: number,
): SharedSizeConstraint {
	if (resolvedConstraint === undefined) {
		return {
			min: new Vector2(0, minimumHeight),
			max: undefined,
		};
	}

	return {
		min:
			resolvedConstraint.min === undefined
				? new Vector2(0, minimumHeight)
				: new Vector2(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, minimumHeight)),
		max: resolvedConstraint.max,
	};
}

export function resolveFrameSizeProps(
	resolvedSize: UDim2 | undefined,
	resolvedWidth: UDim | undefined,
	resolvedHeight: UDim | undefined,
): ResolvedFrameSizeProps {
	if (resolvedSize !== undefined) {
		return { size: resolvedSize };
	}

	if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		return { size: new UDim2(resolvedWidth, resolvedHeight) };
	}

	if (resolvedWidth !== undefined) {
		return { size: new UDim2(resolvedWidth, new UDim(0, 0)), automaticSize: Enum.AutomaticSize.Y };
	}

	if (resolvedHeight !== undefined) {
		return { size: new UDim2(new UDim(0, 0), resolvedHeight), automaticSize: Enum.AutomaticSize.X };
	}

	return { size: UDim2.fromOffset(0, 0), automaticSize: Enum.AutomaticSize.XY };
}
