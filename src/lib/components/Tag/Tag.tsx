import React from "@rbxts/react";

import { useTheme } from "@prism/theme";
import type { SemanticIntent, Theme } from "@prism/theme";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { resolveTextFontFace } from "../_shared/textFont";
import { resolveThemeSizeSafe, useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";
import { mixColor } from "../_shared/visual";

import type { TagColor, TagProps, TagRadiusValue, TagSize, TagVariant } from "./types";

interface TagSizeStyles {
	readonly height: number;
	readonly paddingX: number;
	readonly gap: number;
	readonly textSize: number;
	readonly lineHeight: number;
}

interface TagVisualStyles {
	readonly backgroundColor: Color3;
	readonly textColor: Color3;
	readonly strokeColor: Color3;
	readonly strokeTransparency: number;
	readonly strokeThickness: number;
}

type GuiZIndex = React.InstanceProps<Frame>["ZIndex"];

function resolveTagSizeStyles(theme: Theme, size: TagSize): TagSizeStyles {
	switch (size) {
		case "xs":
			return {
				height: 20,
				paddingX: 6,
				gap: theme.spacing.xs,
				textSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
			};
		case "sm":
			return {
				height: 24,
				paddingX: theme.spacing.sm,
				gap: theme.spacing.xs,
				textSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
			};
		case "lg":
			return {
				height: 34,
				paddingX: theme.spacing.md,
				gap: theme.spacing.sm,
				textSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
			};
		case "xl":
			return {
				height: 40,
				paddingX: theme.spacing.lg,
				gap: theme.spacing.sm,
				textSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
			};
		case "md":
		default:
			return {
				height: 28,
				paddingX: theme.spacing.md,
				gap: theme.spacing.xs,
				textSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
			};
	}
}

function resolveTagRadius(theme: Theme, size: TagSize, radius: TagRadiusValue | undefined): UDim {
	if (radius === undefined) {
		return new UDim(0, resolveThemeSizeSafe(theme, "tag", size, "radius", theme.radius.md));
	}

	if (typeIs(radius, "number")) {
		return new UDim(0, radius);
	}

	if (typeIs(radius, "UDim")) {
		return radius;
	}

	return new UDim(0, resolveThemeSizeSafe(theme, "tag", radius, "radius", theme.radius.md));
}

function resolveNeutralTagVisualStyles(theme: Theme, variant: TagVariant): TagVisualStyles {
	const surface = theme.colors.background.surface;
	const softSurface = mixColor(theme.colors.background.default, theme.colors.action.hover, 0.64);
	const pressedSurface = mixColor(theme.colors.background.surface, theme.colors.action.pressed, 0.72);

	switch (variant) {
		case "filled":
			return {
				backgroundColor: theme.colors.text.primary,
				textColor: theme.colors.text.inverse,
				strokeColor: theme.colors.text.primary,
				strokeTransparency: 0.82,
				strokeThickness: 1,
			};
		case "light":
			return {
				backgroundColor: pressedSurface,
				textColor: theme.colors.text.primary,
				strokeColor: mixColor(theme.colors.border.default, theme.colors.background.surface, 0.28),
				strokeTransparency: 0.18,
				strokeThickness: 1,
			};
		case "outline":
			return {
				backgroundColor: surface,
				textColor: theme.colors.text.primary,
				strokeColor: theme.colors.border.default,
				strokeTransparency: 0.08,
				strokeThickness: 1,
			};
		case "subtle":
		default:
			return {
				backgroundColor: softSurface,
				textColor: theme.colors.text.secondary,
				strokeColor: theme.colors.border.subtle,
				strokeTransparency: 0.36,
				strokeThickness: 1,
			};
	}
}

function resolveIntentTagVisualStyles(theme: Theme, variant: TagVariant, color: SemanticIntent): TagVisualStyles {
	const intentColors = theme.colors[color];
	const lightSurface = mixColor(theme.colors.background.surface, intentColors.light, 0.32);
	const subtleSurface = mixColor(theme.colors.background.default, intentColors.light, 0.14);

	switch (variant) {
		case "filled":
			return {
				backgroundColor: intentColors.main,
				textColor: intentColors.contrast,
				strokeColor: intentColors.dark,
				strokeTransparency: 0.58,
				strokeThickness: 1,
			};
		case "light":
			return {
				backgroundColor: lightSurface,
				textColor: intentColors.dark,
				strokeColor: mixColor(intentColors.light, theme.colors.background.surface, 0.24),
				strokeTransparency: 0.2,
				strokeThickness: 1,
			};
		case "outline":
			return {
				backgroundColor: theme.colors.background.surface,
				textColor: intentColors.dark,
				strokeColor: intentColors.main,
				strokeTransparency: 0.1,
				strokeThickness: 1,
			};
		case "subtle":
		default:
			return {
				backgroundColor: subtleSurface,
				textColor: intentColors.dark,
				strokeColor: mixColor(intentColors.light, theme.colors.background.surface, 0.22),
				strokeTransparency: 0.38,
				strokeThickness: 1,
			};
	}
}

function resolveTagVisualStyles(theme: Theme, variant: TagVariant, color: TagColor): TagVisualStyles {
	return color === "neutral" ? resolveNeutralTagVisualStyles(theme, variant) : resolveIntentTagVisualStyles(theme, variant, color);
}

function resolveContentZIndex(rootZIndex: GuiZIndex | undefined): GuiZIndex {
	if (rootZIndex === undefined) {
		return 2;
	}

	if (typeIs(rootZIndex, "number")) {
		return rootZIndex + 1;
	}

	return rootZIndex.map((value) => value + 1);
}

function renderSection(
	section: React.ReactNode | undefined,
	slotProps: Partial<React.InstanceProps<Frame>> | undefined,
	keyName: string,
	zIndex: GuiZIndex,
) {
	if (section === undefined && slotProps === undefined) {
		return undefined;
	}

	return (
		<frame key={keyName} AutomaticSize={Enum.AutomaticSize.XY} BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromOffset(0, 0)} ZIndex={zIndex} {...slotProps}>
			{section}
		</frame>
	);
}

