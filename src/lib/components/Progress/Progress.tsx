import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import {
	pushDecorator,
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { resolveTextFontFace } from "../_shared/textFont";
import {
	mergeSharedStyleProps,
	resolveThemeSizeSafe,
	resolveUDimSafe,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type { ProgressColor, ProgressProps, ProgressRadiusValue, ProgressSize, ProgressVariant } from "./types";

interface ProgressSizeStyles {
	readonly trackHeight: number;
	readonly defaultWidth: number;
	readonly labelSize: number;
	readonly labelLineHeight: number;
	readonly labelGap: number;
}

interface ProgressRange {
	readonly min: number;
	readonly max: number;
}

interface ProgressVisualStyles {
	readonly trackColor: Color3;
	readonly trackStrokeColor: Color3;
	readonly trackStrokeTransparency: number;
	readonly fillColor: Color3;
	readonly labelColor: Color3;
	readonly valueLabelColor: Color3;
}

function isFiniteNumber(value: number | undefined): value is number {
	return value !== undefined && value === value && value > -math.huge && value < math.huge;
}

function resolveFiniteNumber(value: number | undefined, fallback: number): number {
	return isFiniteNumber(value) ? value : fallback;
}

function resolveProgressSizeStyles(theme: Theme, size: ProgressSize): ProgressSizeStyles {
	switch (size) {
		case "xs":
			return {
				trackHeight: 6,
				defaultWidth: theme.spacing.xl * 7,
				labelSize: theme.fontSizes.xs,
				labelLineHeight: theme.lineHeights.xs,
				labelGap: theme.spacing.xs,
			};
		case "sm":
			return {
				trackHeight: 8,
				defaultWidth: theme.spacing.xl * 8,
				labelSize: theme.fontSizes.sm,
				labelLineHeight: theme.lineHeights.sm,
				labelGap: theme.spacing.xs,
			};
		case "lg":
			return {
				trackHeight: 14,
				defaultWidth: theme.spacing.xl * 11,
				labelSize: theme.fontSizes.lg,
				labelLineHeight: theme.lineHeights.lg,
				labelGap: theme.spacing.sm,
			};
		case "xl":
			return {
				trackHeight: 18,
				defaultWidth: theme.spacing.xl * 13,
				labelSize: theme.fontSizes.xl,
				labelLineHeight: theme.lineHeights.xl,
				labelGap: theme.spacing.sm,
			};
		case "md":
		default:
			return {
				trackHeight: 11,
				defaultWidth: theme.spacing.xl * 10,
				labelSize: theme.fontSizes.md,
				labelLineHeight: theme.lineHeights.md,
				labelGap: theme.spacing.xs,
			};
	}
}

function resolveProgressRadius(theme: Theme, size: ProgressSize, radius: ProgressRadiusValue | undefined): UDim {
	if (radius === undefined) {
		return new UDim(0.5, 0);
	}

	if (typeIs(radius, "number")) {
		return new UDim(0, radius);
	}

	if (typeIs(radius, "UDim")) {
		return radius;
	}

	return new UDim(0, resolveThemeSizeSafe(theme, "progress", radius, "radius", resolveThemeSizeSafe(theme, "progress", size, "radius", theme.radius.sm)));
}

function resolveProgressRange(min: number | undefined, max: number | undefined): ProgressRange {
	const resolvedMin = resolveFiniteNumber(min, 0);
	const requestedMax = resolveFiniteNumber(max, 100);
	const resolvedMax = requestedMax > resolvedMin ? requestedMax : resolvedMin + 1;

	return {
		min: resolvedMin,
		max: resolvedMax,
	};
}

function resolveProgressValue(value: number | undefined, range: ProgressRange): number {
	return math.clamp(resolveFiniteNumber(value, range.min), range.min, range.max);
}

function resolveProgressPercent(value: number, range: ProgressRange): number {
	return (value - range.min) / (range.max - range.min);
}

function formatDefaultProgressValue(value: number, percent: number): string {
	return `${math.floor(percent * 100 + 0.5)}%`;
}

function resolveProgressVisualStyles(theme: Theme, variant: ProgressVariant, color: ProgressColor): ProgressVisualStyles {
	const intentColors = theme.colors[color];
	const surfaceTrack = mixColor(theme.colors.background.default, theme.colors.border.default, 0.22);
	const recessedTrack = mixColor(theme.colors.background.surface, theme.colors.action.hover, 0.54);
	const lightTrack = mixColor(theme.colors.background.surface, intentColors.light, 0.2);
	const subtleTrack = mixColor(theme.colors.background.default, intentColors.light, 0.12);

	switch (variant) {
		case "filled":
			return {
				trackColor: recessedTrack,
				trackStrokeColor: mixColor(theme.colors.border.default, theme.colors.background.surface, 0.24),
				trackStrokeTransparency: 0.16,
				fillColor: intentColors.main,
				labelColor: theme.colors.text.primary,
				valueLabelColor: theme.colors.text.secondary,
			};
		case "light":
			return {
				trackColor: lightTrack,
				trackStrokeColor: mixColor(intentColors.light, theme.colors.background.surface, 0.34),
				trackStrokeTransparency: 0.2,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.08),
				labelColor: theme.colors.text.primary,
				valueLabelColor: intentColors.dark,
			};
		case "subtle":
			return {
				trackColor: subtleTrack,
				trackStrokeColor: mixColor(theme.colors.border.subtle, theme.colors.background.surface, 0.18),
				trackStrokeTransparency: 0.34,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.18),
				labelColor: theme.colors.text.primary,
				valueLabelColor: theme.colors.text.secondary,
			};
		case "outline":
		default:
			return {
				trackColor: surfaceTrack,
				trackStrokeColor: theme.colors.border.default,
				trackStrokeTransparency: 0.1,
				fillColor: intentColors.main,
				labelColor: theme.colors.text.primary,
				valueLabelColor: theme.colors.text.secondary,
			};
	}
}

