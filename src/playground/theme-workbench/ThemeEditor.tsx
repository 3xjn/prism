import React from "@rbxts/react";

import { Box, Button, ColorPicker, Select, Slider, Stack, Tabs, Text } from "@prism";
import type { SelectOption, TabsTab } from "@prism";
import type {
	ActionColorRole,
	BackgroundColorRole,
	BorderColorRole,
	MotionEasingToken,
	SemanticIntent,
	SemanticIntentRole,
	TextColorRole,
	ThemeSize,
} from "@prism/theme";
import { theme as themeRefs, useTheme } from "@prism/theme";

import {
	getSurfaceColor,
	SEMANTIC_INTENTS,
	THEME_SIZES,
	updateBreakpoint,
	updateFoundationScale,
	updateFontFamily,
	updateMotionDuration,
	updateMotionEasing,
	updateSemanticIntentColor,
	updateShadow,
	updateSurfaceColor,
	type FoundationScaleName,
	type SurfaceColorGroup,
	type WorkbenchThemeOverride,
} from "./model";
import { countChangedThemeTokens, serializeWorkbenchThemeOverride, type ThemeExportLanguage } from "./serialize";

const SEMANTIC_ROLES: readonly SemanticIntentRole[] = table.freeze(["main", "light", "dark", "contrast"]);
const SEMANTIC_ROLE_OPTIONS: readonly SelectOption[] = table.freeze(
	SEMANTIC_ROLES.map((role) => ({ value: role, label: role })),
);
const MOTION_TOKENS = table.freeze(["instant", "fast", "normal", "slow"] as const);
const MOTION_EASING_TOKENS: readonly MotionEasingToken[] = table.freeze(["linear", "standard", "out", "in", "inOut"]);
const FONT_FAMILIES: readonly Enum.Font[] = table.freeze([
	Enum.Font.BuilderSans,
	Enum.Font.Gotham,
	Enum.Font.SourceSans,
	Enum.Font.Roboto,
	Enum.Font.RobotoMono,
]);
const EASING_STYLES: readonly Enum.EasingStyle[] = table.freeze([
	Enum.EasingStyle.Linear,
	Enum.EasingStyle.Sine,
	Enum.EasingStyle.Quad,
	Enum.EasingStyle.Cubic,
	Enum.EasingStyle.Quart,
	Enum.EasingStyle.Quint,
	Enum.EasingStyle.Back,
	Enum.EasingStyle.Bounce,
	Enum.EasingStyle.Elastic,
]);
const EASING_DIRECTIONS: readonly Enum.EasingDirection[] = table.freeze([
	Enum.EasingDirection.In,
	Enum.EasingDirection.Out,
	Enum.EasingDirection.InOut,
]);

const INTENT_OPTIONS: readonly SelectOption[] = table.freeze(
	SEMANTIC_INTENTS.map((intent) => ({
		value: intent,
		label: string.upper(string.sub(intent, 1, 1)) + string.sub(intent, 2),
	})),
);
const SURFACE_OPTIONS: readonly SelectOption[] = table.freeze([
	{ value: "text", label: "Text" },
	{ value: "background", label: "Background" },
	{ value: "border", label: "Border" },
	{ value: "action", label: "Action" },
]);
const FOUNDATION_OPTIONS: readonly SelectOption[] = table.freeze([
	{ value: "spacing", label: "Spacing" },
	{ value: "radius", label: "Radius" },
	{ value: "fontSizes", label: "Font sizes" },
	{ value: "lineHeights", label: "Line heights" },
	{ value: "breakpoints", label: "Breakpoints" },
]);
const SIZE_OPTIONS: readonly SelectOption[] = table.freeze(
	THEME_SIZES.map((size) => ({ value: size, label: string.upper(size) })),
);
const FONT_OPTIONS: readonly SelectOption[] = table.freeze(
	FONT_FAMILIES.map((font) => ({ value: font.Name, label: font.Name })),
);
const EASING_TOKEN_OPTIONS: readonly SelectOption[] = table.freeze(
	MOTION_EASING_TOKENS.map((token) => ({ value: token, label: token })),
);
const EASING_STYLE_OPTIONS: readonly SelectOption[] = table.freeze(
	EASING_STYLES.map((style) => ({ value: style.Name, label: style.Name })),
);
const EASING_DIRECTION_OPTIONS: readonly SelectOption[] = table.freeze(
	EASING_DIRECTIONS.map((direction) => ({ value: direction.Name, label: direction.Name })),
);