type TagComponent = ((props: TagProps) => React.ReactElement) & React.ForwardRefExoticComponent<TagProps>;

const TagBase = React.forwardRef<Frame, TagProps>((props, ref) => {
	const theme = useTheme();
	const { slotProps, variant = "subtle", color = "neutral", size = "sm", radius, fullWidth = false, Event, Change } = props;
	const sizeStyles = resolveTagSizeStyles(theme, size);
	const {
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedConstraint,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		hasPadding,
	} = useResolvedStyleProps("tag", {
		...props,
		px: props.px ?? props.p ?? new UDim(0, sizeStyles.paddingX),
		py: props.py ?? new UDim(0, 0),
	});
	const visualStyles = resolveTagVisualStyles(theme, variant, color);
	const computedWidth = fullWidth ? new UDim(1, 0) : resolvedWidth;
	const computedSize = resolvedSize ?? new UDim2(computedWidth ?? new UDim(0, 0), resolvedHeight ?? new UDim(0, sizeStyles.height));
	const automaticSize = resolvedSize === undefined && computedWidth === undefined ? Enum.AutomaticSize.X : undefined;
	const labelText = props.label ?? props.children ?? "";
	const rootSlotProps = slotProps?.root;
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const contentZIndex = resolveContentZIndex(resolvedRootZIndex);
	const isWidthConstrained = resolvedSize !== undefined || computedWidth !== undefined || resolvedConstraint?.max?.X !== undefined;
	const rootEvent = useRootCursorEvent(Event, rootSlotProps?.Event === undefined ? props.cursor : undefined);
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(decoratorChildren, renderCornerDecorator({ radius: resolveTagRadius(theme, size, radius), slotProps: slotProps?.corner }));
	pushDecorator(
		decoratorChildren,
		renderStrokeDecorator({
			enabled: true,
			color: visualStyles.strokeColor,
			thickness: visualStyles.strokeThickness,
			transparency: visualStyles.strokeTransparency,
			slotProps: slotProps?.stroke,
		}),
	);
	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding }),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint }));

	return (
		<frame
			BackgroundColor3={visualStyles.backgroundColor}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			Size={computedSize}
			AutomaticSize={automaticSize}
			Position={resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined)}
			AnchorPoint={resolvedAnchor}
			ClipsDescendants={props.clip ?? true}
			Visible={props.visible}
			LayoutOrder={props.layoutOrder}
			ZIndex={resolvedRootZIndex}
			Event={rootEvent}
			Change={Change}
			{...rootSlotProps}
			ref={ref}
		>
			{decoratorChildren}
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				Padding={new UDim(0, sizeStyles.gap)}
				HorizontalFlex={isWidthConstrained ? Enum.UIFlexAlignment.Fill : undefined}
				{...slotProps?.listLayout}
			/>
			{renderSection(props.leftSection, slotProps?.leftSection, "left-section", contentZIndex)}
			<textlabel
				key="label"
				AutomaticSize={isWidthConstrained ? Enum.AutomaticSize.Y : Enum.AutomaticSize.XY}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={isWidthConstrained ? UDim2.fromScale(0, 1) : UDim2.fromOffset(0, 0)}
				Text={slotProps?.label?.Text ?? tostring(labelText)}
				TextColor3={slotProps?.label?.TextColor3 ?? visualStyles.textColor}
				TextTransparency={slotProps?.label?.TextTransparency ?? 0}
				TextStrokeTransparency={slotProps?.label?.TextStrokeTransparency ?? 1}
				TextSize={slotProps?.label?.TextSize ?? sizeStyles.textSize}
				Font={theme.fontFamily}
				FontFace={resolveTextFontFace(slotProps?.label?.Font, slotProps?.label?.FontFace, theme.fontFamily)}
				LineHeight={slotProps?.label?.LineHeight ?? sizeStyles.lineHeight}
				TextXAlignment={slotProps?.label?.TextXAlignment ?? Enum.TextXAlignment.Center}
				TextYAlignment={slotProps?.label?.TextYAlignment ?? Enum.TextYAlignment.Center}
				TextTruncate={slotProps?.label?.TextTruncate ?? Enum.TextTruncate.AtEnd}
				ZIndex={contentZIndex}
				{...slotProps?.label}
			>
				{isWidthConstrained ? <uiflexitem FlexMode={Enum.UIFlexMode.Fill} /> : undefined}
			</textlabel>
			{renderSection(props.rightSection, slotProps?.rightSection, "right-section", contentZIndex)}
		</frame>
	);
});

export const Tag = TagBase as TagComponent;

Tag.displayName = "Tag";
