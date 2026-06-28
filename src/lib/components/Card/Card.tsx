import React from "@rbxts/react";

import { theme as themeRefs } from "@prism/theme";
import type { ConcreteColorValue, Theme, ThemeSize } from "@prism/theme";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { composeEventMaps } from "../_shared/interaction";
import {
	mergeSharedStyleProps,
	resolveColorSafe,
	resolveThemeSizeSafe,
	type SharedStyleProps,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type {
	CardProps,
	CardRadiusValue,
	CardShadowValue,
	CardVariant,
} from "./types";

interface CardVariantDefaults {
	readonly sharedStyleProps: Partial<SharedStyleProps>;
	readonly radius: CardRadiusValue;
	readonly strokeColor: ConcreteColorValue;
	readonly strokeThickness: number;
	readonly strokeTransparency: number;
	readonly shadow?: CardShadowValue;
}

function resolveRadius(theme: Theme, value: CardRadiusValue | undefined): UDim | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (typeIs(value, "number")) {
		return new UDim(0, value);
	}

	if (typeIs(value, "UDim")) {
		return value;
	}

	return new UDim(0, resolveThemeSizeSafe(theme, "card", value, "radius", theme.radius.md));
}

function resolveCardDefaults(variant: CardVariant): CardVariantDefaults {
	switch (variant) {
		case "outline":
			return {
				sharedStyleProps: {
					bg: themeRefs.background.surface,
					clip: true,
					p: "lg",
				},
				radius: "md",
				strokeColor: themeRefs.border.strong,
				strokeThickness: 1,
				strokeTransparency: 0.08,
			};
		case "subtle":
			return {
				sharedStyleProps: {
					bg: themeRefs.background.default,
					clip: true,
					p: "lg",
				},
				radius: "md",
				strokeColor: themeRefs.border.subtle,
				strokeThickness: 1,
				strokeTransparency: 0.12,
			};
		case "elevated":
			return {
				sharedStyleProps: {
					bg: themeRefs.background.surface,
					clip: false,
					p: "lg",
				},
				radius: "lg",
				strokeColor: themeRefs.border.subtle,
				strokeThickness: 1,
				strokeTransparency: 0.04,
				shadow: "md",
			};
		case "surface":
		default:
			return {
				sharedStyleProps: {
					bg: themeRefs.background.surface,
					clip: true,
					p: "lg",
				},
				radius: "md",
				strokeColor: themeRefs.border.default,
				strokeThickness: 1,
				strokeTransparency: 0.12,
			};
	}
}

