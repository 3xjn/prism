import { DEFAULT_THEME } from "@prism/theme";
import type {
	ActionColorRole,
	BackgroundColorRole,
	BorderColorRole,
	MotionDurationToken,
	MotionEasingToken,
	SemanticIntentRole,
	TextColorRole,
	ThemeMotionEasing,
	ThemeSize,
} from "@prism/theme";

import { SEMANTIC_INTENTS, THEME_SIZES, type WorkbenchThemeOverride } from "./model";

export type ThemeExportLanguage = "typescript" | "luau";

interface ExportField {
	readonly key: string;
	readonly value: string | ExportField[];
}

const SEMANTIC_ROLES: readonly SemanticIntentRole[] = table.freeze(["main", "light", "dark", "contrast"]);
const TEXT_ROLES: readonly TextColorRole[] = table.freeze(["primary", "secondary", "disabled", "inverse"]);
const BACKGROUND_ROLES: readonly BackgroundColorRole[] = table.freeze(["default", "surface"]);
const BORDER_ROLES: readonly BorderColorRole[] = table.freeze(["subtle", "default", "strong"]);
const ACTION_ROLES: readonly ActionColorRole[] = table.freeze(["hover", "pressed", "disabled", "disabledBackground"]);
const MOTION_DURATION_TOKENS: readonly MotionDurationToken[] = table.freeze(["instant", "fast", "normal", "slow"]);
const MOTION_EASING_TOKENS: readonly MotionEasingToken[] = table.freeze(["linear", "standard", "out", "in", "inOut"]);

function numbersEqual(left: number, right: number): boolean {
	return math.abs(left - right) < 1e-6;
}

function colorsEqual(left: Color3, right: Color3): boolean {
	return numbersEqual(left.R, right.R) && numbersEqual(left.G, right.G) && numbersEqual(left.B, right.B);
}

function formatNumber(value: number): string {
	const rounded = math.round(value * 1_000) / 1_000;
	return tostring(rounded === 0 ? 0 : rounded);
}

function colorLiteral(color: Color3): string {
	return `Color3.fromRGB(${math.round(color.R * 255)}, ${math.round(color.G * 255)}, ${math.round(color.B * 255)})`;
}

function createColorFields<Role extends string>(
	current: Readonly<Record<Role, Color3>>,
	base: Readonly<Record<Role, Color3>>,
	roles: readonly Role[],
): ExportField[] {
	const fields: ExportField[] = [];
	for (const role of roles) {
		if (!colorsEqual(current[role], base[role])) {
			fields.push({ key: role, value: colorLiteral(current[role]) });
		}
	}
	return fields;
}

function createNumberFields<Role extends string>(
	current: Readonly<Record<Role, number>>,
	base: Readonly<Record<Role, number>>,
	roles: readonly Role[],
): ExportField[] {
	const fields: ExportField[] = [];
	for (const role of roles) {
		if (!numbersEqual(current[role], base[role])) {
			fields.push({ key: role, value: formatNumber(current[role]) });
		}
	}
	return fields;
}

function pushTable(fields: ExportField[], key: string, children: ExportField[]): void {
	if (children.size() > 0) {
		fields.push({ key, value: children });
	}
}

function createColorSection(draft: WorkbenchThemeOverride): ExportField[] {
	const fields: ExportField[] = [];
	for (const intent of SEMANTIC_INTENTS) {
		pushTable(fields, intent, createColorFields(draft.colors[intent], DEFAULT_THEME.colors[intent], SEMANTIC_ROLES));
	}
	pushTable(fields, "text", createColorFields(draft.colors.text, DEFAULT_THEME.colors.text, TEXT_ROLES));
	pushTable(
		fields,
		"background",
		createColorFields(draft.colors.background, DEFAULT_THEME.colors.background, BACKGROUND_ROLES),
	);
	pushTable(fields, "border", createColorFields(draft.colors.border, DEFAULT_THEME.colors.border, BORDER_ROLES));
	pushTable(fields, "action", createColorFields(draft.colors.action, DEFAULT_THEME.colors.action, ACTION_ROLES));
	return fields;
}

