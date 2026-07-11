import React from "@rbxts/react";

import { Box, Button, NotificationsProvider, Stack, Text, useBreakpoint, useResponsiveValue } from "@prism";
import type { StackDirection } from "@prism";
import { DARK_THEME, DEFAULT_THEME, ThemeProvider, theme as themeRefs, useTheme } from "@prism/theme";
import type { Theme } from "@prism/theme";

import { StoryCanvas } from "../stories/_shared/StoryCanvas";
import { ResponsiveCompositionGallery } from "./CompositionGallery";
import { createWorkbenchThemeOverride, type WorkbenchPresetName, type WorkbenchThemeOverride } from "./model";
import { countChangedThemeTokens } from "./serialize";
import { ThemeEditor } from "./ThemeEditor";

type OfficialPresetName = "Default" | "Dark";
type ViewportPreset = "host" | "compact" | "tablet" | "wide";

interface WorkbenchSession {
	readonly draft: WorkbenchThemeOverride;
	readonly preset: WorkbenchPresetName;
	readonly baseline: OfficialPresetName;
}

interface ViewportDefinition {
	readonly label: string;
	readonly width?: number;
}

const VIEWPORTS: Readonly<Record<ViewportPreset, ViewportDefinition>> = table.freeze({
	host: table.freeze({ label: "Follow host" }),
	compact: table.freeze({ label: "Compact 480", width: 480 }),
	tablet: table.freeze({ label: "Tablet 760", width: 760 }),
	wide: table.freeze({ label: "Wide 1180", width: 1_180 }),
});

function resolveOfficialTheme(preset: OfficialPresetName): Theme {
	return preset === "Dark" ? DARK_THEME : DEFAULT_THEME;
}

function createSession(preset: OfficialPresetName): WorkbenchSession {
	return table.freeze({
		draft: createWorkbenchThemeOverride(resolveOfficialTheme(preset)),
		preset,
		baseline: preset,
	});
}

function appendHistory(history: readonly WorkbenchSession[], session: WorkbenchSession): readonly WorkbenchSession[] {
	const updatedHistory = [...history, session];
	return updatedHistory.size() > 30
		? updatedHistory.filter((_entry, index) => index >= updatedHistory.size() - 30)
		: updatedHistory;
}

function PreviewViewport({
	hostTarget,
	preset,
}: {
	readonly hostTarget: Frame;
	readonly preset: ViewportPreset;
}): React.ReactElement {
	const theme = useTheme();
	const [previewTarget, setPreviewTarget] = React.useState<Frame>();
	const definition = VIEWPORTS[preset];
	const previewSize = definition.width === undefined ? new UDim2(1, 0, 0, 0) : new UDim2(0, definition.width, 0, 0);

	return (
		<scrollingframe
			AutomaticCanvasSize={Enum.AutomaticSize.XY}
			BackgroundColor3={theme.colors.background.default}
			BorderSizePixel={0}
			CanvasSize={UDim2.fromOffset(0, 0)}
			ScrollBarImageColor3={theme.colors.text.disabled}
			ScrollBarImageTransparency={0.18}
			ScrollBarThickness={8}
			ScrollingDirection={Enum.ScrollingDirection.XY}
			Size={new UDim2(1, 0, 0, 900)}
		>
			<uicorner CornerRadius={new UDim(0, theme.radius.md)} />
			<uistroke Color={theme.colors.border.default} Transparency={0.1} Thickness={1} />
			<frame
				ref={setPreviewTarget}
				AutomaticSize={Enum.AutomaticSize.Y}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={previewSize}
			>
				<NotificationsProvider portal={false} position="top-right" maxVisible={2} defaultDuration={4}>
					<ResponsiveCompositionGallery target={previewTarget ?? hostTarget} />
				</NotificationsProvider>
			</frame>
		</scrollingframe>
	);
}

interface WorkbenchSurfaceProps {
	readonly target: Frame;
	readonly session: WorkbenchSession;
	readonly historySize: number;
	readonly onDraftChange: (draft: WorkbenchThemeOverride) => void;
	readonly onDraftChangeEnd: () => void;
	readonly onPreset: (preset: OfficialPresetName) => void;
	readonly onReset: () => void;
	readonly onUndo: () => void;
}

