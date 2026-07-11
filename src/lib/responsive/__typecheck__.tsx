import React from "@rbxts/react";
import type { AssertFalse, AssertTrue, IsAssignable } from "@prism/testing/typeContracts";
import type { Breakpoint, ThemeOverride } from "@prism/theme";

import { useBreakpoint, usePreferredInput, useResponsiveValue } from ".";
import type { ResponsiveTargetOptions, ResponsiveValue } from ".";

type MissingXsAllowed = IsAssignable<{ readonly sm: number }, ResponsiveValue<number>>;
type NumberResponsiveValueAllowed = IsAssignable<{ readonly xs: number; readonly md: number }, ResponsiveValue<number>>;
type FrameTargetAllowed = IsAssignable<{ readonly target: Frame }, ResponsiveTargetOptions>;
type FolderTargetAllowed = IsAssignable<{ readonly target: Folder }, ResponsiveTargetOptions>;
type BreakpointOverrideAllowed = IsAssignable<
	{ readonly breakpoints: { readonly sm: number; readonly xl: number } },
	ThemeOverride
>;

const missingXsAllowed: AssertFalse<MissingXsAllowed> = false;
const numberResponsiveValueAllowed: AssertTrue<NumberResponsiveValueAllowed> = true;
const frameTargetAllowed: AssertTrue<FrameTargetAllowed> = true;
const folderTargetAllowed: AssertFalse<FolderTargetAllowed> = false;
const breakpointOverrideAllowed: AssertTrue<BreakpointOverrideAllowed> = true;

function ResponsiveTypeContract({ target }: { readonly target: Frame }): React.ReactElement {
	const breakpoint: Breakpoint = useBreakpoint({ target });
	const columns: number = useResponsiveValue({ xs: 2, sm: 4, lg: 8 }, { target });
	const direction: "vertical" | "horizontal" = useResponsiveValue<"vertical" | "horizontal">(
		{ xs: "vertical", md: "horizontal" },
		{ target },
	);
	const preferredInput: Enum.PreferredInput = usePreferredInput();

	return (
		<frame
			LayoutOrder={columns}
			Visible={breakpoint !== "xs" || preferredInput === Enum.PreferredInput.Gamepad}
			AutomaticSize={direction === "vertical" ? Enum.AutomaticSize.Y : Enum.AutomaticSize.X}
		/>
	);
}

export {
	breakpointOverrideAllowed,
	folderTargetAllowed,
	frameTargetAllowed,
	missingXsAllowed,
	numberResponsiveValueAllowed,
	ResponsiveTypeContract,
};
