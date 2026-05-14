import React from "@rbxts/react";

import { pushDecorator, renderPaddingDecorator, renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import {
	resolveColorSafe,
	resolveThemeSizeSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import type { TextAlign, TextProps, TextTruncate, TextVerticalAlign } from "./types";

const FONT_WEIGHT_LOOKUP = [
	{ value: 100, weight: Enum.FontWeight.Thin },
	{ value: 200, weight: Enum.FontWeight.ExtraLight },
	{ value: 300, weight: Enum.FontWeight.Light },
	{ value: 400, weight: Enum.FontWeight.Regular },
	{ value: 500, weight: Enum.FontWeight.Medium },
	{ value: 600, weight: Enum.FontWeight.SemiBold },
	{ value: 700, weight: Enum.FontWeight.Bold },
	{ value: 800, weight: Enum.FontWeight.ExtraBold },
	{ value: 900, weight: Enum.FontWeight.Heavy },
];
function resolveFontWeight(weight: number): Enum.FontWeight {
	let closest = FONT_WEIGHT_LOOKUP[0];
	let smallestDistance = math.abs(weight - closest.value);

	for (const candidate of FONT_WEIGHT_LOOKUP) {
		const distance = math.abs(weight - candidate.value);

		if (distance < smallestDistance) {
			closest = candidate;
			smallestDistance = distance;
		}
	}

	return closest.weight;
}

function resolveFontFace(font: Enum.Font, weight: number | undefined): Font {
	const baseFont = Font.fromEnum(font);

	if (weight === undefined) {
		return baseFont;
	}

	return new Font(baseFont.Family, resolveFontWeight(weight), baseFont.Style);
}

function resolveLookupValue<Key extends string, Value>(
	lookup: Record<Key, Value>,
	key: Key | undefined,
): Value | undefined {
	return key === undefined ? undefined : lookup[key];
}

const TEXT_X_ALIGNMENT_LOOKUP: Record<TextAlign, Enum.TextXAlignment> = {
	left: Enum.TextXAlignment.Left,
	center: Enum.TextXAlignment.Center,
	right: Enum.TextXAlignment.Right,
};

const TEXT_Y_ALIGNMENT_LOOKUP: Record<TextVerticalAlign, Enum.TextYAlignment> = {
	top: Enum.TextYAlignment.Top,
	middle: Enum.TextYAlignment.Center,
	bottom: Enum.TextYAlignment.Bottom,
};

const TEXT_TRUNCATE_LOOKUP: Record<TextTruncate, Enum.TextTruncate> = {
	none: Enum.TextTruncate.None,
	atend: Enum.TextTruncate.AtEnd,
	splitword: Enum.TextTruncate.SplitWord,
};

function resolveTextXAlignment(align: TextAlign | undefined): Enum.TextXAlignment | undefined {
	return resolveLookupValue(TEXT_X_ALIGNMENT_LOOKUP, align);
}

function resolveTextYAlignment(valign: TextVerticalAlign | undefined): Enum.TextYAlignment | undefined {
	return resolveLookupValue(TEXT_Y_ALIGNMENT_LOOKUP, valign);
}

function resolveTextTruncate(truncate: TextTruncate | undefined): Enum.TextTruncate | undefined {
	return resolveLookupValue(TEXT_TRUNCATE_LOOKUP, truncate);
}

export const Text = React.forwardRef<TextLabel, TextProps>((props, ref) => {
	const { slotProps } = props;
	const rootSlotProps = slotProps?.root;
	const resolvedText = props.text ?? props.children ?? "";
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
	} = useResolvedStyleProps("text", props);

	let textSize: UDim2 | undefined;
	let textAutoSize: Enum.AutomaticSize | undefined;
	if (resolvedSize !== undefined) {
		textSize = resolvedSize;
	} else if (resolvedWidth !== undefined && resolvedHeight !== undefined) {
		textSize = new UDim2(resolvedWidth, resolvedHeight);
	} else if (resolvedWidth !== undefined) {
		textSize = new UDim2(resolvedWidth, new UDim(0, 0));
		textAutoSize = Enum.AutomaticSize.Y;
	} else if (resolvedHeight !== undefined) {
		textSize = new UDim2(new UDim(0, 0), resolvedHeight);
		textAutoSize = Enum.AutomaticSize.X;
	} else {
		textSize = UDim2.fromOffset(0, 0);
		textAutoSize = Enum.AutomaticSize.XY;
	}

	const resolvedTextSize =
		props.size === undefined
			? theme.fontSizes.md
			: typeIs(props.size, "number")
				? props.size
				: resolveThemeSizeSafe(theme, "text", props.size, "fontSizes", theme.fontSizes.md);
	const resolvedTextColor = resolveColorSafe(theme, "text", props.color ?? "text.primary", theme.colors.text.primary);
	const resolvedFont = props.font ?? theme.fontFamily;
	const resolvedLineHeight =
		props.size !== undefined && !typeIs(props.size, "number")
			? theme.lineHeights[props.size]
			: theme.lineHeights.md;

	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({
			enabled: hasPadding,
			paddingTop,
			paddingRight,
			paddingBottom,
			paddingLeft,
			slotProps: slotProps?.padding,
		}),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }));

	if (props.maxFontSize !== undefined || props.minFontSize !== undefined || slotProps?.textSizeConstraint !== undefined) {
		decoratorChildren.push(
			<uitextsizeconstraint
				key="text-size-constraint"
				MaxTextSize={props.maxFontSize}
				MinTextSize={props.minFontSize}
				{...slotProps?.textSizeConstraint}
			/>,
		);
	}

	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const rootEvent = useRootCursorEvent(props.Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const textLabelInstanceProps: Partial<React.InstanceProps<TextLabel>> = {
		BorderSizePixel: 0,
		BackgroundTransparency: props.bgTransparency ?? (props.bg !== undefined ? 0 : 1),
		Size: textSize,
		AutomaticSize: textAutoSize,
		Position: computedPosition,
		AnchorPoint: resolvedAnchor,
		BackgroundColor3: resolvedBackgroundColor,
		ClipsDescendants: props.clip,
		Visible: props.visible,
		LayoutOrder: props.layoutOrder,
		ZIndex: props.zIndex,
		Text: tostring(resolvedText),
		TextSize: resolvedTextSize,
		TextColor3: resolvedTextColor ?? theme.colors.text.primary,
		FontFace: resolveFontFace(resolvedFont, props.weight),
		LineHeight: resolvedLineHeight,
		TextWrapped: props.wrap ?? false,
		TextXAlignment: resolveTextXAlignment(props.align),
		TextYAlignment: resolveTextYAlignment(props.valign),
		TextTruncate: resolveTextTruncate(props.truncate),
		Event: rootEvent,
		Change: props.Change,
	};

	return (
		<textlabel {...textLabelInstanceProps} {...rootSlotProps} ref={ref}>
			{decoratorChildren}
		</textlabel>
	);
});

Text.displayName = "Text";
