import React from "@rbxts/react";

import type { SharedSizeConstraint } from "./useResolvedStyleProps";

type PaddingSlotProps = Partial<React.InstanceProps<UIPadding>>;
type SizeConstraintSlotProps = Partial<React.InstanceProps<UISizeConstraint>>;
type CornerSlotProps = Partial<React.InstanceProps<UICorner>>;
type StrokeSlotProps = Partial<React.InstanceProps<UIStroke>>;
type AspectRatioSlotProps = Partial<React.InstanceProps<UIAspectRatioConstraint>>;

export interface PaddingDecoratorOptions {
	readonly keyName?: string;
	readonly enabled: boolean;
	readonly paddingTop?: React.InstanceProps<UIPadding>["PaddingTop"];
	readonly paddingRight?: React.InstanceProps<UIPadding>["PaddingRight"];
	readonly paddingBottom?: React.InstanceProps<UIPadding>["PaddingBottom"];
	readonly paddingLeft?: React.InstanceProps<UIPadding>["PaddingLeft"];
	readonly slotProps?: PaddingSlotProps;
}

export interface SizeConstraintDecoratorOptions {
	readonly keyName?: string;
	readonly constraint?: SharedSizeConstraint;
	readonly slotProps?: SizeConstraintSlotProps;
}

export interface CornerDecoratorOptions {
	readonly keyName?: string;
	readonly radius?: React.InstanceProps<UICorner>["CornerRadius"];
	readonly slotProps?: CornerSlotProps;
}

export interface StrokeDecoratorOptions {
	readonly keyName?: string;
	readonly enabled: boolean;
	readonly color?: React.InstanceProps<UIStroke>["Color"];
	readonly thickness?: React.InstanceProps<UIStroke>["Thickness"];
	readonly transparency?: React.InstanceProps<UIStroke>["Transparency"];
	readonly mode?: React.InstanceProps<UIStroke>["ApplyStrokeMode"];
	readonly slotProps?: StrokeSlotProps;
}

export interface AspectRatioDecoratorOptions {
	readonly keyName?: string;
	readonly aspectRatio?: React.InstanceProps<UIAspectRatioConstraint>["AspectRatio"];
	readonly slotProps?: AspectRatioSlotProps;
}

export function renderPaddingDecorator(options: PaddingDecoratorOptions): React.ReactElement | undefined {
	if (!options.enabled && options.slotProps === undefined) {
		return undefined;
	}

	return (
		<uipadding
			key={options.keyName ?? "padding"}
			PaddingTop={options.paddingTop}
			PaddingRight={options.paddingRight}
			PaddingBottom={options.paddingBottom}
			PaddingLeft={options.paddingLeft}
			{...options.slotProps}
		/>
	);
}

export function renderSizeConstraintDecorator(options: SizeConstraintDecoratorOptions): React.ReactElement | undefined {
	if (options.constraint === undefined && options.slotProps === undefined) {
		return undefined;
	}

	return (
		<uisizeconstraint
			key={options.keyName ?? "size-constraint"}
			MinSize={options.constraint?.min}
			MaxSize={options.constraint?.max}
			{...options.slotProps}
		/>
	);
}

export function renderCornerDecorator(options: CornerDecoratorOptions): React.ReactElement | undefined {
	if (options.radius === undefined && options.slotProps === undefined) {
		return undefined;
	}

	return <uicorner key={options.keyName ?? "corner"} CornerRadius={options.radius} {...options.slotProps} />;
}

export function renderStrokeDecorator(options: StrokeDecoratorOptions): React.ReactElement | undefined {
	if (!options.enabled && options.slotProps === undefined) {
		return undefined;
	}

	return (
		<uistroke
			key={options.keyName ?? "stroke"}
			Color={options.color}
			Thickness={options.thickness}
			Transparency={options.transparency}
			ApplyStrokeMode={options.mode}
			{...options.slotProps}
		/>
	);
}

export function renderAspectRatioDecorator(options: AspectRatioDecoratorOptions): React.ReactElement | undefined {
	if (options.aspectRatio === undefined && options.slotProps === undefined) {
		return undefined;
	}

	return (
		<uiaspectratioconstraint
			key={options.keyName ?? "aspect-ratio"}
			AspectRatio={options.aspectRatio}
			{...options.slotProps}
		/>
	);
}

export function pushDecorator(
	decoratorChildren: React.ReactElement[],
	decorator: React.ReactElement | undefined,
): void {
	if (decorator !== undefined) {
		decoratorChildren.push(decorator);
	}
}
