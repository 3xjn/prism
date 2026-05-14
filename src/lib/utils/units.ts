export type SizeValue = number | string | UDim;

export type SizeValue2D = number | string | UDim2 | { x: SizeValue; y: SizeValue };

function parsePixelString(value: string): number | undefined {
	if (string.sub(value, -2) !== "px") {
		return undefined;
	}

	const numeric = string.sub(value, 1, -3);

	if (!isSignedIntegerString(numeric)) {
		return undefined;
	}

	return tonumber(numeric)!;
}

function parsePercentString(value: string): number | undefined {
	if (string.sub(value, -1) !== "%") {
		return undefined;
	}

	const numeric = string.sub(value, 1, -2);

	if (!isSignedIntegerString(numeric) && !isSignedDecimalString(numeric)) {
		return undefined;
	}

	return tonumber(numeric)! / 100;
}

function isDigit(character: string): boolean {
	const [code] = string.byte(character);
	const [zero] = string.byte("0");
	const [nine] = string.byte("9");

	return code !== undefined && code >= zero! && code <= nine!;
}

function isUnsignedIntegerString(value: string): boolean {
	if (string.sub(value, 1, 1) === "") {
		return false;
	}

	for (let index = 1; ; index++) {
		const character = string.sub(value, index, index);

		if (character === "") {
			break;
		}

		if (!isDigit(character)) {
			return false;
		}
	}

	return true;
}

function stripLeadingMinus(value: string): string {
	if (string.sub(value, 1, 1) === "-") {
		return string.sub(value, 2);
	}

	return value;
}

function isSignedIntegerString(value: string): boolean {
	return isUnsignedIntegerString(stripLeadingMinus(value));
}

function isSignedDecimalString(value: string): boolean {
	const normalized = stripLeadingMinus(value);
	const [dotIndex] = string.find(normalized, ".", 1, true);

	if (dotIndex === undefined) {
		return false;
	}

	const [nextDotIndex] = string.find(normalized, ".", dotIndex + 1, true);

	if (nextDotIndex !== undefined) {
		return false;
	}

	const whole = string.sub(normalized, 1, dotIndex - 1);
	const fraction = string.sub(normalized, dotIndex + 1);

	return isUnsignedIntegerString(whole) && isUnsignedIntegerString(fraction);
}

function isSizeValue2DObject(value: SizeValue2D): value is { x: SizeValue; y: SizeValue } {
	return typeIs(value, "table") && rawget(value, "x") !== undefined && rawget(value, "y") !== undefined;
}

/**
 * Converts a 1D size input into a `UDim`.
 *
 * @example
 * ```ts
 * toUDim(200); // new UDim(0, 200)
 * toUDim("50%"); // new UDim(0.5, 0)
 * toUDim("10px"); // new UDim(0, 10)
 * toUDim(new UDim(0.25, 8)); // passthrough
 * ```
 *
 * Edge cases:
 * - Negative numbers and strings are allowed, such as `-8` or `"-25%"`.
 * - Percentages may exceed 100%, such as `"150%"`.
 * - `0` resolves to `new UDim(0, 0)`.
 * - Mixed scale and offset are not inferred; pass a raw `UDim` when both are needed.
 */
export function toUDim(value: SizeValue): UDim {
	if (typeIs(value, "number")) {
		return new UDim(0, value);
	}

	if (typeIs(value, "string")) {
		const percent = parsePercentString(value);

		if (percent !== undefined) {
			return new UDim(percent, 0);
		}

		const pixels = parsePixelString(value);

		if (pixels !== undefined) {
			return new UDim(0, pixels);
		}

		throw `Invalid SizeValue: ${value}`;
	}

	if (typeIs(value, "UDim")) {
		return value;
	}

	throw `Invalid SizeValue: ${tostring(value)}`;
}

/**
 * Converts a 2D size input into a `UDim2`.
 *
 * @example
 * ```ts
 * toUDim2(100); // UDim2.fromOffset(100, 100)
 * toUDim2("50%"); // UDim2.fromScale(0.5, 0.5)
 * toUDim2({ x: 100, y: "50%" }); // new UDim2(new UDim(0, 100), new UDim(0.5, 0))
 * toUDim2(new UDim2(0.25, 8, 0, 16)); // passthrough
 * ```
 *
 * Edge cases:
 * - Negative numbers and strings are allowed.
 * - Percentages may exceed 100%.
 * - `0` resolves to `UDim2.fromOffset(0, 0)`.
 * - Mixed scale and offset are not inferred; pass a raw `UDim2` when both axes need both values.
 */
export function toUDim2(value: SizeValue2D): UDim2 {
	if (typeIs(value, "number")) {
		return UDim2.fromOffset(value, value);
	}

	if (typeIs(value, "string")) {
		const percent = parsePercentString(value);

		if (percent !== undefined) {
			return UDim2.fromScale(percent, percent);
		}

		throw `Invalid SizeValue2D: ${value}`;
	}

	if (typeIs(value, "UDim2")) {
		return value;
	}

	if (isSizeValue2DObject(value)) {
		return new UDim2(toUDimAxis(value.x, "x"), toUDimAxis(value.y, "y"));
	}

	throw `Invalid SizeValue2D: ${tostring(value)}`;
}

export function toUDimAxis(value: SizeValue, _axis: "x" | "y"): UDim {
	return toUDim(value);
}
