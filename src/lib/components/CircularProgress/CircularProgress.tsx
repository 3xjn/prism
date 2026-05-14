import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import {
	pushDecorator,
	renderAspectRatioDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
} from "../_shared/foundationDecorators";
import { resolveTextFontFace } from "../_shared/textFont";
import {
	mergeSharedStyleProps,
	useResolvedStyleProps,
} from "../_shared/useResolvedStyleProps";
import { mixColor } from "../_shared/visual";

import type {
	CircularProgressCap,
	CircularProgressColor,
	CircularProgressMode,
	CircularProgressProps,
	CircularProgressSize,
	CircularProgressVariant,
} from "./types";

const RunService = game.GetService("RunService");

const SEGMENT_COUNT = 36;
const INDETERMINATE_ROTATION_SECONDS = 0.9;
const INDETERMINATE_VISIBLE_SEGMENTS = 9;

interface CircularProgressSizeStyles {
	readonly diameter: number;
	readonly thickness: number;
	readonly segmentLength: number;
	readonly labelSize: number;
	readonly valueLabelSize: number;
	readonly lineHeight: number;
}

interface CircularProgressRange {
	readonly min: number;
	readonly max: number;
}

interface CircularProgressVisualStyles {
	readonly trackColor: Color3;
	readonly trackTransparency: number;
	readonly fillColor: Color3;
	readonly fillTailColor: Color3;
	readonly labelColor: Color3;
	readonly valueLabelColor: Color3;
}

function createSegmentIndices(): number[] {
	const indices = new Array<number>();

	for (let index = 0; index < SEGMENT_COUNT; index += 1) {
		indices.push(index);
	}

	return indices;
}

const SEGMENT_INDICES = createSegmentIndices();

function resolveCircularProgressSizeStyles(theme: Theme, size: CircularProgressSize): CircularProgressSizeStyles {
	switch (size) {
		case "xs":
			return {
				diameter: 28,
				thickness: 3,
				segmentLength: 4,
				labelSize: theme.fontSizes.xs,
				valueLabelSize: theme.fontSizes.xs,
				lineHeight: theme.lineHeights.xs,
			};
		case "sm":
			return {
				diameter: 36,
				thickness: 4,
				segmentLength: 5,
				labelSize: theme.fontSizes.xs,
				valueLabelSize: theme.fontSizes.sm,
				lineHeight: theme.lineHeights.sm,
			};
		case "lg":
			return {
				diameter: 64,
				thickness: 6,
				segmentLength: 8,
				labelSize: theme.fontSizes.sm,
				valueLabelSize: theme.fontSizes.lg,
				lineHeight: theme.lineHeights.lg,
			};
		case "xl":
			return {
				diameter: 80,
				thickness: 7,
				segmentLength: 10,
				labelSize: theme.fontSizes.md,
				valueLabelSize: theme.fontSizes.xl,
				lineHeight: theme.lineHeights.xl,
			};
		case "md":
		default:
			return {
				diameter: 48,
				thickness: 5,
				segmentLength: 6,
				labelSize: theme.fontSizes.xs,
				valueLabelSize: theme.fontSizes.md,
				lineHeight: theme.lineHeights.md,
			};
	}
}

function resolveCircularProgressRange(min: number | undefined, max: number | undefined): CircularProgressRange {
	const resolvedMin = min ?? 0;
	const requestedMax = max ?? 100;
	const resolvedMax = requestedMax > resolvedMin ? requestedMax : resolvedMin + 1;

	return {
		min: resolvedMin,
		max: resolvedMax,
	};
}

function resolveCircularProgressValue(value: number | undefined, range: CircularProgressRange): number {
	return math.clamp(value ?? range.min, range.min, range.max);
}

function resolveCircularProgressPercent(value: number, range: CircularProgressRange): number {
	return (value - range.min) / (range.max - range.min);
}

function formatDefaultCircularProgressValue(value: number, percent: number): string {
	return `${math.floor(percent * 100 + 0.5)}%`;
}

function resolveVisibleSegmentCount(percent: number): number {
	if (percent <= 0) {
		return 0;
	}

	return math.clamp(math.ceil(percent * SEGMENT_COUNT), 1, SEGMENT_COUNT);
}

