export interface OutsidePressExcludeRect {
	readonly position: UDim2;
	readonly size: UDim2;
	readonly anchor?: Vector2;
}

interface OutsidePressRect {
	readonly min: Vector2;
	readonly max: Vector2;
}

function resolveOutsidePressRect(root: GuiObject, rect: OutsidePressExcludeRect): OutsidePressRect {
	const rootSize = root.AbsoluteSize;
	const absoluteSize = new Vector2(
		rootSize.X * rect.size.X.Scale + rect.size.X.Offset,
		rootSize.Y * rect.size.Y.Scale + rect.size.Y.Offset,
	);
	const absolutePosition = new Vector2(
		rootSize.X * rect.position.X.Scale + rect.position.X.Offset,
		rootSize.Y * rect.position.Y.Scale + rect.position.Y.Offset,
	);
	const anchor = rect.anchor ?? new Vector2(0, 0);
	const min = root.AbsolutePosition.add(absolutePosition).sub(new Vector2(absoluteSize.X * anchor.X, absoluteSize.Y * anchor.Y));

	return {
		min,
		max: min.add(absoluteSize),
	};
}

function resolveOutsidePressInstanceRect(instance: GuiObject): OutsidePressRect {
	const min = instance.AbsolutePosition;
	return {
		min,
		max: min.add(instance.AbsoluteSize),
	};
}

function isPointInsideOutsidePressRect(point: Vector2, rect: OutsidePressRect): boolean {
	return point.X >= rect.min.X && point.X <= rect.max.X && point.Y >= rect.min.Y && point.Y <= rect.max.Y;
}

export function isPointInsideOutsidePressExclusions(
	root: GuiObject,
	point: Vector2,
	excludeRect?: OutsidePressExcludeRect,
	excludeInstances?: readonly GuiObject[],
): boolean {
	if (excludeRect !== undefined && isPointInsideOutsidePressRect(point, resolveOutsidePressRect(root, excludeRect))) {
		return true;
	}

	if (excludeInstances !== undefined) {
		for (const instance of excludeInstances) {
			if (isPointInsideOutsidePressRect(point, resolveOutsidePressInstanceRect(instance))) {
				return true;
			}
		}
	}

	return false;
}
