import { resolveColor, resolveSize, useTheme } from "@prism/theme";
import type { ColorToken, Theme, ThemeSize } from "@prism/theme";
import { toUDim, toUDim2 } from "@prism/utils";
import type { SizeValue, SizeValue2D } from "@prism/utils";

declare const __DEV__: boolean;

export type SharedSpacingValue = ThemeSize | SizeValue;

export type SharedCursorValue =
	| "default"
	| "pointer"
	| "grab"
	| "grabbing"
	| "resize-ew"
	| "resize-ns"
	| "resize-nesw"
	| "resize-nwse"
	| "resize-all"
	| "split-ew"
	| "split-ns"
	| "forbidden"
	| "wait"
	| "busy"
	| "crosshair"
	| `rbxasset://${string}`;

export interface SharedSizeConstraint {
	readonly min?: Vector2;
	readonly max?: Vector2;
}

export interface SharedStyleProps {
	readonly cursor?: SharedCursorValue;
	readonly width?: SizeValue;
	readonly height?: SizeValue;
	readonly minWidth?: SizeValue;
	readonly maxWidth?: SizeValue;
	readonly minHeight?: SizeValue;
	readonly maxHeight?: SizeValue;
	readonly position?: SizeValue2D;
	readonly anchor?: Vector2;
	readonly center?: boolean;
	readonly p?: SharedSpacingValue;
	readonly px?: SharedSpacingValue;
	readonly py?: SharedSpacingValue;
	readonly pt?: SharedSpacingValue;
	readonly pr?: SharedSpacingValue;
	readonly pb?: SharedSpacingValue;
	readonly pl?: SharedSpacingValue;
	readonly bg?: ColorToken | Color3;
	readonly bgTransparency?: number;
	readonly sizeConstraint?: SharedSizeConstraint;
	readonly clip?: boolean;
	readonly visible?: boolean;
	readonly layoutOrder?: number;
	readonly zIndex?: number;
}

export interface ResolvedStyleProps {
	readonly theme: Theme;
	readonly resolvedWidth?: UDim;
	readonly resolvedHeight?: UDim;
	readonly resolvedSize?: UDim2;
	readonly resolvedPosition?: UDim2;
	readonly resolvedAnchor?: Vector2;
	readonly resolvedBackgroundColor?: Color3;
	readonly resolvedConstraint?: SharedSizeConstraint;
	readonly paddingTop?: UDim;
	readonly paddingRight?: UDim;
	readonly paddingBottom?: UDim;
	readonly paddingLeft?: UDim;
	readonly hasPadding: boolean;
}

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

function isThemeSize(value: unknown): value is ThemeSize {
	switch (value) {
		case "xs":
		case "sm":
		case "md":
		case "lg":
		case "xl":
			return true;
		default:
			return false;
	}
}

function reportResolutionFailure(message: string): void {
	if (__DEV__) {
		error(message);
		return;
	}

	warn(message);
}

function formatFailure(componentName: string, message: string): string {
	return `[prism/${componentName}] ${message}`;
}

export function resolveColorSafe(
	theme: Theme,
	componentName: string,
	value: ColorToken | Color3 | undefined,
	fallback: Color3,
): Color3 | undefined {
	if (value === undefined) {
		return undefined;
	}

	const [success, result] = pcall(() => resolveColor(theme, value));

	if (success && typeIs(result, "Color3")) {
		return result;
	}

	const message = typeIs(result, "string") ? result : `Failed to resolve color: ${tostring(result)}`;
	reportResolutionFailure(formatFailure(componentName, message));
	return fallback;
}

export function resolveThemeSizeSafe(
	theme: Theme,
	componentName: string,
	value: ThemeSize,
	scale: "spacing" | "radius" | "fontSizes",
	fallback: number,
): number {
	const [success, result] = pcall(() => resolveSize(theme, value, scale));

	if (success && typeIs(result, "number")) {
		return result;
	}

	const message = typeIs(result, "string") ? result : `Failed to resolve ${scale}: ${tostring(result)}`;
	reportResolutionFailure(formatFailure(componentName, message));
	return fallback;
}

export function resolveUDimSafe(componentName: string, value: SizeValue, label: string): UDim {
	const [success, result] = pcall(() => toUDim(value));

	if (success && typeIs(result, "UDim")) {
		return result;
	}

	const message = typeIs(result, "string") ? result : `Failed to resolve ${label}: ${tostring(result)}`;
	reportResolutionFailure(formatFailure(componentName, message));
	return new UDim(0, 0);
}

