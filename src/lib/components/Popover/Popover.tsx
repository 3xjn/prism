import React from "@rbxts/react";

import { useTheme } from "@prism/theme";

import { renderSizeConstraintDecorator } from "../_shared/foundationDecorators";
import { resolveFrameSizeProps } from "../_shared/frameSize";
import { assignRef, composeEventMaps, isPressInput } from "../_shared/interaction";
import { TriggerOverlayLayer } from "../_shared/TriggerOverlayLayer";
import type { TriggerOverlayLayout } from "../_shared/layering";
import { incrementZIndex } from "../_shared/overlayLayerPolicy";
import { applyStyleOverride } from "../_shared/styleOverride";
import { useDelayedCallback } from "../_shared/useDelayedCallback";
import { useOverlayBackDismissal } from "../_shared/useOverlayBackDismissal";
import { useOverlaySelectionLifecycle } from "../_shared/useOverlaySelectionLifecycle";
import { useResolvedStyleProps } from "../_shared/useResolvedStyleProps";
import { useRootCursorEvent } from "../_shared/useRootCursor";

import { PopoverOverlayPanel } from "./PopoverOverlayPanel";
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
		openDelay = 0,
		closeOnOutsidePress = true,
		closeOnBack = true,
		Event,
		Change,
	} = props;
	const [uncontrolledOpened, setUncontrolledOpened] = React.useState(defaultOpened);
	const delayedOpen = useDelayedCallback();
	const [rootInstance, setRootInstance] = React.useState<Frame>();
	const [panelInstance, setPanelInstance] = React.useState<TextButton>();
	const pressArmedRef = React.useRef(false);
	const hasContent = content !== undefined;
	const isOpen = !disabled && hasContent && (opened ?? uncontrolledOpened);
	useOverlaySelectionLifecycle({
		opened: isOpen,
		container: panelInstance,
		entryPolicy: "trigger",
		trigger: rootInstance,
	});
	const sizeStyles = resolvePopoverSizeStyles(theme, props.gap);
	const visualStyles = applyStyleOverride(resolvePopoverVisualStyles(theme), props.styleOverrides, { theme });
	const { resolvedWidth, resolvedHeight, resolvedSize, resolvedPosition, resolvedAnchor, resolvedConstraint } =
		useResolvedStyleProps("popover", props);
	const rootSlotProps = slotProps?.root;
	const triggerSlotProps = slotProps?.trigger;
	const overlaySlotProps = slotProps?.overlay;
	const primitiveContent = isPrimitivePopoverContent(content) ? content : undefined;
	const richContent = content !== undefined && !isPrimitivePopoverContent(content) ? content : undefined;
	const resolvePanelPlacement = React.useCallback(
		(layout: TriggerOverlayLayout) => {
			return resolvePopoverPanelPlacement(layout.bounds, placement, align, sizeStyles.gap, props.offset);
		},
		[align, placement, props.offset, sizeStyles.gap],
	);

	const rootSizeProps = resolveFrameSizeProps(resolvedSize, resolvedWidth, resolvedHeight);

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
	useOverlayBackDismissal({
		opened: isOpen,
		dismissible: closeOnBack && triggerMode !== "hover" && (opened === undefined || onOpenedChange !== undefined),
		overlay: panelInstance,
		onDismiss: () => setOpened(false),
	});

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
	const resolveOverlayZIndex = React.useCallback(
		(layout: TriggerOverlayLayout) => {
			return incrementZIndex(resolvedRootZIndex ?? layout.zIndexBase, 1);
		},
		[resolvedRootZIndex],
	);
	const shouldRenderOutsideCapture = closeOnOutsidePress && triggerMode !== "hover";

	const internalTriggerEvent: TriggerEventMap = {
		MouseEnter: () => {
			if (triggerMode === "hover") {
				delayedOpen.schedule(openDelay, () => setOpened(true));
			}
		},
		MouseLeave: () => {
			pressArmedRef.current = false;
			if (triggerMode === "hover") {
				delayedOpen.cancel();
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
		triggerSlotProps?.Event === undefined ? (props.cursor ?? "pointer") : undefined,
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
				Size={rootSizeProps.size}
				AutomaticSize={rootSizeProps.automaticSize}
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
			<TriggerOverlayLayer
				trigger={rootInstance}
				enabled={isOpen}
				resolvePlacement={resolvePanelPlacement}
				resolveZIndex={resolveOverlayZIndex}
				slotProps={overlaySlotProps}
				render={({ placement: panelPlacement, localAnchorPosition, overlayZIndex }) => {
					return (
						<PopoverOverlayPanel
							localAnchorPosition={localAnchorPosition}
							panelPlacement={panelPlacement}
							overlayZIndex={overlayZIndex}
							panelInstance={panelInstance}
							primitiveContent={primitiveContent}
							richContent={richContent}
							shouldRenderOutsideCapture={shouldRenderOutsideCapture}
							sizeStyles={sizeStyles}
							visualStyles={visualStyles}
							slotProps={slotProps}
							themeFontFamily={theme.fontFamily}
							onOutsidePress={() => setOpened(false)}
							setPanelInstance={panelRef}
						/>
					);
				}}
			/>
		</>
	);
});

export const Popover = PopoverBase as PopoverComponent;

Popover.displayName = "Popover";
