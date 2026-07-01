import { toUDim, toUDim2, toUDimAxis } from "./units";

function assertCondition(condition: boolean, message: string): void {
	if (!condition) {
		error(message);
	}
}

function assertUDim(actual: UDim, expected: UDim, label: string): void {
	assertCondition(actual.Scale === expected.Scale && actual.Offset === expected.Offset, label);
}

function assertUDim2(actual: UDim2, expected: UDim2, label: string): void {
	assertUDim(actual.X, expected.X, `${label} (x)`);
	assertUDim(actual.Y, expected.Y, `${label} (y)`);
}

function expectThrows(callback: () => void, messagePart: string, label: string): void {
	const [ok, errorMessage] = pcall(callback);
	assertCondition(!ok, `${label}: expected function to throw`);
	assertCondition(
		typeIs(errorMessage, "string") && string.find(errorMessage, messagePart, 1, true) !== undefined,
		`${label}: unexpected error message`,
	);
}

function runUnitAssertions(): void {
	const passthrough1D = new UDim(0.3, 5);
	const passthrough2D = new UDim2(0.25, 8, 0.75, 16);

	assertUDim(toUDim(200), new UDim(0, 200), "toUDim converts numbers to pixels");
	assertUDim(toUDim("50%"), new UDim(0.5, 0), "toUDim converts percent strings to scale");
	assertUDim(toUDim("150%"), new UDim(1.5, 0), "toUDim supports percentages above 100%");
	expectThrows(() => toUDim("10px"), "Invalid SizeValue", "toUDim rejects px strings like toUDim2");
	assertUDim(toUDim(-8), new UDim(0, -8), "toUDim allows negative numbers");
	assertUDim(toUDimAxis("-25%", "y"), new UDim(-0.25, 0), "toUDimAxis follows toUDim rules");
	assertCondition(toUDim(passthrough1D) === passthrough1D, "toUDim passes UDim through unchanged");

	assertUDim2(toUDim2(100), UDim2.fromOffset(100, 100), "toUDim2 converts numbers to square offsets");
	assertUDim2(toUDim2("50%"), UDim2.fromScale(0.5, 0.5), "toUDim2 converts percent strings to scale");
	assertUDim2(
		toUDim2({ x: 100, y: "50%" }),
		new UDim2(new UDim(0, 100), new UDim(0.5, 0)),
		"toUDim2 converts x/y objects",
	);
	assertCondition(toUDim2(passthrough2D) === passthrough2D, "toUDim2 passes UDim2 through unchanged");

	expectThrows(() => toUDim("invalid"), "Invalid SizeValue", "toUDim rejects invalid strings");
	expectThrows(() => toUDim("not a size"), "Invalid SizeValue", "toUDim surfaces clear errors");
	expectThrows(() => toUDim2("10px"), "Invalid SizeValue2D", "toUDim2 rejects unsupported strings");

	print("units: PASS");
}

runUnitAssertions();