function resolveCircularProgressVisualStyles(
	theme: Theme,
	variant: CircularProgressVariant,
	color: CircularProgressColor,
): CircularProgressVisualStyles {
	const intentColors = theme.colors[color];
	const neutralTrack = mixColor(theme.colors.background.default, theme.colors.border.default, 0.22);
	const softTrack = mixColor(theme.colors.background.surface, intentColors.light, 0.16);

	switch (variant) {
		case "filled":
			return {
				trackColor: neutralTrack,
				trackTransparency: 0.04,
				fillColor: intentColors.main,
				fillTailColor: intentColors.light,
				labelColor: theme.colors.text.secondary,
				valueLabelColor: theme.colors.text.primary,
			};
		case "light":
			return {
				trackColor: softTrack,
				trackTransparency: 0.1,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.06),
				fillTailColor: intentColors.light,
				labelColor: theme.colors.text.secondary,
				valueLabelColor: intentColors.dark,
			};
		case "subtle":
			return {
				trackColor: mixColor(theme.colors.background.default, intentColors.light, 0.08),
				trackTransparency: 0.18,
				fillColor: mixColor(intentColors.main, theme.colors.background.surface, 0.16),
				fillTailColor: mixColor(intentColors.light, theme.colors.background.surface, 0.08),
				labelColor: theme.colors.text.secondary,
				valueLabelColor: theme.colors.text.primary,
			};
		case "outline":
		default:
			return {
				trackColor: neutralTrack,
				trackTransparency: 0.08,
				fillColor: intentColors.main,
				fillTailColor: mixColor(intentColors.light, intentColors.main, 0.18),
				labelColor: theme.colors.text.secondary,
				valueLabelColor: theme.colors.text.primary,
			};
	}
}

function resolveCircularProgressMotionTransition() {
	return {
		percent: { duration: "normal", easing: "out" },
	} as const;
}

function resolveMode(mode: CircularProgressMode | undefined, value: number | undefined): CircularProgressMode {
	return mode ?? (value === undefined ? "indeterminate" : "determinate");
}

function useIndeterminateRotation(enabled: boolean): number {
	const [rotation, setRotation] = React.useState(0);

	React.useEffect(() => {
		if (!enabled) {
			setRotation(0);
			return;
		}

		let angle = 0;
		const connection = RunService.Heartbeat.Connect((deltaTime) => {
			angle += (deltaTime * 360) / INDETERMINATE_ROTATION_SECONDS;
			setRotation(angle);
		});

		return () => {
			connection.Disconnect();
		};
	}, [enabled]);

	return rotation;
}

function isSegmentVisible(index: number, visibleCount: number): boolean {
	return index < visibleCount;
}

type CircularProgressComponent = ((props: CircularProgressProps) => React.ReactElement) & React.ForwardRefExoticComponent<CircularProgressProps>;

