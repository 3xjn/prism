import React from "@rbxts/react";

/**
 * Creates a preset component with a shallow prop merge where caller props win.
 *
 * A caller-passed `styleOverrides` prop replaces the preset's `styleOverrides`; callbacks are not chained or merged.
 * `ref` flows through only because Prism components declare `ref` in their props.
 */
export function styled<P extends object>(Component: (props: P) => React.ReactElement) {
	return (preset: Partial<P>): ((props: P) => React.ReactElement) => {
		return (props: P) => <Component {...preset} {...props} />;
	};
}