interface ThemeEditorProps {
	readonly draft: WorkbenchThemeOverride;
	readonly onChange: (draft: WorkbenchThemeOverride) => void;
	readonly onChangeEnd: () => void;
}

function TokenSlider({
	label,
	value,
	min,
	max,
	step,
	suffix,
	onChange,
	onChangeEnd,
}: {
	readonly label: string;
	readonly value: number;
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly suffix?: string;
	readonly onChange: (value: number) => void;
	readonly onChangeEnd: () => void;
}): React.ReactElement {
	return (
		<Stack width="100%" gap="xs">
			<Stack width="100%" direction="horizontal" justify="spaceBetween" align="center" gap="sm">
				<Text text={label} size="xs" weight={700} color={themeRefs.text.secondary} />
				<Text text={`${tostring(value)}${suffix ?? ""}`} size="xs" color={themeRefs.text.primary} />
			</Stack>
			<Slider
				value={value}
				onChange={onChange}
				onChangeEnd={() => onChangeEnd()}
				min={min}
				max={max}
				step={step}
				size="sm"
				fullWidth
				tooltip
			/>
		</Stack>
	);
}

function IntentColorsEditor({ draft, onChange, onChangeEnd }: ThemeEditorProps): React.ReactElement {
	const [intent, setIntent] = React.useState<SemanticIntent>("primary");
	const [role, setRole] = React.useState<SemanticIntentRole>("main");

	return (
		<Stack width="100%" gap="sm">
			<Text text="Intent palette" size="sm" weight={800} color={themeRefs.text.primary} />
			<Select
				options={INTENT_OPTIONS}
				value={intent}
				onChange={(value) => setIntent(value as SemanticIntent)}
				fullWidth
				size="sm"
			/>
			<Select
				options={SEMANTIC_ROLE_OPTIONS}
				value={role}
				onChange={(value) => setRole(value as SemanticIntentRole)}
				fullWidth
				size="sm"
			/>
			<ColorPicker
				value={draft.colors[intent][role]}
				onChange={(color) => onChange(updateSemanticIntentColor(draft, intent, role, color))}
				onChangeEnd={() => onChangeEnd()}
				fullWidth
				size="sm"
			/>
		</Stack>
	);
}

function resolveSurfaceRoles(group: SurfaceColorGroup): readonly string[] {
	switch (group) {
		case "text":
			return table.freeze(["primary", "secondary", "disabled", "inverse"] as TextColorRole[]);
		case "background":
			return table.freeze(["default", "surface"] as BackgroundColorRole[]);
		case "border":
			return table.freeze(["subtle", "default", "strong"] as BorderColorRole[]);
		case "action":
			return table.freeze(["hover", "pressed", "disabled", "disabledBackground"] as ActionColorRole[]);
	}
}

function SurfaceColorsEditor({ draft, onChange, onChangeEnd }: ThemeEditorProps): React.ReactElement {
	const [group, setGroup] = React.useState<SurfaceColorGroup>("background");
	const roles = resolveSurfaceRoles(group);
	const [role, setRole] = React.useState(roles[0]);
	const roleOptions: readonly SelectOption[] = roles.map((surfaceRole) => ({ value: surfaceRole, label: surfaceRole }));

	return (
		<Stack width="100%" gap="sm">
			<Text text="Surfaces and content" size="sm" weight={800} color={themeRefs.text.primary} />
			<Select
				options={SURFACE_OPTIONS}
				value={group}
				onChange={(value) => {
					const nextGroup = value as SurfaceColorGroup;
					setGroup(nextGroup);
					setRole(resolveSurfaceRoles(nextGroup)[0]);
				}}
				fullWidth
				size="sm"
			/>
			<Select options={roleOptions} value={role} onChange={setRole} fullWidth size="sm" />
			<ColorPicker
				value={getSurfaceColor(draft, group, role)}
				onChange={(color) => onChange(updateSurfaceColor(draft, group, role, color))}
				onChangeEnd={() => onChangeEnd()}
				fullWidth
				size="sm"
			/>
		</Stack>
	);
}

function ColorsPanel(props: ThemeEditorProps): React.ReactElement {
	return (
		<Stack width="100%" gap="lg">
			<IntentColorsEditor {...props} />
			<SurfaceColorsEditor {...props} />
		</Stack>
	);
}

type FoundationEditorName = FoundationScaleName | "breakpoints";