const CircularProgressBase = React.forwardRef<Frame, CircularProgressProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		mode,
		variant = "outline",
		color = "primary",
		size = "md",
		cap = "round",
		label,
		showValue = false,
		startAngle = -90,
		disableAnimation = false,
		value,
		min,
		max,
		formatValue,
		Event,
		Change,
	} = props;
	const resolvedMode = resolveMode(mode, value);
	const indeterminateRotation = useIndeterminateRotation(resolvedMode === "indeterminate" && !disableAnimation);
	const sizeStyles = resolveCircularProgressSizeStyles(theme, size);
	const visualStyles = resolveCircularProgressVisualStyles(theme, variant, color);
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
	} = useResolvedStyleProps("circular-progress", mergedStyleProps);
	const range = resolveCircularProgressRange(min, max);
	const resolvedValue = resolveCircularProgressValue(value, range);
	const percent = resolveCircularProgressPercent(resolvedValue, range);
	const animated = useMotion({
		values: {
			percent,
		},
		transition: resolveCircularProgressMotionTransition(),
	});
	const determinatePercent = disableAnimation ? percent : animated.percent;
	const visibleSegmentCount = resolvedMode === "determinate" ? resolveVisibleSegmentCount(determinatePercent) : INDETERMINATE_VISIBLE_SEGMENTS;
	const fillRotation = startAngle + indeterminateRotation;
	const percentText = (formatValue ?? formatDefaultCircularProgressValue)(resolvedValue, percent);
	const rootSlotProps = slotProps?.root;
	const labelSlotProps = slotProps?.label;
	const valueLabelSlotProps = slotProps?.valueLabel;
	const shouldRenderLabel = label !== undefined || labelSlotProps !== undefined;
	const shouldRenderValueLabel = (showValue && resolvedMode === "determinate") || valueLabelSlotProps !== undefined;
	const shouldRenderCenter = shouldRenderLabel || shouldRenderValueLabel || slotProps?.center !== undefined;
	const computedSize =
		resolvedSize ??
		(resolvedWidth !== undefined && resolvedHeight !== undefined
			? new UDim2(resolvedWidth, resolvedHeight)
			: resolvedWidth !== undefined
			? new UDim2(resolvedWidth, resolvedWidth)
			: resolvedHeight !== undefined
			? new UDim2(resolvedHeight, resolvedHeight)
			: UDim2.fromOffset(sizeStyles.diameter, sizeStyles.diameter));
	const computedConstraint =
		resolvedConstraint === undefined
			? {
				min: new Vector2(sizeStyles.diameter, sizeStyles.diameter),
				max: undefined,
			  }
			: {
				min:
					resolvedConstraint.min === undefined
						? new Vector2(sizeStyles.diameter, sizeStyles.diameter)
						: new Vector2(
							math.max(resolvedConstraint.min.X, sizeStyles.diameter),
							math.max(resolvedConstraint.min.Y, sizeStyles.diameter),
						  ),
				max: resolvedConstraint.max,
			  };
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);
	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedTrackZIndex = slotProps?.trackGroup?.ZIndex ?? resolvedRootZIndex;
	const resolvedFillZIndex = slotProps?.fillGroup?.ZIndex ?? resolvedTrackZIndex;
	const resolvedCenterZIndex = slotProps?.center?.ZIndex ?? resolvedFillZIndex;
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? resolvedCenterZIndex;
	const resolvedValueLabelZIndex = valueLabelSlotProps?.ZIndex ?? resolvedCenterZIndex;
	const labelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const labelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const valueLabelFont = valueLabelSlotProps?.Font ?? theme.fontFamily;
	const valueLabelFontFace = resolveTextFontFace(valueLabelSlotProps?.Font, valueLabelSlotProps?.FontFace, theme.fontFamily);
	const segmentRadius = cap === "round" ? new UDim(0.5, 0) : new UDim(0, 0);
	const decoratorChildren: React.ReactElement[] = [];

	pushDecorator(
		decoratorChildren,
		renderPaddingDecorator({ enabled: hasPadding, paddingTop, paddingRight, paddingBottom, paddingLeft, slotProps: slotProps?.padding }),
	);
	pushDecorator(decoratorChildren, renderSizeConstraintDecorator({ constraint: computedConstraint, slotProps: slotProps?.sizeConstraint }));
	pushDecorator(decoratorChildren, renderAspectRatioDecorator({ aspectRatio: 1, slotProps: slotProps?.aspectRatio }));

	const renderTrackSegments = () => {
		return SEGMENT_INDICES.map((index) => {
			const segmentAngle = (index / SEGMENT_COUNT) * 360;

			return (
				<frame
					key={`track-${index}`}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Rotation={segmentAngle}
					Active={false}
					Selectable={false}
				>
					<frame
						BackgroundColor3={visualStyles.trackColor}
						BackgroundTransparency={visualStyles.trackTransparency}
						BorderSizePixel={0}
						Size={UDim2.fromOffset(sizeStyles.segmentLength, sizeStyles.thickness)}
						Position={UDim2.fromScale(0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						ZIndex={slotProps?.trackSegment?.ZIndex ?? resolvedTrackZIndex}
						Active={false}
						Selectable={false}
						{...slotProps?.trackSegment}
					>
						<uicorner CornerRadius={segmentRadius} />
					</frame>
				</frame>
			);
		});
	};

	const renderFillSegments = () => {
		return SEGMENT_INDICES.map((index) => {
			const segmentVisible = isSegmentVisible(index, visibleSegmentCount);
			const segmentAngle = (index / SEGMENT_COUNT) * (resolvedMode === "indeterminate" ? -360 : 360);
			const tailAlpha =
				visibleSegmentCount <= 1
					? 1
					: index / (visibleSegmentCount - 1);
			const segmentColor = resolvedMode === "indeterminate" ? mixColor(visualStyles.fillColor, visualStyles.fillTailColor, tailAlpha * 0.36) : visualStyles.fillColor;

			return (
				<frame
					key={`fill-${index}`}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Rotation={segmentAngle}
					Visible={segmentVisible}
					Active={false}
					Selectable={false}
				>
					<frame
						BackgroundColor3={segmentColor}
						BackgroundTransparency={0}
						BorderSizePixel={0}
						Size={UDim2.fromOffset(sizeStyles.segmentLength, sizeStyles.thickness)}
						Position={UDim2.fromScale(0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						ZIndex={slotProps?.fillSegment?.ZIndex ?? resolvedFillZIndex}
						Active={false}
						Selectable={false}
						{...slotProps?.fillSegment}
					>
						<uicorner CornerRadius={segmentRadius} />
					</frame>
				</frame>
			);
		});
	};

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
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={resolvedTrackZIndex}
				Active={false}
				Selectable={false}
				{...slotProps?.trackGroup}
			>
				{renderTrackSegments()}
			</frame>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				Rotation={fillRotation}
				ZIndex={resolvedFillZIndex}
				Active={false}
				Selectable={false}
				{...slotProps?.fillGroup}
			>
				{renderFillSegments()}
			</frame>
			{shouldRenderCenter ? (
				<frame
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={resolvedCenterZIndex}
					Active={false}
					Selectable={false}
					{...slotProps?.center}
				>
					{shouldRenderValueLabel ? (
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={UDim2.fromScale(1, shouldRenderLabel ? 0.52 : 1)}
							Position={UDim2.fromScale(0, shouldRenderLabel ? 0.08 : 0)}
							Text={valueLabelSlotProps?.Text ?? percentText}
							TextColor3={valueLabelSlotProps?.TextColor3 ?? visualStyles.valueLabelColor}
							TextTransparency={valueLabelSlotProps?.TextTransparency ?? 0}
							TextStrokeTransparency={valueLabelSlotProps?.TextStrokeTransparency ?? 1}
							TextSize={valueLabelSlotProps?.TextSize ?? sizeStyles.valueLabelSize}
							Font={valueLabelFont}
							FontFace={valueLabelFontFace}
							LineHeight={valueLabelSlotProps?.LineHeight ?? sizeStyles.lineHeight}
							TextWrapped={valueLabelSlotProps?.TextWrapped ?? false}
							TextTruncate={valueLabelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
							TextXAlignment={valueLabelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
							TextYAlignment={valueLabelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={valueLabelSlotProps?.TextScaled ?? false}
							RichText={valueLabelSlotProps?.RichText ?? false}
							ZIndex={resolvedValueLabelZIndex}
							{...valueLabelSlotProps}
						/>
					) : undefined}
					{shouldRenderLabel ? (
						<textlabel
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={UDim2.fromScale(1, shouldRenderValueLabel ? 0.42 : 1)}
							Position={UDim2.fromScale(0, shouldRenderValueLabel ? 0.56 : 0)}
							Text={labelSlotProps?.Text ?? (label === undefined ? "" : tostring(label))}
							TextColor3={labelSlotProps?.TextColor3 ?? visualStyles.labelColor}
							TextTransparency={labelSlotProps?.TextTransparency ?? 0}
							TextStrokeTransparency={labelSlotProps?.TextStrokeTransparency ?? 1}
							TextSize={labelSlotProps?.TextSize ?? sizeStyles.labelSize}
							Font={labelFont}
							FontFace={labelFontFace}
							LineHeight={labelSlotProps?.LineHeight ?? sizeStyles.lineHeight}
							TextWrapped={labelSlotProps?.TextWrapped ?? false}
							TextTruncate={labelSlotProps?.TextTruncate ?? Enum.TextTruncate.AtEnd}
							TextXAlignment={labelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Center}
							TextYAlignment={labelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={labelSlotProps?.TextScaled ?? false}
							RichText={labelSlotProps?.RichText ?? false}
							ZIndex={resolvedLabelZIndex}
							{...labelSlotProps}
						/>
					) : undefined}
				</frame>
			) : undefined}
		</frame>
	);
});

export const CircularProgress = CircularProgressBase as CircularProgressComponent;

CircularProgress.displayName = "CircularProgress";
