export interface HsvColor {
	readonly hue: number;
	readonly saturation: number;
	readonly value: number;
}

export interface ColorPickerBounds {
	readonly position: Vector2;
	readonly size: Vector2;
}

export type ColorControllerDirection = -1 | 1;
export type ColorFieldControllerChannel = "saturation" | "value";

export interface ColorFieldControllerStep {
	readonly channel: ColorFieldControllerChannel;
	readonly direction: ColorControllerDirection;
}

export function resolveColorFieldControllerStep(keyCodeName: string): ColorFieldControllerStep | undefined {
	switch (keyCodeName) {
		case "Left":
		case "DPadLeft":
			return { channel: "saturation", direction: -1 };
		case "Right":
		case "DPadRight":
			return { channel: "saturation", direction: 1 };
		case "ButtonL1":
			return { channel: "value", direction: -1 };
		case "ButtonR1":
			return { channel: "value", direction: 1 };
		default:
			return undefined;
	}
}

export function resolveColorHueControllerStep(keyCodeName: string): ColorControllerDirection | undefined {
	switch (keyCodeName) {
		case "Left":
		case "DPadLeft":
			return -1;
		case "Right":
		case "DPadRight":
			return 1;
		default:
			return undefined;
	}
}

export function resolvePrecisionCommitColor(candidate: Color3, resolvedValue: Color3, controlled: boolean): Color3 {
	return controlled ? resolvedValue : candidate;
}

function isFiniteNumber(value: number | undefined): value is number {
	return value !== undefined && value === value && value > -math.huge && value < math.huge;
}

function isWhitespace(character: string): boolean {
	return character === " " || character === "\t" || character === "\n" || character === "\r";
}

function trimWhitespace(value: string): string {
	let first = 1;
	let last = value.size();

	while (first <= last && isWhitespace(string.sub(value, first, first))) {
		first += 1;
	}
	while (last >= first && isWhitespace(string.sub(value, last, last))) {
		last -= 1;
	}

	return first > last ? "" : string.sub(value, first, last);
}

function isHexCharacter(character: string): boolean {
	const upper = string.upper(character);
	return (
		tonumber(character) !== undefined ||
		upper === "A" ||
		upper === "B" ||
		upper === "C" ||
		upper === "D" ||
		upper === "E" ||
		upper === "F"
	);
}

function normalizeHexBody(value: string): string | undefined {
	const trimmed = trimWhitespace(value);
	const body = string.sub(trimmed, 1, 1) === "#" ? string.sub(trimmed, 2) : trimmed;
	if (body.size() !== 3 && body.size() !== 6) {
		return undefined;
	}

	for (let index = 1; index <= body.size(); index += 1) {
		if (!isHexCharacter(string.sub(body, index, index))) {
			return undefined;
		}
	}

	if (body.size() === 3) {
		return string.upper(
			string.sub(body, 1, 1) +
				string.sub(body, 1, 1) +
				string.sub(body, 2, 2) +
				string.sub(body, 2, 2) +
				string.sub(body, 3, 3) +
				string.sub(body, 3, 3),
		);
	}

	return string.upper(body);
}

function resolveColorChannel(channel: number): number {
	return math.clamp(math.round(channel * 255), 0, 255);
}

export function colorsEqual(left: Color3, right: Color3, epsilon = 1 / 510): boolean {
	return (
		math.abs(left.R - right.R) <= epsilon &&
		math.abs(left.G - right.G) <= epsilon &&
		math.abs(left.B - right.B) <= epsilon
	);
}

export function color3ToHsv(color: Color3): HsvColor {
	const [hue, saturation, value] = color.ToHSV();
	return {
		hue: math.clamp(hue, 0, 1),
		saturation: math.clamp(saturation, 0, 1),
		value: math.clamp(value, 0, 1),
	};
}

export function hsvToColor3(hsv: HsvColor): Color3 {
	return Color3.fromHSV(math.clamp(hsv.hue, 0, 1), math.clamp(hsv.saturation, 0, 1), math.clamp(hsv.value, 0, 1));
}

export function formatHexColor(color: Color3): string {
	return string.format(
		"#%02X%02X%02X",
		resolveColorChannel(color.R),
		resolveColorChannel(color.G),
		resolveColorChannel(color.B),
	);
}

export function parseHexColor(value: string): Color3 | undefined {
	const body = normalizeHexBody(value);
	if (body === undefined) {
		return undefined;
	}

	const red = tonumber(string.sub(body, 1, 2), 16);
	const green = tonumber(string.sub(body, 3, 4), 16);
	const blue = tonumber(string.sub(body, 5, 6), 16);
	if (red === undefined || green === undefined || blue === undefined) {
		return undefined;
	}

	return Color3.fromRGB(red, green, blue);
}

export function formatRgbColor(color: Color3): string {
	return `${resolveColorChannel(color.R)}, ${resolveColorChannel(color.G)}, ${resolveColorChannel(color.B)}`;
}

export function parseRgbColor(value: string): Color3 | undefined {
	const trimmed = trimWhitespace(value);
	const lower = string.lower(trimmed);
	const body =
		string.sub(lower, 1, 4) === "rgb(" && string.sub(trimmed, -1) === ")" ? string.sub(trimmed, 5, -2) : trimmed;
	const channels = body.split(",");
	if (channels.size() !== 3) {
		return undefined;
	}

	const red = tonumber(trimWhitespace(channels[0]));
	const green = tonumber(trimWhitespace(channels[1]));
	const blue = tonumber(trimWhitespace(channels[2]));
	if (
		!isFiniteNumber(red) ||
		!isFiniteNumber(green) ||
		!isFiniteNumber(blue) ||
		red < 0 ||
		red > 255 ||
		green < 0 ||
		green > 255 ||
		blue < 0 ||
		blue > 255
	) {
		return undefined;
	}

	return Color3.fromRGB(math.round(red), math.round(green), math.round(blue));
}

export function resolveSaturationValueFromPoint(bounds: ColorPickerBounds, point: Vector2): HsvColor {
	const width = bounds.size.X;
	const height = bounds.size.Y;
	const saturation = width > 0 ? math.clamp((point.X - bounds.position.X) / width, 0, 1) : 0;
	const value = height > 0 ? 1 - math.clamp((point.Y - bounds.position.Y) / height, 0, 1) : 1;
	return { hue: 0, saturation, value };
}

export function resolveHueFromPoint(bounds: ColorPickerBounds, point: Vector2): number {
	return bounds.size.X > 0 ? math.clamp((point.X - bounds.position.X) / bounds.size.X, 0, 1) : 0;
}
