import { toUDim, toUDim2, toUDimAxis } from "./units";

describe("units", () => {
	it("converts numbers to pixel UDims", () => {
		const actual = toUDim(200);
		expect(actual.Scale).toBe(0);
		expect(actual.Offset).toBe(200);
	});

	it("converts percent strings to scale UDims", () => {
		const actual = toUDim("50%");
		expect(actual.Scale).toBe(0.5);
		expect(actual.Offset).toBe(0);
	});

	it("supports percentages above 100%", () => {
		const actual = toUDim("150%");
		expect(actual.Scale).toBe(1.5);
		expect(actual.Offset).toBe(0);
	});

	it("rejects px strings like toUDim2", () => {
		expect(() => toUDim("10px")).toThrow();
	});

	it("allows negative numbers", () => {
		const actual = toUDim(-8);
		expect(actual.Scale).toBe(0);
		expect(actual.Offset).toBe(-8);
	});

	it("follows toUDim rules on toUDimAxis", () => {
		const actual = toUDimAxis("-25%", "y");
		expect(actual.Scale).toBe(-0.25);
		expect(actual.Offset).toBe(0);
	});

	it("passes UDim through unchanged", () => {
		const passthrough = new UDim(0.3, 5);
		expect(toUDim(passthrough)).toBe(passthrough);
	});

	it("converts numbers to square offset UDim2s", () => {
		const actual = toUDim2(100);
		expect(actual.X.Scale).toBe(0);
		expect(actual.X.Offset).toBe(100);
		expect(actual.Y.Scale).toBe(0);
		expect(actual.Y.Offset).toBe(100);
	});

	it("converts percent strings to scale UDim2s", () => {
		const actual = toUDim2("50%");
		expect(actual.X.Scale).toBe(0.5);
		expect(actual.X.Offset).toBe(0);
		expect(actual.Y.Scale).toBe(0.5);
		expect(actual.Y.Offset).toBe(0);
	});

	it("converts x/y objects", () => {
		const actual = toUDim2({ x: 100, y: "50%" });
		expect(actual.X.Scale).toBe(0);
		expect(actual.X.Offset).toBe(100);
		expect(actual.Y.Scale).toBe(0.5);
		expect(actual.Y.Offset).toBe(0);
	});

	it("passes UDim2 through unchanged", () => {
		const passthrough = new UDim2(0.25, 8, 0.75, 16);
		expect(toUDim2(passthrough)).toBe(passthrough);
	});

	it("rejects invalid SizeValue strings", () => {
		expect(() => toUDim("invalid")).toThrow();
		expect(() => toUDim("not a size")).toThrow();
	});

	it("rejects unsupported SizeValue2D strings", () => {
		expect(() => toUDim2("10px")).toThrow();
	});
});