function resolveProgressMotionTransition() {
	return {
		percent: { duration: "normal", easing: "out" },
	} as const;
}

type ProgressComponent = ((props: ProgressProps) => React.ReactElement) & React.ForwardRefExoticComponent<ProgressProps>;

const ProgressBase = React.forwardRef<Frame, ProgressProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		variant = "outline",
		color = "primary",
		size = "md",
		radius,
		fullWidth = false,
		label,
		showValue = false,
		value,
		min,
		max,
		formatValue,
		Event,
		Change,
	} = props;
	const sizeStyles = resolveProgressSizeStyles(theme, size);
	const mergedStyleProps = mergeSharedStyleProps({}, props);
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
	} = useResolvedStyleProps("progress", mergedStyleProps);
	const rootSlotProps = slotProps?.root;
	const labelSlotProps = slotProps?.label;
	const valueLabelSlotProps = slotProps?.valueLabel;
	const visualStyles = resolveProgressVisualStyles(theme, variant, color);
	const range = resolveProgressRange(min, max);
	const resolvedValue = resolveProgressValue(value, range);
	const percent = resolveProgressPercent(resolvedValue, range);
	const animated = useMotion({
		values: {
			percent,
		},
		transition: resolveProgressMotionTransition(),
	});
	const percentText = (formatValue ?? formatDefaultProgressValue)(resolvedValue, percent);
	const shouldRenderLabel = label !== undefined || labelSlotProps !== undefined;
	const shouldRenderValueLabel = showValue || valueLabelSlotProps !== undefined;
	const shouldRenderHeader = shouldRenderLabel || shouldRenderValueLabel || slotProps?.header !== undefined;
	const headerHeight = shouldRenderHeader ? math.ceil(sizeStyles.labelSize * sizeStyles.labelLineHeight) : 0;
	const headerGap = shouldRenderHeader ? sizeStyles.labelGap : 0;
	const minimumHeight = sizeStyles.trackHeight + headerHeight + headerGap;
	const computedWidth = fullWidth ? resolveUDimSafe("progress", "100%", "width") : resolvedSize?.X ?? resolvedWidth ?? new UDim(0, sizeStyles.defaultWidth);
	const computedHeight = resolvedSize?.Y ?? resolvedHeight ?? new UDim(0, minimumHeight);
	const computedSize = new UDim2(computedWidth, computedHeight);
	const computedConstraint =
		resolvedConstraint === undefined
			? {
				min: new Vector2(0, minimumHeight),
				max: undefined,
			  }
			: {
				min:
					resolvedConstraint.min === undefined
						? new Vector2(0, minimumHeight)
						: new Vector2(resolvedConstraint.min.X, math.max(resolvedConstraint.min.Y, minimumHeight)),
				max: resolvedConstraint.max,
			  };
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedHeaderZIndex = slotProps?.header?.ZIndex ?? resolvedRootZIndex;
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? resolvedHeaderZIndex;
	const resolvedValueLabelZIndex = valueLabelSlotProps?.ZIndex ?? resolvedHeaderZIndex;
	const resolvedTrackZIndex = slotProps?.track?.ZIndex ?? resolvedRootZIndex;
	const resolvedFillZIndex = slotProps?.fill?.ZIndex ?? resolvedTrackZIndex;
	const labelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const labelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const valueLabelFont = valueLabelSlotProps?.Font ?? theme.fontFamily;
	const valueLabelFontFace = resolveTextFontFace(valueLabelSlotProps?.Font, valueLabelSlotProps?.FontFace, theme.fontFamily);
	const trackRadius = resolveProgressRadius(theme, size, radius);
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding }),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint }));

	return (
		<frame
			BackgroundTransparency={1}
			BorderSizePixel={0}
			BackgroundColor3={theme.colors.background.default}
			Size={computedSize}
			Position={computedPosition}
			AnchorPoint={resolvedAnchor}
			ClipsDescendants={props.clip}
			Visible={props.visible}
			LayoutOrder={props.layoutOrder}
			ZIndex={resolvedRootZIndex}
			Event={Event}
			Change={Change}
			{...rootSlotProps}
			ref={ref}
		>
			{decoratorChildren}
			{shouldRenderHeader ? (
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={new UDim2(1, 0, 0, headerHeight)}
					Position={UDim2.fromOffset(0, 0)}
					ZIndex={resolvedHeaderZIndex}
					Active={false}
					Selectable={false}
					{...slotProps?.header}
				>
					{shouldRenderLabel ? (
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={new UDim2(0.5, 0, 1, 0)}
							Position={UDim2.fromOffset(0, 0)}
							Text={labelSlotProps?.Text ?? (label === undefined ? "" : tostring(label))}
							TextColor3={labelSlotProps?.TextColor3 ?? visualStyles.labelColor}
							TextTransparency={labelSlotProps?.TextTransparency ?? 0}
							TextStrokeTransparency={labelSlotProps?.TextStrokeTransparency ?? 1}
							TextSize={labelSlotProps?.TextSize ?? sizeStyles.labelSize}
							Font={labelFont}
							FontFace={labelFontFace}
							LineHeight={labelSlotProps?.LineHeight ?? sizeStyles.labelLineHeight}
							TextWrapped={labelSlotProps?.TextWrapped ?? false}
							TextTruncate={labelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
							TextXAlignment={labelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left}
							TextYAlignment={labelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={labelSlotProps?.TextScaled ?? false}
							RichText={labelSlotProps?.RichText ?? false}
							ZIndex={resolvedLabelZIndex}
							{...labelSlotProps}
						/>
					) : undefined}
					{shouldRenderValueLabel ? (
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={new UDim2(0.5, 0, 1, 0)}
							Position={UDim2.fromScale(0.5, 0)}
							Text={valueLabelSlotProps?.Text ?? percentText}
							TextColor3={valueLabelSlotProps?.TextColor3 ?? visualStyles.valueLabelColor}
							TextTransparency={valueLabelSlotProps?.TextTransparency ?? 0}
							TextStrokeTransparency={valueLabelSlotProps?.TextStrokeTransparency ?? 1}
							TextSize={valueLabelSlotProps?.TextSize ?? sizeStyles.labelSize}
							Font={valueLabelFont}
							FontFace={valueLabelFontFace}
							LineHeight={valueLabelSlotProps?.LineHeight ?? sizeStyles.labelLineHeight}
							TextWrapped={valueLabelSlotProps?.TextWrapped ?? false}
							TextTruncate={valueLabelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
							TextXAlignment={valueLabelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Right}
							TextYAlignment={valueLabelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={valueLabelSlotProps?.TextScaled ?? false}
							RichText={valueLabelSlotProps?.RichText ?? false}
							ZIndex={resolvedValueLabelZIndex}
							{...valueLabelSlotProps}
						/>
					) : undefined}
				</frame>
			) : undefined}
			<frame
				BackgroundColor3={visualStyles.trackColor}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				Size={new UDim2(1, 0, 0, sizeStyles.trackHeight)}
				Position={new UDim2(0, 0, 0, headerHeight + headerGap)}
				ZIndex={resolvedTrackZIndex}
				Active={false}
				Selectable={false}
				ClipsDescendants={true}
				{...slotProps?.track}
			>
				{renderCornerDecorator({ radius: trackRadius, slotProps: slotProps?.trackCorner })}
				{renderStrokeDecorator({
					enabled: true,
					color: visualStyles.trackStrokeColor,
					transparency: visualStyles.trackStrokeTransparency,
					thickness: 1,
					slotProps: slotProps?.trackStroke,
				})}
				<frame
					BackgroundColor3={visualStyles.fillColor}
					BackgroundTransparency={0}
					BorderSizePixel={0}
					Size={new UDim2(animated.percent, 0, 1, 0)}
					ZIndex={resolvedFillZIndex}
					Active={false}
					Selectable={false}
					{...slotProps?.fill}
				>
					{renderCornerDecorator({ radius: trackRadius, slotProps: slotProps?.fillCorner })}
				</frame>
			</frame>
		</frame>
	);
});

export const Progress = ProgressBase as ProgressComponent;

Progress.displayName = "Progress";