function resolveFoundationRange(name: FoundationEditorName): {
	readonly min: number;
	readonly max: number;
	readonly step: number;
	readonly suffix?: string;
} {
	switch (name) {
		case "spacing":
			return { min: 0, max: 64, step: 1, suffix: " px" };
		case "radius":
			return { min: 0, max: 48, step: 1, suffix: " px" };
		case "fontSizes":
			return { min: 8, max: 40, step: 1, suffix: " px" };
		case "lineHeights":
			return { min: 1, max: 2, step: 0.05 };
		case "breakpoints":
			return { min: 0, max: 2_000, step: 10, suffix: " px" };
	}
}

function FoundationPanel({ draft, onChange, onChangeEnd }: ThemeEditorProps): React.ReactElement {
	const [name, setName] = React.useState<FoundationEditorName>("spacing");
	const range = resolveFoundationRange(name);

	return (
		<Stack width="100%" gap="md">
			<Text
				text="Five-step scales stay explicit and predictable. Breakpoint edits are clamped so xs through xl never reverses."
				size="sm"
				color={themeRefs.text.secondary}
				wrap
				width="100%"
			/>
			<Stack width="100%" gap="xs">
				<Text text="Font family" size="xs" weight={700} color={themeRefs.text.secondary} />
				<Select
					options={FONT_OPTIONS}
					value={draft.fontFamily.Name}
					onChange={(value) => {
						const fontFamily = FONT_FAMILIES.find((candidate) => candidate.Name === value);
						if (fontFamily !== undefined) {
							onChange(updateFontFamily(draft, fontFamily));
							onChangeEnd();
						}
					}}
					fullWidth
					size="sm"
				/>
			</Stack>
			<Select
				options={FOUNDATION_OPTIONS}
				value={name}
				onChange={(value) => setName(value as FoundationEditorName)}
				fullWidth
				size="sm"
			/>
			{THEME_SIZES.map((size) => {
				const value = name === "breakpoints" ? draft.breakpoints[size] : draft[name][size];
				return (
					<TokenSlider
						key={size}
						label={string.upper(size)}
						value={value}
						min={range.min}
						max={range.max}
						step={range.step}
						suffix={range.suffix}
						onChange={(nextValue) =>
							onChange(
								name === "breakpoints"
									? updateBreakpoint(draft, size, nextValue)
									: updateFoundationScale(draft, name, size, nextValue),
							)
						}
						onChangeEnd={onChangeEnd}
					/>
				);
			})}
		</Stack>
	);
}

function MotionPanel({ draft, onChange, onChangeEnd }: ThemeEditorProps): React.ReactElement {
	const [shadowSize, setShadowSize] = React.useState<ThemeSize>("md");
	const [easingToken, setEasingToken] = React.useState<MotionEasingToken>("standard");
	const shadow = draft.shadows[shadowSize];
	const easing = draft.motion.easing[easingToken];

	return (
		<Stack width="100%" gap="lg">
			<Stack width="100%" gap="sm">
				<Text text="Motion duration" size="sm" weight={800} color={themeRefs.text.primary} />
				{MOTION_TOKENS.map((token) => (
					<TokenSlider
						key={token}
						label={token}
						value={draft.motion.duration[token]}
						min={0}
						max={0.6}
						step={0.01}
						suffix=" s"
						onChange={(value) => onChange(updateMotionDuration(draft, token, value))}
						onChangeEnd={onChangeEnd}
					/>
				))}
			</Stack>

			<Stack width="100%" gap="sm">
				<Text text="Motion easing" size="sm" weight={800} color={themeRefs.text.primary} />
				<Select
					options={EASING_TOKEN_OPTIONS}
					value={easingToken}
					onChange={(value) => setEasingToken(value as MotionEasingToken)}
					fullWidth
					size="sm"
				/>
				<Select
					options={EASING_STYLE_OPTIONS}
					value={easing.style.Name}
					onChange={(value) => {
						const style = EASING_STYLES.find((candidate) => candidate.Name === value);
						if (style !== undefined) {
							onChange(updateMotionEasing(draft, easingToken, { style }));
							onChangeEnd();
						}
					}}
					fullWidth
					size="sm"
				/>
				<Select
					options={EASING_DIRECTION_OPTIONS}
					value={easing.direction.Name}
					onChange={(value) => {
						const direction = EASING_DIRECTIONS.find((candidate) => candidate.Name === value);
						if (direction !== undefined) {
							onChange(updateMotionEasing(draft, easingToken, { direction }));
							onChangeEnd();
						}
					}}
					fullWidth
					size="sm"
				/>
			</Stack>

			<Stack width="100%" gap="sm">
				<Text text="Elevation shadow" size="sm" weight={800} color={themeRefs.text.primary} />
				<Select
					options={SIZE_OPTIONS}
					value={shadowSize}
					onChange={(value) => setShadowSize(value as ThemeSize)}
					fullWidth
					size="sm"
				/>
				<Text text="Color" size="xs" weight={700} color={themeRefs.text.secondary} />
				<ColorPicker
					value={shadow.color}
					onChange={(color) => onChange(updateShadow(draft, shadowSize, { color }))}
					onChangeEnd={() => onChangeEnd()}
					fullWidth
					size="sm"
				/>
				<TokenSlider
					label="thickness"
					value={shadow.thickness}
					min={0}
					max={12}
					step={1}
					suffix=" px"
					onChange={(thickness) => onChange(updateShadow(draft, shadowSize, { thickness }))}
					onChangeEnd={onChangeEnd}
				/>
				<TokenSlider
					label="transparency"
					value={shadow.transparency}
					min={0}
					max={1}
					step={0.01}
					onChange={(transparency) => onChange(updateShadow(draft, shadowSize, { transparency }))}
					onChangeEnd={onChangeEnd}
				/>
			</Stack>
		</Stack>
	);
}

