import type { SharedSizeConstraint, SharedStyleProps } from "./useResolvedStyleProps";

function mergeSharedSizeConstraint(
	base?: SharedSizeConstraint,
	override?: SharedSizeConstraint,
): SharedSizeConstraint | undefined {
	if (base === undefined && override === undefined) {
		return undefined;
	}

	return {
		min: override?.min ?? base?.min,
		max: override?.max ?? base?.max,
	};
}

export function mergeSharedStyleProps(base?: Partial<SharedStyleProps>, override?: Partial<SharedStyleProps>): SharedStyleProps {
	return {
		cursor: override?.cursor ?? base?.cursor,
		width: override?.width ?? base?.width,
		height: override?.height ?? base?.height,
		minWidth: override?.minWidth ?? base?.minWidth,
		maxWidth: override?.maxWidth ?? base?.maxWidth,
		minHeight: override?.minHeight ?? base?.minHeight,
		maxHeight: override?.maxHeight ?? base?.maxHeight,
		position: override?.position ?? base?.position,
		anchor: override?.anchor ?? base?.anchor,
		center: override?.center ?? base?.center,
		p: override?.p ?? base?.p,
		px: override?.px ?? base?.px,
		py: override?.py ?? base?.py,
		pt: override?.pt ?? base?.pt,
		pr: override?.pr ?? base?.pr,
		pb: override?.pb ?? base?.pb,
		pl: override?.pl ?? base?.pl,
		bg: override?.bg ?? base?.bg,
		bgTransparency: override?.bgTransparency ?? base?.bgTransparency,
		sizeConstraint: mergeSharedSizeConstraint(base?.sizeConstraint, override?.sizeConstraint),
		clip: override?.clip ?? base?.clip,
		visible: override?.visible ?? base?.visible,
		layoutOrder: override?.layoutOrder ?? base?.layoutOrder,
		zIndex: override?.zIndex ?? base?.zIndex,
	};
}
