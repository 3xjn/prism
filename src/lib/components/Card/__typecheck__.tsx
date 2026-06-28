import React from "@rbxts/react";
import { theme as themeRefs } from "@prism/theme";

import { Card } from "./Card";
import type { CardProps } from "./types";

const cardRef = React.createRef<Frame>();
type CardRenderer = (props: CardProps) => React.ReactElement;
type ExportedCardProps = React.ComponentProps<typeof Card>;

function renderCard(props: CardProps): React.ReactElement {
	return (Card as CardRenderer)(props);
}

const validCardProps: CardProps[] = [
	{ children: <frame /> },
	{ variant: "surface", children: <frame /> },
	{ variant: "outline", border: 2, children: <frame /> },
	{ variant: "subtle", p: "md", radius: "lg", children: <frame /> },
	{ variant: "surface", cursor: "pointer", children: <frame /> },
	{ variant: "elevated", shadow: "lg", width: 320, minWidth: 240, maxWidth: 420, children: <frame /> },
	{ bg: themeRefs.background.default, borderColor: themeRefs.border.strong, clip: false, children: <frame /> },
	{ position: { x: "50%", y: 0 }, anchor: new Vector2(0.5, 0), layoutOrder: 3, zIndex: 4, children: <frame /> },
	{ slotProps: { root: { BackgroundTransparency: 0.02 } }, children: <frame /> },
	{ slotProps: { content: { BackgroundTransparency: 1 } }, children: <frame /> },
	{ slotProps: { corner: { CornerRadius: new UDim(0, 16) }, stroke: { Thickness: 2 } }, children: <frame /> },
	{ slotProps: { padding: { PaddingLeft: new UDim(0, 20) } }, children: <frame /> },
	{ slotProps: { sizeConstraint: { MinSize: new Vector2(220, 96) } }, children: <frame /> },
	{ slotProps: { shadow: { Position: new UDim2(0, 0, 0, 4) }, shadowStroke: { Thickness: 3 } }, children: <frame /> },
	{ Event: { InputBegan: () => undefined }, Change: { AbsoluteSize: () => undefined }, children: <frame /> },
	{ ref: cardRef, children: <frame /> },
];

const validExportedCardProps: ExportedCardProps[] = [
	{ children: <frame /> },
	{ cursor: "rbxasset://SystemCursors/PointingHand", children: <frame /> },
	{ variant: "outline", width: 280, children: <frame /> },
	{ shadow: "sm", slotProps: { root: { ZIndex: 3 }, content: { ZIndex: 2 } }, children: <frame /> },
];

const validCardExamples = [
	renderCard({ children: <frame /> }),
	renderCard({ variant: "surface", children: <frame /> }),
	renderCard({ variant: "subtle", width: 320, children: <frame /> }),
	renderCard({ variant: "elevated", shadow: "xl", children: <frame /> }),
	renderCard({ slotProps: { content: { Visible: true } }, children: <frame /> }),
	renderCard({ slotProps: { stroke: { Thickness: 2 }, shadowStroke: { Thickness: 4 } }, children: <frame /> }),
	renderCard({ ref: cardRef, children: <frame /> }),
];

const acceptsCardChildren: React.ReactNode = validCardExamples;
const acceptsCardProps: CardProps[] = validCardProps;
const acceptsExportedCardProps: ExportedCardProps[] = validExportedCardProps;

type InvalidCardVariantAllowed = "ghost" extends NonNullable<CardProps["variant"]> ? true : false;
type InvalidCardShadowAllowed = "xxl" extends NonNullable<CardProps["shadow"]> ? true : false;
type CardHasOnPressProp = "onPress" extends keyof CardProps ? true : false;
type ExportedCardChildrenAllowed = React.ReactElement extends NonNullable<ExportedCardProps["children"]> ? true : false;

const invalidCardVariant: InvalidCardVariantAllowed = false;
const invalidCardShadow: InvalidCardShadowAllowed = false;
const cardHasOnPressProp: CardHasOnPressProp = false;
const exportedCardChildren: ExportedCardChildrenAllowed = true;

export {
	acceptsCardChildren,
	acceptsCardProps,
	acceptsExportedCardProps,
	cardHasOnPressProp,
	exportedCardChildren,
	invalidCardShadow,
	invalidCardVariant,
};