function createShadowSection(draft: WorkbenchThemeOverride): ExportField[] {
	const fields: ExportField[] = [];
	for (const size of THEME_SIZES) {
		const current = draft.shadows[size];
		const base = DEFAULT_THEME.shadows[size];
		const shadowFields: ExportField[] = [];
		if (!colorsEqual(current.color, base.color)) {
			shadowFields.push({ key: "color", value: colorLiteral(current.color) });
		}
		if (!numbersEqual(current.thickness, base.thickness)) {
			shadowFields.push({ key: "thickness", value: formatNumber(current.thickness) });
		}
		if (!numbersEqual(current.transparency, base.transparency)) {
			shadowFields.push({ key: "transparency", value: formatNumber(current.transparency) });
		}
		pushTable(fields, size, shadowFields);
	}
	return fields;
}

function createEasingFields(current: ThemeMotionEasing, base: ThemeMotionEasing): ExportField[] {
	const fields: ExportField[] = [];
	if (current.style !== base.style) {
		fields.push({ key: "style", value: `Enum.EasingStyle.${current.style.Name}` });
	}
	if (current.direction !== base.direction) {
		fields.push({ key: "direction", value: `Enum.EasingDirection.${current.direction.Name}` });
	}
	return fields;
}

function createMotionSection(draft: WorkbenchThemeOverride): ExportField[] {
	const fields: ExportField[] = [];
	pushTable(
		fields,
		"duration",
		createNumberFields(draft.motion.duration, DEFAULT_THEME.motion.duration, MOTION_DURATION_TOKENS),
	);

	const easingFields: ExportField[] = [];
	for (const token of MOTION_EASING_TOKENS) {
		pushTable(easingFields, token, createEasingFields(draft.motion.easing[token], DEFAULT_THEME.motion.easing[token]));
	}
	pushTable(fields, "easing", easingFields);
	return fields;
}

function createExportFields(draft: WorkbenchThemeOverride): ExportField[] {
	const fields: ExportField[] = [];
	pushTable(fields, "colors", createColorSection(draft));
	pushTable(fields, "breakpoints", createNumberFields(draft.breakpoints, DEFAULT_THEME.breakpoints, THEME_SIZES));
	pushTable(fields, "spacing", createNumberFields(draft.spacing, DEFAULT_THEME.spacing, THEME_SIZES));
	pushTable(fields, "radius", createNumberFields(draft.radius, DEFAULT_THEME.radius, THEME_SIZES));
	pushTable(fields, "fontSizes", createNumberFields(draft.fontSizes, DEFAULT_THEME.fontSizes, THEME_SIZES));
	pushTable(fields, "lineHeights", createNumberFields(draft.lineHeights, DEFAULT_THEME.lineHeights, THEME_SIZES));
	if (draft.fontFamily !== DEFAULT_THEME.fontFamily) {
		fields.push({ key: "fontFamily", value: `Enum.Font.${draft.fontFamily.Name}` });
	}
	pushTable(fields, "shadows", createShadowSection(draft));
	pushTable(fields, "motion", createMotionSection(draft));
	return fields;
}

function renderTable(fields: readonly ExportField[], language: ThemeExportLanguage, depth = 0): string {
	if (fields.size() === 0) {
		return "table.freeze({})";
	}

	const separator = language === "typescript" ? ": " : " = ";
	const lines = ["table.freeze({"];
	for (const field of fields) {
		const prefix = string.rep("\t", depth + 1);
		const key = language === "luau" && field.key === "in" ? '["in"]' : field.key;
		const value = typeIs(field.value, "string") ? field.value : renderTable(field.value, language, depth + 1);
		lines.push(`${prefix}${key}${separator}${value},`);
	}
	lines.push(`${string.rep("\t", depth)}})`);
	return lines.join("\n");
}

function countFields(fields: readonly ExportField[]): number {
	let count = 0;
	for (const field of fields) {
		count += typeIs(field.value, "string") ? 1 : countFields(field.value);
	}
	return count;
}

export function countChangedThemeTokens(draft: WorkbenchThemeOverride): number {
	return countFields(createExportFields(draft));
}

export function serializeWorkbenchThemeOverride(draft: WorkbenchThemeOverride, language: ThemeExportLanguage): string {
	const rendered = renderTable(createExportFields(draft), language);
	if (language === "typescript") {
		return `import type { ThemeOverride } from "@prism/theme";\n\nexport const themeOverride: ThemeOverride = ${rendered};`;
	}

	return `-- ReplicatedStorage/ThemeOverride.lua\nlocal themeOverride = ${rendered}\n\nreturn themeOverride`;
}
