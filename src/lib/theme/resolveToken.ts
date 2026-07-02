import type {
	ActionColorRole,
	BackgroundColorRole,
	BorderColorRole,
	ColorName,
	ColorShade,
	ConcreteColorValue,
	SemanticIntent,
	SemanticIntentRole,
	TextColorRole,
	Theme,
} from "./types";

function isColorName(value: string): value is ColorName {
	switch (value) {
		case "gray":
		case "primary":
		case "red":
		case "green":
		case "yellow":
		case "blue":
			return true;
		default:
			return false;
	}
}

function isColorShade(value: string): value is ColorShade {
	switch (value) {
		case "0":
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			return true;
		default:
			return false;
	}
}

function isSemanticIntent(value: string): value is SemanticIntent {
	switch (value) {
		case "primary":
		case "secondary":
		case "error":
		case "warning":
		case "info":
		case "success":
			return true;
		default:
			return false;
	}
}

function isSemanticIntentRole(value: string): value is SemanticIntentRole {
	switch (value) {
		case "main":
		case "light":
		case "dark":
		case "contrast":
			return true;
		default:
			return false;
	}
}

function isTextColorRole(value: string): value is TextColorRole {
	switch (value) {
		case "primary":
		case "secondary":
		case "disabled":
		case "inverse":
			return true;
		default:
			return false;
	}
}

function isBackgroundColorRole(value: string): value is BackgroundColorRole {
	switch (value) {
		case "default":
		case "surface":
			return true;
		default:
			return false;
	}
}

function isBorderColorRole(value: string): value is BorderColorRole {
	switch (value) {
		case "subtle":
		case "default":
		case "strong":
			return true;
		default:
			return false;
	}
}

function isActionColorRole(value: string): value is ActionColorRole {
	switch (value) {
		case "hover":
		case "pressed":
		case "disabled":
		case "disabledBackground":
			return true;
		default:
			return false;
	}
}

function resolvePaletteColor(theme: Theme, colorName: string, shade: string, token: string): Color3 {
	if (!isColorName(colorName)) {
		throw `[prism/theme] Unknown palette color family "${colorName}" in token "${token}".`;
	}

	if (!isColorShade(shade)) {
		throw `[prism/theme] Unknown color shade "${shade}" in token "${token}".`;
	}

	return theme.colors.palette[colorName][shade];
}

function resolveColorToken(theme: Theme, value: string): Color3 {
	if (isSemanticIntent(value)) {
		return theme.colors[value].main;
	}

	const parts = value.split(".");
	const first = parts[0];
	const second = parts[1];
	const third = parts[2];

	if (parts.size() === 3) {
		if (first !== "palette" || second === undefined || third === undefined) {
			throw `[prism/theme] Invalid color token \"${value}\". Expected semantic tokens like \"primary.main\" or palette tokens like \"palette.primary.5\".`;
		}

		return resolvePaletteColor(theme, second, third, value);
	}

	if (parts.size() !== 2 || first === undefined || second === undefined) {
		throw `[prism/theme] Invalid color token \"${value}\". Expected semantic tokens like \"primary.main\" or palette tokens like \"palette.primary.5\".`;
	}

	if (isSemanticIntent(first)) {
		if (!isSemanticIntentRole(second)) {
			throw `[prism/theme] Unknown semantic role "${second}" in token "${value}".`;
		}

		return theme.colors[first][second];
	}

	if (first === "text") {
		if (!isTextColorRole(second)) {
			throw `[prism/theme] Unknown text color role "${second}" in token "${value}".`;
		}

		return theme.colors.text[second];
	}

	if (first === "background") {
		if (!isBackgroundColorRole(second)) {
			throw `[prism/theme] Unknown background color role "${second}" in token "${value}".`;
		}

		return theme.colors.background[second];
	}

	if (first === "border") {
		if (!isBorderColorRole(second)) {
			throw `[prism/theme] Unknown border color role "${second}" in token "${value}".`;
		}

		return theme.colors.border[second];
	}

	if (first === "action") {
		if (!isActionColorRole(second)) {
			throw `[prism/theme] Unknown action color role "${second}" in token "${value}".`;
		}

		return theme.colors.action[second];
	}

	return resolvePaletteColor(theme, first, second, value);
}

export function resolveColor(theme: Theme, value: ConcreteColorValue): Color3 {
	// Untyped (Luau) callers can pass anything; validate at runtime and
	// reject bad shapes with the designed invalid-token message instead
	// of an internal string.split error.
	const runtimeValue = value as unknown;

	if (typeIs(runtimeValue, "Color3")) {
		return runtimeValue;
	}

	if (typeIs(runtimeValue, "table")) {
		const token = (runtimeValue as { token?: unknown }).token;
		if (typeIs(token, "string")) {
			return resolveColorToken(theme, token);
		}
	}

	if (typeIs(runtimeValue, "string")) {
		return resolveColorToken(theme, runtimeValue);
	}

	throw `[prism/theme] Invalid color value ${tostring(runtimeValue)}. Expected a Color3, an exported theme ref like theme.text.primary, or a color token string.`;
}

export function resolveSize(
	theme: Theme,
	key: keyof Theme["spacing"],
	scale: "spacing" | "radius" | "fontSizes",
): number {
	switch (scale) {
		case "spacing":
			return theme.spacing[key];
		case "radius":
			return theme.radius[key];
		case "fontSizes":
			return theme.fontSizes[key];
	}
}
