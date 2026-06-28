import React from "@rbxts/react";

import { useMotion } from "@prism/motion";
import { theme as themeRefs, useTheme } from "@prism/theme";
import type { AssertFalse, AssertTrue, IsAssignable } from "@prism/testing/typeContracts";

import type { MotionDuration, MotionInputValue, MotionTransition, MotionValue } from "@prism/motion";

const defaultTransition: MotionTransition = {
	duration: "normal",
	easing: "standard",
};

function PerKeyMotionExample() {
	const theme = useTheme();
	const animated = useMotion({
		values: {
			scale: 1,
			bg: themeRefs.primary.main,
		},
		transition: {
			scale: { duration: "fast", easing: "out" },
			bg: { duration: 0.24, easing: theme.motion.easing.inOut },
		},
	});

	const scaleValue: number = animated.scale;
	const backgroundValue: Color3 = animated.bg;

	return (
		<frame BackgroundColor3={backgroundValue}>
			<uiscale Scale={scaleValue} />
		</frame>
	);
}

function SharedMotionExample() {
	const theme = useTheme();
	const animated = useMotion({
		values: {
			opacity: 0.15,
			accent: themeRefs.text.inverse,
		},
		transition: defaultTransition,
	});

	const opacityValue: number = animated.opacity;
	const accentValue: Color3 = animated.accent;

	return <frame BackgroundTransparency={opacityValue} BackgroundColor3={accentValue} />;
}

function InlineMotionExample(props: { readonly pressed: boolean }) {
	const animated = useMotion({
		values: {
			scale: props.pressed ? 0.97 : 1,
		},
		transition: {
			duration: "fast",
		},
	});

	const scaleValue: number = animated.scale;

	return (
		<frame>
			<uiscale Scale={scaleValue} />
		</frame>
	);
}

const validMotionExamples: React.ReactNode = [
	<PerKeyMotionExample key="per-key" />,
	<SharedMotionExample key="shared" />,
	<InlineMotionExample key="inline" pressed={false} />,
];

type InvalidDurationAllowed = AssertFalse<IsAssignable<"snappy", MotionDuration>>;
type ColorTokenAccepted = AssertFalse<IsAssignable<"primary.main", MotionInputValue>>;
type ThemeColorRefAccepted = AssertTrue<IsAssignable<typeof themeRefs.text.secondary, MotionInputValue>>;
type InvalidMotionValueAllowed = AssertFalse<IsAssignable<string, MotionValue>>;

const colorTokenAccepted: ColorTokenAccepted = false;
const themeColorRefAccepted: ThemeColorRefAccepted = true;
const invalidDuration: InvalidDurationAllowed = false;
const invalidMotionValue: InvalidMotionValueAllowed = false;

export { colorTokenAccepted, invalidDuration, invalidMotionValue, themeColorRefAccepted, validMotionExamples };
