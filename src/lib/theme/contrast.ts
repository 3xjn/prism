function linearizeColorChannel(channel: number): number {
	return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** @internal WCAG relative luminance for an sRGB Roblox color. */
export function getColorRelativeLuminance(color: Color3): number {
	return (
		0.2126 * linearizeColorChannel(color.R) +
		0.7152 * linearizeColorChannel(color.G) +
		0.0722 * linearizeColorChannel(color.B)
	);
}

/** @internal WCAG contrast ratio between two Roblox colors. */
export function getColorContrastRatio(first: Color3, second: Color3): number {
	const firstLuminance = getColorRelativeLuminance(first);
	const secondLuminance = getColorRelativeLuminance(second);
	return (math.max(firstLuminance, secondLuminance) + 0.05) / (math.min(firstLuminance, secondLuminance) + 0.05);
}

/** @internal Chooses the candidate that is most readable behind foreground text. */
export function resolveHigherContrastColor(foreground: Color3, first: Color3, second: Color3): Color3 {
	return getColorContrastRatio(foreground, first) >= getColorContrastRatio(foreground, second) ? first : second;
}

/** @internal Keeps the semantic preference when readable, otherwise uses the stronger fallback. */
export function resolveReadableColor(
	background: Color3,
	preferred: Color3,
	fallback: Color3,
	minimumContrast = 4.5,
): Color3 {
	return getColorContrastRatio(background, preferred) >= minimumContrast
		? preferred
		: resolveHigherContrastColor(background, preferred, fallback);
}