function ExportPanel({ draft }: { readonly draft: WorkbenchThemeOverride }): React.ReactElement {
	const theme = useTheme();
	const [language, setLanguage] = React.useState<ThemeExportLanguage>("typescript");
	const output = serializeWorkbenchThemeOverride(draft, language);
	const changedTokens = countChangedThemeTokens(draft);

	return (
		<Stack width="100%" gap="sm">
			<Stack width="100%" direction="horizontal" gap="sm" wrap>
				<Button
					label="TypeScript"
					variant={language === "typescript" ? "filled" : "outline"}
					size="sm"
					onPress={() => setLanguage("typescript")}
				/>
				<Button
					label="Luau ModuleScript"
					variant={language === "luau" ? "filled" : "outline"}
					size="sm"
					onPress={() => setLanguage("luau")}
				/>
			</Stack>
			<Text
				text={`${changedTokens} changed tokens | unchanged defaults omitted`}
				size="xs"
				color={themeRefs.text.secondary}
				wrap
				width="100%"
			/>
			<textbox
				BackgroundColor3={theme.colors.background.default}
				BorderSizePixel={0}
				ClearTextOnFocus={false}
				MultiLine={true}
				Size={new UDim2(1, 0, 0, 380)}
				Text={output}
				TextColor3={theme.colors.text.primary}
				TextEditable={true}
				TextSize={13}
				TextWrapped={false}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
				Font={Enum.Font.Code}
				FontFace={Font.fromEnum(Enum.Font.Code)}
			>
				<uicorner CornerRadius={new UDim(0, theme.radius.sm)} />
				<uistroke Color={theme.colors.border.default} Transparency={0.16} Thickness={1} />
				<uipadding
					PaddingTop={new UDim(0, theme.spacing.sm)}
					PaddingRight={new UDim(0, theme.spacing.sm)}
					PaddingBottom={new UDim(0, theme.spacing.sm)}
					PaddingLeft={new UDim(0, theme.spacing.sm)}
				/>
			</textbox>
			<Text
				text={
					language === "typescript"
						? "Select the output to copy it into an rbxts module."
						: "Create ReplicatedStorage/ThemeOverride.lua, then return this frozen table."
				}
				size="xs"
				color={themeRefs.text.secondary}
				wrap
				width="100%"
			/>
		</Stack>
	);
}

export function ThemeEditor(props: ThemeEditorProps): React.ReactElement {
	const tabs: readonly TabsTab[] = [
		{ value: "colors", label: "Colors", panel: <ColorsPanel {...props} /> },
		{ value: "foundation", label: "Foundation", panel: <FoundationPanel {...props} /> },
		{ value: "motion", label: "Motion", panel: <MotionPanel {...props} /> },
		{ value: "export", label: "Export", panel: <ExportPanel draft={props.draft} /> },
	];

	return <Tabs tabs={tabs} defaultValue="colors" variant="contained" size="sm" fullWidth width="100%" />;
}
