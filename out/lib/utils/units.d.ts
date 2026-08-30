export type SizeValue = number | string | UDim;
export type SizeValue2D = number | string | UDim2 | {
    x: SizeValue;
    y: SizeValue;
};
/**
 * Converts a 1D size input into a `UDim`.
 *
 * @example
 * ```ts
 * toUDim(200); // new UDim(0, 200)
 * toUDim("50%"); // new UDim(0.5, 0)
 * toUDim(new UDim(0.25, 8)); // passthrough
 * ```
 *
 * Edge cases:
 * - Negative numbers and strings are allowed, such as `-8` or `"-25%"`.
 * - Percentages may exceed 100%, such as `"150%"`.
 * - `0` resolves to `new UDim(0, 0)`.
 * - Mixed scale and offset are not inferred; pass a raw `UDim` when both are needed.
 */
export declare function toUDim(value: SizeValue): UDim;
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
export declare function toUDim2(value: SizeValue2D): UDim2;
export declare function toUDimAxis(value: SizeValue, _axis: "x" | "y"): UDim;