export const Card = React.forwardRef<Frame, CardProps>((props, ref) => {
	const { slotProps } = props;
	const rootSlotProps = slotProps?.root;
	const variant = props.variant ?? "surface";
	const [contentHeight, setContentHeight] = React.useState(0);
	const defaults = resolveCardDefaults(variant);
	const mergedStyleProps = mergeSharedStyleProps(defaults.sharedStyleProps, props);
	const {
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
	} = useResolvedStyleProps("card", mergedStyleProps);
	const resolvedRadius = resolveRadius(theme, props.radius ?? defaults.radius);
	const resolvedStrokeColor = resolveColorSafe(
		theme,
		"card",
		props.stroke?.color ?? props.borderColor ?? defaults.strokeColor,
		theme.colors.border.default,
	);
	const resolvedStrokeThickness = props.stroke?.thickness ?? props.border ?? defaults.strokeThickness;
	const resolvedStrokeTransparency = props.stroke?.transparency ?? defaults.strokeTransparency;
	const resolvedShadowToken = props.shadow === undefined ? defaults.shadow : props.shadow;
	const resolvedShadow = resolvedShadowToken === false || resolvedShadowToken === undefined ? undefined : theme.shadows[resolvedShadowToken];
	const fallbackShadow = resolvedShadow ?? theme.shadows.sm;
	const renderShadow =
		resolvedShadow !== undefined || slotProps?.shadow !== undefined || slotProps?.shadowCorner !== undefined || slotProps?.shadowStroke !== undefined;

	let computedSize: UDim2 | undefined;
	let computedAutoSize: Enum.AutomaticSize | undefined;
	if (resolvedSize !== undefined) {
		computedSize = resolvedSize;
	} else if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		computedSize = new UDim2(resolvedWidth, resolvedHeight);
	} else if (resolvedWidth !== undefined) {
		computedSize = new UDim2(resolvedWidth, new UDim(0, 0));
		computedAutoSize = Enum.AutomaticSize.Y;
	} else if (resolvedHeight !== undefined) {
		computedSize = new UDim2(new UDim(0, 0), resolvedHeight);
		computedAutoSize = Enum.AutomaticSize.X;
	}

	let contentSize = UDim2.fromScale(1, 1);
	let contentAutoSize: Enum.AutomaticSize | undefined;
	if (computedAutoSize === Enum.AutomaticSize.Y) {
		contentSize = new UDim2(1, 0, 0, 0);
		contentAutoSize = Enum.AutomaticSize.Y;
	} else if (computedAutoSize === Enum.AutomaticSize.X) {
		contentSize = new UDim2(0, 0, 1, 0);
		contentAutoSize = Enum.AutomaticSize.X;
	}

	const shadowHeight = contentHeight > 0 ? contentHeight : undefined;
	const shouldRenderPadding = hasPadding || slotProps?.padding !== undefined;
	const contentChange = composeEventMaps(
		{
			AbsoluteSize: (instance) => {
				setContentHeight(instance.AbsoluteSize.Y);
			},
		},
		slotProps?.content?.Change,
	);

	let shadowElement: React.ReactElement | undefined;
	const decoratorChildren: React.ReactElement[] = [];

	if (renderShadow) {
		shadowElement = (
			<frame
				key="shadow"
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 0, shadowHeight ?? 0)}
				Visible={shadowHeight !== undefined}
				ZIndex={math.max((mergedStyleProps.zIndex ?? 1) - 1, 0)}
				{...slotProps?.shadow}
			>
				{renderCornerDecorator({ radius: resolvedRadius, slotProps: slotProps?.shadowCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: fallbackShadow.color,
					thickness: fallbackShadow.thickness,
					transparency: fallbackShadow.transparency,
					slotProps: slotProps?.shadowStroke,
				})}
			</frame>
		);
	}

	pushDecorator(decoratorChildren, renderCornerDecorator({ radius: resolvedRadius, slotProps: slotProps?.corner }));
	pushDecorator(
		decoratorChildren,
		renderStrokeDecorator({
			enabled: resolvedStrokeThickness !== undefined && resolvedStrokeThickness > 0,
			color: resolvedStrokeColor ?? theme.colors.border.default,
			thickness: resolvedStrokeThickness ?? defaults.strokeThickness,
			transparency: resolvedStrokeTransparency,
			mode: props.stroke?.mode,
			slotProps: slotProps?.stroke,
		}),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }));

	const computedPosition = resolvedPosition ?? (mergedStyleProps.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootEvent = useRootCursorEvent(props.Event, rootSlotProps?.Event === undefined ? mergedStyleProps.cursor : undefined);
	const frameInstanceProps: Partial<React.InstanceProps<Frame>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: mergedStyleProps.bgTransparency ?? 0,
		Size: computedSize,
		AutomaticSize: computedAutoSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		BackgroundColor3: resolvedBackgroundColor,
		ClipsDescendants: mergedStyleProps.clip,
		Visible: mergedStyleProps.visible,
		LayoutOrder: mergedStyleProps.layoutOrder,
		ZIndex: mergedStyleProps.zIndex,
		Event: rootEvent,
		Change: props.Change,
	};

	return (
		<frame {...frameInstanceProps} {...rootSlotProps} ref={ref}>
			{shadowElement}
			{decoratorChildren}
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={contentSize}
				AutomaticSize={contentAutoSize}
				{...slotProps?.content}
				Change={contentChange}
			>
				{renderPaddingDecorator({ enabled: shouldRenderPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding })}
				{props.children}
			</frame>
		</frame>
	);
});

Card.displayName = "Card";