function WorkbenchSurface({
	target,
	session,
	historySize,
	onDraftChange,
	onDraftChangeEnd,
	onPreset,
	onReset,
	onUndo,
}: WorkbenchSurfaceProps): React.ReactElement {
	const theme = useTheme();
	const hostBreakpoint = useBreakpoint({ target });
	const direction = useResponsiveValue<StackDirection>({ xs: "vertical", lg: "horizontal" }, { target });
	const [viewport, setViewport] = React.useState<ViewportPreset>("host");
	const editorWidth = direction === "horizontal" ? "34%" : "100%";
	const previewWidth = direction === "horizontal" ? "64%" : "100%";
	const changedTokens = countChangedThemeTokens(session.draft);

	return (
		<StoryCanvas>
			<Stack width="100%" gap="lg">
				<Stack width="100%" direction="horizontal" justify="spaceBetween" align="start" gap="md" wrap>
					<Stack gap="xs" width={direction === "horizontal" ? "58%" : "100%"}>
						<Text text="Theme Workbench" size="xl" weight={800} color={themeRefs.text.primary} />
						<Text
							text="Tune a frozen ThemeOverride against real Prism compositions. Official presets remain immutable; every edit produces a new draft."
							color={themeRefs.text.secondary}
							wrap
							width="100%"
						/>
					</Stack>
					<Box bg={themeRefs.action.hover} radius="md" border={1} borderColor={themeRefs.border.subtle} px="md" py="sm">
						<Stack gap="xs">
							<Text text={`${session.preset} draft`} size="sm" weight={800} color={themeRefs.text.primary} />
							<Text
								text={`${changedTokens} changed tokens | host ${math.floor(target.AbsoluteSize.X)} px / ${hostBreakpoint}`}
								size="xs"
								color={themeRefs.text.secondary}
							/>
						</Stack>
					</Box>
				</Stack>

				<Box
					width="100%"
					bg={themeRefs.background.surface}
					radius="md"
					border={1}
					borderColor={themeRefs.border.subtle}
					p="sm"
				>
					<Stack width="100%" direction="horizontal" align="center" gap="sm" wrap>
						<Text text="Presets" size="xs" weight={800} color={themeRefs.text.secondary} />
						<Button
							label="Default"
							size="sm"
							variant={session.baseline === "Default" ? "filled" : "outline"}
							onPress={() => onPreset("Default")}
						/>
						<Button
							label="Dark"
							size="sm"
							variant={session.baseline === "Dark" ? "filled" : "outline"}
							onPress={() => onPreset("Dark")}
						/>
						<Button label="Undo" size="sm" variant="subtle" disabled={historySize === 0} onPress={onUndo} />
						<Button
							label="Reset preset"
							size="sm"
							variant="subtle"
							disabled={session.preset === session.baseline}
							onPress={onReset}
						/>
					</Stack>
				</Box>

				<Stack width="100%" direction={direction} align="start" justify="spaceBetween" gap="lg">
					<Box
						width={editorWidth}
						bg={themeRefs.background.surface}
						border={1}
						borderColor={themeRefs.border.subtle}
						radius="lg"
						p="md"
					>
						<Stack width="100%" gap="sm">
							<Text text="Draft editor" size="lg" weight={800} color={themeRefs.text.primary} />
							<Text
								text="Colors, scales, motion, shadows, and exports stay grouped so the tool remains quick to scan."
								size="sm"
								color={themeRefs.text.secondary}
								wrap
								width="100%"
							/>
							<ThemeEditor draft={session.draft} onChange={onDraftChange} onChangeEnd={onDraftChangeEnd} />
						</Stack>
					</Box>

					<Stack width={previewWidth} gap="sm">
						<Stack width="100%" direction="horizontal" align="center" gap="sm" wrap>
							<Text text="Viewport" size="xs" weight={800} color={themeRefs.text.secondary} />
							{(["host", "compact", "tablet", "wide"] as ViewportPreset[]).map((preset) => (
								<Button
									key={preset}
									label={VIEWPORTS[preset].label}
									size="sm"
									variant={viewport === preset ? "filled" : "outline"}
									onPress={() => setViewport(preset)}
								/>
							))}
						</Stack>
						<PreviewViewport hostTarget={target} preset={viewport} />
					</Stack>
				</Stack>
			</Stack>
		</StoryCanvas>
	);
}

export function ThemeWorkbench({ target }: { readonly target: Frame }): React.ReactElement {
	const [session, setSession] = React.useState<WorkbenchSession>(() => createSession("Default"));
	const [history, setHistory] = React.useState<readonly WorkbenchSession[]>([]);
	const sessionRef = React.useRef(session);
	const draftTransactionOpenRef = React.useRef(false);
	sessionRef.current = session;

	const replaceSession = (updatedSession: WorkbenchSession) => {
		sessionRef.current = updatedSession;
		setSession(updatedSession);
	};
	const endDraftTransaction = () => {
		draftTransactionOpenRef.current = false;
	};

	const commit = (updatedSession: WorkbenchSession) => {
		endDraftTransaction();
		setHistory((current) => appendHistory(current, sessionRef.current));
		replaceSession(updatedSession);
	};
	const changeDraft = (draft: WorkbenchThemeOverride) => {
		const currentSession = sessionRef.current;
		if (!draftTransactionOpenRef.current) {
			draftTransactionOpenRef.current = true;
			setHistory((current) => appendHistory(current, currentSession));
		}
		replaceSession(table.freeze({ ...currentSession, draft, preset: "Custom" }));
	};
	const applyPreset = (preset: OfficialPresetName) => {
		commit(createSession(preset));
	};
	const reset = () => {
		commit(createSession(sessionRef.current.baseline));
	};
	const undo = () => {
		endDraftTransaction();
		const previous = history[history.size() - 1];
		if (previous === undefined) {
			return;
		}

		setHistory((current) => current.filter((_entry, index) => index < current.size() - 1));
		replaceSession(previous);
	};

	return (
		<ThemeProvider theme={session.draft}>
			<WorkbenchSurface
				target={target}
				session={session}
				historySize={history.size()}
				onDraftChange={changeDraft}
				onDraftChangeEnd={endDraftTransaction}
				onPreset={applyPreset}
				onReset={reset}
				onUndo={undo}
			/>
		</ThemeProvider>
	);
}