function resolveUDim2Safe(componentName: string, value: SizeValue2D | undefined, label: string): UDim2 | undefined {
	if (value === undefined) {
		return undefined;
	}

	const [success, result] = pcall(() => toUDim2(value));

	if (success && typeIs(result, "UDim2")) {
		return result;
	}

	const message = typeIs(result, "string") ? result : `Failed to resolve ${label}: ${tostring(result)}`;
	reportResolutionFailure(formatFailure(componentName, message));
	return UDim2.fromOffset(0, 0);
}

function resolveSpacing(
	theme: Theme,
	componentName: string,
	value: SharedSpacingValue | undefined,
): UDim | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (isThemeSize(value)) {
		return new UDim(0, resolveThemeSizeSafe(theme, componentName, value, "spacing", 0));
	}

	return resolveUDimSafe(componentName, value, "spacing");
}

function resolveConstraintAxis(componentName: string, value: SizeValue | undefined, label: string): number | undefined {
	if (value === undefined) {
		return undefined;
	}

	const resolved = resolveUDimSafe(componentName, value, label);

	if (resolved.Scale !== 0) {
		reportResolutionFailure(
			formatFailure(
				componentName,
				`${label} does not support scale-based values. Use sizeConstraint with raw Vector2 values instead.`,
			),
		);
		return undefined;
	}

	return resolved.Offset;
}

function resolveConstraintVector(
	componentName: string,
	minWidth: SizeValue | undefined,
	minHeight: SizeValue | undefined,
	explicitMin: Vector2 | undefined,
	maxWidth: SizeValue | undefined,
	maxHeight: SizeValue | undefined,
	explicitMax: Vector2 | undefined,
): SharedSizeConstraint | undefined {
	const minX = resolveConstraintAxis(componentName, minWidth, "minWidth");
	const minY = resolveConstraintAxis(componentName, minHeight, "minHeight");
	const maxX = resolveConstraintAxis(componentName, maxWidth, "maxWidth");
	const maxY = resolveConstraintAxis(componentName, maxHeight, "maxHeight");

	const min = explicitMin ?? (minX !== undefined || minY !== undefined ? new Vector2(minX ?? 0, minY ?? 0) : undefined);
	const max = explicitMax ?? (maxX !== undefined || maxY !== undefined ? new Vector2(maxX ?? math.huge, maxY ?? math.huge) : undefined);

	if (min === undefined && max === undefined) {
		return undefined;
	}

	return { min, max };
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

export function useResolvedStyleProps(
	componentName: string,
	styleProps: SharedStyleProps,
): ResolvedStyleProps {
	const theme = useTheme();

	const resolvedWidth = styleProps.width !== undefined ? resolveUDimSafe(componentName, styleProps.width, "width") : undefined;
	const resolvedHeight = styleProps.height !== undefined ? resolveUDimSafe(componentName, styleProps.height, "height") : undefined;
	const resolvedSize = resolvedWidth !== undefined && resolvedHeight !== undefined ? new UDim2(resolvedWidth, resolvedHeight) : undefined;
	const resolvedPosition = resolveUDim2Safe(componentName, styleProps.position, "position");
	const resolvedAnchor = styleProps.anchor ?? (styleProps.center ? new Vector2(0.5, 0.5) : undefined);
	const resolvedBackgroundColor = resolveColorSafe(theme, componentName, styleProps.bg, theme.colors.background.default);
	const paddingTop = resolveSpacing(theme, componentName, styleProps.pt ?? styleProps.py ?? styleProps.p);
	const paddingRight = resolveSpacing(theme, componentName, styleProps.pr ?? styleProps.px ?? styleProps.p);
	const paddingBottom = resolveSpacing(theme, componentName, styleProps.pb ?? styleProps.py ?? styleProps.p);
	const paddingLeft = resolveSpacing(theme, componentName, styleProps.pl ?? styleProps.px ?? styleProps.p);
	const hasPadding = paddingTop !== undefined || paddingRight !== undefined || paddingBottom !== undefined || paddingLeft !== undefined;
	const resolvedConstraint = resolveConstraintVector(
		componentName,
		styleProps.minWidth,
		styleProps.minHeight,
		styleProps.sizeConstraint?.min,
		styleProps.maxWidth,
		styleProps.maxHeight,
		styleProps.sizeConstraint?.max,
	);

	return {
		theme,
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedBackgroundColor,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hasPadding,
	};
}
