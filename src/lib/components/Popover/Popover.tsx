import React from "@rbxts/react";

import { useTheme } from "@prism/theme";

import {
	renderCornerDecorator,
	renderPaddingDecorator,
	renderSizeConstraintDecorator,
	renderStrokeDecorator,
} from "../_shared/foundationDecorators";
import { Backdrop } from "../Backdrop";
import { assignRef, composeEventMaps, isPressInput } from "../_shared/interaction";
import { LayerPortal, useOverlayLocalPosition, useTriggerOverlayLayout } from "../_shared/layering";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { resolveTextFontFace } from "../_shared/textFont";
import { useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { resolvePopoverSizeStyles, resolvePopoverVisualStyles } from "./styles";
import type { PopoverProps } from "./types";
import { resolvePopoverPanelPlacement } from "./utils";

type PopoverComponent = ((props: PopoverProps) => React.ReactElement) & React.ForwardRefExoticComponent<PopoverProps>;
type TriggerEventMap = React.InstanceProps<TextButton>["Event"];

function isPrimitivePopoverContent(value: unknown): value is string | number {
	return typeIs(value, "string") || typeIs(value, "number");
}

const PopoverBase = React.forwardRef<Frame, PopoverProps>((props, ref) => {
	const theme = useTheme();
	const {
		slotProps,
		children,
		content,
		disabled = false,
		opened,
		defaultOpened = false,
		onOpenedChange,
		placement = "bottom",
		align = "center",
		triggerMode = "click",
		closeOnOutsidePress = true,
		Event,
		Change,
	} = props;
	const [uncontrolledOpened, setUncontrolledOpened] = React.useState(defaultOpened);
	const [rootInstance, setRootInstance] = React.useState<Frame>();
	const [overlayFrame, setOverlayFrame] = React.useState<Frame>();
	const [panelInstance, setPanelInstance] = React.useState<TextButton>();
	const pressArmedRef = React.useRef(false);
	const hasContent = content !== undefined;
	const isOpen = !disabled && hasContent && (opened ?? uncontrolledOpened);
	const sizeStyles = resolvePopoverSizeStyles(theme, props.gap);
	const visualStyles = resolvePopoverVisualStyles(theme);
	const {
		resolvedWidth,
		resolvedHeight,
		resolvedSize,
		resolvedPosition,
		resolvedAnchor,
		resolvedConstraint,
	} = useResolvedStyleProps("popover", props);
	const rootSlotProps = slotProps?.root;
	const triggerSlotProps = slotProps?.trigger;
	const overlaySlotProps = slotProps?.overlay;
	const outsideCaptureSlotProps = slotProps?.outsideCapture;
	const panelSlotProps = slotProps?.panel;
	const contentSlotProps = slotProps?.content;
	const labelSlotProps = slotProps?.label;
	const primitiveContent = isPrimitivePopoverContent(content) ? content : undefined;
	const richContent = content !== undefined && !isPrimitivePopoverContent(content) ? content : undefined;
	const triggerOverlayLayout = useTriggerOverlayLayout(rootInstance, isOpen);
	const panelPlacement = React.useMemo(() => {
		if (triggerOverlayLayout === undefined) {
			return undefined;
		}

		return resolvePopoverPanelPlacement(triggerOverlayLayout.bounds, placement, align, sizeStyles.gap, props.offset);
	}, [align, placement, props.offset, sizeStyles.gap, triggerOverlayLayout]);
	const localPanelPosition = useOverlayLocalPosition(overlayFrame, panelPlacement?.anchorPosition);

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
	} else {
		computedSize = UDim2.fromOffset(0, 0);
		computedAutoSize = Enum.AutomaticSize.XY;
	}

	const setOpened = React.useCallback(
		(nextOpened: boolean) => {
			if (disabled) {
				return;
			}

			const currentOpened = opened ?? uncontrolledOpened;
			if (opened === undefined) {
				setUncontrolledOpened(nextOpened);
			}

			if (nextOpened !== currentOpened) {
				onOpenedChange?.(nextOpened);
			}
		},
		[disabled, onOpenedChange, opened, uncontrolledOpened],
	);

	React.useEffect(() => {
		if (!disabled && hasContent) {
			return;
		}

		pressArmedRef.current = false;
		if (opened === undefined) {
			setUncontrolledOpened(false);
		}
	}, [disabled, hasContent, opened]);

	const resolvedRootZIndex = rootSlotProps?.ZIndex ?? props.zIndex;
	const resolvedTriggerZIndex = triggerSlotProps?.ZIndex ?? incrementZIndex(resolvedRootZIndex, 1);
	const resolvedOverlayZIndex = overlaySlotProps?.ZIndex ?? incrementZIndex(resolvedRootZIndex ?? triggerOverlayLayout?.zIndexBase, 1);
	const resolvedOutsideCaptureZIndex = outsideCaptureSlotProps?.ZIndex ?? resolvedOverlayZIndex;
	const resolvedPanelZIndex = panelSlotProps?.ZIndex ?? incrementZIndex(resolvedOutsideCaptureZIndex, 1);
	const resolvedContentZIndex = contentSlotProps?.ZIndex ?? incrementZIndex(resolvedPanelZIndex, 1);
	const resolvedLabelZIndex = labelSlotProps?.ZIndex ?? incrementZIndex(resolvedContentZIndex, 1);
	const resolvedLabelFont = labelSlotProps?.Font ?? theme.fontFamily;
	const resolvedLabelFontFace = resolveTextFontFace(labelSlotProps?.Font, labelSlotProps?.FontFace, theme.fontFamily);
	const shouldRenderOutsideCapture = closeOnOutsidePress && triggerMode !== "hover";

	const internalTriggerEvent: TriggerEventMap = {
		MouseEnter: () => {
			if (triggerMode === "hover") {
				setOpened(true);
			}
		},
		MouseLeave: () => {
			pressArmedRef.current = false;
			if (triggerMode === "hover") {
				setOpened(false);
			}
		},
		InputBegan: (_button, input) => {
			if (triggerMode !== "click" || disabled || !hasContent || !isPressInput(input)) {
				return;
			}

			pressArmedRef.current = true;
		},
		InputEnded: (_button, input) => {
			if (triggerMode !== "click" || !isPressInput(input)) {
				return;
			}

			const wasPressArmed = pressArmedRef.current;
			pressArmedRef.current = false;
			if (wasPressArmed) {
				setOpened(!isOpen);
			}
		},
	};
	const triggerEvent = useRootCursorEvent(
		composeEventMaps(internalTriggerEvent, Event),
		triggerSlotProps?.Event === undefined ? props.cursor ?? "pointer" : undefined,
		disabled || triggerMode === "manual" || !hasContent,
	);
	const rootRef = React.useCallback(
		(instance: Frame | undefined) => {
			setRootInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
			assignRef(ref, instance);
		},
		[ref],
	);
	const panelRef = React.useCallback((instance: TextButton | undefined) => {
		setPanelInstance((currentInstance) => (currentInstance === instance ? currentInstance : instance));
	}, []);
	const computedPosition = resolvedPosition ?? (props.center ? UDim2.fromScale(0.5, 0.5) : undefined);

	return (
		<>
			<frame
				Active={false}
				Selectable={false}
				BackgroundTransparency={1}
				BackgroundColor3={theme.colors.background.default}
				BorderSizePixel={0}
				Size={computedSize}
				AutomaticSize={computedAutoSize}
				Position={computedPosition}
				AnchorPoint={resolvedAnchor}
				ClipsDescendants={props.clip}
				Visible={props.visible}
				LayoutOrder={props.layoutOrder}
				ZIndex={resolvedRootZIndex}
				Change={Change}
				{...rootSlotProps}
				ref={rootRef}
			>
				{renderSizeConstraintDecorator({ constraint: resolvedConstraint, slotProps: slotProps?.sizeConstraint })}
				{children}
				<textbutton
					AutoButtonColor={false}
					Active={!disabled && triggerMode !== "manual" && hasContent}
					Selectable={false}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					Text=""
					TextTransparency={1}
					TextStrokeTransparency={1}
					ZIndex={resolvedTriggerZIndex}
					Event={triggerEvent}
					{...triggerSlotProps}
				/>
			</frame>
			{isOpen && triggerOverlayLayout !== undefined && panelPlacement !== undefined ? (
				<LayerPortal target={triggerOverlayLayout.portalTarget}>
					<frame
						ref={setOverlayFrame}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Size={UDim2.fromScale(1, 1)}
						Active={false}
						Selectable={false}
						ZIndex={resolvedOverlayZIndex}
						{...overlaySlotProps}
					>
						{shouldRenderOutsideCapture ? (
							<Backdrop
								visible
								opacity={0}
								active
								zIndex={resolvedOutsideCaptureZIndex}
								excludeInstance={panelInstance}
								onPress={() => setOpened(false)}
								slotProps={{ root: outsideCaptureSlotProps }}
							/>
						) : undefined}
						{localPanelPosition !== undefined ? (
							<textbutton
								AutoButtonColor={false}
								Active={panelSlotProps?.Active ?? true}
								Selectable={false}
								BackgroundColor3={panelSlotProps?.BackgroundColor3 ?? visualStyles.backgroundColor}
								BackgroundTransparency={panelSlotProps?.BackgroundTransparency ?? 0}
								BorderSizePixel={0}
								Text=""
								TextTransparency={1}
								TextStrokeTransparency={1}
								Position={new UDim2(0, localPanelPosition.X, 0, localPanelPosition.Y)}
								AnchorPoint={panelSlotProps?.AnchorPoint ?? panelPlacement.anchorPoint}
								Size={panelSlotProps?.Size ?? UDim2.fromOffset(0, 0)}
								AutomaticSize={panelSlotProps?.AutomaticSize ?? Enum.AutomaticSize.XY}
								ClipsDescendants={panelSlotProps?.ClipsDescendants ?? false}
								ZIndex={resolvedPanelZIndex}
								{...panelSlotProps}
								ref={panelRef}
							>
								{renderCornerDecorator({ radius: sizeStyles.radius, slotProps: slotProps?.panelCorner })}
								{renderStrokeDecorator({
									enabled: true,
									color: visualStyles.strokeColor,
									transparency: visualStyles.strokeTransparency,
									thickness: visualStyles.strokeThickness,
									slotProps: slotProps?.panelStroke,
								})}
								{renderPaddingDecorator({
									enabled: true,
									paddingTop: new UDim(0, sizeStyles.paddingY),
									paddingRight: new UDim(0, sizeStyles.paddingX),
									paddingBottom: new UDim(0, sizeStyles.paddingY),
									paddingLeft: new UDim(0, sizeStyles.paddingX),
									slotProps: slotProps?.panelPadding,
								})}
								<frame
									BackgroundTransparency={1}
									BorderSizePixel={0}
									Size={UDim2.fromOffset(0, 0)}
									AutomaticSize={Enum.AutomaticSize.XY}
									Active={false}
									Selectable={false}
									ZIndex={resolvedContentZIndex}
									{...contentSlotProps}
								>
					{richContent ?? (
						<textlabel
							AutomaticSize={Enum.AutomaticSize.XY}
							BackgroundTransparency={1}
							BorderSizePixel={0}
							Size={UDim2.fromOffset(0, 0)}
							Text={labelSlotProps?.Text ?? tostring(primitiveContent)}
							TextColor3={labelSlotProps?.TextColor3 ?? visualStyles.textColor}
							TextTransparency={labelSlotProps?.TextTransparency ?? 0}
							TextStrokeTransparency={labelSlotProps?.TextStrokeTransparency ?? 1}
							TextSize={labelSlotProps?.TextSize ?? sizeStyles.fontSize}
							Font={resolvedLabelFont}
							FontFace={resolvedLabelFontFace}
							LineHeight={labelSlotProps?.LineHeight ?? sizeStyles.lineHeight}
							TextWrapped={labelSlotProps?.TextWrapped ?? false}
							TextTruncate={labelSlotProps?.TextTruncate ?? Enum.TextTruncate.None}
							TextXAlignment={labelSlotProps?.TextXAlignment ?? Enum.TextXAlignment.Left}
							TextYAlignment={labelSlotProps?.TextYAlignment ?? Enum.TextYAlignment.Center}
							TextScaled={labelSlotProps?.TextScaled ?? false}
							RichText={labelSlotProps?.RichText ?? false}
							ZIndex={resolvedLabelZIndex}
							{...labelSlotProps}
						/>
					)}
				</frame>
							</textbutton>
						) : undefined}
					</frame>
				</LayerPortal>
			) : undefined}
		</>
	);
});

export const Popover = PopoverBase as PopoverComponent;

Popover.displayName = "Popover";
