export function mixColor(from: Color3, to: Color3, alpha: number): Color3 {
	return new Color3(from.R + (to.R - from.R) * alpha, from.G + (to.G - from.G) * alpha, from.B + (to.B - from.B) * alpha);
}
